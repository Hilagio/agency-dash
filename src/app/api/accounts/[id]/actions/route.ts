/**
 * GET /api/accounts/[id]/actions — list pending actions for the account
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const actions = await prisma.actionRecommendation.findMany({
    where: { accountId: id, status: "PENDING" },
    orderBy: [{ impact: "asc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(actions);
}
