# Unit Economics Reference
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CHEATSHEET_10
Status: Done
Category: Strategic
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Business
Pillar: 3

## Purpose

Documents the formulas, calculations, and benchmark thresholds for unit economics across all three verticals (Ecommerce, Lead Gen, SaaS) so practitioners can quickly calculate, validate, and monitor the numbers that determine campaign viability.

---

## What this reference is / What this is NOT

**This reference:**

- Lists every unit economics formula per vertical
- Provides worked calculation examples
- Documents benchmark thresholds and warning signs
- Includes a diagnostic table for identifying unit economics problems

**This reference does NOT:**

- Explain why unit economics matter strategically (See: [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md))
- Provide step-by-step instructions for gathering inputs (See: [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md))
- Cover goal-setting or KPI selection (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Explain bid strategy selection (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))

---

## Quick reference: key formulas by vertical

### Ecommerce

| Metric | Formula | Example |
|--------|---------|---------|
| **Gross margin %** | (Revenue - COGS - Shipping - Payment fees) / Revenue | (€32.28 - €20.20 - €6.50 - €1.00) / €32.28 = 14.2% |
| **Break-even ROAS** | 1 / Gross margin % | 1 / 0.142 = 704% |
| **Target ROAS** | Break-even ROAS / Acquisition budget share | 704% / 0.75 = 939% |
| **Contribution margin** | Revenue - COGS - Shipping - Fees - Ad spend | €32.28 - €20.20 - €6.50 - €1.00 - €4.30 = €0.28 |
| **POAS (Profit on Ad Spend)** | Gross profit / Ad spend | €4.58 / €4.30 = 106% |

> ⚠️ **Break-even ROAS is the minimum:** At break-even you make zero profit. Multiply by your acquisition budget share (typically 0.50-0.75 of gross profit allocated to acquisition) to get a realistic target ROAS.

### Lead Gen

| Metric | Formula | Example |
|--------|---------|---------|
| **Target CPL** | Deal value x Profit margin % x Lead-to-sale rate | €10,000 x 30% x 20% = €600 |
| **Target CAC** | Deal value x Profit margin % | €10,000 x 30% = €3,000 |
| **Profit per deal** | Deal value x Profit margin % - CAC | €10,000 x 30% - €500 = €2,500 |
| **ROI per deal** | Profit per deal / CAC | €2,500 / €500 = 5x |
| **Required lead volume** | Revenue target / (Deal value x Lead-to-sale rate) | €1M / (€10,000 x 20%) = 50 leads/month |

> ⚠️ **Target CPL is your break-even ceiling:** Every € above that CPL reduces profit. Set your operational target below the break-even CPL to maintain margins.

### SaaS

| Metric | Formula | Example |
|--------|---------|---------|
| **ARPU** | MRR / Active paying customers | €100K / 1,000 = €100/month |
| **Customer lifetime (months)** | 1 / Monthly churn rate | 1 / 5% = 20 months |
| **LTV** | ARPU x Customer lifetime x Gross margin % | €100 x 20 x 70% = €1,400 |
| **Max CAC (golden rule)** | LTV / 3 | €1,400 / 3 = €467 |
| **CAC** | Total acquisition spend / New paying customers | €40,000 / 100 = €400 |
| **LTV:CAC ratio** | LTV / CAC | €1,400 / €400 = 3.5:1 |
| **CAC payback (months)** | CAC / (ARPU x Gross margin %) | €400 / (€100 x 70%) = 5.7 months |

> ⚠️ **The golden rule: LTV:CAC must be at least 3:1:** Below 3:1, acquisition costs eat into profitability. At 1:1, you wait the full customer lifetime just to break even.

---

## Ecommerce: detailed calculations

### Step 1️⃣: Calculate gross margin per order

| Line item | Source | Example |
|-----------|--------|---------|
| Revenue (order value) | Backend/Shopify | €32.28 |
| Minus: Cost of goods sold (COGS) | Backend/supplier data | -€20.20 |
| Minus: Shipping cost (paid by business) | Shipping provider | -€6.50 |
| Minus: Payment processing fee | Payment provider | -€1.00 |
| **= Gross profit** | Calculated | **€4.58** |
| **Gross margin %** | Gross profit / Revenue | **14.2%** |

### Step 2️⃣: Calculate break-even ROAS

Break-even ROAS = 1 / Gross margin %

| Gross margin % | Break-even ROAS | Assessment |
|---------------|-----------------|------------|
| 70% | 143% | Excellent: easy to scale |
| 50% | 200% | Good: standard target achievable |
| 30% | 333% | Tight: limited scaling headroom |
| 15% | 667% | Difficult: very narrow margins |
| 10% | 1000% | Unscalable: unit economics problem |

### Step 3️⃣: Calculate target ROAS

Target ROAS = Break-even ROAS / Acquisition budget share

The acquisition budget share is the percentage of gross profit you allocate to advertising. Common ranges:

| Acquisition budget share | Use case |
|-------------------------|----------|
| 75% (aggressive) | Growth-focused, high-margin products |
| 50% (balanced) | Standard operations, moderate margins |
| 25% (conservative) | Thin margins, efficiency-focused |

### AOV impact on scalability

| AOV | Gross margin % | Gross profit/order | Break-even ROAS | Scalability |
|-----|---------------|-------------------|-----------------|-------------|
| €100 | 50% | €50 | 200% | High |
| €50 | 50% | €25 | 200% | Moderate |
| €30 | 15% | €4.50 | 667% | Very low |
| €20 | 10% | €2.00 | 1000% | Unscalable |

---

## Lead Gen: detailed calculations

### Step 1️⃣: Gather inputs

| Input | Source | Example |
|-------|--------|---------|
| Average deal value | CRM/sales data | €10,000 |
| Profit margin % | Finance/accounting | 30% |
| Lead-to-sale rate | CRM (leads closed / leads generated) | 20% |
| Current CAC | Ad spend / new customers acquired | €500 |

### Step 2️⃣: Calculate target CPL and CAC

| Calculation | Formula | Result |
|-------------|---------|--------|
| Profit per deal | €10,000 x 30% | €3,000 |
| Target CPL (break-even) | €3,000 x 20% | €600 |
| Target CAC (break-even) | €3,000 | €3,000 |
| Operational target CPL | Target CPL x 75% | €450 |

### Lead-to-sale rate impact

| Lead-to-sale rate | Deal value €10K, margin 30% | Max CPL |
|-------------------|---------------------------|---------|
| 50% | High-performing sales team | €1,500 |
| 30% | Good sales process | €900 |
| 20% | Average | €600 |
| 10% | Below average | €300 |
| 5% | Poor: fix sales process first | €150 |

> ⚠️ **Low lead-to-sale rates crush target CPLs:** A 5% lead-to-sale rate on a €10K deal with 30% margin gives you only €150 max CPL: competitive bidding is nearly impossible at that level.

### Deal value impact

| Deal value | Margin 30%, L2S 20% | Max CPL | Max CAC |
|-----------|---------------------|---------|---------|
| €50,000 | High-value services | €3,000 | €15,000 |
| €10,000 | Standard services | €600 | €3,000 |
| €5,000 | Small business services | €300 | €1,500 |
| €1,000 | Low-ticket services | €60 | €300 |

---

## SaaS: detailed calculations

### Step 1️⃣: Calculate ARPU

| Input | Source | Example |
|-------|--------|---------|
| Monthly Recurring Revenue (MRR) | Billing system | €100,000 |
| Active paying customers | Billing system | 1,000 |
| **ARPU** | MRR / Customers | **€100/month** |

### Step 2️⃣: Calculate customer lifetime

| Monthly churn rate | Customer lifetime | Assessment |
|-------------------|------------------|------------|
| 2% | 50 months | Excellent product-market fit |
| 3% | 33 months | Strong retention |
| 5% | 20 months | Average |
| 8% | 12.5 months | Below average: retention problem |
| 15% | 6.7 months | Critical: fix product before scaling |

### Step 3️⃣: Calculate LTV and max CAC

| Metric | Formula | Example |
|--------|---------|---------|
| LTV | ARPU x Lifetime x Margin | €100 x 20 x 70% = €1,400 |
| Max CAC (3:1 rule) | LTV / 3 | €467 |
| Comfortable CAC (5:1) | LTV / 5 | €280 |

### LTV:CAC ratio interpretation

| LTV:CAC | Interpretation | Action |
|---------|---------------|--------|
| 5:1+ | Highly scalable: room to invest | Increase spend, test new channels |
| 3:1 - 5:1 | Healthy: sustainable scaling | Maintain pace, optimize incrementally |
| 2:1 - 3:1 | Warning zone: thin margins | Reduce CAC or improve retention |
| 1:1 - 2:1 | Danger zone: barely breaking even | Pause scaling, fix fundamentals |
| Below 1:1 | Losing money on every customer | Stop acquisition spend immediately |

### CAC payback period

| CAC payback (months) | Assessment |
|---------------------|------------|
| Under 6 | Excellent: fast payback, strong cash flow |
| 6-12 | Good: standard SaaS benchmark |
| 12-18 | Concerning: cash flow pressure |
| 18+ | Problematic: liquidity risk |

---

## Warning signs diagnostic table

These symptoms look like Google Ads problems but are actually unit economics problems.

| Symptom | What it looks like | Actual root cause | Where to look |
|---------|-------------------|-------------------|---------------|
| Can't bid competitively | CPCs too high, low impression share | Target CPA/ROAS too restrictive due to poor margins | Gross margin %, break-even ROAS |
| Stuck in bottom-of-funnel only | Can't afford Display/Video/Demand Gen | Unit economics don't support upper funnel CPAs | Target CPL/CAC headroom |
| Over-optimizing for efficiency | All effort goes to lowering CPA/raising ROAS | No budget room for growth due to thin margins | Contribution margin, profit per deal |
| Forced to target only exact-match | Generic keywords too expensive | Target CPA ceiling too low for broad match CPCs | Deal value, lead-to-sale rate |
| Client says "Google Ads doesn't work" | Campaigns are unprofitable despite solid CTR/CVR | Product margins or sales process can't support paid acquisition | Full unit economics audit |
| Campaigns "stall" after initial success | Early wins from brand/retargeting, generic traffic unprofitable | Brand traffic masked poor unit economics | Non-branded ROAS vs blended ROAS |

---

## Onboarding validation checklist

Before accepting a new client, validate these metrics:

### Ecommerce

| Check | Minimum threshold | Red flag |
|-------|------------------|----------|
| Gross margin % | 30%+ | Below 20% |
| Break-even ROAS | Below 500% | Above 700% |
| AOV | Varies by vertical | Below €20 with margins under 20% |
| Return rate | Below 20% | Above 30% (erodes margins) |

### Lead Gen

| Check | Minimum threshold | Red flag |
|-------|------------------|----------|
| Lead-to-sale rate | 15%+ | Below 10% |
| Average deal value | Supports CPL > €50 | CPL ceiling below €30 |
| Sales team response time | Under 2 hours | Over 24 hours |
| Sales process exists | Documented and followed | No process, no CRM |

### SaaS

| Check | Minimum threshold | Red flag |
|-------|------------------|----------|
| LTV:CAC ratio | 3:1+ | Below 2:1 |
| Monthly churn rate | Below 5% | Above 8% |
| ARPU | Supports CAC > €100 | Below €20/month with high churn |
| Free-to-paid rate | Above 5% | Below 2% |

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Using revenue as the benchmark | Revenue ignores COGS, shipping, fees | Calculate gross margin and use profit-based metrics |
| Ignoring return rates (ecommerce) | Returns erode gross margin after the sale | Factor average return rate into margin calculations |
| Using blended lead-to-sale rate | Hides channel-specific quality differences | Calculate lead-to-sale rate per traffic source |
| Ignoring churn rate (SaaS) | Overstates LTV and max CAC | Use actual monthly churn, not annual estimates |
| Setting targets at break-even | Zero profit, no room for error | Set operational targets at 50-75% of break-even ceiling |
| Not revisiting quarterly | Unit economics change as business evolves | Recalculate every quarter with fresh data |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Strategic framework for why these metrics matter |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Unit economics feed into goal-setting targets |
| [Google Ads Success Formula Mental Model](../mental-models/Google Ads Success Formula Mental Model.md) | Unit Economics is Pillar 3 in the formula |
| [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md) | Step-by-step procedure using this reference |
| [KPI Reference](../references/KPI Reference.md) | In-platform metric definitions and calculations |

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
