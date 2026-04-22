# SOP – Launch PMax Feed-Only Campaign
Created: 2026-02-04
Updated: 2026-02-05

SOP_ID: SOP_50
Status: Done
Category: Operational
Primary Outcome: Fully configured PMax Feed-Only campaign optimized for Shopping-surface delivery
Secondary Outcomes: Brand exclusions implemented, listing groups structured
Agent_Executable: No
Human_Approval_Required: No
Domain: Shopping
Pillar: 6

## Purpose

This SOP launches a Performance Max Feed-Only campaign that maximizes Shopping performance without creative asset investment.

> ❓ **The big question:** How do I set up PMax to act like automated Standard Shopping without leaking spend to Display and YouTube?

Feed-Only PMax uses your product feed as the sole data source. By intentionally not adding creative assets, the campaign stays primarily on the Shopping surface while benefiting from PMax's automated bidding.

---

## What this SOP is NOT

This SOP does **not:**

- Set up product feeds (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))
- Explain when to choose PMax vs Standard Shopping (See: [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md))
- Set up PMax with full creative assets (See: [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md))

## When to run this SOP

**Run when:**

- You have 30+ conversions/month to support automated bidding (50+ for Target ROAS)
- You want Shopping performance with less management overhead
- You don't have quality creative assets (images, video)
- You want to keep spend focused on Shopping placements

**Do NOT run when:**

- Product feed is not optimized
- Conversion tracking is not verified
- Volume is below 30 conversions/month (use Standard Shopping)
- You want cross-channel reach (use Full Assets PMax)

---

## Before you start

### Required inputs

- Merchant Center account linked to Google Ads
- Product feed uploaded and approved
- Conversion tracking implemented with value tracking
- 30+ conversions in last 30 days
- Brand names identified for exclusions

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | PMax settings |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Location, language settings |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand exclusions |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Learning period and monitoring |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Structure decisions |

---

## Decision gate: Single vs multi-campaign

Before creating the campaign, determine your structure:

| If... | Then... | Reference |
|-------|---------|-----------|
| Simple catalog, no segmentation | Single campaign | This SOP |
| Need performance-based segmentation | Multiple campaigns by tier | [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) |
| Different products need different budgets | Multiple campaigns by category | [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) |

> ⚠️ **Each PMax campaign needs 30+ conversions/month (50+ for Target ROAS):** Don't over-segment if you can't meet volume thresholds per campaign.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign shell and settings** | Create campaign with correct settings | Campaign created |
| **Phase 2️⃣: Structure and targeting** | Configure listing groups (no audience signals) | Listing groups structured |
| **Phase 3️⃣: Creative setup** | Skip assets (Feed-Only behavior) | Minimum required assets only |
| **Phase 4️⃣: Bidding and budget** | Configure bid strategy | Bidding set |
| **Phase 5️⃣: Brand separation and exclusions** | Add brand exclusions | Exclusions active |
| **Phase 6️⃣: Launch and verify** | Enable and validate | Campaign live |

---

## Phase 1️⃣: Campaign Shell and Settings

### 1.1 Create the campaign

1. Go to Google Ads → **Campaigns** → **+** → **New campaign**
2. Select goal: **Sales**
3. Select conversion goals (ensure purchase/transaction selected)
4. Select campaign type: **Performance Max**
5. Select your Merchant Center account
6. Click **Continue**

### 1.2 Configure campaign settings

| Setting | Value | Notes |
|---------|-------|-------|
| **Campaign name** | `[Country]_[Language]_PMax_[Segment]_FeedOnly` | Include FO for Feed-Only identification |
| **Locations** | Target countries | Where you can ship/sell |
| **Languages** | All customer languages | |

> ↪️ **For location and language details:** See [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md).

---

## Phase 2️⃣: Structure and Targeting

### 2.1 Create asset group

1. Name: `[Segment] - Feed Only` (e.g., "All Products - Feed Only")

### 2.2 Configure listing groups

This is the critical step for Feed-Only behavior.

1. Click **Edit listing groups**
2. Default shows "All products"
3. **To segment by custom label:**
   - Click on "All products"
   - Select **Subdivide**
   - Choose **Custom label 0** (or your segmentation label)
   - Include relevant values
   - Exclude other values

| Structure | When to use |
|-----------|-------------|
| All products | Single campaign, no segmentation |
| By custom label | Performance-based segmentation |
| By brand | Brand-specific campaigns |
| By product type | Category-specific campaigns |

### 2.3 Configure Final URL

| Setting | Value |
|---------|-------|
| **Final URL** | Homepage or main category page |
| **Final URL expansion** | OFF |

**How to disable Final URL expansion:**

1. Click **More options** or look for "Automatically created assets"
2. Find **Final URL expansion**
3. Toggle **OFF**

> ⚠️ **If Final URL Expansion = ON, Google will expand to other networks and will automatically create assets:** This defeats the purpose of a Feed-Only setup. Keep it OFF.

### 2.4 Do NOT add audience signals

> ⚠️ **For Feed-Only PMax, do NOT add audience signals:** Your product feed IS your targeting. Audience signals are only for Full Assets PMax.

---

## Phase 3️⃣: Creative Setup (Feed-Only)

### 3.1 Do NOT add any assets

**This is what makes it Feed-Only:**

| Asset type | Action |
|------------|--------|
| **Images** | Do NOT add any |
| **Logos** | Do NOT add any |
| **Headlines** | Do NOT add any |
| **Long headlines** | Do NOT add any |
| **Descriptions** | Do NOT add any |
| **Videos** | Do NOT add any |

> ⚠️ **Feed-Only means NO assets:** Adding ANY assets (images, logos, headlines, descriptions, videos) will cause Google to expand to other networks, making it a Full-Asset campaign.

> 💡 **Your product feed IS your creative:** Product listings from the feed serve as your creative on Shopping placements. Only add products to the listing group.

---

## Phase 4️⃣: Bidding and Budget

### 4.1 Configure bidding

| Situation | Recommended strategy | Target |
|-----------|---------------------|--------|
| Building volume | Maximize conversion value | No target |
| 50+ conversions/month | Maximize conversion value | Set tROAS |

**Configuration:**

1. Select **Maximize conversion value**
2. For new campaigns: Leave target ROAS blank initially
3. For established campaigns: Enter target ROAS (actual ROAS minus 10-20%)

> ↪️ **For volume thresholds:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

### 4.2 Set budget

| Consideration | Approach |
|---------------|----------|
| New campaign | Start with test budget, scale after 2-4 weeks |
| Established account | Revenue goal / Target ROAS |

Enter your daily budget and click **Next**.

---

## Phase 5️⃣: Brand Separation and Exclusions

### 5.1 Add brand exclusions

Brand exclusions prevent PMax from cannibalizing your cheap brand traffic.

1. In campaign settings, find **Brand exclusions** (or Additional settings → Brand safety)
2. Click **Exclude specific brands**
3. Search for and add your brand name(s)
4. Add brand misspellings if common

| Brand to exclude | Why |
|------------------|-----|
| Your brand name | Prevent brand cannibalization |
| Brand variations | Cover misspellings |
| Sub-brands | If running separate campaigns |

> ↪️ **For complete brand separation implementation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### 5.2 Add negative keywords using negative keyword lists

Use negative keyword lists for better organization and consistency:

1. Go to **Tools & Settings** → **Shared library** → **Negative keyword lists**
2. Create list: `[Client] - PMax Negatives`
3. Add known irrelevant queries from your Search data
4. Apply to PMax campaign

**Common negatives to add:**

| Type | Examples |
|------|----------|
| Wrong intent | "free", "diy", "how to make" |
| Wrong products | Competitors you don't carry |
| Low quality | "cheap", "discount" (if not your positioning) |

> 💡 **Use negative keyword lists:** Easier to manage and apply consistently across campaigns.

> ↪️ **For negative keyword management:** See [Negative Keyword Reference](../references/Negative Keyword Reference.md).

---

## Phase 6️⃣: Launch and Verify

### 6.1 Pre-launch checklist

- [ ] Campaign name follows naming convention (includes FO for Feed-Only)
- [ ] Correct Merchant Center account selected
- [ ] Bidding strategy set (Maximize conversion value)
- [ ] Budget set
- [ ] Final URL expansion: OFF
- [ ] Images/videos NOT added (Feed-Only)
- [ ] Only minimum required text assets
- [ ] Brand exclusions configured
- [ ] NO audience signals added (Feed-Only)
- [ ] Listing groups correct

### 6.2 Enable campaign

1. Review all settings in campaign overview
2. Set status to **Enabled**
3. Set start date

### 6.3 Post-launch verification (48-72 hours)

- [ ] Campaign status shows **Eligible**
- [ ] Products approved and serving
- [ ] Impressions appearing (PMax can take 48+ hours to ramp)
- [ ] Spend concentrated on Shopping (check Insights tab after 3+ days)

### 6.4 Monitoring cadence

| Timeframe | Focus |
|-----------|-------|
| 48-72 hours | Verify products serving, impressions appearing |
| Week 1 | Review Insights tab for placement breakdown, check for brand queries |
| Week 2-4 | Learning period, minimal changes |
| Day 30 | First comprehensive performance review |

> ↪️ **For complete monitoring guidance:** See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md).

### 6.5 Check for channel leakage (Week 2+)

After 2+ weeks, check where spend is going:

1. Go to campaign → **Insights**
2. Look at placement categories
3. If significant Display/YouTube spend: Review asset group (may have accidentally added assets)

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Campaign created with Feed-Only configuration
- [ ] No images or videos in asset group
- [ ] Final URL expansion OFF
- [ ] Brand exclusions active
- [ ] NO audience signals (Feed-Only)
- [ ] Campaign enabled and serving
- [ ] Week 1 verification passed
- [ ] Spend confirmed on Shopping placements

---

## Exit → Entry Bridge

| Timeframe | Action |
|-----------|--------|
| Week 1 | Monitor learning, no changes |
| Week 2-4 | Learning period, minimal changes |
| Day 30 | First performance evaluation |
| Ongoing | Monitor channel mix in Insights |

**If issues arise:**

| Issue | Action |
|-------|--------|
| Significant non-Shopping spend | Review asset group for accidental assets |
| Poor performance | Check feed quality, consider Standard Shopping |
| Brand queries appearing | Verify brand exclusions |
| Learning period issues | See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) |

---

## FAQ

**Q: How do I know if it's truly Feed-Only?**

A: Check Insights tab after 2+ weeks. Shopping placements should dominate. If Display/YouTube is significant, you may have assets attracting non-Shopping delivery.

**Q: Should I add audience signals to Feed-Only PMax?**

A: No. For Feed-Only PMax, your product feed IS your targeting. Audience signals are only for Full Assets PMax.

**Q: What if I want to test Full Assets later?**

A: Create a new Full Assets campaign. Don't convert your Feed-Only campaign, as adding assets changes its behavior entirely.

**Q: How long until I can evaluate performance?**

A: Minimum 30 days. Learning period is 2-4 weeks, then you need stable data to evaluate.

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Reference | All phases |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference | Phase 5 |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 6 |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Mental Model | Phase 2 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Prerequisite (feed must exist) |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Alternative (manual control) |
| [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) | Alternative (cross-channel) |
| [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) | Downstream (when ready for segmentation) |

---

## Version details

- **Version:** 3.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
