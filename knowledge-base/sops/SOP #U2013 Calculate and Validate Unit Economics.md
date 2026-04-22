# SOP – Calculate and Validate Unit Economics
Created: 2026-02-04
Updated: 2026-02-05

SOP_ID: SOP_16
Status: Done
Category: Strategic
Agent_Executable: No
Human_Approval_Required: Yes
Primary Outcome: Validated unit economics with documented formulas, thresholds, and a go/no-go decision on campaign viability
Secondary Outcomes: Identified root causes of poor unit economics, clear target CPA/ROAS derived from real numbers
Domain: Business
Pillar: 3

## Purpose

This SOP walks you through gathering inputs, calculating unit economics per vertical, and making a viability decision before committing ad spend.

> ❓ **The big question:** Are this client's unit economics strong enough to support profitable Google Ads campaigns?

---

## What this SOP is NOT

This SOP does **not:**

- Explain why unit economics matter (See: [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md))
- List formulas without context (See: [Unit Economics Reference](../references/Unit Economics Reference.md))
- Set campaign goals or KPIs (See: [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md))

## When to run this SOP

Run this SOP when:

- Onboarding a new client (before campaign setup)
- Unit economics inputs change (pricing, margins, churn, sales process)
- Campaigns show warning signs: can't bid competitively, stuck in bottom-of-funnel only, over-optimizing for efficiency

---

## Before you start

### Required inputs

- Access to backend financial data (revenue, COGS, margins)
- CRM data (lead-to-sale rate, deal values, sales cycle length) for Lead Gen
- Billing system data (MRR, churn rate, customer count) for SaaS
- Current Google Ads performance data (CPA, ROAS, CPC, conversion rate)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Formulas and benchmark thresholds |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Warning signs and root causes |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Identify vertical** | Determine which calculation set to use | Vertical classification |
| **Phase 2️⃣: Gather inputs** | Collect all required metrics from backend/CRM | Completed input worksheet |
| **Phase 3️⃣: Calculate** | Run the formulas | Break-even targets, viability thresholds |
| **Phase 4️⃣: Validate and decide** | Compare against benchmarks, make go/no-go call | Viability assessment document |

---

## Phase 1️⃣: Identify vertical

Determine the client's primary vertical. Use the corresponding calculation set.

| If the client... | Vertical | Calculation set |
|-----------------|----------|----------------|
| Sells physical or digital products online | Ecommerce | Gross margin, break-even ROAS, target ROAS |
| Generates leads for a sales team to close | Lead Gen | Target CPL, target CAC, profit per deal |
| Sells recurring subscriptions | SaaS | ARPU, LTV, max CAC, LTV:CAC ratio |

For hybrid businesses (e.g., SaaS with ecommerce add-ons), run calculations for the primary revenue stream first, then secondary.

---

## Phase 2️⃣: Gather inputs

### Ecommerce inputs

Collect from backend (Shopify, WooCommerce, etc.) and finance:

1. **Average order value (AOV):** Total revenue / Total orders (last 90 days)
2. **Cost of goods sold (COGS) per order:** Direct product cost per average order
3. **Shipping cost per order:** Average shipping cost paid by the business
4. **Payment processing fee per order:** Average payment gateway fee
5. **Return rate:** Percentage of orders returned (last 90 days)
6. **Current Google Ads ROAS:** Conversion value / Cost (non-branded campaigns)

### Lead Gen inputs

Collect from CRM (HubSpot, Salesforce, etc.) and sales team:

1. **Average deal value:** Total revenue from closed deals / Number of deals (last 6 months)
2. **Profit margin %:** (Revenue - delivery costs) / Revenue
3. **Lead-to-sale rate:** Closed deals / Total leads generated (last 6 months)
4. **Average sales cycle length:** Days from lead to close
5. **Sales team response time:** Average time from lead submission to first contact
6. **Current Google Ads CPA:** Cost / Conversions (non-branded campaigns)

### SaaS inputs

Collect from billing system and product analytics:

1. **Monthly Recurring Revenue (MRR):** Current MRR
2. **Active paying customers:** Current count
3. **Monthly churn rate:** Customers lost / Total customers (average of last 6 months)
4. **Gross margin %:** (Revenue - infrastructure/delivery costs) / Revenue
5. **Current CAC:** Total acquisition spend / New paying customers (last 6 months)
6. **Free-to-paid conversion rate:** Paying customers / Free trial signups (if applicable)

---

## Phase 3️⃣: Calculate

### Ecommerce calculations

1. **Gross profit per order** = AOV - COGS - Shipping - Payment fees

2. **Gross margin %** = Gross profit / AOV

3. **Break-even ROAS** = 1 / Gross margin %

4. **Adjusted break-even ROAS** (accounting for returns) = Break-even ROAS / (1 - Return rate)

5. **Target ROAS** = Adjusted break-even ROAS / Acquisition budget share
   - Use 0.75 for growth-focused, 0.50 for balanced, 0.25 for conservative

6. **Record results:**

| Metric | Value |
|--------|-------|
| AOV | |
| Gross profit per order | |
| Gross margin % | |
| Break-even ROAS | |
| Adjusted break-even ROAS (with returns) | |
| Target ROAS (operational) | |
| Current Google Ads ROAS | |

### Lead Gen calculations

1. **Profit per deal** = Deal value x Profit margin %

2. **Target CPL (break-even)** = Profit per deal x Lead-to-sale rate

3. **Target CAC (break-even)** = Profit per deal

4. **Operational target CPL** = Break-even CPL x 0.75 (leave margin for profit)

5. **ROI per deal** = (Profit per deal - Current CAC) / Current CAC

6. **Record results:**

| Metric | Value |
|--------|-------|
| Average deal value | |
| Profit margin % | |
| Profit per deal | |
| Lead-to-sale rate | |
| Break-even CPL | |
| Operational target CPL | |
| Current Google Ads CPA | |

### SaaS calculations

1. **ARPU** = MRR / Active paying customers

2. **Customer lifetime** = 1 / Monthly churn rate

3. **LTV** = ARPU x Customer lifetime x Gross margin %

4. **Max CAC (golden rule)** = LTV / 3

5. **CAC payback (months)** = Current CAC / (ARPU x Gross margin %)

6. **LTV:CAC ratio** = LTV / Current CAC

7. **Record results:**

| Metric | Value |
|--------|-------|
| ARPU | |
| Monthly churn rate | |
| Customer lifetime (months) | |
| LTV | |
| Max CAC (3:1 rule) | |
| Current CAC | |
| LTV:CAC ratio | |
| CAC payback (months) | |

---

## Phase 4️⃣: Validate and decide

### Step 1️⃣: Check against thresholds

Compare your calculated values against the benchmark thresholds in the [Unit Economics Reference](../references/Unit Economics Reference.md) onboarding validation section.

### Step 2️⃣: Viability assessment

| Result | Assessment | Action |
|--------|-----------|--------|
| All metrics above minimum thresholds | **Go:** proceed with campaign setup | Set targets based on calculated thresholds |
| Some metrics marginal (near thresholds) | **Conditional go:** proceed with caution | Set conservative targets, review monthly |
| Key metrics below thresholds | **No-go:** do not proceed with Google Ads | Present findings, recommend fixing fundamentals first |

### Step 3️⃣: If no-go, identify root causes

Check the warning signs diagnostic table in the [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md). Common root causes:

| Vertical | Root cause | Recommendation to client |
|----------|-----------|------------------------|
| Ecommerce | Gross margins below 20% | Review pricing, supplier costs, shipping strategy |
| Lead Gen | Lead-to-sale rate below 10% | Improve sales process, response time, qualification |
| Lead Gen | Deal values too low | Explore upsells, bundles, higher-value services |
| SaaS | Monthly churn above 8% | Fix product retention before scaling acquisition |
| SaaS | LTV:CAC below 2:1 | Reduce CAC or improve retention/ARPU |

### Step 4️⃣: Document and share

Create a one-page summary with:
- Client name, vertical, date of analysis
- Key inputs used (with sources)
- Calculated thresholds (break-even ROAS, target CPL, max CAC)
- Viability assessment (go/conditional/no-go)
- Recommended targets for Google Ads campaigns
- Next review date

---

## Validation and definition of done

This SOP is complete when:

- [ ] All inputs are gathered from verified data sources
- [ ] Calculations are completed for the client's vertical
- [ ] Results are compared against benchmark thresholds
- [ ] Viability assessment is documented (go/conditional/no-go)
- [ ] Recommended Google Ads targets are derived from the calculations
- [ ] Summary document is shared with stakeholder

---

## Exit → Entry bridge

Once unit economics are validated:

| Outcome | Next step |
|---------|-----------|
| **Go** | Proceed to *SOP: Set Campaign Goals and KPIs* |
| **Conditional go** | Proceed to goals with conservative targets, schedule monthly review |
| **No-go** | Present findings to client, recommend business improvements, revisit in 3-6 months |

**If unit economics change:**

| Trigger | Action |
|---------|--------|
| Pricing change | Re-run Phase 3 calculations |
| New sales process or team | Re-gather Lead Gen inputs, recalculate |
| Churn rate shifts significantly | Re-run SaaS calculations |
| Quarterly review | Re-validate all inputs against current data |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Using revenue instead of gross profit | Revenue ignores costs | Always calculate from gross margin |
| Accepting client-provided margins without verification | Clients overestimate margins | Cross-check with backend data |
| Skipping return rate adjustment (ecommerce) | Returns erode margins after the sale | Always factor in return rate |
| Using blended lead-to-sale rate | Hides channel-quality differences | Calculate per traffic source |
| Not revisiting when business changes | Stale inputs lead to wrong targets | Schedule quarterly recalculation |

---

## Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Reference | Phases 3-4 |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Mental Model | Phase 4 (root cause diagnosis) |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md) | Downstream: uses validated unit economics to set targets |
| [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md) | Parallel: LP strategy depends on viable unit economics |

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
