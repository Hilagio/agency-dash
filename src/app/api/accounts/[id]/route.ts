/**
 * PATCH /api/accounts/[id] — update account fields (industry, monthlyBudget, name)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  // Verify account belongs to org
  const existing = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!existing) return forbidden();

  const body = await req.json() as Partial<{
    industry:      string | null;
    monthlyBudget: number | null;
    name:          string;
    clientContext: string | null;
  }>;

  const account = await prisma.account.update({
    where: { id },
    data: {
      ...(body.industry      !== undefined && { industry:      body.industry }),
      ...(body.monthlyBudget !== undefined && { monthlyBudget: body.monthlyBudget }),
      ...(body.name          !== undefined && { name:          body.name }),
      ...(body.clientContext !== undefined && { clientContext: body.clientContext }),
    },
  });

  return NextResponse.json(account);
}
