# SOP – Launch a Search Campaign
Created: 2026-02-04
Updated: 2026-02-05

Agent_Executable: No
Category: Launch
Domain: Search
Human_Approval_Required: Yes
Pillar: 6
Primary Outcome: Live, serving Search campaign with verified tracking, correct settings, and established monitoring cadence
SOP_ID: SOP_45
Secondary Outcomes: Documented launch baseline, monitoring schedule set, first optimization review scheduled
Status: Done

## Purpose

This SOP launches a Search campaign from "ready" to "live and serving", then verifies delivery and establishes post-launch monitoring.

> ❓ **The big question:** How do you safely flip the switch on a new Search campaign and confirm it is running correctly?

This is the last-mile SOP. All campaign components (structure, keywords, ads, tracking, bidding) are already in place. This SOP enables them, verifies delivery, and establishes monitoring cadence.

---

## What this SOP is NOT

This SOP does **not:**

- Build campaign structure, ad groups, or keywords (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Write or optimize ad copy (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))
- Select a bid strategy (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Set up conversion tracking (upstream prerequisite)
- Optimize or troubleshoot an already-running campaign

## When to run this SOP

Run this SOP when:

- A new Search campaign is fully built and all pre-launch checks are ready to execute
- All upstream SOPs (structure, ads, bidding, tracking) are complete
- The campaign is in "Paused" or "Pending" status, ready to go live

---

## Before you start

### Required inputs

- Fully built campaign in Google Ads or Google Ads Editor (structure, keywords, ads, extensions, bid strategy, budgets all configured)
- Conversion tracking set up and verified
- Landing pages live and tested
- Bid strategy selected and targets calculated
- Daily budget confirmed with stakeholder

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md) | Pre-launch validation gate |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Verifying campaign settings |
| [Network Selection Reference](../references/Network Selection Reference.md) | Verifying network settings |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Monitoring cadence and learning period rules |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Campaign shell and settings** | Verify campaign-level configuration | Settings confirmed |
| **Phase 2️⃣: Structure and targeting** | Verify ad groups, keywords, negatives | Structure validated |
| **Phase 3️⃣: Creative setup** | Verify RSAs, extensions, AI Max settings | Ads ready to serve |
| **Phase 4️⃣: Bidding and budget** | Confirm bid strategy and budget | Bidding configured |
| **Phase 5️⃣: Brand separation and exclusions** | Verify brand negatives and network settings | Exclusions in place |
| **Phase 6️⃣: Launch and verify** | Enable and validate delivery | Campaign live |

---

## Phase 1️⃣: Campaign Shell and Settings

### 1.1 Verify campaign name

Confirm the campaign follows the naming convention:

`[Country]_[Language]_Search_[Intent/Segment]`

Example: `US_EN_Search_NonBrand_Demo`

> ↪️ **For naming conventions:** See [Campaign Naming Convention Reference](../references/Campaign Naming Convention Reference.md).

### 1.2 Verify universal settings

| Setting | Expected | Notes |
|---------|----------|-------|
| Locations | Target markets | |
| Location method | Presence or interest (default) | Switch to Presence only if data shows waste |
| Languages | Match ad language | |
| Ad schedule | All hours, all days | Unless exception applies |

> ↪️ **For location, language, and schedule details:** See [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md).

### 1.3 Verify network settings

| Network | Expected |
|---------|----------|
| Search Network | ON |
| Search Partners | Test (monitor performance) |
| Display Network | OFF |

> ⚠️ **Display Network ON is the #1 budget-wasting misconfiguration:** Verify it is OFF before launch.

> 💡 **Search Partners:** Can work great or perform poorly (50/50 chance). Highly dependent on vertical. Test and monitor after a couple of weeks/months.

> ↪️ **For network selection rationale:** See [Network Selection Reference](../references/Network Selection Reference.md).

---

## Phase 2️⃣: Structure and Targeting

### 2.1 Verify ad group structure

In Google Ads Editor, review:

1. Ad group names match intended structure
2. No empty ad groups
3. Each ad group has clear intent theme

### 2.2 Verify keywords

1. Match types are correct (exact, phrase, or broad as intended)
2. No duplicate keywords across ad groups
3. Negative keywords are in place at ad group and campaign level

### 2.3 Verify negative keywords

1. Brand negatives in non-brand campaigns (if brand separation applies)
2. Universal negatives (wrong intent, competitors)
3. Negative keyword lists applied

> ↪️ **For negative keyword strategies:** See [Negative Keyword Reference](../references/Negative Keyword Reference.md).

---

## Phase 3️⃣: Creative Setup

### 3.1 Verify RSAs

For each ad group:

1. 7-8 unique headlines (mix of angles)
2. 2-3 unique descriptions
3. No pinning (unless specific reason)
4. Final URLs are correct

> ↪️ **For RSA quality standards:** See [Headline Quality Checklist](../checklists/Headline Quality Checklist.md) and [Description Quality Checklist](../checklists/Description Quality Checklist.md).

### 3.2 Verify extensions/assets

| Asset type | Minimum | Verified |
|------------|---------|----------|
| Sitelinks | 4 | |
| Callouts | 4 | |
| Structured snippets | 1 | |

### 3.3 Verify AI Max settings (if enabled)

If using AI Max for Search:

| Setting | Recommendation |
|---------|----------------|
| Text asset optimization | ON |
| Final URL expansion | OFF (for control), test ON later |
| Automatically created assets | Review settings |

> ↪️ **For AI Max configuration:** See [AI Max for Search Reference](../references/AI Max for Search Reference.md).

### 3.4 Verify Final URLs

1. Click through every unique Final URL
2. Confirm each page loads correctly (no 404s)
3. Confirm conversion tracking tags fire (use Tag Assistant)

---

## Phase 4️⃣: Bidding and Budget

### 4.1 Verify bid strategy

| Volume | Recommended strategy |
|--------|---------------------|
| Building history | Maximize Conversions (no target) |
| 30-50 conversions/month | Maximize Conversions or Target CPA (loose) |
| 50+ conversions/month | Target CPA or Target ROAS |

> ↪️ **For volume thresholds:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

### 4.2 Verify budget

1. Daily budget matches plan
2. Budget supports bid strategy (not "Limited by budget" expected)
3. Budget allocation across brand/non-brand is correct

---

## Phase 5️⃣: Brand Separation and Exclusions

### 5.1 Verify brand separation (if applicable)

| Campaign type | Verification |
|---------------|--------------|
| Brand campaign | Brand keywords present, Target Impression Share bid strategy |
| Non-brand campaign | Brand terms as negative keywords |

> ↪️ **For brand separation implementation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### 5.2 Verify DSA settings

If DSA ad groups exist:

| Setting | Value |
|---------|-------|
| Domain | Correct website |
| Targeting source | Page feed or website index |
| DSA negatives | Brand terms excluded |

---

## Phase 6️⃣: Launch and Verify

### 6.1 Run pre-launch checklist

Execute the [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md). All items must pass.

### 6.2 Post changes (if using Editor)

1. Post all changes from Google Ads Editor
2. Wait for upload to complete
3. Verify changes in web interface
4. Campaigns remain paused

### 6.3 Enable campaigns

Enable in this order:

| Order | Campaign | Reason |
|-------|----------|--------|
| 1 | Brand campaigns | Low risk, establishes baseline |
| 2 | Non-brand campaigns | Higher spend, needs brand already serving |

For each campaign:

1. Set status to "Enabled"
2. Verify budget displays correctly
3. Verify bid strategy shows "Active" (not "Limited")
4. Confirm status shows "Eligible"

### 6.4 First verification (2-4 hours)

| Check | What to look for | Action if wrong |
|-------|-----------------|-----------------|
| Impressions | Accumulating | Check keyword/ad status, budget |
| CTR | 1-5% range | Check ad-keyword relevance |
| CPCs | Within expected range | Check bid strategy target |
| Search terms | Relevant queries | Add negatives for irrelevant |
| Tracking | Conversions firing | Verify tag setup |

### 6.5 Set monitoring cadence

| Timeframe | Frequency | Focus |
|-----------|-----------|-------|
| Day 1 | Check 2-4 hours after launch, end of day | Delivery, disapprovals, tracking |
| Days 2-3 | Daily | Search terms, CTR, budget pacing |
| Days 4-7 | Every other day | Trends, conversion volume |
| Week 2-3 | 2-3x per week | Learning status, stabilization |
| Week 4+ | Weekly | Full optimization review |

> ↪️ **For complete monitoring guidance:** See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md).

### 6.6 Document launch

Record:

| Field | Value |
|-------|-------|
| Launch date | |
| Campaign names | |
| Bid strategy and target | |
| Daily budget | |
| Launched by | |

Set calendar reminders for:
- Day 3 review
- Week 1 review
- Week 2 review (learning assessment)
- Month 1 review (full evaluation)

---

## Validation & Definition of Done

This SOP is complete when:

- [ ] All pre-launch checklist items pass
- [ ] All campaigns are enabled and serving impressions
- [ ] No disapproved ads or keywords remain
- [ ] First-day verification confirms delivery, relevant search terms, and tracking
- [ ] Monitoring cadence is documented and calendar reminders set
- [ ] Launch log is recorded with initial settings
- [ ] Stakeholder is notified that campaigns are live

---

## Exit → Entry Bridge

| Timeframe | Action |
|-----------|--------|
| Days 1-7 | Monitor per cadence, add negatives from search terms |
| Week 2 | Assess learning status, run [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) if strong performers emerge |
| Week 2-4 | Begin [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) once impression data is sufficient |
| Month 1+ | Enter regular optimization cadence |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Poor search term relevance | Add negatives, review match types |
| Ads disapproved after launch | Fix ad copy, resubmit |
| No conversions after 7 days | Verify tracking, check landing page |
| Bid strategy stuck in learning | See [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) |
| Budget depleting too quickly | Reduce budget or review bid targets |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Launching with failed checklist items | Pressure to go live | Complete Phase 1-5 fully |
| Display Network left ON | Default setting not checked | Verify in Phase 1 |
| Broken landing pages | Pages changed between build and launch | Test URLs in Phase 3 |
| Changing bid targets during learning | Impatience | Set reminders, brief stakeholders |
| No launch documentation | Urgency | Complete in Phase 6 |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md) | Checklist | Phase 6 |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Reference | Phase 1 |
| [Network Selection Reference](../references/Network Selection Reference.md) | Reference | Phase 1 |
| [Post-Launch Monitoring Reference](../references/Post-Launch Monitoring Reference.md) | Reference | Phase 6 |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference | Phase 5 |

---

## Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Upstream (ads written before launch) |
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (bid strategy selected before launch) |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | Downstream (Week 2+) |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Downstream (when data sufficient) |

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
