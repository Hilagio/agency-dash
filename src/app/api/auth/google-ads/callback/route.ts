/**
 * GET /api/auth/google-ads/callback
 *
 * Google redirects here after OAuth consent.
 * Keep this handler fast — no heavy API calls.
 * MCC detection and account naming happen lazily in the accounts route.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code  = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(error)}`, req.url));
  }
  if (!code) {
    return NextResponse.redirect(new URL("/?auth_error=no_code", req.url));
  }

  const clientId     = process.env.GOOGLE_ADS_CLIENT_ID!;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET!;
  const baseUrl      = process.env.NEXT_PUBLIC_BASE_URL ?? `${new URL(req.url).origin}`;
  const redirectUri  = `${baseUrl}/api/auth/google-ads/callback`;

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
    return NextResponse.redirect(new URL(`/?auth_error=${encodeURIComponent(msg)}`, req.url));
  }

  // ── 2. List accessible customer IDs (fast REST call, no GAQL) ───────────────
  let customerIds: string[] = [];
  const developerToken = process.env.GOOGLE_ADS_DEVELOPER_TOKEN;

  if (developerToken && tokens.access_token) {
    try {
      const res = await fetch(
        "https://googleads.googleapis.com/v19/customers:listAccessibleCustomers",
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

  // ── 3. Persist credentials immediately ──────────────────────────────────────
  // loginCustomerId is resolved lazily by the accounts route on first use.
  try {
    await prisma.oAuthCredential.upsert({
      where:  { id: "singleton" },
      update: { refreshToken: tokens.refresh_token, customerIds: JSON.stringify(customerIds) },
      create: { id: "singleton", refreshToken: tokens.refresh_token, customerIds: JSON.stringify(customerIds) },
    });
  } catch (e) {
    console.error("[oauth callback] DB save failed:", e);
    return NextResponse.redirect(new URL("/?auth_error=db_save_failed", req.url));
  }

  // ── 4. Redirect straight to dashboard ────────────────────────────────────────
  return NextResponse.redirect(new URL("/", req.url));
}
