/**
 * Recommendation engine — deterministic, rule-based.
 *
 * Rules are ordered by impact. Only rules relevant to the governing constraint
 * are surfaced first; secondary constraints follow.
 *
 * "safeToAutomate" = can be executed with a single Google Ads API call
 * with low risk of revenue damage. Applies only to:
 *  - Excluding irrelevant search terms
 *  - Adding negative keywords (exact/phrase)
 *  - Pausing zero-impression ad groups (>30 days)
 *  - Enabling enhanced conversions (settings change only)
 */

import {
  ActionRecommendation,
  BucketScore,
  ConstraintBucket,
  ConstraintSignals,
} from "./types";

type RuleSet = (
  signals: ConstraintSignals,
  buckets: BucketScore[]
) => ActionRecommendation[];

// ─── Measurement Rules ────────────────────────────────────────────────────────

const measurementRules: RuleSet = (s) => {
  const recs: ActionRecommendation[] = [];
  const m = s.measurement;

  if (!m.conversionTrackingActive) {
    recs.push({
      bucket: "MEASUREMENT",
      title: "Set up conversion tracking immediately",
      description:
        "No active conversion tracking detected. Every optimization decision is blind. " +
        "Install Google tag, configure at least one primary conversion action, and verify.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "SETUP_CONVERSION_TRACKING",
      isEscalation: false,
    });
  }

  if (!m.hasEnhancedConversions) {
    recs.push({
      bucket: "MEASUREMENT",
      title: "Enable Enhanced Conversions",
      description:
        "Enhanced conversions fills attribution gaps caused by ITP/cookie restrictions. " +
        "Typically recovers 10–30% of lost conversion signals.",
      impact: "HIGH",
      effort: "EASY",
      safeToAutomate: true,
      actionType: "ENABLE_ENHANCED_CONVERSIONS",
      isEscalation: false,
    });
  }

  if (m.hasEnhancedConversions && m.enhancedConversionsDegraded) {
    recs.push({
      bucket: "MEASUREMENT",
      title: "Enhanced Conversions appears broken — conversion volume dropped ≥40%",
      description:
        "Enhanced Conversions is enabled but the conversion volume for those actions has dropped " +
        "significantly vs the prior 3 weeks. This usually means the tag stopped passing user data " +
        "(hashed email/phone) — triggered by a website update, GTM change, or Consent Mode misconfiguration. " +
        "Check Tag Assistant, verify the dataLayer push on the confirmation page, and confirm " +
        "ad_user_data consent is being granted.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "FIX_ENHANCED_CONVERSIONS",
      isEscalation: true,
    });
  }

  if (m.tagCoveragePercent < 0.9) {
    recs.push({
      bucket: "MEASUREMENT",
      title: `Fix tag coverage — ${Math.round((1 - m.tagCoveragePercent) * 100)}% of traffic untracked`,
      description:
        "Untracked pages corrupt conversion data and hurt Smart Bidding. " +
        "Audit via Google Tag Assistant, fix missing tags on checkout/thank-you pages first.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "FIX_TAG_COVERAGE",
      isEscalation: false,
    });
  }

  if (!m.hasGa4Linked) {
    recs.push({
      bucket: "MEASUREMENT",
      title: "Link GA4 to Google Ads",
      description:
        "GA4 linking unlocks audience lists, engagement signals, and cross-channel attribution. " +
        "5-minute setup with no risk.",
      impact: "MEDIUM",
      effort: "EASY",
      safeToAutomate: false,
      actionType: "LINK_GA4",
      isEscalation: false,
    });
  }

  return recs;
};

// ─── Traffic Rules ────────────────────────────────────────────────────────────

const trafficRules: RuleSet = (s) => {
  const recs: ActionRecommendation[] = [];
  const t = s.traffic;

  if (t.impressionShareLost_budget > 0.3) {
    recs.push({
      bucket: "TRAFFIC",
      title: "Increase budget on budget-constrained campaigns",
      description:
        `Losing ${Math.round(t.impressionShareLost_budget * 100)}% of potential impression share to budget. ` +
        "Raise daily budgets or reallocate from low-ROI campaigns. Confirm economics support scale first.",
      impact: "HIGH",
      effort: "EASY",
      safeToAutomate: false,
      actionType: "RAISE_BUDGET",
      isEscalation: false,
    });
  }

  if (t.irrelevantQueryPercent > 0.15) {
    recs.push({
      bucket: "TRAFFIC",
      title: "Exclude irrelevant search terms",
      description:
        `~${Math.round(t.irrelevantQueryPercent * 100)}% of spend is on irrelevant queries. ` +
        "Review search term report, add negatives for clearly irrelevant terms. Safe to execute.",
      impact: "HIGH",
      effort: "EASY",
      safeToAutomate: true,
      actionType: "EXCLUDE_SEARCH_TERMS",
      actionPayload: { threshold: "irrelevant", requireApproval: true },
      isEscalation: false,
    });
  }

  if (t.qualityScoreCount > 0 && t.qualityScoreAvg < 6) {
    recs.push({
      bucket: "TRAFFIC",
      title: "Improve ad relevance to raise Quality Score",
      description:
        `Average QS ${t.qualityScoreAvg.toFixed(1)}/10. Below 6 means you pay more for less reach. ` +
        "Tighten ad group themes, rewrite headlines to match intent, improve landing page relevance.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "IMPROVE_QUALITY_SCORE",
      isEscalation: false,
    });
  }

  if (t.productDisapprovalRate > 0.05) {
    const pct = Math.round(t.productDisapprovalRate * 100);
    recs.push({
      bucket: "TRAFFIC",
      title: "Fix disapproved products in Merchant Center",
      description:
        `${pct}% of products are disapproved and not serving. Review Merchant Center diagnostics — ` +
        "common causes: missing GTINs, policy violations, price mismatches between feed and landing page.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "FIX_FEED_DISAPPROVALS",
      isEscalation: false,
    });
  }

  if (t.clickThroughRate < 0.02) {
    recs.push({
      bucket: "TRAFFIC",
      title: "Rewrite ads — CTR below 2%",
      description:
        "Low CTR signals poor ad-to-intent match. Test new headlines with clearer value prop, " +
        "add price, social proof, or urgency. Use RSA asset performance data to drop weak assets.",
      impact: "MEDIUM",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "REWRITE_ADS",
      isEscalation: false,
    });
  }

  if (t.impressionShareLost_rank > 0.25) {
    recs.push({
      bucket: "TRAFFIC",
      title: "Address rank-based impression share loss",
      description:
        `${Math.round(t.impressionShareLost_rank * 100)}% IS lost to rank. ` +
        "This is usually Quality Score, not bids. Fix QS first before raising bids.",
      impact: "MEDIUM",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "IMPROVE_RANK",
      isEscalation: false,
    });
  }

  return recs;
};

// ─── Conversion Rules ─────────────────────────────────────────────────────────

const conversionRules: RuleSet = (s) => {
  const recs: ActionRecommendation[] = [];
  const c = s.conversion;

  const cvRatio =
    c.industryBenchmarkConversionRate > 0
      ? c.conversionRate / c.industryBenchmarkConversionRate
      : 1;

  if (cvRatio < 0.5) {
    recs.push({
      bucket: "CONVERSION",
      title: "Landing page is the primary constraint — fix before scaling spend",
      description:
        `CVR ${(c.conversionRate * 100).toFixed(2)}% is less than half of industry benchmark. ` +
        "More traffic will make results worse. Conduct CRO audit: form friction, headline clarity, " +
        "trust signals, page speed. Consider dedicated landing pages per campaign.",
      impact: "HIGH",
      effort: "HARD",
      safeToAutomate: false,
      actionType: "CRO_AUDIT",
      isEscalation: true,
    });
  }

  if (c.mobileSpeedScore < 50) {
    recs.push({
      bucket: "CONVERSION",
      title: "Critical: Mobile page speed below 50",
      description:
        `Mobile speed score ${c.mobileSpeedScore}/100. Google shows ${c.mobileSpeedScore < 30 ? "53" : "40"}% of users abandon after 3s. ` +
        "Use PageSpeed Insights to identify bottlenecks. Image compression and render-blocking JS are usual culprits.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "IMPROVE_PAGE_SPEED",
      isEscalation: true,
    });
  }

  if (c.landingPageScore < 5) {
    recs.push({
      bucket: "CONVERSION",
      title: "Low landing page experience score",
      description:
        "Google rates this landing page as poor. Ensure the page content directly answers the search query, " +
        "loads fast, and is mobile-friendly. Poor LP experience inflates CPC and hurts Ad Rank.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "IMPROVE_LANDING_PAGE",
      isEscalation: true,
    });
  }

  return recs;
};

// ─── Funnel Rules ─────────────────────────────────────────────────────────────

const funnelRules: RuleSet = (s) => {
  const recs: ActionRecommendation[] = [];
  const f = s.funnel;

  if (!f.offlineConversionImportActive && f.leadToSaleRate > 0) {
    recs.push({
      bucket: "FUNNEL",
      title: "Implement offline conversion import",
      description:
        "You're tracking leads but not sales. Google is optimizing for the wrong signal. " +
        "Import CRM won/lost data so Smart Bidding learns which leads actually convert to revenue.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "SETUP_OFFLINE_CONVERSIONS",
      isEscalation: true,
    });
  }

  if (f.leadToSaleRate < 0.1) {
    recs.push({
      bucket: "FUNNEL",
      title: "Lead quality issue — audit audience targeting",
      description:
        `Lead-to-sale rate is ${(f.leadToSaleRate * 100).toFixed(1)}%. This suggests targeting is reaching wrong intent. ` +
        "Review which campaigns produce the best-converting leads. Tighten match types or add qualifying intent terms.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "AUDIT_AUDIENCE_TARGETING",
      isEscalation: false,
    });
  }

  if (f.averageLeadQualityScore < 5) {
    recs.push({
      bucket: "FUNNEL",
      title: "Low lead quality — qualify in the ad and landing page",
      description:
        "Add qualifying language in ads (price anchoring, specificity, sector terms) to deter low-intent clicks. " +
        "Use lead form questions or landing page friction that filters for serious buyers.",
      impact: "MEDIUM",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "QUALIFY_ADS",
      isEscalation: false,
    });
  }

  return recs;
};

// ─── Economics Rules ──────────────────────────────────────────────────────────

const economicsRules: RuleSet = (s) => {
  const recs: ActionRecommendation[] = [];
  const e = s.economics;

  if (e.targetRoas > 0 && e.actualRoas > 0 && e.actualRoas < e.targetRoas * 0.7) {
    recs.push({
      bucket: "ECONOMICS",
      title: "ROAS far below target — review bid strategy and product margins",
      description:
        `Actual ROAS ${e.actualRoas.toFixed(1)}x vs target ${e.targetRoas.toFixed(1)}x. ` +
        "Check if target ROAS is realistic given competitive landscape. " +
        "Audit product mix — high-margin products should get more budget. Consider portfolio bidding.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "REVIEW_BID_STRATEGY",
      isEscalation: false,
    });
  }

  if (e.grossMarginPercent > 0) {
    const breakEvenRoas = 1 / e.grossMarginPercent;
    if (e.actualRoas < breakEvenRoas) {
      recs.push({
        bucket: "ECONOMICS",
        title: "Campaigns running below break-even ROAS",
        description:
          `At ${Math.round(e.grossMarginPercent * 100)}% gross margin, break-even ROAS is ${breakEvenRoas.toFixed(1)}x. ` +
          `Current ROAS is ${e.actualRoas.toFixed(1)}x — each sale loses money. ` +
          "Either improve CVR, reduce CPC, increase AOV, or raise prices before scaling.",
        impact: "HIGH",
        effort: "HARD",
        safeToAutomate: false,
        actionType: "ECONOMICS_RESTRUCTURE",
        isEscalation: true,
      });
    }
  }

  if (e.budgetUtilizationPercent < 0.7) {
    recs.push({
      bucket: "ECONOMICS",
      title: "Budget underutilized — campaigns likely over-restricted",
      description:
        `Only ${Math.round(e.budgetUtilizationPercent * 100)}% of budget spent. ` +
        "This usually means over-tight targeting, too-high target CPA/ROAS, or match type restrictions. " +
        "Loosen constraints incrementally while watching efficiency.",
      impact: "MEDIUM",
      effort: "EASY",
      safeToAutomate: false,
      actionType: "LOOSEN_TARGETING",
      isEscalation: false,
    });
  }

  return recs;
};

// ─── Builder ──────────────────────────────────────────────────────────────────

const RULE_MAP: Record<ConstraintBucket, RuleSet> = {
  MEASUREMENT: measurementRules,
  TRAFFIC:     trafficRules,
  CONVERSION:  conversionRules,
  FUNNEL:      funnelRules,
  ECONOMICS:   economicsRules,
};

const IMPACT_WEIGHT: Record<string, number> = { HIGH: 3, MEDIUM: 2, LOW: 1 };
const EFFORT_PENALTY: Record<string, number> = { EASY: 0, MEDIUM: 1, HARD: 2 };

function prioritize(recs: ActionRecommendation[]): ActionRecommendation[] {
  return [...recs].sort((a, b) => {
    const scoreA = IMPACT_WEIGHT[a.impact] - EFFORT_PENALTY[a.effort];
    const scoreB = IMPACT_WEIGHT[b.impact] - EFFORT_PENALTY[b.effort];
    return scoreB - scoreA;
  });
}

export function buildRecommendations(
  signals: ConstraintSignals,
  governingConstraint: ConstraintBucket,
  buckets: BucketScore[]
): ActionRecommendation[] {
  const governing = RULE_MAP[governingConstraint](signals, buckets);

  // Include secondary constraints (those that scored < 70) — deprioritized
  const secondary: ActionRecommendation[] = [];
  for (const bucket of buckets) {
    if (bucket.bucket !== governingConstraint && bucket.score < 70) {
      secondary.push(...RULE_MAP[bucket.bucket](signals, buckets));
    }
  }

  return [...prioritize(governing), ...prioritize(secondary)];
}
