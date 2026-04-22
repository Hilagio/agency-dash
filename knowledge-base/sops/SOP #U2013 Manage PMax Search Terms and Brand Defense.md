# SOP – Manage PMax Search Term Routing
Created: 2026-02-14
Updated: 2026-04-02

SOP_ID: SOP_83
Status: Done
Category: PMax
Primary Outcome: High-value PMax search terms promoted to Search campaigns for routing priority, cross-campaign query overlap resolved
Agent_Executable: No
Human_Approval_Required: No
Domain: PMax
Pillar: 6

### Purpose

This SOP ensures Search campaigns get routing priority over PMax for high-value queries by proactively mining PMax search term data and promoting converting, mid-to-high volume terms as explicit keywords in Search campaigns.

> ❓ **The big question:** Which PMax search terms should be controlled by Search campaigns, and how do I route them there?

Google's keyword selection priority gives exact match keywords in Search campaigns priority over PMax. By promoting valuable PMax queries to Search, you gain keyword-level control over bids, ad copy, and landing pages for your best-performing terms.

> ⚠️ **Search term analysis and negative keyword management for PMax are handled separately:** Use [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) for irrelevant term identification and [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) for performance-based negation. Brand defense is covered in [Brand Separation Reference](../references/Brand Separation Reference.md).

---

### What this SOP is NOT

This SOP does **not:**

- Analyze PMax search terms for irrelevant queries or negation (See: [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md))
- Run N-gram analysis on PMax search terms (See: [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md))
- Implement brand separation from scratch (See: [Brand Separation Reference](../references/Brand Separation Reference.md))
- Execute the promoted keyword setup in Search (See: [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md))
- Explain how Google routes queries between Search and PMax (See: [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md))

### When to run this SOP

| Cycle | Frequency |
| --- | --- |
| Standard accounts | Monthly |
| High-spend accounts (>€10K/month PMax) | Bi-weekly |
| Post-PMax launch (first 90 days) | Weekly |

Run immediately (outside cadence) when: PMax is capturing high-volume converting queries that should be controlled by Search, or Search campaign volume drops unexpectedly while PMax volume increases.

---

### Before you start

#### Required inputs

- Access to Google Ads account with reporting permissions
- PMax search term report (last 30 days)
- Search campaign search term report for the same period
- Current keyword list per Search campaign/ad group
- Current target CPA or target ROAS for PMax and Search campaigns

#### Reference documents (have open)

| Document | Used for |
| --- | --- |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | Query routing priority rules |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Column definitions, filtering, data interpretation |

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Export and merge search term data** | Gather query data from both PMax and Search | Merged dataset with performance by campaign type |
| **Phase 2️⃣: Identify promotion candidates** | Find PMax queries that Search should control | Ranked list of queries to promote to Search |
| **Phase 3️⃣: Promote to Search campaigns** | Add queries as exact match keywords in Search | Keywords added, routing priority established |
| **Phase 4️⃣: Validate routing** | Confirm queries shifted to Search | Routing verified, performance tracked |

---

## Phase 1️⃣: Export and merge search term data

### 1.1 Export PMax search term report

1. In Google Ads, navigate to the PMax campaign > **Insights and reports** > **Search terms**.
2. Set the date range to last 30 days.
3. Add required columns: Search term, Impressions, Clicks, Cost, Conversions, Conversion value, CTR, CPA (calculated).
4. Export the report.

### 1.2 Export Search campaign search term report

1. Navigate to Search campaigns > **Insights and reports** > **Search terms**.
2. Set the same 30-day date range.
3. Export with the same columns.

### 1.3 Merge and identify overlapping queries

1. Combine both datasets into one spreadsheet.
2. Match on the Search term column.
3. For each query, note whether it appears in PMax only, Search only, or both.
4. Sort by PMax cost descending to prioritize high-spend queries.

---

## Phase 2️⃣: Identify promotion candidates

### 2.1 Filter for PMax queries worth promoting

Review PMax search terms and flag queries that meet these criteria:

| Criterion | Threshold | Why |
| --- | --- | --- |
| Conversions | 2+ conversions in the analysis period | Proven conversion potential |
| Relevance | Directly related to your products/services | Worth controlling long-term |
| Volume | 50+ impressions in the analysis period | Sufficient demand to justify keyword management |
| Not already in Search | Status is "None" (not an existing Search keyword) | Avoid duplicating existing exact match keywords |
| Non-brand | Does not contain your brand name | Brand routing is handled separately |

### 2.2 Compare PMax vs Search performance for overlapping queries

For queries appearing in both PMax and Search, compare performance:

| Metric | PMax value | Search value | Better performer |
| --- | --- | --- | --- |
| CPA | [value] | [value] | Lower CPA wins |
| ROAS | [value] | [value] | Higher ROAS wins |
| Conversion rate | [value] | [value] | Higher CVR wins |

### 2.3 Build the promotion list

For each promotion candidate, record:

| Search term | PMax conversions | PMax CPA/ROAS | Currently in Search? | Recommended action |
| --- | --- | --- | --- | --- |
| [term] | [#] | [value] | No | Promote to exact match in [campaign/ad group] |
| [term] | [#] | [value] | Yes (phrase/broad) | Add exact match to claim routing priority |

**Priority order for promotion:**

1. High-volume, high-converting queries not yet in Search (biggest opportunity)
2. Queries overlapping with Search where PMax outperforms (routing is suboptimal)
3. Queries appearing in PMax that align with existing Search campaign themes
4. New query patterns suggesting new ad group or campaign opportunities

---

## Phase 3️⃣: Promote to Search campaigns

### 3.1 Route queries to existing or new Search structure

| Scenario | Action |
| --- | --- |
| Query fits an existing ad group theme | Add as exact match keyword in that ad group |
| Query represents a new theme with 3+ related terms | Create a new ad group with these terms as exact match |
| Query suggests an entirely new campaign category | Flag for campaign planning (do not create ad hoc) |

### 3.2 Execute promotions

Route promotion candidates to [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) for execution.

Key points for PMax-to-Search promotions:

1. Always add as **exact match** in Search. Exact match keywords take routing priority over PMax.
2. Verify the Search campaign has appropriate ad copy for the promoted terms.
3. Verify the landing page matches the query intent.
4. Set the initial bid or target in line with the Search campaign's strategy.

### 3.3 Do NOT add negative keywords in PMax for promoted terms

Do not add promoted terms as PMax negatives. Google's routing priority handles this automatically: exact match in Search takes priority over PMax. Adding negatives in PMax risks blocking close variants and related queries that PMax may handle well.

---

## Phase 4️⃣: Validate routing

### 4.1 Post-promotion monitoring

After promoting terms:

1. Wait 7-14 days for routing changes to take effect.
2. Re-pull both PMax and Search search term reports.
3. Confirm promoted queries now appear in Search campaign reports with impressions and clicks.

### 4.2 Evaluate results

| Check | Expected result | If not met |
| --- | --- | --- |
| Promoted query appearing in Search | Impressions and clicks in Search campaign | Verify keyword is active, not paused, approved, and has sufficient bid |
| PMax volume for promoted query decreasing | Fewer impressions on the same query in PMax | Expected behavior: Search is claiming routing priority |
| Total conversions for promoted query stable or increasing | Combined PMax + Search conversions >= previous PMax-only | If total conversions drop, investigate: ad copy mismatch, landing page issue, or bid too low |
| Search campaign CPA/ROAS on promoted terms | Within campaign target | If worse than PMax was achieving, review ad copy and LP alignment |

### 4.3 Document findings

Record for each cycle: queries promoted (count), queries by routing outcome (Search claimed / still in PMax / split), total conversion impact, and new query patterns identified for next cycle.

---

### Validation & definition of done

This SOP is complete when:

- [ ] PMax and Search search term reports exported and merged
- [ ] Promotion candidates identified (converting, relevant, sufficient volume)
- [ ] Overlapping query performance compared between PMax and Search
- [ ] Promotion list built with target campaigns and ad groups
- [ ] Promotions executed via SOP – Promote Search Terms to Keywords
- [ ] No unnecessary PMax negatives added for promoted terms
- [ ] Routing validation scheduled (7-14 days post-promotion)
- [ ] Findings documented with counts and actions taken

---

### Exit → entry bridge

Once PMax search term routing is complete:

| Timeframe | Action |
| --- | --- |
| 7-14 days | Validate routing: confirm promoted queries appear in Search |
| Next cycle | Re-run this SOP per cadence (monthly or bi-weekly) |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| Promoted keyword not accruing impressions in Search | Check keyword status, bid, Quality Score, and match type |
| Total conversions dropped after promotion | Review ad copy and landing page alignment for promoted terms |
| PMax query quality declining (irrelevant terms) | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) and [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) |
| Brand queries appearing in PMax | [Brand Separation Reference](../references/Brand Separation Reference.md) |
| Query overlap not resolving via routing priority | [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) for advanced routing tactics |

---

### FAQ

**Q: Why exact match for promoted terms?**
A: Google's routing priority gives exact match keywords in Search campaigns priority over PMax. Adding a query as exact match ensures Search serves it, giving you keyword-level control over bids, ad copy, and landing pages.

**Q: Should I add promoted terms as negatives in PMax?**
A: No. Google handles the routing automatically when an exact match keyword exists in Search. Adding PMax negatives risks blocking close variants and related queries that PMax may serve well.

**Q: What about brand queries in PMax?**
A: Brand defense is handled through PMax brand exclusions and negative keyword lists. See [Brand Separation Reference](../references/Brand Separation Reference.md) for implementation.

**Q: How does this SOP relate to SOP – Analyze Search Term Reports?**
A: SOP – Analyze Search Term Reports handles irrelevant term identification and negation. This SOP handles the positive side: promoting valuable PMax queries to Search for routing control. The two SOPs run on separate cadences.

---

### Related documents

| Document | Type | Relationship |
| --- | --- | --- |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | Reference | Query routing priority rules between Search and PMax |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | SOP | Downstream: executes keyword promotions identified in Phase 2 |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | SOP | Parallel: handles irrelevant term identification for PMax |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | SOP | Parallel: handles performance-based negation for PMax |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference | Brand exclusion implementation and verification |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference | Column definitions, filtering, data interpretation |
| [SOP – Run PMax Ecommerce Optimization Cycle](../sops/SOP – Run PMax Ecommerce Optimization Cycle.md) | SOP | Parent: ecommerce PMax optimization cycle |
| [SOP – Run PMax Lead Gen-SaaS Optimization Cycle](../sops/SOP – Run PMax Lead Gen-SaaS Optimization Cycle.md) | SOP | Parent: lead gen/SaaS PMax optimization cycle |

---

### Version details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
