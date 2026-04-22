# SOP – Review and Optimize Ad Extensions
Created: 2026-02-14

SOP_ID: SOP_73
Status: Done
Category: Creative
Primary Outcome: Full extension coverage across campaigns with underperformers replaced
Agent_Executable: No
Human_Approval_Required: No
Domain: Creative
Pillar: 8

## Purpose

This SOP audits extension coverage across campaigns and replaces underperforming extensions to maximize ad real estate and CTR.

> ❓ **The big question:** Are all campaigns running the right extensions with strong performance, or are gaps and stale assets leaving CTR on the table?

This SOP is the **maintenance layer** for extensions. It keeps your extension setup current, relevant, and high-performing after initial setup from [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md).

---

## What this SOP is NOT

This SOP does **not:**

- Create extensions from scratch for a new campaign (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md), Phase 3)
- Define which extension types exist or how to compose them (See: [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md))
- Manage automated asset settings at a policy level (See: [Automated Assets Control Guidelines](../guidelines/Automated Assets Control Guidelines.md))

## When to run this SOP

Run this SOP when:

- Monthly optimization cycle: review performance and replace underperformers
- Quarterly expansion review: evaluate unused extension types
- After seasonal or offer changes: update promotion extensions, sitelink destinations, callout messaging

---

## Before you start

#### Required inputs

- Google Ads account access with campaign management permissions
- At least 30 days of extension performance data

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) | Extension type options and composition patterns |
| [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md) | Validating minimum coverage |
| [Automated Assets Control Guidelines](../guidelines/Automated Assets Control Guidelines.md) | Auto-generated asset settings |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Coverage audit** | Identify campaigns with missing extensions | Gap report per campaign |
| **Phase 2️⃣: Performance review** | Flag underperforming extensions | Underperformer list with decisions |
| **Phase 3️⃣: Replace underperformers** | Deploy fresh replacements | Updated extension set |
| **Phase 4️⃣: Disable auto-generated extensions** | Ensure manual control over messaging | Clean auto-asset config |
| **Phase 5️⃣: Extension expansion** | Deploy unused extension types | Expanded coverage |

---

## Phase 1️⃣: Coverage audit

### 1.1 Check minimum coverage per campaign

Pull the full asset list from Ads & Assets > Assets. Filter by association level (Account, Campaign, Ad Group). For each active campaign, verify these minimums:
| Extension type | Minimum required | Preferred level |
|----------------|-----------------|-----------------|
| Sitelinks | 4 | Campaign |
| Callouts | 4 | Campaign |
| Structured Snippets | 1 header with 3+ values | Campaign |

Flag any campaign below these thresholds. Campaigns relying solely on account-level extensions need campaign-level replacements for better relevance.

---

## Phase 2️⃣: Performance review

### 2.1 Pull extension performance report

Navigate to Ads & Assets > Assets. Set date range to the last 30-60 days. Add columns: Impressions, Clicks, CTR, Conv. Rate, Conversions, Cost/Conv., Conv. Value, ROAS. Segment by asset type.

### 2.2 Identify underperformers

| Condition | Action |
|-----------|--------|
| 0 clicks after 30+ days | Replace immediately |
| 0 conversions after 30+ days with 100+ clicks | Replace: engagement without conversion |
| CPA more than 2x the campaign average | Replace: inefficient |
| ROAS more than 50% below campaign average (value-based campaigns) | Replace: low return |
| CTR more than 50% below the type average | Replace: low engagement |
| Messaging references expired offers | Replace |
| Sitelink destination returns 404 | Fix URL or replace |

> 💡 **Compare extension-showing impressions vs. non-extension impressions:** If ads with extensions show lower CTR than ads without, the extension content is actively hurting performance.

---

## Phase 3️⃣: Replace underperformers

### 3.1 Remove flagged extensions

Navigate to Ads & Assets > Assets. Select each flagged extension and remove it. Do not pause: removed extensions free the slot for replacements.

### 3.2 Create replacement sitelinks

Each sitelink must link to a distinct, relevant landing page. Do not reuse the same text that just failed. Do not point multiple sitelinks to the same URL. Refer to [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) for composition patterns.

### 3.3 Create replacement callouts

Focus on unique selling points, differentiators, and trust signals:

| Category | Example callouts |
|----------|-----------------|
| Trust signals | "Google Premier Partner", "4.8 Star Rating" |
| Value adds | "Free Consultation", "No Setup Fees" |
| Differentiators | "Same-Day Delivery", "24/7 Support" |
| Risk removers | "Money-Back Guarantee", "No Contracts" |

### 3.4 Create replacement structured snippets

Select the most relevant header category (Types, Brands, Amenities, Destinations, Models). Populate with 3-8 specific values per header.

### 3.5 Validate replacements

Run all new extensions through the [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md).

---

## Phase 4️⃣: Disable auto-generated extensions

### 4.1 Review and disable auto-generated assets

Navigate to Ads & Assets > Assets > Account-level automated assets. Disable auto-generated sitelinks, callouts, and structured snippets:

| Auto-generated asset | Recommended | Rationale |
|---------------------|-------------|-----------|
| Dynamic sitelinks | Off | Maintain control over destinations |
| Dynamic callouts | Off | Prevent generic or off-brand messaging |
| Dynamic structured snippets | Off | Keep categorization intentional |

> ⚠️ **Check before disabling:** If any auto-generated extension outperforms your manual ones, note the messaging angle and incorporate it into a manual replacement before turning it off.

For the full configuration, see [Automated Assets Control Guidelines](../guidelines/Automated Assets Control Guidelines.md).

---

## Phase 5️⃣: Extension expansion

### 5.1 Identify unused extension types

Quarterly, review which extension types you are not yet using:

| Extension type | Use when | Skip when |
|----------------|----------|-----------|
| Price extensions | Clear price-differentiated products or tiers | Complex or variable pricing |
| Promotion extensions | Active sales or seasonal offers | No current promotions |
| Call extensions | Phone leads are valuable | No phone support or call tracking |
| Location extensions | Physical locations customers visit | Fully online business |
| Image extensions | High-quality images available | No suitable images |

### 5.2 Deploy and monitor

For each new extension type, review composition patterns in [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md). Create at campaign level (preferred over account). Monitor performance for 30 days before evaluating. Set calendar reminders: refresh callouts quarterly, remove expired promotions immediately.

---

## Validation & definition of done

This SOP is complete when:

- [ ] All campaigns audited for minimum extension coverage
- [ ] All zero-click and low-CTR extensions replaced
- [ ] Auto-generated extensions reviewed and disabled per guidelines
- [ ] Quarterly: unused extension types evaluated and deployed where applicable
- [ ] All new extensions validated against [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md)

---

## Exit → entry bridge

Once extensions are updated and live:

| Timeframe | Action |
|-----------|--------|
| Days 1-7 | Monitor approval status, fix any disapprovals |
| Days 7-30 | Collect performance data on new extensions |
| Day 30+ | Re-evaluate new extensions using Phase 2 criteria |
| Next month | Run this SOP again as part of monthly optimization |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| New extensions disapproved | Fix policy violations, resubmit |
| CTR drops after extension changes | Revert to previous high performers, test incrementally |
| Ad copy and extensions misaligned | [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |

---

## Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) | Catalog | Phase 3, Phase 5 |
| [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md) | Checklist | Phase 1, Phase 3 |
| [Automated Assets Control Guidelines](../guidelines/Automated Assets Control Guidelines.md) | Guideline | Phase 4 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Upstream (initial extension setup in Phase 3) |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Parallel (run alongside for ad copy optimization) |
| [SOP – Launch a Search Campaign](../sops/SOP – Launch a Search Campaign.md) | Upstream (extensions set during campaign launch) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Stale extensions running for months | No regular review cadence | Run this SOP monthly |
| All sitelinks point to homepage | Lazy setup or template reuse | Each sitelink gets a distinct, relevant page |
| Callouts duplicate RSA headlines | Copy-paste from ad copy | Callouts add new information, not repeat |
| Expired promotions still running | Forgot to remove after sale | Set calendar reminders for end dates |
| Auto-generated extensions overriding | Didn't check automated settings | Run Phase 4 every cycle |

---

## Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.