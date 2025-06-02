package endpoint_handler

import (
	"net/http"
	"log"
	"os"
	shorturl "url-shortener/shorturl"
	"url-shortener/store"

	"github.com/gin-gonic/gin"
)

// Request model definition
type UrlCreationRequest struct {
	LongUrl  string `json:"long_url"`  // Original field
	UserId   string `json:"user_id"`   // Original field
	LongURL  string `json:"longUrl"`   // New frontend field (alternative)
	UserID   string `json:"userId"`    // New frontend field (alternative)
}

func CreateShortUrl(c *gin.Context) {
	var creationRequest UrlCreationRequest
	if err := c.ShouldBindJSON(&creationRequest); err != nil {
		log.Printf("Error binding JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	log.Printf("Received URL creation request: %+v", creationRequest)

	// Handle both naming conventions
	longUrl := creationRequest.LongUrl
	userId := creationRequest.UserId
	
	if longUrl == "" {
		longUrl = creationRequest.LongURL
	}
	
	if userId == "" {
		userId = creationRequest.UserID
		// If still empty, use a default
		if userId == "" {
			userId = "guest-user"
		}
	}
	
	log.Printf("Processed values - longUrl: %s, userId: %s", longUrl, userId)
	
	// Validation
	if longUrl == "" {
		log.Printf("Error: URL is required")
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL is required"})
		return
	}

	shortUrl := shorturl.GenerateShortLink(longUrl, userId)
	log.Printf("Generated short URL: %s", shortUrl)
	
	// Handle database save error
	err := store.SaveUrlMapping(shortUrl, longUrl, userId)
	if err != nil {
		log.Printf("Error saving URL mapping: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to save URL mapping. Please try again.",
			"details": err.Error(),
		})
		return
	}

	log.Printf("Successfully saved URL mapping for user %s", userId)

	// Use the correct host URL based on environment
	host := "https://shrinkr-2k0u.onrender.com/"
	if os.Getenv("GO_ENV") == "development" {
		host = "http://localhost:9808/"
	}

	c.JSON(200, gin.H{
		"message":   "short url created successfully",
		"short_url": host + shortUrl,
	})
}

func HandleShortUrlRedirect(c *gin.Context) {
	shortUrl := c.Param("shortUrl")
	log.Printf("Handling redirect request for short URL: %s", shortUrl)
	
	initialUrl := store.RetrieveInitialUrl(shortUrl)
	
	if initialUrl == "" {
		log.Printf("Short URL not found: %s", shortUrl)
		c.JSON(http.StatusNotFound, gin.H{"error": "Short URL not found"})
		return
	}
	
	// Track the click before redirecting
	ipAddress := c.ClientIP()
	userAgent := c.GetHeader("User-Agent")
	referer := c.GetHeader("Referer")
	
	log.Printf("Tracking click for short URL: %s, IP: %s", shortUrl, ipAddress)
	
	// Track the click (don't fail if tracking fails)
	err := store.TrackUrlClick(shortUrl, "guest-user", ipAddress, userAgent, referer)
	if err != nil {
		log.Printf("Warning: Failed to track click for %s: %v", shortUrl, err)
		// Continue with redirect even if tracking fails
	} else {
		log.Printf("Successfully tracked click for short URL: %s", shortUrl)
	}
	
	log.Printf("Redirecting to: %s", initialUrl)
	c.Redirect(302, initialUrl)
}
