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

Validates that Display, Video, and Demand Gen audience targeting is performing well across demographics, expansion impact, combined segments, audience insights, and cross-campaign consistency. Requires 30+ days of campaign data.

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

- During monthly Display, Video, or Demand Gen audience reviews
- When audience-level CPA exceeds targets by 2x+
- Before scaling audience budgets
- After 30+ days of campaign data has accumulated

---

## Checklist

### Expansion performance

- [ ] Expansion performance measured via "Total: Expansion and optimized targeting" row
- [ ] Expanded vs targeted CPA/ROAS compared: expanded > 2x targeted = turn OFF
- [ ] Demand Gen optimized targeting demographic behavior reviewed (may serve beyond demographic selections when ON)

### Demographics validation

- [ ] Demographic performance reviewed across all dimensions (Age, Gender, Parental status, Household income)
- [ ] Demographic outliers addressed (CPA > 2x campaign average with 50+ clicks)
- [ ] "Unknown" segment reviewed: no exclusion without 30+ days of data showing CPA > 2x campaign average
- [ ] No demographic exclusions applied without 30+ days of performance data
- [ ] Demographics used as a layer on top of audience segments, not as standalone targeting

### Combined segments validation

- [ ] Combined segments maintain sufficient audience size after AND/NOT filtering (check "Ready" status)
- [ ] Component segments individually validated before combining
- [ ] Combined segments tested in separate ad groups before scaling
- [ ] No more than 3 AND conditions per combined segment (diminishing returns)
- [ ] Combined segment performance compared to individual component segments

### Audience insights review

- [ ] Insights page reviewed for high-index segments (3x+) not currently targeted
- [ ] Your data insights checked in Audience Manager for cross-campaign performance
- [ ] High-index untargeted segments evaluated for addition as targeting or in combined segments
- [ ] Asset audience insights reviewed for creative-audience alignment opportunities

### Observation mode review

- [ ] Observation-mode segments monitored for bid adjustment opportunities
- [ ] No segments dormant in Observation for 60+ days without analysis
- [ ] High-performing Observation segments flagged for graduation to Targeting

### Content targeting performance (Display/Video only)

- [ ] Content targeting evaluated: whether adding topics/placements would complement audience targeting
- [ ] Zero-conversion topics/keywords removed after 30+ days

### Cross-campaign consistency

- [ ] No audience overlap between ad groups targeting the same users with different bids
- [ ] Remarketing and prospecting campaigns have mutually exclusive audiences
- [ ] Frequency capping is set to avoid audience fatigue (Display/Video)
- [ ] Budget allocation matches audience priority (warmer audiences get proportionally more budget)

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

- **Version:** 1.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
