/**
 * GET  /api/accounts/[id]/snapshot        — latest snapshot for an account
 * POST /api/accounts/[id]/snapshot        — score from provided signals (manual/test)
 * POST /api/accounts/[id]/snapshot?source=google-ads — score from live Google Ads API
 */
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { ConstraintSignals } from "@/lib/engine/types";
import { fetchGoogleAdsSignals, isGoogleAdsConfigured, extractGoogleAdsError } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

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

  // Re-run the deterministic scorer from rawSignals to recover per-bucket signal strings.
  let bucketSignals: Record<string, string[]> = {};
  if (snapshot.rawSignals) {
    try {
      const signals = JSON.parse(snapshot.rawSignals) as ConstraintSignals;
      const result  = scoreConstraints(signals);
      bucketSignals = Object.fromEntries(result.buckets.map(b => [b.bucket, b.signals]));
    } catch { /* ignore */ }
  }

  return NextResponse.json({ ...snapshot, bucketSignals });
}

export async function POST(req: NextRequest, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  const { id } = await params;
  const source = new URL(req.url).searchParams.get("source");

  const account = await prisma.account.findFirst({ where: { id, organizationId: ctx.orgId } });
  if (!account) return forbidden();

  let signals: ConstraintSignals;

  if (source === "google-ads") {
    if (!(await isGoogleAdsConfigured(ctx.orgId))) {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const acct = account as any;
      signals = await fetchGoogleAdsSignals(
        account.googleAdsId,
        account.industry,
        ctx.orgId,
        acct.country ?? null,
        acct.businessModel ?? null,
      );
    } catch (err) {
      const msg = extractGoogleAdsError(err);
      console.error(`[snapshot] fetchGoogleAdsSignals failed for account ${id} (googleAdsId=${account.googleAdsId})`, msg, err);
      return NextResponse.json(
        { error: `Google Ads API error: ${msg}` },
        { status: 502 }
      );
    }
  } else {
    signals = await req.json() as ConstraintSignals;
  }

  // ─── Apply per-account targets (override API/placeholder values) ─────────
  // These are set by the user in account settings and take full precedence.
  if (account.targetRoas         != null) signals.economics.targetRoas         = account.targetRoas;
  if (account.targetCpa          != null) signals.economics.targetCpa          = account.targetCpa;
  if (account.grossMarginPercent != null) signals.economics.grossMarginPercent  = account.grossMarginPercent;
  if (account.leadToSaleRate     != null) signals.funnel.leadToSaleRate         = account.leadToSaleRate;
  // targetCpa doubles as targetCostPerLead for lead-gen accounts
  if (account.targetCpa          != null) signals.funnel.targetCostPerLead      = account.targetCpa;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const acctExtra = account as any;
  if (acctExtra.monthlyChurnRate != null) signals.economics.monthlyChurnRate    = acctExtra.monthlyChurnRate;

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
