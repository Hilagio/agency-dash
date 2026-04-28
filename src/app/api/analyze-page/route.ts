/**
 * POST /api/analyze-page
 *
 * Fetches a prospect's landing/product page, extracts content, and streams
 * a structured CRO + Google Ads analysis for use on sales calls.
 */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthContext, unauthorized } from "@/lib/auth";

const client = new Anthropic();

function stripTags(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractContent(html: string) {
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<svg[\s\S]*?<\/svg>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "");

  const title = clean.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1]?.trim() ?? "";

  const metaDesc =
    clean.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i)?.[1] ??
    clean.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i)?.[1] ??
    "";

  const h1s = [...clean.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
    .map(m => stripTags(m[1])).filter(Boolean).slice(0, 3);
  const h2s = [...clean.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)]
    .map(m => stripTags(m[1])).filter(t => t.length > 2 && t.length < 120).slice(0, 12);
  const h3s = [...clean.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)]
    .map(m => stripTags(m[1])).filter(t => t.length > 2 && t.length < 120).slice(0, 8);

  const buttons = [...clean.matchAll(/<button[^>]*>([\s\S]*?)<\/button>/gi)]
    .map(m => stripTags(m[1])).filter(t => t.length > 1 && t.length < 60).slice(0, 10);
  const ctaLinks = [...clean.matchAll(/<a[^>]*>([\s\S]*?)<\/a>/gi)]
    .map(m => stripTags(m[1])).filter(t => t.length > 2 && t.length < 60).slice(0, 20);

  const bodyText = stripTags(
    clean
      .replace(/<nav[\s\S]*?<\/nav>/gi, "")
      .replace(/<header[\s\S]*?<\/header>/gi, "")
      .replace(/<footer[\s\S]*?<\/footer>/gi, "")
      .replace(/<aside[\s\S]*?<\/aside>/gi, "")
  ).slice(0, 6000);

  const trustSignals = {
    hasReviews:     /review|rating|stars|trustpilot|kiyoh|feedback|beoordelingen/i.test(html),
    hasGuarantee:   /guarantee|garanti|money.back|retour|teruggave|not satisfied/i.test(html),
    hasShipping:    /shipping|bezorg|gratis.*levering|free.*deliver|verzend/i.test(html),
    hasPhone:       /\+\d{2}[\s-]?\d{7,}|\(\d{2,}\)[\s-]?\d+|tel:/i.test(html),
    hasLiveChat:    /livechat|live.?chat|intercom|drift|zendesk|tidio|crisp/i.test(html),
    hasVideo:       /<video|youtube\.com\/embed|vimeo\.com\/video|player\.vimeo/i.test(html),
    hasFaq:         /faq|frequently asked|veelgestelde|common question/i.test(html),
    hasUrgency:     /countdown|limited.*stock|beperkt.*voorraad|only \d+ left|ends in/i.test(html),
    hasSocialProof: /\d[\d,]+\s*(customers|clients|orders|bestellingen|reviews)|joined by/i.test(html),
    hasPrice:       /<.*price|prijs|€[\d,.]+|\$[\d,.]+|£[\d,.]+/i.test(html),
    hasBadges:      /badge|award|certified|keurmerk|winner|iso\s*\d+/i.test(html),
  };

  return { title, metaDesc, h1s, h2s, h3s, buttons, ctaLinks, bodyText, trustSignals };
}

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { url } = await req.json() as { url: string };

  let normalized = url?.trim();
  if (!normalized) return NextResponse.json({ error: "URL required" }, { status: 400 });
  if (!normalized.startsWith("http")) normalized = `https://${normalized}`;

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(normalized);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Fetch the page server-side (bypasses CORS)
  let html: string;
  try {
    const res = await Promise.race([
      fetch(normalized, {
        headers: {
          "User-Agent":      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          "Accept":          "text/html,application/xhtml+xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,nl;q=0.8",
        },
      }),
      new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Page fetch timed out (10s)")), 10_000)),
    ]);
    if (!res.ok) throw new Error(`Page returned HTTP ${res.status}`);
    html = await res.text();
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to fetch page" }, { status: 422 });
  }

  const c = extractContent(html);
  const domain = parsedUrl.hostname;

  const ts = c.trustSignals;
  const trustLines = [
    ts.hasReviews     ? "Reviews/ratings: YES" : "Reviews/ratings: MISSING",
    ts.hasGuarantee   ? "Money-back/returns: YES" : "Money-back/returns: MISSING",
    ts.hasShipping    ? "Shipping info: YES" : "Shipping info: MISSING",
    ts.hasPhone       ? "Phone number: YES" : "Phone number: MISSING",
    ts.hasLiveChat    ? "Live chat: YES" : "Live chat: MISSING",
    ts.hasVideo       ? "Video: YES" : "Video: MISSING",
    ts.hasFaq         ? "FAQ: YES" : "FAQ: MISSING",
    ts.hasUrgency     ? "Urgency/scarcity: YES" : "Urgency/scarcity: MISSING",
    ts.hasSocialProof ? "Social proof numbers: YES" : "Social proof numbers: MISSING",
    ts.hasPrice       ? "Pricing visible: YES" : "Pricing visible: MISSING",
    ts.hasBadges      ? "Trust badges/awards: YES" : "Trust badges/awards: MISSING",
  ].join("\n");

  const ctaSet = [...new Set([...c.buttons, ...c.ctaLinks])].filter(Boolean).slice(0, 15);

  const userPrompt = `DOMAIN: ${domain}
URL: ${normalized}
PAGE TITLE: ${c.title || "MISSING"}
META DESCRIPTION: ${c.metaDesc || "MISSING — bad for Quality Score"}
H1: ${c.h1s.join(" | ") || "MISSING"}
H2s: ${c.h2s.join(" | ") || "none found"}
H3s: ${c.h3s.join(" | ") || "none found"}
CTAs / BUTTONS: ${ctaSet.join(" | ") || "none detected"}

TRUST SIGNAL SCAN:
${trustLines}

PAGE TEXT SAMPLE:
${c.bodyText}`;

  const systemPrompt = `You are the senior CRO and Google Ads specialist at Ecomtrada, a high-performance Dutch performance marketing agency. You are analyzing a prospect's page before a sales call.

Your job: give this prospect 5–6 specific "aha moments" that prove you understood their business in 60 seconds — and show what you'd fix on Day 1.

Write EXACTLY these five sections with these exact headers:

## Quick Assessment
2 sentences. What they sell, what type of page this is, and the single biggest conversion problem visible at a glance. Be blunt.

## Quick Wins
5 specific things fixable in under a day that would immediately lift conversion. Each item must:
- Name the exact element (quote what you see or note what's absent)
- Say why it's hurting conversions
- Give the specific fix — include suggested copy or structure where useful

## What's Missing
4–5 conversion elements that are absent but that serious competitors have. Each item: what's missing, why it matters, and what it's costing them in conversion rate.

## Google Ads Alignment
4 specific observations for someone running Google Ads to this page:
- Above-the-fold: would someone clicking a Google Ad immediately know they landed in the right place?
- Search intent match: does the copy match commercial intent keywords?
- CTA for cold paid traffic: is it appropriate for someone who doesn't know the brand yet?
- Quality Score signals: title tag, meta description, page relevance, load signals

## Priority Actions
The 3 highest-impact changes, ranked:
**1. [action name]** — [expected impact on CVR] | Effort: Low/Medium/High
**2. [action name]** — [expected impact on CVR] | Effort: Low/Medium/High
**3. [action name]** — [expected impact on CVR] | Effort: Low/Medium/High

RULES:
- Every point must reference something you actually see or confirm is missing on THIS page. Zero generic advice.
- 450 words max total.
- Tone: senior peer talking to another specialist. Confident, direct, zero fluff.
- If something looks good, say so briefly — don't only criticize.`;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const aiStream = client.messages.stream({
          model:      "claude-sonnet-4-6",
          max_tokens: 1200,
          system:     systemPrompt,
          messages:   [{ role: "user", content: userPrompt }],
        });

        for await (const chunk of aiStream) {
          if (chunk.type === "content_block_delta" && chunk.delta.type === "text_delta") {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Analysis failed";
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: msg })}\n\n`));
        controller.close();
      }
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type":  "text/event-stream",
      "Cache-Control": "no-cache",
      Connection:      "keep-alive",
    },
  });
}
