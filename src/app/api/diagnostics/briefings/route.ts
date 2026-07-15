/**
 * POST /api/diagnostics/briefings — generate the portfolio morning briefing.
 *
 * For every flagged (red/yellow) account, produce a one-line agent opener from
 * already-stored data and persist it on the account. Runs AFTER run-signals in
 * the nightly refresh. Session (caller's org) or CRON_SECRET (all orgs).
 *
 * Sequential on purpose: one cheap model call per flagged account, no fan-out —
 * this is a nightly job, not a latency-sensitive path, and it keeps memory flat.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { generateAccountBriefing } from "@/lib/diagnostics/briefing";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isCron(req: NextRequest): boolean {
  const s = process.env.CRON_SECRET;
  return !!s && (req.headers.get("authorization") === `Bearer ${s}` || req.headers.get("x-cron-secret") === s);
}

async function run(where: { organizationId?: string }) {
  const accounts = await prisma.account.findMany({
    where: { ...where, active: true, archived: false },
    select: { id: true },
  });
  let generated = 0, cleared = 0, failed = 0;
  for (const a of accounts) {
    try {
      const r = await generateAccountBriefing(a.id);
      if (r?.text) generated++; else cleared++;
    } catch { failed++; }
  }
  return { accounts: accounts.length, generated, cleared, failed };
}

export async function POST(req: NextRequest) {
  if (isCron(req)) {
    const orgs = await prisma.account.findMany({ where: { active: true }, select: { organizationId: true }, distinct: ["organizationId"] });
    const results = [];
    for (const o of orgs) results.push({ organizationId: o.organizationId, ...(await run({ organizationId: o.organizationId })) });
    return NextResponse.json({ mode: "cron", orgs: results.length, results });
  }
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  return NextResponse.json({ mode: "manual", ...(await run({ organizationId: ctx.orgId })) });
}
