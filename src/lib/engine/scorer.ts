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

  // ── PMax Display/YouTube spend leak ──────────────────────────────────────
  // For feed-only PMax, spend should go to Shopping and Search intent queries.
  // CONTENT (Display) and YOUTUBE_WATCH/SEARCH spend is unexpected and usually
  // means Google is broadening beyond the feed — wasting budget on low-intent placements.
  if (s.isPmaxPrimary && s.pmaxDisplayYoutubePercent > 0.1) {
    const pct = Math.round(s.pmaxDisplayYoutubePercent * 100);
    if (s.pmaxDisplayYoutubePercent > 0.25) {
      score -= Math.min(30, Math.round(pct * 1.2));
      signals.push(`${pct}% of PMax spend going to Display/YouTube — feed-only campaigns shouldn't serve here; Google is broadening beyond the product feed`);
    } else {
      score -= 12;
      signals.push(`${pct}% of PMax spend on Display/YouTube — monitor; feed-only campaigns ideally stay in Shopping/Search`);
    }
  }

  // ── Impression share signals (Search/Shopping campaigns only) ────────────
  // IS metrics are only valid for Search and Standard Shopping campaigns.
  // PMax campaigns return 0 for these fields — if the account is PMax-primary
  // and has no Search/Shopping campaigns, IS signals are not applicable.
  const hasSearchShoppingCampaigns = s.searchImpressionShare > 0 ||
    s.impressionShareLost_budget > 0 || s.impressionShareLost_rank > 0;

  if (hasSearchShoppingCampaigns) {
    // Budget IS loss — only flag when genuinely constraining (> 35%)
    if (s.impressionShareLost_budget > 0.35) {
      const pct = Math.round(s.impressionShareLost_budget * 100);
      score -= Math.min(35, pct);
      signals.push(`${pct}% impression share lost to budget — Search/Shopping campaigns are underfunded`);
    } else if (s.impressionShareLost_budget > 0.15) {
      score -= Math.round(s.impressionShareLost_budget * 30);
    }

    // Rank IS loss — only flag when genuinely severe (> 50%).
    // 30–50% lost to rank is common and not necessarily actionable.
    if (s.impressionShareLost_rank > 0.5) {
      const pct = Math.round(s.impressionShareLost_rank * 100);
      score -= Math.min(25, Math.round((pct - 50) * 1.5));
      let msg: string;
      if (s.qualityScoreCount === 0) {
        msg = `${pct}% impression share lost to rank — check feed title quality and product pricing vs competitors`;
      } else if (s.qualityScoreAvg >= 7) {
        // High QS means Google rates the ad/keyword/page well — rank loss is bid-driven
        msg = `${pct}% IS lost to rank with QS ${s.qualityScoreAvg.toFixed(1)}/10 — rank loss is bid competitiveness, not quality. Test bid increases on high-intent queries`;
      } else {
        msg = `${pct}% impression share lost to rank — review keyword bids and ad relevance (QS ${s.qualityScoreAvg.toFixed(1)}/10)`;
      }
      signals.push(msg);
    } else if (s.impressionShareLost_rank > 0.3) {
      score -= Math.round((s.impressionShareLost_rank - 0.3) * 20);
    }
  }

  // CTR: compare trend vs account's own 15–180d baseline.
  // Note: the baseline window spans up to 6 months and can include seasonal peaks (e.g. Q4).
  // A CTR drop during a historically strong period is expected — only flag genuinely severe drops.
  // Threshold: >50% drop = flag (not >35%) to reduce seasonal false positives.
  if (s.clickThroughRateBaseline > 0) {
    const ctrTrend = s.clickThroughRate / s.clickThroughRateBaseline;
    if (ctrTrend < 0.5) {
      score -= 20;
      let msg: string;
      if (s.qualityScoreCount === 0) {
        msg = `CTR down ${Math.round((1 - ctrTrend) * 100)}% vs 6-month average — check feed title relevance; seasonal shifts can cause this`;
      } else if (s.qualityScoreAvg >= 7) {
        // High QS means ad relevance is not the problem — look elsewhere
        msg = `CTR down ${Math.round((1 - ctrTrend) * 100)}% vs 6-month average with QS ${s.qualityScoreAvg.toFixed(1)}/10 — ad quality is not the issue; check top-of-page rate, query mix shift, or creative fatigue`;
      } else {
        msg = `CTR down ${Math.round((1 - ctrTrend) * 100)}% vs 6-month average — review ad copy and keyword match types`;
      }
      signals.push(msg);
    } else if (ctrTrend < 0.70) {
      score -= 8;
      signals.push(`CTR down ${Math.round((1 - ctrTrend) * 100)}% vs 6-month average — monitor; may reflect seasonality`);
    }
    // Within 30% of own baseline: normal variation or seasonality — no signal
  }

  // Quality score (Search/DSA) vs feed health (Shopping/PMax) — mutually exclusive
  if (s.qualityScoreCount > 0) {
    // Search account: evaluate QS from keyword data
    if (s.qualityScoreAvg < 5) {
      score -= 20;
      signals.push(`Avg quality score ${s.qualityScoreAvg.toFixed(1)}/10 — poor ad/keyword/page relevance`);
    } else if (s.qualityScoreAvg < 6) {
      score -= 8;
      signals.push(`Avg quality score ${s.qualityScoreAvg.toFixed(1)}/10 — below average`);
    }
    // 6–7: deduct silently; 7+: healthy
  } else {
    // Feed-only account (Shopping / PMax): use product disapproval rate instead
    if (s.productDisapprovalRate > 0.2) {
      const pct = Math.round(s.productDisapprovalRate * 100);
      score -= Math.min(25, Math.round(pct * 1.2));
      signals.push(`${pct}% of products disapproved in Merchant Center — feed health issues reducing reach`);
    } else if (s.productDisapprovalRate > 0.05) {
      const pct = Math.round(s.productDisapprovalRate * 100);
      score -= 10;
      signals.push(`${pct}% of products disapproved — fix feed issues to improve reach`);
    }
    // < 5%: healthy, no signal
  }

  // Irrelevant query spend — "queries with 0 conversions" is not the same as "irrelevant queries".
  // On any account with low conversion volume, virtually all queries will show 0 conversions —
  // this is a data volume problem, not a targeting problem. Only flag when:
  //  a) the percentage is very high (> 60%), AND
  //  b) the CTR is not also low (which would suggest the account just lacks conversion data)
  // This prevents false alarms on new accounts and early-phase data gathering campaigns.
  if (s.irrelevantQueryPercent > 0.6) {
    const pct = Math.round(s.irrelevantQueryPercent * 100);
    score -= Math.min(15, Math.round((pct - 60) * 0.5));
    signals.push(`~${pct}% of query spend has no conversion history — review search terms report for clear irrelevancies`);
  }

  if (hasSearchShoppingCampaigns && s.searchImpressionShare > 0.7 && s.impressionShareLost_budget < 0.15) {
    signals.push("Strong impression share — traffic not the primary constraint");
  }

  return {
    bucket: "TRAFFIC",
    score: Math.max(0, Math.round(score)),
    signals,
    isGoverning: false,
  };
}

function scoreConversion(s: ConstraintSignals["conversion"], full: ConstraintSignals): BucketScore {
  const signals: string[] = [];
  let score = 100;

  // ── Cross-bucket context for CVR interpretation ────────────────────────────
  // A CVR drop caused by budget scaling (more volume → lower-intent queries)
  // is fundamentally different from a CVR drop on flat spend (broken funnel).
  // Signals that suggest volume-dilution rather than a real conversion problem:
  //   1. ROAS is still at or above target despite the CVR drop
  //   2. CTR also dropped (traffic mix shifted toward broader, lower-intent queries)
  //   3. Budget is fully utilised (consistent with a recent budget increase)
  const e = full.economics;
  const t = full.traffic;
  const roasHealthy  = e.targetRoas > 0 && e.actualRoas > 0 && e.actualRoas >= e.targetRoas * 0.85;
  const roasTrending = e.actualRoasBaseline > 0 && e.actualRoas > 0 && e.actualRoas / e.actualRoasBaseline >= 0.8;
  const ctrAlsoDown  = t.clickThroughRateBaseline > 0 && t.clickThroughRate > 0 &&
                       t.clickThroughRate / t.clickThroughRateBaseline < 0.85;
  const budgetMaxed  = e.budgetUtilizationPercent >= 0.95;
  // If ROAS is holding up AND CTR dropped AND budget is maxed out, the CVR
  // decline is most likely a traffic-mix / volume-dilution effect.
  const likelyVolumeDilution = (roasHealthy || roasTrending) && (ctrAlsoDown || budgetMaxed);

  // PRIMARY: self-trend — is CVR deteriorating vs this account's own 6-month average?
  if (s.conversionRateBaseline > 0) {
    const cvrTrend = s.conversionRate > 0
      ? s.conversionRate / s.conversionRateBaseline
      : 0;
    if (cvrTrend === 0) {
      // No conversions at all in the recent window — critical regardless of context
      score -= 40;
      signals.push(`No conversions recorded in the last 14 days — conversion has stopped`);
    } else if (cvrTrend < 0.6) {
      if (likelyVolumeDilution) {
        // Reduce penalty — ROAS is holding, so this looks like scale dilution not a broken funnel
        score -= 15;
        signals.push(
          `CVR down ${Math.round((1 - cvrTrend) * 100)}% vs 6-month average ` +
          `(${(s.conversionRate * 100).toFixed(2)}% vs ${(s.conversionRateBaseline * 100).toFixed(2)}%) — ` +
          `likely traffic-mix dilution from budget scaling (ROAS ${roasHealthy ? "at target" : "near baseline"}, CTR${ctrAlsoDown ? " also down" : ""}) — ` +
          `confirm by checking if CVR drop tracks the budget increase date`
        );
      } else {
        score -= 35;
        signals.push(
          `CVR down ${Math.round((1 - cvrTrend) * 100)}% vs 6-month average ` +
          `(${(s.conversionRate * 100).toFixed(2)}% vs ${(s.conversionRateBaseline * 100).toFixed(2)}%) — significant deterioration`
        );
      }
    } else if (cvrTrend < 0.8) {
      score -= likelyVolumeDilution ? 5 : 15;
      signals.push(
        `CVR down ${Math.round((1 - cvrTrend) * 100)}% vs 6-month average ` +
        `(${(s.conversionRate * 100).toFixed(2)}% vs ${(s.conversionRateBaseline * 100).toFixed(2)}%)` +
        (likelyVolumeDilution ? ` — consistent with increased traffic volume` : "")
      );
    } else if (cvrTrend < 0.93) {
      score -= 5;
      signals.push(
        `CVR slightly below 6-month average (${(s.conversionRate * 100).toFixed(2)}% vs ${(s.conversionRateBaseline * 100).toFixed(2)}%)`
      );
    }
    // cvrTrend ≥ 0.93: stable or improving — no penalty
  } else {
    // FALLBACK: industry benchmark — only when <100 baseline clicks; treat as informational only
    const cvRatio = s.industryBenchmarkConversionRate > 0
      ? s.conversionRate / s.industryBenchmarkConversionRate
      : 1;
    if (cvRatio < 0.2) {
      score -= 15;
      signals.push(
        `CVR ${(s.conversionRate * 100).toFixed(2)}% is very low vs industry benchmark — check conversion tracking`
      );
    }
  }

  // Mobile-friendly clicks — only penalise when we have real measured data (> 0)
  // Note: this is % of mobile clicks to mobile-friendly URLs, not a PageSpeed score
  if (s.mobileSpeedScore > 0) {
    if (s.mobileSpeedScore < 50) {
      score -= 15;
      signals.push(`Mobile-friendly click rate ${s.mobileSpeedScore}% — many mobile visitors reach non-mobile-optimised pages`);
    } else if (s.mobileSpeedScore < 70) {
      score -= 5;
      signals.push(`Mobile-friendly click rate ${s.mobileSpeedScore}% — room to improve mobile experience`);
    }
  }

  // Landing page engagement (pages per session proxy) — only when real data exists (> 0)
  if (s.landingPageScore > 0) {
    if (s.landingPageScore < 4) {
      score -= 10;
      signals.push(`Landing page engagement score ${s.landingPageScore}/10 — visitors leaving quickly (low pages/session)`);
    } else if (s.landingPageScore < 6) {
      score -= 4;
      signals.push(`Landing page engagement score ${s.landingPageScore}/10 — moderate visitor engagement`);
    }
  }

  // Bounce rate — only when measured (bounceRateEstimate > 0)
  if (s.bounceRateEstimate > 0.7) {
    score -= 8;
    signals.push(`Bounce rate ~${Math.round(s.bounceRateEstimate * 100)}% — visitors not engaging with the page`);
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

  // leadToSaleRate = 0 means no CRM data — skip entirely (don't penalise for unmeasured data)
  if (s.leadToSaleRate > 0 && s.leadToSaleRate < 0.1) {
    score -= 25;
    signals.push(`Lead-to-sale rate ${(s.leadToSaleRate * 100).toFixed(1)}% — sales funnel is leaking`);
  } else if (s.leadToSaleRate > 0 && s.leadToSaleRate < 0.2) {
    score -= 10;
    signals.push(`Lead-to-sale rate ${(s.leadToSaleRate * 100).toFixed(1)}% — below average`);
  }

  // averageLeadQualityScore = 0 means no CRM data — skip (not a default score)
  if (s.averageLeadQualityScore > 0 && s.averageLeadQualityScore < 5) {
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

  // Detect account type: ecommerce has conversion values (AOV > 0) → ROAS is the primary metric.
  // Lead gen has no conversion value (AOV = 0) → CPA is the primary metric.
  const isEcommerce = s.avgOrderValue > 0 || s.targetRoas > 0;

  // ── ROAS (ecommerce primary) ───────────────────────────────────────────────
  if (s.targetRoas > 0 && s.actualRoas > 0) {
    const roasRatio = s.actualRoas / s.targetRoas;
    if (roasRatio < 0.7) {
      score -= 35;
      signals.push(`ROAS ${s.actualRoas.toFixed(1)}x vs target ${s.targetRoas.toFixed(1)}x — significantly below target`);
    } else if (roasRatio < 0.9) {
      score -= 15;
      signals.push(`ROAS ${s.actualRoas.toFixed(1)}x vs target ${s.targetRoas.toFixed(1)}x — below target`);
    }
    // Within 10% of target: healthy, no signal
  }

  // ROAS trend vs own 6-month baseline
  if (s.actualRoasBaseline > 0 && s.actualRoas > 0) {
    const roasTrend = s.actualRoas / s.actualRoasBaseline;
    if (roasTrend < 0.65) {
      score -= 20;
      signals.push(`ROAS down ${Math.round((1 - roasTrend) * 100)}% vs 6-month average (${s.actualRoas.toFixed(1)}x vs ${s.actualRoasBaseline.toFixed(1)}x)`);
    } else if (roasTrend < 0.80) {
      score -= 8;
      signals.push(`ROAS trending down vs 6-month average (${s.actualRoas.toFixed(1)}x vs ${s.actualRoasBaseline.toFixed(1)}x)`);
    }
    // Within 20% of own baseline: normal variation, no signal
  }

  // ── CPA (lead gen primary — skip for ecommerce where ROAS governs) ─────────
  if (!isEcommerce) {
    if (s.targetCpa > 0 && s.actualCpa > 0) {
      const cpaRatio = s.actualCpa / s.targetCpa;
      if (cpaRatio > 1.5) {
        score -= 25;
        signals.push(`CPA ${s.actualCpa.toFixed(0)} is ${Math.round((cpaRatio - 1) * 100)}% over target`);
      } else if (cpaRatio > 1.15) {
        score -= 10;
        signals.push(`CPA ${s.actualCpa.toFixed(0)} slightly above target`);
      }
    }

    if (s.actualCpaBaseline > 0 && s.actualCpa > 0) {
      const cpaTrend = s.actualCpa / s.actualCpaBaseline;
      if (cpaTrend > 1.5) {
        score -= 15;
        signals.push(`CPA up ${Math.round((cpaTrend - 1) * 100)}% vs 6-month average (${s.actualCpa.toFixed(0)} vs ${s.actualCpaBaseline.toFixed(0)})`);
      } else if (cpaTrend > 1.3) {
        score -= 6;
        // Minor CPA drift: deduct silently — not worth a red signal on its own
      }
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

  // LTV-based CPA check (subscription: LTV = AOV / monthly churn)
  const ltv = s.ltv > 0 ? s.ltv
    : (s.avgOrderValue > 0 && s.monthlyChurnRate > 0)
      ? s.avgOrderValue / s.monthlyChurnRate
      : 0;
  if (ltv > 0 && s.actualCpa > 0) {
    const cpaLtvRatio = s.actualCpa / ltv;
    if (cpaLtvRatio > 0.5) {
      score -= 25;
      signals.push(`CPA ${s.actualCpa.toFixed(0)} is ${Math.round(cpaLtvRatio * 100)}% of LTV ${ltv.toFixed(0)} — unprofitable on LTV basis`);
    } else if (cpaLtvRatio > 0.33) {
      score -= 10;
      signals.push(`CPA is ${Math.round(cpaLtvRatio * 100)}% of LTV — margin is thin`);
    }
  }

  // AOV-based CPA sanity check (ecommerce: CPA should be well below AOV)
  if (s.avgOrderValue > 0 && s.actualCpa > 0 && s.monthlyChurnRate === 0) {
    const cpaAovRatio = s.actualCpa / s.avgOrderValue;
    if (cpaAovRatio > 0.6) {
      score -= 20;
      signals.push(`CPA ${s.actualCpa.toFixed(0)} is ${Math.round(cpaAovRatio * 100)}% of AOV ${s.avgOrderValue.toFixed(0)} — barely covers acquisition cost`);
    } else if (cpaAovRatio > 0.4) {
      score -= 8;
      signals.push(`CPA is ${Math.round(cpaAovRatio * 100)}% of AOV — watch margin`);
    }
  }

  // Churn rate signal for subscription businesses
  if (s.monthlyChurnRate > 0) {
    if (s.monthlyChurnRate > 0.1) {
      score -= 20;
      signals.push(`Monthly churn ${Math.round(s.monthlyChurnRate * 100)}% — LTV is eroding, economics unsustainable`);
    } else if (s.monthlyChurnRate > 0.05) {
      score -= 8;
      signals.push(`Monthly churn ${Math.round(s.monthlyChurnRate * 100)}% — above healthy threshold (<5%)`);
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
    scoreConversion(signals.conversion, signals),
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
