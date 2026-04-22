# SOP – Launch Standard Shopping Campaign
Created: 2026-02-04
Updated: 2026-02-05

SOP_ID: SOP_49
Status: Done
Category: Operational
Primary Outcome: Fully configured Standard Shopping campaign with correct settings, product groups, and bidding
Secondary Outcomes: Query sculpting structure (if applicable), brand separation implemented
Agent_Executable: No
Human_Approval_Required: No
Domain: Shopping
Pillar: 6

## Purpose

This SOP launches a Standard Shopping campaign with optimal settings for control, transparency, and scalability.

> ❓ **The big question:** How do I set up a Standard Shopping campaign that maximizes control while being ready to scale?

Standard Shopping provides manual bid control, campaign priorities for query sculpting, and full search term visibility. This SOP covers campaign setup through launch and verification.

---

## What this SOP is NOT

This SOP does **not:**

- Set up product feeds (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))
- Explain when to choose Standard Shopping vs PMax (See: [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md))
- Set up performance-based segmentation (See: [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md))

## When to run this SOP

**Run when:**

- Launching a new Standard Shopping campaign
- Client needs manual bid control or query sculpting
- Conversion volume is below 30/month (Manual CPC works at any volume)
- You need full transparency into auction behavior

**Do NOT run when:**

- Product feed is not optimized
- Conversion tracking is not verified
- Client wants hands-off automation (use PMax Feed-Only)

---

## Before you start

### Required inputs

- Merchant Center account linked to Google Ads
- Product feed uploaded and approved (no critical errors)
- Conversion tracking implemented and verified
- Daily budget determined
- Target ROAS or CPA goal (for bid strategy selection)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | All available settings |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Location, language, schedule |
| [Network Selection Reference](../references/Network Selection Reference.md) | Network settings |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand negatives |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Monitoring cadence |

---

## Decision gate: Campaign structure

Before creating the campaign, determine your structure:

| If... | Then... | Reference |
|-------|---------|-----------|
| Single product set, no brand separation | Single campaign | This SOP |
| Need brand separation | Two campaigns (Brand + Non-Brand) | [Brand Separation Reference](../references/Brand Separation Reference.md) |
| Need full query sculpting | Three campaigns (High/Med/Low priority) | [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) |

> ⚠️ **Start simple:** Most accounts should start with one or two campaigns.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign shell and settings** | Create campaign with correct settings | Campaign created |
| **Phase 2️⃣: Structure and targeting** | Configure product groups | Product groups structured |
| **Phase 3️⃣: Creative setup** | N/A (feed-based) | N/A |
| **Phase 4️⃣: Bidding and budget** | Configure bid strategy and budget | Bidding set |
| **Phase 5️⃣: Brand separation and exclusions** | Add negatives and verify networks | Exclusions active |
| **Phase 6️⃣: Launch and verify** | Enable and validate | Campaign live |

---

## Phase 1️⃣: Campaign Shell and Settings

### 1.1 Create the campaign

1. Go to Google Ads → **Campaigns** → **+** → **New campaign**
2. Select goal: **Sales** (or **Create a campaign without a goal's guidance**)
3. Select campaign type: **Shopping**
4. Select your Merchant Center account
5. Choose: **Standard Shopping campaign**
6. Click **Continue**

### 1.2 Configure campaign settings

| Setting | Recommended value | Notes |
|---------|------------------|-------|
| **Campaign name** | `[Country]_[Language]_Shopping_[Segment]` | e.g., "US_EN_Shopping_AllProducts" |
| **Country of sale** | Your target country | Must match feed target country |
| **Campaign priority** | Low (default) | Use High/Medium for query sculpting only |
| **Inventory filter** | None (default) | Use if excluding specific brands/products |

> 💡 **Display Network does NOT apply to Standard Shopping:** Only Search Network and Search Partners are available as network options.

### 1.3 Configure universal settings

| Setting | Recommendation |
|---------|----------------|
| **Locations** | Target countries where you can ship/sell |
| **Location options** | Presence (not "Presence or interest") |
| **Languages** | All languages your customers speak |

> ↪️ **For location and language details:** See [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md).

### 1.4 Configure network settings

| Network | Setting |
|---------|---------|
| **Search Network** | Enabled (required for Shopping) |
| **Search Partners** | Test (monitor performance) |

> 💡 **Search Partners:** Can work great or perform poorly. Highly dependent on vertical. Test and monitor.

> ↪️ **For network selection rationale:** See [Network Selection Reference](../references/Network Selection Reference.md).

---

## Phase 2️⃣: Structure and Targeting

### 2.1 Create ad group

1. Name: `[Segment]` (e.g., "All Products")
2. Click **Save and continue**

### 2.2 Structure product groups

In the ad group, go to **Product groups** and click the pencil icon to edit.

**Default structure (simple):**

| Level | Structure | When to use |
|-------|-----------|-------------|
| All products | Single group | Starting point, insufficient data |

**Recommended structure (standard):**

| Option A | Option B |
|----------|----------|
| All products > Brand > Product Type (optional) > Item ID | All products > Product Type > Brand (optional) > Item ID |

Choose based on your catalog organization and analysis needs.

**Performance structure (advanced):**

| Level | Subdivide by | Why |
|-------|--------------|-----|
| All products | Custom label 0 | Performance tiers (Hero/Sidekick) |
| → Each label | Brand or Product type | Secondary organization |

> ↪️ **For performance-based structure:** See [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md).

### 2.3 Configure product groups

For each product group:

1. Click on the product group
2. Set **Max CPC** bid (if using Manual CPC)
3. Verify products are correctly included/excluded

### 2.4 Verify product coverage

After structuring:

1. Check **Products** tab in the ad group
2. Verify expected products appear
3. Confirm no products are missing (check feed diagnostics if so)

---

## Phase 3️⃣: Creative Setup

Standard Shopping campaigns do not have manual creative. Product listings are generated from your product feed.

> ↪️ **For feed optimization:** See [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md).

---

## Phase 4️⃣: Bidding and Budget

### 4.1 Select bid strategy

| Situation | Recommended bid strategy | Why |
|-----------|-------------------------|-----|
| New account, <30 conversions/month | Manual CPC | Works at any volume, full control |
| 30-50 conversions/month | Maximize Clicks | Build conversion history |
| 50+ conversions/month | Target ROAS | Sufficient data for Smart Bidding |

**Available bid strategies for Standard Shopping:**

- Manual CPC
- Maximize Clicks
- Target ROAS

> ↪️ **For volume thresholds:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

### 4.2 Configure bid strategy

**If Manual CPC:**

1. Go to campaign settings → **Bidding**
2. Select **Manual CPC**
3. Set default bid at ad group level
4. Set product group-level bids based on value

**If Target ROAS:**

1. Go to campaign settings → **Bidding**
2. Select **Maximize conversion value**
3. Check **Set a target return on ad spend**
4. Enter target ROAS (start at actual ROAS minus 10-20%)

### 4.3 Set budget

| Setting | Recommendation |
|---------|----------------|
| **Daily budget** | Revenue goal / Target ROAS |

Example: €500/day revenue at 400% ROAS = €125/day budget

---

## Phase 5️⃣: Brand Separation and Exclusions

### 5.1 Add brand negatives (if non-brand campaign)

If running separate brand and non-brand campaigns, use a negative keyword list:

1. Go to **Tools & Settings** → **Shared library** → **Negative keyword lists**
2. Create list: `Branded` (or `[Client] - Branded`)
3. Add brand terms as **broad match** (no brackets or quotes):
   - `brand name`
   - Brand misspellings
   - Brand + product combinations
4. Apply to all non-brand Shopping campaigns

> 💡 **Use broad match for brand negatives:** Broad match catches more variations than exact or phrase match.

> ↪️ **For complete brand separation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### 5.2 Create universal negative keyword list

For negatives shared across campaigns:

1. Go to **Tools & Settings** → **Shared library** → **Negative keyword lists**
2. Create list: `[Client] - Shopping Negatives`
3. Add universal negatives (wrong intent, competitors you don't carry)
4. Apply to all Shopping campaigns

---

## Phase 6️⃣: Launch and Verify

### 6.1 Pre-launch checklist

- [ ] Campaign name follows naming convention
- [ ] Correct Merchant Center account selected
- [ ] Country of sale matches feed
- [ ] Networks configured (Display disabled)
- [ ] Location targeting set correctly
- [ ] Product groups structured appropriately
- [ ] Bid strategy selected
- [ ] Budget set
- [ ] Negative keywords added (if brand separation)

### 6.2 Enable campaign

1. Review all settings
2. Set status to **Enabled**
3. Set start date (immediate or scheduled)

### 6.3 Post-launch verification (24-48 hours)

- [ ] Campaign status shows **Eligible**
- [ ] Products approved and serving (check Products tab)
- [ ] Impressions appearing (may take 24 hours)
- [ ] No unexpected disapprovals
- [ ] Budget pacing correctly

### 6.4 Monitoring cadence

| Timeframe | Frequency | Focus |
|-----------|-----------|-------|
| Day 1 | Check after 24 hours | Products serving, impressions |
| Days 2-3 | Daily | Search terms, product performance |
| Day 7 | First review | Performance trends |
| Days 14-30 | Every few days | Bid strategy learning |

> ↪️ **For complete monitoring guidance:** See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md).

### 6.5 Day 3 review

- [ ] Review search terms report
- [ ] Add negatives for irrelevant queries
- [ ] Check product-level performance
- [ ] Verify bid strategy learning (if Smart Bidding)

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Campaign created with correct settings
- [ ] Product groups structured appropriately
- [ ] Bid strategy configured
- [ ] Budget set
- [ ] Negative keywords added (brand separation if applicable)
- [ ] Campaign enabled and serving
- [ ] Day 3 search terms reviewed

---

## Exit → Entry Bridge

| Timeframe | Action |
|-----------|--------|
| Day 1-3 | Monitor for disapprovals, verify serving |
| Day 7 | First performance review |
| Day 14-30 | Evaluate bid strategy performance |
| When 50+ conversions/month | Consider tROAS if using Manual CPC |
| When segmentation needed | Run [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Products not serving | Check feed diagnostics, Merchant Center |
| Poor search term relevance | Add negatives, review product titles |
| Low ROAS | Check bid strategy, product group bids |
| Learning period issues | See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) |

---

## FAQ

**Q: Should I start with Manual CPC or Smart Bidding?**

A: Start with Manual CPC if volume is low (<30 conversions/month) or you need to learn product-level performance.

**Q: What's the difference between campaign priority and product group structure?**

A: Campaign priority controls which campaign enters the auction first (for query sculpting across multiple campaigns). Product group structure controls bidding within a single campaign.

**Q: How long before I see results?**

A: Initial impressions: 24-48 hours. Learning period: 1-2 weeks. Performance stabilization: 30 days.

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Reference | All phases |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 |
| [Network Selection Reference](../references/Network Selection Reference.md) | Reference | Phase 1 |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference | Phase 5 |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 6 |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference | Phase 4 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Prerequisite (feed must exist) |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Alternative (automated Shopping) |
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
