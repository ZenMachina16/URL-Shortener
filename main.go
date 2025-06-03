package main

import (
	"fmt"
	"os"
	"url-shortener/endpoint_handler"
	"url-shortener/store"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"time"
)

func main() {
	// Set Gin mode based on environment
	if os.Getenv("GO_ENV") == "production" {
		gin.SetMode(gin.ReleaseMode)
	}
	
	r := gin.Default()
	
	// Get allowed origins from environment or use defaults
	allowedOrigins := []string{
		"http://localhost:3000", 
		"http://192.168.1.33:3000",
		"https://url-shortener-frontend-f9ew.onrender.com",
		"https://*.onrender.com", // Allow all Render subdomains
	}
	
	if origins := os.Getenv("ALLOWED_ORIGINS"); origins != "" {
		// In production, you can set specific origins
		allowedOrigins = append(allowedOrigins, origins)
	}
	
	// Configure CORS middleware
	r.Use(cors.New(cors.Config{
		AllowOrigins:     allowedOrigins,
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Length", "Content-Type", "Authorization"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))
	
	r.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Welcome to the URL Shortener API",
			"environment": os.Getenv("GO_ENV"),
		})
	})

	r.POST("/create-short-url", func(c *gin.Context) {
		endpoint_handler.CreateShortUrl(c)
	})

	r.GET("/:shortUrl", func(c *gin.Context) {
		endpoint_handler.HandleShortUrlRedirect(c)
	})

	// Initialize store
	store.InitializeStore()

	// Get port from environment or use default
	port := os.Getenv("PORT")
	if port == "" {
		port = "9808"
	}

	err := r.Run(":" + port)
	if err != nil {
		panic(fmt.Sprintf("Failed to start the web server - Error: %v", err))
	}
}
