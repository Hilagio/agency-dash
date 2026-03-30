/**
 * POST /api/accounts/[id]/pdp-analysis
 *
 * Fetches any product detail page URL and asks Claude to audit it
 * specifically for ecommerce PDP best practices from a paid traffic perspective.
 *
 * Body: { url: string }
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

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

  // ── Fetch the product page ─────────────────────────────────────────────────
  let html: string;
  try {
    const pageRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AgencyDash/1.0; PDP-Audit)",
        "Accept":     "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!pageRes.ok) {
      return NextResponse.json(
        { error: `Could not fetch the page (HTTP ${pageRes.status}). Check the URL is publicly accessible.` },
        { status: 400 }
      );
    }

    const raw = await pageRes.text();
    html = raw.slice(0, 60_000);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Could not reach ${url}: ${msg}` }, { status: 400 });
  }

  // ── Ask Claude to audit it ────────────────────────────────────────────────
  const context = [
    account.name && `Client: ${account.name}`,
    account.industry && `Industry: ${account.industry}`,
  ].filter(Boolean).join(" | ");

  const prompt = `You are a senior ecommerce CRO specialist auditing a product detail page (PDP) that receives paid traffic from Google Shopping and Google Ads.

${context ? `Context: ${context}\n` : ""}URL: ${url}

HTML:
\`\`\`html
${html}
\`\`\`

Audit this product page specifically for ecommerce PDP best practices. Evaluate each of these areas:

1. **Above-the-fold**: Is the product name, price, and primary CTA visible without scrolling on mobile?
2. **Product images**: How many images? Any zoom, 360°, or video signals in the HTML? Adequate alt text?
3. **Pricing**: Is the price prominent? Any sale/was-now anchoring? Clear currency?
4. **Add to cart / Buy now**: Is the CTA prominent and above the fold? Sticky on scroll? Any friction (mandatory account login)?
5. **Social proof**: Star ratings, review count, customer photos, UGC visible on the page?
6. **Trust signals**: Shipping time/cost, return policy, guarantees, secure payment icons visible?
7. **Product description**: Clear benefits (not just specs)? Scannable with bullets? Completeness?
8. **Urgency / scarcity**: Stock level warnings, countdown timers, "X people viewing"?
9. **Schema markup**: Does the HTML include Product structured data (schema.org/Product)?
10. **Mobile experience**: Viewport set? Font sizes reasonable? Touch-friendly buttons?
11. **Upsell / cross-sell**: Frequently bought together, related products visible?

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "score": <integer 0-100>,
  "checks": [
    { "area": <short label>, "status": "good"|"warning"|"missing", "note": <1 sentence> }
  ],
  "issues": [
    { "severity": "high"|"medium"|"low", "text": <string under 120 chars> }
  ],
  "topRecommendation": <single most impactful improvement for this PDP, 1-2 sentences>
}

Score guide: 80+ = strong PDP, 60-79 = good with gaps, 40-59 = significant issues hurting conversion, <40 = major problems. Include all 11 areas in checks. Limit issues to the 5 most impactful.`;

  let analysis: {
    score: number;
    checks: { area: string; status: "good" | "warning" | "missing"; note: string }[];
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

  return NextResponse.json(analysis);
}
