# Bid Strategy Selection Reference
Created: 2026-02-04
Updated: 2026-08-27

Support_ID: CHEATSHEET_25
Status: Done
Category: Bidding
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

Documents the decision trees for selecting an initial bid strategy when creating a new campaign, covering all five campaign types: Search, Standard Shopping, Performance Max, Video, and Demand Gen.

---

## What this reference is / What this is NOT

**This reference:**

- Provides a decision tree for each of the five campaign types
- Helps you determine the correct initial bid strategy for a new campaign
- Documents the key decision points: data availability, optimization goal, and efficiency control
- Covers all available bid strategies per campaign type

**This reference does NOT:**

- Explain how smart bidding works under the hood (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Tell you how to calculate CPA or ROAS targets (See: [Unit Economics Reference](../references/Unit Economics Reference.md))
- List minimum conversion thresholds per strategy (See: [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md))
- Provide step-by-step bid strategy setup instructions (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Cover scaling or migration from an existing bid strategy (that uses a separate optimization-phase framework)

---

## Quick reference: strategies by campaign type

| Campaign Type | Manual CPC | Max Clicks | Target Imp. Share | Viewable CPM | Max CPV | Target CPV | Target CPM | Max Conv. | Target CPA | Max Conv. Value | Target ROAS |
|---------------|:----------:|:----------:|:-----------------:|:------------:|:-------:|:----------:|:----------:|:---------:|:----------:|:---------------:|:-----------:|
| **Search** | Yes | Yes | Yes | No | No | No | No | Yes | Yes | Yes | Yes |
| **Standard Shopping** | Yes | Yes | No | No | No | No | No | No | No | No | Yes |
| **Performance Max** | No | No | No | No | No | No | No | Yes | Yes | Yes | Yes |
| **Video** | No | No | No | No | Yes | Yes | Yes | No | No | No | No |
| **Demand Gen** | No | Yes | No | No | No | No | No | Yes | Yes | Yes | Yes |

> 💡 **Target CPA and Target ROAS use the same bidding as Maximize Conversions and Maximize Conversion Value, with an efficiency target added.** They appear as standalone strategy selections in the UI. You can pick "Target CPA" or "Target ROAS" directly, or pick Maximize Conversions / Maximize Conversion Value and add the target: both routes configure the same underlying strategy.

---

## Search

Search offers the widest range of bid strategies, from full manual control to value-based Smart Bidding.

```
Do you need full control over bids?
│
├─ YES → Use Manual CPC
│
└─ NO → Is the account new (zero historical data)?
         │
         ├─ YES → Do you have niche knowledge?
         │        │
         │        ├─ YES → Start with Maximize Clicks
         │        │
         │        └─ NO → Start with Manual CPC
         │
         └─ NO → New campaign with unfamiliar targeting?
                  │
                  ├─ YES → Do you have niche knowledge?
                  │        │
                  │        ├─ YES → Start with Maximize Clicks
                  │        │
                  │        └─ NO → Start with Manual CPC
                  │
                  └─ NO → Choose automated strategy based on goal:
                           │
                           ├─ Goal = Visibility (impressions)?
                           │  └─ YES → Use Target Impression Share
                           │
                           ├─ Goal = Traffic (clicks)?
                           │  └─ YES → Use Maximize Clicks
                           │
                           ├─ Goal = Conversion volume?
                           │  └─ YES → Sufficient conversion data?
                           │           │
                           │           ├─ YES → Want to control CPA?
                           │           │        │
                           │           │        ├─ YES → Use Target CPA
                           │           │        │
                           │           │        └─ NO → Use Maximize Conversions
                           │           │
                           │           └─ NO → Use Maximize Conversions
                           │
                           └─ Goal = Conversion value?
                              └─ YES → Sufficient conversion data?
                                       │
                                       ├─ YES → Want to control ROAS?
                                       │        │
                                       │        ├─ YES → Use Target ROAS
                                       │        │
                                       │        └─ NO → Use Maximize Conversion Value
                                       │
                                       └─ NO → Use Maximize Conversion Value
```

> ⚠️ **New accounts without niche knowledge:** Manual CPC collects data conservatively, and the migration to a conversion-focused strategy waits until keyword-level performance is known.

> 💡 **Niche knowledge means** you have run similar campaigns before: you know which keywords work, you have a negative keyword list ready, and you can target precisely enough to avoid wasteful spend on Maximize Clicks.

---

## Standard Shopping

Standard Shopping has a narrower set of available strategies. Manual CPC is the default starting point for new accounts.

```
Do you need full control over bids?
│
├─ YES → Use Manual CPC
│
└─ NO → Is the account new (zero historical data)?
         │
         ├─ YES → Start with Manual CPC
         │        │
         │        └─ Want to gather data aggressively?
         │           │
         │           ├─ YES → Start with Maximize Clicks
         │           │
         │           └─ NO → Continue with Manual CPC
         │
         └─ NO → New campaign with unfamiliar targeting?
                  │
                  ├─ YES → Same as new account (Manual CPC or Maximize Clicks)
                  │
                  └─ NO → Choose automated strategy based on goal:
                           │
                           ├─ Goal = Traffic (clicks)?
                           │  └─ YES → Use Maximize Clicks
                           │
                           └─ Goal = Conversion value?
                              └─ YES → Sufficient conversion data?
                                       │
                                       └─ YES → Use Target ROAS
```

> 💡 **Standard Shopping defaults to Manual CPC for new accounts** because the default approach is more conservative than Search. Maximize Clicks is the aggressive-data-gathering alternative, at the cost of higher initial spend.

---

## Performance Max

Performance Max only supports Smart Bidding strategies. There is no manual option.

```
Goal = Conversion volume?
│
├─ YES → Sufficient conversion data?
│        │
│        ├─ YES → Want to control CPA?
│        │        │
│        │        ├─ YES → Use Target CPA
│        │        │
│        │        └─ NO → Use Maximize Conversions
│        │
│        └─ NO → Use Maximize Conversions
│
└─ NO → Goal = Conversion value?
         │
         └─ YES → Sufficient conversion data?
                  │
                  ├─ YES → Want to control ROAS?
                  │        │
                  │        ├─ YES → Use Target ROAS
                  │        │
                  │        └─ NO → Use Maximize Conversion Value
                  │
                  └─ NO → Use Maximize Conversion Value
```

> ⚠️ **No manual fallback:** Performance Max has no Manual CPC or Maximize Clicks option. Without conversion data, the entry point is Maximize Conversions with no target, ramping spend to build data. The levers that accelerate data collection are conversion-tracking fixes, a micro conversion action, and higher budgets.

---

## Video

Video campaigns carry the "YouTube reach, views, and engagements" objective. Conversion-focused bidding strategies (Target CPA, Maximize Conversions, Target ROAS, Maximize Conversion Value) are **not available** in Video campaigns. Conversion-focused video advertising runs on **Demand Gen**.

```
Goal = Video views?
│
├─ YES → Using YouTube Shorts Ads?
│        │
│        ├─ YES → Use Target CPV
│        │
│        └─ NO → Use Maximum CPV
│
└─ NO → Goal = Reach, frequency, or ad sequencing?
         │
         └─ YES → Use Target CPM
```

| Campaign subtype | Bid strategy |
|------------------|--------------|
| Video views | Target CPV |
| Efficient reach | Target CPM |
| Non-skippable reach | Target CPM |
| Target frequency | Target CPM |
| Ad sequence | Target CPM or Maximum CPM |
| Audio reach | Target CPM |

> 💡 **Video bids to reach and views, never to conversions:** brand building, reach, frequency, and video views are what the "YouTube reach, views, and engagements" objective optimizes toward. Conversion-focused objectives on YouTube, Discover, and Gmail inventory belong to Demand Gen.

---

## Demand Gen

Demand Gen campaigns support click-based and conversion-based strategies but no manual bidding or awareness-specific options.

```
Goal = Traffic (clicks)?
│
├─ YES → Use Maximize Clicks
│
└─ NO → Goal = Conversion volume?
         │
         ├─ YES → Sufficient conversion data?
         │        │
         │        ├─ YES → Want to control CPA?
         │        │        │
         │        │        ├─ YES → Use Target CPA
         │        │        │
         │        │        └─ NO → Use Maximize Conversions
         │        │
         │        └─ NO → Use Maximize Conversions
         │
         └─ NO → Goal = Conversion value?
                  │
                  └─ YES → Sufficient conversion data?
                           │
                           ├─ YES → Want to control ROAS?
                           │        │
                           │        ├─ YES → Use Target ROAS
                           │        │
                           │        └─ NO → Use Maximize Conversion Value
                           │
                           └─ NO → Use Maximize Conversion Value
```

> ⚠️ **Demand Gen targets sit at least 2x looser than Non-Branded Search:** Target CPA at least 2x higher, Target ROAS at least 2x lower. Upper funnel traffic converts at lower rates, so Search-level targets choke volume.

> 💡 **Demand Gen functional minimum is 30+ conversions/month for Target CPA, 50+ for Target ROAS.** The budget that sustains that volume is target conversions x average CPA.

> 💡 **Demand Gen budget minimum:** at least 10x the target CPA per day, with a floor of €100 per day on Maximize conversions. At a €20 target CPA that is €200 per day. Below the floor, delivery is throttled.

---

## Common decision points

These concepts appear across multiple decision trees.

### Sufficient conversion data

The threshold depends on bid strategy (applies to campaigns that support conversion-based bidding):

| Campaign Type | Target CPA (functional min) | Target ROAS (functional min) | Recommended (both) |
|---------------|:---------------------------:|:----------------------------:|:------------------:|
| Search | 30+ | 50+ | 50+ |
| Standard Shopping | N/A | 50+ | 50+ |
| Performance Max | 30+ | 50+ | 50+ |
| Demand Gen | 30+ | 50+ | 50+ |

> ⚠️ **Absolute minimum is 15 conversions/month for volume strategies (Target CPA, Maximize Conversions) and 30 for value strategies (Target ROAS, Maximize Conversion Value):** below those floors the strategy does not have enough signal. Expect high volatility for the 15 conversions above each floor. Consolidate campaigns or use Portfolio Bid Strategies to pool data if individual campaigns fall short.

> 💡 **Video campaigns do not support conversion-based bidding.** Conversion-focused video advertising runs on Demand Gen.

The levers that close a volume shortfall, in priority order:

| Priority | Lever | Effect |
|----------|-------|--------|
| 1 | Conversion tracking fixes | Recovers conversions already happening but not recorded |
| 2 | Campaign consolidation | Pools volume from campaigns with similar intent and targets |
| 3 | Portfolio Bid Strategy | Pools conversion data across campaigns that need separate budgets |
| 4 | Micro conversion as primary action | Higher volume, earlier in the funnel |
| 5 | Higher budgets | Accelerates data flow at the current conversion rate |
| 6 | Maximize Clicks or Manual CPC | Holds position until data accumulates |

> ↪️ **Full threshold details:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md)

### Niche knowledge

You have niche knowledge when:

- You have run similar campaigns before (same vertical, same keyword themes)
- You have a validated negative keyword list ready
- You understand which queries convert and which waste budget
- You can target precisely enough that Maximize Clicks will not burn through budget on irrelevant traffic

Without niche knowledge, Manual CPC is the safer starting point because it limits exposure while you learn.

### Familiar vs. unfamiliar targeting

Smart Bidding learns at the **query level**, not the keyword level. It uses conversion data from search queries across your entire account. If you launch a new campaign targeting queries that already have conversion history in other campaigns, Smart Bidding can apply those learnings immediately.

This means:

- **Familiar targeting** (existing queries with data): apply an automated bid strategy from day one
- **Unfamiliar targeting** (new queries, new keyword themes): treat it like a new account and collect data first

### New account vs. new campaign

| Scenario | What it means | Starting approach |
|----------|--------------|-------------------|
| New account, zero data | No conversion history anywhere | Manual CPC or Maximize Clicks (based on niche knowledge) |
| Existing account, new campaign with familiar queries | Queries already have conversion data in other campaigns | Automated strategy from day one |
| Existing account, new campaign with unfamiliar queries | New keyword themes with no account-level query data | Treat like a new account |

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Starting with Target CPA/ROAS on a new account | Smart Bidding has no conversion data to optimize against, leading to erratic bids and wasted budget | Start with Maximize Clicks or Manual CPC, then migrate once you reach sufficient volume (30+ functional minimum for tCPA, 50+ recommended for stability) |
| Setting Target CPA/ROAS targets based on Search benchmarks for Demand Gen | Upper-funnel campaign types have lower conversion rates, so Search-level targets are unrealistically tight | Set Demand Gen tCPA at 2x the Search CPA and tROAS at 0.5x the Search ROAS |
| Using Maximize Clicks permanently | Maximize Clicks optimizes for traffic, not conversions, so it keeps spending on low-quality clicks indefinitely | Migrate to a conversion-focused strategy once you accumulate sufficient conversion data |
| Choosing a conversion value strategy without conversion values | Maximize Conversion Value and Target ROAS require conversion value data to optimize, defaulting to arbitrary behavior without it | Ensure conversion tracking sends actual values before using value-based bidding |
| Ignoring the unfamiliar targeting check | Launching a new keyword theme in an existing account and assuming Smart Bidding will work because the account has data | Check whether the new campaign targets queries Smart Bidding has already seen in other campaigns |
| Setting daily budget below the Demand Gen serving floor | Smart Bidding cannot find enough auctions within a constrained budget, leading to inconsistent delivery | Set daily budget to at least 10x target CPA, minimum €100/day on Maximize conversions |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Conceptual framework for understanding bid strategy categories and progression |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | How Smart Bidding works under the hood: signals, learning periods, auction-time bidding |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum conversion volumes per strategy per campaign type |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | How to calculate breakeven CPA/ROAS and set efficiency targets |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Budget allocation and pacing mechanics |

---

## Version details

- **Version:** 3.0
- **Last Updated:** August 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
