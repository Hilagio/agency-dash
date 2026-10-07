# Audience Targeting Health Checklist
Created: 2026-04-01

Support_ID: CHECKLIST_37
Status: Done
Category: Audiences
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Audiences
Pillar: 7

## Purpose

Validates that Video and Demand Gen audience targeting is performing well across demographics, expansion impact, combined segments, audience insights, and cross-campaign consistency. Requires 30+ days of campaign data.

---

## What this checklist validates

This checklist confirms:

- Expansion features are delivering acceptable performance (not 2x+ worse than targeted)
- Demographics are optimized (outliers addressed, data-backed exclusions only)
- Combined segments are performing and properly sized
- Audience insights are reviewed for new targeting opportunities
- Observation-mode segments are being graduated or removed
- Cross-campaign audience structure avoids overlap and waste

This checklist does **NOT:**

- Validate initial targeting setup (See: [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md))
- Validate PMax audience signals (See: [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md))
- Execute optimization procedures (See: [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md))

---

## When to use

Run this checklist:

- During monthly Video or Demand Gen audience reviews
- When audience-level CPA exceeds targets by 2x+
- Before scaling audience budgets
- After 30+ days of campaign data has accumulated

---

## Checklist

### Expansion performance

- [ ] Expanded performance is recorded from the "Total: Expansion and optimized targeting" row
- [ ] Expanded vs targeted CPA/ROAS compared: expanded > 2x targeted = turn OFF
- [ ] Every Demand Gen campaign with optimized targeting ON has a documented decision accepting serving outside its demographic selections

### Demographics validation

- [ ] Demographic performance is recorded for Age, Gender, Parental status and Household income
- [ ] Demographic outliers addressed (CPA > 2x campaign average with 50+ clicks)
- [ ] The "Unknown" segment is excluded only where 30+ days of data show CPA above 2x the campaign average
- [ ] No demographic exclusions applied without 30+ days of performance data
- [ ] Demographics used as a layer on top of audience segments, not as standalone targeting

### Combined segments validation

- [ ] Combined segments maintain sufficient audience size after AND/NOT filtering (check "Ready" status)
- [ ] Component segments individually validated before combining
- [ ] Combined segments tested in separate ad groups before scaling
- [ ] No more than 3 AND conditions per combined segment
- [ ] Combined segment performance compared to individual component segments

### Audience insights review

- [ ] Every untargeted segment indexing 3x or higher on the Insights page is listed
- [ ] Cross-campaign segment performance is recorded from Your data insights in Audience manager
- [ ] Every high-index untargeted segment has an add-or-skip decision
- [ ] Asset audience insights are recorded per asset group

### Observation mode review

- [ ] Every Observation-mode segment with 50+ clicks has a bid adjustment decision
- [ ] No segments dormant in Observation for 60+ days without analysis
- [ ] Every Observation segment beating the campaign average CPA is flagged for graduation to Targeting

### Content targeting performance (Video, Demand Gen)

- [ ] Adding topic or placement targeting has an add-or-skip decision
- [ ] Zero-conversion topics/keywords removed after 30+ days

### Cross-campaign consistency

- [ ] No audience overlap between ad groups targeting the same users with different bids
- [ ] Remarketing and prospecting campaigns have mutually exclusive audiences
- [ ] Frequency capping is set on every Video campaign
- [ ] Warmer audiences hold a larger budget share than colder audiences

---

## Quick reference

| Document | Relationship |
|----------|-------------|
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Combined segment patterns and demographics optimization |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Expansion mechanics, demographics, combined segments, audience insights |
| [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md) | Execution procedure for audience optimization |
| [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) | Initial setup validation (run before this checklist) |
| [Expand Audience Reach](../playbooks/Expand Audience Reach.md) | Decision routing for audience expansion |

---

## Version details

- **Version:** 2.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
