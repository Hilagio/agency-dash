# SOP – Select a Bidding Strategy
Created: 2026-02-04
Updated: 2026-02-05

Agent_Executable: No
Category: Bidding
Human_Approval_Required: No
Primary Outcome: Correct initial bid strategy selected for new campaign based on goals, data readiness, and campaign type
SOP_ID: SOP_32
Secondary Outcomes: Clear migration path defined, stakeholders briefed on learning period expectations
Status: Done
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through selecting the correct initial bid strategy for a new campaign by matching your optimization objective, data readiness, and campaign type to the right strategy.

> ❓ **The big question:** Which bid strategy should you start with for this campaign, and what does the migration path look like?

---

### What this SOP is NOT

This SOP does **not:**

- Explain how Smart Bidding works under the hood (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Optimize or troubleshoot an existing bid strategy (separate SOP)
- Migrate from one bid strategy to another (separate SOP)
- Set campaign goals or KPIs (See: [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md))
- Configure conversion tracking (upstream prerequisite)

### When to run this SOP

Run this SOP when:

- Launching a new campaign and choosing the initial bid strategy
- Adding a new campaign type to an existing account
- Rebuilding a campaign from scratch after a structural overhaul
- A stakeholder requests a strategy reset based on new business objectives

---

### Before you start

#### Required inputs

- Defined campaign goals and KPIs (from [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md))
- Campaign type determined (Search, Standard Shopping, PMax, Display, Video, Demand Gen)
- Conversion tracking configured and validated
- Historical performance data (if available): average CPA, average ROAS, monthly conversion volume
- Budget allocation for the campaign

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Decision trees per campaign type |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Understanding strategy mechanics and learning periods |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Conceptual framework for bidding decisions |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Mapping business goals to optimization objectives |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum data requirements per strategy |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Confirm optimization objective** | Determine what you are optimizing for | Documented optimization objective (visibility, traffic, conversions, or value) |
| **Phase 2️⃣: Assess data readiness** | Evaluate whether the account has enough data for the desired strategy | Data readiness assessment with volume thresholds |
| **Phase 3️⃣: Select strategy using decision tree** | Walk the decision tree for your campaign type | Selected bid strategy with documented reasoning |
| **Phase 4️⃣: Configure and document** | Set the strategy, define targets, and plan the migration path | Configured bid strategy, stakeholder brief, migration plan |

---

## Phase 1️⃣: Confirm optimization objective

### 1.1 Map business goals to optimization objectives

Review the campaign goals established in [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md). Identify which optimization objective aligns with your primary goal.

| Business goal | Google Ads goal | Optimization objective |
|---------------|----------------|----------------------|
| Brand awareness, market entry | Maximize visibility | **Visibility** |
| Website traffic, audience building | Maximize clicks | **Traffic** |
| Lead generation, purchases, sign-ups | Maximize conversion volume | **Conversions** |
| Revenue growth, ROAS targets, profit | Maximize conversion value | **Value** |

### 1.2 Confirm the objective matches the KPI framework

Cross-check your optimization objective against the primary KPI from your goals:

| Primary KPI | Expected optimization objective |
|-------------|-------------------------------|
| Impression share | Visibility |
| Clicks, CTR | Traffic |
| CPA, conversions | Conversions |
| ROAS, conversion value, POAS | Value |

If the primary KPI and optimization objective do not align, revisit [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md) before continuing.

### 1.3 Document the optimization objective

Record your confirmed objective:

| Field | Value |
|-------|-------|
| Campaign name | |
| Campaign type | |
| Optimization objective | |
| Primary KPI | |
| Guardrail KPI | |

---

## Phase 2️⃣: Assess data readiness

### 2.1 Determine account data status

Classify the account into one of three states:

| Data state | Definition | Implication |
|------------|-----------|-------------|
| **New account (zero data)** | No historical conversion data in the account | Smart Bidding has no signals to learn from: start with a data-gathering strategy or use Portfolio Bid Strategy to pool signals |
| **Minimal data (15-29/month)** | 15-29 conversions in the last 30 days for this campaign type | Absolute minimum for conversion-based bidding: expect high volatility, longer learning periods |
| **Functional data (30-49/month)** | 30-49 conversions in the last 30 days for this campaign type | Smart Bidding can function with moderate stability for Target CPA; Target ROAS still needs more data |
| **Sufficient data (50+/month)** | 50+ conversions in the last 30 days for this campaign type | Smart Bidding has enough signals for reliable optimization, including Target ROAS |

> ⚠️ **Conversion volume thresholds:** 15/month = absolute minimum (high volatility), 30/month = functional for Target CPA (moderate stability), 50/month = recommended for all strategies including Target ROAS. Below 15, conversion-based strategies will not have enough signal to optimize effectively.

### 2.2 Evaluate targeting familiarity

Determine whether the campaign targets familiar or unfamiliar territory:

| Factor | Familiar | Unfamiliar |
|--------|----------|------------|
| **Keywords/audiences** | Proven performers from existing campaigns | New keyword themes, untested audiences |
| **Geography** | Existing market | New market or region |
| **Offer** | Established product/service | New offer, untested pricing |

Unfamiliar targeting increases risk. When combining zero data with unfamiliar targeting, default to a conservative data-gathering strategy.

### 2.3 Check niche knowledge

If you have deep knowledge of the niche (expected CPCs, typical conversion rates, competitive landscape), you can set more informed initial targets. If the niche is unfamiliar, rely on broader benchmarks and plan for a longer learning period.

### 2.4 Record data readiness assessment

| Field | Value |
|-------|-------|
| Account data state | (Zero / Below threshold / Sufficient) |
| Conversions in last 30 days | |
| Targeting familiarity | (Familiar / Unfamiliar) |
| Niche knowledge level | (Deep / Moderate / Low) |
| Portfolio bid strategy available | (Yes / No) |

---

## Phase 3️⃣: Select strategy using decision tree

### 3.1 Open the correct decision tree

Open the [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) and navigate to the decision tree for your campaign type:

| Campaign type | Decision tree section |
|--------------|----------------------|
| Search | Search campaign decision tree |
| Standard Shopping | Shopping campaign decision tree |
| Performance Max | PMax campaign decision tree |
| Display | Display campaign decision tree |
| Video | Video campaign decision tree |
| Demand Gen | Demand Gen campaign decision tree |

### 3.2 Walk the decision tree

Follow the decision tree from top to bottom. At each node, use the inputs gathered in Phases 1 and 2 to determine the correct branch.

The decision tree accounts for:

1. Your optimization objective (from Phase 1)
2. Your data readiness state (from Phase 2)
3. Campaign-type-specific constraints

### 3.3 Document the selected strategy

Record the output of the decision tree:

| Field | Value |
|-------|-------|
| Selected bid strategy | |
| Reasoning (decision tree path) | |
| Is this a data-gathering strategy? | (Yes / No) |
| Planned migration strategy (if applicable) | |
| Migration trigger (if applicable) | |

> 💡 **If the decision tree recommends a data-gathering strategy,** this is a temporary starting point. Document the target strategy you plan to migrate to once data thresholds are met.

---

## Phase 4️⃣: Configure and document

### 4.1 Set the bid strategy in Google Ads

Open Google Ads (or Google Ads Editor) and configure the selected bid strategy for the campaign.

1. Navigate to the campaign settings
2. Select the bid strategy from Phase 3
3. Set the initial target (if applicable, see 4.2)
4. Save the configuration

### 4.2 Set initial targets

If the selected strategy requires a target (tCPA, tROAS), set it using the following rules:

| Strategy | Initial target rule | Example |
|----------|-------------------|---------|
| Target CPA (tCPA) | Set at or slightly above the recent 30-day average CPA | Average CPA is €45: set tCPA to €45-€50 |
| Target ROAS (tROAS) | Set at or slightly below the recent 30-day average ROAS | Average ROAS is 450%: set tROAS to 400-450% |
| Maximize Conversions (no target) | No target needed | Leave target blank |
| Maximize Conversion Value (no target) | No target needed | Leave target blank |
| Manual CPC | Set max CPC based on unit economics and expected conversion rate | Max CPA €50, CVR 3%: max CPC = €1.50 |

> ⚠️ **Do not set aggressive targets at launch:** Starting with a target that is significantly better than historical performance forces the algorithm into a constrained learning period. Let it learn at current performance levels first, then tighten targets incrementally.

For new accounts with no historical data, use unit economics to calculate your break-even CPA or minimum ROAS, then set the initial target 10-20% more conservative than break-even.

### 4.3 Brief stakeholders on the learning period

Communicate the following to relevant stakeholders:

| Topic | What to communicate |
|-------|-------------------|
| **Strategy selected** | Name of the strategy and why it was chosen |
| **Learning period** | Approximately two conversion cycles of volatile performance is expected (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md)) |
| **What not to do** | Do not make changes during the learning period (budget changes, targeting changes, bid adjustments) |
| **When to expect stability** | After the learning period completes, performance should normalize |
| **Migration plan** | If starting with a data-gathering strategy, explain the planned migration and timeline |

### 4.4 Document the migration plan

If the selected strategy is a data-gathering starting point, document the path forward:

| Field | Value |
|-------|-------|
| Current (starting) strategy | |
| Target (destination) strategy | |
| Migration trigger | (e.g., 50+ conversions in 30 days) |
| Expected timeline to migration | |
| Who monitors and executes migration | |

### 4.5 Final checklist

- [ ] Bid strategy is set in Google Ads
- [ ] Initial target is configured (if applicable)
- [ ] Target is not more aggressive than historical averages
- [ ] Stakeholders are briefed on the learning period
- [ ] Migration plan is documented (if using data-gathering strategy)
- [ ] Campaign is not paused or in draft state

---

### Validation & definition of done

This SOP is complete when:

- [ ] Optimization objective is confirmed and documented
- [ ] Data readiness assessment is complete
- [ ] Bid strategy is selected using the decision tree with documented reasoning
- [ ] Strategy is configured in Google Ads with appropriate initial targets
- [ ] Stakeholders are briefed on learning period expectations
- [ ] Migration plan is documented (if applicable)
- [ ] Run the [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) and pass all applicable items

---

### Exit → Entry bridge

Once the bid strategy is configured and the campaign is live:

| Timeframe | Action |
|-----------|--------|
| Days 1-14 | Monitor learning period status. Do not make changes unless critical issues arise. |
| Day 14+ | Confirm the learning period is complete. Review initial performance against targets. |
| Day 30+ | Evaluate if data-gathering thresholds are met. If yes, execute migration to target strategy. |
| Ongoing | Monitor bid strategy health using [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) on a regular cadence. |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Learning period resets repeatedly | Check for disruptive changes: review [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) |
| Performance significantly worse than expected | Verify conversion tracking, revisit data readiness assessment |
| Conversion volume drops below minimum threshold | Consider consolidating campaigns, reverting to data-gathering strategy, or pooling into a Portfolio Bid Strategy |
| Stakeholder wants to override the strategy | Revisit Phase 1 to confirm optimization objectives are still aligned |

---

### FAQ

**Q: What if my campaign has fewer than 15 conversions per month?**

A: Conversion-based bid strategies (Maximize Conversions, tCPA, tROAS) will not have enough signal. Use Manual CPC as a data-gathering strategy until you reach at least 15 conversions per month. Alternatively, consolidate campaigns or use a Portfolio Bid Strategy to pool conversion data across multiple campaigns.

**Q: Should I start with Maximize Conversions or Target CPA?**

A: If you have sufficient historical data (50+ conversions/month) and a clear CPA target from your unit economics, start with Target CPA. If data is limited or you are still establishing baseline performance, start with Maximize Conversions (no target) to let the algorithm gather data, then migrate to tCPA once you have a reliable average.

**Q: How long should I wait before tightening targets?**

A: Wait at least two full learning periods (14-28 days) after the initial setup before making target adjustments. When tightening, move in increments of 10-15% at a time, and allow a full learning period between each adjustment.

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Reference | Phase 3 |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Phase 2, Exit bridge |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Mental Model | Phase 1 |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference | Phase 2 |
| [Bid Strategy Health Checklist](../checklists/Bid Strategy Health Checklist.md) | Checklist | Validation, Exit bridge |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Mental Model | Phase 1 |

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md) | Upstream: must complete before this SOP |
| *SOP – Migrate a Bid Strategy* [TBD] | Downstream: execute when migration trigger is met |
| *SOP – Troubleshoot Bid Strategy Performance* [TBD] | Conditional: if performance degrades post-launch |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Setting aggressive targets at launch | Wanting to hit ideal CPA/ROAS immediately | Start at or near historical averages, tighten incrementally |
| Choosing tCPA/tROAS with insufficient data | Skipping the data readiness assessment | Complete Phase 2 before selecting a strategy |
| Making changes during the learning period | Impatience with volatile early performance | Brief stakeholders upfront, set expectations on the learning period (two conversion cycles) |
| No migration plan for data-gathering strategies | Treating the starting strategy as permanent | Always document the target strategy and migration trigger in Phase 4 |
| Ignoring campaign-type constraints | Assuming all strategies work for all types | Use the campaign-specific decision tree in Phase 3 |

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
