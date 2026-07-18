/**
 * POST /api/audit — run a standalone page audit on ANY url, no account needed.
 * The team's quick "how good is this page?" tool (prospects, competitors, a page
 * before it's a client). Session-authed; streams progress via SSE and returns the
 * full house-style report inline (ephemeral — nothing is stored).
 *
 * Body: { url, pageType?: "ecom"|"leadgen", offer?, intentSource? }.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { runPageAudit } from "@/lib/audit/run";
import { renderAuditHtml } from "@/lib/audit/report";
import type { PageType } from "@/lib/audit/personas";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

export async function POST(req: NextRequest) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const body = await req.json().catch(() => ({})) as { url?: string; pageType?: string; offer?: string; intentSource?: string };
  const url = (body.url || "").trim();
  if (!/^https?:\/\//i.test(url)) return NextResponse.json({ error: "Enter a full URL starting with http:// or https://." }, { status: 400 });
  const pageType: PageType = body.pageType === "leadgen" ? "leadgen" : "ecom";
  const offer = (body.offer || "").trim();
  const intentSource = (body.intentSource || "").trim();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (o: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));
      try {
        const result = await runPageAudit({ url, pageType, offer, intentSource }, (msg) => send({ status: msg }));
        const html = renderAuditHtml(result, new Date().toISOString().slice(0, 10));
        send({
          done: true, html,
          score: result.score, grade: result.grade, label: result.label,
          understand: result.understand, convert: result.convert, total: result.total,
          renderMode: result.renderMode, renderError: result.renderError,
        });
        controller.close();
      } catch (e) {
        send({ error: e instanceof Error ? e.message : "Audit failed." });
        controller.close();
      }
    },
  });
  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache", Connection: "keep-alive" } });
}
