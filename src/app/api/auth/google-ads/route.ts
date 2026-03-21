import { NextRequest, NextResponse } from "next/server";

/**
 * Derive the public-facing origin from request headers.
 * Behind Railway/Vercel/Nginx the internal req.url is localhost:PORT,
 * so we prefer x-forwarded-host + x-forwarded-proto when available.
 */
function getOrigin(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  const host  = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? "https";
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

const SCOPES = [
  "https://www.googleapis.com/auth/adwords",
].join(" ");

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_ADS_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_ADS_CLIENT_ID not set" }, { status: 500 });
  }

  const origin = getOrigin(req);
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
