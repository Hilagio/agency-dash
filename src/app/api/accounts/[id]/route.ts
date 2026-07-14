/**
 * PATCH /api/accounts/[id] — update account fields
 * DELETE /api/accounts/[id] — remove account and all related data
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const existing = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!existing) return forbidden();

  const body = await req.json() as Partial<{
    industry:           string | null;
    monthlyBudget:      number | null;
    name:               string;
    clientContext:      string | null;
    targetRoas:         number | null;
    targetCpa:          number | null;
    grossMarginPercent: number | null;
    leadToSaleRate:     number | null;
    landingPageUrl:     string | null;
    country:            string | null;
    businessModel:      string | null;
    monthlyChurnRate:   number | null;
    slackChannelId:     string | null;
    slackChannelName:   string | null;
    peerGroupId:        string | null;
    merchantCenterId:   string | null;
    // ─── Account Ownership System ───────────────────────────────────────────
    archived:              boolean;
    ownerId:               string | null;
    ownershipEnabled:      boolean;
    primaryKpi:            "ROAS" | "CPA" | null;
    targetValue:           number | null;
    tolYellowPct:          number;
    tolRedPct:             number;
    pacingGreenMin:        number;
    pacingGreenMax:        number;
    pacingYellowMin:       number;
    pacingYellowMax:       number;
    reviewFrequencyDays:   number;
    minSpendForEval:       number;
    minConversionsForEval: number;
  }>;

  // Validate a supplied ownerId belongs to this org (avoid cross-org linkage).
  if (body.ownerId) {
    const owner = await prisma.owner.findFirst({ where: { id: body.ownerId, organizationId: ctx.orgId } });
    if (!owner) return NextResponse.json({ error: "owner not found in this organization" }, { status: 422 });
  }

  const account = await prisma.account.update({
    where: { id },
    data: {
      ...(body.industry           !== undefined && { industry:           body.industry }),
      ...(body.monthlyBudget      !== undefined && { monthlyBudget:      body.monthlyBudget }),
      ...(body.name               !== undefined && { name:               body.name }),
      ...(body.clientContext      !== undefined && { clientContext:      body.clientContext }),
      ...(body.targetRoas         !== undefined && { targetRoas:         body.targetRoas }),
      ...(body.targetCpa          !== undefined && { targetCpa:          body.targetCpa }),
      ...(body.grossMarginPercent !== undefined && { grossMarginPercent: body.grossMarginPercent }),
      ...(body.leadToSaleRate     !== undefined && { leadToSaleRate:     body.leadToSaleRate }),
      ...(body.landingPageUrl     !== undefined && { landingPageUrl:     body.landingPageUrl }),
      ...(body.country            !== undefined && { country:            body.country }),
      ...(body.businessModel      !== undefined && { businessModel:      body.businessModel }),
      ...(body.monthlyChurnRate   !== undefined && { monthlyChurnRate:   body.monthlyChurnRate }),
      ...(body.slackChannelId     !== undefined && { slackChannelId:     body.slackChannelId }),
      ...(body.slackChannelName   !== undefined && { slackChannelName:   body.slackChannelName }),
      ...(body.peerGroupId        !== undefined && { peerGroupId:        body.peerGroupId }),
      ...(body.merchantCenterId   !== undefined && { merchantCenterId:   body.merchantCenterId }),
      // Ownership config
      ...(body.archived              !== undefined && { archived:              body.archived }),
      ...(body.ownerId               !== undefined && { ownerId:               body.ownerId }),
      ...(body.ownershipEnabled      !== undefined && { ownershipEnabled:      body.ownershipEnabled }),
      ...(body.primaryKpi            !== undefined && { primaryKpi:            body.primaryKpi }),
      ...(body.targetValue           !== undefined && { targetValue:           body.targetValue }),
      ...(body.tolYellowPct          !== undefined && { tolYellowPct:          body.tolYellowPct }),
      ...(body.tolRedPct             !== undefined && { tolRedPct:             body.tolRedPct }),
      ...(body.pacingGreenMin        !== undefined && { pacingGreenMin:        body.pacingGreenMin }),
      ...(body.pacingGreenMax        !== undefined && { pacingGreenMax:        body.pacingGreenMax }),
      ...(body.pacingYellowMin       !== undefined && { pacingYellowMin:       body.pacingYellowMin }),
      ...(body.pacingYellowMax       !== undefined && { pacingYellowMax:       body.pacingYellowMax }),
      ...(body.reviewFrequencyDays   !== undefined && { reviewFrequencyDays:   body.reviewFrequencyDays }),
      ...(body.minSpendForEval       !== undefined && { minSpendForEval:       body.minSpendForEval }),
      ...(body.minConversionsForEval !== undefined && { minConversionsForEval: body.minConversionsForEval }),
    },
  });

  return NextResponse.json(account);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const existing = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!existing) return forbidden();

  // Delete in dependency order (no cascade configured in schema)
  await prisma.$transaction([
    prisma.chatMessage.deleteMany({
      where: { session: { accountId: id } },
    }),
    prisma.chatSession.deleteMany({ where: { accountId: id } }),
    prisma.accountNote.deleteMany({ where: { accountId: id } }),
    prisma.accountSopProgress.deleteMany({ where: { accountId: id } }),
    prisma.actionRecommendation.deleteMany({ where: { accountId: id } }),
    prisma.constraintSnapshot.deleteMany({ where: { accountId: id } }),
    // Ownership system children (escalations reference actions, so go first)
    prisma.escalation.deleteMany({ where: { accountId: id } }),
    prisma.ownershipAction.deleteMany({ where: { accountId: id } }),
    prisma.review.deleteMany({ where: { accountId: id } }),
    prisma.exception.deleteMany({ where: { accountId: id } }),
    prisma.accountStatus.deleteMany({ where: { accountId: id } }),
    prisma.accountSlackState.deleteMany({ where: { accountId: id } }),
    prisma.account.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
