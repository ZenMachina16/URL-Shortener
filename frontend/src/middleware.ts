import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Define paths that are considered public
  const publicPaths = [
    "/",
    "/auth/signin",
    "/auth/signup",
    "/auth/forgot-password",
  ];
  
  // Check if the path is public
  const isPublicPath = publicPaths.some((publicPath) => 
    path === publicPath || path.startsWith("/api/") || path.startsWith("/_next/")
  );

  // Define protected paths (dashboard routes)
  const isProtectedPath = path.startsWith("/dashboard");

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect unauthenticated users trying to access protected routes to sign-in
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Redirect authenticated users on auth pages to dashboard
  if ((path === "/auth/signin" || path === "/auth/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
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