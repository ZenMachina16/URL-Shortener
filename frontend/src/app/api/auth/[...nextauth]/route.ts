import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

// Function to get the correct base URL
function getBaseUrl() {
  // For production, first try NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  // Then try to get from request headers
  const headersList = headers();
  const forwardedHost = headersList.get("x-forwarded-host");
  if (forwardedHost) {
    const protocol = headersList.get("x-forwarded-proto") || "https";
    return `${protocol}://${forwardedHost}`;
  }

  // Finally fallback to hardcoded production URL
  return process.env.NODE_ENV === "development" 
    ? "http://localhost:3000"
    : "https://url-shortener-frontend-f9ew.onrender.com";
}

// Validate environment variables
const requiredEnvVars = {
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
};

// Check for missing environment variables
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0) {
  console.error("Missing required environment variables:", missingEnvVars);
}

// Create auth options
const options: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        console.log("Sign in attempt:", { user: user?.email, provider: account?.provider });
        return true;
      } catch (error) {
        console.error("Sign in error:", error);
        return false;
      }
    },
    async session({ session, user }) {
      try {
        if (session.user) {
          session.user.id = user.id;
          session.user.role = (user as any).role || 'USER';
          session.user.subscriptionTier = (user as any).subscriptionTier || 'FREE';
        }
        return session;
      } catch (error) {
        console.error("Session callback error:", error);
        return session;
      }
    },
    async redirect({ url, baseUrl }) {
      const correctBaseUrl = getBaseUrl();
      console.log("Redirect callback:", { url, baseUrl, correctBaseUrl });
      
      // Always use the correct base URL
      if (url.startsWith("/")) {
        return `${correctBaseUrl}${url}`;
      }
      
      // If URL is on the same origin as the correct base URL, allow it
      try {
        const urlObj = new URL(url);
        const baseUrlObj = new URL(correctBaseUrl);
        if (urlObj.origin === baseUrlObj.origin) {
          return url;
        }
      } catch (error) {
        console.error("URL parsing error:", error);
      }
      
      // Default to home page
      return correctBaseUrl;
    },
  },
};

// Create and export handler
const handler = NextAuth(options);
export { handler as GET, handler as POST }; 