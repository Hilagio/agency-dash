# SOP – Optimize Geographic Targeting
Created: 2026-02-14

SOP_ID: SOP_71
Status: Done
Category: Search
Primary Outcome: Geographic targeting refined with location bid adjustments and exclusions based on performance
Agent_Executable: No
Human_Approval_Required: No
Domain: Search
Pillar: 7

## Purpose

This SOP analyzes geographic performance data and applies location bid adjustments or exclusions to concentrate spend in high-performing areas and reduce waste in underperforming ones.

> **The big question:** Which locations are delivering profitable conversions, and which are draining budget without results?

---

## What this SOP is NOT

This SOP does **not:**

- Explain bid modifier mechanics or syntax (See: [Bid Modifier Reference](../references/Bid Modifier Reference.md))
- Define metric calculations or reporting dimensions (See: [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md))
- Configure initial campaign location settings (See: [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md))
- Set up or adjust bidding strategy targets (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))

## When to run this SOP

| Account type | Frequency | Rationale |
| --- | --- | --- |
| Large geographic footprint (multi-state/multi-country) | Bi-weekly | High location variance, fast data accumulation |
| Standard single-country accounts | Monthly | Sufficient data collection per location segment |
| Small-budget or local-only accounts | Quarterly | Slow data accumulation, fewer location segments |

Run immediately when cost-per-conversion varies more than 50% across locations, a new market is added, or seasonal events shift geographic patterns.

---

## Before you start

### Required inputs

- Access to Google Ads account with reporting and editing permissions
- Analysis period aligned to cadence above (minimum 30 days)
- Current target CPA or target ROAS for each campaign
- Knowledge of current location targeting settings

### Reference documents (have open)

| Document | Used for |
| --- | --- |
| [Bid Modifier Reference](../references/Bid Modifier Reference.md) | Modifier ranges, stacking rules, Smart Bidding interaction |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metric definitions, calculation methods |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Location targeting options, presence vs. interest settings |

---

## Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Export location performance data** | Pull raw geographic data for the analysis period | Downloaded location report with key metrics |
| **Phase 2️⃣: Analyze location performance** | Identify high-performers, underperformers, and zero-conversion locations | Categorized location segments with performance ratings |
| **Phase 3️⃣: Apply adjustments** | Set bid modifiers or exclusions based on analysis | Bid adjustments applied, exclusions configured |
| **Phase 4️⃣: Validate and monitor** | Confirm changes are working and plan next iteration | Before/after comparison, next review scheduled |

---

## Phase 1️⃣: Export location performance data

### 1.1 Verify location targeting settings

Navigate to Campaign settings > Locations > Location options (advanced). Confirm the "Target" setting. The recommended default is **Presence or interest: People in, regularly in, or who have shown interest in your targeted locations**. Performance data should determine whether to restrict to "Presence" only.

> ⚠️ **Local businesses only:** For businesses where customers must be physically present (restaurants, retail, local services), use **Presence only** to avoid showing ads to users who cannot visit. For all other businesses, start with "Presence or interest" and let location performance data guide any restriction (see section 1.3).

### 1.2 Pull the location report

1. Navigate to Campaigns > Insights and reports > Report editor.
2. Create a Geographic report. Set date range to your analysis period (14-30 days for bi-weekly, 30-60 days for monthly, 90 days for quarterly).
3. Set granularity using these location dimensions:
   - **Country/territory (user location)** for multi-country accounts
   - **Region (user location)** for nationwide accounts
   - **City (user location)** for metro/regional accounts
   - **Most specific location target (user location)** for the narrowest available view
4. Also include the **Targeted location** dimension to compare performance against your configured location targets.
5. Include columns: Location, Clicks, Impressions, Cost, Conversions, Conversion rate, Cost/conversion, Conversion value, ROAS.
6. Export as .csv or .xlsx. Remove rows with fewer than 50 clicks. Sort by Cost descending.

### 1.3 Compare targeted vs. interest-based location performance

When your location option is set to "Presence or interest", compare performance between users physically in your targeted locations and users showing interest from elsewhere:

1. In the Geographic report, add the "Location type" dimension
2. Compare conversion metrics for "Physical location" vs. "Location of interest"

| Physical location performance | Interest location performance | Interpretation | Action |
|-------------------------------|-------------------------------|----------------|--------|
| On target (CPA/ROAS) | On target (CPA/ROAS) | Both performing | Keep "Presence or interest" |
| On target | Off target | Interest traffic underperforms | Switch to "Presence only" |
| Off target | On target | Unusual: investigate data | Check for anomalies before acting |
| Off target | Off target | Both underperforming | Investigate root cause beyond location settings |

### 1.4 Review distance report (local businesses only)

For businesses with location assets (store locations), pull the "Distance from location assets" report to see performance by distance from physical stores:

1. Navigate to Campaigns > Insights and reports > Report editor
2. Add the "Distance" dimension (available when location assets are active)
3. Review conversions, CPA, and ROAS by distance band

This report reveals how far customers travel to convert and helps set radius targeting boundaries based on actual performance data rather than assumptions.

---

## Phase 2️⃣: Analyze location performance

### 2.1 Establish campaign-level benchmarks

| Metric | Calculation |
| --- | --- |
| Average CPA | Total cost / Total conversions (all locations in this campaign) |
| Average conversion rate | Total conversions / Total clicks |
| Average ROAS | Total conversion value / Total cost (if value-based bidding) |

### 2.2 Categorize locations into three tiers

**Tier 1: High-performing (bid up candidates):** CPA 20%+ below campaign average, conversion rate at or above average, 50+ clicks.

**Tier 2: Underperforming (bid down candidates):** CPA 30%+ above campaign average, conversion rate below average, 50+ clicks.

**Tier 3: Zero-conversion (exclusion candidates):** Zero conversions, cost exceeds 2x campaign target CPA, 50+ clicks.

### 2.3 Check for patterns

Before acting on individual locations, look for regional clusters (adjust at regional level if neighbors share patterns), urban vs. rural splits (may indicate a landing page issue, not geographic), and seasonal anomalies (check 2+ periods before permanent exclusions).

---

## Phase 3️⃣: Apply adjustments

### 3.1 Decision gate: Bid strategy determines available actions

| Bid strategy | Location modifiers | Action |
| --- | --- | --- |
| Manual CPC | Fully effective | Apply modifiers per tiers below |
| Smart Bidding (tCPA, tROAS, Max Conv., Max Value) | Ignored by the algorithm | Use location exclusions only (skip to 3.4) |

> ⚠️ **Smart Bidding ignores location bid adjustments:** It already factors location into auction-time calculations. For Smart Bidding campaigns, only exclusions have an effect.

### 3.2 Apply bid modifiers (Manual CPC only)

**Tier 1 (high-performing):** Navigate to campaign > Locations. Set positive modifiers:

| Performance level | Modifier |
| --- | --- |
| CPA 20-30% below average | +10% to +15% |
| CPA 30-50% below average | +15% to +25% |
| CPA 50%+ below average | +25% to +30% |

**Tier 2 (underperforming):** Set negative modifiers:

| Performance level | Modifier |
| --- | --- |
| CPA 30-50% above average | -10% to -15% |
| CPA 50-75% above average | -15% to -25% |
| CPA 75%+ above average | -25% to -30% |

For first-round adjustments, start at the lower end. Do not exceed +/-30% until data confirms the direction.

> ↪️ **Modifier stacking:** Location modifiers stack with device and audience modifiers. See [Bid Modifier Reference](../references/Bid Modifier Reference.md) for stacking calculations.

### 3.3 Apply exclusions

For Tier 3 locations, navigate to campaign > Locations > Excluded tab and add the exclusion. Before excluding, verify the location has spent 2x+ target CPA with zero conversions, the pattern persists across 2+ analysis periods, and the exclusion does not block a significant portion of the addressable market.

### 3.4 Document all changes

| Location | Previous modifier | New modifier | Rationale |
| --- | --- | --- | --- |
| [location] | [%] | [%] | [Tier and performance data] |

---

## Phase 4️⃣: Validate and monitor

### 4.1 Review after 2-4 weeks

Pull the same location report and compare to baseline:

| Metric | Before | After | Change |
| --- | --- | --- | --- |
| Campaign CPA | | | |
| Campaign ROAS | | | |
| Total conversions | | | |
| Total cost | | | |

### 4.2 Adjust overcorrections

| Result | Action |
| --- | --- |
| CPA improved but volume dropped significantly | Reduce negative modifier by 5-10% |
| CPA worsened despite positive modifier | Remove modifier, investigate root cause |
| Excluded location converts in similar campaigns | Re-evaluate, consider negative modifier instead |

Schedule the next geographic review per the cadence table.

---

## Validation & definition of done

This SOP is complete when:

- [ ] Location targeting mode verified (presence vs. presence or interest)
- [ ] Location type comparison reviewed for "Presence or interest" campaigns
- [ ] Distance report reviewed (local businesses with location assets)
- [ ] Location performance data exported at correct granularity
- [ ] Campaign-level benchmarks calculated
- [ ] All locations with sufficient data categorized into Tier 1, 2, or 3
- [ ] Bid modifiers applied for Manual CPC campaigns (or skipped for Smart Bidding)
- [ ] Exclusions applied for zero-conversion, high-spend locations
- [ ] All changes documented with rationale
- [ ] Review date scheduled for next cycle

---

## Exit → entry bridge

| Timeframe | Action |
| --- | --- |
| 2-4 weeks | Review modifier impact, adjust overcorrections |
| 4 weeks | Review exclusion impact, confirm no negative side effects |
| Monthly | Re-run this SOP at scheduled cadence |
| Quarterly | Full geographic audit: re-evaluate all modifiers, exclusions, and targeting scope |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| Bid modifiers not taking effect | Confirm bid strategy is Manual CPC |
| Overall CPA increased after changes | Review modifier stacking in [Bid Modifier Reference](../references/Bid Modifier Reference.md) |
| Location data inflated by interest targeting | Update settings per [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) |
| Performance varies by device within a location | Layer device adjustments (See: [Bid Modifier Reference](../references/Bid Modifier Reference.md)) |

---

## Quick reference: support library

| Document | Type | Used in |
| --- | --- | --- |
| [Bid Modifier Reference](../references/Bid Modifier Reference.md) | Reference | Phase 3 (modifier ranges, stacking rules) |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference | Phase 1-2 (metric definitions) |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 (location targeting options) |

---

## Related SOPs

| SOP | Relationship |
| --- | --- |
| [SOP – Launch a Search Campaign](../sops/SOP – Launch a Search Campaign.md) | Upstream (initial location targeting set during launch) |
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Related (bid strategy determines modifier availability) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Related (geographic optimization complements bid scaling) |
| [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) | Upstream (monthly review may trigger geographic analysis) |

---

## Common failures

| Failure | Why it happens | How to avoid |
| --- | --- | --- |
| Applying modifiers on Smart Bidding campaigns | Not knowing Smart Bidding ignores them | Check bid strategy first (Phase 3.1) |
| Excluding locations with insufficient data | Reacting to low-volume zeros too early | Enforce 50-click minimum and 2x CPA threshold |
| Defaulting to "Presence only" for non-local businesses | Restricts reach without performance justification | Start with "Presence or interest", restrict only when location report data shows waste from interest traffic |
| First-round modifiers too aggressive | Overreacting to one period of data | Cap at +/-30%, use lower end of range |
| Not accounting for modifier stacking | Setting modifiers independently | Calculate combined effect per [Bid Modifier Reference](../references/Bid Modifier Reference.md) |
| Permanent exclusions from one period | Treating anomalies as trends | Require 2+ consistent periods before excluding |

---

## Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
