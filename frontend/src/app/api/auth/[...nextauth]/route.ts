import { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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

export const authOptions: NextAuthOptions = {
  // Enable Prisma adapter for database sessions
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
      console.log("Redirect callback:", { url, baseUrl });
      
      // Handle sign-in redirects - redirect to home page
      if (url.includes('/auth/signin') || url.includes('/api/auth/signin')) {
        return baseUrl; // This sends them to the home page (/)
      }
      
      // Handle sign-out redirects
      if (url.includes('/auth/signout') || url.includes('/api/auth/signout')) {
        return baseUrl;
      }
      
      // If URL is relative, make it absolute
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }
      
      // If URL is on the same origin, allow it
      if (new URL(url).origin === baseUrl) {
        return url;
      }
      
      // Default to home page for authenticated users
      return baseUrl;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST }; 