# SOP – Launch a Demand Gen Campaign
Created: 2026-02-05
Updated: 2026-04-01

SOP_ID: SOP_57
Status: Done
Category: Operational
Primary Outcome: Live Demand Gen campaign optimized for conversions across YouTube, Discover, and Gmail
Secondary Outcomes: Lookalike segments configured, creative mix deployed, conversion tracking verified
Agent_Executable: No
Human_Approval_Required: Yes
Domain: Upper Funnel
Pillar: 6

## Purpose

This SOP launches a Demand Gen campaign for conversion-focused upper funnel goals, with proper audience setup, lookalike configuration, and creative mix.

> ❓ **The big question:** How do I set up a conversion-optimized campaign that reaches new audiences across YouTube, Discover, and Gmail?

Demand Gen is Google's conversion-focused upper funnel campaign type. It is the only way to access lookalike segments in Google Ads.

---

## What this SOP is NOT

This SOP does **not:**

- Cover awareness-focused video campaigns (See: [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md))
- Explain upper funnel strategy (See: [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md))
- Cover audience creation (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))

## When to run this SOP

Run this SOP when:

- Launching conversion-focused upper funnel campaigns
- Testing lookalike audiences (exclusive to Demand Gen)
- Expanding beyond Search/Shopping with conversion optimization
- Re-engaging customers with product feed integration

---

## Before you start

### Required inputs

- Conversion goal with working tracking (verify conversion actions are firing before proceeding)
- Target audiences (or seed audiences for lookalikes)
- Image AND video assets (both recommended)
- Landing page URL
- Budget allocation (minimum for 50+ conversions/month)

> ⚠️ **Verify conversion tracking before campaign creation:** Demand Gen optimizes for selected conversions. Confirm your primary conversion action is firing correctly in Google Ads → Tools & Settings → Conversions.

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Campaign structure decisions |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Location, language settings |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Targeting options |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Learning period and monitoring |

---

## Decision gate: Campaign structure

Determine your campaign structure:

| If your goal is... | Then create... | Audience focus | Channel consideration |
|-------------------|----------------|----------------|----------------------|
| Re-engage existing customers | Remarketing Demand Gen | Hot/Warm audiences | All channels or YouTube focus |
| Find new prospects similar to converters | Prospecting Demand Gen | Lookalike segments | Test channel combinations via ad groups |
| Expand with Google's AI | Expansion Demand Gen | Optimized targeting | All channels |

> ⚠️ **Demand Gen needs higher volume than other campaign types:** Target 50+ conversions per ad group per 30 days. Consolidate aggressively.

> 💡 **Channel selection happens at ad group level:** Structure ad groups by audience AND/OR by channel combination for testing.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign shell and settings** | Configure campaign settings | Campaign shell |
| **Phase 2️⃣: Structure and targeting** | Configure audiences and lookalikes | Audience structure |
| **Phase 3️⃣: Creative setup** | Add image and video assets | Complete creative mix |
| **Phase 4️⃣: Bidding and budget** | Configure bid strategy | Bidding set |
| **Phase 5️⃣: Exclusions** | Add audience exclusions | Exclusions active |
| **Phase 6️⃣: Launch and verify** | Final checks and go-live | Campaign live |

---

## Phase 1️⃣: Campaign Shell and Settings

### 1.1 Create new campaign

1. In Google Ads, click **+ New campaign**
2. Select **Sales** or **Leads** (conversion goal)
3. Select **Demand Gen** as campaign type

### 1.2 Configure campaign settings

| Setting | Recommendation | Notes |
|---------|----------------|-------|
| **Campaign name** | `[Country]_[Language]_DemandGen_[Tier]` | e.g., "US_EN_DemandGen_Prospecting" |
| **Locations** | Your target markets | |
| **Languages** | Audience languages | |

> ↪️ **For location and language details:** See [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md).

### 1.3 Configure conversion goals

1. Confirm correct conversion actions are selected
2. Verify conversion tracking is working
3. Set conversion value (if applicable)

> ⚠️ **Demand Gen optimizes for selected conversions:** Ensure only your primary conversion goal is selected.

**Verification:** Campaign shell created with correct name, location, language, and only the primary conversion goal selected.

---

## Phase 2️⃣: Structure and Targeting

### 2.1 Create ad group

1. Name ad group: `[Audience Type] - [Specific Audience]`
2. Configure audiences based on campaign tier

### 2.2 Remarketing audiences

For remarketing campaigns:

| Audience | Priority | Use case |
|----------|----------|----------|
| Cart/Form abandoners | 1 | Highest intent recovery |
| Product/Page viewers | 2 | Re-engage interested users |
| All site visitors | 3 | Broad remarketing |
| Customer Match | 4 | Retention, upsell |
| YouTube engaged | 5 | Video viewers |

### 2.3 Lookalike segments (Demand Gen exclusive)

For prospecting campaigns:

**Step 1️⃣: Select seed audience**

| Seed type | Minimum size | Quality |
|-----------|--------------|---------|
| Purchasers/Converters | 1,000+ users | Best |
| High-value customers | 1,000+ users | Best |
| Website visitors | 1,000+ users | Good |
| YouTube engaged | 1,000+ users | Good |

**Step 2️⃣: Configure reach**

| Reach setting | Similarity signal | Volume | Recommendation |
|---------------|-------------------|--------|----------------|
| Narrow | Strongest | Lowest | Conservative start |
| Balanced | Medium | Medium | Default starting point |
| Broad | Weakest | Highest | Only if volume-constrained |

> 💡 **Seed quality matters more than reach setting:** Start with Balanced and invest in seed quality first. See [Audience Targeting Reference](../references/Audience Targeting Reference.md) for lookalike configuration details.

### 2.4 Additional prospecting options

| Audience type | Example | When to add |
|---------------|---------|-------------|
| Custom segments | Competitor URLs, search terms | Supplement lookalikes |
| In-market audiences | Category buyers | Broader prospecting |

### 2.5 Configure Optimized Targeting

| Campaign tier | Optimized Targeting |
|---------------|---------------------|
| Remarketing | OFF |
| Prospecting (lookalikes) | Test OFF first, then ON |
| Expansion | ON |

> ⚠️ **Optimized Targeting significantly expands audience:** Keep OFF for remarketing.

> 💡 **Optimized Targeting can be set at ad group level:** This allows A/B testing different audience approaches within the same campaign.

### 2.6 Configure channel selection (ad group level)

At the ad group level, you can control which channels your ads serve on:

| Option | What it includes |
|--------|------------------|
| **All Google channels** | YouTube (in-stream, in-feed, Shorts), Discover, Gmail, GDN |
| **Specific channels** | Select individual channels for testing |

**Available channels:**

- YouTube in-stream
- YouTube in-feed
- YouTube Shorts
- Discover
- Gmail
- GDN

> 💡 **Use separate ad groups to test different channel combinations:** This provides clearer performance data per channel.

### 2.7 Set Target CPA/ROAS at ad group level (optional)

Target CPA or Target ROAS can be set at the ad group level to override campaign-level targets.

| Use case | Setting |
|----------|---------|
| Different products with different margins | Set different tCPA/tROAS per ad group |
| Testing audience performance | Set looser targets for prospecting ad groups |

> ↪️ **For audience targeting options:** See [Audience Targeting Reference](../references/Audience Targeting Reference.md).

**Verification:** Audiences configured per tier, lookalike reach set to Balanced (if using), Optimized Targeting set intentionally, and channel selection confirmed.

---

## Phase 3️⃣: Creative Setup

### 3.1 Creative format requirements

Demand Gen requires multiple asset types for full reach:

| Asset type | Requirement | Serves on |
|------------|-------------|-----------|
| Images (landscape) | Required | Discover, Gmail, YouTube |
| Images (square) | Required | Discover, Gmail |
| Images (portrait) | Recommended | Discover (mobile) |
| Video (landscape) | Recommended | YouTube |
| Video (vertical) | Recommended | YouTube Shorts |
| Logos | Required | All placements |
| Headlines | Required | All placements |
| Descriptions | Required | All placements |

### 3.2 Add image assets

| Format | Size | Minimum | Recommended |
|--------|------|---------|-------------|
| Landscape | 1200×628 px | 1 | 3-5 |
| Square | 1200×1200 px | 1 | 3-5 |
| Portrait | 960×1200 px | 0 | 3-5 |

> ↪️ **For image specifications:** See [Image Creative Reference](../references/Image Creative Reference.md).

### 3.3 Add video assets

| Format | Aspect ratio | Minimum | Recommended |
|--------|--------------|---------|-------------|
| Landscape | 16:9 | 0 | 1-3 |
| Square | 1:1 | 0 | 1-3 |
| Vertical | 9:16 | 0 | 1-3 |

> 💡 **Include both images AND videos:** Demand Gen serves across YouTube, Discover, and Gmail. Both formats maximize reach.

> ↪️ **For video specifications:** See [Video Creative Reference](../references/Video Creative Reference.md).

### 3.4 Add text assets

| Asset | Character limit | Quantity |
|-------|-----------------|----------|
| Headlines | 40 characters | 3-5 |
| Descriptions | 90 characters | 3-5 |
| Business name | 25 characters | 1 |
| Call-to-action | Select from list | 1 |
| Final URL | Landing page | 1 |

> ↪️ **For headline and description patterns:** See [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) and [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md).

### 3.5 Creative by campaign tier

| Tier | Creative approach |
|------|-------------------|
| Remarketing | Product-specific, urgency, offers |
| Prospecting | Problem/Solution, credibility, social proof |
| Expansion | Broad appeal, brand introduction |

### 3.6 Product feed (Ecommerce)

For Ecommerce remarketing:

1. Connect Merchant Center feed at campaign level
2. Enable dynamic creative
3. Ensure feed has required attributes:
   - id, title, description
   - image_link, price, link

**Verification:** Both image and video assets uploaded, all required text assets filled, and ad preview renders correctly across YouTube, Discover, and Gmail placements.

---

## Phase 4️⃣: Bidding and Budget

### 4.1 Select bid strategy

| Goal | Bid strategy | Target |
|------|--------------|--------|
| Maximize clicks | Maximize Clicks | Optional: Target CPC cap |
| Maximize conversions | Maximize Conversions | Optional: Target CPA |
| Maximize conversion value | Maximize Conversion Value | Optional: Target ROAS |

**Configuration:**

1. Select bid strategy based on goal
2. For Maximize Clicks: Optionally set a Target CPC cap
3. For Maximize Conversions: Optionally set Target CPA
4. For Maximize Conversion Value: Optionally set Target ROAS

### 4.2 Set budget

Calculate recommended budget:

```
Recommended Budget = 50 conversions × Target CPA
```

**Example:** If Target CPA is €20, recommended monthly budget is €1,000 (€33/day)

**From a ROAS perspective:** If targeting 400% ROAS and €10,000/month revenue goal, budget = €2,500/month (€83/day)

| If expected conversions are... | Then... |
|-------------------------------|---------|
| 50+ per ad group | ✅ Proceed |
| 30-50 per ad group | ⚠️ Consider consolidating |
| <30 per ad group | ❌ Consolidate or increase budget |

> ↪️ **For volume thresholds:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

**Verification:** Bid strategy set with appropriate target, and daily budget supports 50+ conversions per month.

---

## Phase 5️⃣: Exclusions

### 5.1 Audience exclusions

Add at campaign level:

| Exclude | All campaigns |
|---------|---------------|
| Recent converters | ✅ Yes (7-30 days based on sales cycle) |
| Remarketing audiences | ✅ Yes (in prospecting campaigns) |

**Verification:** Recent converter exclusion and remarketing audience exclusion (for prospecting) applied at campaign level.

---

## Phase 6️⃣: Launch and Verify

### 6.1 Pre-launch checklist

- [ ] Conversion tracking is verified working
- [ ] Audiences are correctly configured
- [ ] Lookalike reach is set to Balanced (if using)
- [ ] Lookalike targeting mode evaluated (suggestion vs strict)
- [ ] Optimized Targeting is set intentionally
- [ ] Both image and video assets are included
- [ ] Exclusions are in place
- [ ] Budget supports 50+ conversions/month goal

### 6.2 Enable campaign

1. Review all settings in campaign preview
2. Verify ad preview shows correctly across placements
3. Set campaign status to **Enabled**
4. Monitor closely for first 48-72 hours

### 6.3 Monitoring cadence

| Timeframe | Focus |
|-----------|-------|
| 48-72 hours | Delivery, policy issues |
| 7 days | Conversion volume vs expectations |
| 14 days | Efficiency, adjust targeting if needed |
| 30 days | Full performance review, expand or scale |

> ↪️ **For complete monitoring guidance:** See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md).

**Verification:** Campaign status is Enabled, ads are approved across all placements, and conversion tracking is recording events.

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Campaign is live with correct settings
- [ ] Audiences and lookalikes are configured
- [ ] Both image and video assets are serving
- [ ] Exclusions are in place
- [ ] Conversion tracking is verified
- [ ] Budget supports volume requirements
- [ ] Campaign passes launch checklist

---

## Exit → Entry Bridge

| Timeframe | Action |
|-----------|--------|
| 48-72 hours | Monitor for delivery, check for policy issues |
| 7 days | Check conversion volume vs expectations |
| 14 days | Evaluate efficiency, adjust targeting if needed |
| 30 days | Full performance review, expand or scale |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Low conversion volume | Check budget, expand targeting |
| High CPA | Review audiences, tighten lookalike reach |
| Low reach | Add more creative formats, expand audiences |
| Creative disapprovals | Review policy, fix assets |
| Learning period issues | See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Not enough conversions | Insufficient budget or volume | Ensure 50+ conv/month potential |
| Only images, no video | Incomplete asset set | Include both formats |
| Broad lookalikes first | Weakest similarity signal from day one | Start with Balanced, invest in seed quality first |
| Optimized Targeting ON for remarketing | Loses audience precision | Keep OFF for remarketing |
| Wrong conversion action | Optimizing for secondary action | Verify conversion selection |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Mental Model | Decision gate |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Phase 2 |
| [Network Selection Reference](../references/Network Selection Reference.md) | Reference | Phase 2 (channel selection) |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 6 |
| [Image Creative Reference](../references/Image Creative Reference.md) | Reference | Phase 3 |
| [Video Creative Reference](../references/Video Creative Reference.md) | Reference | Phase 3 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | Upstream (audience creation) |
| [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) | Upstream (seed audience creation) |
| [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) | Parallel (alternative channel) |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Parallel (awareness-only alternative) |

---

## Version details

- **Version:** 5.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
