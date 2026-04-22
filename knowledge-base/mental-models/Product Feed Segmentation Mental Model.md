# Product Feed Segmentation Mental Model
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: MENTALMODEL_9
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: No
Human_Facing: No
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

This mental model helps you decide how to segment your product catalog for budget allocation across Standard Shopping and PMax Feed-Only campaigns.

> ❓ **The core question:** How should I segment my product catalog so that budget goes to the right products?

This framework is **campaign-type-agnostic**: the same segmentation logic applies whether you run Standard Shopping or PMax Feed-Only. The campaign type determines bidding and settings. Segmentation determines which products get which budget and treatment.

> 💡 **The trade-off:** More segmentation = more control over product prioritization. Less segmentation = more data for algorithmic learning. Your structure must balance both.

> ↪️ **For campaign type selection:** See [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md). **For campaign-specific settings:** See [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) (Standard Shopping) or [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) (PMax).

---

## What this is NOT

This mental model does **not:**

- Explain product feed requirements (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- Explain campaign-type-specific settings (See: [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md))
- Provide custom label implementation details (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md))
- Provide step-by-step segmentation setup (See: [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md))
- Explain brand separation (See: [Brand Separation Reference](../references/Brand Separation Reference.md))

---

## The three segmentation tiers

| **Tier** | **Approach** | **Best for** | **Infrastructure** |
| --- | --- | --- | --- |
| **Tier 1** | Category-based + Building blocks | New accounts, simple catalogs, limited technical resources | Feed rules only |
| **Tier 2** | Performance-based (Hero/Sidekick/Villain/Zombie) | Mature accounts with 90+ days data, clear performance variance | Labeling tool required |
| **Tier 3** | Composite scoring model | Enterprise accounts, multiple data sources, custom prioritization | Feed management tool + data pipelines |

---

## Tier selection criteria

| **Question** | **Tier 1** | **Tier 2** | **Tier 3** |
| --- | --- | --- | --- |
| Conversion history? | <90 days | 90+ days | 90+ days |
| Clear performance variance? | No / Unknown | Yes | Yes |
| Labeling tool available? | No | Yes | Yes |
| Multiple data sources to combine? | No | No | Yes |
| Custom weighting needed? | No | No | Yes |

> 💡 **Start at Tier 1:** Graduate to higher tiers only when you have the data and infrastructure to support them. Premature complexity fragments your data.

---

## Tier 1: Category + Building Blocks

**Best for:** New accounts, simple catalogs, or when performance data is limited.

**Infrastructure:** Feed rules only (Merchant Center, Channable, DataFeedWatch)

Segment by product category when different categories need fundamentally different treatment:

| **Reason to segment** | **Example** |
| --- | --- |
| **Different ROAS targets** | Running shoes target 350%: accessories target 500% |
| **Different seasonality** | Winter gear vs. summer gear need different timing |
| **Different competitive dynamics** | Commoditized categories need different bidding |
| **Different margins** | High-margin vs. low-margin categories |

**Building blocks (stackable on top of category structure):**

| **Building block** | **Use case** | **Custom label example** |
| --- | --- | --- |
| **Sale Items** | Push products currently on promotion | `custom_label_1 = "on_sale"` |
| **Bestsellers** | Prioritize proven high-sellers | `custom_label_1 = "bestseller"` |
| **New Products** | Give new arrivals visibility | `custom_label_1 = "new"` |
| **High Inventory** | Push products with excess stock | `custom_label_1 = "high_stock"` |
| **Seasonal** | Push seasonal products at right times | `custom_label_1 = "summer"` |

> ↪️ **For all building block tactics with implementation details:** See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md).

**When to graduate to Tier 2:**

- 90+ days of conversion data accumulated
- Clear performance variance visible across products
- Labeling tool available (ProductHero, Profitmetrics)

---

## Tier 1 to Tier 2 migration

**Migration readiness signals:**

| **Signal** | **Threshold** | **Why it matters** |
| --- | --- | --- |
| Conversion history | 90+ days | Labeling tools need sufficient data to classify products accurately |
| Performance variance | Clear differentiation visible | If all products perform similarly, segmentation adds complexity without benefit |
| Labeling tool selected | Tool access confirmed | Migration requires automated label sync before campaign restructuring |

**Key migration principles:**

- Run new segmented campaigns alongside old campaigns briefly: do not delete old campaigns until new ones are stable
- Use the same tROAS across all new buckets
- Exclude segmented products from old campaigns to prevent overlap

> ↪️ **For the full step-by-step migration process:** See [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md).

---

## Tier 2: Performance-Based (Hero/Sidekick/Villain/Zombie)

**Best for:** Mature accounts with sufficient conversion history and clear performance differentiation.

**Infrastructure:** Labeling tool required. Choose based on your needs:

| **Tool** | **Type** | **Best for** | **Key difference** |
| --- | --- | --- | --- |
| **ProductHero Labelizer** | SaaS (paid) | Most accounts, easy setup | Automated labeling with pre-built tiers, plug-and-play |
| **Profitmetrics Shopping Booster** | SaaS (paid) | Profit-focused accounts | Integrates profit data for POAS-based labeling |

### The four performance tiers

Products fall into four tiers based on historical performance:

| **Tier** | **Definition** | **What they are** |
| --- | --- | --- |
| **Heroes** | High conversions, above ROAS target | Your best performers: protect and scale them |
| **Sidekicks** | Moderate conversions, above ROAS target | Solid contributors: maintain investment |
| **Villains** | Has conversions, below ROAS target | Budget drains: need attention or demotion |
| **Zombies** | <100 impressions in 90 days | Unknown potential: need visibility to evaluate. The 100-impression threshold exists because products with fewer impressions have insufficient data to evaluate performance. Below 100 impressions, any conversion data is statistically meaningless. |

> ⚠️ **The key insight:** You cannot know if a product is good or bad until it gets impressions. Zombies are not necessarily bad products, they are untested products.

### Tier behavior and treatment

| **Tier** | **Behavior** | **Treatment** | **Budget share** |
| --- | --- | --- | --- |
| **Heroes** | Convert efficiently, drive revenue | Maximize exposure: do not cap them | ~50-70% |
| **Sidekicks** | Steady performers, support revenue | Maintain: promote to hero when possible | ~15-25% |
| **Villains** | Spend but do not return | Reduce exposure: investigate root cause | ~5-10% |
| **Zombies** | Do not serve: unknown quality | Force impressions: let data decide their fate | ~10-20% |

### Bucket strategies by goal

| **Goal** | **Bucket structure** | **When to use** |
| --- | --- | --- |
| **Revenue focus** | Heroes + Sidekicks + Villains together: Zombies separate | Growth phase: willing to spend to discover winners |
| **Profitability focus** | Heroes + Sidekicks + Zombies together: Villains separate | Margin pressure: need to cut waste immediately |
| **Full control** | Each tier in separate bucket | 30+ conversions/bucket/month: want granular optimization |

> ⚠️ **Volume requirement:** Each bucket must independently meet conversion volume thresholds. If you cannot hit 30+ conversions per bucket per month, consolidate buckets.

> ↪️ **For volume thresholds by bid strategy:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

### When to graduate to Tier 3

- Multiple reliable data sources available (performance, margin, inventory, price competitiveness)
- Need unified prioritization across variables
- Business-specific weighting required

> ↪️ **For custom label implementation, tool configuration, and update frequency:** See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) Section 8: By Performance.

---

## Tier 3: Composite Scoring Model

**Best for:** Enterprise accounts with multiple data sources and need for custom prioritization logic.

**Infrastructure:** Feed management tool + multiple data pipelines (performance data, margin data, inventory feeds, price monitoring)

Combines multiple variables into a single weighted score.

> ⚠️ **The weights below are illustrative, not prescriptive:** Your weights depend on your business priorities. A margin-first business weights margin higher. A volume-first business weights performance higher. Define your own weights based on what matters most to your business.

| **Variable** | **Weight (illustrative)** | **Points range** |
| --- | --- | --- |
| Performance tier | 35% | Hero=10, Sidekick=7, Villain=3, Zombie=1 |
| Price competitiveness | 30% | Below market=10, Competitive=7, Parity=4, Overpriced=1 |
| Profit margin | 20% | High=10, Standard=5, Low=2 |
| Inventory level | 15% | High=10, Normal=5, Low=2 |

**Priority buckets by score:**

| **Score** | **Priority** | **Budget treatment** |
| --- | --- | --- |
| 7-10 | High | Highest allocation |
| 5-7 | Medium | Standard allocation |
| <5 | Low | Restricted allocation |

> 💡 **Advanced tactic:** Only use when you have reliable data across multiple dimensions. Garbage in = garbage out.

> ↪️ **For scoring model calculation, example implementation, and setup:** See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) Section 9: By Composite Score, and [SOP – Set Up Scoring Model Segmentation](../sops/SOP – Set Up Scoring Model Segmentation.md).

---

## The critical tROAS rule

> ⚠️ **Same tROAS target across all buckets:** Differentiate via budget, not bid targets.

**Why?** Different tROAS targets cause products to get stuck:

- A villain with a 300% target has no incentive to reach 400% (the hero threshold)
- Products that improve will not naturally flow upward
- You create artificial ceilings

**Instead:** Same tROAS everywhere + different budgets = control without breaking product flow.

---

## Why margin-based segmentation does not work well

| **Problem** | **Explanation** |
| --- | --- |
| **Click does not equal purchase** | Users do not always buy the product they clicked on |
| **Attribution is misleading** | Product that gets credit is not necessarily what drove the sale |
| **Cart behavior** | Users often buy multiple products. Which margin segment gets credit? |

**Better approach:** Optimize for **POAS (Profit on Ad Spend)** instead of ROAS. If you must consider margins, use it as a filter within performance buckets, not the primary segmentation axis.

---

## Common failure modes

| **Failure** | **Why it happens** | **Fix** |
| --- | --- | --- |
| **Different tROAS per bucket** | Seems logical but breaks product flow | Use same tROAS, vary budget |
| **Not excluding segmented products** | Overlap between campaigns | Set exclusions in all legacy campaigns |
| **Zombie bucket not spending** | Bidding too aggressive for untested products | Use Maximize Conversions (no tROAS) for zombies |
| **Threshold too tight** | Good products demoted on short-term dips | Set tool threshold ~25% below Google Ads tROAS |
| **Too many buckets, too little data** | Each bucket starves | Consolidate until 30+ conversions/bucket/month |
| **Structure without infrastructure** | No custom labels in feed | Implement feed infrastructure first |
| **Premature Tier 2/3** | Insufficient data for classification | Start Tier 1, graduate when criteria met |

---

## Key principles

1. **This framework applies to both Standard Shopping and PMax Feed-Only:** The segmentation logic is identical. Campaign type determines bidding and settings, not segmentation.
2. **Segment only when you have the data:** Premature segmentation fragments your data and slows learning.
3. **Zombies are not bad, they are unknown:** A product with no impressions has no chance to prove itself.
4. **Same tROAS, different budgets:** This is the key to segmentation that works.
5. **Products should flow between tiers:** Good segmentation creates mobility. If products are stuck, your thresholds are wrong.
6. **Complexity has a cost:** Only add complexity when you have the volume and resources to support it.

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Prerequisite (feed quality requirements) |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Upstream (Standard Shopping vs. PMax decision) |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Downstream (Standard Shopping-specific settings) |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Downstream (PMax-specific structure) |
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Reference (all campaign settings) |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Reference (all 9 segmentation tactics, custom label implementation) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference (volume thresholds per bid strategy) |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Prerequisite (brand separation before segmentation) |
| [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) | Execution (Hero/Sidekick/Villain/Zombie setup) |
| [SOP – Set Up Scoring Model Segmentation](../sops/SOP – Set Up Scoring Model Segmentation.md) | Execution (Tier 3 scoring model setup) |

---

## Version details

- **Version:** 3.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
