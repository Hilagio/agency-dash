# SOP – Set Up Scoring Model Segmentation
Created: 2026-02-04

SOP_ID: SOP_53
Status: Done
Category: Operational
Primary Outcome: Composite scoring segmentation using weighted multi-variable model for Shopping campaigns
Secondary Outcomes: Business-aligned prioritization, margin-aware optimization, inventory-aware budget allocation
Agent_Executable: No
Human_Approval_Required: No
Domain: Shopping
Pillar: 6

## Purpose

This SOP sets up composite scoring segmentation for Shopping campaigns using a weighted multi-variable model.

> ❓ **The big question:** How do I prioritize products based on multiple factors (performance, margin, inventory, competitiveness) rather than just historical ROAS?

Scoring models combine multiple variables into a single priority score. This gives you business-aligned prioritization that goes beyond performance-only segmentation.

---

## What this SOP is NOT

This SOP does **not:**

- Explain segmentation conceptual framework (See: [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md))
- Set up single-variable segmentation (See: [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md))
- Configure feed management tools from scratch
- Set up product feeds (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))

## When to run this SOP

**Run when:**

- Single-variable segmentation (ROAS-only) isn't capturing product potential
- You have reliable data for multiple variables (margin, inventory, price position)
- Products with good margins but low historical ROAS deserve more visibility
- You want to prioritize based on business strategy, not just past performance
- Feed management tool is already in place

**Do NOT run when:**

- Data quality is poor or inconsistent
- You lack a feed management tool capable of calculations
- Performance-based segmentation hasn't been tested yet
- Catalog is small (<100 SKUs)
- You can't commit to ongoing weight calibration

> ⚠️ **Start with performance-based segmentation first:** Scoring models add complexity. Only use when you've hit the limits of ROAS-only segmentation.

---

## Before you start

### Required

- Google Ads account with Editor access
- Merchant Center with active product feed
- Feed management tool (Channable, DataFeedWatch, Feedonomics, or equivalent)
- Data sources for each variable:
  - Performance data (ROAS, conversion rate)
  - Margin data (from ERP, ecommerce platform)
  - Inventory data (stock levels)
  - Price competitiveness data (price monitoring tool)
- 90+ days of conversion data

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Tier 3 scoring concepts |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Custom label implementation |

---

## Critical rules

1. **No single variable should exceed ~35% weight:** Over-weighting defeats multi-variable purpose.
2. **Data quality is non-negotiable:** Bad data in any variable corrupts the entire score.
3. **Normalize all variables to the same scale:** Cannot compare ROAS (0-1000%) with margin (0-50%) without normalization.
4. **Start simple, add complexity:** Begin with 2-3 variables. Add more only after validating.
5. **Calibrate weights quarterly:** Business priorities change.
6. **Document your model logic:** Future you needs to understand why.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 0️⃣: Design the Model** | Define variables, scales, weights | Model specification |
| **Phase 1️⃣: Build the Model** | Implement in feed tool | Scores calculating |
| **Phase 2️⃣: Create Campaigns** | Build campaign structure | Campaigns created |
| **Phase 3️⃣: Validate** | Verify correct operation | Segmentation working |

---

## Phase 0️⃣: Design the Model

### 0.1 Select your variables

Choose 2-5 variables based on data availability and business priorities.

**Common scoring variables:**

| Variable | What it measures | Data source | Best for |
|----------|------------------|-------------|----------|
| **ROAS** | Historical performance | Google Ads | All accounts |
| **Margin %** | Profit per unit | ERP, platform | Profitability focus |
| **Stock Level** | Inventory availability | ERP, platform | Inventory-constrained |
| **Price Position** | Competitiveness vs market | Price monitoring | Competitive markets |
| **Stock Velocity** | Days until stockout | Calculation | Fast-moving inventory |
| **New Product** | Launch priority | Product age | New arrivals strategy |

**Recommended models:**

| Complexity | Variables |
|------------|-----------|
| Minimum viable | ROAS + Margin |
| Recommended | ROAS + Margin + Stock Level |
| Advanced | ROAS + Margin + Stock Level + Price Position |

**Document your selection:**

| Variable | Data source | Include? |
|----------|-------------|----------|
| ROAS | Google Ads | ✅ / ❌ |
| Margin % | | ✅ / ❌ |
| Stock Level | | ✅ / ❌ |
| Price Position | | ✅ / ❌ |
| Other: | | ✅ / ❌ |

### 0.2 Define scoring scales

Normalize each variable to a 0-10 scale.

**Example scoring scales:**

| Variable | 0 points | 5 points | 10 points |
|----------|----------|----------|-----------|
| **ROAS** | <100% | 200-400% | >600% |
| **Margin %** | <10% | 25-35% | >50% |
| **Stock Level** | <10 units | 50-100 units | >200 units |
| **Price Position** | >20% above market | At market | >10% below market |

**Document your scales:**

| Variable | 0 pts | 2.5 pts | 5 pts | 7.5 pts | 10 pts |
|----------|-------|---------|-------|---------|--------|
| | | | | | |

> 💡 Use historical data to set breakpoints. Pull 20th, 50th, and 80th percentile values as starting points.

### 0.3 Assign weights

Weights should reflect business priorities. Total must equal 100%.

**Example weight distributions:**

| Focus | ROAS | Margin | Stock | Price |
|-------|------|--------|-------|-------|
| **Performance-first** | 35% | 25% | 25% | 15% |
| **Profitability-first** | 25% | 35% | 25% | 15% |
| **Inventory-first** | 20% | 25% | 35% | 20% |
| **Balanced** | 25% | 25% | 25% | 25% |

**Document your weights:**

| Variable | Weight | Rationale |
|----------|--------|-----------|
| | ___% | |
| | ___% | |
| | ___% | |
| **Total** | 100% | |

### 0.4 Define priority buckets

Set score thresholds for campaign bucketing.

**Standard 3-bucket structure:**

| Bucket | Score range | Typical % | Budget share |
|--------|-------------|-----------|--------------|
| **High Priority** | 7.0-10.0 | 15-25% | 50-60% |
| **Medium Priority** | 5.0-6.9 | 30-40% | 25-35% |
| **Low Priority** | 0-4.9 | 35-50% | 10-20% |

**Alternative 2-bucket:**

| Bucket | Score range | Budget share |
|--------|-------------|--------------|
| **Priority** | ≥6.0 | 70-80% |
| **Standard** | <6.0 | 20-30% |

---

## Phase 1️⃣: Build the Scoring Model

### 1.1 Prepare data sources

For each variable, ensure data flows into your feed management tool.

**Data integration checklist:**

| Variable | Source system | Format | Update frequency |
|----------|---------------|--------|------------------|
| ROAS | Google Ads | Percentage | Daily |
| Margin | ERP / Platform | Percentage | Daily/Weekly |
| Stock | ERP / Platform | Integer | Daily |
| Price Position | Monitoring tool | Percentage | Daily |

**Verify for each:**

- [ ] Data is flowing into feed tool
- [ ] Values are in expected format
- [ ] Update frequency meets requirements
- [ ] Missing values are handled

### 1.2 Create scoring rules in feed tool

#### Step 1️⃣: Create normalized score fields

For each variable, create a calculated field that converts raw values to 0-10.

**Example logic (ROAS):**

```
IF [ROAS] >= 600 THEN 10
ELSE IF [ROAS] >= 400 THEN 7.5
ELSE IF [ROAS] >= 200 THEN 5
ELSE IF [ROAS] >= 100 THEN 2.5
ELSE 0
```

**Repeat for each variable.**

#### Step 2️⃣: Create weighted score field

Combine normalized scores with weights:

```
[total_score] =
  ([roas_score] × 0.25) +
  ([margin_score] × 0.35) +
  ([stock_score] × 0.25) +
  ([price_score] × 0.15)
```

#### Step 3️⃣: Create priority bucket field

Map total score to bucket labels:

```
IF [total_score] >= 7.0 THEN "high_priority"
ELSE IF [total_score] >= 5.0 THEN "medium_priority"
ELSE "low_priority"
```

#### Step 4️⃣: Map to custom label

Output priority bucket to `custom_label_1` (if `custom_label_0` is used for performance labels).

### 1.3 Validate scoring output

**Distribution check:**

| Bucket | Expected % | Actual % | Status |
|--------|------------|----------|--------|
| High Priority | 15-25% | ___% | ✅ / ⚠️ |
| Medium Priority | 30-40% | ___% | ✅ / ⚠️ |
| Low Priority | 35-50% | ___% | ✅ / ⚠️ |

**Spot check 10 random products from each bucket:**

- [ ] High Priority products genuinely deserve priority
- [ ] Low Priority products are legitimately low value
- [ ] No obvious misclassifications

**Edge cases:**

- [ ] Products with missing data handled correctly
- [ ] New products (no ROAS) get appropriate default
- [ ] Out-of-stock products scored appropriately

### 1.4 Push to Merchant Center

1. Activate feed export in your tool
2. Verify custom label mapping
3. Run initial sync
4. Confirm in Merchant Center → Products

---

## Phase 2️⃣: Create Campaigns

### 2.1 Plan campaign structure

Based on your bucket definitions:

**3-bucket:**

| Campaign | Contains | Budget share |
|----------|----------|--------------|
| [Product] - High Priority | Score ≥7.0 | 50-60% |
| [Product] - Medium Priority | Score 5.0-6.9 | 25-35% |
| [Product] - Low Priority | Score <5.0 | 10-20% |

### 2.2 Create campaigns

Follow [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) or [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md), using your score-based custom label instead of performance tier labels.

**Key differences from performance-based:**

| Setting | Performance-based | Scoring model |
|---------|-------------------|---------------|
| Custom label values | hero, sidekick, etc. | high_priority, medium_priority, etc. |
| Label source | Labeling tool | Feed management tool |
| tROAS approach | Same across all | Same across all |

### 2.3 Set exclusions

Exclude score-labeled products from existing campaigns:

1. Open each existing Shopping/PMax campaign
2. Subdivide by your custom label
3. **Exclude** all priority values in dedicated campaigns

---

## Phase 3️⃣: Validate

### 3.1 Model validation (before launch)

- [ ] All variables flowing correctly
- [ ] Normalized scores calculating correctly
- [ ] Total score calculating correctly
- [ ] Bucket distribution reasonable
- [ ] Custom label syncing to MC
- [ ] Edge cases handled

### 3.2 Campaign validation (Day 1)

- [ ] All campaigns created and enabled
- [ ] Same tROAS across all buckets
- [ ] Budgets allocated per structure
- [ ] Listing groups filter by custom label
- [ ] Each bucket in exactly one campaign
- [ ] Exclusions set

### 3.3 Week 1 validation

- [ ] Products serving from correct campaigns
- [ ] Budget pacing as expected
- [ ] High Priority getting majority spend
- [ ] No obvious misallocations

### 3.4 Ongoing validation (Monthly)

- [ ] Re-check bucket distribution
- [ ] Spot check 10 products per bucket
- [ ] Review if weight adjustments needed
- [ ] Verify data sources updating

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Variables selected and scales defined
- [ ] Weights assigned (totaling 100%, no single >35%)
- [ ] Scoring model built in feed tool
- [ ] Model validation passed
- [ ] Custom label syncing to Merchant Center
- [ ] All campaign buckets created
- [ ] Same tROAS across buckets
- [ ] Budgets allocated per strategy
- [ ] Exclusions set
- [ ] Week 1 validation passed

---

## Exit → Entry Bridge

| Next step | When |
|-----------|------|
| Monitor and optimize | Ongoing (weekly bucket review) |
| Calibrate weights | Quarterly or after business changes |
| Add variables | When new data sources available |
| Simplify model | If complexity isn't adding value |

---

## Ongoing Maintenance

**Weekly:**

- Check bucket distribution
- Verify data sources updating
- Review budget pacing

**Monthly:**

- Spot check 10 products per bucket
- Compare bucket performance
- Identify misclassified products

**Quarterly:**

- Full weight review
- Variable review: add/remove?
- Threshold review
- Document any changes

---

## Example: Full Scoring Calculation

**Product:** Oak Dining Table

| Variable | Raw value | Scale | Points | Weight | Weighted |
|----------|-----------|-------|--------|--------|----------|
| ROAS | 450% | 400-600% = 7.5 | 7.5 | 25% | 1.875 |
| Margin | 42% | 35-50% = 7.5 | 7.5 | 35% | 2.625 |
| Stock | 85 units | 50-100 = 7.5 | 7.5 | 25% | 1.875 |
| Price Position | 5% below | 0-10% below = 7.5 | 7.5 | 15% | 1.125 |
| **Total** | | | | 100% | **7.5** |

**Result:** Score 7.5 → **High Priority** bucket

---

## FAQ

**Q: When should I use scoring vs performance-based?**

A: Start with performance-based. Graduate to scoring when: (1) You have reliable margin/inventory data, (2) Performance-only isn't capturing potential, (3) You want business factors beyond ROAS.

**Q: How many variables should I include?**

A: Start with 2-3. More variables = more complexity = more maintenance.

**Q: How do I handle missing data?**

A: Options: (1) Neutral score (5/10), (2) Exclude from scoring, (3) Use category averages. Document your approach.

**Q: How often should I recalibrate weights?**

A: Quarterly minimum. Also after major strategy or market changes.

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Mental Model | Phase 0 |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Catalog | Phase 1 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) | Prerequisite / simpler alternative |
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Prerequisite (feed must exist) |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Used in Phase 2 |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Used in Phase 2 |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
