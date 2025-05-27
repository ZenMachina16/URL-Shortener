package store

import (
	"context"
	"fmt"
	"github.com/joho/godotenv"
	"github.com/go-redis/redis"
	"github.com/jackc/pgx/v5"
	"os"
	"time"
)
func init() {
    _ = godotenv.Load("..\\.env")
    testStoreService = InitializeStore()
}

// Define the struct wrapper around raw Redis client and Postgres DB
type StorageService struct {
	redisClient *redis.Client
	db          *pgx.Conn
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
		panic(fmt.Sprintf("Error init Redis: %v", err))
	}

	fmt.Printf("\nRedis started successfully: pong message = {%s}", pong)

	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		panic("DATABASE_URL environment variable not set")
	}
	conn, err := pgx.Connect(ctx, databaseUrl)
	if err != nil {
		panic(fmt.Sprintf("Failed to connect to Postgres: %v", err))
	}
	fmt.Println("\nPostgreSQL (Supabase) connected successfully.")

	storeService.redisClient = redisClient
	storeService.db = conn
	return storeService
}

/* We want to be able to save the mapping between the originalUrl 
and the generated shortUrl url
*/
func SaveUrlMapping(shortUrl string, originalUrl string, userId string) {
	// Save to Redis
	err := storeService.redisClient.Set(shortUrl, originalUrl, CacheDuration).Err()
	if err != nil {
		panic(fmt.Sprintf("Failed saving key url to Redis | Error: %v - shortUrl: %s - originalUrl: %s\n", err, shortUrl, originalUrl))
	}
	// Save to Postgres (Supabase)
	_, err = storeService.db.Exec(ctx,
		`INSERT INTO url_mappings (short_url, original_url, user_id) VALUES ($1, $2, $3)
		 ON CONFLICT (short_url) DO UPDATE SET original_url = EXCLUDED.original_url, user_id = EXCLUDED.user_id`,
		shortUrl, originalUrl, userId,
	)
	if err != nil {
		panic(fmt.Sprintf("Failed saving key url to Postgres | Error: %v - shortUrl: %s - originalUrl: %s\n", err, shortUrl, originalUrl))
	}
}

/*
We should be able to retrieve the initial long URL once the short 
is provided. This is when users will be calling the shortlink in the 
url, so what we need to do here is to retrieve the long url and
think about redirect.
*/
func RetrieveInitialUrl(shortUrl string) string {
	// Try Redis first
	result, err := storeService.redisClient.Get(shortUrl).Result()
	if err == nil {
		return result
	}
	// If not found in Redis, try Postgres (Supabase)
	var originalUrl string
	err = storeService.db.QueryRow(ctx, "SELECT original_url FROM url_mappings WHERE short_url = $1", shortUrl).Scan(&originalUrl)
	if err != nil {
		panic(fmt.Sprintf("Failed RetrieveInitialUrl from Postgres | Error: %v - shortUrl: %s\n", err, shortUrl))
	}
	// Cache in Redis for future requests
	_ = storeService.redisClient.Set(shortUrl, originalUrl, CacheDuration).Err()
	return originalUrl
}