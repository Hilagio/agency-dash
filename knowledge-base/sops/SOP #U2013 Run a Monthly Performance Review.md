# SOP – Run a Monthly Performance Review
Created: 2026-02-11
Updated: 2026-04-02

Agent_Executable: No
Category: Reporting
Human_Approval_Required: No
Primary Outcome: Monthly performance assessment with recalibrated baselines and strategic action plan
SOP_ID: SOP_64
Secondary Outcomes: Conversion tracking verified, competitive landscape updated, settings drift corrected
Status: Done
Domain: Reporting
Pillar: 0

## Purpose

This SOP guides you through a comprehensive monthly performance review that extends the weekly review with strategic analysis, baseline recalibration, and structural health checks.

> ❓ **The big question:** Are we on trajectory to hit our goals, and do our baselines, thresholds, and strategy still reflect reality?

Monthly reviews bridge tactical weekly reviews and strategic quarterly reviews. They catch slow-moving issues (settings drift, tracking drift, competitive shifts) that weekly reviews miss.

---

## What this SOP is NOT

This SOP does **not:**

- Replace weekly reviews (See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))
- Cover daily monitoring (See: [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md))
- Provide full quarterly strategic reset (See: [SOP – Run a Quarterly Business Review](../sops/SOP – Run a Quarterly Business Review.md))

## When to run this SOP

Run this SOP:

- First week of each month
- At the end of each quarter (combined with quarterly strategic review)
- When onboarding a new account (initial baseline establishment)

---

## Before you start

### Required inputs

- Completed weekly reviews for the past month
- Backend data (CRM, analytics, ecommerce platform) for conversion verification
- Target KPIs and business goals
- Previous month's review document (for trend comparison)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Monthly Performance Review Checklist](../checklists/Monthly Performance Review Checklist.md) | Check items |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Analysis framework |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Monthly cadence scope |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metric interpretation |

### Time allocation

| Section | Time |
|---------|------|
| Phase 1: Performance trends | 15 min |
| Phase 2: Tracking and data integrity | 10 min |
| Phase 3: Competitive landscape | 10 min |
| Phase 4: Settings and structure audit | 15 min |
| Phase 5: Baseline recalibration | 10 min |
| Phase 6: Action plan | 10 min |
| **Total** | **70 min** |

> ⚠️ **Time-box to 90 minutes maximum:** Monthly reviews are deeper than weekly but should not become open-ended analysis sessions. Focus on decisions, not exhaustive data review.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Performance trends** | Assess 30-day performance against goals | Performance status and trajectory |
| **Phase 2️⃣: Tracking and data integrity** | Verify conversion data accuracy | Tracking health assessment |
| **Phase 3️⃣: Competitive landscape** | Identify competitive shifts | Competitive landscape update |
| **Phase 4️⃣: Settings and structure** | Catch drift and structural issues | Settings audit findings |
| **Phase 5️⃣: Baseline recalibration** | Update thresholds if needed | Recalibrated baselines |
| **Phase 6️⃣: Action plan** | Prioritize strategic actions for next month | Monthly action plan |

---

## Phase 1️⃣: Performance Trends (15 min)

### 1.1 Month-over-month comparison

1. Set date range to the past full month
2. Compare to the prior month
3. Record primary KPIs:

| KPI | This month | Last month | Change | vs. Target | Status |
|-----|-----------|-----------|--------|------------|--------|
| Conversions | ___ | ___ | ___% | ___ | 🟢🟡🔴 |
| CPA / ROAS | ___ | ___ | ___% | ___ | 🟢🟡🔴 |
| Spend | ___ | ___ | ___% | ___ | 🟢🟡🔴 |
| Conv. value | ___ | ___ | ___% | ___ | 🟢🟡🔴 |

### 1.2 Year-over-year comparison (if available)

Compare the same month to the prior year to account for seasonality:

| KPI | This month | Same month last year | YoY change |
|-----|-----------|---------------------|------------|
| Conversions | ___ | ___ | ___% |
| CPA / ROAS | ___ | ___ | ___% |
| Spend | ___ | ___ | ___% |

### 1.3 Trajectory assessment

Based on the first X months of the year, project full-year performance:

| KPI | Annual target | YTD actual | YTD pace | Projected year-end | On track? |
|-----|--------------|-----------|----------|-------------------|-----------|
| Revenue | ___ | ___ | ___% | ___ | Yes / No |
| Profit | ___ | ___ | ___% | ___ | Yes / No |

### 1.4 Campaign-level review

1. Identify top 5 campaigns by spend
2. For each, note CPA/ROAS vs. target
3. Identify bottom 3 campaigns by efficiency
4. Document candidates for budget reallocation

---

## Phase 2️⃣: Tracking and Data Integrity (10 min)

### 2.1 Google Ads vs. backend comparison

1. Export Google Ads conversion data for the month
2. Compare to backend data (CRM conversions, ecommerce transactions, analytics)
3. Calculate discrepancy:

| Source | Conversions | Revenue | Discrepancy % |
|--------|------------|---------|---------------|
| Google Ads | ___ | ___ | — |
| Backend | ___ | ___ | — |
| **Discrepancy** | — | — | ___% |

**Acceptable ranges:**

| Discrepancy | Status | Action |
|-------------|--------|--------|
| <10% | Normal | No action |
| 10-20% | Monitor | Investigate if trending up |
| >20% | Issue | Diagnose and fix tracking |

### 2.2 Conversion action health

1. Navigate to Goals > Conversions > Summary
2. Verify all primary and secondary conversion actions are active
3. Check conversion action settings (window, counting method, value)
4. Note any conversion actions with warnings

### 2.3 Enhanced conversions check (if applicable)

1. Check enhanced conversions match rate
2. Verify offline conversion import pipeline (if used)
3. Note any data quality issues

---

## Phase 3️⃣: Competitive Landscape (10 min)

### 3.1 Run Auction Insights analysis

Follow [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md) for a full competitive analysis, or perform a quick version:

1. Pull Auction Insights at campaign level for the past month
2. Compare to prior month
3. Note:
   - Your IS trend: ↑ / → / ↓
   - Any new competitors
   - Any competitor disappearances
   - CPC trend correlation with competitor activity

### 3.2 Merchant Center competitive data (ecommerce)

1. Check Price Competitiveness report in Merchant Center
2. Note categories where you are price-competitive vs. not
3. Check Market Demand data for trending products

---

## Phase 4️⃣: Settings and Structure Audit (15 min)

### 4.1 Campaign settings verification

For each active campaign, verify:

- [ ] Location targeting unchanged from intended
- [ ] Network settings correct (Search Partners, Display Network)
- [ ] Ad rotation set to "Optimize"
- [ ] Language targeting correct
- [ ] Conversion goals aligned with intended actions

### 4.2 Auto-applied changes review

1. Open Change History
2. Filter by source: "Auto-applied recommendation" and "System"
3. Review all automated changes from the past month
4. Revert any changes that conflict with your strategy

### 4.3 Google Recommendations review

1. Navigate to Recommendations page
2. Review all outstanding recommendations
3. Dismiss recommendations that conflict with strategy
4. Apply recommendations that align with strategy
5. Verify auto-apply settings are disabled per [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md)

### 4.4 Structure assessment

1. Identify campaigns with fewer than 30 conversions/month
2. Assess consolidation opportunities
3. Identify ad groups with low impression volume
4. Note structural changes for next quarter's plan

---

## Phase 5️⃣: Baseline Recalibration (10 min)

### 5.1 Assess current thresholds

Review your Status Board thresholds (green/orange/red):

| Metric | Current green threshold | Actual average | Recalibrate? |
|--------|------------------------|----------------|--------------|
| CPA | < $__ | $__ | Yes / No |
| ROAS | > ___% | ___% | Yes / No |
| CVR | > ___% | ___% | Yes / No |
| CTR | > ___% | ___% | Yes / No |

### 5.2 Adjust thresholds

If performance has consistently exceeded or fallen below current thresholds for 2+ months:
- Raise the bar if consistently green (don't settle)
- Lower the bar if consistently red due to market changes (be realistic)
- Document the change and rationale

### 5.3 Validate targets

1. Confirm CPA/ROAS targets still align with business goals
2. Confirm budget targets are realistic given competitive landscape
3. Adjust targets if business conditions changed

---

## Phase 6️⃣: Action Plan (10 min)

### 6.1 Prioritize actions

| Priority | Action | Owner | Due | Source |
|----------|--------|-------|-----|--------|
| P1 | ___ | ___ | ___ | Phase __ finding |
| P2 | ___ | ___ | ___ | Phase __ finding |
| P3 | ___ | ___ | ___ | Phase __ finding |

### 6.2 Update constraint and sprint

1. Review current active Constraint per account
2. Assess if the Constraint has moved (resolved, improved, or stalled)
3. Decide: keep current Constraint or select new one
4. Update Sprint tasks for next month

### 6.3 Document the review

```
Monthly Performance Review — [Month Year]
Account: [Name]
Reviewer: [Name]

PERFORMANCE SUMMARY
Overall status: 🟢🟡🔴
Trajectory: On track / Off track / At risk
Key finding: [One sentence]

TRACKING HEALTH
Discrepancy: ___% (OK / Monitor / Issue)
Conversion actions: All active / [Issues]

COMPETITIVE LANDSCAPE
IS trend: ↑ / → / ↓
Notable movements: [Summary]

SETTINGS AUDIT
Drift found: Yes / No
Auto-applied changes: [Count] reviewed, [count] reverted

BASELINE CHANGES
[Any threshold adjustments]

ACTION PLAN
P1: [Action] — [Owner] — [Due]
P2: [Action] — [Owner] — [Due]
P3: [Action] — [Owner] — [Due]

CONSTRAINT STATUS
Current: [Constraint] in [Bucket]
Status: Active / Resolved / Updated to [New constraint]
```

---

## Validation & definition of done

This SOP is complete when:

- [ ] Month-over-month and YoY performance assessed
- [ ] Tracking integrity verified against backend
- [ ] Competitive landscape reviewed
- [ ] Campaign settings verified, auto-applied changes reviewed
- [ ] Baselines recalibrated if needed
- [ ] Action plan documented with priorities
- [ ] Monthly review document completed

---

## Exit → Entry bridge

After monthly review:

| Timeframe | Action |
|-----------|--------|
| This week | Execute P1 actions |
| This month | Execute P2 actions, monitor P1 results |
| Next monthly review | Compare against this month's findings |

**If significant issues found:**

| Issue | Route to |
|-------|----------|
| Tracking discrepancy >20% | Conversion tracking investigation |
| Competitive pressure increasing | Strategic review with stakeholders |
| Performance off trajectory | Constraint sprint reassessment |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Monthly Performance Review Checklist](../checklists/Monthly Performance Review Checklist.md) | Checklist | All phases |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Mental Model | Phase 1 |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Mental Model | Cadence context |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference | Phase 1-2 |
| [Auction Insights Reference](../references/Auction Insights Reference.md) | Reference | Phase 3 |
| [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md) | Guideline | Phase 4 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Upstream (weekly reviews feed monthly review) |
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Upstream (daily flags feed monthly review) |
| [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md) | Nested (competitive analysis as part of Phase 3) |
| [SOP – Manage Google Recommendations](../sops/SOP – Manage Google Recommendations.md) | Nested (recommendation review as part of Phase 4) |
| [SOP – Run a Quarterly Business Review](../sops/SOP – Run a Quarterly Business Review.md) | Downstream (quarterly review builds on 3 monthly reviews) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Monthly review becomes a repeat of weekly reviews | Not going deeper into strategic dimensions | Use the Monthly Performance Review Checklist to ensure broader scope |
| Skipping tracking verification | "Tracking was fine last month" | Verify every month: tracking drift is gradual |
| Not updating baselines | Thresholds become stale | Force threshold review every month |
| No documentation | Review insights are lost | Use the documentation template every time |
| Review takes 3+ hours | Trying to cover everything | Time-box to 90 minutes, prioritize top issues |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v2.0: Linked quarterly forward reference to published QBR SOP, added to Related SOPs table

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
