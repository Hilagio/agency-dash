/**
 * POST /api/accounts/[id]/crawl-brief
 *
 * Fetches the account's landing page URL, strips HTML to plain text,
 * and uses Claude to generate a pre-filled Account Brief.
 *
 * Returns: { brief: string }
 */

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

function stripHtml(html: string): string {
  return html
    // Remove scripts, styles, nav, footer, header wholesale
    .replace(/<(script|style|nav|footer|header|noscript|svg|iframe)[^>]*>[\s\S]*?<\/\1>/gi, " ")
    // Remove all remaining tags
    .replace(/<[^>]+>/g, " ")
    // Decode common HTML entities
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, " ")
    // Collapse whitespace
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!account) return forbidden();

  const url = account.landingPageUrl;
  if (!url) {
    return NextResponse.json(
      { error: "No landing page URL set — add it in Account Targets first." },
      { status: 400 }
    );
  }

  // Fetch the page
  let pageText = "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; AgencyDash/1.0)" },
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const html = await res.text();
    pageText = stripHtml(html).slice(0, 12_000); // cap to ~3k tokens
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `Could not fetch ${url}: ${msg}` },
      { status: 502 }
    );
  }

  // Ask Claude to extract the brief
  const client = new Anthropic();
  const message = await client.messages.create({
    model:      "claude-sonnet-4-6",
    max_tokens: 600,
    messages: [{
      role:    "user",
      content: `You are filling in an account brief for a Google Ads agency. Based on this website content, write a concise brief in plain text (no markdown, no bullet symbols — just clean lines). Cover exactly these points:

1. What they sell (products/services, niche, price range if visible)
2. Target audience
3. Key USPs and differentiators (max 3)
4. Any seasonal or promotional context visible on the page

Keep it factual, under 120 words. Do not include Target CPA / ROAS — that is filled separately. Do not guess — only include what is clearly on the page.

Website content:
${pageText}`,
    }],
  });

  const brief = (message.content[0] as { type: string; text: string }).text.trim();

  return NextResponse.json({ brief });
}
