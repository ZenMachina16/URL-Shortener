package main

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/jackc/pgx/v5"
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

	conn, err := pgx.Connect(context.Background(), databaseUrl)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}
	defer conn.Close(context.Background())

	fmt.Println("🔍 Debugging database content...\n")

	// Check all URLs in database
	fmt.Println("=== ALL URLs in database ===")
	rows, err := conn.Query(context.Background(), 
		`SELECT id, "shortCode", "originalUrl", "userId", "createdAt" FROM urls ORDER BY "createdAt" DESC LIMIT 10`)
	if err != nil {
		log.Printf("Error querying URLs: %v", err)
	} else {
		count := 0
		for rows.Next() {
			var id, shortCode, originalUrl, userId, createdAt string
			rows.Scan(&id, &shortCode, &originalUrl, &userId, &createdAt)
			fmt.Printf("%d. ID: %s\n   Short: %s\n   URL: %s\n   User: %s\n   Created: %s\n\n", 
				count+1, id, shortCode, originalUrl, userId, createdAt)
			count++
		}
		rows.Close()
		if count == 0 {
			fmt.Println("   No URLs found")
		}
	}

	// Check all users in database
	fmt.Println("\n=== ALL Users in database ===")
	rows, err = conn.Query(context.Background(), 
		`SELECT id, name, email, "createdAt" FROM users ORDER BY "createdAt" DESC LIMIT 5`)
	if err != nil {
		log.Printf("Error querying users: %v", err)
	} else {
		count := 0
		for rows.Next() {
			var id, name, email, createdAt string
			rows.Scan(&id, &name, &email, &createdAt)
			fmt.Printf("%d. ID: %s\n   Name: %s\n   Email: %s\n   Created: %s\n\n", 
				count+1, id, name, email, createdAt)
			count++
		}
		rows.Close()
		if count == 0 {
			fmt.Println("   No users found")
		}
	}

	// Check URL clicks
	fmt.Println("\n=== URL Clicks ===")
	rows, err = conn.Query(context.Background(), 
		`SELECT id, "urlId", "userId", "ipAddress", "clickedAt" FROM url_clicks ORDER BY "clickedAt" DESC LIMIT 5`)
	if err != nil {
		log.Printf("Error querying clicks: %v", err)
	} else {
		count := 0
		for rows.Next() {
			var id, urlId, userId, ipAddress, clickedAt string
			rows.Scan(&id, &urlId, &userId, &ipAddress, &clickedAt)
			fmt.Printf("%d. Click ID: %s\n   URL ID: %s\n   User: %s\n   IP: %s\n   Time: %s\n\n", 
				count+1, id, urlId, userId, ipAddress, clickedAt)
			count++
		}
		rows.Close()
		if count == 0 {
			fmt.Println("   No clicks found")
		}
	}
} 