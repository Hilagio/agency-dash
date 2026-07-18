# PMax Campaign Health Checklist
Created: 2026-02-14
Updated: 2026-07-13

Support_ID: CHECKLIST_31
Status: Done
Category: PMax
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: PMax
Pillar: 6

## Purpose

Validates that an active Performance Max campaign is healthy across all controllable dimensions: asset groups, creative performance, search terms, negatives, channel allocation, audience signals, brand defense, budgets, landing pages, placements, and feed integration.

---

## What this checklist validates

This checklist confirms:

- Asset groups meet minimum requirements and maintain thematic coherence
- Asset performance is reviewed using actual metrics, not vanity labels
- Search term quality is monitored and non-converting queries are excluded
- Negative keyword lists are linked and maintained
- Channel allocation matches campaign intent
- Audience signals are configured and relevant
- Brand cannibalization is controlled
- Budgets are utilized appropriately
- Landing pages and placements are performing

This checklist does **NOT:**

- Help decide whether to launch PMax (See: [PMax Launch Checklist (Lead Gen/SaaS)](<../checklists/PMax Launch Checklist (Lead Gen-SaaS).md>))
- Provide step-by-step campaign setup instructions (See: [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md))
- Cover asset specifications or creative requirements (See: [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md))

---

## When to use

Run this checklist:

- During monthly PMax campaign reviews
- When PMax performance is declining or volatile
- After the initial learning period completes (2-4 weeks post-launch)
- When onboarding an existing account with active PMax campaigns

---

## Checklist

### Shared checks (all PMax campaigns)

#### Asset group health (Full Assets PMax only, skip for Feed-Only)

- [ ] Each asset group has minimum required assets (5+ headlines, 5+ descriptions, 5+ images, 1+ logo)
- [ ] Video count within the cap of 15 videos per orientation (horizontal, square, vertical: minimum 1, maximum 15 each)
- [ ] Auto-generated assets identified and disabled (especially auto-generated videos)
- [ ] Text guidelines configured if Text Customization is enabled (term exclusions + messaging restrictions)
- [ ] Visual guidelines configured if Image/Video Enhancement is enabled (brand colors + font)
- [ ] Asset groups have thematic coherence (not mixing unrelated products/services)
- [ ] No asset groups with 0 impressions (signal or targeting issue)

#### Asset performance

- [ ] Asset-level performance data reviewed (actual impressions, clicks, conversions per asset)
- [ ] Underperforming assets identified by actual asset-level data (not by Ad Strength)
- [ ] Ad Strength score ignored (completeness rating, not a performance signal)
- [ ] Creative diversity maintained across headlines, descriptions, and images

#### Search term quality

- [ ] PMax search term reports reviewed (fully visible, like Search campaign STRs)
- [ ] Non-converting queries identified and excluded
- [ ] Brand vs. non-brand query split documented
- [ ] Query overlap with Search campaigns checked

#### Negative keyword management

- [ ] Negative keyword lists linked to PMax campaigns (now supported)
- [ ] Non-converting N-gram exclusion list linked
- [ ] Inefficient N-gram exclusion list linked
- [ ] Exclusion lists shared with Search campaigns where appropriate

#### Channel allocation (Full Assets PMax only, skip for Feed-Only)

- [ ] Spend distribution across Search/Shopping/Display/Video reviewed
- [ ] No unexpected channel skew (e.g., 80%+ to Display when Shopping expected)
- [ ] Channel allocation trends documented (compare to prior period)
- [ ] Search Partner Network and Display Network left on (excluded only if a network is wildly underperforming on sustained data)

#### Brand defense

- [ ] Brand term cannibalization from Search campaigns checked
- [ ] Brand exclusions in place (if applicable), noting they cover only Search, Shopping, and YouTube search inventory
- [ ] Branded searches mode on AI Max-enabled Search campaigns set to "unbranded only" (or a documented exception)
- [ ] Brand vs. non-brand performance separated in reporting

#### Budget health

- [ ] Budget utilization reviewed
- [ ] No unintended budget-limited status on high-performing campaigns

#### Placement health

- [ ] Placement reports reviewed (impression data available)
- [ ] Suspicious placements identified (bot traffic patterns, irrelevant sites)

### Ecommerce-specific checks

- [ ] Feed-Only vs Full Assets setup documented and intentional
- [ ] Product feed connected and healthy
- [ ] Listing group structure aligned with product segmentation
- [ ] Shopping channel allocation reviewed (for Feed-Only PMax: should be majority Shopping)
- [ ] Product performance segmentation active (hero/sidekick/villain/zombie), if applicable (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md))
- [ ] Zero-click product rate reviewed
- [ ] Budget fully spending (ecommerce PMax should not be consistently underspending)

> ↪️ **Ecommerce PMax structure:** See [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) for Feed-Only vs Full Assets decisions and campaign architecture.

### Lead Gen/SaaS-specific checks

- [ ] Lead quality signal configured (offline conversion import, CRM integration, or lead scoring)
- [ ] At least one downstream conversion action imported (MQL, SQL, or opportunity)
- [ ] Conversion values assigned to downstream actions (not just binary 0/1)
- [ ] Audience signals configured with first-party data (customer lists, website visitors)
- [ ] Audience signal quality verified: signals match target customer profile
- [ ] Form submission quality monitored (spam rate, qualification rate)
- [ ] Budget overspend monitored (lead gen PMax can overspend aggressively without quality signals)
- [ ] Final URL expansion settings reviewed (OFF if strict LP control needed)

> ↪️ **Lead Gen PMax structure:** See [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) for lead quality signal hierarchy and campaign architecture.

---

## Quick reference

| Document | Relationship |
|----------|--------------|
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Campaign structure framework for ecommerce PMax |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Campaign structure framework for lead gen PMax |
| [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md) | Default configuration recommendations |
| [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md) | Asset specifications and structure |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Product segmentation tactics for ecommerce |
| [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md) | Feed-specific validation for ecommerce |
| [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md) | Audience signal validation |

---

## Version details

- **Version:** 6.0
- **Last Updated:** July 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
