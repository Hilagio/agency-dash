# Account Monitoring Mental Model

Support_ID: MENTALMODEL_29
Status: Done
Category: Monitoring
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

This mental model provides the overarching framework for monitoring a Google Ads account: what to monitor, why, and how the different types of monitoring relate to each other.

> ❓ **The core question:** Is my account healthy, is performance stable, and am I on track for my business goals?

Account monitoring is not a single activity. It is three distinct layers of checks, each answering a different question. Mixing these layers causes missed breakage (checking performance when tracking is broken) or wasted effort (manually scanning for issues that can be automated). This model separates the layers so you check the right things in the right order.

---

## What this is NOT

This mental model does **not:**

- Define when to check each metric (See: [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md))
- Explain how to distinguish signal from noise (See: [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md))
- Provide step-by-step monitoring procedures (See: [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md))

---

## The three monitoring layers

Every monitoring check belongs to exactly one of three layers. Process them in order: Layer 1️⃣ first, then Layer 2️⃣, then Layer 3️⃣.

| **Layer** | **Question it answers** | **Check type** | **Automation potential** |
|-----------|------------------------|----------------|-------------------------|
| **1️⃣ Health/governance** | Is the account structurally sound? | Binary pass/fail | High: Google rules, scripts, third-party tools |
| **2️⃣ Performance alerts** | Is performance changing unexpectedly? | Fluctuations (relative %) and thresholds (absolute values) | Medium-high: rules for thresholds, scripts for fluctuations |
| **3️⃣ Target monitoring** | Are we on track for business goals? | Efficiency (CPA/ROAS), pacing (budget), growth (conversions) | Medium: dashboards, pacing scripts, manual review |

> ⚠️ **Always process Layer 1️⃣ first:** If tracking is broken, every performance metric is unreliable. If ads are disapproved, traffic is lower than it should be. Layer 1️⃣ issues invalidate Layer 2️⃣ and Layer 3️⃣ data.

---

## Layer 1️⃣: Health and governance

Health checks are binary: something either works or it does not. These are the structural prerequisites for a functioning account.

### Check categories

| **Category** | **What you check** | **Failure impact** | **Automation** |
|--------------|-------------------|-------------------|----------------|
| **Conversion tracking** | Tags firing, conversion actions active, volume not zero | All performance data is unreliable | Google rules (volume = 0), scripts (tag health), third-party tools |
| **Ad compliance** | Disapprovals, policy violations, limited approvals | Traffic loss, account risk | Google rules (status = disapproved), daily email alerts |
| **URL health** | 404 errors, redirect chains, page load failures | Wasted spend on broken pages | Scripts (URL checker), third-party monitoring |
| **Feed health** (Shopping/PMax) | Disapproved products, feed errors, missing attributes | Lost product coverage, wasted spend | Merchant Center alerts, scripts, feed tools |
| **Bid strategy status** | Misconfigured, limited, extended learning | Suboptimal bidding, wasted spend | Google rules (status check), scripts |
| **Campaign settings** | Unintended changes, auto-applied recommendations | Budget/targeting/network drift | Change History review, scripts, third-party tools |

### How to process Layer 1️⃣

1. Start with conversion tracking: if tracking is broken, stop and fix it before reviewing anything else
2. Check compliance: disapprovals on high-volume ads require same-day action
3. Check URLs: broken landing pages waste every click
4. Check feed health (if applicable): disapproved products cannot sell
5. Check bid strategies: misconfigured strategies need immediate correction
6. Review Change History: catch auto-applied changes you did not authorize

> 💡 **Layer 1️⃣ scales well with automation:** Most health checks are binary (working/not working) and follow deterministic rules. A well-configured alert system handles 80%+ of Layer 1️⃣ detection automatically. Your manual check becomes a review of alert outputs, not a raw scan.

> ↪️ **For automation recipes:** See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) for specific rule, script, and tool patterns for each Layer 1️⃣ check.

---

## Layer 2️⃣: Performance alerts

Performance alerts detect unexpected changes in metrics. Unlike Layer 1️⃣ (binary), Layer 2️⃣ deals with continuous metrics that fluctuate normally. The challenge is distinguishing real changes from noise.

### Two alert engines

Layer 2️⃣ uses two complementary detection methods:

| **Engine** | **What it detects** | **How it works** | **Best for** |
|------------|--------------------|--------------------|-------------|
| **Fluctuation alerts** | Relative changes from baseline | Compares current period to baseline (prior period, rolling average, or same period last year) | Detecting unexpected shifts: "CPA rose 35% vs. last 2 weeks" |
| **Threshold alerts** | Absolute values crossing a boundary | Fires when a metric exceeds or drops below a fixed or calculated threshold | Enforcing guardrails: "CPA exceeded €50" |

Both engines are needed. Fluctuation alerts catch gradual drift that never crosses an absolute threshold. Threshold alerts catch hard boundaries that matter regardless of trend direction.

### Configurable parameters

Every Layer 2️⃣ alert has four parameters you must set:

| **Parameter** | **What it controls** | **Example** |
|---------------|---------------------|-------------|
| **Metric** | Which metric to monitor | CPA, ROAS, conversion volume, CTR, spend |
| **Sensitivity** | How much change triggers the alert | ±30% for fluctuations, €50 for thresholds |
| **Data window** | How much data to evaluate | 7-day rolling, 14-day rolling, 30-day rolling |
| **Scope** | Which entities to monitor | Account-level, campaign-level, ad group-level |

### Noise filtering via minimum volume

Alerts on low-volume entities produce false positives. Apply minimum volume filters to suppress noise:

| **Monthly conversions** | **Alert reliability** | **Recommended data window** |
|-------------------------|----------------------|---------------------------|
| 200+ (high) | Weekly alerts reliable | 7-day rolling |
| 50-200 (medium) | Bi-weekly alerts reliable | 14-day rolling |
| 15-50 (low) | Monthly alerts only | 30-day rolling |
| <15 (very low) | Alerts unreliable at entity level | Aggregate to account level or skip |

> ⚠️ **Do not set weekly CPA/ROAS alerts on campaigns with fewer than 50 monthly conversions:** The variance is too high. You will get constant false positives and either ignore all alerts (alert fatigue) or react to noise (performance instability).

> ⚠️ **Conversion lag impacts your data window:** If your account has a 14-day conversion lag, your data window must start at least 14 days back to capture complete data. A "7-day rolling" window in an account with 14-day lag means you are only seeing partial conversions, producing false negatives. Match your data window to your conversion lag: 7-day lag → 14-day minimum window, 14-day lag → 28-day minimum window.

### Common Layer 2️⃣ alert patterns

| **Alert** | **Engine** | **Default sensitivity** | **Default window** | **Scope** |
|-----------|-----------|------------------------|-------------------|-----------|
| CPA spike | Fluctuation | +30% vs. prior 14 days | 7-day rolling | Campaign |
| ROAS drop | Fluctuation | -25% vs. prior 14 days | 7-day rolling | Campaign |
| Conversion volume drop | Fluctuation | -40% vs. prior 7 days | 7-day rolling | Account |
| Spend spike | Threshold | >120% of daily budget | Previous day | Campaign |
| CPC surge | Fluctuation | +25% vs. prior 14 days | 7-day rolling | Campaign |
| CTR decline | Fluctuation | -20% vs. prior 14 days | 7-day rolling | Campaign |

> ↪️ **For noise filtering and threshold-setting methodology:** See: [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) for the three-test framework (volume, magnitude, persistence).

---

## Layer 3️⃣: Target monitoring

Target monitoring compares current performance to business goals. Unlike Layer 2️⃣ (detecting unexpected changes), Layer 3️⃣ asks: "Are we on track for what we planned?"

### Three target types

| **Target type** | **What it tracks** | **Metric examples** | **Check frequency** |
|-----------------|--------------------|---------------------|--------------------|
| **Growth** | Are we delivering enough volume? | Conversions vs. monthly target, revenue vs. goal | Weekly (high volume), monthly (low) |
| **Efficiency** | Are we hitting cost/return targets? | CPA vs. target CPA, ROAS vs. target ROAS | Weekly (high volume), bi-weekly (medium), monthly (low) |
| **Pacing** | Are we spending at the right rate? | Month-to-date spend vs. monthly budget, daily required spend | Weekly (all accounts) |

### Pacing calculation

Pacing converts monthly budgets into daily checkpoints:

```
Daily required = (Monthly budget - Month-to-date spend) / Remaining days in month
```

| **Pacing status** | **Definition** | **Action** |
|-------------------|---------------|-----------|
| On pace | Daily required within ±10% of original daily budget | Monitor normally |
| Underpacing | Daily required >110% of original daily budget | Investigate delivery issues, increase budgets, broaden targeting |
| Overpacing | Daily required <90% of original daily budget | Check for spend spikes, reduce budgets if intentional |
| Severely off pace | Daily required >150% or <50% of original daily budget | Immediate investigation and stakeholder communication |

### How efficiency, pacing, and growth interact

These three target types create trade-off tensions:

- **Efficiency vs. growth:** Tightening CPA targets reduces volume. Loosening them increases volume but costs more.
- **Pacing vs. efficiency:** Underpacing may indicate efficiency problems (high CPCs, low conversion rates) or delivery issues.
- **Growth vs. pacing:** Hitting conversion targets while underpacing means you are more efficient than planned: a good problem.

Layer 3️⃣ is where human judgment matters most. Dashboards and pacing scripts surface the data, but deciding whether to prioritize efficiency or growth is a strategic decision.

> ↪️ **Growth vs. efficiency is a strategic decision, not a monitoring finding:** The tension between growth and efficiency is the most common trade-off in Google Ads. If you are hitting efficiency targets but missing growth targets (or vice versa), the answer is not "monitor more closely". The answer is to revisit your goal equation. See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) for the framework that governs these trade-offs.

---

## How the layers interact

### Processing order

```
Layer 1️⃣: Health/governance
│
├─ Any failures? → FIX FIRST (data is unreliable until Layer 1️⃣ is clean)
│
└─ All clear → proceed
   │
   Layer 2️⃣: Performance alerts
   │
   ├─ Any alerts firing? → INVESTIGATE (is this signal or noise?)
   │
   └─ No alerts → proceed
      │
      Layer 3️⃣: Target monitoring
      │
      ├─ On track → MAINTAIN (no changes needed)
      │
      ├─ Off track, known cause → ADJUST (tactical changes)
      │
      └─ Off track, unknown cause → DIAGNOSE (trace root cause)
```

### Cascade effects

Layer 1️⃣ issues cascade down:

| **Layer 1️⃣ failure** | **Layer 2️⃣ impact** | **Layer 3️⃣ impact** |
|--------------------|--------------------|-------------------|
| Tracking broken | Conversion alerts fire incorrectly | CPA/ROAS data meaningless |
| Ads disapproved | Traffic drops trigger fluctuation alerts | Volume targets missed |
| Feed errors | Shopping impression drop alerts | Revenue targets missed |
| URLs broken | CVR drops trigger performance alerts | CPA rises, efficiency targets missed |

Fix Layer 1️⃣ first. Do not adjust bids, budgets, or targets in response to Layer 2️⃣ or Layer 3️⃣ signals until you have confirmed Layer 1️⃣ is clean.

---

## Adapting by account context

### By account volume

| **Volume tier** | **Monthly conversions** | **Layer 1️⃣** | **Layer 2️⃣** | **Layer 3️⃣** |
|----------------|------------------------|------------|------------|------------|
| **High** | 200+ | Daily automated + manual review of alerts | Weekly alerts reliable, campaign-level | Weekly efficiency + pacing + growth |
| **Medium** | 50-200 | Daily automated + manual review of alerts | Bi-weekly alerts, campaign-level with wider thresholds | Bi-weekly efficiency, weekly pacing |
| **Low** | 15-50 | Daily automated + weekly manual review | Monthly alerts, account-level only | Monthly all targets, weekly pacing only |
| **Very low** | <15 | Daily automated + weekly manual review | Monthly or skip (aggregate to account level) | Monthly with extended windows |

### By account maturity

| **Maturity** | **Layer 1️⃣ emphasis** | **Layer 2️⃣ emphasis** | **Layer 3️⃣ emphasis** |
|-------------|---------------------|---------------------|---------------------|
| **Launch (0-30 days)** | Check everything manually, automation not yet calibrated | No baselines exist, use industry defaults | Premature: establishing baselines |
| **Ramp (1-3 months)** | Automate core checks, build alert coverage | Building baselines, wide thresholds | First real target comparisons |
| **Stable (3-12 months)** | Fully automated, review alert outputs | Calibrated thresholds from account data | Full target monitoring with reliable data |
| **Mature (12+ months)** | Exception-based, automated alerts handle detection | Tight thresholds, low false positive rate | Trend analysis, strategic adjustments |

### By vertical

| **Vertical** | **Layer 1️⃣ additions** | **Layer 2️⃣ considerations** | **Layer 3️⃣ focus** |
|--------------|----------------------|---------------------------|-------------------|
| **Lead Gen** | Backend pipeline health (CRM connectivity, lead delivery) | Lead quality signals lag heavily, use longer windows | CPA per qualified lead, pipeline value |
| **SaaS** | Trial/signup tracking across funnel stages | Free trial conversions may have high variance | CAC vs. LTV ratio, trial-to-paid conversion |
| **Ecommerce** | Product feed health, Merchant Center status, inventory sync | Revenue-based metrics (ROAS) alongside volume | ROAS, revenue pacing, product-level profitability |

---

## Automation by layer

| **Layer** | **What to automate** | **What needs human judgment** |
|-----------|---------------------|------------------------------|
| **1️⃣ Health/governance** | Detection of all binary failures (tracking status, disapprovals, URL errors, feed errors, bid strategy status, setting changes) | Deciding the fix, appeals, structural corrections |
| **2️⃣ Performance alerts** | Threshold crossing detection, fluctuation calculation, baseline maintenance, email notifications | Classifying signal vs. noise, root cause analysis, deciding whether to act |
| **3️⃣ Target monitoring** | Pacing calculations, dashboard population, efficiency vs. target comparisons | Strategic trade-off decisions (efficiency vs. growth), stakeholder communication, target revisions |

> 💡 **Automation does not replace judgment:** Automation handles detection and data preparation. Humans handle classification, diagnosis, and strategic decisions. The goal is to spend zero time finding issues and all your time deciding what to do about them.

> ↪️ **For implementation details:** See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) for specific automation recipes per layer.

---

## Key principles

1. **Layer 1️⃣ before everything:** If the account is structurally broken, performance data is meaningless. Always verify health/governance first.
2. **Match automation to check type:** Binary checks (Layer 1️⃣) automate well. Continuous metrics (Layer 2️⃣) automate partially. Strategic decisions (Layer 3️⃣) require humans.
3. **Filter noise before alerting:** Every alert must pass a minimum volume threshold. Alerts on insufficient data create fatigue and reactive decision-making.
4. **Separate detection from action:** Detecting an issue and deciding what to do about it are different activities. Automate detection. Keep decisions human.
5. **Adapt to account context:** Volume, maturity, and vertical all change what you monitor, how often, and how sensitive your alerts should be.
6. **Process order is non-negotiable:** Layer 1️⃣ → Layer 2️⃣ → Layer 3️⃣. Every time. Skipping layers creates cascading errors.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Companion: when to check each metric |
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Companion: how to distinguish signal from noise (Layer 2️⃣ thinking) |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Foundation: reporting hierarchy and types |
| [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) | Reference: automation implementation per layer |
| [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md) | Reference: native rule mechanics |
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Validation: Layer 1️⃣ check items |
| [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md) | Validation: alert coverage across layers |
| [Monthly Performance Review Checklist](../checklists/Monthly Performance Review Checklist.md) | Validation: full-layer monthly review |
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Execution: daily monitoring procedure |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v2.0: Added keycap emojis to layer numbering, conversion lag data window guidance, Goals and KPIs Mental Model reference, reordered target types (Growth first), CPA→CPA/ROAS in noise filtering warning

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
