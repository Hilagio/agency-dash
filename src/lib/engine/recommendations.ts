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

  const staleTotal = (m.staleConversionCount ?? 0) + (m.neverFiredConversionCount ?? 0);
  if (staleTotal > 0) {
    recs.push({
      bucket: "MEASUREMENT",
      title: `${staleTotal} conversion action${staleTotal > 1 ? "s" : ""} may be broken`,
      description:
        `${m.neverFiredConversionCount ?? 0} action${(m.neverFiredConversionCount ?? 0) !== 1 ? "s" : ""} never fired; ` +
        `${m.staleConversionCount ?? 0} haven't fired in 90+ days. ` +
        "Check Tag Assistant and verify the dataLayer event fires on the confirmation page.",
      impact: "HIGH",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "FIX_STALE_CONVERSIONS",
      isEscalation: true,
    });
  }

  return recs;
};

// ─── Traffic Rules ────────────────────────────────────────────────────────────

const trafficRules: RuleSet = (s) => {
  const recs: ActionRecommendation[] = [];
  const t = s.traffic;

  // Per-campaign budget constraint — one recommendation per constrained campaign
  // with specific current/suggested budget numbers.
  for (const c of t.budgetConstrainedCampaigns ?? []) {
    const pct = Math.round(c.isLostBudget * 100);
    const suggestStr = c.suggestedDailyBudget
      ? ` → suggest €${c.suggestedDailyBudget}/day to capture full demand`
      : "";
    recs.push({
      bucket: "TRAFFIC",
      title: `Raise budget: ${c.campaignName}`,
      description:
        `Losing ${pct}% of impression share to budget. ` +
        `Current: €${c.currentDailyBudget.toFixed(0)}/day${suggestStr}. ` +
        "Confirm ROAS supports scale before raising.",
      impact: pct >= 30 ? "HIGH" : "MEDIUM",
      effort: "EASY",
      safeToAutomate: false,
      actionType: "RAISE_BUDGET",
      actionPayload: {
        campaignId:          c.campaignId,
        campaignName:        c.campaignName,
        currentDailyBudget:  c.currentDailyBudget,
        suggestedDailyBudget: c.suggestedDailyBudget,
        isLostBudget:        c.isLostBudget,
      },
      isEscalation: false,
    });
  }

  // Zero-impression ad groups — safe to pause (reversible, clearly inactive)
  if ((t.zeroImpressionAdGroupCount ?? 0) > 0) {
    const names = (t.zeroImpressionAdGroupNames ?? []).slice(0, 3).join(", ");
    const more  = (t.zeroImpressionAdGroupCount ?? 0) > 3
      ? ` +${(t.zeroImpressionAdGroupCount ?? 0) - 3} more` : "";
    recs.push({
      bucket: "TRAFFIC",
      title: `Pause ${t.zeroImpressionAdGroupCount} inactive ad group(s)`,
      description:
        `${t.zeroImpressionAdGroupCount} enabled ad group(s) received 0 impressions in 30 days: ` +
        `${names}${more}. Pausing cleans up structure and prevents quality score dilution.`,
      impact: "MEDIUM",
      effort: "EASY",
      safeToAutomate: true,
      actionType: "PAUSE_ZERO_IMPRESSION_AD_GROUPS",
      actionPayload: { adGroupNames: t.zeroImpressionAdGroupNames ?? [] },
      isEscalation: false,
    });
  }

  // Non-converting EXACT/PHRASE keyword waste
  if ((t.wastedKeywordSpendRatio ?? 0) > 0.15 && (t.wastedKeywordSpend ?? 0) > 50) {
    const wastePct = Math.round((t.wastedKeywordSpendRatio ?? 0) * 100);
    recs.push({
      bucket: "TRAFFIC",
      title: `Pause non-converting keywords (${wastePct}% of spend wasted)`,
      description:
        `€${Math.round(t.wastedKeywordSpend ?? 0)} spent on EXACT/PHRASE keywords with 0 conversions ` +
        `in the last 30 days (${wastePct}% of total spend). Safe to pause — exact match only.`,
      impact: wastePct >= 25 ? "HIGH" : "MEDIUM",
      effort: "EASY",
      safeToAutomate: true,
      actionType: "PAUSE_NON_CONVERTING_KEYWORDS",
      actionPayload: { costThresholdMultiple: 2 },
      isEscalation: false,
    });
  }

  if (t.irrelevantQueryPercent > 0.10) {
    recs.push({
      bucket: "TRAFFIC",
      title: "Classify search queries to find off-brand waste",
      description:
        `~${Math.round(t.irrelevantQueryPercent * 100)}% of spend on zero-conversion queries. ` +
        "AI classifier labels each term by intent (High Intent / Low Intent / Informational / Off-Brand) " +
        "— off-brand and navigational queries surface automatically for review before any negatives are added.",
      impact: "HIGH",
      effort: "EASY",
      safeToAutomate: false,
      actionType: "CLASSIFY_SEARCH_QUERIES",
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
    const highQs = t.qualityScoreCount > 0 && t.qualityScoreAvg >= 7;
    recs.push({
      bucket: "TRAFFIC",
      title: highQs
        ? "CTR below 2% — investigate top-of-page rate and query mix"
        : "Rewrite ads — CTR below 2%",
      description: highQs
        ? `CTR is low but QS is ${t.qualityScoreAvg.toFixed(1)}/10, so ad relevance is not the problem. ` +
          "Likely causes: losing top-of-page placement to higher bids, query mix shifting toward broader intent, or creative fatigue on specific assets. " +
          "Check Auction Insights for top-of-page rate, segment search terms by intent cluster, and review impression share by position."
        : "Low CTR signals poor ad-to-intent match. Test new headlines with clearer value prop, " +
          "add price, social proof, or urgency. Use RSA asset performance data to drop weak assets.",
      impact: "MEDIUM",
      effort: "MEDIUM",
      safeToAutomate: false,
      actionType: "REWRITE_ADS",
      isEscalation: false,
    });
  }

  if ((t.isDemandCeiling ?? false) && t.searchImpressionShare < 0.30) {
    recs.push({
      bucket: "TRAFFIC",
      title: "Low IS reflects a small market — not a budget or rank problem",
      description:
        `Search impression share is ${Math.round(t.searchImpressionShare * 100)}%, ` +
        `but budget loss is only ${Math.round(t.impressionShareLost_budget * 100)}% ` +
        `and rank loss ${Math.round(t.impressionShareLost_rank * 100)}% — this is a demand ceiling. ` +
        "More budget or better Quality Score won't move the needle here. " +
        "Consider expanding match types, adding adjacent keyword themes, or broadening geo targeting.",
      impact: "MEDIUM",
      effort: "HARD",
      safeToAutomate: false,
      actionType: "EXPAND_TARGETING",
      isEscalation: false,
    });
  }

  if (t.impressionShareLost_rank > 0.25) {
    const highQs   = t.qualityScoreCount > 0 && t.qualityScoreAvg >= 7;
    const noQsData = t.qualityScoreCount === 0;
    const pct      = Math.round(t.impressionShareLost_rank * 100);
    recs.push({
      bucket: "TRAFFIC",
      title: highQs
        ? `${pct}% IS lost to rank — bid competitiveness issue, not quality`
        : "Address rank-based impression share loss",
      description: highQs
        ? `Losing ${pct}% of impression share to rank with QS ${t.qualityScoreAvg.toFixed(1)}/10. ` +
          "Strong Quality Score means Google rates your ads highly — the auctions you're losing are price-driven, not quality-driven. " +
          "Test bid increases on your highest-intent keywords. Review Auction Insights to identify which competitors are outbidding you. " +
          "Consider tROAS/tCPA relaxation on constrained campaigns to let Smart Bidding bid more aggressively."
        : noQsData
          ? `${pct}% IS lost to rank. For Shopping/PMax accounts this is typically feed quality or product pricing vs competitors. Improve feed titles and check price competitiveness.`
          : `${pct}% IS lost to rank with QS ${t.qualityScoreAvg.toFixed(1)}/10. ` +
            "Both quality and bids may be limiting rank. Tighten ad group themes first, then test bid increases on improved groups.",
      impact: "MEDIUM",
      effort: highQs ? "EASY" : "MEDIUM",
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

  // Cross-check: if ROAS is healthy and CTR also dropped, the CVR dip may be
  // volume dilution from a budget scale-up rather than a broken landing page.
  const e = s.economics;
  const t = s.traffic;
  const roasHealthy     = e.targetRoas > 0 && e.actualRoas > 0 && e.actualRoas >= e.targetRoas * 0.85;
  const ctrAlsoDown     = t.clickThroughRateBaseline > 0 && t.clickThroughRate > 0 &&
                          t.clickThroughRate / t.clickThroughRateBaseline < 0.85;
  const budgetMaxed     = e.budgetUtilizationPercent >= 0.95;
  const likelyDilution  = (roasHealthy) && (ctrAlsoDown || budgetMaxed);

  if (cvRatio < 0.5) {
    recs.push({
      bucket: "CONVERSION",
      title: likelyDilution
        ? "CVR below benchmark — verify whether budget scaling is the cause"
        : "Landing page is the primary constraint — fix before scaling spend",
      description: likelyDilution
        ? `CVR ${(c.conversionRate * 100).toFixed(2)}% vs industry benchmark, but ROAS is ${roasHealthy ? "at or near target" : "holding"} and ${ctrAlsoDown ? "CTR also dropped" : "budget is fully utilised"} — this pattern is consistent with traffic-mix dilution from budget scaling (more volume captures lower-intent queries). ` +
          "Before treating this as a funnel problem: segment CVR by campaign, check if the drop started when budget increased, and verify the absolute conversion count is growing even if rate fell. If CVR is down uniformly across all campaigns on flat spend, then escalate to a CRO audit."
        : `CVR ${(c.conversionRate * 100).toFixed(2)}% is less than half the industry benchmark. ` +
          "More traffic will make results worse. Conduct CRO audit: form friction, headline clarity, " +
          "trust signals, page speed. Consider dedicated landing pages per campaign.",
      impact: likelyDilution ? "MEDIUM" : "HIGH",
      effort: "HARD",
      safeToAutomate: false,
      actionType: "CRO_AUDIT",
      isEscalation: !likelyDilution,
    });
  }

  if (c.mobileSpeedScore > 0 && c.mobileSpeedScore < 50) {
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
