# SOP – Set Campaign Goals and KPIs
Created: 2026-02-04
Updated: 2026-02-05

SOP_ID: SOP_17
Status: Done
Category: Strategic
Agent_Executable: No
Human_Approval_Required: Yes
Primary Outcome: Documented Google Ads goals with primary KPIs, guardrail KPIs, and a measurement framework ready for campaign execution
Secondary Outcomes: Stakeholder alignment, reporting dashboard configured, review cadence established
Domain: Foundations
Pillar: 4

## Purpose

This SOP walks you through translating business goals into actionable Google Ads goals, selecting the right KPIs, validating feasibility, and establishing a reporting framework.

> ❓ **The big question:** What are we optimizing for, how do we measure success, and is the goal actually achievable?

---

## What this SOP is NOT

This SOP does **not:**

- Explain goal-setting strategy (See: [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md))
- Define KPI calculations (See: [KPI Reference](../references/KPI Reference.md))
- Calculate unit economics (See: [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md))

## When to run this SOP

Run this SOP when:

- Onboarding a new client (after unit economics are validated)
- Starting a new quarter with revised business objectives
- Stakeholder changes business goals mid-cycle
- Expanding into new campaign types or markets

---

## Before you start

### Required inputs

- Validated unit economics (from [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md))
- Business goals from stakeholder (or co-created during this SOP)
- Historical Google Ads performance data (if available)
- Multi-channel performance data (if available)

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Goal-setting pyramid and KPI tiers |
| [KPI Reference](../references/KPI Reference.md) | Metric definitions and benchmark ranges |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Threshold calculations for targets |

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Define business goals** | Understand what the stakeholder wants to achieve | Documented SMART business goal |
| **Phase 2️⃣: Translate to Google Ads goals** | Create platform-specific, actionable targets | Documented Google Ads goal with assumptions |
| **Phase 3️⃣: Select campaign types** | Choose the vehicles to hit the goals | Campaign type selection with rationale |
| **Phase 4️⃣: Choose KPIs** | Define what to measure and what guardrails to set | Three-tier KPI framework |
| **Phase 5️⃣: Validate and set up reporting** | Reality-check the goal and establish tracking | Validated goal, configured dashboard |

---

## Phase 1️⃣: Define business goals

### 1.1 Ask the right questions

Conduct a structured conversation with the stakeholder. Questions vary by vertical.

**Growth questions (all verticals):**
- What is your revenue or volume growth target?
- What timeframe are you targeting?
- What marketing budget is available?
- Are there capacity constraints (stock, sales team, infrastructure)?

**Efficiency questions (all verticals):**
- What is your target acquisition cost or ROAS?
- What margins need to be maintained?
- How far can we push efficiency vs growth?

For the full question list by vertical, see the source transcript detailed examples in [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md).

### 1.2 Classify the goal

| If the primary emphasis is... | Then the goal type is... | Secondary type is... |
|------------------------------|--------------------------|---------------------|
| More revenue, more customers, new markets | **Growth** | Efficiency (as guardrails) |
| Lower CPA, higher ROAS, better margins | **Efficiency** | Growth (as guardrails) |

> ⚠️ **You cannot maximize growth and efficiency simultaneously:** Pick one as primary. Use the other as guardrails.

### 1.3 Make the goal SMART

Validate that the business goal passes all five SMART criteria:

| Criterion | Test question | Pass/fail |
|-----------|--------------|-----------|
| Specific | Is it focused on one outcome? | |
| Measurable | Does it have a quantifiable target? | |
| Achievable | Is it grounded in historical data and market capacity? | |
| Relevant | Does it align with broader business strategy? | |
| Time-bound | Does it have a deadline? | |

**Example:** "Increase online purchases by 25% in Q4 with a minimum ROAS of 400%"

---

## Phase 2️⃣: Translate to Google Ads goals

### 2.1 Determine Google Ads contribution

Google Ads is one channel. Calculate its expected share of the overall goal.

1. Document current channel contributions (Google Ads, organic, social, email, etc.)
2. Assess growth potential per channel
3. Allocate the business goal across channels based on realistic potential

| Channel | Current contribution | Growth potential | Target contribution |
|---------|---------------------|-----------------|-------------------|
| Google Ads | | | |
| Organic | | | |
| Social | | | |
| Email | | | |
| Other | | | |
| **Total** | | | **= Business goal** |

### 2.2 Translate to in-platform metrics

| Business goal metric | Google Ads metric |
|---------------------|------------------|
| Revenue | Conversion value |
| Customers | Conversions |
| Deals closed | Conversions (with OCT import) |
| CAC | CPA |
| Blended ROAS / MER | In-platform ROAS (adjusted for channel mix) |

### 2.3 Document the Google Ads goal

Write the translated goal in this format:

```
[Increase/Decrease] [Google Ads metric] [by X%/to X value]
[by/in timeframe]
[while maintaining/not exceeding guardrail metric of X]
```

**Example:** "Increase monthly conversion value from €200K to €280K by June 2026, while maintaining a minimum 300% non-branded ROAS".

### 2.4 Document assumptions

Record every assumption behind the translation:

| Assumption | Value | Source |
|-----------|-------|--------|
| Google Ads channel contribution | 40% of total growth | Channel analysis |
| Average conversion rate | 3.2% | Historical data |
| Expected CPC range | €2.50-€3.50 | Auction data |
| Conversion lag | 7 days | Days-to-conversion report |

---

## Phase 3️⃣: Select campaign types

### 3.1 Evaluate campaign type fit

For each candidate campaign type, assess three factors:

| Factor | Question |
|--------|----------|
| **Goal alignment** | Does this campaign type directly support the Google Ads goal? |
| **Audience reach** | Can you find the target audience in this network? |
| **Volume potential** | Are there enough searches or targetable users? |

### 3.2 Map campaign types to goals

| Primary goal | Start with | Add if growth headroom needed |
|-------------|-----------|------------------------------|
| Growth + Efficiency | Search, Shopping, PMax | Display, Video, Demand Gen |
| Growth (primary) | Search, Shopping, PMax | + Display, Video, Demand Gen for reach |
| Efficiency (primary) | Search, Shopping, PMax | + Remarketing only (no prospecting) |

### 3.3 Record campaign type selection

| Campaign type | Role | Expected contribution |
|--------------|------|---------------------|
| | | |
| | | |
| | | |

---

## Phase 4️⃣: Choose KPIs

### 4.1 Select primary KPIs

Based on the primary goal type, select from:

| Growth primary | Efficiency primary |
|---------------|-------------------|
| Conversions | CPA |
| Conversion value | ROAS |
| Revenue | Cost per qualified lead |
| | POAS (if profit tracking enabled) |

### 4.2 Set guardrail KPIs with thresholds

Based on the secondary goal type, set hard boundaries:

| Growth primary → Efficiency guardrails | Efficiency primary → Volume guardrails |
|---------------------------------------|---------------------------------------|
| Minimum ROAS: ___ (from unit economics) | Minimum conversions/month: ___ |
| Maximum CPA: ___ (from unit economics) | Minimum conversion value/month: ___ |
| Minimum profit margin: ___ | Minimum impression share: ___ |

### 4.3 Identify diagnostic KPIs

Standard diagnostic KPIs for all accounts: Impressions, CTR, CPC, Conversion rate, AOV, Impression share (total, lost to budget, lost to rank), Quality Score.

### 4.4 Record KPI framework

| Tier | KPI | Target/Threshold | Cadence |
|------|-----|-----------------|---------|
| Primary | | | Weekly |
| Primary | | | Weekly |
| Secondary (guardrail) | | | Weekly |
| Secondary (guardrail) | | | Weekly |
| Diagnostic | | | Bi-weekly |

---

## Phase 5️⃣: Validate and set up reporting

### 5.1 Goal reality check

Use available tools to validate feasibility. Check each:

| Tool | What to check | Result |
|------|--------------|--------|
| **Keyword Planner** | Enough search volume for growth targets? | |
| **Google Trends** | Seasonal patterns that affect targets? | |
| **Performance Planner** | Forecast matches goal at current targets? | |
| **Bid Simulator** | Volume changes at different bid levels? | |
| **Auction Insights** | Room to grow impression share? | |

### 5.2 Red flag check

Confirm none of these red flags exist:

- [ ] Goal does not assume linear growth with increased budgets
- [ ] Goal does not require simultaneous growth and efficiency maximization
- [ ] Budget is sufficient for stated targets
- [ ] Timeline is realistic
- [ ] No technical limitations block KPI measurement

### 5.3 Set up reporting dashboard

Configure a dashboard (Looker Studio or equivalent) showing:

1. **Account overview:** Primary KPIs vs targets, guardrail status
2. **Campaign view:** Per-campaign performance against contribution targets
3. **Trend view:** Week-over-week and month-over-month progression

### 5.4 Establish review cadence

| Review type | Frequency | Focus |
|-------------|-----------|-------|
| Performance check | Weekly | Primary and guardrail KPIs |
| Campaign optimization | Bi-weekly | Diagnostic KPIs, tactical changes |
| Stakeholder review | Monthly | Goal progress, adjustments needed |
| Goal revision | Quarterly | Revisit business goals, recalibrate |

---

## Validation and definition of done

This SOP is complete when:

- [ ] Business goal is documented and SMART
- [ ] Google Ads goal is translated with documented assumptions
- [ ] Campaign types are selected with rationale
- [ ] Three-tier KPI framework is documented with thresholds
- [ ] Goal is validated using available tools
- [ ] Reporting dashboard is configured
- [ ] Review cadence is agreed with stakeholder
- [ ] Run the [Goal Quality Checklist](../checklists/Goal Quality Checklist.md) and pass all items

---

## Exit → Entry bridge

Once goals and KPIs are set:

| Next step | When |
|-----------|------|
| Campaign setup and launch | Goals validated, KPIs defined, dashboard ready |
| Revisit unit economics | If goal reality check reveals viability concerns |
| Stakeholder re-alignment | If translated goals require business-level changes |

**If goals need revision during the quarter:**

| Trigger | Action |
|---------|--------|
| Business goal changed by stakeholder | Re-run Phase 2-5 |
| Google Ads consistently missing targets | Re-run Phase 5 reality check, adjust or escalate |
| Channel mix shifts significantly | Re-run Phase 2 channel allocation |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Setting Google Ads goals without business context | Specialist sets platform targets in isolation | Always start with Phase 1 business goals |
| No guardrails | Growth destroys profitability or efficiency kills volume | Always set secondary KPIs with hard thresholds |
| Goals set at break-even | Zero margin for error or optimization | Set operational targets below break-even ceiling |
| Never revisiting goals | Business evolves, goals become stale | Quarterly review is mandatory |
| Over-reliance on one validation tool | Performance Planner alone doesn't capture competition | Combine multiple tools for validation |

---

## Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Mental Model | Phases 1-4 |
| [KPI Reference](../references/KPI Reference.md) | Reference | Phase 4 |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Reference | Phase 4 (guardrail thresholds) |
| [Goal Quality Checklist](../checklists/Goal Quality Checklist.md) | Checklist | Validation |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md) | Upstream: must complete before this SOP |
| [SOP – Build a High-Converting Landing Page](../sops/SOP – Build a High-Converting Landing Page.md) | Parallel: LP strategy aligns with goals |
| *Campaign-specific launch SOPs* [TBD, Phases 3-4] | Downstream: use goals to configure campaigns |

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
