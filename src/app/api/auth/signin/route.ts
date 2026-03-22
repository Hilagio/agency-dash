/**
 * GET /api/auth/signin
 * Initiates Google OAuth for user authentication (openid, email, profile).
 * Reuses the same Google OAuth client ID as Google Ads (both are Google).
 */
import { NextRequest, NextResponse } from "next/server";

function getOrigin(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  const host  = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function GET(req: NextRequest) {
  const origin       = getOrigin(req);
  const clientId     = process.env.GOOGLE_ADS_CLIENT_ID!;
  const redirectUri  = `${origin}/api/auth/callback`;
  const next         = new URL(req.url).searchParams.get("next") ?? "/";

  // Store 'next' in state so we can redirect after OAuth
  const state = Buffer.from(JSON.stringify({ next })).toString("base64url");

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: "code",
    scope:         "openid email profile",
    access_type:   "offline",
    prompt:        "select_account",
    state,
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}
