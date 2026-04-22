# SOP – Set Up Conversion-Based Bidding (Max Conversions / tCPA)
Created: 2026-02-04

Agent_Executable: No
Category: Bidding
Human_Approval_Required: No
Primary Outcome: Campaign running on Maximize Conversions or Target CPA with correct configuration
SOP_ID: SOP_34
Secondary Outcomes: Learning period managed, stakeholders briefed, migration path documented
Status: Done
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through setting up a conversion-based bid strategy (Maximize Conversions or Target CPA) for a campaign optimizing for conversion volume.

> ❓ **The big question:** How do you configure Maximize Conversions or Target CPA correctly and manage the transition to stable performance?

---

### What this SOP is NOT

This SOP does **not:**

- Help you select which bid strategy to use (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Cover value-based strategies like Target ROAS or POAS (See: [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md))
- Calculate your CPA targets (See: [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))
- Explain how smart bidding works internally (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))

### When to run this SOP

Run this SOP when:

- You have selected Maximize Conversions or Target CPA as your bid strategy (from the selection decision tree)
- You are launching a new campaign with a conversion-volume objective
- You are migrating an existing campaign from Manual CPC or Maximize Clicks to a conversion-based strategy

---

### Before you start

#### Required inputs

- Bid strategy selected (Maximize Conversions or Target CPA) from the decision tree
- If Target CPA: your calculated CPA target from the targets calculator
- Primary conversion action confirmed and tracking correctly
- Campaign structure finalized (keywords, ad groups, ads in place)
- Daily budget set (at least 10x your target CPA for tCPA campaigns)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Confirming the correct strategy |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | CPA target calculations |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Learning period management |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Post-setup validation |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Configure strategy** | Set the bid strategy in Google Ads | Strategy active on campaign |
| **Phase 2️⃣: Set initial target** | Configure CPA target (if applicable) | Target CPA configured or Max Conv running without target |
| **Phase 3️⃣: Manage learning period** | Monitor without interfering | Stable performance after two conversion cycles |
| **Phase 4️⃣: Post-learning optimization** | Evaluate and adjust | Validated strategy with documented next steps |

---

## Phase 1️⃣: Configure strategy

### 1.1 Verify conversion action

Before changing the bid strategy, confirm:

1. Navigate to the campaign's settings
2. Under "Goals", confirm the primary conversion action is correct
3. If using campaign-specific goals: verify only the intended conversion action is selected as primary
4. If using account-level goals: verify the account default conversion action is correct

> ⚠️ **Wrong conversion action = wrong optimization:** If the campaign is optimizing for a micro-conversion (page view) instead of the macro-conversion (lead form submit), the strategy will optimize for the wrong outcome.

### 1.2 Set the bid strategy

**In Google Ads UI:**

1. Go to campaign settings
2. Click "Bidding"
3. Select "Maximize conversions"
4. If you want Target CPA: check "Set a target cost per action"
5. Save

**In Google Ads Editor:**

1. Select the campaign
2. In the editing panel, change "Bid strategy type" to "Maximize conversions"
3. If Target CPA: set the "Target CPA" field
4. Post changes

### 1.3 Verify campaign-specific goals (if applicable)

If you use campaign-specific goals instead of account-level defaults:

1. Campaign settings > Goals
2. Select "Use campaign-specific goal settings"
3. Choose only your intended primary conversion action
4. Deselect any conversion actions you do not want this campaign to optimize for

---

## Phase 2️⃣: Set initial target

### 2.1 Maximize Conversions (no target)

If you selected Maximize Conversions without a CPA target:

- No target configuration needed
- The algorithm will maximize conversion volume within your daily budget
- Budget acts as your only constraint

**When to start without a target:**

| Scenario | Start without target |
|----------|---------------------|
| New campaign, no historical CPA data | Yes, gather data first |
| Expecting high conversion volume quickly | Yes, let it ramp up |
| Easily hitting efficiency targets already | Yes, test if removing the guardrail increases volume |

### 2.2 Target CPA

If you selected Target CPA:

1. **Set initial target** at or slightly above the campaign's average CPA from the last 2-4 weeks
2. If no historical CPA exists (new campaign starting with tCPA): set the target at the calculated CPA from the Bid Targets Reference, or use the average CPA from similar campaigns in the account
3. Enter the target in the bid strategy settings

**Initial target rules:**

| Situation | Initial target |
|-----------|---------------|
| Existing campaign with CPA history | Average CPA from last 4 weeks (or slightly above) |
| New campaign, familiar query themes | Calculated target CPA from unit economics |
| Migrating from Max Conversions after data gathering | Average CPA achieved during Max Conversions phase |

> 💡 **Set the initial target conservatively:** Start at or slightly above where the campaign has been performing. Tighten gradually (10-15% per adjustment) once the algorithm stabilizes.

---

## Phase 3️⃣: Manage learning period

### 3.1 Set expectations

Before the strategy goes live, brief stakeholders:

- Performance will fluctuate for approximately two conversion cycles (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- CPAs may be above target during learning
- Conversion volume may be inconsistent
- No changes will be made during this period

### 3.2 Monitor without reacting

During the learning period (two conversion cycles):

| Do | Do not |
|----|--------|
| Check metrics daily for anomalies (tracking breaks, extreme cost spikes) | Adjust the CPA target |
| Verify conversion tracking is firing | Change budgets by more than 10% |
| Note any external factors (competitor changes, seasonality) | Add or remove keywords |
| Prepare your first optimization plan for post-learning | Panic if day-to-day CPAs are volatile |

### 3.3 Identify learning period end

The learning period has ended when:

- Daily performance stabilizes (less extreme day-to-day swings)
- Two conversion cycles have passed since the strategy change
- At least one full conversion cycle has elapsed

---

## Phase 4️⃣: Post-learning optimization

### 4.1 Evaluate results

After the learning period ends:

1. Pull performance data excluding the learning period (first two conversion cycles)
2. Also exclude the most recent [conversion delay] days (incomplete attribution)
3. Compare actual CPA to target CPA
4. Compare conversion volume to growth goals

### 4.2 First adjustments

| Result | Action |
|--------|--------|
| CPA near target, volume meets goals | No change needed, continue monitoring |
| CPA above target by more than 20% | Tighten target by 10-15%, wait one conversion cycle |
| CPA well below target | Consider loosening target to capture more volume |
| Volume below growth goals | Increase target by 10-15% or increase budget |
| Volume above goals, CPA within target | Opportunity to tighten target for more profit |

### 4.3 Ongoing management cadence

| Frequency | Action |
|-----------|--------|
| Weekly | Check CPA vs. target, conversion volume, IS lost (budget and rank) |
| Bi-weekly | Review search term report, check for CPC anomalies |
| Monthly | Run bid simulator analysis, compare to growth goals |
| Quarterly | Validate target against unit economics (recalculate if inputs changed) |

### 4.4 Run post-setup checklist

Run the [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) to confirm all configuration is correct.

---

### Validation & definition of done

This SOP is complete when:

- [ ] Bid strategy is set to Maximize Conversions or Target CPA
- [ ] Correct conversion action is selected as primary
- [ ] Initial CPA target is set (if using Target CPA) based on calculated or historical data
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
| When considering value-based bidding | Begin [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) |
| When scaling beyond current performance | Begin [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| CPA cannot meet target even after adjustments | [Bid Targets Reference](../references/Bid Targets Reference.md) to recalculate, then [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) |
| Volume insufficient at any target level | [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) troubleshooting table |
| Conversion tracking problems | [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) |

---

### FAQ

**Q: Should I start with Maximize Conversions and add a CPA target later, or start directly with Target CPA?**

A: If you have sufficient historical data (50+ conversions/month) and a calculated CPA target, start directly with Target CPA. If you are launching a new campaign and expect high volume, start with Maximize Conversions for 2-4 weeks to gather data, then add a CPA target based on the average CPA achieved.

**Q: What if my actual CPA is consistently above my target?**

A: First verify your target is realistic (compare to breakeven CPA and profit-to-acquisition ratio). If the target is realistic, check conversion volume (insufficient data causes volatility). If volume is adequate, the market may not support your target at sufficient scale. Consider increasing the target or improving upstream metrics (conversion rate, landing page).

**Q: Can I use Target CPA with fewer than 50 conversions per month?**

A: The minimum is 15 conversions per month. Below 50, expect more volatility and slower optimization. Consolidate campaigns or use a Portfolio Bid Strategy to pool data across campaigns to reach the 50+ threshold.

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Reference | Phase 1 (confirming strategy) |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Reference | Phase 2 (setting initial target) |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Phase 3 (learning period management) |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Checklist | Phase 4 (post-setup validation) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (determines which strategy to set up) |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (provides the CPA target) |
| [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) | Alternative (for value-based objectives) |
| [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) | Alternative (for campaigns currently on Manual CPC) |
| [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) | Conditional (if using portfolio strategy) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Downstream (once strategy is stable) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Setting target CPA far below historical average | Unrealistic expectations, insufficient unit economics analysis | Calculate target from breakeven and PAR first |
| Making changes during learning period | Impatience, stakeholder pressure | Brief stakeholders before launch, commit to hands-off period |
| Wrong conversion action selected | Account defaults include micro-conversions | Verify campaign-specific goals before activating strategy |
| Insufficient budget for target CPA | Budget below 10x target CPA | Set budget to at least 10x target CPA daily |
| Forgetting to exclude learning period in evaluation | Includes volatile data in performance analysis | Always filter out the learning period (two conversion cycles) when evaluating |

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
