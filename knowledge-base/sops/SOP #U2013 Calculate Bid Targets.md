# SOP – Calculate Bid Targets
Created: 2026-02-04
Updated: 2026-02-05

SOP_ID: SOP_33
Status: Done
Category: Bidding
Agent_Executable: No
Human_Approval_Required: Yes
Primary Outcome: Validated CPA/ROAS/POAS targets derived from unit economics and growth goals
Secondary Outcomes: Breakeven levels calculated, profit-to-acquisition ratio determined, targets validated via Performance Planner
Domain: Bidding
Pillar: 9

## Purpose

This SOP walks you through calculating CPA, ROAS, and POAS bid targets from unit economics using the profit-to-acquisition ratio (PAR).

> ❓ **The big question:** What bid target should you set to balance growth and profitability for this account?

---

## What this SOP is NOT

This SOP does **not:**

- Explain bid target theory or the PAR framework (See: [Bid Targets Reference](../references/Bid Targets Reference.md))
- Calculate or validate unit economics (See: [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md))
- Set campaign goals or KPIs (See: [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md))
- Explain how bid scaling works (See: [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md))
- Configure bidding strategies in-platform (that is a separate SOP)

## When to run this SOP

Run this SOP when:

- Onboarding a new client (after unit economics and goals are validated)
- Switching bidding strategies (e.g., moving from manual CPC to tCPA or tROAS)
- Unit economics inputs change (pricing, margins, conversion rates)
- Growth goals shift (stakeholder wants more volume or more efficiency)
- Current bid targets are delivering results outside the acceptable range

---

## Before you start

### Required inputs

- Validated unit economics from [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md)
- Documented Google Ads goals from [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md)
- Conversion tracking in place and verified
- Access to Performance Planner or bid simulator in Google Ads

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Formulas, PAR definitions, target ranges |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Understanding margin layers and breakeven logic |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Verified input values and thresholds |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Growth vs efficiency framing |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Reading bid simulator and Performance Planner output |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Gather unit economics inputs** | Collect the numbers needed for breakeven calculations | Completed input worksheet per vertical |
| **Phase 2️⃣: Calculate breakeven levels** | Determine the point where ad spend equals profit | Breakeven CPA, ROAS, and POAS values |
| **Phase 3️⃣: Determine bid targets** | Apply the profit-to-acquisition ratio to set operational targets | CPA/ROAS/POAS targets with PAR setting documented |
| **Phase 4️⃣: Validate targets** | Confirm targets are achievable using Google Ads tools | Validated targets ready for campaign configuration |

---

## Phase 1️⃣: Gather unit economics inputs

### 1.1 Identify your vertical

| If the client... | Vertical | Primary bid metric |
|-----------------|----------|-------------------|
| Generates leads for a sales team | Lead Gen | CPA |
| Sells products online | Ecommerce | ROAS or POAS |
| Sells recurring subscriptions | SaaS | CPA (with LTV adjustment) |

### 1.2 Collect inputs by vertical

**Lead Gen inputs:**

1. **Average deal value:** Revenue per closed deal
2. **Profit margin %:** (Revenue - delivery costs) / Revenue
3. **Gross profit per deal:** Deal value x Profit margin %
4. **Lead-to-close rate:** Closed deals / Total leads (from CRM, last 6 months)
5. **Qualified lead rate (if multi-step funnel):** Qualified leads / Total leads
6. **QL-to-close rate (if multi-step funnel):** Closed deals / Qualified leads
7. **Customer LTV (if applicable):** Use instead of single deal value when repeat business is significant

**Ecommerce inputs:**

1. **Average order value (AOV):** Total revenue / Total orders (last 90 days)
2. **Profit margin %:** (Revenue - COGS) / Revenue
3. **Order expenses %:** (Shipping + Payment fees + Returns) / AOV
4. **Effective margin:** Profit margin % - Order expenses %
5. **Customer LTV (if applicable):** Average orders per customer x Gross profit per order

**SaaS inputs:**

1. **ARPU:** MRR / Active paying customers
2. **Customer lifetime (months):** 1 / Monthly churn rate
3. **LTV:** ARPU x Customer lifetime x Gross margin %
4. **Max CAC (3:1 rule):** LTV / 3

### 1.3 Record inputs

| Input | Value | Source | Date verified |
|-------|-------|--------|--------------|
| | | | |
| | | | |
| | | | |
| | | | |
| | | | |

> ⚠️ **Use verified data only:** Do not accept client estimates without cross-checking backend or CRM data. Incorrect inputs cascade into wrong targets.

---

## Phase 2️⃣: Calculate breakeven levels

Breakeven is the point where 100% of gross profit goes to acquisition. You make zero profit at breakeven.

### 2.1 Lead Gen: CPA breakeven

**Simple funnel (lead converts directly to deal):**

```
CPA breakeven = Gross profit per deal x Lead-to-close rate
```

**Example:** €5,000 deal value x 60% margin = €3,000 gross profit. Lead-to-close rate = 20%.
CPA breakeven = €3,000 x 0.20 = €600

**Multi-step funnel (lead > qualified lead > deal):**

```
CPA breakeven = Gross profit per deal x QL-to-close rate x Lead-to-QL rate
```

**Example:** €3,000 gross profit. Lead-to-QL rate = 50%. QL-to-close rate = 40%.
CPA breakeven = €3,000 x 0.40 x 0.50 = €600

> 💡 **Track CPA at the conversion point Google Ads optimizes toward:** If you optimize for leads, calculate CPA breakeven at the lead level. If you import offline conversions at the deal stage, calculate CPA breakeven at the deal level.

### 2.2 Ecommerce: ROAS breakeven

```
ROAS breakeven = 1 / Effective margin
```

Where effective margin = Profit margin % - Order expenses %

**Example:** 50% profit margin - 15% order expenses = 35% effective margin.
ROAS breakeven = 1 / 0.35 = 286% (or 2.86x)

At 286% ROAS, every euro of ad spend returns exactly enough revenue to cover product cost, order expenses, and the ad cost itself. Zero profit remains.

### 2.3 POAS breakeven

```
POAS breakeven = 100% (always)
```

POAS (Profit on Ad Spend) uses profit as the conversion value instead of revenue. At 100% POAS, every euro of ad spend generates exactly one euro of gross profit. Breakeven by definition.

> 💡 **POAS simplifies bid target math:** Because breakeven is always 100%, you skip the margin calculations in Phase 3. The margin is already baked into the conversion value.

### 2.4 Record breakeven levels

| Metric | Formula used | Breakeven value |
|--------|-------------|----------------|
| CPA breakeven | | |
| ROAS breakeven | | |
| POAS breakeven | 100% (always) | 100% |

---

## Phase 3️⃣: Determine bid targets

### 3.1 Understand the profit-to-acquisition ratio (PAR)

PAR controls how much of your gross profit you allocate to acquisition (ad spend) vs. retain as net profit.

| PAR value | Meaning | Use when |
|-----------|---------|----------|
| 1.0 | 100% of profit to acquisition, 0% retained | Never (this is breakeven) |
| 0.75 | 75% to acquisition, 25% retained | Aggressive growth |
| 0.50 | 50% to acquisition, 50% retained | Balanced growth and profit |
| 0.25 | 25% to acquisition, 75% retained | Efficiency-focused |

> ⚠️ **PAR is a business decision, not a math exercise:** The stakeholder must agree to the growth vs. efficiency tradeoff. Use the goals documented in [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md) to guide this choice.

### 3.2 Calculate CPA target (Lead Gen / SaaS)

```
CPA target = Breakeven CPA x PAR
```

**Example:** Breakeven CPA = €600. PAR = 0.50 (balanced).
CPA target = €600 x 0.50 = €300

At €300 CPA, you spend 50% of gross profit on acquisition and retain 50%.

| PAR setting | CPA target | Profit retained per deal |
|-------------|-----------|------------------------|
| 0.75 (growth) | €450 | €150 |
| 0.50 (balanced) | €300 | €300 |
| 0.25 (efficiency) | €150 | €450 |

### 3.3 Calculate ROAS target (Ecommerce)

```
ROAS target = Breakeven ROAS / PAR
```

Note: ROAS uses division (not multiplication) because higher ROAS means more efficient, which is the inverse of CPA.

**Example:** Breakeven ROAS = 286%. PAR = 0.50 (balanced).
ROAS target = 286% / 0.50 = 572% (or 5.72x)

| PAR setting | ROAS target | Profit retained per order |
|-------------|-----------|--------------------------|
| 0.75 (growth) | 381% | Lower margin, higher volume |
| 0.50 (balanced) | 572% | Half margin retained |
| 0.25 (efficiency) | 1,144% | High margin, lower volume |

### 3.4 Calculate POAS target (Ecommerce with profit tracking)

POAS targets are straightforward because breakeven is always 100%.

```
POAS target = 100% / PAR
```

**Example:** PAR = 0.50 (balanced).
POAS target = 100% / 0.50 = 200%

| PAR setting | POAS target | Meaning |
|-------------|-----------|---------|
| 0.75 (growth) | 133% | For every €1 ad spend, generate €1.33 profit |
| 0.50 (balanced) | 200% | For every €1 ad spend, generate €2 profit |
| 0.25 (efficiency) | 400% | For every €1 ad spend, generate €4 profit |

### 3.5 Record bid targets

| Metric | Breakeven | PAR | Target | Rationale |
|--------|-----------|-----|--------|-----------|
| CPA | | | | |
| ROAS | | | | |
| POAS | | | | |

---

## Phase 4️⃣: Validate targets

### 4.1 Check target achievability with Performance Planner

1. Open Performance Planner in Google Ads
2. Select the campaigns that will use these targets
3. Enter the calculated bid target (CPA or ROAS)
4. Review the forecasted volume (conversions, conversion value)
5. Compare forecasted volume against documented growth goals

| Check | Result |
|-------|--------|
| Forecasted conversions meet growth goal? | |
| Forecasted CPA/ROAS aligns with target? | |
| Budget required is within allocated budget? | |

### 4.2 Check target achievability with bid simulator

1. Open the bid simulator for key campaigns or ad groups
2. Review the volume curve at your calculated target
3. Identify the point of diminishing returns

| Bid target tested | Estimated conversions | Estimated cost | Actual CPA/ROAS |
|------------------|----------------------|---------------|-----------------|
| Calculated target | | | |
| Target + 10% | | | |
| Target - 10% | | | |

### 4.3 Evaluate results

| If... | Then... |
|-------|---------|
| Forecasted volume meets growth goals at calculated targets | Targets are validated. Proceed to implementation. |
| Volume is too low at calculated targets | Increase PAR (accept lower margin) or expand targeting (new keywords, audiences, campaign types) |
| Volume is sufficient but budget is insufficient | Increase budget or reduce growth goal |
| Targets are unrealistic (no feasible combination works) | Revisit unit economics or growth goals with stakeholder |

> ⚠️ **Do not lower targets below breakeven to chase volume:** If breakeven targets still do not deliver sufficient volume, the issue is upstream (unit economics, market size, or goal setting), not bid targets.

### 4.4 Adjust and document final targets

If adjustments were needed, record both the original calculated target and the adjusted target with rationale:

| Metric | Calculated target | Adjusted target | Adjustment rationale |
|--------|------------------|----------------|---------------------|
| CPA | | | |
| ROAS | | | |
| POAS | | | |

### 4.5 Final checklist

- [ ] Breakeven levels calculated from verified unit economics
- [ ] PAR agreed with stakeholder
- [ ] CPA/ROAS/POAS targets calculated correctly
- [ ] Targets validated using Performance Planner or bid simulator
- [ ] Targets are above breakeven (never at or below)
- [ ] Final targets documented with rationale

---

## Validation and definition of done

This SOP is complete when:

- [ ] Unit economics inputs are gathered from verified data sources
- [ ] Breakeven CPA, ROAS, or POAS is calculated for the client's vertical
- [ ] PAR is selected based on documented growth vs. efficiency goals
- [ ] Bid targets are calculated using the correct formula per metric
- [ ] Targets are validated using Performance Planner or bid simulator
- [ ] Final targets are documented with breakeven, PAR, and adjustment rationale
- [ ] Stakeholder has approved the growth vs. efficiency tradeoff

---

## Exit → Entry bridge

Once bid targets are validated:

| Next step | When |
|-----------|------|
| Configure bidding strategies in-platform | Targets validated, campaigns ready for launch or migration |
| Revisit unit economics | If validation reveals targets are not viable at any PAR level |
| Revisit goals and KPIs | If validated targets cannot deliver the required volume |

**If bid targets need revision:**

| Trigger | Action |
|---------|--------|
| Unit economics change (pricing, margins, conversion rates) | Re-run Phases 1-3, then re-validate |
| Growth goals change | Re-run Phase 3 (adjust PAR), then re-validate |
| Sustained underperformance vs. targets | Re-validate in Phase 4, check if market conditions shifted |
| Quarterly review | Re-validate inputs and targets against current data |

---

## FAQ

**Q: Should I use CPA, ROAS, or POAS targets?**

A: Lead Gen uses CPA targets. Ecommerce uses ROAS targets by default, or POAS targets if profit tracking is enabled via cart data or custom variables. POAS is preferred when available because it simplifies the math and accounts for margin variation across products. See [Bid Targets Reference](../references/Bid Targets Reference.md) for details.

**Q: What PAR should I start with for a new account?**

A: Start with 0.50 (balanced) unless the stakeholder has a clear preference. Growth-focused accounts can start at 0.75, efficiency-focused at 0.25. Adjust after 2-4 weeks based on actual performance data.

**Q: How do I handle accounts with multiple products at different margins?**

A: Calculate breakeven per product category or use POAS bidding, which handles margin differences automatically (profit is the conversion value). For ROAS bidding, use the weighted average effective margin across your product mix.

**Q: What if Performance Planner shows I need a budget far above what is allocated?**

A: Present the data to the stakeholder with three options: increase budget, lower growth targets, or increase PAR (accept lower margin per conversion). Do not silently set targets below breakeven.

---

## Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Reference | Phases 2-3 |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Mental Model | Phase 1 |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Reference | Phase 1 |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Mental Model | Phase 3 (PAR tradeoff) |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Mental Model | Phase 3 (growth vs efficiency) |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Reference | Phase 4 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md) | Upstream: must complete before this SOP |
| [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md) | Upstream: goals determine PAR selection |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Downstream: uses bid targets to configure in-platform |
| *SOP: Set Up Cart Data and Profit Tracking* | Parallel: required before POAS targeting is available |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Setting targets at breakeven | Leaves zero margin for error or profit | Always apply PAR < 1.0 to breakeven values |
| Using revenue-based ROAS without accounting for order expenses | Inflates apparent profitability | Calculate effective margin (profit margin minus order expenses) |
| Accepting client-stated margins without verification | Clients overestimate margins | Cross-check with backend financial data |
| Skipping validation with Performance Planner | Target may be correct but unachievable | Always validate volume and budget feasibility |
| Not revisiting targets when inputs change | Pricing or conversion rate shifts make old targets wrong | Schedule quarterly recalculation |
| Confusing ROAS and POAS formulas | ROAS uses division by PAR, CPA uses multiplication | Double-check: higher ROAS = more efficient, lower CPA = more efficient |

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
