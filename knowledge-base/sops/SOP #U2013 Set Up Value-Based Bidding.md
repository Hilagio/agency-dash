# SOP – Set Up Value-Based Bidding (Max Conv Value / tROAS / POAS)
Created: 2026-02-04

Agent_Executable: No
Category: Bidding
Human_Approval_Required: No
Primary Outcome: Campaign running on Maximize Conversion Value or Target ROAS/POAS with correct configuration
SOP_ID: SOP_35
Secondary Outcomes: POAS transition path documented if applicable, learning period managed
Status: Done
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through setting up a value-based bid strategy (Maximize Conversion Value, Target ROAS, or POAS) for a campaign optimizing for revenue or profit efficiency.

> ❓ **The big question:** How do you configure value-based bidding correctly, and when should you move from ROAS to POAS?

---

### What this SOP is NOT

This SOP does **not:**

- Help you select which bid strategy to use (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Cover conversion-volume strategies like Maximize Conversions or Target CPA (See: [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md))
- Calculate your ROAS or POAS targets (See: [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))
- Explain how smart bidding works internally (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Set up conversion tracking or value tracking from scratch (See: [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md))

### When to run this SOP

Run this SOP when:

- You have selected Maximize Conversion Value, Target ROAS, or POAS as your bid strategy
- You are launching a new campaign with a revenue or profit efficiency objective
- You are migrating an existing campaign from a conversion-based strategy to a value-based strategy
- You are transitioning from ROAS to POAS after implementing profit tracking

---

### Before you start

#### Required inputs

- Bid strategy selected (Max Conversion Value, Target ROAS, or POAS) from the decision tree
- Conversion action with values populating correctly (revenue or profit)
- If Target ROAS: your calculated ROAS target from the bid targets calculator
- If POAS: profit tracking implemented and at least 100 conversions recorded with profit values
- Campaign structure finalized (keywords, ad groups, ads in place)
- Daily budget set

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bid Targets Reference](../references/Bid Targets Reference.md) | ROAS/POAS target calculations |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Learning period management |
| [Cart Data and Profit Tracking Reference](../references/Cart Data and Profit Tracking Reference.md) | POAS conversion setup |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Post-setup validation |

---

### Decision gate: Revenue vs. Profit vs. Lead Gen

Before configuring, determine your path:

| If... | Then... | Go to |
|-------|---------|-------|
| You track revenue (not profit) and want max revenue | Maximize Conversion Value or tROAS | Phase 1, then Phase 2 |
| You track gross profit via Profit Metrics or custom solution | POAS | Phase 1, then Phase 3 |
| You run lead gen with real deal values via OCT | Value-Based Bidding for lead gen | Phase 1, then Phase 4 |

> ⚠️ **Value-based bidding requires conversion values:** If your conversion actions do not pass dynamic values (revenue, profit, or deal values), this strategy will not work. Verify values are populating before proceeding.

**Decision flow:**

```
Are conversion values populating in your reports?
│
├─ NO → Fix tracking first
│       (See: SOP – Set Up Cart Data and Profit Tracking)
│
└─ YES → What type of values?
          │
          ├─ Revenue → Phase 2 (ROAS path)
          │
          ├─ Gross profit → Phase 3 (POAS path)
          │
          └─ Lead/deal values via OCT → Phase 4 (VBB for lead gen)
```

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Verify conversion value tracking** | Confirm values are correct and primary action is set | Validated conversion setup |
| **Phase 2️⃣: Configure ROAS strategy** | Set Max Conv Value or tROAS with initial target | Strategy active on campaign |
| **Phase 3️⃣: Transition to POAS** | Switch from revenue to profit optimization with guardrails | POAS strategy running with safeguards |
| **Phase 4️⃣: VBB for lead gen** | Set up value-based bidding using OCT deal values | tROAS experiment running against tCPA baseline |
| **Phase 5️⃣: Manage learning and optimize** | Monitor learning period and make first adjustments | Stable strategy with documented next steps |

---

## Phase 1️⃣: Verify conversion value tracking

### 1.1 Confirm values are populating

1. Navigate to the campaign's conversion report (Campaigns > Segment by Conversions > Conversion action)
2. Verify the intended conversion action shows in the report
3. Check the "Conv. value" column: values must be greater than zero and reflect actual transaction amounts
4. If values show as zero or a static default: fix the value pass-through before proceeding

| Value type | What to verify | Source |
|------------|---------------|--------|
| Revenue | Dynamic values match actual transaction totals | Google tag, GTM dataLayer, or platform integration |
| Gross profit | Values reflect margin, not revenue | Profit Metrics, custom solution, or server-side calculation |
| Deal values (lead gen) | Values reflect actual deal amounts from CRM | Offline Conversion Tracking upload or API |

### 1.2 Set the correct primary conversion action

1. Go to campaign settings > Goals
2. Select "Use campaign-specific goal settings"
3. Choose the correct conversion action as primary:
   - For ROAS: the revenue-tracking conversion action
   - For POAS: the profit-tracking conversion action
   - For lead gen VBB: the OCT conversion action with deal values
4. Deselect any conversion actions that should not influence bidding

> ⚠️ **Wrong primary action = wrong optimization:** If a revenue action is primary when you intend POAS, the algorithm optimizes for revenue, not profit. Verify the primary action matches your objective.

### 1.3 Validate value accuracy

Spot-check 10-20 recent conversions against your back-end data:

1. Export recent conversions from Google Ads
2. Compare conversion values to actual transaction amounts in your CRM, analytics, or e-commerce platform
3. If values differ by more than 5%: investigate the tracking setup before proceeding

---

## Phase 2️⃣: Configure ROAS strategy

### 2.1 Maximize Conversion Value (no target)

If you selected Maximize Conversion Value without a ROAS target:

**In Google Ads UI:**

1. Go to campaign settings
2. Click "Bidding"
3. Select "Maximize conversion value"
4. Leave "Set a target return on ad spend" unchecked
5. Save

- No target configuration needed
- The algorithm will maximize total conversion value within your daily budget
- Budget acts as your only constraint

**When to start without a target:**

| Scenario | Start without target |
|----------|---------------------|
| New campaign, no historical ROAS data | Yes, gather data first |
| Migrating from Max Conversions to value-based | Yes, let the algorithm learn value patterns |
| Wide product catalog with variable AOVs | Yes, discover the natural value distribution |

### 2.2 Target ROAS

If you selected Target ROAS:

**In Google Ads UI:**

1. Go to campaign settings
2. Click "Bidding"
3. Select "Maximize conversion value"
4. Check "Set a target return on ad spend"
5. Enter your initial ROAS target (as a percentage, e.g., 400%)
6. Save

**In Google Ads Editor:**

1. Select the campaign
2. Change "Bid strategy type" to "Maximize conversion value"
3. Set the "Target ROAS" field
4. Post changes

**Setting the initial ROAS target:**

1. Pull the campaign's average ROAS from the last 2-4 weeks
2. Set the initial target at or slightly below that average
3. If no historical data exists: use the calculated ROAS target from the [Bid Targets Reference](../references/Bid Targets Reference.md)

| Situation | Initial target |
|-----------|---------------|
| Existing campaign with ROAS history | Average ROAS from last 2-4 weeks (or slightly below) |
| New campaign, calculated target available | Calculated ROAS from unit economics |
| Migrating from Max Conv Value after data gathering | Average ROAS achieved during uncapped phase |

> 💡 **Set the initial target conservatively:** Start at or slightly below where the campaign has been performing. Tighten gradually (10-15% per adjustment) once the algorithm stabilizes. Setting an aggressive target from day one causes the algorithm to restrict volume too aggressively.

---

## Phase 3️⃣: Transition to POAS

This phase applies only if you are moving from revenue-based optimization to profit-based optimization. Skip this phase if you are not implementing POAS.

### 3.1 Prerequisites for POAS

Before starting the transition, confirm:

- [ ] Profit tracking is implemented (Profit Metrics, custom server-side solution, or equivalent)
- [ ] A profit-based conversion action exists in Google Ads
- [ ] At least 100 conversions have been recorded with profit values
- [ ] Profit values have been validated against back-end data (Phase 1.3)

> ↪️ **If profit tracking is not yet set up:** Complete [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md) first, then return here after gathering 100+ profit-based conversions.

### 3.2 Set up campaign-specific goals

1. Navigate to campaign settings > Goals
2. Switch to "Use campaign-specific goal settings"
3. Select the profit-based conversion action as primary
4. Deselect the revenue-based conversion action
5. Save

### 3.3 Apply transition guardrails

Switching the primary conversion action changes what the algorithm optimizes for. Apply these guardrails to prevent wild CPC swings during the transition:

**Step 1️⃣: Cap the daily budget**

Set the campaign's daily budget to approximately the average daily spend from the last 2-4 weeks. This prevents the algorithm from dramatically increasing spend while it re-learns.

**Step 2️⃣: Cap max CPCs using a portfolio strategy**

1. Create a new Portfolio Bid Strategy with Maximize Conversion Value / Target ROAS
2. Set a maximum CPC bid limit within the portfolio strategy settings
3. Base the max CPC cap on your current average CPC plus 20-30% headroom
4. Apply the portfolio strategy to the campaign

**Step 3️⃣: Set the initial POAS target**

POAS targets work differently from ROAS because the values represent profit, not revenue:

| POAS target | Meaning |
|-------------|---------|
| 100% | Breakeven (every € spent returns €1 of gross profit) |
| 150% | For every € spent, you return €1.50 in gross profit |
| 200% | For every € spent, you return €2.00 in gross profit |
| 300% | For every € spent, you return €3.00 in gross profit |

Set the initial POAS target based on your growth goals:

| Goal | Typical initial target |
|------|----------------------|
| Aggressive growth (maximize volume) | 100-150% |
| Balanced growth | 150-200% |
| Conservative (maximize profitability) | 200-300% |

Enter the target as a percentage in the bid strategy settings. If you had a 400% ROAS target and your average margin is 40%, your equivalent POAS target is approximately 160%.

### 3.4 Monitor the transition

During the first 2-4 weeks after switching to POAS:

| Monitor | Action threshold |
|---------|-----------------|
| Average CPC | If CPCs rise more than 30% above historical average, tighten the max CPC cap |
| Daily spend | If spend exceeds the budget cap, lower the budget to enforce the constraint |
| Conversion volume | If volume drops more than 40%, loosen the POAS target by 10-20% |
| Profit per conversion | Verify values align with back-end profit data weekly |

After 2-4 weeks of stable performance:

1. Remove the max CPC cap (gradually raise it first, then remove entirely)
2. Allow the budget to expand if performance supports it
3. Continue optimizing the POAS target using the same 10-15% adjustment cadence

---

## Phase 4️⃣: VBB for lead gen

This phase applies only to lead generation campaigns using Offline Conversion Tracking with real deal values. Skip this phase if you are running e-commerce.

### 4.1 Prerequisites for lead gen VBB

Before starting:

- [ ] Offline Conversion Tracking is implemented and uploading deal values from CRM
- [ ] Conversion lag is understood (time from click to deal close)
- [ ] At least 50 conversions with deal values have been uploaded
- [ ] Current campaign is running on Target CPA with stable performance

> ↪️ **If OCT is not yet set up:** Complete [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) first, then return here after gathering sufficient data.

### 4.2 Set up the experiment

Do not switch directly from tCPA to tROAS for lead gen. Run an experiment:

1. Go to Campaigns > Experiments
2. Create a new custom experiment
3. Set the experiment to a 50/50 traffic split
4. In the experiment arm, change the bid strategy from Target CPA to Target ROAS (Maximize Conversion Value with a ROAS target)
5. Set the tROAS target based on the campaign's average conversion value divided by average CPA (expressed as a percentage)
6. Run the experiment for at least 30 days

**Calculating the initial tROAS for lead gen:**

```
Average deal value per conversion: €2,000
Average CPA: €200
Initial tROAS = (€2,000 / €200) x 100 = 1,000%
```

### 4.3 Evaluate the experiment

After 30+ days, evaluate:

| Metric | How to compare |
|--------|---------------|
| Total conversion value | Primary metric: does the tROAS arm generate more total value? |
| Cost per conversion | Secondary: is CPA still within acceptable range? |
| Conversion volume | Check that volume did not drop significantly |
| Value per conversion | Check if tROAS prioritized higher-value leads |

**Decision after experiment:**

| Result | Action |
|--------|--------|
| tROAS arm generates more total conversion value at acceptable CPA | Apply experiment (switch to tROAS) |
| tROAS arm generates similar value but lower volume | Keep tCPA, re-test after more OCT data accumulates |
| tROAS arm generates less value or much higher CPA | Keep tCPA, VBB may not suit this funnel yet |

> 💡 **Evaluate on conversion value, not just CPA:** The point of VBB for lead gen is to prioritize high-value leads. A slightly higher CPA is acceptable if total deal value increases.

---

## Phase 5️⃣: Manage learning and optimize

### 5.1 Set expectations

Before the strategy goes live (or after a major change), brief stakeholders:

- Performance will fluctuate for approximately two conversion cycles (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- ROAS/POAS may be below target during learning
- Conversion value may be inconsistent day to day
- No changes will be made during this period

### 5.2 Monitor without reacting

During the learning period (two conversion cycles):

| Do | Do not |
|----|--------|
| Check metrics daily for anomalies (tracking breaks, extreme CPC spikes) | Adjust the ROAS/POAS target |
| Verify conversion values are still populating correctly | Change budgets by more than 10% |
| Note external factors (seasonality, promotions, competitor changes) | Add or remove keywords |
| Prepare your first optimization plan for post-learning | Panic if day-to-day ROAS swings widely |

### 5.3 Identify learning period end

The learning period has ended when:

- Daily performance stabilizes (less extreme day-to-day swings)
- Two conversion cycles have passed since the strategy change
- At least one full conversion cycle has elapsed

### 5.4 Post-learning adjustments

After the learning period ends:

1. Pull performance data excluding the learning period (first two conversion cycles)
2. Also exclude the most recent conversion-delay days (incomplete attribution)
3. Compare actual ROAS/POAS to target
4. Compare conversion value to growth goals

| Result | Action |
|--------|--------|
| ROAS/POAS near target, value meets goals | No change needed, continue monitoring |
| ROAS/POAS below target by more than 20% | Tighten target by 10-15%, wait one conversion cycle |
| ROAS/POAS well above target | Consider loosening target to capture more volume |
| Value below growth goals | Decrease target by 10-15% or increase budget |
| Value above goals, ROAS/POAS within target | Opportunity to tighten target for more efficiency |

### 5.5 Ongoing management cadence

| Frequency | Action |
|-----------|--------|
| Weekly | Check ROAS/POAS vs. target, total conversion value, IS lost (budget and rank) |
| Bi-weekly | Review search term report, check for CPC anomalies |
| Monthly | Run bid simulator analysis, compare to growth goals |
| Quarterly | Validate target against unit economics (recalculate if margins or costs changed) |

### 5.6 Run post-setup checklist

Run the [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) to confirm all configuration is correct.

---

### Validation & definition of done

This SOP is complete when:

- [ ] Conversion values are populating correctly (revenue, profit, or deal values)
- [ ] Correct conversion action is selected as primary via campaign-specific goals
- [ ] Bid strategy is set to Maximize Conversion Value, Target ROAS, or POAS
- [ ] Initial target is set based on calculated or historical data
- [ ] POAS guardrails are in place (if transitioning from ROAS to POAS)
- [ ] Lead gen experiment is running (if VBB for lead gen path)
- [ ] Stakeholders have been briefed on learning period expectations
- [ ] Learning period has been completed without interference
- [ ] Post-learning evaluation has been performed
- [ ] Bid Strategy Health Checklist passes

---

### Exit → Entry bridge

Once the strategy is stable and post-learning evaluation is complete:

| Timeframe | Action |
|-----------|--------|
| Week 3-4 | Make first target adjustment if needed (10-15% increments) |
| Month 2+ | Begin regular optimization cadence |
| When profit tracking is ready (if currently on ROAS) | Return to Phase 3 of this SOP for POAS transition |
| When scaling beyond current performance | Begin [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| ROAS/POAS cannot meet target even after adjustments | [Bid Targets Reference](../references/Bid Targets Reference.md) to recalculate, then [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) |
| Volume insufficient at any target level | [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) troubleshooting table |
| Conversion values incorrect or missing | [Cart Data and Profit Tracking Reference](../references/Cart Data and Profit Tracking Reference.md) |
| OCT data not uploading | [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) |

---

### FAQ

**Q: Should I start with Maximize Conversion Value and add a ROAS target later, or start directly with Target ROAS?**

A: If you have sufficient historical data (50+ conversions/month with values) and a calculated ROAS target, start directly with Target ROAS. If launching a new campaign or migrating from a conversion-volume strategy, start with Maximize Conversion Value for 2-4 weeks to let the algorithm learn your value distribution, then add a ROAS target based on the average ROAS achieved.

**Q: What POAS target should I start with?**

A: 100% POAS is breakeven. Start by converting your current ROAS target to a POAS equivalent: multiply your ROAS target by your average gross margin percentage. For example, 400% ROAS with 40% margin = 160% POAS. Then adjust based on your growth goals. More aggressive growth warrants a lower target (closer to 100%), while profit-focused accounts warrant a higher target (200-300%).

**Q: When is the right time to transition from ROAS to POAS?**

A: Transition when you have: (1) a working profit tracking implementation, (2) at least 100 conversions recorded with profit values, (3) validated that profit values match back-end data, and (4) a product mix where margin varies meaningfully across products. If all products have the same margin, POAS and ROAS produce the same optimization signals, and the transition adds no value.

**Q: How do I handle the POAS transition for Shopping campaigns with thousands of SKUs?**

A: The process is the same. The guardrails (budget cap, max CPC cap via portfolio strategy) protect against wild swings. Start with one campaign to validate the transition, then roll out to additional campaigns once the first campaign stabilizes. Allow 4-6 weeks per campaign for the full transition.

**Q: Why run an experiment for lead gen VBB instead of switching directly?**

A: Lead gen value data is inherently noisier than e-commerce (fewer conversions, longer lag, variable deal sizes). A 50/50 experiment isolates the impact of the strategy change and lets you compare tROAS performance against your proven tCPA baseline. Direct switching risks losing performance if the algorithm does not have enough value signal to optimize effectively.

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Reference | Phase 2 (ROAS target), Phase 3 (POAS target) |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Phase 5 (learning period management) |
| [Cart Data and Profit Tracking Reference](../references/Cart Data and Profit Tracking Reference.md) | Reference | Phase 1 (value verification), Phase 3 (POAS setup) |
| [Offline Conversion Tracking Reference](../references/Offline Conversion Tracking Reference.md) | Reference | Phase 4 (lead gen VBB) |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Checklist | Phase 5 (post-setup validation) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (determines which strategy to set up) |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (provides the ROAS/POAS target) |
| [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md) | Upstream (required for POAS path) |
| [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) | Upstream (required for lead gen VBB path) |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Alternative (for conversion-volume objectives) |
| [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) | Conditional (if using portfolio strategy for CPC caps) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Downstream (once strategy is stable) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Setting tROAS target far above historical average | Unrealistic expectations, insufficient data analysis | Set initial target at or slightly below average ROAS from last 2-4 weeks |
| Switching to POAS without enough profit conversions | Impatience to optimize on profit | Gather 100+ profit-based conversions before switching the primary action |
| No guardrails during POAS transition | Assumption that the algorithm will self-correct quickly | Cap daily budget and max CPCs for the first 2-4 weeks |
| Skipping the experiment for lead gen VBB | Confidence that VBB will outperform tCPA | Always run a 50/50 experiment for at least 30 days |
| Wrong conversion action as primary | Forgetting to switch from revenue to profit action (or vice versa) | Verify campaign-specific goals match your intended optimization |
| Making changes during learning period | Stakeholder pressure, day-to-day volatility | Brief stakeholders before launch, commit to hands-off period |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
