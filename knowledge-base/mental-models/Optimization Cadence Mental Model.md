# Optimization Cadence Mental Model
Created: 2026-02-11

Support_ID: MENTALMODEL_27
Status: ready-to-publish
Category: Reporting
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Reporting
Pillar: 0

## Purpose

This mental model helps you establish the right optimization rhythm for any Google Ads account, so you check the right things at the right frequency and avoid both neglect and over-optimization.

> ❓ **The core question:** What should I check daily, weekly, bi-weekly, monthly, and quarterly, and how does account context change the cadence?

Optimization is not about checking everything every day. It's about matching check frequency to data velocity: fast-moving metrics get checked often, slow-moving metrics get checked less. The wrong cadence creates either missed problems (too infrequent) or noise-driven reactions (too frequent).

---

## What this is NOT

This mental model does **not:**

- Define what specific metrics to track (See: [Reporting Mental Model](../mental-models/Reporting Mental Model.md))
- Provide the overarching monitoring framework (See: [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md))
- Provide step-by-step review procedures (See: [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md))
- Cover diagnostic root cause analysis (See: [Diagnostic engine: Symptom to Constraint to Solution](<../theory/Diagnostic engine Symptom → Constraint → Solution.md>))
- Provide detailed optimization procedures (check-specific SOPs handle execution: search term management, bid adjustments, quality score improvement, etc.)

---

## The five cadence tiers

Every optimization check belongs to exactly one cadence tier based on how quickly the underlying data changes and how urgently action is needed.

| **Tier** | **Frequency** | **Time budget** | **Purpose** | **Data window** |
|----------|---------------|-----------------|-------------|-----------------|
| **1️⃣ Daily** | Every business day | 10-15 min | Catch breakage and urgent issues | Last 1-3 days |
| **2️⃣ Weekly** | Same day each week | 30-60 min | Diagnose trends, prioritize actions | Last 7 days vs. prior 7 |
| **3️⃣ Bi-weekly** | Every 2 weeks | 30 min | Mid-cycle checks on slower metrics | Last 14 days |
| **4️⃣ Monthly** | First week of month | 60-90 min | Strategic review, baseline recalibration | Last 30 days vs. prior 30 |
| **5️⃣ Quarterly** | Start of quarter | 2-3 hours | Strategy reassessment, structural changes | Quarter vs. prior quarter |

> ⚠️ **Time-box every tier:** Unlimited data creates unlimited analysis. The time budgets above are maximums, not minimums. If daily triage takes 3 minutes because nothing is broken, that's a good day.

---

## Check categories by cadence tier

### 1️⃣ Daily: catch breakage

*"Did anything major break overnight?"*

Daily triage maps primarily to **Layer 1️⃣ (health/governance)** with a quick **Layer 2️⃣ (performance alerts)** triage of automated alert outputs.

| **Check category** | **Monitoring layer** | **What to scan** | **Action if flagged** |
|---------------------|---------------------|------------------|----------------------|
| **Conversion tracking** | Layer 1️⃣ | Tag firing, conversion volume drops to zero | Immediate fix: tracking is the foundation |
| **Ad/asset disapprovals** | Layer 1️⃣ | New disapprovals on active ads or assets | Review and fix or appeal |
| **URL health** | Layer 1️⃣ | 404 errors, broken redirects on high-volume URLs | Pause affected ads, fix landing pages |
| **Bid strategy status** | Layer 1️⃣ | Learning, limited, misconfigured strategies | Note for weekly review unless critical |
| **Budget pacing** | Layer 2️⃣/3️⃣ | Overspend, underspend, budget-limited campaigns | Adjust budget or investigate delivery issue |
| **Spend anomalies** | Layer 2️⃣ | Sudden spikes or drops in daily spend | Investigate cause, check for accidental changes |
| **Alert output review** | Layer 2️⃣ | Review any automated alerts that fired overnight | Triage: fix now or flag for weekly |

**Frequency flexibility:**

| Monthly conversions | Default | Increase frequency when | Decrease frequency when |
|----------------|---------|------------------------|------------------------|
| 200+ (high) | Daily automated + manual review of alerts | After major launches, tracking changes | Never: daily triage is always non-negotiable |
| 50-200 (medium) | Daily automated + manual review of alerts | After major launches, tracking changes | Never |
| 15-50 (low) | Daily automated + weekly manual review | After major launches | When alert coverage is comprehensive and mature |
| <15 (very low) | Daily automated + weekly manual review | After major launches | When alert coverage is comprehensive and mature |

> 💡 **What to automate:** Layer 1️⃣ detection (disapprovals, tracking status, URL errors, bid strategy status) automates well via Google rules, scripts, and third-party tools. Your manual daily check becomes a review of alert outputs rather than a raw scan through the interface.

> ↪️ **For Layer 1️⃣ automation recipes:** See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md).

**Daily triage output:** A short list of "fix now" items and "flag for weekly" notes. No diagnosis, no strategic changes.

### 2️⃣ Weekly: diagnose and prioritize

*"What changed this week, and what should I do about it?"*

Weekly reviews map primarily to **Layer 2️⃣ (performance alerts)** with a **Layer 3️⃣ (target monitoring)** check-in on pacing and efficiency.

| **Check category** | **Monitoring layer** | **What to review** | **Action if flagged** |
|---------------------|---------------------|-------------------|----------------------|
| **Primary KPI performance** | Layer 3️⃣ | Conversions, CPA/ROAS vs. targets | Investigate top issue, create action items |
| **Trend signals** | Layer 2️⃣ | 2+ week directional movement in key metrics | Flag as emerging trend, monitor or investigate |
| **Search term quality** | Layer 2️⃣ | New irrelevant queries, wasted spend | Add negatives, refine targeting |
| **Auction insights** | Layer 2️⃣/3️⃣ | Competitor entry/exit, impression share shifts | Note competitive changes for strategy review |
| **Budget pacing** | Layer 3️⃣ | Month-to-date spend vs. monthly budget | Adjust if significantly off pace |
| **Active experiments** | Layer 2️⃣ | Test status, early signals | Continue or stop based on data |
| **Previous action items** | N/A | Carry-forward from last week | Track completion, escalate blockers |

**Frequency flexibility:**

| Monthly conversions | Default | Increase frequency when | Decrease frequency when |
|----------------|---------|------------------------|------------------------|
| 200+ (high) | Weekly | Launch phase, active experiments, competitive shifts | Stable mature account with automated alerts |
| 50-200 (medium) | Bi-weekly preferred | Active experiments, major changes | Stable, no active optimization sprints |
| 15-50 (low) | Monthly (weekly data is noise) | Never at weekly frequency | Always: extend window to monthly |
| <15 (very low) | Monthly (weekly data is noise) | Never at weekly frequency | Always: extend window to monthly |

> 💡 **What to automate:** Layer 2️⃣ threshold alerts and fluctuation detection can be automated. Pacing dashboards can be auto-populated. What cannot be automated: classifying whether flagged changes are signal or noise, root cause analysis, deciding on actions.

**Weekly output:** Documented review with one investigated issue, prioritized action items, and updated backlog.

### 3️⃣ Bi-weekly: mid-cycle validation

*"Are slower-moving metrics still on track?"*

Bi-weekly checks cover metrics that change too slowly for weekly detection but too quickly for monthly-only review. Maps to **Layer 2️⃣** and **Layer 3️⃣**.

| **Check category** | **Monitoring layer** | **What to review** | **Action if flagged** |
|---------------------|---------------------|-------------------|----------------------|
| **Quality Score trends** | Layer 2️⃣ | QS movement on high-volume keywords | Trigger QS improvement if degrading |
| **Budget allocation** | Layer 3️⃣ | Spend distribution across campaigns | Rebalance if proven campaigns are under-funded |
| **Audience performance** | Layer 2️⃣ | Remarketing list health, audience signals | Refresh lists, adjust targeting |
| **Landing page metrics** | Layer 2️⃣ | Bounce rate, CVR by page | Flag pages for testing or optimization |

**Frequency flexibility:**

| Monthly conversions | Default | Increase frequency when | Decrease frequency when |
|----------------|---------|------------------------|------------------------|
| 200+ (high) | Bi-weekly | QS declining, audience lists shrinking | Merge into weekly if weekly reviews are thorough |
| 50-200 (medium) | Bi-weekly (aligns with performance review) | Active landing page tests | Merge into monthly if limited resources |
| 15-50 (low) | Monthly | Never at bi-weekly | Always: insufficient data for bi-weekly signals |

> 💡 **What to automate:** Quality Score monitoring scripts, audience list size tracking, landing page performance dashboards. Human judgment needed for: QS improvement prioritization, budget reallocation decisions, audience strategy.

### 4️⃣ Monthly: strategic calibration

*"Are we on trajectory, and do our baselines still reflect reality?"*

Monthly reviews span all three layers: a deep **Layer 1️⃣** audit, a **Layer 2️⃣** baseline recalibration, and a full **Layer 3️⃣** target assessment.

| **Check category** | **Monitoring layer** | **What to review** | **Action if flagged** |
|---------------------|---------------------|-------------------|----------------------|
| **Business alignment** | Layer 3️⃣ | Revenue/profit vs. business goals | Escalate if trajectory is off |
| **Conversion tracking health** | Layer 1️⃣ (deep) | Google Ads vs. backend discrepancy | Investigate and fix drift |
| **Baseline recalibration** | Layer 2️⃣ | Are green/orange/red thresholds still accurate? | Adjust bands based on recent performance |
| **Competitive landscape** | Layer 2️⃣/3️⃣ | Auction insights trends, new competitors | Update competitive positioning |
| **Campaign settings drift** | Layer 1️⃣ (deep) | Location, network, rotation settings | Correct any unintended changes |
| **Account structure** | Layer 3️⃣ | Consolidation opportunities, volume distribution | Plan structural changes for next quarter |
| **Recommendation review** | Layer 1️⃣ | Google's recommendations and optimization score | Dismiss irrelevant, consider valuable |

**Frequency flexibility:**

| Monthly conversions | Default | Increase frequency when | Decrease frequency when |
|----------------|---------|------------------------|------------------------|
| 200+ (high) | Monthly, full scope | Major strategy shifts, competitive upheaval | Never: monthly strategic review is always needed |
| 50-200 (medium) | Monthly, full scope | Same as high volume | Reduce scope (skip competitive deep-dive) if stable |
| 15-50 (low) | Monthly, extended data windows (60-90 days) | Major changes, client escalation | Never: monthly is already the minimum useful frequency |

> 💡 **What to automate:** Conversion tracking discrepancy reports, baseline recalculation scripts, settings drift detection, pacing dashboards. What cannot be automated: business alignment assessment, structural decisions, competitive strategy, stakeholder communication.

**Monthly output:** Updated targets, recalibrated baselines, strategic action plan for next month.

### 5️⃣ Quarterly: strategy reset

*"Are we solving the right problems with the right structure?"*

Quarterly reviews are pure **Layer 3️⃣**: strategic direction and goal alignment.

| **Check category** | **Monitoring layer** | **What to review** | **Action if flagged** |
|---------------------|---------------------|-------------------|----------------------|
| **Goal equation** | Layer 3️⃣ | Do growth and efficiency targets need revision? | Update targets based on business changes |
| **Account structure** | Layer 3️⃣ | Does the structure still serve the strategy? | Plan restructuring if needed |
| **Channel mix** | Layer 3️⃣ | Is budget allocation across channels optimal? | Shift budget based on performance data |
| **Technology stack** | Layer 1️⃣ (strategic) | Tracking, attribution, automation tools | Plan upgrades or changes |
| **Roadmap** | Layer 3️⃣ | Prioritize optimizations and experiments for next quarter | Create quarterly roadmap |

> ↪️ **Quarterly review documentation:** See: [Quarterly Review Checklist](../checklists/Quarterly Review Checklist.md) for check items and [SOP – Run a Quarterly Business Review](../sops/SOP – Run a Quarterly Business Review.md) for the full procedure.

---

## Adapting cadence to account maturity

The right cadence depends on where the account is in its lifecycle. New accounts need more attention because data patterns are not yet established.

| **Account stage** | **Daily** | **Weekly** | **Monthly** | **Quarterly** |
|-------------------|-----------|------------|-------------|---------------|
| **Launch (0-30 days)** | 15-20 min: check everything | Full review: all signals are new | Premature: wait for data | N/A |
| **Ramp (1-3 months)** | 10-15 min: standard triage | Full review: establishing baselines | First real monthly review | N/A |
| **Stable (3-12 months)** | 10 min: efficient scan | 30-45 min: focused review | Full strategic review | First quarterly reset |
| **Mature (12+ months)** | 5-10 min: exception-based scan | 20-30 min: targeted review | Recalibration focus | Strategy evolution |

> 💡 **Launch accounts need daily attention:** During the first 30 days, every signal is new. After 90 days with stable performance, daily triage should take under 10 minutes.

---

## Adapting cadence to conversion volume

Data confidence depends on volume. Low-volume accounts cannot support frequent analysis because weekly samples are too small to distinguish signal from noise.

| **Volume tier** | **Monthly conversions** | **Recommended minimum review cadence** | **Weekly review reliable?** | **Rationale** |
|----------------|------------------------|----------------------------------------|-----------------------------|---------------|
| High | 200+ | Weekly | Yes | Sufficient data for weekly signals |
| Medium | 50-200 | Bi-weekly | Bi-weekly preferred | Weekly data too noisy for reliable patterns |
| Low | 15-50 | Monthly | Monthly only | Need 30-day aggregation for any validity |
| Very low | <15 | Monthly with extended windows | Monthly only | Use 60-90 day windows, focus on leading indicators |

> ⚠️ **Do not run weekly performance reviews on accounts with fewer than 50 monthly conversions:** You will react to noise and make the account worse.

---

## The cadence decision framework

When deciding what cadence to use for a specific check:

```
How fast does this metric change?
│
├─ Can change overnight (tracking, URLs, disapprovals)
│  └─ DAILY check (Layer 1️⃣)
│
├─ Changes week-to-week (CTR, CPC, spend patterns)
│  └─ WEEKLY check (Layer 2️⃣)
│
├─ Changes over 2-4 weeks (QS, audience health, LP metrics)
│  └─ BI-WEEKLY check (Layer 2️⃣)
│
├─ Changes over months (baselines, competitive landscape, settings drift)
│  └─ MONTHLY check (Layer 2️⃣ recalibration + Layer 3️⃣ assessment)
│
└─ Structural or strategic (goals, structure, channel mix)
   └─ QUARTERLY check (Layer 3️⃣)
```

---

## Common cadence mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| **Checking CPA daily** | Daily CPA swings are noise, not signal | Check CPA weekly at minimum, with 2-week confirmation |
| **Monthly search term review** | Wasted spend accumulates for weeks | Review search terms weekly |
| **No daily triage** | Broken tracking or disapprovals go unnoticed for days | 10-minute daily scan is non-negotiable |
| **Weekly QS review** | QS changes slowly, weekly reviews create false urgency | Check QS bi-weekly or monthly |
| **Quarterly budget review** | Budget allocation falls out of sync with performance | Review budget allocation weekly |
| **Skipping documentation** | No continuity between reviews, same issues resurface | Document every weekly and monthly review |
| **Same cadence for all accounts** | Low-volume accounts get noise-driven changes | Match cadence to volume tier |
| **Zero automation** | Spending 15 min on raw scanning instead of reviewing alerts | Automate Layer 1️⃣ detection, review alert outputs |

---

## Key principles

1. **Match frequency to data velocity:** Fast-moving metrics (spend, tracking) get daily attention. Slow-moving metrics (QS, competitive landscape) get monthly attention.
2. **Time-box every cadence tier:** Set a timer. When it goes off, stop analyzing and start acting.
3. **Adapt to volume and maturity:** New and high-volume accounts need more frequent reviews. Mature and low-volume accounts need less frequent but longer-window analysis.
4. **Daily triage is non-negotiable:** Even mature accounts can have tracking break overnight. Ten minutes every morning prevents disasters.
5. **Automate detection, keep decisions human:** Automated alerts handle Layer 1️⃣ and Layer 2️⃣ detection. Human judgment handles classification, diagnosis, and strategic decisions.
6. **Document every review:** Written records create continuity, catch recurring patterns, and prevent the same issue from being "discovered" three times.
7. **Flag, then confirm, then act:** One week of bad data is a signal. Two weeks is a pattern. Three weeks is a problem. Never make major changes on a single data point.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md) | Parent framework: three monitoring layers referenced throughout |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Foundation: reporting hierarchy and cadence principles |
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Companion: how to distinguish signal from noise |
| [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) | Reference: automation recipes per cadence tier |
| [Status board and operating rhythms](../theory/Status board and operating rhythms.md) | Foundation: daily/weekly/monthly rhythm definitions |
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Execution: daily triage procedure |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Execution: weekly review procedure |
| [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) | Execution: monthly review procedure |
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Validation: daily/Layer 1️⃣ check items |
| [Monthly Performance Review Checklist](../checklists/Monthly Performance Review Checklist.md) | Validation: monthly check items |
| [Quarterly Review Checklist](../checklists/Quarterly Review Checklist.md) | Validation: quarterly check items |
| [SOP – Run a Quarterly Business Review](../sops/SOP – Run a Quarterly Business Review.md) | Execution: quarterly review procedure |

---

## Version details

- **Version:** 5.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v5.0: Linked quarterly review callout and related docs table to published QBR Checklist and SOP. v4.0: Added quarterly review forward reference. v3.0: Converted "What to automate" paragraphs to callout boxes, added scope note for optimization procedures. v2.0: Mapped cadence tiers to 3-layer monitoring model, added frequency flexibility per tier, added automation context, sentence case headings, cross-referenced Account Monitoring Mental Model

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
