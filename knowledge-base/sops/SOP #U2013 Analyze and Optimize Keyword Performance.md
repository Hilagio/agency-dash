# SOP – Analyze and Optimize Keyword Performance
Created: 2026-02-14

SOP_ID: SOP_76
Status: Done
Category: Search
Primary Outcome: Prioritized action list per keyword group based on Decision Matrix analysis
Agent_Executable: No
Human_Approval_Required: No
Domain: Search
Pillar: 7

### Purpose

This SOP provides a structured process for analyzing keyword performance using the Decision Matrix framework. It segments every keyword with sufficient data into one of four quadrants and assigns specific next steps per quadrant.

> ❓ **The core question:** For every keyword in this campaign, what is the correct next action: scale, fix, expand, or pause?

### What this SOP is NOT

This SOP does **not:**

- Explain the conceptual framework behind the Decision Matrix (See: [Keyword Performance Analysis Mental Model](../mental-models/Keyword Performance Analysis Mental Model.md))
- Execute Quality Score improvements (See: [Improve Quality Score](../playbooks/Improve Quality Score.md))
- Analyze search term reports (See: [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md))
- Manage negative keywords (See: [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) for performance-based negation, or [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) for irrelevant term identification)

### When to run this SOP

| Campaign stage | Frequency | Rationale |
| --- | --- | --- |
| First 60 days | Monthly | Accumulating data, too early for aggressive changes |
| Established (60-180 days) | Monthly | Enough data to act, performance patterns emerging |
| Mature (180+ days) | Monthly or bi-monthly | Incremental refinement, monitor for drift |

Run immediately when campaign CPA/ROAS deviates 30%+ from target for two consecutive weeks, or post-restructure evaluation is needed.

---

### Before you start

**Required inputs:**

- Google Ads account with at least 30 days of keyword performance data
- Defined campaign-level target CPA or target ROAS
- Spreadsheet tool (Google Sheets, Excel) for analysis

**Reference documents (have open):**

| Document | Used for |
| --- | --- |
| [Keyword Performance Analysis Mental Model](../mental-models/Keyword Performance Analysis Mental Model.md) | Quadrant definitions, decision rules, threshold guidance |
| [Quality Score Reference](../references/Quality Score Reference.md) | QS component breakdown and diagnostic approach |

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Export and prepare** | Pull keyword data and establish baselines | Clean spreadsheet with all required metrics |
| **Phase 2️⃣: Apply Decision Matrix** | Classify every keyword into a quadrant | Keywords tagged Q1, Q2, Q3, or Q4 |
| **Phase 3️⃣: Execute per quadrant** | Take the right action for each group | Actions applied or routed to downstream SOPs |
| **Phase 4️⃣: Quality Score overlay** | Diagnose QS issues on flagged keywords | QS gaps routed to component-specific SOPs |
| **Phase 5️⃣: Close-variant analysis** | Identify variant divergence on top keywords | Variants promoted or negated |
| **Phase 6️⃣: Document and prioritize** | Create the final action list sorted by impact | Prioritized action list with timelines |

---

## Phase 1️⃣: Export and prepare

### 1.1 Export keyword performance data

1. Navigate to Google Ads > Keywords > Search keywords.
2. Set the date range to at least 30 days. For mature campaigns, use 60-90 days.
3. Include these columns: keyword, match type, Quality Score, impressions, clicks, CTR, cost, conversions, cost/conversion, conversion value, ROAS, impression share, IS lost (rank), IS lost (budget).

### 1.2 Filter to actionable keywords

1. Export to a spreadsheet.
2. Remove keywords with fewer than 100 clicks in the analysis period.

> ⚠️ **Do not act on keywords with fewer than 100 clicks:** Below this threshold, zero conversions are statistically meaningless. Mark as "Insufficient Data" and re-evaluate next cycle.

3. Sort remaining keywords by Cost (descending).

### 1.3 Establish campaign-level benchmarks

Calculate for each campaign (not account-level):

| Metric | Calculation |
| --- | --- |
| Campaign target CPA/ROAS | From bidding strategy or business target |
| Average conversion rate | Total conversions / Total clicks (campaign level) |
| Average CPA | Total cost / Total conversions (campaign level) |

---

## Phase 2️⃣: Apply Decision Matrix segmentation

Assign every keyword with 100+ clicks to one of four quadrants.

**CPA-based campaigns:**

| Quadrant | Criteria |
| --- | --- |
| **Q1: Protect and Scale** | Conversions > 0, CPA at or below campaign target |
| **Q2: Fix Relevance** | Conversions > 0, CPA above campaign target |
| **Q3: Increase Visibility** | Low impressions/clicks, CPA at or below target (or too little conversion data) |
| **Q4: Diagnose or Pause** | Zero conversions after 100+ clicks |

**ROAS-based campaigns:**

| Quadrant | Criteria |
| --- | --- |
| **Q1: Protect and Scale** | Conversions > 0, ROAS at or above campaign target |
| **Q2: Fix Relevance** | Conversions > 0, ROAS below campaign target |
| **Q3: Increase Visibility** | Low impressions/clicks, ROAS at or above target (or too little conversion data) |
| **Q4: Diagnose or Pause** | Zero conversions after significant spend (2x target CPA equivalent) |

Add a "Quadrant" column to your spreadsheet. Tag every keyword and count the distribution across Q1-Q4 plus "Insufficient data" by keyword count and spend percentage.

> 💡 **A healthy account concentrates spend in Q1:** If Q2 or Q4 consume more than 30% of total spend, that is your biggest optimization opportunity.

---

## Phase 3️⃣: Execute per quadrant

Work through quadrants in priority order: Q1 (protect winners), Q4 (stop the bleeding), Q2 (fix efficiency), Q3 (grow volume).

### 3.1 Q1: Protect and scale

1. If IS lost to budget > 10%, increase campaign budget or move to a higher-priority budget.
2. If running on phrase or broad, consider adding as exact match to protect against PMax query routing.
3. Monitor closely: run search term reviews on Q1 keywords monthly.

### 3.2 Q4: Diagnose or pause

For each Q4 keyword, run a four-point diagnosis:

1. Check QS: if < 5, keyword is likely triggering bad auctions.
2. Check search terms: are actual queries relevant to your offer?
3. Check landing page: does the LP align with the keyword's intent?
4. Check CTR: high CTR + zero conversions = post-click problem. Low CTR = pre-click problem.

| Diagnosis | Action |
| --- | --- |
| QS < 5, fixable gap | Route to [Improve Quality Score](../playbooks/Improve Quality Score.md), give 30 more days |
| Search terms irrelevant | Add negatives, tighten match type, give 30 more days |
| LP mismatch identified | Fix LP alignment, give 30 more days |
| No clear fix, fundamental intent mismatch | Pause the keyword |

### 3.3 Q2: Fix relevance

1. Check QS: if < 7, identify which component is below average.
2. Check landing page: does the page address keyword intent?
3. Check ad copy: is keyword-to-ad relevance strong?
4. Pull search term report: are irrelevant queries inflating cost?

| CPA deviation | Action |
| --- | --- |
| 1-1.5x target | Tighten ad copy, improve LP elements. Monitor 2 weeks |
| 1.5-2x target | Run QS diagnosis, review LP, check search terms. Monitor 30 days |
| 2x+ target | Fix and set a 30-day deadline. If still 2x+ after fixes, pause |

### 3.4 Q3: Increase visibility

1. If IS lost to budget is significant, increase budget or reallocate from paused Q4 keywords.
2. Consider broadening match type (exact to phrase, phrase to broad with Smart Bidding).
3. Verify the keyword is not being cannibalized by another campaign or PMax.
4. If IS lost to rank is significant and the campaign uses Manual CPC, increase keyword bids in 10-15% increments. On Smart Bidding campaigns, rank issues are addressed through Quality Score improvement, not manual bid changes: the algorithm controls bids and any campaign-level or ad group-level adjustment affects all keywords and their triggered search terms.

> ⚠️ **Scale gradually:** Pushing bids too aggressively can shift a Q3 keyword into Q2.

---

## Phase 4️⃣: Quality Score overlay

### 4.1 Flag QS issues

Filter to all keywords with QS < 7, regardless of quadrant.

### 4.2 Identify the weak component

| Component | If Below Average | Route to |
| --- | --- | --- |
| Expected CTR | Ad copy does not compete | [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) |
| Ad Relevance | Keyword-to-ad mismatch | [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) |
| Landing Page Experience | LP does not match intent | [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) |

### 4.3 Prioritize QS fixes by impact

1. Q1 keywords with QS < 7: reduces cost on your best converters.
2. Q2 keywords with QS < 7: may shift them to Q1 by improving efficiency.
3. Q4 keywords with QS < 5: worth attempting before pausing.

---

## Phase 5️⃣: Close-variant analysis

### 5.1 Select keywords for analysis

Focus on Q1 and Q2 keywords with meaningful volume. These are where variant divergence has the most financial impact.

### 5.2 Pull and compare variants

1. Pull the search term report filtered to each selected keyword.
2. Group terms: exact match of parent keyword vs. close variants.
3. Compare CTR, CVR, and CPA/ROAS between the two groups.

### 5.3 Act on divergence

| Finding | Action |
| --- | --- |
| Variant outperforms parent (better CPA, meaningful volume) | Add as its own exact match keyword |
| Variant underperforms parent (worse CPA, wasting spend) | Monitor and consider adding as a negative keyword if pattern persists |
| Variant captures more volume than parent | Evaluate as potential primary keyword |
| Multiple variants diverge significantly | Consider restructuring ad group around query clusters |

> ↪️ **For search term analysis procedures:** See [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md)

---

## Phase 6️⃣: Document and prioritize

### 6.1 Build the prioritized action list

Compile all actions from Phases 3-5 into a single list sorted by impact (cost x potential improvement):

| Priority | Keyword | Quadrant | Action | Expected impact | Deadline |
| --- | --- | --- | --- | --- | --- |
| 1 | [keyword] | Q4 | Pause (no fix path) | Stop $X/month waste | Immediate |
| 2 | [keyword] | Q1 | Increase bids (IS lost = 25%) | Capture more conversions | This week |
| 3 | [keyword] | Q2 | Fix LP alignment | Reduce CPA from $X to ~$Y | 30 days |

### 6.2 Carry forward items needing more data

| Keyword | Current status | Re-evaluate date |
| --- | --- | --- |
| [keyword] | 35 clicks, 0 conversions | Next cycle |
| [keyword] | Q2, fixes applied this cycle | [date + 30 days] |

### 6.3 Log the analysis cycle

Record in a running log: date, period analyzed, total keywords analyzed, count per quadrant, keywords paused, keywords escalated for QS fix, and key observations.

---

### Validation & definition of done

This SOP is complete when:

- [ ] Keyword data exported with all required columns
- [ ] Keywords with 100+ clicks segmented into Q1, Q2, Q3, or Q4
- [ ] Q1 actions applied: bids adjusted, impression share gaps addressed
- [ ] Q4 diagnoses completed: keywords fixed with deadline or paused
- [ ] Q2 fixes identified and routed to appropriate SOPs
- [ ] Q3 expansion actions taken where warranted
- [ ] QS overlay completed: QS < 7 keywords routed to component SOPs
- [ ] Close-variant analysis completed for top keywords
- [ ] Prioritized action list created and sorted by impact
- [ ] Carry-forward items documented with re-evaluation dates

---

### Exit → entry bridge

| Timeframe | Action |
| --- | --- |
| Immediately | Apply Q1 bid/budget changes and pause confirmed Q4 keywords |
| This week | Route Q2 keywords to [Improve Quality Score](../playbooks/Improve Quality Score.md) or component SOPs |
| This week | Route variant negatives to [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) or add irrelevant terms via [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| 2 weeks | Review Q3 bid increases: did volume increase without losing efficiency? |
| 30 days | Re-evaluate Q2 keywords: did fixes move them to Q1? |
| Next cycle | Re-run this SOP. Keywords shift quadrants over time |

---

### Related documents

| Document | Type | Relationship |
| --- | --- | --- |
| [Keyword Performance Analysis Mental Model](../mental-models/Keyword Performance Analysis Mental Model.md) | Mental Model | Upstream: conceptual framework this SOP executes |
| [Quality Score Reference](../references/Quality Score Reference.md) | Reference | QS components, thresholds, interpretation (Phase 4) |
| [Improve Quality Score](../playbooks/Improve Quality Score.md) | Playbook | Downstream: routes QS improvement for Q2/Q4 keywords |
| [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) | SOP | Downstream: fixes Expected CTR component |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | SOP | Downstream: fixes Ad Relevance component |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | SOP | Downstream: fixes Landing Page Experience component |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | SOP | Parallel: search term analysis for Q2/Q4 diagnosis |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | SOP | Downstream: performance-based negative keyword additions from variant analysis |

---

### Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
