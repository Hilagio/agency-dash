/**
 * POST /api/accounts/[id]/landing-analysis
 *
 * Fetches the account's landing page and asks Claude to review it for
 * conversion readiness from a Google Ads perspective.
 *
 * Handles JS-rendered pages (Shopify, Next.js, etc.) by extracting
 * JSON-LD structured data, meta tags, and third-party tool signals
 * rather than relying on body HTML that may be empty.
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
        ? "The site is blocking automated requests (bot protection). Check if the store is password-protected."
        : "Check the URL is publicly accessible.";
      return NextResponse.json(
        { error: `HTTP ${pageRes.status} — ${hint}` },
        { status: 400 }
      );
    }

    const raw = await pageRes.text();
    pageCtx = extractPageContext(raw.slice(0, 100_000), url);
    console.log(`[landing-analysis] ${url} — jsRendered=${pageCtx.isJsRendered} platform=${pageCtx.platform} tools=${pageCtx.tools.join(",")}`);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`[landing-analysis] fetch failed for ${url}:`, msg);
    return NextResponse.json({ error: `Could not reach ${url}: ${msg}` }, { status: 400 });
  }

  // ── Build Claude prompt ───────────────────────────────────────────────────
  const clientCtx = [
    account.name && `Client: ${account.name}`,
    account.industry && `Industry: ${account.industry}`,
    accountExtra.businessModel && `Business model: ${accountExtra.businessModel}`,
  ].filter(Boolean).join(" | ");

  const prompt = `You are a senior CRO specialist reviewing a landing page for a Google Ads account.
${clientCtx ? `\nClient context: ${clientCtx}\n` : ""}
Page signals:
${pageCtx.summary}

Review this page for conversion readiness. Evaluate:
- Value proposition: clear, specific, compelling?
- Primary CTA: prominent, above the fold, unambiguous?
- Trust signals: reviews, guarantees, social proof, brand credibility
- Mobile experience: viewport set, touch-friendly, fast load signals
- Message match: does the page match likely ad intent?
- Friction: unnecessary steps, popups, mandatory registration

${pageCtx.isJsRendered ? `CRITICAL — JS-RENDERED PAGE RULES (violations invalidate the analysis):
1. An empty HTML body is NORMAL for ${pageCtx.platform ?? "this"} stores. Do NOT include it as an issue under any wording.
2. Do not flag: empty body, missing SSR content, crawlability, client-side rendering, or anything about how the HTML is structured.
3. If a review tool is detected (${pageCtx.tools.filter(t => t.toLowerCase().includes("review")).join(", ") || "Yotpo/Trustpilot/Judge.me"}), social proof is PRESENT — do not list it as missing.
4. For visuals you cannot see (CTA placement, above-the-fold, image quality), mark as uncertain — never as a high-severity failure.
5. Only raise issues you can actually evidence from the data provided.` : ""}

Respond with ONLY valid JSON (no markdown, no explanation):
{
  "score": <integer 0-100>,
  "mobileReady": <true|false>,
  "strengths": [<up to 3 strings, each under 80 chars>],
  "issues": [{ "severity": "high"|"medium"|"low", "text": <under 100 chars> }],
  "topRecommendation": <1-2 sentences>
}

Score guide: 80+ strong, 60-79 good with gaps, 40-59 significant issues, <40 major problems. Max 4 issues.`;

  let analysis: {
    score: number;
    mobileReady: boolean;
    strengths: string[];
    issues: { severity: "high" | "medium" | "low"; text: string }[];
    topRecommendation: string;
  };

  try {
    const message = await anthropic.messages.create({
      model:      "claude-haiku-4-5-20251001",
      max_tokens: 800,
      messages:   [{ role: "user", content: prompt }],
    });

    const text = message.content
      .filter(b => b.type === "text")
      .map(b => (b as { type: "text"; text: string }).text)
      .join("");

    const cleaned = text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    analysis = JSON.parse(cleaned);
  } catch (err) {
    console.error("[landing-analysis] Claude parse error:", err);
    return NextResponse.json(
      { error: "AI analysis failed to produce a valid result. Try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ...analysis, isJsRendered: pageCtx.isJsRendered });
}
