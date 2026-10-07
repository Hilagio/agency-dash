# Experiment Configuration Reference
Created: 2026-02-05
Updated: 2026-10-05

Support_ID: CHEATSHEET_44
Status: Done
Category: Operational
Reference Type: Cheat Sheets
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
| **AI Max experiment** | AI Max for Search settings (search term matching, final URL expansion, brand controls) | Configurable | AI Max rollout decisions |
| **Video experiment** | Video creative or targeting | Configurable | Video ad variations |
| **Demand Gen experiment** | Demand Gen creative, audiences, settings | Configurable | Demand Gen optimization |
| **Performance Max experiment** | PMax final URL expansion, text | Configurable | PMax optimization settings |
| **PMax Asset Experiment** | Creative asset sets in PMax (asset set A vs B) | Configurable | PMax creative testing |
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

### Where a custom experiment starts

| **Entry point** | **What it does** |
|-----------------|------------------|
| Experiments page | Full setup: pick the base campaign, define the treatment, set split and schedule |
| **Save as experiment** in the save flow | Turns a pending change into a treatment arm against the original campaign. Offered when saving a bid strategy or target change, a campaign settings change or an ad group change, and when applying a bid or budget recommendation |

Both entry points create the same custom experiment. The configuration rules below apply to either one.

### Configuration options

| **Setting** | **Options** | **Recommendation** |
|-------------|-------------|-------------------|
| Traffic split | 10-90% (default 50%) | 50/50 for fastest results |
| Sync schedule | Daily, Every 12h, Every 6h, Continuous | Daily for most tests |
| End date | Custom date or ongoing | Set end date based on volume |
| Goal metric | Primary conversion action | Match your campaign goal |
| Auto-apply results | On (default), configurable 80-95% confidence | Off: review every winner manually |

> ⚠️ **Turn auto-apply off.** Google defaults experiments to auto-apply the winning arm at a configurable 80-95% confidence threshold. Keep it off. The threshold can trigger before the test has run its full duration (full business cycle plus conversion lag), and it judges the winner on Google's headline metric, not your business KPI (profit, POAS, Net Gain). With auto-apply off, a winning treatment arm is paused at experiment end, so applying the result is a deliberate manual step. That is the point. This mirrors the account-wide position: every change gets manual review before it goes live. (See: [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md))

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

> ⚠️ **Every sync resets learning.** A syncing change mid-test restarts calibration on the arm it touches, which is why the experiment setup is completed before launch rather than during.

---

## 2️⃣ Traffic Split Mechanics

### How traffic splitting works

| **Aspect** | **Behavior** |
|------------|--------------|
| Split point | Applied at the eligible-auction level, before targeting and bid filters |
| Split method | Cookie-based user assignment by default. Search-based is the alternative, see Split-related settings below |
| Consistency | Under cookie-based assignment, the same user sees the same arm throughout the test |
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

### Reading an uneven split

The split governs auction eligibility, not spend. Each arm bids and filters independently after the split is applied, so equal eligibility routinely produces unequal spend. A gap between arms is expected output, not a broken test.

| **Spend deviation between arms** | **Reading** | **Action** |
|----------------------------------|-------------|-----------|
| Under 20% | Normal | None. Treat the result as valid |
| 20% or more | Investigate | Check for arm-specific setting drift, a budget cap, or a bid strategy still calibrating |

> ⚠️ **Never force an even spend split.** Adjusting budgets or bids mid-test to equalize spend selects which auctions each arm enters and biases the comparison. Uneven spend is a consequence of the change under test, so removing it removes the result.

Check over-delivery against **Served Cost** rather than **Billed Cost** in Reports Editor. Billed cost reflects over-delivery credits, which makes an arm look cheaper than it ran.

---

## 3️⃣ Statistical Requirements

### Minimum sample sizes

| **Effect size you want to detect** | **Conversions needed per arm** | **Total conversions** |
|-----------------------------------|-------------------------------|----------------------|
| 20%+ improvement | 100-150 | 200-300 |
| 15% improvement | 200-300 | 400-600 |
| 10% improvement | 400-500 | 800-1,000 |
| 5% improvement | 1,500+ | 3,000+ |

> ⚠️ **Detecting small effects requires massive volume.** A campaign at 100 conversions/month cannot reliably detect a 5% improvement, and no test duration compensates for that.

### Confidence levels

| **Confidence** | **Meaning** | **Google Ads default** |
|----------------|-------------|------------------------|
| 95% | 5% chance result is random | ✅ Standard |
| 90% | 10% chance result is random | Acceptable for directional |
| 99% | 1% chance result is random | Very conservative |

### Duration requirements

| **Factor** | **Minimum** | **Rationale** |
|------------|-------------|---------------|
| Learning period | 1-2 weeks (7-14 days) | Smart Bidding calibration |
| Day-of-week cycle | 1 full week | Covers all 7 days |
| Business cycle | 1 full cycle | B2B may need 4+ weeks |
| Conversion lag | + your lag period | Wait for attributed conversions |

**Duration formula:**
```
Test duration = MAX(
    1-2 weeks (learning period),
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
| Arm-level statistics | Per-arm metrics with p-values (surfaced for AI Max, Video, Demand Gen, and PMax experiment types) |

> 💡 **Read the p-value, not just the label.** Arm-level statistics report a p-value per arm. A p-value below 0.05 maps to the 95% confidence standard. Use it to confirm the "statistically significant" label rather than replace your own duration and sample-size checks.

**Interpreting results:**

| **Result** | **Interpretation** | **Action** |
|------------|-------------------|-----------|
| "Statistically significant" + positive | Treatment is reliably better | Apply treatment |
| "Statistically significant" + negative | Treatment is reliably worse | Keep control |
| "Not significant" | Cannot be distinguished from noise | Extend or end without winner |

---

## 4️⃣ Experiment Types Deep Dive

### Performance Max experiments

| **Testable** | **Options** |
|--------------|-------------|
| Final URL expansion | On vs. Off |
| Text asset automation (text customization) | On vs. Off |

**PMax experiment limits:**

| **Limit** | **Value** |
|-----------|-----------|
| Max experiments per campaign | 1 active |
| Max campaigns in experiment | 1 |

### Performance Max Asset Experiments

Asset Experiments test creative asset SETS against each other inside one PMax campaign, not just automation toggles. You compare two asset sets and measure against two success metrics, with results on the Experiments page.

| **Testable** | **Options** |
|--------------|-------------|
| Creative asset sets | Asset set A vs asset set B (headlines, images, videos, descriptions) |
| Success metrics | Two metrics tracked side by side (e.g., conversions and conversion value) |

> 💡 **Asset Experiments are the only way to test PMax creative against a real control.** Asset-group duplication measures a different campaign, not a different creative set. As with every experiment type, the read-out holds only at full duration and against the business KPI rather than Google's headline metric.

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
| AI Max (Search) | ✅ | ❌ | ✅ |
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

## 6️⃣ What a running experiment requires

The design, setup, launch and conclusion procedure is owned by [SOP - Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md). What a valid experiment requires while it runs:

| **Condition** | **Why it holds** |
|----------|---------------|
| Neither arm changes | A mid-test change makes the two arms differ in more than the variable under test |
| The test runs its full duration | Random variation produces false winners in short windows |
| No other experiment runs on the same campaign | Interaction effects are unattributable |
| Conversion lag is added to the duration before reading | Otherwise the result is judged on incomplete data |

The one condition that overrides the full-duration rule is catastrophic failure: an arm running more than 30% worse is grounds for ending early.

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
├─ AI Max for Search settings (term matching, FUE, brand controls)?
│   └─ Use AI MAX EXPERIMENT
│
├─ Video creative or video targeting?
│   └─ Use VIDEO EXPERIMENT
│
├─ Demand Gen creative, audiences, or settings?
│   └─ Use DEMAND GEN EXPERIMENT
│
├─ PMax automation settings?
│   └─ Use PMAX EXPERIMENT
│
├─ PMax creative asset sets?
│   └─ Use PMAX ASSET EXPERIMENT
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
| Correcting an uneven spend split | Biases which auctions each arm enters | Leave budgets and bids frozen. Under 20% deviation is normal |
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
| [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md) | Rationale: the account-wide auto-apply-off position |

---

## Version Details

- **Version:** 5.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
