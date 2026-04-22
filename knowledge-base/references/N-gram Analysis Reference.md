# N-gram Analysis Reference
Created: 2026-02-14

Support_ID: REFERENCE_41
Status: Done
Category: Search
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Search
Pillar: 7

## Purpose

Documents what N-grams are, how to extract them from search term data, how to classify them by performance, and how to structure exclusion lists for non-converting and inefficient patterns across Google Ads campaigns.

---

## What this reference is / what this is NOT

**This reference:**

- Defines N-gram types (unigram, bigram, trigram) and their use in search term analysis
- Documents the extraction process from search term report data
- Explains the two-list exclusion model (non-converting vs. inefficient)
- Provides classification thresholds for CPA and ROAS accounts
- Covers exclusion match type selection and list management

**This reference does NOT:**

- Provide step-by-step execution for running N-gram analysis (that belongs in an SOP)
- List specific negative keywords to add (See: [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md))
- Explain negative keyword match type mechanics (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md))
- Cover search term report navigation or column definitions (See: [Search Term Report Reference](../references/Search Term Report Reference.md))
- Recommend bidding or budget changes based on N-gram findings

---

## Quick reference: N-gram analysis at a glance

| Aspect | Details |
|--------|---------|
| What it is | Breaking search terms into word-level and phrase-level components to find patterns invisible at the individual query level |
| Input data | Search term report export (CSV) with impressions, clicks, cost, conversions, conversion value |
| Date range | 90-180 days depending on volume (90 minimum, 120 recommended, 180 extended for low-volume accounts) |
| Output | Two exclusion lists: non-converting N-grams and inefficient N-grams |
| Exclusion match type | Phrase match for all N-gram exclusions |
| Applies to | Search campaigns, Shopping campaigns, PMax search terms |

> 💡 **Why N-gram analysis matters:** Individual search terms may not have enough volume to evaluate. Aggregating metrics by shared word patterns reveals systemic waste that term-by-term review misses. A single irrelevant bigram can appear across hundreds of search terms.

---

## N-gram types

An N-gram is a contiguous sequence of N words extracted from a search term. Each search term produces multiple N-grams across different lengths.
| N-gram type | Length | Definition | Examples from "best free crm software trial" |
|-------------|--------|------------|-----------------------------------------------|
| 1-gram (unigram) | 1 word | Single words isolated from the query | "best", "free", "crm", "software", "trial" |
| 2-gram (bigram) | 2 words | Two-word sequences in order | "best free", "free crm", "crm software", "software trial" |
| 3-gram (trigram) | 3 words | Three-word sequences in order | "best free crm", "free crm software", "crm software trial" |

### Which N-gram length to use

| Length | Best for | Watch out for |
|--------|----------|---------------|
| 1-gram | Identifying single toxic words ("free", "jobs", "DIY") | High false-positive rate: common words appear in both good and bad queries |
| 2-gram | Most actionable level: captures intent patterns ("free trial", "how to", "near me") | Requires sufficient search term volume to produce meaningful aggregates |
| 3-gram | Catching specific irrelevant phrases ("best price guarantee", "do it yourself") | Lower frequency: fewer data points per trigram |

> 💡 **Start with 2-grams:** Bigrams hit the sweet spot between specificity and volume. Run 1-grams second to catch single toxic words. Use 3-grams only when 2-gram analysis surfaces ambiguous patterns that need more context.

---

## Extraction method

### Step 1️⃣: Export search term data

Export the search term report as CSV. Include these columns at minimum:
| Required column | Why |
|----------------|-----|
| Search term | Source text to break into N-grams |
| Impressions | Volume indicator |
| Clicks | Engagement indicator |
| Cost | Spend attribution per pattern |
| Conversions | Primary performance signal |
| Cost / conv. (CPA) | Efficiency metric for CPA accounts |
| Conversion value | Revenue attribution for ROAS accounts |
| Conv. value / cost (ROAS) | Efficiency metric for ROAS accounts |
| AOV (average order value) | Non-converting threshold for ROAS accounts (calculate: total conversion value / total conversions) |

### Step 2️⃣: Select date range

| Account spend level | Recommended date range | Rationale |
|---------------------|----------------------|-----------|
| High (>€10K/month) | 90 days | Minimum window: sufficient data accumulates, but N-grams need broader patterns than individual terms |
| Medium (€3K-€10K/month) | 120 days | Recommended default: balances data volume with relevance |
| Low (<€3K/month) | 180 days | Extended window for low-volume accounts to build statistically meaningful patterns |

### Step 3️⃣: Break search terms into N-grams

For each search term in the export:

1. Normalize the text (lowercase, remove punctuation)
2. Split into individual words
3. Generate all 1-grams, 2-grams, and 3-grams from the word sequence
4. Assign the parent search term's metrics (impressions, clicks, cost, conversions, conversion value) to each N-gram

### Step 4️⃣: Aggregate metrics per N-gram

Group identical N-grams and sum their metrics:
| Aggregated metric | Calculation |
|-------------------|-------------|
| Total impressions | Sum of impressions across all search terms containing the N-gram |
| Total clicks | Sum of clicks across all search terms containing the N-gram |
| Total cost | Sum of cost across all search terms containing the N-gram |
| Total conversions | Sum of conversions across all search terms containing the N-gram |
| Aggregated CPA | Total cost / Total conversions |
| Total conversion value | Sum of conversion value across all search terms containing the N-gram |
| Aggregated ROAS | Total conversion value / Total cost |

### Step 5️⃣: Filter for minimum volume

Discard N-grams with insufficient data before classifying:
| Filter | Minimum threshold | Why |
|--------|-------------------|-----|
| Impressions | 100+ | Below this, the N-gram is too rare to draw conclusions |
| Clicks | 25+ | Need meaningful click volume for cost-based evaluation |
| Cost | Account-dependent (see classification thresholds) | Must reach spend threshold to classify as non-converting |

---

## N-gram classification

This is the core of N-gram analysis. Every N-gram with sufficient volume falls into one of four quadrants.

### The four quadrants

| Quadrant | Conversions | Efficiency | Action |
|----------|-------------|------------|--------|
| Converting + efficient | > 0 | Meets or beats target | Protect: do nothing, or promote related terms to keywords |
| Converting + inefficient | > 0 | Below target (high CPA or low ROAS) | Add to "Inefficient N-grams" exclusion list |
| Non-converting + sufficient spend | 0 | N/A (zero conversions) | Add to "Non-converting N-grams" exclusion list |
| Non-converting + insufficient spend | 0 | N/A (too little data) | Monitor: revisit in next analysis cycle |

### Classification thresholds

**For CPA-focused accounts:**
| Category | Condition | Example (target CPA = €50) |
|----------|-----------|---------------------------|
| Non-converting | Spend > 2x target CPA with 0 conversions | N-gram spent €100+ with 0 conversions |
| Inefficient | CPA > 1.75x target CPA | N-gram CPA is €87.50+ |
| Efficient | CPA <= target CPA | N-gram CPA is €50 or below |

**For ROAS-focused accounts:**
| Category | Condition | Example (target ROAS = 4.0, AOV = €75) |
|----------|-----------|------------------------------|
| Non-converting | Spend > 2x AOV with 0 conversions | N-gram spent €150+ with 0 conversions |
| Inefficient | ROAS < 0.7x target ROAS | N-gram ROAS is below 2.8 |
| Efficient | ROAS >= target ROAS | N-gram ROAS is 4.0 or above |

### Minimum data for classification

The volume filters in Step 5 (100+ impressions, 25+ clicks) are a pre-filter. The inefficient classification requires a separate, higher data threshold to avoid false positives.

| Classification | Spend/efficiency threshold | Minimum click threshold | Rationale |
|----------------|---------------------------|------------------------|-----------|
| Non-converting | Spend > 2x target CPA (or 2x AOV) with 0 conversions | No additional minimum (spend threshold is the gate) | The 2x spend threshold implicitly requires significant clicks at any reasonable CPC |
| Inefficient | CPA > 1.75x target or ROAS < 0.7x target | 200+ clicks | Converting N-grams need large sample sizes for reliable CPA/ROAS. At 50 clicks with a 2% conversion rate, a single conversion swing changes CPA dramatically. 200 clicks provides statistical stability. |

> ⚠️ **Do not exclude inefficient N-grams with fewer than 200 clicks:** Small sample sizes produce unreliable CPA/ROAS figures for converting N-grams. An N-gram with 50 clicks and 1 conversion at €50 CPA looks inefficient, but one more conversion drops it to €25 CPA. Wait for 200+ clicks before classifying as inefficient.

> ⚠️ **Distinguish between non-converting and inefficient:** Non-converting N-grams are fundamentally irrelevant patterns: they never convert despite sufficient exposure. Inefficient N-grams do convert, just not profitably. This distinction determines which exclusion list they belong to and how often you revisit them.

---

## N-gram categorization by type

Beyond performance classification, categorize N-grams by their semantic function:
| Category | Examples | Typical action |
|----------|---------|----------------|
| Brand terms | Company name, product line names, branded acronyms | Protect: usually high-performing, route to brand campaigns |
| Product terms | Product types, features, specifications, materials | Evaluate per quadrant: performance varies by product |
| Intent modifiers | "buy", "compare", "review", "free", "how to", "DIY" | Intent-dependent: "buy" is typically high-intent, "free" is typically wasteful for paid products |
| Geographic | City names, "near me", state/region names | Location-dependent: valuable if you serve that area, waste if not |
| Competitor | Competitor brand names, competitor product names | Strategy-dependent: exclude if running non-competitor campaigns |

> 💡 **Build your own categorization.** The categories above are starting points. Every account is different: your product, audience, and competitive landscape determine which N-gram categories matter most. Adapt these categories to match your account's patterns and add new ones as you discover them.

---

## Two-list exclusion model

N-gram exclusions are separated into two distinct negative keyword lists. This separation is critical for ongoing management.

### List 1: Non-converting N-grams

| Property | Details |
|----------|---------|
| List name in Google Ads | "Non-converting N-grams" (or similar descriptive name) |
| Contents | N-grams with zero conversions after spending above the threshold |
| Review frequency | Rarely: these patterns are fundamentally irrelevant |
| Typical examples | "jobs", "salary", "free download", "DIY repair", competitor names (if unwanted) |
| Rationale for separation | These patterns have proven irrelevance: they do not need regular re-evaluation |

### List 2: Inefficient N-grams

| Property | Details |
|----------|---------|
| List name in Google Ads | "Inefficient N-grams" (or similar descriptive name) |
| Contents | N-grams that convert but at CPA above 1.75x target or ROAS below 0.7x target |
| Review frequency | Every 6-12 months (via 50/50 campaign experiment) |
| Typical examples | Low-intent modifiers ("compare", "review"), high-competition product terms, broad geographic terms |
| Rationale for separation | Efficiency can change after landing page improvements, offer changes, or bid strategy adjustments. Validate by unlinking the list in an experiment arm to see if excluded patterns now convert within targets |

### Linking lists to campaigns

Both lists must be linked to all relevant campaigns:
| Campaign type | Link non-converting list | Link inefficient list |
|---------------|--------------------------|----------------------|
| Search campaigns | Yes | Yes |
| Shopping campaigns | Yes (if N-grams apply) | Yes (if N-grams apply) |
| PMax campaigns | Yes | Yes |
| DSA campaigns | Yes | Yes |

---

## Exclusion match type

All N-gram exclusions are added in **phrase match**.
| Why phrase match | Explanation |
|-----------------|-------------|
| Blocks the word sequence | Prevents any query containing the N-gram phrase in order |
| Allows variations before/after | Does not over-exclude queries where these words appear separately or in different order |
| Matches N-gram structure | N-grams are ordered word sequences: phrase match mirrors this structure exactly |
| Safer than broad match negatives | Broad match negatives block queries containing all words in any order, which risks excluding relevant queries |

**Example:**

For the inefficient 2-gram "free trial":

- Adding `"free trial"` as phrase match negative blocks: "free trial software", "get free trial", "best free trial crm"
- Does NOT block: "trial free offer" (different order), "free software" (missing "trial"), "trial version" (missing "free")

> ⚠️ **Prefer phrase match for N-gram exclusions:** N-grams are ordered word sequences, and phrase match mirrors this structure. A broad match negative for `free trial` would block any query containing both "free" and "trial" in any order, including "trial-free pricing" where the words carry different meaning. Broad match negatives can be appropriate for single-word (1-gram) exclusions where word order is irrelevant (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md) for match type selection guidance).

---

## Analysis frequency

| Account spend | Frequency | Rationale |
|---------------|-----------|-----------|
| High (≥€50K/month) | Monthly | N-gram analysis requires aggregated data across many terms. Monthly cadence is sufficient even at high spend levels. |
| Medium (€10K-€50K/month) | Quarterly | Needs longer accumulation windows to build statistically meaningful N-gram patterns |
| Low (<€10K/month) | Biannual | Limited data requires extended collection periods for reliable N-gram classification |

### Applies to these campaign types

| Campaign type | N-gram analysis applicable | Notes |
|---------------|---------------------------|-------|
| Search campaigns | Yes (primary use case) | Full search term report available |
| Shopping campaigns | Yes | Search terms available via Shopping search term report |
| PMax campaigns | Yes | Search term data available in Insights: link exclusion lists directly to PMax campaigns |
| DSA campaigns | Yes | Search terms available, often higher volume of irrelevant matches |

---

## Bulk operations with Google Ads Editor

Use Google Ads Editor for efficient N-gram exclusion management:

### Adding N-gram exclusions in bulk

1. Open Google Ads Editor and download the latest account data
2. Navigate to **Keywords and targeting** > **Negative keyword lists**
3. Select the target list ("Non-converting N-grams" or "Inefficient N-grams")
4. Click **Add negative keyword** and paste the N-gram list (one per line, in phrase match format with double quotes)
5. Post changes to apply

### Exporting existing negative lists for audit

1. In Google Ads Editor, navigate to **Keywords and targeting** > **Negative keyword lists**
2. Select the list to export
3. Click **Export** > **Export selected** to CSV
4. Review for duplicates, conflicts with positive keywords, or outdated exclusions

### Linking lists to campaigns

1. In Google Ads Editor, navigate to **Campaigns**
2. Select the campaigns to link
3. Under **Negative keyword lists**, add the relevant lists
4. Post changes

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Mixing non-converting and inefficient N-grams in one list | Cannot apply different review cadences: inefficient patterns that become profitable stay excluded | Maintain two separate lists with distinct review schedules |
| Using broad match for multi-word N-gram exclusions | Over-excludes relevant queries where the words appear in different contexts | Use phrase match for 2-gram and 3-gram exclusions. Broad match is acceptable for 1-gram exclusions |
| Analyzing too short a date range | Insufficient data produces unreliable aggregates with false positives | Use 90-180 days depending on spend volume (90 minimum) |
| Excluding 1-grams without checking impact | Common single words appear in both good and bad queries: excluding "free" blocks "free shipping" if you offer it | Verify 1-gram exclusions against your converting search terms before adding |
| Skipping the minimum volume filter | Low-volume N-grams produce misleading CPA/ROAS figures | Require 100+ impressions and 25+ clicks for initial filtering. For inefficient classification (non-zero conversions), require 200+ clicks minimum |
| Excluding inefficient N-grams on small samples | An N-gram with 50 clicks and poor CPA can flip to profitable with one more conversion | Require 200+ clicks before adding to the inefficient exclusion list |
| Not linking lists to all relevant campaigns | Exclusions only apply to linked campaigns: new campaigns miss protection | Link both lists to every new Search and Shopping campaign at launch |
| Running N-gram analysis without conversion data | Cannot classify efficiency without conversion metrics | Ensure conversion tracking is verified before running analysis |
| Never revisiting the inefficient list | Patterns excluded as inefficient may become profitable after landing page or offer changes | Run a 50/50 campaign experiment every 6-12 months to validate whether excluded patterns now convert within targets |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Source data for N-gram extraction: column definitions, export methods, filters |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Negative match type mechanics, application levels, formatting rules |
| [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) | Pre-built negative keyword categories by vertical |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Upstream: identifies irrelevant terms from search term data. For performance-based negation, use SOP – Run N-gram Analysis instead |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Execution SOP for this reference: applies N-gram extraction, classification, and exclusion steps |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | Related workflow for the positive side of search term management |
| [Match Type Reference](../references/Match Type Reference.md) | Positive match type mechanics that determine which queries appear in your search term report |

---

## Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
