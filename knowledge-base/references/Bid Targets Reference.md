# Bid Targets Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_26
Status: Done
Category: Bidding
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

Documents the formulas and calculation methods for deriving CPA, ROAS, and POAS targets from unit economics, using the Profit-to-Acquisition Ratio (PAR) as the efficiency-growth balancing variable.

---

## What this reference is / What this is NOT

**This reference:**

- Provides target calculation formulas for CPA, ROAS, and POAS
- Documents breakeven calculations for Lead Gen (2-step, 3-step, 4-step funnels) and Ecommerce (Basic, Intermediate, Advanced)
- Explains how the Profit-to-Acquisition Ratio translates breakeven points into actionable targets
- Covers POAS target logic and the profit optimum concept
- Documents Value-Based Bidding target setting for Lead Gen
- Includes target validation methods

**This reference does NOT:**

- Explain unit economics concepts or how to gather inputs (See: [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) and [Unit Economics Reference](../references/Unit Economics Reference.md))
- Cover bid strategy selection or when to use Target CPA vs. Target ROAS (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Provide step-by-step execution for setting targets in Google Ads (See: [SOP - Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))
- Explain budget allocation or pacing (See: [Budget Pacing Reference](../references/Budget Pacing Reference.md))
- Cover bid scaling tactics (See: [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md))

---

## Quick reference: target types

| Target Type | Formula | Use Case | Vertical |
|-------------|---------|----------|----------|
| **Target CPA** | Breakeven CPA x PAR | Optimize for cost per conversion at a specific funnel stage | Lead Gen, SaaS |
| **Target ROAS** | Breakeven ROAS / PAR | Optimize for revenue return on ad spend | Ecommerce, Lead Gen (VBB) |
| **Target POAS** | Set above 100% based on growth goals | Optimize for profit return on ad spend | Ecommerce (with profit tracking) |

> 💡 **PAR is the universal variable:** Every target type uses the Profit-to-Acquisition Ratio to translate breakeven points into targets. The only difference: CPA targets multiply by PAR (lower PAR = lower target), ROAS targets divide by PAR (lower PAR = higher target).

---

## CPA targets (Lead Gen)

CPA targets apply when optimizing for a cost-per-conversion goal. The breakeven CPA depends on the number of steps in your lead-to-sale journey.

### Universal pattern

```
Breakeven CAC             = Average Deal Value x Profit Margin
Breakeven CPA (step N)    = Breakeven CPA (step N+1) x Conversion Rate at step N
Target CPA (any step)     = Breakeven CPA (same step) x PAR
```

### Method A: 2-step journey (Lead to Closed Deal)

**Funnel:** Lead > Closed Deal

**Inputs:**

| Input | Description | Example |
|-------|-------------|---------|
| Average Deal Value | Revenue per closed deal (or customer lifetime value) | €2,500 |
| Profit Margin (%) | Gross profit as percentage of deal value | 50% |
| Lead to Closed Deal Rate (%) | Percentage of leads that become closed deals | 25% |
| PAR (%) | Percentage of profit allocated to acquisition | 50% |

**Breakeven calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Breakeven CAC | Average Deal Value x Profit Margin | €2,500 x 0.50 = €1,250 |
| Breakeven CPA: Lead | Breakeven CAC x Lead-to-Close Rate | €1,250 x 0.25 = €312.50 |

**Target calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Target CPA: Lead | Breakeven CPA Lead x PAR | €312.50 x 0.50 = €156.25 |
| Target CPA: Closed Deal | Breakeven CAC x PAR | €1,250 x 0.50 = €625 |
| Target ROAS | Breakeven ROAS / PAR | 200% / 0.50 = 400% |

### Method B: 3-step journey (Lead to Qualified Lead to Closed Deal)

**Funnel:** Lead > Qualified Lead > Closed Deal

**Inputs:**

| Input | Description | Example |
|-------|-------------|---------|
| Average Deal Value | Revenue per closed deal | €3,000 |
| Profit Margin (%) | Gross profit percentage | 50% |
| Lead to Qualified Lead Rate (%) | Percentage of leads that qualify | 25% |
| Qualified Lead to Closed Deal Rate (%) | Percentage of qualified leads that close | 50% |
| PAR (%) | Profit allocated to acquisition | 40% |

**Breakeven calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Breakeven CAC | €3,000 x 0.50 | €1,500 |
| Breakeven CPA: Qualified Lead | €1,500 x 0.50 | €750 |
| Breakeven CPA: Lead | €750 x 0.25 | €187.50 |

**Target calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Target CPA: Lead | €187.50 x 0.40 | €75 |
| Target CPA: Qualified Lead | €750 x 0.40 | €300 |
| Target CPA: Closed Deal | €1,500 x 0.40 | €600 |
| Target ROAS | (1 / 0.50) / 0.40 = 200% / 0.40 | 500% |

### Method C: 4-step journey (Lead to MQL to SQL to Closed Deal)

**Funnel:** Lead > MQL > SQL > Closed Deal

**Inputs:**

| Input | Description | Example |
|-------|-------------|---------|
| Average Deal Value | Revenue per closed deal | €3,000 |
| Profit Margin (%) | Gross profit percentage | 50% |
| Lead to MQL Rate (%) | Percentage of leads becoming MQLs | 25% |
| MQL to SQL Rate (%) | Percentage of MQLs becoming SQLs | 75% |
| SQL to Closed Deal Rate (%) | Percentage of SQLs that close | 25% |
| PAR (%) | Profit allocated to acquisition | 25% |

**Breakeven calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Breakeven CAC | €3,000 x 0.50 | €1,500 |
| Breakeven CPA: SQL | €1,500 x 0.25 | €375 |
| Breakeven CPA: MQL | €375 x 0.75 | €281.25 |
| Breakeven CPA: Lead | €281.25 x 0.25 | €70.31 |

**Target calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Target CPA: Lead | €70.31 x 0.25 | €17.58 |
| Target CPA: MQL | €281.25 x 0.25 | €70.31 |
| Target CPA: SQL | €375 x 0.25 | €93.75 |
| Target CPA: Closed Deal | €1,500 x 0.25 | €375 |
| Target ROAS | (1 / 0.50) / 0.25 | 800% |

> ⚠️ **The model matches the sales process, not the ambition.** The 4-step model requires MQL and SQL tracked as distinct stages with known conversion rates. An account tracking only leads and closed deals is a 2-step funnel.

---

## ROAS targets (Ecommerce)

ROAS targets apply when optimizing for return on ad spend based on revenue. The calculation depends on how many cost variables you include.

### Universal pattern

```
Effective Margin   = Profit Margin - Order Expenses - Net Return Cost
Breakeven ROAS     = 1 / Effective Margin
Target ROAS        = Breakeven ROAS / PAR
```

### Method A: Basic

Excludes order expenses and return costs. Use when order-level cost data is unavailable.

**Inputs:**

| Input | Description | Example |
|-------|-------------|---------|
| Profit Margin (%) | Gross profit as percentage of revenue | 40% |
| PAR (%) | Profit allocated to acquisition | 50% |

**Calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Breakeven ROAS | 1 / Profit Margin | 1 / 0.40 = 250% |
| Target ROAS | Breakeven ROAS / PAR | 250% / 0.50 = 500% |

### Method B: Intermediate (with order expenses)

Includes shipping, fulfillment, and payment fees. Excludes return costs.

**Inputs:**

| Input | Description | Example |
|-------|-------------|---------|
| Profit Margin (%) | Gross profit percentage | 40% |
| Shipping Cost (% of revenue) | Average shipping cost | 3% |
| Fulfillment Cost (% of revenue) | Warehousing and handling | 0.5% |
| Payment Fees (% of revenue) | Payment provider fees | 2% |
| PAR (%) | Profit allocated to acquisition | 50% |

**Calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Total Order Expenses | Shipping + Fulfillment + Payment Fees | 3% + 0.5% + 2% = 5.5% |
| Effective Margin | Profit Margin - Total Order Expenses | 40% - 5.5% = 34.5% |
| Breakeven ROAS | 1 / Effective Margin | 1 / 0.345 = 290% |
| Target ROAS | Breakeven ROAS / PAR | 290% / 0.50 = 580% |

> 💡 **Order expenses are frequently forgotten:** Many ecommerce advertisers calculate breakeven ROAS using only their product margin, ignoring shipping, fulfillment, and payment costs. This leads to targets that look profitable on paper but lose money on every order.

### Method C: Advanced (with order expenses and returns)

Includes all order expenses plus return rate, resale rate, and return-related costs.

**Additional inputs beyond Method B:**

| Input | Description | Example |
|-------|-------------|---------|
| Return Rate (%) | Percentage of orders returned | 20% |
| Resale Rate (%) | Percentage of returns that can be resold | 90% |
| Return Processing Cost (% of revenue) | Processing each return | 5% |
| Restocking Fee (% of revenue) | Restocking returned items | 3% |
| Return Shipping Cost (% of revenue) | Shipping returns back | 3% |

**Return impact calculation:**

| Metric | Formula | Example |
|--------|---------|---------|
| Returned Product Cost | Return Rate x (1 - Profit Margin) | 20% x 60% = 12% |
| Return Processing Cost | Return Rate x Processing Cost | 20% x 5% = 1% |
| Restocking Cost | Return Rate x Restocking Fee | 20% x 3% = 0.6% |
| Return Shipping Cost | Return Rate x Return Shipping | 20% x 3% = 0.6% |
| Resale Value (recovered) | Return Rate x Resale Rate x (1 - Profit Margin) | 20% x 90% x 60% = 10.8% |
| Net Return Cost | Gross Return Costs - Resale Value | 14.2% - 10.8% = 3.4% |

**Final calculations:**

| Metric | Formula | Example |
|--------|---------|---------|
| Total Order Expenses | Shipping + Fulfillment + Payment | 3% + 0.5% + 1.5% = 5% |
| Effective Margin | Profit Margin - Order Expenses - Net Return Cost | 40% - 5% - 3.4% = 31.6% |
| Breakeven ROAS | 1 / Effective Margin | 1 / 0.316 = 316% |
| Target ROAS | Breakeven ROAS / PAR | 316% / 0.50 = 632% |

> ⚠️ **High-return categories need the Advanced method.** Fashion, footwear, and electronics often carry return rates of 20-40%, and a ROAS target that omits return costs there appears profitable while destroying margin.

---

## POAS targets (Ecommerce with profit tracking)

POAS (Profit on Ad Spend) replaces manual breakeven calculations by importing gross profit directly at the order level. This requires a profit tracking solution (such as Profit Metrics or a custom implementation).

### Why 100% always equals breakeven

POAS is calculated as: Gross Profit / Ad Spend.

When gross profit equals ad spend, the result is 100%. At that point, all profit goes to acquisition and net profit is zero. This is true regardless of product mix, margin variation, or order composition because profit is calculated per order including all costs.

| POAS | Meaning | Net Profit per €100 Ad Spend |
|------|---------|-------------------------------|
| 100% | Breakeven: gross profit = ad spend | €0 |
| 150% | 50% profit on ad spend | €50 |
| 200% | 100% profit on ad spend | €100 |
| 250% | 150% profit on ad spend | €150 |

### What a POAS target depends on

POAS targets do not use the manual breakeven calculator, because profitability is already computed at the order level. What they do depend on:

| Dependency | Detail |
|------------|--------|
| Profit tracking | Gross profit imported as conversion value |
| Conversion action split | Revenue and profit tracked separately, profit as primary and revenue as secondary |
| Data floor | At least 100 conversions before an average POAS is established |
| The target itself | Set from growth and efficiency goals, then validated in Performance Planner or a bid simulator |

Setting them is owned by [SOP - Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md), Phase 3.4.

### The profit optimum

The profit optimum is the POAS target that maximizes total net profit, not POAS percentage. The curve follows a predictable shape: close to 100% POAS (breakeven) produces high volume but zero profit, and a high POAS target produces high per-order profit but starves volume. The maximum net profit sits between these extremes.

The scenario method that locates the peak is documented in [Bid Simulator Reference](../references/Bid Simulator Reference.md) and executed in [SOP - Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md), Phase 2.3.

> 💡 **A forecast optimum is not a validated optimum.** Performance Planner assumes stable conditions, so the peak it produces holds only until a 50/50 campaign experiment confirms it.

### POAS advantages over ROAS

| Problem with ROAS | How POAS solves it |
|--------------------|--------------------|
| Forces you to use average margins across products | Calculates margin per order, accounting for actual product mix |
| Ignores order expenses (shipping, payment, fulfillment) | Includes all order-level costs in the profit calculation |
| Cross-sell/bundle revenue distorts margin assumptions | Attributes actual order profit regardless of which product was clicked |
| Margin bucketing breaks because customers buy different products than they click | Order-level profit removes the need for margin-based campaign segmentation |
| High ROAS does not guarantee profitability | 100% POAS always equals breakeven, any value above 100% is profit |

---

## PAR: Profit-to-Acquisition Ratio

The PAR is a slider between 1% and 100% that determines what percentage of gross profit you reinvest into Google Ads for acquisition.

### The slider concept

```
Growth ◄──────────────────────────────────► Efficiency

100% PAR          50% PAR              10% PAR
Max volume        Balanced             Max profit per conversion
Zero profit       Moderate profit      Severe volume loss
= Breakeven       = Sustainable        = Starvation zone
```

### What each PAR level means

| PAR Range | Label | Effect on Targets | Risk |
|-----------|-------|-------------------|------|
| 80-100% | Breakeven zone | CPA targets near breakeven, ROAS targets near breakeven ROAS | Zero or negative profit, unsustainable long-term |
| 50-80% | Growth-leaning | Moderate targets, prioritizes volume over margin | Lower per-conversion profit, needs strong unit economics |
| 30-50% | Balanced | Competitive targets with meaningful profit retained | Sustainable for most accounts |
| 10-30% | Efficiency-leaning | Conservative targets, prioritizes margin over volume | May miss growth goals, risk of starvation |
| 1-10% | Starvation zone | Extremely tight targets, near-maximum per-conversion profit | Severe under-investment, volumes dry up, account declines |

### How goals determine PAR

The right PAR depends on your Google Ads goals, specifically the balance between your growth goal and your efficiency goal.

**When growth is the primary goal:** the growth target (for example 3,000 sales/month) is the fixed input, Performance Planner supplies the efficiency target that reaches that volume, and PAR falls out of the pair. An implied PAR above 80% means the unit economics do not support the growth target.

**When efficiency is the primary goal:** the efficiency target (for example 250% ROAS) is the fixed input, Performance Planner supplies the resulting volume, and PAR again falls out of the pair. Volume short of the secondary growth goal means PAR has to rise, loosening efficiency, until the goal is met.

> ⚠️ **PAR only resolves with both a growth goal and an efficiency goal.** Efficiency alone risks starvation, growth alone risks unprofitable spend, and PAR is the variable that trades one against the other.

### PAR formula per target type

| Target Type | Formula | Direction |
|-------------|---------|-----------|
| Target CPA | Breakeven CPA x PAR | Lower PAR = lower (tighter) CPA target |
| Target ROAS | Breakeven ROAS / PAR | Lower PAR = higher (tighter) ROAS target |
| Target POAS | Set directly based on growth validation | Lower PAR = higher POAS target |

---

## Value-Based Bidding targets (Lead Gen)

Value-Based Bidding (VBB) lets you optimize for conversion value rather than conversion count. For Lead Gen, this means bidding toward higher-value deals rather than just more leads.

### Prerequisites

- Offline Conversion Tracking (OCT) must be implemented
- Upload deal-specific conversion values for closed deal conversion actions
- For upstream funnel steps (leads, qualified leads), assign average conversion values calculated backwards from deal values and conversion rates
- Gather sufficient conversion data (minimum 100 conversions) before experimenting

### Setting Target ROAS for VBB

The Target ROAS for a VBB strategy uses the same calculator as standard Lead Gen ROAS targets:

| Metric | Formula |
|--------|---------|
| Breakeven ROAS | 1 / Profit Margin |
| Target ROAS | Breakeven ROAS / PAR |

The difference is what the conversion value represents. In standard bidding, conversion value is a static average. In VBB, conversion value reflects the actual deal value (or customer lifetime value) uploaded through OCT.

### The VBB experiment

A 50/50 campaign experiment comparing a Target CPA strategy against a Target ROAS (VBB) strategy holds only under these conditions:

| Condition | Detail |
|-----------|--------|
| Conversion action | The same one in both arms (closed deals with dynamic values) |
| Experiment Target ROAS | At or below the average ROAS the Target CPA campaign achieved in the past 4 weeks |
| Runtime | At least 30 days uninterrupted |
| Control arm drift | Average ROAS in the control arm deviating from the experiment Target ROAS makes the comparison unfair |
| Read-out metric | Conversion value, not conversion count |

Running it is owned by [SOP - Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md), Phase 4.2.

> 💡 **VBB does not always outperform Target CPA:** If the experiment shows no improvement, continue with Target CPA for your lowest-funnel conversion action. Test again when conversion volume or value distribution changes.

---

## Validating targets

### Validation methods

| Method | Data Required | Best For |
|--------|---------------|----------|
| **Performance Planner** | Active campaigns with 7+ days of data | Forecasting volume at a given efficiency target |
| **Bid Simulator** | Active campaigns with sufficient impression data | Comparing scenarios at different target levels |
| **Historical data** | 3+ months of campaign history | Gauging achievable ranges when forecast tools are unavailable |

### What validation converges on

Validation is a loop on PAR: a target that falls short of the growth goal needs a higher PAR (looser target), and one that clears the goal with room to spare supports a lower PAR (tighter target, more profit retained). The loop ends at the PAR that balances both. The procedure is owned by [SOP - Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md), Phase 4.

### When forecast tools are unavailable

New campaigns, low volume, and limited history all put Performance Planner and bid simulator data out of reach. What remains:

| Substitute input | What it gives |
|------------------|---------------|
| Last 3-6 months of performance data | The achievable range |
| Year-over-year comparison | Seasonal context |
| Impression share metrics | An estimate of remaining headroom |
| The first 2-4 weeks of live results | The correction signal, since the target is unvalidated at launch |

> ⚠️ **Forecasts are directional guidance, not guaranteed outcomes.** Performance Planner assumes stable conditions: no increased competition, no conversion rate changes, no market saturation.

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Using profit margin instead of effective margin for ROAS targets | Ignores order expenses, sets breakeven ROAS too low | Subtract shipping, fulfillment, and payment costs before calculating breakeven ROAS |
| Setting targets without calculating breakeven first | No anchor point: you do not know if targets are above or below profitability | Always calculate breakeven points before setting any target |
| Setting PAR too low (under 10%) | Starvation zone: targets too tight, volumes dry up, account declines | Keep PAR above 20% unless unit economics are exceptionally strong |
| Stretching PAR to 100% to hit growth goals | Operating at breakeven: zero profit, unsustainable | If 100% PAR is needed, the problem is unit economics, not bidding |
| Using average ROAS across mixed-margin product categories | Under-bids on high-margin products, over-bids on low-margin products | Switch to POAS, or segment campaigns by margin tier with separate ROAS targets |
| Forgetting to account for returns in high-return categories | Effective margin is lower than assumed, breakeven ROAS is too low | Use the Advanced calculation method for categories with return rates above 10% |
| Not validating targets against growth goals | Efficiency target may be too aggressive, causing volume starvation | Always cross-check targets in Performance Planner or bid simulators |
| Setting VBB Target ROAS higher than the control arm average | Creates an unfair comparison: VBB bids more conservatively | Set VBB Target ROAS at or below the average ROAS of your Target CPA campaign |
| Updating targets without recalculating unit economics | Deal values and conversion rates change over time, making old targets inaccurate | Recalculate breakeven points quarterly or when unit economics shift materially |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Provides the conceptual framework for why unit economics drive target setting |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Documents all unit economics formulas and benchmarks referenced in breakeven calculations |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Explains growth vs. efficiency goal balancing that determines PAR |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Covers which bid strategy to select before setting targets |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Addresses how to adjust targets over time for scaling |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Documents how smart bidding strategies process the targets set using this reference |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Technical reference for the bid simulation tools used in target validation |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Covers budget management that works alongside target setting |
| [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md) | Step-by-step execution for gathering the unit economics inputs needed here |

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
