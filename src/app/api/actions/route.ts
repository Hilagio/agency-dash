/**
 * GET /api/actions — all pending action recommendations across all accounts.
 * Sorted by impact weight, then effort (quick wins first).
 * Used by the global action queue page.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const IMPACT_WEIGHT: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
const EFFORT_PENALTY: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

export async function GET() {
  const actions = await prisma.actionRecommendation.findMany({
    where: { status: "PENDING" },
    include: {
      account: { select: { id: true, name: true, googleAdsId: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  // Sort: quick wins (high impact + easy effort) first
  const sorted = actions.sort((a, b) => {
    const scoreA = IMPACT_WEIGHT[a.impact] - EFFORT_PENALTY[a.effort];
    const scoreB = IMPACT_WEIGHT[b.impact] - EFFORT_PENALTY[b.effort];
    return scoreB - scoreA;
  });

  return NextResponse.json(sorted);
}
