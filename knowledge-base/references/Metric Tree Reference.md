# Metric Tree Reference
Created: 2026-02-05
Updated: 2026-09-16

Support_ID: REF_47
Status: Done
Category: Operational
Reference Type: Diagnostic Framework
Agent_Readable: Yes
Human_Facing: Yes
Domain: Reporting
Pillar: 0

## Purpose

Documents the Metric Tree framework for root cause analysis of Google Ads performance changes: how performance shifts trace back to their origin, and which lever sits at each node.

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

## The Metric Tree concept

A metric tree decomposes an outcome into counts, rates, values and costs. Its equations locate the arithmetic drivers of a change. They do not establish which business or advertising condition caused it.

**Core principle:** a ROAS drop or a CPA rise is a symptom. The tree locates the changed components. A causal explanation requires comparable definitions, mature cohorts, a mix check and evidence that distinguishes competing explanations. The first metric to move is not automatically the cause.

---

## Ecommerce metric tree

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

## Lead Gen / SaaS metric tree

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

## Metric relationships (the math)

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
ROAS = (Conv. Rate × AOV) / CPC
```

This identity uses click-based conversion rate as a decimal, purchase conversions and matched revenue/cost scope. Clicks cancel between revenue and cost, so CTR is not a separate multiplier. Conversion rate, AOV and CPC are the three arithmetic components. They are not independent causal levers: targeting and bidding changes can affect several together.

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

## Root cause analysis method

### Step 1️⃣: Start at the outcome metric

The walk starts at the primary outcome metric:

- **Efficiency metric:** ROAS dropped, CPA increased
- **Growth metric:** Conversions dropped, Revenue declined, Leads decreased

The first question splits inputs from outputs: did cost, clicks and impressions change, or did conversions and value, and which moved more?

### Step 2️⃣: Walk up each branch

Each level identifies the components behind the arithmetic movement. Explanations for those components remain candidates until supported by evidence.

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

### Step 3️⃣: Locate the changed component

The changed component identifies the next investigation. The patterns below are consistent with several explanations, including mix, measurement and timing changes. Chronology alone does not establish causation.

| Candidate explanation | Observed pattern | Investigation area |
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

The symptom sits at a location in the tree. Its explanation can sit elsewhere in the business system:

| Location | Problem type | Examples |
|----------|--------------|----------|
| Before the click | Visibility or position problem | Lost IS, search volume decline |
| At the click | Relevance or cost problem | Low CTR, high CPC |
| After the click | Conversion or value problem | Low CVR, low AOV |

Evidence, plausible impact on the primary goal and protection of the guardrail determine the chosen constraint. The largest metric movement does not automatically win.

---

## Influencing factors

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

## Reading the deltas

When analyzing period-over-period changes:

- **Green does not always mean good.** CPC going up is "green" in absolute terms and bad for efficiency.
- **A metric reads against its parent.** Clicks up +50% means nothing if cost went up +80%.
- **Growth rates compare across the chain.** Clicks growing faster than conversions means conversion rate dropped. Cost growing faster than conversion value means ROAS dropped.

### The key ratio check

```
If Conversion Value growth % > Cost growth % → ROAS improved
If Conversion Value growth % < Cost growth % → ROAS declined
```

```
If Conversion growth % > Cost growth % → CPA improved
If Conversion growth % < Cost growth % → CPA worsened
```

That is the comparison that ultimately matters.

---

## Common patterns

### Pattern 1: Scaled but less efficient

- Impressions up, Clicks up, Cost up significantly
- Conversions up, but Conv. Rate down
- ROAS / CPA worsened

**Candidate explanations:** Changed traffic mix, weaker performance within comparable segments, immature conversions or changed measurement.

**Distinguishing evidence:** Segment traffic shares and mature conversion rates separate a mix effect from a within-segment decline.

### Pattern 2: Market grew, we didn't

- Search Volume up significantly, Impression Share flat or down
- Lost IS (Rank) up
- Captured impressions failed to keep pace with estimated eligible demand

**Candidate explanations:** Bids or targets, auction conditions, ad quality or changes in eligibility.

**Distinguishing evidence:** Bid history, quality components and auction insights provide context. Higher rank loss alone does not prove a quality problem or profitable headroom.

### Pattern 3: Paying more for the same

- Impressions flat, Clicks flat
- CPC up, Cost up
- Conversions flat, ROAS / CPA worsened

**Candidate explanations:** Bidding changes, competition, quality or traffic mix.

**Distinguishing evidence:** Change history, comparable query/device segments and auction insights. Quality Score components are diagnostics, not auction inputs.

### Pattern 4: More traffic, same results

- Clicks up significantly, Conv. Rate down significantly
- Conversions flat
- Cost up, ROAS / CPA worsened

**Candidate explanations:** Traffic mix shifted, comparable visitors converted less often, or measurement/cohort maturity changed.

**Distinguishing evidence:** Traffic weights and conversion rates within matched segments, followed by offer and site evidence.

### Pattern 5: Everything looks good but efficiency dropped

- All metrics slightly positive
- But Cost growth % > Conv. Value/Conversion growth %

**Arithmetic:** With AOV fixed, CPC +4% and CVR +2% imply ROAS × 1.02 / 1.04, a decline of about 1.9%.

**Interpretation:** The identity identifies the arithmetic contribution. Evidence and material goal-gap impact determine which underlying condition merits intervention.

---

## Quick reference: diagnosis by constraint location

| Constraint location | Symptoms | First actions |
|---------------------|----------|---------------|
| **Before the click** | Low impressions, high Lost IS | Check budget (if Lost IS Budget) or Quality Score/bids (if Lost IS Rank) |
| **At the click** | Low CTR or high CPC | Review ad copy, extensions, search term relevance. Check Quality Score. |
| **After the click** | Low CVR or low AOV | Audit landing page, offer, and traffic quality. Check search terms for intent match. |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Framework: analysis approach |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference: metric definitions |
| [No goal, no bottleneck](../theory/No goal, no bottleneck.md) | Theory: full business metric trees |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Execution: performance analysis procedure |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Foundation: target ROAS/CPA calculation |

---

## Version details

- **Version:** 3.0
- **Last Updated:** September 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
