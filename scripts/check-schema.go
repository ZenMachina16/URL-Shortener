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

	fmt.Println("Connected to database successfully!")
	
	// Check urls table columns
	fmt.Println("\n=== URLS table columns ===")
	rows, err := conn.Query(context.Background(), 
		"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'urls' ORDER BY ordinal_position")
	if err != nil {
		log.Printf("Error querying urls columns: %v", err)
	} else {
		for rows.Next() {
			var columnName, dataType string
			rows.Scan(&columnName, &dataType)
			fmt.Printf("- %s (%s)\n", columnName, dataType)
		}
		rows.Close()
	}

	// Check url_clicks table columns  
	fmt.Println("\n=== URL_CLICKS table columns ===")
	rows, err = conn.Query(context.Background(), 
		"SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'url_clicks' ORDER BY ordinal_position")
	if err != nil {
		log.Printf("Error querying url_clicks columns: %v", err)
	} else {
		for rows.Next() {
			var columnName, dataType string
			rows.Scan(&columnName, &dataType)
			fmt.Printf("- %s (%s)\n", columnName, dataType)
		}
		rows.Close()
	}

	// Show sample data from urls table
	fmt.Println("\n=== Sample URLs ===")
	rows, err = conn.Query(context.Background(), "SELECT id, shortCode, originalUrl FROM urls LIMIT 3")
	if err != nil {
		log.Printf("Error querying sample URLs (camelCase): %v", err)
		// Try snake_case
		rows, err = conn.Query(context.Background(), "SELECT id, short_code, original_url FROM urls LIMIT 3")
		if err != nil {
			log.Printf("Error querying sample URLs (snake_case): %v", err)
		} else {
			fmt.Println("Using snake_case columns:")
			for rows.Next() {
				var id, shortCode, originalUrl string
				rows.Scan(&id, &shortCode, &originalUrl)
				fmt.Printf("- %s: %s -> %s\n", id, shortCode, originalUrl)
			}
			rows.Close()
		}
	} else {
		fmt.Println("Using camelCase columns:")
		for rows.Next() {
			var id, shortCode, originalUrl string
			rows.Scan(&id, &shortCode, &originalUrl)
			fmt.Printf("- %s: %s -> %s\n", id, shortCode, originalUrl)
		}
		rows.Close()
	}
} 