/**
 * POST /api/accounts/[id]/ads/generate
 * Streams AI-generated RSA headline and description variants using Claude.
 *
 * Body: {
 *   adId: string;
 *   campaignName: string;
 *   adGroupName: string;
 *   headlines: string[];       // current headlines (text only)
 *   descriptions: string[];    // current descriptions (text only)
 *   accountName: string;
 *   industry: string | null;
 *   targetCpa: number | null;
 *   targetRoas: number | null;
 * }
 */
import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const body = await req.json() as {
    campaignName: string;
    adGroupName:  string;
    headlines:    string[];
    descriptions: string[];
    lowPerfHeadlines?: string[];
    lowPerfDescriptions?: string[];
  };

  const systemPrompt = `You are an expert Google Ads copywriter specialising in Responsive Search Ads (RSAs).

Account: ${account.name}
Industry: ${account.industry ?? "unspecified"}
Campaign: ${body.campaignName}
Ad group: ${body.adGroupName}

RSA rules:
- Headlines: 30 characters maximum each
- Descriptions: 90 characters maximum each
- Do NOT repeat words/phrases across headlines
- Must be distinct — each headline or description should cover a unique angle
- Avoid superlatives unless they're factual (e.g. "#1 rated" only if true)
- No punctuation at the end of headlines
- Do not include the brand name in every headline (Google auto-pins it if linked)`;

  const userMsg = `Current RSA assets:

HEADLINES (current):
${body.headlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}

DESCRIPTIONS (current):
${body.descriptions.map((d, i) => `${i + 1}. ${d}`).join("\n")}
${body.lowPerfHeadlines && body.lowPerfHeadlines.length > 0 ? `
LOW-PERFORMING HEADLINES (replace these):
${body.lowPerfHeadlines.map((h, i) => `${i + 1}. ${h}`).join("\n")}` : ""}
${body.lowPerfDescriptions && body.lowPerfDescriptions.length > 0 ? `
LOW-PERFORMING DESCRIPTIONS (replace these):
${body.lowPerfDescriptions.map((d, i) => `${i + 1}. ${d}`).join("\n")}` : ""}

Generate:
1. 5 new headline variants (max 30 chars each) that would improve ad strength — cover different angles (benefit, USP, CTA, urgency, social proof)
2. 2 new description variants (max 90 chars each) — one benefit-focused, one CTA-focused

Format your response exactly like this:
HEADLINES:
1. [headline text]
2. [headline text]
3. [headline text]
4. [headline text]
5. [headline text]

DESCRIPTIONS:
1. [description text]
2. [description text]

Then add a brief note (2-3 sentences) explaining the strategy behind your suggestions.`;

  const stream = await client.messages.stream({
    model:      "claude-sonnet-5",
    max_tokens: 1024,
    system:     systemPrompt,
    messages:   [{ role: "user", content: userMsg }],
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type":  "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
