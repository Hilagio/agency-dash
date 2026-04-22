# SOP – Analyze Auction Insights
Created: 2026-02-11

Agent_Executable: No
Category: Reporting
Human_Approval_Required: No
Primary Outcome: Competitive landscape assessment with documented trends and action items
SOP_ID: SOP_63
Secondary Outcomes: Competitor movements identified, bid/budget responses evaluated
Status: Done
Domain: Reporting
Pillar: 0

## Purpose

This SOP guides you through a structured competitive analysis using the Auction Insights report, turning raw competitive data into actionable intelligence.

> ❓ **The big question:** How is the competitive landscape changing, and does it require a response?

Auction Insights data is useful for context, not for reaction. Most competitive movements do not require a response if your own KPIs remain on target.

---

## What this SOP is NOT

This SOP does **not:**

- Document Auction Insights metrics and mechanics (See: [Auction Insights Reference](../references/Auction Insights Reference.md))
- Define bidding strategy changes (those require separate testing decisions)
- Cover Google Merchant Center competitive reports (separate data source)

## When to run this SOP

Run this SOP:

- Monthly as part of the monthly performance review
- When impression share drops significantly without budget or bid changes
- When CPCs increase without internal account changes
- When a stakeholder asks about competitive positioning

---

## Before you start

### Required inputs

- Google Ads account access
- 90 days of account data minimum
- Knowledge of top 3-5 competitors in your market

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Auction Insights Reference](../references/Auction Insights Reference.md) | Metric definitions and interpretation |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Impression share definitions |
| Previous month's Auction Insights analysis (if available) | Trend comparison |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Data pull** | Extract Auction Insights data at the right level | Exported data set |
| **Phase 2️⃣: Competitor identification** | Identify key competitors and new entrants | Competitor list with classification |
| **Phase 3️⃣: Trend analysis** | Assess directional movements over time | Trend assessment per competitor |
| **Phase 4️⃣: Impact assessment** | Determine if competitive changes affect your KPIs | Impact classification and response |

---

## Phase 1️⃣: Data Pull (5 min)

### 1.1 Select analysis scope

| Scope | When to use |
|-------|-------------|
| Campaign level | Monthly overview of competitive landscape |
| Ad group level | Investigating competition on specific themes |
| Keyword level | Diagnosing CPC increases or IS drops on specific terms |

### 1.2 Pull Auction Insights data

1. Navigate to Campaigns (or Ad Groups, or Keywords)
2. Select the entities to analyze
3. Click three-dot menu > "Auction insights"
4. Set date range to last 3 months
5. Add a time segment to see trends. Available segments depend on your selected date range:

| Segment | Best for | Minimum date range |
|---------|----------|--------------------|
| Day | Specific day analysis | Any |
| Week | Weekly trend within quarter | >7 days |
| Month | Monthly comparison (most common) | >30 days |
| Quarter | Quarterly competitive shifts | >90 days |
| Year | Year-over-year comparison | Multi-year |
| Day of the week | Weekday competitive patterns | >7 days |

6. Download the data for analysis

### 1.3 Pull comparison data

1. Set date range to current month
2. Add comparison: same month prior year (if available) or prior quarter
3. Note your own IS, top of page rate, and abs. top of page rate

---

## Phase 2️⃣: Competitor Identification (5 min)

### 2.1 Classify competitors

For each competitor that appears in Auction Insights, classify:

| Competitor | IS | Overlap rate | Classification | Trend |
|------------|-----|-------------|----------------|-------|
| [Name] | ___% | ___% | Core / Peripheral / New | Stable / Growing / Declining |

**Classification rules:**

| Classification | Criteria |
|---------------|----------|
| **Core** | IS > 30% AND overlap rate > 50% |
| **Peripheral** | IS < 30% OR overlap rate < 50% |
| **New** | Not present in prior month's data |
| **Disappeared** | Present last month, absent this month |

### 2.2 Note new entrants and exits

- New competitors entering your auctions may increase CPCs
- Competitors exiting may decrease CPCs and increase your IS
- Document both for monthly review context

---

## Phase 3️⃣: Trend Analysis (10 min)

### 3.1 Track impression share trends

For each core competitor, chart IS over the last 3 months:

| Competitor | Month 1 IS | Month 2 IS | Month 3 IS | Direction |
|------------|-----------|-----------|-----------|-----------|
| Your account | ___% | ___% | ___% | ↑ / → / ↓ |
| [Competitor 1] | ___% | ___% | ___% | ↑ / → / ↓ |
| [Competitor 2] | ___% | ___% | ___% | ↑ / → / ↓ |
| [Competitor 3] | ___% | ___% | ___% | ↑ / → / ↓ |

### 3.2 Track position trends

For Search campaigns, track outranking share and position above rate:

| Competitor | Current outranking share | vs. Prior month | Trend |
|------------|------------------------|-----------------|-------|
| [Competitor 1] | ___% | ___pp change | ↑ / → / ↓ |
| [Competitor 2] | ___% | ___pp change | ↑ / → / ↓ |

### 3.3 Identify significant movements

Flag any competitor showing:
- IS change > ±10 percentage points month-over-month
- Outranking share change > ±15 percentage points
- New competitor with IS > 20% immediately

---

## Phase 4️⃣: Impact Assessment (10 min)

### 4.1 Correlate competitive changes with your KPIs

The critical question is not "what are competitors doing?" but "is it affecting my performance?"

| Your metric | Current | vs. Prior month | Competitive correlation |
|------------|---------|-----------------|----------------------|
| Lost IS (Rank) | ___% | ___pp change | Are you losing auctions due to Ad Rank? |
| Impression share | ___% | ___pp change | Is IS loss from budget or rank? |
| Impressions | ___ | ___% change | Is traffic volume declining from IS loss? |
| Conversions | ___ | ___% change | Is volume loss from impression loss? |
| Conv. value (Revenue/Gross Profit) | ___ | ___% change | Is revenue declining from conversion loss? |
| CPA | ___ | ___% change | Is CPC increase driving CPA up? |
| ROAS | ___ | ___% change | Is efficiency declining from competitive pressure? |

> ↪️ **Trace upstream:** Use the [Metric Tree Reference](../references/Metric Tree Reference.md) to trace from goal metrics (ROAS, CPA) upstream through the tree to identify where competitive pressure is entering.

### 4.2 Determine response

| Situation | Response |
|-----------|----------|
| Competitor IS increasing but your KPIs are on target | Monitor, no action needed |
| Competitor IS increasing and your CPA is rising | Investigate: is CPC increase from competition driving CPA? |
| New competitor and your IS dropped | Check if Lost IS is budget or rank driven |
| Competitor disappeared and your CPC dropped | Opportunity: consider expanding targeting or testing lower bids |
| Multiple competitors growing and your position declining | Strategic review: evaluate if position defense or efficiency focus |

> ⚠️ **Do not chase competitor positions:** If your CPA/ROAS targets are met, it does not matter that a competitor outranks you. Focus on your own business metrics, not competitive vanity.

### 4.3 Document findings

```
Auction Insights Analysis — [Month Year]
Account: [Name]

MY POSITION
- Impression Share: ___% (↑/→/↓ from prior month)
- Top of Page Rate: ___%
- Abs. Top of Page Rate: ___%

COMPETITOR MOVEMENTS
- [Competitor 1]: IS ___% (↑/→/↓), Outranking Share ___%
- [Competitor 2]: IS ___% (↑/→/↓), Outranking Share ___%
- New entrants: [None / names]
- Exits: [None / names]

IMPACT ON MY KPIS
- CPC impact: [None / description]
- IS impact: [None / description]
- CPA/ROAS impact: [None / description]

ACTION ITEMS
- [Action or "No action needed"]
```

---

## Validation & definition of done

This SOP is complete when:

- [ ] Auction Insights pulled at appropriate scope with 3-month window
- [ ] Core competitors identified and classified
- [ ] Trends documented for IS, outranking share, and position
- [ ] Impact on own KPIs assessed
- [ ] Response determined (action or monitor)
- [ ] Analysis documented

---

## Exit → Entry bridge

After auction insights analysis:

| Timeframe | Action |
|-----------|--------|
| Same review | Incorporate findings into monthly review |
| This month | Execute any action items identified |
| Next month | Compare next month's data to track trends |

**If competitive pressure requires strategic response:**

| Issue | Route to |
|-------|----------|
| IS loss from budget | Budget reallocation decision |
| IS loss from rank | Quality Score or bid investigation |
| New dominant competitor | Strategic review with stakeholders |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Auction Insights Reference](../references/Auction Insights Reference.md) | Reference | All phases |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference | Phase 4 |
| [Metric Tree Reference](../references/Metric Tree Reference.md) | Reference | Phase 4 (upstream impact tracing) |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) | Parent (auction insights is one section) |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Upstream (weekly review may trigger deeper analysis) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Reacting to one month of data | Competitive changes may be temporary | Require 2+ months of consistent trend before acting |
| Chasing competitor position | Higher position does not always mean better ROI | Focus on your CPA/ROAS, not your rank |
| Campaign-level only analysis | Misses keyword-level competition dynamics | Drill into keyword level for specific issues |
| Ignoring Shopping Auction Insights | Only analyzing Search competition | Check both Search and Shopping insights |
| No documentation | Analysis lost, same observations repeated monthly | Use the documentation template every time |

---

## Version details

- **Version:** 3.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v3.0: Expanded KPI correlation table with full metric chain (Lost IS through ROAS), added Metric Tree Reference callout. v2.0: Expanded time segment instruction with available segment types and recommended date ranges

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
