/**
 * POST /api/accounts/[id]/landing-analysis
 *
 * Fetches the account's landing page HTML and asks Claude to review it for
 * conversion readiness from a Google Ads perspective. Returns a structured
 * CRO assessment with score, issues, strengths, and a top recommendation.
 *
 * No external API key needed — uses the existing Anthropic SDK.
 * Results are not persisted; re-run to refresh.
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
    select: { landingPageUrl: true, name: true, industry: true },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accountExtra = account as any;

  if (!account) return forbidden();

  const url = account.landingPageUrl?.trim();
  if (!url) {
    return NextResponse.json(
      { error: "No landing page URL set. Add one in the account targets panel." },
      { status: 400 }
    );
  }

  // ── Fetch the landing page ────────────────────────────────────────────────
  let html: string;
  try {
    const pageRes = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; AgencyDash/1.0; CRO-Audit)",
        "Accept":     "text/html,application/xhtml+xml",
      },
      signal: AbortSignal.timeout(15_000),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      redirect: "follow" as any,
    });

    if (!pageRes.ok) {
      return NextResponse.json(
        { error: `Could not fetch the landing page (HTTP ${pageRes.status}). Check the URL is publicly accessible.` },
        { status: 400 }
      );
    }

    const raw = await pageRes.text();
    // Keep first 60 KB — the most conversion-relevant content is near the top
    html = raw.slice(0, 60_000);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[landing-analysis] fetch failed for ${url}:`, msg);
    return NextResponse.json(
      { error: `Could not reach ${url}: ${msg}` },
      { status: 400 }
    );
  }

  // ── Ask Claude to review it ───────────────────────────────────────────────
  const context = [
    account.name && `Client: ${account.name}`,
    account.industry && `Industry: ${account.industry}`,
    accountExtra.businessModel && `Business model: ${accountExtra.businessModel}`,
  ].filter(Boolean).join(" | ");

  const prompt = `You are a senior CRO (Conversion Rate Optimisation) specialist reviewing a landing page that receives traffic from Google Ads.

${context ? `Context: ${context}\n` : ""}URL: ${url}

HTML:
\`\`\`html
${html}
\`\`\`

Review this landing page for conversion readiness from a paid traffic perspective. Focus on:
- Value proposition: is it clear, specific, above the fold?
- CTA: is there a clear primary action? Is it prominent?
- Trust signals: reviews, guarantees, logos, social proof
- Mobile experience: viewport, font sizes, touch targets, layout
- Page weight signals: excessive scripts, unoptimised images (from <script>, <img> tags)
- Message match: does it likely match ad intent for the stated industry/model?
- Friction: popups, mandatory fields, confusing navigation

Respond with ONLY valid JSON matching this exact shape (no markdown, no explanation):
{
  "score": <integer 0-100>,
  "mobileReady": <true|false>,
  "strengths": [<up to 3 short strings, each under 80 chars>],
  "issues": [
    { "severity": "high"|"medium"|"low", "text": <string under 100 chars> }
  ],
  "topRecommendation": <single most impactful improvement, 1-2 sentences>
}

Score guide: 80+ = strong CRO, 60-79 = good but fixable gaps, 40-59 = significant issues, <40 = major problems. Limit issues to the 4 most impactful.`;

  let analysis: {
    score: number;
    mobileReady: boolean;
    strengths: string[];
    issues: { severity: "high" | "medium" | "low"; text: string }[];
    topRecommendation: string;
  };

  try {
    const message = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",   // fast + cheap for structured extraction
      max_tokens: 800,
      messages:   [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    analysis = JSON.parse(cleaned);
  } catch (err) {
    console.error("[landing-analysis] Claude parse error:", err);
    return NextResponse.json(
      { error: "AI analysis failed to produce a valid result. Try again." },
      { status: 502 }
    );
  }

  return NextResponse.json(analysis);
}
