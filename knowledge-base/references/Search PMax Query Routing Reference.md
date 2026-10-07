# Search PMax Query Routing Reference
Created: 2026-02-04
Updated: 2026-08-27

Support_ID: CHEATSHEET_8
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Applies_To: Search, PMax
Domain: Search
Pillar: 6

## Purpose

Documents how Google decides which campaign serves a query when Search and Performance Max run in the same account, including Shopping vs. PMax auction priority and brand exclusion coordination.

---

## What this reference is / What this is NOT

**This reference:**

- Explains the keyword selection hierarchy (how Google routes queries between campaigns)
- Documents brand exclusion coordination across Search + PMax
- Covers Shopping vs. PMax auction priority (Ad Rank decides)
- Provides query protection and discovery tactics

**This reference does NOT:**

- Explain Search campaign structure (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Explain PMax campaign structure (See: [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) or [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>))
- Provide step-by-step PMax setup (See: [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) or [SOP – Launch PMax for Lead Gen-SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md))
- Explain brand separation rationale (See: [Brand Separation Reference](../references/Brand Separation Reference.md))

---

## Quick reference: query routing rules

| **Scenario** | **Which Campaign Wins** | **Why** |
| --- | --- | --- |
| Query matches an exact match keyword in Search | Search wins | An exact match keyword, including its close variants, takes priority over everything |
| Query is identical to phrase/broad keyword in Search | Either can win | Identical phrase/broad keywords (including AI Max keywords) and identical PMax search themes share one tier, Ad Rank decides |
| Query has no keyword match in Search | PMax wins | PMax serves queries with no Search keyword coverage |
| No option matches the query at tier 1 or tier 2 | AI selects most relevant, then Ad Rank | Queries outside both tiers, including synonyms and paraphrases, fall to AI relevance with Ad Rank as tiebreaker |
| Search text ad + PMax Shopping ad for same query | Both can serve | Different ad formats occupy different SERP slots |
| Brand query with brand exclusion in PMax | Search wins (brand campaign) | PMax is excluded from brand auctions |
| Shopping query, Standard Shopping + PMax both eligible | Ad Rank decides | PMax does not automatically win over Standard Shopping |

---

## The keyword selection hierarchy

When Search, AI Max, and PMax run in the same account, Google routes each query through four published priority tiers:

### 1. Matching exact match keyword

If a query matches an exact match keyword in your Search campaign, that keyword serves. PMax does not compete for that query. Matching here covers the keyword's close variants, not only the character-identical query.

**Implication:** An exact match keyword in Search holds its query against PMax and AI Max, and that protection extends across the keyword's close variants rather than only the exact strings entered.

### 2. Identical phrase/broad keywords and search themes (tied tier)

A phrase or broad match keyword identical to the query, including AI Max keywords, sits at the same priority as a Performance Max search theme identical to the query. This tier-2 equivalence is Google's published position: an identical search theme carries the same weight as an identical phrase or broad keyword. When more than one option is identical, Ad Rank decides between them. This means PMax can capture queries you intended for Search if its identical search theme outranks your keyword.

**Implication:** An exact match keyword that matches the query always wins over any search theme, so promotion to exact match is what recovers a query PMax is capturing.

### 3. AI-based ad group relevance

When no keyword or search theme is identical to the query, Google's AI selects the most relevant ad groups based on predicted performance, and only the most relevant keywords from those ad groups are considered. This means PMax or AI Max can win queries even when a Search keyword exists, if the Search keyword is only loosely related.

**Implication:** Loosely-related broad match buys no routing guarantee at this tier, and it crowds out the incremental queries PMax exists to surface. Exact match is the only tier that routes a query with certainty.

### 4. Ad Rank

When several keywords or search themes share equal priority after the first three tiers, the ad or asset group that generates the ad with the highest Ad Rank serves.

> 💡 **What counts as a match, and at which tier.** An exact match keyword matches through its close variants, so plurals, misspellings, stemmings and same-intent rewordings stay inside tier 1. Tier 2 is narrower: a phrase keyword, broad keyword or PMax search theme has to be identical to the query, where identical includes spell-corrected terms but not plurals or synonyms. AI Max ad groups without keywords, Dynamic Search Ads (which are on Google's auto-upgrade path into AI Max), and Performance Max without search themes are all treated as non-identical and selected by highest Ad Rank across the account. For the full account-wide selection hierarchy, see [Match Type Reference](../references/Match Type Reference.md).

### What the tiers protect, and what they do not

The tiers describe auction eligibility, not attribution, and the protection is wider at tier 1 than at tier 2:

- An exact match keyword protects its close variants. `[daycare near me]` holds "daycares near me" and "daycare near me" alike at tier 1. Tier 2 is stricter: a phrase or broad keyword has to be identical, where identical includes spell-corrections but excludes plurals and synonyms.
- Every query outside those tiers falls to AI relevance and Ad Rank, where AI Max can claim it, even from another ad group. The close variants your phrase and broad keywords used to absorb are where AI Max claims traffic.
- Reported AI Max conversions are therefore not automatically incremental, because much of that traffic is traffic your own keywords would have matched. Reports still show double-claiming in practice: the same query string can appear under AI Max in one auction and under your keyword in another.

> ↪️ **For measuring AI Max incrementality:** See [AI Max for Search Reference](../references/AI Max for Search Reference.md) (Isolating AI Max performance).

### Shopping ad format exception

For Shopping-format ads specifically, PMax and Standard Shopping compete on Ad Rank. However, text ads from Search campaigns and Shopping ads from PMax serve different formats and can both appear on the same results page. A Search text ad does not block a PMax Shopping ad or vice versa: they occupy different ad slots.

**Implication:** Running Search and PMax simultaneously for the same product is not always cannibalization. Search text ads and PMax Shopping ads can complement each other on the SERP.

---

## Shopping vs. PMax auction priority

When Standard Shopping and PMax are both eligible for the same Shopping placement, Ad Rank determines the winner (same as Search vs. PMax).

**What this means for hybrid approaches:**

- Standard Shopping and PMax can coexist on the Shopping surface without PMax automatically dominating
- If your Standard Shopping campaigns have strong Ad Rank (good feed quality, competitive bids), they can win auctions over PMax
- You still need exclusion management to prevent the same products from competing against each other

> ↪️ **For hybrid Shopping + PMax approaches:** See [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) (Running both together section).

---

## Brand exclusion coordination

Brand control operates separately in Search and in PMax. Uncontrolled brand traffic inflates the metrics of whichever campaign captures it and breaks non-brand attribution.

### Implementation

| **Campaign Type** | **Brand Control Method** |
| --- | --- |
| **Search** | Dedicated Brand campaign + brand terms as negatives in non-brand campaigns |
| **PMax** | Campaign-level brand exclusions |

### How PMax brand exclusions work

A brand list applied at campaign level stops PMax serving on queries that Google's own classifier reads as brand queries. Google auto-detects known brands, and custom brand names can be added to the list.

> ⚠️ **Brand exclusions in PMax are not the same as negative keywords:** Google uses its own brand classification system, so branded queries it does not classify as brand still slip through. The search terms report is where that leakage surfaces.

> ↪️ **Implementation and verification across Search, Standard Shopping and PMax:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

---

## Query protection tactics

These tactics move control of specific queries from PMax to Search.

| **Tactic** | **When to Use** | **How** |
| --- | --- | --- |
| **Promote to exact match** | PMax is capturing a high-value query you want in Search | Add the query as an exact match keyword in your Search campaign |
| **Add exact match negative in PMax** | PMax keeps winning despite having the keyword in Search (rare, but possible) | Add campaign-level negative keyword in PMax |
| **Monitor search terms weekly** | Ongoing maintenance | Check PMax search terms for queries that belong in Search |

> ⚠️ **PMax campaign-level negative keywords** are available to all advertisers, added directly in PMax campaign settings.

---

## PMax as a discovery layer

PMax is most valuable when it finds queries you did not anticipate.

| **Strategy** | **Implementation** |
| --- | --- |
| **Intentional under-keywording** | Search carries only the keywords worth controlling, which leaves the long tail for PMax to discover. |
| **Search term mining** | Review PMax search terms weekly. Promote high-performing queries to exact match in Search. |
| **Final URL expansion complement** | If running final URL expansion as a catch-all in Search, PMax expands even further into non-keyworded queries. |

> 💡 **Search and PMax are complementary:** Search gives keyword-level control over queries you already know. PMax finds the ones you do not.

---

## Search themes in PMax

Search themes tell PMax which search categories to focus on. They interact with your Search keywords.

| **Aspect** | **How It Works** |
| --- | --- |
| **What search themes do** | Suggest search categories to PMax (similar to broad match keywords) |
| **Interaction with Search keywords** | An exact match Search keyword that matches the query, close variants included, still wins. An identical search theme shares priority with identical phrase and broad keywords, and Ad Rank decides between them. |
| **When to use** | When you want PMax to focus on specific search categories beyond what your feed suggests |
| **When to skip** | When your product feed already gives PMax sufficient signals |

> ⚠️ **Search themes are suggestions, not restrictions:** PMax will serve ads beyond your search themes if it finds converting queries elsewhere.

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
| --- | --- | --- |
| No brand exclusion in PMax | PMax captures brand traffic, inflates its metrics | Add brand exclusions in PMax campaign settings |
| Over-keywording Search | Leaves no room for PMax to discover incremental queries | Remove low-performing broad/phrase keywords, let PMax discover |
| Ignoring PMax search terms | Missing opportunities to promote winners to Search | Review PMax search terms weekly |
| Assuming PMax always wins Shopping auctions | Ad Rank decides. Standard Shopping can win. | Evaluate hybrid approaches without assuming PMax dominance |
| Not using exact match for protection | Phrase/broad match queries may still go to PMax | Promote critical queries to exact match in Search |
| Duplicate brand campaigns | Brand Search + PMax both targeting brand = internal competition | Brand Search campaign + brand exclusions in PMax |

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Uses routing rules for campaign structure decisions |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | PMax structure decisions affected by routing (Ecommerce) |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | PMax structure decisions affected by routing (Lead Gen/SaaS) |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Shopping vs. PMax hybrid approaches |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Standard Shopping-specific routing via campaign priorities |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand separation rationale and implementation |
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | AI Max matching mechanics, reporting, and incrementality measurement |
| [Match Type Reference](../references/Match Type Reference.md) | Match type mechanics and the account-wide selection hierarchy |

---

## Version details

- **Version:** 7.0
- **Last Updated:** August 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
