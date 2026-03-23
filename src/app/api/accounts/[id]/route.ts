/**
 * PATCH /api/accounts/[id] — update account fields
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
    },
  });

  return NextResponse.json(account);
}
