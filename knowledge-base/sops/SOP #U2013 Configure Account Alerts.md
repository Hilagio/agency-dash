# SOP – Configure Account Alerts
Created: 2026-02-11

Agent_Executable: No
Category: Monitoring
Human_Approval_Required: No
Primary Outcome: Automated alert rules configured for all critical monitoring categories
SOP_ID: SOP_62
Secondary Outcomes: Reduced manual scanning time, faster breakage detection
Status: Done
Domain: Operational
Pillar: 0

## Purpose

This SOP guides you through configuring Google Ads automated rules as email alerts that surface critical account issues automatically, reducing the manual scanning burden of daily monitoring.

> ❓ **The big question:** How do I set up automated alerts so I get notified about breakage before it costs me money?

Alerts complement daily monitoring. They don't replace it, but they reduce the chance of missing critical issues between manual checks.

---

## What this SOP is NOT

This SOP does **not:**

- Document rule mechanics in detail (See: [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md))
- Define which checks to run daily (See: [Account Health Checklist](../checklists/Account Health Checklist.md))
- Configure Google Ads Scripts for advanced monitoring (separate system)

## When to run this SOP

Run this SOP:

- During initial account setup or onboarding
- When taking over management of an existing account
- After quarterly settings review identifies missing alert coverage

---

## Before you start

### Required inputs

- Google Ads account access with admin permissions
- Target CPA or ROAS values per campaign
- Expected daily spend levels per campaign
- Expected daily/weekly conversion volumes

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md) | Rule types and conditions |
| [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md) | Verification after setup |
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Check categories to automate |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Budget alerts** | Catch overspend and underspend | Budget alert rules created |
| **Phase 2️⃣: Conversion alerts** | Catch tracking failures and volume drops | Conversion alert rules created |
| **Phase 3️⃣: Cost efficiency alerts** | Catch CPA/ROAS degradation | Cost efficiency alert rules created |
| **Phase 4️⃣: Disapproval alerts** | Catch policy violations | Disapproval alert rules created |
| **Phase 5️⃣: Verify and test** | Confirm all alerts are active | Alert Configuration Checklist passed |

---

## Phase 1️⃣: Budget Alerts

### 1.1 Create overspend alert

1. Navigate to Tools & Settings > Bulk Actions > Rules
2. Click "+ Campaign rule"
3. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All enabled campaigns |
| Condition | Cost > [120% of typical daily budget] |
| Using data from | Previous day |
| Frequency | Daily |
| Email | Send when conditions are met |
| Name | "ALERT: Daily overspend" |

4. Click "Preview results" to verify logic
5. Save the rule

### 1.2 Create underspend alert

1. Create a new campaign rule
2. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All enabled campaigns (or label: "Monitor-Daily") |
| Condition 1 | Cost = €0 |
| Condition 2 | Status = Enabled |
| Using data from | Previous day |
| Frequency | Daily |
| Name | "ALERT: Zero spend on active campaign" |

### 1.3 Create budget-limited alert

1. Create a new campaign rule
2. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All enabled campaigns |
| Condition | Search lost IS (budget) > 20% |
| Using data from | Last 7 days |
| Frequency | Weekly (Monday) |
| Name | "ALERT: Budget-limited campaigns" |

---

## Phase 2️⃣: Conversion Alerts

### 2.1 Create zero-conversion alert

1. Create a new campaign rule
2. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All enabled campaigns (or label: "Core-Campaigns") |
| Condition 1 | Conversions = 0 |
| Condition 2 | Cost > €50 (adjust to account scale) |
| Using data from | Last 7 days |
| Frequency | Weekly |
| Name | "ALERT: Zero conversions with spend" |

> ⚠️ **Use 7-day data windows minimum for conversion rules:** Shorter windows produce false positives due to conversion lag.

### 2.2 Create conversion volume drop alert

1. Create a new campaign rule
2. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All enabled campaigns |
| Condition | Conversions < [40% of expected weekly volume] |
| Using data from | Last 7 days |
| Frequency | Weekly |
| Name | "ALERT: Low conversion volume" |

---

## Phase 3️⃣: Cost Efficiency Alerts

### 3.1 Create CPA alert

1. Create a new campaign rule
2. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All enabled campaigns |
| Condition 1 | Cost/conv. > [2x target CPA] |
| Condition 2 | Conversions >= 5 |
| Using data from | Last 14 days |
| Frequency | Weekly |
| Name | "ALERT: CPA exceeds 2x target" |

### 3.2 Create CPC spike alert

1. Create a new campaign rule
2. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All enabled campaigns |
| Condition | Avg. CPC > [150% of typical CPC] |
| Using data from | Last 7 days |
| Frequency | Weekly |
| Name | "ALERT: CPC spike detected" |

---

## Phase 4️⃣: Disapproval Alerts

### 4.1 Create ad disapproval alert

1. Navigate to Tools & Settings > Bulk Actions > Rules
2. Click "+ Ad rule"
3. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All ads |
| Condition | Policy approval status = Disapproved |
| Using data from | Same day |
| Frequency | Daily |
| Name | "ALERT: Ad disapproved" |

### 4.2 Create ad group with no ads alert

1. Create a new ad group rule
2. Configure:

| Setting | Value |
|---------|-------|
| Rule type | Send email |
| Apply to | All enabled ad groups |
| Condition 1 | Impressions = 0 |
| Condition 2 | Status = Enabled |
| Using data from | Last 7 days |
| Frequency | Weekly |
| Name | "ALERT: Ad group with zero impressions" |

---

## Phase 5️⃣: Verify and Test

### 5.1 Review all rules

1. Navigate to Tools & Settings > Bulk Actions > Rules
2. Verify all created rules show "Enabled" status
3. Confirm email recipients are correct for each rule
4. Run "Preview results" on each rule to verify they match expected entities

### 5.2 Run Alert Configuration Checklist

Run through the [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md) to verify complete coverage.

### 5.3 Document alert inventory

Create a reference list of all configured alerts:

| Alert name | Type | Frequency | Scope |
|-----------|------|-----------|-------|
| ALERT: Daily overspend | Budget | Daily | All campaigns |
| ALERT: Zero spend on active campaign | Budget | Daily | All campaigns |
| ALERT: Budget-limited campaigns | Budget | Weekly | All campaigns |
| ALERT: Zero conversions with spend | Conversion | Weekly | Core campaigns |
| ALERT: Low conversion volume | Conversion | Weekly | All campaigns |
| ALERT: CPA exceeds 2x target | Cost | Weekly | All campaigns |
| ALERT: CPC spike detected | Cost | Weekly | All campaigns |
| ALERT: Ad disapproved | Disapproval | Daily | All ads |
| ALERT: Ad group with zero impressions | Delivery | Weekly | All ad groups |

---

## Validation & definition of done

This SOP is complete when:

- [ ] Budget alerts configured (overspend, underspend, budget-limited)
- [ ] Conversion alerts configured (zero conversions, volume drops)
- [ ] Cost efficiency alerts configured (CPA, CPC)
- [ ] Disapproval alerts configured (ads, assets)
- [ ] All rules verified with "Preview results"
- [ ] Alert Configuration Checklist passed
- [ ] Alert inventory documented

---

## Exit → Entry bridge

After alert configuration:

| Timeframe | Action |
|-----------|--------|
| Next business day | Verify first alert emails arrive as expected |
| First week | Review rule history to confirm rules are executing |
| Monthly | Review and tune alert thresholds based on false positive rate |

**If alert configuration issues arise:**

| Issue | Route to |
|-------|----------|
| Too many false positive alerts | Widen thresholds or extend data windows |
| Alerts not firing when expected | Check rule conditions and Preview results |
| Need more sophisticated monitoring | Implement Google Ads Scripts |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md) | Reference | All phases |
| [Alert Configuration Checklist](../checklists/Alert Configuration Checklist.md) | Checklist | Phase 5 |
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Checklist | Check categories to automate |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Downstream (alerts reduce daily scanning time) |
| [SOP – Resolve Ad Disapprovals](../sops/SOP – Resolve Ad Disapprovals.md) | Conditional (triggered by disapproval alerts) |
| [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) | Conditional (triggered by anomaly alerts) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Alert fatigue | Thresholds too tight, too many false positives | Start with wider thresholds, tighten over time |
| Alerts not checked | Emails go to spam or get buried | Create dedicated email filter/folder |
| Stale alerts | Account scale changed but thresholds did not | Review thresholds quarterly |
| Incomplete coverage | New campaigns added without alert coverage | Use "All campaigns" scope or labels |
| Over-reliance on alerts | Assuming alerts catch everything | Maintain daily manual triage alongside alerts |

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
