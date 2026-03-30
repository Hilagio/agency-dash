/**
 * GET /api/accounts/[id]/pagespeed
 *
 * Runs a Google PageSpeed Insights check against the account's landing page URL.
 * Auth priority:
 *   1. OAuth Bearer token — exchanges the org's stored refresh_token for an access token
 *      using GOOGLE_ADS_CLIENT_ID + GOOGLE_ADS_CLIENT_SECRET (same creds as Google Ads OAuth)
 *   2. PAGESPEED_API_KEY env var — fallback if no OAuth credentials are available
 *   3. Unauthenticated — low rate limit (may 429)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

/** Exchange the org's stored refresh token for a short-lived access token. */
async function getAccessToken(orgId: string): Promise<string | null> {
  const clientId     = process.env.GOOGLE_ADS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_ADS_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const cred = await prisma.oAuthCredential
    .findUnique({ where: { organizationId: orgId }, select: { refreshToken: true } })
    .catch(() => null);
  if (!cred?.refreshToken) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type:    "refresh_token",
      refresh_token: cred.refreshToken,
      client_id:     clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    console.warn("[pagespeed] Failed to exchange refresh token:", await res.text().catch(() => ""));
    return null;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await res.json();
  return data.access_token ?? null;
}

export async function GET(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { landingPageUrl: true, name: true },
  });

  if (!account) return forbidden();

  const url = account.landingPageUrl?.trim();
  if (!url) {
    return NextResponse.json(
      { error: "No landing page URL set for this account. Add one in the account targets panel." },
      { status: 400 }
    );
  }

  // Build auth headers — prefer OAuth Bearer over API key over nothing
  const accessToken = await getAccessToken(ctx.orgId);
  const apiKey      = process.env.PAGESPEED_API_KEY ?? "";

  const psiUrl = accessToken || !apiKey
    ? `${PSI_ENDPOINT}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`
    : `${PSI_ENDPOINT}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance&key=${apiKey}`;

  const headers: Record<string, string> = { Accept: "application/json" };
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  const authMode = accessToken ? "OAuth" : apiKey ? "API key" : "unauthenticated";
  console.log(`[pagespeed] checking ${url} via ${authMode}`);

  let psiRes: Response;
  try {
    psiRes = await fetch(psiUrl, {
      headers,
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[pagespeed] PSI request failed for ${url}:`, msg);
    return NextResponse.json({ error: `PageSpeed check failed: ${msg}` }, { status: 502 });
  }

  if (!psiRes.ok) {
    const body = await psiRes.text().catch(() => "");
    console.error(`[pagespeed] PSI returned ${psiRes.status} for ${url}:`, body.slice(0, 200));
    if (psiRes.status === 429) {
      return NextResponse.json(
        { error: "Rate limit hit — wait a moment and try again." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: `PageSpeed Insights returned ${psiRes.status}. The URL may be unreachable or blocked.` },
      { status: 502 }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: any = await psiRes.json();
  const lhr = data?.lighthouseResult;

  if (!lhr) {
    return NextResponse.json({ error: "Unexpected response from PageSpeed Insights." }, { status: 502 });
  }

  const performanceScore = Math.round((lhr.categories?.performance?.score ?? 0) * 100);
  const audits           = lhr.audits ?? {};

  return NextResponse.json({
    url,
    performanceScore,
    lcp:        audits["largest-contentful-paint"]?.displayValue ?? null,
    cls:        audits["cumulative-layout-shift"]?.displayValue  ?? null,
    fid:        audits["max-potential-fid"]?.displayValue        ?? null,
    ttfb:       audits["server-response-time"]?.displayValue     ?? null,
    speedIndex: audits["speed-index"]?.displayValue              ?? null,
    opportunities: (lhr.audits ? Object.values(lhr.audits) : [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((a: any) => a.details?.type === "opportunity" && (a.details?.overallSavingsMs ?? 0) > 300)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
      .slice(0, 3)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((a: any) => ({
        id:      a.id,
        title:   a.title,
        savings: a.details?.overallSavingsMs
          ? `${(a.details.overallSavingsMs / 1000).toFixed(1)}s potential saving`
          : null,
      })),
  });
}
