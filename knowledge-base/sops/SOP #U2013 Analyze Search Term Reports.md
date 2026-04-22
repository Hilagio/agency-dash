# SOP – Analyze Search Term Reports
Created: 2026-02-04
Updated: 2026-02-15

SOP_ID: SOP_46
Agent_Executable: No
Category: Optimization
Domain: Search
Human_Approval_Required: No
Pillar: 7
Primary Outcome: Irrelevant search terms negated, promotion candidates identified, analysis documented
Status: Done

### Purpose

This SOP scans search term data for two outputs: irrelevant terms to negate and high-performing terms to promote.

> ❓ **The big question:** Which search terms are completely irrelevant to my business, and which deserve keyword status?

### What this SOP is NOT

This SOP does **not:**

- Explain search term report columns, metrics, or filtering mechanics (See: [Search Term Report Reference](../references/Search Term Report Reference.md))
- Execute keyword promotions (See: [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md))
- Make performance-based negation decisions using individual search term metrics (See: [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md))
- Explain negative keyword match types or formatting rules (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md))
- Choose match types for positive keywords (See: [Match Type Reference](../references/Match Type Reference.md))

### When to run this SOP

Run this SOP on a recurring cadence based on campaign maturity:

| Campaign stage | Frequency | Rationale |
| --- | --- | --- |
| First 30 days post-launch | Weekly | High discovery rate, many irrelevant terms surfacing |
| Established (30-90 days) | Bi-weekly | Stabilized traffic, fewer new patterns |
| Mature (90+ days) | Monthly | Incremental refinement only |

Run immediately (outside cadence) when:

- New campaign types or match types are added
- Seasonal promotions introduce new traffic patterns
- A new product or service launches that may attract irrelevant queries

---

### Before you start

#### Required inputs

- Access to Google Ads account with reporting permissions
- Defined analysis period (aligned to cadence above)
- Current keyword list per ad group (for duplicate checking during promotion scan)

#### Reference documents (have open)

| Document | Used for |
| --- | --- |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Column definitions, filtering approach, data interpretation |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Match type rules for negatives, formatting requirements |
| [Match Type Reference](../references/Match Type Reference.md) | Understanding how match types triggered each search term |

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Export search term data** | Pull raw data for the analysis period | Downloaded search term report |
| **Phase 2️⃣: Scan for irrelevant terms** | Identify queries unrelated to business | Negation candidates for Irrelevant Keywords list |
| **Phase 3️⃣: Identify promotion candidates** | Find terms deserving keyword status | Promotion candidate list |
| **Phase 4️⃣: Apply changes** | Execute promotions and negations | Changes applied in Google Ads |
| **Phase 5️⃣: Document decisions** | Record what changed and why | Analysis log updated |

---

## Phase 1️⃣: Export search term data

### 1.1 Pull the search term report

1. In Google Ads, navigate to Campaigns > Insights and reports > Search terms.
2. Set the date range to your analysis period.

| Cadence | Date range |
| --- | --- |
| Weekly | Last 7 days |
| Bi-weekly | Last 14 days |
| Monthly | Last 30 days |

3. Select all campaigns in scope (or filter to the campaign group being analyzed).

### 1.2 Add required columns

Confirm these columns are visible in the report:

| Column | Purpose |
| --- | --- |
| Search term | The actual query |
| Match type | How the term was matched |
| Keyword | The keyword that triggered the match |
| Campaign | Source campaign |
| Ad group | Source ad group |
| Impressions | Volume indicator |
| Clicks | Engagement indicator |
| Cost | Spend allocation |
| Conversions | Performance outcome |
| Conversion rate | Efficiency metric |
| Cost/conversion | Efficiency metric |
| Added/Excluded | Whether the term is already a keyword or negative |

### 1.3 Export the report

1. Download the report as a spreadsheet (.csv or .xlsx).
2. Remove rows with zero impressions (no actionable data).
3. Sort by Search term (A→Z).

> 💡 **Why sort alphabetically?** Sorting A→Z clusters related terms and long-tail variants together. This prevents you from analyzing the same theme multiple times and helps you spot connections between related queries. For example, "crm software", "crm software free", "crm software for small business", and "crm tools" all appear near each other, making it easier to identify irrelevant word patterns across related queries.

---

## Phase 2️⃣: Scan for irrelevant terms

This phase identifies clearly irrelevant terms only. Do not evaluate individual search term performance metrics in this phase.

Before scanning, **filter out all search terms with conversions > 0, and a status of "None" (not yet added as keywords)**. Converting search terms stay in the account regardless of how irrelevant they look. Your bias might be working against you: if a search term converts, the data is telling you something. Leave it alone.

### 2.1 Scan the alphabetical list for irrelevant words and themes

Work through the sorted list (now showing only non-converting terms) looking for individual words or themes that are completely unrelated to your business. You are scanning for relevance, not performance.

Discover irrelevant categories dynamically. Do not rely on a fixed list of categories: every account has different irrelevance patterns. Group flagged terms into categories as you find them (minimum 3 terms per category before naming it). Name categories by intent, not by individual words.

**Common starting points** (not exhaustive, discover what applies to your account):

| Category type | Examples | Why it is irrelevant |
| --- | --- | --- |
| Industry-unrelated words | "jobs", "salary", "hiring", "career", "DIY", "homemade" | Wrong intent entirely |
| Informational intent (if targeting transactional) | "what is", "definition", "wiki", "pdf", "tutorial" | Not purchase-ready traffic |
| Competitor names (if not bidding on competitors) | Specific competitor brand names | Not your brand, not your audience |
| Explicit/spam terms | Adult terms, torrent/piracy terms | Never convert for legitimate businesses |
| Wrong product/service | Terms for products or services you do not offer | Zero chance of conversion |

> 💡 **Let the data drive category discovery:** The categories above are starting points, not a checklist. Your account will have unique irrelevance patterns. Group 3+ similar irrelevant terms into a named category, then use that category to systematically scan the rest of the report.

> ⚠️ **When in doubt, do not exclude.** If you are unsure whether a search term is truly irrelevant, leave it in the account and make a note to revisit. Let the data speak: if the term is genuinely wasteful, it will surface in your N-gram analysis once you have enough data. See: [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md).

### 2.2 Record negation candidates

For each irrelevant word or theme identified, record:

| Irrelevant word/theme | Example search terms containing it | Recommended match type | Target list |
| --- | --- | --- | --- |
| {word} | {example queries from report} | Phrase match | Irrelevant Keywords |

**Match type rule:** Use phrase match for all irrelevant term negatives, including single words. Phrase match is the safest default: it blocks the exact word or sequence without the over-exclusion risk of broad match negatives (which block any query containing all words in any order).

> ⚠️ **This phase identifies clearly irrelevant terms only.** Do not negate terms based on individual search term performance data (high CPA, low ROAS, zero conversions). Performance-based negation requires aggregated data and is handled through N-gram analysis. See: [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md).

---

## Phase 3️⃣: Identify promotion candidates

### 3.1 Filter for promotion eligibility

Scan the search term report for terms that have conversions and a status of "None" (not yet added as keywords).

**Condition 1: Has this term converted?**

Filter the report to show only terms with at least 1 conversion. Terms with zero conversions are not promotion candidates.

**Condition 2: Is this term already added?**

1. Check the "Added/Excluded" column in the report.
2. If the status is "Added": skip (already a keyword).
3. If the status is "None": this term is a promotion candidate.

**Condition 3: Is there sufficient volume to justify promotion?**

| Account volume | Minimum impressions (per analysis period) |
| --- | --- |
| High-volume (1,000+ clicks/month per campaign) | 100+ impressions |
| Mid-volume (200-1,000 clicks/month) | 50+ impressions |
| Low-volume (<200 clicks/month) | Top 10 converting terms regardless of volume |

### 3.2 Build the promotion list

For each term that passes all three conditions, record:

| Search term | Conversions | Conv. rate | Cost/conv. | Current keyword trigger | Recommended action |
| --- | --- | --- | --- | --- | --- |
| [term] | [#] | [%] | [$] | [keyword] | Promote to [match type] in [ad group] |

> 💡 **Do not promote in this SOP:** Collect candidates here. Execute promotions via [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) in Phase 4.

---

## Phase 4️⃣: Apply changes

### 4.1 Execute negations

Take the irrelevant term list from Phase 2 and add them directly to the **Irrelevant Keywords** shared negative keyword list in Google Ads:

1. Navigate to Tools > Shared Library > Negative keyword lists.
2. Open the "Irrelevant Keywords" list.
3. Add all formatted negatives from Phase 2 (lowercase, no special characters).
4. Verify the list is linked to all relevant campaigns.

> ⚠️ **Negatives do not match close variants:** Unlike positive keywords, negative broad match does not expand to synonyms, plurals, or misspellings. Add each variation explicitly (e.g., "job" and "jobs").

### 4.2 Execute promotions

Take the promotion list from Phase 3 and run [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) for each candidate.

### 4.3 Verify changes

After applying:

1. Confirm promoted keywords are active and accruing impressions.
2. Confirm negatives are not conflicting with positive keywords (check for "Negative keyword conflict" alerts in Google Ads).
3. Spot-check that ads are still serving for high-value terms.

---

## Phase 5️⃣: Document decisions

### 5.1 Update the analysis log

Record every analysis cycle in a running log:

| Field | Value |
| --- | --- |
| Date | [analysis date] |
| Period analyzed | [date range] |
| Total search terms reviewed | [count] |
| Irrelevant terms negated | [count] |
| Terms promoted | [count] |
| Key observations | [notable patterns, new themes, seasonal shifts] |

### 5.2 Flag items for next cycle

Record any terms you want to revisit:

| Search term | Reason for deferral | Re-evaluate date |
| --- | --- | --- |
| [term] | [unclear relevance / new pattern to watch] | [next cycle date] |

---

### Validation & definition of done

This SOP is complete when:

- [ ] Search term report exported and sorted alphabetically
- [ ] Alphabetical scan completed for irrelevant words and themes
- [ ] Promotion candidates identified (converting terms with "None" status)
- [ ] Promotion candidates validated against existing keyword list and volume thresholds
- [ ] Irrelevant terms added to the Irrelevant Keywords shared list
- [ ] Promotions executed via SOP – Promote Search Terms to Keywords
- [ ] No negative keyword conflicts detected post-application
- [ ] Analysis log updated with decisions and rationale

---

### Exit → entry bridge

Once analysis is complete:

| Timeframe | Action |
| --- | --- |
| Immediately | Route promotion candidates to [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) |
| 7 days | Spot-check promoted keywords: are they accruing impressions and matching intended queries? |
| 7 days | Spot-check negatives: are ads still serving for high-value terms? |
| Next scheduled cycle | Re-run this SOP per cadence |
| Separate cadence | Route performance-based negation to [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) (weekly to monthly, depending on spend) |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| Promoted keyword has low Quality Score | [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) |
| Negative keyword blocking desired traffic | [Negative Keyword Reference](../references/Negative Keyword Reference.md) for conflict resolution |
| Search terms indicate landing page mismatch | [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) |
| Performance-based negation needed | [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) |

---

### Common failure modes

| Failure | Why it happens | How to avoid |
| --- | --- | --- |
| Negating terms based on individual performance data | Looking at CPA/ROAS of individual search terms instead of aggregated N-gram data | This SOP handles irrelevant terms only. Route performance-based negation to SOP – Run N-gram Analysis |
| Missing high-value promotion candidates | Only reviewing the first few pages of the report | Sort alphabetically and scan the full list systematically |
| Negating a close variant of a good keyword | Not checking positive keyword conflicts before adding negatives | Validate every negation candidate against the active keyword list |
| Promoting terms that fragment Smart Bidding data | Promoting close variants that add no control or visibility | Apply the full decision framework in SOP – Promote Search Terms to Keywords |
| Not documenting decisions | Relying on memory for what was changed and why | Complete Phase 5 every cycle, no exceptions |
| Inconsistent analysis cadence | Forgetting or deprioritizing STR reviews | Set calendar reminders aligned to campaign maturity stage |

---

### Related documents

| Document | Type | Relationship |
| --- | --- | --- |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference | Column definitions, data interpretation (Phase 1) |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Match type rules, formatting, conflict resolution (Phase 2, 4) |
| [Match Type Reference](../references/Match Type Reference.md) | Reference | Understanding match type triggers (Phase 1) |
| [N-gram Analysis Reference](../references/N-gram Analysis Reference.md) | Reference | N-gram extraction, classification, and exclusion model |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | SOP | Downstream: executes promotions identified in Phase 3 |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | SOP | Parallel: handles performance-based negation through aggregated N-gram data |

---

### Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
