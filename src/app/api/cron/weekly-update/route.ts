/**
 * POST /api/cron/weekly-update — the Monday cadence that makes the weekly
 * update impossible to forget. Each call generates the update for ONE due
 * account (active, has a live plan, no Weekly Update in the last 6 days) and
 * reports how many remain — the workflow loops until remaining is 0. One
 * account per request on purpose: that's the memory posture that keeps the
 * container alive (lesson from the nightly-crash incident).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { generateWeeklyUpdate } from "@/lib/weekly/generate";

export const dynamic = "force-dynamic";
export const maxDuration = 180;

function isCron(req: NextRequest): boolean {
  const s = process.env.CRON_SECRET;
  if (!s) return false;
  return req.headers.get("authorization") === `Bearer ${s}` || req.headers.get("x-cron-secret") === s;
}

export async function POST(req: NextRequest) {
  if (!isCron(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const cutoff = new Date(Date.now() - 6 * 86_400_000);
  const planned = await prisma.planInstance.findMany({
    where: { account: { archived: false, active: true } },
    select: { accountId: true },
  });
  if (!planned.length) return NextResponse.json({ generated: null, remaining: 0 });

  const recent = await prisma.generatedDoc.findMany({
    where: { accountId: { in: planned.map(p => p.accountId) }, docType: "Weekly Update", createdAt: { gte: cutoff } },
    select: { accountId: true },
  });
  const covered = new Set(recent.map(r => r.accountId));
  const due = planned.map(p => p.accountId).filter(a => !covered.has(a));
  if (!due.length) return NextResponse.json({ generated: null, remaining: 0 });

  // Random pick: if one account fails persistently it must not block the rest
  // (the route is stateless, so ordered picking would retry the same failer).
  const target = due[Math.floor(Math.random() * due.length)];
  try {
    await generateWeeklyUpdate(target, { createdBy: "weekly-cron" });
    return NextResponse.json({ generated: target, remaining: due.length - 1 });
  } catch (err) {
    // Report the failure but keep the loop moving — one bad account must not
    // starve the rest. The workflow logs the error per account.
    return NextResponse.json({ generated: null, failed: target, error: err instanceof Error ? err.message : String(err), remaining: due.length - 1 });
  }
}
