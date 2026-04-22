# KPI Reference
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CHEATSHEET_11
Status: Done
Category: Strategic
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Foundations
Pillar: 4

## Purpose

Documents every Google Ads KPI: what it measures, how it is calculated, what tier it belongs to, and when to use it. This is the single reference for metric definitions and the three-tier KPI framework.

---

## What this reference is / What this is NOT

**This reference:**

- Defines every relevant Google Ads metric and its calculation
- Classifies metrics into three tiers (Primary, Secondary/Guardrail, Diagnostic)
- Maps KPIs to goal types (growth vs efficiency)
- Provides benchmark ranges per vertical

**This reference does NOT:**

- Explain how to set goals (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Provide step-by-step goal-setting instructions (See: [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md))
- Cover unit economics formulas (See: [Unit Economics Reference](../references/Unit Economics Reference.md))
- Explain bid strategy selection (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))

---

## Quick reference: KPI tiers by goal type

### Growth-focused primary goal

| Tier | KPIs | Purpose |
|------|------|---------|
| **Primary** | Conversions, Conversion value, Revenue | Measure growth progress |
| **Secondary (guardrails)** | Minimum ROAS, Maximum CPA, Minimum profit margin | Prevent efficiency collapse |
| **Diagnostic** | Impressions, CTR, CPC, Conversion rate, AOV, Impression share, Quality Score | Identify drivers and issues |

### Efficiency-focused primary goal

| Tier | KPIs | Purpose |
|------|------|---------|
| **Primary** | CPA, ROAS, Cost per qualified lead, POAS | Measure efficiency progress |
| **Secondary (guardrails)** | Minimum conversion volume, Minimum conversion value, Minimum impression share | Prevent volume collapse |
| **Diagnostic** | Impressions, CTR, CPC, Conversion rate, AOV, Impression share, Quality Score | Identify drivers and issues |

> ⚠️ **Every account needs both growth and efficiency KPIs:** One is primary (your goal), the other is guardrails (your safety net). Ignoring guardrails leads to either unprofitable scaling or volume starvation.

---

## Tier 1: Primary KPIs

These metrics directly measure progress toward your Google Ads goal. Report on these in every stakeholder meeting.

### Conversions

| Attribute | Detail |
|-----------|--------|
| **What it measures** | Number of completed conversion actions |
| **Calculation** | Count of conversion events within the attribution window |
| **Use when** | Growth goal: track volume of desired actions |
| **Primary for** | Lead Gen (leads, qualified leads, closed deals), SaaS (trials, signups) |
| **Watch out for** | Attribution window settings, conversion lag, duplicate counting |

### Conversion value

| Attribute | Detail |
|-----------|--------|
| **What it measures** | Total monetary value of all conversions |
| **Calculation** | Sum of all conversion values within the attribution window |
| **Use when** | Growth goal: track revenue from Google Ads |
| **Primary for** | Ecommerce (revenue), Lead Gen (pipeline value) |
| **Watch out for** | Static vs dynamic values, currency settings, return/cancellation adjustments |

### CPA (Cost Per Action)

| Attribute | Detail |
|-----------|--------|
| **What it measures** | Average cost to acquire one conversion |
| **Calculation** | Cost / Conversions |
| **Use when** | Efficiency goal: minimize acquisition cost |
| **Primary for** | Lead Gen (cost per lead), SaaS (cost per trial) |
| **Watch out for** | Micro vs macro conversions, lagged conversions inflating short-term CPA |

### ROAS (Return On Ad Spend)

| Attribute | Detail |
|-----------|--------|
| **What it measures** | Revenue generated per euro of ad spend |
| **Calculation** | Conversion value / Cost x 100% |
| **Use when** | Efficiency goal: maximize return on investment |
| **Primary for** | Ecommerce (revenue efficiency) |
| **Watch out for** | Revenue-based ROAS ignores margins: use POAS for profitability |

### POAS (Profit On Ad Spend)

| Attribute | Detail |
|-----------|--------|
| **What it measures** | Gross profit generated per euro of ad spend |
| **Calculation** | Gross profit / Cost x 100% |
| **Use when** | Efficiency goal: maximize profitability (not just revenue) |
| **Primary for** | Ecommerce with profit tracking enabled |
| **Watch out for** | Requires profit tracking setup (cart data + COGS import) |

### Cost per qualified lead

| Attribute | Detail |
|-----------|--------|
| **What it measures** | Cost to acquire one qualified lead (not just any lead) |
| **Calculation** | Cost / Qualified lead conversions |
| **Use when** | Efficiency goal: measure true acquisition cost after qualification |
| **Primary for** | Lead Gen with offline conversion tracking |
| **Watch out for** | Requires OCT import of qualified lead stage from CRM |

---

## Tier 2: Secondary KPIs (Guardrails)

Guardrails prevent your primary goal from causing damage. Set these as hard boundaries that cannot be crossed.

### For growth-focused accounts

| Guardrail | What it prevents | How to set |
|-----------|-----------------|------------|
| **Minimum ROAS** | Unprofitable scaling | Set at or above break-even ROAS from unit economics |
| **Maximum CPA** | Overpaying for conversions | Set at or below break-even CPL/CAC from unit economics |
| **Minimum profit margin** | Margin erosion from aggressive bidding | Set at minimum acceptable contribution margin |

### For efficiency-focused accounts

| Guardrail | What it prevents | How to set |
|-----------|-----------------|------------|
| **Minimum conversion volume** | Campaigns drying out, losing market share | Set based on Smart Bidding thresholds (30+ conversions/month) |
| **Minimum conversion value** | Revenue dropping below business needs | Set based on revenue targets from business goals |
| **Minimum impression share** | Competitive visibility erosion | Set based on auction insights baseline |

> ⚠️ **When a guardrail triggers, investigate before adjusting:** A guardrail breach means your primary goal is causing damage. Diagnose the cause before loosening the guardrail.

---

## Tier 3: Diagnostic KPIs

Diagnostic KPIs are investigation tools. They explain why primary KPIs move. Do not set targets for diagnostic KPIs: use them to find problems and opportunities.

### Traffic metrics

| Metric | Calculation | What it reveals | Investigate when |
|--------|-------------|-----------------|-----------------|
| **Impressions** | Count of ad displays | Reach and market coverage | Volume drops unexpectedly |
| **Clicks** | Count of ad clicks | Traffic volume | Conversion volume drops but CVR is stable |
| **CTR** | Clicks / Impressions x 100% | Ad relevance and message resonance | Below 3% for Search, below 0.5% for Display |
| **CPC** | Cost / Clicks | Competition level and bid efficiency | CPC spikes above historical average |

### Conversion metrics

| Metric | Calculation | What it reveals | Investigate when |
|--------|-------------|-----------------|-----------------|
| **Conversion rate** | Conversions / Clicks x 100% | Landing page and offer effectiveness | CVR drops below historical baseline |
| **AOV** | Conversion value / Conversions | Revenue per transaction trend | AOV decreases (check product mix, discounts) |
| **View-through conversions** | Conversions after ad view (no click) | Upper funnel contribution | Evaluating Display/Video/PMax impact |

### Competitive metrics

| Metric | Calculation | What it reveals | Investigate when |
|--------|-------------|-----------------|-----------------|
| **Search impression share** | Impressions / Total eligible impressions | Market coverage | Below 60% on core non-branded campaigns |
| **IS lost to budget** | % of impressions lost due to budget | Budget constraints | Above 10%: consider budget increase or consolidation |
| **IS lost to rank** | % of impressions lost due to Ad Rank | Quality or bid issues | Above 20%: check Quality Score and bids |
| **Absolute top IS** | Top-1 position impressions / Total eligible | Competitive dominance | Branded campaigns below 90% |

### Quality metrics

| Metric | Calculation | What it reveals | Investigate when |
|--------|-------------|-----------------|-----------------|
| **Quality Score** | 1-10 scale (Expected CTR + Ad relevance + LP experience) | Ad-keyword-LP alignment | Below 6: investigate components |
| **Expected CTR** | Below/Average/Above average | Ad copy effectiveness | Below average: rewrite ads |
| **Ad relevance** | Below/Average/Above average | Keyword-ad alignment | Below average: tighten ad groups |
| **LP experience** | Below/Average/Above average | Landing page quality | Below average: optimize LP |

---

## Metric relationships

Understanding how metrics flow into each other helps diagnose performance changes.

```
Impressions x CTR = Clicks
Clicks x CPC = Cost
Clicks x Conversion rate = Conversions
Conversions x AOV = Conversion value
Conversion value / Cost = ROAS
Cost / Conversions = CPA
```

**Diagnosis flow:** When a primary KPI drops, work backwards through the chain:

```
Conversion value dropped
├─ Conversions dropped?
│  ├─ Clicks dropped?
│  │  ├─ Impressions dropped? → Check budget, IS, bid changes
│  │  └─ CTR dropped? → Check ad copy, competitive landscape
│  └─ Conversion rate dropped? → Check LP, offer, audience quality
└─ AOV dropped? → Check product mix, discounting, seasonal shifts
```

---

## Benchmark ranges by vertical

These are directional benchmarks, not targets. Actual performance varies by industry, competition, and account maturity.

### Search campaigns

| Metric | Ecommerce | Lead Gen | SaaS |
|--------|-----------|----------|------|
| CTR | 2-5% | 3-7% | 2-5% |
| CPC | €0.50-€3.00 | €2.00-€15.00 | €3.00-€20.00 |
| Conversion rate | 2-4% | 3-8% | 2-5% |
| CPA | €15-€60 | €30-€200 | €50-€300 |
| ROAS | 300-800% | N/A | N/A |

### Shopping campaigns

| Metric | Ecommerce |
|--------|-----------|
| CTR | 0.8-2.5% |
| CPC | €0.30-€1.50 |
| Conversion rate | 1.5-3.5% |
| ROAS | 400-1000% |

### Performance Max

| Metric | Ecommerce | Lead Gen | SaaS |
|--------|-----------|----------|------|
| Conversion rate | 1-3% | 2-5% | 1-3% |
| CPA | €20-€80 | €40-€250 | €60-€350 |
| ROAS | 300-700% | N/A | N/A |

> ⚠️ **Benchmarks are starting points, not goals:** Your targets come from unit economics (See: [Unit Economics Reference](../references/Unit Economics Reference.md)), not from industry averages.

---

## Vanity metrics to avoid

| Metric | Why it seems useful | Why it is misleading | The test |
|--------|--------------------|--------------------|----------|
| High CTR with no conversions | "People are clicking" | Clicks without conversions = irrelevant traffic or broken funnel | Does this metric inform a specific optimization action? |
| Millions of impressions | "We're reaching everyone" | Impressions without clicks = wrong audience or weak creative | Are these impressions leading to qualified clicks? |
| Low CPC | "We're getting cheap traffic" | Cheap traffic that doesn't convert wastes budget | Is the low CPC producing conversions at an acceptable CPA? |
| High Quality Score | "Google likes our ads" | QS of 10 with zero conversions is worthless | Is QS translating to lower CPCs and more conversions? |

**The universal test:** Can this metric inform a specific optimization action that moves a primary KPI? If not, it is vanity.

---

## Monitoring cadence

| Level | Purpose | Cadence | Key metrics |
|-------|---------|---------|-------------|
| **Account overview** | Am I on track against primary/secondary goals? | Weekly | Primary KPIs, guardrail KPIs |
| **Campaign view** | Which campaigns drive results? Where to reallocate? | Weekly | Conversions, CPA, ROAS by campaign |
| **Ad group and below** | Which keywords, ads, audiences work? Where to optimize? | Bi-weekly | Diagnostic KPIs, QS, search terms |
| **Business validation** | Does Google Ads data match backend reality? | Monthly | Backend revenue vs GA4/Google Ads revenue, lead quality |

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| No guardrail KPIs | Growth focus destroys profitability, or efficiency focus kills volume | Set secondary KPIs for every account |
| Optimizing diagnostic KPIs | Improving CTR or QS without checking conversion impact | Only optimize diagnostics that move primary KPIs |
| Comparing campaign types at same CPA | Upper funnel CPA is structurally higher than bottom funnel | Set different CPA expectations per campaign type |
| Weekly CPA/ROAS panic | Short-term fluctuations trigger overreaction | Evaluate over 2x conversion lag minimum |
| Ignoring conversion lag | Undercounts recent conversions, triggers premature changes | Check "Days to conversion" report before judging |
| Using blended metrics only | Brand traffic inflates overall ROAS, hides non-branded weakness | Segment by branded vs non-branded for true performance |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Strategic framework for goal-setting and KPI selection |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Formulas that determine KPI targets |
| [Google Ads Success Formula Mental Model](../mental-models/Google Ads Success Formula Mental Model.md) | KPIs map to Pillar 4 in the formula |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Volume thresholds that interact with KPI targets |
| [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md) | Step-by-step procedure using this reference |
| [Goal Quality Checklist](../checklists/Goal Quality Checklist.md) | Validates goals and KPIs are properly set |

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
