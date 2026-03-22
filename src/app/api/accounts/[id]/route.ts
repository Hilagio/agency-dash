/**
 * PATCH /api/accounts/[id] — update account fields (industry, monthlyBudget, name)
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json() as Partial<{
    industry:      string | null;
    monthlyBudget: number | null;
    name:          string;
  }>;

  const account = await prisma.account.update({
    where: { id },
    data: {
      ...(body.industry      !== undefined && { industry:      body.industry }),
      ...(body.monthlyBudget !== undefined && { monthlyBudget: body.monthlyBudget }),
      ...(body.name          !== undefined && { name:          body.name }),
    },
  });

  return NextResponse.json(account);
}
