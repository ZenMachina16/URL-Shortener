import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Temporarily disable dashboard protection for testing
  // Just handle auth page redirects for now
  
  console.log("Middleware running for path:", path);

  // Only redirect authenticated users away from auth pages
  if (path === "/auth/signin" || path === "/auth/signup") {
    // Check for NextAuth session cookies (multiple possible names)
    const sessionCookies = [
      req.cookies.get("next-auth.session-token"),
      req.cookies.get("__Secure-next-auth.session-token"),
      req.cookies.get("next-auth.session"),
      req.cookies.get("__Host-next-auth.session-token")
    ];

    const hasSessionCookie = sessionCookies.some(cookie => cookie?.value);
    
    if (hasSessionCookie) {
      console.log("Redirecting authenticated user away from auth pages");
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

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