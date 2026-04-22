# Auction Insights Reference
Created: 2026-02-11

Agent_Readable: Yes
Category: Reporting
Human_Facing: Yes
Reference Type: Cheat Sheets
Status: Done
Support_ID: CHEATSHEET_45
Domain: Reporting
Pillar: 0

## Purpose

Documents the Auction Insights report metrics, access methods, interpretation rules, and limitations for competitive analysis in Google Ads.

---

## What this reference is / What this is NOT

**This reference:**

- Documents all Auction Insights metrics and their definitions
- Explains how to access and interpret competitive data
- Provides interpretation rules for each metric
- Covers availability by campaign type

**This reference does NOT:**

- Provide competitive strategy (See: [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md))
- Define bidding responses to competitive changes (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Cover Google Merchant Center competitive reports (separate from Auction Insights)

---

## Quick reference table

> ↪️ **Monitoring context:** Auction insights are a Layer 2️⃣/Layer 3️⃣ monitoring input. Use them to investigate competitive causes of performance changes (Layer 2️⃣) and track competitive position against business goals (Layer 3️⃣). See: [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md).

| **Metric** | **Definition** | **Available for** | **Range** |
|------------|----------------|-------------------|-----------|
| **Impression share (IS)** | % of impressions you received vs. total eligible | Search, Shopping | 0-100% |
| **Overlap rate** | % of times competitor's ad appeared when yours did | Search, Shopping | 0-100% |
| **Position above rate** | % of times competitor's ad was shown above yours | Search only | 0-100% |
| **Top of page rate** | % of your impressions shown at the top of the page | Search only | 0-100% |
| **Abs. top of page rate** | % of your impressions shown as the very first ad | Search only | 0-100% |
| **Outranking share** | % of times your ad ranked higher or showed when theirs didn't | Search, Shopping | 0-100% |

> 💡 Auction Insights is available for Search and Shopping campaigns only. Display, Video, Demand Gen, and App campaigns do not have Auction Insights.

---

## Metric details

### Impression share (IS)

**What it shows:** The percentage of impressions you received out of the total number of impressions you were eligible to receive.

**How to read it:**
- Your own IS row shows your competitive position
- Competitor IS shows their share of the same auctions
- IS values do not sum to 100% because multiple ads show per auction

**Thresholds:**

| IS level | Interpretation |
|----------|---------------|
| 80%+ | Strong position, capturing most eligible traffic |
| 40-80% | Moderate position, room to grow |
| <40% | Significant missed opportunity |

> ⚠️ **IS changes when targeting changes:** When you change targeting (e.g., exact match to broad match, or expand location targeting), your eligible auction pool changes. IS may drop because the market got bigger, not because you are less competitive. Always check whether targeting changes explain IS movements before investigating other causes.

### Overlap rate

**What it shows:** How often another participant's ad received an impression in the same auction as your ad.

**How to read it:**
- High overlap (50%+) = direct competitor in same auctions
- Low overlap (<30%) = different targeting or limited budget
- Increasing overlap = competitor expanding into your space

### Position above rate

**What it shows:** How often the other participant's ad was shown in a higher position than yours, when both ads were shown at the same time. Search only.

**How to read it:**
- Above 50% = competitor consistently outranks you
- Below 50% = you consistently outrank them
- Rapid change = competitor adjusted bids or improved Quality Score

### Top of page rate

**What it shows:** How often your ad (or the ad of another participant) was shown at the top of the page. Top ads are generally above the top organic results, although top ads may show below the top organic results on certain queries. Placement is dynamic and may change based on the user's search.

**How to read it:**
- Reflects ad rank competitiveness
- Low top of page rate with high IS = your ads show but in lower positions
- Compare your rate vs. competitors to gauge relative positioning

### Absolute top of page rate

**What it shows:** How often your ad was shown as the very first ad above the organic search results.

**How to read it:**
- The premium position, most valuable for brand terms
- Typically lower than top of page rate
- High abs. top rate = strong bid + Quality Score combination

### Outranking share

**What it shows:** How often your ad ranked higher in the auction than another participant's ad, or your ad showed when theirs did not.

**How to read it:**
- Above 50% = you outrank this competitor more often than not
- The most comprehensive competitive metric: combines position and showing frequency
- Declining outranking share = competitive pressure increasing

---

## Accessing Auction Insights

### From the Google Ads interface

1. Navigate to Campaigns, Ad groups, or Keywords
2. Select the entities you want to analyze
3. Click the three-dot menu
4. Select "Auction insights"

### Available segmentation levels

| **Level** | **What it shows** |
|-----------|-------------------|
| Campaign | Competitors across all keywords in a campaign |
| Ad group | Competitors for a specific ad group's targeting |
| Keyword | Competitors for a specific keyword (most granular) |

### Time range options

- Supports standard Google Ads date ranges
- Segment by day, week, month, or quarter
- Use time segmentation to identify when competitive shifts occurred

---

## Interpretation rules

### What Auction Insights can tell you

| **Signal** | **Interpretation** | **Possible action** |
|------------|-------------------|---------------------|
| New competitor appearing | Someone entered your market or expanded targeting | Monitor impact on your KPIs |
| Competitor IS increasing | They're spending more or improving Quality Score | Evaluate if your KPIs are affected before reacting |
| Your outranking share declining | Competitive pressure on bids or QS | Check if CPA/ROAS is still on target |
| High overlap, low position above | Competitor consistently beside you but not above | Likely similar bid/QS profiles |
| Competitor disappeared | Paused campaigns, ran out of budget, or changed strategy | Expect possible cost decreases |

### What Auction Insights cannot tell you

| **Limitation** | **Why** |
|----------------|---------|
| Competitor spend | Google does not reveal competitor budgets |
| Competitor bid amounts | Only relative positioning is shown |
| Competitor Quality Score | Not disclosed, only implied by position data |
| Why a competitor changed | Could be strategy, budget, seasonal, or accidental |
| Non-overlapping competitors | Only shows competitors in auctions you participated in |
| Performance Max competitors | AI does not show competitor breakdown in PMax |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Reacting to one week of data | Competitive changes may be temporary | Compare 4+ weeks before strategic changes |
| Assuming IS = market share | IS only covers auctions you were eligible for | Use with search volume data for true market sizing |
| Ignoring segment level | Campaign-level data masks keyword-level competition | Check keyword-level for precise competitive picture |
| Chasing competitor position | Higher position does not always mean better ROI | Focus on your own CPA/ROAS targets, not position |
| Missing Shopping insights | Forgetting to check Shopping alongside Search | Run Auction Insights for both campaign types |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md) | Framework: auction insights as Layer 2️⃣/Layer 3️⃣ monitoring input |
| [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md) | Execution: competitive analysis procedure |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference: impression share and competitive metrics |
| [Monthly Performance Review Checklist](../checklists/Monthly Performance Review Checklist.md) | Validation: monthly competitive review |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Foundation: diagnostic report type |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v2.0: Updated IS thresholds (40%/80%), added targeting callout, updated top-of-page description, added Account Monitoring cross-reference, sentence case headings

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
