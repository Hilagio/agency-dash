# Budget Pacing Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_27
Status: Done
Category: Bidding
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

Documents the mechanics of Google Ads budgets: daily limits, monthly spending caps, individual vs. shared budgets, budget reports, and pacing controls.

---

## What this reference is / What this is NOT

**This reference:**

- Explains how Google Ads daily and monthly budget limits work
- Documents individual budgets vs. shared budgets with pros and cons
- Covers budget pacing reports and custom columns for monitoring
- Explains the daily spending limit (2x rule)

**This reference does NOT:**

- Tell you how much to budget (See: [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md))
- Provide step-by-step budget allocation instructions (See: [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md))
- Cover bid strategy selection or bid targets (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))

---

## Quick reference: budget concepts

| Concept | Definition | Formula |
|---------|-----------|---------|
| **Average daily budget** | The amount you are willing to spend per day per campaign | Set by advertiser (minimum ~€1/day) |
| **Daily spending limit** | Maximum Google can spend on any single day | Average daily budget x 2 |
| **Monthly spending limit** | Maximum Google can charge per campaign per month | Average daily budget x 30.4 |
| **Shared budget** | One daily budget distributed across multiple linked campaigns | Set once, Google allocates across campaigns |
| **Individual budget** | A specific daily budget for one campaign only | Set per campaign |

> 💡 **Google can spend up to 2x your daily budget on any given day:** This is by design: Google overspends on high-opportunity days and underspends on low-opportunity days. Your monthly total will never exceed your monthly spending limit.

---

## Daily spending limit

### How it works

Google may spend up to twice your average daily budget on a given day if it predicts higher conversion opportunities. On slower days, Google will underspend to compensate.

| Day type | Spend behavior | Example (100 EUR daily budget) |
|----------|---------------|-------------------------------|
| High-opportunity day | Up to 2x daily budget | Spend: 180 EUR |
| Normal day | Near daily budget | Spend: 95 EUR |
| Low-opportunity day | Below daily budget | Spend: 45 EUR |

**Monthly cap protection:** regardless of daily fluctuations, Google will never charge more than your average daily budget x 30.4 in a calendar month. If you set 100 EUR/day, your maximum monthly charge is 3,040 EUR.

### Ad schedule interaction

The monthly spending limit (30.4x daily budget) applies regardless of ad schedule configuration. A campaign running 12 hours per day spends the same monthly total as a campaign running 24 hours per day: the budget concentrates into active hours rather than being proportionally reduced.

| Schedule | Monthly cap | Per-hour spend behavior |
|----------|-------------|------------------------|
| 24 hours/day | 30.4x daily budget | Spread across all hours |
| 12 hours/day | 30.4x daily budget | Concentrated into 12 active hours |
| 8 hours/day | 30.4x daily budget | Concentrated into 8 active hours |

To reduce total monthly spend, lower the daily budget. Ad schedules control when ads show, not how much you spend in total.

### What to tell stakeholders

Stakeholders often react to days where spend exceeds the daily budget. Educate them proactively:

- Daily spend can be up to 2x the set budget on any given day
- Monthly spend is capped at 30.4x the daily budget
- Overspend days are compensated by underspend days
- This behavior helps Google maximize results by capitalizing on high-opportunity moments

---

## Monthly spending limit

| Monthly days | Daily budget | Monthly limit |
|-------------|-------------|---------------|
| 28 days (February) | 100 EUR | 3,040 EUR (30.4 x 100) |
| 30 days | 100 EUR | 3,040 EUR (30.4 x 100) |
| 31 days | 100 EUR | 3,040 EUR (30.4 x 100) |

The 30.4 multiplier is constant regardless of the actual number of days in the month or ad schedule configuration. Google uses this average to keep billing consistent.

### Mid-month budget changes

If you change your daily budget mid-month:

- Google recalculates the monthly spending limit based on the new daily budget
- Already spent amounts count toward the new limit
- Reducing budget mid-month can result in underspend for the rest of the month as Google adjusts

---

## Individual budgets vs. shared budgets

### Individual campaign budgets

Each campaign has its own daily budget set independently.

| Pros | Cons |
|------|------|
| Full control over per-campaign spend | Requires constant monitoring and adjustment |
| Allocate by campaign priority and goals | Unspent budget in one campaign cannot shift to others |
| Essential for performance-based bucketing | Can lead to under-utilization or over-funding |
| Required for campaign experiments | More management overhead for large accounts |
| Protect critical campaigns from underfunding | |

### Shared budgets

One daily budget shared across multiple linked campaigns. Google distributes spend based on opportunity.

| Pros | Cons |
|------|------|
| Simplified management (one budget for multiple campaigns) | Less control over per-campaign allocation |
| Google redistributes to highest-opportunity campaigns | Risk of one campaign consuming the entire budget |
| Ideal for campaigns with aligned goals | Not compatible with many campaign experiments |
| Reduces wasted budget from underperforming campaigns | Requires trust in Google's allocation algorithm |
| Good for initial learning phase across new campaigns | Cannot prioritize one campaign over another |

### Where to find shared budgets

Google Ads > Tools > Budgets and Bidding > Shared budgets

### Shared budget + portfolio bid strategy

Combining a shared budget with a portfolio bid strategy creates the most automated setup:

- One efficiency target (CPA or ROAS) across multiple campaigns
- One pooled budget across those same campaigns
- Google optimizes both bid levels and budget allocation simultaneously

This is powerful for accounts where campaigns share the same business objective and efficiency targets.

> ⚠️ **Shared budgets do not work with campaign experiments in most cases:** If you run frequent experiments, use individual budgets for those campaigns.

---

## When to use each budget type

| Situation | Recommended budget type | Why |
|-----------|----------------------|-----|
| Campaigns with different objectives | Individual | Need independent control per objective |
| Brand campaigns | Individual | Cannot risk underfunding brand defence |
| Performance-based bucketing (Shopping, PMax) | Individual | Budget distribution IS the strategy |
| Campaigns sharing the same efficiency target | Shared | Simplifies management, Google optimizes allocation |
| New campaign launches (learning phase) | Shared | Flexible, lets Google find the best allocation |
| Time-sensitive campaigns (Black Friday, promotions) | Individual | Need guaranteed spend levels |
| Large account with similar search campaigns | Either | Shared saves management time, individual offers control |
| Running campaign experiments | Individual | Shared budgets have experiment compatibility issues |

---

## Budget pacing reports

### Accessing budget reports

1. Navigate to your campaign list
2. Click on the budget amount for any campaign
3. Select "View budget report" from the dropdown

For shared budgets: Tools > Budgets and Bidding > Shared budgets > select budget > view report

### What the report shows

| Metric | What it tells you |
|--------|------------------|
| Average daily budget | Your set budget level |
| Monthly spending limit | Maximum charge for the month (30.4 x daily) |
| Spend to date | How much has been spent so far this month |
| Projected spend | Google's forecast for remaining month |
| Daily spend chart | Visual of daily spend vs. daily budget |

### Custom columns for budget monitoring

Create these custom columns for better budget visibility:

| Custom column | Formula | Purpose |
|--------------|---------|---------|
| **Daily budget spent %** | Cost / (Budget x Days in period) x 100 | Shows if you are pacing on target |
| **Actual daily spend** | Cost / Days in period | Average daily spend for comparison against budget |

Combine these with the **Search lost IS (budget)** column to identify campaigns where budget is limiting volume.

---

## Budget pacing rules

| Rule | Details |
|------|---------|
| Never spend more than 2x daily in one day | Hard limit enforced by Google |
| Never exceed 30.4x daily per month | Monthly spending cap |
| Budget changes take effect immediately | No delay, but recalculation of monthly limit |
| Campaign must be active for spend | Paused campaigns do not spend |
| Shared budgets distribute dynamically | Allocation changes throughout the day based on opportunity |

---

## Campaign total budgets (video only)

Video campaigns with a defined start and end date can use a **campaign total budget** instead of a daily budget. Google distributes the total evenly across the campaign duration, with daily fluctuations.

| Setting | How it works |
|---------|-------------|
| Campaign total | Set one total amount for the campaign's lifetime |
| Daily pacing | Google distributes approximately evenly, with some daily variation |
| Underspend | If Google cannot spend the full budget, remaining amount is not spent |
| Overspend protection | Total spend will not exceed the set campaign total |

This is only available for video campaigns. All other campaign types use daily budgets (individual or shared).

---

## Budget sufficiency diagnostics

These thresholds determine whether a campaign's daily budget is sufficient for Smart Bidding to optimize effectively.
### Daily budget-to-CPA ratio

The daily budget must be large enough for Smart Bidding to generate the minimum conversion volume it needs to learn. The ratio derives directly from the conversion volume thresholds in the [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

**The math:**

```
Required daily budget = (Minimum monthly conversions / 30.4) x Target CPA
```

| Bid Strategy | Min Monthly Conversions | Required Daily Budget | Implied Budget:CPA Ratio |
|-------------|------------------------|----------------------|--------------------------|
| **Target CPA** | 30 (functional min) | ~1x target CPA/day | 1x |
| **Target ROAS** | 50 (functional min) | ~1.6x target CPA/day | 1.6x |
| **Recommended (any)** | 50+ | ~1.6x target CPA/day | 1.6x+ |

| Budget:CPA Ratio | Verdict | Implication |
|-------------------|---------|-------------|
| **<1x target CPA** | FAIL | Below absolute minimum: cannot produce 30 conversions/month even at perfect efficiency. |
| **1-1.6x target CPA** | WARN | Meets Target CPA minimum (30/month) but falls short of Target ROAS minimum (50/month). Tight. |
| **1.6x+ target CPA** | PASS | Meets or exceeds functional minimums for all Smart Bidding strategies. |

> ⚠️ **These are minimums, not targets.** Higher ratios give Smart Bidding more daily headroom to explore auction segments, but the floor is set by whether the budget produces enough monthly conversions for the algorithm to learn.

### Budget exhaustion timing

If a campaign's daily budget exhausts before the end of the business day, high-value late-day conversions are missed.

| Indicator | How to Check | Action |
|-----------|-------------|--------|
| Budget depleting before 6pm local time | Hourly spend report: spend drops to near-zero in afternoon hours, 3+ days per week | Increase daily budget or apply ad schedule to concentrate spend in converting hours |
| Budget depleting inconsistently | Some days exhaust early, others underspend | Check for 2x daily spending behavior: Google may overspend early on high-opportunity days |
| Budget never exhausting | Daily spend consistently 50%+ below budget | Budget is not the constraint: consider improving bids, keywords, or targeting |

### Google's 2x daily overspend limit

Google can spend up to 2x the daily budget on any single day. This is a feature, not a bug, but it creates diagnostic implications:

| Scenario | What It Means | Action |
|----------|--------------|--------|
| Daily spend regularly hits 2x budget | Campaign is heavily budget-constrained on high-opportunity days | Increase budget or tighten targeting to reduce wasteful impressions |
| Daily spend regularly hits 2x AND campaign is profitable | Strong signal to increase budget: high-opportunity days are producing results | Increase daily budget by 20-30%, monitor IS lost to budget |
| Daily spend rarely hits 2x but monthly cap is reached | Steady spend across days, but 30.4x monthly limit constraining | Check if daily budget is set correctly for monthly goals |

### Minimum budget for conversion volume

Smart Bidding requires minimum conversion volume to function. The budget must support that volume at the current CPC and conversion rate.

**Formula:**

```
Required daily budget = (Minimum monthly conversions / 30.4) / Conversion rate x Average CPC
```

**Per bid strategy (using functional minimums from [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md)):**

| Bid Strategy | Min Monthly Conversions | At 3% CVR, 3 EUR CPC | At 1% CVR, 15 EUR CPC |
|-------------|------------------------|----------------------|----------------------|
| Target CPA | 30 | 99 EUR/day | 1,480 EUR/day |
| Target ROAS | 50 | 164 EUR/day | 2,467 EUR/day |
| Max Conversions | 30 | 99 EUR/day | 1,480 EUR/day |

If the required daily budget exceeds the available budget, consolidate campaigns or move up the funnel. (See: [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) "When you can't hit thresholds")

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Panicking when daily spend exceeds budget | Normal behavior, monthly cap protects you | Educate stakeholders on 2x daily limit |
| Setting very low daily budgets on smart bidding | Smart bidding cannot optimize with insufficient budget | Budget enough to produce 30+ conversions/month (Target CPA) or 50+ (Target ROAS) |
| Not checking IS lost (budget) | Missing growth opportunities on budget-limited campaigns | Add Search lost IS (budget) column to campaign view |
| Using shared budgets with campaign experiments | Experiments may not run properly | Switch to individual budgets for experiment campaigns |
| Changing budgets too frequently | Prevents stable optimization | Make budget changes no more than once per week |
| Not accounting for 2x daily rule in stakeholder reporting | Confused stakeholders, emergency calls | Include budget mechanics in reporting templates |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Framework for how much to budget and where to allocate |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Shared budget + portfolio bid strategy recommendations |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Step-by-step budget allocation process |
| [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) | Combining portfolio strategies with shared budgets |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Budget sufficiency checks |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum conversion volumes that anchor budget:CPA ratio thresholds |
| [Diagnostic Thresholds Reference](../references/Diagnostic Thresholds Reference.md) | Budget-related diagnostic triggers |

---

## Version details

- **Version:** 3.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
