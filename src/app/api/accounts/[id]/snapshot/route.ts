/**
 * GET  /api/accounts/[id]/snapshot — latest snapshot for an account
 * POST /api/accounts/[id]/snapshot — run scoring engine on provided signals
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals } from "@/lib/engine/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;

  const snapshot = await prisma.constraintSnapshot.findFirst({
    where: { accountId: id },
    orderBy: { createdAt: "desc" },
    include: {
      actions: { orderBy: { impact: "asc" } },
    },
  });

  if (!snapshot) {
    return NextResponse.json({ error: "No snapshot found" }, { status: 404 });
  }

  return NextResponse.json(snapshot);
}

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const signals: ConstraintSignals = await req.json();

  const account = await prisma.account.findUnique({ where: { id } });
  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  const result = scoreConstraints(signals);

  const snapshot = await prisma.constraintSnapshot.create({
    data: {
      accountId: id,
      rawSignals: JSON.stringify(signals),
      scoreMeasurement: result.buckets.find((b) => b.bucket === "MEASUREMENT")!.score,
      scoreTraffic:     result.buckets.find((b) => b.bucket === "TRAFFIC")!.score,
      scoreConversion:  result.buckets.find((b) => b.bucket === "CONVERSION")!.score,
      scoreFunnel:      result.buckets.find((b) => b.bucket === "FUNNEL")!.score,
      scoreEconomics:   result.buckets.find((b) => b.bucket === "ECONOMICS")!.score,
      governingConstraint: result.governingConstraint,
      constraintReason: result.constraintReason,
      actions: {
        create: result.recommendations.slice(0, 8).map((r) => ({
          accountId: id,
          bucket: r.bucket,
          title: r.title,
          description: r.description,
          impact: r.impact,
          effort: r.effort,
          safeToAutomate: r.safeToAutomate,
          actionType: r.actionType,
          actionPayload: r.actionPayload ? JSON.stringify(r.actionPayload) : null,
          isEscalation: r.isEscalation,
        })),
      },
    },
    include: { actions: true },
  });

  return NextResponse.json(snapshot, { status: 201 });
}
