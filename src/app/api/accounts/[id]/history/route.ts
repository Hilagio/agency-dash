/**
 * GET /api/accounts/[id]/history
 * Returns up to 30 snapshots ordered oldest→newest for trend charting.
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

  const snapshots = await prisma.constraintSnapshot.findMany({
    where: { accountId: id },
    orderBy: { createdAt: "asc" },
    take: 30,
    select: {
      id: true,
      createdAt: true,
      scoreMeasurement: true,
      scoreTraffic: true,
      scoreConversion: true,
      scoreFunnel: true,
      scoreEconomics: true,
      governingConstraint: true,
    },
  });

  return NextResponse.json(snapshots);
}
