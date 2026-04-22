# Experiment Quality Checklist
Created: 2026-02-05

Support_ID: CHECKLIST_24
Status: Done
Category: Operational
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Testing
Pillar: 0

## Purpose

Validates that campaign experiments are properly designed, configured, and documented before launch to ensure valid, actionable results.

---

## What this checklist validates

This checklist confirms:

- Hypothesis is clear and testable
- Sample size and duration are sufficient
- Control and treatment are properly configured
- Success criteria are defined before launch
- No confounding factors will invalidate results

This checklist does **NOT**:

- Explain when to test vs. implement directly (See: [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md))
- Detail experiment configuration options (See: [Experiment Configuration Reference](../references/Experiment Configuration Reference.md))
- Provide step-by-step setup (See: [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md))

---

## When to use

Run this checklist:

- Before launching any Google Ads experiment
- Before starting a formal pre/post analysis
- When reviewing experiment proposals from team members

---

## Checklist

### Hypothesis

- [ ] Hypothesis is written and documented
- [ ] Hypothesis is specific (what change, expected outcome, expected magnitude)
- [ ] Hypothesis includes "why" (rationale for expected outcome)
- [ ] Hypothesis is falsifiable (possible to prove wrong)

### Experiment Design

- [ ] Only one variable is being tested (control everything else)
- [ ] Test is high-impact (10%+ potential effect on primary KPI)
- [ ] Effect size you want to detect is realistic for your volume
- [ ] Alternative approaches were considered (is experiment the right method?)

### Sample Size and Duration

- [ ] Required sample size is calculated based on effect size
- [ ] Campaign has enough volume to reach sample size in reasonable time
- [ ] Duration accounts for learning period (minimum 2 weeks)
- [ ] Duration covers full day-of-week cycle (minimum 1 week)
- [ ] Duration accounts for conversion lag (add your average lag)
- [ ] Duration accounts for business cycles (if applicable)

### Success Criteria

- [ ] Primary metric is defined before launch
- [ ] Secondary metrics (guardrails) are defined before launch
- [ ] Success threshold is defined (what magnitude = "winner"?)
- [ ] Confidence level is defined (95% recommended)
- [ ] Decision rules are documented (what happens if inconclusive?)

### Configuration

- [ ] Traffic split is set appropriately (50/50 recommended unless specific reason)
- [ ] Sync schedule is set (Daily recommended)
- [ ] End date is set based on calculated duration
- [ ] Goal metric in Google Ads matches your primary metric
- [ ] Both arms are verified identical except for test variable

### Exclusion of Confounding Factors

- [ ] No other experiments running on same campaign
- [ ] No planned campaign changes during test period
- [ ] No known external factors that will affect results (seasonality, promotions)
- [ ] Conversion tracking is verified stable
- [ ] Budget is stable for test duration

### Documentation

- [ ] Hypothesis documented in shared location
- [ ] Start date and planned end date documented
- [ ] Traffic split and settings documented
- [ ] Success criteria documented
- [ ] Team is informed (no one will make changes during test)

### Pre-Launch Verification

- [ ] Draft campaign settings are verified correct
- [ ] Test variable is implemented correctly in treatment
- [ ] Control matches current live campaign exactly
- [ ] No policy violations on either arm
- [ ] Baseline performance is documented for comparison

---

## Experiment Validity Checks

### Statistical Validity

- [ ] Expected effect size is detectable with your volume
- [ ] Duration is long enough for statistical significance
- [ ] Sample size is sufficient per arm (not just total)

### Internal Validity

- [ ] Only one variable differs between arms
- [ ] Assignment is random (cookie-based split)
- [ ] No selection bias in traffic split
- [ ] Measurement is identical for both arms

### External Validity

- [ ] Test period is representative (not during unusual events)
- [ ] Results will be applicable to future periods
- [ ] Learnings can be applied to similar campaigns

---

## Post-Launch Monitoring

- [ ] Dashboard set up to monitor both arms
- [ ] Alert set if either arm drops catastrophically (>30% worse)
- [ ] Team reminded not to make changes
- [ ] Calendar reminder set for end date
- [ ] Calendar reminder set for results review (end date + conversion lag)

---

## Quick Reference

| Document | Relationship |
|----------|--------------|
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Framework for testing decisions |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Configuration options and settings |
| [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) | Uses this checklist before launch |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metric definitions for success criteria |

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
