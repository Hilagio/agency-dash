/**
 * POST /api/accounts/[id]/report — generate the monthly client report.
 *
 * Computes one month of real numbers server-side (Google Ads + Shopify), asks
 * Opus for the narrative only, and renders the fixed house template. Streamed
 * as SSE so the generation never idles the gateway into a 502.
 * Body: { language?: "nl"|"en", month?: "YYYY-MM" } — month defaults to the
 * previous full month.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { buildMonthlyReportData, REPORT_SYSTEM } from "@/lib/report/generate";
import { renderReportHtml } from "@/lib/report/render";
import type { ReportContent, ReportLanguage } from "@/lib/report/types";

export const dynamic = "force-dynamic";
export const maxDuration = 300;
type Params = { params: Promise<{ id: string }> };

const client = new Anthropic();

function extractJson(text: string): ReportContent | null {
  let s = text.trim();
  const fence = s.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) s = fence[1].trim();
  const a = s.indexOf("{"), b = s.lastIndexOf("}");
  if (a < 0 || b <= a) return null;
  try { return JSON.parse(s.slice(a, b + 1)) as ReportContent; } catch { return null; }
}

/** Previous full month, "YYYY-MM". */
function defaultMonth(): string {
  const d = new Date();
  d.setUTCDate(0); // last day of previous month
  return d.toISOString().slice(0, 7);
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const body = await req.json().catch(() => ({})) as { language?: ReportLanguage; month?: string };
  const month = /^\d{4}-\d{2}$/.test(body.month ?? "") ? body.month! : defaultMonth();
  const lang = body.language === "nl" || body.language === "en" ? body.language : undefined;

  const built = await buildMonthlyReportData(id, ctx.orgId, month, lang);
  if (!built) return forbidden();
  const { data, dataBlock } = built;

  const userMsg = `DATA (computed from the live sources — every figure you may cite is here):\n${dataBlock}\n\nWrite the monthly report narrative for ${data.client} in ${data.language === "nl" ? "Dutch" : "English"}. Return only the JSON object.`;

  const encoder = new TextEncoder();
  const send = (c: ReadableStreamDefaultController, o: unknown) => c.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { status: "generating" });
        const generate = async (extraNudge?: string) => {
          const s = client.messages.stream({
            model: "claude-opus-4-8",
            max_tokens: 8_000,
            thinking: { type: "disabled" },
            system: REPORT_SYSTEM,
            messages: [{ role: "user", content: extraNudge ? `${userMsg}\n\n${extraNudge}` : userMsg }],
          });
          let acc = "", ticks = 0, stopReason: string | null = null;
          for await (const ev of s) {
            if (ev.type === "content_block_delta" && ev.delta.type === "text_delta") {
              acc += ev.delta.text;
              if (++ticks % 12 === 0) send(controller, { status: "writing", chars: acc.length });
            }
            if (ev.type === "message_delta" && ev.delta.stop_reason) stopReason = ev.delta.stop_reason;
          }
          return { acc, stopReason };
        };
        let { acc, stopReason } = await generate();
        let content = extractJson(acc);
        if (!content) {
          send(controller, { status: "retrying" });
          ({ acc, stopReason } = await generate(
            stopReason === "max_tokens"
              ? "IMPORTANT: your previous attempt exceeded the output limit. Keep every paragraph to 1-2 tight sentences."
              : "IMPORTANT: your previous attempt was not valid JSON. Return ONLY the JSON object — no prose, no code fences.",
          ));
          content = extractJson(acc);
        }
        if (!content) { send(controller, { error: "The model returned an unusable narrative. Try again." }); controller.close(); return; }
        const html = renderReportHtml(content, data);
        send(controller, { done: true, html, month: data.month });
      } catch (err) {
        send(controller, { error: err instanceof Error ? err.message : "Report generation failed" });
      } finally {
        controller.close();
      }
    },
  });

  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}
