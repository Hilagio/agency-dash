# Conversion Volume Thresholds Reference
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CHEATSHEET_7
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Applies_To: Search, Shopping, PMax, Display, Video, Demand Gen
Domain: Measurement
Pillar: 5

## Purpose

Documents the minimum conversion volume required for each bid strategy across all campaign types, plus tactics for when you fall short.

---

## What this reference is / What this is NOT

**This reference:**

- Lists minimum conversion thresholds per bid strategy per campaign type
- Explains budget viability and conversion lag checks
- Provides a prioritized list of tactics when volume is insufficient

**This reference does NOT:**

- Recommend which bid strategy to choose (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Explain campaign structure decisions (See: campaign-specific Mental Models)
- Provide step-by-step bid strategy setup (See: campaign-specific SOPs)

---

## Quick reference: thresholds by campaign type

### Search

| **Bid Strategy** | **Absolute Minimum** | **Functional Minimum** | **Recommended** | **Notes** |
| --- | --- | --- | --- | --- |
| **Target CPA** | 15 | 30 | 50+ | |
| **Target ROAS** | 30 | 50 | 50+ | Needs more data due to value variance |
| **Maximize Conversions** | 15 | 30 | 50+ | No target: higher risk/less control |
| **Maximize Conv. Value** | 30 | 50 | 50+ | No target: higher risk/less control |
| **Target Impression Share** | N/A | N/A | N/A | Volume-based, not conversion-based |

### Standard Shopping

| **Bid Strategy** | **Absolute Minimum** | **Functional Minimum** | **Recommended** | **Notes** |
| --- | --- | --- | --- | --- |
| **Manual CPC** | N/A | N/A | N/A | Good starting point: more management |
| **Maximize Clicks** | N/A | N/A | N/A | Avoid in most cases |
| **Target ROAS** | 30 | 50 | 50+ | Needs data due to value variance |

### Performance Max (all verticals)

| **Bid Strategy** | **Absolute Minimum** | **Functional Minimum** | **Recommended** | **Notes** |
| --- | --- | --- | --- | --- |
| **Maximize Conversions** | N/A | N/A | N/A | Good for ramping (no target) |
| **Maximize Conv. Value** | N/A | N/A | N/A | Good for ramping (no target) |
| **Target CPA** | 15 | 30 | 50+ | Added on top of Max Conversions |
| **Target ROAS** | 30 | 50 | 50+ | Added on top of Max Conv Value |

### Display

| **Bid Strategy** | **Absolute Minimum** | **Functional Minimum** | **Recommended** | **Notes** |
| --- | --- | --- | --- | --- |
| **Target CPA** | 15 | 30 | 50+ | Standard threshold |
| **Target ROAS** | 30 | 50 | 50+ | Higher bar due to value variance |
| **Maximize Conversions** | 15 | 30 | 50+ | Good for ramping up |

### Video

| **Bid Strategy** | **Absolute Minimum** | **Functional Minimum** | **Recommended** | **Notes** |
| --- | --- | --- | --- | --- |
| **Target CPM** | N/A | N/A | N/A | Impression-based, not conversion-based |
| **Max CPV** | N/A | N/A | N/A | View-based, not conversion-based |
| **Target CPA** | 15 | 30 | 50+ | Only via Demand Gen (Video Action Campaigns merged into Demand Gen in 2025) |

### Demand Gen

| **Bid Strategy** | **Absolute Minimum** | **Functional Minimum** | **Recommended** | **Notes** |
| --- | --- | --- | --- | --- |
| **Target CPA** | 15 | 30 | 50+ | Standard threshold |
| **Target ROAS** | 30 | 50 | 50+ | Higher bar due to value variance |
| **Maximize Conversions** | 15 | 30 | 50+ | Good for ramping up |

> ⚠️ **Demand Gen needs higher volume per ad group:** Target 50+ conversions per ad group per 30 days. Demand Gen serves across multiple surfaces (YouTube, Discover, Gmail) and needs more signal to allocate between them. Consolidate ad groups aggressively.

> ⚠️ **Maximize Conversion Value eligibility for Demand Gen:** Requires at least 50 conversions with value in the past 30 days within the campaign, or at least 100 conversions with value across all Demand Gen campaigns in the past 30 days. Without meeting this threshold, Maximize Conversion Value (including tROAS) is not available as a bid strategy.

---

## Budget viability check

Meeting the conversion threshold is necessary but not sufficient. You also need enough budget to get there.

| **Check** | **What to Evaluate** | **Example** |
| --- | --- | --- |
| **CPC vs. budget** | Can your daily budget generate enough clicks to produce 30+ conversions/month? | At €15 CPC and 3% conversion rate, you need ~1,000 clicks/month = €15,000/month. If your budget is €5,000, you cannot hit 30 conversions. |
| **High-CPC verticals** | Legal, insurance, B2B SaaS often have €20-80+ CPCs | Even 30 conversions/month may require €10,000-50,000+/month in budget |
| **Low-CPC verticals** | E-commerce, local services often have €1-5 CPCs | 30 conversions/month may only require €500-2,000/month |

**The formula:**

Required monthly budget = (Target conversions / Conversion rate) x Average CPC

If the result exceeds your budget, you need to consolidate campaigns or lower your bid strategy ambitions.

---

## Conversion lag check

Smart Bidding attribution happens over your conversion window, not instantly. Short evaluation windows undercount conversions.

| **Conversion Lag** | **Minimum Evaluation Window** | **Common In** |
| --- | --- | --- |
| 1-3 days | 7-14 days | E-commerce, impulse purchases |
| 7-14 days | 21-30 days | Local services, considered purchases |
| 14-30 days | 30-60 days | B2B SaaS, high-value services |
| 30-90 days | 60-180 days | Enterprise B2B, complex sales |

> ⚠️ **Evaluate over at least 2x your conversion lag:** A campaign that looks like it has 15 conversions/month may actually have 30+ once lagged conversions attribute. Check the "Days to conversion" report in Google Ads to understand your lag.

---

## When you can't hit thresholds

Use these tactics in priority order. Start at the top, move down only if the previous option is not viable.

| **Priority** | **Tactic** | **How It Works** | **Best For** |
| --- | --- | --- | --- |
| 1st | **Consolidate campaigns** | Merge campaigns with similar intent/targets into fewer campaigns | Over-segmented accounts, campaigns with <15 conversions each |
| 2nd | **Portfolio Bid Strategy** | Bundle multiple campaigns under one shared bid strategy | Campaigns that need separate budgets but can share bidding signals |
| 3rd | **Remove targets (ramp mode)** | Use Maximize Conversions or Maximize Conv. Value without a tCPA/tROAS target | New campaigns, campaigns exiting learning, insufficient history |
| 4th | **Move up the funnel** | Optimize for micro-conversions (add-to-cart, lead form start) instead of final conversions | Low-volume verticals where final conversions are scarce |
| 5th | **Reduce segmentation** | Fewer product segments, fewer ad groups, fewer campaigns | Shopping/PMax accounts with too many segments per bucket |
| 6th | **Expand targeting** | Broader match types, broader audiences, new geos | Campaigns limited by targeting, not by budget |
| Last | **Accept lower volume** | Run Manual CPC or Maximize Clicks if there's a compelling business reason | Niche verticals where 30 conversions/month is structurally impossible |

> ⚠️ **Portfolio Bid Strategies** can be a low-risk way to test consolidation. Bundle campaigns with similar targets, let Smart Bidding optimize across them. If performance improves, consider full consolidation.

---

## Threshold exceptions and nuances

| **Situation** | **Adjustment** |
| --- | --- |
| **Ecommerce with high value variance** | tROAS needs 50+ (not 30+) because revenue values vary widely between products |
| **Lead Gen with offline conversion import** | Thresholds apply to the imported conversion action, not form submissions |
| **Seasonal businesses** | Evaluate thresholds over your peak season, not low season |
| **New campaigns** | Start with Maximize Conversions (no target) to gather data, then add targets once volume is stable |
| **Multi-account / MCC** | Cross-account bid strategies are not available: each account must meet thresholds independently |
| **Product segmentation buckets** | Each bucket (Hero, Sidekick, Villain, Zombie) must independently meet thresholds. If not, consolidate buckets. |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
| --- | --- | --- |
| Setting tROAS with <50 conversions/month | Algorithm oscillates, performance unstable | Use Maximize Conv. Value (no target) until you hit 50 |
| Evaluating too early | Conversion lag makes volume look lower than reality | Wait 2x your conversion lag before judging |
| Splitting campaigns without checking volume | Each new campaign needs to independently hit thresholds | Calculate expected volume per campaign before splitting |
| Ignoring budget viability | Campaign technically has enough impressions but budget caps prevent conversions | Check CPC x required clicks vs. daily budget |
| Using target strategies during ramp-up | New campaigns have no history: targets constrain too early | Start targetless, add targets after 2-4 weeks of stable conversions |

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Uses thresholds for segmentation decisions |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Uses thresholds for Standard Shopping bid strategy selection |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Uses thresholds for Ecommerce PMax bid strategy decisions |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Uses thresholds for Lead Gen/SaaS PMax bid strategy decisions |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Uses thresholds for campaign type selection |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Uses thresholds for Display, Video, Demand Gen decisions |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Uses thresholds for segmentation bucket viability |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Downstream (bid strategy selection and configuration) |

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
