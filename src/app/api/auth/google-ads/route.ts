/**
 * GET /api/auth/google-ads
 *
 * Redirects to Google OAuth consent screen.
 * After approval, Google redirects to /api/auth/google-ads/callback
 * which prints the refresh token you paste into .env.
 */
import { NextResponse } from "next/server";

const SCOPES = [
  "https://www.googleapis.com/auth/adwords",
].join(" ");

export async function GET() {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_ADS_CLIENT_ID not set" }, { status: 500 });
  }

  // Use a localhost redirect — works for internal tooling.
  // Must also be added to your OAuth app's authorised redirect URIs in Google Cloud Console.
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000"}/api/auth/google-ads/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",        // forces refresh_token to be returned
  });

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  );
}
