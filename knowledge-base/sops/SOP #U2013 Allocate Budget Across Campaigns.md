# SOP – Allocate Budget Across Campaigns
Created: 2026-02-04

Agent_Executable: No
Category: Budgets
Human_Approval_Required: No
Primary Outcome: Budget distributed across campaigns with validated daily budgets aligned to growth goals
SOP_ID: SOP_38
Secondary Outcomes: Minimum viable budget calculated, budget feasibility validated, allocation tiers documented
Status: Done
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through the four-step budget framework: start with goals, calculate your minimum viable budget, validate feasibility, and allocate daily budgets across campaigns.

> ❓ **The big question:** How do you determine the right budget for your Google Ads account and distribute it across campaigns to hit your growth goals?

---

### What this SOP is NOT

This SOP does **not:**

- Help you select a bid strategy (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Set or adjust CPA/ROAS/POAS targets (See: [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))
- Explain budget pacing mechanics (See: [Budget Pacing Reference](../references/Budget Pacing Reference.md))
- Cover scaling beyond your current budget (See: [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md))

### When to run this SOP

Run this SOP when:

- You are launching a new account or set of campaigns and need to determine budgets
- Your Google Ads goals have changed and budgets need recalculation
- A quarterly or annual budget planning cycle requires updated allocations
- You are onboarding a new client and need to set initial budgets

---

### Before you start

#### Required inputs

- Google Ads goals defined (growth goal + efficiency goal)
- Unit economics calculated (breakeven CPA, ROAS, or POAS)
- Bid targets set or planned (target CPA, ROAS, or POAS)
- Campaign structure finalized (campaigns, types, targeting)
- Access to Google Ads Keyword Planner, Performance Planner, and Auction Insights

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Framework overview |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Daily spending limits, shared vs. individual budgets |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Efficiency targets for calculations |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Performance Planner validation |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Breakeven calculations |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Start with goals** | Identify growth and efficiency targets | Growth target and efficiency guardrail documented |
| **Phase 2️⃣: Calculate minimum viable budget** | Determine baseline spend needed | Monthly MVB calculated |
| **Phase 3️⃣: Validate budget feasibility** | Confirm budget can be spent and supported | Three validation checks passed |
| **Phase 4️⃣: Allocate daily budgets** | Distribute across campaigns | Daily budgets set per campaign |

---

## Phase 1️⃣: Start with goals

### 1.1 Identify your growth goal

Your growth goal determines your budget. Document:

| Field | Value |
|-------|-------|
| Growth goal (specific target) | |
| Growth goal type (volume, revenue, profit) | |
| Primary or secondary goal? | |
| Timeframe | |

**Examples of growth goals:**

| Vertical | Growth goal example |
|----------|-------------------|
| Lead gen | Generate 100 qualified leads per month |
| Ecommerce | Achieve 100,000 EUR revenue per month |
| SaaS | Acquire 50 new customers per month |

### 1.2 Identify your efficiency goal

Your efficiency goal acts as the guardrail. Document:

| Field | Value |
|-------|-------|
| Efficiency goal (specific target) | |
| Efficiency metric (CPA, ROAS, POAS, CAC) | |
| Primary or secondary goal? | |
| Breakeven level for this metric | |

> ⚠️ **You need both a growth goal and an efficiency goal:** Without a growth goal, efficiency-focused budgets risk the starvation zone. Without an efficiency goal, growth-focused budgets risk breakeven or loss.

### 1.3 Confirm goal balance

Check that your goals are balanced:

- [ ] Growth goal has a specific, measurable target
- [ ] Efficiency goal has a specific, measurable target
- [ ] Neither goal can be achieved without the other acting as a guardrail
- [ ] Targets have been validated against unit economics (profit-to-acquisition ratio between 25-75%)

---

## Phase 2️⃣: Calculate minimum viable budget

### 2.1 Select your calculation method

Choose the formula that matches your growth and efficiency KPIs.

**Lead generation:**

| Primary KPI | Formula | Example |
|------------|---------|---------|
| Leads | Target leads x Target CPL | 100 leads x 50 EUR = 5,000 EUR/month |
| Qualified leads | Target qualified leads x Target CPQL | 50 qualified leads x 200 EUR = 10,000 EUR/month |
| Closed deals | Target closed deals x Target CAC | 10 deals x 750 EUR = 7,500 EUR/month |

**Ecommerce:**

| Primary KPI | Formula | Example |
|------------|---------|---------|
| Revenue | Target revenue / Target ROAS | 100,000 EUR / 400% = 25,000 EUR/month |
| Transactions | Target transactions x Target CPS | 500 transactions x 40 EUR = 20,000 EUR/month |
| New customers | Target new customers x Target CAC | 200 customers x 80 EUR = 16,000 EUR/month |

**SaaS:**

| Primary KPI | Formula | Example |
|------------|---------|---------|
| LTV:CAC based | Step 1: LTV = ARPU x Customer lifetime. Step 2: Target CAC = LTV / LTV:CAC ratio. Step 3: Budget = Target new customers x Target CAC | LTV = 100 EUR x 24 = 2,400 EUR. CAC = 2,400 / 3 = 800 EUR. 50 customers x 800 = 40,000 EUR/month |
| Payback period based | Step 1: Target CAC = ARPU x Payback period (months). Step 2: Budget = Target new customers x Target CAC | CAC = 50 EUR x 12 = 600 EUR. 100 customers x 600 = 60,000 EUR/month |

### 2.2 Calculate your MVB

Record your calculation:

| Input | Value |
|-------|-------|
| Growth target | |
| Efficiency target | |
| Formula used | |
| **Monthly MVB** | |

### 2.3 Add a budget buffer

Include a buffer for testing and scaling flexibility:

| Goal focus | Buffer percentage | Rationale |
|-----------|------------------|-----------|
| Growth-focused (primary) | 15-20% | More room for testing, scaling, and experimentation |
| Efficiency-focused (primary) | 5-10% | Smaller buffer for optimization and maintaining volume |

| Calculation | Value |
|-------------|-------|
| MVB without buffer | |
| Buffer percentage | |
| Buffer amount | |
| **MVB with buffer** | |

---

## Phase 3️⃣: Validate budget feasibility

### 3.1 Market validation

Can the budget be spent based on actual demand?

| Check | Tool | What to look for | Pass? |
|-------|------|-----------------|-------|
| Search volume supports growth targets | Keyword Planner | Monthly search volume for target keywords exceeds required click volume | [ ] |
| Impression share room exists | Google Ads: IS metrics | IS lost to rank or budget indicates room to capture more traffic | [ ] |
| Seasonality accounted for | Google Trends | Upcoming quarter trends support (not contradict) growth assumptions | [ ] |

If market demand is insufficient: reduce growth targets or expand targeting (new keywords, broader match types, additional networks).

### 3.2 Performance validation

Can the budget be spent at your target efficiency?

| Check | Tool | What to look for | Pass? |
|-------|------|-----------------|-------|
| Historical CPA/ROAS supports targets | Account data (last 3-6 months) | Efficiency targets are achievable based on past performance | [ ] |
| Performance Planner confirms projections | Performance Planner | Projected conversions and cost align with growth targets at target efficiency | [ ] |
| Diminishing returns accounted for | Performance Planner curve | Budget does not push into the flat part of the response curve | [ ] |

If performance data contradicts targets: revisit efficiency targets (adjust PAR), improve upstream metrics (conversion rate, landing page), or reduce growth goals.

### 3.3 Business validation

Do you have the resources to support this budget?

| Check | Question | Pass? |
|-------|---------|-------|
| Budget availability | Has the stakeholder approved this spend level? | [ ] |
| Operational capacity | Can the business handle the projected lead/order volume? | [ ] |
| Cash flow impact | Is the payback period sustainable given current runway? | [ ] |
| Channel distribution | Is the Google Ads allocation appropriate relative to total marketing budget? | [ ] |

If business constraints prevent the budget: negotiate with stakeholders, adjust growth goals, or phase the budget increase over multiple months.

> 💡 **Many feasibility checks overlap with goal-setting:** If you already validated these during goal creation, confirm nothing has changed. If anything shifted, re-validate.

---

## Phase 4️⃣: Allocate daily budgets

### 4.1 Categorize campaigns into tiers

Assign every campaign to one of three tiers based on historical performance:

| Tier | Description | Budget allocation | Examples |
|------|-------------|------------------|---------|
| **Tier 1: Proven performers** | Consistently hitting growth and efficiency targets, stable performance | ~70% of total budget | Brand campaigns, top non-brand keyword themes, best-converting product campaigns |
| **Tier 2: Scaling opportunities** | Showing positive early signals, room to grow (IS headroom, strong efficiency) | ~20% of total budget | Growing non-brand themes, promising audiences, campaigns running into budget limits with strong efficiency |
| **Tier 3: Testing** | New approaches, new channels, experiments | ~10% of total budget | New campaign types, broad match tests, mid/upper funnel campaigns, new audience segments |

> 💡 **If your primary goal is growth**, shift allocation: ~60% Tier 1, ~25% Tier 2, ~15% Tier 3. **If efficiency is primary**, shift to: ~75% Tier 1, ~15% Tier 2, ~10% Tier 3.

### 4.2 Calculate daily budgets per campaign

1. Take your monthly MVB (with buffer)
2. Divide by 30.4 to get the daily total budget
3. Distribute the daily total across campaigns according to tier allocation
4. For each campaign, set the daily budget in Google Ads

| Campaign | Tier | Monthly allocation | Daily budget (monthly / 30.4) |
|----------|------|-------------------|-------------------------------|
| | | | |

### 4.3 Choose individual or shared budgets

| Configuration | When to use |
|--------------|-------------|
| Individual budgets | Campaigns have different objectives, you need tight control, you are running campaign experiments, you use performance-based bucketing |
| Shared budgets | Campaigns share the same efficiency target, you want simplified management, campaigns are in initial learning phase |

> ⚠️ **Shared budgets are not compatible with campaign experiments:** If you plan to run experiments, use individual budgets for those campaigns.

### 4.4 Set budgets in Google Ads

**Individual budgets:**

1. Navigate to each campaign's settings
2. Set the daily budget to the calculated amount
3. Verify the budget is active

**Shared budgets:**

1. Go to Tools > Budgets and Bidding > Shared budgets
2. Create a shared budget with the pooled daily amount
3. Link the intended campaigns
4. Verify all campaigns show the shared budget

### 4.5 Set up budget monitoring

Add these custom columns to your campaign view:

| Column | Purpose |
|--------|---------|
| Daily budget spent % | (Cost / Daily budget) shows pacing |
| IS lost (budget) | Flags campaigns constrained by budget |
| IS lost (rank) | Flags campaigns constrained by bids |

---

### Validation & definition of done

This SOP is complete when:

- [ ] Growth and efficiency goals documented
- [ ] Minimum viable budget calculated with appropriate formula
- [ ] Budget buffer included
- [ ] Market validation passed (search volume, impression share, seasonality)
- [ ] Performance validation passed (historical data, Performance Planner)
- [ ] Business validation passed (stakeholder approval, operational capacity)
- [ ] Campaigns categorized into Tier 1/2/3
- [ ] Daily budgets set per campaign (individual or shared)
- [ ] Budget monitoring columns added

---

### Exit → Entry bridge

Once budgets are allocated and campaigns are running:

| Timeframe | Action |
|-----------|--------|
| Week 1-2 | Monitor daily spend vs. budget, check for budget-limited campaigns |
| Week 3-4 | Review tier allocation against actual performance |
| Monthly | Re-validate MVB against actual results, adjust if goals change |
| Quarterly | Full budget recalculation using updated goals and unit economics |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Budget cannot be spent (underspend) | Revisit market validation, check targeting, broaden keywords |
| Budget exhausted too quickly | Check IS lost (budget), increase budget or tighten efficiency targets |
| Performance does not match projections | [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) for target adjustments |
| Tier 2 campaign outperforms Tier 1 | Promote to Tier 1, reallocate budget accordingly |

---

### FAQ

**Q: What if I do not have historical data for budget calculations?**

A: Use the Keyword Planner for CPC estimates and search volume. Multiply estimated clicks by your expected conversion rate to project conversions, then apply your target CPA/ROAS. Start with a conservative MVB and increase after collecting 2-4 weeks of data.

**Q: Should I use the MVB as my starting budget or as a ceiling?**

A: The MVB is your floor, not your ceiling. It is the minimum spend needed to hit your growth goals. You can spend more if performance supports it. The buffer accounts for testing and optimization headroom.

**Q: How often should I recalculate budgets?**

A: Recalculate quarterly at minimum, or whenever goals, unit economics, or market conditions change significantly. Monthly reviews should check pacing and tier allocation but do not require full recalculation unless something has shifted.

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Mental Model | All phases (framework overview) |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Reference | Phase 4 (daily limits, shared budgets) |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Reference | Phase 2 (efficiency targets for MVB calculation) |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Reference | Phase 3 (Performance Planner validation) |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Reference | Phase 1 (breakeven calculations) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (provides efficiency targets for MVB calculation) |
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (determines bid strategy before budgeting) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Downstream (scaling beyond current allocation) |
| [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) | Related (shared budgets paired with portfolio strategies) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Budgets set without goals | Arbitrary allocation, no basis for calculation | Complete Phase 1 before any budget calculation |
| Skipping feasibility validation | Assumes market can absorb any budget | Run all three validation checks in Phase 3 |
| Equal distribution across campaigns | Treats all campaigns as equivalent | Categorize into tiers based on performance data |
| No testing budget | All budget goes to existing campaigns | Reserve 10% minimum for Tier 3 testing |
| Rigid allocation without adjustment | Set and forget, no rebalancing | Review tier performance monthly, reallocate when data warrants |
| Forgetting about the daily spending limit | Stakeholder alarm when Google spends 2x daily budget | Brief stakeholders on the 2x daily spending limit before launch |

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
