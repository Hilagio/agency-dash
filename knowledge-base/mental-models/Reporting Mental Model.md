# Reporting Mental Model
Created: 2026-02-05

Support_ID: MENTALMODEL_25
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Reporting
Pillar: 0

## Purpose

This mental model helps you build a reporting framework that connects campaign data to business decisions, so every report drives action rather than just presenting numbers.

> ❓ **The core question:** What should I measure, how often should I look at it, and what action does it drive?

Reporting is not about dashboards or data volume. It's about surfacing the right information at the right time to enable the right decisions. Bad reporting creates confusion and analysis paralysis. Good reporting accelerates optimization.

---

## What this is NOT

This mental model does **not:**

- Define which KPIs to track (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Explain how to set up conversion tracking (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))
- Cover unit economics calculations (See: [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md))

---

## The Reporting Hierarchy

Reports exist at different levels, each serving a distinct audience and purpose.

| **Level** | **Audience** | **Question answered** | **Cadence** | **Depth** |
|-----------|--------------|----------------------|-------------|-----------|
| **1️⃣ Executive** | C-suite, business owners | Are we hitting business goals? | Monthly/Quarterly | Minimal: outcomes only |
| **2️⃣ Strategic** | Marketing leadership | Which channels/campaigns drive results? | Weekly/Bi-weekly | Moderate: performance by segment |
| **3️⃣ Tactical** | Campaign managers | What needs to change today? | Daily/Weekly | Deep: ad group and keyword level |
| **4️⃣ Diagnostic** | Specialists | Why is this happening? | As needed | Granular: segment, dimension, time |

> ⚠️ **Match the report to the audience:** Giving executives keyword-level data wastes their time. Giving specialists only top-line metrics prevents them from acting.

---

## The Three Report Types

### 1️⃣ Performance reports

*"How are we doing against our goals?"*

| **Element** | **Description** |
|-------------|-----------------|
| **Purpose** | Track progress toward primary and secondary KPIs |
| **Structure** | Current period vs. target vs. previous period |
| **Key metrics** | Primary KPIs (conversions, revenue, CPA, ROAS) + guardrail KPIs |
| **Action** | Continue, adjust targets, or escalate |

**Example structure:**

| Metric | Target | Current | vs. Target | vs. Last Period |
|--------|--------|---------|------------|-----------------|
| Conversions | 500 | 480 | -4% | +12% |
| ROAS | 400% | 385% | -4% | -2% |
| Spend | €50,000 | €48,500 | -3% | +8% |

**Why it works:** Performance reports answer "are we winning?" at a glance. They don't explain why: that's for diagnostic reports.

### 2️⃣ Trend reports

*"Where are we heading?"*

| **Element** | **Description** |
|-------------|-----------------|
| **Purpose** | Identify momentum shifts before they become problems |
| **Structure** | Time series visualization (week-over-week, month-over-month) |
| **Key metrics** | Same as performance, visualized over time |
| **Action** | Investigate acceleration or deceleration |

**Key trend signals:**

| Signal | Interpretation | Action |
|--------|---------------|--------|
| CPA rising for 3+ weeks | Efficiency degrading | Investigate creative fatigue, competition, or landing page |
| Conversion rate declining | Offer or page losing effectiveness | A/B test new landing page or offer |
| Impression share dropping | Losing competitive position | Review bids, budget, or Quality Score |
| CTR dropping | Ad relevance declining | Refresh ad copy or test new messaging |

**Why it works:** Point-in-time reports can miss momentum. A flat week looks fine until you see it's the fourth flat week in a row.

### 3️⃣ Diagnostic reports

*"Why is this happening?"*

| **Element** | **Description** |
|-------------|-----------------|
| **Purpose** | Isolate root causes of performance changes |
| **Structure** | Segmented views, dimension breakdowns, time comparisons |
| **Key dimensions** | Device, location, audience, keyword, ad, time of day |
| **Action** | Apply specific fix to specific segment |

**Diagnostic framework:**

```
Performance changed
│
├─ WHERE did it change?
│   ├─ Which campaigns?
│   ├─ Which ad groups?
│   └─ Which keywords/audiences?
│
├─ WHAT metric changed first?
│   ├─ Impressions → Reach problem
│   ├─ CTR → Ad relevance problem
│   ├─ CPC → Auction problem
│   └─ CVR → Landing page or offer problem
│
└─ WHEN did it start?
    ├─ Correlate with changes you made
    ├─ Correlate with competitor activity
    └─ Correlate with external factors (seasonality, news)
```

**Why it works:** Diagnostic reports turn "performance dropped" into "CTR dropped on mobile in California after our competitor launched their sale".

---

## The Metric Flow

Understanding how metrics flow from impression to revenue reveals where problems originate.

```
Impressions
    ↓ (CTR)
Clicks
    ↓ (CPC)
Cost
    ↓ (CVR)
Conversions
    ↓ (AOV)
Revenue
    ↓ (Margin)
Profit
```

**The diagnostic principle:** When a downstream metric changes, trace upstream to find the root cause.

| Metric change | Check upstream | Root cause examples |
|---------------|---------------|---------------------|
| Revenue dropped | Conversions dropped or AOV dropped? | Fewer transactions or smaller carts |
| Conversions dropped | Clicks dropped or CVR dropped? | Traffic problem or conversion problem |
| Clicks dropped | Impressions dropped or CTR dropped? | Reach problem or relevance problem |
| Impressions dropped | Search volume or impression share? | Market shrinkage or competitive loss |

---

## Cadence by Report Type

| **Report** | **Audience** | **Cadence** | **Trigger for ad-hoc** |
|------------|--------------|-------------|------------------------|
| Executive summary | Leadership | Monthly | Major budget decisions, business reviews |
| Performance dashboard | Marketing team | Weekly | None: always available |
| Campaign review | Campaign managers | Weekly | Significant performance shift |
| Diagnostic deep-dive | Specialists | As needed | Performance threshold breach |

**Weekly review structure:**

1. Check primary KPIs vs. targets (2 min)
2. Identify any outliers or trends (3 min)
3. Prioritize one issue for diagnostic analysis (10 min)
4. Document findings and actions (5 min)

> 💡 **Time-box your reviews:** Unlimited data access creates unlimited analysis. Set a fixed time for weekly reviews and stick to it.

---

## Segmentation Strategy

Different segments reveal different insights. Use the right segmentation for the question.

| **Dimension** | **Reveals** | **Use when** |
|---------------|-------------|--------------|
| **Campaign** | Channel/goal-level performance | Allocating budget across strategies |
| **Ad group** | Targeting/intent-level performance | Optimizing within a campaign |
| **Device** | Mobile vs. desktop behavior differences | Landing page or bid adjustments |
| **Location** | Geographic performance variance | Local campaigns or regional differences |
| **Time** | Day/hour performance patterns | Ad scheduling decisions |
| **Audience** | Segment-level value differences | Bid adjustments or exclusions |
| **Search term** | Intent alignment and waste | Negative keyword management |
| **Network** | Search vs. Partners vs. Display | Network exclusion decisions |

**Segmentation rules:**

1. **Start broad, narrow only when needed:** Account → Campaign → Ad group → Keyword
2. **Segment by one dimension at a time:** Device + Location + Day is too granular to act on
3. **Sufficient data rule:** 100+ conversions or 30 days minimum before trusting segment-level data

---

## Attribution Considerations

Google Ads reports attribution-based data. Understand the implications.

| **Attribution model** | **Behavior** | **Best for** |
|----------------------|--------------|--------------|
| **Data-driven** | Distributes credit based on actual contribution | Most accounts (default) |
| **Last click** | 100% credit to final touchpoint | Understanding closing performance |

**Critical attribution rules:**

1. **Same model across reports:** Comparing campaigns with different attribution is meaningless
2. **Conversion lag exists:** New campaigns need 7-14 days before conversion data is reliable
3. **Google Ads ≠ Reality:** Cross-platform attribution will never match backend data exactly
4. **Trend over time matters more than absolute numbers:** If attribution is consistent, trends are valid even if totals aren't

> ⚠️ **Attribution is a model, not truth:** No attribution model is "correct". Use it consistently for comparison, but always validate with backend revenue data.

---

## Report Formatting Principles

Good formatting turns data into decisions. Bad formatting creates confusion.

| **Principle** | **Do** | **Don't** |
|---------------|--------|-----------|
| **Hierarchy** | Primary KPIs first, supporting metrics below | Dump all metrics in alphabetical order |
| **Comparison** | Show vs. target, vs. previous period | Show raw numbers without context |
| **Visualization** | Use charts for trends, tables for details | Use charts for everything |
| **Actionability** | Include "what this means" annotations | Present data without interpretation |
| **Consistency** | Same metrics, same order, same format | Change format every report |

**Table formatting:**

| Good | Bad |
|------|-----|
| Round to whole numbers or 2 decimals | Show 8 decimal places |
| Use consistent currency symbols | Mix $ and "dollars" |
| Align numbers right, text left | Center everything |
| Highlight outliers (color or bold) | No visual hierarchy |

---

## Common Reporting Mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| **Data dumping** | Too much data, no insight | Limit to 5-7 key metrics per report |
| **No comparison** | "We got 500 conversions" means nothing alone | Always show vs. target and vs. previous |
| **Wrong cadence** | Daily reports create noise, monthly reports miss problems | Match cadence to decision frequency |
| **Vanity metrics** | Impressions without context looks impressive but means nothing | Focus on metrics that drive decisions |
| **Missing context** | "CPA increased 20%" without explanation creates panic | Add annotations for known factors |
| **Over-segmentation** | Device + location + audience + day = no statistical validity | Segment one dimension at a time |
| **Ignoring lag** | Judging yesterday's campaign by today's conversions | Wait for conversion lag before judging |

---

## Key Principles

1. **Reports serve decisions, not data storage:** If a metric doesn't inform an action, remove it.
2. **Match the report to the audience:** Executives need outcomes. Specialists need details.
3. **Three report types cover everything:** Performance (are we winning?), Trend (where are we heading?), Diagnostic (why is this happening?).
4. **Trace upstream for root causes:** When revenue drops, trace back through conversions, clicks, impressions to find the source.
5. **Consistency enables comparison:** Same metrics, same attribution, same format every time.
6. **Time-box analysis:** Set limits on how long you spend in reports. Diminishing returns hit fast.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Foundation: defines which KPIs to track |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference: metric definitions and calculations |
| [Custom Columns Reference](../references/Custom Columns Reference.md) | Reference: custom metric formulas |
| [Reporting Quality Checklist](../checklists/Reporting Quality Checklist.md) | Validation: checklist for report setup |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Execution: weekly review process |

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
