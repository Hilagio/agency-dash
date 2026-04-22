# Unit Economics Mental Model
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: MENTALMODEL_13
Status: Done
Category: Strategic
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Business
Pillar: 3

## Purpose

This mental model helps you determine whether a business's unit economics support scalable Google Ads campaigns and where to look when campaigns lack traction despite solid in-platform execution.

> ❓ **The core question:** Do the underlying business economics give this account enough room to bid competitively and scale profitably?

Unit economics determine campaign viability. Poor unit economics cannot be solved with Google Ads optimizations. If the numbers don't work, the campaigns won't work, no matter how skilled the specialist.

---

## What this is NOT

This mental model does **not:**

- Provide formulas for setting bid targets (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Explain how to set up conversion tracking for revenue/profit data (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))
- Cover the goal-setting process that translates economics into targets (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Replace a full financial analysis: this covers the metrics a Google Ads specialist must understand, not the full P&L

---

## The core principle

Unit economics sit at **Pillar 3** of the Google Ads Success Formula. They determine the ceiling for your acquisition targets: your maximum CPL, your break-even ROAS, your maximum CAC. Every in-platform metric (bids, budgets, targets) flows from these numbers.

> ⚠️ **If unit economics are broken, scaling campaigns just scales losses:** Fix the source before touching Google Ads.

---

## Unit economics by vertical

### Ecommerce

| Metric | Calculation | What it determines |
|--------|-------------|-------------------|
| **Average Order Value (AOV)** | Total revenue / number of orders | Revenue per transaction, bid ceiling |
| **Cost of Goods Sold (COGS)** | Direct product costs per unit | Gross margin available for acquisition |
| **Gross Margin %** | (Revenue - COGS) / Revenue | How much of each euro is available after product costs |
| **Break-even ROAS** | 1 / Gross Margin % | Minimum ROAS to avoid losing money |
| **Contribution Margin** | Gross Profit - Ad Spend | Actual profit after advertising costs |

**The break-even ROAS calculation:**

```
Break-even ROAS = 1 / Gross Margin %

Example:
Revenue per order:     €32.28
COGS + shipping + fees: €27.64
Gross profit:          €4.64
Gross margin:          14.4%
Break-even ROAS:       1 / 0.144 = 694%

To make money (not just break even), target ROAS must be higher.
If you allocate 75% of gross profit back to acquisition:
Target ROAS = 1 / (Gross Margin % x 0.75) = 925%
```

**Why it matters:** An ecommerce account with 12% gross margins needs 758%+ ROAS just to break even. That's nearly impossible on non-branded traffic. The problem isn't Google Ads: it's the margin structure.

**Key relationships:**

- Higher AOV = more room per click (higher CPC tolerance)
- Higher gross margin = lower break-even ROAS = more bidding flexibility
- Shipping and payment fees eat directly into gross margin: include them

### Lead Gen (B2B/B2C)

| Metric | Calculation | What it determines |
|--------|-------------|-------------------|
| **Average Deal Value** | Revenue per closed deal | Revenue ceiling per customer |
| **Profit Margin %** | Profit per deal / deal value | How much of each deal is available for acquisition |
| **Lead-to-Sale Rate** | Closed deals / total leads | Conversion efficiency of the sales process |
| **Target CPL** | Profit margin x lead-to-sale rate | Maximum cost per lead before losing money |
| **CAC (Customer Acquisition Cost)** | Total acquisition spend / new customers | Actual cost to acquire each customer |

**The target CPL calculation:**

```
Target CPL = Deal Value x Profit Margin % x Lead-to-Sale Rate

Example:
Deal value:        €10,000
Profit margin:     30% (€3,000)
Lead-to-sale rate: 20%
Target CPL:        €3,000 x 20% = €600

CAC cannot exceed €3,000 (the full profit margin).
CPL must stay below €600 to maintain profitability.
```

**Why it matters:** A low lead-to-sale rate compresses your target CPL dramatically. If sales closes at 5% instead of 20%, target CPL drops from €600 to €150 on the same deal. The constraint isn't your campaign: it's the sales team.

**Key relationships:**

- Higher deal value = more acquisition room
- Higher lead-to-sale rate = higher allowable CPL = more competitive bids
- CAC must stay below profit margin per deal

### SaaS

| Metric | Calculation | What it determines |
|--------|-------------|-------------------|
| **ARPU (Avg Revenue Per User)** | MRR / paying customers | Revenue foundation for all calculations |
| **Customer Lifetime (months)** | 1 / monthly churn rate | How long revenue flows per customer |
| **LTV (Lifetime Value)** | ARPU x customer lifetime x gross margin % | Maximum total value per customer |
| **CAC (Customer Acquisition Cost)** | Total acquisition spend / new paying customers | Cost to acquire each customer |
| **LTV:CAC Ratio** | LTV / CAC | Scalability indicator |

**The LTV and max CAC calculation:**

```
LTV = ARPU x Customer Lifetime x Gross Margin %

Example:
ARPU:              €100/month
Monthly churn:     5% → Customer lifetime: 20 months
Gross margin:      70%
LTV:               €100 x 20 x 70% = €1,400

Golden Rule: LTV:CAC must be ≥ 3:1
Max CAC:           €1,400 / 3 = €467

If CAC = €460, ratio is ~3:1 → safe
If CAC = €1,400, ratio is 1:1 → danger zone (20-month payback)
```

**Why it matters:** A SaaS company with high churn has low customer lifetime, which crushes LTV, which compresses max CAC. The constraint isn't your Google Ads campaign: it's product retention.

**Key relationships:**

- Higher ARPU = higher LTV = more acquisition room
- Lower churn = longer lifetime = exponentially higher LTV
- LTV:CAC below 3:1 = danger zone, approaching 1:1 = breaking even over the full customer lifetime

---

## Warning signs of broken unit economics

These symptoms look like Google Ads problems but are actually unit economics problems:

| Symptom | What it looks like | Actual root cause |
|---------|-------------------|-------------------|
| **Can't bid competitively** | Low impression share, few clicks, no traction | Target CPA/ROAS is too conservative because margins are thin |
| **Stuck in bottom-of-funnel only** | Can't afford broad match, display, video, or PMax prospecting | Generic keywords are too expensive relative to allowable CPL/ROAS |
| **Can't launch upper funnel** | Any non-search campaign destroys efficiency | CAC ceiling is too low for awareness-level traffic costs |
| **Over-optimizing for efficiency** | Constant pausing, restricting, tightening | Forced into efficiency mode because growth mode isn't viable |
| **ROAS looks great but business isn't growing** | 800% ROAS, but thin margins mean pennies in actual profit | High ROAS masks low absolute contribution margin |
| **High lead volume, low pipeline value** | Leads come in but deals don't close at needed rates | Sales capacity, lead quality, or deal value issues |

> ⚠️ **If you see these symptoms, diagnose unit economics before touching campaigns:** The fix is almost always outside Google Ads: pricing, margins, sales process, churn reduction, or product improvements.

---

## Root causes and solutions by vertical

### Ecommerce

| Root cause | Indicators | Potential solutions |
|-----------|------------|-------------------|
| Low gross margins | Break-even ROAS > 500% | Renegotiate supplier costs, adjust pricing, reduce shipping costs, eliminate unprofitable SKUs |
| Low AOV | Need very low CPCs to hit targets | Create product bundles, add upsells/cross-sells, free shipping thresholds, minimum order incentives |
| High return rate | Revenue looks good but net is poor | Improve product descriptions, sizing guides, quality control, set return expectations |

### Lead Gen

| Root cause | Indicators | Potential solutions |
|-----------|------------|-------------------|
| Poor lead-to-sale rate | High volume, low closed deals | Sales training, faster follow-up SLAs, lead scoring systems, automated nurture sequences |
| Low deal value | CPL must be extremely low | Focus on higher-value services, create service bundles, add upsell paths |
| Long sales cycles | Deals stall, pipeline bloats | Create urgency with limited-time offers, improve proposal process, automate follow-ups, set clear next steps |
| Poor lead quality | Leads don't match ICP | Add pre-qualifying questions, improve landing page specificity, tighten keyword targeting, create qualifying content |

### SaaS

| Root cause | Indicators | Potential solutions |
|-----------|------------|-------------------|
| Low ARPU | Max CAC is too small to bid competitively | Move upmarket, adjust pricing tiers, add premium features, increase plan prices |
| High churn | Short customer lifetime crushes LTV | Improve onboarding, increase product stickiness, add switching costs, improve customer success |
| High CAC | LTV:CAC ratio below 3:1 | Optimize conversion funnel, reduce CPC through quality improvements, focus on higher-intent channels |

---

## Practical application

### During client onboarding

Include unit economics in your onboarding process. Request or calculate:

- **Ecommerce:** AOV, COGS per order (including shipping and fees), gross margin %, current ROAS and contribution margin
- **Lead Gen:** Average deal value, profit margin, lead-to-sale rate by source, sales cycle length, current CPL and CAC
- **SaaS:** ARPU, monthly churn rate, LTV calculation, current CAC, LTV:CAC ratio

If the client can't provide these numbers, that's itself a red flag (Pillar 4: Goals and KPIs is also likely broken).

### Red flags to decline or escalate

- Ecommerce gross margin below 20% (break-even ROAS > 500%)
- Lead Gen lead-to-sale rate below 10% without a clear improvement plan
- SaaS LTV:CAC ratio below 2:1 with no path to improvement
- Client says "just make it work" when presented with economics data

### Ongoing monitoring

Report on unit economics quarterly at minimum. Use tools like ProfitMetrics or custom dashboards to track contribution margin, not just ROAS. The gap between reported ROAS and actual business profit is where unit economics problems hide.

---

## Key principles

1. **Unit economics set the ceiling:** No Google Ads tactic can exceed what the business economics allow.
2. **Fix at the source:** Poor margins, weak sales teams, and high churn are business problems, not campaign problems.
3. **Include all costs:** COGS, shipping, payment fees, returns: everything that sits between revenue and gross profit matters.
4. **Use real numbers, not assumptions:** Request actual data from clients. Assumptions hide the truth.
5. **Check economics before scaling:** Every time a client asks to "scale up", verify that unit economics support higher volume at acceptable efficiency.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Google Ads Success Formula Mental Model](../mental-models/Google Ads Success Formula Mental Model.md) | Unit economics is Pillar 3 in the formula |
| [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md) | Unit economics problems fall in the "Business" bucket |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Translates unit economics into actionable campaign targets |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum data thresholds that interact with economic constraints |

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
