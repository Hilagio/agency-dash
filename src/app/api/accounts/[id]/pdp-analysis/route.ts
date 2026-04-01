/**
 * POST /api/accounts/[id]/pdp-analysis
 *
 * Fetches any product detail page URL and audits it for ecommerce PDP
 * best practices. Handles JS-rendered pages (Shopify, etc.) by working
 * from JSON-LD Product schema, meta tags, and detected tools.
 *
 * Body: { url: string }
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { extractPageContext } from "@/lib/pageContext";

type Params = { params: Promise<{ id: string }> };

const anthropic = new Anthropic();

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: { name: true, industry: true },
  });
  if (!account) return forbidden();

  const body = await req.json().catch(() => ({}));
  const url: string = (body.url ?? "").trim();

  if (!url || !url.startsWith("http")) {
    return NextResponse.json({ error: "Provide a valid product page URL." }, { status: 400 });
  }

  // ── Fetch & extract page signals ──────────────────────────────────────────
  let pageCtx: ReturnType<typeof extractPageContext>;
  try {
    const pageRes = await fetch(url, {
      headers: {
        "User-Agent":                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept":                    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
        "Accept-Language":           "en-US,en;q=0.9",
        "Accept-Encoding":           "gzip, deflate, br",
        "Cache-Control":             "no-cache",
        "Pragma":                    "no-cache",
        "Sec-Fetch-Dest":            "document",
        "Sec-Fetch-Mode":            "navigate",
        "Sec-Fetch-Site":            "none",
        "Sec-Fetch-User":            "?1",
        "Upgrade-Insecure-Requests": "1",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!pageRes.ok) {
      const hint = pageRes.status === 403
        ? "The site is blocking automated requests (bot protection). Try a different product URL, or check if the store is password-protected."
        : "Check the URL is publicly accessible.";
      return NextResponse.json(
        { error: `HTTP ${pageRes.status} — ${hint}` },
        { status: 400 }
      );
    }

    const raw = await pageRes.text();
    pageCtx = extractPageContext(raw.slice(0, 100_000), url);
    console.log(`[pdp-analysis] ${url} — jsRendered=${pageCtx.isJsRendered} platform=${pageCtx.platform} tools=${pageCtx.tools.join(",")}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Could not reach ${url}: ${msg}` }, { status: 400 });
  }

  // ── Build Claude prompt ───────────────────────────────────────────────────
  const clientCtx = [
    account.name && `Client: ${account.name}`,
    account.industry && `Industry: ${account.industry}`,
  ].filter(Boolean).join(" | ");

  const prompt = `You are a senior ecommerce CRO specialist auditing a product detail page (PDP) receiving paid traffic from Google Shopping / Google Ads.
${clientCtx ? `\nClient context: ${clientCtx}\n` : ""}
Page signals:
${pageCtx.summary}

Audit these 11 PDP areas. For JS-rendered pages where visual layout cannot be assessed, use JSON-LD Product schema, meta tags, and detected third-party tools as evidence. Do not penalise for things you simply cannot see.

Areas to assess:
1. Above the fold — product name, price, CTA visible without scrolling?
2. Product images — count, zoom/360/video signals, quality indicators
3. Pricing — clear price, sale/was-now anchoring, currency
4. Add to cart / Buy now — CTA prominence, friction (mandatory login?)
5. Social proof — reviews, ratings, UGC (check for review tool integrations)
6. Trust signals — shipping, returns, guarantees, payment icons
7. Product description — benefits vs specs, scannable, complete
8. Urgency / scarcity — stock warnings, countdown, "X viewing"
9. Schema markup — Product structured data present and complete?
10. Mobile experience — viewport, touch targets, layout signals
11. Upsell / cross-sell — related / frequently bought together

${pageCtx.isJsRendered ? `IMPORTANT: JS-rendered page — body is empty at fetch time. Base assessments on JSON-LD, meta tags, and detected tools: ${pageCtx.tools.join(", ") || "none detected"}. If a review platform is in the tools list, mark social proof as present. Mark checks as "cannot_assess" only when there is truly no signal at all.` : ""}

Respond with ONLY valid JSON (no markdown):
{
  "score": <integer 0-100>,
  "checks": [
    { "area": <short label>, "status": "good"|"warning"|"missing"|"cannot_assess", "note": <1 sentence> }
  ],
  "issues": [{ "severity": "high"|"medium"|"low", "text": <under 120 chars> }],
  "topRecommendation": <1-2 sentences — most impactful improvement>
}

Include all 11 areas in checks. Max 5 issues. Score: 80+ strong, 60-79 gaps, 40-59 significant, <40 major problems.`;

  let analysis: {
    score: number;
    checks: { area: string; status: "good" | "warning" | "missing" | "cannot_assess"; note: string }[];
    issues: { severity: "high" | "medium" | "low"; text: string }[];
    topRecommendation: string;
  };

  try {
    const message = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      messages:   [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    analysis = JSON.parse(cleaned);
  } catch (err) {
    console.error("[pdp-analysis] Claude parse error:", err);
    return NextResponse.json(
      { error: "AI analysis failed to produce a valid result. Try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ...analysis, isJsRendered: pageCtx.isJsRendered });
}
