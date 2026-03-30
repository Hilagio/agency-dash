/**
 * GET /api/accounts/[id]/pagespeed
 *
 * Runs a Google PageSpeed Insights check against the account's landing page URL.
 *
 * Auth: PAGESPEED_API_KEY env var (optional but strongly recommended).
 * The PageSpeed Insights API only accepts API keys — not OAuth Bearer tokens.
 * Create a free key at: console.cloud.google.com → APIs & Services → Credentials
 * → Create credentials → API key (restrict it to PageSpeed Insights API only).
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const PSI_ENDPOINT = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

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

  const apiKey = process.env.PAGESPEED_API_KEY ?? "";
  const keyParam = apiKey ? `&key=${apiKey}` : "";
  const psiUrl = `${PSI_ENDPOINT}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance${keyParam}`;

  console.log(`[pagespeed] checking ${url} ${apiKey ? "(authenticated)" : "(unauthenticated — may rate limit)"}`);

  let psiRes: Response;
  try {
    psiRes = await fetch(psiUrl, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(30_000),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[pagespeed] PSI request failed for ${url}:`, msg);
    return NextResponse.json({ error: `PageSpeed check failed: ${msg}` }, { status: 502 });
  }

  if (!psiRes.ok) {
    const body = await psiRes.text().catch(() => "");
    console.error(`[pagespeed] PSI returned ${psiRes.status} for ${url}:`, body.slice(0, 300));
    if (psiRes.status === 429) {
      return NextResponse.json(
        { error: "Rate limit hit — add PAGESPEED_API_KEY to Railway env vars. Create a free API key at console.cloud.google.com → APIs & Services → Credentials." },
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
