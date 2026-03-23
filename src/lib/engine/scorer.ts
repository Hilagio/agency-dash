/**
 * Constraint Scoring Engine — deterministic logic only.
 *
 * Philosophy:
 *  1. Score each bucket 0–100 (higher = healthier / less constrained).
 *  2. Find the lowest-scoring bucket that precedes all other buckets in
 *     the optimization sequence. That is the governing constraint.
 *  3. Surface the single most impactful actions for that bucket.
 *
 * This file contains NO AI — it is pure, testable business logic.
 */

import {
  BUCKET_ORDER,
  BucketScore,
  ConstraintBucket,
  ConstraintSignals,
  ScoringResult,
  ActionRecommendation,
} from "./types";
import { buildRecommendations } from "./recommendations";

// ─── Bucket Scorers ───────────────────────────────────────────────────────────

function scoreMeasurement(s: ConstraintSignals["measurement"]): BucketScore {
  const signals: string[] = [];
  let score = 100;

  if (!s.conversionTrackingActive) {
    score -= 50;
    signals.push("No active conversion tracking — all optimization is blind");
  }
  if (s.conversionActionsCount === 0) {
    score -= 20;
    signals.push("Zero conversion actions configured");
  }
  if (!s.hasEnhancedConversions) {
    score -= 10;
    signals.push("Enhanced conversions not enabled — losing signal quality");
  }
  if (s.hasEnhancedConversions && s.enhancedConversionsDegraded) {
    score -= 20;
    signals.push("Enhanced conversions enabled but conversion volume dropped ≥40% — likely broken");
  }
  if (s.tagCoveragePercent < 0.9) {
    const dropPct = Math.round((1 - s.tagCoveragePercent) * 100);
    score -= Math.min(20, dropPct);
    if (s.tagCoveragePercent < 0.5) {
      signals.push(`Conversion data dropped ${dropPct}% vs prior weeks — possible tracking breakage`);
    } else {
      signals.push(`Conversion volume ${dropPct}% below recent baseline — watch for tracking issues`);
    }
  }
  if (!s.hasGa4Linked) {
    score -= 5;
    signals.push("GA4 not linked — audience and engagement data missing");
  }
  if (s.dateLagDays > 7) {
    score -= 5;
    signals.push(`Attribution lag ${s.dateLagDays}d — recent data unreliable`);
  }

  return {
    bucket: "MEASUREMENT",
    score: Math.max(0, Math.round(score)),
    signals,
    isGoverning: false,
  };
}

function scoreTraffic(s: ConstraintSignals["traffic"]): BucketScore {
  const signals: string[] = [];
  let score = 100;

  // Budget-constrained IS loss is the clearest traffic constraint
  if (s.impressionShareLost_budget > 0.3) {
    const pct = Math.round(s.impressionShareLost_budget * 100);
    score -= Math.min(35, pct);
    signals.push(`${pct}% impression share lost to budget — underfunded campaigns`);
  }

  // Quality-driven IS loss means we're losing to better ads
  if (s.impressionShareLost_rank > 0.25) {
    const pct = Math.round(s.impressionShareLost_rank * 100);
    score -= Math.min(25, pct);
    signals.push(`${pct}% impression share lost to rank — quality or bid issue`);
  }

  if (s.clickThroughRate < 0.02) {
    score -= 15;
    signals.push(`CTR ${(s.clickThroughRate * 100).toFixed(1)}% is below 2% threshold — weak ad relevance`);
  } else if (s.clickThroughRate < 0.04) {
    score -= 5;
    signals.push(`CTR ${(s.clickThroughRate * 100).toFixed(1)}% has room to improve`);
  }

  if (s.qualityScoreAvg < 6) {
    score -= 15;
    signals.push(`Avg quality score ${s.qualityScoreAvg.toFixed(1)}/10 — below threshold`);
  } else if (s.qualityScoreAvg < 7) {
    score -= 5;
    signals.push(`Avg quality score ${s.qualityScoreAvg.toFixed(1)}/10 — moderate`);
  }

  if (s.irrelevantQueryPercent > 0.2) {
    const pct = Math.round(s.irrelevantQueryPercent * 100);
    score -= Math.min(20, pct);
    signals.push(`~${pct}% of spend on irrelevant queries — negative keywords needed`);
  }

  if (s.searchImpressionShare > 0.7 && s.impressionShareLost_budget < 0.1) {
    signals.push("Strong impression share — traffic not the primary constraint");
  }

  return {
    bucket: "TRAFFIC",
    score: Math.max(0, Math.round(score)),
    signals,
    isGoverning: false,
  };
}

function scoreConversion(s: ConstraintSignals["conversion"]): BucketScore {
  const signals: string[] = [];
  let score = 100;

  const cvRatio = s.industryBenchmarkConversionRate > 0
    ? s.conversionRate / s.industryBenchmarkConversionRate
    : 1;

  if (cvRatio < 0.5) {
    score -= 40;
    signals.push(
      `CVR ${(s.conversionRate * 100).toFixed(2)}% is <50% of industry benchmark ` +
      `(${(s.industryBenchmarkConversionRate * 100).toFixed(2)}%) — landing page is the constraint`
    );
  } else if (cvRatio < 0.8) {
    score -= 20;
    signals.push(
      `CVR ${(s.conversionRate * 100).toFixed(2)}% is below industry benchmark — needs improvement`
    );
  }

  if (s.mobileSpeedScore < 50) {
    score -= 20;
    signals.push(`Mobile speed score ${s.mobileSpeedScore}/100 — slow pages destroy conversion`);
  } else if (s.mobileSpeedScore < 70) {
    score -= 8;
    signals.push(`Mobile speed score ${s.mobileSpeedScore}/100 — room to improve`);
  }

  if (s.landingPageScore < 5) {
    score -= 15;
    signals.push(`Landing page experience score ${s.landingPageScore}/10 — Google rates it poor`);
  } else if (s.landingPageScore < 7) {
    score -= 5;
    signals.push(`Landing page experience score ${s.landingPageScore}/10 — below average`);
  }

  if (s.bounceRateEstimate > 0.7) {
    score -= 10;
    signals.push(`Bounce rate ~${Math.round(s.bounceRateEstimate * 100)}% — visitors not engaging`);
  }

  return {
    bucket: "CONVERSION",
    score: Math.max(0, Math.round(score)),
    signals,
    isGoverning: false,
  };
}

function scoreFunnel(s: ConstraintSignals["funnel"]): BucketScore {
  const signals: string[] = [];
  let score = 100;

  if (s.targetCostPerLead > 0) {
    const cplRatio = s.costPerLead / s.targetCostPerLead;
    if (cplRatio > 1.5) {
      score -= 30;
      signals.push(`CPL ${s.costPerLead.toFixed(0)} is ${Math.round(cplRatio * 100 - 100)}% above target — funnel economics broken`);
    } else if (cplRatio > 1.1) {
      score -= 10;
      signals.push(`CPL ${s.costPerLead.toFixed(0)} slightly above target — watch trend`);
    }
  }

  if (s.leadToSaleRate < 0.1) {
    score -= 25;
    signals.push(`Lead-to-sale rate ${(s.leadToSaleRate * 100).toFixed(1)}% — sales funnel is leaking`);
  } else if (s.leadToSaleRate < 0.2) {
    score -= 10;
    signals.push(`Lead-to-sale rate ${(s.leadToSaleRate * 100).toFixed(1)}% — below average`);
  }

  if (s.averageLeadQualityScore < 5) {
    score -= 20;
    signals.push(`Lead quality score ${s.averageLeadQualityScore.toFixed(1)}/10 — ads attracting wrong audience`);
  }

  if (!s.offlineConversionImportActive && s.leadToSaleRate > 0) {
    score -= 10;
    signals.push("Offline conversion import not active — Google optimizes for leads, not sales");
  }

  return {
    bucket: "FUNNEL",
    score: Math.max(0, Math.round(score)),
    signals,
    isGoverning: false,
  };
}

function scoreEconomics(s: ConstraintSignals["economics"]): BucketScore {
  const signals: string[] = [];
  let score = 100;

  if (s.targetRoas > 0 && s.actualRoas > 0) {
    const roasRatio = s.actualRoas / s.targetRoas;
    if (roasRatio < 0.7) {
      score -= 35;
      signals.push(`ROAS ${s.actualRoas.toFixed(1)}x vs target ${s.targetRoas.toFixed(1)}x — not profitable`);
    } else if (roasRatio < 0.9) {
      score -= 15;
      signals.push(`ROAS ${s.actualRoas.toFixed(1)}x vs target ${s.targetRoas.toFixed(1)}x — below target`);
    }
  }

  if (s.targetCpa > 0 && s.actualCpa > 0) {
    const cpaRatio = s.actualCpa / s.targetCpa;
    if (cpaRatio > 1.5) {
      score -= 25;
      signals.push(`CPA ${s.actualCpa.toFixed(0)} is ${Math.round((cpaRatio - 1) * 100)}% over target`);
    } else if (cpaRatio > 1.1) {
      score -= 10;
      signals.push(`CPA ${s.actualCpa.toFixed(0)} slightly above target`);
    }
  }

  if (s.grossMarginPercent > 0 && s.actualRoas > 0) {
    // Break-even ROAS = 1 / gross margin
    const breakEvenRoas = 1 / s.grossMarginPercent;
    if (s.actualRoas < breakEvenRoas) {
      score -= 20;
      signals.push(`Below break-even ROAS (${breakEvenRoas.toFixed(1)}x needed at ${Math.round(s.grossMarginPercent * 100)}% margin)`);
    }
  }

  if (s.budgetUtilizationPercent < 0.7) {
    score -= 10;
    signals.push(`Only ${Math.round(s.budgetUtilizationPercent * 100)}% of budget used — campaigns may be over-restricted`);
  }

  return {
    bucket: "ECONOMICS",
    score: Math.max(0, Math.round(score)),
    signals,
    isGoverning: false,
  };
}

// ─── Governing Constraint Detection ──────────────────────────────────────────
/**
 * The governing constraint is the earliest bucket in the optimization sequence
 * that is "significantly unhealthy" (score < 70).
 *
 * If all buckets are healthy (>= 70), return the lowest-scoring bucket.
 */
function detectGoverningConstraint(buckets: BucketScore[]): ConstraintBucket {
  const ordered = BUCKET_ORDER.map((b) => buckets.find((s) => s.bucket === b)!);

  // First unhealthy bucket in sequence
  const firstUnhealthy = ordered.find((b) => b.score < 70);
  if (firstUnhealthy) return firstUnhealthy.bucket;

  // All buckets OK — pick the lowest
  return ordered.reduce((min, b) => (b.score < min.score ? b : min)).bucket;
}

function buildConstraintReason(
  governing: ConstraintBucket,
  buckets: BucketScore[]
): string {
  const bucket = buckets.find((b) => b.bucket === governing)!;
  const topSignal = bucket.signals[0] ?? "Score is below optimal threshold";
  return topSignal;
}

// ─── Main Scorer ──────────────────────────────────────────────────────────────

export function scoreConstraints(signals: ConstraintSignals): ScoringResult {
  const buckets: BucketScore[] = [
    scoreMeasurement(signals.measurement),
    scoreTraffic(signals.traffic),
    scoreConversion(signals.conversion),
    scoreFunnel(signals.funnel),
    scoreEconomics(signals.economics),
  ];

  const governingConstraint = detectGoverningConstraint(buckets);
  const constraintReason = buildConstraintReason(governingConstraint, buckets);

  // Mark governing bucket
  for (const b of buckets) {
    b.isGoverning = b.bucket === governingConstraint;
  }

  const recommendations = buildRecommendations(signals, governingConstraint, buckets);

  return {
    buckets,
    governingConstraint,
    constraintReason,
    recommendations,
  };
}
