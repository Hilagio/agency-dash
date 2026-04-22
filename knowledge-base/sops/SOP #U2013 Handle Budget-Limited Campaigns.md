# SOP – Handle Budget-Limited Campaigns
Created: 2026-02-14

SOP_ID: SOP_72
Status: Done
Category: Bidding
Primary Outcome: Budget-limited campaigns diagnosed and resolved via 5-step constrained budget approach
Agent_Executable: No
Human_Approval_Required: No
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through diagnosing and resolving "Limited by Budget" campaign status using the 5-step constrained budget approach and the low-budget escalation protocol.

> ❓ **The big question:** This campaign is budget-limited. Is that a problem worth solving, and what is the smartest way to solve it without just throwing more money at it?

---

### What this SOP is NOT

This SOP does **not:**

- Provide a budget allocation strategy across campaigns (See: [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md))
- Optimize bid strategy health or troubleshoot bid strategy issues (See: [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md))
- Cover scaling bids and budgets for growth (See: [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md))
- Explain the growth-efficiency tradeoff conceptually (See: [Campaign Scaling Mental Model](../mental-models/Campaign Scaling Mental Model.md))

### When to run this SOP

Run this SOP when:

- A campaign shows "Limited by Budget" status in Google Ads
- Impression Share Lost (Budget) exceeds 10% on a profitable campaign
- Weekly performance reviews reveal budget pacing is off (spending full budget before end of day)
- A campaign consistently hits its daily budget cap before peak hours

---

### Before you start

#### Required inputs

- Campaign performance data for the last 30 days (CPA/ROAS, conversions, cost)
- Impression Share metrics: IS Lost (Budget) and IS Lost (Rank)
- Current daily budget and monthly spend
- Breakeven CPA/ROAS/POAS from unit economics
- Access to search term reports and keyword performance data

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Daily spending mechanics, overspend rules |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Growth-efficiency slider, PAR zones |
| [Campaign Scaling Mental Model](../mental-models/Campaign Scaling Mental Model.md) | Scaling decision framework |
| [Volume vs efficiency (more/better/new)](<../theory/Volume vs efficiency (more better new).md>) | Volume-efficiency tradeoff logic |

---

### Decision gate: Profitable or unprofitable?

Before executing any fix, determine whether this budget limitation is a good problem or a bad one:

```
Is the budget-limited campaign profitable (CPA at/below target, ROAS at/above target)?
|
+-- YES (profitable + budget-limited)
|   |
|   +-- Can budget be raised? (no monthly cap, flexible budget)
|   |   |
|   |   +-- YES --> Raise the budget. Go to Phase 1️⃣ to document
|   |   |           baseline, then increase budget directly.
|   |   |
|   |   +-- NO --> Budget is fixed. Run the 5-step constrained
|   |               budget approach (Phase 2️⃣) to optimize within limits.
|   |
+-- NO (unprofitable + budget-limited)
    |
    +-- Fix efficiency FIRST before adding budget.
        Route to: keyword performance analysis, Quality Score
        improvement, landing page optimization.
        Adding budget to an unprofitable campaign just burns
        money faster.
```

> ⚠️ **An unprofitable, budget-limited campaign does not need more budget:** Increasing spend on a losing campaign accelerates losses. Fix the underlying efficiency problem first, then revisit budget constraints.

> 💡 **If targets are being hit and budget is flexible, raise the budget.** Do not overcomplicate this. A profitable campaign that is leaving impressions on the table deserves more budget immediately. The constrained approach below is for situations where budget cannot be increased.

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Diagnose the constraint** | Determine what is actually limiting the campaign | Constraint type identified, baseline metrics documented |
| **Phase 2️⃣: 5-step constrained budget approach** | Resolve budget limitation without increasing spend | Waste eliminated, budget reallocated, targets adjusted |
| **Phase 3️⃣: Low-budget escalation** | Handle campaigns with very low budgets and few conversions | Targeting narrowed to highest-probability conversions |
| **Phase 4️⃣: Validate** | Confirm the fix worked and performance improved | IS Lost (Budget) reduced, efficiency maintained |

---

## Phase 1️⃣: Diagnose the constraint

### 1.1 Document baseline metrics

Record current performance for the budget-limited campaign (last 30 days):

| Metric | Current value |
|--------|--------------|
| Daily budget | |
| IS Lost (Budget) % | |
| IS Lost (Rank) % | |
| CPA or ROAS (actual vs. target) | |
| Conversions | |
| Recommended daily budget (Google Ads) | |

### 1.2 Identify the constraint type

| If... | Then the constraint is... | Action |
|-------|--------------------------|--------|
| IS Lost (Budget) is high, IS Lost (Rank) is low | Pure budget constraint | This SOP resolves it |
| IS Lost (Budget) is high AND IS Lost (Rank) is high | Budget + competitiveness issue | If targets are being hit, raise budget first. If unprofitable, fix rank issues (bids, Quality Score) before increasing budget |
| IS Lost (Budget) is low but campaign status shows "Limited by Budget" | Intermittent budget cap (hitting cap on high-volume days) | Review daily pacing patterns, consider a small budget increase |

---

## Phase 2️⃣: 5-step constrained budget approach

Work through these five steps in order. Each step frees budget or improves efficiency before considering a budget increase.

### 2.1 Step 1️⃣: Focus on high-intent, bottom-of-funnel areas

Concentrate existing budget where conversion probability is highest. Review keyword, ad group, and campaign performance data to identify where budget is best spent.

### 2.2 Step 2️⃣: Reduce waste

Eliminate spend that is not driving conversions. Run the search term and N-gram workflows to identify and exclude waste:

- [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) for irrelevant term identification
- [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) for performance-based negative keyword identification

### 2.3 Step 3️⃣: Reallocate from weak performers

Find budget by taking it from campaigns that are not earning it:

1. Pull a campaign-level performance report sorted by CPA (or inverse ROAS)
2. Identify campaigns with CPA above breakeven or ROAS below breakeven for 30+ days
3. Reduce budgets on those weak performers by 20-30%
4. Shift that budget to the budget-limited campaign

> ⚠️ **Do not cannibalize Tier 1 campaigns:** Only reallocate from genuinely underperforming campaigns. Taking budget from a profitable campaign to fund another creates a new problem.

### 2.4 Step 4️⃣: Adjust targets incrementally

If Steps 1-3 do not free enough budget, make the algorithm more selective:

1. For tCPA campaigns: reduce target CPA by 5-10% (forces the algorithm to bid on more efficient auctions only)
2. For tROAS campaigns: increase target ROAS by 5-10% (same effect)
3. Wait 1-2 conversion cycles for each adjustment to stabilize
4. Evaluate: did efficiency improve enough to offset the volume loss?

> ⚠️ **Do not make dramatic target changes (>20% at once):** Large jumps trigger extended learning periods and destabilize performance. Make 5-10% adjustments and wait for data.

### 2.5 Step 5️⃣: Protect best performers

Ensure your highest-performing campaign is not the one being starved:

1. Rank all campaigns by your primary goal metric (conversions, revenue, or profit depending on what is tracked)
2. If the budget-limited campaign is your #1 performer: it gets budget priority over everything else, increase immediately
3. If it is mid-tier: apply Steps 1-4 first, only increase budget if those steps are insufficient
4. If multiple campaigns are budget-limited: prioritize the one with the best efficiency metrics

---

## Phase 3️⃣: Low-budget escalation

If the campaign has very low budget and Steps 1-5 are insufficient, apply the low-budget escalation protocol.

### 3.1 Identify areas to narrow

1. Identify which keywords can be paused (low-intent, non-converting match types)
2. Identify top-performing ad groups and consider narrowing to those only
3. Identify top-performing geographic areas and consider narrowing location targeting
4. Review the landing page report and identify ad groups sending traffic to underperforming pages

### 3.2 Decide: persist or restructure

After 30 days of low-budget escalation, use behavior metrics (micro conversions, bounce rate, time on site) as proxy signals when conversion data is too thin:

| If... | Then... |
|-------|---------|
| Exact match keywords are converting | Gradually reintroduce phrase match, expand location |
| Behavior signals are strong but conversions are low | Conversion tracking issue or long sales cycle: investigate |
| No conversions and poor behavior signals | Campaign targeting is fundamentally wrong: restructure or pause |
| Budget is simply too small for the vertical | Consider restructuring or consolidating campaigns |

---

## Phase 4️⃣: Validate

Monitor for 2 weeks after completing any changes from Phases 2-3. Compare against Phase 1 baseline.

| Result | Next step |
|--------|-----------|
| IS Lost (Budget) below 10% AND efficiency maintained | Success. Document new baseline, resume normal monitoring |
| IS Lost (Budget) reduced AND efficiency improved | Strong success. Consider scaling via [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |
| IS Lost (Budget) reduced BUT volume dropped significantly | Over-tightened. Ease Phase 2 restrictions (reintroduce paused keywords, broaden targeting) |
| IS Lost (Budget) unchanged | Steps did not free enough budget. Budget increase is now justified: request additional spend from stakeholder |

---

### Validation & definition of done

This SOP is complete when:

- [ ] Budget-limited campaign diagnosed (constraint type identified)
- [ ] Decision gate passed (profitable vs. unprofitable determined)
- [ ] 5-step constrained budget approach executed (all applicable steps completed)
- [ ] Low-budget escalation applied (if campaign has very low budget)
- [ ] Changes monitored for 2 weeks
- [ ] IS Lost (Budget) reduced below 10% or justified budget increase requested

---

### Exit → entry bridge

Once budget limitation is resolved:

| Timeframe | Action |
|-----------|--------|
| Weekly | Check IS Lost (Budget) during performance reviews to catch recurrence early |
| Monthly | Re-evaluate campaign tier allocation, confirm budget is still sufficient |
| When scaling | Begin [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) if the campaign is ready for growth |
| Quarterly | Full budget recalculation via [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Budget limitation returns after fix | Re-run this SOP from Phase 1 |
| Campaign becomes unprofitable after changes | [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) for troubleshooting |
| Need to scale beyond current budget | [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |
| Budget reallocation needed across full account | [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) |

---

### FAQ

**Q: Should I just increase the budget instead of running through all five steps?**

A: If your campaign is profitable and budget is flexible, yes: raise the budget. The 5-step constrained approach is specifically for situations where budget cannot be increased (monthly cap, fixed client budget, etc.).

**Q: What IS Lost (Budget) threshold should trigger this SOP?**

A: 10% on a profitable campaign is the trigger. Below 10% is normal. Above 20% means significant volume is being left on the table and this SOP should be prioritized.

**Q: The campaign is budget-limited but unprofitable. What do I do?**

A: Do not add budget. Route to the efficiency improvement track first: search term waste, Quality Score, landing page conversion rates. Only revisit budget limitations after the campaign is profitable.

---

### Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Reference | Phase 1 (pacing mechanics) |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Mental Model | Decision gate (PAR zones) |
| [Campaign Scaling Mental Model](../mental-models/Campaign Scaling Mental Model.md) | Mental Model | Phase 5 (scaling decision) |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Checklist | Exit bridge (troubleshooting) |
| [Volume vs efficiency (more/better/new)](<../theory/Volume vs efficiency (more better new).md>) | Theory | Decision gate (tradeoff logic) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Upstream (provides initial budget allocation this SOP adjusts) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Downstream (scaling after budget limitation is resolved) |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Used in Phase 2, Step 2 (waste identification) |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Used in Phase 2, Step 2 (performance-based negative keyword identification) |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Related (target adjustments reference breakeven calculations) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Increasing budget on unprofitable campaigns | Skipping the decision gate, assuming budget-limited always means "needs more budget" | Always check profitability first: unprofitable campaigns need efficiency fixes, not more money |
| Pausing too many keywords at once | Over-aggressive waste reduction in Phase 2 | Pause in batches, monitor for 1 week between rounds |
| Making large target adjustments (>20%) | Impatience with incremental approach | Stick to 5-10% adjustments, wait 1-2 conversion cycles between changes |
| Not monitoring after changes | Assuming the fix worked without validation | Always run the 2-week monitoring period in Phase 4 |
| Cannibalizing top performers | Reallocating budget from Tier 1 campaigns to fund the fix | Only reallocate from underperforming campaigns with CPA above breakeven or ROAS below breakeven |

---

### Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
