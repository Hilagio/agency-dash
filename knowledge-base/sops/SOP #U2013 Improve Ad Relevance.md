# SOP – Improve Ad Relevance
Created: 2026-02-04
Updated: 2026-04-02

SOP_ID: SOP_1
Status: Done
Category: Creative
Primary Outcome: Ad Relevance = Average or Above Average
Secondary Outcomes: Higher CTR, lower CPC, stronger Ad Rank
Agent_Executable: No
Human_Approval_Required: No
Domain: Search
Pillar: 7

### Purpose

Ad Relevance answers one question only:

> ❓ **The big question:** Does Google believe this ad meaningfully matches the user's intent for this keyword?

This SOP fixes **semantic mismatch** between:

1. **Ad Groups** (The container)
2. **Keywords** (The trigger)
3. **RSA Assets** (The content)

This is a **structural repair task**, not an optimization task.

You fix the foundation first. You test creative angles/assets later.

> Resolving Ad Relevance issues will enable you to craft ads closely aligned with each keyword, building a strong foundation for improving Expected CTR (See: [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md)).

---

### What this SOP is NOT

This SOP does **not**:

- Teach ad group structure principles (See: [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md))
- Optimize persuasion or messaging strength (See: [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md))
- Optimize landing pages (See: [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) )
- Teach headline writing patterns (See: [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md))
- Teach description writing patterns (See: [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md))
- Teach dynamic text syntax (See: [Dynamic Text Reference](../references/Dynamic Text Reference.md))

### When to run this SOP

Run this SOP if **any** of the following are true:

- Ad Relevance = *Below Average* or *Average*
- Ads feel generic or interchangeable across ad groups
- High-volume queries are not reflected in ad copy

---

### Before you start

**Required:**

- Ad Relevance baseline scores (extract via: Columns → Modify → Quality Score → Ad Relevance)
- One clearly defined ad group / creative theme to optimize / focus on during this SOP
- Current RSA assets of that particular ad group
- Keyword list of that particular ad group
- Search Terms Report of that particular ad group (Last 30–90 days)
- Baseline impression data of that particular ad group

**Have open:**

| Document | Used for |
| --- | --- |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Single Ad Test, Intent Divergence Taxonomy |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Phase 3.1 relevance anchor patterns |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | DKI syntax (if applicable) |

---

### Execution Framework

This SOP has three phases:

| Phase | Purpose | When to execute |
| --- | --- | --- |
| **Phase 1️⃣: Diagnose** | Identify structural and alignment issues | Always |
| **Phase 2️⃣: Fix Structure** | Repair ad group and keyword issues | If Phase 1 reveals issues |
| **Phase 3️⃣: Fix Copy** | Optimize headline and description relevance | Always |

---

## Phase 1️⃣: Diagnose

### 1.1 Semantic audit (The Single Ad Test)

**Goal:** Confirm that the ad group represents **one coherent search intent theme**.

If an ad group contains keywords asking for *definitions* AND keywords asking for *pricing*, you cannot write a relevant ad for both.

**Action:**

1. Open the Ad Group.
2. Sort keywords by **Impressions (descending)**.
3. List the top 10 keywords.
4. Run the **Single Ad Test** (See: [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md)):

> ❓ **Ask yourself:** Can one RSA serve all keywords in this ad group without any headline or description feeling generic or mismatched?

- **Yes (pass):** No structural split needed. Proceed to 1.2.
- **No (fail):** Intent divergence exists. Diagnose the divergence type → Flag for Phase 2 (Split & Route).

>
> 💡 **If the test fails:** Use the Intent Divergence Taxonomy in the [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) to diagnose *what kind* of divergence exists. This determines whether you need to split or can solve with DKI/customizers.

---

### 1.2 Intent → Message alignment check

**Goal:** Ensure the ad *type* matches the query *intent*.

Relevance is not just about integrating keywords in your RSA assets, it's also about matching the stage of the funnel.

| Keyword intent | User wants... | Ad (& LP) must provide... | Example headline |
| --- | --- | --- | --- |
| **Informational** ("how to", "what is") | Answers | Guide, Definition, Explanation | "Project Management 101 Guide" |
| **Commercial** ("best", "review", "vs") | Comparison | Differentiators, Social Proof | "Rated #1 by 10,000+ Teams" |
| **Transactional** ("buy", "price", "demo") | Action | Price, Offer, Speed, CTA | "Start Free Trial — 2 Min Setup" |

**Action:** Review your top keywords. What intent category do they fall into? Does your current ad copy match that intent type?

- **Yes (aligned):** Proceed to Phase 3.
- **No (misaligned):** Flag for Phase 3 (copy rewrite needed).

> Mixed intent in a single ad group? This usually means you failed the Single Ad Test in **1.1**. Return to that diagnosis and flag for Phase 2.

---

## Phase 2️⃣: Fix structure

*Execute this phase only if Phase 1 revealed structural issues.*

### 2.1 Split & route (abbreviated)

**Goal:** Fix intent divergence without starving the account of data.

> ⚠️ **The Golden Rule:** Never consolidate past the point where ads stop being specific. If the Offer, CTA, or user intent changes between keywords, they belong in different groups.

**Before splitting, consider alternatives:**

| Alternative | Use When | Reference |
| --- | --- | --- |
| Dynamic Keyword Insertion | Keywords are synonyms/variants | [Dynamic Text Reference](../references/Dynamic Text Reference.md) |
| Keyword-level Ad Customizers | Need different descriptors per keyword | [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md) |
| Keyword-level Final URLs | Same intent, different landing pages | — |
| Location Insertion | Location variants | [Dynamic Text Reference](../references/Dynamic Text Reference.md) |

>
> ↪️ See [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) → "Alternatives to Splitting" for full decision guidance.

**If splitting is required:**

1. Isolate the divergent theme (e.g., separating "running shoes" from "trail running shoes").
2. Create a new Ad Group for the specific theme.
3. Move the relevant keywords to the new Ad Group.

> ⚠️ **Traffic Routing (critical):**
> - Add the keywords from the *New* Ad Group as **Negative Keywords** in the *Old* Ad Group.
> - *Why?* If you don't block it, the old ad group will continue to steal traffic, and your new, more relevant ad group will "starve".
> - *Example:* If you split "trail running shoes" into a new ad group, add the negative keyword "trail" as a broad match negative in the generic "running shoes" Ad Group.

>
> ↪️ **Note:** For a full SOP on ad group structure principles, see: [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md).

---

### 2.2 Query promotion (abbreviated)

**Goal:** Promote search terms as keywords (within the same Ad Group) to enable better Ad Quality diagnostics and DKI effectiveness, without fragmenting data by creating redundant auction entry points.

> 💡 **Quality Score is based on historical impressions for exact searches of your keyword:** But adding close-variant keywords creates multiple entry points to the same auction → data fragmentation → weaker algorithmic learning. You have to find a balance.

#### The decision filter

Before promoting any search term to the same ad group, ask:

> Does this query add value as its own keyword for **(1)** DKI insertion, or **(2)** separate QS monitoring, while using the same ad and landing page?

- **Yes → Promote** (distinct phrasing worth surfacing via DKI to increase Ad Quality or monitoring separately)
- **No → Skip** (close variant that fragments without adding diagnostic or relevance value)

> If the query needs a meaningfully different ad or landing page, it belongs in a new Ad Group **(see 2.1)**.

---

#### Action

1. Open **Search Terms Report** for the ad group (Default: Last 30 days. Expand to 90 if low volume).
2. Filter to **high-signal queries**: Impressions ≥ 50 (lower threshold if low volume).
3. Apply the decision filter above to each candidate.
    1. **Yes → Promote** (distinct phrasing worth surfacing via DKI to increase Ad Quality or monitoring separately)
    - **No → Skip** (close variant that fragments without adding diagnostic or relevance value)

>
> ↪️ **Note:** For full execution, see: **SOP — Promote Search Terms to Keywords**. This is the abbreviated version for Ad Relevance purposes.

---

## Phase 3️⃣: Fix copy

*Execute this phase for every ad group, regardless of Phase 2.*

### 3.1 Headline-level relevance

**Goal:** Bridge the gap between the search term and your ad to improve Ad Relevance.

#### Method selection:

| If … | Then use … | Reference |
| --- | --- | --- |
| Branded, sensitive, or complex terms | Static Anchoring | [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md)  → Type 1 |
| Extensive keyword lists | Dynamic Keyword Insertion (DKI) | [Dynamic Text Reference](../references/Dynamic Text Reference.md) |
| Mixed: some keywords need DKI, some need control | Combination approach | Both references above |

#### Action:

1. **Select your method** using the table above.
2. **Write your relevance anchor headline (H1)** using patterns from Headline Angle Catalog → Type 1: Relevance Anchor.
3. **Distribute semantic signals** across multiple headlines (not just H1).

#### Semantic distribution rule:

Don't limit the keyword theme to H1 alone. Spread relevance signals across headlines where it sounds natural.

*Why?* Google assembles RSAs dynamically. If your semantic signals are concentrated in one headline, many ad combinations will feel generic. Distributing them ensures more combinations pass the ad relevance test.

> ⚠️ **The goal is natural distribution**, not forced repetition. Each headline should still read well and serve a purpose (benefit, CTA, social proof, etc.). See [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) for patterns by type.

---

### 3.2 Description-level relevance (bold text optimization)

**Goal:** Reinforce headline relevance signals while expanding the message.

Descriptions should **continue the relevance thread** established in your headlines, then add supporting information (context, proof, benefits).

#### Action:

1. **Include the core keyword phrase** (or close variant) naturally in at least one description.
2. **Expand beyond the headline** with supporting proof, benefits, or context.
3. Use patterns from [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md).

#### Rules:

| Do | Don't |
| --- | --- |
| Include keyword naturally in D1 | Stuff keywords repeatedly |
| Add new information (proof, benefit, context) | Repeat headline messages in different words |
| Bridge relevance → persuasion | Make descriptions keyword-only |

> ⚠️ **Key principle:** Descriptions are not a second chance to say what headlines said. They're an opportunity to *reinforce* relevance while *adding* persuasion. See [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) for expansion patterns, while improving ad relevance.

---

### Validation & definition of done

#### How to validate

Quality Score is a lagging indicator. Do not expect it to change overnight.

1. **Short term (7–14 days):** Check **CTR**. If relevance improves, CTR should rise because users see what they searched for.
2. **Medium term (14–30 days):** Check **Ad Relevance** status (Below Avg → Average → Above Average).

> Your bids and auction-level competition will also impact your CTR. Be sure to compare apples to apples.

#### Definition of done

You are finished with this SOP when:

- [ ]  Ad Group passes the Single Ad Test (unified intent)
- [ ]  Intent → Message alignment is confirmed (funnel stage matches ad type)
- [ ]  Traffic routing (negatives) is in place for any splits
- [ ]  Headlines contain distributed semantic signals (not just H1)
- [ ]  At least one description includes the core keyword phrase (bold text optimization)
- [ ]  Ad Relevance ≠ *Below Average* for **14 consecutive days**

**Exit → Entry Bridge:**

Once complete, this SOP's exit criteria becomes the entry criteria for [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md), where creative testing begins ([SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md)).

---

### FAQ

**Q: Should I run creative tests while fixing Ad Relevance?**

A: No. Fix the foundation first. Creative testing assumes your ad groups are already semantically tight. If Ad Relevance is Below Average, your tests will be confounded by structural noise.

**Q: How long until I see Ad Relevance improve?**

A: Typically 7-14 days for the label to update. CTR improvements often appear sooner (within days).

**Q: What if Ad Relevance is stuck at "Average"?**

A: "Average" is acceptable for most accounts. If you need "Above Average", revisit Phase 3 (tighter semantic distribution and description optimization). Do not over-optimize here, but move to Expected CTR instead.

**Q: Should I use DKI or Static Anchoring?**

A: Use DKI when keywords are predictable, brand-safe, and similar in length. Use Static Anchoring for branded terms, in complex situations, or when you need tight message control.

**Q: How do I know whether to split or use alternatives (DKI, customizers)?**

A: Use the Intent Divergence Taxonomy in the [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md). Funnel stage and audience divergence almost always require splits. Synonym, modifier, and location divergence can usually be handled with dynamic features.

---

### Quick reference: Support library

| Document | Type | Used in |
| --- | --- | --- |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Mental Model | Phase 1.1, Phase 2.1 |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Catalog | Phase 3.1 |
| [Headline Quality Checklist](../checklists/Headline Quality Checklist.md)  | Checklist | Phase 3.1 |
| [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md) | Catalog | Phase 3.2 |
| [Description Quality Checklist](../checklists/Description Quality Checklist.md)  | Checklist | Phase 3.2 |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md)  | Reference | Phase 3.1 + 3.2 |
| [Keyword Ad Customizer Attribute Catalog](../catalogs/Keyword Ad Customizer Attribute Catalog.md) | Catalog | Phase 2.1 (alternatives) |

---

### Related SOPs

| SOP | Relationship |
| --- | --- |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Foundational (structure principles, Single Ad Test) |
| *SOP — Promote Search Terms to Keywords* | Upstream (Phase 2.2 dependency) |
| [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md)  | Next Phase in QS Playbook |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | Last Phase of QS Playbook |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Ongoing optimization |

---

### Version details

- **Version:** 3.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.