# Bid Simulator Reference
Created: 2026-02-04

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

### How to access

**Campaign-level bid strategy report:**

1. Add the "Bid strategy type" column to your campaign view
2. Click the blue hyperlink on the strategy name
3. In the bid strategy report, find the bid simulator section

**Portfolio bid strategy report:**

1. Go to Tools > Budgets and Bidding > Bid Strategies
2. Select the portfolio strategy
3. View the bid simulator section in the report

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

### How to access

1. Go to Tools > Planning > Performance Planner
2. Select campaigns to include
3. Choose a date range (next month, next quarter, custom)
4. Set target metrics (CPA, ROAS, budget)
5. Review projections

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
- Standard campaign types (Search, Shopping, Display, PMax)

Performance Planner may not be available for:

- Very new campaigns
- Campaigns with inconsistent conversion data
- Some specialized campaign types

---

## Finding the profit optimum

The profit optimum is the target level where net profit is maximized. It exists because of diminishing returns: each incremental conversion costs more than the last.

### Step-by-step method

1. **Open bid simulator** for your campaign or portfolio
2. **Note 5-7 scenarios** at different target levels, spanning from your current target to near-breakeven
3. **Export to spreadsheet** with columns: Target, Estimated Conversions, Estimated Conversion Value, Estimated Cost
4. **Calculate net profit** for each row: Conversion Value minus Cost
5. **Plot the net profit curve** (target on X-axis, net profit on Y-axis)
6. **Identify the peak:** the target level where net profit is highest

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

> ⚠️ **Never take forecasts at face value:** Simulators and planners are directional tools, not guarantees.

| Limitation | Impact | Mitigation |
|-----------|--------|-----------|
| **Assumes stable conditions** | Competition changes, seasonality, and market shifts are not modeled | Cross-check with historical trends and known upcoming events |
| **Smooth curves suggest linear growth** | Reality has sharper diminishing returns than shown | Apply a 10-20% haircut to aggressive scenarios |
| **Does not model ad fatigue** | Assumes consistent CTR and conversion rate at higher volumes | Monitor actual CTR and CR trends when scaling |
| **Based on historical data** | If recent performance is atypical (sale, outage, new competitor), projections are skewed | Use representative time periods for analysis |
| **Conversion delay not always factored** | Recent conversion data may be incomplete | Ensure analysis window accounts for your conversion cycle |
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
| Portfolio | Tools > Budgets and Bidding > Bid Strategies > select strategy |

### Key metrics in the report

| Metric | What it shows |
|--------|-------------|
| **Average conversion delay** | Days between click and conversion (equals your conversion cycle) |
| **Target** | Your current CPA or ROAS/POAS target |
| **Actual performance** | How close actual CPA/ROAS is to target |
| **Bid simulator** | Projected scenarios at different targets |
| **Status** | Learning, Limited, Eligible, etc. |
| **Conversion projections** | Forward-looking conversion estimates |

> 💡 **The average conversion delay in your bid strategy report tells you your conversion cycle:** Use this to determine how long to wait before evaluating performance after changes and how long to run experiments.

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Taking simulator projections as guarantees | Over-committing to aggressive targets | Use projections as directional input, validate with experiments |
| Skipping the profit calculation step | Looking only at conversions or ROAS, ignoring net profit | Always calculate net profit = conversion value minus cost |
| Using incomplete data periods | Conversion delay makes recent data look worse | Exclude the most recent [conversion delay] days from analysis |
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

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
