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

	fmt.Println("🔧 Fixing user ID mismatch...\n")

	// The correct NextAuth user ID from database
	correctUserId := "cmbdtyaxd000euwas4qlxz65f"
	
	// Update existing URLs to use the correct user ID
	result, err := conn.Exec(context.Background(), 
		`UPDATE urls SET "userId" = $1 WHERE "userId" IS NULL OR "userId" != $1`, 
		correctUserId)
	if err != nil {
		log.Printf("Error updating URLs: %v", err)
	} else {
		rowsAffected := result.RowsAffected()
		fmt.Printf("✅ Updated %d URLs to use correct user ID: %s\n", rowsAffected, correctUserId)
	}

	// Also update any clicks to use the correct user ID
	result, err = conn.Exec(context.Background(), 
		`UPDATE url_clicks SET "userId" = $1 WHERE "userId" != $1`, 
		correctUserId)
	if err != nil {
		log.Printf("Error updating clicks: %v", err)
	} else {
		rowsAffected := result.RowsAffected()
		fmt.Printf("✅ Updated %d clicks to use correct user ID\n", rowsAffected)
	}

	fmt.Println("\n🔍 Verifying changes...")

	// Check URLs now
	rows, err := conn.Query(context.Background(), 
		`SELECT "shortCode", "userId" FROM urls`)
	if err != nil {
		log.Printf("Error querying URLs: %v", err)
	} else {
		fmt.Println("\nURLs after fix:")
		for rows.Next() {
			var shortCode, userId string
			rows.Scan(&shortCode, &userId)
			fmt.Printf("- %s → User: %s\n", shortCode, userId)
		}
		rows.Close()
	}
} 