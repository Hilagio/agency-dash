# Negative Keyword Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_31
Category: Targeting
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Cheat Sheet
Agent_Readable: Yes
Status: Done

## Purpose

Documents the mechanics of negative keyword match types, application levels, list structure, and formatting rules in Google Ads search campaigns.

---

## What this reference is / What this is NOT

**This reference:**

- Documents how each negative match type works (broad, phrase, exact)
- Explains the critical differences between negative and positive match type behavior
- Covers application levels (account, campaign, ad group, lists)
- Defines formatting rules, character limits, and invalid inputs

**This reference does NOT:**

- Provide negative keyword lists or category patterns (See: [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md))
- Give step-by-step instructions for building or managing negatives (See: [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md), Phase 3.3 for initial setup, or [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) and [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) for ongoing management)
- Explain when or why to exclude terms (that is strategy, not mechanics)
- Cover positive match types (See: [Match Type Reference](../references/Match Type Reference.md))

---

## Quick reference table

| **Negative match type** | **Syntax** | **Blocks query when** | **Close variant matching** |
| --- | --- | --- | --- |
| **1. Negative broad match** | `running shoes` | All negative terms appear in the query (any order) | No |
| **2. Negative phrase match** | `"running shoes"` | Negative terms appear in the query in exact order | No |
| **3. Negative exact match** | `[running shoes]` | Query matches the negative terms exactly (same words, same order, no extra words) | No |

> 💡 **Critical difference from positive keywords:** Negative keywords do NOT match on close variants. You must add singular, plural, misspellings, and accent variations manually.

---

## 1. Negative broad match

### What it does

Prevents your ad from showing when the query contains ALL of the words in the negative keyword, in any order. If the query contains only some of the words, the ad can still show.

### Syntax

`running shoes`

No special characters. Enter the keyword without brackets or quotes. This is the default match type when adding negatives.

### Behavior examples

| **Negative keyword** | **Search query** | **Ad blocked?** | **Why** |
| --- | --- | --- | --- |
| `running shoes` | blue running shoes | Yes | Both "running" and "shoes" present |
| `running shoes` | shoes for running outdoors | Yes | Both words present (order does not matter) |
| `running shoes` | running shoe | No | "shoe" is not "shoes" (no close variant matching) |
| `running shoes` | running gear | No | Only one of two words present |
| `running shoes` | best running shoes for flat feet | Yes | Both words present among other words |

### Rules

| **Rule** | **Details** |
| --- | --- |
| **Default type** | When you add a negative without brackets or quotes, it is broad match |
| **All words required** | Every word in the negative must appear in the query to trigger a block |
| **Order does not matter** | Words can appear in any position within the query |
| **Extra words allowed** | The query can contain additional words beyond the negative terms |
| **No close variants** | "shoe" and "shoes" are treated as different words |
| **No synonyms** | "running" does not match "jogging" |

### When to use

| **Use case** | **Example negative** | **What it blocks** |
| --- | --- | --- |
| General irrelevant terms | `free` | Any query containing "free" |
| Multi-word irrelevant concepts | `job training` | Queries containing both "job" and "training" |
| Category-level exclusions | `wholesale bulk` | Queries containing both "wholesale" and "bulk" |

---

## 2. Negative phrase match

### What it does

Prevents your ad from showing when the query contains the negative keyword terms in the exact same order. The query can have additional words before or after the phrase, but the phrase sequence must appear intact.

### Syntax

`"running shoes"`

Wrap the keyword in double quotes.

### Behavior examples

| **Negative keyword** | **Search query** | **Ad blocked?** | **Why** |
| --- | --- | --- | --- |
| `"running shoes"` | blue running shoes | Yes | "running shoes" appears in exact order |
| `"running shoes"` | running shoes for women | Yes | Phrase appears at the start with words after |
| `"running shoes"` | shoes running | No | Words are in reversed order |
| `"running shoes"` | running shoe | No | "shoe" is not "shoes" (no close variant matching) |
| `"running shoes"` | running trail shoes | No | Extra word breaks the phrase sequence |

### Rules

| **Rule** | **Details** |
| --- | --- |
| **Order matters** | The words must appear in the exact sequence specified |
| **Extra words before/after** | The query can have words before or after the phrase |
| **No words in between** | Inserting a word between phrase terms breaks the match |
| **No close variants** | Must match the exact word forms |

### When to use

| **Use case** | **Example negative** | **What it blocks** |
| --- | --- | --- |
| Ngram exclusions | `"how to"` | Informational queries starting with "how to" |
| Specific multi-word concepts | `"free trial"` | Queries containing "free trial" in that order |
| Competitor brand + product | `"competitor crm"` | Queries mentioning that competitor product phrase |

> 💡 **Phrase match is ideal for ngrams:** When you identify a poor-performing ngram in your search term report, phrase match negative blocks that exact word sequence without over-excluding queries where those words appear separately.

---

## 3. Negative exact match

### What it does

Prevents your ad from showing only when the query matches the negative keyword exactly: same words, same order, no additional words.

### Syntax

`[running shoes]`

Wrap the keyword in square brackets.

### Behavior examples

| **Negative keyword** | **Search query** | **Ad blocked?** | **Why** |
| --- | --- | --- | --- |
| `[running shoes]` | running shoes | Yes | Exact match |
| `[running shoes]` | blue running shoes | No | Extra word "blue" present |
| `[running shoes]` | running shoes for men | No | Extra words after the phrase |
| `[running shoes]` | running shoe | No | "shoe" is not "shoes" (no close variant matching) |
| `[running shoes]` | shoes running | No | Different word order |

### Rules

| **Rule** | **Details** |
| --- | --- |
| **Exact words only** | Query must contain only the words in the negative, nothing more |
| **Exact order** | Words must appear in the specified sequence |
| **No close variants** | Must be letter-for-letter identical |
| **Narrowest exclusion** | Blocks the fewest queries of all three match types |

### When to use

| **Use case** | **Example negative** | **What it blocks** |
| --- | --- | --- |
| Single high-volume irrelevant query | `[competitor name]` | Only that exact query |
| Prevent cannibalization between campaigns | `[crm software]` | Only the exact query, allows longer-tail variations |
| Precise exclusion where broad/phrase over-excludes | `[running shoes]` | Only the two-word exact query |

---

## Close variants: the critical difference

Positive (regular) keywords match on close variants automatically: misspellings, singular/plural, accents, abbreviations. Negative keywords do NOT.

### What this means in practice

| **Negative keyword added** | **Still triggers ads (NOT blocked)** | **Action required** |
| --- | --- | --- |
| `running shoes` | running shoe | Add `running shoe` separately |
| `running shoes` | runing shoes | Add `runing shoes` separately |
| `cafe` | café | Add `café` separately |
| `colour` | color | Add `color` separately |
| `ac repair` | a/c repair | Add `a/c repair` separately (if valid) |

### Manual variants you must add

For each negative keyword, consider adding:

- Singular and plural forms (`shoe` / `shoes`)
- Common misspellings (`recieve` / `receive`)
- Accent mark variations (`cafe` / `café`)
- Spelling variations (`colour` / `color`, `grey` / `gray`)
- Abbreviations and expansions (`ac` / `air conditioning`)

> ⚠️ **This is the most common negative keyword mistake:** Adding a negative and assuming close variants are covered causes continued wasted spend on variant queries.

---

## Application levels

Negative keywords can be applied at four levels. Lower levels override higher levels only in scope, not in priority: all applicable negatives are evaluated.

| **Level** | **Scope** | **Use for** |
| --- | --- | --- |
| **Account level** | All search and shopping campaigns in the account | Universal exclusions that apply everywhere |
| **Campaign level** | All ad groups within that campaign | Campaign-specific exclusions |
| **Ad group level** | Only that ad group | Traffic routing between ad groups within a campaign |
| **Negative keyword list** | All campaigns the list is linked to | Shared exclusions across multiple campaigns |

### Account-level negatives

- Apply to all search and shopping campaigns
- Added via the account-level negative keywords section in Google Ads
- Use for terms that are never relevant to any campaign (e.g., "jobs", "salary", "careers" for a product seller)

### Campaign-level negatives

- Apply to all ad groups within the campaign
- Use for terms irrelevant to that campaign's theme but possibly relevant elsewhere
- Example: Adding "free" as a campaign negative in a paid-product campaign while keeping it available for a freemium campaign

### Ad group-level negatives

- Apply only within the specific ad group
- Primary use: routing traffic between ad groups in the same campaign
- Example: In a campaign with "running shoes" and "trail shoes" ad groups, add `trail` as a negative to the "running shoes" ad group

> ⚠️ **DSA campaigns:** Apply negative keyword lists to DSA campaigns to prevent ads on irrelevant queries. Do NOT add negatives at the DSA ad group level: let ad rank determine which ad group serves.

---

## Negative keyword lists

### Structure

Negative keyword lists are shared lists that can be linked to multiple campaigns simultaneously. Changes to the list propagate to all linked campaigns.

| **Property** | **Details** |
| --- | --- |
| **Maximum keywords per list** | 5,000 |
| **Maximum lists per account** | 20 |
| **Linking** | One list can be linked to multiple campaigns |
| **Match types** | Each keyword in the list has its own match type |
| **Propagation** | Changes to the list apply to all linked campaigns immediately |

### Recommended list structure

A minimum of three lists per account:

| **List** | **Purpose** | **Link to** |
| --- | --- | --- |
| **Irrelevant keywords** | Terms never relevant to the business (jobs, careers, DIY, free) | All campaigns |
| **Poor-performing keywords/ngrams** | Terms with proven poor performance from search term reports | All campaigns (or selectively) |
| **Branded keywords** | Your own brand terms | Non-brand campaigns only |

Additional lists as needed:

| **List** | **Purpose** | **Link to** |
| --- | --- | --- |
| **Competitor brand names** | Competitor terms (if running non-competitor campaigns) | Non-competitor campaigns |
| **Product category exclusions** | Specific product categories to exclude from certain campaigns | Campaigns where that category is irrelevant |

---

## Formatting rules and limits

### Valid formatting

| **Rule** | **Details** |
| --- | --- |
| **Case** | Not case-sensitive. Use lowercase for consistency |
| **Maximum keyword length** | 80 characters |
| **Maximum words** | 10 words per negative keyword |
| **Spaces** | Standard spaces between words |
| **Numbers** | Allowed |
| **Periods** | Allowed (e.g., `u.s.a.`) |
| **Ampersands** | Allowed (e.g., `b&b`) |
| **Accent marks** | Treated as distinct characters (`cafe` and `café` are different keywords) |

### Invalid characters

These characters are ignored or cause errors. Do not include them:

| **Character** | **Result** |
| --- | --- |
| `!` (exclamation mark) | Ignored |
| `@` (at symbol) | Ignored |
| `%` (percent) | Ignored |
| `?` (question mark) | Ignored |
| `*` (asterisk) | Ignored |
| `,` (comma) in the keyword itself | Treated as keyword separator |
| Leading/trailing spaces | Stripped automatically |

> 💡 **Lowercase only:** Google Ads is not case-sensitive for negative keywords, but using lowercase consistently across all negatives prevents confusion during audits and exports.

---

## Decision guide: which negative match type?

```
What are you excluding?
|
+-- A single irrelevant word or concept?
|   +-- Use negative broad match (e.g., free)
|
+-- A specific word sequence (ngram)?
|   +-- Use negative phrase match (e.g., "how to")
|
+-- One exact query only?
|   +-- Use negative exact match (e.g., [competitor name])
|
+-- Unsure?
    +-- Start with negative broad match (widest exclusion)
    +-- Monitor search terms for over-exclusion
    +-- Narrow to phrase or exact if needed
```

### Match type comparison

| **Factor** | **Negative broad** | **Negative phrase** | **Negative exact** |
| --- | --- | --- | --- |
| **Exclusion scope** | Widest | Medium | Narrowest |
| **Risk of over-excluding** | Highest | Medium | Lowest |
| **Word order matters** | No | Yes | Yes |
| **Extra words in query** | Allowed | Allowed (before/after) | Not allowed |
| **Default type** | Yes | No | No |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
| --- | --- | --- |
| **Assuming close variants are covered** | Singular/plural, misspellings still trigger ads | Add all variant forms manually |
| **Using pre-built default lists** | May exclude relevant terms for your business | Build lists from your own search term data |
| **Adding negatives only in broad match** | May over-exclude relevant queries containing those words | Use phrase match for ngrams, exact match for specific queries |
| **Forgetting to apply lists to DSA campaigns** | DSA campaigns match on page content, not keywords, so they need negative protection too | Link relevant negative keyword lists to all DSA campaigns |
| **Adding negatives at DSA ad group level** | Prevents ad rank from routing to the best ad group | Apply negatives at the DSA campaign level or via lists only |
| **Not adding accent mark variations** | Accented and unaccented versions are different keywords | Add both `cafe` and `café` |
| **Including special characters** | Characters are ignored or cause errors | Use only letters, numbers, spaces, periods, and ampersands |
| **Exceeding list limits** | 5,000 per list maximum | Audit and consolidate lists periodically |

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) | Category patterns and example negative keywords by vertical |
| [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) | Initial negative keyword list creation and linking (Phase 3.3) |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Ongoing irrelevant term identification and negation |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Performance-based negation through aggregated N-gram data |
| [Match Type Reference](../references/Match Type Reference.md) | Positive match type mechanics (contrast with negative behavior) |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Source data for identifying terms to exclude |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | Related workflow for search term management |

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
