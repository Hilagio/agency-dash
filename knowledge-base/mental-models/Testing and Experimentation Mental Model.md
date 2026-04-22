# Testing and Experimentation Mental Model
Created: 2026-02-05
Updated: 2026-04-02

Support_ID: MENTALMODEL_26
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Testing
Pillar: 0

## Purpose

This mental model helps you decide when to test, what to test, and how to run experiments that produce valid, actionable results.

> ❓ **The core question:** Is this change worth testing, and how do I know if the test result is real?

Testing without rigor produces false confidence in bad decisions. Testing done well accelerates learning and protects against costly mistakes. This framework ensures your experiments produce trustworthy results.

---

## What this is NOT

This mental model does **not:**

- Provide step-by-step experiment setup (See: [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md))
- Detail experiment configuration options (See: [Experiment Configuration Reference](../references/Experiment Configuration Reference.md))
- Explain bid strategy mechanics (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Cover creative testing at the ad level (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))

---

## The Testing Decision Framework

Not everything should be tested. Testing has costs: time, complexity, and delayed decisions.

| **Test** | **Don't test** |
|----------|----------------|
| High-impact changes (bid strategy, structure, targeting) | Low-impact changes (minor copy tweaks) |
| Reversible changes where being wrong is costly | Changes you're confident about from prior data |
| Changes where the outcome is genuinely uncertain | Changes mandated by policy or business requirements |
| Decisions that affect significant spend | Micro-optimizations on low-volume campaigns |

**The testing decision tree:**

```
Is the change high-impact (>10% potential effect on primary KPI)?
│
├─ NO → Implement directly, monitor results
│
└─ YES → Is the outcome genuinely uncertain?
          │
          ├─ NO (confident it's better) → Implement directly, monitor
          │
          └─ YES → Do you have enough volume for a valid test?
                    │
                    ├─ NO → Make best-judgment decision, monitor
                    │
                    └─ YES → Run an experiment
```

> ⚠️ **Testing small changes wastes time:** A 2% headline improvement won't reach statistical significance at most budgets. Focus experiments on changes that could move the needle 10%+.

---

## The Three Testing Approaches

### 1️⃣ Ad-level testing (RSA optimization)

*"Which ad variations perform best?"*

| **Element** | **Description** |
|-------------|-----------------|
| **What** | Headlines, descriptions, asset combinations within RSAs |
| **How** | Google's machine learning optimizes automatically |
| **When to use** | Always: this is built into RSA mechanics |
| **Statistical rigor** | Low: Google's "Best" label doesn't mean statistical significance |
| **Your role** | Provide diverse assets, remove poor performers, iterate |

> ↪️ **For ad-level testing:** See [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) for the iteration loop approach.

### 2️⃣ Campaign experiments

*"Which campaign setting or strategy performs better?"*

| **Element** | **Description** |
|-------------|-----------------|
| **What** | Bid strategies, targets, audiences, landing pages at campaign level |
| **How** | Google Ads Experiments (traffic split, control vs. treatment) |
| **When to use** | Testing campaign-level changes that affect all ads/ad groups |
| **Statistical rigor** | High: controlled traffic split with statistical significance calculation |
| **Your role** | Design experiment, set duration, interpret results, apply winner |

**Best candidates for campaign experiments:**

| Change type | Example | Impact potential |
|-------------|---------|------------------|
| Bid strategy | Manual CPC → Target CPA | High |
| Bid target | Target CPA €50 → €40 | Medium-High |
| Audience targeting | Add audience segment | Medium |
| Landing page | Homepage → dedicated LP | High |
| Ad scheduling | All day → business hours only | Medium |

### 3️⃣ Pre/post analysis

*"Did this change work?"*

| **Element** | **Description** |
|-------------|-----------------|
| **What** | Any change where controlled experiment isn't possible |
| **How** | Compare performance before vs. after the change |
| **When to use** | When experiments aren't feasible (account-level changes, low volume) |
| **Statistical rigor** | Low: confounding factors (seasonality, competition) cloud results |
| **Your role** | Control for known factors, document assumptions, be skeptical |

**Pre/post analysis limitations:**

| Factor | Risk | Mitigation |
|--------|------|------------|
| Seasonality | Week 1 vs. Week 2 may differ due to natural cycles | Compare same period last year |
| Competition | Competitor changes affect your data | Check auction insights |
| External factors | News, weather, economy | Document known events |
| Multiple changes | Can't isolate which change caused the effect | Change one thing at a time |

> ⚠️ **Pre/post is evidence, not proof:** Use it when experiments aren't possible, but weight the conclusions accordingly.

---

## Statistical Significance: The Foundation

Statistical significance answers: "Is this result real, or just random noise?"

### The core concepts

| **Concept** | **Definition** | **Google Ads default** |
|-------------|---------------|----------------------|
| **Confidence level** | Probability the result isn't due to chance | 95% (1 in 20 chance of false positive) |
| **Statistical significance** | The result exceeds your confidence threshold | Shown in Experiments |
| **Sample size** | Number of observations (clicks, conversions) | Depends on effect size |
| **Effect size** | Magnitude of difference between control and treatment | What you're trying to detect |

### Why sample size matters

Smaller effects require larger samples to detect reliably.

| **Effect you want to detect** | **Approximate conversions needed per arm** |
|-------------------------------|-------------------------------------------|
| 20%+ difference | 100-200 |
| 10-20% difference | 300-500 |
| 5-10% difference | 1,000+ |
| <5% difference | 3,000+ (often not worth testing) |

> 💡 **The practical implication:** If your campaign gets 50 conversions/month, you can't reliably detect a 10% improvement. Either accept larger effect thresholds or don't run the experiment.

### When to call a test

| **Scenario** | **Action** |
|--------------|-----------|
| Statistically significant + directionally correct | Apply winner |
| Statistically significant + unexpected direction | Investigate before applying |
| Not significant after full duration | No clear winner: choose based on secondary factors |
| One arm is clearly harming performance | End early if egregiously bad (>30% worse) |

> ⚠️ **Don't end tests early because one arm "looks" better:** Random variation creates streaks. Wait for statistical significance or your pre-set duration, whichever comes first.

---

## Experiment Design Principles

### The scientific method for PPC

1. **Hypothesis:** State what you expect to happen and why
2. **Control:** Keep everything constant except the variable being tested
3. **Measurement:** Define success criteria before the test starts
4. **Duration:** Set the test length before starting (don't end early)
5. **Interpretation:** Analyze results against your pre-defined criteria

### Good vs. bad hypotheses

| **Bad hypothesis** | **Good hypothesis** |
|--------------------|---------------------|
| "Target CPA might be better" | "Switching from Maximize Conversions to Target CPA at €50 will reduce CPA by 15% while maintaining 90%+ of current volume" |
| "New landing page could help" | "The new product-focused landing page will increase CVR by 20% compared to the homepage" |
| "Lower bids might work" | "Reducing target CPA from €60 to €50 will decrease CPA by 15% but may reduce conversions by 10%" |

**Why specificity matters:** A vague hypothesis leads to ambiguous interpretation. "It kind of worked" isn't actionable.

### Control variable discipline

During an experiment, change **only** the variable being tested.

| **During the test, DON'T** | **Why** |
|---------------------------|---------|
| Pause/add keywords | Changes traffic composition |
| Update ad copy | Changes CTR and CVR |
| Adjust bids in control | Invalidates comparison |
| Change budget | Affects delivery and competition |
| Run other experiments | Interaction effects |

> ⚠️ **Contamination kills experiments:** If you change something else during the test, you can't isolate the effect of your test variable.

---

## Test Duration Guidelines

### Minimum test duration

| **Factor** | **Minimum** | **Rationale** |
|------------|-------------|---------------|
| Learning period | 1-2 weeks | Smart Bidding needs time to calibrate |
| Day-of-week variation | 1 full week | Covers all 7 days at least once |
| Conversion volume | 100+ conversions per arm | Statistical validity |
| Conversion lag | + your average lag | Wait for attributed conversions |

**Practical duration formula:**

```
Test duration = MAX(
    2 weeks minimum,
    Time to reach 100+ conversions per arm,
    Full business cycle if seasonal
) + Conversion lag time
```

### When to extend vs. end

| **Situation** | **Action** |
|---------------|-----------|
| Not significant, but trending toward one arm | Extend 1-2 weeks |
| Not significant, no clear trend | End at planned duration, pick based on secondary factors |
| Significant result reached | Can end early (but waiting confirms stability) |
| One arm is catastrophically bad | End early to limit damage |

---

## What To Test (Priority Framework)

### High-impact tests (test these first)

| **Test** | **Typical impact** | **Risk** |
|----------|-------------------|----------|
| Bid strategy change | 10-30% CPA/ROAS change | Medium: requires volume |
| Landing page | 10-50% CVR change | Low: easy to revert |
| Campaign structure (consolidation) | 10-25% efficiency gain | Medium: disrupts historical data |

### Medium-impact tests

| **Test** | **Typical impact** | **Risk** |
|----------|-------------------|----------|
| Target CPA/ROAS adjustment | 5-15% efficiency change | Low: incremental |
| Audience addition/exclusion | 5-20% efficiency change | Low: easily adjusted |
| Ad scheduling | 5-10% efficiency change | Low: easily adjusted |

### Low-impact tests (often not worth formal experiments)

| **Test** | **Typical impact** | **Better approach** |
|----------|-------------------|---------------------|
| Individual headline variations | 1-5% | RSA optimization handles this |
| Minor bid adjustments | 1-5% | Use bid simulators |
| Individual negative keywords | <1% | Just add them |

---

## Interpreting Results

### Result scenarios

| **Result** | **Action** | **Caution** |
|-----------|-----------|-------------|
| **Clear winner (sig + large effect)** | Apply winner to full campaign | Document learnings |
| **Marginal winner (sig + small effect)** | Apply if no downside, but don't over-interpret | Small effects may not replicate |
| **No winner (not significant)** | Pick based on secondary factors or simplicity | Don't claim "no difference" without sufficient power |
| **Surprising loser** | Investigate before dismissing | Execution error? Wrong hypothesis? |

### Secondary factors when tests are inconclusive

If your test doesn't reach significance, choose based on:

| **Factor** | **Favor the option that...** |
|------------|------------------------------|
| Simplicity | Requires less ongoing management |
| Scalability | Supports future growth better |
| Alignment | Fits your broader strategy |
| Directional trend | Trended positively (even if not significant) |

---

## Common Testing Mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| **Ending early** | Random variation creates false winners | Pre-commit to duration |
| **Too many variables** | Can't isolate cause | Test one thing at a time |
| **Insufficient volume** | Can't reach significance | Consolidate or accept larger effect thresholds |
| **No hypothesis** | Can't interpret results meaningfully | Write hypothesis before starting |
| **Changing things during test** | Invalidates results | Freeze all other variables |
| **Testing small effects** | Will never reach significance | Focus on 10%+ potential impact |
| **Ignoring secondary metrics** | Winner on primary metric may lose on secondary | Define guardrail metrics upfront |
| **Not documenting** | Lose learnings over time | Record hypothesis, results, decisions |

---

## Key Principles

1. **Not everything needs testing:** Reserve experiments for high-impact, uncertain decisions with sufficient volume.
2. **Hypothesis first:** Define what you expect and why before starting. Vague experiments produce vague conclusions.
3. **Statistical significance is the bar:** "Looks better" isn't enough. Wait for the math to confirm.
4. **Control everything else:** One variable at a time. Contamination kills experiments.
5. **Pre-commit to duration:** Set the test length before starting and stick to it. Don't peek and stop early.
6. **Document everything:** Your test this month is institutional knowledge next year.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Reporting Mental Model](../mental-models/Reporting Mental Model.md) | Foundation: how to measure and interpret results |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | Reference: experiment types and settings |
| [Experiment Quality Checklist](../checklists/Experiment Quality Checklist.md) | Validation: pre-launch experiment checklist |
| [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) | Execution: step-by-step experiment process |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Related: bid strategy experiments |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Foundation: defines success metrics |

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
