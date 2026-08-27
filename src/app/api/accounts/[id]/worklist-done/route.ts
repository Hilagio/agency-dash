/**
 * POST /api/accounts/[id]/worklist-done — tick (or untick) the account's nightly
 * worklist action. Body: { done: boolean }. Org-scoped. The nightly worklist run
 * clears this when it writes a new action, so "done" never carries over.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { computeAccountSignals } from "@/lib/diagnostics/run-signals";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Params = { params: Promise<{ id: string }> };

export async function POST(req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const done = !!body?.done;
  const source = body?.source === "cockpit" ? "cockpit" : "account";

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: {
      id: true, worklist: true, name: true, roasFloor: true, grossMarginPercent: true,
      minSpendForEval: true, minConversionsForEval: true, dataVerified: true,
    },
  });
  if (!account) return forbidden();

  const updated = await prisma.account.update({
    where: { id },
    data: done ? { worklistDoneAt: new Date(), worklistDoneBy: ctx.email } : { worklistDoneAt: null, worklistDoneBy: null },
    select: { worklistDoneAt: true, worklistDoneBy: true },
  });

  // A tick is a claim, not proof. From the cockpit (no conversation open) we
  // leave the claim in the agent's memory so its NEXT read verifies it against
  // fresh data instead of trusting the checkbox. The account page sends its own
  // visible verification message, so no note is written for that source.
  if (done && source === "cockpit") {
    let action = "today's worklist action";
    try { const w = account.worklist ? JSON.parse(account.worklist) : null; action = w?.action ?? w?.headline ?? action; } catch { /* keep default */ }
    await prisma.agentMessage.create({
      data: {
        accountId: id, role: "user", kind: "chat", author: ctx.email,
        content: `Marked today's action as done from the cockpit: "${action}". On your next read, verify against fresh data whether this actually resolved the underlying issue — if the numbers still show the problem, say so and keep it flagged.`,
      },
    }).catch(() => null);
  }

  // "Something was fixed" is exactly when the stored diagnosis goes stale —
  // recompute it from the data we already hold so the flag/status updates
  // immediately instead of waiting for the nightly. Best-effort.
  if (done) {
    await computeAccountSignals({
      id: account.id, name: account.name, roasFloor: account.roasFloor,
      grossMarginPercent: account.grossMarginPercent, minSpendForEval: account.minSpendForEval,
      minConversionsForEval: account.minConversionsForEval, dataVerified: account.dataVerified,
    }).catch(() => null);
  }

  return NextResponse.json({ doneAt: updated.worklistDoneAt, doneBy: updated.worklistDoneBy });
}
