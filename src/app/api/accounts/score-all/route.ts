/**
 * POST /api/accounts/score-all
 *
 * Scores all accounts in the org from live Google Ads data.
 * Returns a summary of successes and failures.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { fetchGoogleAdsSignals, isGoogleAdsConfigured, extractGoogleAdsError } from "@/lib/integrations/google-ads";
import { getAuthContext, unauthorized } from "@/lib/auth";

export async function POST() {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();

  if (!(await isGoogleAdsConfigured(ctx.orgId))) {
    return NextResponse.json(
      { error: "Google Ads not fully configured", authUrl: "/api/auth/google-ads" },
      { status: 422 }
    );
  }

  const accounts = await prisma.account.findMany({
    where: { organizationId: ctx.orgId },
    select: { id: true, name: true, googleAdsId: true, industry: true },
  });

  // Sequential — never parallel — to avoid OOM on Railway.
  // Each account's Google Ads rows are fetched, processed, and GC'd before
  // the next account begins.
  const succeeded: string[] = [];
  const failed: { name: string; error: string }[] = [];

  for (const account of accounts) {
    try {
      const signals = await fetchGoogleAdsSignals(account.googleAdsId, account.industry, ctx.orgId);
      const result  = scoreConstraints(signals);

      await prisma.constraintSnapshot.create({
        data: {
          accountId: account.id,
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
              accountId: account.id,
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
      });

      succeeded.push(account.name);
    } catch (err) {
      failed.push({
        name:  account.name,
        error: extractGoogleAdsError(err),
      });
    }
  }

  return NextResponse.json({ succeeded, failed }, { status: 200 });
}
