import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized } from "@/lib/auth";

function minScore(snap: { scoreMeasurement: number; scoreTraffic: number; scoreConversion: number; scoreFunnel: number; scoreEconomics: number }) {
  return Math.min(snap.scoreMeasurement, snap.scoreTraffic, snap.scoreConversion, snap.scoreFunnel, snap.scoreEconomics);
}

const SNAP_SELECT = {
  id: true,
  createdAt: true,
  rawSignals: true,
  governingConstraint: true,
  constraintReason: true,
  scoreMeasurement: true,
  scoreTraffic: true,
  scoreConversion: true,
  scoreFunnel: true,
  scoreEconomics: true,
} as const;

export async function GET() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const [accounts, members] = await Promise.all([
    prisma.account.findMany({
      where: { organizationId: ctx.orgId },
      orderBy: { name: "asc" },
      include: {
        snapshots: {
          orderBy: { createdAt: "desc" },
          take: 2,
          select: SNAP_SELECT,
        },
      },
    }),
    prisma.organizationMember.findMany({
      where: { organizationId: ctx.orgId },
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ]);

  const userMap = new Map(members.map(m => [m.userId, m.user.name || m.user.email]));

  return NextResponse.json(accounts.map((a) => {
    const snap = a.snapshots[0];
    const prev = a.snapshots[1];

    let roas = 0, budgetUtil = 0, spend30d = 0;
    if (snap?.rawSignals) {
      try {
        const raw = JSON.parse(snap.rawSignals) as {
          economics?: { actualRoas?: number; budgetUtilizationPercent?: number; totalSpend?: number };
        };
        roas       = raw.economics?.actualRoas               ?? 0;
        budgetUtil = raw.economics?.budgetUtilizationPercent  ?? 0;
        spend30d   = raw.economics?.totalSpend               ?? 0;
      } catch { /* ignore */ }
    }

    const currentScore  = snap ? minScore(snap) : null;
    const previousScore = prev ? minScore(prev) : null;
    const delta = currentScore !== null && previousScore !== null
      ? Math.round(currentScore - previousScore)
      : null;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rawSignals: _, ...snapOut } = snap ?? {} as typeof snap;
    return {
      ...a,
      assignedUserName: a.assignedUserId ? (userMap.get(a.assignedUserId) ?? null) : null,
      snapshots: snap ? [{ ...snapOut, roas, budgetUtil, spend30d }] : [],
      scoreDelta: delta,
      prevScoredAt: prev?.createdAt ?? null,
      targetRoas: a.targetRoas ?? null,
    };
  }));
}
