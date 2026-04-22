# SOP – Run Search Campaign Optimization Cycle
Created: 2026-02-14

SOP_ID: SOP_75
Status: Done
Category: Search
Primary Outcome: Complete Search campaign optimization cycle with documented actions and carry-forward items
Agent_Executable: No
Human_Approval_Required: No
Domain: Search
Pillar: 7

## Purpose

This SOP is the master optimization routine for Search campaigns. It orchestrates existing SOPs into a coherent cycle that covers every optimization lever in the correct order.

> ❓ **The big question:** What is the systematic process for optimizing a Search campaign, in what order, and how often?

Most advertisers optimize reactively: they notice a problem and fix it. This SOP replaces reactive optimization with a structured cycle that catches issues early, maintains momentum, and ensures nothing falls through the cracks.

---

## What this SOP is NOT

This SOP does **not:**

- Execute any optimization itself (it routes to the executing SOP for each task)
- Duplicate the steps inside referenced SOPs (those SOPs contain the "how")
- Replace daily health checks (See: [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md))
- Replace weekly/monthly performance reviews (See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))
- Cover Shopping, PMax, or Display campaigns (each has its own optimization cycle)

> ↪️ **Design principle:** This SOP ORCHESTRATES existing SOPs. Each phase references the executing SOP rather than duplicating its steps. If you find yourself reading execution steps here, you are in the wrong document.

---

## When to run this SOP

Run this SOP on a recurring cadence based on monthly conversion volume:

| Monthly conversions | Recommended cadence | Rationale |
|---------------------|---------------------|-----------|
| 200+ | Weekly | Sufficient data for weekly signals |
| 50-200 | Bi-weekly | Weekly data too noisy for reliable trends |
| <50 | Monthly | Need aggregation for statistical validity |

Run immediately (outside cadence) when:

- CPA spikes more than 30% without an obvious cause
- A new competitor enters the auction aggressively
- After launching new campaigns, ad groups, or match type expansions

---

## Before you start

### Required inputs

- Access to Google Ads account with full editing permissions
- Documented target KPIs (CPA, ROAS, or tCPA/tROAS targets per campaign)
- Previous cycle's review notes and carry-forward items
- Custom columns configured: CPI, RPI, or PPI for ad testing phases

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Cadence and timing framework |
| [Keyword Performance Analysis Mental Model](../mental-models/Keyword Performance Analysis Mental Model.md) | Keyword classification framework |
| [Optimization Action Catalog](../catalogs/Optimization Action Catalog.md) | Action options per issue type |
| [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md) | Issue prioritization hierarchy |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Campaign structure context |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Structure decisions |
| Previous cycle's notes | Continuity and carry-forward items |

### Time allocation

A full cycle (all 9 phases) takes approximately 105 minutes. A standard every-cycle run (Phases 1-3, 6, 9) takes approximately 60 minutes.

> ⚠️ **Not every phase runs every cycle:** Phases 4, 5, 7, and 8 run on longer cadences. A typical weekly cycle covers Phases 1-3, 6, and 9 only.

---

## Phase 1️⃣: Health check (every cycle)

### 1.1 Run the Search Campaign Health Checklist

Open the [Search Campaign Health Checklist](../checklists/Search Campaign Health Checklist.md) and run it against every Search campaign in scope. Record all failing items.

### 1.2 Classify issues by Five Buckets

Take every failing item and classify it using the constraint hierarchy from [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md):

| Bucket | Priority | Examples |
|--------|----------|----------|
| **Measurement** | 1 (fix first) | Broken conversion tracking, attribution gaps, consent mode misconfigured |
| **Business** | 2 | Unit economics don't work, target CPA unsustainable, margin issues |
| **Conversion** | 3 | Landing page broken, form not submitting, page speed critical |
| **Traffic** | 4 | Wrong keywords, poor match type coverage, impression share collapse |
| **Creative** | 5 (fix last) | Weak RSAs, low Ad Relevance, stale extensions |

### 1.3 Prioritize and decide

Fix highest-bucket issues first. Do not work on Traffic problems while Measurement is broken.

**Output:** Prioritized issue list with bucket classification. Measurement and Business issues become blockers: resolve them before continuing to Phase 2.

---

## Phase 2️⃣: Search term management (every cycle)

### 2.1 Review search term report

Pull the search term report for the last 7-14 days (depending on cycle cadence). Focus on terms with meaningful spend.

### 2.2 Add negatives for irrelevant queries

Identify search terms wasting spend and route to the negation workflow.

> ↪️ **Execute via:** [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md), Phase 2 (irrelevant term scanning).

### 2.3 Harvest high-performing terms

Identify high-performing search terms not yet added as keywords.

> ↪️ **Execute via:** [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md)

### 2.4 Run N-gram analysis (if due)

Run N-gram analysis monthly, or bi-weekly for high-volume accounts during the first 90 days.

> ↪️ **Execute via:** [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md)

**Output:** Negatives added, keywords promoted, N-gram exclusions applied (if due).

---

## Phase 3️⃣: Keyword performance (every cycle)

### 3.1 Pull keyword data

Export keyword performance for the last 14-30 days (use a longer window for low-volume campaigns). Include: impressions, clicks, conversions, cost, CPA/ROAS, Quality Score.

### 3.2 Apply the Keyword Decision Matrix

Classify every keyword with 50+ clicks into one of four quadrants using the framework from [Keyword Performance Analysis Mental Model](../mental-models/Keyword Performance Analysis Mental Model.md):

| Quadrant | Profile | Action |
|----------|---------|--------|
| **Q1: Protect and scale** | High volume, on-target efficiency | Protect position, increase bids/budget, expand impression share |
| **Q2: Fix relevance** | High volume, poor efficiency | Route to Quality Score, landing page, or ad copy fixes |
| **Q3: Increase visibility** | Low volume, good efficiency | Raise bids, broaden match type, increase impression share |
| **Q4: Diagnose or pause** | No/very few conversions, high spend | Diagnose root cause or pause after 2x target CPA spend |

### 3.3 Execute actions per quadrant

| Quadrant | Execution path |
|----------|----------------|
| Q1 | Protect: no changes needed. Scale: route to Phase 6 (bid/budget adjustments) |
| Q2 | Route to Phase 4 (Quality Score) or landing page improvements |
| Q3 | Increase bids by 10-15%, or expand match type. Monitor in next cycle |
| Q4 | Diagnose: check intent alignment, QS, landing page. Pause if no improvement path exists |

**Output:** Actions documented per keyword group. Q2 keywords flagged for Phase 4.

---

## Phase 4️⃣: Quality Score (bi-weekly)

### 4.1 Review QS distribution

Filter keywords to those with Quality Score below 7 and 100+ monthly impressions. These are the keywords where QS improvement delivers measurable CPC reduction.

> 💡 **Why QS 5 to 7 matters most:** Moving a keyword from QS 5 to QS 7 typically yields a 25%+ CPC reduction. Moving from QS 7 to QS 9 yields diminishing returns.

### 4.2 Classify QS sub-components

For each flagged keyword, check the three sub-components:

| Sub-component | If Below Average | Route to |
|---------------|------------------|----------|
| Expected CTR | Below Average | [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) |
| Ad Relevance | Below Average | [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) |
| Landing Page Experience | Below Average | [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) |

### 4.3 Route to the playbook

For keywords with multiple sub-component issues, use the full routing logic.

> ↪️ **Execute via:** [Improve Quality Score](../playbooks/Improve Quality Score.md)

**Output:** QS improvement actions queued with specific sub-component targets.

---

## Phase 5️⃣: Ad testing (monthly)

### 5.1 Review RSA performance

Pull asset-level performance data. Evaluate headlines and descriptions using CPI/RPI custom columns, not Ad Strength score.

> ⚠️ **Ignore Ad Strength:** Ad Strength measures Google's opinion of asset diversity, not conversion performance. A "Poor" Ad Strength RSA can outperform an "Excellent" one.

### 5.2 Run the Iteration Loop diagnosis

Classify assets into the four performance quadrants (Champions, Hidden Gems, Silent Killers, Trash) and take the appropriate action for each.

> ↪️ **Execute via:** [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md), Pillars 2-4.

### 5.3 Replace underperformers

Remove Silent Killers immediately. Replace Trash assets with new hypothesis-driven variants. Increase exposure for Hidden Gems.

**Output:** Ad variants replaced, learning log updated, next test hypotheses documented.

---

## Phase 6️⃣: Bid and budget (every cycle)

### 6.1 Check impression share losses

For every campaign, review:

| Metric | Action threshold |
|--------|-----------------|
| IS Lost (Budget) > 20% | Campaign is budget-constrained. Route to budget resolution |
| IS Lost (Rank) > 30% | Bid or Quality Score issue. Route to bid adjustment or Phase 4 |

### 6.2 Review bid strategy health

Check learning status (investigate if "Learning" for 14+ days), target alignment (do bid targets still match business goals?), and conversion volume (Smart Bidding needs 30+ conversions/month to function well).

### 6.3 Handle budget-limited campaigns

If any campaign shows "Limited by budget" status:

> ↪️ **Execute via:** [SOP – Handle Budget-Limited Campaigns](../sops/SOP – Handle Budget-Limited Campaigns.md)

### 6.4 Adjust targets if needed

When adjusting bid targets, move in 5-20% increments. Never make large jumps: they trigger Learning periods and introduce volatility.

**Output:** Budget and bid adjustments documented with rationale.

---

## Phase 7️⃣: Extension review (monthly)

### 7.1 Audit extension coverage

Check that all campaigns have the core extension types deployed and performing.

### 7.2 Replace underperforming extensions

> ↪️ **Execute via:** [SOP – Review and Optimize Ad Extensions](../sops/SOP – Review and Optimize Ad Extensions.md)

**Output:** Extension gaps filled, underperformers replaced.

---

## Phase 8️⃣: Competitive check (monthly)

### 8.1 Review Auction Insights

Pull Auction Insights for the last 30 days. Compare to the previous 30-day period.

### 8.2 Identify shifts and decide on response

Look for new competitor entries, impression share shifts, and changes in overlap or position above rate. Route through the full analysis framework.

> ↪️ **Execute via:** [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md)

Most competitive movements do not require a response if your KPIs remain on target. Only act when competitive shifts directly impact your conversion volume or cost targets.

**Output:** Competitive changes noted. Action items created only when KPIs are affected.

---

## Phase 9️⃣: Documentation (every cycle)

### 9.1 Record all actions taken

Document every action from this cycle: date, campaigns reviewed, issues found (with bucket classification), negatives added, keywords promoted, keyword quadrant actions, QS actions queued, ad changes made, bid/budget changes, extension changes, and competitive notes.

### 9.2 Create carry-forward items

Any unfinished work or items that need monitoring goes on the carry-forward list for the next cycle with priority (P1/P2/P3) and target date.

### 9.3 Update experiment backlog

Add any new test ideas discovered during this cycle to the experiment backlog. Tag each idea with the phase it originated from.

**Output:** Documented review with action log, carry-forward items, and updated experiment backlog.

---

## Validation & definition of done

This SOP is complete when:

- [ ] Phase 1: Health checklist run, issues classified by Five Buckets, blockers resolved
- [ ] Phase 2: Search terms reviewed, negatives added, promotions executed
- [ ] Phase 3: Keywords classified by Decision Matrix, actions taken per quadrant
- [ ] Phase 4: QS distribution reviewed, improvement actions queued (if bi-weekly cycle)
- [ ] Phase 5: RSA performance reviewed, Silent Killers removed (if monthly cycle)
- [ ] Phase 6: Impression share losses checked, budget/bid adjustments made
- [ ] Phase 7: Extension coverage audited, underperformers replaced (if monthly cycle)
- [ ] Phase 8: Auction Insights reviewed, competitive shifts noted (if monthly cycle)
- [ ] Phase 9: All actions documented, carry-forward items logged

---

## Exit → entry bridge

After completing the optimization cycle:

| Timeframe | Action |
|-----------|--------|
| Same day | Execute P1 actions from carry-forward list |
| This week | Complete in-progress QS and ad testing tasks |
| Next cycle | Review carry-forward items first, then start Phase 1 |

**If issues require escalation:**

| Issue type | Route to |
|------------|----------|
| Performance anomaly between cycles | [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) |
| Budget reallocation across campaigns | [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) |
| New campaign needed | [SOP – Launch a Search Campaign](../sops/SOP – Launch a Search Campaign.md) |
| Experiment required to validate a change | [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) |
| Campaign or ad group structure needs rework | [SOP – Review and Optimize Campaign Structure](../sops/SOP – Review and Optimize Campaign Structure.md) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Skipping Phase 1 | "Everything looks fine" assumption | Run the checklist every cycle, no exceptions |
| Running all 9 phases every cycle | Trying to be thorough | Follow the cadence column: Phases 4, 5, 7, 8 are not weekly tasks |
| Optimizing Creative while Measurement is broken | Ignoring bucket hierarchy | Always classify issues by Five Buckets before acting |
| Making bid changes and ad changes in the same cycle | Confounding variables | Separate bid changes (Phase 6) from ad changes (Phase 5) by at least one cycle |
| No carry-forward list | Relying on memory | Phase 9 is mandatory, not optional |
| Reacting to single-cycle data | Weekly noise | Confirm trends across 2+ cycles before major action |

---

## Related documents

| Document | Type | Phase |
|----------|------|-------|
| [Search Campaign Health Checklist](../checklists/Search Campaign Health Checklist.md) | Checklist | 1 |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Mental Model | All |
| [Optimization Action Catalog](../catalogs/Optimization Action Catalog.md) | Catalog | All |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | SOP | 2 |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | SOP | 2 |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | SOP | 2 |
| [Keyword Performance Analysis Mental Model](../mental-models/Keyword Performance Analysis Mental Model.md) | Mental Model | 3 |
| [Improve Quality Score](../playbooks/Improve Quality Score.md) | Playbook | 4 |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | SOP | 5 |
| [SOP – Handle Budget-Limited Campaigns](../sops/SOP – Handle Budget-Limited Campaigns.md) | SOP | 6 |
| [SOP – Review and Optimize Ad Extensions](../sops/SOP – Review and Optimize Ad Extensions.md) | SOP | 7 |
| [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md) | SOP | 8 |
| [SOP – Review and Optimize Campaign Structure](../sops/SOP – Review and Optimize Campaign Structure.md) | SOP | Structure optimization |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Mental Model | Structure context |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Mental Model | Campaign structure |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Mental Model | Ad group structure |

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