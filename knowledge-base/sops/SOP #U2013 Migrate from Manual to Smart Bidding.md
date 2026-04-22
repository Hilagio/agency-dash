# SOP – Migrate from Manual to Smart Bidding
Created: 2026-02-04

Agent_Executable: No
Category: Bidding
Human_Approval_Required: No
Primary Outcome: Campaign successfully transitioned from Manual CPC to an automated bid strategy with minimal performance disruption
SOP_ID: SOP_36
Secondary Outcomes: Learning period managed, performance benchmarks documented, rollback plan prepared
Status: Done
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through migrating a campaign from Manual CPC (or Maximize Clicks) to a conversion-focused or value-focused automated bid strategy.

> ❓ **The big question:** How do you transition from manual bidding to smart bidding without losing performance during the switch?

---

### What this SOP is NOT

This SOP does **not:**

- Help you select which smart bidding strategy to migrate to (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Cover setting up a brand new campaign on smart bidding (See: [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md))
- Explain how smart bidding works (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Calculate your CPA or ROAS targets (See: [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))

### When to run this SOP

Run this SOP when:

- A campaign is currently on Manual CPC or Maximize Clicks and has accumulated sufficient conversion data (50+ conversions/month recommended, 15 minimum)
- The decision tree indicates a conversion-based or value-based strategy is appropriate
- You are ready to let smart bidding take over bid management

---

### Before you start

#### Required inputs

- Current campaign performance benchmarks: average CPA, average ROAS, conversion volume, average CPC (last 4 weeks)
- Target bid strategy determined via the decision tree
- Calculated CPA or ROAS target (if using tCPA or tROAS)
- Conversion tracking verified and stable
- Stakeholder briefed and aligned on the migration plan

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Confirming target strategy |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Learning period expectations |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Target CPA/ROAS calculations |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Portfolio strategy and CPC cap settings |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Document baseline** | Record current performance for comparison | Benchmark spreadsheet |
| **Phase 2️⃣: Prepare the migration** | Set up guardrails and choose migration method | Migration plan with rollback criteria |
| **Phase 3️⃣: Execute the switch** | Change the bid strategy | Smart bidding active |
| **Phase 4️⃣: Manage learning and stabilize** | Monitor, then evaluate and optimize | Validated smart bidding performance |

---

## Phase 1️⃣: Document baseline

### 1.1 Record current performance

Before making any changes, document these metrics for the last 4 weeks (excluding any anomalous periods):

| Metric | Value | Notes |
|--------|-------|-------|
| Conversions (last 30 days) | | Must be 15+ (50+ recommended) |
| Average CPA | | Benchmark for initial tCPA target |
| Average ROAS | | Benchmark for initial tROAS target |
| Conversion value | | Total revenue or profit |
| Average CPC | | Reference for CPC monitoring |
| CTR | | Baseline for quality monitoring |
| Impression share | | Baseline for competitiveness |
| IS lost to rank | | Shows current competitiveness |
| IS lost to budget | | Shows budget headroom |

### 1.2 Identify conversion delay

Check the bid strategy report or conversion columns for your average conversion delay. You will need this to:

- Determine how long to wait before evaluating results
- Exclude incomplete data from performance comparisons

---

## Phase 2️⃣: Prepare the migration

### 2.1 Choose migration method

| Method | When to use | Risk level |
|--------|-------------|-----------|
| **Direct switch** | Campaign has 50+ conversions/month, stable performance, familiar query themes | Low |
| **Campaign experiment (50/50)** | You want to validate before committing, high-stakes campaign, stakeholder requires proof | Very low |
| **Staged migration** | Campaign has 15-50 conversions, or you want extra caution | Low |

**Direct switch:** change the bid strategy on the live campaign. Fastest, suitable when data is strong.

**Campaign experiment:** create a 50/50 experiment with the new strategy on the experiment arm. Run for 30+ days. Apply if results are positive. Safest option.

**Staged migration:** start with Maximize Conversions (no target) for 2-4 weeks, then add a CPA/ROAS target based on the averages achieved.

### 2.2 Set initial target

| Migrating to | Initial target |
|-------------|---------------|
| Maximize Conversions | No target needed (budget is the constraint) |
| Target CPA | Set at current average CPA or slightly above (5-10% buffer) |
| Maximize Conversion Value | No target needed |
| Target ROAS | Set at current average ROAS or slightly below (5-10% buffer) |

> 💡 **Always set the initial target generously:** The goal of the first 2-4 weeks is to let smart bidding learn without restriction. Tighten toward your calculated target in 10-15% increments after stabilization.

### 2.3 Prepare rollback criteria

Define in advance when you would revert to manual bidding:

| Criterion | Threshold | Action |
|-----------|-----------|--------|
| Cost exceeds 2x historical daily average for 3+ consecutive days | Budget protection | Reduce daily budget, do not revert strategy |
| CPA exceeds 2x target after learning period ends | Sustained poor performance | Tighten target or revert |
| Conversions drop to near zero | Tracking issue or starvation | Check tracking first, then revert if tracking is fine |

> ⚠️ **Do not revert during the learning period:** Volatility during the first two conversion cycles (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md)) is normal. Only consider reverting if there are clear anomalies (tracking breaks, extreme cost spikes beyond 2x daily budget).

---

## Phase 3️⃣: Execute the switch

### 3.1 Direct switch method

1. Go to campaign settings > Bidding
2. Change the strategy to your target strategy
3. If using tCPA: enter your initial target (current average CPA + 5-10%)
4. If using tROAS: enter your initial target (current average ROAS - 5-10%)
5. Save
6. Verify the strategy is active in the campaign overview

### 3.2 Campaign experiment method

1. Go to campaign > Experiments
2. Create a new experiment
3. Set the experiment variable: bid strategy only
4. Set the experiment strategy to your target strategy with initial target
5. Set traffic split to 50/50
6. Set experiment duration to 30+ days
7. Launch the experiment
8. Do not make other changes to either the original or experiment arm

### 3.3 Staged migration method

1. Switch from Manual CPC to Maximize Conversions (no target)
2. Run for 2-4 weeks to establish smart bidding baseline
3. After 2-4 weeks, add your CPA target based on the average CPA achieved
4. Continue to Phase 4

### 3.4 Brief stakeholders

Send a brief communication covering:

- What changed and why
- Expected learning period (two conversion cycles)
- What to expect during learning (fluctuating CPAs, inconsistent volume)
- When the first evaluation will happen (after learning period + one conversion cycle)
- Clear instruction: no panic, no requests to revert during learning

---

## Phase 4️⃣: Manage learning and stabilize

### 4.1 Learning period (Days 1-14)

| Do | Do not |
|----|--------|
| Monitor daily for anomalies only | Change targets |
| Verify tracking is still firing | Adjust budgets by more than 10% |
| Note external factors for context | Add or remove keywords or audiences |
| Prepare evaluation framework | Make any other campaign changes |

### 4.2 Post-learning evaluation

After the learning period (two conversion cycles) plus one conversion cycle:

1. Pull performance data with these filters:
   - Exclude the learning period (two conversion cycles)
   - Exclude last [conversion delay] days (incomplete attribution)
2. Compare to Phase 1 baseline

| Metric | Compare to baseline | Interpretation |
|--------|-------------------|---------------|
| CPA | Within 20% of baseline | Healthy transition |
| Conversion volume | Within 20% of baseline or higher | Smart bidding is performing |
| ROAS | Within 20% of baseline or higher | Value optimization working |
| Impression share | Stable or improved | Bidding is competitive |

### 4.3 First optimization

| Result | Next step |
|--------|----------|
| Performance matches or exceeds baseline | Tighten target by 10-15% toward your calculated target |
| Performance slightly below baseline | Wait one more conversion cycle, then reassess |
| Performance significantly below baseline | Check troubleshooting table in [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) |

### 4.4 For campaign experiments

After 30+ days with statistical significance above 80%:

1. Compare experiment vs. original using conversion value as primary metric (for value strategies) or conversions (for volume strategies)
2. Exclude learning period (first two conversion cycles) and conversion delay from analysis
3. If experiment wins: apply experiment
4. If original wins: end experiment, keep original strategy

### 4.5 Run post-migration checklist

Run the [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) to validate all settings.

---

### Validation & definition of done

This SOP is complete when:

- [ ] Baseline metrics documented before migration
- [ ] Smart bidding strategy is active and configured correctly
- [ ] Learning period has completed without interference
- [ ] Post-learning evaluation performed (excluding learning period and conversion delay)
- [ ] Performance is within acceptable range of baseline (or experiment applied)
- [ ] Stakeholders briefed on results and next steps
- [ ] Bid Strategy Health Checklist passes

---

### Exit → Entry bridge

Once migration is validated:

| Timeframe | Action |
|-----------|--------|
| Weeks 3-4 | Make first target adjustments (10-15% increments toward calculated target) |
| Month 2+ | Enter regular optimization cadence |
| When ready to scale | Begin [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Performance does not stabilize after 30 days | [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) troubleshooting table |
| Need to consolidate data across campaigns | [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) |
| Targets need recalculation | [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) |

---

### FAQ

**Q: Should I use a campaign experiment or direct switch?**

A: Use a campaign experiment for high-stakes campaigns where you need statistical proof before committing. Use a direct switch when you have strong data (50+ conversions/month) and are confident in the strategy. The staged migration (Max Conv first, then add target) is a good middle ground.

**Q: What if performance drops after the switch?**

A: First, ensure the learning period is over and you are excluding conversion delay from your analysis. If performance is genuinely worse after a full evaluation, check the Bid Strategy Health Checklist troubleshooting table. Common causes: insufficient conversion volume, unrealistic targets, or tracking issues.

**Q: How long should I wait before concluding the migration was successful?**

A: At minimum, wait one full learning period (two conversion cycles) plus two full conversion cycles. For most accounts, this means 3-6 weeks of data before making a definitive conclusion.

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Reference | Phase 2 (confirming target strategy) |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Reference | Phase 2 (setting initial target) |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Phase 4 (learning period management) |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Checklist | Phase 4 (post-migration validation) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (determines target strategy) |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (provides CPA/ROAS target) |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Alternative (for new campaigns starting on smart bidding) |
| [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) | Alternative (for value-based migration) |
| [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) | Conditional (if data pooling is needed) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Downstream (once migration is stable) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Reverting during learning period | Stakeholder panic from volatile metrics | Brief stakeholders before migration, set clear evaluation timeline |
| Setting initial target too tight | Using calculated target instead of current average | Start generous, tighten gradually |
| Forgetting to document baseline | Cannot compare pre/post performance | Complete Phase 1 before any changes |
| Not excluding conversion delay from evaluation | Incomplete data makes performance look worse | Always exclude last [conversion delay] days |
| Making multiple changes alongside the strategy switch | Cannot isolate the strategy's impact | Only change the bid strategy, nothing else |

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
