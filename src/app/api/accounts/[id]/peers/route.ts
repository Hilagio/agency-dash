/**
 * GET /api/accounts/[id]/peers
 *
 * Returns all peer accounts for this account within the same organisation.
 * Peers are determined by:
 *   1. Explicit peer group: same peerGroupId (if set on this account)
 *   2. Auto-detection: same industry + country (fallback when no peerGroupId)
 *
 * INTERNAL ONLY — never expose to clients.
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { ConstraintSignals } from "@/lib/engine/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
  });
  if (!account) return forbidden();

  // Build the peer filter
  const whereClause =
    account.peerGroupId
      ? { organizationId: ctx.orgId, peerGroupId: account.peerGroupId, id: { not: id } }
      : account.industry && account.country
        ? { organizationId: ctx.orgId, industry: account.industry, country: account.country, id: { not: id } }
        : null;

  if (!whereClause) {
    return NextResponse.json({ peers: [], matchMode: "none" });
  }

  const peerAccounts = await prisma.account.findMany({
    where: whereClause,
    select: {
      id: true,
      name: true,
      industry: true,
      country: true,
      businessModel: true,
      currency: true,
      targetRoas: true,
      targetCpa: true,
      grossMarginPercent: true,
      monthlyBudget: true,
      peerGroupId: true,
      snapshots: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          createdAt: true,
          scoreMeasurement: true,
          scoreTraffic: true,
          scoreConversion: true,
          scoreFunnel: true,
          scoreEconomics: true,
          governingConstraint: true,
          constraintReason: true,
          rawSignals: true,
        },
      },
    },
  });

  // Parse key signals for each peer (non-fatal if rawSignals is malformed)
  const peers = peerAccounts.map(p => {
    const snap = p.snapshots[0] ?? null;
    let signals: ConstraintSignals | null = null;
    try {
      if (snap?.rawSignals) signals = JSON.parse(snap.rawSignals) as ConstraintSignals;
    } catch { /* ignore */ }

    return {
      id:             p.id,
      name:           p.name,
      industry:       p.industry,
      country:        p.country,
      businessModel:  p.businessModel,
      currency:       p.currency,
      targetRoas:     p.targetRoas,
      targetCpa:      p.targetCpa,
      peerGroupId:    p.peerGroupId,
      snapshot: snap ? {
        scoredAt:            snap.createdAt,
        scoreMeasurement:    snap.scoreMeasurement,
        scoreTraffic:        snap.scoreTraffic,
        scoreConversion:     snap.scoreConversion,
        scoreFunnel:         snap.scoreFunnel,
        scoreEconomics:      snap.scoreEconomics,
        governingConstraint: snap.governingConstraint,
        constraintReason:    snap.constraintReason,
        // Extracted key metrics
        metrics: signals ? {
          ctr:              signals.traffic.clickThroughRate,
          isLostBudget:     signals.traffic.impressionShareLost_budget,
          isLostRank:       signals.traffic.impressionShareLost_rank,
          impressionShare:  signals.traffic.searchImpressionShare,
          cvr:              signals.conversion.conversionRate,
          actualRoas:       signals.economics.actualRoas,
          actualCpa:        signals.economics.actualCpa,
          budgetUtil:       signals.economics.budgetUtilizationPercent,
          avgCpc:           signals.traffic.averageCpc,
          qualityScoreAvg:  signals.traffic.qualityScoreAvg,
          qualityScoreCount:signals.traffic.qualityScoreCount,
        } : null,
      } : null,
    };
  });

  // Also return this account's own snapshot for comparison reference
  const ownSnap = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
  });
  let ownSignals: ConstraintSignals | null = null;
  try {
    if (ownSnap?.rawSignals) ownSignals = JSON.parse(ownSnap.rawSignals) as ConstraintSignals;
  } catch { /* ignore */ }

  const ownMetrics = ownSignals ? {
    ctr:              ownSignals.traffic.clickThroughRate,
    isLostBudget:     ownSignals.traffic.impressionShareLost_budget,
    isLostRank:       ownSignals.traffic.impressionShareLost_rank,
    impressionShare:  ownSignals.traffic.searchImpressionShare,
    cvr:              ownSignals.conversion.conversionRate,
    actualRoas:       ownSignals.economics.actualRoas,
    actualCpa:        ownSignals.economics.actualCpa,
    budgetUtil:       ownSignals.economics.budgetUtilizationPercent,
    avgCpc:           ownSignals.traffic.averageCpc,
    qualityScoreAvg:  ownSignals.traffic.qualityScoreAvg,
    qualityScoreCount:ownSignals.traffic.qualityScoreCount,
  } : null;

  return NextResponse.json({
    matchMode: account.peerGroupId ? "group" : "auto",
    peerGroupId: account.peerGroupId ?? null,
    own: {
      id:    account.id,
      name:  account.name,
      snapshot: ownSnap ? {
        scoredAt:            ownSnap.createdAt,
        scoreMeasurement:    ownSnap.scoreMeasurement,
        scoreTraffic:        ownSnap.scoreTraffic,
        scoreConversion:     ownSnap.scoreConversion,
        scoreFunnel:         ownSnap.scoreFunnel,
        scoreEconomics:      ownSnap.scoreEconomics,
        governingConstraint: ownSnap.governingConstraint,
        constraintReason:    ownSnap.constraintReason,
        metrics: ownMetrics,
      } : null,
    },
    peers,
  });
}
