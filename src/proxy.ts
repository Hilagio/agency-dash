/**
 * proxy.ts — Next.js 16 route proxy (replaces middleware.ts)
 *
 * Runs before every request. Responsibilities:
 *  1. Allow unauthenticated access to /login, /api/auth/*, /api/invite/*
 *  2. Verify session JWT from cookie
 *  3. Redirect unauthenticated → /login
 *  4. Redirect authenticated-but-no-org → /onboard
 *  5. Forward userId, orgId, email, name as request headers for route handlers
 */
import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/session";

// Paths that don't require authentication
const PUBLIC_PREFIXES = [
  "/login",
  "/api/auth/signin",
  "/api/auth/callback",
  "/api/auth/signout",
  "/api/invite",
  "/_next",
  "/favicon",
];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some(p => pathname.startsWith(p));
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Always allow public paths
  if (isPublic(pathname)) return NextResponse.next();

  // Read session token from cookie
  const token = request.cookies.get("agency-session")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = await verifySessionToken(token);

  if (!session) {
    // Invalid/expired token
    const loginUrl = new URL("/login", request.url);
    const res = NextResponse.redirect(loginUrl);
    res.cookies.set("agency-session", "", { maxAge: 0 });
    return res;
  }

  // If user has no org yet, only allow /onboard
  if (!session.orgId && !pathname.startsWith("/onboard") && !pathname.startsWith("/api/org")) {
    return NextResponse.redirect(new URL("/onboard", request.url));
  }

  // Forward auth context as headers for route handlers
  const res = NextResponse.next();
  res.headers.set("x-user-id",    session.userId);
  res.headers.set("x-user-email", session.email);
  if (session.name)  res.headers.set("x-user-name", session.name);
  if (session.orgId) res.headers.set("x-org-id",    session.orgId);

  return res;
}

export const config = {
  matcher: [
    // Match everything except Next.js internals and static files
    "/((?!_next/static|_next/image|favicon\\.ico).*)",
  ],
};
