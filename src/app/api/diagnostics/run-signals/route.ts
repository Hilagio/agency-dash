/**
 * POST /api/diagnostics/run-signals — run the signal library over the spine and
 * persist a status per account. Session (caller's org) or CRON_SECRET (all orgs).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { computeOrgSignals } from "@/lib/diagnostics/run-signals";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isCron(req: NextRequest): boolean {
  const s = process.env.CRON_SECRET;
  return !!s && (req.headers.get("authorization") === `Bearer ${s}` || req.headers.get("x-cron-secret") === s);
}

function summarize(results: Awaited<ReturnType<typeof computeOrgSignals>>) {
  const counts = { red: 0, yellow: 0, green: 0 };
  let signals = 0, opportunities = 0, unverified = 0;
  for (const r of results) {
    counts[r.status]++;
    signals += r.signals.filter(s => s.kind === "problem").length;
    opportunities += r.signals.filter(s => s.kind === "opportunity").length;
    if (!r.dataVerified) unverified++;
  }
  return { accounts: results.length, counts, signals, opportunities, unverified };
}

export async function POST(req: NextRequest) {
  if (isCron(req)) {
    const orgs = await prisma.account.findMany({ where: { active: true }, select: { organizationId: true }, distinct: ["organizationId"] });
    const results = [];
    for (const o of orgs) results.push({ organizationId: o.organizationId, ...summarize(await computeOrgSignals(o.organizationId)) });
    return NextResponse.json({ mode: "cron", orgs: results.length, results });
  }
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  return NextResponse.json({ mode: "manual", ...summarize(await computeOrgSignals(ctx.orgId)) });
}
