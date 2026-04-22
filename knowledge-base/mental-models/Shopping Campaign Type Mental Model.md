# Shopping Campaign Type Mental Model
Created: 2026-02-04

Support_ID: MENTALMODEL_8
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: No
Human_Facing: No
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

This mental model helps you choose the right Shopping campaign type for Ecommerce: Standard Shopping, PMax Feed-Only, or PMax Full Assets.

> ❓ **The core question:** Which campaign type should I use for my product catalog, and why?

These are three distinct strategic positions, not points on a spectrum:

- **Standard Shopping** = Manual control strategy. You set bids (Manual CPC or portfolio bid strategies with Max CPC cap), sculpt queries, and manage campaign priorities. Best when you need precision, transparency, or volume is too low for automation.
- **PMax Feed-Only** = Automated Shopping strategy. Same Shopping surface as Standard Shopping, same feed, but Google handles bidding and optimization. Less manual control, more reliance on Google's AI, easier to manage. Best when you have sufficient volume and want simplicity without creative investment.
- **PMax Full Assets** = Cross-channel growth strategy. All Google surfaces, with creative investment across images, video, and text. Fundamentally different campaign model, not just "Shopping with more reach".

> 💡 **Feed-Only PMax is strategically closer to Standard Shopping than to Full Assets PMax:** Both operate on the same Shopping surface with the same data source (your product feed) and the same segmentation logic. Full Assets PMax serves across all Google surfaces with different creative requirements and different optimization dynamics.

---

## What this is NOT

This mental model does **not:**

- Explain product feed requirements (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- Explain how to structure Standard Shopping campaigns (See: [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md))
- Explain how to structure PMax campaigns for Ecommerce (See: [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>))
- Provide campaign settings reference (See: [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md))
- Provide product segmentation tactics (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md))
- Provide step-by-step campaign setup (See: SOPs for each campaign type)

---

## The three campaign types

| **Type** | **What it is** | **Channel coverage** |
| --- | --- | --- |
| 1️⃣ **Standard Shopping** | Traditional Shopping campaigns with full control | Shopping surface only |
| 2️⃣ **PMax Feed-Only** | Performance Max using only product feed (no creative assets) | Mostly Shopping, some Display/YouTube leak |
| 3️⃣ **PMax Full Assets** | Performance Max with complete creative assets | All Google surfaces (Shopping, Search, Display, YouTube, Gmail, Discover) |

---

## Strategic profile

| **Factor** | **Standard Shopping** | **PMax Feed-Only** | **PMax Full Assets** |
| --- | --- | --- | --- |
| **Strategic role** | Precision Shopping execution | Automated Shopping execution | Cross-channel product growth |
| **Core surface** | Shopping only | Shopping (with minor leak) | All Google surfaces |
| **Control model** | Full (manual bids, priorities, negatives) | Limited (automated bidding, no priorities) | Minimal (automated everything) |
| **Creative requirement** | None (feed only) | None (feed only) | High (images, video, headlines, descriptions) |
| **Data requirement** | Works at any volume | 30+ conversions/month | 50+ conversions/month |
| **Risk profile** | Higher management burden | Minor spend leak to non-Shopping | Risk of significant spending on non-Shopping placements |

---

## Strategic identity

### 1️⃣ Standard Shopping: when precision matters

**When to choose:**
- You need query sculpting, priority routing, or manual bid control
- Conversion volume is below 30/month (Manual CPC works at any volume)
- You need full transparency into bid mechanics and auction behavior

**What you optimize for:** Maximum control over which queries trigger your ads, at what bid, for which products.

**What you give up:** Some automation efficiency. With Target ROAS, Standard Shopping can still be automated: only Manual CPC requires manual bid management. You also give up Max CPC caps when using portfolio bid strategies (available in Standard Shopping only, not PMax).

### 2️⃣ PMax Feed-Only: when automation serves Shopping

**When to choose:**
- You have 30+ conversions/month and want Shopping performance with less management
- You do not need campaign priorities or manual bid control
- You want automated bidding without investing in creative assets

**What you optimize for:** Shopping performance with minimal management overhead. Same surface as Standard Shopping, automated execution.

**What you give up:** Bid-level control, campaign priority routing, and some spend leaks to Display/YouTube. Negative keywords and negative keyword lists are available, but you cannot use campaign priorities or set manual bids.

### 3️⃣ PMax Full Assets: when growth requires new surfaces

**When to choose:**
- You want product awareness beyond Shopping (YouTube, Display, Gmail, Discover)
- You have quality creative assets (images, video, text) ready to deploy
- You have 50+ conversions/month to support cross-channel optimization

**What you optimize for:** Cross-channel product visibility and incremental demand from surfaces Search and Shopping cannot reach.

**What you give up:** Channel-level control, placement transparency, and creative simplicity. Weak creative causes wasted spend on non-Shopping surfaces. This is a different campaign model, not an upgrade from Feed-Only.

---

## Decision framework

```
What is your primary goal for this product set?
|
+-- Precision/transparency (query sculpting, manual bids, priority routing)
|   --> Standard Shopping
|
+-- Shopping performance with less management
|   +-- 30+ conversions/month? YES --> PMax Feed-Only
|   +-- NO --> Standard Shopping (volume insufficient for automation)
|
+-- Cross-channel product awareness (YouTube, Display, Gmail, Discover)
|   +-- Quality creative + 50+ conversions/month? --> PMax Full Assets
|   +-- Creative but <50 conversions/month? --> PMax Feed-Only (build volume first)
|   +-- No creative? --> PMax Feed-Only or Standard Shopping
|
+-- Fully automated, hands-off approach (no other campaign types in place)
    +-- Quality creative + 50+ conversions/month? --> PMax Full Assets
    +-- No creative or <50 conversions/month? --> PMax Feed-Only
```

> 💡 **Default to Standard Shopping when uncertain:** You can always migrate to PMax later. Migrating back from PMax to Standard Shopping is harder because you lose the campaign's learning history.

---

## When to reassess campaign type

Reassess your campaign type when any of these triggers occur:

| **Trigger** | **Current type** | **Consider switching to** | **Why** |
| --- | --- | --- | --- |
| Conversion volume exceeds 50/month consistently | Standard Shopping | PMax Feed-Only | Enough data for automated bidding to outperform manual |
| Need cross-channel reach (YouTube, Display, Gmail) | Standard Shopping or PMax Feed-Only | PMax Full Assets | Product awareness beyond Shopping surface |
| Losing control over search terms or placements | PMax (any) | Standard Shopping | PMax now supports negative keywords and negative keyword lists, but Standard Shopping still offers more granular control through campaign priorities and query sculpting |
| Creative assets now available (images, video) | PMax Feed-Only | PMax Full Assets | Can leverage all Google surfaces |
| Performance declining with automation | PMax Feed-Only | Standard Shopping | Manual control may recover performance |
| Budget constraints require precision | PMax (any) | Standard Shopping | Manual CPC and priorities give tighter control |
| Scaling into new markets | Standard Shopping | PMax Feed-Only or Full Assets | Automation handles expansion more efficiently |

> ⚠️ **Don't switch campaign types reactively:** Evaluate over 30+ days of stable data. Short-term dips during learning periods are normal and not a reason to switch.

---

## Running both together (Hybrid approaches)

As of Q4 2024, **Ad Rank determines auction priority**: PMax no longer automatically wins over Standard Shopping.

| **Hybrid approach** | **How it works** | **Best for** |
| --- | --- | --- |
| **PMax main + Shopping fallback** | PMax handles most products: Standard Shopping at low priority catches overflow | Accounts transitioning from Shopping to PMax |
| **Shopping main + PMax test** | Standard Shopping primary: PMax at limited budget tests incremental volume | Testing PMax without risking current performance |
| **Split by segment** | Example: Heroes in Standard Shopping (control), Zombies in PMax (automation) | Mature accounts with performance segmentation |

> ↪️ **For auction routing rules between Shopping and PMax:** See [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md).

---

## Volume thresholds by campaign type

Standard Shopping works at any volume with Manual CPC. PMax requires 30+ conversions/month for Target CPA, 50+ for Target ROAS. When volume is insufficient, start with targetless strategies (Maximize Conversions or Maximize Conv. Value) and consolidate campaigns.

> ↪️ **For complete thresholds by bid strategy per campaign type, budget viability checks, and remediation tactics:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

---

## Common mistakes

| **Mistake** | **Why it's wrong** | **Fix** |
| --- | --- | --- |
| Choosing PMax because "it's newer" | Campaign type should match control needs and volume, not trends | Evaluate against decision framework above |
| Running PMax without brand exclusions | Brand traffic inflates PMax metrics, hides true acquisition cost | Add brand exclusions in PMax campaign settings |
| PMax Full Assets without creative investment | Weak assets cause wasted spend on Display/YouTube | Either invest in creative or use Feed-Only |
| Switching campaign types during peak season | Learning period disrupts performance during critical revenue period | Switch during low season, allow 2-4 weeks for learning |
| Running hybrid without exclusions | Same products compete across campaigns, fragmenting data | Use custom labels to ensure no product overlap |
| Judging PMax in week one | PMax needs 2-4 weeks to learn: early performance is not representative | Wait 30 days before evaluating |

---

## Key principles

1. **Each campaign type serves a distinct strategic purpose:** Standard Shopping is for precision control. Feed-Only PMax is for automated Shopping. Full Assets PMax is for cross-channel growth. Choose based on strategy, not assumptions about performance.
2. **Feed-Only PMax and Standard Shopping operate on the same surface with the same data source:** The difference is in bidding control and minor channel expansion, not in fundamental campaign mechanics.
3. **Start with Standard Shopping when uncertain:** You can always migrate to PMax. The reverse is harder.
4. **Volume determines viability:** PMax needs 30+ conversions/month to learn. Standard Shopping works at any volume with Manual CPC.
5. **Brand separation is mandatory regardless of campaign type:** Separate brand traffic at the campaign level in both Standard Shopping and PMax. See [Brand Separation Reference](../references/Brand Separation Reference.md).
6. **Don't mix campaign types for the same products:** If running hybrid, use exclusions to ensure each product appears in exactly one campaign type.

---

## Appendix: Feature comparison

| **Factor** | **Standard Shopping** | **PMax Feed-Only** | **PMax Full Assets** |
| --- | --- | --- | --- |
| **Bid control** | High (manual or portfolio) | Low (automated only) | Low (automated only) |
| **Placement control** | Full (Shopping only) | Limited (mostly Shopping) | None (all surfaces) |
| **Search term visibility** | Full | Full (now in standard report) | Full (now in standard report) |
| **Negative keyword support** | Full | Full | Full |
| **Campaign priorities** | Yes (High/Medium/Low) | No | No |
| **Manual CPC available** | Yes | No | No |
| **tCPA available** | No | Yes | Yes |
| **Requires creative assets** | No | No | Yes (images, video, text) |
| **Channel reach** | Shopping surface only | Shopping-weighted (some leak) | All Google surfaces |
| **Setup complexity** | Medium | Low | High |
| **Learning period** | 1-2 weeks | 2-4 weeks | 2-4 weeks |
| **Min. conversions for tROAS** | 50/month | 50/month | 50/month |

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Prerequisite (feed quality requirements) |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Downstream (Standard Shopping-specific structure) |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Downstream (PMax structure for Ecommerce) |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Downstream (product segmentation framework) |
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Reference (all campaign settings) |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Reference (product segmentation tactics) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference (volume thresholds per bid strategy) |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference (brand separation implementation) |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | Reference (Shopping vs. PMax auction routing) |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference (audience signals for PMax) |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Execution (Standard Shopping setup) |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Execution (Feed-Only PMax setup) |
| [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) | Execution (Full Assets PMax setup) |

---

## Version details

- **Version:** 5.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
