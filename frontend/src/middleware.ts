import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getFrontendBaseUrl } from "./config/urls";

// Function to get the correct base URL
function getBaseUrl(requestHeaders: Headers) {
  // First try X-Forwarded-Host
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  if (forwardedHost) {
    const protocol = requestHeaders.get("x-forwarded-proto") || "https";
    return `${protocol}://${forwardedHost}`;
  }

  // Then try Host header
  const host = requestHeaders.get("host");
  if (host) {
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";
    return `${protocol}://${host}`;
  }

  // Finally fallback to configured URL
  return process.env.NEXTAUTH_URL || getFrontendBaseUrl();
}

export default withAuth(
  function middleware(request) {
    const requestHeaders = new Headers(request.headers);
    const baseUrl = getBaseUrl(requestHeaders);
    console.log("Middleware running for path:", request.nextUrl.pathname, { baseUrl });

    // Add base URL to request headers for use in the application
    requestHeaders.set("x-url-base", baseUrl);

    // Protected routes
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/api/analytics")
    ) {
      // These routes are already protected by withAuth
      return NextResponse.next({
        headers: requestHeaders,
      });
    }

    // Pass the headers along
    return NextResponse.next({
      headers: requestHeaders,
    });
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Public paths that don't require authentication
        if (
          req.nextUrl.pathname.startsWith("/auth") ||
          req.nextUrl.pathname === "/" ||
          req.nextUrl.pathname.startsWith("/api/urls") ||
          req.nextUrl.pathname.startsWith("/api/health")
        ) {
          return true;
        }

        // Protected paths require authentication
        return !!token;
      },
    },
  }
);

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside /public)
     * 4. /favicon.ico, /site.webmanifest, etc.
     */
    "/((?!api|_next|fonts|images|favicon.ico|site.webmanifest).*)",
  ],
}; 