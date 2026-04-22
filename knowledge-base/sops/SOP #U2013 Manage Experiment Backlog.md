# SOP – Manage Experiment Backlog
Created: 2026-02-14
Updated: 2026-04-02

SOP_ID: SOP_87
Status: Done
Category: Reporting
Primary Outcome: Experiment backlog maintained with scored items, top experiments scheduled into optimization cadence, results documented
Agent_Executable: No
Human_Approval_Required: No
Domain: Testing
Pillar: 0

## Purpose

This SOP guides you through capturing experiment ideas, scoring them for priority, scheduling experiments into your optimization cadence, and documenting results so learnings compound over time.

> ❓ **The big question:** Which experiments should I run next, and how do I make sure nothing gets lost between cycles?

A backlog without a process becomes a graveyard of good ideas. This SOP turns scattered test ideas into a ranked pipeline that feeds your Constraint Sprints and optimization cadence with the highest-value experiments first.

---

## What this SOP is NOT

This SOP does **not:**

- Explain how to run an individual experiment (See: [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md))
- Teach the testing decision framework (See: [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md))
- Detail experiment configuration options (See: [Experiment Configuration Reference](../references/Experiment Configuration Reference.md))
- Cover optimization prioritization theory (See: [Optimization prioritization & sequencing](../theory/Optimization prioritization & sequencing.md))
- Define the Sprint methodology (See: [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md))

## When to run this SOP

| Trigger | Frequency | Scope |
|---------|-----------|-------|
| Capture new ideas | Every optimization cycle (weekly or bi-weekly review) | Add items as discovered |
| Score and prioritize | After each capture session | Score new items, re-score changed items |
| Select experiments | Start of each Constraint Sprint or monthly planning | Pick top-scored items for execution |
| Document results | When any experiment concludes | Record outcome within 48 hours |
| Full backlog review | Monthly | Re-score all items, archive completed, align with stakeholders |

---

## Before you start

### Required inputs

- Access to your optimization backlog (spreadsheet, project tool, or structured document)
- Current Constraint Sprint focus and active constraint bucket
- Latest weekly or monthly performance review notes
- Results from any recently concluded experiments
- Stakeholder input on business priorities (if available)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Optimization prioritization & sequencing](../theory/Optimization prioritization & sequencing.md) | ICE scoring framework |
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Deciding what deserves a formal experiment |
| [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md) | Sprint planning connection |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Review rhythm for scheduling |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Feasibility check for experiment types |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Capture** | Collect experiment ideas from every optimization cycle | Updated backlog with new items |
| **Phase 2️⃣: Score** | Apply ICE scoring to prioritize items | Ranked backlog |
| **Phase 3️⃣: Select** | Choose experiments for current period | Experiment shortlist |
| **Phase 4️⃣: Schedule** | Map selected experiments into optimization cadence | Calendar-ready experiment plan |
| **Phase 5️⃣: Document** | Record results and learnings from concluded experiments | Completed experiment records |
| **Phase 6️⃣: Monthly review** | Re-score backlog, archive old items, align with stakeholders | Refreshed backlog |

---

## Phase 1️⃣: Capture new experiment ideas

### 1.1 Identify sources of experiment ideas

During every optimization cycle (weekly review, monthly review, Sprint evaluation), capture any observation that could become a test hypothesis. Do not filter yet: write everything down.

| Source | What to look for |
|--------|-----------------|
| Weekly performance review | Metrics below target that suggest a testable change |
| Search term analysis | Query patterns suggesting targeting or structure tests |
| Competitor activity | Auction insights shifts that suggest bid strategy tests |
| Landing page metrics | CVR differences across pages suggesting LP tests |
| Stakeholder feedback | Business changes that affect campaign strategy |
| Sprint evaluation | Partially resolved constraints that need further testing |
| Ad performance | RSA asset combinations suggesting creative direction tests |
| Industry research | New features, strategies, or approaches worth validating |

### 1.2 Write the backlog entry

For each idea, capture these fields:

**Status values:**

| Status | Meaning |
|--------|---------|
| New | Captured but not yet prioritized |
| Ready | Prioritized and approved for next available slot |
| Running | Experiment is live |
| Complete | Results analyzed and documented |
| Cancelled | Dropped (reason documented) |

```
BACKLOG ENTRY
=============
ID: [Sequential number]
Date added: [Date]
Source: [Where you found this idea]
Account: [Account name]
Campaign(s): [Affected campaigns]
Constraint bucket: [Measurement / Business / Conversion / Traffic / Creative]
Hypothesis: If we [change X], then [metric Y] will [direction] by [estimated %]
              because [rationale].
Status: New
```

> ⚠️ **Write a proper hypothesis.** "Test new landing page" is not a backlog item. "Switching the Brand campaign landing page from homepage to a dedicated product page will increase CVR by 20% because the current homepage has a 78% bounce rate on Brand traffic" is a backlog item.

### 1.3 Check for duplicates

Before adding, scan the existing backlog for similar items. If a related hypothesis already exists, update the existing entry with new supporting evidence rather than creating a duplicate.

---

## Phase 2️⃣: Score and prioritize backlog items

### 2.1 Apply ICE scoring

Score every new or changed backlog item on three dimensions. Use the same framework from [Optimization prioritization & sequencing](../theory/Optimization prioritization & sequencing.md):

**Impact (1-3): How much will this move the bottleneck metric if it works?**

| Score | Meaning | Example |
|-------|---------|---------|
| 3 | Directly moves the primary constraint metric | Bid strategy test on highest-spend campaign |
| 2 | Indirectly supports the constraint or moves a secondary metric | Audience test on a supporting campaign |
| 1 | Nice to have, marginal improvement | Ad scheduling test on a low-spend campaign |

**Confidence (1-3): How sure are you this will actually work?**

| Score | Meaning | Example |
|-------|---------|---------|
| 3 | Proven pattern, clear data supports it, done it before | Switching to tCPA after 60+ conversions/month |
| 2 | Reasonable hypothesis, some supporting data | New LP based on heatmap data showing friction |
| 1 | Speculative, worth trying but uncertain | Testing a completely new campaign structure |

**Effort (1-3): How much time and resources does this require?**

| Score | Meaning | Example |
|-------|---------|---------|
| 1 | Under an hour, simple configuration change | Target CPA adjustment test |
| 2 | Half-day to full-day, requires setup work | Landing page A/B test with existing page |
| 3 | Major project, multiple days or external dependencies | New landing page build + experiment setup |

### 2.2 Calculate priority score

**Priority score = (Impact x Confidence) / Effort**

| Score range | Classification | Action |
|-------------|---------------|--------|
| 4.5 - 9.0 | High priority | Schedule for next available slot |
| 2.0 - 4.4 | Medium priority | Queue for upcoming Sprint |
| 0.1 - 1.9 | Low priority | Keep on backlog, revisit monthly |

### 2.3 Apply constraint hierarchy filter

Even a high-scoring experiment gets deprioritized if it targets a downstream bucket while an upstream constraint is active. The hierarchy always applies: Measurement > Business > Conversion > Traffic > Creative.

| If active constraint is... | Then prioritize experiments in... | Defer experiments in... |
|---------------------------|----------------------------------|------------------------|
| Measurement | Measurement only | All others |
| Business | Business (Measurement resolved) | Conversion, Traffic, Creative |
| Conversion | Conversion (upstream resolved) | Traffic, Creative |
| Traffic | Traffic (upstream resolved) | Creative |
| Creative | Creative (all upstream resolved) | None |

> 💡 **Quick wins are the exception:** If you spot a high-score, low-effort experiment in a downstream bucket, you can run it during maintenance time without making it your Sprint focus. The hierarchy governs Sprint planning, not every small action.

### 2.4 Update the ranked backlog

Sort all active items by priority score (highest first), then by constraint alignment. Your backlog should look like this:

```
EXPERIMENT BACKLOG
==================
Account: [Name]
Last scored: [Date]
Active constraint: [Bucket + metric]

| Rank | ID | Hypothesis (short) | Bucket | I | C | E | Score | Status |
|------|----|--------------------|--------|---|---|---|-------|--------|
| 1    | 12 | mCPC on Brand camp  | Traffic | 3 | 3 | 1 | 9.0  | Ready  |
| 2    | 08 | New LP for Product  | Conv.  | 3 | 2 | 2 | 3.0  | Ready  |
| 3    | 15 | Audience expansion  | Traffic | 2 | 2 | 1 | 4.0  | New    |
| ...  |    |                    |        |   |   |   |       |        |
```

---

## Phase 3️⃣: Select experiments for current period

### 3.1 Check experiment capacity

Before selecting, verify how many experiments you can run simultaneously:

| Constraint | Limit |
|------------|-------|
| Active experiments per account | 5 maximum (Google Ads limit) |
| Experiments per campaign | 1 active at a time (best practice) |
| Recommended parallel experiments | 1-2 per account (to maintain focus) |
| Sprint alignment | Top-scored items in active constraint bucket first |

### 3.2 Apply the testing decision gate

For each top-ranked item, confirm it qualifies for a formal experiment using the [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md):

| Check | Requirement | If no... |
|-------|-------------|----------|
| High impact? | >10% potential effect on primary KPI | Implement directly, skip experiment |
| Genuinely uncertain? | Outcome not predictable from existing data | Implement directly, monitor |
| Sufficient volume? | 100+ conversions/month in target campaign | Make best-judgment decision, monitor |

### 3.3 Select 1-3 experiments

Pull the top-scored items that pass the testing gate and align with your active constraint. Mark them as "Selected" in the backlog.

```
SELECTED FOR THIS PERIOD
=========================
Sprint/Period: [Date range]
Active constraint: [Bucket + metric]

| ID | Hypothesis | Campaign | Priority score | Planned start |
|----|-----------|----------|----------------|---------------|
| 12 | mCPC on Brand | Brand - Search | 9.0 | [Date] |
| 08 | New LP for Product | Product - Search | 3.0 | [Date] |
```

---

## Phase 4️⃣: Schedule into optimization cadence

### 4.1 Map experiments to the calendar

Place selected experiments into your optimization rhythm, respecting these constraints:

| Rule | Rationale |
|------|-----------|
| Do not launch two experiments on the same campaign | Interaction effects invalidate both |
| Space launches 3-5 days apart across campaigns | Allows monitoring of initial delivery per experiment |
| Avoid launching during known seasonal peaks | Seasonal variation confounds results |
| Align start dates with Sprint start when possible | Keeps experiment focus tied to constraint work |

### 4.2 Block monitoring windows

For each scheduled experiment, add monitoring checkpoints to your cadence:

| Timeframe | Check | Where in cadence |
|-----------|-------|-----------------|
| Day 1 | Both arms receiving traffic | Daily triage |
| Day 2-3 | No delivery or policy issues | Daily triage |
| Weekly | Catastrophic failure check (>30% worse) | Weekly review |
| End date + lag | Full result analysis | Dedicated session |

### 4.3 Communicate with stakeholders

Before launching, confirm with relevant stakeholders:

| Stakeholder | Communication |
|-------------|---------------|
| Account team | Experiment plan, "do not touch" rules for test campaigns |
| Client/manager | What is being tested, expected duration, when results will be shared |
| Landing page team | If LP test: page readiness, no changes during test |

### 4.4 Document the experiment plan

For each experiment moving to execution, create a full plan using the template from [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md):

```
EXPERIMENT PLAN
===============
Backlog ID: [From backlog]
Name: [Descriptive name]
Campaign: [Campaign name]
Hypothesis: [Full hypothesis from backlog]

Success Criteria:
- Primary: [Metric] improves by [X%]
- Guardrails: [Metric] stays above [threshold]

Configuration:
- Traffic split: 50/50
- Duration: [X] days
- Start date: [Date]
- End date: [Date]

Decision rules:
- If significant + positive: Apply treatment
- If significant + negative: Keep control
- If not significant: [Decision]
```

---

## Phase 5️⃣: Document results and learnings

### 5.1 Record experiment results

Within 48 hours of an experiment concluding, document the outcome in your backlog and in a standalone results record:

```
EXPERIMENT RESULTS
==================
Backlog ID: [ID]
Name: [Experiment name]
Duration: [Start] to [End]
Result: [Treatment won / Control won / Inconclusive]

Results:
| Metric     | Control | Treatment | Diff  | Significant? |
|------------|---------|-----------|-------|--------------|
| [Primary]  | ___     | ___       | ___%  | Y/N          |
| [Guard 1]  | ___     | ___       | ___%  | Y/N          |
| [Guard 2]  | ___     | ___       | ___%  | Y/N          |

Conclusion:
[What we learned]

Applied:
[What action was taken]

Next action:
[Follow-up experiment, scale to other campaigns, or none]
```

### 5.2 Update the backlog

Change the item's status and add the result:

| Previous status | New status | When |
|----------------|------------|------|
| Selected / Running | Completed: Winner applied | Treatment won, applied to campaign |
| Selected / Running | Completed: Control kept | Control won or inconclusive |
| Selected / Running | Completed: Needs follow-up | Partial result, new hypothesis generated |

### 5.3 Generate follow-up items

Every completed experiment should trigger one of these actions:

| Outcome | Follow-up |
|---------|-----------|
| Clear winner | Add "Scale to similar campaigns" item to backlog |
| Inconclusive | Add "Re-test with higher volume or longer duration" item |
| Surprising loser | Add "Investigate why" item, potentially a new hypothesis |
| Partial winner | Add "Refine hypothesis and re-test" item |

### 5.4 Update the knowledge base

Maintain a running log of experiment learnings per account. This becomes institutional knowledge:

```
EXPERIMENT KNOWLEDGE BASE
==========================
Account: [Name]

| Date | Test | Result | Key learning | Applied to |
|------|------|--------|-------------|------------|
| 2026-01 | tCPA vs MaxConv (Brand) | tCPA won (-18% CPA) | Brand has stable enough volume for tCPA | All Brand campaigns |
| 2026-02 | New LP (Product) | Inconclusive | Need 4+ weeks at current volume | Re-test planned |
```

> 💡 **This log prevents re-testing what you already know:** Before adding any new experiment to the backlog, check the knowledge base for prior tests on the same variable.

---

## Phase 6️⃣: Monthly backlog review

### 6.1 Schedule the review

Run a full backlog review once per month, ideally aligned with your monthly performance review cycle. Time budget: 30-45 minutes per account.

### 6.2 Re-score all active items

Priorities shift as metrics change. An item scored Impact 1 last month may be Impact 3 now because you resolved a higher-priority constraint and exposed a new bottleneck.

For each active backlog item:

1. Confirm the hypothesis is still relevant (metric still below target, change still needed)
2. Update Impact score based on current constraint
3. Update Confidence score based on any new data
4. Update Effort score if circumstances changed
5. Recalculate priority score

### 6.3 Archive completed and irrelevant items

| Action | When |
|--------|------|
| Archive as "Completed" | Experiment ran, results documented |
| Archive as "Obsolete" | Hypothesis no longer relevant (metric improved, strategy changed) |
| Archive as "Duplicate" | Merged into another backlog item |
| Keep active | Still relevant, not yet tested |

### 6.4 Align with stakeholders

In your monthly review meeting, cover:

| Agenda item | Purpose |
|-------------|---------|
| Share experiment results from past month | Build confidence in testing process |
| Present top 3 backlog items for next month | Get buy-in on upcoming tests |
| Discuss new ideas from stakeholders | Capture business-driven test hypotheses |
| Review constraint alignment | Confirm experiments target the right problems |

### 6.5 Update backlog metrics

Track these numbers monthly to measure your testing program health:

| Metric | Target | Current |
|--------|--------|---------|
| Active backlog items | 10-25 per account | ___ |
| Experiments completed this month | 1-3 | ___ |
| Win rate (clear winner / total completed) | 30-50% | ___ |
| Average days from idea to test launch | <30 days for high-priority | ___ |
| Items older than 90 days without action | <5 | ___ |

---

## Validation / definition of done

This SOP is complete when:

- [ ] All new experiment ideas from the current cycle are captured with proper hypotheses
- [ ] New items are scored using ICE framework (Impact x Confidence / Effort)
- [ ] Backlog is sorted by priority score and filtered by constraint alignment
- [ ] Top experiments are selected and pass the testing decision gate
- [ ] Selected experiments are scheduled into the optimization cadence with monitoring windows
- [ ] All concluded experiments have documented results within 48 hours
- [ ] Knowledge base is updated with learnings
- [ ] Monthly review completed (if due): items re-scored, obsolete items archived, stakeholders aligned

---

## Exit → entry bridge

After backlog management:

| Output | Routes to |
|--------|-----------|
| Selected experiments ready to launch | [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) |
| Experiment results affecting Sprint planning | [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md) |
| New constraint identified from test results | Next weekly diagnosis and Sprint planning cycle |
| Stakeholder report on testing program | Monthly performance review documentation |

**Ongoing cadence:**

| Timeframe | Action |
|-----------|--------|
| Every optimization cycle | Capture new ideas (Phase 1) |
| After capture | Score and rank (Phase 2) |
| Start of Sprint or month | Select and schedule (Phase 3-4) |
| When experiment concludes | Document results (Phase 5) |
| Monthly | Full backlog review (Phase 6) |

---

## Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Optimization prioritization & sequencing](../theory/Optimization prioritization & sequencing.md) | Theory | Phase 2 (ICE scoring) |
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Mental Model | Phase 3 (testing gate) |
| [Constraint sprints and focused execution](../theory/Constraint sprints and focused execution.md) | Theory | Phase 3-4 (Sprint alignment) |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Mental Model | Phase 4 (scheduling) |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Reference | Phase 4 (feasibility) |
| [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) | SOP | Phase 4-5 (execution handoff) |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) | Downstream: executes individual experiments from this backlog |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Upstream: generates experiment ideas during reviews |
| [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) | Upstream: triggers monthly backlog review |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Ideas captured without hypotheses | Rushed during review | Enforce hypothesis template for every entry |
| Backlog grows without action | No selection discipline | Select 1-3 experiments every Sprint/month |
| Same experiments re-proposed | No knowledge base | Check knowledge base before adding new items |
| Experiments not tied to constraints | Testing what seems interesting | Apply constraint hierarchy filter before selecting |
| Results not documented | Moved on to next task | Document within 48 hours, make it a Sprint deliverable |
| Stakeholders surprised by tests | No communication step | Monthly alignment meeting covers upcoming experiments |
| Backlog becomes stale | No monthly review cadence | Calendar the monthly review as a recurring event |
| Scoring feels arbitrary | First time using ICE framework | Calibrate by scoring 5 past experiments you already ran |

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
