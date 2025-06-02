# 🌐 Production Environment Setup

## Environment Variables for Production Deployment

Your frontend is deployed at: `https://url-shortener-frontend-f9ew.onrender.com`
Your backend is deployed at: `https://shrinkr-2k0u.onrender.com`

### Required Environment Variables for Production

Set these environment variables in your hosting platform (Render, Vercel, Netlify, etc.):

```env
# NextAuth Configuration
NEXTAUTH_URL=https://url-shortener-frontend-f9ew.onrender.com
NEXTAUTH_SECRET=your-secure-secret-here-at-least-32-characters

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth  
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Database
DATABASE_URL=your-production-database-url

# Backend API
NEXT_PUBLIC_API_URL=https://shrinkr-2k0u.onrender.com

# Production
NODE_ENV=production
```

## 🔐 OAuth Provider Configuration for Production

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project
3. Go to "APIs & Services" → "Credentials"
4. Edit your OAuth 2.0 Client ID
5. Add **Authorized redirect URI**: 
   ```
   https://url-shortener-frontend-f9ew.onrender.com/api/auth/callback/google
   ```

### GitHub OAuth Setup
1. Go to [GitHub Settings → Developer settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update **Authorization callback URL**: 
   ```
   https://url-shortener-frontend-f9ew.onrender.com/api/auth/callback/github
   ```

## 🚀 Platform-Specific Instructions

### Render.com
1. Go to your frontend service dashboard
2. Click "Environment" tab
3. Add each environment variable listed above

### Vercel
1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable for the "Production" environment

### Netlify
1. Go to Site settings → Environment variables
2. Add each environment variable

## ✅ Testing Production Setup

After setting up the environment variables:

1. **Redeploy your application** (trigger a new deployment)
2. **Test authentication** at your production URL
3. **Verify redirect URLs** work correctly
4. **Check console logs** for any remaining errors

## 🔧 Troubleshooting

### Authentication redirects to localhost
- ❌ `NEXTAUTH_URL` is not set correctly
- ✅ Make sure it's set to your production URL

### OAuth callback errors
- ❌ Redirect URIs don't match in OAuth provider settings
- ✅ Update Google/GitHub OAuth settings with production URLs

### Environment variables not loading
- ❌ Variables might not be set in your hosting platform
- ✅ Check your platform's environment variable settings

## 📝 Quick Checklist

- [ ] Set `NEXTAUTH_URL` to production URL
- [ ] Set OAuth credentials in environment variables
- [ ] Update Google OAuth redirect URI
- [ ] Update GitHub OAuth redirect URI  
- [ ] Redeploy application
- [ ] Test authentication flow 