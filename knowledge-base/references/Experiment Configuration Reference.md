# Experiment Configuration Reference
Created: 2026-02-05

Support_ID: CHEATSHEET_44
Status: Done
Category: Operational
Reference Type: Cheat Sheet
Agent_Readable: Yes
Human_Facing: Yes
Domain: Testing
Pillar: 0

## Purpose

Documents Google Ads experiment types, configuration options, traffic split settings, and statistical requirements for running valid campaign experiments.

---

## What this is / What this is NOT

**This reference:**

- Documents experiment types available in Google Ads
- Explains traffic split options and their implications
- Details statistical significance requirements
- Provides configuration settings and limits

**This reference does NOT:**

- Explain when to test vs. implement directly (See: [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md))
- Provide step-by-step experiment setup (See: [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md))
- Cover ad-level testing within RSAs (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))

---

## Quick reference: experiment types

| **Type** | **What it tests** | **Traffic split** | **Best for** |
|----------|-------------------|-------------------|--------------|
| **Custom experiment** | Any campaign setting | Configurable | Bid strategies, targets, audiences |
| **Video experiment** | Video creative or targeting | Configurable | Video ad variations |
| **Performance Max experiment** | PMax final URL expansion, text | Configurable | PMax optimization settings |
| **Optimize text ads** | RSA headlines/descriptions | Automatic | Ad copy optimization |

---

## 1️⃣ Custom Experiments

### What they test

Custom experiments allow A/B testing of campaign-level settings by splitting traffic between control (original) and treatment (variation).

| **Testable** | **Examples** |
|--------------|--------------|
| Bid strategy | Manual CPC vs. Target CPA |
| Bid targets | Target CPA €50 vs. €40 |
| Audiences | Add/remove audience segments |
| Ad scheduling | All day vs. business hours |
| Device bid adjustments | Standard vs. modified bids |
| Network settings | Search only vs. Search + Partners |
| Location targeting | Broad vs. narrow geography |

### Configuration options

| **Setting** | **Options** | **Recommendation** |
|-------------|-------------|-------------------|
| Traffic split | 10-90% (default 50%) | 50/50 for fastest results |
| Sync schedule | Daily, Every 12h, Every 6h, Continuous | Daily for most tests |
| End date | Custom date or ongoing | Set end date based on volume |
| Goal metric | Primary conversion action | Match your campaign goal |

### Traffic split considerations

| **Split** | **Use case** | **Trade-off** |
|-----------|--------------|---------------|
| 50/50 | Fastest statistical significance | Equal risk to both arms |
| 70/30 | Protect control while testing | Slower to reach significance |
| 90/10 | Minimal risk testing | Very slow to reach significance |

> 💡 **50/50 is almost always best:** Unless you have a strong reason to protect the control, equal splits reach significance fastest.

### Sync settings explained

| **Setting** | **Behavior** | **When to use** |
|-------------|--------------|-----------------|
| **Continuous** | Changes sync immediately | Real-time updates needed |
| **Every 6 hours** | Syncs 4x daily | Fast iteration |
| **Every 12 hours** | Syncs 2x daily | Standard testing |
| **Daily** | Syncs once daily | Most experiments |

> ⚠️ **Don't sync during the test unless necessary:** Every sync resets learning. Make your experiment setup complete before launching.

---

## 2️⃣ Traffic Split Mechanics

### How traffic splitting works

| **Aspect** | **Behavior** |
|------------|--------------|
| Split method | Cookie-based user assignment |
| Consistency | Same user sees same arm throughout test |
| Geographic | Split applies across all locations |
| Device | Split applies across all devices |
| Time | Split applies 24/7 |

### Split-related settings

| **Setting** | **Options** | **Effect** |
|-------------|-------------|-----------|
| **Search traffic split** | Cookie-based or Search-based | Cookie = user-level, Search = query-level |
| **Enable experiment** | On/Off | Starts/stops traffic split |

**Cookie-based vs. Search-based split:**

| **Type** | **Behavior** | **Best for** |
|----------|--------------|--------------|
| Cookie-based | Same user always sees same arm | Most experiments (cleaner data) |
| Search-based | Each search randomly assigned | High-volume brand campaigns |

---

## 3️⃣ Statistical Requirements

### Minimum sample sizes

| **Effect size you want to detect** | **Conversions needed per arm** | **Total conversions** |
|-----------------------------------|-------------------------------|----------------------|
| 20%+ improvement | 100-150 | 200-300 |
| 15% improvement | 200-300 | 400-600 |
| 10% improvement | 400-500 | 800-1,000 |
| 5% improvement | 1,500+ | 3,000+ |

> ⚠️ **Detecting small effects requires massive volume:** If your campaign gets 100 conversions/month, you cannot reliably detect a 5% improvement. Adjust expectations accordingly.

### Confidence levels

| **Confidence** | **Meaning** | **Google Ads default** |
|----------------|-------------|------------------------|
| 95% | 5% chance result is random | ✅ Standard |
| 90% | 10% chance result is random | Acceptable for directional |
| 99% | 1% chance result is random | Very conservative |

### Duration requirements

| **Factor** | **Minimum** | **Rationale** |
|------------|-------------|---------------|
| Learning period | 2 weeks | Smart Bidding calibration |
| Day-of-week cycle | 1 full week | Covers all 7 days |
| Business cycle | 1 full cycle | B2B may need 4+ weeks |
| Conversion lag | + your lag period | Wait for attributed conversions |

**Duration formula:**
```
Test duration = MAX(
    2 weeks,
    Time to reach sample size,
    Full business cycle
) + Conversion lag
```

### Statistical significance in Google Ads

Google Ads shows:

| **Metric** | **What it shows** |
|------------|-------------------|
| Performance difference | % change between arms |
| Confidence interval | Range of likely true difference |
| Statistical significance | Whether difference is reliable |
| Probability to beat baseline | Likelihood treatment > control |

**Interpreting results:**

| **Result** | **Interpretation** | **Action** |
|------------|-------------------|-----------|
| "Statistically significant" + positive | Treatment is reliably better | Apply treatment |
| "Statistically significant" + negative | Treatment is reliably worse | Keep control |
| "Not significant" | Can't distinguish from noise | Extend or end without winner |

---

## 4️⃣ Experiment Types Deep Dive

### Performance Max experiments

| **Testable** | **Options** |
|--------------|-------------|
| Final URL expansion | On vs. Off |
| Text asset automation | On vs. Off |
| Automatically created assets | On vs. Off |

**PMax experiment limits:**

| **Limit** | **Value** |
|-----------|-----------|
| Max experiments per campaign | 1 active |
| Max campaigns in experiment | 1 |

### Video experiments

| **Testable** | **What you compare** |
|--------------|---------------------|
| Creative | Different video ads |
| Targeting | Different audience combinations |
| Bidding | Different bid strategies |

**Video experiment metrics:**

| **Metric** | **What it measures** |
|------------|---------------------|
| Brand lift | Survey-based brand awareness change |
| Conversion lift | Incremental conversions |
| Cost efficiency | CPV, CPA comparison |

### Ad variations (Search)

| **Testable** | **What you modify** |
|--------------|---------------------|
| Find and replace | Text substitutions in ads |
| Update text | Specific headline/description changes |
| Update URLs | Final URL or display path changes |

**Ad variation limits:**

| **Limit** | **Value** |
|-----------|-----------|
| Variations per experiment | 1 |
| Campaigns included | Multiple (selectable) |
| Ad groups affected | All in selected campaigns |

---

## 5️⃣ Experiment Limits and Constraints

### Account-level limits

| **Limit** | **Value** |
|-----------|-----------|
| Active experiments per account | 5 |
| Experiments per campaign | 5 lifetime (including ended) |
| Draft campaigns | Unlimited |

### Campaign type support

| **Campaign type** | **Custom experiments** | **Video experiments** | **Ad variations** |
|-------------------|----------------------|----------------------|-------------------|
| Search | ✅ | ❌ | ✅ |
| Shopping | ✅ | ❌ | ❌ |
| Display | ✅ | ❌ | ❌ |
| Video | ✅ | ✅ | ❌ |
| Demand Gen | ✅ | ❌ | ❌ |
| Performance Max | ✅ (limited) | ❌ | ❌ |
| App | ❌ | ❌ | ❌ |

### What you cannot test

| **Cannot test** | **Workaround** |
|-----------------|----------------|
| Account-level settings | Create separate test account |
| Conversion tracking setup | Pre/post analysis |
| Multiple variables at once | Sequential testing |
| Cross-campaign comparisons | Run separate experiments |

---

## 6️⃣ Experiment Workflow

### Before launching

| **Step** | **Action** |
|----------|-----------|
| 1 | Define hypothesis (what you expect and why) |
| 2 | Choose primary metric for success |
| 3 | Calculate required sample size |
| 4 | Determine test duration |
| 5 | Set up draft campaign with changes |
| 6 | Review and verify settings |

### During experiment

| **Rule** | **Rationale** |
|----------|---------------|
| Don't change either arm | Maintains valid comparison |
| Don't end early (usually) | Random variation creates false signals |
| Monitor for catastrophic failure | >30% worse may warrant early end |
| Don't run other experiments on same campaign | Interaction effects |

### After experiment

| **Step** | **Action** |
|----------|-----------|
| 1 | Wait for full duration + conversion lag |
| 2 | Check statistical significance |
| 3 | Review primary AND secondary metrics |
| 4 | Apply winner OR end without change |
| 5 | Document results and learnings |

---

## 7️⃣ Common Configurations

### Bid strategy test

| **Setting** | **Value** |
|-------------|-----------|
| Control | Current bid strategy |
| Treatment | New bid strategy |
| Traffic split | 50/50 |
| Duration | 4 weeks minimum |
| Primary metric | CPA or ROAS |
| Secondary metrics | Conversion volume, spend |

### Target CPA test

| **Setting** | **Value** |
|-------------|-----------|
| Control | Current target CPA |
| Treatment | Lower/higher target CPA |
| Traffic split | 50/50 |
| Duration | 2-4 weeks |
| Primary metric | CPA |
| Secondary metrics | Conversion volume, impression share |

### Landing page test

| **Setting** | **Value** |
|-------------|-----------|
| Control | Current landing page |
| Treatment | New landing page URL |
| Traffic split | 50/50 |
| Duration | 2-4 weeks |
| Primary metric | Conversion rate |
| Secondary metrics | Bounce rate (if available), CPA |

---

## Decision Guide: Which Experiment Type?

```
What are you testing?
│
├─ Campaign settings (bid strategy, targets, audiences)?
│   └─ Use CUSTOM EXPERIMENT
│
├─ Video creative or video targeting?
│   └─ Use VIDEO EXPERIMENT
│
├─ PMax automation settings?
│   └─ Use PMAX EXPERIMENT
│
├─ Ad copy across multiple campaigns?
│   └─ Use AD VARIATIONS
│
└─ Something not supported?
    └─ Use PRE/POST ANALYSIS (document carefully)
```

---

## Common Mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Ending test early | Random variation creates false winners | Pre-commit to duration |
| Unequal splits without reason | Slows significance | Use 50/50 unless specific need |
| Testing small effects | Never reaches significance | Focus on 10%+ potential impact |
| Changing campaign during test | Invalidates results | Freeze all other settings |
| Ignoring conversion lag | Judging incomplete data | Add lag time to duration |
| Multiple simultaneous experiments | Interaction effects | One experiment per campaign |
| No hypothesis documented | Can't interpret results | Write hypothesis first |

---

## Related Documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Testing and Experimentation Mental Model](../mental-models/Testing and Experimentation Mental Model.md) | Framework: when and what to test |
| [Experiment Quality Checklist](../checklists/Experiment Quality Checklist.md) | Validation: pre-launch checks |
| [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) | Execution: step-by-step process |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference: metric definitions |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Related: bid strategy experiments |

---

## Version Details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
