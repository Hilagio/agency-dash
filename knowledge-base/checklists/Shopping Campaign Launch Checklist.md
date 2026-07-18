# Shopping Campaign Launch Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_21
Status: Done
Reference Type: Checklist
Agent_Readable: No
Human_Facing: Yes
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

Validates that all prerequisites are complete before launching Standard Shopping or PMax Feed-Only campaigns.

---

## What this checklist validates

This checklist confirms:

- Product feed is optimized and approved
- Merchant Center is properly configured
- Google Ads account is ready for Shopping
- Campaign settings are appropriate
- Brand separation is in place

This checklist does **NOT**:

- Validate feed attribute quality (See: [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md))
- Provide campaign setup steps (See: [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md))
- Explain campaign type selection (See: [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md))

---

## When to use

Run this checklist:

- Before launching a new Standard Shopping campaign
- Before launching a new PMax Feed-Only campaign
- After significant feed changes before scaling
- When onboarding a new Ecommerce client

---

## Checklist

### Product feed prerequisites

- [ ] Product feed uploaded to Merchant Center
- [ ] Feed processing complete with no errors
- [ ] Disapproved products <5% of catalog
- [ ] Required attributes populated for all products (id, title, description, link, image_link, price, availability)
- [ ] GTINs provided for products with GTINs
- [ ] Custom labels configured for segmentation strategy
- [ ] Feed refresh schedule configured (minimum daily)
- [ ] Automatic item updates enabled for price and availability

> ↪️ **Feed quality issues?** Run [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md).

### Merchant Center configuration

- [ ] Website URL verified and claimed
- [ ] Business information complete (name, address, phone)
- [ ] Return policy configured
- [ ] Shipping settings configured
- [ ] Tax settings configured (where applicable)
- [ ] Google Ads account linked
- [ ] No account-level issues in Diagnostics

### Google Ads prerequisites

- [ ] Conversion tracking implemented
- [ ] Conversion action using correct value tracking
- [ ] Sufficient conversion history (30+ conversions for Smart Bidding)
- [ ] Merchant Center linked in Google Ads
- [ ] Billing set up and active

### Campaign settings (Standard Shopping)

- [ ] Campaign type: Shopping
- [ ] Merchant Center account selected
- [ ] Target country correct
- [ ] Campaign priority set (High/Medium/Low based on strategy)
- [ ] Network settings configured (Search Partners decision)
- [ ] Bid strategy selected (Manual CPC, Maximize Clicks, tROAS based on volume)
- [ ] Daily budget set

### Campaign settings (PMax Feed-Only)

- [ ] Campaign type: Performance Max
- [ ] ZERO creative assets (no headlines, descriptions, images, videos, logos)
- [ ] Listing groups configured (your only asset)
- [ ] NO audience signals added (your feed is your targeting)
- [ ] Brand exclusions configured (Settings > Other settings)
- [ ] Final URL expansion: OFF
- [ ] Bid strategy selected (Maximize Conversion Value, with or without tROAS)
- [ ] Daily budget set

> ⚠️ **If you add ANY creative assets, PMax will serve on Display and YouTube:** For true Feed-Only behavior, leave all asset fields empty.

### Brand separation

- [ ] Brand terms identified
- [ ] Standard Shopping: Brand campaign with Low priority OR brand negatives in generic campaigns
- [ ] PMax: Brand exclusions added at campaign level
- [ ] Verification: Test search with brand terms to confirm routing

> ↪️ **Brand separation details:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### Product segmentation (if using)

- [ ] Segmentation strategy determined (category, performance, composite)
- [ ] Custom labels populated in feed
- [ ] Listing groups configured to match segmentation
- [ ] Separate campaigns/budgets for different segments (if applicable)
- [ ] Same tROAS across segments (different budgets, not different targets)

> ↪️ **Segmentation framework:** See [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md).

### Negative keywords (Standard Shopping only)

- [ ] Brand terms added as negatives (if running separate Brand campaign)
- [ ] Known irrelevant queries added as negatives
- [ ] Negative keyword lists created (if using across campaigns)

### Final verification

- [ ] Preview ads showing correctly
- [ ] Listing groups showing expected products
- [ ] No budget conflicts with other Shopping campaigns
- [ ] Conversion tracking verified with Tag Assistant
- [ ] Campaign status: Ready to launch

---

## Launch day checklist

After enabling the campaign:

- [ ] Campaign shows "Eligible" status
- [ ] Products approved and serving
- [ ] Initial impressions/clicks appearing (may take 24-48 hours)
- [ ] No unexpected disapprovals
- [ ] Budget spending as expected

---

## Post-launch monitoring (First 7 days)

- [ ] Daily: Check for new disapprovals
- [ ] Daily: Monitor spend pacing
- [ ] Day 3: Review search terms report (add negatives if needed)
- [ ] Day 7: First performance review
- [ ] Do NOT make major changes during learning period (2-4 weeks for PMax)

---

## Quality gates

### Minimum requirements for launch

| **Gate** | **Threshold** |
|----------|---------------|
| Disapproved products | <5% of catalog |
| Feed processing errors | 0 |
| Account-level issues | 0 |
| Conversion tracking | Verified |

### Recommended for optimal performance

| **Gate** | **Threshold** |
|----------|---------------|
| GTIN coverage | >90% of eligible products |
| Custom labels | Segmentation strategy implemented |
| Additional images | >50% of products |
| Conversion history | 30+ conversions for Smart Bidding |

---

## Quick reference

| **Document** | **Relationship** |
|--------------|------------------|
| [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md) | Validates feed quality before this checklist |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Campaign type decision |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Segmentation strategy |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand exclusion implementation |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Step-by-step Standard Shopping setup |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Step-by-step PMax Feed-Only setup |

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
