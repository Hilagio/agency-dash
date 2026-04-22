# SOP – Run N-gram Analysis
Created: 2026-02-14

SOP_ID: SOP_74
Status: Done
Category: Search
Primary Outcome: Two exclusion lists updated (non-converting and inefficient N-grams) and linked to campaigns
Agent_Executable: No
Human_Approval_Required: No
Domain: Search
Pillar: 7

### Purpose

This SOP extracts N-grams from search term reports, classifies them as non-converting or inefficient, and adds phrase match exclusions to two separate negative keyword lists.

> ❓ **The big question:** Which word patterns in my search terms are wasting money, and how do I systematically exclude them without killing good traffic?

N-gram analysis surfaces systematic waste invisible at the individual search term level. A single word like "free" might appear across 40 different search terms, each below your spend threshold individually, but collectively burning through hundreds of dollars with zero conversions.

### What this SOP is NOT

This SOP does **not:**

- Review individual search terms for promotion or negation decisions (See: [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md))
- Research new keywords from scratch (See: [SOP – Research Keywords](../sops/SOP – Research Keywords.md))
- Explain negative keyword match types or conflict resolution (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md))
- Build the initial negative keyword list infrastructure (See: [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md), Phase 3.3)

### When to run this SOP

| Campaign spend | Frequency |
| --- | --- |
| High-spend Search campaigns (>€5K/month) | Weekly |
| Medium-spend Search campaigns | Bi-weekly |
| Low-spend Search campaigns | Monthly |
| Shopping and PMax search terms | Monthly |

Run immediately (outside cadence) when a major keyword expansion introduces new traffic patterns, cost-per-conversion spikes without a clear cause, or a new campaign type starts generating search term data.

---

### Before you start

#### Required inputs

- Search term report export (30-90 days, depending on volume)
- Current target CPA or target ROAS per campaign
- Access to Google Ads Editor (for bulk negative keyword operations)

#### Reference documents (have open)

| Document | Used for |
| --- | --- |
| [N-gram Analysis Reference](../references/N-gram Analysis Reference.md) | Extraction methods, thresholds, categorization |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Match type rules, list management |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | STR export and interpretation |

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Export and prepare data** | Pull raw search term data for the analysis period | Cleaned search term report with calculated metrics |
| **Phase 2️⃣: Extract N-grams** | Break search terms into component word patterns | Aggregated N-gram table with performance metrics |
| **Phase 3️⃣: Classify N-grams** | Sort N-grams into non-converting and inefficient buckets | Two categorized lists ready for exclusion |
| **Phase 4️⃣: Apply exclusions** | Add phrase match negatives to shared lists and link to campaigns | Updated exclusion lists linked to all relevant campaigns |
| **Phase 5️⃣: List management** | Document changes and set review cadence | Analysis log updated, next review scheduled |

---

## Phase 1️⃣: Export and prepare data

### 1.1 Pull the search term report

1. In Google Ads, navigate to Campaigns > Insights and reports > Search terms.
2. Set the date range based on data volume:

| Data volume | Date range |
| --- | --- |
| High-volume campaigns (1,000+ clicks/month) | Last 30 days |
| Medium-volume campaigns (200-1,000 clicks/month) | Last 60 days |
| Low-volume campaigns (<200 clicks/month) | Last 90 days |

3. Select all campaigns in scope.

### 1.2 Include required columns

| Column | Purpose |
| --- | --- |
| Search term | The actual query |
| Campaign | Source campaign |
| Impressions | Volume indicator |
| Clicks | Engagement indicator |
| Cost | Spend allocation |
| Conversions | Performance outcome |
| Conversion value | Revenue indicator (tROAS accounts only) |

### 1.3 Prepare the dataset

1. Export the report as a spreadsheet (.csv or .xlsx).
2. Add calculated columns based on your bidding strategy:
   - **All accounts:** **CPA** = Cost / Conversions
   - **tROAS accounts only:** **ROAS** = Conversion value / Cost, **AOV** = Conversion value / Conversions (needed for the non-converting threshold in Phase 3)
3. Remove brand terms from the dataset. Analyze brand traffic separately.
4. Verify minimum dataset size: 500+ search terms or 30 days of data, whichever comes first.

> ⚠️ **Insufficient data warning:** If you have fewer than 500 search terms and less than 30 days of data, delay this analysis. N-gram patterns need volume to be statistically meaningful.

---

## Phase 2️⃣: Extract N-grams

### 2.1 Break search terms into N-grams

For each search term, extract:

| N-gram type | Definition | Example from "best crm software free trial" |
| --- | --- | --- |
| 1-gram (unigram) | Single words | "best", "crm", "software", "free", "trial" |
| 2-gram (bigram) | Two-word sequences | "best crm", "crm software", "software free", "free trial" |
| 3-gram (trigram) | Three-word sequences | "best crm software", "crm software free", "software free trial" |

> 💡 **Focus on 1-grams and 2-grams:** These cover the majority of actionable patterns. 3-grams are optional for most accounts.

### 2.2 Aggregate metrics per N-gram

For each unique N-gram, sum the metrics across all search terms containing that N-gram: total impressions, total clicks, total cost, total conversions, total conversion value.

### 2.3 Calculate per-N-gram efficiency

Add calculated columns: CPA (total cost / total conversions), and frequency (count of distinct search terms containing this N-gram). For tROAS accounts, also calculate ROAS (total conversion value / total cost) and AOV (total conversion value / total conversions).

Filter out N-grams that appear in fewer than 3 distinct search terms. Low-frequency N-grams do not represent patterns: handle those as individual search term decisions in [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md).

---

## Phase 3️⃣: Classify N-grams into two buckets

### 3.1 Bucket 1: Non-converting N-grams

Non-converting N-grams generate spend but never convert. These are fundamentally irrelevant or wrong-intent patterns.

| Metric | CPA-based accounts | ROAS-based accounts |
| --- | --- | --- |
| Conversions | Zero | Zero |
| Cost threshold | N-gram cost > 2x target CPA | N-gram cost > 2x AOV with 0 conversions |
| Frequency | Appears in 3+ distinct search terms | Appears in 3+ distinct search terms |

**Action:** Add to "Non-converting N-grams" shared exclusion list.

### 3.2 Bucket 2: Inefficient N-grams

Inefficient N-grams convert, but at unacceptable efficiency.

| Metric | CPA-based accounts | ROAS-based accounts |
| --- | --- | --- |
| CPA/ROAS | N-gram CPA > 1.75x target CPA | N-gram ROAS < 0.7x target ROAS |
| Frequency | Appears in 3+ distinct search terms | Appears in 3+ distinct search terms |

**Action:** Add to "Inefficient N-grams" shared exclusion list.

> 💡 **Adjust the multipliers to match your risk tolerance.** The 1.75x CPA and 0.7x ROAS thresholds are starting points. Lower the multipliers (e.g. 1.5x CPA, 0.8x ROAS) to exclude more aggressively. Raise them (e.g. 2x CPA, 0.5x ROAS) to be more conservative and keep more traffic flowing.

### 3.3 Validate before classifying

For every N-gram that meets the criteria above:

1. Review all search terms containing that N-gram.
2. Check if any of those search terms are high-performers.
3. If the N-gram consistently underperforms across ALL terms: classify and add to the appropriate bucket.
4. If the N-gram appears in both good and bad terms: skip the N-gram exclusion. Negate individual terms instead via [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md).

> ⚠️ **Never exclude an N-gram that appears in a high-performing search term:** The phrase match negative blocks the entire word sequence, including good traffic.

---

## Phase 4️⃣: Apply exclusions

### 4.1 Use phrase match for all N-gram exclusions

All N-gram exclusions use **phrase match** (wrap in quotes). Phrase match blocks the exact word sequence while allowing other words before or after. This is more targeted than broad match negative (which blocks any search containing the individual words in any order) and broader than exact match (which only blocks the exact query).

### 4.2 Add to shared negative keyword lists

1. In Google Ads, navigate to Tools > Shared Library > Negative keyword lists.
2. Create the list "Non-converting N-grams" if it does not exist.
3. Create the list "Inefficient N-grams" if it does not exist.
4. Add all Bucket 1 N-grams to the "Non-converting N-grams" list.
5. Add all Bucket 2 N-grams to the "Inefficient N-grams" list.

> 💡 **Use Google Ads Editor for bulk operations:** Paste all N-grams at once instead of adding them one by one in the web interface.

### 4.3 Link lists to campaigns

Link both lists to all Search campaigns, Shopping campaigns, and PMax campaigns where the patterns are relevant.

> 💡 **PMax campaigns:** Link exclusion lists directly to PMax campaigns. Negative keyword list support is available for PMax.

### 4.4 Verify no conflicts

1. Check for "Negative keyword conflict" alerts in Google Ads.
2. Confirm ads are still serving for high-value terms.
3. If a conflict is detected, remove the conflicting N-gram and handle the underlying search terms individually.

---

## Phase 5️⃣: List management

### 5.1 Set review cadences per list

| List | Review cadence | Rationale |
| --- | --- | --- |
| Non-converting N-grams | Rarely (annual review) | These patterns are fundamentally irrelevant. They almost never become efficient. |
| Inefficient N-grams | Every 6-12 months (via experiment) | Some patterns may become efficient after LP changes, offer changes, or seasonal shifts. Validate through a 50/50 campaign experiment (see 5.3). |

Keep the two lists **separate**. Different review cadences, different reactivation potential.

### 5.2 Document the analysis

Record every N-gram analysis cycle: date, period analyzed, total search terms in dataset, N-grams extracted, non-converting N-grams added, inefficient N-grams added, and estimated monthly waste prevented (calculated from total cost of excluded N-grams).

### 5.3 Periodic review of inefficient list (optional)

You cannot check if excluded N-grams now meet efficiency targets by pulling a fresh report, because you excluded them: they have no recent data. Instead, validate with a controlled experiment.

**Every 6-12 months (optional):**

1. Create a 50/50 campaign experiment on a high-volume campaign.
2. In the experiment arm, unlink the "Inefficient N-grams" exclusion list.
3. Run the experiment for 4-6 weeks to accumulate data.
4. Analyze results:
   - If the experiment arm performs within efficiency targets: the inefficient N-grams have improved. Remove them from the list (or unlink the list entirely if performance is broadly acceptable).
   - If the experiment arm performs worse: keep the list linked. The N-grams are still inefficient.
5. Document the experiment outcome and update the exclusion list accordingly.

> 💡 **This step is optional.** Most inefficient N-grams stay inefficient. Only run this experiment if you suspect landing page changes, offer changes, or market shifts may have improved previously excluded patterns.

---

### Validation & definition of done

This SOP is complete when:

- [ ] Search term data exported and cleaned (brand terms removed, metrics calculated)
- [ ] N-grams extracted (1-grams and 2-grams minimum) with aggregated metrics
- [ ] N-grams classified into non-converting and inefficient buckets using defined thresholds
- [ ] All classified N-grams validated against high-performing search terms
- [ ] Exclusions added to correct shared lists in phrase match format
- [ ] Both lists linked to all appropriate campaigns
- [ ] No negative keyword conflicts detected post-application
- [ ] Analysis log updated with counts and estimated waste reduction

---

### Exit → entry bridge

Once N-gram analysis is complete:

| Timeframe | Action |
| --- | --- |
| Immediately | Verify ads still serve for high-value terms (no over-exclusion) |
| 7 days | Spot-check impression volume: confirm no significant drop from exclusions |
| Next scheduled cycle | Run N-gram analysis again per cadence (weekly/bi-weekly/monthly) |
| Every 6-12 months | Review "Inefficient N-grams" list via 50/50 campaign experiment (see Phase 5.3) |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| N-gram exclusion blocking desired traffic | Remove the N-gram, negate individual terms via [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Negative keyword conflict detected | [Negative Keyword Reference](../references/Negative Keyword Reference.md) for conflict resolution |
| Need to negate individual irrelevant search terms | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Search terms indicate landing page mismatch | [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) |

---

### FAQ

**Q: Why phrase match for N-gram exclusions?**
A: Phrase match blocks the exact word sequence while allowing other words before or after. Broad match negative blocks any search containing ANY of the individual words in any order (over-excludes). Exact match only blocks the exact query (under-excludes). Phrase match is the correct middle ground for word sequence patterns.

**Q: Why two separate lists instead of one?**
A: Non-converting N-grams never convert and rarely need revisiting. Inefficient N-grams convert but cost too much, and might become efficient after LP improvements, offer changes, or seasonal shifts. Keeping them separate lets you review the inefficient list periodically (via experiment) without wading through permanently irrelevant patterns.

**Q: Can I apply N-gram analysis to Shopping and PMax?**
A: Yes. Shopping search terms and PMax search terms both support N-gram analysis. Link the same exclusion lists to these campaigns where patterns are relevant.

**Q: What if an N-gram appears in both good and bad search terms?**
A: Do not exclude it. A phrase match negative blocks ALL search terms containing that sequence, including the good ones. Handle mixed-performance N-grams at the individual term level using [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md).

**Q: How does this SOP relate to SOP – Analyze Search Term Reports?**
A: SOP – Analyze Search Term Reports handles irrelevant term identification (scanning for words unrelated to your business) and promotion candidates. This SOP handles all performance-based negation through aggregated N-gram data. The two SOPs run on separate cadences and produce different outputs.

---

### Common failure modes

| Failure | Why it happens | How to avoid |
| --- | --- | --- |
| Excluding an N-gram in high-performing terms | Skipping validation in Phase 3.3 | Review ALL search terms containing an N-gram before excluding |
| Using broad match for multi-word N-gram exclusions | Misunderstanding negative match type behavior | For 2-gram and 3-gram exclusions, use phrase match. Broad match is acceptable for 1-gram exclusions (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md)) |
| Combining both lists into one | Convenience at the cost of clarity | Keep non-converting and inefficient lists separate from day one |
| Analyzing too short a date range | Impatience or wanting quick results | Use 30-90 days depending on volume |
| Never reviewing the inefficient list | Treating exclusions as permanent | Run a 50/50 experiment every 6-12 months to validate (see Phase 5.3) |
| Including brand terms in the analysis | Not filtering the dataset in Phase 1.3 | Always remove brand terms before extracting N-grams |
| Acting on low-frequency N-grams | Treating a pattern found in 1-2 terms as systematic | Require 3+ distinct search terms per N-gram before classifying |

---

### Related documents

| Document | Type | Relationship |
| --- | --- | --- |
| [N-gram Analysis Reference](../references/N-gram Analysis Reference.md) | Reference | Extraction methods, thresholds, categorization (all phases) |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Match type rules, formatting, conflict resolution (Phase 4) |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference | STR export and column definitions (Phase 1) |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | SOP | Upstream: identifies irrelevant terms from search term data. Performance-based negation is handled by this SOP |
| [SOP – Research Keywords](../sops/SOP – Research Keywords.md) | SOP | Upstream: keyword expansion that generates new search term patterns |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | SOP | Parallel: promotes good terms while this SOP excludes bad patterns |

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

(c) 2026 PPC Mastery B.V. All rights reserved.
