# Search PMax Query Routing Reference
Created: 2026-02-04
Updated: 2026-02-05

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
- Covers Shopping vs. PMax auction priority (post-Q4 2024 Ad Rank change)
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
| Query matches exact match keyword in Search | Search wins | Exact match keywords take priority over PMax |
| Query matches phrase/broad match keyword in Search | Either can win | Google uses Ad Rank to decide between Search and PMax |
| Query has no keyword match in Search | PMax wins | PMax serves queries with no Search keyword coverage |
| No option is identical to query | AI selects most relevant | Predicted performance determines winner |
| Search text ad + PMax Shopping ad for same query | Both can serve | Different ad formats occupy different SERP slots |
| Brand query with brand exclusion in PMax | Search wins (brand campaign) | PMax is excluded from brand auctions |
| Shopping query, Standard Shopping + PMax both eligible | Ad Rank decides | Post-Q4 2024: PMax no longer automatically wins over Standard Shopping |

---

## The keyword selection hierarchy

When Search and PMax run in the same account, Google follows this priority:

### 1. Exact match keywords take priority

If a query matches an exact match keyword in your Search campaign, Search serves the ad. PMax does not compete for that query.

**Implication:** Add your highest-value queries as exact match keywords in Search to protect them from PMax.

### 2. Phrase and broad match compete with PMax

For phrase and broad match keywords, Google uses Ad Rank to decide whether Search or PMax serves the ad. This means PMax can capture queries you intended for Search if PMax has a higher Ad Rank.

**Implication:** If PMax is capturing important queries, promote them to exact match in Search.

### 3. AI-based relevance for unmatched or equally-matched queries

When no keyword is identical to the query, or when multiple options (Search keyword + PMax) have equal relevance, Google's AI selects the most relevant ad group based on predicted performance. This means PMax can win queries even when a Search keyword exists, if the Search keyword is only loosely related.

**Implication:** Do not over-keyword your Search campaigns with loosely-related broad match. Let PMax find incremental queries you did not anticipate. Promote genuinely high-value queries to exact match for guaranteed routing.

### 4. Shopping ad format exception

For Shopping-format ads specifically, PMax and Standard Shopping now compete on Ad Rank (post-Q4 2024). However, text ads from Search campaigns and Shopping ads from PMax serve different formats and can both appear on the same results page. A Search text ad does not block a PMax Shopping ad or vice versa: they occupy different ad slots.

**Implication:** Running Search and PMax simultaneously for the same product is not always cannibalization. Search text ads and PMax Shopping ads can complement each other on the SERP.

---

## Shopping vs. PMax auction priority (Q4 2024 change)

Before Q4 2024, PMax automatically won over Standard Shopping when both were eligible for the same Shopping placement. This is no longer the case.

| **Period** | **Behavior** |
| --- | --- |
| Before Q4 2024 | PMax automatically won over Standard Shopping |
| After Q4 2024 | Ad Rank determines the winner (same as Search vs. PMax) |

**What this means for hybrid approaches:**

- Standard Shopping and PMax can now coexist on the Shopping surface without PMax automatically dominating
- If your Standard Shopping campaigns have strong Ad Rank (good feed quality, competitive bids), they can win auctions over PMax
- You still need exclusion management to prevent the same products from competing against each other

> ↪️ **For hybrid Shopping + PMax approaches:** See [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) (Running both together section).

---

## Brand exclusion coordination

Brand traffic must be controlled across both Search and PMax to prevent metric inflation and ensure accurate attribution.

### Implementation

| **Campaign Type** | **Brand Control Method** |
| --- | --- |
| **Search** | Dedicated Brand campaign + brand terms as negatives in non-brand campaigns |
| **PMax** | Campaign-level brand exclusions (Settings > Brand exclusions > select your brand) |

### How PMax brand exclusions work

1. Go to your PMax campaign Settings
2. Navigate to Brand exclusions
3. Select your brand from the list (Google auto-detects brands, or you can add custom brand names)
4. PMax will no longer serve ads for queries that Google classifies as brand queries

> ⚠️ **Brand exclusions in PMax are not the same as negative keywords:** Google uses its own brand classification system. Some branded queries may still slip through if Google does not classify them as brand queries. Monitor your search terms report.

### Coordination checklist

- [ ] Brand Search campaign exists with brand keywords
- [ ] Non-brand Search campaigns have brand terms as negative keywords
- [ ] PMax campaigns have brand exclusions enabled
- [ ] Search terms report monitored weekly for brand leakage into PMax
- [ ] Brand metrics tracked separately from non-brand metrics

---

## Query protection tactics

Use these when you want Search to control specific queries instead of PMax.

| **Tactic** | **When to Use** | **How** |
| --- | --- | --- |
| **Promote to exact match** | PMax is capturing a high-value query you want in Search | Add the query as an exact match keyword in your Search campaign |
| **Add exact match negative in PMax** | PMax keeps winning despite having the keyword in Search (rare, but possible) | Add campaign-level negative keyword in PMax |
| **Monitor search terms weekly** | Ongoing maintenance | Check PMax search terms for queries that belong in Search |

> ⚠️ **PMax campaign-level negative keywords** are now available to all advertisers. You can add negatives directly in PMax campaign settings (no longer requires Google rep access).

---

## PMax as a discovery layer

PMax is most valuable when it finds queries you did not anticipate. Structure your account to take advantage of this.

| **Strategy** | **Implementation** |
| --- | --- |
| **Intentional under-keywording** | Do not add every possible keyword to Search. Let PMax discover long-tail and unexpected queries. |
| **Search term mining** | Review PMax search terms weekly. Promote high-performing queries to exact match in Search. |
| **DSA complement** | If running DSA catch-all in Search, PMax expands even further into non-keyworded queries. |

> 💡 **Search and PMax are complementary:** Search gives you keyword-level control for queries you know. PMax finds queries you do not know. Structure Search to cover your known high-value terms, and let PMax expand beyond them.

---

## Search themes in PMax

Search themes tell PMax which search categories to focus on. They interact with your Search keywords.

| **Aspect** | **How It Works** |
| --- | --- |
| **What search themes do** | Suggest search categories to PMax (similar to broad match keywords) |
| **Interaction with Search keywords** | Search themes do not override keyword priority. Exact match Search keywords still win. |
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
| Assuming PMax always wins Shopping auctions | Post-Q4 2024, Ad Rank decides. Standard Shopping can win. | Evaluate hybrid approaches without assuming PMax dominance |
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

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
