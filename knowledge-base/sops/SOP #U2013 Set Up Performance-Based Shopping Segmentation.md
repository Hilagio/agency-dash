# SOP – Set Up Performance-Based Shopping Segmentation
Created: 2026-02-04

SOP_ID: SOP_52
Status: Done
Category: Operational
Primary Outcome: Performance-based Shopping segmentation using Hero/Sidekick/Villain/Zombie framework with automated labeling
Secondary Outcomes: Efficient budget allocation, automated product tier labeling, optimized campaign structure
Agent_Executable: No
Human_Approval_Required: No
Domain: Shopping
Pillar: 6

## Purpose

This SOP sets up performance-based product segmentation for Shopping campaigns using the Hero/Sidekick/Villain/Zombie framework.

> ❓ **The big question:** How do I allocate budget efficiently across my product catalog based on historical performance data?

Performance-based segmentation puts budget where it performs. Heroes get the most exposure, Zombies get tested, and Villains get restricted.

---

## What this SOP is NOT

This SOP does **not:**

- Explain segmentation conceptual framework (See: [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md))
- List custom label tactics (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md))
- Set up product feeds (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))
- Set up scoring model segmentation (See: [SOP – Set Up Scoring Model Segmentation](../sops/SOP – Set Up Scoring Model Segmentation.md))
- Create campaigns from scratch (See: [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) or [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md))

## When to run this SOP

**Run when:**

- You have 90+ days of Shopping conversion data
- Clear performance differentiation exists across products
- Budget constraints require efficient allocation
- You have access to a labeling tool (ProductHero or Profitmetrics)

**Do NOT run when:**

- New store with insufficient conversion history
- All products perform similarly (no differentiation)
- Catalog is too small (<50 SKUs)
- No tool/script infrastructure available

---

## Before you start

### Required

- Google Ads account with Editor access
- Google Merchant Center with active product feed
- Labeling tool access (ProductHero or Profitmetrics)
- 90+ days of conversion data
- Current account tROAS and average ROAS metrics

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Tier definitions, strategy variants |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Custom label implementation |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Volume requirements per bucket |

---

## Critical rules

1. **Same tROAS across all campaign buckets:** Differentiate via budget, not bid targets. Different tROAS per bucket causes products to get stuck in lower tiers.
2. **Set tool threshold ~25% below your Google Ads tROAS:** This allows product flow between tiers and prevents short-term dips from permanent demotion.
3. **Review thresholds after any tROAS or budget change:** Forgetting to adjust tool thresholds after Google Ads changes will break your segmentation.
4. **Each bucket needs 30+ conversions/month:** If you can't hit this threshold, consolidate buckets. Exception: Zombie buckets often use Maximize Conversions without targets and may have lower conversion volume.
5. **Exclude segmented products from standard campaigns:** Failing to set exclusions causes overlap and data fragmentation.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 0️⃣: Decide** | Choose strategy, tool, campaign type | Decisions documented |
| **Phase 1️⃣: Configure Tool** | Set thresholds and connect tool | Labels syncing |
| **Phase 2️⃣: Create Campaigns** | Build campaign structure | Campaigns created |
| **Phase 3️⃣: Validate** | Verify correct operation | Segmentation working |

---

## Phase 0️⃣: Decide

### 0.1 Choose your strategy

| Goal | Campaign structure | When to use |
|------|-------------------|-------------|
| **Increase revenue** | Bucket 1: Heroes + Sidekicks + Villains / Bucket 2: Zombies | Zombie products need visibility: willing to spend to activate them |
| **Increase profitability** | Bucket 1: Heroes + Sidekicks + Zombies / Bucket 2: Villains | Villains are draining budget: priority is cost savings |
| **Full control (4 buckets)** | Bucket 1: Heroes / Bucket 2: Sidekicks / Bucket 3: Villains / Bucket 4: Zombies | Have sufficient volume (30+ conversions/bucket for main buckets): want maximum granular optimization |

> 💡 **Default to 4 separate buckets if volume allows:** This provides full control over each tier's budget and bid strategy. If volume is limited, start with 2 buckets and expand as volume grows.

**Document your choice:**

| Field | Your answer |
|-------|-------------|
| Primary goal | Revenue / Profitability / Both |
| Number of buckets | 2 / 3 |
| Bucket structure | [List buckets] |

### 0.2 Choose your tool

| Tool | Cost | Best for | Pros | Cons |
|------|------|----------|------|------|
| **ProductHero Labelizer** | €99/month + €49/extra shop | Plug-and-play, detailed insights | Great setup wizard, best dashboard | Most expensive |
| **Profitmetrics Shopping Booster** | From €26/month | Flexibility, profit data integration | Most customizable | Prone to errors if misconfigured |

**Document your choice:**

| Field | Your answer |
|-------|-------------|
| Tool selected | ProductHero / Profitmetrics |
| Reason | [Your rationale] |

### 0.3 Choose your campaign type

| Factor | Standard Shopping | PMax Feed-Only |
|--------|------------------|----------------|
| **Bid control** | High (Manual CPC available, Max CPC caps via portfolio strategies) | Low (automated only, no bid caps) |
| **Campaign priorities** | Yes | No |
| **Min. conversions/bucket** | N/A for Manual CPC, ~30/month for Target ROAS | ~30/month (Zombies excepted) |
| **Setup complexity** | Low | Low |
| **Best for** | Max control, testing, Max CPC caps | PMax benefits without creative |

**Document your choice:**

| Field | Your answer |
|-------|-------------|
| Campaign type | Standard Shopping / PMax Feed-Only |
| Reason | [Your rationale] |

---

## Phase 1️⃣: Configure Tool

### 1.1 Calculate thresholds

**Step 1️⃣:** Get your current average ROAS (last 30-90 days)

**Step 2️⃣:** Calculate tool threshold:

```
Tool Threshold = Average ROAS × 0.75
```

**Example:**

- Average ROAS: 400%
- Tool threshold: 400% × 0.75 = 300%

| Field | Your values |
|-------|-------------|
| Average ROAS (30-90 days) | ___% |
| Tool threshold (×0.75) | ___% |
| Google Ads tROAS target | ___% |

> ⚠️ Tool threshold should be ~25% lower than your Google Ads tROAS target. This creates a buffer for short-term dips.

### 1.2 Configure your selected tool

#### If ProductHero Labelizer:

1. Log in to ProductHero dashboard
2. Go to **Labelizer** → **Settings**
3. Set **Target ROAS** to your calculated tool threshold
4. Configure tier definitions:
   - Heroes: Top performers above threshold
   - Sidekicks: Good performers above threshold
   - Villains: Below threshold
   - Zombies: <100 impressions in 90 days
5. Connect to Google Merchant Center
6. Set sync frequency (daily recommended)
7. Save and activate

#### If Profitmetrics Shopping Booster:

1. Log in to Profitmetrics dashboard
2. Go to **Shopping Booster** → **Setup**
3. Select your Google Ads account
4. Set **Target ROAS** to your calculated tool threshold
5. Configure tier thresholds
6. Map to custom label (recommend: `custom_label_0`)
7. Set update frequency (daily recommended)
8. Save and activate

### 1.3 Verify label sync

1. Wait for first sync to complete
2. Go to **Google Merchant Center** → **Products** → **All Products**
3. Filter by `custom_label_0`
4. Verify distribution:

| Tier | Expected distribution |
|------|----------------------|
| Heroes | 5-15% of catalog |
| Sidekicks | 15-25% of catalog |
| Villains | 25-40% of catalog |
| Zombies | 30-50% of catalog |

> ⚠️ If distribution is wrong, check threshold configuration. Too high = too many Villains/Zombies.

---

## Phase 2️⃣: Create Campaigns

### 2.1 Plan campaign structure

**If 2-bucket structure (Revenue focus):**

| Campaign | Contains | Budget share |
|----------|----------|--------------|
| [Product] - H+S+V | Heroes, Sidekicks, Villains | 70-80% |
| [Product] - Zombies | Zombies | 20-30% |

**If 2-bucket structure (Profitability focus):**

| Campaign | Contains | Budget share |
|----------|----------|--------------|
| [Product] - H+S+Z | Heroes, Sidekicks, Zombies | 70-80% |
| [Product] - Villains | Villains | 20-30% |

**If 3-bucket structure:**

| Campaign | Contains | Budget share |
|----------|----------|--------------|
| [Product] - H+S | Heroes, Sidekicks | 50-60% |
| [Product] - Villains | Villains | 20-25% |
| [Product] - Zombies | Zombies | 20-25% |

### 2.2 Create campaigns

**For Standard Shopping:**

1. Create campaign per bucket using [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md)
2. In product groups, subdivide by **Custom label 0**
3. Include only the tiers for this bucket
4. Exclude all other tier values

**For PMax Feed-Only:**

1. Create campaign per bucket using [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md)
2. In listing groups, subdivide by **Custom label 0**
3. Include only the tiers for this bucket
4. Exclude all other tier values

### 2.3 Set exclusions

**Critical:** Exclude segmented products from any existing campaigns.

1. Open each existing Shopping/PMax campaign
2. Go to **Product groups** or **Listing groups**
3. Subdivide by **Custom label 0**
4. **Exclude** all tier values now in dedicated campaigns

### 2.4 Configure final settings

| Setting | Value | Same across all? |
|---------|-------|------------------|
| tROAS target | [Your target]% | ✅ Yes |
| Daily budget | Per structure | ❌ No (varies) |
| Locations | [Your targeting] | ✅ Yes |

> 💡 **Zombie bucket alternative:** If zombies struggle to spend, use **Maximize Conversions** (no tROAS) to force impressions.

---

## Phase 3️⃣: Validate

### 3.1 Immediate verification (Day 1)

- [ ] All campaigns created and enabled
- [ ] Same tROAS set across all buckets (except Zombies if using Max Conv)
- [ ] Budgets allocated per structure
- [ ] Listing/product groups correctly filter by custom label
- [ ] Each tier appears in exactly one campaign
- [ ] Exclusions set in any legacy campaigns
- [ ] Tool sync verified in Merchant Center

### 3.2 Week 1 verification

- [ ] Products serving from correct campaigns
- [ ] No "eligible (limited)" warnings due to overlap
- [ ] Label sync running daily
- [ ] Budget pacing as expected per bucket
- [ ] Zombie bucket generating impressions

### 3.3 Ongoing verification (Monthly)

- [ ] Review tier distribution: are products moving between tiers?
- [ ] Check for products stuck in Villain/Zombie
- [ ] Verify tool threshold still ~25% below actual ROAS
- [ ] Recalculate thresholds if tROAS or budget changed
- [ ] Assess if bucket structure should be simplified/expanded

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Strategy, tool, and campaign type decisions documented
- [ ] Tool configured with correct threshold (~25% below tROAS)
- [ ] Label sync verified in Merchant Center
- [ ] All campaign buckets created per structure
- [ ] Same tROAS across all buckets
- [ ] Budgets allocated per strategy
- [ ] Exclusions set to prevent overlap
- [ ] Week 1 verification passed

---

## Exit → Entry Bridge

| Next step | When |
|-----------|------|
| Monitor and optimize | Ongoing (weekly bucket review) |
| Adjust thresholds | After any tROAS or budget change |
| Add building blocks | When base structure is stable |
| [SOP – Set Up Scoring Model Segmentation](../sops/SOP – Set Up Scoring Model Segmentation.md) | When ready for multi-variable prioritization |

---

## Ongoing Maintenance

**Weekly:**

- Check tier distribution: are products moving?
- Verify budget pacing per bucket
- Review zombie bucket: are products gaining impressions?

**Monthly:**

- Recalculate threshold if average ROAS changed
- Review conversion volume per bucket
- Assess if structure should be simplified/expanded

**After any tROAS change:**

1. Recalculate tool threshold (new tROAS × 0.75)
2. Update tool settings immediately
3. Document the change

---

## FAQ

**Q: Why the same tROAS across all buckets?**

A: Different tROAS targets cause products to get stuck. A villain with a 300% target has no incentive to reach 400% (the hero threshold). Same tROAS + different budgets gives control without breaking product flow.

**Q: Why set tool threshold 25% below Google Ads tROAS?**

A: Creates a buffer for short-term dips. If tROAS is 400% and tool threshold is also 400%, a product at 390% becomes a villain unnecessarily.

**Q: What if my zombie bucket isn't getting impressions?**

A: Three options: (1) Increase zombie budget, (2) Switch to Maximize Conversions temporarily, (3) Check feed quality issues.

**Q: How long until I see results?**

A: Label sync: 24-48 hours. Campaign learning: 7-14 days. Performance stabilization: 30 days.

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Mental Model | Phase 0 |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Catalog | Phase 1 |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference | Phase 0, 2 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Prerequisite (feed must exist) |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Used in Phase 2 |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Used in Phase 2 |
| [SOP – Set Up Scoring Model Segmentation](../sops/SOP – Set Up Scoring Model Segmentation.md) | Advanced alternative |

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
