# SOP – Launch a Video Campaign
Created: 2026-02-05
Updated: 2026-04-01

SOP_ID: SOP_56
Status: Done
Category: Operational
Primary Outcome: Live Video campaign optimized for awareness or consideration goals
Secondary Outcomes: Frequency capping in place, brand safety configured, audience targeting active
Agent_Executable: No
Human_Approval_Required: Yes
Domain: Upper Funnel
Pillar: 6

## Purpose

This SOP launches a Video campaign for awareness or consideration goals, with proper targeting, frequency management, and brand safety.

> ❓ **The big question:** How do I set up a Video campaign that builds awareness efficiently while maintaining brand safety?

Video campaigns are for awareness and consideration. For conversion-focused video campaigns, use Demand Gen instead.

---

## What this SOP is NOT

This SOP does **not:**

- Cover conversion-focused video campaigns (See: [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md))
- Explain upper funnel strategy (See: [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md))
- Detail video creative specifications (See: [Video Creative Reference](../references/Video Creative Reference.md))
- Cover audience creation (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))

## When to run this SOP

Run this SOP when:

- Launching brand awareness video campaigns
- Building consideration with product demos or explainers
- Driving YouTube engagement (subscribers, channel views)
- Sequential storytelling campaigns

---

## Before you start

### Required inputs

- Clear awareness or consideration goal
- Video assets (uploaded to YouTube)
- Target audiences or content targeting plan
- Budget allocation
- YouTube channel linked to Google Ads

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Campaign structure decisions |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Location, language settings |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Targeting options |
| [Network Selection Reference](../references/Network Selection Reference.md) | YouTube and Video Partners |
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Recommended exclusion settings |
| [Frequency Capping Reference](../references/Frequency Capping Reference.md) | Frequency management |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Learning period and monitoring |

---

## Decision gate: Campaign subtype

Select campaign subtype based on your goal:

| If your goal is... | Select subtype | Bidding | Key metric |
|-------------------|----------------|---------|------------|
| Maximum reach at lowest cost | Video Reach - Efficient Reach | Target CPM | CPM, Reach |
| Guaranteed message delivery | Video Reach - Non-skippable | Target CPM | CPM, Completion |
| Repeated exposure | Video Reach - Target Frequency | Target CPM | Frequency, Reach |
| Sequential storytelling | Video - Ad Sequence | Target CPM | Sequence completion |
| Views and engagement | Video Views | CPV | Views, View rate |

> ⚠️ **Video campaigns are for awareness/consideration only:** For conversion goals, use Demand Gen.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign shell and settings** | Configure campaign settings | Campaign shell |
| **Phase 2️⃣: Structure and targeting** | Set audiences and content targeting | Targeting structure |
| **Phase 3️⃣: Creative setup** | Add video ads | Video ads uploaded |
| **Phase 4️⃣: Bidding and budget** | Configure bid strategy | Bidding set |
| **Phase 5️⃣: Brand safety and exclusions** | Configure inventory and exclusions | Brand-safe environment |
| **Phase 6️⃣: Launch and verify** | Enable and validate | Campaign live |

---

## Phase 1️⃣: Campaign Shell and Settings

### 1.1 Create new campaign

1. In Google Ads, click **+ New campaign**
2. Select **Brand awareness and reach** or **Product and brand consideration**
3. Select **Video** as campaign type
4. Select campaign subtype (from decision gate)

### 1.2 Configure campaign settings

| Setting | Recommendation | Notes |
|---------|----------------|-------|
| **Campaign name** | `[Country]_[Language]_Video_[Goal]` | e.g., "US_EN_Video_Awareness" |
| **Locations** | Your target markets | |
| **Languages** | Audience languages | |

> ↪️ **For location and language details:** See [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md).

### 1.3 Configure network settings

| Network | Recommendation |
|---------|----------------|
| YouTube videos | Include (primary placement) |
| Video partners | OFF initially, test later |

> ↪️ **For network selection rationale:** See [Network Selection Reference](../references/Network Selection Reference.md).

### 1.4 Configure frequency capping

| Campaign goal | Daily cap | Weekly cap |
|---------------|-----------|------------|
| Awareness (reach) | 2-3 | 7-10 |
| Consideration | 3-4 | 10-14 |
| Remarketing | 4-5 | 12-15 |

**How to configure:**

1. Go to campaign settings → Additional settings
2. Find "Frequency capping"
3. Select "Cap impression frequency" and/or "Cap view frequency"
4. Enter limits

> 💡 **Set frequency caps from day one:** Without caps, ad exposure becomes skewed. See [Frequency Capping Reference](../references/Frequency Capping Reference.md) for details.

> ↪️ **For frequency capping details:** See [Frequency Capping Reference](../references/Frequency Capping Reference.md).

**Verification:** Campaign shell created with correct subtype, network set to YouTube only, and frequency caps configured.

---

## Phase 2️⃣: Structure and Targeting

### 2.1 Create ad group

1. Name ad group: `[Targeting Type] - [Specific Audience]`
2. Set ad group CPM/CPV bid

### 2.2 Audience targeting

Based on campaign goal:

**For Remarketing (Video):**

| Audience type | Example | Best for |
|---------------|---------|----------|
| YouTube engaged users | "Viewed any video - 30 days" | Re-engagement |
| Website visitors | "All visitors - 30 days" | Cross-channel remarketing |
| Customer Match | "Customer list" | Retention messaging |

**For Prospecting/Awareness:**

| Audience type | Example | Best for |
|---------------|---------|----------|
| In-market | "In-Market - Auto Buyers" | Category interest |
| Affinity | "Auto Enthusiasts" | Lifestyle alignment |
| Custom segments | "Competitor brand searches" | Competitive targeting |
| Demographics | Age, gender, HHI | Broad awareness |

> ↪️ **For audience targeting options:** See [Audience Targeting Reference](../references/Audience Targeting Reference.md).

### 2.3 Content targeting (optional)

Add content targeting to control WHERE ads appear:

| Targeting type | When to use | Example |
|----------------|-------------|---------|
| YouTube channels | Specific placement control | Industry channels |
| YouTube videos | Specific video targeting | Competitor reviews |
| Topics | Category relevance | "Auto - Buying Guide" |
| Keywords | Contextual themes | "best suv 2026" |

### 2.4 Configure Optimized Targeting

| Campaign goal | Optimized Targeting |
|---------------|---------------------|
| Awareness | ON |
| Consideration | Test |
| Remarketing | OFF |

**Verification:** Ad group created with audience segments attached and Optimized Targeting set per goal recommendation.

---

## Phase 3️⃣: Creative Setup

### 3.1 Add video ads

1. Click **+ New ad**
2. Select video from YouTube (uploaded or unlisted with URL)
3. Select ad format based on campaign subtype:

| Format | Duration | Skippable | Best for |
|--------|----------|-----------|----------|
| Skippable in-stream | Any (15-60s recommended) | Yes (after 5s) | Consideration, engagement |
| Non-skippable in-stream | 15s max | No | Awareness, full message |
| Bumper | 6s max | No | Awareness, frequency |
| In-feed | Any | N/A (click to play) | Consideration, discovery |

### 3.2 Configure ad components

| Component | Requirement |
|-----------|-------------|
| Video URL | YouTube video link |
| Final URL | Landing page |
| Display URL | Path 1 and Path 2 (15 chars each) |
| Call-to-action | Button text (10 chars) |
| Headline | For in-feed (100 chars max) |
| Companion banner | Auto-generated or custom (300×60) |

### 3.3 Video creative alignment

| Campaign goal | Video approach |
|---------------|----------------|
| Awareness | Hook in first 5s, brand early, emotional appeal |
| Consideration | Problem → solution, product demo, credibility |
| Remarketing | Specific offer, urgency, familiar branding |

> ↪️ **For video specifications:** See [Video Creative Reference](../references/Video Creative Reference.md).

**Verification:** Video ad created with correct format, companion banner set, and CTA configured.

---

## Phase 4️⃣: Bidding and Budget

### 4.1 Select bid strategy

| Campaign subtype | Bid strategy |
|------------------|--------------|
| **Video Views** | Target CPV |
| **Efficient Reach** | Target CPM |
| **Non-skippable Reach** | Target CPM |
| **Target Frequency** | Target CPM |
| **Ad Sequence** | Target CPM or Maximum CPM |
| **Audio Reach** | Target CPM |

### 4.2 Set budget

| Setting | Recommendation |
|---------|----------------|
| **Daily budget** | Based on reach goals and CPM targets |

**Verification:** Bid strategy matches campaign subtype and daily budget is set.

---

## Phase 5️⃣: Brand Safety and Exclusions

### 5.1 Configure inventory type

1. Go to campaign settings → Content exclusions
2. Select inventory type:

| Type | Content included | Recommendation |
|------|------------------|----------------|
| Expanded inventory | All monetizable | ❌ Avoid |
| Standard inventory | Excludes most sensitive | ✅ Default |
| Limited inventory | Only vetted content | ✅ Premium brands |

### 5.2 Configure content exclusions

**Excluded content types:**

| Type | Action |
|------|--------|
| Embedded YouTube videos | Exclude (less control) |
| Live streaming videos | Exclude |

**Digital content labels:**

| Label | Content | Recommendation |
|-------|---------|----------------|
| DL-G | General audiences | Include |
| DL-PG | Parental guidance | Review based on brand |
| DL-T | Teen | Review based on brand |
| DL-MA | Mature audiences | Review based on brand |
| Not yet labeled | Unknown | Test and monitor |

**Sensitive content categories:**

- Tragedy and conflict: Exclude
- Sensitive social issues: Exclude
- Profanity and rough language: Exclude
- Sexually suggestive: Exclude
- Sensational and shocking: Exclude

> ↪️ **For content exclusion details:** See [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md).

### 5.3 Placement exclusions

Add specific exclusions:

| Exclude | Reason |
|---------|--------|
| Known controversial channels | Brand safety |
| Competitor channels (if desired) | Strategic choice |
| Low-quality video placements | Quality control |

**Verification:** Inventory type set to Standard or Limited, sensitive content categories excluded, and placement exclusions added.

---

## Phase 6️⃣: Launch and Verify

### 6.1 Pre-launch checklist

- [ ] Campaign subtype matches goal
- [ ] Targeting is correctly configured
- [ ] Frequency capping is set
- [ ] Inventory type and exclusions are configured
- [ ] Video is uploaded and correct
- [ ] YouTube channel is linked
- [ ] Budget and bidding are set

### 6.2 Enable campaign

1. Review campaign in preview
2. Set campaign status to **Enabled**
3. Monitor closely for first 24-48 hours

### 6.3 Monitoring cadence

| Timeframe | Focus |
|-----------|-------|
| 24-48 hours | Delivery, policy issues |
| 7 days | Placement report, exclusions |
| 14 days | Frequency distribution, adjust caps |
| 30 days | Reach, view rate, brand lift (if measured) |

> ↪️ **For complete monitoring guidance:** See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md).

**Verification:** Campaign status is Enabled, video ads are approved, and impressions begin within 24 hours.

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] Campaign is live with correct subtype
- [ ] Targeting matches campaign goal
- [ ] Brand safety settings are configured
- [ ] Frequency capping is set
- [ ] Video ads are approved
- [ ] YouTube channel is linked (for audience building)
- [ ] Campaign passes launch checklist

---

## Exit → Entry Bridge

| Timeframe | Action |
|-----------|--------|
| 24-48 hours | Monitor for delivery and policy issues |
| 7 days | Review placement report, add exclusions |
| 14 days | Check frequency distribution, adjust caps |
| 30 days | Evaluate reach, view rate, brand lift (if measured) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Low view rate | Review creative hook, check targeting |
| Poor placements | Add channel/video exclusions |
| Frequency too high | Tighten frequency caps |
| Low reach | Expand targeting or increase budget |
| Learning period issues | See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Using Video for conversions | Misunderstanding campaign types | Use Demand Gen for conversions |
| No frequency cap | Default unlimited | Set caps at launch |
| Ads on inappropriate content | No inventory type set | Use Standard or Limited inventory |
| Low view rate | Poor creative hook | Hook within first 5 seconds |
| Expensive CPMs | Too narrow targeting | Balance reach vs precision |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Mental Model | Decision gate |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 |
| [Network Selection Reference](../references/Network Selection Reference.md) | Reference | Phase 1 |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Phase 2 |
| [Frequency Capping Reference](../references/Frequency Capping Reference.md) | Reference | Phase 1 |
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Guideline | Phase 5 |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 6 |
| [Video Creative Reference](../references/Video Creative Reference.md) | Reference | Phase 3 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | Upstream (audience creation) |
| [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) | Parallel (alternative upper funnel) |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Alternative (for conversion goals) |

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
