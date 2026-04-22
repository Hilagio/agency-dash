# Search Ad Group Structure Mental Model
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: MENTALMODEL_4
Status: Done
Reference Type: Mental Model
Agent_Readable: No
Human_Facing: No
Applies_To: Search
Domain: Search
Pillar: 6

## Purpose

This mental model helps you decide how to group keywords into ad groups to maximize ad relevance without fragmenting data.

> ❓ **The core question:** Can one RSA effectively serve all keywords in this ad group?

Ad groups are the **relevance layer** of your Search account. They determine:

- **Which keywords trigger which ads:** Keywords live in ad groups
- **Which ads serve which intent:** RSAs live in ad groups
- **Which landing pages match which queries:** Final URLs set at ad/keyword level

---

## What this is NOT

This mental model does **not:**

- Explain campaign-level structure decisions like budget or bid strategy splits (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Provide RSA writing instructions or headline slot assignments (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))
- Cover ad group structure for Display, Video, or Demand Gen campaigns (See: [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md))
- Explain how to match messaging to audience awareness stage (See: [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md))

---

## Campaign vs. Ad Group

Understanding what belongs where prevents structural mistakes:

| **Decision** | **Campaign level** | **Ad group level** |
| --- | --- | --- |
| **Budget** | ✅ Controls spend | ❌ No ad group budgets |
| **Bid strategy** | ✅ tCPA, tROAS, etc. | ❌ Inherited |
| **Efficiency targets** | ✅ CPA/ROAS targets | ❌ Inherited (but can be overruled) |
| **Conversion goals** | ✅ Which actions to optimize | ❌ Inherited |
| **Location/Language** | ✅ Geographic targeting | ❌ Inherited |
| **Ad scheduling** | ✅ Days/hours | ❌ Inherited |
| **Keywords** | ❌ | ✅ Keywords live here |
| **Ad copy (RSAs)** | ❌ | ✅ RSAs live here |
| **Landing pages** | ❌ | ✅ Final URLs here |
| **Ad relevance** | ❌ | ✅ Controlled here |

> 💡 **The simple rule:** Campaigns control *budget and targets*. Ad groups control *relevance and messaging*.

---

## The Core Trade-off

> 💡 **More ad groups = more tailored ads, but fragmented data. Fewer ad groups = more data per RSA, but less specific messaging.**

| **Approach** | **Benefit** | **Risk** |
| --- | --- | --- |
| **Consolidation** | More impressions per RSA, faster learning, simpler management | Ads may feel generic for some keywords |
| **Segmentation** | Highly specific ads per keyword theme | Data fragmentation, more RSAs to manage, potential duplication |

**Why ad groups favor consolidation more than you think:**

- RSAs with **7-8 headlines** can cover multiple angles without data poverty (See: SOP — [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) for the combinatorics)
- **Dynamic Keyword Insertion** adapts H1 to the search query
- **Keyword-level Final URLs** let you route to different pages without splitting
- **Ad Customizers** let you vary messaging per keyword within one RSA
- Smart Bidding optimizes at the **query level**, not ad group level

> ⚠️ **Why 7-8 headlines, not 15?** More headlines = more combinations = less data per combination = slower learning. A 15-headline RSA creates 2,730 possible 3-headline combinations. You'd need ~273,000 impressions for meaningful data. With 7-8 headlines, that drops to ~33,600.

---

## The Golden Rule

> ⚠️ **Consolidate by default. Split only when one RSA cannot credibly serve all keywords.**

**The test:** If you need fundamentally different messaging (not just a different H1), split the ad group.

---

## The Single Ad Test

The Single Ad Test determines whether keywords belong together in one ad group.

> ❓ **Ask yourself:** Can one RSA serve all keywords in this ad group without any headline or description feeling generic or mismatched?

### How to run the test

1. List the top 10 keywords in the ad group (by impressions)
2. For each keyword, imagine the ideal ad: 
    1. What would the 2/3 headline combination say? 
    2. What would the description emphasize?
3. Ask: Can one RSA cover all these variations?
    1. IF **yes** → Keep consolidated
    2. IF **no** → Diagnose the divergence type (see below)

### Pass examples

| **Keywords** | **Why it passes** | **RSA strategy** |
| --- | --- | --- |
| "crm software", "crm platform", "crm tool" | Same intent, synonyms | DKI in H1, H2-H7 cover standard angles (value prop, USP, social proof, risk removal, CTA) |
| "emergency plumber", "24 hour plumber", "plumber near me now" | Same urgency, same need | DKI in H1, H2-H7 cover remaining angles identically with urgency modifiers |
| "running shoes", "running shoes free shipping", "running shoes sale" | Same product, commercial modifiers | H1 product anchor, commercial modifiers addressed in H2-H7 angle slots (e.g., shipping in value booster, sale in CTA) |
| "divorce lawyer amsterdam", "divorce attorney amsterdam" | Same intent, synonym + location | DKI or location insertion in H1, H2-H7 identical across both keywords |

### Fail examples

| **Keywords** | **Why it fails** | **The split** |
| --- | --- | --- |
| "crm software" + "what is crm" | Buy intent vs. learn intent | Transactional AG vs. Informational AG |
| "crm for small business" + "enterprise crm" | Different audiences, different messaging | SMB AG vs. Enterprise AG |
| "crm software" + "crm certification" | Product vs. education | Software AG vs. Certification AG |
| "running shoes" + "best running shoes for flat feet" | Generic vs. specific need | Core AG vs. Flat Feet AG |

---

## Intent divergence taxonomy

When the Single Ad Test fails, diagnose *what kind* of divergence you're seeing:

| **Divergence type** | **Description** | **Split?** | **Reasoning** |
| --- | --- | --- | --- |
| **Funnel stage** | Informational vs. commercial vs. transactional | ✅ Always | Completely different ad messaging required |
| **Audience segment** | SMB vs. Enterprise, B2B vs. B2C | ✅ Yes | Different pain points, proof points, CTAs |
| **Problem / use case** | "CRM for sales" vs. "CRM for support" | ⚠️ Often | May need different value props; evaluate volume |
| **Product / service type** | "CRM" vs. "project management" | ✅ Always | Different products = different ad groups |
| **Feature / attribute** | "CRM with email" vs. "CRM with reporting" | ⚠️ If high volume | Can often handle with multiple headlines |
| **Commercial modifier** | "CRM" vs. "best CRM" vs. "CRM reviews" | ❌ No | Same intent, different query phrasing |
| **Synonym / variant** | "CRM" vs. "customer relationship management" | ❌ No | Identical intent |
| **Location modifier** | "plumber" vs. "plumber amsterdam" | ❌ No | Use location insertion or keyword-level URLs |
| **Singular / plural** | "running shoe" vs. "running shoes" | ❌ No | Close variants, same intent |

---

## Decision framework

```
           ┌─────────────────────────────────────┐
           │  Run the Single Ad Test             │
           │  Can one RSA serve all keywords?    │
           └──────────────┬──────────────────────┘
                          │
           ┌──────────────┴──────────────┐
           │                             │
          YES                            NO
           │                             │
           ▼                             ▼
┌──────────────────┐         ┌──────────────────────┐
│KEEP CONSOLIDATED │         │ Diagnose divergence  │
│                  │         │ type (taxonomy above)│
└──────────────────┘         └──────────┬───────────┘
                                        │
                     ┌──────────────────┴──────────────────┐
                     │                                     │
           Funnel / Audience /                    Modifier / Synonym /
           Problem / Product                      Location / Variant
                     │                                     │
                     ▼                                     ▼
           ┌──────────────────┐                 ┌──────────────────────┐
           │ SPLIT AD GROUPS  │                 │ KEEP CONSOLIDATED    │
           │                  │                 │ Use DKI, customizers,│
           │                  │                 │ or keyword-level URLs│
           └──────────────────┘                 └──────────────────────┘
```

---

## Alternatives to splitting

Before creating a new ad group, consider these alternatives:

| **Alternative** | **Use when** | **How it works** |
| --- | --- | --- |
| **Dynamic Keyword Insertion** | Keywords are synonyms/variants | H1 adapts to match the triggering keyword. See: [Dynamic Text Reference](../references/Dynamic Text Reference.md) for syntax, limits, and fallback behavior |
| **Keyword-level Ad Customizers** | Need different descriptors per keyword | Custom attributes per keyword. See: [Dynamic Ad Customizer Attribute Catalog](../catalogs/Dynamic Ad Customizer Attribute Catalog.md) and [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md) |
| **Keyword-level Final URLs** | Same intent, different landing pages | Override RSA URL per keyword |
| **Location Insertion** | Location variants | Inserts the user's geographic location into the ad. See: [Dynamic Text Reference](../references/Dynamic Text Reference.md) for syntax and available location levels (city, state, country) |
| **Multiple headlines** | Different angles needed | Use H2-H7 for variations |

> ⚠️ **Rule of thumb:** If you can solve it with DKI, customizers, or keyword-level URLs: don't split. Splitting should be the last resort, not the first instinct.

---

## When splitting is correct

Split ad groups when:

| **Situation** | **Why splitting is correct** |
| --- | --- |
| **Funnel stage differs** | "What is X" needs educational ad, "buy X" needs transactional ad |
| **Audience segment differs** | SMB needs "affordable, easy" messaging; Enterprise needs "scalable, secure" |
| **Landing page intent differs** | Keywords need fundamentally different page types (blog vs. product page) |
| **Ad copy cannot be reconciled** | No single RSA can serve both keyword sets without being generic |
| **Quality Score is suffering** | Ad Relevance = Below Average despite good keywords |

---

## Ad Group naming convention

Clear naming prevents confusion and enables filtering:

**Pattern:** `[Intent/Theme] - [Modifier if needed]`

| **Good** | **Bad** |
| --- | --- |
| `CRM Software - Core` | `Ad Group 1` |
| `CRM Software - Enterprise` | `CRM keywords` |
| `Emergency Plumber` | `Plumber stuff` |
| `Running Shoes - Trail` | `RS-T-001` |

> 💡 **Tip:** Include the primary keyword theme in the name. You should be able to understand what's in the ad group without opening it.

---

## Example structures by vertical

Each example shows the Single Ad Test in action: ad groups split only when one RSA cannot credibly serve all keywords.

### Lead Generation (B2B SaaS)

| **Ad group** | **Split rationale (Single Ad Test)** | **Key technique** |
| --- | --- | --- |
| CRM Software - Core | Synonyms (software/platform/tool) pass the test | DKI in H1, ad customizers for modifiers |
| CRM Software - Enterprise | Audience divergence: "scalable, secure" messaging | Different LP (/enterprise/) |
| CRM Software - SMB | Audience divergence: "easy, affordable" messaging | Different LP (/small-business/) |
| CRM Pricing | Intent divergence: price shopping vs. feature evaluation | Different LP (/pricing/) |
| CRM Demo | Funnel stage divergence: bottom-funnel, trial-focused CTA | Different LP (/demo/) |

### Local services

| **Ad group** | **Split rationale (Single Ad Test)** | **Key technique** |
| --- | --- | --- |
| Emergency Plumber | Urgency keywords pass together (emergency, 24 hour, urgent) | Call CTA, urgency messaging |
| Plumber Near Me | Location variants pass together | Location insertion, keyword-level URLs by city |
| Plumber Installation | Service type divergence from repair | Service-specific LP |
| Plumber Repair | Service type divergence from installation | Service-specific LP |

### E-commerce

| **Ad group** | **Split rationale (Single Ad Test)** | **Key technique** |
| --- | --- | --- |
| Running Shoes - Core | Synonyms (shoes/sneakers/jogging) pass together | DKI in H1, ad customizers |
| Running Shoes - Trail | Problem/use case divergence: grip, durability messaging | Category LP (/trail/) |
| Running Shoes - Flat Feet | Problem/use case divergence: support/stability messaging | Category LP (/flat-feet/) |
| Running Shoes - Brands | Same intent (brand + product): all brands in one AG | Ad customizers for brand name, keyword-level URLs |

---

## Common mistakes

| **Mistake** | **Why it's a problem** | **What to do instead** |
| --- | --- | --- |
| **One keyword per ad group (SKAGs)** | Fragments data, no RSA learning, massive overhead | Consolidate by intent theme |
| **Splitting by match type** | Same intent, unnecessary fragmentation | Keep match types together |
| **Splitting by minor variant** | "CRM software" vs "CRM tool" don't need separate AGs | Use DKI and/or keyword level ad customizers |
| **Splitting by location** | "plumber amsterdam" vs "plumber rotterdam" | Use DKI, location insertion, keyword-level ad customizers + URLs |
| **Too many ad groups per campaign** | Management overhead, thin data | Aim for max 25 ad groups per campaign |
| **Generic ad group names** | Can't understand structure at a glance | Name by theme/intent |
| **Mixing funnel stages** | Can't write relevant ad for both | Split by funnel stage |
| **Mixing audiences** | SMB and Enterprise need different messaging | Split by audience |
| **Duplicating keywords across AGs** | Internal competition, wasted budget | One home per keyword |
| **No catch-all / DSA** | Miss long-tail opportunities | Use DSA ad group for discovery |

---

## The RSA-to-Ad-Group relationship

> 💡 **One RSA per ad group is the standard:** Multiple RSAs split impressions and slow learning.

| **Scenario** | **RSAs per ad group** | **Why** |
| --- | --- | --- |
| **Standard** | 1 | Consolidates learning, clear testing |
| **Testing angles** | 2 (via Experiments) | A/B test with statistical rigor |
| **Legacy cleanup** | Consolidate to 1 | Remove underperformers |

---

## Testing clusters: Structure enables testing

When multiple ad groups share the same intent theme, they can share an **RSA template:** the same slot assignments (H1 = Relevance Anchor, H2 = Value Prop, etc.) with only H1 varying per ad group. This enables **aggregated testing**: instead of 5,000 impressions per ad group, you get 50,000+ impressions across the cluster, reaching statistical significance faster.

| **Cluster concept** | **What it means** |
| --- | --- |
| **Template** | Same headline slots assigned to same angle types across ad groups |
| **Aggregation** | Pool asset performance data across ad groups for faster learning |
| **Iteration** | Test angle types at scale, not individual ads in isolation |

> ⚠️ **Structure enables testing:** If your ad groups are structured consistently (same slots = same angles), you can test creative at scale. If every ad group is a snowflake, you're trapped in data poverty.

See: [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) for full testing methodology.

---

## Key principles

1. **Ad groups control relevance, not budget:** If you need different budgets, that's a campaign decision.
2. **The Single Ad Test is your guide:** If one RSA can serve all keywords credibly, keep them together.
3. **Diagnose before splitting:** Use the Intent Divergence Taxonomy to understand *what kind* of divergence exists.
4. **Splitting is the last resort:** DKI, customizers, and keyword-level URLs often solve the problem without fragmentation.
5. **Funnel stage and audience almost always justify splits:** These create fundamentally different messaging needs.
6. **Synonyms, modifiers, and locations almost never justify splits:** Use dynamic features instead.
7. **One RSA per ad group:** Multiple RSAs fragment learning.
8. **7-8 headlines per RSA:** More headlines = more combinations = data poverty. (See: [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md))
9. **Name ad groups clearly:** You should understand the contents without opening them.
10. **Structure enables testing:** Consistent ad group structure allows aggregated creative testing across clusters.

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Upstream (overarching Search philosophy: consolidation, bidding-match type interaction, creative themes) |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Upstream (campaign decisions feed ad group decisions) |
| [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md) | Framework for matching message to intent stage (drives ad group splits by funnel stage) |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | Uses Single Ad Test in Phase 1 diagnosis |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Downstream (RSA composition, 7-8 headline slot distribution) |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Downstream (testing clusters, data poverty rationale, templating) |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | Reference for DKI, customizers, location insertion |
| [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md) | Reference for keyword-level customizers |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Reference for RSA headline types |

---

## Version details

- **Version:** 4.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.