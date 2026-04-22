# SOP – Scale Bids and Budgets
Created: 2026-02-04
Updated: 2026-04-02

Agent_Executable: No
Category: Bidding
Human_Approval_Required: No
Primary Outcome: Bids and budgets adjusted to move closer to the profit optimum while hitting growth goals
SOP_ID: SOP_39
Secondary Outcomes: Profit optimum identified, scaling validated through experiments, diminishing returns mapped
Status: Done
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through scaling bids and budgets beyond your current performance: adjusting targets to find the profit optimum, increasing budgets to capture more volume, and validating changes through experiments.

> ❓ **The big question:** How do you scale bids and budgets without overshooting into breakeven or pulling back into the starvation zone?

---

### What this SOP is NOT

This SOP does **not:**

- Help you select a bid strategy (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Calculate your initial CPA/ROAS/POAS targets (See: [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))
- Set up your initial budget allocation (See: [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md))
- Explain the growth-efficiency tradeoff conceptually (See: [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md))

### When to run this SOP

Run this SOP when:

- Current performance is stable and you want to push for more volume or more profit
- Growth goals require higher spend or more aggressive targets
- You suspect you are in the starvation zone (over-optimizing for efficiency at the expense of volume)
- You want to find the profit optimum for a campaign or portfolio
- Quarterly or monthly optimization cycle calls for target and budget review

---

### Before you start

#### Required inputs

- Stable campaign performance (learning period complete, no major recent changes)
- Current CPA/ROAS/POAS targets and actual performance
- Breakeven CPA/ROAS/POAS from unit economics
- Current profit-to-acquisition ratio (PAR)
- Growth goals and efficiency goals
- Access to bid simulator and/or Performance Planner

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Growth-efficiency slider, PAR concept, zones |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Simulator and Performance Planner usage |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Breakeven and target calculations |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Learning period management after changes |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Budget increase mechanics |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Diagnose current position** | Determine where you sit on the growth-efficiency slider | Current PAR, zone identification, scaling direction |
| **Phase 2️⃣: Model scenarios** | Use bid simulator or Performance Planner to project outcomes | Profit optimum identified, target scenarios documented |
| **Phase 3️⃣: Execute scaling changes** | Adjust targets and/or budgets through experiments | Experiment running or changes applied |
| **Phase 4️⃣: Evaluate and iterate** | Measure results, decide next move | Validated scaling outcome, next iteration planned |

---

## Phase 1️⃣: Diagnose current position

### 1.1 Document current performance

Record for the campaign or portfolio you want to scale (last 4 weeks, excluding conversion delay):

| Metric | Current value |
|--------|--------------|
| CPA or ROAS or POAS (actual) | |
| Target CPA or ROAS or POAS | |
| Breakeven CPA or ROAS or POAS | |
| Conversions (last 30 days) | |
| Conversion value (last 30 days) | |
| Cost (last 30 days) | |
| Net profit (conversion value minus cost) | |
| IS lost to rank (%) | |
| IS lost to budget (%) | |

### 1.2 Calculate current PAR

Profit-to-acquisition ratio tells you how much of your profit you are reinvesting in acquisition:

**For CPA-based campaigns:**
PAR = 1 - (Target CPA / Breakeven CPA)

**For ROAS-based campaigns:**
PAR = 1 - (Breakeven ROAS / Target ROAS)

**For POAS-based campaigns:**
PAR = 1 - (100% / Target POAS)

| Input | Value |
|-------|-------|
| Current PAR | |

### 1.3 Identify your zone

| PAR range | Zone | Meaning | Action |
|-----------|------|---------|--------|
| 75-100% | Near breakeven | Maximum growth, minimal profit | Consider tightening targets for more profit |
| 50-75% | Balanced | Good balance of growth and efficiency | Look for profit optimum |
| 25-50% | Conservative | Strong efficiency, potential growth left on table | Consider loosening targets for more volume |
| 0-25% | Starvation zone | Over-optimizing for efficiency, volume drying up | Loosen targets immediately |

### 1.4 Determine scaling direction

| Situation | Scaling direction |
|-----------|------------------|
| Growth goal not met, PAR below 50% | Loosen targets (decrease ROAS/POAS, increase CPA) |
| Growth goal not met, PAR above 50% | Increase budget first, then loosen targets if needed |
| Growth goal met, want more profit | Tighten targets (increase ROAS/POAS, decrease CPA) |
| Growth goal met, want more volume | Loosen targets toward profit optimum |
| Budget-limited (high IS lost to budget) | Increase budget before changing targets |

---

## Phase 2️⃣: Model scenarios

### 2.1 Pull bid simulator data

1. Open the bid strategy report for your campaign or portfolio
2. Navigate to the bid simulator section
3. Note 5-7 scenarios at different target levels, from your current target to near-breakeven

Record the scenarios:

| Target level | Est. conversions | Est. conversion value | Est. cost | Net profit (value minus cost) |
|-------------|-----------------|----------------------|-----------|------------------------------|
| (Current) | | | | |
| | | | | |
| | | | | |
| | | | | |
| | | | | |

### 2.2 Run Performance Planner (optional, for budget scaling)

If scaling involves budget increases:

1. Open Tools > Planning > Performance Planner
2. Select the campaigns to model
3. Set the upcoming period (next month or quarter)
4. Model different budget levels
5. Note projected conversions and cost at each level

### 2.3 Identify the profit optimum

1. Export your scenarios to a spreadsheet
2. For each row, calculate: Net profit = Estimated conversion value minus Estimated cost
3. Plot the net profit curve (target on X-axis, net profit on Y-axis)
4. Identify the peak: the target level where net profit is highest

> 💡 **The profit optimum is rarely at either extreme:** Too aggressive (near breakeven) wastes profit on diminishing returns. Too conservative (starvation zone) leaves growth on the table. The peak is in the middle.

### 2.4 Apply a haircut to projections

Bid simulator and Performance Planner assume stable conditions. Apply these adjustments:

| Factor | Adjustment |
|--------|-----------|
| Forecasts assume perfect conditions | Apply 10-20% haircut to aggressive scenarios |
| Smooth curves overstate linear growth | Expect sharper diminishing returns in practice |
| Competition changes not modeled | Factor in known competitive shifts |
| Ad fatigue not modeled | Monitor CTR and conversion rate trends during scaling |

### 2.5 Document your scaling plan

| Field | Value |
|-------|-------|
| Current target | |
| Proposed new target | |
| Profit optimum target (from simulator) | |
| Current daily budget | |
| Proposed new daily budget (if changing) | |
| Expected impact on conversions | |
| Expected impact on net profit | |
| Validation method (experiment or direct) | |

---

## Phase 3️⃣: Execute scaling changes

### 3.1 Choose execution method

| Method | When to use | Risk level |
|--------|-------------|-----------|
| **Campaign experiment (50/50)** | High-stakes campaigns, large budget changes (>25%), stakeholder requires proof | Very low |
| **Incremental adjustment** | Moderate changes, stable campaigns, proven direction | Low |
| **Direct switch** | Small adjustments (<10-15%), low-stakes campaigns | Low |

### 3.2 Campaign experiment method

1. Go to the campaign > Experiments
2. Create a new experiment
3. Set the experiment variable: bid target only (or bid target + budget)
4. Set the experiment target to your proposed new target
5. Set traffic split to 50/50
6. Set duration to 30+ days
7. Launch the experiment
8. Do not make other changes to either arm during the experiment

### 3.3 Incremental adjustment method

For target changes:

1. Adjust target by 10-15% toward your proposed level
2. Wait one full conversion cycle (check bid strategy report for average conversion delay)
3. Evaluate performance
4. If performance is acceptable, make another 10-15% adjustment
5. Repeat until reaching the proposed target

For budget changes:

1. Increase daily budget by 15-20%
2. Wait for two conversion cycles for the algorithm to adjust (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
3. Evaluate spend rate and performance
4. If IS lost to budget is still high and performance is acceptable, increase again
5. Repeat until reaching the proposed budget

> ⚠️ **Budget increases of more than 30% in a single change can trigger a new learning period:** Keep individual budget adjustments under 30% and space them 1-2 weeks apart.

### 3.4 Direct switch method

1. Change the target to the proposed level
2. If also changing budget: update the daily budget
3. Monitor closely during the learning period (two conversion cycles)

---

## Phase 4️⃣: Evaluate and iterate

### 4.1 Evaluate results

After the experiment completes (30+ days) or the incremental adjustments stabilize:

1. Pull performance data excluding learning period and conversion delay
2. Compare to Phase 1 baseline

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| CPA/ROAS/POAS | | | |
| Conversions | | | |
| Conversion value | | | |
| Cost | | | |
| Net profit | | | |
| IS lost to rank | | | |
| IS lost to budget | | | |

### 4.2 Decision matrix

| Result | Next step |
|--------|----------|
| Net profit increased, growth goal met | Apply experiment (if applicable), document new baseline |
| Net profit increased, growth goal not yet met | Continue scaling in the same direction (Phase 2-3 again) |
| Net profit decreased but volume increased | Evaluate if volume gain justifies profit loss per growth goals |
| Net profit decreased and volume unchanged | Revert, investigate root cause |
| Budget still limited after increase | Increase budget again (repeat Phase 3) |

### 4.3 For campaign experiments

After 30+ days with statistical significance above 80%:

1. Use conversion value (for value-based strategies) or conversions (for volume strategies) as the primary comparison metric
2. Use net profit as the secondary metric
3. Exclude learning period (first two conversion cycles) and conversion delay from analysis
4. If experiment wins: apply experiment
5. If original wins: end experiment, keep original

### 4.4 Set the next iteration

Scaling is iterative. After each adjustment:

| Check | Action |
|-------|--------|
| Are you at the profit optimum? | If yes, maintain current targets and monitor |
| Is there more room to scale? | If yes, return to Phase 1 with new baseline |
| Have growth goals changed? | If yes, recalculate targets and restart |
| Has the market shifted? | If yes, re-run bid simulator for updated projections |

---

### Validation & definition of done

This SOP is complete when:

- [ ] Current position diagnosed (PAR calculated, zone identified)
- [ ] Bid simulator or Performance Planner scenarios documented
- [ ] Profit optimum identified (or confirmed current position is optimal)
- [ ] Scaling changes executed (experiment or incremental adjustments)
- [ ] Results evaluated after sufficient data collection
- [ ] Decision made: apply, iterate further, or revert
- [ ] New baseline documented for next cycle

---

### Exit → Entry bridge

Once scaling changes are validated:

| Timeframe | Action |
|-----------|--------|
| After each scaling cycle | Document new baseline, update PAR |
| Monthly | Re-run bid simulator to check if profit optimum has shifted |
| Quarterly | Full recalculation: recalculate breakeven, re-validate targets, re-run this SOP |
| When unit economics change | Recalculate targets via [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Performance degrades after scaling | [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) troubleshooting table |
| Cannot scale further (diminishing returns) | Improve upstream metrics (conversion rate, landing page, offer) |
| Unit economics no longer support targets | [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) to recalculate |
| Budget allocation needs rethinking | [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) |

---

### FAQ

**Q: Should I scale targets or budgets first?**

A: If IS lost to budget is above 15%, increase budget first because you are leaving volume on the table at your current targets. If IS lost to budget is low, adjust targets to find the profit optimum.

**Q: How much can I change a target at once?**

A: Keep target adjustments to 10-15% per change. Larger jumps trigger extended learning periods and make it harder to isolate the impact. For significant changes (>25%), use a campaign experiment instead.

**Q: How do I know if I am in the starvation zone?**

A: Calculate your PAR (Phase 1.2). If it is below 25%, you are in the starvation zone. See [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) for the full zone framework and diagnostic signals.

**Q: Can I automate profit optimum analysis?**

A: For large accounts, use the Google Ads API to pull bid simulator data weekly, calculate profit optimum per campaign automatically, and generate a spreadsheet with current target vs. suggested optimum. Review and apply changes through campaign experiments.

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Mental Model | Phase 1 (zones, PAR slider) |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Reference | Phase 2 (simulator usage, profit optimum method) |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Reference | Phase 1 (breakeven, PAR calculation) |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Phase 3 (learning period after changes) |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Checklist | Phase 4 (troubleshooting) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (provides breakeven and target calculations) |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Upstream (provides initial budget allocation) |
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (determines bid strategy before scaling) |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Related (target adjustments reference this SOP) |
| [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) | Related (ROAS/POAS target adjustments reference this SOP) |
| [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) | Related (post-migration scaling) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Scaling targets without simulator data | Guessing instead of modeling | Always pull bid simulator scenarios before changing targets |
| Making large target jumps (>25%) | Impatience, aggressive growth goals | Use 10-15% increments or campaign experiments for large changes |
| Ignoring diminishing returns | Taking simulator projections at face value | Apply 10-20% haircut, plot the full curve, look for flattening |
| Scaling without validation | Skipping experiments, applying changes directly | Use campaign experiments for high-stakes or large changes |
| Not accounting for conversion delay | Evaluating too early with incomplete data | Exclude last [conversion delay] days from all evaluations |
| Scaling budget without checking IS metrics | Increasing budget when the issue is targeting, not budget | Check IS lost to budget first, only increase budget if it is the constraint |

---

### Version details

- **Version:** 2.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
