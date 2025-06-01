package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func init() {
	_ = godotenv.Load(".env")
}

func generateClickId() string {
	return fmt.Sprintf("click_%d", time.Now().UnixNano())
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

	fmt.Println("🧪 Testing click tracking directly...\n")

	shortCode := "esTxLJpC"
	userId := "guest-user"
	ipAddress := "127.0.0.1"
	userAgent := "Test-Agent"
	referer := "http://test.com"

	// Step 1: Get the URL ID
	fmt.Printf("Step 1: Finding URL for shortCode: %s\n", shortCode)
	var urlId string
	err = conn.QueryRow(context.Background(), 
		`SELECT id FROM urls WHERE "shortCode" = $1`, 
		shortCode).Scan(&urlId)
	if err != nil {
		log.Fatalf("❌ Failed to find URL: %v", err)
	}
	fmt.Printf("✅ Found URL ID: %s\n", urlId)

	// Step 2: Generate click ID
	clickId := generateClickId()
	fmt.Printf("Step 2: Generated click ID: %s\n", clickId)

	// Step 3: Try to insert click record
	fmt.Println("Step 3: Inserting click record...")
	_, err = conn.Exec(context.Background(),
		`INSERT INTO url_clicks (id, "urlId", "userId", "ipAddress", "userAgent", referer, "clickedAt") 
		 VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
		clickId, urlId, userId, ipAddress, userAgent, referer,
	)
	if err != nil {
		log.Printf("❌ Failed to insert click (camelCase): %v\n", err)
		
		// Try snake_case
		fmt.Println("Trying snake_case columns...")
		_, err = conn.Exec(context.Background(),
			`INSERT INTO url_clicks (id, url_id, user_id, ip_address, user_agent, referer, clicked_at) 
			 VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
			clickId+"_snake", urlId, userId, ipAddress, userAgent, referer,
		)
		if err != nil {
			log.Fatalf("❌ Failed to insert click (snake_case): %v", err)
		} else {
			fmt.Println("✅ Success with snake_case columns!")
		}
	} else {
		fmt.Println("✅ Success with camelCase columns!")
	}

	// Step 4: Verify the click was inserted
	fmt.Println("Step 4: Verifying click was inserted...")
	var count int
	err = conn.QueryRow(context.Background(), 
		`SELECT COUNT(*) FROM url_clicks WHERE "urlId" = $1`, 
		urlId).Scan(&count)
	if err != nil {
		// Try snake_case
		err = conn.QueryRow(context.Background(), 
			`SELECT COUNT(*) FROM url_clicks WHERE url_id = $1`, 
			urlId).Scan(&count)
		if err != nil {
			log.Printf("❌ Failed to count clicks: %v", err)
		}
	}
	
	fmt.Printf("📊 Total clicks for this URL: %d\n", count)
} 