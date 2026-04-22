# SOP – Launch a Display Campaign
Created: 2026-02-05
Updated: 2026-04-01

SOP_ID: SOP_55
Status: Done
Category: Operational
Primary Outcome: Live Display campaign with proper targeting, exclusions, and creative
Secondary Outcomes: Brand safety protections in place, remarketing/prospecting structure established
Agent_Executable: No
Human_Approval_Required: Yes
Domain: Upper Funnel
Pillar: 6

## Purpose

This SOP launches a Display campaign with proper audience targeting, content exclusions, and creative setup for remarketing or prospecting goals.

> ❓ **The big question:** How do I set up a Display campaign that reaches the right audience in brand-safe environments?

Display campaigns interrupt users during browsing, so targeting precision and content exclusions are critical for efficiency and brand safety.

---

## What this SOP is NOT

This SOP does **not:**

- Explain upper funnel strategy decisions (See: [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md))
- Cover audience creation (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))
- Detail image creative specifications (See: [Image Creative Reference](../references/Image Creative Reference.md))
- Cover Video or Demand Gen campaigns (See: respective SOPs)

## When to run this SOP

Run this SOP when:

- Launching a new Display remarketing campaign
- Launching a new Display prospecting campaign

---

## Before you start

### Required inputs

- Clear campaign goal (remarketing, prospecting, or awareness)
- Target audiences created in Google Ads
- Image assets meeting specifications
- Landing page URL
- Budget allocation

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Campaign structure decisions |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Location, language settings |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Targeting options |
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Recommended exclusion settings |
| [Frequency Capping Reference](../references/Frequency Capping Reference.md) | Frequency management |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Learning period and monitoring |

---

## Decision gate: Campaign tier

Before starting, determine your campaign tier:

| If your goal is... | Then create... | Audience focus |
|-------------------|----------------|----------------|
| Re-engage site visitors | Remarketing campaign | Hot/Warm audiences |
| Find new prospects with intent signals | Prospecting campaign | Cool audiences |
| Build broad awareness | Awareness campaign | Cold audiences |

> ⚠️ **Start with remarketing before prospecting:** Remarketing to known audiences is more efficient.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign shell and settings** | Configure campaign settings | Campaign shell created |
| **Phase 2️⃣: Structure and targeting** | Set audiences and content targeting | Targeting structure |
| **Phase 3️⃣: Creative setup** | Add Responsive Display Ads | Creative uploaded |
| **Phase 4️⃣: Bidding and budget** | Configure bid strategy | Bidding set |
| **Phase 5️⃣: Content exclusions** | Add mandatory exclusions | Brand safety configured |
| **Phase 6️⃣: Launch and verify** | Enable and validate | Campaign live |

---

## Phase 1️⃣: Campaign Shell and Settings

### 1.1 Create new campaign

1. In Google Ads, click **+ New campaign**
2. Select campaign objective based on goal:

| Campaign goal | Select objective |
|---------------|------------------|
| Remarketing (conversions) | Sales or Leads |
| Prospecting (conversions) | Sales or Leads |
| Awareness | Awareness and consideration |

3. Select **Display** as campaign type
4. Select **Standard Display campaign** as campaign subtype

### 1.2 Configure campaign settings

| Setting | Recommendation | Notes |
|---------|----------------|-------|
| **Campaign name** | `[Country]_[Language]_Display_[Tier]` | e.g., "US_EN_Display_Remarketing" |
| **Locations** | Your target markets | |
| **Languages** | Audience languages | |

> ↪️ **For location and language details:** See [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md).

### 1.3 Configure frequency capping

| Campaign tier | Daily cap | Weekly cap |
|---------------|-----------|------------|
| Remarketing | 5-7 | 15-20 |
| Prospecting | 3-5 | 10-15 |
| Awareness | 2-3 | 7-10 |

**How to configure:**

1. Go to campaign settings → Additional settings
2. Find "Frequency management"
3. Click "Set a custom limit"
4. Enter impressions and time period

> ↪️ **For frequency capping details:** See [Frequency Capping Reference](../references/Frequency Capping Reference.md).

**Verification:** Campaign shell visible in Google Ads with correct name, location, language, and frequency cap settings.

---

## Phase 2️⃣: Structure and Targeting

### 2.1 Create ad group

1. Name ad group after target audience: `[Audience Name]`
2. Set ad group bid (if using manual bidding)

### 2.2 Add audience targeting

Based on campaign tier:

**For Remarketing:**

| Priority | Audience type | Example |
|----------|---------------|---------|
| 1 | Cart/Form abandoners | "Cart Abandoners - 7 days" |
| 2 | Product/page viewers | "Product Viewers - 14 days" |
| 3 | All site visitors | "All Visitors - 30 days" |
| 4 | Customer Match | "Customer List" |

**For Prospecting:**

| Priority | Audience type | Example |
|----------|---------------|---------|
| 1 | Custom segments | "Custom - Competitor URLs" |
| 2 | In-market audiences | "In-Market - Home Services" |
| 3 | Life events | "Recently Moved" |

**For Awareness:**

| Audience type | Example |
|---------------|---------|
| Affinity audiences | "Home Decor Enthusiasts" |
| Demographics | Age, gender, household income |

> ↪️ **For audience targeting options:** See [Audience Targeting Reference](../references/Audience Targeting Reference.md).

### 2.3 Configure Optimized Targeting

| Campaign tier | Optimized Targeting |
|---------------|---------------------|
| Remarketing | OFF |
| Prospecting | Test ON/OFF |
| Awareness | ON |

> 💡 **Turn Optimized Targeting OFF for remarketing:** You want to reach your specific audience. See [Audience Targeting Reference](../references/Audience Targeting Reference.md) for details on how Optimized Targeting expands reach.

### 2.4 Content targeting (optional)

Add content targeting only if you want to layer WHERE ads appear on top of WHO sees them:

| If you want... | Add... | Logic |
|----------------|--------|-------|
| Specific sites | Placements (20-50 vetted sites) | Can narrow (AND) with audiences |
| Category context | Topics (3-5 relevant) | Can narrow (AND) with audiences |
| Keyword context | Keywords (5-20 terms) | OR logic with audiences by default |

> ⚠️ **When Optimized Targeting is ON, targeting can be overridden:** Turn Optimized Targeting OFF if you need strict control. See [Audience Targeting Reference](../references/Audience Targeting Reference.md) for AND/OR logic details.

**Verification:** Ad group created with correct audience segments attached and Optimized Targeting set per tier recommendation.

---

## Phase 3️⃣: Creative Setup

### 3.1 Create Responsive Display Ads

1. Click **+ New ad** → **Responsive display ad**
2. Add assets:

| Asset type | Requirement | Notes |
|------------|-------------|-------|
| Images (landscape) | 1-5, 1200×628 px | Required |
| Images (square) | 1-5, 1200×1200 px | Required |
| Logos (landscape) | 1-5, 512×128 px | Recommended |
| Logos (square) | 1-5, 128×128 px | Required |
| Headlines | 1-5, max 30 chars | Short and punchy |
| Long headline | 1, max 90 chars | More descriptive |
| Descriptions | 1-5, max 90 chars | Value proposition |
| Business name | 1, max 25 chars | Your brand |
| Final URL | Landing page | Match ad message |

> ↪️ **For image specifications:** See [Image Creative Reference](../references/Image Creative Reference.md).

### 3.2 Creative by campaign tier

| Tier | Creative approach |
|------|-------------------|
| Remarketing | Product-focused, urgency, specific offers |
| Prospecting | Problem-focused, credibility, introductory |
| Awareness | Brand-focused, emotional, memorable |

> ↪️ **For headline and description patterns:** See [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) and [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md).

### 3.3 Dynamic remarketing (Ecommerce)

If running Ecommerce remarketing with dynamic product ads:

1. **Connect product feed:** Link your Merchant Center feed at campaign level
2. **Enable dynamic ads:** Turn on dynamic ads in ad group settings
3. **Configure audiences:** Use product-specific audiences:
   - Product viewers (14-30 days)
   - Cart abandoners (7-14 days)
   - Past purchasers for cross-sell

**Verification:** At least one responsive display ad with all required asset slots filled (landscape image, square image, square logo, headlines, descriptions).

---

## Phase 4️⃣: Bidding and Budget

### 4.1 Select bid strategy

| Goal | Available bid strategies |
|------|--------------------------|
| **Conversions** | Target CPA, Maximize Conversions, Maximize Conversion Value |
| **Clicks** | Maximize Clicks, Manual CPC |
| **Awareness** | Target ROAS, Viewable CPM |

**For Target CPA:** You can choose to pay per viewable impression, interaction, or conversion.

**Configuration:**

1. Select bid strategy based on goal
2. If using Target CPA: Set realistic target based on historical data
3. If using Viewable CPM: Focus on brand awareness campaigns

### 4.2 Set budget

| Setting | Recommendation |
|---------|----------------|
| **Daily budget** | Ensure 10x daily CPA minimum for learning |

> ↪️ **For bid strategy selection:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

**Verification:** Bid strategy selected and daily budget set to at least 10x target CPA.

---

## Phase 5️⃣: Content Exclusions

### 5.1 Audience exclusions (mandatory)

Add at campaign level:

| Exclude | All campaigns | Prospecting only |
|---------|---------------|------------------|
| Recent converters (7-30 days) | ✅ Yes | ✅ Yes |
| All remarketing audiences | ❌ No | ✅ Yes |

### 5.2 Content exclusions (mandatory)

Configure following [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md):

**Key exclusions:**

- Mobile apps (unless app-focused)
- Parked domains and error pages
- Made-for-kids content
- Known low-quality sites

### 5.3 Account-level content suitability

Verify account-level brand safety settings:

1. Go to **Tools & Settings → Content suitability**
2. Confirm sensitive content categories are excluded
3. Set inventory type to Limited (recommended) or Standard

**Verification:** Audience exclusions applied, content exclusions configured, and account-level content suitability set to Limited or Standard.

---

## Phase 6️⃣: Launch and Verify

### 6.1 Pre-launch checklist

- [ ] Campaign name follows naming convention
- [ ] Targeting is correctly configured
- [ ] Optimized Targeting set appropriately
- [ ] Exclusions are in place (audience and content)
- [ ] Frequency capping is set
- [ ] Creative meets specifications
- [ ] Budget and bidding are set
- [ ] Conversion tracking is verified

### 6.2 Enable campaign

1. Review campaign in preview
2. Set campaign status to **Enabled**
3. Monitor for first 24-48 hours for any issues

### 6.3 Monitoring cadence

| Timeframe | Focus |
|-----------|-------|
| 24-48 hours | Delivery, policy issues, impressions |
| 7 days | Placement report, add exclusions |
| 14 days | Initial performance vs targets |
| 30 days | Full optimization review |

> ↪️ **For complete monitoring guidance:** See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md).

**Verification:** Campaign status is Enabled, ads are serving impressions within 24 hours, and no policy disapprovals.

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Campaign is live with correct targeting
- [ ] Audience exclusions are in place
- [ ] Content exclusions are configured
- [ ] Frequency capping is set
- [ ] Creative is approved and serving
- [ ] Conversion tracking is verified
- [ ] Campaign passes launch checklist

---

## Exit → Entry Bridge

| Timeframe | Action |
|-----------|--------|
| 24-48 hours | Monitor for delivery and policy issues |
| 7 days | Review placement report, add exclusions |
| 14 days | Evaluate initial performance vs targets |
| 30 days | Full optimization review |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Low impression volume | Check targeting breadth, increase budget |
| Poor placements | Add placement exclusions |
| Low CTR | Review creative, test new assets |
| High CPA | Check audience quality, landing page |
| Learning period issues | See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Ads show on low-quality sites | No placement exclusions | Add exclusions before launch |
| Wasted spend on converters | No converter exclusion | Exclude recent converters |
| Low CTR | Generic creative | Match creative to audience tier |
| Audience overlap | No remarketing exclusion in prospecting | Exclude remarketing from prospecting |
| Brand safety issues | No content exclusions | Configure account-level suitability |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Mental Model | Decision gate |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Phase 2 |
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Guideline | Phase 5 |
| [Frequency Capping Reference](../references/Frequency Capping Reference.md) | Reference | Phase 1 |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 6 |
| [Image Creative Reference](../references/Image Creative Reference.md) | Reference | Phase 3 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | Upstream (audience creation) |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Parallel (alternative upper funnel) |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Parallel (alternative upper funnel) |

---

## Version details

- **Version:** 4.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
