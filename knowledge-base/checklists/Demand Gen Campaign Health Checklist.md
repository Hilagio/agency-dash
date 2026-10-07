# Demand Gen Campaign Health Checklist
Created: 2026-02-14
Updated: 2026-10-05

Support_ID: CHECKLIST_32
Status: Done
Category: Upper Funnel
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Upper Funnel
Pillar: 0

## Purpose

Validates that a Demand Gen campaign is healthy across audiences, creative, placements, bidding, attribution, and brand safety. Use this checklist to identify which areas need attention, then route to the appropriate SOP or reference for execution.

---

## What this checklist validates

This checklist confirms:

- Audiences are properly sized, segmented, and refreshed
- Creative formats are diverse, fresh, and tested
- Placement distribution is balanced across channels
- Bidding strategy matches campaign maturity and conversion volume
- Attribution is correctly understood (Google Ads vs. GA4 differences accounted for)
- Product feed is connected and performing (for DPA campaigns)
- Brand safety and content exclusions are configured

This checklist does **NOT:**

- Execute optimization procedures (those live in campaign optimization SOPs)
- Validate initial campaign setup (See: [Upper Funnel Campaign Launch Checklist](../checklists/Upper Funnel Campaign Launch Checklist.md))
- Validate image or video creative quality (See: [Image Creative Quality Checklist](../checklists/Image Creative Quality Checklist.md), [Video Creative Quality Checklist](../checklists/Video Creative Quality Checklist.md))

---

## When to use

Run this checklist:

- During weekly or bi-weekly Demand Gen performance reviews
- When diagnosing underperforming Demand Gen campaigns
- Before scaling budget on a Demand Gen campaign
- After inheriting an existing Demand Gen campaign for management

---

## Checklist

### Audience health

- [ ] Seed audience size meets minimum (1,000+ users, recommended 5,000+)
- [ ] Lookalike reach setting documented (Narrow/Balanced/Broad)
- [ ] Lookalike targeting mode is recorded as suggestion mode or strict targeting
- [ ] Optimized Targeting is OFF on every remarketing campaign
- [ ] Every prospecting campaign has a recorded ON versus OFF comparison for Optimized Targeting
- [ ] Every campaign with Optimized Targeting ON has a documented decision accepting serving outside its demographic selections
- [ ] Expanded performance is recorded from the "Total: Expansion and optimized targeting" row (if expansion is ON)
- [ ] Demographic performance reviewed: no demographic group with CPA > 2x campaign average and 50+ clicks unaddressed
- [ ] Seed audience contains converters or high-value customers only
- [ ] Website-visitor seed lists updated within the last 90 days
- [ ] Customer Match seed lists updated within the last 30 days
- [ ] No campaign combines a new customer acquisition goal with Lookalike segments

### Creative health

- [ ] Multiple ad formats active (video + image minimum)
- [ ] Creative freshness: no creative running unchanged for 60+ days
- [ ] UGC-style creative tested alongside polished creative
- [ ] Video creative is uploaded
- [ ] Carousel ads tested for ecommerce/multi-product offers

### Placement health

- [ ] Spend share per channel is recorded (YouTube, Discover, Gmail, GDN)
- [ ] Every channel consuming 90%+ of budget has a documented decision
- [ ] Placement exclusions in place (brand safety)
- [ ] Mobile app placements are excluded, or an exception is documented

### GDN channel health

- [ ] Content category exclusions in place for GDN inventory (parked domains, error pages, made-for-ads sites)
- [ ] Scammy/suspicious placement exclusions applied to GDN inventory
- [ ] Domain quality signals are recorded for the top GDN placements (TLD risk patterns, parked domain indicators, MFA site patterns. See [Placement Performance Reference](../references/Placement Performance Reference.md))
- [ ] GDN placement quality has not worsened versus the prior month
- [ ] Responsive display creative for GDN configured with quality images

> ↪️ **Image creative validation.** See [Image Creative Quality Checklist](../checklists/Image Creative Quality Checklist.md) for full image quality gates.

### Bidding health

- [ ] Every campaign in learning has been in learning for under 4 weeks
- [ ] Campaign has at least 30 conversions in the last 30 days
- [ ] Bid strategy matches campaign maturity: Max Clicks at launch, tCPA or tROAS from 30 conversions per month
- [ ] Targets set to Demand Gen benchmarks (not Search benchmarks)
- [ ] Daily budget clears the serving floor: 10x target CPA, minimum €100/day on Maximize conversions
- [ ] No budget or target change was made during the initial learning period
- [ ] Every budget or target change since launch is within 15% of the prior value

### Attribution health

- [ ] Google Ads used as source of truth (not GA4) for Demand Gen reporting
- [ ] Google Ads vs. GA4 discrepancy documented (30-50% gap is normal)
- [ ] View-through conversion tracking enabled but reported separately
- [ ] View-through not included in primary CPA/ROAS calculations
- [ ] View-through conversion optimization is switched OFF on every performance and acquisition campaign (a new campaign starts with it ON)

### Feed integration

- [ ] Product feed connected (for DPA campaigns)
- [ ] Feed passes the [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md)
- [ ] Dynamic remarketing is active and its CPA is within target
- [ ] At least 4 approved, in-stock products across at least 4 Group IDs

### Brand safety

- [ ] Content exclusions are configured for every sensitive category on the exclusion list
- [ ] Inventory type is set to Moderate, or an exception is documented

### Performance benchmarks

- [ ] Campaign performance compared to Demand Gen benchmarks (CPM €5-15, CTR 0.5-2%, CVR 1-5%)
- [ ] CPA compared to Demand Gen target (not Search CPA target)
- [ ] ROAS compared to Demand Gen target (typically 50-70% of Non-Branded Search tROAS)

---

## Quick reference

| Document | Relationship |
|----------|-------------|
| [Demand Gen Performance Reference](../references/Demand Gen Performance Reference.md) | Benchmark metrics and performance expectations |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Strategic framework for Demand Gen campaign decisions |
| [Placement Performance Reference](../references/Placement Performance Reference.md) | Channel distribution and placement analysis |
| [Upper Funnel Campaign Launch Checklist](../checklists/Upper Funnel Campaign Launch Checklist.md) | Pre-launch validation for Demand Gen campaigns |
| [Image Creative Quality Checklist](../checklists/Image Creative Quality Checklist.md) | Image asset quality validation |
| [Video Creative Quality Checklist](../checklists/Video Creative Quality Checklist.md) | Video asset quality validation |

---

## Version details

- **Version:** 5.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
