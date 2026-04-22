# SOP – Investigate Performance Anomalies
Created: 2026-02-11

Agent_Executable: No
Category: Monitoring
Human_Approval_Required: No
Primary Outcome: Root cause identified for performance anomaly with documented resolution plan
SOP_ID: SOP_67
Secondary Outcomes: Pattern library updated, prevention measures applied
Status: Done
Domain: Operational
Pillar: 0

## Purpose

This SOP guides you through a structured investigation of performance anomalies, from initial detection through root cause identification to resolution planning.

> ❓ **The big question:** Why did performance change unexpectedly, and what should I do about it?

Performance anomalies fall into two categories: breakage (something broke) and shifts (something changed). This SOP handles both by systematically eliminating causes from most likely to least likely.

---

## What this SOP is NOT

This SOP does **not:**

- Define what qualifies as an anomaly vs. noise (See: [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md))
- Cover routine performance reviews (See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))
- Fix specific issues (routes to the appropriate fix SOP)

## When to run this SOP

Run this SOP:

- When daily monitoring flags a critical anomaly
- When weekly review identifies a confirmed trend requiring investigation
- When stakeholders report unexpected performance changes
- When alerts fire on conversion volume, CPA, or spend anomalies

---

## Before you start

### Required inputs

- The specific anomaly to investigate (metric, magnitude, duration)
- Access to Google Ads account
- Access to Change History
- Access to backend data (if conversion-related)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Classification framework |
| [Metric Tree Reference](../references/Metric Tree Reference.md) | Upstream tracing |
| [Account Change History Reference](../references/Account Change History Reference.md) | Change correlation |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metric relationships |

### Time allocation

| Section | Time |
|---------|------|
| Phase 1: Confirm and classify | 5 min |
| Phase 2: Internal cause check | 10 min |
| Phase 3: Metric tree diagnosis | 15 min |
| Phase 4: External cause check | 5 min |
| Phase 5: Resolution | 10 min |
| **Total** | **45 min** |

> ⚠️ **Cap investigation at 60 minutes:** If you cannot identify the root cause within 60 minutes, document what you've ruled out and escalate or revisit with fresh data.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Confirm and classify** | Verify the anomaly is real, not noise | Confirmed anomaly with classification |
| **Phase 2️⃣: Internal cause check** | Rule out changes you or your team made | Internal changes identified or ruled out |
| **Phase 3️⃣: Metric tree diagnosis** | Trace upstream to find the root metric | Root metric and affected segment identified |
| **Phase 4️⃣: External cause check** | Check for competitive and market factors | External factors identified or ruled out |
| **Phase 5️⃣: Resolution** | Determine fix and document | Resolution plan |

---

## Phase 1️⃣: Confirm and Classify (5 min)

### 1.1 Run the three tests

Apply the Anomaly Detection Mental Model's three tests:

| Test | Check | Result |
|------|-------|--------|
| **Volume test** | Does the affected entity have sufficient data for the analysis period? | Pass / Fail |
| **Magnitude test** | Does the change exceed normal variance thresholds? | Pass / Fail |
| **Persistence test** | Has the change persisted for 2+ periods? | Pass / Fail (exception: breakage) |

If any test fails (and it's not breakage), stop: this is noise, not an anomaly.

### 1.2 Classify the anomaly

| Type | Characteristics | Example |
|------|----------------|---------|
| **Breakage** | Sudden, severe, binary (working to not working) | Conversions dropped to zero, all ads disapproved |
| **Degradation** | Gradual decline over 2+ weeks | CPA rising 10% per week for 3 weeks |
| **Spike** | Sudden increase in cost or volume | Daily spend doubled unexpectedly |
| **Structural shift** | Permanent change in baseline performance | After algorithm update, CPC baseline shifted 20% higher |

### 1.3 Document the anomaly

```
Anomaly: [Metric] [direction] by [magnitude] over [timeframe]
Entity: [Account / Campaign / Ad group / Keyword]
Classification: [Breakage / Degradation / Spike / Structural shift]
First detected: [Date]
```

---

## Phase 2️⃣: Internal Cause Check (10 min)

### 2.1 Check Change History

1. Open Change History
2. Set date range to 7 days before the anomaly started
3. Filter by affected campaigns
4. Scan all change sources

| Change found | Change type | Date | Source | Could cause anomaly? |
|-------------|-----------|------|--------|---------------------|
| ___ | ___ | ___ | ___ | Yes / No |

### 2.2 Check specific internal causes

Work through this checklist in order:

| Internal cause | How to check | Finding |
|---------------|-------------|---------|
| **Bid strategy change** | Change History: bid strategy modifications | Changed / Unchanged |
| **Budget change** | Change History: budget modifications | Changed / Unchanged |
| **Keyword changes** | Change History: keyword additions, pauses, match type changes | Changed / Unchanged |
| **Ad changes** | Change History: new ads, paused ads, ad copy edits | Changed / Unchanged |
| **Targeting changes** | Change History: location, audience, network changes | Changed / Unchanged |
| **Conversion tracking change** | Change History: conversion action modifications | Changed / Unchanged |
| **Landing page change** | Check with web team or use URL monitoring | Changed / Unchanged |
| **Auto-applied recommendations** | Change History: filter by "Auto-applied" | Found / Not found |

> 💡 **If you find an internal cause:** Determine if it was intentional. If intentional, evaluate whether the change needs more time or should be reverted. If unintentional, revert it.

---

## Phase 3️⃣: Metric Tree Diagnosis (15 min)

### 3.1 Identify the root metric

If no internal cause was found, trace upstream through the metric tree to find where the breakdown originates.

**Start at your goal metric and work up:**

```
Goal metric changed (ROAS, CPA, Revenue, Profit)
│
├─ Revenue/Conv. Value changed?
│   ├─ YES → Conversions changed or AOV changed?
│   │         ├─ Conversions → Go to conversion branch
│   │         └─ AOV → Pricing, product mix, or offer issue
│   └─ NO → Cost changed?
│            └─ CPC or click volume?
│
├─ Conversions changed?
│   ├─ YES → Clicks changed or CVR changed?
│   │         ├─ Clicks → Go to traffic branch
│   │         └─ CVR → Landing page, offer, or audience quality issue
│   └─ NO → Check attribution and conversion lag
│
└─ Clicks changed?
    ├─ YES → Impressions changed or CTR changed?
    │         ├─ Impressions → Budget, QS, competitive, or search volume issue
    │         └─ CTR → Ad relevance, creative, or SERP position issue
    └─ NO → Check other metrics (CPC, conv. rate)
```

### 3.2 Segment the root metric

Once you identify the root metric (the highest-level metric that moved), segment it to find where the change is concentrated:

| Segment | Check | Finding |
|---------|-------|---------|
| **Campaign** | Which campaigns are affected? | All / Specific: ___ |
| **Device** | Is the change device-specific? | All / Desktop / Mobile / Tablet |
| **Location** | Is the change location-specific? | All / Specific: ___ |
| **Day of week** | Is there a day pattern? | All / Specific: ___ |
| **Audience** | Is a specific audience affected? | All / Specific: ___ |
| **Search terms** | Are new search terms triggering? (Search only) | Normal / New terms: ___ |
| **Network** | Search vs. Partners vs. Display | All / Specific: ___ |

> 💡 **Segment one dimension at a time:** Crossing multiple segments (mobile + California + Tuesday) creates samples too small to trust. Find the one dimension that explains the movement.

### 3.3 Identify the root cause

Based on the root metric and segment analysis:

| Root metric | Common root causes |
|------------|-------------------|
| **Impressions down** | Budget limitation, QS decrease, competitor pressure, search volume decline |
| **CTR down** | Ad fatigue, new competitor ads, poor ad position, irrelevant search terms |
| **CPC up** | Competitor bidding increase, QS decrease, broad match expansion |
| **CVR down** | Landing page issue, offer change, audience quality shift, tracking issue |
| **AOV down** | Product mix shift, pricing change, promotional period ended |

---

## Phase 4️⃣: External Cause Check (5 min)

If no internal cause or clear metric tree explanation:

### 4.1 Check for external factors

| External factor | How to check | Finding |
|----------------|-------------|---------|
| **Competitor activity** | Auction Insights (IS, overlap, position) | Changed / Unchanged |
| **Seasonality** | Compare to same period last year | Expected seasonal / Not seasonal |
| **Market events** | News, industry events, macro-economic changes | Found: ___ / Not applicable |
| **Google algorithm/system changes** | Google Ads status dashboard, industry news | Found: ___ / Not applicable |
| **Platform changes** | Google Ads UI notifications, blog announcements | Found: ___ / Not applicable |

### 4.2 Check for tracking-specific issues

If conversions are the anomaly but traffic metrics are stable:

| Check | How | Finding |
|-------|-----|---------|
| Tag firing | Google Tag Assistant or real-time conversion reports | Firing / Not firing |
| Backend comparison | Compare Google Ads conversions to backend data | Match / Discrepancy |
| Conversion lag | Check "Conversions (by conv. time)" vs. standard | Normal lag / Extended |
| Attribution change | Check if attribution model was changed | Unchanged / Changed |

---

## Phase 5️⃣: Resolution (10 min)

### 5.1 Determine the fix

| Root cause type | Resolution approach |
|----------------|-------------------|
| **Internal change (unintentional)** | Revert the change |
| **Internal change (intentional but underperforming)** | Evaluate: give more time or revert |
| **Tracking issue** | Fix tracking immediately |
| **Landing page issue** | Fix page or route traffic to working page |
| **Competitive pressure** | Evaluate if KPIs still on target, don't chase position |
| **Seasonal/external** | Adjust expectations, don't overcorrect |
| **Audience quality shift** | Review targeting, add negatives, adjust audiences |
| **Unknown** | Monitor for one more period, escalate if persists |

### 5.2 Create resolution plan

| Item | Detail |
|------|--------|
| **Root cause** | ___ |
| **Evidence** | ___ |
| **Fix** | ___ |
| **Owner** | ___ |
| **Timeline** | ___ |
| **Success metric** | What metric returning to what level confirms the fix worked |
| **Review date** | When to check if the fix resolved the anomaly |

### 5.3 Document the investigation

```
Anomaly Investigation — [Date]
Account: [Name]

ANOMALY
Metric: [Metric] [direction] by [magnitude]
Entity: [Scope]
Duration: [Timeframe]
Classification: [Breakage / Degradation / Spike / Structural]

INVESTIGATION
Internal causes checked: [List]
Root metric: [Metric at deepest level]
Key segment: [The dimension that explains the movement]
External factors: [Checked and findings]

ROOT CAUSE
Cause: [Description]
Evidence: [Data points supporting this conclusion]
Confidence: High / Medium / Low

RESOLUTION
Action: [Fix description]
Owner: [Name]
Timeline: [When]
Review: [Date to verify fix worked]
```

---

## Validation & definition of done

This SOP is complete when:

- [ ] Anomaly confirmed as real (passed three tests) or classified as noise
- [ ] Internal causes checked via Change History
- [ ] Metric tree traced to root metric
- [ ] Root metric segmented to isolate affected dimension
- [ ] External causes evaluated
- [ ] Root cause identified (or documented as unknown with next steps)
- [ ] Resolution plan created with owner and review date
- [ ] Investigation documented

---

## Exit → Entry bridge

After investigation:

| Timeframe | Action |
|-----------|--------|
| Same day | Begin fix for breakage-type anomalies |
| This week | Implement resolution plan for degradation/spike anomalies |
| Review date | Verify the fix resolved the anomaly |

**If root cause is unknown:**

| Duration | Action |
|----------|--------|
| After 1 more period | Re-run investigation with new data |
| After 2 more periods | Escalate: bring in additional expertise |
| If resolved on its own | Document as transient, update pattern library |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Mental Model | Phase 1 |
| [Metric Tree Reference](../references/Metric Tree Reference.md) | Reference | Phase 3 |
| [Account Change History Reference](../references/Account Change History Reference.md) | Reference | Phase 2 |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference | Phase 3 |
| [Auction Insights Reference](../references/Auction Insights Reference.md) | Reference | Phase 4 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Upstream (daily triage triggers this SOP) |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Upstream (weekly review triggers deeper investigation) |
| [SOP – Resolve Ad Disapprovals](../sops/SOP – Resolve Ad Disapprovals.md) | Downstream (if disapprovals are the root cause) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Investigating noise as if it were an anomaly | Skipping the three tests | Always run volume, magnitude, and persistence tests first |
| Stopping at correlation | "CPC went up so that's the problem" | Trace upstream to the root cause, not just the first metric that moved |
| Not checking Change History first | Jumping to diagnosis without ruling out internal causes | Always check Change History before metric tree analysis |
| Over-segmenting | Crossing 3+ dimensions, finding "patterns" in small samples | Segment one dimension at a time |
| Fixing without documenting | Resolution works but pattern is not recorded | Document every investigation for future reference |
| Investigating too long | Diminishing returns after 60 minutes | Cap at 60 minutes, escalate or revisit if unresolved |

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
