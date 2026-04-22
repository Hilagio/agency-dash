# SOP – Monitor and Maintain Bid Strategy Health
Created: 2026-02-14
Updated: 2026-04-02

SOP_ID: SOP_91
Status: Done
Category: Bidding
Primary Outcome: Bid strategy health verified, targets adjusted where needed, migration triggers identified and acted on
Agent_Executable: No
Human_Approval_Required: No
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through a recurring health check of all active bid strategies in your account: verifying learning status, confirming conversion volume sufficiency, diagnosing underperformance, adjusting targets gradually, identifying migration triggers, and reviewing portfolio strategy configuration.

> ❓ **The big question:** Are your bid strategies healthy, hitting their targets, and running on enough data, or are they silently degrading?

Bid strategies are not set-and-forget. Conversion volume shifts, targets drift away from breakeven, learning periods get accidentally triggered, and CPC caps silently restrict performance. This SOP catches those problems before they compound.

---

### What this SOP is NOT

This SOP does **not:**

- Help you select an initial bid strategy (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Walk you through scaling bids and budgets toward a profit optimum (See: [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md))
- Calculate breakeven CPA/ROAS/POAS from scratch (See: [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))
- Set up a new bid strategy from zero (See: [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md))

### When to run this SOP

| Trigger | Frequency |
|---------|-----------|
| Scheduled account maintenance | Bi-weekly or monthly |
| Performance decline detected | Immediately |
| After major campaign changes (budget, targeting, conversion actions) | Within 48 hours of change |
| After onboarding a new account | First week |
| Seasonal transition (pre-peak, post-peak) | At each transition |
| After a learning period completes | Within 3 days of completion |

---

### Before you start

#### Required inputs

- Access to Google Ads account with campaign management permissions
- Bid strategy report for all active strategies (campaign-level and portfolio-level)
- Last 30 days of conversion data (exclude conversion delay window)
- Current targets (CPA, ROAS, or POAS) for each bid strategy
- Breakeven CPA/ROAS/POAS from unit economics
- Impression share data (lost to rank, lost to budget)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Validation gates after each phase |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Learning period triggers, signal mechanics, conversion delay |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | PAR zones, growth-efficiency slider for target adjustments |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Portfolio strategy config, CPC cap rules, bid adjustment cleanup |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum conversion volumes per strategy |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Budget sufficiency checks |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Check learning status** | Identify strategies in learning or learning (limited) and prevent disruptive changes | Learning status log, hold/proceed flags per strategy |
| **Phase 2️⃣: Verify conversion volume sufficiency** | Confirm each strategy has enough data to optimize | Volume assessment per strategy, consolidation actions if needed |
| **Phase 3️⃣: Evaluate target performance** | Determine whether each strategy is hitting its targets and diagnose root causes if not | Performance scorecard, diagnostic findings |
| **Phase 4️⃣: Adjust targets** | Apply gradual target corrections where needed | Updated targets with monitoring schedule |
| **Phase 5️⃣: Assess migration readiness** | Identify strategies ready to move up the bidding ladder | Migration action plan |
| **Phase 6️⃣: Portfolio strategy review** | Verify portfolio configuration, CPC caps, campaign grouping | Portfolio health report |

---

## Phase 1️⃣: Check learning status

### 1.1 Pull learning status for all strategies

Open each active bid strategy and record its status:

1. Navigate to the campaign view or Tools > Budgets and Bidding > Bid Strategies
2. Check the "Bid strategy type" column for each campaign
3. Click the bid strategy name to view the strategy report
4. Note the status indicator

Record in this table:

| Campaign / Portfolio | Bid strategy | Status | Days in current status | Last change made |
|---------------------|-------------|--------|----------------------|-----------------|
| | | | | |

### 1.2 Interpret learning status

| Status | Meaning | Action |
|--------|---------|--------|
| **Eligible** | Strategy is fully operational, past learning | Proceed to Phase 2️⃣ |
| **Learning** | Algorithm is calibrating after a recent change | Do not make any changes. Wait for the learning period to complete (two conversion cycles). (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md)) |
| **Learning (limited)** | Algorithm cannot exit learning due to insufficient data | Diagnose the cause (see 1.3). Do not make target changes. |
| **Limited by budget** | Budget is restricting the strategy | Note for Phase 3️⃣ evaluation |
| **Misconfigured** | Setup issue preventing operation | Fix configuration immediately (wrong conversion action, conflicting settings) |

> ⚠️ **Never make changes to a strategy in "Learning" status:** Any change during learning resets the learning clock and extends the volatility period. The only exception is fixing a genuine misconfiguration.

### 1.3 Diagnose "Learning (limited)"

If any strategy shows "Learning (limited)", check these causes in order and stop at the first match:

| Check (in order) | If YES |
|-------------------|--------|
| Insufficient conversion volume? | Move to Phase 2️⃣ |
| Budget too low for enough auctions? | Increase budget or consolidate into portfolio |
| Conversion tracking issue? | Fix tracking first (not a bidding problem) |
| Target too aggressive? | Flag for Phase 4️⃣ (target loosening) |

> ↪️ **See [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md)** for detailed learning period diagnostics.

### 1.4 Set hold flags

For every strategy currently in "Learning" or "Learning (limited)":

- Mark with a **HOLD** flag: no target, budget, or structural changes until learning completes
- Record the expected learning completion date (last change date + 14 days)
- Brief stakeholders: performance during learning is not representative

---

## Phase 2️⃣: Verify conversion volume sufficiency

### 2.1 Pull conversion data

For each bid strategy (campaign-level or portfolio-level), pull conversion data for a window of 30 days + your conversion delay. For example, if your conversion delay is 7 days, pull the last 37 days and exclude the most recent 7 days from analysis to avoid undercounting.

| Campaign / Portfolio | Bid strategy | Conversions (30d) | Conv. with value (30d) | Threshold required | Sufficient? |
|---------------------|-------------|-------------------|----------------------|-------------------|-------------|
| | | | | | |

### 2.2 Apply thresholds

Use the thresholds from the [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md):

| Strategy | Minimum (absolute) | Functional minimum | Recommended |
|----------|--------------------|--------------------|-------------|
| Maximize Conversions | 15/month | 30/month | 50+/month |
| Target CPA | 15/month | 30/month | 50+/month |
| Maximize Conversion Value | 15/month | 50/month | 50+/month |
| Target ROAS | 30/month | 50/month | 50+/month |

For **portfolio bid strategies**, apply the threshold to the combined total of all linked campaigns.

### 2.3 Resolve volume gaps

If any strategy falls below its functional minimum, apply these tactics in priority order:

1. **Check conversion tracking:** Are conversions firing correctly? Any gaps, tag issues, or attribution changes? Fix tracking before changing strategy.
2. **Consolidate into a portfolio bid strategy:** Bundle 2-3 campaigns with the same efficiency target under one portfolio. Their combined conversion volume counts toward the threshold.
3. **Remove the efficiency target temporarily:** Switch from Target CPA to Maximize Conversions (no target), or from Target ROAS to Maximize Conversion Value (no target). Let the algorithm gather data without a constraint.
4. **Consider a micro-conversion:** If macro-conversions are too scarce, temporarily optimize for a higher-volume event (add-to-cart, lead form start) while building data.
5. **Increase budget:** If the campaign has impressions and clicks but not enough conversions, the budget may be too low to reach the threshold. Increase in 20% increments.

> 💡 **Portfolio bid strategies are the lowest-risk consolidation tactic:** You keep separate campaign budgets and targeting while pooling conversion data for the bidding algorithm. Five campaigns with 12 conversions each become one portfolio with 60 combined.

### 2.4 Separate assessment: Shopping/revenue accounts vs. lead/conversion accounts

The volume assessment differs by account type:

| Account type | Key metric | Threshold nuance |
|-------------|-----------|-----------------|
| **Ecommerce / Revenue** | Conversions with value (30d) | tROAS requires 50+ conversions/month with varied values. If all values are identical (e.g., one product), tROAS offers no advantage over tCPA. |
| **Lead Gen / SaaS** | Conversions (30d) | If using offline conversion import, the threshold applies to the imported action, not the form submission. Account for the import lag (often 7-30 days). |

---

## Phase 3️⃣: Evaluate target performance

### 3.1 Build the performance scorecard

For each strategy that passed Phase 1️⃣ (not in learning) and Phase 2️⃣ (sufficient volume), record:

| Campaign / Portfolio | Target | Actual (30d) | Variance | Budget spent (%) | IS lost rank | IS lost budget |
|---------------------|--------|-------------|----------|------------------|-------------|---------------|
| | | | | | | |

**Variance** = (Actual - Target) / Target. For CPA, negative variance means actual CPA is higher (worse) than target. For ROAS/POAS, negative variance means actual is lower (worse) than target.

### 3.2 Classify each strategy

| Variance range | Classification | Action |
|---------------|---------------|--------|
| Within +/- 10% of target | **Healthy** | No action needed. Continue monitoring. |
| 10-25% worse than target | **Underperforming** | Run diagnostic (3️⃣.3) |
| 25%+ worse than target | **Failing** | Run diagnostic (3️⃣.3), escalate priority |
| 10-25% better than target | **Over-efficient** | Check if volume is being sacrificed. Possible starvation zone. |
| 25%+ better than target | **Starving** | Strategy is likely too aggressive. Flag for Phase 4️⃣ loosening. |

### 3.3 Diagnose underperforming strategies

When a strategy is underperforming or failing, walk through this diagnostic in order. Stop at the first root cause you identify:

| Step | Check | If YES |
|------|-------|--------|
| 1 | Campaign structure change disrupted learning? | Wait for learning to complete |
| 2 | Irrelevant queries eating budget? New competitors? | Add negatives, tighten match types, review auction insights |
| 3 | Market shrinking (seasonal decline, trend change)? | Adjust expectations, review if target makes sense at lower volume |
| 4 | Negatives blocking valuable queries? | Remove or modify overly broad negatives |
| 5 | Evaluation window shorter than conversion cycle? | Extend window, exclude last [conversion delay] days |
| 6 | Seasonality or external factor (holidays, competitor promos)? | Use seasonality adjustments for short-term events |
| 7 | Conversion rate dropped (LP or offer issue)? | Fix the landing page or offer (not a bidding problem) |

If none of the above apply, the target may be unsustainable. Flag for Phase 4️⃣ adjustment.

> ↪️ **See [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md)** for the full diagnostic with detailed checks per step.

### 3.4 Budget-limited strategies

If a strategy shows 100% budget spend and high IS lost to budget:

| IS lost to budget | Interpretation | Action |
|-------------------|---------------|--------|
| 0-10% | Normal, minor budget pressure | No action |
| 10-25% | Moderate limitation, leaving volume on the table | Consider budget increase if growth is a priority |
| 25%+ | Severe limitation, significant lost volume | Increase budget (see Phase 4️⃣) or set targets just below recent performance to recapture volume within current budget |

**Recapturing volume within budget constraints:** If you cannot increase budget, set the target less aggressive than recent actual performance. For CPA, set the target 5-10% above recent actual CPA. For ROAS, set the target 5-10% below recent actual ROAS. This gives the algorithm more auction flexibility to participate in additional auctions without increasing budget.

---

## Phase 4️⃣: Adjust targets

### 4.1 Determine which strategies need adjustment

From Phase 3️⃣ findings, identify strategies that require target changes:

| Campaign / Portfolio | Current target | Issue | Direction | Proposed new target |
|---------------------|---------------|-------|-----------|-------------------|
| | | | | |

### 4.2 Apply the gradual adjustment protocol

All target changes follow the same incremental approach:

| Adjustment type | Maximum single increment | Wait period between adjustments |
|----------------|------------------------|-------------------------------|
| CPA target increase (loosening) | 15-20% | 1-2 days monitoring, then one conversion cycle |
| CPA target decrease (tightening) | 10-15% | 1-2 days monitoring, then one conversion cycle |
| ROAS target decrease (loosening) | 15-20% | 1-2 days monitoring, then one conversion cycle |
| ROAS target increase (tightening) | 10-15% | 1-2 days monitoring, then one conversion cycle |
| POAS target: same rules as ROAS | | |

> ⚠️ **Changes larger than 20% trigger a new learning period:** If your target needs a correction greater than 20%, break it into two or more increments spaced one conversion cycle apart.

### 4.3 Execution steps for target adjustments

1. **Record the current target and actual performance** in your tracking sheet
2. **Calculate the new target** using the increment limits above
3. **Make the change** in Google Ads (campaign-level or portfolio-level)
4. **Monitor for 1-2 days** for any immediate anomalies (spend spike, volume crash)
5. **Wait one full conversion cycle** before evaluating the adjustment
6. **Evaluate:** compare actual performance to the new target over a clean window (excluding conversion delay)
7. **If the target is not yet where it needs to be:** make another incremental adjustment and repeat

### 4.4 Target adjustments for budget-limited campaigns

When a strategy is budget-limited and you cannot increase the budget:

1. Find the campaign's actual CPA/ROAS/POAS over the last 14-30 days
2. Set the target 5-10% worse than actual performance (higher CPA or lower ROAS)
3. This gives Smart Bidding more flexibility to participate in additional auctions
4. Monitor spend rate and volume: you should see IS lost to budget decrease

> 💡 **A less aggressive target can improve both volume and efficiency within a limited budget:** When budget is the constraint, a tighter target forces the algorithm to bid higher on fewer auctions. A slightly looser target lets the algorithm spread budget across more auctions at lower CPCs, resulting in more clicks and conversions within the same spend.

### 4.5 Document all adjustments

Record every target change with date, old value, new value, and the reason. This creates an audit trail for future reviews and prevents duplicate adjustments.

| Date | Campaign / Portfolio | Old target | New target | Reason | Next review |
|------|---------------------|-----------|-----------|--------|-------------|
| | | | | | |

---

## Phase 5️⃣: Assess migration readiness

### 5.1 Identify migration opportunities

Review each bid strategy against the migration ladder:

```
Manual CPC / Max Clicks
        |
        v  (when: ~30 conversions accumulated, stable)
Max Conversions (no target)
        |
        v  (when: 30+ conversions/month, consistent CPA)
Target CPA
        |
        v  (when: conversion values are reliable
        |   and varied across transactions)
Target ROAS
        |
        v  (when: profit tracking is implemented
        |   and margin data is accurate)
Target POAS (profit-based bidding)
```

### 5.2 Migration triggers

| Current strategy | Migrate to | Trigger conditions | All must be true |
|-----------------|-----------|-------------------|-----------------|
| Manual CPC | Maximize Clicks | Want to automate bid management, traffic goal | Account has negative keywords in place, targeting is well-defined |
| Maximize Clicks | Max Conversions (no target) | Conversion tracking is working, ~30 conversions accumulated | Conversion actions are correctly configured, no tracking gaps |
| Max Conversions (no target) | Target CPA | 30+ conversions/month for 2+ consecutive months, CPA is stable | Breakeven CPA is calculated, target falls between breakeven and starvation |
| Manual CPC | Target CPA | 30+ conversions/month already (from other campaigns on same queries), account has history | Smart Bidding has query-level data, breakeven CPA is known |
| Max Conv Value (no target) | Target ROAS | 50+ conversions/month with value, ROAS is stable for 2+ months | Conversion values are accurate, breakeven ROAS is calculated |
| Target CPA | Target ROAS | Conversion values are reliable and varied across transactions | Not all conversions have the same value, value data is in the conversion tag |
| Target ROAS | Target POAS | Profit tracking is implemented (cart data or margin data in feed) | Gross profit or contribution margin is sent as the conversion value, 60+ days of POAS data observed |

### 5.3 Shopping vs. lead gen migration differences

| Account type | Migration nuance |
|-------------|-----------------|
| **Ecommerce / Shopping** | tCPA to tROAS is the natural progression. tROAS to tPOAS requires profit data in the conversion signal. Product margin variance makes value-based strategies especially powerful for ecommerce. |
| **Lead Gen / SaaS** | tCPA is often the final destination unless offline conversion values vary by lead quality. Move to tROAS only if you import deal values or use lead scoring with varied conversion values. POAS is relevant only if you can import actual revenue/profit per lead. |

### 5.4 Migration execution

When a strategy is ready for migration:

1. **Do not switch overnight:** Use a campaign experiment (50/50 split) for 30+ days.
2. Set the new strategy's target conservatively: slightly looser than current performance.
3. Exclude the learning period (two conversion cycles) from evaluation.
4. Compare net profit or conversion volume (depending on strategy type) as the primary metric.
5. If the experiment wins: apply the experiment. If the original wins: end the experiment and keep the current strategy.

> ↪️ **For full migration steps:** See [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) for the detailed migration process.

---

## Phase 6️⃣: Portfolio strategy review

### 6.1 Verify campaign grouping

For each portfolio bid strategy, confirm:

| Check | Pass criteria |
|-------|-------------|
| Same campaign type | All linked campaigns are the same type (Search with Search, Shopping with Shopping) |
| Same efficiency target | All linked campaigns share one CPA or ROAS goal |
| No stale campaigns | No paused or ended campaigns still linked to the portfolio |
| Volume contribution | No single campaign is providing <5% of the portfolio's conversions (dead weight) |

If any campaign does not belong, remove it from the portfolio and assign it a campaign-level strategy or move it to a different portfolio.

### 6.2 Check CPC caps

CPC caps are the most common portfolio misconfiguration. For each portfolio:

| Check | Expected state | If violated |
|-------|---------------|-------------|
| Maximum CPC cap | OFF (default) | Remove unless explicitly justified |
| If max CPC is ON: cap level | At least 3x the average CPC of top 10-20 converting search terms | Increase the cap or remove it |
| Top keyword CPCs | Not plateauing at the cap level | Cap is restricting: increase or remove |
| IS lost to rank | Not increasing since cap was set | Cap may be preventing competitive bidding |
| Minimum CPC cap | OFF (no valid use case in standard accounts) | Remove immediately |

> ⚠️ **Forgotten CPC caps are silent performance killers:** A cap set 6 months ago at a competitive CPC level may now be far below market rates. Review all caps during every health check.

### 6.3 Budget review for portfolio strategies

| Check | What to verify |
|-------|---------------|
| Shared budget allocation | No single campaign is consuming >60% of the shared budget disproportionately |
| Budget sufficiency | Daily budget is at least 10x the target CPA (for CPA strategies) |
| Budget vs. IS | IS lost to budget is tracked and actionable |

### 6.4 Bid adjustment cleanup

Confirm that no non-exclusion bid adjustments are set on Smart Bidding campaigns:

| Adjustment type | Expected state on Smart Bidding campaigns |
|----------------|------------------------------------------|
| Device (non-exclusion) | 0% or removed |
| Device (-100% exclusion) | Allowed (only type that works) |
| Location | 0% or removed |
| Ad schedule | 0% or removed |
| Audiences | 0% or removed |
| Demographics | 0% or removed |

Non-exclusion bid adjustments on Smart Bidding campaigns are ignored by the algorithm. They create false confidence and clutter the account.

---

### Validation & definition of done

This SOP is complete when:

- [ ] All active bid strategies have been checked for learning status
- [ ] No changes are pending on strategies currently in learning
- [ ] Conversion volume sufficiency is verified for every strategy
- [ ] Underperforming strategies have been diagnosed with root causes identified
- [ ] Target adjustments have been made using the gradual protocol (max 15-20% per increment)
- [ ] Migration opportunities have been assessed against trigger conditions
- [ ] Portfolio strategies have been reviewed for campaign grouping, CPC caps, and bid adjustments
- [ ] All findings and changes are documented in the tracking sheet
- [ ] Next review date is scheduled

---

### Exit → entry bridge

Once the health check is complete:

| Timeframe | Action |
|-----------|--------|
| 1-2 days after target adjustments | Spot-check spend rate and volume for anomalies |
| One conversion cycle after adjustments | Evaluate adjusted strategies against new targets |
| 2 weeks | Run this SOP again if major adjustments were made |
| Monthly (routine) | Schedule next full health check |
| When unit economics change | Recalculate breakeven via [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Strategy needs to scale beyond current targets | [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |
| Strategy needs to migrate to a different type | [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) |
| Portfolio needs to be created or reconfigured | [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) |
| Conversion tracking is broken or inaccurate | Fix tracking first (not a bidding problem) |
| Unit economics have changed | [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) |
| Budget allocation needs rethinking | [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) |

---

### FAQ

**Q: How often should I run this health check?**

A: Monthly for stable accounts. Bi-weekly for accounts with recent changes, high spend, or volatile performance. After any major change (strategy switch, budget change >30%, targeting overhaul), run it within 48 hours.

**Q: What if a strategy is underperforming but still in learning?**

A: Do not adjust targets during learning. The algorithm is calibrating and performance will be volatile. Wait for learning to complete (two conversion cycles), then evaluate. The only exception is fixing a genuine misconfiguration (wrong conversion action, missing tracking).

**Q: Should I adjust targets for seasonal changes proactively?**

A: Yes. Before a known peak season (Black Friday, holidays), loosen targets 5-10% to give the algorithm more auction flexibility. After peak season, tighten back. Use Google Ads seasonality adjustments for short-term events (3-7 days) where you expect a temporary conversion rate change.

**Q: When should I use seasonality adjustments vs. target changes?**

A: Seasonality adjustments tell Smart Bidding to expect a temporary conversion rate change (e.g., a flash sale). Use them for events lasting 1-7 days. For longer-term shifts (seasonal demand changes over weeks), adjust targets directly using the gradual protocol.

---

### Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Checklist | All phases (validation gates) |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Phase 1️⃣ (learning periods), Phase 3️⃣ (conversion delay) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference | Phase 2️⃣ (volume thresholds) |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Guideline | Phase 6️⃣ (portfolio config, CPC caps) |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Mental Model | Phase 4️⃣ (PAR zones, scaling direction) |
| [Profit-first optimization](../theory/Profit-first optimization.md) | Theory | Phase 5️⃣ (ROAS to POAS migration) |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Reference | Phase 3️⃣ (budget-limited strategies) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Downstream (when health check reveals scaling opportunities) |
| [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) | Downstream (when migration triggers are met) |
| [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) | Downstream (when volume consolidation is needed) |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (provides breakeven and target calculations) |
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (determines initial strategy before monitoring begins) |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Related (setup SOP that this health check maintains) |
| [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) | Related (setup SOP that this health check maintains) |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Related (budget allocation when budget constraints are identified) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Making changes during learning period | Impatience, pressure from stakeholders to "fix" volatile performance | Brief stakeholders before changes, mark HOLD flags, wait for two conversion cycles |
| Ignoring conversion delay in evaluations | Evaluating the last 7 days when your conversion cycle is 14 days | Always exclude the last [conversion delay] days from analysis |
| Large target jumps (>25%) | Trying to fix underperformance in one move | Use 10-15% increments, space one conversion cycle apart |
| Forgotten CPC caps | Cap was set months ago and never reviewed | Check all portfolio CPC caps during every health check |
| Not separating Shopping vs. Lead Gen assessment | Applying the same thresholds and logic to fundamentally different account types | Use the account type tables in Phase 2️⃣ and Phase 5️⃣ |
| Treating volume decline as a bidding problem | Root cause is seasonal demand drop, competitor entry, or landing page issue | Run the Phase 3️⃣ diagnostic fully before adjusting targets |
| Skipping portfolio review | Assuming portfolio configuration does not drift | Review campaign grouping, CPC caps, and bid adjustments every cycle |

---

### Version details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
