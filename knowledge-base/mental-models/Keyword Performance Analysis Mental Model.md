# Keyword Performance Analysis Mental Model
Created: 2026-02-14

Support_ID: MENTALMODEL_31
Status: Done
Category: Search
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Search
Pillar: 7

## Purpose

This mental model provides a structured framework for evaluating keyword performance and deciding what action to take on every keyword in your account. It answers the core question:

> ❓ **The core question:** Given this keyword's volume and efficiency data, what is the correct next action: scale, fix, expand, or pause?

Most advertisers look at keywords in isolation, reacting to surface metrics without a system. This model forces a four-quadrant classification that maps every keyword to a specific action path, connects each action to the right bucket in the constraint hierarchy, and establishes minimum data thresholds so you never make decisions on noise.

> ⚠️ **Smart Bidding context:** In accounts using Smart Bidding (Target CPA, Target ROAS, Maximize Conversions, Maximize Conversion Value), the algorithm handles most bid-level quadrant decisions automatically. The primary value of keyword-level analysis shifts to:
>
> 1. Ensuring the right keywords exist to capture target queries
> 2. Managing search term quality through negatives and match type choices
> 3. Identifying structural issues like intent mismatches or missing coverage
> 4. Promoting high-performing search terms as explicit keywords
>
> For day-to-day optimization, start with the search term report and N-gram analysis before drilling into individual keyword performance.

---

## What this is NOT

This mental model does **not:**

- Provide step-by-step keyword research procedures (See: [SOP – Research Keywords](../sops/SOP – Research Keywords.md))
- Explain how to analyze search term reports (See: [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md))
- Cover match type selection or syntax (See: [Match Type Reference](../references/Match Type Reference.md))
- Explain Quality Score improvement procedures (See: [SOP – Improve Quality Score](../sops/SOP – Improve Quality Score.md))
- Replace the Five Buckets diagnostic framework (See: [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md))

---

## The Keyword Decision Matrix

Every keyword in your account falls into one of four quadrants based on two axes: conversion volume (is this keyword generating results?) and cost efficiency (is it generating results profitably?).

| Quadrant | Volume | Efficiency | Action |
|----------|--------|------------|--------|
| **Q1: Protect and Scale** | High conversions | On-target CPA/ROAS | Protect position, increase bids/budget, expand impression share |
| **Q2: Fix Relevance** | High conversions | Poor CPA/ROAS | Fix Quality Score, landing page, or ad copy to improve efficiency |
| **Q3: Increase Visibility** | Low conversions | Good efficiency | Raise bids, broaden match type, increase impression share |
| **Q4: Diagnose or Pause** | No/very few conversions | High spend | Diagnose root cause (QS, intent mismatch, LP) or pause |

```
                    High Efficiency
                    (On-target CPA/ROAS)
                          │
        Q3: Increase      │      Q1: Protect
        Visibility        │      and Scale
                          │
   Low Volume ────────────┼──────────── High Volume
                          │
        Q4: Diagnose      │      Q2: Fix
        or Pause          │      Relevance
                          │
                    Low Efficiency
                    (Poor CPA/ROAS)
```

> 💡 **Always compare to campaign-level targets, not account averages:** A keyword with €40 CPA is excellent in a campaign targeting €50, but failing in a campaign targeting €25.

---

## Stage-by-stage breakdown

### Q1: Protect and scale

These are your best keywords: high conversion volume at acceptable efficiency. The goal is to maximize their output.

| Signal | What you see |
|--------|-------------|
| Conversions | Above campaign average, consistent month over month |
| CPA/ROAS | At or better than campaign target |
| Impression share | Room to grow (IS < 90%) |
| Quality Score | 7+ (not dragging up costs) |

**Actions:**

1. Check impression share: if IS lost to rank > 10%, increase bids or improve Quality Score
2. Check impression share: if IS lost to budget > 10%, increase campaign budget or isolate into a dedicated campaign
3. Consider adding the keyword as exact match if currently running on phrase/broad only (protects against query routing to PMax)
4. Monitor close variants for performance divergence (see Close-variant analysis below)
5. Use this keyword's search term report to find expansion opportunities

**Risk to watch:** Complacency. Q1 keywords still need regular search term review. Broad match can quietly shift the query mix beneath a stable CPA.

### Q2: Fix relevance

These keywords drive conversions but at unacceptable cost. The volume proves demand exists, so the fix is efficiency, not elimination.

| Signal | What you see |
|--------|-------------|
| Conversions | Meaningful volume (above minimum threshold) |
| CPA/ROAS | Worse than campaign target by 30%+ |
| Quality Score | Often below 7 (check components) |
| CTR | May be low (ad relevance issue) or high with poor CVR (LP issue) |

**Diagnosis path:**

| Check | If poor | Fix bucket |
|-------|---------|------------|
| Quality Score components | Expected CTR low | Creative: improve ad copy, test new angles |
| Quality Score components | Ad relevance low | Creative: tighten keyword-to-ad alignment |
| Quality Score components | Landing page experience low | Conversion: improve LP relevance and speed |
| Click-to-conversion rate | CVR below campaign average | Conversion: LP mismatch, offer issue, or wrong intent |
| Search term report | Irrelevant queries inflating cost | Traffic: add negatives, tighten match type |

**Actions:**

1. Run Quality Score component analysis to identify which factor drags
2. Review the search term report for this keyword: are queries matching intent?
3. Check landing page relevance: does the LP directly address the keyword's intent?
4. If QS < 5 and no clear fix path, consider pausing and redirecting budget to Q1 keywords

### Q3: Increase visibility

These keywords convert efficiently but produce insufficient volume. The unit economics work, so the goal is to get more of this traffic.

| Signal | What you see |
|--------|-------------|
| Conversions | Below potential (few but efficient) |
| CPA/ROAS | At or better than campaign target |
| Impression share | Low (IS < 50%) |
| Average position / Top IS | Not competing effectively in auctions |

**Actions:**

1. Check impression share lost to rank: raise bids in 10-15% increments
2. Check impression share lost to budget: increase campaign budget or reallocate from Q4 keywords
3. Consider broadening match type (exact to phrase, phrase to broad with smart bidding)
4. Test broader match via campaign experiment before committing
5. Look for related keyword variations to add (expand the theme)
6. Verify the keyword is not being cannibalized by another campaign or PMax

**Risk to watch:** Pushing bids too aggressively can shift a Q3 keyword into Q2. Scale gradually and monitor efficiency after each change.

### Q4: Diagnose or pause

These keywords spend money without converting. The question is whether they can be fixed or should be eliminated.

| Signal | What you see |
|--------|-------------|
| Conversions | Zero or near-zero despite sufficient clicks |
| Spend | Significant (above your threshold for acceptable exploration cost) |
| Quality Score | Often low (but not always: high QS with zero conversions = intent mismatch) |
| CTR | Varies: high CTR + zero conversions = LP/offer problem, low CTR = relevance problem |

**Diagnosis decision tree:**

1. Has the keyword received 100+ clicks with zero conversions? If no, it needs more data before judging. If yes, continue.
2. Is Quality Score below 5? Fix QS first (ad relevance, LP experience). Poor QS means Google is serving you in bad auctions.
3. Is CTR reasonable (above campaign average) but CVR is zero? The problem is post-click: landing page, offer, or intent mismatch.
4. Review search terms: are the actual queries aligned with purchase/conversion intent?
5. If diagnosis points to fixable issues (LP, ad copy, negatives), apply fixes and reset the evaluation window.
6. If diagnosis shows fundamental intent mismatch (informational queries, wrong audience), pause the keyword.

> ⚠️ **Do not pause keywords prematurely:** A keyword with fewer than 50 clicks and zero conversions has not failed. It has insufficient data. Apply the minimum data thresholds below before making permanent decisions.

---

## Performance segmentation axes

Four axes define how you evaluate keyword performance. Each axis reveals a different type of problem.

| Axis | Metric | What it reveals | Diagnostic value |
|------|--------|----------------|-----------------|
| **Volume** | Impressions, clicks | Reach and engagement: is Google showing this keyword, and are users clicking? | Low impressions = bid or relevance issue. Low CTR = ad copy or keyword-ad mismatch |
| **Efficiency** | CPA or ROAS | Cost-effectiveness: are conversions profitable? | Compare to campaign-level target, never account average |
| **Conversion rate** | Clicks to conversions (CVR) | Post-click relevance: does the LP deliver on the keyword's promise? | Low CVR with good CTR = landing page or offer problem |
| **Quality Score** | Google's 1-10 rating | Keyword-ad-LP relevance triangle: is the system coherent? | Below 7 = one or more components needs attention |

### How the axes interact

- High volume + low efficiency = Q2 (fix relevance)
- Low volume + high efficiency = Q3 (increase visibility)
- High volume + high efficiency = Q1 (protect and scale)
- Any volume + zero conversions + high spend = Q4 (diagnose or pause)
- Low QS amplifies cost across all quadrants: fix QS first to improve economics everywhere

> 💡 **Match types affect CTR by design:** Broad match keywords naturally have lower CTR than exact match because they trigger on a wider range of queries, including less specific ones. A 3% CTR on broad match may represent stronger overall performance than a 5% CTR on exact match in terms of total conversions. When comparing CTR across keywords, always account for match type differences before concluding a keyword underperforms.

---

## N-gram and search term analysis (primary workflow)

In Smart Bidding accounts, search term and N-gram analysis is the highest-leverage optimization action. Fixing search term relevance and performance first dramatically improves keyword performance downstream. The typical workflow is:

1. Review the search term report: identify irrelevant categories and add negatives
2. Run N-gram analysis: find non-converting and inefficient word patterns across terms
3. Promote high-performing search terms as explicit keywords (exact match)
4. Let Smart Bidding handle bid-level optimization for the cleaned keyword set
5. Use the keyword quadrant framework (above) for structural decisions: match type changes, intent mismatches, missing coverage

N-gram analysis reveals patterns across keywords that individual keyword analysis misses. Use it as a complement to the quadrant framework.

### What N-gram analysis adds

| N-gram pattern | Insight | Action |
|----------------|---------|--------|
| Non-converting N-grams (word combinations that never convert across multiple keywords) | These words signal irrelevant intent regardless of the keyword they appear in | Add as negative keywords (phrase or exact match depending on specificity) |
| High-performing N-grams (word combinations that consistently convert) | These words signal strong purchase intent | Add as new keywords, use in ad copy, ensure LP coverage |
| Volume-shifting N-grams (word combinations appearing with increasing frequency) | Market demand is shifting toward these terms | Evaluate for new keyword or ad group creation |

### How to combine with the quadrant framework

1. Run the quadrant analysis on individual keywords first
2. For Q4 keywords (diagnose or pause), run N-gram analysis on their search terms to find which word combinations fail
3. For Q1 keywords (protect and scale), run N-gram analysis to find which word combinations drive the best performance
4. Use N-gram negatives proactively across all ad groups to prevent waste before it accumulates
5. Use high-performing N-grams to inform keyword expansion and ad copy testing

> ↪️ **For negative keyword implementation:** See [Negative Keyword Reference](../references/Negative Keyword Reference.md)

---

## Decision rules per segment

### Minimum data requirements

Never judge a keyword until it has accumulated sufficient data. Premature decisions based on small samples lead to false negatives (killing good keywords) and false positives (keeping bad ones).

| Decision | Minimum data | Why |
|----------|-------------|-----|
| Judge conversion potential | 100 clicks | Below 100 clicks, a zero-conversion result is statistically meaningless for most conversion rates |
| Judge CTR reliability | 100 clicks (or 1,000+ impressions) | CTR stabilizes only with sufficient impression volume |
| Flag Quality Score for action | QS below 7 with 100+ impressions | QS updates slowly, needs impression volume to be meaningful |
| Judge CPA/ROAS performance | 10+ conversions on the keyword | Below 10 conversions, CPA/ROAS variance is too high for reliable comparison |

> 💡 **Adjust click thresholds based on your conversion rate:** If your campaign converts at 2%, 100 clicks yields an expected 2 conversions: you may need 150-200 clicks for a meaningful sample. If you convert at 10%, 100 clicks gives you 10 expected conversions, which is reliable.

### Efficiency thresholds

| Metric | Threshold | Comparison basis |
|--------|-----------|-----------------|
| CPA | Within 30% of campaign target | Campaign-level tCPA, not account average |
| ROAS | Within 30% of campaign target | Campaign-level tROAS, not account average |
| Quality Score | 7 or above | Keywords below 7 get flagged for improvement |
| Impression share | Context-dependent | Brand keywords: target 90%+. Non-brand: evaluate cost of incremental IS |

### Action triggers

| Condition | Quadrant | Action |
|-----------|----------|--------|
| CPA/ROAS within target, conversions > campaign average | Q1 | Protect: increase bids if IS lost to rank > 10% |
| CPA/ROAS worse than target by 30%+, conversions > 5 | Q2 | Fix: run QS diagnosis, check STR, review LP |
| CPA/ROAS within target, conversions < 3 (with < 100 clicks) | Insufficient data | Wait: accumulate more clicks before classifying |
| CPA/ROAS within target, conversions < 3 (with 100+ clicks) | Q3 | Expand: raise bids, broaden match type |
| 100+ clicks, 0 conversions, spend > 2x target CPA (or ROAS below 50% of target) | Q4 | Diagnose: check QS, STR, LP. Pause if unfixable |

---

## Close-variant analysis

Google's close variant matching means your exact and phrase match keywords trigger on queries that differ from the literal keyword. When close variants perform differently from the parent keyword, action is required.

### When to investigate

| Signal | What it means |
|--------|--------------|
| A variant gets more traffic than the parent keyword | Google considers the variant a better match for the queries. The parent may be underperforming or the variant captures a broader intent |
| A variant has significantly different CPA/ROAS (30%+ deviation) | The variant reaches a different audience or intent than expected |
| A variant has significantly different CVR | The landing page resonates differently with variant traffic |

### How to analyze

1. Pull the search term report filtered to the parent keyword
2. Group search terms by pattern (exact parent match vs. close variants)
3. Compare performance: CTR, CVR, CPA/ROAS for parent queries vs. variant queries
4. Identify high-performing variants and poor-performing variants

### Actions

| Finding | Action |
|---------|--------|
| High-performing variant (better CPA, meaningful volume) | Add as its own exact match keyword to protect and control it |
| Poor-performing variant (worse CPA, wasting spend) | Add as a negative keyword (exact match) to block it |
| Variant gets more volume than parent | Evaluate whether the variant should become the primary keyword |
| Multiple variants diverge | Consider restructuring the ad group around the actual query clusters |

> ↪️ **For search term report analysis procedures:** See [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md)

---

## Key principles

1. **Classify before acting:** Every keyword belongs in a quadrant. Determine the quadrant before choosing an action. Random optimization wastes time and budget.
2. **Respect minimum data thresholds:** 100 clicks before judging conversion potential. 10 conversions before judging efficiency. Premature decisions kill good keywords.
3. **Compare to campaign targets, not account averages:** A €60 CPA keyword is excellent in a €75 target campaign and terrible in a €40 target campaign. Context determines the quadrant.
4. **Fix upstream before downstream:** If Quality Score is below 7, fix relevance before increasing bids. If the landing page does not convert, more traffic just wastes more money.
5. **Close variants are not the same as your keyword:** Monitor variant performance separately. Promote winners, block losers.
6. **The quadrant is temporary, not permanent:** Keywords move between quadrants as you apply fixes, as competition changes, and as seasons shift. Re-evaluate monthly.
7. **Pausing is a valid action:** Not every keyword can be fixed. When diagnosis shows fundamental intent mismatch with no viable path to conversion, pause and redirect budget to Q1 and Q3 keywords.

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md) | Upstream: constraint classification system that determines which fix to apply per quadrant |
| [Quality Score Reference](../references/Quality Score Reference.md) | Reference: QS components, thresholds, and diagnostic approach |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference: how to read and act on STR data |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference: negative keyword types, match behavior, and implementation |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Upstream: overarching Search philosophy that shapes keyword strategy |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Related: campaign structure affects keyword performance evaluation context |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Related: bid strategy determines how keywords compete in auctions |
| [Match Type Reference](../references/Match Type Reference.md) | Reference: match type behavior affecting which queries keywords trigger |
| [SOP – Research Keywords](../sops/SOP – Research Keywords.md) | Execution: keyword research feeds the initial keyword set to evaluate |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Execution: STR analysis procedure for Q2 and Q4 diagnosis |
| [SOP – Improve Quality Score](../sops/SOP – Improve Quality Score.md) | Execution: QS improvement procedure for Q2 keywords |

---

## Version details

- **Version:** 3.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
