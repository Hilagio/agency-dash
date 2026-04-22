# Metric Tree Reference
Created: 2026-02-05

Support_ID: REF_47
Status: Done
Category: Operational
Reference Type: Diagnostic Framework
Agent_Readable: Yes
Human_Facing: Yes
Domain: Reporting
Pillar: 0

## Purpose

Documents the Metric Tree framework for root cause analysis of Google Ads performance changes. Use this framework to systematically trace performance shifts to their origin and identify the right lever to pull.

---

## What this is / What this is NOT

**This reference:**

- Provides metric tree structures for Ecommerce and Lead Gen/SaaS
- Documents the mathematical relationships between metrics
- Explains the root cause analysis method
- Identifies common patterns and their diagnoses

**This reference does NOT:**

- Explain which KPIs to choose (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Cover metric definitions in detail (See: [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md))
- Provide full business metric trees (See: [No goal, no bottleneck](../theory/No goal, no bottleneck.md))

---

## The Metric Tree Concept

Every downstream metric is the product of upstream metrics. Performance changes always trace to a root cause: walk the tree to find where the change originated.

**Core principle:** When ROAS drops or CPA rises, don't react to the symptom. Walk the metric tree upstream to find the metric that actually moved first, the root cause that triggered the cascade.

---

## Ecommerce Metric Tree

```
ROAS
├── Conversion Value
│   ├── Conversions
│   │   ├── Clicks
│   │   │   ├── Impressions
│   │   │   │   ├── Search Volume (market demand)
│   │   │   │   └── Impression Share
│   │   │   │       ├── Lost IS (Budget)  ← Budget
│   │   │   │       └── Lost IS (Rank)    ← Ad Rank
│   │   │   │           ├── Abs. Top Impr. %
│   │   │   │           └── Top Impr. %
│   │   │   └── CTR                       ← Ad Rank / Ad copy
│   │   └── Conversion Rate               ← Landing Page + Offer + Traffic Quality
│   └── AOV (Average Order Value)         ← Product Mix + Pricing
└── Cost
    ├── Clicks (same as above)
    └── CPC                               ← Ad Rank
```

> 💡 **Ad Rank factors:** Ad Rank is influenced by: Maximum bid, Ad Rank thresholds, Auction competitiveness, Impact of assets and formats, and Ad quality.

**Goal metrics:**

| Goal type | Primary metric | Secondary metric |
|-----------|---------------|------------------|
| Efficiency | ROAS / POAS | Conversion Value (Revenue/Profit) / Conversions |
| Growth | Conversion Value (Revenue/Profit) / Conversions | ROAS / POAS |

**Key branches:**

| Branch | What it measures | Key drivers |
|--------|------------------|-------------|
| Conversion Value | Revenue/Profit generated | Volume (conversions) and value (AOV) |
| Cost | Money spent | Volume (clicks) and price (CPC) |
| Impressions | Visibility | Market size and share captured |
| Clicks | Traffic | Visibility and relevance (CTR) |
| Conversions | Results | Traffic and effectiveness (CVR) |

---

## Lead Gen / SaaS Metric Tree

For Lead Gen and SaaS, the tree adapts to track cost per acquisition rather than revenue return:

```
CPA (or CPQL / CAC)
├── Cost
│   ├── Clicks
│   │   ├── Impressions
│   │   │   ├── Search Volume (market demand)
│   │   │   └── Impression Share
│   │   │       ├── Lost IS (Budget)  ← Budget
│   │   │       └── Lost IS (Rank)    ← Ad Rank
│   │   │           ├── Abs. Top Impr. %
│   │   │           └── Top Impr. %
│   │   └── CTR                       ← Ad Rank / Ad copy
│   └── CPC                           ← Ad Rank
└── Conversions (Leads / QLs / Closed Deals)
    ├── Clicks (same as above)
    └── Conversion Rate               ← Landing Page + Offer + Traffic Quality
```

**Extended funnel (beyond Google Ads):**

```
Revenue / Closed Deals
├── SQLs
│   ├── MQLs
│   │   ├── Leads (Google Ads conversions)
│   │   └── MQL Rate (Lead → MQL)
│   └── SQL Rate (MQL → SQL)
├── Win Rate (SQL → Closed)
└── Deal Value
```

**Goal metrics:**

| Goal type | Efficiency metric | Growth metric |
|-----------|------------------|---------------|
| Lead Gen (leads) | CPA | Leads |
| Lead Gen (qualified leads) | CPQL | QLs (MQLs / SQLs) |
| Lead Gen (closed deals) | CAC | Closed Deals |
| Lead Gen (revenue) | ROAS / POAS | Revenue / Profit |
| SaaS (customers) | CAC | New Customers |
| SaaS (revenue) | ROAS / POAS | Revenue / Profit |

> 💡 **Downstream visibility:** Google Ads only sees the top of the funnel (clicks, leads). True business outcomes (closed deals, revenue) require offline conversion tracking or CRM integration. See: [Offline Conversion Tracking Reference](../references/Offline Conversion Tracking Reference.md)

---

## Metric Relationships (the math)

### Before the click

```
Impressions = Search Volume × Impression Share
Impression Share = 1 - Lost IS (Budget) - Lost IS (Rank)
```

Impressions can only grow if the market gets bigger (search volume) OR if you capture a larger share of it (impression share). If impressions changed, one of these two moved.

### At the click

```
Clicks = Impressions × CTR
Cost = Clicks × CPC
```

Clicks are the product of visibility (impressions) and engagement (CTR). CTR is influenced by ad copy, ad position (which depends on Ad Rank and competition), and search term relevance. Cost is simply how many clicks you got times what you paid per click.

### After the click

**Ecommerce:**

```
Conversions = Clicks × Conversion Rate
Conversion Value = Conversions × AOV
ROAS = Conversion Value / Cost
```

Or equivalently:

```
ROAS = (CTR × Conv. Rate × AOV) / CPC
```

This simplified ROAS formula reveals the four levers you can actually pull: CTR, conversion rate, AOV, and CPC.

**Lead Gen:**

```
Conversions = Clicks × Conversion Rate
CPA = Cost / Conversions
```

Or equivalently:

```
CPA = CPC / Conversion Rate
```

To lower CPA, either lower CPC or raise conversion rate.

---

## Root Cause Analysis Method

### Step 1️⃣: Start at the outcome metric

Start at your primary outcome metric. This could be:

- **Efficiency metric:** ROAS dropped, CPA increased
- **Growth metric:** Conversions dropped, Revenue declined, Leads decreased

Ask: Did the inputs change (cost, clicks, impressions) or the outputs (conversions, value)? And which moved more?

### Step 2️⃣: Walk up each branch

For whichever side moved, keep asking "why?" by going one level up.

**If ROAS dropped:**

```
ROAS dropped
├── Did cost increase?
│   ├── More clicks? → Why?
│   │   ├── More impressions? → Search volume up or IS up?
│   │   └── Higher CTR? → Ad copy change or position change?
│   └── Higher CPC? → Competition, QS drop, bid strategy, target setting or targeting change?
└── Did conversion value decrease?
    ├── Fewer conversions? → Why?
    │   ├── Fewer clicks? → Why?
    │   │   ├── Fewer impressions? → Search volume down or IS down?
    │   │   └── Lower CTR? → Ad copy change or position change?
    │   └── Lower conversion rate? → Landing page, audience, or intent shift?
    └── Lower AOV? → Product mix shift, discounting, or seasonal?
```

**If CPA increased:**

```
CPA increased
├── Did cost increase?
│   ├── More clicks? → Why?
│   │   ├── More impressions? → Search volume up or IS up?
│   │   └── Higher CTR? → Ad copy change or position change?
│   └── Higher CPC? → Competition, QS drop, bid strategy, target setting or targeting change?
└── Did conversions decrease?
    ├── Fewer clicks? → Why?
    │   ├── Fewer impressions? → Search volume down or IS down?
    │   └── Lower CTR? → Ad copy change or position change?
    └── Lower conversion rate? → Landing page, audience, or intent shift?
```

**If Conversions dropped:**

```
Conversions dropped
├── Did clicks decrease?
│   ├── Fewer impressions? → Why?
│   │   ├── Search volume down? → Market/seasonality
│   │   └── Impression share down? → Budget or rank constraint
│   └── Lower CTR? → Ad copy change or position change?
└── Did conversion rate drop?
    └── Landing page, audience, or intent shift?
```

**If Revenue/Conversion Value dropped:**

```
Revenue dropped
├── Did conversions decrease? → (see conversions tree above)
└── Did AOV decrease?
    └── Product mix shift, discounting, or seasonal?
```

### Step 3️⃣: Identify the root node

Keep climbing until you find the metric that actually moved first, the one that caused the cascade.

| Root cause | What moved | Category |
|---|---|---|
| Market changed | Search volume up/down | External |
| Budget constraint | Lost IS (Budget) high | Budget |
| Rank constraint | Lost IS (Rank) high | Quality Score / Bids |
| Ad relevance shifted | CTR changed | Copy / Targeting |
| Competition changed | CPC changed (with stable QS) | External |
| Quality Score changed | CPC + position shifted | Ad relevance / LP |
| Target setting changed | CPC changed (with stable QS + competition) | Bid strategy |
| Landing page issue | Conv. rate dropped | Post-click experience |
| Audience quality shifted | Conv. rate dropped (with stable LP) | Targeting / Search terms |
| Product mix changed | AOV shifted | Offer / Merchandising |

### Step 4️⃣: Classify the constraint

Once you've found the root cause, classify where the constraint sits:

| Location | Problem type | Examples |
|----------|--------------|----------|
| Before the click | Visibility or position problem | Lost IS, search volume decline |
| At the click | Relevance or cost problem | Low CTR, high CPC |
| After the click | Conversion or value problem | Low CVR, low AOV |

This tells you where to focus your optimization effort.

---

## Influencing Factors

Each metric in the tree is influenced by specific controllable factors:

| Metric | Influenced by |
|---|---|
| Search Volume | Market demand, seasonality, trends (mostly uncontrollable) |
| Lost IS (Budget) | Daily budget, bid strategy settings |
| Lost IS (Rank) | Ad Rank (see factors above) |
| Abs. Top / Top Impr. % | Ad Rank |
| CTR | Ad Rank, ad copy, search term relevance |
| CPC | Ad Rank, bid strategy, target setting |
| Conversion Rate | Landing page, offer, audience quality, search term intent |
| AOV | Product mix, pricing, cross-sells, promotions |

---

## Reading the Deltas

When analyzing period-over-period changes:

- **Green / positive doesn't always mean good:** CPC going up is "green" in absolute terms but bad for efficiency.
- **Always read metrics in context of their parent:** Clicks up +50% means nothing if cost went up +80%.
- **Compare growth rates across the chain:** If clicks grew faster than conversions, conversion rate dropped. If cost grew faster than conversion value, ROAS dropped.

### The key ratio check

```
If Conversion Value growth % > Cost growth % → ROAS improved
If Conversion Value growth % < Cost growth % → ROAS declined
```

```
If Conversion growth % > Cost growth % → CPA improved
If Conversion growth % < Cost growth % → CPA worsened
```

That's the only comparison that ultimately matters.

---

## Common Patterns

### Pattern 1: Scaled but less efficient

- Impressions up, Clicks up, Cost up significantly
- Conversions up, but Conv. Rate down
- ROAS / CPA worsened

**Root cause:** Scaling brought in lower-quality traffic. Check search terms and audience segments.

**Diagnosis:** Traffic quality problem. The extra clicks aren't as qualified.

### Pattern 2: Market grew, we didn't

- Search Volume up significantly, Impression Share flat or down
- Lost IS (Rank) up
- Competitors took the growth

**Root cause:** Ad Rank isn't keeping up. Quality Score and/or bids need work.

**Diagnosis:** Rank constraint. Improve QS or increase bids to capture market growth.

### Pattern 3: Paying more for the same

- Impressions flat, Clicks flat
- CPC up, Cost up
- Conversions flat, ROAS / CPA worsened

**Root cause:** Competition increased or Quality Score dropped. Check auction insights and QS components.

**Diagnosis:** Cost efficiency problem. Address QS or accept higher costs.

### Pattern 4: More traffic, same results

- Clicks up significantly, Conv. Rate down significantly
- Conversions flat
- Cost up, ROAS / CPA worsened

**Root cause:** Traffic quality problem. The extra clicks aren't converting.

**Diagnosis:** Audit search terms, audiences, and match types. Consider tightening targeting.

### Pattern 5: Everything looks good but efficiency dropped

- All metrics slightly positive
- But Cost growth % > Conv. Value/Conversion growth %

**Root cause:** CPC inflation outpacing conversion gains. The small +4% CPC increase matters more than the small +2% conv. rate gain.

**Diagnosis:** Run the ROAS/CPA formula to see which lever is lagging. Address the weakest component.

---

## Quick Reference: Diagnosis by Constraint Location

| Constraint location | Symptoms | First actions |
|---------------------|----------|---------------|
| **Before the click** | Low impressions, high Lost IS | Check budget (if Lost IS Budget) or Quality Score/bids (if Lost IS Rank) |
| **At the click** | Low CTR or high CPC | Review ad copy, extensions, search term relevance. Check Quality Score. |
| **After the click** | Low CVR or low AOV | Audit landing page, offer, and traffic quality. Check search terms for intent match. |

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Framework: analysis approach |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference: metric definitions |
| [No goal, no bottleneck](../theory/No goal, no bottleneck.md) | Theory: full business metric trees |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Execution: performance analysis procedure |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Foundation: target ROAS/CPA calculation |

---

## Version Details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
