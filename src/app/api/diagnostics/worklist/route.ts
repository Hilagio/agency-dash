/**
 * POST /api/diagnostics/worklist — generate the overnight agentic worklist.
 *
 * For every flagged account, a bounded agent investigates and writes ONE
 * worklist item (next action + time + PPC OS skill). Runs AFTER run-signals in
 * the nightly refresh. Session (caller's org) or CRON_SECRET (all orgs).
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { generateOrgWorklist } from "@/lib/diagnostics/worklist";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isCron(req: NextRequest): boolean {
  const s = process.env.CRON_SECRET;
  return !!s && (req.headers.get("authorization") === `Bearer ${s}` || req.headers.get("x-cron-secret") === s);
}

export async function POST(req: NextRequest) {
  if (isCron(req)) {
    const orgs = await prisma.account.findMany({ where: { active: true }, select: { organizationId: true }, distinct: ["organizationId"] });
    const results = [];
    for (const o of orgs) results.push({ organizationId: o.organizationId, ...(await generateOrgWorklist(o.organizationId)) });
    return NextResponse.json({ mode: "cron", orgs: results.length, results });
  }
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  return NextResponse.json({ mode: "manual", ...(await generateOrgWorklist(ctx.orgId)) });
}
