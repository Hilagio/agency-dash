# SOP – Launch PMax Full Assets Ecommerce Campaign
Created: 2026-02-04
Updated: 2026-02-05

SOP_ID: SOP_51
Status: Done
Category: Operational
Primary Outcome: Fully configured PMax campaign with complete creative assets for cross-channel Ecommerce growth
Secondary Outcomes: All Google surfaces activated, brand exclusions implemented, asset groups optimized
Agent_Executable: No
Human_Approval_Required: No
Domain: Shopping
Pillar: 6

## Purpose

This SOP launches a Performance Max campaign with full creative assets for cross-channel Ecommerce reach across Shopping, Search, Display, YouTube, Gmail, and Discover.

> ❓ **The big question:** How do I set up PMax to leverage all Google surfaces for product visibility while maintaining Ecommerce focus?

Full Assets PMax requires creative investment and serves across all Google surfaces. Use this when you want reach beyond Shopping and have quality assets to support it.

---

## What this SOP is NOT

This SOP does **not:**

- Set up product feeds (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))
- Explain when to choose Full Assets vs Feed-Only (See: [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md))
- Set up Feed-Only PMax (See: [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md))
- Create creative assets (assumes assets are ready)

## When to run this SOP

**Run when:**

- You have 50+ conversions/month to support cross-channel optimization
- You have quality creative assets ready (images, video)
- You want product awareness beyond Shopping (YouTube, Display, Gmail, Discover)
- Current Shopping performance is strong and you want incremental reach

**Do NOT run when:**

- You don't have quality images and video
- Volume is below 50 conversions/month
- You want Shopping-only focus (use Feed-Only)
- Product feed is not optimized

---

## Before you start

### Required inputs

- Merchant Center account linked to Google Ads
- Product feed uploaded and approved
- Conversion tracking with accurate value tracking
- 50+ conversions in last 30 days
- Creative assets prepared (images, video, headlines, descriptions)

### Asset requirements

| Asset type | Minimum | Recommended | Specifications |
|------------|---------|-------------|----------------|
| **Square images** | 1 | 3-5 | 1200×1200 px |
| **Landscape images** | 1 | 3-5 | 1200×628 px |
| **Portrait images** | 0 | 1-3 | 960×1200 px |
| **Logo (square)** | 1 | 1 | 1200×1200 px |
| **Logo (landscape)** | 0 | 1 | 1200×300 px |
| **Headlines** | 3 | 5-11 | Max 30 characters |
| **Long headlines** | 1 | 2-5 | Max 90 characters |
| **Descriptions** | 2 | 4 | Max 90 characters |
| **Videos** | 0 | 1-5 | YouTube hosted, 10+ seconds |

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Structure decisions |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Location, language settings |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand exclusions |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Learning period and monitoring |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Audience configuration |

---

## Decision gate: Asset group structure

Before creating the campaign, determine your asset group approach:

| If... | Then... | Notes |
|-------|---------|-------|
| Single product category | Single asset group | Simplest approach |
| Multiple distinct categories | Asset group per category | Different creative per category |
| Different audiences for same products | Asset group per audience | Test messaging variations |

> ⚠️ **More asset groups = more creative requirements:** Each asset group needs its own full set of assets.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign shell and settings** | Create campaign with correct settings | Campaign created |
| **Phase 2️⃣: Structure and targeting** | Configure listing groups and asset groups | Structure configured |
| **Phase 3️⃣: Creative setup** | Add images, video, text assets | Assets uploaded |
| **Phase 4️⃣: Bidding and budget** | Configure bid strategy | Bidding set |
| **Phase 5️⃣: Brand separation and exclusions** | Add brand exclusions and audience signals | Exclusions and signals active |
| **Phase 6️⃣: Launch and verify** | Enable and validate | Campaign live |

---

## Phase 1️⃣: Campaign Shell and Settings

### 1.1 Create the campaign

1. Go to Google Ads → **Campaigns** → **+** → **New campaign**
2. Select goal: **Sales**
3. Select conversion goals (ensure purchase/transaction selected with accurate values)
4. Select campaign type: **Performance Max**
5. Select your Merchant Center account
6. Click **Continue**

### 1.2 Configure campaign settings

| Setting | Value | Notes |
|---------|-------|-------|
| **Campaign name** | `[Country]_[Language]_PMax_[Segment]` | Full Assets (no FO suffix), no _[Audience] suffix |
| **Locations** | Target countries | Where you can ship/sell |
| **Languages** | All customer languages | |

> ↪️ **For location and language details:** See [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md).

### 1.3 Configure asset optimization settings

Review and configure asset optimization settings before building asset groups.

> ↪️ **For asset optimization configuration:** See [Asset Optimization Control Guidelines](../guidelines/Asset Optimization Control Guidelines.md) and [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md).

---

## Phase 2️⃣: Structure and Targeting

### 2.1 Create first asset group

1. Name: `[Category/Audience] - Full Assets`
2. Example: "Running Shoes - Full Assets" or "All Products - Full Assets"

### 2.2 Configure listing groups

1. Click **Edit listing groups**
2. Structure based on your strategy:

| Strategy | Structure |
|----------|-----------|
| All products | Leave as "All products" |
| By category | Subdivide by Product Type or Google Product Category |
| By custom label | Subdivide by custom_label_0 (performance tiers) |

### 2.3 Configure Final URL

| Setting | Recommendation |
|---------|----------------|
| **Final URL** | Category landing page or homepage |
| **Final URL expansion** | OFF (keep users on product pages) |

### 2.4 Create additional asset groups (if needed)

For multi-category or multi-audience approaches:

1. Click **New asset group**
2. Repeat steps 2.1-2.3
3. Use different listing groups per asset group (no overlap)

---

## Phase 3️⃣: Creative Setup

### 3.1 Add images

**Square images (1200×1200):**

1. Click **+ Add images** under Square images
2. Upload 3-5 high-quality product or lifestyle images
3. Ensure images represent products in listing group

**Landscape images (1200×628):**

1. Click **+ Add images** under Landscape images
2. Upload 3-5 images
3. Good for Display and Discover placements

**Portrait images (960×1200):**

1. Optional but recommended for mobile
2. Upload 1-3 if available

> ↪️ **For image specifications:** See [Image Creative Reference](../references/Image Creative Reference.md).

### 3.2 Add logos

1. Upload square logo (1200×1200)
2. Optional: Upload landscape logo (1200×300)

### 3.3 Add video

1. Click **+ Add video**
2. Paste YouTube video URL
3. Requirements:
   - Hosted on YouTube
   - Minimum 10 seconds
   - Recommended: 15-30 seconds

> ⚠️ **Video is highly recommended:** PMax without video will auto-generate from your images, which is lower quality.

> ↪️ **For video specifications:** See [Video Creative Reference](../references/Video Creative Reference.md).

### 3.4 Add text assets

**Headlines (max 30 characters):**

Add 5-11 headlines covering:

| Type | Example |
|------|---------|
| Brand/Product | "Shop Running Shoes" |
| Benefit | "Free Shipping Over €50" |
| Feature | "New Arrivals" |
| Social proof | "Top Rated Gear" |
| Brand trust | "[Brand] Official" |

> ↪️ **For headline patterns:** See [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md).

**Long headlines (max 90 characters):**

Add 2-5 longer headlines for Display and Discover.

**Descriptions (max 90 characters):**

Add 2-5 descriptions mixing:

- Product benefits
- Shipping/returns
- Brand trust
- Call to action

> ↪️ **For description patterns:** See [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md).

### 3.5 Add business information

| Field | Value |
|-------|-------|
| Business name | Your business name |
| Call to action | "Shop now" or appropriate CTA |
| Display URL path | Optional brand/category path |

---

## Phase 4️⃣: Bidding and Budget

### 4.1 Configure bidding

**Configuration:**

1. Select **Maximize conversion value**
2. For new campaigns: Leave target ROAS blank initially to allow learning
3. For campaigns with 50+ conversions: Set Target ROAS (actual minus 10-20%)
4. Optimize towards your ROAS target in incremental steps

> ↪️ **For volume thresholds:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

### 4.2 Set budget

Full Assets PMax needs sufficient budget to serve across all surfaces:

| Consideration | Recommendation |
|---------------|----------------|
| Minimum viable | €50/day to serve across surfaces |
| Recommended | Revenue goal / Target ROAS |

---

## Phase 5️⃣: Brand Separation and Exclusions

### 5.1 Add brand exclusions

1. In campaign settings → **Brand exclusions**
2. Click **Exclude specific brands**
3. Add your brand name(s)
4. Add common misspellings

> ↪️ **For complete brand separation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### 5.2 Configure audience signals

Return to each asset group and configure signals:

**High-priority signals:**

| Signal type | Configuration |
|-------------|---------------|
| **Customer Match** | Upload purchaser list (5,000+ recommended) |
| **Website converters** | Add converter audience |
| **High-intent visitors** | Cart abandoners, product viewers |

**Medium-priority signals:**

| Signal type | Configuration |
|-------------|---------------|
| **Custom segments** | Competitor URLs, product search terms |
| **In-market audiences** | Relevant product categories |

> ↪️ **For audience signal configuration:** See [Audience Signals Reference](../references/Audience Signals Reference.md).

### 5.3 Configure customer acquisition settings (optional)

If measuring new customer acquisition:

1. Campaign settings → **Additional settings** → **Customer acquisition**
2. Configure based on goals:
   - Optimize for new customers
   - Bid higher for new customers

> ↪️ **For customer acquisition settings:** See [Customer Lifecycle Optimization Reference](../references/Customer Lifecycle Optimization Reference.md).

---

## Phase 6️⃣: Launch and Verify

### 6.1 Pre-launch checklist

**Campaign level:**

- [ ] Campaign name clear (Full Assets, not Feed-Only)
- [ ] Correct Merchant Center account
- [ ] Bidding strategy appropriate for volume
- [ ] Budget sufficient for cross-channel (€50+/day)
- [ ] Brand exclusions configured

**Asset group level:**

- [ ] Listing groups correctly configured
- [ ] No overlap between asset groups
- [ ] Final URL expansion OFF

**Creative assets:**

- [ ] 3+ square images
- [ ] 3+ landscape images
- [ ] Logo(s) uploaded
- [ ] Video uploaded (recommended)
- [ ] 5+ headlines
- [ ] 2+ long headlines
- [ ] 2+ descriptions

**Targeting:**

- [ ] Audience signals configured

### 6.2 Enable campaign

1. Review all settings
2. Set status to **Enabled**
3. Set start date

### 6.3 Post-launch verification (72 hours)

- [ ] Campaign status: Eligible
- [ ] Assets approved (no policy violations)
- [ ] Products serving
- [ ] Impressions appearing across surfaces

### 6.4 Monitoring cadence

| Timeframe | Focus |
|-----------|-------|
| 72 hours | Verify assets approved, impressions appearing |
| Week 1-2 | Monitor asset performance, check placements |
| Week 2-4 | Learning period, minimal changes |
| Week 3-4 | Review asset-level data, replace underperforming assets |
| Day 30 | First comprehensive performance review |

> ↪️ **For complete monitoring guidance:** See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md).

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Campaign created with full creative assets
- [ ] All asset types uploaded (images, video, text)
- [ ] Asset groups configured with correct listing groups
- [ ] Brand exclusions active
- [ ] Audience signals configured
- [ ] Campaign enabled and serving
- [ ] Week 2+ serving across multiple surfaces
- [ ] No major asset policy violations

---

## Exit → Entry Bridge

| Timeframe | Action |
|-----------|--------|
| Week 1-2 | Learning period, minimal changes |
| Week 3-4 | Initial asset optimization |
| Day 30 | First comprehensive performance review |
| Ongoing | Monthly asset refresh, creative testing |

**If issues arise:**

| Issue | Action |
|-------|--------|
| High spend on poor placements | Review channel insights, consider Feed-Only |
| Asset disapprovals | Fix policy issues, resubmit |
| Poor ROAS vs Feed-Only | Evaluate creative quality |
| Brand queries appearing | Verify brand exclusions |
| Learning period issues | See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) |

---

## FAQ

**Q: How is Full Assets different from Feed-Only?**

A: Feed-Only uses your product feed only and stays primarily on Shopping. Full Assets uses your creative across all Google surfaces.

**Q: Do I need video?**

A: Highly recommended. Without video, PMax auto-generates from your images, which underperforms.

**Q: What if my ROAS is worse than Feed-Only?**

A: Full Assets reaches different surfaces that may have lower intent. If Shopping-only performance is your goal, use Feed-Only.

**Q: Should I run Feed-Only and Full Assets together?**

A: Not for the same products. Use listing groups to ensure products appear in only one campaign.

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Mental Model | Phase 2 |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference | Phase 5 |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference | Phase 5 |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 6 |
| [Image Creative Reference](../references/Image Creative Reference.md) | Reference | Phase 3 |
| [Video Creative Reference](../references/Video Creative Reference.md) | Reference | Phase 3 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Prerequisite (feed must exist) |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Alternative (Shopping-focused) |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Alternative (manual control) |
| [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) | Downstream (when ready for segmentation) |

---

## Version details

- **Version:** 4.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
