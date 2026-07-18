# Reporting Quality Checklist
Created: 2026-02-05
Updated: 2026-04-02

Support_ID: CHECKLIST_23
Status: Done
Category: Operational
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Reporting
Pillar: 0

## Purpose

Validates that dashboards and reports are properly configured to surface actionable insights, use correct metrics, and match audience needs.

---

## What this checklist validates

This checklist confirms:

- Reports include the right metrics for the audience
- Comparisons and context are included
- Data sources and attribution are consistent
- Formatting enables quick interpretation
- Reports drive decisions, not just display data

This checklist does **NOT**:

- Define which KPIs to track (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Explain metric definitions (See: [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md))

---

## When to use

Run this checklist:

- After building a new dashboard or report
- Before sharing reports with stakeholders
- During quarterly reporting audits
- When taking over an account (audit existing reports)

---

## Checklist

### Metric Selection

- [ ] Primary KPIs match documented business goals
- [ ] Secondary KPIs (guardrails) are included
- [ ] No vanity metrics without actionable context
- [ ] Metrics are limited to 5-7 per view (not data-dumping)
- [ ] Custom columns are documented and validated

### Comparisons and Context

- [ ] Current period vs. target is shown
- [ ] Current period vs. previous period is shown
- [ ] Percentage change is calculated (not just raw numbers)
- [ ] Date ranges are clearly labeled
- [ ] Conversion lag is accounted for (recent periods marked incomplete if needed)

### Attribution Consistency

- [ ] Same attribution model used across all reports
- [ ] Attribution model is documented in report
- [ ] Conversion actions included are consistent
- [ ] Cross-platform attribution notes are included (if applicable)

### Data Accuracy

- [ ] Conversion tracking is verified working
- [ ] Data matches Google Ads UI (spot-check key numbers)
- [ ] Filters are correctly applied (no accidental exclusions)
- [ ] Date range is complete (full weeks/months for clean comparison)
- [ ] Timezone is consistent

### Audience Matching

- [ ] Report depth matches audience (executive = top-line, specialist = granular)
- [ ] Jargon is appropriate for audience
- [ ] Action items are clear for the audience
- [ ] Frequency matches decision cadence (weekly for tactical, monthly for strategic)

### Formatting

- [ ] Primary KPIs are visually prominent (top of report)
- [ ] Numbers are rounded appropriately (no excessive decimals)
- [ ] Currency symbols are consistent
- [ ] Tables have clear headers and alignment
- [ ] Charts use appropriate visualization (trends = line, comparison = bar)
- [ ] Outliers or issues are highlighted (color coding or annotations)

### Segmentation

- [ ] Segmentation level matches purpose (campaign for strategic, keyword for tactical)
- [ ] Only one segmentation dimension per view (not over-segmented)
- [ ] Sufficient data exists for segment-level conclusions (100+ conversions or 30 days)

### Actionability

- [ ] Each metric can inform a specific optimization action
- [ ] "So what?" is answered for each data point
- [ ] Next steps or recommendations are included (if report type warrants)
- [ ] Issues are prioritized by impact

### Documentation

- [ ] Report purpose is documented
- [ ] Metric definitions are accessible (linked or noted)
- [ ] Update frequency is documented
- [ ] Owner/creator is documented
- [ ] Version or last-updated date is included

---

## Report Type-Specific Checks

### Executive Reports

- [ ] Limited to 5 or fewer top-line metrics
- [ ] Clear "on track" or "off track" summary
- [ ] Minimal detail (link to detailed reports if needed)
- [ ] Business-oriented language (revenue, profit) not platform jargon

### Weekly Performance Reports

- [ ] Covers full week (Monday-Sunday or consistent)
- [ ] Compares to same week last period (week-over-week or year-over-year)
- [ ] Identifies top issue for investigation
- [ ] Documents actions taken

### Diagnostic Reports

- [ ] Segmentation isolates the variable being investigated
- [ ] Time range is long enough for statistical validity
- [ ] Compares to baseline period
- [ ] Root cause hypothesis is documented

---

## Quick Reference

| Document | Relationship |
|----------|--------------|
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Framework for reporting approach |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Defines which metrics to prioritize |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metric definitions |
| [Custom Columns Reference](../references/Custom Columns Reference.md) | Custom metric formulas |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Uses reports validated by this checklist |

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
