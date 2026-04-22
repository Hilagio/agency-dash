# Conversion Data Quality Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_16
Status: Done
Category: Operational
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Validates ongoing data quality of conversion tracking. Run this checklist quarterly, after performance anomalies, or after any changes to website, CMS, or tracking configuration.

---

## What this checklist validates

This checklist confirms:

- Conversion volume and value align with backend data
- No duplicate or test conversions are polluting data
- Attribution model and windows are correctly configured
- Consent Mode is active and modeling within expected ranges
- Enhancement features are healthy and reporting data
- Data hygiene practices are being followed (adjustments, exclusions)

This checklist does **NOT:**

- Validate initial setup completeness (See: [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md))
- Recommend specific settings (See: [Conversion Tracking Configuration Guidelines](../guidelines/Conversion Tracking Configuration Guidelines.md))
- Explain conversion action types (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Provide step-by-step troubleshooting instructions

---

## When to use

Run this checklist:

- Quarterly as part of a scheduled tracking audit
- After performance anomalies (sudden CPA spikes, ROAS drops, conversion volume changes)
- After website or CMS changes (redesign, platform migration, theme update)
- After conversion volume drops by more than 20% without a known cause
- After GTM container updates or tag changes
- When onboarding a new client account (baseline audit)
- After switching bid strategies

---

## Checklist

### Data accuracy

- [ ] Conversion volume in Google Ads is within 10% of backend data (CRM, ecommerce platform)
- [ ] Conversion value in Google Ads is within 15% of backend revenue
- [ ] No duplicate conversions detected (check repeat rate: should be ~1.0 for lead gen, reasonable for ecommerce)
- [ ] Transaction IDs are unique per conversion (no blanks, no repeated IDs)
- [ ] No test or internal conversions are polluting production data
- [ ] Conversion values are dynamic (not all showing the same static value)
- [ ] Currency is correct on all conversion actions
- [ ] Conversion counts have not suddenly spiked or dropped without explanation

> ⚠️ **A discrepancy over 15% between Google Ads and backend data signals a tracking problem:** Investigate before making bid strategy changes. Common causes: duplicate firing, missing Transaction IDs, broken tags, consent blocking.

### Attribution health

- [ ] Attribution model is set to Data-Driven (not Last Click)
- [ ] Over-attribution ratio is known and documented (Google Ads conversions vs. backend)
- [ ] Efficiency targets (CPA/ROAS) are calibrated against the over-attribution ratio
- [ ] View-through conversions are not inflating CPA/ROAS for upper funnel campaigns
- [ ] Engaged-view conversions are evaluated separately from click-through conversions
- [ ] Conversion lag is understood (checked via Path Metrics)
- [ ] Evaluation windows respect conversion lag (do not judge campaigns before lag period has passed)
- [ ] No recently changed attribution settings that could cause data discontinuity

### Consent and compliance

- [ ] Consent Mode is active (check via Google Ads diagnostics)
- [ ] Conversion modeling is active and showing modeled conversions
- [ ] Modeling uplift is reasonable (5-20% is normal, not 50%+)
- [ ] CMP (Consent Management Platform) is functional and consent banner displays correctly
- [ ] Consent banner is accessible on all device types (desktop, mobile, tablet)
- [ ] No recent CMP updates have broken consent signal flow
- [ ] Consent denial rate is tracked and within expected range for your region

> 💡 **If modeling uplift exceeds 30%, check your CMP configuration:** A very high modeling percentage often means the consent banner is too aggressive, broken on certain devices, or blocking too many users from granting consent.

### Enhanced features health

- [ ] Enhanced Conversions diagnostics show healthy status (green check or active)
- [ ] Enhanced Conversions match rate is acceptable (check diagnostics page)
- [ ] Cart Data columns are populated in reports (ecommerce)
- [ ] Cart Data shows product-level revenue breakdowns (ecommerce)
- [ ] New customer segmentation shows data in Conversions reports (if implemented)
- [ ] New customer percentage is within expected range (if implemented)
- [ ] Custom variables show recent values in Segments (if implemented)
- [ ] Server-side tagging container is up and processing requests (if implemented)

### Data hygiene

- [ ] Conversion Adjustments are being uploaded regularly (ecommerce returns, lead value updates)
- [ ] Adjustment upload frequency matches the recommendation (daily for high-return ecommerce, weekly minimum)
- [ ] No tracking outages occurred without Data Exclusions applied
- [ ] All past Data Exclusions have correct start/end times and appropriate scope
- [ ] Secondary conversion actions are not accidentally set to Primary
- [ ] No vanity metrics are set as conversion actions (scroll depth, time on site, bounce rate)
- [ ] Deprecated or unused conversion actions are paused or removed
- [ ] GA4 import actions are not double-counting alongside GACT pixel actions

### Offline Conversion Tracking health (Lead Gen / SaaS)

- [ ] OCT uploads are running on schedule (daily or weekly)
- [ ] Upload error rate is acceptable (some unmatched records are normal)
- [ ] CRM pipeline stages still map correctly to Google Ads conversion actions
- [ ] GCLID capture is still functioning on all form/landing page variants
- [ ] Conversion values from OCT reflect actual deal values (not stale estimates)
- [ ] Import conversion actions are still set to the correct optimization level

---

## Quick reference

| Document | Relationship |
|----------|--------------|
| [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md) | Initial setup validation (run this first if setup is new) |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action types and settings |
| [Conversion Adjustments Reference](../references/Conversion Adjustments Reference.md) | RESTATE and RETRACT for correcting individual conversions |
| [Data Exclusions Reference](../references/Data Exclusions Reference.md) | Time-period exclusions for tracking outages |
| [Conversion Tracking Configuration Guidelines](../guidelines/Conversion Tracking Configuration Guidelines.md) | Recommended settings for all tracking features |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum volumes for bid strategies |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Strategic framework for measurement progression |

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
