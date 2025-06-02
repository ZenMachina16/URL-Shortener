import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { getFrontendBaseUrl } from "@/config/urls";

// Function to get the correct base URL
function getBaseUrl(): string {
  // For production, first try NEXTAUTH_URL
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL;
  }

  return getFrontendBaseUrl();
}

export const authOptions: NextAuthOptions = {
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