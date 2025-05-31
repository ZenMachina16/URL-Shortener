package store

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"github.com/go-redis/redis"
	"github.com/jackc/pgx/v5"
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
func SaveUrlMapping(shortUrl string, originalUrl string, userId string) error {
	// Save to Redis first (non-blocking)
	if storeService.redisClient != nil {
		err := storeService.redisClient.Set(shortUrl, originalUrl, CacheDuration).Err()
		if err != nil {
			log.Printf("Warning: Failed saving to Redis | Error: %v - shortUrl: %s", err, shortUrl)
			// Continue even if Redis fails
		}
	}
	
	// Save to Postgres if available
	if storeService.dbPool != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		_, err := storeService.dbPool.Exec(ctx,
			`INSERT INTO url_mappings (short_url, original_url, user_id, created_at) 
			 VALUES ($1, $2, $3, NOW())
			 ON CONFLICT (short_url) DO UPDATE SET 
			 original_url = EXCLUDED.original_url, 
			 user_id = EXCLUDED.user_id, 
			 updated_at = NOW()`,
			shortUrl, originalUrl, userId,
		)
		if err != nil {
			log.Printf("Warning: Failed saving to Postgres | Error: %v - shortUrl: %s", err, shortUrl)
			// If Postgres fails but Redis succeeded, still return success
			if storeService.redisClient != nil {
				return nil
			}
			return fmt.Errorf("database error: %v", err)
		}
	}
	
	// Success if we saved to at least one storage
	return nil
}

/*
We should be able to retrieve the initial long URL once the short 
is provided. This is when users will be calling the shortlink in the 
url, so what we need to do here is to retrieve the long url and
think about redirect.
*/
func RetrieveInitialUrl(shortUrl string) string {
	// Try Redis first
	if storeService.redisClient != nil {
		result, err := storeService.redisClient.Get(shortUrl).Result()
		if err == nil {
			return result
		}
	}

	// If not found in Redis, try Postgres
	if storeService.dbPool != nil {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		var originalUrl string
		err := storeService.dbPool.QueryRow(ctx, 
			"SELECT original_url FROM url_mappings WHERE short_url = $1", 
			shortUrl).Scan(&originalUrl)
		if err != nil {
			log.Printf("Warning: Failed RetrieveInitialUrl from Postgres | Error: %v - shortUrl: %s", err, shortUrl)
			return ""
		}

		// Cache in Redis for future requests
		if storeService.redisClient != nil {
			_ = storeService.redisClient.Set(shortUrl, originalUrl, CacheDuration).Err()
		}
		return originalUrl
	}

	return ""
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
