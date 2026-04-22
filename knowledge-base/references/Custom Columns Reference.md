# Custom Columns Reference
Created: 2026-02-05

Support_ID: CHEATSHEET_43
Status: Done
Category: Operational
Reference Type: Cheat Sheet
Agent_Readable: Yes
Human_Facing: Yes
Domain: Reporting
Pillar: 0

## Purpose

Documents custom column formulas, syntax, and common use cases for creating calculated metrics in Google Ads reports and dashboards.

---

## What this is / What this is NOT

**This reference:**

- Provides custom column formula syntax and functions
- Lists common custom column recipes by use case
- Documents formula limitations and rules
- Explains custom column scope and availability

**This reference does NOT:**

- Define standard Google Ads metrics (See: [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md))
- Explain which KPIs to choose (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))

---

## 1️⃣ Formula Syntax

### Basic operators

| **Operator** | **Function** | **Example** |
|--------------|--------------|-------------|
| `+` | Addition | `Clicks + Impressions` |
| `-` | Subtraction | `Conversion value - Cost` |
| `*` | Multiplication | `Conversions * 100` |
| `/` | Division | `Cost / Conversions` |
| `( )` | Grouping | `(Conversion value - Cost) / Cost` |

### Available metrics

Custom columns can reference any standard Google Ads metric. Common ones:

| **Category** | **Available metrics** |
|--------------|-----------------------|
| **Traffic** | Impressions, Clicks, CTR |
| **Cost** | Cost, Avg. CPC |
| **Conversions** | Conversions, All conv., Conversion value, All conv. value |
| **Competitive** | Search impr. share, Search lost IS (budget), Search lost IS (rank) |

### Metric naming in formulas

Formula metric names differ from the abbreviated display names shown in the Google Ads interface:

| **Display name (UI)** | **In formula** |
|-----------------------|----------------|
| Conversions | `Conversions` |
| Conv. value | `Conversion value` |
| All conv. | `All conversions` |
| All conv. value | `All conversion value` |
| Cost | `Cost` |
| Clicks | `Clicks` |
| Avg. CPC | `Avg. CPC` |
| Search impr. share | `Search impr. share` |
| Search lost IS (budget) | `Search lost IS (budget)` |
| Search lost IS (rank) | `Search lost IS (rank)` |

> ⚠️ **Some formula names differ from UI:** Conversion metrics use expanded names in formulas (e.g., "All conversions" not "All conv".), but competitive metrics stay the same (e.g., "Search impr. share").

---

## 2️⃣ Common Formulas

### Efficiency metrics

**Cost per 1,000 impressions (CPM):**
```
(Cost / Impressions) * 1000
```

**Revenue per click:**
```
Conversion value / Clicks
```
Shows average value generated per click.

**Revenue per impression:**
```
(Conversion value / Impressions) * 1000
```
Revenue per 1,000 impressions.

**Value per conversion:**
```
Conversion value / Conversions
```
Average order value or lead value.

### Goal tracking metrics

Track performance against your targets. See [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) for how to set appropriate targets.

**Efficiency targets:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| CPA vs. target | `(Cost / Conversions) - [target]` | Gap to CPA target (negative = beating target) |
| ROAS vs. target | `(Conversion value / Cost) - [target]` | Gap to ROAS target (negative = below target) |

**Growth targets:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Conversions vs. target | `Conversions - [target]` | Gap to conversion volume target |
| Conversion value vs. target | `Conversion value - [target]` | Gap to revenue target |

> ⚠️ **Replace `[target]` with your actual target values:** These formulas show the gap between actual performance and your targets.

### Competitive metrics

**Impression share opportunity:**
```
Impressions / Search impr. share
```
Total available impressions in the market.

**Lost impressions (total):**
```
(Impressions / Search impr. share) - Impressions
```
Impressions lost to budget and rank combined.

### Lost opportunity metrics

Use these formulas to quantify the cost of not capturing full impression share.

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Total eligible impressions | `Impressions / Search impr. share` | Market size |
| Lost impressions (budget) | `(Impressions / Search impr. share) * Search lost IS (budget)` | Budget-limited loss |
| Lost impressions (rank) | `(Impressions / Search impr. share) * Search lost IS (rank)` | Rank-limited loss |
| Potential clicks | `(Impressions / Search impr. share) * CTR` | Clicks at 100% IS |
| Lost clicks | `((Impressions / Search impr. share) - Impressions) * CTR` | Missed clicks |
| Potential conversions | `((Impressions / Search impr. share) * CTR) * (Conversions / Clicks)` | Conversions at 100% IS |
| Lost conversions | `(((Impressions / Search impr. share) - Impressions) * CTR) * (Conversions / Clicks)` | Missed conversions |
| Lost revenue | `(((Impressions / Search impr. share) - Impressions) * CTR * (Conversions / Clicks)) * (Conversion value / Conversions)` | Missed revenue |
| Incremental budget needed | `((Impressions / Search impr. share) * Search lost IS (budget)) * (Cost / Impressions)` | Budget gap estimate |

> 💡 **Use lost revenue to justify budget increases:** Show stakeholders the revenue left on the table due to budget constraints.

### Budget and pacing metrics

Use these formulas to track spend against targets and project end-of-period results.

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Daily spend rate | `Cost / 7` | Average daily spend (adjust divisor for date range) |
| Budget utilization | `Cost / [budget] * 100` | Percentage of budget used |
| Projected month spend | `(Cost / [days_elapsed]) * 30` | Month-end projection |
| Spend vs. plan | `Cost - [planned_spend]` | Variance to plan |
| Days of budget remaining | `([budget] - Cost) / (Cost / [days_elapsed])` | Runway estimate |
| Week-over-week spend change | `(Cost - Cost.date_range(prev_7_days)) / Cost.date_range(prev_7_days)` | Spend trend |

> ⚠️ **Replace bracketed values with constants:** Google Ads does not expose budget as a formula variable. Replace `[budget]`, `[days_elapsed]`, and `[planned_spend]` with your actual numbers.

---

## 3️⃣ Formula Rules and Limitations

### Division by zero

| **Scenario** | **Result** | **Handling** |
|--------------|------------|--------------|
| Dividing by zero | Error or blank | Google handles automatically |
| Dividing by null | Blank | No error, just no data |

> 💡 **Google handles divide-by-zero gracefully:** If Conversions = 0, CPA shows as "--" not an error.

### Data type rules

| **Rule** | **Details** |
|----------|-------------|
| Numeric only | Custom columns work only with numeric metrics |
| No text | Cannot use text fields (campaign name, etc.) |
| No conditions | Cannot use IF/THEN logic |
| No lookups | Cannot reference other custom columns |

### Formatting options

| **Format** | **When to use** | **Example output** |
|------------|-----------------|-------------------|
| Number | Raw values | 1,234.56 |
| Currency | Money values | €1,234.56 |
| Percentage | Ratios | 12.34% |

### Availability

| **Level** | **Custom columns available** |
|-----------|------------------------------|
| Account | Yes |
| Campaign | Yes |
| Ad group | Yes |
| Keyword | Yes |
| Ad | Yes |
| Search term | Yes |

---

## 4️⃣ Custom Column Recipes by Goal

### For ecommerce

**Profitability metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Gross profit | `Conversion value - Cost` | Basic profitability |
| Profit after COGS | `(Conversion value * 0.6) - Cost` | True profitability (adjust margin) |
| POAS (Profit on Ad Spend) | `((Conversion value * 0.6) - Cost) / Cost` | Profit-based efficiency |
| AOV | `Conversion value / Conversions` | Average order value |
| Revenue per click | `Conversion value / Clicks` | Traffic value |
| Break-even ROAS check | `Conversion value / Cost - 2.5` | Distance from break-even (adjust target) |

> ⚠️ **These are estimates, not actual profitability:** The best approach is to import actual profit data using a tool like ProfitMetrics. If that's not feasible, these formulas can serve as rough estimates, but take them with a big grain of salt: they assume uniform margins across products and don't account for returns, shipping costs, or other variables.

**Funnel stage metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Add to cart | `All_conversions.conversion_action("Add to Cart")` | Cart additions |
| Begin checkout | `All_conversions.conversion_action("Begin Checkout")` | Checkout starts |
| Purchases | `All_conversions.conversion_action("Purchase")` | Completed transactions |

**Traffic quality ratios:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Cart rate | `All_conversions.conversion_action("Add to Cart") / Clicks` | Click to cart percentage |
| Checkout rate | `All_conversions.conversion_action("Begin Checkout") / All_conversions.conversion_action("Add to Cart")` | Cart to checkout percentage |
| Purchase rate | `All_conversions.conversion_action("Purchase") / All_conversions.conversion_action("Begin Checkout")` | Checkout to purchase percentage |
| Full funnel rate | `All_conversions.conversion_action("Purchase") / Clicks` | Click to purchase percentage |

**Abandonment metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Cart abandonment | `1 - (All_conversions.conversion_action("Purchase") / All_conversions.conversion_action("Add to Cart"))` | Lost carts percentage |
| Checkout abandonment | `1 - (All_conversions.conversion_action("Purchase") / All_conversions.conversion_action("Begin Checkout"))` | Lost checkouts percentage |

**Value-based metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Purchase value | `All_conversion_value.conversion_action("Purchase")` | Total purchase revenue |
| Purchase ROAS | `All_conversion_value.conversion_action("Purchase") / Cost` | Revenue efficiency |
| Revenue per session | `All_conversion_value.conversion_action("Purchase") / Clicks` | Session value |
| Revenue per cart | `All_conversion_value.conversion_action("Purchase") / All_conversions.conversion_action("Add to Cart")` | Cart value potential |

> 💡 **When to use these formulas:** Purchase value and Purchase ROAS are only relevant when you're optimizing toward micro-conversions (like add-to-cart) and macro conversion value data isn't in your regular conversion columns. If you're optimizing toward purchases directly, use the standard Conversion value and ROAS columns instead.

### For lead generation

**Funnel stage metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Raw leads | `All_conversions.conversion_action("Form Submission")` | Total form submissions |
| MQL count | `All_conversions.conversion_action("MQL")` | Marketing qualified leads |
| SQL count | `All_conversions.conversion_action("SQL")` | Sales qualified leads |
| Closed deals | `All_conversions.conversion_action("Closed Deal")` | Won customers |

**Funnel ratio metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| MQL rate | `All_conversions.conversion_action("MQL") / All_conversions.conversion_action("Form Submission")` | Lead to MQL percentage |
| SQL rate | `All_conversions.conversion_action("SQL") / All_conversions.conversion_action("MQL")` | MQL to SQL percentage |
| Close rate | `All_conversions.conversion_action("Closed Deal") / All_conversions.conversion_action("SQL")` | SQL to close percentage |
| Full funnel rate | `All_conversions.conversion_action("Closed Deal") / All_conversions.conversion_action("Form Submission")` | Lead to close percentage |

**Cost per stage metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Cost per lead | `Cost / All_conversions.conversion_action("Form Submission")` | Lead acquisition cost |
| Cost per MQL | `Cost / All_conversions.conversion_action("MQL")` | MQL acquisition cost |
| Cost per SQL | `Cost / All_conversions.conversion_action("SQL")` | SQL acquisition cost |
| Cost per closed deal | `Cost / All_conversions.conversion_action("Closed Deal")` | True CAC |

**Value-based metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Closed deal value | `All_conversion_value.conversion_action("Closed Deal")` | Total closed revenue |
| Closed deal ROAS | `All_conversion_value.conversion_action("Closed Deal") / Cost` | Revenue efficiency on closed deals |
| Avg closed deal value | `All_conversion_value.conversion_action("Closed Deal") / All_conversions.conversion_action("Closed Deal")` | Average deal size |

> ⚠️ **Requires offline conversion import:** Replace "Form Submission", "MQL", "SQL", and "Closed Deal" with your actual conversion action names. Funnel stage data requires offline conversion tracking.

### For SaaS

**Funnel stage metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Signups | `All_conversions.conversion_action("Signup")` | Account creations |
| Trial starts | `All_conversions.conversion_action("Trial Start")` | Trial activations |
| Paid conversions | `All_conversions.conversion_action("Paid Subscription")` | Paying customers |

**Funnel ratio metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Signup to trial rate | `All_conversions.conversion_action("Trial Start") / All_conversions.conversion_action("Signup")` | Activation rate |
| Trial to paid rate | `All_conversions.conversion_action("Paid Subscription") / All_conversions.conversion_action("Trial Start")` | Conversion rate |
| Full funnel rate | `All_conversions.conversion_action("Paid Subscription") / All_conversions.conversion_action("Signup")` | Signup to paid percentage |

**Cost per stage metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Cost per signup | `Cost / All_conversions.conversion_action("Signup")` | Signup acquisition cost |
| Cost per trial | `Cost / All_conversions.conversion_action("Trial Start")` | Trial acquisition cost |
| Cost per paid | `Cost / All_conversions.conversion_action("Paid Subscription")` | True CAC |

**Value-based metrics:**

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Subscription value | `All_conversion_value.conversion_action("Paid Subscription")` | Total subscription revenue |
| Subscription ROAS | `All_conversion_value.conversion_action("Paid Subscription") / Cost` | Revenue efficiency on paid conversions |
| Avg subscription value | `All_conversion_value.conversion_action("Paid Subscription") / All_conversions.conversion_action("Paid Subscription")` | Average first payment |
| Estimated LTV:CAC | `([LTV] * [trial_to_paid_rate]) / (Cost / All_conversions.conversion_action("Trial Start"))` | Unit economics ratio |

> ⚠️ **Replace bracketed values with constants:** Replace `[LTV]` and `[trial_to_paid_rate]` with your actual values. Replace "Signup", "Trial Start", and "Paid Subscription" with your actual conversion action names.

### For competitive analysis

| **Metric** | **Formula** | **Purpose** |
|------------|-------------|-------------|
| Market size (impressions) | `Impressions / Search impr. share` | Total available impressions |
| Lost impression volume | `(Impressions / Search impr. share) - Impressions` | Impressions you're missing |
| Share of voice proxy | `Clicks / (Clicks / Search impr. share)` | Estimated click share |

> ⚠️ **Take market size metrics with a grain of salt:** Search impr. share only measures impressions your ads received compared to the total impressions your ads could get based on your current keyword targeting. If you add more keywords or switch match types (e.g., from phrase to broad match), your "market" automatically becomes bigger. These metrics reflect your reach within your targeting, not total market demand.

---

## 5️⃣ Creating Custom Columns

### Steps to create

1. Go to Campaigns view
2. Click "Columns" > "Modify columns"
3. Click "Custom columns" > "+ Custom column"
4. Enter name, description, formula
5. Select format (number, currency, percentage)
6. Save and add to view

### Naming conventions

| **Format** | **Example** | **Rationale** |
|------------|-------------|---------------|
| `[Metric] (custom)` | `Profit (custom)` | Distinguishes from standard |
| `[Metric] vs. Target` | `CPA vs. Target` | Clear purpose |
| `[Metric] with [adjustment]` | `Profit with COGS` | Shows what's included |

### Organization tips

| **Tip** | **Details** |
|---------|-------------|
| Group related columns | Create profit, margin, ROI together |
| Document formulas | Keep a reference sheet of all custom columns |
| Use descriptions | Google Ads has a description field: use it |
| Test before sharing | Verify calculations at known data points |

---

## 6️⃣ Troubleshooting

### Common issues

| **Issue** | **Cause** | **Fix** |
|-----------|-----------|---------|
| Column shows "--" | Divide by zero or no data | Expected behavior when denominator is 0 |
| Numbers look wrong | Metric naming mismatch | Verify exact metric name spelling |
| Column not appearing | Not added to current view | Add column via "Modify columns" |
| Values differ from expected | Attribution model differences | Ensure using same conversion actions |

### Validation approach

1. Create custom column
2. Find a campaign with known values
3. Calculate expected result manually
4. Compare to custom column output
5. Adjust formula if needed

---

## Decision Guide: Which Custom Column?

```
What do you need to measure?
│
├─ Profitability?
│   ├─ Basic: Profit = Conversion value - Cost
│   └─ True: POAS = ((Conversion value * margin) - Cost) / Cost
│
├─ Efficiency vs. target?
│   ├─ CPA target: (Cost / Conversions) - target
│   └─ ROAS target: (Conversion value / Cost) - target
│
├─ Traffic value?
│   ├─ Per click: Conversion value / Clicks
│   └─ Per impression: (Conversion value / Impressions) * 1000
│
├─ Funnel quality?
│   ├─ Lead Gen: MQL rate, SQL rate, close rate, cost per stage
│   ├─ SaaS: Signup to trial, trial to paid, cost per stage
│   └─ Ecommerce: Cart rate, checkout rate, abandonment rates
│
├─ Budget pacing?
│   ├─ Current: Budget utilization = Cost / [budget] * 100
│   ├─ Projected: (Cost / [days_elapsed]) * 30
│   └─ Runway: ([budget] - Cost) / (Cost / [days_elapsed])
│
├─ Lost opportunity?
│   ├─ Volume: Lost impressions, lost clicks
│   ├─ Conversions: Lost conversions at current CVR
│   └─ Revenue: Lost revenue based on lost conversions
│
└─ Competitive position?
    ├─ Market size: Impressions / Search impr. share
    └─ Lost volume: (Impressions / Search impr. share) - Impressions
```

---

## Related Documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Foundation: standard metric definitions |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Framework: which metrics matter |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Framework: reporting approach |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Foundation: margin and COGS inputs |

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
