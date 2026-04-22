# SOP – Launch PMax for Lead Gen/SaaS
Created: 2026-02-04
Updated: 2026-02-05

SOP_ID: SOP_54
Status: Done
Category: Operational
Primary Outcome: Fully configured PMax campaign for Lead Gen or SaaS with lead quality optimization
Secondary Outcomes: Brand separation implemented, audience signals configured, asset groups structured
Agent_Executable: No
Human_Approval_Required: No
Domain: PMax
Pillar: 6

## Purpose

This SOP launches a Performance Max campaign for Lead Gen or SaaS with proper lead quality tracking and audience signals.

> ❓ **The big question:** How do I set up PMax for Lead Gen/SaaS to generate actual business results rather than raw leads?

Lead Gen and SaaS PMax is different from Ecommerce. There is no product feed. Success depends entirely on lead quality signals, audience targeting, and creative assets.

---

## What this SOP is NOT

This SOP does **not:**

- Configure offline conversion import (prerequisite: must be done first)
- Explain when to use PMax (See: [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>))
- Set up Ecommerce PMax (See: [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) or [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md))

## When to run this SOP

**Run when:**

- You have offline conversion import configured (MQL, SQL, or revenue)
- You have 30+ conversions/month on your quality signal
- Search campaigns are performing and you want incremental reach
- You have quality audience signals ready

**Do NOT run when:**

- Offline conversion import is not configured
- Form submissions are your only metric
- <30 conversions/month on quality signal
- No audience signals available

---

## Before you start

### Required inputs

- Offline conversion import configured and verified
- 30+ conversions/month on quality signal
- Customer Match or website audience (1,000+ users)
- Creative assets prepared (images, video, text)
- Brand terms identified for exclusions

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Structure decisions |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Location, language settings |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Signal configuration |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand exclusions |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Learning period and monitoring |

---

## Decision gate: Campaign structure

Before creating the campaign, determine your structure:

| If... | Then... |
|-------|---------|
| Single offer, unified audience | Single campaign, multiple asset groups by angle |
| Multiple offers, different margins | Multiple campaigns by offer |
| Multiple audiences, same offer | Single campaign, asset groups by audience |

> ⚠️ **Each campaign needs 30+ conversions/month on your quality signal:** Don't split if you can't meet this threshold.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign shell and settings** | Create campaign with correct settings | Campaign created |
| **Phase 2️⃣: Structure and targeting** | Build asset groups | Asset groups structured |
| **Phase 3️⃣: Creative setup** | Add images, video, text | Assets uploaded |
| **Phase 4️⃣: Bidding and budget** | Configure bid strategy | Bidding set |
| **Phase 5️⃣: Brand separation and exclusions** | Add brand exclusions and audience signals | Exclusions and signals active |
| **Phase 6️⃣: Launch and verify** | Enable and validate | Campaign live |

---

## Phase 1️⃣: Campaign Shell and Settings

### 1.1 Verify prerequisites

**Critical gates (stop if any fail):**

- [ ] Offline conversion import verified working
- [ ] 30+ conversions/month on quality signal
- [ ] Customer Match or website audience (1,000+ users)
- [ ] Brand Search campaign protected

### 1.2 Verify conversion tracking

1. Go to **Tools & Settings** → **Conversions**
2. Verify your quality conversion (MQL, SQL, or revenue) is:
   - Status: Active
   - Recording conversions in last 7 days
   - Value assigned (if using value-based bidding)

### 1.3 Create the campaign

1. Go to Google Ads → **Campaigns** → **+** → **New campaign**
2. Select goal: **Leads** or **Sales** (based on conversion type)
3. Select conversion goals (choose your quality conversion, e.g., SQL)
4. Select campaign type: **Performance Max**
5. Click **Continue**

### 1.4 Configure campaign settings

| Setting | Value | Notes |
|---------|-------|-------|
| **Campaign name** | `[Country]_[Language]_PMax_[Offer]` | e.g., "US_EN_PMax_DemoRequests" (no _[Audience] suffix) |
| **Locations** | Target countries/regions | Where you can serve |
| **Languages** | All audience languages | |

> ↪️ **For location and language details:** See [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md).

### 1.5 Configure asset optimization settings

Review and configure asset optimization settings before building asset groups.

> ↪️ **For asset optimization configuration:** See [Asset Optimization Control Guidelines](../guidelines/Asset Optimization Control Guidelines.md) and [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md).

---

## Phase 2️⃣: Structure and Targeting

### 2.1 Create first asset group

1. Name: `[Offer/Service] - [Audience/Angle]`
2. Example: "Demo Request - Features Focus"

### 2.2 Set Final URL

1. Enter your landing page URL
2. **Final URL expansion:**
   - ON: If you have multiple relevant landing pages
   - OFF: If specific landing page required

---

## Phase 3️⃣: Creative Setup

### 3.1 Add text assets

**Headlines (minimum 3, recommended 5-11, max 30 characters):**

| Type | Example |
|------|---------|
| Brand/Product | "PPC Mastery OS Software" |
| Benefit | "Scale Your Campaigns Faster" |
| Feature | "AI-Powered Optimization" |
| CTA | "Get Your Free Demo Today" |
| Social proof | "Trusted by 500+ Agencies" |

> ↪️ **For headline patterns:** See [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md).

**Long headlines (minimum 1, recommended 2-5, max 90 characters):**

| Type | Example |
|------|---------|
| Value prop | "The Google Ads OS That Helps Agencies Scale Campaigns and Maximize Client ROAS" |
| Problem-solution | "Stop Losing Time to Manual Optimization and Start Scaling Your Agency Profitably" |

**Descriptions (minimum 2, recommended 4, max 90 characters):**

| Type | Example |
|------|---------|
| Primary benefit | "Automate your Google Ads optimization and never miss a scaling opportunity again". |
| Features | "Constraint-driven diagnosis, decision frameworks, and execution SOPs all in one system". |
| Social proof | "Join 500+ agencies using PPC Mastery OS to scale their clients' campaigns profitably". |
| CTA | "Start your free trial today. No credit card required to get started". |

> ↪️ **For description patterns:** See [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md).

### 3.2 Add image assets

**Upload:**

- 3+ landscape images (1200×628)
- 3+ square images (1200×1200)
- 1+ portrait images (960×1200) if available

**Image content:**

- Product screenshots
- Team/people photos
- Lifestyle/context images
- Branded graphics

> ↪️ **For image specifications:** See [Image Creative Reference](../references/Image Creative Reference.md).

### 3.3 Add logo

1. Upload square logo (1200×1200)
2. Optional: Upload landscape logo (1200×300)

### 3.4 Add video (recommended)

1. Upload video to YouTube first
2. Paste YouTube URL in PMax
3. Recommended: 15-60 second video

> ⚠️ **If you skip video:** Google auto-generates from your images. This typically underperforms.

> ↪️ **For video specifications:** See [Video Creative Reference](../references/Video Creative Reference.md).

### 3.5 Add business information

| Field | Value |
|-------|-------|
| Business name | Your company name |
| Call to action | Appropriate CTA (e.g., "Learn more", "Sign up") |
| Display URL path | Optional brand/offer path |

### 3.6 Create additional asset groups (if applicable)

For multi-asset-group structure:

1. Click **New asset group**
2. Repeat steps 2.1-3.5
3. Use different angles, audiences, or offers per group

---

## Phase 4️⃣: Bidding and Budget

### 4.1 Configure bidding

| Scenario | Strategy | Target |
|----------|----------|--------|
| 30-50 conversions/month | Maximize Conversions | Optional Target CPA |
| 50+ conversions/month | Maximize Conversion Value | Optional Target ROAS (if tracking values) |

**Configuration:**

1. Select bid strategy based on volume
2. If using Target CPA: Set target at actual CPA + 10-20%
3. If using tROAS: Set based on actual value/cost

> ↪️ **For volume thresholds:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

### 4.2 Set budget

| Consideration | Recommended approach |
|---------------|----------------------|
| New campaign | €50/day minimum to learn |
| Scaling | Based on target CPA/ROAS and volume/value goals |

---

## Phase 5️⃣: Brand Separation and Exclusions

### 5.1 Add brand exclusions

1. In campaign settings → **Brand exclusions**
2. Click **Exclude specific brands**
3. Search for and add your brand name
4. Add brand variations and misspellings

### 5.2 Verify Brand Search protection

1. Confirm Brand Search campaign exists
2. Verify brand keywords are exact match
3. Ensure Brand Search has sufficient budget

> ↪️ **For complete brand separation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### 5.3 Configure audience signals

Go to asset group settings and configure signals in priority order:

**Customer Match (highest priority):**

1. Click **Your data** → Select Customer Match list
2. Prefer: Closed customers or SQLs list

**Website audiences:**

1. Click **Your data** → Select website audiences
2. Add: Converters, high-intent visitors

**Custom segments:**

1. Click **Custom segments** → Create new
2. Add: Competitor URLs, relevant search terms

**In-market audiences:**

1. Click **Interests & detailed demographics**
2. Select relevant in-market categories

> ↪️ **For audience signal configuration:** See [Audience Signals Reference](../references/Audience Signals Reference.md).

---

## Phase 6️⃣: Launch and Verify

### 6.1 Pre-launch checklist

- [ ] All prerequisites verified (offline conversion import, audiences)
- [ ] Campaign settings correct
- [ ] Asset groups complete with all asset types
- [ ] Audience signals added
- [ ] Brand exclusions configured
- [ ] Budget set

### 6.2 Enable campaign

1. Review all settings
2. Set status to **Enabled**
3. Set start date

### 6.3 Post-launch verification (24-48 hours)

- [ ] Campaign status: Eligible
- [ ] Assets approved (no policy flags)
- [ ] Impressions appearing
- [ ] Budget spending as expected

### 6.4 Monitoring cadence

| Timeframe | Focus |
|-----------|-------|
| 24-48 hours | Verify assets approved, impressions appearing |
| Week 1 | Check asset performance, verify no brand queries |
| Week 2-4 | Learning period, minimal changes |
| Week 4 | First comprehensive review, evaluate conversion quality |

> ↪️ **For complete monitoring guidance:** See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md).

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Prerequisites verified (offline conversion import, audiences)
- [ ] Campaign created with appropriate settings
- [ ] Asset groups complete with all assets
- [ ] Audience signals configured
- [ ] Brand exclusions active
- [ ] Campaign enabled and serving
- [ ] Week 1 verification passed

---

## Exit → Entry Bridge

| Timeframe | Action |
|-----------|--------|
| Week 1-2 | Learning period, minimal changes |
| Week 3-4 | Continue learning, begin noting patterns |
| Day 30 | First performance evaluation |
| Ongoing | Optimize assets, refine signals |

**If issues arise:**

| Issue | Action |
|-------|--------|
| High volume, low quality | Verify offline conversion import working |
| Brand queries appearing | Re-verify brand exclusions |
| No learning | Check volume, consider consolidation |
| Asset disapprovals | Fix policy issues, resubmit |
| Learning period issues | See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) |

---

## FAQ

**Q: What if I don't have offline conversion import?**

A: Do not launch PMax. Configure offline conversion import first. PMax without quality signals will generate low-quality leads.

**Q: How many asset groups should I have?**

A: Start with 1-2. Only add more if each can get 30+ conversions/month.

**Q: What if my Customer Match list is small?**

A: Minimum 1,000 matched users. If smaller, focus on website audiences while growing your list.

**Q: How long before I can evaluate performance?**

A: Wait 30 days minimum. Learning period is 2-4 weeks. Evaluate conversion quality, not just volume.

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Mental Model | Phase 1 |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference | Phase 5 |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference | Phase 5 |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 6 |
| [Image Creative Reference](../references/Image Creative Reference.md) | Reference | Phase 3 |
| [Video Creative Reference](../references/Video Creative Reference.md) | Reference | Phase 3 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Alternative (Ecommerce Feed-Only) |
| [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) | Alternative (Ecommerce Full Assets) |

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
