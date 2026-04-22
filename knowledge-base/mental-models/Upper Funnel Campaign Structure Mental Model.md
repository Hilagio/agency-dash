# Upper Funnel Campaign Structure Mental Model
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: MENTALMODEL_5
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Upper Funnel
Pillar: 6

## Purpose

This mental model helps you structure **Display**, **Video**, and **Demand Gen** campaigns for maximum efficiency and scalability.

> ❓ **The core question:** How do I build campaigns that balance audience reach with conversion efficiency across interruption-based channels?

Unlike Search (where users express intent), Upper Funnel campaigns **interrupt** users during other activities. This fundamental difference drives everything: audience strategy, campaign structure, and how you measure success.

---

## What this is NOT

This mental model does **not:**

- Explain audience signals vs. targeting conceptually (See: [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md))
- Provide step-by-step Display, Video, or Demand Gen campaign setup (See: campaign-specific SOPs)
- Cover Search campaign structure (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Explain Performance Max structure or audience signals for PMax (See: [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) or [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>))
- Provide detailed creative asset specifications or ad copy patterns (See: relevant catalogs and references)

---

## The interruption principle

|  | **Search** | **Upper Funnel (Display/Video/Demand Gen)** |
| --- | --- | --- |
| **User behavior** | User searches for you | You find the user |
| **Intent** | Intent expressed | Intent inferred |
| **Targeting method** | Keyword targeting | Audience targeting |
| **Message role** | Message matches query | Message creates interest |
| **Trade-off** | High efficiency, limited reach | Lower efficiency, massive reach |

> ⚠️ **The strategic implication:** Upper funnel campaigns require a fundamentally different approach. You're not matching intent, you're **creating** it. This means starting with audiences most likely to convert (warm) and expanding outward (cold).

> 💡 **Google Ads is not always the best channel for upper funnel:** Platforms like Meta Ads (Facebook/Instagram) and Pinterest Ads often deliver lower CPMs and more sophisticated targeting for awareness and consideration goals. Evaluate whether Google's Display, Video, and Demand Gen inventory is the right fit for your audience before defaulting to it. Google Ads excels at capturing existing demand (Search, Shopping). For creating demand, compare cross-platform costs and audience quality. See [Upper Funnel Channel Selection Mental Model](../mental-models/Upper Funnel Channel Selection Mental Model.md) for a cross-platform decision framework.

---

## The three campaign types

| **Campaign type** | **Inventory** | **Primary goal** | **Best for** |
| --- | --- | --- | --- |
| **Display** | Google Display Network (3M+ sites) | Remarketing, awareness | Dynamic remarketing, broad reach |
| **Video** | YouTube, video partners | Awareness, consideration | Brand building, product demos, reach |
| **Demand Gen** | YouTube, Discover, Gmail | Conversions, high-quality prospecting | Conversion-focused upper funnel, social-like creative |

> ⚠️ **2025 Update: Video Action Campaigns no longer exist:** They were fully migrated to Demand Gen in Q2 2025. If you want conversion-optimized video campaigns, use **Demand Gen**, not Video campaigns. Video campaigns are now primarily for awareness and consideration goals.

> 💡 **Key insight:** These campaign types share ~70% structural DNA. The same audience hierarchy, exclusion logic, and expansion strategy applies to all three. Channel-specific decisions are the remaining 30%.

---

## The audience temperature framework

Audience "temperature" predicts conversion probability. Structure your campaigns around this hierarchy.

| **Temperature** | **Audience types** | **Efficiency** | **Reach** | **Campaign role** |
| --- | --- | --- | --- | --- |
| 🔥 **Hot** | Cart abandoners, form abandoners, product viewers | Highest | Smallest | Priority 1: Capture ready buyers |
| 🌡️ **Warm** | All site visitors, Customer Match, YouTube engaged | High | Limited | Priority 2: Re-engage interested users |
| ❄️ **Cool** | Custom segments (search/URLs), Lookalikes (Demand Gen only) | Medium | Good | Priority 3: High-intent prospecting |
| ❄️ **Cold** | In-market, life events | Low-Medium | Broad | Priority 4: Category prospecting |
| 🧊 **Coldest** | Affinity, demographics only | Lowest | Maximum | Priority 5: Awareness (if budget allows) |

> ↪️ **Cross-reference:** For the underlying theory, see [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md). For how awareness stage affects messaging, see [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md).

---

## The tiered campaign structure

### The core framework

```
UPPER FUNNEL CAMPAIGNS
│
├── 🔷 TIER 1: REMARKETING (Hot → Warm)
│   ├── Cart/Form Abandoners (highest priority)
│   ├── Product/Service Page Visitors
│   ├── All Site Visitors
│   └── Customer Match / YouTube Engaged
│
├── 🔷 TIER 2: HIGH-INTENT PROSPECTING (Cool)
│   ├── Custom Segments (search terms, competitor URLs)
│   └── Lookalike Segments (Demand Gen only)
│
└── 🔷 TIER 3: AWARENESS PROSPECTING (Cold → Coldest)
    ├── In-Market Segments
    ├── Life Events
    └── Affinity / Demographics
```

### Why this order matters

| **Tier** | **Purpose** |
| --- | --- |
| **Tier 1** | Capture users who already know you |
| **Tier 2** | Find users with relevant intent |
| **Tier 3** | Build awareness for future demand |

---

## The exclusion cascade

Exclusions prevent wasted spend and ensure users see the right message.

### Mandatory exclusions

| **From this campaign** | **Exclude these audiences** |
| --- | --- |
| **All upper funnel campaigns** | Recent converters (use your average sales cycle length: 7 days for e-commerce, 14 days for local services, 30-90 days for B2B/SaaS) |
| **Prospecting campaigns** | All remarketing audiences |
| **Tier 2 prospecting** | Tier 3 audiences (if running both) |
| **All campaigns** | Irrelevant placements (apps, kids content, etc.) |

### The cascade logic

```
USER CONVERTS → Excluded from all campaigns (match to sales cycle: 7d ecom / 14d local / 30-90d B2B)
                    ↓ (after exclusion window)
USER VISITS SITE → Moves to Remarketing tier
                    ↓ (excluded from)
                    Prospecting campaigns
```

> 💡 **Practical tip:** Create audience segments at different recency windows (7 days, 14 days, 30 days, 90 days) for flexible exclusion strategies.

---

## Campaign structure by type

### Display campaigns

| **Segment** | **Campaign focus** |
| --- | --- |
| **Remarketing** | Dynamic remarketing (e-commerce) or standard remarketing |
| **Prospecting** | Custom segments, in-market audiences |
| **Brand/Awareness** | Affinity + demographics (if running) |

**Key structural decisions:** Audience targeting is primary, content targeting is secondary (layer on top, never standalone). Optimized targeting OFF for remarketing, tested for prospecting. Combined segments (AND logic) sharpen broad prospecting audiences.

> ↪️ **Display setup.** See [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) for configuration details and [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) for exclusion settings.

### Video campaigns

> 💡 **Video campaigns are for awareness and consideration only:** For conversion goals, use Demand Gen instead.

| **Goal** | **Campaign subtype** | **Best for** |
| --- | --- | --- |
| **Maximum reach** | Video Reach - Efficient Reach | Broad awareness at lowest CPM |
| **Guaranteed delivery** | Video Reach - Non-skippable | Full message completion |
| **Repeated exposure** | Video Reach - Target Frequency | Reinforcement and recall |
| **Storytelling** | Ad Sequence | Multi-step awareness → consideration |
| **Engagement** | Video Views | Product demos, explainers |
| **Channel growth** | YouTube Subscriptions & Engagements | Subscriber acquisition |

**Key structural decisions:** Skippable formats for consideration, non-skippable/bumper for awareness. Short videos (<15s) for awareness, longer for consideration. The expansion setting for Video consideration/awareness is called "audience expansion" (different from "optimized targeting").

> ↪️ **Video setup.** See [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) for configuration. See [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) for expansion settings.

### Demand Gen campaigns

Demand Gen is now the **conversion-focused upper funnel campaign type:** it absorbed Video Action Campaigns in 2025. Use Demand Gen to optimize for conversions across YouTube, Discover, and Gmail.

| **Segment** | **Audience strategy** |
| --- | --- |
| **Remarketing** | Site visitors, Customer Match (with product feed integration for dynamic creative) |
| **Prospecting** | Lookalike segments + custom segments (Lookalikes are exclusive to Demand Gen) |
| **Expansion** | In-market with Optimized Targeting for AI-driven expansion |

**Key structural decisions:** Start with narrow Lookalike reach from highest-value seed list, widen if volume constrained. Optimized targeting OFF for remarketing. Combine lookalike and custom segments in the same ad group (Google-recommended Demand Gen approach). Use both video and image creative formats.

> ↪️ **Demand Gen setup.** See [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) for configuration. See [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) for lookalike and expansion settings.

---

## Ad group structure

### The simplicity principle

Unlike Search ad groups (which need tight keyword-to-ad alignment), Upper Funnel ad groups are **audience containers**.

| **Upper Funnel ad group** | **Search ad group** |
| --- | --- |
| One audience segment per ad group | One intent/creative theme per ad group |
| Creative variations within ad group | Asset variations within RSA |
| Simpler structure | More complex structure |

### Recommended structure

| **Ad group type** | **What it contains** | **Example** |
| --- | --- | --- |
| **Remarketing** | Single audience segment + relevant creative | "Cart Abandoners - 7 Days" |
| **Prospecting** | Single audience type + prospecting creative | "Custom Segment - Competitor URLs" |
| **Awareness** | Broader audience + awareness creative | "In-Market - Home Improvement" |

> 💡 **Rule of thumb:** If you need different creative, make a different ad group. If you need different campaign-level settings, such as budget or bidding, make a different campaign.

---

## Volume thresholds

> ↪️ **For complete thresholds by bid strategy, campaign type, budget viability checks, and tactics when volume is insufficient:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

---

## Failure modes

| **Mistake** | **What happens** | **How to prevent** |
| --- | --- | --- |
| **Starting with cold audiences** | Low efficiency burns budget before learning | Start with remarketing, expand outward |
| **No exclusion cascade** | Users see wrong ads, budget wasted | Implement exclusions before launch |
| **Same creative across temperatures** | Message doesn't match awareness stage | Different creative per tier |
| **Using Video campaigns for conversions** | Video campaigns are for awareness/consideration only | Use Demand Gen for conversion goals |
| **Over-segmented ad groups** | Insufficient data per segment | Consolidate until volume supports |
| **Optimized Targeting ON everywhere** | Loses audience control | Use selectively for prospecting only |
| **Never checking audience insights** | Missing high-performing untargeted segments | Review Insights page monthly to discover new audiences |
| **Ignoring demographics** | Missing easy optimization from excluding zero-conversion groups | Review demographic performance monthly |
| **Confusing optimized targeting with audience expansion** | Different features applied to wrong campaign types | Optimized targeting for Display/DG/Video performance. Audience expansion for Video consideration/awareness only |
| **No placement exclusions** | Spend wasted on apps, kids content | Exclusion list from day one |
| **Running Display/Video alongside PMax without coordination** | Auction overlap, unclear attribution | Define clear roles for each |

---

## Key principles

1. **Remarketing first:** Build your hot/warm remarketing foundation before prospecting. Capture your warmest audience first.
2. **Temperature guides structure:** Campaign tiers should follow the audience temperature hierarchy: hot → warm → cool → cold.
3. **Exclusions are mandatory:** Every Upper Funnel campaign needs recent converters excluded. Prospecting campaigns need remarketing audiences excluded.
4. **Creative matches temperature:** Cold audiences need problem/pain messaging. Warm audiences need offer details and urgency (See [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md)).
5. **Demand Gen for conversions, Video for awareness:** If you want conversion-optimized Upper Funnel campaigns, use Demand Gen. Video campaigns are now exclusively for awareness and consideration goals.
6. **Consolidate until constrained:** Fewer, larger campaigns/ad groups learn faster. Only segment when you have volume AND a strategic reason.
7. **Coordinate with PMax:** If running Performance Max, define clear roles to avoid overlap and attribution confusion.

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Foundation (audience systems, temperature framework, combined segments, audience insights) |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference (optimized targeting vs. audience expansion, demographics, combined segments, audience insights) |
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Catalog (segment configurations, combined segment patterns, demographics optimization patterns) |
| [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) | Guideline (expansion settings, targeting mode, demographic optimization) |
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Guideline (brand safety and content exclusion settings) |
| [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md) | Messaging (how to match message to funnel stage) |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Coordination (PMax vs. dedicated campaign decisions, Ecommerce) |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Coordination (PMax vs. dedicated campaign decisions, Lead Gen/SaaS) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference (volume thresholds per bid strategy) |
| [Upper Funnel Channel Selection Mental Model](../mental-models/Upper Funnel Channel Selection Mental Model.md) | Related (cross-platform channel selection) |
| [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) | Execution (Display campaign setup) |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Execution (Video campaign setup) |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Execution (Demand Gen campaign setup) |

---

## Version details

- **Version:** 7.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.