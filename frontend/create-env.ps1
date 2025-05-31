# PowerShell script to create .env.local file
@'
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-must-be-at-least-32-characters-long

# Google OAuth (Replace with your actual values)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth (Replace with your actual values)
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Database (Update with your actual database URL)
DATABASE_URL="postgresql://postgres:password@localhost:5432/shortlink_db?schema=public"

# Development
NODE_ENV=development
'@ | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "✅ .env.local file created successfully!"
Write-Host "🔧 Please update the OAuth credentials and database URL in the .env.local file" 