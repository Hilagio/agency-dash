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

- [ ] Google Ads conversion totals compared to backend data (CRM, analytics, ecommerce platform)
- [ ] Discrepancy percentage calculated and within acceptable band (typically <15%)
- [ ] All primary conversion actions verified as active
- [ ] Conversion action settings reviewed (window, counting, value)
- [ ] Enhanced conversions match rate checked (if applicable)
- [ ] Offline conversion import health verified (if applicable)

### Campaign settings review `[Layer 1️⃣ deep dive]` `[auto-prep]`

- [ ] Location targeting settings unchanged from intended configuration
- [ ] Network settings verified (Search Partners, Display Expansion)
- [ ] Ad rotation settings confirmed as "Optimize"
- [ ] Language targeting correct for all campaigns
- [ ] Campaign-specific goals aligned with intended conversion actions
- [ ] Brand exclusions/inclusions still accurate (PMax, Search)

### Landing page health `[Layer 1️⃣ deep dive]` `[auto-prep]`

- [ ] Top landing pages load speed verified (Core Web Vitals)
- [ ] No increase in bounce rate on primary landing pages
- [ ] Landing page conversion rate trends reviewed
- [ ] Landing page content still matches ad messaging

### Google Recommendations and auto-apply `[Layer 1️⃣]`

- [ ] Auto-apply settings verified (all categories disabled per guidelines)
- [ ] Change History reviewed for any auto-applied recommendations
- [ ] Outstanding recommendations reviewed and dismissed or applied
- [ ] Optimization score noted (for reference, not as a target)

### Audience health `[Layer 2️⃣]`

- [ ] Remarketing list sizes reviewed (not shrinking unexpectedly)
- [ ] Customer Match list freshness verified (uploaded within 90 days)
- [ ] Audience segment performance reviewed for actionable patterns
- [ ] No audience segments with zero impressions that should be active

### Quality Score review (Search) `[Layer 2️⃣]` `[auto-prep]`

- [ ] Weighted non-brand Quality Score calculated and compared to prior month
- [ ] High-volume keywords with QS <5 identified and flagged
- [ ] QS component trends reviewed (Expected CTR, Ad Relevance, Landing Page Experience)
- [ ] Keywords with declining QS investigated or queued for action

### Baseline recalibration `[Layer 2️⃣]`

- [ ] Status Board green/orange/red thresholds reviewed against last 30 days of data
- [ ] Thresholds adjusted if baseline performance shifted significantly
- [ ] Alert thresholds recalibrated if false positive rate was high
- [ ] Volume tier classification confirmed (has the account moved tiers?)

### Competitive landscape `[Layer 2️⃣/3️⃣]` `[auto-prep]`

- [ ] Auction Insights reviewed for impression share trends over last 3 months
- [ ] New competitors identified (if any appeared)
- [ ] Competitor disappearances noted (and CPC impact assessed)
- [ ] Outranking share trends assessed for top 3-5 competitors
- [ ] Merchant Center price competitiveness reviewed (ecommerce only)

### Bid strategy performance `[Layer 2️⃣/3️⃣]` `[auto-prep]`

- [ ] Each bid strategy's target vs. actual performance reviewed
- [ ] Bid strategy status is "Eligible" for all active strategies
- [ ] Portfolio bid strategy CPC caps still appropriate
- [ ] Strategies with <30 conversions/month flagged for consolidation consideration
- [ ] Seasonality adjustments reviewed and updated if needed

### Performance trend analysis `[Layer 3️⃣]` `[auto-prep]`

- [ ] Primary KPIs (conversions, CPA/ROAS, revenue) reviewed for 30-day vs. prior 30-day comparison
- [ ] Primary KPIs reviewed for year-over-year comparison (seasonality adjustment)
- [ ] Month-over-month trajectory assessed against annual targets
- [ ] Significant outlier campaigns identified and noted
- [ ] Top-performing and bottom-performing campaigns documented

### Account structure `[Layer 3️⃣]`

- [ ] Campaigns with <30 conversions/month reviewed for consolidation
- [ ] Ad groups with low impression volume reviewed for merging
- [ ] Campaign count appropriate for account volume and complexity
- [ ] No orphaned or forgotten campaigns running without oversight

### Budget and allocation `[Layer 3️⃣]` `[auto-prep]`

- [ ] Monthly spend vs. monthly budget assessed
- [ ] Budget allocation across campaigns reviewed for optimal distribution
- [ ] Budget-limited campaigns identified and prioritized
- [ ] Next month's budget confirmed with stakeholders (if applicable)

### Strategic alignment `[Layer 3️⃣]`

- [ ] Account activity aligned with quarterly roadmap
- [ ] Constraint sprints on track (current bottleneck being addressed)
- [ ] Testing roadmap reviewed: experiments running, completed, or planned
- [ ] Action items documented for next month

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

- **Version:** 5.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v5.0: Reordered checklist sections from Layer 1️⃣ to Layer 3️⃣ for logical progression. v4.0: Linked quarterly forward reference to published Quarterly Review Checklist. v3.0: Added quarterly review forward reference. v2.0: Added layer mapping per section, automation context tags, frequency flexibility, baseline recalibration section, cross-referenced Account Monitoring Mental Model, sentence case headings

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
