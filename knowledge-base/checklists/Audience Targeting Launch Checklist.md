# Audience Targeting Launch Checklist
Created: 2026-04-01

Support_ID: CHECKLIST_36
Status: Done
Category: Audiences
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Audiences
Pillar: 7

## Purpose

Validates that Display, Video, and Demand Gen audience targeting is correctly configured before launch or after significant targeting changes.

---

## What this checklist validates

This checklist confirms:

- Audience segment types match the campaign goal
- Targeting mode is set correctly (Targeting vs Observation)
- Expansion features are configured per campaign type
- Audience sizes meet minimum thresholds
- Lookalike segments are properly seeded (Demand Gen)
- Content targeting complements audience targeting (Display/Video)
- Exclusion lists protect against waste and overlap

This checklist does **NOT:**

- Evaluate ongoing audience performance (See: [Audience Targeting Health Checklist](../checklists/Audience Targeting Health Checklist.md))
- Review demographics, combined segments, or audience insights (those require 30+ days of data)
- Validate PMax audience signals (See: [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md))
- Provide step-by-step targeting setup (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))

---

## When to use

Run this checklist:

- After completing [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md)
- Before launching a new Display, Video, or Demand Gen campaign
- After modifying audience targeting structure in any campaign
- During campaign audits to verify targeting foundation

---

## Checklist

### Audience segment selection

- [ ] Primary audience segments match the campaign goal (remarketing, prospecting, or awareness)
- [ ] Audience temperature aligns with funnel stage (hot/warm for remarketing, cool/cold for prospecting)
- [ ] At least one segment type is first-party data (website visitors or Customer Match) where available
- [ ] Segments match the ad group's creative messaging and landing page

> ↪️ **Browse segment options.** See [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) for segment types, examples, and combined segment patterns.

### Targeting mode

- [ ] Targeting mode set correctly: "Targeting" for remarketing, "Observation" for prospecting data collection
- [ ] No ad groups accidentally set to Observation when Targeting is intended (or vice versa)

### Expansion features

- [ ] Correct feature identified per campaign type: optimized targeting (Display, Video Sales/Leads/Traffic, Demand Gen) vs audience expansion (Video Consideration/Awareness)
- [ ] Optimized targeting ON for conversion-focused prospecting campaigns
- [ ] Optimized targeting OFF for remarketing campaigns
- [ ] Audience expansion setting (Video consideration/awareness) matches reach vs precision goal
- [ ] Demand Gen optimized targeting demographic behavior acknowledged (may serve beyond demographic selections when ON)

### Audience size requirements

- [ ] Each remarketing segment has 100+ users (1,000+ recommended)
- [ ] Customer Match lists have 1,000+ matched users
- [ ] Audience size indicator shows "Ready" in Google Ads UI

### Lookalike segments (Demand Gen only)

- [ ] Seed list contains 1,000+ matched users
- [ ] Seed list is high-quality (converters or high-value customers, not all visitors)
- [ ] Reach setting matches campaign goal (Narrow for efficiency, Balanced for default, Broad for scale)
- [ ] Lookalike is built from a segment that has been active for 30+ days

### Content targeting (Display/Video only)

- [ ] Content targeting complements audience targeting (if used)
- [ ] AND logic between audiences and content is intentional (narrows reach significantly)
- [ ] Topic targeting is relevant to product/service category
- [ ] Placement exclusions cover brand-unsafe categories

### Exclusion coverage

- [ ] Recent converters excluded from remarketing (7-30 day window based on purchase cycle)
- [ ] Existing customers excluded from new customer acquisition campaigns
- [ ] Brand-unsafe content categories excluded (Display/Video)
- [ ] Competitor brand terms excluded where relevant
- [ ] Exclusion lists are current and refreshed

---

## Quick reference

| Document | Relationship |
|----------|-------------|
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Segment type options and combined segment patterns |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Targeting mode mechanics, expansion features, size requirements |
| [Content Targeting Reference](../references/Content Targeting Reference.md) | Content targeting specs for Display/Video |
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | Execution procedure validated by this checklist |
| [Audience Targeting Health Checklist](../checklists/Audience Targeting Health Checklist.md) | Ongoing performance validation (run after 30+ days of data) |

---

## Version details

- **Version:** 1.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
