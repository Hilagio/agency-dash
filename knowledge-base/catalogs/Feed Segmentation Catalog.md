# Feed Segmentation Catalog
Created: 2026-02-04

Support_ID: CATALOG_6
Status: Done
Category: Operational
Reference Type: Catalog
Agent_Readable: No
Human_Facing: No
Bucket: Traffic
Applies_To: Ecommerce, PMax
Schema_Version: CAT_v2
Domain: Shopping
Pillar: 6

## Purpose

Lists product feed segmentation tactics for Shopping campaigns (Standard Shopping and Performance Max Feed-only) using custom labels.

---

## What this catalog is / What this is NOT

**This catalog:**

- Lists segmentation tactics and their use cases
- Provides custom label implementation examples
- Explains when each tactic applies

**This catalog does NOT:**

- Provide step-by-step feed setup (See: *SOP – Set Up and Optimize Product Feed*)
- Explain campaign structure decisions (See: *Shopping Campaign Structure Mental Model*)
- Provide tool configuration for performance segmentation (See: *SOP – Set Up Performance-Based Shopping Segmentation*)
- Provide scoring model calculation setup (See: *SOP – Set Up Scoring Model Segmentation*)

---

## Custom label overview

| Label | Feed attribute | Use for |
| --- | --- | --- |
| Label 0 | `custom_label_0` | Primary segmentation (e.g., performance tier) |
| Label 1 | `custom_label_1` | Secondary segmentation (e.g., margin tier) |
| Label 2 | `custom_label_2` | Promotional flags (e.g., on_sale) |
| Label 3 | `custom_label_3` | Inventory status (e.g., low_stock) |
| Label 4 | `custom_label_4` | Seasonal/lifecycle (e.g., summer, new) |

> 💡 **Five custom labels are available (0–4):** The labeling strategy is decided before implementation, starting with one tactic and adding dimensions only as they earn their place.

---

## Tactics by segmentation tier

| Tier | Primary approach | Building blocks (stackable) | Infrastructure |
| --- | --- | --- | --- |
| **Tier 1** | By Category | Bestsellers, Sale, Seasonality, Inventory, Lifecycle, Price Competitiveness | Feed rules only |
| **Tier 2** | By Performance (Hero/Sidekick/Villain/Zombie) | All Tier 1 blocks | Labeling tool required |
| **Tier 3** | By Composite Score | Incorporates multiple variables into unified score | Feed management tool + data pipelines |

> ↪️ **For tier selection guidance and the segmentation framework:** See [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md).

---

## Segmentation tactics

### 1️⃣ By Category (Tier 1)

Products split by product type, each category carrying its own ROAS target.

| Example category | ROAS Target | Rationale |
| --- | --- | --- |
| Electronics | 400% | Low margin, high competition |
| Accessories | 250% | High margin, impulse buys |
| Clearance | 150% | Liquidation priority |

| Use when | Skip when |
| --- | --- |
| Categories have different margins | Single-category store |
| Categories have different audiences | Categories perform similarly |
| Need category-specific targets | Small catalog (<50 SKUs) |

**Update frequency:** Rarely (structural)

---

### 2️⃣ Bestsellers vs. Regular (Tier 1 Building Block)

A two-tier split that separates proven performers from the rest.

| Segment | Criteria | Strategy |
| --- | --- | --- |
| **bestseller** | Top 50 SKUs by units sold (90 days) | Higher budget allocation |
| **regular** | Everything else | Standard optimization |

| Use when | Skip when |
| --- | --- |
| Clear bestsellers exist | Revenue evenly distributed |
| Bestsellers at risk of under-delivery | Already using performance tiers |

**Update frequency:** Monthly

---

### 3️⃣ Sale vs. Regular Price (Tier 1 Building Block)

Promotional products separated from full-price stock for a visibility boost.

| Segment | Feed signal | Strategy |
| --- | --- | --- |
| **on_sale** | `sale_price` populated | Higher budget allocation, maximize visibility |
| **regular_price** | No `sale_price` | Standard optimization |

| Use when | Skip when |
| --- | --- |
| Running time-limited promotions | Always-on pricing |
| Sale items need visibility boost | Site-wide promotions |

**Update frequency:** As promotions change

> When `sale_price` < `price`, Google shows sale badge automatically. Custom labels provide additional segmentation control.

---

### 4️⃣ By Seasonality (Tier 1 Building Block)

Seasonal products separated so budgets track demand cycles.

| Segment | Example products | Active period |
| --- | --- | --- |
| **summer** | Beach, outdoor, warm-weather | Apr–Sep |
| **winter** | Cold-weather, holiday | Oct–Mar |
| **holiday** | Gift-oriented, seasonal decor | Nov–Dec |
| **evergreen** | Year-round relevance | Always |

| Use when | Skip when |
| --- | --- |
| Clear seasonal patterns | Evergreen catalog |
| Fashion, holiday, weather-dependent | Year-round demand |

**Update frequency:** Seasonal

---

### 5️⃣ By Inventory Level (Tier 1 Building Block)

Products split by stock availability so serving tracks fulfillment capacity.

| Segment | Threshold | Strategy |
| --- | --- | --- |
| **high_stock** | >100 units | Push aggressively, clear inventory |
| **normal_stock** | 20–100 units | Standard optimization |
| **low_stock** | <20 units | Reduce budget, monitor |
| **out_of_stock** | 0 units | Exclude from feed |

| Use when | Skip when |
| --- | --- |
| Stock levels vary significantly | Dropship/made-to-order |
| Overselling is problematic | Unlimited inventory |

**Update frequency:** Daily (fast-moving) to Weekly (slow-moving)

---

### 6️⃣ By Lifecycle Stage (Tier 1 Building Block)

Products split by age, which separates launch strategy from clearance.

| Segment | Criteria | Strategy |
| --- | --- | --- |
| **new** | Added <30 days ago | Discovery budget, gather data |
| **core** | 30–180 days, performing | Optimize for efficiency |
| **mature** | 180–365 days | Maintain, watch for decline |
| **end_of_life** | >365 days OR discontinued | Clearance, aggressive discounts |

| Use when | Skip when |
| --- | --- |
| Frequent new product launches | Static catalog |
| Aging products need clearance | No lifecycle patterns |

**Update frequency:** Weekly–Monthly

---

### 7️⃣ By Price Competitiveness (Tier 1 Building Block)

Products split by price position against the market.

| Segment | Criteria | Strategy |
| --- | --- | --- |
| **cheapest** | Lowest price in market | Higher budget: high win rate expected |
| **competitive** | Within 5% of lowest | Standard budget |
| **parity** | 5–15% above lowest | Monitor closely |
| **overpriced** | >15% above lowest | Lower budget OR fix pricing |

| Use when | Skip when |
| --- | --- |
| Competitive market, price-sensitive buyers | Unique products, no competitors |
| Price data available | Brand-driven purchases |

**Update frequency:** Daily–Weekly

**Data sources:** Google Merchant Center Price Competitiveness report, third-party tools (Prisync, Competera)

---

### 8️⃣ By Performance (Tier 2)

Segment products based on historical performance data using a labeling tool that classifies products into Hero, Sidekick, Villain, and Zombie tiers.

> ↪️ **For tier definitions, budget share guidance, bucket strategies by goal, and the tROAS rule:** See [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) (Tier 2 section).

**Custom label implementation:**

| Tier | Custom Label Value | Campaign Treatment |
| --- | --- | --- |
| **Hero** | `custom_label_0 = "hero"` | Largest budget share |
| **Sidekick** | `custom_label_0 = "sidekick"` | Second budget share, promoted to hero when it earns it |
| **Villain** | `custom_label_0 = "villain"` | Restricted budget |
| **Zombie** | `custom_label_0 = "zombie"` | Dedicated budget (force visibility) |

> 💡 **Tool required:** This tactic requires a labeling tool (ProductHero Labelizer or Profitmetrics Shopping Booster) to dynamically classify products and sync labels to your feed.

| Use when | Skip when |
| --- | --- |
| 90+ days of conversion data | New store, insufficient history |
| Clear performance differentiation | All products perform similarly |
| Budget constraints require efficiency | Unlimited budget |
| Tool/script infrastructure available | No tool access or technical resources |

**Update frequency:** Weekly–Monthly (the tool handles classification, thresholds are reviewed monthly)

---

### 9️⃣ By Composite Score (Tier 3)

Multiple variables combined into a single weighted score for unified prioritization.

> ↪️ **For the scoring framework, variable weights, and priority bucket definitions:** See [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) (Tier 3 section).

**Example calculation,** using the variable weights and point scales the mental model defines:

| Variable | Value | Points | Weighted |
| --- | --- | --- | --- |
| Performance | Sidekick | 7 | 2.45 |
| Price Competitiveness | Below Market | 10 | 3.00 |
| Profit Margin | Average | 5 | 1.00 |
| Inventory | High | 10 | 1.50 |
| **Total** |  |  | **7.95** |

Priority buckets by score are defined in [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) (Tier 3 section).

> 💡 **Advanced tactic:** Requires feed management tool (Channable, DataFeedWatch, etc.) to calculate scores and sync to custom labels. Only use when you have reliable data across multiple dimensions.

| Use when | Skip when |
| --- | --- |
| Multiple reliable data sources available | Single dimension sufficient |
| Need unified prioritization across variables | Variables should be treated independently |
| Mature account with stable data pipelines | Data quality uncertain |
| Business-specific weighting required | Standard tactics (performance-only) work |

**Key constraints:**

- No single variable dominates the score, which the mental model's weights already enforce
- Weights move as business priorities change
- Garbage in = garbage out (data quality critical)

**Update frequency:** Continuous (tool calculates), weights reviewed quarterly

---

## Example feed structure

| product_id | title | custom_label_0 | custom_label_1 | custom_label_2 | custom_label_3 |
| --- | --- | --- | --- | --- | --- |
| SKU001 | Oak Dining Table | hero | high_margin | regular_price | normal_stock |
| SKU002 | Walnut Dining Table | sidekick | high_margin | on_sale | low_stock |
| SKU003 | Pine Dining Table | villain | low_margin | regular_price | high_stock |
| SKU004 | Marble Coffee Table | zombie | high_margin | regular_price | normal_stock |
| SKU005 | Glass Side Table | hero | standard_margin | on_sale | normal_stock |

---

## Tactic selection by goal

| Goal | Primary Tactic | Tier |
| --- | --- | --- |
| Category-specific ROAS targets | By Category | Tier 1 |
| Protect bestsellers | Bestsellers vs. Regular | Tier 1 |
| Promotional visibility | Sale vs. Regular | Tier 1 |
| Seasonal optimization | By Seasonality | Tier 1 |
| Clear old inventory | By Lifecycle + Inventory | Tier 1 |
| Win competitive markets | By Price Competitiveness | Tier 1 |
| Maximize ROAS with performance data | By Performance | Tier 2 |
| Unified multi-variable prioritization | By Composite Score | Tier 3 |

---

## Label update methods

| Method | Best for | Tools |
| --- | --- | --- |
| **Manual** | <100 SKUs, infrequent changes | Google Sheets, Merchant Center |
| **Rules-based** | Simple logic (category, price threshold) | Merchant Center rules, feed tools |
| **Automated** | Performance data, inventory sync | Channable, ProductHero, Profitmetrics |

---

## Common mistakes

| Mistake | Problem | Fix |
| --- | --- | --- |
| Over-segmenting | Each segment starves for data | Consolidate until sufficient volume |
| Static labels on dynamic data | Stale inventory/price labels | Automate label updates |
| Too many dimensions at once | Complexity without clarity | Start with one tactic |
| Same targets across segments | Defeats purpose | Set segment-appropriate targets |
| Different tROAS per performance tier | Products get stuck in lower tiers | Use same tROAS, differentiate via budget (See: [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md)) |
| Jumping to Tier 2/3 without data | Poor classifications, wasted effort | Start Tier 1, graduate when criteria met |

---

## Related documents

| Document | Relationship |
| --- | --- |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Upstream (tier selection, segmentation framework, tROAS rule) |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Upstream (Standard Shopping-specific settings) |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Upstream (campaign type decision) |
| *SOP – Set Up and Optimize Product Feed* | Execution (feed configuration) |
| *SOP – Set Up Performance-Based Shopping Segmentation* | Execution (Tier 2 setup) |
| *SOP – Set Up Scoring Model Segmentation* | Execution (Tier 3 setup) |
| *SOP – Launch Standard Shopping Campaign* | Execution (campaign setup) |
| *SOP – Launch PMax Full Assets Ecommerce Campaign* | Execution (PMax setup) |

---

## Version details

- **Version:** 4.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.