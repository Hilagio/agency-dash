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
  }>;

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
    prisma.account.delete({ where: { id } }),
  ]);

  return NextResponse.json({ ok: true });
}
