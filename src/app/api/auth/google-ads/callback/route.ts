/**
 * GET /api/auth/google-ads/callback
 *
 * Google redirects here after OAuth consent.
 * Keep this handler fast — no heavy API calls.
 * MCC detection and account naming happen lazily in the accounts route.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSession } from "@/lib/session";

function getOrigin(req: NextRequest): string {
  if (process.env.NEXT_PUBLIC_BASE_URL) return process.env.NEXT_PUBLIC_BASE_URL;
  if (process.env.RAILWAY_PUBLIC_DOMAIN) return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`;
  const host  = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  const proto = req.headers.get("x-forwarded-proto") ?? (process.env.NODE_ENV === "production" ? "https" : "http");
  if (host) return `${proto}://${host}`;
  return new URL(req.url).origin;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const error = searchParams.get("error");
  const origin = getOrigin(req);

  // Restore the return destination passed via OAuth state.
  // Only allow relative paths (starting with /) to prevent open redirect attacks.
  const rawState = searchParams.get("state") ?? "/";
  const returnTo = rawState.startsWith("/") ? rawState : "/";

  if (error) {
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(error)}`);
  }
  if (!code) {
    return NextResponse.redirect(`${origin}/?auth_error=no_code`);
  }

  // Get current session to associate credential with the org
  const session = await getSession();
  if (!session?.orgId) {
    return NextResponse.redirect(`${origin}/onboard?auth_error=no_org`);
  }
  const orgId = session.orgId;

  const clientId     = process.env.GOOGLE_ADS_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET!;
  const redirectUri  = process.env.GOOGLE_ADS_REDIRECT_URI ?? `${origin}/api/auth/google-ads/callback`;

  console.log("[google-ads callback] redirectUri:", redirectUri);

  // ── 1. Exchange code for tokens ─────────────────────────────────────────────
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id:     clientId,
      client_secret: clientSecret,
      redirect_uri:  redirectUri,
      grant_type:    "authorization_code",
    }),
  });

  const tokens = await tokenRes.json() as {
    access_token?: string;
    refresh_token?: string;
    error?: string;
  };

  if (tokens.error || !tokens.refresh_token) {
    const msg = tokens.error ?? "no_refresh_token";
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent(msg)}`);
  }

  // ── 2. List accessible customer IDs (fast REST call, no GAQL) ───────────────
  let customerIds: string[] = [];
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

  if (developerToken && tokens.access_token) {
    try {
      const res = await fetch(
        "https://googleads.googleapis.com/v23/customers:listAccessibleCustomers",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "developer-token": developerToken,
          },
        }
      );
      const data = await res.json() as { resourceNames?: string[] };
      customerIds = (data.resourceNames ?? []).map((r) => r.replace("customers/", ""));
    } catch {
      // Non-fatal — we still save the token; MCC discovery happens later
    }
  }

  // ── 3. Persist credentials scoped to the current org ────────────────────────
  try {
    await prisma.oAuthCredential.upsert({
      where:  { organizationId: orgId },
      update: { refreshToken: tokens.refresh_token, customerIds: JSON.stringify(customerIds) },
      create: { organizationId: orgId, refreshToken: tokens.refresh_token, customerIds: JSON.stringify(customerIds) },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[oauth callback] DB save failed:", msg);
    return NextResponse.redirect(`${origin}/?auth_error=${encodeURIComponent("db: " + msg)}`);
  }

  // ── 4. Redirect back to the page that initiated the reconnect (or dashboard) ──
  return NextResponse.redirect(`${origin}${returnTo}`);
}
