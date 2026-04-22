# Match Type Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_29
Category: Targeting
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Cheat Sheets
Agent_Readable: Yes
Status: Done

## Purpose

Documents how Google Ads keyword match types work: syntax, matching behavior, close variant expansion, signal usage, and the internal keyword selection hierarchy that determines which keyword serves for a given query.

---

## What this reference is / What this is NOT

**This reference:**

- Documents the mechanics of exact, phrase, and broad match
- Explains close variant behavior for each match type
- Details the 7-step keyword selection hierarchy Google uses to pick a keyword per query
- Covers the 4 extra signals broad match uses that phrase and exact do not
- Provides syntax and rules for each match type

**This reference does NOT:**

- Recommend which match type to use (See: [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md))
- Explain bidding strategy setup (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Tell you which bid strategy pairs with which match type (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Provide campaign structure decisions (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Cover negative keyword match types (different mechanics, different rules)

---

## Quick reference: match types

| Match type | Syntax | Matching behavior | Reach | Extra signals |
|------------|--------|-------------------|-------|---------------|
| **Exact** | `[keyword]` | Same meaning or intent as the keyword | Narrowest | No |
| **Phrase** | `"keyword"` | Includes the meaning of the keyword | Medium | No |
| **Broad** | `keyword` | Related to the keyword | Widest | Yes (4 signals) |

> 💡 **All match types use semantic matching:** Google interprets meaning and intent, not just syntax. A search for "budget accommodation" can match the keyword `[cheap hotels]` on exact match because Google considers them semantically equivalent.

---

## 1. Exact match

### What it does

Matches searches that have the same meaning or intent as your keyword. Despite the name, exact match no longer requires a character-for-character match. Google applies close variant expansion to cover synonyms, rewordings, and implied intent.

### Syntax

`[keyword]`

Square brackets around the keyword.

**Examples:**
| Keyword | Example matching queries |
|---------|------------------------|
| `[running shoes]` | running shoes, shoes for running, running sneakers |
| `[plumber near me]` | plumber near me, local plumber, plumber in my area |
| `[buy crm software]` | buy crm software, purchase crm software, crm software pricing |

### Close variant behavior

Exact match close variants include:
| Close variant type | Example keyword | Example match |
|--------------------|----------------|---------------|
| Misspellings | `[running shoes]` | runnnig shoes |
| Singular/plural | `[running shoe]` | running shoes |
| Stemmings | `[run shoes]` | running shoes |
| Abbreviations | `[crm software]` | customer relationship management software |
| Rewordings | `[cheap hotels]` | budget accommodation |
| Same-intent queries | `[plumber near me]` | emergency plumbing service |
| Implied words | `[daytime running lights]` | DRL for car |

### Rules

| Rule | Details |
|------|---------|
| **Character limit** | Keywords can be up to 80 characters including spaces |
| **Word order** | Not guaranteed to preserve word order: Google interprets intent |
| **Negative interaction** | Negative exact `[keyword]` blocks only that exact query, not close variants (use negative phrase for broader blocking) |
| **Quality Score** | Keyword-level Quality Score applies to all queries matched through this keyword |
| **Auction priority** | Exact match keywords identical to the search term get highest priority in keyword selection |

### Use cases

| Use case | Why exact match fits |
|----------|---------------------|
| Brand terms | Tightest control over brand query matching |
| High-value converters | Known converting queries with proven performance data |
| Regulated industries | Compliance requires precise query control |
| Manual CPC bidding | Narrower match compensates for less intelligent bid optimization |

### When NOT to use

| Situation | Why | Alternative |
|-----------|-----|-------------|
| Running smart bidding (tCPA/tROAS) with sufficient data | Limits the signal surface smart bidding can use | Broad match |
| Trying to discover new queries | Exact match restricts to known intent patterns | Broad match or phrase match |
| Low search volume keywords | Too restrictive, ads rarely show | Phrase match |

---

## 2. Phrase match

### What it does

Matches searches that include the meaning of your keyword. The query must contain the concept expressed by your keyword, but can include additional words before, after, or around it. Google applies semantic matching, so the query does not need to contain your exact words.

### Syntax

`"keyword"`

Double quotes around the keyword.

**Examples:**
| Keyword | Example matching queries |
|---------|------------------------|
| `"tennis shoes"` | buy tennis shoes, tennis shoes for women, red tennis sneakers |
| `"moving company"` | affordable moving company near me, best movers in Chicago |
| `"crm software"` | crm software for small business, best customer management platform |

### Close variant behavior

Phrase match close variants include everything exact match covers, plus:
| Close variant type | Example keyword | Example match |
|--------------------|----------------|---------------|
| Additional words | `"tennis shoes"` | buy red tennis shoes online |
| Word reordering (when meaning preserved) | `"shoes for tennis"` | tennis shoes |
| Paraphrasing | `"moving company"` | furniture movers |
| Related expansions | `"lawn mowing service"` | grass cutting and lawn maintenance |

### Rules

| Rule | Details |
|------|---------|
| **Character limit** | Keywords can be up to 80 characters including spaces |
| **Meaning preservation** | Google maintains the core meaning of your keyword in matched queries |
| **Broader than historical** | Phrase match absorbed the old broad match modifier (+keyword) behavior in 2021 |
| **No extra signals** | Does not use landing page, other keywords, user history, or location signals for matching (only for bidding) |
| **Auction priority** | Phrase match identical to search term gets priority over non-identical exact match (see keyword selection hierarchy) |

### Use cases

| Use case | Why phrase match fits |
|----------|----------------------|
| Budget-constrained accounts | More reach than exact, more control than broad |
| Non-smart-bidding strategies | Manual CPC where broad match is too unpredictable |
| Topic-focused ad groups | Keeps queries within a meaning cluster |
| Discovery with guardrails | Finds new queries while maintaining thematic relevance |

### When NOT to use

| Situation | Why | Alternative |
|-----------|-----|-------------|
| Running smart bidding with sufficient data | Limits signal surface and query coverage | Broad match |
| Need maximum query volume | Phrase restricts to meaning-inclusive queries | Broad match |
| Need exact query control | Phrase still allows significant expansion | Exact match |

---

## 3. Broad match

### What it does

Matches searches related to your keyword, including queries that do not contain any of the keyword's terms. Broad match uses the widest interpretation of relevance, plus 4 additional signals that phrase and exact match do not have access to for matching purposes.

### Syntax

`keyword`

No symbols. Just the keyword text.

**Examples:**
| Keyword | Example matching queries |
|---------|------------------------|
| `low carb diet plan` | carb free foods, keto diet recipes, low calorie meal prep |
| `crm software` | salesforce alternatives, best tools for managing leads, customer database app |
| `plumber` | fix leaking faucet, emergency pipe repair, water heater installation |

### The 4 extra signals

Broad match uses 4 signals for query matching that phrase and exact match do not:

> AI Max for Search campaigns extends broad match behavior further by adding asset-based and landing page-based keywordless matching. If AI Max is enabled, your campaign can match queries that relate to your headlines, descriptions, sitelinks, and landing page content, even without matching keywords. See [AI Max for Search Reference](../references/AI Max for Search Reference.md) for details.
| Signal | What it does | Example |
|--------|-------------|---------|
| **Landing page content** | Google reads your landing page to understand what you sell, and matches queries that align with your page content | Keyword `shoes` with a running shoe landing page: less likely to match "dress shoes" |
| **Other keywords in the ad group** | Google uses your other keywords as context to understand the theme of your ad group | Ad group with `crm software`, `sales pipeline tool`, `lead management`: broad match on `crm software` understands you target sales tools |
| **User's previous searches** | Google considers the user's recent search history to predict intent | User previously searched "marathon training": now searching "shoes" is more likely to match `running shoes` |
| **User location** | Google factors in where the user is physically located | User in Amsterdam searching "restaurant": more likely to match `amsterdam restaurants` |

> 💡 **These signals operate at matching time, not just bidding time:** Phrase and exact match also benefit from these signals for bid calculation through smart bidding, but only broad match uses them to determine whether a query qualifies as a match in the first place.

### Close variant behavior

Broad match includes all close variants from exact and phrase, plus:
| Close variant type | Example keyword | Example match |
|--------------------|----------------|---------------|
| Related concepts | `vegetarian recipes` | plant-based meal ideas |
| Broader intent | `plumber` | how to fix a running toilet |
| Inferred needs | `wedding venue` | outdoor event space with catering |
| Category-level matching | `running shoes` | best Nike Air Zoom Pegasus |

### Rules

| Rule | Details |
|------|---------|
| **Character limit** | Keywords can be up to 80 characters including spaces |
| **No syntax symbols** | Any keyword entered without brackets or quotes defaults to broad match |
| **Requires negative keyword management** | Broader matching means more irrelevant query potential: add negatives proactively |
| **Most effective with smart bidding** | Smart bidding can evaluate each broad match query individually and bid down on low-value matches |
| **Landing page matters** | Your landing page directly influences which queries Google considers relevant |
| **Auction priority** | Broad match identical to search term gets same priority as phrase match identical to search term |

### Use cases

| Use case | Why broad match fits |
|----------|---------------------|
| Smart bidding (tCPA/tROAS) | Smart bidding evaluates each query individually, compensating for broad matching |
| Query discovery | Finds converting queries you would never think to target |
| High-volume accounts | Maximum coverage across all relevant query variations |
| Long-tail capture | 26% YoY growth in 4+ word queries: broad match captures these automatically |

### When NOT to use

| Situation | Why | Alternative |
|-----------|-----|-------------|
| New account with no conversion history | Smart bidding has no query-level data to optimize against, broad match expands blindly | Phrase or exact match until conversion data builds |
| Low-volume campaigns (<30 conversions/month for tCPA, <50 for tROAS) | Insufficient data for broad match to optimize effectively | Phrase or exact match, concentrate spend on known high-intent queries |
| Very limited budget | Broad match consumes budget across many queries before core queries are served | Phrase or exact match |
| Extremely niche B2B verticals with predictable keywords | Query space is narrow, broad match produces mostly irrelevant queries | Phrase or exact match |
| Manual CPC bidding | No per-query bid optimization to compensate for broad matching | Phrase or exact match |
| Regulated industries with strict query requirements | Cannot guarantee which queries trigger your ads | Exact match |
| No negative keyword process in place | Irrelevant queries waste spend without a process to identify and block them | Phrase match, or build a negative keyword process first |

---

## Keyword selection hierarchy

When a user enters a search query, Google follows a 7-step process to determine which keyword, ad, and bid enters the auction.

### The 7-step auction sequence

1. **User enters a query** on Google Search
2. **Google retrieves all potentially relevant enabled keywords** across your account (and all other advertisers' accounts)
3. **Eligibility check:** Google evaluates each keyword against the query using match type rules
4. **Google selects one keyword per ad group** using the internal priority hierarchy (see below)
5. **RSA assembly:** Google assembles the best headline/description combination for the selected keyword
6. **Smart bidding sets the optimal bid** for this specific impression, user, and context
7. **The ad with the highest Ad Rank** (bid x Quality Score x expected extension impact) enters the auction

### Internal keyword selection priority

When multiple keywords in the same ad group could match a query, Google uses this priority order:
| Priority | Condition | Example |
|----------|-----------|---------|
| **1 (highest)** | Exact match keyword identical to search term | Query: "running shoes", keyword: `[running shoes]` |
| **2** | Exact match keyword identical to spell-corrected search term | Query: "runnign shoes", keyword: `[running shoes]` |
| **3** | Phrase or broad match keyword identical to search term | Query: "running shoes", keyword: `"running shoes"` or `running shoes` |
| **4** | Phrase or broad match keyword identical to spell-corrected search term | Query: "runnign shoes", keyword: `"running shoes"` |
| **5 (lowest)** | Keyword with highest Ad Rank | Multiple keywords qualify but none is identical: highest Ad Rank wins |

> 💡 **"Identical" means character-for-character match between the search term and the keyword text:** Close variants, synonyms, and rewordings are not considered identical. They fall to priority 5 (Ad Rank).

### Cross-ad-group behavior

The priority hierarchy above applies within a single ad group. When keywords across multiple ad groups or campaigns could match:

| Scenario | Resolution |
|----------|-----------|
| Same keyword in multiple ad groups | Ad Rank determines which ad group's keyword serves |
| Different keywords, same query | Each ad group's best keyword competes on Ad Rank |
| Different match types, same keyword text, different ad groups | Priority hierarchy applies first, then Ad Rank breaks ties |

### What this means in practice

| Implication | Explanation |
|-------------|-------------|
| No need to duplicate keywords across match types | The hierarchy routes queries to the right keyword automatically |
| Exact match gets first shot at identical queries | If `[running shoes]` exists and the query is "running shoes", exact match wins |
| Ad Rank is the tiebreaker for everything else | For non-identical matches, the keyword attached to the highest-performing ad wins |
| Broad match catches everything else | Queries that don't match an identical exact/phrase keyword flow to the highest Ad Rank keyword, often broad |

---

## Broad match signal comparison

This table summarizes which signals each match type uses for query matching vs. bid optimization:
| Signal | Exact match (matching) | Phrase match (matching) | Broad match (matching) | All types (bidding via smart bidding) |
|--------|----------------------|------------------------|----------------------|-------------------------------------|
| Keyword text and meaning | Yes | Yes | Yes | Yes |
| Close variants | Yes | Yes | Yes | Yes |
| Landing page content | No | No | Yes | Yes |
| Other keywords in ad group | No | No | Yes | Yes |
| User's previous searches | No | No | Yes | Yes |
| User location | No | No | Yes | Yes |
| Device | No | No | No | Yes |
| Time of day | No | No | No | Yes |
| Demographics | No | No | No | Yes |
| Remarketing lists | No | No | No | Yes |

> 💡 **Key distinction:** Smart bidding uses all signals for setting bids regardless of match type. The difference is that broad match also uses 4 of these signals to determine whether a query qualifies as a match in the first place. This means broad match surfaces queries that phrase and exact would never even see.

---

## Decision guide: which match type?

```
Using smart bidding (tCPA or tROAS)?
|
+-- YES --> Sufficient conversion data (30+/month for tCPA, 50+ for tROAS)?
|           |
|           +-- YES --> Use broad match
|           |           (Maximum signal surface for smart bidding)
|           |
|           +-- NO --> Use phrase match
|                      (Until conversion volume builds)
|
+-- NO --> Budget constrained?
           |
           +-- YES --> Use exact match
           |           (Tightest spend control)
           |
           +-- NO --> Regulatory/compliance requirements?
                      |
                      +-- YES --> Use exact match
                      |           (Query-level control)
                      |
                      +-- NO --> Use phrase match
                                 (Balance of reach and control)
```

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Duplicating keywords across all 3 match types | Creates internal competition, confuses reporting, wastes management time | Use one match type per keyword based on your bidding strategy and data volume |
| Using broad match with manual CPC | No per-query bid optimization to compensate for wide matching | Switch to smart bidding, or switch to phrase/exact match |
| Assuming exact match = exact query | Exact match includes close variants, synonyms, and same-intent queries | Check the search terms report: "exact" match queries will include terms you did not type |
| Ignoring the search terms report on broad match | Broad match will match irrelevant queries that waste budget | Review search terms weekly and add negatives |
| Adding broad match modifier syntax (+keyword) | Broad match modifier was retired in 2021 and merged into phrase match | Use phrase match `"keyword"` instead |
| Expecting word order preservation on phrase match | Phrase match can reorder words when meaning is preserved | Focus on meaning, not word sequence |
| Using broad match without landing page alignment | Google uses your landing page as a matching signal: misaligned pages attract wrong queries | Ensure landing page content matches the keyword's intended topic |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Conceptual framework for how search campaigns operate |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | How campaign and ad group structure affects keyword routing |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Recommended match type configurations by bidding strategy and goal |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | How auction-time bidding evaluates signals per impression |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Which bid strategy to pair with your match type choice |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Negative match type mechanics (contrast with positive keyword behavior) |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | Process for converting search terms into keywords |
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | How AI Max extends broad match with keywordless matching |
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Decision framework for AI Max vs. standard match types |

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
