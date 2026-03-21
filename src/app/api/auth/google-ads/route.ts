import { NextRequest, NextResponse } from "next/server";

const SCOPES = [
  "https://www.googleapis.com/auth/adwords",
].join(" ");

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_ADS_CLIENT_ID not set" }, { status: 500 });
  }

  // Derive base URL from the incoming request so it works on any host
  // (Railway, Vercel, localhost, etc.) without extra env var configuration.
  const origin = process.env.NEXT_PUBLIC_BASE_URL ?? new URL(req.url).origin;
  const redirectUri = `${origin}/api/auth/google-ads/callback`;

  const params = new URLSearchParams({
    client_id:     clientId,
    redirect_uri:  redirectUri,
    response_type: "code",
    scope:         SCOPES,
    access_type:   "offline",
    prompt:        "consent", // forces refresh_token to be returned every time
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
