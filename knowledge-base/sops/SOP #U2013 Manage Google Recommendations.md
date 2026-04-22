# SOP – Manage Google Recommendations
Created: 2026-02-11

Agent_Executable: No
Category: Compliance
Human_Approval_Required: No
Primary Outcome: All outstanding recommendations reviewed, actioned (applied or dismissed), and documented
SOP_ID: SOP_65
Secondary Outcomes: Auto-apply settings verified, optimization score maintained without compromising strategy
Status: Done
Domain: Operational
Pillar: 0

## Purpose

This SOP guides you through a structured review of Google Ads recommendations, ensuring you maintain control over your account while extracting value from genuinely useful suggestions.

> ❓ **The big question:** Which of Google's recommendations should I apply, which should I dismiss, and how do I maintain a healthy optimization score without losing strategic control?

Google's recommendations serve Google's interests first and yours second. This SOP ensures you evaluate each recommendation against your strategy before taking action.

---

## What this SOP is NOT

This SOP does **not:**

- Document recommendation types and mechanics (See: [Google Recommendations Reference](../references/Google Recommendations Reference.md))
- Define the enable/disable policy for each category (See: [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md))
- Replace strategic campaign decisions with recommendation-driven changes

## When to run this SOP

Run this SOP:

- Monthly as part of the monthly performance review
- Before meetings with Google account representatives
- When optimization score drops significantly (if score maintenance is required by stakeholders)
- When a new recommendation type appears that you haven't evaluated

---

## Before you start

### Required inputs

- Google Ads account access
- Current campaign strategy and goals
- Knowledge of recent account changes

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Google Recommendations Reference](../references/Google Recommendations Reference.md) | Understanding recommendation types |
| [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md) | Enable/disable decisions |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Auto-apply audit** | Verify auto-apply is disabled | Confirmed settings |
| **Phase 2️⃣: Review by category** | Evaluate each outstanding recommendation | Apply/dismiss decisions |
| **Phase 3️⃣: Score management** | Maintain acceptable optimization score | Updated score |
| **Phase 4️⃣: Document** | Record decisions and rationale | Monthly recommendation log |

---

## Phase 1️⃣: Auto-Apply Audit (3 min)

### 1.1 Check auto-apply settings

1. Navigate to Recommendations page
2. Click "Auto-apply" (top right)
3. Verify status against the guideline:

| Category | Expected status |
|----------|----------------|
| Ads and Assets | OFF |
| Automated Campaigns | OFF |
| Bidding and Budgets | OFF |
| Keywords and Targeting | OFF |
| Repairs | OFF (or selective per guidelines) |

### 1.2 Check for auto-applied changes

1. Navigate to Change History
2. Filter by source: "Auto-applied recommendation"
3. Filter date range: last 30 days
4. Review any auto-applied changes

| If auto-applied changes found | Action |
|------------------------------|--------|
| Changes align with strategy | Note and continue |
| Changes conflict with strategy | Revert the changes, verify auto-apply is disabled |

---

## Phase 2️⃣: Review by Category (15 min)

### 2.1 Review Repairs first

Repairs are the most likely to be genuinely useful. Review each:

| Recommendation | Relevant? | Action | Notes |
|---------------|-----------|--------|-------|
| ___ | Yes / No | Apply / Dismiss | ___ |

**Apply repairs when:** The fix is straightforward and the issue is real (disapproved ads, missing conversion parameters, conflicting negatives).

**Dismiss repairs when:** The "issue" is intentional (e.g., ad group with no keywords in a DSA campaign).

### 2.2 Review Bidding and Budgets

Evaluate each recommendation against your current strategy:

| Recommendation | Current state | Google suggests | Aligns with strategy? | Action |
|---------------|--------------|-----------------|----------------------|--------|
| ___ | ___ | ___ | Yes / No | Apply / Dismiss |

**Apply when:** The suggestion aligns with a change you were already planning to make.

**Dismiss when:** It pushes toward higher spend or looser targets without business justification.

### 2.3 Review Keywords and Targeting

| Recommendation | Risk level | Aligns with strategy? | Action |
|---------------|-----------|----------------------|--------|
| ___ | Low / Med / High | Yes / No | Apply / Dismiss |

**Apply when:** Suggested keywords match your research, or negative keyword conflicts are genuinely blocking desired traffic.

**Dismiss when:** Suggestions push broad match expansion, audience widening, or Search Partner enablement without strategic justification.

### 2.4 Review Ads and Assets

| Recommendation | Impact on messaging? | Aligns with creative strategy? | Action |
|---------------|---------------------|-------------------------------|--------|
| ___ | Yes / No | Yes / No | Apply / Dismiss |

**Apply when:** The suggestion adds a genuinely useful asset (e.g., sitelinks you planned to create).

**Dismiss when:** It pushes dynamic assets, auto-generated text, or AI-modified copy that doesn't match your messaging strategy.

### 2.5 Review Automated Campaigns

**Default action: Dismiss all:** Creating new campaign types (Performance Max, AI Max) is a strategic decision, not an auto-apply action.

---

## Phase 3️⃣: Score Management (5 min)

### 3.1 Check current optimization score

Note the current score and compare to last month.

### 3.2 Manage score strategically

Dismissing a recommendation increases your optimization score by the same amount as applying it. Use this to maintain score without compromising strategy:

1. For recommendations you disagree with: **Dismiss** (score increases)
2. For recommendations you agree with: **Apply** (score increases)
3. For recommendations you need to evaluate: **Leave** (no score change)

> 💡 **If stakeholders or Google reps pressure you on optimization score:** Dismiss irrelevant recommendations rather than implementing them. A high score is achievable without adopting Google's suggestions.

### 3.3 Document score

| Month | Score before review | Score after review | Applied | Dismissed | Left |
|-------|--------------------|--------------------|---------|-----------|------|
| [Current] | ___% | ___% | ___ | ___ | ___ |

---

## Phase 4️⃣: Document (5 min)

### 4.1 Record monthly recommendation log

```
Recommendation Review — [Month Year]
Account: [Name]

AUTO-APPLY STATUS: All disabled / [Issues found]

RECOMMENDATIONS REVIEWED: [Count]
- Applied: [Count] — [Brief list]
- Dismissed: [Count] — [Brief list]
- Left for next month: [Count]

OPTIMIZATION SCORE: ___% → ___%

NOTABLE FINDINGS:
- [Any new recommendation types or unusual suggestions]

AUTO-APPLIED CHANGES (last 30 days): [Count]
- [Details if any]
```

---

## Validation & definition of done

This SOP is complete when:

- [ ] Auto-apply settings verified (all disabled per guidelines)
- [ ] All outstanding recommendations reviewed
- [ ] Each recommendation either applied, dismissed, or deferred with rationale
- [ ] Auto-applied changes from last 30 days reviewed
- [ ] Optimization score noted
- [ ] Monthly recommendation log documented

---

## Exit → Entry bridge

After recommendation review:

| Timeframe | Action |
|-----------|--------|
| Same review | Incorporate applied recommendations into performance tracking |
| Next weekly review | Monitor impact of any applied recommendations |
| Next monthly review | Compare score and recommendation patterns |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Google Recommendations Reference](../references/Google Recommendations Reference.md) | Reference | Phase 2 (understanding types) |
| [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md) | Guideline | Phase 1-2 (enable/disable decisions) |
| [Account Change History Reference](../references/Account Change History Reference.md) | Reference | Phase 1 (auto-applied changes) |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) | Parent (recommendation review is one section of monthly review) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Applying recommendations without evaluation | Pressure to increase optimization score | Review against strategy first, dismiss if misaligned |
| Ignoring auto-applied changes | Assumption that auto-apply is disabled | Check Change History monthly for auto-applied changes |
| Not dismissing irrelevant recommendations | Fear of losing "good" score | Dismissing and applying both increase score equally |
| Applying budget increases without business context | Google frames it as "opportunity" | Verify budget increases align with business capacity |
| Skipping the monthly review | "Recommendations are mostly junk" | Even junk recommendations affect score and may auto-apply |

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
