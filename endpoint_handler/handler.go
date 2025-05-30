package endpoint_handler

import (
	"net/http"
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
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

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
	
	// Validation
	if longUrl == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "URL is required"})
		return
	}

	shortUrl := shorturl.GenerateShortLink(longUrl, userId)
	store.SaveUrlMapping(shortUrl, longUrl, userId)

	host := "http://localhost:9808/"
	c.JSON(200, gin.H{
		"message":   "short url created successfully",
		"short_url": host + shortUrl,
	})
}

func HandleShortUrlRedirect(c *gin.Context) {
	shortUrl := c.Param("shortUrl")
	initialUrl := store.RetrieveInitialUrl(shortUrl)
	c.Redirect(302, initialUrl)
}
