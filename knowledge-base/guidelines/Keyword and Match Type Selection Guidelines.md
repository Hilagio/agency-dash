# Keyword and Match Type Selection Guidelines
Created: 2026-02-04

Support_ID: GUIDELINE_5
Category: Targeting
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Guideline
Agent_Readable: Yes
Status: Done

## Purpose

This guideline defines recommended match type configurations based on your bidding strategy and campaign goals. It supports keyword setup by establishing which match type to use in each scenario, when exceptions apply, and how to avoid common duplication mistakes.

---

## What this is / What this is NOT

**This guideline:**

- Defines the recommended match type for each bidding strategy and campaign goal
- Establishes when broad match is the correct default and when it is not
- Explains the keyword duplication policy across match types
- Provides initial keyword set sizing recommendations
- Establishes exception conditions for deviating from defaults

**This guideline does NOT:**

- Explain match type syntax and behavior (See: [Match Type Reference](../references/Match Type Reference.md))
- Explain how smart bidding works internally (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Tell you which bid strategy to select (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Provide step-by-step keyword research or campaign build instructions
- Provide step-by-step execution instructions

---

## Bidding-match type matrix

This is the core recommendation. Match type selection depends on your bidding strategy and whether you have efficiency targets set.

| Campaign goal | Bidding strategy | Recommended match type | Not recommended |
|---------------|-----------------|----------------------|-----------------|
| Conversions with efficiency targets (established account) | Target CPA or Target ROAS | **Broad match** | Exact/Phrase (unnecessary when sufficient data exists, see exceptions below) |
| Conversions without targets | Max Conversions or Max Conversion Value | **Phrase + Exact match** | Broad match |
| Clicks | Max Clicks (with CPC cap) or Manual CPC | **Phrase + Exact match** | Broad match |
| Visibility | Target Impression Share (with CPC cap) | **Phrase + Exact match** | Broad match |

> ⚠️ **The match type recommendation changes entirely based on whether you have efficiency targets:** Broad match with Target CPA is a strong combination. Broad match with Max Conversions (no target) is a budget drain. The bidding strategy dictates the match type, not the other way around.

---

## Recommended configuration by goal

### Conversions with efficiency targets: use broad match

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Match type** | **Broad match** | Broad match uses 4 additional signals (landing page content, other keywords in the ad group, user's previous searches, user location) that phrase and exact cannot access |
| **Bidding strategy** | Target CPA or Target ROAS | Efficiency targets constrain the algorithm, preventing it from chasing low-quality queries |
| **Target competitiveness** | Set competitive but realistic targets | The algorithm needs room to explore while staying within bounds |

**Why broad match works here:** the efficiency target acts as a guardrail. The algorithm will not chase irrelevant queries because doing so would violate the CPA or ROAS constraint. Broad match gives the algorithm maximum reach to find converting users across query variations, misspellings, and related searches that phrase and exact would miss.

**Why phrase/exact are unnecessary here:** broad match with smart bidding reaches more users than phrase or exact. Google's matching hierarchy already prioritizes exact matches when they exist. Adding phrase and exact duplicates of the same keyword adds no value and clutters the account.

### Conversions without targets: use phrase and exact

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Match type** | **Phrase + Exact match** | Without an efficiency constraint, the algorithm will maximize volume at any cost |
| **Bidding strategy** | Max Conversions or Max Conversion Value | These strategies chase volume without a cost ceiling |

**Why broad match fails here:** Max Conversions and Max Conversion Value have one objective: get as many conversions (or as much value) as possible. Without a CPA or ROAS target, there is no efficiency guardrail. Broad match in this context expands queries aggressively, and the algorithm will happily pay 10x your normal CPC if it leads to a conversion.

### Clicks: use phrase and exact

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Match type** | **Phrase + Exact match** | Click-based strategies have no conversion signal to optimize against |
| **Bidding strategy** | Max Clicks (with CPC cap) or Manual CPC | Budget should be spent on relevant clicks only |

**Why broad match fails here:** click-based bidding strategies do not optimize for conversion quality. Broad match would expand to loosely related queries, and the algorithm would bid on anything that generates a click. Phrase and exact keep traffic focused on queries you have validated as relevant.

### Visibility: use phrase and exact

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Match type** | **Phrase + Exact match** | Impression Share strategies bid for visibility, not conversion efficiency |
| **Bidding strategy** | Target Impression Share (with CPC cap) | Budget should buy impressions on specific, intended queries only |

**Why broad match fails here:** Target Impression Share bids to appear at the top of results for matched queries. Broad match would expand query coverage to loosely related terms, and the strategy would bid aggressively to show at the top for all of them. This overspends budget on queries that do not matter for your visibility goals.

---

## Exception conditions

### When to use phrase/exact despite having efficiency targets

Broad match with Target CPA or Target ROAS is the default, but use phrase or exact match when:

| Exception | Match type to use | Rationale |
|-----------|------------------|-----------|
| New account with no conversion history | Exact and/or Phrase | Smart bidding has no query-level data. Broad match generates waste while the algorithm explores blindly. Test broad later via 50/50 campaign experiment |
| Low-volume campaign (<30 conversions/month for tCPA, <50 for tROAS) | Exact and/or Phrase | Insufficient data for broad match to optimize effectively. Concentrate spend on known high-intent queries |
| Constrained budget | Exact and/or Phrase | Small budgets get consumed by broad match exploration before core queries are served. Control traffic relevance and temperature |
| Extremely niche B2B verticals with predictable keywords | Exact and/or Phrase | Query space is narrow. Broad match produces mostly irrelevant queries with low incremental uplift |
| Specific budget allocation for specific terms | Exact or Phrase | You need guaranteed spend on particular queries, not algorithmic allocation |
| Industry regulations require matching only specific searches | Exact or Phrase | Legal, medical, or financial industries may require precise query control |

### When to upgrade from phrase/exact to broad match

If you are currently running phrase or exact match with Target CPA or Target ROAS:

| Condition | Action |
|-----------|--------|
| Account has 30+ conversions/month (tCPA) or 50+ (tROAS) | Test broad match via 50/50 campaign experiment |
| Conversion data is stable (consistent CPA/ROAS over 2+ weeks) | Run the experiment for 2-4 weeks with equal budget split |
| Experiment shows incremental conversions at acceptable CPA/ROAS | Roll out broad match |
| Budget is sufficient to handle query expansion | Proceed with rollout |

> 💡 **Use 50/50 campaign experiments to test broad match:** Do not switch all keywords to broad match at once. Run a controlled experiment: one arm with phrase/exact, one arm with broad match, equal budgets. If broad match delivers incremental conversions at acceptable efficiency, roll it out. If not, keep phrase/exact.

---

## Keyword duplication policy

### Do not duplicate keywords across match types

Google's matching hierarchy handles query routing automatically:

| Priority | Routing rule |
|----------|-------------|
| 1 | Exact match keyword identical to the search query |
| 2 | Phrase or broad match keyword identical to the search query |
| 3 | Spell-corrected match to any keyword |
| 4 | Highest Ad Rank among remaining eligible keywords |

**What this means:** if you have "crm software" as a broad match keyword, there is no benefit to also adding [crm software] as exact match and "crm software" as phrase match. The system already prioritizes the most restrictive match when the query matches identically.

### Recommended approach

| Scenario | Recommendation |
|----------|---------------|
| Running broad match with efficiency targets | One broad match keyword per theme. No phrase or exact duplicates needed |
| Running phrase + exact without efficiency targets | Choose one match type per keyword. Phrase for flexibility, exact for precision |
| Migrating from phrase/exact to broad | Pause phrase/exact keywords, activate broad match equivalents. Do not run both simultaneously |

### What duplicate keywords cause

- Cluttered account structure with no performance benefit
- Misleading reporting (conversions split across duplicate keywords)
- Unnecessary management overhead
- No improvement in query coverage or auction eligibility

---

## Initial keyword set sizing

### How many keywords to start with

| Match type context | Sizing recommendation | Rationale |
|-------------------|----------------------|-----------|
| Broad match + smart bidding | Start with core theme keywords only (5-20 per ad group, depending on theme breadth) | Broad match discovers long-tail queries automatically. Over-adding keywords creates redundancy |
| Phrase/Exact match | Cover all known relevant query variations (10-30 per ad group is typical) | Phrase and exact do not discover new queries. Coverage depends on your keyword list |

### Broad match keyword sizing principles

- **Cover core themes, not every variation.** "crm software" as broad match will find "best crm tool", "crm platform reviews", and hundreds of other variations. Adding all of those manually is redundant
- **Let smart bidding handle discovery:** The algorithm uses landing page content, other keywords, user history, and location to find relevant queries. Your job is to define themes, not enumerate every possible search
- **Review the search terms report:** After 2 weeks, check which queries broad match found. Add negatives for irrelevant patterns. Do not add more keywords to match queries the algorithm already finds

### Phrase/Exact keyword sizing principles

- **Cover known variations explicitly:** Without algorithmic expansion, your keywords are the ceiling of your coverage
- **Group tightly by theme:** Each ad group should contain keywords that map to the same intent and landing page
- **Expand based on search term reports:** New keyword ideas come from actual user queries, not speculation

---

## Common mistakes

| Mistake | Why it fails | Correct approach |
|---------|-------------|-----------------|
| Broad match with Max Conversions (no target) | Algorithm chases volume at any cost, query quality collapses | Set a Target CPA or Target ROAS before using broad match |
| Duplicating keywords across all three match types | No performance benefit, clutters reporting, wastes management time | One match type per keyword |
| Starting broad match on a brand-new account with no conversion history | Algorithm has no signal to optimize against, broad match expands blindly | Start with phrase/exact, build conversion data, then migrate to broad match |
| Using exact match with Target CPA because "it's safer" | Exact match limits the signals smart bidding can use, reduces reach, raises CPAs | Use broad match with efficiency targets for maximum algorithmic flexibility |
| Adding hundreds of keywords to a broad match ad group | Broad match already expands each keyword to hundreds of queries. Over-adding creates massive overlap | 5-20 theme-level keywords per ad group |
| Running broad match on a constrained budget | Budget gets consumed by exploration before core queries are served | Use phrase/exact until budget supports broad match expansion |

---

## Configuration verification

After configuring keywords and match types, verify:

| Check | Expected state |
|-------|---------------|
| Match type aligns with bidding strategy per the matrix above | Broad for tCPA/tROAS, Phrase/Exact for all others |
| No keyword duplicated across multiple match types | One match type per keyword per campaign |
| Efficiency targets set before enabling broad match | Target CPA or Target ROAS active and competitive |
| Conversion volume supports broad match (if using it) | 30+ conversions/month for tCPA, 50+ for tROAS |
| Ad groups contain theme-appropriate keyword counts | 5-20 for broad match, 10-30 for phrase/exact |
| Negative keywords in place after first 2 weeks of broad match | Irrelevant query patterns excluded |

---

## Related documents

- [Match Type Reference](../references/Match Type Reference.md): match type syntax, behavior, and matching rules
- [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md): how match types fit into the broader campaign framework
- [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md): which bidding strategy to choose
- [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md): how smart bidding uses signals, including broad match signals
- [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md): portfolio strategies, CPC caps, and related bidding settings

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
