# Account Structure Orchestration Mental Model
Created: 2026-02-05

Support_ID: MENTALMODEL_11
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 6

## Purpose

This mental model helps you decide which campaign types to run and how they fit together in a full Google Ads account.

> ❓ **The core question:** I run (or plan to run) Search, Shopping, PMax, and/or Display/Video/Demand Gen. How do they all work together without cannibalizing each other?

Individual campaign type mental models explain how to structure each type. This document explains how the types relate to each other: which to launch first, how to allocate budget between them, and how to prevent overlap.

---

## What this is NOT

This mental model does **not:**

- Explain how to structure campaigns within a single type (See: campaign-specific mental models below)
- Provide step-by-step campaign setup (See: campaign-specific SOPs)
- Explain bid strategy selection (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Cover cross-platform channel selection beyond Google Ads (See: [Upper Funnel Channel Selection Mental Model](../mental-models/Upper Funnel Channel Selection Mental Model.md))

---

## The consolidation principle

> 💡 **Always consolidate as much traffic as possible. Only segment when there is a good reason.**

This golden rule applies at every level: across campaign types, within campaign types, and down to ad groups. More data in fewer campaigns means faster learning, better Smart Bidding performance, and simpler management.

**Why consolidation works:**

| **Benefit** | **Mechanism** |
| --- | --- |
| Faster learning | Smart Bidding finds patterns across more data points |
| Better performance | Algorithm bids at the query level using signals from all campaigns |
| Simpler management | Fewer campaigns, less management overhead, lower margin for error |
| Easier analysis | Data concentrated instead of scattered across dozens of campaigns |

**When to add a campaign type or split campaigns:**

- You need to reach users on different networks (Search captures demand, Display/Video creates demand)
- You need different budget allocation, bid strategies, or conversion goals per product/service
- You have sufficient conversion volume to support another campaign (30+ conversions/month per campaign minimum)

---

## The campaign type hierarchy

Not all campaign types serve the same purpose. Understanding their roles prevents overlap and guides launch order.

| **Role** | **Campaign types** | **User behavior** | **Efficiency** |
| --- | --- | --- | --- |
| **Demand capture** | Search, Shopping, PMax (Shopping surface) | User searches for you or your product | Highest |
| **Demand expansion** | PMax (non-Shopping surfaces), Demand Gen | User didn't search, but AI predicts conversion | Medium |
| **Demand creation** | Display, Video | User is interrupted during other activity | Lowest |

> ⚠️ **Start with demand capture:** If your budget is limited, allocate to bottom-funnel campaign types first (Search, Shopping). Only add demand creation when demand capture is profitable and not budget-constrained.

---

## PMax's role: complementary, not replacement

Performance Max is not a replacement for dedicated campaign types. It is an additional layer that fills gaps and maximizes coverage.

| **PMax does** | **PMax does not** |
| --- | --- |
| Find converting queries you did not keyword | Replace keyword-level control in Search |
| Serve across all Google surfaces from one campaign | Give you transparency into what works where |
| Complement Search and Shopping coverage | Eliminate the need for dedicated campaign types |
| Discover incremental demand | Replace strategic awareness campaigns (Display/Video) |

> ⚠️ **PMax will seek the easiest path to conversions:** This means it catches brand traffic, over-indexes on remarketing, and gravitates toward Shopping surfaces for e-commerce. Without brand exclusions and proper coordination, PMax metrics are inflated.

**Where PMax fits by vertical:**

| **Vertical** | **PMax role** | **Importance** |
| --- | --- | --- |
| **E-commerce** | Critical: Shopping surface access, cross-channel product promotion | High (Shopping network is crucial) |
| **Lead Gen** | Optional: cross-channel lead generation beyond Search | Medium (only with quality signals) |
| **SaaS** | Optional: cross-channel trial/demo generation beyond Search | Medium (only with quality signals) |
| **Local Services** | Limited: Search typically sufficient, PMax adds Display/Maps | Low-Medium |

---

## Campaign type selection by vertical

### E-commerce

| **Campaign type** | **Role** | **When to add** | **Budget share** |
| --- | --- | --- | --- |
| **Brand Search** | Protect brand queries, prevent competitor capture | Always (day one) | 5-15% |
| **Non-Brand Search** | Capture high-intent product/category searches | Always (day one) | 10-20% |
| **Standard Shopping / PMax Feed-Only** | Product visibility on Shopping surface | Always (day one) | 40-60% |
| **PMax Full Assets** | Cross-channel product promotion | When Shopping is profitable and not budget-constrained | 20-40% |
| **Remarketing (Display/Demand Gen)** | Re-engage cart abandoners, site visitors | When sufficient audience size (1,000+ users) | 5-10% |
| **Prospecting (Display/Video/Demand Gen)** | Create demand for new products/categories | When bottom funnel is maxed and budget allows | 5-15% |

> 💡 **E-commerce budget allocation:** Shopping/PMax takes the largest share because product listing ads are the primary revenue driver. Search complements with text ads for category and informational queries.

### Lead Gen / SaaS

| **Campaign type** | **Role** | **When to add** | **Budget share** |
| --- | --- | --- | --- |
| **Brand Search** | Protect brand queries | Always (day one) | 5-10% |
| **Non-Brand Search** | Capture high-intent service searches | Always (day one) | 50-70% |
| **PMax** | Cross-channel lead generation | When 30+ conversions/month AND offline conversion import configured | 15-25% |
| **Remarketing (Display/Demand Gen)** | Re-engage form abandoners, site visitors | When sufficient audience size | 5-10% |
| **Prospecting (Display/Video/Demand Gen)** | Create demand, build pipeline | When Search is maxed and budget allows | 10-20% |

> 💡 **Lead Gen budget allocation:** Search takes the largest share because intent-based targeting produces the highest quality leads. PMax only adds value when lead quality signals are in place (offline conversion import).

### Local services

| **Campaign type** | **Role** | **When to add** | **Budget share** |
| --- | --- | --- | --- |
| **Brand Search** | Protect brand queries | When brand traffic exists | 5-10% |
| **Non-Brand Search** | Capture service-intent queries | Always (day one) | 60-80% |
| **Remarketing (Display)** | Re-engage past visitors | When sufficient audience size | 5-10% |
| **PMax** | Local coverage expansion (Maps, Display) | When Search is profitable and conversion volume supports it | 10-20% |
| **Prospecting (Display/Video)** | Build local awareness | Only with significant budget | 5-10% |

> 💡 **Local services budget allocation:** Search dominates because local intent queries ("plumber near me") are the primary lead driver. Upper funnel is rarely justified unless the business has a significant awareness budget.

---

## Launch sequence

Build your account bottom-up: start with the highest-efficiency campaign types and expand as budget and data allow.

### Phase 1️⃣: Foundation

| **Action** | **Why** |
| --- | --- |
| Set up conversion tracking (with values if possible) | Everything depends on accurate conversion data |
| Launch Brand Search | Protect brand queries from competitors and PMax |
| Launch Non-Brand Search (consolidated) | Capture existing demand |
| Launch Shopping / PMax Feed-Only (e-commerce) | Product visibility from day one |

### Phase 2️⃣: Expansion

| **Action** | **Prerequisite** |
| --- | --- |
| Segment Search campaigns by budget/target needs | Data shows different services/products need different treatment |
| Add PMax (Lead Gen/SaaS) | 30+ conversions/month, offline conversion import configured |
| Add PMax Full Assets (e-commerce) | Shopping profitable, creative assets ready |
| Add Remarketing | 1,000+ users in remarketing audience |

### Phase 3️⃣: Growth

| **Action** | **Prerequisite** |
| --- | --- |
| Add Demand Gen prospecting | Bottom funnel maxed, 50+ conversions/month achievable per campaign |
| Add Display/Video prospecting | Brand awareness goals, dedicated awareness budget |
| Performance-based Shopping segmentation (H/S/V/Z) | 90+ days conversion data, labeling tool available |

> ⚠️ **Do not skip phases:** Launching PMax before Search is established means PMax has no keyword-level control to fall back on. Launching Display prospecting before remarketing means you're creating demand you can't recapture.

---

## Cross-campaign coordination

### Brand separation (mandatory)

Brand traffic must be separated across all campaign types to prevent metric inflation.

| **Campaign type** | **Brand control** |
| --- | --- |
| Search | Dedicated Brand campaign + brand negatives in non-brand campaigns |
| Standard Shopping | Brand Shopping campaign + brand negatives |
| PMax | Campaign-level brand exclusions |

> ↪️ **For implementation details:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### Query routing (Search + PMax)

When Search and PMax run simultaneously, query routing rules determine which campaign serves each query.

| **Query type** | **Who serves it** | **Your control** |
| --- | --- | --- |
| Brand queries | Brand Search (PMax excluded) | Brand exclusions in PMax |
| High-value known queries | Search (exact match) | Add as exact match keywords |
| Known queries (phrase/broad) | Search or PMax (Ad Rank decides) | Promote to exact match if PMax captures |
| Unknown queries | PMax discovers | Let PMax expand |

> ↪️ **For full routing rules:** See [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md).

### Audience overlap (Upper Funnel + PMax)

When running Display/Video/Demand Gen alongside PMax, define clear roles to avoid overlap.

| **Principle** | **Implementation** |
| --- | --- |
| PMax handles remarketing natively | Avoid running a separate remarketing Display campaign if PMax is active (unless you need creative control) |
| Dedicate Display/Video to awareness | Use for cold/coldest audiences where PMax underperforms |
| Exclude recent converters from all campaigns | Prevent wasted spend across campaign types |
| Use Demand Gen for Lookalikes | Lookalikes are exclusive to Demand Gen, not available in PMax |

---

## Volume thresholds govern structure

Every structural decision must account for conversion volume. Campaigns without sufficient data cannot optimize effectively.

| **Threshold** | **Minimum** | **Recommended** |
| --- | --- | --- |
| tCPA campaigns | 30 conversions/month | 50+ for consistency |
| tROAS campaigns | 50 conversions/month | 50+ for consistency |
| Demand Gen ad groups | 50 conversions/ad group/month | Higher due to multi-surface delivery |

**When volume is insufficient:**

- Consolidate campaigns (reduce the number of campaign types)
- Use Portfolio Bid Strategies to pool data across campaigns
- Use Maximize Conversions (Value) without targets until volume builds
- Start with fewer, larger campaigns and segment only when data supports it

> ↪️ **For complete thresholds and tactics:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

---

## Common mistakes

| **Mistake** | **Why it's wrong** | **Fix** |
| --- | --- | --- |
| **Launching all campaign types at once** | Fragments budget, no campaign has enough data | Phase your launches: foundation first, then expand |
| **Running PMax without brand exclusions** | PMax captures brand traffic, inflates its metrics | Brand exclusions in every non-brand PMax campaign |
| **No Search campaigns alongside PMax** | Lose keyword-level control for high-value queries | Search protects known queries, PMax discovers new ones |
| **Over-allocating to upper funnel** | Creating demand you can't capture | Ensure bottom funnel is profitable before upper funnel expansion |
| **Separate campaign for every product/service** | Data fragmentation, each campaign starves | Consolidate unless budget/target differences require split |
| **No remarketing before prospecting** | Paying for awareness without recapture | Build remarketing audiences first, then prospect |
| **Expecting PMax to replace dedicated campaigns** | PMax fills gaps, doesn't replace strategic control | Use PMax as a complementary layer |

---

## Key principles

1. **Consolidate by default:** More data in fewer campaigns means faster learning. Only add campaign types when you have the volume and a strategic reason.
2. **Bottom funnel first:** Capture existing demand (Search, Shopping) before creating new demand (Display, Video). Each phase funds the next.
3. **PMax is complementary:** It fills gaps across channels and discovers queries you did not keyword. It does not replace Search or strategic awareness campaigns.
4. **Brand separation is mandatory:** Across all campaign types, brand traffic must be isolated to see true acquisition costs.
5. **Volume governs structure:** Every campaign needs sufficient conversion data. If you cannot feed it, do not create it.
6. **Budget allocation follows funnel position:** Highest efficiency (Search, Shopping) gets the largest share. Lower efficiency (Display, Video) gets dedicated awareness budget only.
7. **Look holistically:** PMax is a piece of the puzzle, not the puzzle itself. The goal is account-level performance, not maximizing any single campaign type.

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Within-type structure (Search campaigns) |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Within-type structure (Search ad groups) |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Campaign type selection (Shopping vs PMax) |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Within-type structure (Standard Shopping) |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Within-type structure (PMax for Ecommerce) |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Within-type structure (PMax for Lead Gen/SaaS) |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Within-type structure (Display/Video/Demand Gen) |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Product segmentation for Shopping/PMax Feed-Only |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Audience approach across campaign types |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand separation implementation |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | Query routing between Search and PMax |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Volume requirements per bid strategy |

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
