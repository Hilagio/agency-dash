# Alert Configuration Checklist
Created: 2026-02-11
Updated: 2026-04-02

Support_ID: CHECKLIST_27
Status: Done
Category: Monitoring
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

Validates that automated alerts are properly configured across all three monitoring layers, with appropriate thresholds, data windows, and implementation methods.

---

## What this checklist validates

This checklist confirms:

- Layer 1️⃣ (health/governance) alerts catch breakage before it causes damage
- Layer 2️⃣ (performance alerts) catch unexpected metric changes with noise filtering
- Layer 3️⃣ (target monitoring) alerts catch pacing and efficiency deviations
- Alert thresholds are calibrated to account volume and context
- Implementation methods match check complexity (rules vs. scripts vs. tools)

This checklist does **NOT**:

- Explain how to create rules (See: [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md))
- Document rule mechanics (See: [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md))
- Provide automation implementation recipes (See: [Monitoring Automation Reference](../references/Monitoring Automation Reference.md))
- Replace manual monitoring (See: [Account Health Checklist](../checklists/Account Health Checklist.md))

---

## When to use

Run this checklist:

- After initial account setup or onboarding
- After running [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md)
- During quarterly settings reviews to verify alert coverage
- After adding new campaigns (ensure alerts cover them)
- When transitioning automation tools (verify coverage is maintained)

**Frequency flexibility:**

| Account context | Default review frequency | Increase when | Decrease when |
|----------------|------------------------|---------------|---------------|
| Any account | Quarterly | After major structural changes, tool migrations | Never: quarterly is already the minimum |

---

## Layer 1️⃣: Health and governance alerts

These alerts detect structural breakage. All are high priority.

### Conversion tracking

- [ ] Alert configured for campaigns with zero conversions in the last 7 days that normally convert [default: 7-day window, daily check]
- [ ] Alert configured for account-level conversion volume dropping >50% vs. prior 7 days [default: 50% drop]
- [ ] Conversion alerts use 7-day minimum data windows to account for conversion lag
- [ ] All primary conversion actions are covered (not just a subset)

### Ad and asset compliance

- [ ] Alert configured for ads with status "Disapproved" across all campaigns [daily check, email immediately]
- [ ] Alert configured for assets with status "Disapproved" [daily check]
- [ ] Alert configured for campaigns with zero eligible ads [daily check]
- [ ] Disapproval alerts cover all active campaign types (Search, Shopping, PMax)

### URL health

- [ ] URL checking is implemented for high-volume landing pages
- [ ] Broken URL alerts include campaign and ad group context for fast diagnosis
- [ ] URL check frequency matches traffic volume (daily for high-traffic, weekly for lower)

> 💡 **Native Google rules cannot check URL health:** Use a Google Ads Script with UrlFetchApp or a third-party monitoring tool. Manual spot-checks are a safety net, not a primary detection method.

### Feed health (Shopping/PMax accounts only)

- [ ] Merchant Center email notifications are enabled for feed errors and disapprovals
- [ ] Product disapproval count is monitored against baseline
- [ ] Feed processing errors are flagged before they cause significant product loss
- [ ] Inventory sync issues are detected (advertising out-of-stock products)

### Bid strategy status

- [ ] Alert configured for bid strategies showing "Misconfigured" status [daily check]
- [ ] Alert configured for bid strategies in "Learning" for >14 days
- [ ] Alert configured for target CPA/ROAS deviating >30% from actual for 14+ days

### Campaign settings drift

- [ ] Change History is reviewed for auto-applied recommendations
- [ ] Critical settings (location, network, conversion goals) have drift detection

---

## Layer 2️⃣: Performance alerts

These alerts detect unexpected metric changes. Requires noise filtering via minimum data windows and volume thresholds.

### Budget and spend alerts

- [ ] Alert configured for campaigns exceeding daily budget [default: >120% of daily budget, previous day]
- [ ] Alert configured for campaigns with €0 spend that should be active [daily check]
- [ ] Alert configured for budget-limited campaigns losing >20% impression share to budget [default: >20%, weekly]
- [ ] Budget alerts cover all active campaigns (not just a subset)

### Cost efficiency deviation

- [ ] Alert configured for campaigns where CPA exceeds threshold [default: >150% of target CPA, 14-day window]
- [ ] Alert configured for campaigns where ROAS drops below threshold [default: <70% of target ROAS, 14-day window]
- [ ] Alert configured for CPC exceeding historical baseline [default: >130% of 30-day average]
- [ ] Cost alerts use minimum data windows of 14 days for conversion-based metrics
- [ ] Cost alerts include minimum volume filters (ignore campaigns with <10 conversions in the window)

### Conversion volume changes

- [ ] Alert configured for conversion volume dropping >40% vs. prior period [default: 40%, 7-day vs. prior 7-day]
- [ ] Alert configured for conversion value (revenue/gross profit) dropping >40% vs. prior period [default: 40%, 7-day vs. prior 7-day]
- [ ] Volume alerts aggregate to account level for low-volume accounts

### Noise filtering

- [ ] All Layer 2️⃣ alerts have appropriate data windows (not too short, not too long)
- [ ] High-volume accounts (200+ conv/mo): campaign-level alerts with 7-day windows
- [ ] Medium-volume accounts (50-200): campaign-level alerts with 14-day windows
- [ ] Low-volume accounts (15-50): account-level alerts with 30-day windows
- [ ] Minimum volume thresholds are applied to prevent false positives on low-data entities
- [ ] Data windows account for conversion lag if using standard conversion metrics instead of conversions (by time)

---

## Layer 3️⃣: Target monitoring alerts

These alerts track progress toward business goals.

### Monthly pacing (if applicable)

- [ ] Monthly budget pacing is calculated and monitored [default: alert if daily required spend >150% or <50% of original daily budget]
- [ ] Pacing alerts cover all campaigns contributing to monthly targets
- [ ] Pacing dashboard is auto-populated (Sheets or third-party)

### Growth targets

- [ ] Conversion volume vs. target comparison is tracked [default: monthly]
- [ ] Conversion value (revenue/gross profit) vs. target is tracked [default: monthly]

### Efficiency targets

- [ ] CPA vs. target comparison is automated [default: weekly]
- [ ] ROAS vs. target comparison is automated [default: weekly]

---

## Alert infrastructure

- [ ] All alert emails route to the correct recipient(s)
- [ ] Alert notification frequency is appropriate (not overwhelming the inbox)
- [ ] Alert rule history is reviewed at least weekly to verify rules are firing
- [ ] Labels are used to scope alerts to the correct campaigns
- [ ] Alert thresholds are documented (so they can be recalibrated)
- [ ] Alert thresholds are recalibrated quarterly based on account performance

---

## Implementation methods

> ↪️ **How to implement alerts.** See [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md) for the setup procedure and [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) for implementation recipes per tool type (Google rules, Scripts, third-party tools, AI agents).

---

## Quick reference

| Document | Relationship |
|----------|--------------|
| [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md) | Framework: three monitoring layers this checklist validates |
| [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) | Reference: implementation recipes for each alert type |
| [Google Ads Alerts and Rules Reference](../references/Google Ads Alerts and Rules Reference.md) | Reference: rule types, conditions, and mechanics |
| [SOP – Configure Account Alerts](../sops/SOP – Configure Account Alerts.md) | Execution: alert setup procedure |
| [Account Health Checklist](../checklists/Account Health Checklist.md) | Companion: manual checks that alerts complement |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Foundation: alert frequency alignment with cadence tiers |

---

## Version details

- **Version:** 4.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v4.0: Added AI agents/skills column to Implementation methods by layer table. v3.0: Removed inline tool annotations from check items, added "Implementation methods by layer" section with tool suitability mapping. v2.0: Reorganized by monitoring layer, added configurable defaults, implementation method per alert, noise filtering guidance, volume-tiered data windows

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
