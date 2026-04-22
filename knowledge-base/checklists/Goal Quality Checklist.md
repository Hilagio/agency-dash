# Goal Quality Checklist
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CHECKLIST_13
Status: Done
Category: Strategic
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Foundations
Pillar: 4

## Purpose

Validates that business goals, Google Ads goals, and KPIs are properly defined, translated, and measurable before campaign execution begins.

---

## What this checklist validates

This checklist confirms:

- Business goals are SMART and properly categorized (growth vs efficiency)
- Google Ads goals are translated from business goals, not invented independently
- KPIs are organized into three tiers (primary, secondary/guardrails, diagnostic)
- Goal viability is validated with available tools and data
- Reporting and review cadence is established

This checklist does **NOT:**

- Explain goal-setting strategy (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Define KPI calculations (See: [KPI Reference](../references/KPI Reference.md))
- Cover unit economics validation (See: [Unit Economics Reference](../references/Unit Economics Reference.md))
- Provide step-by-step goal-setting process (See: [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md))

---

## When to use

Run this checklist:

- During client onboarding, before campaign setup
- At the start of each new quarter when goals are revised
- When a stakeholder changes business objectives mid-cycle
- Before committing to new campaign types or budget increases

---

## Checklist

### Business goals

- [ ] Business goal is documented in writing
- [ ] Goal is Specific (focused on one outcome)
- [ ] Goal is Measurable (has a quantifiable target)
- [ ] Goal is Achievable (grounded in historical data and market capacity)
- [ ] Goal is Relevant (aligned with broader business strategy)
- [ ] Goal is Time-bound (has a deadline)
- [ ] Primary goal type identified: growth or efficiency
- [ ] Secondary goal type identified as guardrail
- [ ] Stakeholder has approved the business goal

### Google Ads goal translation

- [ ] Google Ads goal directly supports the business goal
- [ ] Translation accounts for multi-channel contributions (Google Ads is one piece)
- [ ] Google Ads goal is platform-specific and uses in-platform metrics
- [ ] Goal is actionable within Google Ads capabilities
- [ ] Assumptions are documented (channel contribution %, conversion rates, etc.)
- [ ] Google Ads goal is SMART (specific, measurable, achievable, relevant, time-bound)

### KPI selection

- [ ] Primary KPIs directly measure the Google Ads goal
- [ ] Secondary KPIs (guardrails) are set to prevent damage from primary goal pursuit
- [ ] Guardrails have specific thresholds (not "keep an eye on")
- [ ] Diagnostic KPIs are identified for troubleshooting (not used as targets)
- [ ] No vanity metrics are included in primary or secondary KPIs
- [ ] KPIs are measurable within the Google Ads platform or connected systems

### Growth-focused accounts (if primary goal is growth)

- [ ] Primary KPIs include conversion volume, conversion value, or revenue
- [ ] Guardrail KPIs include minimum ROAS and/or maximum CPA
- [ ] Guardrail thresholds are derived from unit economics (not arbitrary)
- [ ] Impression share metrics are tracked as diagnostic KPIs

### Efficiency-focused accounts (if primary goal is efficiency)

- [ ] Primary KPIs include CPA, ROAS, or cost per qualified lead
- [ ] Guardrail KPIs include minimum conversion volume and/or minimum conversion value
- [ ] Volume guardrails ensure campaigns don't dry out (minimum 30 conversions/month per campaign)
- [ ] Competitive metrics are tracked to detect impression share erosion

### Goal viability validation

- [ ] Search volume checked via Keyword Planner (enough demand exists)
- [ ] Seasonal patterns checked via Google Trends
- [ ] Performance Planner forecast run (if historical data available)
- [ ] Auction Insights reviewed for competitive headroom
- [ ] Budget viability confirmed: budget supports enough clicks to hit conversion targets
- [ ] Unit economics validated: targets are above break-even thresholds
- [ ] No conflicting objectives (growth and efficiency not both maximized)
- [ ] Business capacity confirmed: team can handle projected volume (sales team, stock, operations)

### Reporting and review

- [ ] Reporting dashboard is set up with primary and secondary KPIs visible
- [ ] Account-level overview tracks primary goals weekly
- [ ] Campaign-level view tracks tactical performance weekly
- [ ] Review cadence is agreed with stakeholder (weekly, bi-weekly, or monthly)
- [ ] Adjustment triggers are defined (what conditions require goal revision)
- [ ] Backend cross-check is planned (Google Ads data vs CRM/backend revenue)
- [ ] Next goal review date is scheduled

### Red flags (any of these = revisit goals)

- [ ] Confirmed: Goals do not assume linear growth with increased spend
- [ ] Confirmed: Goals do not require simultaneous growth and efficiency maximization
- [ ] Confirmed: Budget is sufficient for the stated targets
- [ ] Confirmed: Timeline is realistic given historical performance
- [ ] Confirmed: No technical limitations block measurement of success KPIs

---

## Quick reference

| Document | Relationship |
|----------|--------------|
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Strategic framework for goal-setting |
| [KPI Reference](../references/KPI Reference.md) | Metric definitions and calculations |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Formulas for viability thresholds |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Why unit economics determine campaign viability |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum conversion volumes for bid strategies |

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
