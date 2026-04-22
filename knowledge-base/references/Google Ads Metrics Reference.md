# Google Ads Metrics Reference
Created: 2026-02-05

Support_ID: CHEATSHEET_42
Status: Done
Category: Operational
Reference Type: Cheat Sheet
Agent_Readable: Yes
Human_Facing: Yes
Domain: Reporting
Pillar: 0

## Purpose

Documents core Google Ads metrics, their definitions, calculations, and interpretation guidelines for accurate reporting and analysis.

---

## What this is / What this is NOT

**This reference:**

- Defines standard Google Ads metrics and their calculations
- Explains metric relationships and diagnostic use
- Provides benchmark ranges by campaign type
- Documents metric availability by campaign type

**This reference does NOT:**

- Explain which KPIs to choose (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Cover custom column formulas (See: [Custom Columns Reference](../references/Custom Columns Reference.md))
- Explain reporting frameworks (See: [Reporting Mental Model](../mental-models/Reporting Mental Model.md))

---

## Quick reference: core metrics

| **Metric** | **Formula** | **What it measures** | **Higher is** |
|------------|-------------|---------------------|---------------|
| **Impressions** | Count of ad displays | Reach | More reach |
| **Clicks** | Count of ad clicks | Traffic | More traffic |
| **CTR** | Clicks ÷ Impressions | Ad relevance | Better |
| **CPC** | Cost ÷ Clicks | Traffic cost | Lower is cheaper |
| **Conversions** | Count of tracked actions | Results | More results |
| **CVR** | Conversions ÷ Clicks | Landing page effectiveness | Better |
| **CPA** | Cost ÷ Conversions | Cost efficiency | Lower is better |
| **ROAS** | Conv. Value ÷ Cost | Revenue efficiency | Higher is better |

---

## 1️⃣ Traffic Metrics

### Impressions

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Number of times your ad was shown |
| **Formula** | Count (no calculation) |
| **What it measures** | Reach and visibility |
| **Diagnostic use** | Low impressions = targeting too narrow or budget too low |

**Impression types:**

| **Type** | **Definition** | **Available in** |
|----------|---------------|------------------|
| Impressions | Total ad displays | All campaigns |
| Viewable impressions | Ads meeting viewability standards (50%+ visible for 1+ second) | Display, Video |
| Measurable impressions | Impressions where viewability could be measured | Display, Video |

### Clicks

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Number of clicks on your ad |
| **Formula** | Count (no calculation) |
| **What it measures** | User engagement and traffic volume |
| **Diagnostic use** | Low clicks with high impressions = poor ad relevance |

**Click types:**

| **Type** | **Definition** |
|----------|---------------|
| Clicks | All clicks on ad |
| Engaged-view clicks | Clicks after 10+ seconds of video watched |
| Invalid clicks | Filtered clicks (bots, accidents) |

### Click-Through Rate (CTR)

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Percentage of impressions that resulted in clicks |
| **Formula** | (Clicks ÷ Impressions) × 100 |
| **What it measures** | Ad relevance and appeal |
| **Diagnostic use** | Low CTR = ad copy, targeting, or competitive issue |

**CTR benchmarks by campaign type:**

| **Campaign type** | **Below average** | **Average** | **Good** | **Excellent** |
|-------------------|-------------------|-------------|----------|---------------|
| Search (branded) | <5% | 5-10% | 10-20% | >20% |
| Search (non-branded) | <2% | 2-4% | 4-7% | >7% |
| Shopping | <0.5% | 0.5-1% | 1-2% | >2% |
| Display | <0.1% | 0.1-0.3% | 0.3-0.5% | >0.5% |
| Video | <0.3% | 0.3-0.8% | 0.8-1.5% | >1.5% |
| Demand Gen | <0.5% | 0.5-1% | 1-2% | >2% |

> ⚠️ **Benchmarks are directional:** Your industry, audience, and offer significantly affect expected CTR. Use these as starting points, not absolute standards.

---

## 2️⃣ Cost Metrics

### Cost (Spend)

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Total amount spent on ads |
| **Formula** | Sum of all clicks × their CPCs |
| **What it measures** | Budget consumption |
| **Diagnostic use** | Compare to budget, track pacing |

### Cost Per Click (CPC)

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Average cost for each click |
| **Formula** | Cost ÷ Clicks |
| **What it measures** | Traffic acquisition cost |
| **Diagnostic use** | Rising CPC = increased competition or lower Quality Score |

**CPC types:**

| **Type** | **Definition** |
|----------|---------------|
| Avg. CPC | Total cost ÷ total clicks |
| Max CPC | Your bid ceiling (manual bidding) |
| Actual CPC | What you actually paid per click |

**CPC benchmarks by campaign type:**

| **Campaign type** | **Low** | **Medium** | **High** |
|-------------------|---------|------------|----------|
| Search (branded) | <€0.50 | €0.50-2 | >€2 |
| Search (non-branded) | <€1 | €1-5 | >€5 |
| Shopping | <€0.30 | €0.30-1 | >€1 |
| Display | <€0.25 | €0.25-1 | >€1 |
| Video (CPV) | <€0.03 | €0.03-0.10 | >€0.10 |

### Cost Per Mille (CPM)

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Cost per 1,000 impressions |
| **Formula** | (Cost ÷ Impressions) × 1,000 |
| **What it measures** | Awareness campaign efficiency |
| **Diagnostic use** | Primary metric for awareness/reach goals |

---

## 3️⃣ Conversion Metrics

### Conversions

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Number of tracked conversion actions |
| **Formula** | Count based on attribution model |
| **What it measures** | Results and outcomes |
| **Diagnostic use** | Primary success metric for most campaigns |

**Conversion counting methods:**

| **Method** | **Behavior** | **Best for** |
|------------|--------------|--------------|
| One per click | Max 1 conversion per click | Lead gen (form submissions) |
| Every | All conversions from one click | Ecommerce (multiple purchases) |

**Conversion columns:**

| **Column** | **What it shows** |
|------------|-------------------|
| Conversions | All conversions (primary + secondary marked "yes") |
| All conversions | All tracked actions including secondary |
| Primary conversions | Only actions marked as primary |
| View-through conversions | Conversions after ad view (no click) |

### Conversion Rate (CVR)

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Percentage of clicks that converted |
| **Formula** | (Conversions ÷ Clicks) × 100 |
| **What it measures** | Landing page and offer effectiveness |
| **Diagnostic use** | Low CVR = landing page, offer, or traffic quality issue |

**CVR benchmarks by campaign type:**

| **Campaign type** | **Below average** | **Average** | **Good** | **Excellent** |
|-------------------|-------------------|-------------|----------|---------------|
| Search (branded) | <5% | 5-10% | 10-20% | >20% |
| Search (non-branded) | <2% | 2-4% | 4-7% | >7% |
| Shopping | <1% | 1-3% | 3-5% | >5% |
| Display | <0.5% | 0.5-1% | 1-2% | >2% |
| Demand Gen | <1% | 1-2% | 2-4% | >4% |

### Cost Per Acquisition (CPA)

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Average cost to acquire one conversion |
| **Formula** | Cost ÷ Conversions |
| **What it measures** | Efficiency of conversion acquisition |
| **Diagnostic use** | Primary efficiency metric for lead gen |

**CPA relationship:**

```
CPA = CPC ÷ CVR
```

To lower CPA, either lower CPC or raise CVR (or both).

### Conversion Value

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Total value of all conversions |
| **Formula** | Sum of conversion values |
| **What it measures** | Revenue generated |
| **Diagnostic use** | Primary metric for ecommerce |

### Return on Ad Spend (ROAS)

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Revenue generated per euro spent |
| **Formula** | Conversion Value ÷ Cost |
| **What it measures** | Revenue efficiency |
| **Diagnostic use** | Primary efficiency metric for ecommerce |

**ROAS formats:**

| **Format** | **Example** | **Meaning** |
|------------|-------------|-------------|
| Decimal | 3.5 | €3.50 revenue per €1 spent |
| Percentage | 350% | €3.50 revenue per €1 spent |
| Ratio | 3.5:1 | €3.50 revenue per €1 spent |

> 💡 **ROAS ≠ Profit:** A 300% ROAS means €3 revenue per €1 ad spend, but revenue must cover COGS and other costs. Calculate target ROAS from your unit economics. (See: [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md))

---

## 4️⃣ Competitive Metrics

### Impression Share

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Percentage of eligible impressions you received |
| **Formula** | Your Impressions ÷ Total Eligible Impressions |
| **What it measures** | Market coverage |
| **Diagnostic use** | Growth headroom and competitive position |

**Impression share types:**

| **Type** | **Definition** |
|----------|---------------|
| Search impression share | Share of Search impressions |
| Display impression share | Share of Display impressions |
| Absolute top IS | Share of very top position |
| Top IS | Share of top positions (above organic) |

### Lost Impression Share

| **Type** | **Definition** | **Fix** |
|----------|---------------|---------|
| Lost IS (budget) | Lost due to insufficient budget | Increase budget |
| Lost IS (rank) | Lost due to low Ad Rank | Improve Quality Score or increase bids |

**Diagnostic matrix:**

| **Scenario** | **Interpretation** | **Action** |
|--------------|-------------------|-----------|
| High IS Lost (budget) | Budget-constrained | Increase budget or narrow targeting |
| High IS Lost (rank) | Quality or bid issue | Improve QS or bid higher |
| Both high | Multiple constraints | Address budget first, then rank |
| Both low | Efficient delivery | Growth opportunity: increase budget |

### Search Top Metrics

| **Metric** | **Definition** |
|------------|---------------|
| Search top IS | % of impressions in top positions |
| Search abs. top IS | % of impressions in #1 position |
| Search top IS lost (budget) | Top positions lost to budget |
| Search top IS lost (rank) | Top positions lost to rank |

---

## 5️⃣ Quality Metrics

### Quality Score

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | 1-10 score estimating ad quality |
| **Components** | Expected CTR, Ad relevance, Landing page experience |
| **What it measures** | Ad quality and relevance |
| **Diagnostic use** | Low QS = higher CPCs, lower positions |

**Quality Score components:**

| **Component** | **Weight** | **What it measures** |
|---------------|-----------|---------------------|
| Expected CTR | High | Historical CTR vs. competitors |
| Ad relevance | Medium | Ad copy to keyword alignment |
| Landing page | Medium | Page quality and relevance |

**Quality Score interpretation:**

| **Score** | **Status** | **Action** |
|-----------|-----------|-----------|
| 1-4 | Poor | Investigate and fix urgently |
| 5-6 | Average | Identify improvement opportunities |
| 7-8 | Good | Maintain, minor optimizations |
| 9-10 | Excellent | Protect and replicate |

> ⚠️ **Quality Score is diagnostic, not a KPI:** Don't optimize for QS directly: optimize for the components (CTR, relevance, landing page). QS improvement follows.

### Optimization Score

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | 0-100% score of account optimization potential |
| **Formula** | Google's weighted algorithm |
| **What it measures** | Alignment with Google's recommendations |
| **Diagnostic use** | Identifies improvement opportunities |

> ⚠️ **Optimization Score ≠ Performance:** A 100% score means you've applied Google's recommendations, not that your account performs well. Evaluate recommendations individually.

---

## 6️⃣ Video-Specific Metrics

### Views

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Number of video views (30 seconds or full video if shorter) |
| **Formula** | Count of qualifying views |
| **What it measures** | Video engagement |

### View Rate

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Percentage of impressions that resulted in views |
| **Formula** | (Views ÷ Impressions) × 100 |
| **What it measures** | Video creative appeal |

**View rate benchmarks:**

| **Format** | **Below average** | **Average** | **Good** |
|------------|-------------------|-------------|----------|
| Skippable in-stream | <15% | 15-25% | >25% |
| In-feed | <2% | 2-5% | >5% |

### Cost Per View (CPV)

| **Attribute** | **Details** |
|---------------|-------------|
| **Definition** | Average cost per video view |
| **Formula** | Cost ÷ Views |
| **What it measures** | Video view efficiency |

### Watch Time Metrics

| **Metric** | **Definition** |
|------------|---------------|
| Video played to 25% | Count of views reaching 25% |
| Video played to 50% | Count of views reaching 50% |
| Video played to 75% | Count of views reaching 75% |
| Video played to 100% | Count of completed views |

---

## Metric Flow Diagram

Understanding how metrics relate helps diagnose problems:

```
Impressions
    │
    ├── CTR → Clicks
    │            │
    │            ├── CPC → Cost
    │            │
    │            └── CVR → Conversions
    │                         │
    │                         └── AOV → Revenue
    │                                      │
    │                                      └── Margin → Profit
    │
    └── Impression Share → Competitive position
```

**Diagnostic principle:** When a downstream metric changes, trace upstream to find root cause.

---

## Metric Availability by Campaign Type

| **Metric** | **Search** | **Shopping** | **Display** | **Video** | **Demand Gen** | **PMax** |
|------------|------------|--------------|-------------|-----------|----------------|----------|
| Impressions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Clicks | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CTR | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CPC | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Conversions | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| CVR | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Quality Score | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Impression Share | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Views | ❌ | ❌ | ❌ | ✅ | ✅ | Limited |
| CPV | ❌ | ❌ | ❌ | ✅ | ✅ | ❌ |

---

## Common Mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Optimizing for CTR alone | High CTR ≠ high conversions | Focus on conversion metrics |
| Ignoring conversion lag | Judging too early | Wait for attribution window |
| Comparing different attribution models | Invalid comparison | Use consistent attribution |
| ROAS without unit economics context | ROAS target may be wrong | Calculate target ROAS from margins |
| Quality Score as primary KPI | Chasing score vs. results | Use QS for diagnosis only |
| Ignoring impression share | Missing growth potential | Monitor IS for budget decisions |

---

## Related Documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Framework: which metrics to prioritize |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Framework: how to analyze metrics |
| [Metric Tree Reference](../references/Metric Tree Reference.md) | Reference: root cause analysis using metric relationships |
| [Custom Columns Reference](../references/Custom Columns Reference.md) | Reference: custom metric formulas |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Foundation: target ROAS/CPA calculation |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Execution: weekly metric analysis |

---

## Version Details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
