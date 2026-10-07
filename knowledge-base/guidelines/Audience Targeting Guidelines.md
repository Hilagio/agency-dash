# Audience Targeting Guidelines
Created: 2026-04-01

Support_ID: GUIDELINE_12
Status: Done
Category: Audiences
Reference Type: Guideline
Agent_Readable: Yes
Human_Facing: Yes
Domain: Audiences
Pillar: 7

## Purpose

Recommends audience targeting configuration for Video and Demand Gen campaigns: when to enable or disable expansion features, how to use targeting vs observation mode, demographic optimization patterns, and content targeting layering decisions.

---

## What this is / What this is NOT

**This guideline:**

- Recommends specific settings per campaign type and goal
- Explains when to enable/disable expansion features with rationale
- Provides decision criteria for targeting mode, demographics, and content layering
- Includes exception conditions for each recommendation

**This guideline does NOT:**

- Explain how features work mechanically (See: [Audience Targeting Reference](../references/Audience Targeting Reference.md))
- Provide step-by-step targeting setup (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))
- List audience segment options (See: [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md))

---

## Optimized Targeting and Audience Expansion

### Recommended settings

| Campaign type | Goal | Feature | Recommended setting | Rationale |
|--------------|------|---------|-------------------|-----------|
| Video | Reach and views goals | Audience expansion | **ON** | Broader reach is the goal for these campaigns. |
| Demand Gen | Remarketing | Optimized targeting | **OFF** | Remarketing needs audience restriction. |
| Demand Gen | Prospecting | Optimized targeting | **Test ON vs OFF** | Measure expansion CPA before committing. Run 14+ days with ON, compare to OFF. |

### Exception conditions

| Recommendation | Override when |
|---------------|-------------|
| Expansion OFF for remarketing | Remarketing audiences are too small (<1,000 users) and campaigns cannot serve. Enable temporarily while building audience volume. |
| Expansion ON for prospecting | You need clean segment-level data to evaluate which audiences work. Turn OFF during initial 30-day testing phase. |
| Expansion ON for Video reach and views | Budget is limited and you need controlled reach. Turn OFF and use specific placements instead. |

### Measuring expansion impact

Validate these settings against the expansion and optimized targeting breakdown, reported under Audiences, keywords, and content > Audiences as the "Total: Expansion and optimized targeting" row.

| Expanded CPA vs targeted CPA | Action |
|------------------------------|--------|
| < 1.5x | Expansion is working. Keep ON. |
| 1.5-2x | Monitor for 14+ more days before deciding. |
| > 2x | Expansion is inefficient. Turn OFF. |
| Expansion delivers > 50% of conversions | Your audience selections are too narrow. Review segments before disabling expansion. |

> ⚠️ **Demand Gen demographic behavior.** When optimized targeting is ON in Demand Gen, Google may serve beyond your demographic selections. Review demographic performance after enabling. Restrict to age and gender only in ad group settings when a group crosses the outlier threshold in Demographic Optimization.

---

## Targeting vs Observation Mode

### Recommended settings

| Scenario | Mode | Rationale |
|----------|------|-----------|
| Remarketing campaigns | **Targeting** | You know who to reach. Restrict delivery to these users. |
| Proven prospecting audiences | **Targeting** | Audiences validated through testing. Commit budget to them. |
| New/untested audiences | **Observation** | Gather performance data without committing budget. Graduate to Targeting after 30+ days if CPA meets target. |
| Bid adjustment testing | **Observation** | Apply bid modifiers per segment without restricting delivery. |
| Demand Gen (all) | **Targeting** | Demand Gen does not support Observation mode. |

### Exception conditions

| Recommendation | Override when |
|---------------|-------------|
| Observation for new audiences | You have strong external data (e.g., CRM analysis) confirming audience quality. Skip Observation and go directly to Targeting. |
| Targeting for proven audiences | You suspect audience decay (CPA rising over 3+ months). Switch to Observation to re-evaluate without losing all delivery. |

### Graduation criteria (Observation to Targeting)

| Metric | Threshold |
|--------|-----------|
| Minimum data | 30+ days and 50+ clicks |
| CPA | Within 1.5x campaign average |
| Conversion volume | 5+ conversions in Observation period |

Segments that do not meet these thresholds after 60 days: remove from Observation.

---

## Demographic Optimization

### Recommended approach

Demographics function as a refinement layer on top of audience segments, not as standalone targeting.

| Phase | Action | Timing |
|-------|--------|--------|
| Launch | Target all demographic groups (no exclusions) | Day 1 |
| Data collection | Gather 30+ days of performance data per group | Days 1-30 |
| Analysis | Identify outliers: CPA > 2x campaign average with 50+ clicks | Day 30+ |
| Optimization (Manual CPC) | Apply bid adjustments per group (max 20% change per cycle) | Monthly |
| Optimization (Smart Bidding) | Exclude underperforming groups | Monthly |

### Exception conditions

| Recommendation | Override when |
|---------------|-------------|
| Target all demographics at launch | You have strong prior data from the same account/vertical confirming a demographic group never converts. Exclude from day 1. |
| Wait 30 days before excluding | A demographic group has 100+ clicks and zero conversions. Exclude at 14 days. |
| Never exclude "Unknown" | "Unknown" shows CPA > 2x campaign average with 50+ clicks after 30+ days. Exclude cautiously: this removes 15-30% of inventory. |

---

## Content Targeting Layering (Video, Demand Gen)

### Recommended approach

Content targeting controls WHERE ads appear. It complements audience targeting (WHO sees ads).

| Goal | Strategy | Effect on reach |
|------|----------|----------------|
| Maximum reach | Use audience targeting OR content targeting, not both | Full inventory available |
| Maximum relevance | Use audience targeting AND content targeting | Significant reach reduction (AND logic) |
| Brand safety | Add content exclusions (topics, placements) | Moderate reach reduction |

### When to add content targeting

| Condition | Add content targeting? | Type |
|-----------|----------------------|------|
| High CPA on Video prospecting | Yes: add relevant topics to restrict placement context | Topics |
| Brand safety concerns | Yes: add specific placements you trust | Managed placements |
| Strong performance on specific sites | Yes: target those sites directly | Managed placements |
| Low volume on Video | No: content targeting restricts reach further | N/A |
| Testing new audiences | No: content targeting masks audience-level signal quality | N/A |

### Exception conditions

| Recommendation | Override when |
|---------------|-------------|
| No content targeting during audience testing | You have unlimited budget and want to test audience + context simultaneously. Run separate ad groups for clean comparison. |
| Topics for CPA reduction | Zero-conversion topics remain after 30+ days: remove them rather than adding more topics. |

> ⚠️ **Demand Gen: layer, never standalone.** In Demand Gen, content targeting is a secondary layer on top of audience targeting, never standalone.

---

## Lookalike Configuration (Demand Gen)

### Recommended settings

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| Seed source | Converters or high-LTV customers | Seed quality is the primary control lever. All-visitors seeds produce weak lookalikes. |
| Seed size | No minimum enforced (5,000+ recommended) | Larger, cleaner seeds give Google more data points for modeling. |
| Reach setting | Start with **Balanced** | Strongest similarity at reasonable scale. |
| Mode | Suggestion mode (default) | Allows Google to serve to qualified users beyond the threshold. Opting out to strict targeting is an advanced control, requested via Google support. |

> 💡 **Judge Lookalikes by segment-level performance, not targeting intent.** Suggestion mode means delivery is not confined to the modeled segment, and the reach slider is not a hard boundary. Evaluate the segment on its reported CPA/ROAS and let that data drive changes.

### When to change reach settings

| Current performance | Action |
|--------------------|--------|
| Volume too low with Balanced | Move to Broad. Prioritize improving seed quality over reach setting. |
| CPA too high with Balanced | Move to Narrow. If CPA is still high, the issue is seed quality, not reach. |
| Stable performance, want more volume | Move to Broad. Monitor CPA for 14+ days. |

### Exception conditions

| Recommendation | Override when |
|---------------|-------------|
| Start with Balanced | You have a very small seed (<2,000 users). Start with Broad to ensure delivery. |
| Use converters as seed | You have no conversion data. Use high-engagement website visitors (5+ sessions, pricing page visitors) as a proxy. |

---

## Campaign Settings Summary

### Video

| Setting | Recommended | Exception |
|---------|------------|-----------|
| Targeting mode | Targeting for remarketing, Observation for prospecting testing | Switch to Targeting for proven audiences |
| Audience expansion (reach and views goals) | ON for reach | OFF when budget is limited |
| Frequency capping | 2-3 impressions per user per day for video | Higher for sequential messaging |
| Content exclusions | Limited inventory recommended, Moderate minimum | Maximum inventory only for maximum reach campaigns |

### Demand Gen

| Setting | Recommended | Exception |
|---------|------------|-----------|
| Optimized targeting | OFF for remarketing, test for prospecting | Keep OFF during first 30 days of a new campaign |
| Lookalike reach | Balanced | Narrow for efficiency focus, Broad for volume |
| Content targeting | Secondary layer on top of audience targeting, never standalone | N/A |
| Content suitability | Managed at account level (applies account-wide) | N/A |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | How features work mechanically |
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Segment options and combined segment patterns |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Conceptual framework for signals vs targeting |
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Content exclusion recommendations |
| [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) | Validates targeting setup |
| [Audience Targeting Health Checklist](../checklists/Audience Targeting Health Checklist.md) | Validates ongoing targeting health |

---

## Version details

- **Version:** 1.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
