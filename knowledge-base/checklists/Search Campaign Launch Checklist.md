# Search Campaign Launch Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_19
Status: Done
Category: Launch
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Search
Pillar: 6

## Purpose

Validates that a Search campaign is fully configured and ready to go live. Run this checklist before launching any new Search campaign to catch misconfigurations, missing components, and setup errors that waste budget or delay learning.

### When to use this checklist

- Before activating any new Search campaign
- After rebuilding or restructuring an existing Search campaign
- When onboarding a new client account and inheriting paused campaigns
- Before unpausing a campaign that has been dormant for 30+ days

---

## What this checklist validates

This checklist confirms:

- Conversion tracking is active and correctly configured
- Campaign structure follows naming conventions and segmentation rules
- Ad groups are organized by creative theme and pass volume thresholds
- Keywords use correct match types with no duplicates or disapprovals
- Negative keyword lists are in place and linked
- RSAs meet headline and description requirements
- Bid strategy and targets are correctly configured
- Campaign settings are correct (networks, locations, language, schedule)
- Final URL expansion components are properly set up (if applicable)

This checklist does **NOT:**

- Provide step-by-step campaign build instructions (See: SOP: Launch a Search Campaign, when available)
- Validate ongoing performance after launch (that is a separate audit workflow)
- Select your bid strategy (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Write your ad copy (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))
- Validate conversion data quality over time (See: [Conversion Data Quality Checklist](../checklists/Conversion Data Quality Checklist.md))

---

## Quick reference

| Category | Items | Focus |
|----------|-------|-------|
| Tracking verification | 5 | Conversion actions, tags, attribution |
| Campaign structure | 5 | Naming, segmentation, goals |
| Ad group validation | 4 | Theme organization, volume, duplicates |
| Keywords | 4 | Match types, mapping, eligibility |
| Negative keywords | 4 | Lists, linking, exclusions |
| Creatives (RSAs) | 5 | Headlines, descriptions, extensions |
| Bidding | 4 | Strategy, targets, caps, budget |
| Settings | 5 | Networks, location, language, schedule |
| Final URL expansion (if applicable) | 5 | Page feed, URL inclusions, exclusions |

---

## Checklist

### Tracking verification

- [ ] Conversion tracking is active and verified (status shows "Recording conversions")
- [ ] Conversion actions are correctly classified: primary action is the lowest-funnel macro conversion, micro conversions are set to Secondary
- [ ] Google Tag or GTM is firing correctly on all relevant pages (verified via Tag Assistant or GTM Preview)
- [ ] Conversion values are set and passing dynamically (not static defaults) for ecommerce, or assigned correctly for lead gen
- [ ] Attribution model is set to Data-Driven

> ↪️ **Full tracking validation:** See [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md) for the complete tracking setup gate.

### Campaign structure

- [ ] Campaign name follows the naming convention: `[Country]_[Language]_[CampaignType]_[Theme]_[Modifier]` (See: [Campaign Naming Convention Reference](../references/Campaign Naming Convention Reference.md))
- [ ] Campaign is segmented for a valid business reason (different budgets, different geos, different bid targets) and not over-segmented
- [ ] Brand campaign is separated from non-brand campaigns
- [ ] Keywordless ad groups are included in the campaign (if final URL expansion is part of the strategy)
- [ ] Campaign goal is set correctly (conversions or conversion value, matching the bid strategy)

> ↪️ **Structure framework:** See [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) for segmentation logic.

### Ad group validation

- [ ] Ad groups are organized by creative theme (each ad group represents one distinct message angle)
- [ ] Each ad group passes the Single Ad Test: if you could only show one RSA, would the headlines and descriptions make sense for every keyword in the group?
- [ ] Keywords are assigned to the correct ad groups with no duplicate keywords across ad groups in the same campaign
- [ ] Each ad group has estimated volume that meets the 1,000 impressions/week (4,000/month) target (check via Keyword Planner or historical data)

### Keywords

- [ ] Keywords are added with the correct match types aligned to the bidding strategy and account maturity (broad match for established accounts with smart bidding and sufficient conversion data, phrase/exact for new accounts, low-volume campaigns, limited budgets, or niche B2B verticals)
- [ ] No unnecessary duplicate keywords across match types within the same ad group
- [ ] Keyword-to-landing-page mapping is verified: each keyword's final URL points to the most relevant landing page
- [ ] All keywords show status "Eligible" with no disapprovals or policy flags

> ↪️ **Match type rules:** See [Match Type Reference](../references/Match Type Reference.md) for match type behavior and selection criteria.

### Negative keywords

- [ ] Shared negative keyword lists are created covering: irrelevant terms, known poor performers, and branded terms (for non-brand campaigns)
- [ ] Shared negative keyword lists are linked to the correct campaigns (use shared lists, not campaign-level negatives)
- [ ] URL exclusions are configured to prevent ads on irrelevant site sections (if final URL expansion is active)
- [ ] No over-exclusion of potentially relevant terms (cross-check negatives against target keywords)

> ↪️ **Negative keyword reference:** See [Negative Keyword Reference](../references/Negative Keyword Reference.md) for list types and management rules.

### Creatives (RSAs)

- [ ] At least one RSA is created per ad group with 7-8 headlines and 2-3 descriptions
- [ ] Headlines cover the required angle types: keyword relevance, value proposition, CTA, social proof, urgency (per the Headline Angle Catalog)
- [ ] Descriptions include a clear CTA and at least one value proposition or differentiator
- [ ] Final URLs are correct, landing pages are live, and page load time is acceptable
- [ ] Ad extensions are configured: sitelinks (at least 4), callouts, and structured snippets at minimum

> ↪️ **Headline patterns:** See [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) for angle types and examples.

> ↪️ **Extension coverage:** See [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md) for the full extension validation gate.

### Bidding

- [ ] Bid strategy is selected based on data readiness and campaign objective (not defaulted blindly to Maximize Conversions)
- [ ] Targets are set based on calculated breakeven and profit-to-acquisition ratio (CPA target, ROAS target, or POAS target as applicable)
- [ ] CPC caps are in place for strategies that require them (Max Clicks, Target Impression Share) and set at a level that does not silently restrict volume
- [ ] Daily budget is set appropriately: at least 10x the target CPA for conversion-based strategies, sufficient for the campaign's geographic and keyword scope

> ↪️ **Bid strategy selection:** See [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) and [Bid Targets Reference](../references/Bid Targets Reference.md) for target calculation.

> ↪️ **Bid strategy health:** See [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) for ongoing bid strategy validation.

### Settings

- [ ] Network settings are set to Search only (Display Network is unchecked, Search Partners is unchecked unless explicitly justified)
- [ ] Location targeting is set to "Presence or interest" (default) or "Presence only" if location report data warrants restriction
- [ ] Language targeting matches the campaign's target audience
- [ ] Ad schedule is configured to match business hours or high-converting time windows (if data supports it, otherwise left to all hours)
- [ ] Ad rotation is set to "Optimize: Prefer best performing ads"

> ↪️ **Settings reference:** See [Search Campaign Settings Guidelines](../guidelines/Search Campaign Settings Guidelines.md) for recommended defaults.

### Final URL expansion (if applicable)

- [ ] Page feed is uploaded and all URLs show "Approved" status
- [ ] Custom labels are configured to group pages by theme or priority
- [ ] Keywordless ad groups are created with URL inclusions and targeted description lines, and text customization is ON
- [ ] Campaign URL exclusions are in place to prevent ads on irrelevant pages (contact, privacy policy, careers, blog)
- [ ] Final URL expansion is enabled at the campaign level with the correct domain and language configured

> ↪️ **Final URL expansion controls:** See [Final URL Expansion & Page Feed Reference](../references/Final URL Expansion & Page Feed Reference.md) for control mechanics and page feed setup.

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Segmentation and structure logic |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Strategic framework for modern Search campaigns |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Bid strategy selection framework |
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Budget sizing and allocation logic |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Calculating breakeven and bid targets |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Decision trees for strategy selection |
| [Match Type Reference](../references/Match Type Reference.md) | Match type behavior and selection |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Negative keyword list types and rules |
| [Final URL Expansion & Page Feed Reference](../references/Final URL Expansion & Page Feed Reference.md) | Final URL expansion controls and page feed setup |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Headline angle types and examples |
| [Search Campaign Settings Guidelines](../guidelines/Search Campaign Settings Guidelines.md) | Recommended campaign settings |
| [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md) | Full tracking setup validation |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Ongoing bid strategy validation |
| [Headline Quality Checklist](../checklists/Headline Quality Checklist.md) | Headline quality validation |
| [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md) | Extension completeness validation |
| [Conversion Data Quality Checklist](../checklists/Conversion Data Quality Checklist.md) | Ongoing conversion data validation |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | RSA creation procedure |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Conversion tracking setup procedure |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Bid strategy configuration procedure |
| [Campaign Naming Convention Reference](../references/Campaign Naming Convention Reference.md) | Campaign naming structure |

---

## Version details

- **Version:** 2.0
- **Last Updated:** June 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
