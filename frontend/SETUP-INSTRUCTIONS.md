# 🚀 Complete Setup Instructions

## 📋 **Step 1: Create .env.local File**

1. **Navigate to the frontend directory**: `D:\url-shortener\frontend`
2. **Create a file named `.env.local`** (important: it must be exactly `.env.local`)
3. **Copy and paste this content** into the file:

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-this-to-a-long-random-string-at-least-32-characters

# Google OAuth (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# GitHub OAuth (Get from GitHub Developer Settings)
GITHUB_CLIENT_ID=your-github-client-id-here
GITHUB_CLIENT_SECRET=your-github-client-secret-here

# Database (Optional for now)
DATABASE_URL="postgresql://postgres:password@localhost:5432/shortlink_db?schema=public"

# Development
NODE_ENV=development
```

## 🔐 **Step 2: Generate NEXTAUTH_SECRET**

Replace `change-this-to-a-long-random-string-at-least-32-characters` with:

**Option A:** Use online generator: https://generate-secret.vercel.app/32

**Option B:** Use this long random string:
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

## 🌐 **Step 3: Set Up Google OAuth**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Go to "APIs & Services" → "Credentials"
4. Click "Create Credentials" → "OAuth 2.0 Client IDs"
5. Select "Web application"
6. Add **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret** to your `.env.local`

## 🐙 **Step 4: Set Up GitHub OAuth**

1. Go to [GitHub Settings → Developer settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - **Application name**: `ShortLink App`
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Copy the **Client ID** and **Client Secret** to your `.env.local`

## 🔧 **Step 5: Fix Prisma (Optional)**

If you want to use the database later:

1. **Run PowerShell as Administrator**
2. Navigate to frontend: `cd D:\url-shortener\frontend`
3. Run: `npx prisma generate`
4. Run: `npx prisma db push`

## ✅ **Step 6: Test the Setup**

1. **Restart your development server** (Ctrl+C then `npm run dev`)
2. **Go to**: http://localhost:3000
3. **Try URL shortening** (should work as guest)
4. **Try authentication** (click "Sign in for advanced features")

## 🚨 **Common Issues & Solutions**

### Issue: "Missing required environment variables"
- **Solution**: Make sure `.env.local` exists and has all variables

### Issue: OAuth callback errors
- **Solution**: Check redirect URIs match exactly in Google/GitHub settings

### Issue: Prisma permission errors
- **Solution**: Run PowerShell as Administrator

### Issue: Hydration mismatch
- **Solution**: Disable browser extensions temporarily (especially Grammarly)

## 📞 **Quick Test Commands**

```powershell
# Check if .env.local exists
Test-Path .env.local

# View environment variables (in development)
Get-Content .env.local

# Restart development server
npm run dev
```

## 🎯 **What Should Work Now**

- ✅ URL shortening (as guest user)
- ✅ Google OAuth (after setting up credentials)
- ✅ GitHub OAuth (after setting up credentials)
- ✅ No hydration errors
- ✅ No Prisma blocking authentication

## 📝 **Next Steps After Basic Setup**

1. Enable database integration (re-add Prisma adapter)
2. Add user dashboard with saved URLs
3. Add analytics tracking
4. Add custom domain support 