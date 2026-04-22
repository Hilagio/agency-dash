# Shopping Product Performance Reference
Created: 2026-02-14

Support_ID: REFERENCE_44
Status: Done
Category: Shopping
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Shopping
Pillar: 6

## Purpose

Documents product-level performance metrics, competitiveness insights, segmentation strategies, and optimization levers for Shopping campaigns. Use this reference to diagnose underperforming products, prioritize optimization efforts, and build performance-based campaign structures.

---

## What this reference is / what this is NOT

**This reference:**

- Documents product-level metrics and where to find them
- Explains GMC competitiveness insights and how to interpret them
- Details product title impact analysis and sale price mechanics
- Provides product group structure analysis and catch-all spend diagnostics
- Covers Shopping search term relevance assessment and negative keyword strategy
- Documents performance tier shift detection and label update cadence

**This reference does NOT:**

- Explain product feed attributes or syntax (See: [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md))
- Provide feed quality prioritization frameworks (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- List segmentation implementation tactics (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md))
- Explain campaign structure decisions (See: [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md))

---

## Quick reference: product-level metrics

| **Metric** | **What it measures** | **Where to find** | **Minimum data** |
|------------|---------------------|-------------------|-----------------|
| Impressions | Product visibility in Shopping auctions | Google Ads > Products tab | 7 days |
| Clicks | Product engagement from Shopping listings | Google Ads > Products tab | 14 days |
| CTR | Title and image quality signal | Calculated (clicks / impressions) | 100+ impressions |
| Cost | Spend allocated to a specific product | Google Ads > Products tab | 14 days |
| Conversions | Product sales attributed to Shopping ads | Google Ads > Products tab | 30 days |
| ROAS | Revenue generated per ad euro spent | Calculated (conv. value / cost) | 30 days + 10 conversions |
| Click share | Competitive visibility vs. eligible auctions | Google Ads > Products tab | 14 days |

> 💡 **Wait for sufficient data before making product-level decisions:** Acting on 3 days of data leads to false conclusions. Use the minimum data windows above as hard gates.

---

## Product-level metrics breakdown

### Impressions

Impressions measure how often a product appears in Shopping results. Low impressions indicate one or more of these problems:

| **Cause** | **Diagnosis** | **Fix** |
|-----------|---------------|---------|
| Poor title relevance | Product not matching search queries | Rewrite title with high-volume search terms |
| Low bid or budget | Campaign is budget-constrained | Increase bid or daily budget |
| Low product data quality | Missing attributes or disapprovals | Fix feed errors in Merchant Center |
| High competition | Competitors outbidding on same products | Improve title, price, or bid |
| Feed processing delay | Product not yet indexed | Wait 24-48 hours after feed submission |

### Clicks and CTR

CTR is the primary signal for title and image effectiveness. A product with high impressions but low CTR needs creative attention, not bid changes.

| **CTR range** | **Interpretation** | **Action** |
|---------------|-------------------|------------|
| Above 2% | Strong performance | Protect: maintain current title and image |
| 1-2% | Average performance | Test: try title variations, check image quality |
| Below 1% | Weak performance | Prioritize: rewrite title, upgrade image, check price |
| 0% (with impressions) | Critical issue | Diagnose: price too high, image broken, or wrong product match |

> 💡 **CTR benchmarks vary by category:** Fashion products typically see higher CTRs than industrial supplies. Compare within your own product categories, not across them.

### Conversions and ROAS

Conversions require the longest data window because purchase events are sparse at the product level. A product with 500 clicks and 0 conversions over 30 days tells you something. A product with 15 clicks and 0 conversions tells you nothing.

| **Scenario** | **Data requirement** | **Conclusion** |
|--------------|---------------------|----------------|
| 10+ conversions, ROAS above target | 30 days | Profitable: scale budget |
| 10+ conversions, ROAS below target | 30 days | Unprofitable: reduce bids or fix pricing |
| 1-9 conversions | 30 days | Insufficient: extend data window to 60 days |
| 0 conversions, 100+ clicks | 30 days | Likely unprofitable: investigate landing page, price, relevance |
| 0 conversions, under 100 clicks | 30 days | No conclusion: need more data |

### Click share

Click share reveals competitive headroom. A product with 30% click share has 70% more potential visibility available.

| **Click share** | **Meaning** | **Action** |
|---------------------|-------------|------------|
| Above 80% | Dominant position | Maintain: product is well-positioned |
| 50-80% | Competitive but room to grow | Increase bids for profitable products |
| 20-50% | Losing significant volume | Review bids, budget, and product data quality |
| Below 20% | Barely visible | Diagnose: likely a bid, budget, or data quality problem |

---

## GMC competitiveness insights

Google Merchant Center provides competitive intelligence at Merchant Center > Analytics > Competitiveness. Google compares your product prices against other retailers selling the same or similar products.

### Price competitiveness

| **Tier** | **Meaning** | **Implication** |
|----------|-------------|-----------------|
| Low price | Cheapest third of retailers | Strong competitive advantage, expect higher CTR |
| Average price | Middle third of retailers | Neutral position, other factors determine performance |
| High price | Most expensive third of retailers | Competitive disadvantage, compensate with better titles, images, or brand strength |

### Benchmark price data

| **Data point** | **What it shows** | **Use for** |
|----------------|-------------------|-------------|
| Benchmark price | Average price across competitors for the same product | Identify overpriced and underpriced products |
| Price difference | Gap between your price and benchmark | Prioritize pricing adjustments |
| Currency | Local currency of comparison | Ensure apples-to-apples comparison |

### Click potential

| **Data point** | **What it shows** | **Use for** |
|----------------|-------------------|-------------|
| Estimated additional clicks | Clicks available at lower price points | Quantify the revenue opportunity from price reductions |
| Price change scenarios | Impact of specific price adjustments | Build business cases for pricing changes |

> 💡 **Competitiveness data is available only for products with GTINs:** Products without GTINs cannot be matched to competitors. Submit GTINs for all products that have them.

---

## Product title impact analysis

The product title is the single most impactful lever for Shopping impression volume and CTR. Title changes directly affect which queries match your products and how users perceive your listings.

### Title impact measurement

| **Metric** | **How to measure** | **Timeframe** |
|------------|-------------------|---------------|
| Impression change | Compare impressions before vs. after title change | Allow 7-14 days post-change |
| CTR change | Compare CTR before vs. after | Allow 14 days with 100+ impressions |
| Click volume change | Compare total clicks before vs. after | Allow 14 days |
| Query coverage | Review search terms report for new matching queries | Allow 7-14 days |

### Title optimization priority

Optimize titles in order of business impact:

| **Priority** | **Product segment** | **Rationale** |
|-------------|-------------------|---------------|
| 1 | Best sellers | Highest ROI from improvement: more clicks on already-converting products |
| 2 | High-impression low-CTR | Already getting visibility: title improvement converts impressions to clicks |
| 3 | Rising products | Accelerate growth trajectory with better query matching |
| 4 | Zero-click products | May unlock hidden demand if title is the bottleneck |
| 5 | Unprofitable products | Fix title only after confirming price and landing page are not the problem |

### Key title elements

| **Element** | **Position** | **Impact** |
|-------------|-------------|------------|
| Brand | Front of title | Trust signal, brand query matching |
| Product type | After brand | Core query matching |
| Key attribute | After product type | Specificity (color, size, material) |
| Differentiator | End of title | Competitive distinction (quantity, model number) |

> 💡 **Test one variable at a time:** Change brand position OR add a color attribute, not both. Otherwise you cannot attribute the performance change.

---

## Sale price and price drop badge mechanics

The price drop badge (strikethrough pricing) is a powerful CTR lever. Google displays a crossed-out original price next to the sale price when specific conditions are met.

### Badge eligibility requirements

| **Requirement** | **Details** |
|----------------|-------------|
| Stable base price | Base price must remain consistent for 45-60 days before the sale |
| Sale price attribute | Submit sale price via the `sale_price` feed attribute |
| Meaningful discount | Typically 15%+ off base price (Google does not publish exact threshold) |
| Historical price validation | Google compares against crawled price history: you cannot fake a base price |
| Landing page match | Sale price in feed must match the price shown on the landing page |

### Badge impact

| **Metric** | **Typical impact** |
|------------|-------------------|
| CTR lift | 20-40% increase in click-through rate |
| Conversion rate | 10-20% increase (price-sensitive shoppers) |
| Impression volume | Moderate increase (Google favors competitive offers) |

### Common mistakes with sale pricing

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Setting sale price as base price | No strikethrough, no badge, Google sees it as regular price | Use `price` for base and `sale_price` for discount |
| Changing base price frequently | Resets the 45-60 day clock, badge never triggers | Keep base price stable, use `sale_price` for promotions |
| Discount too small | Google may not display badge for marginal discounts | Ensure discount is meaningful (aim for 15%+) |
| Missing `sale_price_effective_date` | Sale runs indefinitely, erodes base price perception | Set explicit start and end dates for all sales |

### First-party sales data integration

Layer internal business data into custom labels via supplemental feeds. Common data sources: ERP margin data (update weekly), POS sales velocity (update weekly), inventory levels (update daily), and seasonal calendars (update monthly). Each data source maps to a custom label dimension for campaign-level control.

> 💡 **Supplemental feeds are the bridge between your internal data and Google Ads:** Every piece of business intelligence you encode in custom labels gives you finer campaign control.

---

## Product group structure analysis

Product group structure determines how granularly you can control bids, budgets, and performance analysis. Poor structure hides problems inside catch-all groups.

### Listing group hierarchy

| **Level** | **Subdivide by** | **When to use** |
|-----------|-----------------|-----------------|
| Level 1 | Product type or Category | Always: separates fundamentally different product lines |
| Level 2 | Brand | When you carry multiple brands with different margins or competitiveness |
| Level 3 | Custom label (performance tier) | When you use hero/sidekick/villain/zombie segmentation |
| Level 4 | Item ID | Only for top sellers that justify individual bid control |

> 💡 **Stop subdividing when a group has fewer than 30 clicks in 30 days:** Below this threshold, the data is too sparse for meaningful performance analysis or bid differentiation.

### Catch-all spend analysis

The "Everything else" group in each product group tree captures all products not explicitly subdivided. High catch-all spend means you are bidding blindly on a large portion of your catalog.

| **Catch-all spend share** | **Interpretation** | **Action** |
|---------------------------|-------------------|------------|
| Below 10% | Well-structured | Maintain: structure covers the catalog effectively |
| 10-30% | Acceptable | Review: check if high-spend products in the catch-all deserve their own group |
| 30-50% | Under-structured | Subdivide: identify the top-spending products in the catch-all and break them out |
| Above 50% | Poorly structured | Restructure: the majority of spend has no granular control |

To measure catch-all spend share: filter the Products tab by listing group, identify "Everything else" groups, and divide their cost by total campaign cost.

### Granularity assessment

Subdivide further when:
- A product group contains products with significantly different margins (>20pp difference)
- A product group mixes best sellers with slow movers
- You cannot identify which products drive conversions within the group

Do not subdivide further when:
- The resulting groups would have fewer than 30 clicks per 30 days
- All products in the group have similar performance profiles
- You are using Smart Bidding (which optimizes at the query level regardless of group structure)

> ↪️ **Product group settings and structure options:** See [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md)

> ↪️ **Segmentation tactics and custom label patterns:** See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md)

---

## Shopping search term relevance

Shopping campaigns do not use keyword targeting. Google matches search queries to your products based on product data (titles, descriptions, categories, attributes). This means irrelevant traffic is controlled through negative keywords and feed quality, not keyword selection.

### Assessing query relevance

Pull the search terms report for Shopping campaigns (Google Ads > Campaigns > Insights and reports > Search terms). Filter by campaign type: Shopping or PMax (Shopping channel).

| **Query pattern** | **Why it appears** | **Typical waste** |
|-------------------|--------------------|-------------------|
| Competitor brand names | Product titles or descriptions mention competitors, or Google matches broadly | Medium to high |
| "How to" / "what is" / informational | Product titles contain terms that match informational intent | Medium |
| "Reviews" / "best" / comparison | Google matches product listings to research queries | Low to medium |
| Completely unrelated terms | Poor feed data quality or overly broad product descriptions | High |
| "Free" / "cheap" / "DIY" | Product descriptions or titles trigger low-intent matches | Medium |

### Irrelevant spend threshold

Calculate the percentage of Shopping campaign spend going to irrelevant search terms:

1. Export the search terms report for the last 30 days
2. Flag queries that are clearly irrelevant to the product being shown
3. Sum the cost of flagged queries and divide by total campaign cost

| **Irrelevant spend share** | **Verdict** | **Action** |
|---------------------------|-------------|------------|
| Below 3% | Healthy | Monitor: review monthly |
| 3-5% | Elevated | Act: add negative keywords for the top waste patterns |
| Above 5% | Excessive | Prioritize: systematic negative keyword build, review feed data quality |

### Shopping-specific negative keyword strategy

- Apply negatives at the campaign level for broad irrelevant categories (informational queries, competitor brands)
- Use shared negative keyword lists for patterns that apply across all Shopping campaigns
- Review the search terms report bi-weekly during stable periods, weekly during seasonal peaks
- Focus on patterns, not individual queries: if "how to install [product]" appears repeatedly, negate "how to" at the campaign level

> ↪️ **Negative keyword management:** See [Negative Keyword Reference](../references/Negative Keyword Reference.md)

> ↪️ **Search term analysis workflow:** See [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md)

---

## Performance tier shift detection

Custom labels used for hero/sidekick/villain/zombie segmentation reflect performance at the time of labeling. Product performance changes over time due to seasonality, price changes, competitor activity, and inventory shifts. Labels that do not match current performance cause budget misallocation: "Hero" budgets flow to products that now perform as "Villains," and genuine new heroes remain trapped in lower-priority segments.

### Detecting tier mismatches

Compare each product's current 30-day performance against the criteria used when its label was assigned:

| **Current label** | **Actual performance (30 days)** | **Mismatch type** | **Impact** |
|-------------------|----------------------------------|-------------------|------------|
| Hero | ROAS below campaign average, low conversion volume | Demoted hero | Budget wasted on underperformer |
| Villain | ROAS above campaign average, growing conversion volume | Promoted villain | Missed scaling opportunity |
| Zombie | Generating clicks and conversions | Awakened zombie | Conversions trapped in low-priority segment |
| Sidekick | Zero impressions or zero clicks | Dormant sidekick | No impact, but label is inaccurate |

### Update frequency

| **Account spend** | **Recommended update cadence** | **Rationale** |
|-------------------|-------------------------------|---------------|
| Above 10K/month | Weekly | High spend amplifies misallocation cost |
| 3K-10K/month | Bi-weekly | Balanced effort vs. accuracy |
| Below 3K/month | Monthly | Limited data makes frequent updates noisy |

### Automation options

- **Supplemental feed with scheduled refresh:** Update custom labels via a supplemental feed connected to a spreadsheet or script that recalculates tiers on the chosen cadence
- **Google Ads Scripts:** Automate tier recalculation based on ROAS and conversion thresholds
- **Third-party tools:** ProductHero, ProfitMetrics, or similar tools that recalculate tiers automatically

> 💡 **Always recalculate tiers after seasonal events:** Performance during Black Friday or other peaks distorts tier assignments. Run a tier refresh 2-3 weeks after the peak ends, using post-peak data only.

> ↪️ **Tier definitions and segmentation framework:** See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md)

> ↪️ **Performance Quadrant Classification logic:** See [Diagnostic Logic Patterns Reference](../references/Diagnostic Logic Patterns Reference.md)

> ↪️ **Tier setup procedure:** See [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md)

---

## Decision guide: which action for which product?

```
Product has 0 impressions after 30 days?
|
+-- YES --> Check: Is product disapproved in Merchant Center?
|           |
|           +-- YES --> Fix disapproval (feed errors, policy violations)
|           |
|           +-- NO --> Rewrite title with high-volume search terms
|
+-- NO --> Product has impressions but 0 clicks?
           |
           +-- YES --> Check price competitiveness in GMC
           |           |
           |           +-- High price --> Adjust pricing or accept low CTR
           |           |
           |           +-- Competitive price --> Improve title and image
           |
           +-- NO --> Product has clicks but 0 conversions (100+ clicks)?
                      |
                      +-- YES --> Check landing page and price vs. competitors
                      |
                      +-- NO --> Product has conversions but ROAS below target?
                                 |
                                 +-- YES --> Lower bids or exclude from campaign
                                 |
                                 +-- NO --> Product is profitable: protect and scale
```

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Making decisions on 3 days of data | Statistical noise causes false conclusions | Wait for minimum data windows (7-30 days depending on metric) |
| Treating all products equally | Budget spreads thin across thousands of products | Segment into performance tiers via custom labels, allocate budget accordingly (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md)) |
| Ignoring zero-click products | Dead weight in your feed drags overall quality | Diagnose and fix or exclude products with zero activity |
| Optimizing unprofitable products before best sellers | Low ROI: fixing losers before protecting winners | Always optimize best sellers first, then work down the priority list |
| Never updating custom labels | Stale labels cause budget misallocation for months | Set a recurring schedule (weekly or bi-weekly) for label updates (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md)) |
| Changing titles and prices simultaneously | Cannot attribute performance changes to either lever | Change one variable at a time, measure impact, then adjust the next |
| Ignoring GMC competitiveness data | Missing easy wins on pricing and positioning | Review competitiveness tab monthly, act on clear pricing gaps |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md) | Feed attribute syntax and requirements |
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Conceptual framework for feed quality prioritization |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Decision framework for catalog segmentation |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Segmentation tactics and custom label patterns |
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Campaign-level configuration for Shopping, product group structure |
| [Merchant Center Reference](../references/Merchant Center Reference.md) | GMC configuration and diagnostics |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Negative keyword management for Shopping search term relevance |
| [Diagnostic Logic Patterns Reference](../references/Diagnostic Logic Patterns Reference.md) | Performance Quadrant Classification logic for tier assignment |
| [Diagnostic Thresholds Reference](../references/Diagnostic Thresholds Reference.md) | Numeric thresholds for product-level diagnostics |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Search term analysis workflow |
| [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) | Tier setup and custom label implementation |

---

## Version details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
