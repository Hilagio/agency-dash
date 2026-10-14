/**
 * POST /api/accounts/[id]/weekly-update — generate the weekly update on demand.
 * SSE (keep-alives while the model writes) → { done, internal, client, saved }.
 * The internal text is the SOP weekly review for the team; the client text is
 * Slack/WhatsApp-ready and sendable as-is. Also saved to the library.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { generateWeeklyUpdate } from "@/lib/weekly/generate";

export const dynamic = "force-dynamic";
export const maxDuration = 180;
type Params = { params: Promise<{ id: string }> };

export async function POST(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId }, select: { id: true } });
  if (!account) return forbidden();

  const encoder = new TextEncoder();
  const send = (c: ReadableStreamDefaultController, o: unknown) => c.enqueue(encoder.encode(`data: ${JSON.stringify(o)}\n\n`));

  const stream = new ReadableStream({
    async start(controller) {
      try {
        send(controller, { status: "writing" });
        const r = await generateWeeklyUpdate(id, { createdBy: ctx.email, onTick: () => send(controller, { status: "writing" }) });
        send(controller, { done: true, internal: r.internal, client: r.client, savedId: r.savedId });
      } catch (err) {
        send(controller, { error: err instanceof Error ? err.message : "Weekly update failed" });
      } finally {
        controller.close();
      }
    },
  });
  return new NextResponse(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
