# Search Campaign Structure Mental Model
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: MENTALMODEL_3
Status: Done
Reference Type: Mental Model
Agent_Readable: No
Human_Facing: No
Applies_To: Search
Domain: Search
Pillar: 6

## Purpose

This mental model helps you decide how to organize Search campaigns to balance control, budget allocation, and algorithmic learning.

> ❓ **The core question:** Should I split this into separate campaigns, or keep it consolidated?

Campaigns are the **highest level of control** in Google Ads. They determine:

- **Budget:** How much you spend per day/month on a given set of targeting
- **Bid strategy:** What you're optimizing for and at what target
- **Targeting scope:** Location, language, networks, scheduling
- **Conversion goals:** Which actions you're optimizing toward

---

## What this is NOT

This mental model does **not:**

- Explain ad group structure or keyword grouping within campaigns (See: [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md))
- Provide step-by-step campaign setup instructions (See: [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md))
- Cover Shopping or PMax campaign structure (See: [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md), [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>), [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>))
- Explain brand separation implementation details (See: [Brand Separation Reference](../references/Brand Separation Reference.md))

---

## The core trade-off

> 💡 **More campaigns = more control, but fragmented data. Fewer campaigns = more data for Smart Bidding, but less granular control.**

| **Approach** | **Benefit** | **Risk** |
| --- | --- | --- |
| **Consolidation** | More data per campaign, faster learning, simpler management | Less granular budget/target control |
| **Segmentation** | Precise control over budgets, targets, and goals | Data fragmentation, slower learning, higher management overhead |

**Why Search favors consolidation:**

- Smart Bidding bids at the **query level**, not the campaign level
- More queries in one campaign = more signals for the algorithm
- Fragmented campaigns each need to hit volume thresholds independently
- You control targeting through keywords: structure is about budget/bid control, not ad relevance (that's ad group's job)

---

## The Golden Rule

> 💡 **Consolidate by default:** Segment only when segmentation enables different budget, bid strategy, targeting, or business control.

**The test:** If you cannot describe the budget/target/control difference in one sentence, don't split.

---

## Campaign vs. Ad Group: What lives where

Before making structure decisions, understand what belongs at each level:

| **Decision** | **Campaign level** | **Ad group level** |
| --- | --- | --- |
| **Budget** | ✅ Daily/monthly spend | ❌ No ad group budgets |
| **Bid strategy** | ✅ tCPA, tROAS, Max Clicks, etc. | ❌ Inherited from campaign |
| **Targets** | ✅ CPA/ROAS targets | ❌ Inherited from campaign |
| **Location** | ✅ Country, region, radius | ❌ Inherited from campaign |
| **Ad scheduling** | ✅ Days/hours | ❌ Inherited from campaign |
| **Networks** | ✅ Search, Search Partners | ❌ Inherited from campaign |
| **Conversion goals** | ✅ Which actions to optimize for | ❌ Inherited from campaign |
| **Ad copy/creative** | ❌ Lives in ad groups | ✅ RSAs per ad group |
| **Keywords** | ❌ Lives in ad groups | ✅ Keywords, match types |
| **Landing pages** | ❌ Lives in ad groups | ✅ Final URLs at ad/keyword level |

> 💡 **Rule of thumb:** If you need different budgets, bid strategies, targets, locations, or conversion goals → campaign split. If you need different ads or landing pages → ad group split (or keyword-level Final URL).

---

## Failure modes

Every Search campaign structure problem falls into one of two categories:

| **Failure mode** | **What it looks like** | **Symptoms** |
| --- | --- | --- |
| **Over-segmentation** | Too many campaigns, insufficient data per campaign | Campaigns stuck in "Learning". Inconsistent performance. High management overhead. Targets rarely hit. Multiple campaigns for minor keyword variations. |
| **Under-segmentation** | Too few campaigns, can't control budget/targets for different business needs | Budget consumed by wrong services/intents. Can't set different targets for different margins. Brand and non-brand blended. No budget protection for key areas. |

**Your job:** Find the sweet spot: enough segmentation for business control, enough consolidation for algorithmic learning.

---

## Reasons to segment

Segment campaigns when you need:

| **Reason** | **Example** | **Why it requires campaign split** |
| --- | --- | --- |
| **Different budgets** | Brand vs. non-brand, Service A vs. Service B | Budget is set at campaign level |
| **Different bid strategies** | tCPA for leads, tSIS for brand | Bid strategy is set at campaign level |
| **Different efficiency targets** | €30 CPA for high-margin, €50 CPA for low-margin | Targets are set at campaign level |
| **Different conversion goals** | Lead form vs. phone call | Conversion goals can be set per campaign |
| **Different geographies** | Different countries, regions with different performance | Location targeting, language, scheduling |
| **Different networks** | Search only vs. Search + Partners | Network settings at campaign level |
| **Regulatory/compliance** | Pharma, finance, alcohol with restricted targeting | May require separate campaign settings |
| **New vs. established** | New service launch vs. proven performers | Different targets, budget protection |
| **Hero keywords** | Top 1-3 keywords driving >10% of spend | Dedicated budget and bid control |

---

## Reasons to consolidate

Consolidate campaigns when:

| **Reason** | **Example** | **Why consolidation helps** |
| --- | --- | --- |
| **Insufficient conversion data** | Campaign has <30 conversions/month | Smart Bidding needs data to learn |
| **Same business treatment** | Services with same targets, budgets, goals | Fragmentation without purpose |
| **New markets/services** | Testing traction in new area | Start consolidated, segment when data justifies |
| **Short-term campaigns** | Seasonal promotions | Not enough time for segmentation to learn |
| **Resource constraints** | Limited time for management | Simpler structures = better optimization |
| **Legacy over-segmentation** | 50+ campaigns for minor variations | Consolidate aggressively |
| **Campaign per keyword theme** | Separate campaigns for "CRM" vs "CRM software" | This is ad group's job, not campaign's |

---

## Volume thresholds

Smart Bidding needs sufficient conversion volume to optimize effectively. Each campaign needs at least 30 conversions/month for Target CPA, 50+ for Target ROAS. Below these thresholds, consolidate campaigns or use Portfolio Bid Strategies.

> ↪️ **For complete thresholds by bid strategy, budget viability checks, and tactics when volume is insufficient:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

---

## The segmentation decision framework

```
                 ┌─────────────────────────────────────┐
                 │  Do you need DIFFERENT...           │
                 │  • Budget?                          │
                 │  • Bid strategy?                    │
                 │  • Targets (CPA/ROAS)?              │
                 │  • Conversion goals?                │
                 │  • Location/language?               │
                 │  • Network settings?                │
                 └──────────────┬──────────────────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
                YES                            NO
                 │                             │
                 ▼                             ▼
    ┌────────────────────────┐    ┌────────────────────────┐
    │ Will split campaigns   │    │ Can you solve it at    │
    │ have enough volume?    │    │ the ad group level?    │
    │ (≥30 conv/month each)  │    │ (Different ads, LPs)   │
    └───────────┬────────────┘    └───────────┬────────────┘
                │                             │
     ┌──────────┴──────────┐       ┌──────────┴──────────┐
     │                     │       │                     │
    YES                    NO     YES                    NO
     │                     │       │                     │
     ▼                     ▼       ▼                     ▼
┌─────────┐        ┌─────────────┐ ┌─────────┐    ┌─────────────┐
│  SPLIT  │        │ Consider:   │ │ AD GROUP│    │ Re-evaluate │
│         │        │ • Portfolio │ │ SPLIT   │    │ the need    │
└─────────┘        │   bid strat │ └─────────┘    └─────────────┘
                   │ • Consolidate│
                   │   & use labels│
                   └─────────────┘
```

---

## Search + PMax coordination

When running both Search and Performance Max in the same account, your Search campaign structure directly affects query routing. Exact match keywords in Search take priority over PMax. Phrase/broad match may lose to PMax based on Ad Rank.

> ↪️ **For the full keyword selection hierarchy, query protection tactics, and brand exclusion coordination:** See [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md).

**Key structural implications:**

- Protect high-value queries by adding them as exact match in Search
- Create a dedicated Brand Search campaign + brand exclusions in PMax (See: [Brand Separation Reference](../references/Brand Separation Reference.md))
- Do not over-keyword Search campaigns: let PMax discover incremental queries

> 💡 **PMax and Search are complementary:** Search gives you keyword-level control for queries you know. PMax finds queries you do not know. Structure Search to cover your known high-value terms, and let PMax expand beyond them.

**AI Max as an additional option:** AI Max for Search campaigns adds DSA-style keywordless matching and AI-generated text customization within standard Search campaigns. If you run feed-only PMax (no creative assets), AI Max can provide the Search coverage you need without building separate DSA campaigns. However, AI Max lacks DSA's page feed controls and may expand beyond your intended focus. See [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) for when AI Max fits your structure.

---

## The Hero Keyword Pattern

If you have 1-2 keywords representing **>30% of total Search spend and/or conversions**, consider a dedicated "Hero" campaign.

### Qualification Criteria

| **Criteria** | **Requirement** |
| --- | --- |
| Spend share | >30% of total Search spend |
| OR conversion share | >30% of total Search conversions |
| Match types | Exact + Phrase (default). Add Broad only with proven routing and negatives. |
| NOT | Brand terms (those belong in Brand campaign) |

### Why "Hero Campaigns" work

| **Benefit** | **Explanation** |
| --- | --- |
| **Control** | High spend demands dedicated budget and bid control |
| **Precision** | Tailored ads and extensions for your most valuable keyword |
| **Visibility** | Creates a "heartbeat" for account health |
| **Auction insights** | Clearer competitive intelligence |

**Examples:** `[car insurance]`, `[running shoes]`, `[crm software]`, `[emergency plumber]`

> ⚠️ **This is NOT SKAGs:** Hero campaigns are for your 1-3 highest-impact keywords only. Do not create single-keyword campaigns for every keyword.
> ⚠️ **Match type warning:** Broad/phrase match in a Hero campaign can pollute the signal. Start with Exact.

---

## Example structures by vertical

Each example shows the same principles applied: brand separated, campaigns split by business control needs, consolidated where possible.

### Lead Generation (B2B SaaS)

| **Campaign** | **Split rationale** |
| --- | --- |
| Brand (Target Impression Share) | Protect brand queries, different bid strategy |
| Hero: top keyword (tCPA €45) | >30% of conversions deserves dedicated budget |
| Non-Brand: High Intent (tCPA €50) | Transactional keywords with proven conversion rates |
| Non-Brand: Research (tCPA €80) + DSA ad group | Higher CPA tolerance for earlier-funnel keywords with DSA for long-tail discovery |

### Local Services (Multi-Location)

| **Campaign** | **Split rationale** |
| --- | --- |
| Brand (Target Impression Share) | Protect brand queries |
| Emergency Services (tCPA €75, 24/7) | Call-based conversion goal, different scheduling |
| Scheduled Services (tCPA €50, business hours) | Lead form conversion goal, standard hours |
| Location-Specific (only if needed) | Budget isolation per city (otherwise use location targeting) |

### E-commerce (Search Portion)

| **Campaign** | **Split rationale** |
| --- | --- |
| Brand (Target Impression Share) | Protect brand queries |
| Hero: top keyword (tROAS 350%) | >30% of spend justifies dedicated control |
| Category: Running (tROAS 350%) + DSA ad group | Category-specific ROAS target with DSA for long-tail discovery |
| Category: Training (tROAS 400%) + DSA ad group | Higher margin = higher ROAS target with DSA for long-tail discovery |

> ↪️ For e-commerce, Search is typically complemented by Shopping/PMax. See [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) for Shopping vs. PMax decisions, and [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) for PMax structure.

---

## Common mistakes

| **Mistake** | **Why it's a problem** | **What to do instead** |
| --- | --- | --- |
| Segmenting for reporting | Creates fragmentation without control benefit | Use labels, custom columns, segments |
| Campaign per keyword theme | Ad group's job, not campaign's | Use ad groups for themes |
| Campaign per RSA/ad theme | Ad group's job, not campaign's | Use ad groups for messaging angles |
| Campaign per device | Fragments data; Smart Bidding handles devices | Use device bid adjustments |
| Campaign per audience | Fragments data unnecessarily | Use observation mode + bid adjustments |
| Campaign per minor geo variation | Fragments without meaningful control | Use location targeting; split only for budget isolation |
| Over-segmenting new accounts | Not enough data to feed multiple campaigns | Start consolidated, segment when data supports |
| Under-segmenting brand | Brand inflates non-brand metrics | Separate brand at campaign level |
| Mixing conversion goals | Confuses Smart Bidding optimization | One primary goal per campaign |
| Too many campaigns with tROAS | Each needs 50+ conversions/month | Consolidate or use Portfolio Bid Strategy |
| No catch-all/fallback | Miss long-tail opportunities | Add DSA ad groups within keyword campaigns (See: [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md)) |
| Letting PMax steal brand | Inflates PMax metrics, lose brand control | Brand Search campaign + brand exclusions in PMax |

---

## Key principles

1. **Consolidate by default:** Only segment when you need different budget, bid strategy, targets, or conversion goals.
2. **Campaign structure is about control, not relevance:** Ad relevance is the ad group's job.
3. **Volume enables learning:** Each campaign needs ≥30 conversions/month for tCPA, ≥50 for tROAS. See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).
4. **Brand always separates:** Different metrics, different targets, different purpose. See [Brand Separation Reference](../references/Brand Separation Reference.md).
5. **Hero keywords earn isolation.** >30% of spend/conversions = dedicated campaign.
6. **Search + PMax are complementary:** Search controls known high-value queries (exact match). PMax discovers incremental queries. See [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md).
7. **DSA catches what keywords miss:** Add DSA ad groups within keyword campaigns for long-tail discovery. Only create a separate DSA campaign when budget isolation or different efficiency targets are needed. (See: [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md))

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Upstream (overarching Search philosophy: consolidation, bidding-match type interaction, creative themes) |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Downstream (ad group decisions within campaigns) |
| [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md) | Downstream (DSA placement within campaign structure) |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Parallel (coordinates with Search structure, Ecommerce) |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Parallel (coordinates with Search structure, Lead Gen/SaaS) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference (bid strategy volume thresholds) |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | Reference (query routing between Search and PMax) |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference (brand separation implementation) |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | Uses campaign/ad group hierarchy context |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Reference (bid strategy selection and requirements) |
| [Match Type Reference](../references/Match Type Reference.md) | Reference (match type behavior and keyword selection hierarchy) |
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Related (AI-driven automation option within Search campaigns) |
| SOP: Build Search Campaign Structure | Execution (step-by-step campaign construction) |

---

## Version details

- **Version:** 6.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.