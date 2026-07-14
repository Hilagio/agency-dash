/**
 * GET /api/ownership/overview
 *
 * Everything the "Today" dashboard needs in one call: per-account latest
 * ownership status, colour counts, the "needs attention today" list, and
 * freshness/health signals.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";
import type { RuleResult } from "@/lib/ownership/types";

export const dynamic = "force-dynamic";

type Colour = "green" | "yellow" | "red" | "unknown";
const RANK: Record<Colour, number> = { red: 0, yellow: 1, unknown: 2, green: 3 };

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const now = Date.now();

  const [accounts, notion, slack, ads] = await Promise.all([
    prisma.account.findMany({
      where: { organizationId: ctx.orgId, active: true, archived: false },
      include: {
        owner: { select: { name: true } },
        statusHistory: { orderBy: { computedAt: "desc" }, take: 1 },
        reviews: { orderBy: { reviewedAt: "desc" }, take: 1 },
      },
    }),
    prisma.notionConnection.findUnique({ where: { organizationId: ctx.orgId }, select: { lastSyncedAt: true } }),
    prisma.slackConnection.findUnique({ where: { organizationId: ctx.orgId }, select: { id: true } }),
    prisma.oAuthCredential.findUnique({ where: { organizationId: ctx.orgId }, select: { id: true } }),
  ]);

  const counts = { green: 0, yellow: 0, red: 0, unknown: 0 };
  const attention: Array<{
    id: string; name: string; clientName: string | null; ownerName: string | null;
    status: Colour; reason: string; reviewDue: boolean;
  }> = [];

  let lastRunAt: string | null = null;
  const enabled = accounts.filter(a => a.ownershipEnabled);

  for (const a of enabled) {
    const snap = a.statusHistory[0];
    const status: Colour = (snap?.status as Colour) ?? "unknown";
    counts[status]++;

    if (snap && (!lastRunAt || snap.computedAt.toISOString() > lastRunAt)) {
      lastRunAt = snap.computedAt.toISOString();
    }

    // Review due?
    const lastReview = a.reviews[0];
    const dueAt = lastReview ? lastReview.reviewedAt.getTime() + a.reviewFrequencyDays * 86_400_000 : 0;
    const reviewDue = !lastReview || now > dueAt;

    let reasons: RuleResult[] = [];
    try { reasons = snap ? (JSON.parse(snap.reasons) as RuleResult[]) : []; } catch { /* ignore */ }

    if (status === "red" || status === "yellow" || status === "unknown" || reviewDue) {
      const reason =
        reasons[0]?.message ??
        (status === "unknown" ? "Not yet evaluated." : reviewDue ? "Review is due." : "Needs attention.");
      attention.push({
        id: a.id, name: a.name, clientName: a.clientName ?? null,
        ownerName: a.owner?.name ?? null, status, reason, reviewDue,
      });
    }
  }

  attention.sort((x, y) => RANK[x.status] - RANK[y.status] || x.name.localeCompare(y.name));

  return NextResponse.json({
    counts,
    totalActive: accounts.length,
    enabled: enabled.length,
    attention,
    lastRunAt,
    lastNotionSyncAt: notion?.lastSyncedAt?.toISOString() ?? null,
    connections: { ads: !!ads, notion: !!notion, slack: !!slack },
  });
}
