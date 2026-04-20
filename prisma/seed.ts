/**
 * Seed: creates two demo accounts with realistic constraint snapshots.
 * Run with: npx prisma db seed
 */
import "dotenv/config";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { scoreConstraints } from "../src/lib/engine";
import { ConstraintSignals } from "../src/lib/engine/types";

const rawUrl = process.env["DATABASE_URL"] ?? "file:./dev.db";
const url = rawUrl.startsWith("file:")
  ? `file:${path.resolve(process.cwd(), rawUrl.slice(5))}`
  : rawUrl;
const adapter = new PrismaBetterSqlite3({ url });
const prisma = new PrismaClient({ adapter });

// ─── Demo signal sets ─────────────────────────────────────────────────────────

const acme_signals: ConstraintSignals = {
  measurement: {
    conversionTrackingActive: true,
    conversionActionsCount: 3,
    hasEnhancedConversions: false,   // ← weakness
    enhancedConversionsDegraded: false,
    tagCoveragePercent: 0.92,
    dateLagDays: 3,
    hasGa4Linked: true,
    hasMerchantCenterLinked: false,
    staleConversionCount: 0,
    neverFiredConversionCount: 0,
  },
  traffic: {
    impressionShareLost_budget: 0.38,  // ← biggest traffic problem
    impressionShareLost_rank: 0.15,
    clickThroughRate: 0.048,
    clickThroughRateBaseline: 0.051,
    averageCpc: 2.4,
    searchImpressionShare: 0.47,
    qualityScoreAvg: 7.2,
    qualityScoreCount: 120,
    productDisapprovalRate: 0,
    irrelevantQueryPercent: 0.22,
    isPmaxPrimary: false,
    pmaxDisplayYoutubePercent: 0,
    budgetConstrainedCampaigns: [],
    zeroImpressionAdGroupCount: 0,
    zeroImpressionAdGroupNames: [],
    wastedKeywordSpend: 0,
    wastedKeywordSpendRatio: 0,
    isDemandCeiling: false,
  },
  conversion: {
    conversionRate: 0.032,
    conversionRateBaseline: 0.034,
    industryBenchmarkConversionRate: 0.035,
    landingPageScore: 7,
    mobileSpeedScore: 68,
    bounceRateEstimate: 0.52,
  },
  funnel: {
    costPerLead: 45,
    targetCostPerLead: 40,
    leadToSaleRate: 0.22,
    averageLeadQualityScore: 7,
    offlineConversionImportActive: false,
  },
  economics: {
    targetRoas: 4.0,
    actualRoas: 3.6,
    actualRoasBaseline: 3.9,
    targetCpa: 0,
    actualCpa: 0,
    actualCpaBaseline: 0,
    grossMarginPercent: 0.42,
    ltv: 850,
    budgetUtilizationPercent: 0.88,
    avgOrderValue: 0,
    monthlyChurnRate: 0,
  },
};

const nova_signals: ConstraintSignals = {
  measurement: {
    conversionTrackingActive: false, // ← critical
    conversionActionsCount: 0,
    hasEnhancedConversions: false,
    enhancedConversionsDegraded: false,
    tagCoveragePercent: 0.6,
    dateLagDays: 0,
    hasGa4Linked: false,
    hasMerchantCenterLinked: false,
    staleConversionCount: 0,
    neverFiredConversionCount: 0,
  },
  traffic: {
    impressionShareLost_budget: 0.1,
    impressionShareLost_rank: 0.12,
    clickThroughRate: 0.06,
    clickThroughRateBaseline: 0,
    averageCpc: 1.8,
    searchImpressionShare: 0.78,
    qualityScoreAvg: 8.1,
    qualityScoreCount: 0,
    productDisapprovalRate: 0.03,
    irrelevantQueryPercent: 0.08,
    isPmaxPrimary: false,
    pmaxDisplayYoutubePercent: 0,
    budgetConstrainedCampaigns: [],
    zeroImpressionAdGroupCount: 0,
    zeroImpressionAdGroupNames: [],
    wastedKeywordSpend: 0,
    wastedKeywordSpendRatio: 0,
    isDemandCeiling: false,
  },
  conversion: {
    conversionRate: 0.0,
    conversionRateBaseline: 0,
    industryBenchmarkConversionRate: 0.025,
    landingPageScore: 6,
    mobileSpeedScore: 74,
    bounceRateEstimate: 0.58,
  },
  funnel: {
    costPerLead: 0,
    targetCostPerLead: 30,
    leadToSaleRate: 0,
    averageLeadQualityScore: 5,
    offlineConversionImportActive: false,
  },
  economics: {
    targetRoas: 5.0,
    actualRoas: 0,
    actualRoasBaseline: 0,
    targetCpa: 25,
    actualCpa: 0,
    actualCpaBaseline: 0,
    grossMarginPercent: 0.55,
    ltv: 1200,
    budgetUtilizationPercent: 0.62,
    avgOrderValue: 0,
    monthlyChurnRate: 0,
  },
};

// Bootstrap org ID — matches the migration that assigns legacy data
const BOOTSTRAP_ORG_ID = "clbootstrap0000000000000001";

async function main() {
  console.log("Seeding demo accounts…");

  // Ensure bootstrap org exists
  await prisma.organization.upsert({
    where: { id: BOOTSTRAP_ORG_ID },
    update: {},
    create: { id: BOOTSTRAP_ORG_ID, name: "Demo Agency", slug: "demo-agency" },
  });

  // Account 1: Acme Co — Traffic constraint
  const acme = await prisma.account.upsert({
    where: { googleAdsId: "123-456-7890" },
    update: {},
    create: {
      organizationId: BOOTSTRAP_ORG_ID,
      name: "Acme Co",
      googleAdsId: "123-456-7890",
      currency: "USD",
      monthlyBudget: 15000,
      industry: "SaaS",
    },
  });

  const acmeResult = scoreConstraints(acme_signals);
  await prisma.constraintSnapshot.create({
    data: {
      accountId: acme.id,
      rawSignals: JSON.stringify(acme_signals),
      scoreMeasurement: acmeResult.buckets.find((b) => b.bucket === "MEASUREMENT")!.score,
      scoreTraffic:     acmeResult.buckets.find((b) => b.bucket === "TRAFFIC")!.score,
      scoreConversion:  acmeResult.buckets.find((b) => b.bucket === "CONVERSION")!.score,
      scoreFunnel:      acmeResult.buckets.find((b) => b.bucket === "FUNNEL")!.score,
      scoreEconomics:   acmeResult.buckets.find((b) => b.bucket === "ECONOMICS")!.score,
      governingConstraint: acmeResult.governingConstraint,
      constraintReason: acmeResult.constraintReason,
      actions: {
        create: acmeResult.recommendations.slice(0, 6).map((r) => ({
          accountId: acme.id,
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

  // Account 2: Nova Health — Measurement constraint (critical)
  const nova = await prisma.account.upsert({
    where: { googleAdsId: "987-654-3210" },
    update: {},
    create: {
      organizationId: BOOTSTRAP_ORG_ID,
      name: "Nova Health",
      googleAdsId: "987-654-3210",
      currency: "USD",
      monthlyBudget: 8000,
      industry: "Healthcare",
    },
  });

  const novaResult = scoreConstraints(nova_signals);
  await prisma.constraintSnapshot.create({
    data: {
      accountId: nova.id,
      rawSignals: JSON.stringify(nova_signals),
      scoreMeasurement: novaResult.buckets.find((b) => b.bucket === "MEASUREMENT")!.score,
      scoreTraffic:     novaResult.buckets.find((b) => b.bucket === "TRAFFIC")!.score,
      scoreConversion:  novaResult.buckets.find((b) => b.bucket === "CONVERSION")!.score,
      scoreFunnel:      novaResult.buckets.find((b) => b.bucket === "FUNNEL")!.score,
      scoreEconomics:   novaResult.buckets.find((b) => b.bucket === "ECONOMICS")!.score,
      governingConstraint: novaResult.governingConstraint,
      constraintReason: novaResult.constraintReason,
      actions: {
        create: novaResult.recommendations.slice(0, 6).map((r) => ({
          accountId: nova.id,
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

  console.log("✓ Seeded: Acme Co (governing constraint:", acmeResult.governingConstraint + ")");
  console.log("✓ Seeded: Nova Health (governing constraint:", novaResult.governingConstraint + ")");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
