# Bidding Strategy Mental Model
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: MENTALMODEL_19
Status: Done
Category: Strategic
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

This mental model helps you understand how bid strategy selection flows from business goals, through data readiness, to the correct bidding approach for any campaign type.

> ❓ **The core question:** Given your goals, your data, and your campaign type, which bid strategy produces the best outcome?

Bid strategy selection is not a one-time decision. It is a progression: you start with what your data allows, then migrate toward what your goals demand as conversion volume accumulates.

---

## What this is NOT

This mental model does **not:**

- Provide step-by-step instructions for configuring bid strategies (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Explain the internal mechanics of smart bidding algorithms (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Cover budget allocation or budget sizing (See: [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md))
- Replace the channel-specific decision trees (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))

---

## The Goal-to-Strategy Pyramid

Every bid strategy decision traces back to a business goal. Skip a level and the strategy becomes arbitrary.

```
         ┌──────────────────────┐
         │  1. Business Goal     │
         └──────────┬───────────┘
                    ↓
       ┌────────────────────────────┐
       │  2. Google Ads Goal         │
       │  (Growth + Efficiency)      │
       └────────────┬───────────────┘
                    ↓
    ┌────────────────────────────────────┐
    │  3. Optimization Objective          │
    │  (Visibility / Traffic / Conv /     │
    │   Conv Value)                       │
    └────────────────┬───────────────────┘
                     ↓
  ┌──────────────────────────────────────────┐
  │  4. Data Readiness Check                  │
  │  (Conversion volume, historical data,     │
  │   niche knowledge)                        │
  └──────────────┬───────────────────────────┘
                 ↓
┌────────────────────────────────────────────────┐
│  5. Bid Strategy Selection                      │
│  (Manual CPC → Max Clicks → Max Conv →          │
│   tCPA → Max Conv Value → tROAS)                │
└────────────────────────────────────────────────┘
```

Each level constrains the one below it. A growth-focused goal with sufficient data leads to aggressive automated strategies. An efficiency-focused goal with thin data leads to conservative manual approaches.

---

## The six bid strategies

Google Ads offers one manual and five automated bid strategies relevant to performance advertisers.

| Strategy | Optimizes for | Efficiency control | Data requirement | Best for |
|----------|--------------|-------------------|-----------------|----------|
| **Manual CPC** | Clicks (manually) | Full control via max CPC | None | Brand campaigns, new accounts with no data, controlled experiments |
| **Maximize Clicks** | Click volume | None (budget only) | None | Data gathering phase, traffic-focused goals |
| **Target Impression Share** | Visibility | Impression share % | None | Brand defence, competitive dominance on key terms |
| **Maximize Conversions** | Conversion volume | None (budget only) | 15 abs. min, 30 functional, 50+ recommended | New campaigns expecting high conversion volume, growth-first goals |
| **Target CPA** | Conversion volume | CPA target | 15 abs. min, 30 functional, 50+ recommended | Lead gen, SaaS, conversion-volume goals with efficiency guardrails |
| **Maximize Conversion Value** | Conversion value | None (budget only) | 30 abs. min, 50 functional, 50+ recommended | Revenue/profit maximization without efficiency constraints |
| **Target ROAS** | Conversion value | ROAS target | 30 abs. min, 50 functional, 50+ recommended | Ecommerce, value-based bidding, efficiency-constrained value goals |

> 💡 **Manual CPC and Maximize Clicks are starting strategies, not destination strategies:** The goal is always to migrate toward conversion-focused or value-focused bidding as data accumulates.

---

## The bid strategy progression

Bid strategies are not static. They follow a natural progression as campaigns mature and data accumulates.

### Phase 1️⃣: Launch (Days 1-14)

*"Gather data, don't optimize".*

| Situation | Starting strategy | Why |
|-----------|------------------|-----|
| New account, no niche knowledge | Manual CPC | Conservative data collection without overspending |
| New account, has niche knowledge | Maximize Clicks | Faster data collection with targeted keywords |
| New campaign, familiar queries | Maximize Conversions | Smart bidding already knows these queries from your account |
| Brand campaign | Manual CPC | Full control, prevent overpaying for branded terms |

**Key rule:** Do not make significant changes during the learning period (approximately two conversion cycles, typically 7-10 days for short-cycle businesses, 14-30+ days for long-cycle businesses). Monitor, but do not react to fluctuations.

### Phase 2️⃣: Stabilize (Weeks 2-4)

*"Set your first efficiency target".*

Once you have conversion data:

- If optimizing for volume: migrate from Maximize Conversions to **Target CPA** (set at or slightly above your average CPA from Phase 1)
- If optimizing for value: migrate from Maximize Conversion Value to **Target ROAS** (set at or slightly below your average ROAS from Phase 1)
- If insufficient conversions: stay on current strategy, consolidate campaigns, or consider Portfolio Bid Strategy to pool data

### Phase 3️⃣: Optimize (Month 2+)

*"Gradually tighten toward your target".*

- Make incremental adjustments (less than 25% per change) to avoid retriggering the learning period
- Validate targets against growth goals using the profit-to-acquisition ratio
- Consider consolidating campaigns or using Portfolio Bid Strategies to pool data across campaigns with shared goals

### Phase 4️⃣: Scale (Ongoing)

*"Find your profit optimum".*

- Use bid simulators and Performance Planner to model scenarios
- Adjust the profit-to-acquisition ratio slider between growth and efficiency
- Run campaign experiments for any major strategy change (50/50 split, 30+ days)

---

## The optimization objective hierarchy

Your optimization objective determines which strategies are available:

```
What are you optimizing for?
│
├─ Visibility (impressions)
│  └─ Target Impression Share
│
├─ Traffic (clicks)
│  └─ Maximize Clicks
│
├─ Conversion volume (leads, transactions)
│  ├─ With efficiency target → Target CPA
│  └─ Without efficiency target → Maximize Conversions
│
└─ Conversion value (revenue, profit, LTV)
   ├─ With efficiency target → Target ROAS
   └─ Without efficiency target → Maximize Conversion Value
```

> ⚠️ **Never select a bid strategy without knowing your optimization objective.** "Maximize Conversions" and "Maximize Conversion Value" sound similar but optimize for fundamentally different outcomes.

---

## Manual vs. automated: when each wins

| Factor | Manual CPC | Automated (Smart Bidding) |
|--------|-----------|--------------------------|
| **Signal access** | Limited to visible dimensions (device, location, schedule) | 18+ signals including search history, cross-device behavior, intent signals |
| **Bid timing** | Updated periodically (days/weeks) | Real-time, per-auction (milliseconds) |
| **Query-level learning** | Not possible | Learns at query level across entire account |
| **Compounding adjustments** | Risk of over-adjustment from stacking bid modifiers | Evaluates all signals together, prevents over-adjustment |
| **Time investment** | Hours per week on analysis and adjustment | Near-zero ongoing bid management |
| **Best cases** | Brand campaigns, very low volume, controlled experiments | Everything else |

Smart bidding processes more data in one day than a human could analyze in one year. For any campaign with sufficient conversion volume, automated bidding outperforms manual bidding.

---

## The data readiness gate

Before selecting a conversion-focused strategy, check your data readiness:

| Metric | Absolute Minimum | Functional Minimum | Recommended | Impact if below |
|--------|-----------------|-------------------|-------------|-----------------|
| **Conversions per month** (Target CPA) | 15 | 30 | 50+ | Volatile results, longer learning, inconsistent CPA |
| **Conversions per month** (Target ROAS) | 30 | 50 | 50+ | Value variance needs more data, expect instability |
| **Conversions per month** (portfolio level) | 15 | 30 | 50+ | Same thresholds apply, but pooled across campaigns |
| **Conversion delay** | Know it | Factor into analysis windows | Premature decisions, unfair experiment results |
| **Historical data** | Some account history | 3+ months | Slow ramp-up, limited query-level learning |

If you cannot meet minimum thresholds at the campaign level, consolidate campaigns or use a Portfolio Bid Strategy to pool conversion data across campaigns with shared goals.

> ↪️ **Campaign-type thresholds:** For thresholds segmented by campaign type, see [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

---

## Practical application

### For lead gen

The model predicts a natural progression from volume-based to value-based bidding as data matures:

| Stage | Strategy | Why this stage |
|-------|----------|---------------|
| **Launch** | Maximize Conversions or Manual CPC | Gather conversion data without a target that could starve volume |
| **Stabilize** | Target CPA (30+ conversions/month, 50+ recommended) | Enough data for the algorithm to optimize toward a cost-per-lead guardrail |
| **Optimize** | Target CPA on lowest-funnel action (qualified leads or closed deals) | Moves optimization closer to business value, reducing wasted leads |
| **Advanced** | Target ROAS via OCT with real deal values | Enables bidding based on actual deal value, not just lead count |

**Value-based bidding for lead gen** is the highest stage of this progression. When real deal values flow through OCT, smart bidding pursues higher-value leads rather than treating all conversions equally. The model suggests testing this via a 50/50 experiment against a Target CPA baseline to validate the improvement.

### For ecommerce

The model predicts a progression from revenue-based to profit-based bidding:

| Stage | Strategy | Why this stage |
|-------|----------|---------------|
| **Launch** | Maximize Conversion Value | Gather transaction and revenue data without an efficiency constraint |
| **Stabilize** | Target ROAS | Enough data for the algorithm to optimize toward a return-on-spend guardrail |
| **Optimize** | Target ROAS with POAS values | Profit tracking replaces average margins, so 100% always equals breakeven |
| **Advanced** | Profit-optimum Target ROAS via bid simulators | Find the point on the profit curve where net profit peaks |

**POAS replaces ROAS** when profit tracking is in place. The model predicts this produces better outcomes because optimization happens at the order level rather than relying on average margins that mask product-level profitability differences.

### For SaaS

The model predicts a progression from signup volume to subscriber value:

| Stage | Strategy | Why this stage |
|-------|----------|---------------|
| **Launch** | Maximize Conversions targeting signups | Gather signup data to establish baseline CPA |
| **Stabilize** | Target CPA per signup or Target CAC per subscriber | Apply an efficiency guardrail once conversion data is sufficient |
| **Optimize** | Target CPA with OCT tracking signup-to-subscriber rates | Move optimization closer to the revenue event, not just the form fill |
| **Advanced** | Target ROAS with varying subscription values | When subscription tiers have different LTVs, value-based bidding pursues higher-value subscribers |

> ↪️ **For step-by-step strategy selection and configuration:** See [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) and [SOP – Monitor and Maintain Bid Strategy Health](../sops/SOP – Monitor and Maintain Bid Strategy Health.md)

---

## The efficiency paradox

| Concept | What it means |
|---------|--------------|
| **Too aggressive** | High profit-to-acquisition ratio (near 100%), nearing breakeven, maximum volume but zero profit |
| **Too conservative** | Low profit-to-acquisition ratio (under 20%), high efficiency but starving the account of volume |
| **Starvation zone** | CPA targets too low or ROAS targets too high, causing smart bidding to restrict impressions until volume dries up |
| **Breakeven zone** | 100% profit reinvested in acquisition, maximum sustainable bidding level |
| **Profit optimum** | The point where net profit is maximized, found via bid simulator scenarios |

> ⚠️ **You cannot maximize growth and efficiency simultaneously:** Every bid strategy decision is a position on the growth-efficiency slider. Know which direction your goals point before you set targets.

---

## Key principles

1. **Goals first, strategy second:** Never select a bid strategy without defined growth and efficiency goals.
2. **Bid strategies are a progression, not a one-time choice:** Start conservative, migrate to automated as data permits.
3. **Data readiness gates exist for a reason:** Insufficient conversion volume leads to volatile, unreliable performance.
4. **Smart bidding outperforms manual bidding in nearly every case:** The exceptions are narrow: brand campaigns, very low volume, controlled experiments.
5. **Always validate targets:** Use the profit-to-acquisition ratio, Performance Planner, and bid simulators to confirm your efficiency targets can deliver your growth goals.

---

## Failure modes

| Failure | What happens | How to prevent |
|---------|-------------|----------------|
| **Selecting strategy without defined goals** | The bid strategy optimizes for the wrong outcome because there is no clear growth or efficiency target to anchor it | Always complete the Goal-to-Strategy Pyramid top-down: business goal, Google Ads goal, optimization objective, then strategy |
| **Jumping to Target CPA/ROAS with insufficient data** | Smart bidding swings wildly because it lacks enough conversion signals to learn patterns | Respect the data readiness gate: 30+ conversions/month minimum for Target CPA, 50+ for Target ROAS. Use Maximize Conversions or Portfolio strategies to pool data first |
| **Staying on a launch strategy too long** | Manual CPC or Maximize Clicks cap performance because they cannot access Google's 18+ auction-time signals | Set a trigger for migration: once a campaign hits 30+ conversions/month for two consecutive months, evaluate moving to a target-based strategy |
| **Setting targets based on aspirations instead of data** | A Target CPA set 50% below historical average starves the campaign, or a Target ROAS set 50% above historical average restricts volume to near zero | Set initial targets at or slightly above (CPA) or below (ROAS) the historical average from the stabilization phase, then tighten incrementally |
| **Confusing Maximize Conversions with Maximize Conversion Value** | The campaign optimizes for lead count instead of revenue, or revenue instead of volume, misaligning with the actual business goal | Map the optimization objective explicitly: "volume" maps to conversions, "value" maps to conversion value. The names sound similar but the outcomes diverge |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Deep dive into how smart bidding works |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Channel-specific decision trees for all 6 campaign types |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | CPA/ROAS/POAS target derivation from unit economics |
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Framework for sizing and distributing budgets |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Growth-efficiency slider and profit optimum |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Upstream: goal-setting pyramid that feeds bid strategy selection |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Upstream: breakeven calculations that determine target ranges |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Data readiness thresholds for smart bidding |
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Executes this framework step-by-step |

---

## Version details

- **Version:** 2.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
