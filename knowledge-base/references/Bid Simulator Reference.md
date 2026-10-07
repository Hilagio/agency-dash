# Bid Simulator Reference
Created: 2026-02-04
Updated: 2026-10-05

Support_ID: CHEATSHEET_28
Status: Done
Category: Bidding
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

Documents the bid simulator and Performance Planner tools: what they show, how to access them, how to use them for profit optimum analysis, and their limitations.

---

## What this reference is / What this is NOT

**This reference:**

- Explains how to access and read bid simulator data
- Documents Performance Planner usage for bid/budget forecasting
- Covers the profit optimum calculation method
- Notes limitations and when not to trust forecasts

**This reference does NOT:**

- Explain how smart bidding sets bids (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Tell you what CPA/ROAS/POAS targets to set (See: [Bid Targets Reference](../references/Bid Targets Reference.md))
- Provide step-by-step scaling instructions (See: [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md))

---

## Quick reference: forecasting tools

| Tool | What it shows | Best for | Access |
|------|-------------|---------|--------|
| **Bid Simulator** | Estimated results at different target levels for existing campaigns | Modeling CPA/ROAS/POAS changes, finding profit optimum | Bid strategy report > Bid simulator |
| **Performance Planner** | Projected results across campaigns/portfolios at different spend levels | Budget planning, quarterly forecasting, validating growth goals | Tools > Planning > Performance Planner |
| **Keyword Planner** | Search volume and CPC estimates for keywords | Market validation, budget feasibility for new campaigns | Tools > Planning > Keyword Planner |

---

## Bid simulator

### What it does

The bid simulator uses your campaign's historical data to estimate what results would look like at different bid targets. It models scenarios across a range of CPA or ROAS/POAS targets and shows projected conversions, conversion value, and cost for each.

### Where it lives

| Strategy type | Path to the simulator |
|--------------|-----------------------|
| Campaign-level | The "Bid strategy type" column links through to the bid strategy report, which carries the bid simulator section |
| Portfolio | Tools > Budgets and bidding > Bid strategies, then the strategy's report |

The pull is owned by [SOP - Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md), Phase 2.1.

### What the simulator shows

| Column | What it means |
|--------|--------------|
| **Target CPA / Target ROAS** | The simulated efficiency target level |
| **Estimated conversions** | Projected conversion volume at that target |
| **Estimated conversion value** | Projected conversion value at that target |
| **Estimated cost** | Projected ad spend at that target |
| **Current target** | Highlighted row showing your active target |

### Reading the output

- As you decrease CPA targets (more aggressive): conversions increase, cost increases, cost per conversion stays near target
- As you increase CPA targets (less aggressive): conversions decrease, cost decreases
- As you decrease ROAS targets (more aggressive): conversion value increases, cost increases, ROAS approaches breakeven
- As you increase ROAS targets (less aggressive): conversion value decreases, cost decreases

---

## Performance Planner

### What it does

The Performance Planner forecasts campaign performance at different budget and target levels over a future period (typically next month or quarter). It uses historical data plus seasonal trends to project outcomes.

### Where it lives

Performance Planner sits under Tools > Planning > Performance Planner. A plan takes a campaign selection, a date range (next month, next quarter, or custom), and target metrics (CPA, ROAS, budget). The run is owned by [SOP - Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md), Phase 2.2.

### What the planner shows

| Output | What it tells you |
|--------|------------------|
| **Projected conversions** | Expected conversion volume at the modeled spend/target level |
| **Projected conversion value** | Expected revenue or gross profit |
| **Projected cost** | Expected ad spend |
| **Response curve** | Visual of diminishing returns as you increase spend |
| **Scenario comparison** | Side-by-side of different target/budget combinations |

### When Performance Planner is available

Performance Planner requires:

- Active campaigns with at least 7 days of history
- Sufficient conversion data (campaigns with very low volume may not be included)
- Supported campaign types (Search, Shopping, PMax)

Performance Planner may not be available for:

- Very new campaigns
- Campaigns with inconsistent conversion data
- Video campaigns (not supported for planning)
- Plans built on impression-share-based metrics (not supported)
- Some specialized campaign types

---

## Finding the profit optimum

The profit optimum is the target level where net profit is maximized. It exists because of diminishing returns: each incremental conversion costs more than the last.

### What the calculation needs

| Element | Definition |
|---------|------------|
| Scenario span | 5-7 simulator scenarios, from the current target down to near-breakeven |
| Columns per scenario | Target, Estimated Conversions, Estimated Conversion Value, Estimated Cost |
| Net profit per scenario | Conversion Value minus Cost |
| The optimum | The peak of the net profit curve plotted against target |

The procedure is owned by [SOP - Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md), Phase 2.3.

### Example (POAS-based)

| POAS target | Estimated gross profit | Estimated cost | Net profit |
|------------|----------------------|----------------|-----------|
| 300% | 45,000 EUR | 15,000 EUR | 30,000 EUR |
| 250% | 55,000 EUR | 22,000 EUR | 33,000 EUR |
| 210% | 65,000 EUR | 31,000 EUR | 34,000 EUR |
| 180% | 72,000 EUR | 40,000 EUR | 32,000 EUR |
| 150% | 78,000 EUR | 52,000 EUR | 26,000 EUR |
| 120% | 82,000 EUR | 68,000 EUR | 14,000 EUR |
| 100% | 85,000 EUR | 85,000 EUR | 0 EUR |

In this example, the profit optimum is at approximately 210% POAS (34,000 EUR net profit). Going more aggressive than 210% increases gross profit but increases cost faster, reducing net profit.

### Automating profit optimum analysis

For large accounts, automate via the Google Ads API:

1. Pull bid simulator data weekly via API scripts
2. Calculate profit optimum per campaign automatically
3. Generate spreadsheet with current target vs. suggested optimum
4. Review and apply changes through campaign experiments

---

## Limitations and caveats

> ⚠️ **Simulators and planners are directional tools, not guarantees.** Every figure below is a projection built on the assumptions in the table.

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| **Assumes stable conditions** | Competition changes, seasonality, and market shifts are not modeled | Cross-check with historical trends and known upcoming events |
| **Smooth curves suggest linear growth** | Reality has sharper diminishing returns than shown | Apply a 10-20% haircut to aggressive scenarios |
| **Does not model ad fatigue** | Assumes consistent CTR and conversion rate at higher volumes | Monitor actual CTR and CR trends when scaling |
| **Based on historical data** | If recent performance is atypical (sale, outage, new competitor), projections are skewed | Use representative time periods for analysis |
| **Conversion lag not always factored** | Recent conversion data may be incomplete | Ensure analysis window accounts for your conversion cycle |
| **POAS data interpretation** | Google shows "Target ROAS" in the interface even when using profit tracking | Interpret conversion value as gross profit when POAS is active |

### When to trust forecasts more

- High-volume campaigns with stable performance history
- Shorter conversion cycles (more complete recent data)
- Stable competitive landscape
- No major upcoming seasonal shifts

### When to trust forecasts less

- Low-volume campaigns with volatile performance
- Long conversion cycles (incomplete recent data)
- Known upcoming market changes (Black Friday, competitor launch)
- Campaigns with recent significant changes

---

## Bid strategy reports

### Accessing the report

| Strategy type | How to access |
|--------------|---------------|
| Campaign-level | Add "Bid strategy type" column > click blue strategy link |
| Portfolio | Tools > Budgets and bidding > Bid strategies > select strategy |

### Key metrics in the report

| Metric | What it shows |
|--------|-------------|
| `Average conversion delay` | Days between click and conversion (equals your conversion cycle) |
| **Target** | Your current CPA or ROAS/POAS target |
| **Actual performance** | How close actual CPA/ROAS is to target |
| **Bid simulator** | Projected scenarios at different targets |
| **Status** | Learning, Limited, Eligible, etc. |
| **Conversion projections** | Forward-looking conversion estimates |

> 💡 **The average conversion lag in the bid strategy report is the campaign's conversion cycle.** It is the unit the standard post-change wait is counted in (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md)), and the unit an experiment's runtime is sized against.

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Taking simulator projections as guarantees | Over-committing to aggressive targets | Use projections as directional input, validate with experiments |
| Skipping the profit calculation step | Looking only at conversions or ROAS, ignoring net profit | Always calculate net profit = conversion value minus cost |
| Using incomplete data periods | Conversion lag makes recent data look worse | Exclude the most recent [conversion lag] days from analysis |
| Not validating with experiments | Applying optimum targets without testing | Run 50/50 campaign experiment for 30+ days before committing |
| Ignoring diminishing returns | Assuming linear scaling from simulator output | Plot the full curve, look for where marginal returns flatten |
| Checking simulator too frequently | Data changes slowly, creates analysis paralysis | Review bi-weekly or monthly, not daily |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Framework for the profit optimum concept |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | How smart bidding uses data (context for simulator inputs) |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Target calculation that feeds simulator analysis |
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Budget validation using Performance Planner |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Step-by-step scaling using simulator data |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Validation step uses Performance Planner |

---

## Version details

- **Version:** 3.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
