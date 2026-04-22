# SOP – Run a Campaign Experiment
Created: 2026-02-05

Agent_Executable: No
Category: Operational
Human_Approval_Required: Yes
Primary Outcome: Completed experiment with statistically valid results and documented learnings
SOP_ID: SOP_60
Secondary Outcomes: Hypothesis validated or invalidated, winner applied, knowledge base updated
Status: Done
Domain: Testing
Pillar: 0

## Purpose

This SOP guides you through designing, launching, monitoring, and concluding a Google Ads campaign experiment with statistically valid results.

> ❓ **The big question:** How do I run an experiment that produces trustworthy, actionable results?

Testing done poorly wastes time and gives false confidence. This SOP ensures your experiments are designed correctly and produce valid conclusions.

---

## What this SOP is NOT

This SOP does **not:**

- Explain when to test vs. implement directly (See: [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md))
- Detail all experiment configuration options (See: [Experiment Configuration Reference](../references/Experiment Configuration Reference.md))
- Cover ad-level testing within RSAs (that's automatic)
- Replace pre/post analysis for changes where experiments aren't possible

## When to run this SOP

Run this SOP when:

- Testing bid strategy changes
- Testing target CPA/ROAS adjustments
- Testing audience additions or changes
- Testing landing page changes at campaign level
- Any high-impact change where outcome is uncertain

---

## Before you start

### Required inputs

- Clear hypothesis (what you expect and why)
- Campaign with sufficient volume (100+ conversions/month)
- Primary metric for success
- Secondary metrics (guardrails)
- Stakeholder alignment on test duration

### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Framework |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Settings |
| [Experiment Quality Checklist](../checklists/Experiment Quality Checklist.md) | Pre-launch validation |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metric definitions |

---

## Decision gate: Is an experiment appropriate?

Before proceeding, confirm an experiment is the right approach:

| If... | Then... |
|-------|---------|
| Change is low-impact (<10% potential effect) | Implement directly, monitor |
| You're confident the change is better | Implement directly, monitor |
| Volume is too low (<100 conv/month) | Make best-judgment decision, monitor |
| High-impact AND uncertain AND sufficient volume | ✅ Run an experiment |

> ⚠️ **Don't experiment on everything:** Experiments have costs (time, complexity). Reserve them for high-impact, uncertain changes.

---

## Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Design** | Define hypothesis and success criteria | Experiment plan |
| **Phase 2️⃣: Setup** | Create draft and configure experiment | Ready-to-launch experiment |
| **Phase 3️⃣: Launch and monitor** | Run experiment and watch for issues | Running experiment |
| **Phase 4️⃣: Conclude and apply** | Analyze results and take action | Documented outcome |

---

## Phase 1️⃣: Design (Before Google Ads)

### 1.1 Write hypothesis

Document a specific, testable hypothesis:

**Hypothesis template:**
```
If we [change X], then [metric Y] will [increase/decrease] by [Z%]
because [rationale].
```

**Example:**
```
If we switch from Maximize Conversions to Target CPA at €50,
then CPA will decrease by 15% while maintaining 90%+ of current volume
because the explicit target will constrain high-cost conversions.
```

### 1.2 Define success criteria

| Element | Definition |
|---------|------------|
| Primary metric | [e.g., CPA] |
| Success threshold | [e.g., 10%+ improvement] |
| Guardrail metrics | [e.g., conversion volume, ROAS] |
| Guardrail thresholds | [e.g., volume stays above 90%] |
| Confidence level | 95% (default) |

### 1.3 Calculate required duration

**Step 1️⃣: Estimate required conversions**

| Effect size to detect | Conversions needed per arm |
|----------------------|---------------------------|
| 20%+ | 100-150 |
| 15% | 200-300 |
| 10% | 400-500 |

**Step 2️⃣: Calculate duration**

```
Duration = (Conversions needed per arm × 2) ÷ (Monthly conversions ÷ 30)
         = ___ days

Add conversion lag: + ___ days
Add learning period buffer: + 7 days (if testing Smart Bidding)

Total duration: ___ days (minimum 14 days)
```

### 1.4 Document experiment plan

```
EXPERIMENT PLAN
===============
Name: [Descriptive name]
Campaign: [Campaign name]
Hypothesis: [Full hypothesis]

Success Criteria:
- Primary: [Metric] improves by [X%]
- Guardrails: [Metric] stays above [threshold]

Configuration:
- Traffic split: 50/50
- Duration: [X] days
- Start date: [Date]
- End date: [Date]

Decision rules:
- If significant + positive: Apply treatment
- If significant + negative: Keep control
- If not significant: [Decision]
```

---

## Phase 2️⃣: Setup

### 2.1 Create draft campaign

1. Go to the campaign you're testing
2. Click **Experiments** in the left menu
3. Click **+ Custom experiment**
4. Click **Create experiment** > **Create a draft**
5. Name the draft: `[Campaign name] - [Test variable] - Draft`

### 2.2 Modify draft with test variable

In the draft campaign, make ONLY the change being tested:

| Test type | Change in draft |
|-----------|-----------------|
| Bid strategy | Change bid strategy setting |
| Target CPA/ROAS | Change target value |
| Audience | Add or remove audience |
| Landing page | Change final URLs |

> ⚠️ **Change only one thing:** If you change multiple variables, you can't isolate which caused the result.

### 2.3 Configure experiment

1. Return to **Experiments**
2. Select your draft
3. Click **Schedule**
4. Configure:

| Setting | Value |
|---------|-------|
| Experiment name | `[Campaign] - [Test] - [Start date]` |
| Traffic split | 50% (unless specific reason for different) |
| Start date | [Your start date] |
| End date | [Your calculated end date] |
| Sync | Daily |
| Goals | Select your primary conversion action |

### 2.4 Run pre-launch checklist

Execute [Experiment Quality Checklist](../checklists/Experiment Quality Checklist.md):

- [ ] Hypothesis is documented
- [ ] Only one variable differs between control and treatment
- [ ] Sample size and duration are calculated
- [ ] Success criteria are defined
- [ ] Campaign has sufficient volume
- [ ] No other experiments running on this campaign
- [ ] Team is informed (no changes during test)

---

## Phase 3️⃣: Launch and Monitor

### 3.1 Launch experiment

1. Review all settings one final time
2. Click **Launch**
3. Verify experiment shows as "Running" in Experiments section

### 3.2 Set monitoring schedule

| Timeframe | Check |
|-----------|-------|
| Day 1 | Verify both arms receiving traffic |
| Day 2-3 | Check for policy issues, delivery problems |
| Weekly | Check for catastrophic failure (>30% worse) |
| End date | Full analysis |

### 3.3 During-experiment rules

| DO | DON'T |
|----|-------|
| Monitor for delivery issues | End early because one arm "looks" better |
| Watch for catastrophic failure | Change anything in either arm |
| Check for policy violations | Run other experiments on this campaign |
| Document any external factors | Adjust budgets or bids |

### 3.4 Early termination criteria

Only end early if:

| Condition | Action |
|-----------|--------|
| One arm is >30% worse AND statistically significant | End experiment, keep control |
| Technical/policy issue preventing delivery | Pause, fix, restart |
| External factor invalidates test | End, document, restart later |

> ⚠️ **Ending early creates risk:** Random variation creates streaks. Only end early for genuine catastrophic failure, not because one arm "looks" worse.

---

## Phase 4️⃣: Conclude and Apply

### 4.1 Wait for full duration + lag

After end date:

1. Wait additional days equal to your conversion lag
2. Ensure all conversions are attributed

### 4.2 Analyze results

In the Experiments section, review:

| Metric | Control | Treatment | Difference | Significant? |
|--------|---------|-----------|------------|--------------|
| Primary: ___ | ___ | ___ | ___% | Yes/No |
| Guardrail: ___ | ___ | ___ | ___% | Yes/No |
| Guardrail: ___ | ___ | ___ | ___% | Yes/No |

### 4.3 Interpret results

| Result | Interpretation | Action |
|--------|---------------|--------|
| Significant + positive on primary | Treatment is better | Apply treatment |
| Significant + negative on primary | Control is better | Keep control |
| Significant on primary, guardrail breach | Treatment wins but at a cost | Evaluate trade-off |
| Not significant after full duration | Can't distinguish | Choose based on secondary factors |

### 4.4 Apply winner

If treatment wins:

1. In Experiments, click **Apply**
2. Select **Apply to original campaign**
3. Confirm changes

If control wins:

1. In Experiments, click **End experiment**
2. Select **Keep original campaign settings**

### 4.5 Document learnings

```
EXPERIMENT RESULTS
==================
Name: [Experiment name]
Duration: [Start] to [End]
Result: [Treatment won / Control won / Inconclusive]

Results:
| Metric | Control | Treatment | Diff | Sig? |
|--------|---------|-----------|------|------|
| [Primary] | ___ | ___ | ___% | Y/N |
| [Guard 1] | ___ | ___ | ___% | Y/N |
| [Guard 2] | ___ | ___ | ___% | Y/N |

Conclusion:
[What we learned]

Applied:
[What action was taken]

Implications:
[What this means for other campaigns/future tests]
```

---

## Validation & definition of done

This SOP is complete when:

- [ ] Experiment ran for full planned duration
- [ ] Results are statistically significant OR duration completed
- [ ] Primary and guardrail metrics are analyzed
- [ ] Winner is applied OR control is kept
- [ ] Results are documented
- [ ] Learnings are shared with team

---

## Exit → Entry bridge

After experiment concludes:

| Timeframe | Action |
|-----------|--------|
| Immediately | Apply winner or keep control |
| 7 days | Monitor applied change for stability |
| 14 days | Confirm results hold in production |
| Next planning | Consider similar tests for other campaigns |

**If results are inconclusive:**

| Factor | Consider |
|--------|----------|
| Directional trend | If one arm trended better, cautiously apply |
| Simplicity | If equal, prefer simpler option |
| Strategic alignment | Choose what fits broader strategy |
| Extend test | If close to significant, add 1-2 weeks |

---

## Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Mental Model | Phase 1 |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Reference | Phase 2 |
| [Experiment Quality Checklist](../checklists/Experiment Quality Checklist.md) | Checklist | Phase 2 |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference | Phase 4 |

---

## Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Upstream (identifies need for test) |

---

## Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Ending early | Impatience, "looks" better | Pre-commit to duration |
| Changing campaign during test | Forgot test was running | Notify team, calendar block |
| No hypothesis documented | Rushed into test | Write hypothesis first |
| Testing small effects | Expected 5% improvement | Focus on 10%+ potential |
| No learnings captured | Test finished, moved on | Document within 48 hours |
| Multiple variables changed | Trying to test everything | One variable only |

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
