package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

func init() {
	_ = godotenv.Load(".env")
}

func main() {
	databaseUrl := os.Getenv("DATABASE_URL")
	if databaseUrl == "" {
		log.Fatal("DATABASE_URL environment variable not set")
	}

	fmt.Printf("Connecting to database: %s\n", databaseUrl[:50]+"...")

	// Create connection pool
	dbPool, err := pgxpool.New(context.Background(), databaseUrl)
	if err != nil {
		log.Fatalf("Failed to create connection pool: %v", err)
	}
	defer dbPool.Close()

	// Test connection
	err = dbPool.Ping(context.Background())
	if err != nil {
		log.Fatalf("Failed to ping database: %v", err)
	}

	fmt.Println("✅ Database connection successful!")

	// Check users table
	var userCount int
	err = dbPool.QueryRow(context.Background(), "SELECT COUNT(*) FROM users").Scan(&userCount)
	if err != nil {
		fmt.Printf("❌ Error querying users table: %v\n", err)
	} else {
		fmt.Printf("👥 Users in database: %d\n", userCount)
	}

	// Check urls table
	var urlCount int
	err = dbPool.QueryRow(context.Background(), "SELECT COUNT(*) FROM urls").Scan(&urlCount)
	if err != nil {
		fmt.Printf("❌ Error querying urls table: %v\n", err)
	} else {
		fmt.Printf("🔗 URLs in database: %d\n", urlCount)
	}

	// Check accounts table
	var accountCount int
	err = dbPool.QueryRow(context.Background(), "SELECT COUNT(*) FROM accounts").Scan(&accountCount)
	if err != nil {
		fmt.Printf("❌ Error querying accounts table: %v\n", err)
	} else {
		fmt.Printf("🔐 Accounts in database: %d\n", accountCount)
	}

	// Show sample data if any exists
	if userCount > 0 {
		fmt.Println("\n📋 Sample users:")
		rows, err := dbPool.Query(context.Background(), "SELECT id, name, email FROM users LIMIT 3")
		if err != nil {
			fmt.Printf("❌ Error querying users: %v\n", err)
		} else {
			defer rows.Close()
			for rows.Next() {
				var id, name, email string
				err := rows.Scan(&id, &name, &email)
				if err != nil {
					fmt.Printf("❌ Error scanning user: %v\n", err)
					continue
				}
				fmt.Printf("  - %s: %s (%s)\n", id, name, email)
			}
		}
	}

	if urlCount > 0 {
		fmt.Println("\n🔗 Sample URLs:")
		rows, err := dbPool.Query(context.Background(), `SELECT id, "shortCode", "originalUrl" FROM urls LIMIT 3`)
		if err != nil {
			fmt.Printf("❌ Error querying urls: %v\n", err)
		} else {
			defer rows.Close()
			for rows.Next() {
				var id, shortCode, originalUrl string
				err := rows.Scan(&id, &shortCode, &originalUrl)
				if err != nil {
					fmt.Printf("❌ Error scanning url: %v\n", err)
					continue
				}
				fmt.Printf("  - %s: %s -> %s\n", shortCode, originalUrl[:50]+"...", id)
			}
		}
	}
} 