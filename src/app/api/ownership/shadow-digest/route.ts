/**
 * POST /api/ownership/shadow-digest
 *
 * Shadow-mode ownership run (AGENTS.md §8/§9): evaluate every ownership-enabled
 * account and post ONE internal digest to the ownership channel. Posts nothing
 * to client channels. Intended to run 07:00 daily (Europe/Amsterdam).
 *
 * Triggers:
 *  1. Session (manual) — runs the caller's organization.
 *  2. Nightly cron — `Authorization: Bearer $CRON_SECRET` (or `x-cron-secret`) —
 *     runs every org that has Slack connected.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { runShadowDigest } from "@/lib/ownership/run";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`
      || req.headers.get("x-cron-secret") === secret;
}

export async function POST(req: NextRequest) {
  if (isCronRequest(req)) {
    const orgs = await prisma.slackConnection.findMany({ select: { organizationId: true } });
    const results = [];
    for (const o of orgs) {
      try {
        results.push({ organizationId: o.organizationId, ...(await runShadowDigest(o.organizationId)) });
      } catch (err) {
        results.push({ organizationId: o.organizationId, error: err instanceof Error ? err.message : "unknown error" });
      }
    }
    return NextResponse.json({ mode: "cron", orgs: results.length, results });
  }

  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  try {
    const summary = await runShadowDigest(ctx.orgId);
    return NextResponse.json({ mode: "manual", ...summary });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "unknown error" }, { status: 500 });
  }
}
