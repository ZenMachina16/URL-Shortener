# ShortLink - Modern URL Shortener

ShortLink is a full-stack URL shortener application with a Go backend and Next.js frontend. It allows users to create, manage, and track shortened URLs with a modern SaaS-like interface.

## Features

- Create shortened URLs instantly
- Modern, responsive UI built with Next.js and Tailwind CSS
- Secure and reliable URL storage with PostgreSQL
- High-performance caching with Redis
- API-first architecture for easy integration

## Tech Stack

### Backend
- Go with Gin web framework
- PostgreSQL for persistent storage
- Redis for caching
- Supports custom shortening algorithms

### Frontend
- Next.js
- TypeScript
- Tailwind CSS
- Modern component architecture

## Getting Started

### Prerequisites

- Go 1.18+
- Node.js 18+
- npm or yarn
- PostgreSQL
- Redis

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/url-shortener.git
   cd url-shortener
   ```

2. Set up the backend:
   ```
   go mod download
   ```

3. Set up the frontend:
   ```
   cd frontend
   npm install
   ```

4. Create a `.env` file in the root directory with your database configuration:
   ```
   DATABASE_URL=postgresql://username:password@localhost:5432/shortener
   ```

### Running the Application

For development, you can use the provided script to run both backend and frontend:

```
./run-dev.bat  # On Windows
```

Or manually:

1. Start the backend:
   ```
   go run main.go
   ```

2. In a separate terminal, start the frontend:
   ```
   cd frontend
   npm run dev
   ```

3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:9808

## API Endpoints

- `POST /create-short-url` - Create a new short URL
  - Request body: `{ "long_url": "https://example.com", "user_id": "user123" }`
  - Response: `{ "message": "short url created successfully", "short_url": "http://localhost:9808/abc123" }`

- `GET /:shortUrl` - Redirect to the original URL

## Project Structure

```
/
├── endpoint_handler/   # API endpoint handlers
├── shorturl/           # URL shortening logic
├── store/              # Database and cache interactions
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/        # Next.js app router
│   │   ├── components/ # React components
├── main.go             # Go application entry point
└── README.md           # This file
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Gin Web Framework](https://github.com/gin-gonic/gin)
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/) 