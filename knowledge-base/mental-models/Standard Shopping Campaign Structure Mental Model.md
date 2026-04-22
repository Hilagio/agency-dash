# Standard Shopping Campaign Structure Mental Model
Created: 2026-02-04

Support_ID: MENTALMODEL_7
Status: Done
Reference Type: Mental Model
Agent_Readable: No
Human_Facing: No
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

This mental model helps you configure **Standard Shopping campaign settings** for maximum control over query routing, bidding, and product visibility.

> ❓ **The core question:** How should I configure my Standard Shopping campaigns to take advantage of features only available in Standard Shopping?

Standard Shopping offers capabilities that PMax does not: campaign priority levels, Manual CPC bidding, portfolio bid strategies with Max CPC cap, full negative keyword control, and query sculpting. This document focuses on those Standard Shopping-specific features.

> ↪️ **For product segmentation (which products get which budget):** See [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md). That framework applies to both Standard Shopping and PMax Feed-Only.

---

## What this is NOT

This mental model does **not:**

- Explain product feed requirements (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- Explain product segmentation tiers (See: [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md))
- Explain brand separation (See: [Brand Separation Reference](../references/Brand Separation Reference.md))
- Provide conversion volume thresholds (See: [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md))
- Provide all campaign settings (See: [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md))
- Explain PMax structure for Ecommerce (See: [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>))
- Provide custom label implementation (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md))

---

## Standard Shopping-specific features

These features are available only in Standard Shopping, not in PMax:

| **Feature** | **What it does** | **Why it matters** |
| --- | --- | --- |
| **Campaign priority levels** | High / Medium / Low priority determines which campaign enters the auction first | Enables query sculpting and funnel-based routing |
| **Manual CPC** | Set bids manually at the product group level | Full control over individual product bids, no volume threshold needed |
| **Portfolio bid strategies** | Use portfolio strategies with Max CPC cap across campaigns | Automated bidding with a ceiling on individual click costs |
| **Full negative keyword control** | Add negatives at campaign and ad group level (unlimited) | Precise query exclusion and routing |
| **Full search term visibility** | Complete search term report (same as Search campaigns) | Full transparency into which queries trigger your ads |
| **Query sculpting** | Combine priorities + negatives to route queries to specific campaigns | Advanced routing for brand, generic, and long-tail queries |

---

## Campaign priority levels

Standard Shopping uses a three-level priority system to determine which campaign enters the auction when multiple campaigns are eligible for the same product.

| **Priority** | **Auction behavior** | **Typical use** |
| --- | --- | --- |
| **High** | Enters auction first | Catch-all / generic queries |
| **Medium** | Enters if High-priority campaign is excluded (by negative keyword or budget) | Mid-funnel / category queries |
| **Low** | Enters if both High and Medium are excluded or exhausted | Brand queries / high-intent queries |

> ⚠️ **Priority does not mean "more important":** High priority means the campaign gets first shot at the auction. Use negatives to reject unwanted queries and let them fall through to lower-priority campaigns.

### How query sculpting works

```
Query arrives → Eligible in all 3 campaigns
│
├─ HIGH PRIORITY campaign: Has generic negatives?
│  ├─ NO → Serves the ad (catches generic queries)
│  └─ YES → Query rejected, falls to Medium
│
├─ MEDIUM PRIORITY campaign: Has category negatives?
│  ├─ NO → Serves the ad (catches category queries)
│  └─ YES → Query rejected, falls to Low
│
└─ LOW PRIORITY campaign: No negatives
   └─ Serves the ad (catches remaining queries: brand, long-tail)
```

### Query sculpting example

| **Campaign** | **Priority** | **Negative keywords** | **Catches** |
| --- | --- | --- | --- |
| Generic Shopping | High | Brand terms, specific product names | `running shoes`, `trail shoes` |
| Category Shopping | Medium | Brand terms | `nike running shoes`, `asics trail shoes` |
| Brand Shopping | Low | None | `[brand] running shoes`, `[brand] trail` |

> 💡 **Query sculpting is optional:** It provides maximum control but adds management complexity.

---

## Bidding in Standard Shopping

Standard Shopping supports Manual CPC and portfolio bid strategies with Max CPC cap. Both are exclusive to Standard Shopping (not available in PMax).

| **Aspect** | **Details** |
| --- | --- |
| **Where to set bids** | Product group level (within ad groups) |
| **Granularity** | Set different bids per product group (by brand, category, product type, custom label, item ID) |
| **When to use** | New accounts (no conversion history), low volume accounts, when you need precise bid control |
| **When to move away** | When you have 50+ conversions/month and want to use tROAS |

> ↪️ **For volume thresholds to transition from Manual CPC to Smart Bidding:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

---

## Standard Shopping-specific failure modes

| **Failure** | **Why it happens** | **Fix** |
| --- | --- | --- |
| **Priority sculpting too complex** | Three tiers of campaigns with intricate negative lists | Simplify to two campaigns (Brand + Non-Brand) unless volume justifies three |
| **Manual CPC at scale** | Managing bids for thousands of product groups | Move to Smart Bidding when volume thresholds are met |
| **Negative keyword gaps** | Queries leaking between priority tiers | Audit search terms weekly, add negatives systematically |
| **Competing with own PMax** | Same products in both Standard Shopping and PMax | Use listing group exclusions to prevent overlap. See [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) for hybrid approaches |

> ↪️ **Running Standard Shopping alongside PMax (hybrid approaches):** See [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md). **For auction routing:** See [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md).

---

## Key principles

1. **Standard Shopping is for control:** If you do not need campaign priorities, Manual CPC, or query sculpting, PMax Feed-Only is simpler.
2. **Query sculpting is powerful but complex:** Use it when you have the volume and management capacity to support three campaign tiers.
3. **Manual CPC works at any volume:** Standard Shopping with Manual CPC is the safest starting point for new accounts.
4. **Simplify before scaling:** A two-campaign Brand/Non-Brand structure works for most accounts. Three-tier query sculpting is only justified when volume and management capacity support it.
5. **Priorities + negatives = routing:** Campaign priority does not mean "importance". It means "first chance at the auction".

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Prerequisite (feed quality requirements) |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Upstream (product segmentation framework, applies to both Shopping and PMax) |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Upstream (Standard Shopping vs. PMax decision) |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Parallel (PMax structure for Ecommerce) |
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Reference (all campaign settings) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference (bid strategy volume thresholds) |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Prerequisite (brand separation before structure) |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | Reference (Shopping vs. PMax auction routing) |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Reference (custom label tactics, implementation) |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Execution (campaign setup) |

---

## Version details

- **Version:** 7.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
