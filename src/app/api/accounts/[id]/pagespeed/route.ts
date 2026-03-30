/**
 * GET /api/accounts/[id]/pagespeed
 *
 * Runs a Google PageSpeed Insights check against the account's landing page URL.
 * No API key required — uses the public PSI endpoint (rate-limited by IP).
 * Results are not stored; caller should cache client-side if needed.
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

  const psiUrl = `${PSI_ENDPOINT}?url=${encodeURIComponent(url)}&strategy=mobile&category=performance`;

  let psiRes: Response;
  try {
    psiRes = await fetch(psiUrl, {
      headers: { "Accept": "application/json" },
      // PSI typically takes 5–15s — give it 30s before timeout
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
    performanceScore,                                                        // 0–100
    lcp:         audits["largest-contentful-paint"]?.displayValue   ?? null, // e.g. "2.3 s"
    cls:         audits["cumulative-layout-shift"]?.displayValue    ?? null, // e.g. "0.12"
    fid:         audits["max-potential-fid"]?.displayValue          ?? null, // e.g. "210 ms"
    ttfb:        audits["server-response-time"]?.displayValue       ?? null, // e.g. "240 ms"
    speedIndex:  audits["speed-index"]?.displayValue                ?? null, // e.g. "3.5 s"
    opportunities: (lhr.audits ? Object.values(lhr.audits) : [])
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((a: any) => a.details?.type === "opportunity" && (a.details?.overallSavingsMs ?? 0) > 300)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .sort((a: any, b: any) => (b.details?.overallSavingsMs ?? 0) - (a.details?.overallSavingsMs ?? 0))
      .slice(0, 3)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((a: any) => ({
        id:          a.id,
        title:       a.title,
        description: a.description,
        savings:     a.details?.overallSavingsMs
          ? `${(a.details.overallSavingsMs / 1000).toFixed(1)}s potential saving`
          : null,
      })),
  });
}
