/**
 * POST /api/accounts/[id]/plan — generate the 90-day client plan.
 *
 * Gathers the account's live spine (Google Ads + Shopify) + the Client Context
 * Pack, asks Opus to fill the structured plan, and renders it in the ecomtrada
 * house style with charts drawn from real numbers. Streamed as SSE so the long
 * Opus generation never idles the gateway into a 502.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { buildPlanInputs, PLAN_SYSTEM } from "@/lib/plan/generate";
import { renderPlanHtml } from "@/lib/plan/render";
import type { PlanContent, PlanLanguage } from "@/lib/plan/types";

export const dynamic = "force-dynamic";
export const maxDuration = 180;
type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

function extractJson(text: string): PlanContent | null {
  let s = text.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(s.slice(a, b + 1)) as PlanContent; } catch { return null; }
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const body = await req.json().catch(() => ({})) as { language?: PlanLanguage };
  const inputs = await buildPlanInputs(id, ctx.orgId, body.language === "nl" || body.language === "en" ? body.language : undefined);
  if (!inputs) return forbidden();

  const userMsg = `CLIENT CONTEXT PACK:\n${inputs.contextBlock}\n\nLIVE DATA:\n${inputs.dataBlock}\n\nWrite the 90-day plan for ${inputs.account.name} in ${inputs.language === "nl" ? "Dutch" : "English"}. Return only the JSON object.`;

  const encoder = new TextEncoder();
  const send = (c: ReadableStreamDefaultController, o: unknown) => c.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { status: inputs.hasMakeOrBreak ? "generating" : "generating_no_makeorbreak" });
        const anthropicStream = client.messages.stream({
          model: "claude-opus-4-8",
          max_tokens: 4096,
          system: PLAN_SYSTEM,
          messages: [{ role: "user", content: userMsg }],
        });
        let acc = "", ticks = 0;
        for await (const ev of anthropicStream) {
          if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
            acc += ev.delta.text;
            if (++ticks % 12 === 0) send(controller, { status: "writing", chars: acc.length }); // keep-alive
          }
        }
        const plan = extractJson(acc);
        if (!plan) { send(controller, { error: "The model returned an unparseable plan. Try again." }); controller.close(); return; }
        plan.language = inputs.language;
        plan.client = inputs.account.name;
        const html = renderPlanHtml(plan, inputs.charts);
        send(controller, { done: true, html, plan });
      } catch (err) {
        send(controller, { error: err instanceof Error ? err.message : "Plan generation failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}
