# Anomaly Detection Mental Model
Created: 2026-02-11

Support_ID: MENTALMODEL_28
Status: Done
Category: Monitoring
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

This mental model helps you distinguish real performance anomalies from normal variance, so you investigate genuine problems and ignore noise that would lead to counterproductive changes.

> ❓ **The core question:** Is this data movement a real problem that requires action, or normal variance that I should ignore?

Most "performance drops" in Google Ads are noise. Reacting to noise creates instability: you change bids, pause keywords, or restructure campaigns based on random fluctuation, which resets learning and makes performance worse. This model gives you a systematic framework for deciding when to act and when to wait.

---

## What this is NOT

This mental model does **not:**

- Define specific metrics to monitor (See: [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md))
- Provide investigation procedures (See: [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md))
- Cover reporting cadence and rhythm (See: [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md))

---

## The anomaly classification framework

Every data movement falls into one of four categories. Your job is to classify before you act.

| **Category** | **Definition** | **Action** | **Example** |
|--------------|----------------|------------|-------------|
| **1️⃣ Noise** | Random variance within expected bounds | Ignore | CPA swings ±15% day-to-day on low volume |
| **2️⃣ Expected change** | Predictable movement from known causes | Monitor, don't react | Weekend dip in B2B lead gen |
| **3️⃣ Emerging signal** | Consistent directional movement over 2+ periods | Investigate | CTR declining for 3 consecutive weeks |
| **4️⃣ Confirmed anomaly** | Significant deviation with identified cause | Act | Conversion tracking broke, CPA doubled overnight |

> ⚠️ **Most "anomalies" are noise:** In a typical account, 70-80% of week-over-week metric movements are normal variance. The goal is to filter to the 20-30% that matter.

---

## The three tests

Before investigating any data movement, run these three sequential tests. If it fails any test, it's noise.

### Test 1: Volume threshold

> ↪️ **This is Layer 2️⃣ thinking:** Anomaly detection operates within Layer 2️⃣ (performance alerts) of the [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md). Always confirm Layer 1️⃣ (health/governance) is clean before investigating Layer 2️⃣ anomalies.

*"Is there enough data to trust this movement?"*

Data confidence requires minimum volume. Small samples produce large swings that mean nothing.

| **Metric** | **Minimum data for weekly signal** | **Minimum data for daily signal** |
|------------|-----------------------------------|-----------------------------------|
| Conversions | 30+ per week | Not reliable at daily level for most accounts |
| Clicks | 100+ per week | 30+ per day |
| Impressions | 1,000+ per week | 200+ per day |
| CTR | 1,000+ impressions in period | 500+ impressions |
| CPA | 30+ conversions in period | Not reliable daily |
| ROAS | 30+ conversions in period | Not reliable daily |
| Quality Score | 100+ impressions on keyword | N/A (updates slowly) |

**Rule:** If the entity (campaign, ad group, keyword) has fewer conversions than the threshold, extend your analysis window until it does. A keyword with 3 conversions this week and 0 last week did not "lose all its conversions". It has insufficient data.

> 💡 **The square root rule for proportions:** The margin of error on a rate (like CTR or CVR) is roughly 1/√n where n is the sample size. With 100 clicks, your CVR estimate has a ±10% margin. With 1,000 clicks, it's ±3%. With 10,000, it's ±1%. Small samples mean wide error bars.

### Test 2: Magnitude threshold

*"Is this movement large enough to matter?"*

Even with sufficient volume, small movements are expected. Define what constitutes a meaningful change for each metric.

| **Metric** | **Normal week-over-week variance** | **Investigate if exceeds** |
|------------|-----------------------------------|-----------------------------|
| Daily spend | ±20% | ±40% |
| Weekly CPA | ±15% | ±30% for 2+ weeks |
| Weekly ROAS | ±15% | ±30% for 2+ weeks |
| CTR | ±10% | ±20% sustained |
| CVR | ±15% | ±25% for 2+ weeks |
| Impression share | ±5pp | ±10pp |
| CPC | ±10% | ±25% |
| Conversion volume | ±20% | ±40% or drop to zero |

**Rule:** These thresholds are starting points. Calibrate them to your specific account after 3+ months of data. Accounts with high variance need wider thresholds.

### Test 3: Persistence test

*"Has this movement persisted long enough to be a pattern?"*

Single-period movements are signals. Multi-period movements are patterns.

| **Duration** | **Classification** | **Response** |
|--------------|-------------------|--------------|
| 1 day | Noise (unless breakage) | Log, don't act |
| 1 week | Signal | Flag for next review |
| 2 weeks | Emerging pattern | Investigate root cause |
| 3+ weeks | Confirmed trend | Act on root cause |

**Exception:** Breakage anomalies (tracking stopped, ads disapproved, URLs broken) get immediate action regardless of duration. Do not wait 2 weeks to fix a broken conversion tag.

---

## Expected variance by context

Different contexts produce different levels of normal variance. Knowing what's "normal" prevents false alarms.

### By conversion volume (aligned with standard volume tiers)

| **Monthly conversions** | **Expected weekly CPA variance** | **Implication** |
|-------------------------|----------------------------------|-----------------|
| 500+ | ±10% | Weekly reviews are reliable |
| 200-500 | ±15-20% | Weekly reviews with caution |
| 50-200 | ±25-35% | Bi-weekly reviews recommended |
| <50 | ±50%+ | Monthly reviews only, weekly is pure noise |

### By campaign type

| **Campaign type** | **Typical variance level** | **Why** |
|-------------------|---------------------------|---------|
| Brand Search | Low | Stable intent, consistent volume |
| Non-brand Search (exact/phrase) | Medium | Intent-specific but volume fluctuates |
| Non-brand Search (broad) | Medium-High | Broader matching creates more variability |
| Shopping (standard) | Medium | Product mix shifts daily |
| Performance Max | High | Black-box allocation changes constantly |
| Display/Video | Very High | Audience quality varies significantly |
| Demand Gen | High | Exploratory traffic, variable intent |

### By day of week

| **Pattern** | **Typical accounts affected** | **Expected behavior** |
|-------------|-------------------------------|----------------------|
| Weekend dip | B2B, Lead Gen, SaaS | 30-60% lower volume Sat/Sun |
| Weekend spike | Ecommerce (consumer goods) | 10-30% higher volume Sat/Sun |
| Monday surge | B2B, Lead Gen | Catch-up searches Monday morning |
| Month-end spike | Ecommerce, B2B with quotas | Budget flush, buying urgency |

---

## Seasonality adjustments

Seasonal patterns are expected changes, not anomalies. Account for them before flagging movements.

### Common seasonal factors

> ↪️ **Seasonality = expected change, not anomaly:** In the [anomaly classification framework](#the-anomaly-classification-framework), seasonal patterns are Category 2 (expected change). Account for them before flagging any movement as an anomaly.

| **Factor** | **Impact** | **How to account for it** |
|------------|-----------|--------------------------|
| **Industry seasonality** | Predictable volume/CPC cycles (e.g. retail Q4, tax season) | Compare year-over-year, not just week-over-week |
| **Promotional periods** | Artificial spikes during sales events | Exclude promotional periods from baseline |
| **Competitor seasonality** | CPCs rise when competitors increase spend | Monitor auction insights alongside performance |
| **Weather/events** | Unpredictable but explainable volume shifts | Check external factors before investigating internally |

**Seasonality rule:** Always compare the same period year-over-year before concluding a trend exists. A 20% drop in January vs. December might be completely normal.

---

## The anomaly response framework

Once you've classified a data movement, follow the appropriate response path.

```
Data movement detected
│
├─ Fails Volume Test → NOISE: Extend analysis window
│
├─ Passes Volume, Fails Magnitude → NOISE: Normal variance
│
├─ Passes Volume + Magnitude, Fails Persistence → SIGNAL: Flag and monitor
│
└─ Passes all three tests → ANOMALY: Investigate
   │
   ├─ Breakage type (tracking, URLs, disapprovals)
   │  └─ FIX IMMEDIATELY: Don't wait for persistence
   │
   ├─ External cause (seasonality, competitor, market)
   │  └─ ADAPT: Adjust expectations, not account settings
   │
   ├─ Internal cause (your changes, bid strategy learning)
   │  └─ EVALUATE: Was the change intentional? Give it time or revert.
   │
   └─ Unknown cause
      └─ DIAGNOSE: Use metric tree to trace upstream
```

> ↪️ **For root cause diagnosis:** See: [Metric Tree Reference](../references/Metric Tree Reference.md) for tracing upstream causes through the metric tree.

---

## Red, orange, green threshold setting

Status Board thresholds determine when metrics are flagged. Set them based on account history, not arbitrary numbers.

### How to set thresholds

> 💡 **Maintain baselines programmatically:** Steps 1-3 below can be automated with a Google Ads Script or third-party tool that recalculates mean and standard deviation on a rolling basis (e.g., every 30 days). This removes manual calibration effort and keeps thresholds aligned with recent performance. See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) for baseline management patterns.

1. **Collect 90 days of data** for each metric at the entity level you'll monitor
2. **Calculate the mean and standard deviation** for weekly values
3. **Set bands:**

| **Status** | **Range** | **Meaning** |
|------------|-----------|-------------|
| 🟢 Green | Within 1 standard deviation of target | On track, no action needed |
| 🟡 Orange | 1-2 standard deviations from target | Monitor closely, potential issue |
| 🔴 Red | More than 2 standard deviations from target | Investigate immediately |

4. **Recalibrate monthly:** If you're consistently green, raise the bar. If you're always red, your targets may be unrealistic.

> 💡 **Start simple, refine over time:** If you don't have 90 days of data, use industry benchmarks as starting thresholds. After 3 months, switch to account-specific thresholds based on actual variance.

---

## Automating anomaly detection

Not all parts of anomaly detection can be automated. The framework below separates what machines handle well from what requires human judgment.

| **Component** | **Automatable?** | **How** |
|---------------|-----------------|--------|
| **Volume checks** (Test 1) | Yes | Scripts or rules filter entities below minimum volume thresholds before alerting |
| **Magnitude alerts** (Test 2) | Yes | Rules trigger on absolute thresholds, scripts calculate % deviation from baselines |
| **Persistence tracking** (Test 3) | Partially | Scripts track consecutive periods of deviation, flag when persistence threshold is met |
| **Baseline maintenance** | Yes | Scripts recalculate rolling averages and standard deviations on schedule |
| **Context classification** (noise vs. expected vs. signal) | No | Requires knowledge of business context, seasonality, recent changes |
| **Root cause analysis** | No | Requires diagnostic reasoning across metrics, systems, and business context |
| **Response decisions** | No | Requires strategic judgment about trade-offs |

**Practical split:** Automate detection (Tests 1-2), semi-automate persistence tracking (Test 3), keep classification and response human. The goal: spend zero time finding potential anomalies, all your time deciding which ones matter and what to do.

> ↪️ **For implementation details:** See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) for specific automation recipes for anomaly detection.

---

## Key principles

1. **Most data movements are noise:** Your default response should be "wait and see", not "change something".
2. **Volume before analysis:** Never draw conclusions from insufficient data. Extend the window until you have enough.
3. **Persistence confirms patterns:** A single bad week is a signal. Two bad weeks is a pattern. Three is a problem.
4. **Breakage is the exception:** Tracking failures, disapprovals, and broken URLs get immediate action regardless of the persistence test.
5. **Context explains variance:** Day-of-week, seasonality, and campaign type all affect what "normal" looks like. Account for them before flagging.
6. **Calibrate thresholds to your account:** Generic thresholds create false alarms. Use account-specific history to set meaningful bands.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md) | Parent framework: this doc is Layer 2️⃣ thinking |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Companion: when to check each metric |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Foundation: reporting hierarchy and types |
| [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) | Reference: automation recipes for anomaly detection |
| [Metric Tree Reference](../references/Metric Tree Reference.md) | Reference: metric relationships for root cause tracing |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference: metric definitions |
| [Status board and operating rhythms](../theory/Status board and operating rhythms.md) | Foundation: red/orange/green threshold framework |
| [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) | Execution: investigation procedure |
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Execution: daily anomaly scanning |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v2.0: Added automation section, cross-referenced Account Monitoring Mental Model (Layer 2️⃣), added baseline maintenance note, sentence case headings

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
