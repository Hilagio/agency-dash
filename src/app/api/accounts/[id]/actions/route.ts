/**
 * GET /api/accounts/[id]/actions — list pending actions for the account
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  const actions = await prisma.actionRecommendation.findMany({
    where: { accountId: id, status: "PENDING" },
    orderBy: [{ impact: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(actions);
}
