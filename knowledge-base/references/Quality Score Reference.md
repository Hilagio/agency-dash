# Quality Score Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_32
Status: Done
Category: Performance
Domain: Search
Human_Facing: Yes
Pillar: 6
Reference Type: Cheat Sheets
Agent_Readable: Yes

## Purpose

Documents how Quality Score works as a diagnostic tool: its three components, the Ad Rank formula, scoring mechanics, update frequencies, and what QS does and does not influence. Use this reference to understand the system before routing to the correct fix.

---

## What this reference is / What this is NOT

**This reference:**

- Explains how Quality Score is calculated and what each component measures
- Documents the Ad Rank formula and how quality feeds into it
- Clarifies the difference between the visible QS number and auction-time quality signals
- Covers QS update frequencies, impression-weighted calculation, and status values

**This reference does NOT:**

- Tell you how to improve Quality Score (See: [Improve Quality Score](../playbooks/Improve Quality Score.md))
- Provide steps to fix Ad Relevance (See: [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md))
- Provide steps to fix Expected CTR (See: [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md))
- Provide steps to fix Landing Page Experience (See: [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md))
- Execute any optimization actions: this is a mechanics reference, not an execution document

---

## Quick reference: Quality Score components

| Component | What it measures | Status values | Update frequency | Primary lever |
|-----------|-----------------|---------------|------------------|---------------|
| **Expected CTR** | How likely your ad will be clicked relative to competitors | Above Average, Average, Below Average | Every auction (real-time) | Ad copy strength, offer, differentiation |
| **Ad Relevance** | How closely your ad matches the intent behind a search | Above Average, Average, Below Average | Periodic (days to weeks) | Ad group structure, keyword-to-ad alignment |
| **Landing Page Experience** | How relevant and useful your landing page is to visitors | Above Average, Average, Below Average | Periodic (weeks) | Message match, page speed, mobile UX, trust |

> 💡 **Quality Score is a symptom, not a root cause:** You do not "optimize QS" directly. You fix the underlying components, and QS improves as a result.

---

## Quality Score scale and calculation

### The 1-10 scale

Quality Score is reported as a number from 1 to 10 at the keyword level. It is a composite of the three component ratings:

| QS range | Interpretation |
|----------|----------------|
| 8-10 | Strong: all components likely Above Average or Average |
| 7 | Acceptable: foundation is solid, may have one Average component |
| 5-6 | Needs attention: one or more components Below Average |
| 1-4 | Critical: multiple components Below Average, ad may rarely show |

### Impression-weighted calculation

QS is not a simple average across keywords. Keywords with more impressions carry more weight in account-level QS diagnostics.

**Prioritization formula (from the Improve Quality Score playbook):**

`Priority Score = (10 - Quality Score) x Impressions`

Sort descending. The highest-priority keyword is the one with the worst QS and the most impressions: fixing it yields the largest impact.

### Exact-match basis

Google calculates QS based on exact-match impressions only. If your broad match keyword triggers a search query, Google evaluates how well you perform on the exact match version of that query, regardless of your actual match type setting.

This means:

- A broad match keyword's QS reflects performance on its literal text as an exact match
- A keyword with few exact-match impressions may show "Not enough data" for QS
- Match type changes alone do not improve QS

---

## Quality Score components: detailed breakdown

### Expected CTR

| Attribute | Detail |
|-----------|--------|
| **What it measures** | The likelihood that your ad will be clicked when shown for that keyword, relative to other ads in the same position |
| **How it's calculated** | Based on historical CTR performance, normalized for ad position (removes the advantage of higher positions) |
| **Update frequency** | Real-time: recalculated with each auction |
| **Key inputs** | Historical CTR, ad copy quality, offer strength, competitive landscape |
| **What improves it** | Stronger headlines, clearer value propositions, better use of ad extensions, differentiated messaging |
| **What does NOT improve it** | Higher bids (position is normalized out), adding more keywords, changing match types |

### Ad Relevance

| Attribute | Detail |
|-----------|--------|
| **What it measures** | How closely the content of your ad matches the intent behind the user's search query |
| **How it's calculated** | Semantic analysis of keyword-to-ad alignment within the ad group |
| **Update frequency** | Periodic: updates over days to weeks as Google re-evaluates your ad content |
| **Key inputs** | Keyword-ad alignment, ad group theme tightness, RSA headline/description relevance to search terms |
| **What improves it** | Tighter ad group structure, keyword themes reflected in ad copy, intent-matched creative |
| **What does NOT improve it** | Higher bids, adding more headlines without theme alignment, running more ads per ad group |

> 💡 **Ad group structure drives Ad Relevance:** When a single ad group contains keywords with different intents, the ad cannot be relevant to all of them. This is a structural problem, not a creative problem. (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))

### Landing Page Experience

| Attribute | Detail |
|-----------|--------|
| **What it measures** | How relevant, transparent, and easy to navigate your landing page is for users who click your ad |
| **How it's calculated** | Combination of automated page evaluation and user behavior signals (bounce rate, time on site, conversion rate) |
| **Update frequency** | Slow: updates over weeks as Google crawls and evaluates page changes |
| **Key inputs** | Message match (ad promise to page content), page load speed, mobile-friendliness, trust signals, navigation clarity |
| **What improves it** | Matching landing page headline/content to ad promise, improving page speed, adding trust elements, fixing mobile UX |
| **What does NOT improve it** | Ad copy changes (those affect Expected CTR and Ad Relevance), bid changes, keyword changes |

---

## The Ad Rank formula

### Formula

```
Ad Rank = Bid x Quality x Expected Impact of Extensions + Ad Rank Thresholds
```

Where **Quality** is the real-time evaluation of:

```
Quality = Expected CTR x Ad Relevance x Landing Page Experience
```

### Key distinctions

| Concept | Visible QS (1-10) | Auction-time quality |
|---------|-------------------|---------------------|
| **When calculated** | Periodically, as a snapshot | Every auction, in real time |
| **Used in auction** | No | Yes |
| **Granularity** | Keyword level | Query level, user level, context level |
| **Purpose** | Diagnostic tool for advertisers | Actual Ad Rank input |
| **Signals used** | Subset (3 components) | Full signal set (device, location, time of day, audience, query, and more) |

> ⚠️ **The visible QS number is NOT used in the auction:** Google calculates real-time quality signals for every auction independently. The 1-10 QS you see in the Google Ads UI is a simplified, lagging diagnostic. Improving the visible QS from 7 to 8 does not directly lower your CPC: what lowers CPC is improving the underlying signals that both the visible QS and auction-time quality reflect.

### Ad Rank thresholds

Google enforces minimum Ad Rank thresholds that your ad must exceed to be eligible to show. These thresholds vary by:

- Query competitiveness
- User context (device, location)
- Ad position (top-of-page thresholds are higher than other positions)

If your Ad Rank falls below the threshold, your ad does not enter the auction at all, regardless of your bid.

---

## What Quality Score affects

| Area | How QS influences it |
|------|---------------------|
| **Ad eligibility** | Low quality can push Ad Rank below thresholds, preventing your ad from showing |
| **Actual CPC** | You pay just enough to beat the next advertiser's Ad Rank. Higher quality = lower CPC at the same position |
| **Ad position** | Higher quality = higher position at the same bid, or same position at a lower bid |
| **Ad extensions eligibility** | Extensions only show when your Ad Rank is high enough: quality contributes to clearing that threshold |
| **Top-of-page eligibility** | Top positions require higher Ad Rank thresholds: quality helps you clear them without raising bids |

## What Quality Score does NOT affect

| Area | Why QS is irrelevant |
|------|---------------------|
| **Smart bidding targets** | tCPA and tROAS are efficiency targets set independently: smart bidding adjusts bids around them regardless of QS |
| **Conversion rates** | QS measures pre-click quality: conversion rate is a post-click metric driven by landing page, offer, and audience fit |
| **Conversion value** | Value is determined by your product/service pricing and customer behavior, not ad quality |
| **Budget allocation** | Budgets are set at campaign level and are not influenced by QS |
| **Impression share (budget)** | Lost IS due to budget is a budget problem, not a quality problem |

---

## How to view Quality Score in Google Ads

### Enabling QS columns

1. Navigate to **Keywords** tab in your campaign or ad group
2. Click **Columns** > **Modify columns**
3. Under **Quality Score**, add these columns:

| Column | What it shows |
|--------|--------------|
| **Quality Score** | Current 1-10 composite score |
| **Expected CTR** | Component status (Above Average, Average, Below Average) |
| **Ad Relevance** | Component status |
| **Landing Page Exp.** | Component status |
| **Quality Score (hist.)** | Historical QS snapshots for trend analysis |
| **Expected CTR (hist.)** | Historical component status |
| **Ad Relevance (hist.)** | Historical component status |
| **Landing Page Exp. (hist.)** | Historical component status |

### QS status values and interpretation

| Status | Meaning | Action required |
|--------|---------|-----------------|
| **Above Average** | Performing better than most competitors for this keyword | None: maintain current approach |
| **Average** | In line with competitor performance | Monitor: improvement possible but not urgent |
| **Below Average** | Underperforming relative to competitors | Fix required: route to the relevant SOP |
| **"--" (null)** | Not enough impression data to calculate | Accumulate more impressions or check if keyword is active |

---

## Decision guide: which component to fix first

```
Ad Relevance = Below Average?
|
+-- YES --> Fix Ad Relevance first (structural foundation)
|           Route to: SOP - Improve Ad Relevance
|
+-- NO --> Expected CTR = Below Average?
            |
            +-- YES --> Fix Expected CTR (competitiveness layer)
            |           Route to: SOP - Improve Expected CTR
            |
            +-- NO --> Landing Page Experience = Below Average?
                        |
                        +-- YES --> Fix LP Experience (conversion layer)
                        |           Route to: SOP - Improve Landing Page Experience
                        |
                        +-- NO --> All components Average or Above Average
                                   QS constraint resolved
                                   Route to: Iteration Loop for ongoing optimization
```

The sequence is fixed: Ad Relevance before Expected CTR before Landing Page Experience. Fixing upstream components often resolves downstream ones (for example, tighter ad group structure improves both Ad Relevance and Expected CTR).

> ↪️ **Full routing logic:** See [Improve Quality Score](../playbooks/Improve Quality Score.md) for the complete decision playbook.

---

## QS trend interpretation

Historical QS data enables period-over-period analysis to detect improving, stable, or declining quality.
### How to read QS trends

QS is a relative metric: it compares your performance against competitors in the same auctions. A QS change can mean your quality changed, your competitors' quality changed, or both.

| Trend Pattern | Definition | Likely Cause | Action |
|---------------|-----------|-------------|--------|
| **Stable (no change)** | QS unchanged for 3+ reporting periods | Quality and competitive landscape are steady | Monitor, no intervention needed |
| **Gradually declining** | QS dropped by 1 point averaged over 3+ periods | Competitors improving, or your quality slowly degrading | Investigate which component is driving the decline |
| **Sharply declining** | QS dropped by 2+ points in a single period | Major competitive entry, landing page issue, or ad copy deterioration | Urgent: check components, cross-reference with Auction Insights |
| **Improving** | QS increased by 1+ point over 2+ periods | Your optimization efforts are working | Continue current approach, shift to next priority keyword |
| **Oscillating** | QS fluctuates up and down across periods | Low impression volume causing noisy signals, or frequent ad rotation changes | Check impression volume: if <1,000 impressions/month, QS data is unreliable |

### Distinguishing signal from noise

| Condition | Reliable? | Why |
|-----------|----------|-----|
| Keyword has >1,000 impressions/month | Yes | Sufficient data for stable QS calculation |
| Keyword has 100-1,000 impressions/month | Somewhat | QS may lag or fluctuate: confirm trends over 3+ periods |
| Keyword has <100 impressions/month | No | QS is essentially random at this volume: do not make decisions based on it |
| QS change coincides with ad copy change | Yes (for Expected CTR, Ad Relevance) | Likely caused by your change: evaluate whether to keep or revert |
| QS change coincides with LP change | Yes (for LP Experience, after 2-4 week lag) | LP Experience updates slowly: wait 3-4 weeks before concluding |
| QS change with no changes on your side | Investigate | Likely competitive: check Auction Insights for new entrants or competitor improvements |

### Reporting QS trends

When tracking QS over time, use impression-weighted averages to prevent low-volume keywords from distorting the picture:

```
Impression-Weighted QS = SUM(QS x Impressions) / SUM(Impressions)
```

Calculate per reporting period (weekly or biweekly) and plot the trend. A sustained decline of 0.5+ points over 4+ periods is actionable.

---

## Competitive context and Quality Score

QS does not exist in a vacuum. It is a relative measure against competitors in the same auctions.
### QS and Auction Insights correlation

When QS declines coincide with competitive changes, the root cause is external, not internal:

| Auction Insights Signal | QS Impact | Mechanism |
|------------------------|-----------|-----------|
| New competitor enters (IS >15%) | Expected CTR may decline | New competitor's ad copy may be more compelling, shifting relative CTR benchmarks |
| Core competitor increases IS by >10pp | QS may decline 1-2 points | Competitor improved their quality, raising the bar for "Average" and "Above Average" |
| Competitor exits or reduces IS | QS may improve | Reduced competition lowers the quality bar |
| Average position of competitors rises | Expected CTR may decline | Higher-positioned competitors capture more clicks, reducing your relative CTR |

### How to investigate QS-competitive interactions

1. Pull QS trend data (historical QS columns) for the affected keyword period
2. Pull Auction Insights for the same period at the keyword or ad group level
3. Look for timing correlation: did QS decline when a new competitor appeared or an existing one gained IS?
4. If correlated: the fix is competitive (improve ad copy, LP, or increase bids) rather than structural
5. If not correlated: the fix is internal (check for LP changes, ad copy degradation, or structural issues)

### CPC impact of low QS

Low QS directly increases CPC because you must bid higher to achieve the same Ad Rank. The cost premium is significant:

| QS | Approximate CPC Multiplier (vs. QS 7 baseline) |
|----|----------------------------------------------|
| 10 | 0.5x (50% discount) |
| 9 | 0.6x |
| 8 | 0.7x |
| 7 | 1.0x (baseline) |
| 6 | 1.3x |
| 5 | 1.6x |
| 4 | 2.0x |
| 3 | 2.5x |
| 2 | 3.5x |
| 1 | 5.0x+ |

> ⚠️ **These multipliers are approximations** based on the Ad Rank formula mechanics. Actual CPC depends on auction dynamics, but the directional impact is consistent: every QS point below 7 costs you materially more per click.

### Seasonal QS patterns

Some QS fluctuations are seasonal and expected:

| Season | Typical QS Effect | Cause |
|--------|------------------|-------|
| Holiday/Black Friday | QS may decline 1-2 points temporarily | More competitors enter the auction, raising quality benchmarks |
| January (post-holiday) | QS often recovers | Seasonal competitors exit, lowering the bar |
| Industry-specific peaks | QS pressure during peak demand periods | Same mechanism as holidays but industry-specific |
| Summer slowdowns | QS may improve slightly | Less competition in some verticals |

Do not react to seasonal QS dips with structural changes. Wait 2-4 weeks post-season to see if QS recovers before intervening.

---

## Common mistakes

| Mistake | Problem | Correct approach |
|---------|---------|-----------------|
| Confusing visible QS with auction-time quality | Optimizing a lagging diagnostic number instead of actual auction signals | Focus on the three component statuses, not the composite number |
| Chasing QS 10 instead of fixing root causes | Wasting effort on marginal gains when components are already Average or Above | Stop optimizing QS once all components are Average or Above: diminishing returns beyond that point |
| Ignoring component breakdown | Looking only at the 1-10 number without diagnosing which component is weak | Always check Expected CTR, Ad Relevance, and LP Experience individually |
| Raising bids to compensate for low QS | Paying more per click without fixing the underlying quality problem | Fix quality first, then evaluate bid levels |
| Treating QS as a goal instead of a diagnostic | Optimizing for the metric rather than business outcomes (CPA, ROAS) | QS enables lower CPCs and better Ad Rank: those are the real goals |
| Expecting instant QS changes | Making fixes and checking QS the next day | Component updates take 7-30 days depending on the component |
| Working on multiple QS components at once | Cannot isolate what worked, wastes effort if upstream fix resolves downstream issue | Fix one component at a time in the prescribed sequence |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Improve Quality Score](../playbooks/Improve Quality Score.md) | Routes to the correct fix based on which QS component is Below Average |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | Execution procedure for fixing Ad Relevance component |
| [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) | Execution procedure for fixing Expected CTR component |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | Execution procedure for fixing Landing Page Experience component |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Explains how campaign structure impacts targeting |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Explains how ad group structure directly impacts Ad Relevance |
| [Diagnostic Thresholds Reference](../references/Diagnostic Thresholds Reference.md) | Numeric thresholds for QS-related diagnostic checks |
| [Auction Insights Reference](../references/Auction Insights Reference.md) | Competitive data used in QS-competitive context analysis |

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

(c) 2026 PPC Mastery B.V. All rights reserved.
