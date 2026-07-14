/**
 * POST /api/diagnostics/ingest — pull the diagnostic spine from Google Ads.
 *
 * Triggers:
 *  1. Session (manual) — ingests the caller's organization.
 *  2. Nightly cron — Authorization: Bearer $CRON_SECRET — ingests every org with
 *     Google Ads connected.
 *
 * Body (optional): { "days": 14 } — trailing window to (re)fetch. Use a larger
 * value (e.g. 90) for a first back-fill.
 */
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import { ingestOrgSpine } from "@/lib/diagnostics/ingest";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

function isCronRequest(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`
      || req.headers.get("x-cron-secret") === secret;
}

async function readDays(req: NextRequest): Promise<number> {
  const body = await req.json().catch(() => ({}));
  const d = Number(body?.days);
  return Number.isFinite(d) && d > 0 && d <= 365 ? Math.floor(d) : 14;
}

function summarize(results: Awaited<ReturnType<typeof ingestOrgSpine>>) {
  return {
    accounts: results.length,
    failed: results.filter(r => r.error).map(r => ({ accountId: r.accountId, error: r.error })),
    totals: results.reduce(
      (t, r) => ({
        metrics: t.metrics + r.metrics, products: t.products + r.products,
        searchTerms: t.searchTerms + r.searchTerms, changeEvents: t.changeEvents + r.changeEvents,
      }),
      { metrics: 0, products: 0, searchTerms: 0, changeEvents: 0 },
    ),
  };
}

export async function POST(req: NextRequest) {
  const days = await readDays(req);

  if (isCronRequest(req)) {
    const orgs = await prisma.oAuthCredential.findMany({ select: { organizationId: true } });
    const results = [];
    for (const o of orgs) results.push({ organizationId: o.organizationId, ...summarize(await ingestOrgSpine(o.organizationId, days)) });
    return NextResponse.json({ mode: "cron", days, orgs: results.length, results });
  }

  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const results = await ingestOrgSpine(ctx.orgId, days);
  return NextResponse.json({ mode: "manual", days, ...summarize(results) });
}
