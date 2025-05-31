# Environment Setup Guide

## 🔧 Required Setup Steps

### 1. Create Environment File

Create `.env.local` in the `frontend` directory:

```bash
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=super-secret-key-change-this-in-production-please

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth  
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/shortlink_db?schema=public"

# Development
NODE_ENV=development
```

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API 
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Secret to `.env.local`

### 3. GitHub OAuth Setup

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set:
   - **Application name**: `ShortLink App`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy Client ID and Secret to `.env.local`

### 4. Database Setup

Update the `DATABASE_URL` in `.env.local` with your actual database credentials.

### 5. Generate Prisma Client

```bash
npx prisma generate
```

### 6. Push Database Schema

```bash
npx prisma db push
```

## ✅ After Setup

1. Restart your development server
2. Test Google and GitHub authentication
3. Check console for any missing environment variable warnings

## 🚨 Common Issues

- **Callback Error**: Check redirect URIs match exactly
- **Missing Environment Variables**: Check console for warnings
- **Database Connection**: Verify DATABASE_URL is correct
- **Hydration Mismatch**: Browser extensions can cause this (disable temporarily) 