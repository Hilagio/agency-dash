# Monthly Performance Review Checklist
Created: 2026-02-11

Support_ID: CHECKLIST_26
Status: ready-to-publish
Category: Reporting
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Reporting
Pillar: 0

## Purpose

Validates that the monthly performance review covers all strategic, structural, and health dimensions that cannot be adequately assessed at weekly cadence. The monthly review spans all three monitoring layers: a deep Layer 1️⃣ audit, Layer 2️⃣ baseline recalibration, and full Layer 3️⃣ target assessment.

---

## What this checklist validates

This checklist confirms:

- Conversion tracking integrity is verified against backend data (Layer 1️⃣ deep dive)
- Campaign settings have not drifted from intended configuration (Layer 1️⃣ deep dive)
- Google's auto-applied recommendations are reviewed (Layer 1️⃣)
- Account structure and baseline thresholds are recalibrated (Layer 2️⃣)
- Competitive landscape changes are identified (Layer 2️⃣/3️⃣)
- Performance trends are assessed against business goals over 30+ day windows (Layer 3️⃣)

This checklist does **NOT**:

- Replace daily health checks (See: [Account Health Checklist](../checklists/Account Health Checklist.md))
- Replace weekly performance reviews (See: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))
- Provide step-by-step procedures (See: [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md))
- Cover quarterly strategic reviews (See: [Quarterly Review Checklist](../checklists/Quarterly Review Checklist.md))

> ↪️ **Monitoring layer context:** This checklist spans all three layers of the [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md). Sections are tagged with their primary layer for reference.

---

## When to use

Run this checklist:

- First week of each month as part of the monthly performance review
- After a quarter ends (combined with quarterly strategic review)
- When onboarding a new account (baseline establishment)

**Frequency flexibility:**

| Monthly conversions | Default scope | Adjust when |
|----------------|--------------|-------------|
| 200+ (high) | Full checklist, all sections | Add competitive deep-dive during periods of high competitive activity |
| 50-200 (medium) | Full checklist | Skip competitive deep-dive if stable, focus on efficiency and pacing |
| 15-50 (low) | Full checklist with extended data windows (60-90 days) | Use YoY comparisons heavily since MoM data is noisy |

**Automation context:** Sections marked `[auto-prep]` can be pre-populated automatically via scripts or dashboards before the review. This reduces the monthly review from data gathering + analysis to analysis only.

---

## Checklist

### Conversion tracking diagnostics `[Layer 1️⃣ deep dive]` `[auto-prep]`

- [ ] Backend conversion totals for the month are recorded (CRM, analytics, ecommerce platform)
- [ ] Google Ads to backend conversion discrepancy is under 15%
- [ ] Every primary conversion action shows status "Active"
- [ ] Every primary conversion action's window, counting method and value setting matches its documented configuration
- [ ] Enhanced Conversions match rate is 50% or higher (if configured)
- [ ] Offline conversion imports for the month completed with no upload errors (if configured)

### Campaign settings review `[Layer 1️⃣ deep dive]` `[auto-prep]`

- [ ] Location targeting matches the documented configuration on every campaign
- [ ] Network settings match the documented configuration on every campaign (Search Partners, Display Expansion)
- [ ] Ad rotation is set to "Optimize" on every campaign
- [ ] Language targeting matches the documented configuration on every Demand Gen, Video, Display and PMax campaign
- [ ] Search ad copy and landing pages are in one language per ad group
- [ ] Campaign-specific goals point to the intended conversion actions
- [ ] Brand exclusions and inclusions match the documented configuration (PMax, Search)

### Landing page health `[Layer 1️⃣ deep dive]` `[auto-prep]`

- [ ] Every top landing page passes Core Web Vitals
- [ ] No primary landing page increased its bounce rate versus the prior month
- [ ] Landing page conversion rate change versus the prior month is recorded
- [ ] Every primary landing page carries the messaging of the ads pointing at it

### Google Recommendations and auto-apply `[Layer 1️⃣]`

- [ ] Every auto-apply category is disabled
- [ ] Change History for the month contains no auto-applied recommendations
- [ ] Every outstanding recommendation is applied or dismissed
- [ ] Optimization score is recorded

### Audience health `[Layer 2️⃣]`

- [ ] No remarketing list shrank versus the prior month
- [ ] Customer Match list refreshed within the last 30 days
- [ ] Every audience segment with a CPA above 2x the campaign average has a documented decision
- [ ] Every audience segment intended to be active has impressions in the last 30 days

### Quality Score review (Search) `[Layer 2️⃣]` `[auto-prep]`

- [ ] Weighted non-brand Quality Score is calculated and compared to the prior month
- [ ] Every high-volume keyword with QS below 5 is flagged
- [ ] QS component values are recorded for the month (Expected CTR, Ad Relevance, Landing Page Experience)
- [ ] Every keyword whose QS fell versus the prior month has a documented decision

### Baseline recalibration `[Layer 2️⃣]`

- [ ] Status Board green/orange/red thresholds are compared against the last 30 days of data
- [ ] Every threshold sitting outside its baseline band is adjusted
- [ ] Every alert whose false positive rate exceeded its documented limit is recalibrated
- [ ] Volume tier classification matches the last 30 days of conversion volume

### Competitive landscape `[Layer 2️⃣/3️⃣]` `[auto-prep]`

- [ ] Auction Insights impression share trend over the last 3 months is recorded
- [ ] Every competitor new to Auction Insights this month is listed
- [ ] Every competitor that left Auction Insights this month is listed with its CPC impact
- [ ] Outranking share trend is recorded for the top 3-5 competitors
- [ ] Merchant Center price competitiveness is recorded (ecommerce only)

### Bid strategy performance `[Layer 2️⃣/3️⃣]` `[auto-prep]`

- [ ] Target versus actual performance is recorded for every bid strategy
- [ ] Bid strategy status is "Eligible" for all active strategies
- [ ] Every portfolio bid strategy CPC cap is at least 3x the average CPC of its top converting search terms
- [ ] Every strategy under 30 conversions per month has a documented consolidation decision
- [ ] Seasonality adjustments for the coming month are set, or recorded as not needed

### Performance trend analysis `[Layer 3️⃣]` `[auto-prep]`

- [ ] Primary KPIs are compared 30-day versus prior 30-day (conversions, CPA/ROAS, revenue)
- [ ] Primary KPIs are compared year over year
- [ ] Month-over-month trajectory against annual targets is recorded
- [ ] Every campaign deviating more than 30% from its prior month is listed
- [ ] Top-performing and bottom-performing campaigns are documented

### Account structure `[Layer 3️⃣]`

- [ ] Every campaign under 30 conversions per month has a documented consolidation decision
- [ ] Every ad group under 1,000 impressions per week has a documented merge decision
- [ ] Campaign count matches the documented structure for the account's volume tier
- [ ] Every active campaign has a named owner

### Budget and allocation `[Layer 3️⃣]` `[auto-prep]`

- [ ] Month-to-date spend is within 10% of pace
- [ ] Budget allocation across campaigns matches the documented allocation plan
- [ ] Every campaign flagged "Limited by budget" has a documented decision
- [ ] Next month's budget is confirmed with stakeholders (if applicable)

### Strategic alignment `[Layer 3️⃣]`

- [ ] Every action taken this month maps to an item on the quarterly roadmap
- [ ] The current constraint sprint has a dated status entry
- [ ] Experiments running, completed and planned are listed
- [ ] Action items for next month are documented

---

## Quick reference

| Document | Relationship |
|----------|--------------|
| [Account Monitoring Mental Model](../mental-models/Account Monitoring Mental Model.md) | Framework: three monitoring layers this checklist spans |
| [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) | Execution: monthly review procedure using this checklist |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Companion: weekly review (monthly builds on this) |
| [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md) | Execution: competitive analysis for landscape section |
| [SOP – Manage Google Recommendations](../sops/SOP – Manage Google Recommendations.md) | Execution: recommendation review procedure |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Foundation: monthly cadence tier definition |
| [Monitoring Automation Reference](../references/Monitoring Automation Reference.md) | Reference: automation recipes for pre-populating review data |
| [Quarterly Review Checklist](../checklists/Quarterly Review Checklist.md) | Companion: quarterly strategic checklist (builds on monthly) |
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Foundation: reporting hierarchy and types |

---

## Version details

- **Version:** 6.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer
- **Changelog:** v5.0: Reordered checklist sections from Layer 1️⃣ to Layer 3️⃣ for logical progression. v4.0: Linked quarterly forward reference to published Quarterly Review Checklist. v3.0: Added quarterly review forward reference. v2.0: Added layer mapping per section, automation context tags, frequency flexibility, baseline recalibration section, cross-referenced Account Monitoring Mental Model, sentence case headings

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
