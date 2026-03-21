/**
 * GET  /api/accounts/[id]/snapshot        — latest snapshot for an account
 * POST /api/accounts/[id]/snapshot        — score from provided signals (manual/test)
 * POST /api/accounts/[id]/snapshot?source=google-ads — score from live Google Ads API
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals } from "@/lib/engine/types";
import { fetchGoogleAdsSignals, isGoogleAdsConfigured } from "@/lib/integrations/google-ads";

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
  const source = new URL(req.url).searchParams.get("source");

  const account = await prisma.account.findUnique({ where: { id } });
  if (!account) {
    return NextResponse.json({ error: "Account not found" }, { status: 404 });
  }

  let signals: ConstraintSignals;

  if (source === "google-ads") {
    // Pull live signals from the Google Ads API
    if (!isGoogleAdsConfigured()) {
      return NextResponse.json(
        {
          error: "Google Ads not fully configured",
          missing: [
            !process.env.GOOGLE_ADS_REFRESH_TOKEN  && "GOOGLE_ADS_REFRESH_TOKEN",
            !process.env.GOOGLE_ADS_CUSTOMER_ID    && "GOOGLE_ADS_CUSTOMER_ID",
          ].filter(Boolean),
          authUrl: "/api/auth/google-ads",
        },
        { status: 422 }
      );
    }

    try {
      signals = await fetchGoogleAdsSignals();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return NextResponse.json(
        { error: `Google Ads API error: ${msg}` },
        { status: 502 }
      );
    }
  } else {
    // Accept manually provided signals (for testing / manual override)
    signals = await req.json() as ConstraintSignals;
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
