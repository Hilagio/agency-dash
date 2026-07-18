# Product Feed Quality Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_20
Status: Done
Reference Type: Checklist
Agent_Readable: No
Human_Facing: Yes
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

Validates that product feeds meet compliance requirements, completeness standards, and optimization best practices before launching Shopping campaigns.

---

## What this checklist validates

This checklist confirms:

- Required attributes are present and formatted correctly
- Recommended attributes are populated for competitive baseline
- Data matches landing pages (price, availability)
- Images meet quality standards
- Custom labels are configured for segmentation

This checklist does **NOT**:

- Provide attribute specifications (See: [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md))
- Provide optimization recommendations (See: [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md))
- Explain feed quality concepts (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- Provide step-by-step setup (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))

---

## When to use

Run this checklist:

- Before launching a new Shopping campaign
- After initial feed upload to Merchant Center
- When auditing existing feed quality
- After making significant feed changes
- When diagnosing Shopping campaign performance issues

---

## Checklist

### Compliance (Required attributes)

These are table stakes. Products will be disapproved without them.

- [ ] Every product has a unique, stable `id`
- [ ] Every product has a `title` (max 150 characters)
- [ ] Every product has a `description` (max 5000 characters)
- [ ] Every product has a valid `link` to the product page
- [ ] Every product has an `image_link` meeting size requirements
- [ ] Every product has a `price` with currency code
- [ ] Every product has `availability` set (in_stock, out_of_stock, preorder, backorder)
- [ ] Feed price matches landing page price
- [ ] Feed availability matches actual inventory status
- [ ] No policy violations flagged in Merchant Center

**Apparel-specific (Required in BR, FR, DE, JP, UK, USA):**

- [ ] `age_group` provided for all apparel
- [ ] `gender` provided for all apparel
- [ ] `color` provided for all apparel
- [ ] `size` provided for all apparel

### Product identifiers

- [ ] `gtin` provided for all products with assigned GTINs
- [ ] `brand` provided for all products with a clear brand
- [ ] `mpn` provided when GTIN unavailable
- [ ] `identifier_exists` set to `false` only for custom/handmade products
- [ ] GTINs are valid (verified against GS1 validation)
- [ ] No fabricated or guessed identifiers

### Title quality

- [ ] Titles front-load the most important details
- [ ] Titles use available character space (aim for 150 characters)
- [ ] Titles include brand, product type, and key attributes
- [ ] Titles include variant attributes (size, color) for variants
- [ ] Titles follow category-specific formulas
- [ ] No promotional text in titles
- [ ] No ALL CAPS for emphasis

### Description quality

- [ ] Descriptions include key features in first 160 characters
- [ ] Descriptions include material, color, pattern, size, benefits
- [ ] No promotional text (price, sale price)
- [ ] No links in descriptions
- [ ] No HTML markup in descriptions

### Image quality

- [ ] Primary images are at least 500x500px (1500x1500px recommended, and the floor Google is moving all products to)
- [ ] Products fill 75-90% of image frame
- [ ] Images have white or neutral backgrounds
- [ ] No promotional overlays (prices, watermarks, CTAs)
- [ ] No borders on images
- [ ] Correct variant shown for each product
- [ ] File size under 16MB per image
- [ ] `additional_image_link` provided (recommended)
- [ ] `lifestyle_image_link` provided for upper funnel (recommended)

### Pricing and availability

- [ ] Price includes VAT where required (country-specific)
- [ ] Price uses correct currency code (ISO 4217)
- [ ] `sale_price` used for sales (not modified `price`)
- [ ] Sale discount is 5-90% for badge eligibility
- [ ] EU: Sale reference price is lowest in last 30 days
- [ ] Shipping costs excluded from product price
- [ ] Automatic item updates enabled for price
- [ ] Automatic item updates enabled for availability
- [ ] Feed update frequency matches inventory change frequency

### Categorization

- [ ] `product_type` populated with your taxonomy
- [ ] `product_type` hierarchy is logical and complete
- [ ] `google_product_category` only overrides when auto-categorization is wrong
- [ ] Category-specific required attributes provided

### Custom labels and segmentation

- [ ] `custom_label_0` through `custom_label_4` strategy defined
- [ ] Performance labels populated (hero/sidekick/villain/zombie)
- [ ] Margin labels populated (high/medium/low)
- [ ] Seasonality labels populated if applicable
- [ ] Inventory labels populated if applicable
- [ ] Labels populated BEFORE campaign launch

### Variants

- [ ] `item_group_id` groups all variants of the same product
- [ ] Each variant has unique `id`
- [ ] Variant-specific attributes populated (color, size, material, pattern)
- [ ] Links pre-select correct variant via URL parameters
- [ ] Images show correct variant

### Data source configuration

- [ ] Primary data source created with correct settings
- [ ] Target country and language configured
- [ ] Feed label set for Google Ads targeting
- [ ] Scheduled fetch frequency appropriate for inventory changes
- [ ] Supplemental feeds configured for dynamic data (if needed)
- [ ] Attribute rules tested and applied (if used)

### Merchant Center health

- [ ] No account-level issues in Diagnostics
- [ ] Item issues reviewed and prioritized
- [ ] Disapproved products less than 5% of catalog
- [ ] Limited products reviewed for improvement
- [ ] Google Ads account linked
- [ ] Shipping settings configured
- [ ] Return policy configured

---

## Quality gates

### Minimum viable feed (Launch requirement)

All compliance items must pass before launching Shopping campaigns.

| **Gate** | **Threshold** |
|----------|---------------|
| Disapproved products | <5% of catalog |
| Required attributes | 100% populated |
| Price/availability match | 100% (or automatic updates enabled) |
| Valid images | 100% |

### Competitive feed (Performance optimization)

These items improve matching and CTR but are not required for launch.

| **Gate** | **Threshold** |
|----------|---------------|
| GTIN coverage | >90% of eligible products |
| Title optimization | Following category formulas |
| Description quality | Key details in first 160 chars |
| Custom labels | Segmentation strategy implemented |
| Additional images | >50% of products |

---

## Quick reference

| **Document** | **Relationship** |
|--------------|------------------|
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Explains quality dimensions and prioritization |
| [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md) | Attribute specifications and syntax |
| [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md) | Optimization recommendations per attribute |
| [Merchant Center Reference](../references/Merchant Center Reference.md) | Merchant Center configuration |
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Uses this checklist for validation |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Custom label strategies |

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
