# Audience Strategy Mental Model
Created: 2026-02-04

Support_ID: MENTALMODEL_2
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Audiences
Pillar: 7

## Purpose

This mental model helps you choose the right audience approach for each campaign type and prioritize audiences by "temperature".

> ❓ **The core question:** Am I providing signals (hints to AI) or targeting (controlling who sees my ads)?

Google Ads has two fundamentally different audience systems. Using the wrong mental model leads to frustration and wasted budget.

---

## What this is NOT

This mental model does **not:**

- List all available audience segment types or their specs (See: [Audience Signals Reference](../references/Audience Signals Reference.md) for PMax, [Audience Targeting Reference](../references/Audience Targeting Reference.md) for Display/Video/Demand Gen)
- Provide step-by-step audience setup for any campaign type (See: campaign-specific SOPs)
- Explain how to match messaging to audience awareness stage (See: [Awareness Stage Mental Model](../mental-models/Awareness Stage Mental Model.md))
- Cover Upper Funnel campaign structure decisions (See: [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md))

---

## The two audience systems

| **System** | **Campaign types** | **Your role** | **Google's role** |
| --- | --- | --- | --- |
| **1️⃣ Signals** | Performance Max | Provide hints | Decides who sees ads |
| **2️⃣ Targeting** | Display, Video, Demand Gen | Define audience | Delivers to your selections |

> ⚠️ **This distinction is non-negotiable:** PMax inputs function as signals (hints to AI). Display/Video/Demand Gen inputs function as targeting (constraints on delivery). Treating one like the other causes the wrong expectations.

---

## System 1️⃣: Signals (Performance Max Only)

### What signals actually do

```
YOU PROVIDE                          GOOGLE DOES
───────────────────────────────────────────────────────
Customer Match list          →       Learns patterns
Search themes                →       Notes intent signals
In-market segments           →       Uses as starting point
                             →       EXPANDS beyond all of this
                             →       Serves wherever conversions happen
```

### The signal mindset

| **Stop thinking** | **Start thinking** |
| --- | --- |
| "I'm targeting these audiences" | "I'm giving Google hints about who converts" |
| "My ads will only show to these users" | "My ads will show to whoever Google predicts will convert" |
| "I can test specific audiences" | "I can provide better or worse quality hints" |

### Signal quality hierarchy

| **Quality** | **Signal types** | **Impact** |
| --- | --- | --- |
| 🥇 **Highest** | Customer Match (high-value), website converters | Directly shows Google "who converts" |
| 🥈 **High** | Cart abandoners, product visitors, engaged users | Shows Google "who's interested" |
| 🥉 **Moderate** | Custom segments (search terms, URLs) | Tells Google "what intent looks like" |
| 📊 **Lower** | In-market, life events | Broad category hints |
| 📉 **Lowest** | Affinity, demographics alone | Very broad, least actionable |

### Your only true control: Exclusions

In PMax, exclusions are the ONE element that works like traditional targeting. Excluded users will NOT see ads.

| **You cannot** | **You can** |
| --- | --- |
| Restrict ads to selected audiences | Exclude specific audiences |
| Turn off expansion | Provide higher-quality signals |
| A/B test specific audiences | Segment by asset group |

---

## System 2️⃣: Targeting (Display, Video, Demand Gen)

### What targeting actually does

```
YOU DEFINE                           GOOGLE DOES
───────────────────────────────────────────────────────
Audience segments            →       Restricts delivery to these users
Content targeting            →       Restricts delivery to these contexts
Exclusions                   →       Removes users from eligibility
                             →       Delivers within YOUR parameters
```

### The targeting mindset

| **This is true** | **This is also true** |
| --- | --- |
| Your selections control who sees ads | Optimized targeting can expand (if enabled) |
| You can A/B test specific segments | You must balance reach vs. precision |
| Exclusions remove users completely | Targeting mode affects bid behavior |

### Targeting mode distinction

| **Mode** | **Behavior** | **Use when** |
| --- | --- | --- |
| **Targeting** | Restricts delivery to selected segments | You want to reach only these users |
| **Observation** | Bids on all users: adjusts bids for selected segments | You want data without restricting reach |

> ↪️ **Observation mode is for learning:** Add segments in Observation mode to see performance data before committing to Targeting mode.

### Combined segments as a precision lever

Individual audience segments can be too broad for effective targeting. Combined segments use AND/OR/NOT logic to sharpen them.

| **Starting point** | **Combined approach** | **Effect** |
| --- | --- | --- |
| In-market (broad, cold) | In-market AND Custom keywords (search terms) | Sharpened from cold to cool: users show both browsing AND search intent |
| Affinity (broadest, coldest) | Affinity AND In-market | Sharpened from coldest to cold: lifestyle interest combined with active research |
| Any prospecting segment | Segment AND NOT existing customers | Pure new customer acquisition |
| Multiple weak signals | Custom keywords AND Life events AND NOT converters | Layered precision from individually imprecise segments |

> 💡 **Combined segments turn cold audiences into cool ones:** When a single segment is too broad, combining it with a second intent signal creates a sharper, more efficient audience without sacrificing too much reach.

> ↪️ **Combined segment configurations:** See [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) for reusable combined segment patterns by vertical.

---

## The audience temperature framework

Regardless of system (signals or targeting), audiences have "temperature": a proxy for intent and expected performance.

### The temperature spectrum

| **Temp** | **Audience types** | **Intent** | **Efficiency** | **Reach** |
| --- | --- | --- | --- | --- |
| 🔥 **Hot** | Cart abandoners, form abandoners, product viewers | Highest | Best | Smallest |
| 🌡️ **Warm** | All visitors, Customer Match, YouTube engaged | High | Strong | Limited |
| ❄️ **Cool** | Custom segments (search/URLs), Lookalikes (Demand Gen) | Medium | Moderate | Good |
| ❄️ **Cold** | In-market, life events | Low-Medium | Lower | Broad |
| 🧊 **Coldest** | Affinity, demographics only | Lowest | Lowest | Maximum |

> 💡 **Demographics are a layer, not a temperature tier:** Age, gender, household income, and parental status function as filters applied on top of any audience segment. They refine performance within a segment but do not define intent on their own. "Males 25-34" is not an audience strategy. "In-market for CRM software, males 25-34, excluding existing customers" is.

### Temperature applies differently by system

| **System** | **Hot audiences** | **Cold audiences** |
| --- | --- | --- |
| **Signals (PMax)** | Accelerate learning, may improve initial performance | Slower learning, AI discovers on its own |
| **Targeting (Display/Video/DG)** | Highest efficiency, lowest reach | Lowest efficiency, maximum reach |

---

## Strategic expansion: Warm → Cold

### The core principle

> 💡 **Start warm, expand cold:** Build from your warmest audiences outward to progressively colder audiences. This maximizes efficiency while you learn what works.

### Expansion phases

| **Phase** | **Focus** | **Audiences** | **Exit criteria** |
| --- | --- | --- | --- |
| **1️⃣ Remarketing** | Known users | Cart abandoners, site visitors, Customer Match | Profitable, not budget-constrained |
| **2️⃣ High-Intent Prospecting** | Intent signals | Custom segments (search/URLs), Lookalikes | Positive ROAS (lower than Phase 1) |
| **3️⃣ Category Prospecting** | Category interest | In-market, life events | Dedicated prospecting budget |
| **4️⃣ Awareness** | Lifestyle alignment | Affinity, broad demographics | Brand building goals |

### Why this order works

| **Phase** | **You learn** | **Risk level** |
| --- | --- | --- |
| 1 | Baseline performance, what converts | Lowest |
| 2 | Which intent signals work | Low |
| 3 | Category-level patterns | Medium |
| 4 | Brand lift, assisted conversions | Highest |

> ⚠️ **Don't skip phases:** Jumping straight to cold audiences without remarketing data means you're guessing. Each phase informs the next.

---

## Campaign type → Approach mapping

| **Campaign type** | **System** | **Lookalikes?** | **Content targeting?** | **Primary scaling lever** |
| --- | --- | --- | --- | --- |
| **Performance Max** | Signals | No | No | Signal quality + exclusions |
| **Display** | Targeting | No | Yes | Segment expansion + content |
| **Video** | Targeting | No | Yes | Segment expansion + content |
| **Demand Gen** | Targeting | Yes (exclusive) | No | Lookalike expansion |

---

### Demand Gen's unique position

Demand Gen sits between Display/Video and PMax:

| **Like Display/Video** | **Like PMax** |
| --- | --- |
| True targeting (you control who sees ads) | No content targeting |
| Named audiences | Optimized targeting option |
| Exclusions work | Expansion beyond selections possible |

**Demand Gen's exclusive advantage:** Lookalike segments. These are modeled audiences based on your seed lists, available only in Demand Gen.

---

## Audience insights as a discovery tool

Audience insights close the gap between "who I think converts" and "who actually converts." They reveal audience segments you may not be targeting that drive conversions.

### The discovery loop

```
CHECK INSIGHTS → FIND HIGH-INDEX SEGMENTS → ADD TO TARGETING → MEASURE → REPEAT
```

| **Step** | **Action** | **Tool** |
| --- | --- | --- |
| 1. Check insights | Review which audience segments drive conversions | Google Ads > Insights page > Audience insight cards |
| 2. Identify opportunities | Find high-index segments (3x+ overrepresented) you are NOT currently targeting | Persona insights table |
| 3. Add to targeting | Add discovered segments as targeting or in combined segments | Campaign / Ad group settings |
| 4. Measure impact | Evaluate new segment performance after 30 days | Standard segment-level reporting |

> 💡 **Audience insights inform expansion phases:** When deciding which cold audiences to test next, check audience insights first. High-index untargeted segments are lower-risk expansion candidates because they already drive conversions through other channels.

> ↪️ **Audience insights specs:** See [Audience Targeting Reference](../references/Audience Targeting Reference.md) for insight types, availability, and index interpretation.

---

## Key principles

1. **Know your system.** 
PMax = signals (hints). Everything else = targeting (control). Don't conflate them.
2. **Quality over quantity.** 
A small list of high-value customers beats a large list of random visitors in both systems.
3. **Temperature predicts performance.** 
Hotter audiences convert better. Colder audiences reach more people. Balance based on goals.
4. **Expand methodically.** 
Warm → cool → cold. Each phase funds and informs the next.
5. **Exclusions are universal.** 
In every system, exclusions are true control. Use them for recent converters, existing customers, and brand protection.
6. **Measure appropriately.** 
Hot audiences = direct ROAS. Cold audiences = assisted conversions, brand lift.

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | PMax signal types and search themes syntax |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Segment types, targeting modes, expansion settings |
| [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) | Recommended settings, expansion decisions, demographic optimization |
| [Audience Segments Reference](../references/Audience Segments Reference.md) | Segment mechanics, matching behavior, intent temperature |
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Segment configurations and combined segment patterns |
| [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) | PMax audience signal configuration |
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | Display, Video, Demand Gen audience targeting execution |
| [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) | Display campaign setup |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Video campaign setup |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Demand Gen campaign setup |

---

## Version details

- **Version:** 4.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.