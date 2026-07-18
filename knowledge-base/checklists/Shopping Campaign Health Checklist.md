# Shopping Campaign Health Checklist
Created: 2026-02-14
Updated: 2026-04-02

Support_ID: CHECKLIST_30
Status: Done
Category: Shopping
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Shopping
Pillar: 6

## Purpose

Validates Shopping campaign health across feed, product performance, bidding, and structural dimensions.

---

## What this checklist validates

This checklist confirms:

- Product feed is healthy and free of blocking errors
- Product performance segments are current and actionable
- Price competitiveness data has been reviewed
- Title and image quality meet minimum standards
- Bid strategy is operating within healthy parameters
- Budget allocation supports top-performing products
- Campaign structure avoids overlap and waste
- Search terms are monitored and negatives are applied

This checklist does **NOT**:

- Validate initial feed attribute setup (See: [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md))
- Provide campaign launch steps (See: [Shopping Campaign Launch Checklist](../checklists/Shopping Campaign Launch Checklist.md))
- Execute optimization changes (See: [SOP – Run Shopping Campaign Optimization Cycle](../sops/SOP – Run Shopping Campaign Optimization Cycle.md))
- Explain feed quality frameworks (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))

---

## When to use

Run this checklist:

- Before running a Shopping campaign optimization cycle
- During weekly or bi-weekly performance reviews
- When diagnosing Shopping campaign performance issues
- After significant feed or product catalog changes

---

## Checklist

### Feed health

- [ ] No disapproved products (or all disapprovals have active fix plans)
- [ ] Missing attributes flagged: products without GTIN, brand, or required attributes
- [ ] Product data quality errors checked in Merchant Center diagnostics
- [ ] Feed refresh happening on schedule (daily minimum for price/availability)
- [ ] Supplemental feeds configured and syncing (if applicable)

> ↪️ **Feed attribute details:** See [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md) for required and recommended attributes.

### Product performance

- [ ] Zero-click products identified: products with 0 impressions or 0 clicks after 30+ days
- [ ] Zero-click rate documented (percentage of catalog with no traffic)
- [ ] Top sellers receiving adequate budget (not budget-limited)
- [ ] Unprofitable products identified (high cost, low/no conversions, ROAS below target)
- [ ] Product performance segments updated: hero / sidekick / villain / zombie (if applicable)

> ↪️ **Performance tiers:** See [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md) for segmentation definitions and thresholds.

### Price competitiveness

- [ ] GMC price competitiveness data reviewed
- [ ] Products in "High" (most expensive) tier flagged for pricing review
- [ ] Sale price badge eligibility checked (45-60 day stable base price)
- [ ] Competitor pricing shifts noted

### Title and image quality

- [ ] Best-seller titles reviewed: contain brand + product type + key attribute + differentiator (See: [Product Title Catalog](../catalogs/Product Title Catalog.md))
- [ ] Title length distribution checked: titles using available character limit (max 150, aim 70-100)
- [ ] Product descriptions reviewed for key selling points and keyword coverage (See: [Product Description Catalog](../catalogs/Product Description Catalog.md))
- [ ] Primary images meet quality standards: white background, clear product, no overlays
- [ ] High-impression/low-CTR products flagged for title/image optimization

### Bid strategy health

- [ ] Conversion volume sufficient for bid strategy type
- [ ] Actual ROAS/CPA within 20% of target over last 14 days
- [ ] Bid strategy not stuck in "Learning" for 14+ days
- [ ] No recent bid strategy changes within last 14 days

### Budget health

- [ ] IS Lost (Budget) on best-seller products/campaigns documented
- [ ] Monthly spend pacing on track (if applicable)
- [ ] Budget allocation between Standard Shopping and PMax reviewed

### Structure health

- [ ] Listing group granularity appropriate (not "All products" in one group)
- [ ] Custom labels reflecting current performance tiers
- [ ] Product segmentation strategy active (hero/sidekick/villain/zombie), if applicable (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md))
- [ ] No listing group overlap causing cannibalization

### Search term health

- [ ] Shopping search term report reviewed
- [ ] Irrelevant query patterns identified and excluded
- [ ] Negative keyword lists linked to Shopping campaigns
- [ ] N-gram analysis applied to Shopping search terms

---

## Quick reference

| Document | Relationship |
|----------|--------------|
| [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md) | Performance tier definitions and thresholds |
| [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md) | Feed attribute validation (run before this checklist) |
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Feed quality framework and priorities |
| [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md) | Required and recommended feed attributes |
| [Shopping Campaign Launch Checklist](../checklists/Shopping Campaign Launch Checklist.md) | Pre-launch validation (companion checklist) |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Deeper bid strategy validation |

---

## Version details

- **Version:** 2.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
