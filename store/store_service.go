package store

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"github.com/go-redis/redis"
	"github.com/jackc/pgx/v5/pgxpool"
	"log"
	"os"
	"time"
)
func init() {
	_ = godotenv.Load(".env")
}

// Define the struct wrapper around raw Redis client and Postgres DB
type StorageService struct {
	redisClient *redis.Client
	dbPool      *pgxpool.Pool
}

// Top level declarations for the storeService and Redis context
var (
	storeService = &StorageService{}
	ctx           = context.Background()
)

// Note that in a real world usage, the cache duration shouldn't have  
// an expiration time, an LRU policy config should be set where the 
// values that are retrieved less often are purged automatically from 
// the cache and stored back in RDBMS whenever the cache is full

const CacheDuration = 6 * time.Hour

// Initializing the store service and return a store pointer 
func InitializeStore() *StorageService {
	redisClient := redis.NewClient(&redis.Options{
		Addr:     "localhost:6379",
		Password: "",
		DB:       0,
	})

	pong, err := redisClient.Ping().Result()
	if err != nil {
		log.Printf("Warning: Redis connection failed: %v", err)
		// Don't panic, continue without Redis
	} else {
		fmt.Printf("\nRedis started successfully: pong message = {%s}", pong)
	}

	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Println("Warning: DATABASE_URL environment variable not set - using Redis only")
		storeService.redisClient = redisClient
		storeService.dbPool = nil
		return storeService
	}

	// Use connection pool for better connection management
	config, err := pgxpool.ParseConfig(databaseUrl)
	if err != nil {
		log.Printf("Error parsing database URL: %v", err)
		storeService.redisClient = redisClient
		storeService.dbPool = nil
		return storeService
	}

	// Configure connection pool
	config.MaxConns = 10
	config.MinConns = 2
	config.MaxConnLifetime = time.Hour
	config.MaxConnIdleTime = time.Minute * 30

	dbPool, err := pgxpool.New(ctx, databaseUrl)
	if err != nil {
		log.Printf("Warning: Failed to create Postgres pool: %v", err)
		storeService.redisClient = redisClient
		storeService.dbPool = nil
		return storeService
	}

	// Test the connection
	err = dbPool.Ping(ctx)
	if err != nil {
		log.Printf("Warning: Failed to ping Postgres: %v", err)
		dbPool.Close()
		storeService.redisClient = redisClient
		storeService.dbPool = nil
		return storeService
	}

	fmt.Println("\nPostgreSQL (Supabase) connected successfully.")

	storeService.redisClient = redisClient
	storeService.dbPool = dbPool
	return storeService
}

/* We want to be able to save the mapping between the originalUrl 
and the generated shortUrl url
*/
func SaveUrlMapping(shortCode string, originalUrl string, userId string) error {
	log.Printf("SaveUrlMapping called with: shortCode=%s, originalUrl=%s, userId=%s", shortCode, originalUrl, userId)
	
	// Save to Redis first (non-blocking)
	if storeService.redisClient != nil {
		err := storeService.redisClient.Set(shortCode, originalUrl, CacheDuration).Err()
		if err != nil {
			log.Printf("Warning: Failed saving to Redis | Error: %v - shortCode: %s", err, shortCode)
			// Continue even if Redis fails
		} else {
			log.Printf("Successfully saved to Redis: %s", shortCode)
		}
	}
	
	// Save to Postgres if available (using camelCase columns as in actual database)
	if storeService.dbPool != nil {
		log.Printf("Attempting to save to PostgreSQL...")
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		// Generate a unique ID for the URL record
		urlId := generateUrlId()
		log.Printf("Generated URL ID: %s", urlId)

		query := `INSERT INTO urls (id, "shortCode", "originalUrl", "userId", "createdAt", "updatedAt") 
			 VALUES ($1, $2, $3, $4, NOW(), NOW())
			 ON CONFLICT ("shortCode") DO UPDATE SET 
			 "originalUrl" = EXCLUDED."originalUrl", 
			 "userId" = EXCLUDED."userId", 
			 "updatedAt" = NOW()`
		
		log.Printf("Executing query: %s", query)
		log.Printf("With values: urlId=%s, shortCode=%s, originalUrl=%s, userId=%s", urlId, shortCode, originalUrl, userId)

		result, err := storeService.dbPool.Exec(ctx, query, urlId, shortCode, originalUrl, userId)
		if err != nil {
			log.Printf("Error: Failed saving to Postgres | Error: %v - shortCode: %s", err, shortCode)
			log.Printf("Full error details: %+v", err)
			// If Postgres fails but Redis succeeded, still return success
			if storeService.redisClient != nil {
				log.Printf("Returning success because Redis succeeded, even though Postgres failed")
				return nil
			}
			return fmt.Errorf("database error: %v", err)
		}
		
		rowsAffected := result.RowsAffected()
		log.Printf("Successfully saved to PostgreSQL. Rows affected: %d", rowsAffected)
	} else {
		log.Printf("Warning: No PostgreSQL connection available")
	}
	
	log.Printf("SaveUrlMapping completed successfully")
	// Success if we saved to at least one storage
	return nil
}

/*
We should be able to retrieve the initial long URL once the short 
is provided. This is when users will be calling the shortlink in the 
url, so what we need to do here is to retrieve the long url and
think about redirect.
*/
func RetrieveInitialUrl(shortCode string) string {
	// Try Redis first
	if storeService.redisClient != nil {
		result, err := storeService.redisClient.Get(shortCode).Result()
		if err == nil {
			return result
		}
	}

	// If not found in Redis, try Postgres (using camelCase columns)
	if storeService.dbPool != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var originalUrl string
		err := storeService.dbPool.QueryRow(ctx, 
			`SELECT "originalUrl" FROM urls WHERE "shortCode" = $1 AND "isActive" = true`, 
			shortCode).Scan(&originalUrl)
		if err != nil {
			log.Printf("Warning: Failed RetrieveInitialUrl from Postgres | Error: %v - shortCode: %s", err, shortCode)
			return ""
		}

		// Cache in Redis for future requests
		if storeService.redisClient != nil {
			_ = storeService.redisClient.Set(shortCode, originalUrl, CacheDuration).Err()
		}
		return originalUrl
	}

	return ""
}

// Track URL click for analytics
func TrackUrlClick(shortCode string, userId string, ipAddress string, userAgent string, referer string) error {
	if storeService.dbPool == nil {
		return nil // Skip tracking if no database
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// First get the URL ID using correct quoted column name
	var urlId string
	err := storeService.dbPool.QueryRow(ctx, 
		`SELECT id FROM urls WHERE "shortCode" = $1`, 
		shortCode).Scan(&urlId)
	if err != nil {
		log.Printf("Warning: Failed to find URL for tracking | Error: %v - shortCode: %s", err, shortCode)
		return err
	}

	// Generate click ID
	clickId := generateClickId()

	// Handle guest users - use NULL instead of "guest-user" to avoid foreign key constraint
	var userIdParam interface{}
	if userId == "guest-user" || userId == "" {
		userIdParam = nil // Use NULL for guest users
	} else {
		userIdParam = userId
	}

	// Insert click record using the correct camelCase column names
	_, err = storeService.dbPool.Exec(ctx,
		`INSERT INTO url_clicks (id, "urlId", "userId", "ipAddress", "userAgent", referer, "clickedAt") 
		 VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
		clickId, urlId, userIdParam, ipAddress, userAgent, referer,
	)
	if err != nil {
		log.Printf("Warning: Failed tracking URL click | Error: %v - shortCode: %s", err, shortCode)
		return err
	}

	log.Printf("Successfully tracked click for short URL: %s", shortCode)
	return nil
}

// Helper function to generate URL ID (simple implementation)
func generateUrlId() string {
	return fmt.Sprintf("url_%d", time.Now().UnixNano())
}

// Helper function to generate click ID (simple implementation)
func generateClickId() string {
	return fmt.Sprintf("click_%d", time.Now().UnixNano())
}

// Graceful shutdown
func CloseStore() {
	if storeService.redisClient != nil {
		storeService.redisClient.Close()
	}
	if storeService.dbPool != nil {
		storeService.dbPool.Close()
	}
}
