# Search Term Report Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_30
Category: Targeting
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Cheat Sheets
Agent_Readable: Yes
Status: Done

## Purpose

Documents the structure, columns, filters, and access methods for the Google Ads Search Term Report (STR): what data it contains, how to navigate it, and what each field means.

---

## What this reference is / what this is NOT

**This reference:**

- Defines every column available in the Search Term Report
- Explains search term status values (Added, None, Excluded)
- Documents how to access, filter, segment, and export STR data
- Provides a decision matrix for classifying search terms by performance

**This reference does NOT:**

- Tell you how to run a full search term analysis workflow (See: [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md))
- Provide negative keyword lists or structures (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md))
- Explain match type mechanics (See: [Match Type Reference](../references/Match Type Reference.md))
- Recommend bidding or budget changes based on STR findings

---

## Quick reference: Search Term Report at a glance

| **Aspect** | **Details** |
|------------|-------------|
| **Location** | Google Ads > Campaigns/Ad Groups > Insights and reports > Search terms |
| **Data availability** | Search, Shopping, and Performance Max campaigns |
| **Default date range** | Last 7 days (adjustable) |
| **Privacy threshold** | Search terms below Google's privacy threshold are hidden |
| **Data freshness** | Typically 24-48 hours delayed |
| **Export formats** | CSV, Google Sheets, PDF |
| **API access** | `search_term_view` for Search/Shopping, `campaign_search_term_view` for PMax |

> 💡 **Privacy note:** Google redacts search terms that do not meet a minimum volume threshold. These queries still consume budget but do not appear in the report. The percentage of hidden terms varies by account.

---

## How to access the Search Term Report

### From the Google Ads UI

1. Sign in to Google Ads
2. Navigate to a Search, Shopping, or Performance Max campaign (or stay at account level for all campaigns)
3. Click **Insights and reports** in the left navigation
4. Click **Search terms**

### From Google Ads Editor

1. Open Google Ads Editor
2. Select the account
3. Go to **Keywords** > **Search terms** tab
4. Data is read-only in Editor: use it for review, not for filtering

### From the API

**Search and Shopping campaigns:** Use the `search_term_view` resource. This provides search term data aggregated at the ad group level. Key fields map to the columns described below.

**Performance Max campaigns:** Use the `campaign_search_term_view` resource instead. The `search_term_view` does not include PMax data. The `campaign_search_term_view` resource returns search terms aggregated at the campaign level and provides category-grouped data matching the Insights view in the UI.

---

## Column-by-column breakdown

### Identification columns

| **Column** | **What it shows** | **Notes** |
|------------|-------------------|-----------|
| **Search term** | The actual query a user typed into Google | May differ significantly from the matched keyword |
| **Keyword** | The keyword in your account that triggered the ad | Shows the keyword text, not the match type modifier |
| **Match type** | How the keyword matched to the search term | Values: Exact match, Phrase match, Broad match |
| **Campaign** | The campaign containing the triggered keyword | Useful for isolating STR data by campaign theme |
| **Ad group** | The ad group containing the triggered keyword | Useful for mapping search terms to ad group intent |

### Performance columns

| **Column** | **What it shows** | **Format** |
|------------|-------------------|------------|
| **Impressions** | Number of times your ad appeared for this search term | Integer |
| **Clicks** | Number of clicks on your ad from this search term | Integer |
| **CTR** | Click-through rate (Clicks / Impressions) | Percentage |
| **Cost** | Total spend attributed to this search term | Currency |
| **Avg. CPC** | Average cost per click for this search term | Currency |

### Conversion columns

| **Column** | **What it shows** | **Format** |
|------------|-------------------|------------|
| **Conversions** | Number of conversions attributed to this search term | Decimal (can be fractional with DDA) |
| **Conv. rate** | Conversion rate (Conversions / Clicks) | Percentage |
| **Cost / conv.** | Cost per conversion (Cost / Conversions) | Currency |
| **Conversion value** | Total conversion value attributed to this search term | Currency |
| **Conv. value / cost** | Return on ad spend (Conversion value / Cost) | Ratio (e.g., 3.5) |
| **Value / conv.** | Average value per conversion (Conversion value / Conversions) | Currency |

### Status column

| **Column** | **What it shows** | **Notes** |
|------------|-------------------|-----------|
| **Search term status** | Relationship between the search term and your account | Three possible values: Added, None, Excluded |

---

## Search term status definitions

| **Status** | **Meaning** | **What it tells you** |
|------------|-------------|----------------------|
| **Added** | This search term exists as a keyword in the same ad group | The query is already targeted explicitly |
| **None** | This search term does not exist as a keyword in the triggering ad group | The query matched via broad, phrase, or close variant matching |
| **Excluded** | This search term is on a negative keyword list or set as a negative at campaign/ad group level | The query is blocked from triggering ads going forward |

> 💡 **"Added" checks the triggering ad group only:** A search term can show "None" in one ad group even if it exists as a keyword in a different ad group or campaign.

---

## Search categories

Google assigns auto-generated **search categories** that group search terms into thematic clusters. These appear as a separate tab or column option in the Search Terms view.

| **Aspect** | **Details** |
|------------|-------------|
| **What they are** | Google's automated grouping of search terms by theme |
| **Granularity** | Multi-level hierarchy (e.g., "Shoes > Running shoes > Trail running shoes") |
| **Use case** | Identify thematic patterns across many search terms at once |
| **Limitation** | Categories are Google-defined and cannot be customized |

---

## Filters and segments

### Available filters

| **Filter** | **How to use it** | **Useful for** |
|------------|-------------------|----------------|
| **Search term text** | Contains, does not contain, equals, starts with | Finding specific queries or patterns |
| **Search term status** | Added, None, Excluded | Isolating unmatched queries (filter to "None") |
| **Campaign / Ad group** | Select specific campaigns or ad groups | Narrowing analysis to a single theme |
| **Conversions** | Greater than, less than, equals, between | Finding converting or non-converting terms |
| **Cost** | Greater than, less than, equals, between | Identifying high-spend terms |
| **CTR** | Greater than, less than, equals, between | Finding high or low engagement terms |
| **Impressions** | Greater than, less than, equals, between | Filtering out low-volume noise |
| **Conv. rate** | Greater than, less than, equals, between | Spotting high-efficiency queries |

### Available segments

| **Segment** | **What it adds** |
|-------------|-----------------|
| **Time** | Day, week, month, quarter, year, day of week |
| **Conversions** | Conversion action name, conversion category |
| **Device** | Computer, mobile, tablet |
| **Network** | Search partners vs. Google Search |

> 💡 **Combine filters for faster analysis:** Apply "Status = None" + "Conversions > 0" to surface converting search terms not yet added as keywords. Apply "Status = None" + "Cost > X" + "Conversions = 0" to surface waste.

---

## Export options

| **Method** | **Format** | **How to access** |
|------------|------------|-------------------|
| **Download** | CSV, TSV, PDF | Click the download icon in the toolbar above the report |
| **Google Sheets** | Spreadsheet | Click download icon > select "Google Sheets" |
| **Schedule** | CSV via email | Reports > Scheduled reports > create new |
| **API (Search/Shopping)** | JSON / CSV | Query `search_term_view` via Google Ads API |
| **API (PMax)** | JSON / CSV | Query `campaign_search_term_view` via Google Ads API |
| **Google Ads Scripts** | Programmatic | Use `AdsApp.search()` with GAQL query |

### Export for ngram analysis

To perform ngram analysis (breaking search terms into single words, two-word pairs, and three-word groups for pattern detection):

1. Export the full STR as CSV
2. Ensure these columns are included: Search term, Impressions, Clicks, Cost, Conversions, Conversion value
3. Process the CSV with an ngram script or spreadsheet formula to split terms and aggregate metrics per word/phrase

---

## Decision matrix: search term classification

This matrix classifies search terms by their performance data. It defines what each combination means, not what action to take.

| **Conversions** | **Cost** | **Relevance to offer** | **Classification** |
|-----------------|----------|------------------------|--------------------|
| Above target | Any | Relevant | Proven performer |
| Above target | High | Relevant | High-value, high-cost performer |
| 0 | Above threshold | Relevant | Unproven, significant spend |
| 0 | Above threshold | Irrelevant | Waste |
| 0 | Below threshold | Relevant | Insufficient data |
| 0 | Below threshold | Irrelevant | Low-priority waste |
| Any | Any | Irrelevant | Mismatch |

**Threshold definition:** The cost threshold for evaluating a search term depends on your target CPA or acceptable cost per test. A search term that has spent 2-3x your target CPA with zero conversions has consumed a meaningful test budget.

> 💡 **This matrix classifies, it does not prescribe:** For execution steps on promoting or negating search terms, use the related SOPs listed below.

---

## Report limitations

| **Limitation** | **Details** |
|----------------|-------------|
| **Privacy threshold** | Low-volume search terms are hidden from the report entirely |
| **Data delay** | STR data lags 24-48 hours behind real-time |
| **No display/video data** | STR is available for Search, Shopping, and Performance Max campaigns only |
| **Close variants not labeled** | The report does not flag whether a match was a close variant, synonym, or exact match of the keyword |
| **Cross-campaign blind spot** | "Added" status only checks the triggering ad group, not the full account |
| **Historical data** | Available for up to the last 2 years, depending on account age |
| **PMax API differs** | PMax search term data requires `campaign_search_term_view` instead of `search_term_view` |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Reviewing only short date ranges | Small sample sizes lead to false conclusions about search term quality | Use 30-90 day ranges for pattern analysis |
| Ignoring hidden search terms | Unreported queries can represent 20-40% of spend in some accounts | Monitor the gap between total campaign clicks and STR-reported clicks |
| Filtering only by conversions | Misses high-CTR terms that may convert with landing page changes | Review CTR, cost, and relevance alongside conversions |
| Checking STR at account level only | Misses ad group-level mismatch patterns | Filter by campaign and ad group for granular analysis |
| Assuming "Added" means fully optimized | A search term can be "Added" as a broad match keyword but still warrant an exact match addition | Check which keyword and match type triggered the impression |
| Exporting without all columns | Incomplete data makes downstream analysis (ngram, pivot) unreliable | Verify all performance and conversion columns are included before export |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Execution steps for analyzing search terms: irrelevant term identification and promotion candidates |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Execution steps for performance-based negation through aggregated N-gram data |
| [N-gram Analysis Reference](../references/N-gram Analysis Reference.md) | N-gram extraction, classification, and exclusion model |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Framework for how search terms flow through campaign structure |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Context for how match types and search terms interact in modern Google Ads |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Negative keyword types, lists, and scope levels |
| [Match Type Reference](../references/Match Type Reference.md) | Match type definitions, behaviors, and close variant rules |

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
