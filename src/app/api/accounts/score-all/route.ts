/**
 * POST /api/accounts/score-all
 *
 * Scores all accounts in the database from live Google Ads data.
 * Returns a summary of successes and failures.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { scoreConstraints } from "@/lib/engine";
import { fetchGoogleAdsSignals, isGoogleAdsConfigured } from "@/lib/integrations/google-ads";

export async function POST() {
  if (!(await isGoogleAdsConfigured())) {
    return NextResponse.json(
      { error: "Google Ads not fully configured", authUrl: "/api/auth/google-ads" },
      { status: 422 }
    );
  }

  const accounts = await prisma.account.findMany({ select: { id: true, name: true, googleAdsId: true, industry: true } });

  const results = await Promise.allSettled(
    accounts.map(async (account) => {
      const signals = await fetchGoogleAdsSignals(account.googleAdsId, account.industry);
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

      return account.name;
    })
  );

  const succeeded = results.filter((r) => r.status === "fulfilled").map((r) => (r as PromiseFulfilledResult<string>).value);
  const failed    = results
    .map((r, i) => ({ r, account: accounts[i] }))
    .filter(({ r }) => r.status === "rejected")
    .map(({ r, account }) => ({
      name: account.name,
      error: (r as PromiseRejectedResult).reason instanceof Error
        ? (r as PromiseRejectedResult).reason.message
        : String((r as PromiseRejectedResult).reason),
    }));

  return NextResponse.json({ succeeded, failed }, { status: 200 });
}
