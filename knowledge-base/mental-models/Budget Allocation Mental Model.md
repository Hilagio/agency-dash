# Budget Allocation Mental Model
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: MENTALMODEL_20
Status: Done
Category: Strategic
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

This mental model helps you determine how much to spend and where to allocate it so every campaign has enough budget to hit your growth goals without waste.

> ❓ **The core question:** What budget do you need to achieve your goals, and how should you distribute it across campaigns?

Budget allocation is not guesswork. It is a four-step framework that starts with goals, calculates the minimum viable budget, validates feasibility, then distributes across campaigns based on proven performance and growth potential.

---

## What this is NOT

This mental model does **not:**

- Provide step-by-step budget setup instructions (See: [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md))
- Cover bid strategy selection (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Explain bid target calculations (See: [Bid Targets Reference](../references/Bid Targets Reference.md))
- Cover the mechanics of daily spending limits or budget pacing (See: [Budget Pacing Reference](../references/Budget Pacing Reference.md))

---

## The 4-Step Budget Framework

| Step | Name | Purpose | Output |
|------|------|---------|--------|
| **1️⃣** | **Start with goals** | Define what you need to achieve | Growth target + efficiency guardrail |
| **2️⃣** | **Calculate MVB** | Determine minimum viable budget | Monthly budget baseline |
| **3️⃣** | **Validate feasibility** | Reality-check against market, performance, and business constraints | Confirmed or adjusted budget |
| **4️⃣** | **Allocate daily budgets** | Distribute across campaigns by priority | Campaign-level daily budgets |

Each step builds on the previous one. Skip a step and your budgets become arbitrary.

---

## Step 1️⃣: Start with goals

Your goals determine your budget, not the other way around.

### How goal focus changes budgeting

| Primary goal | Budget implication | Why |
|-------------|-------------------|-----|
| **Growth-focused** | Higher budget needed | More aggressive bidding, higher impression share targets, wider campaign coverage |
| **Efficiency-focused** | Lower budget, tightly controlled | Conservative bidding, focus on proven performers, narrower campaign scope |

### The dual-goal requirement

Every budget calculation needs two inputs:

1. **Growth target:** the volume you need (leads, transactions, revenue, close deals)
2. **Efficiency target:** the guardrail that prevents overspending or underspending (CPA, ROAS, CAC, POAS)

Without a growth target, you cannot calculate a budget. Without an efficiency target, you have no guardrail. You need both, regardless of which is primary.

> ⚠️ **Never set budgets without goals:** Arbitrary budgets lead to either missed growth potential (too low) or wasted spend (too high).

---

## Step 2️⃣: Calculate minimum viable budget (MVB)

The MVB is the minimum spend level needed to hit your growth targets within your efficiency constraints. It provides enough room for optimization, testing, and scaling.

### MVB formulas by vertical

**Lead gen:**

| Primary KPI | Formula | Example |
|------------|---------|---------|
| Leads | Target leads x Target CPL | 100 leads x 50 EUR = 5,000 EUR/month |
| Qualified leads | Target qualified leads x Target CPQL | 50 qualified leads x 200 EUR = 10,000 EUR/month |
| Close deals | Target close deals x Target CAC | 10 close deals x 750 EUR = 7,500 EUR/month |

**Ecommerce:**

| Primary KPI | Formula | Example |
|------------|---------|---------|
| Revenue | Target revenue / Target ROAS | 100,000 EUR / 4.0 = 25,000 EUR/month |
| Transactions | Target transactions x Target CPS | 500 transactions x 40 EUR = 20,000 EUR/month |
| Profit (POAS) | Target gross profit / Target POAS | 50,000 EUR / 2.0 = 25,000 EUR/month |

**SaaS:**

| Primary KPI | Formula | Example |
|------------|---------|---------|
| Signups | Target signups x Target CPA | 200 signups x 25 EUR = 5,000 EUR/month |
| Subscribers | Target subscribers x Target CAC | 100 subscribers x 300 EUR = 30,000 EUR/month |

> 💡 **The MVB is a starting point, not a ceiling:** You may need more budget for testing, seasonal scaling, or new campaign types. But you need at least the MVB to have a reasonable chance of hitting your growth goals.

---

## Step 3️⃣: Validate feasibility

Before committing budget, run three validation checks:

### 3a: Market validation

| Check | What to look at | Red flag |
|-------|----------------|----------|
| Search volume | Keyword Planner, Google Trends | Not enough monthly searches to support your target volume |
| Impression share headroom | Current IS vs. IS lost (budget) | Already at 90%+ IS, limited room to grow through budget |
| Competition | Auction Insights, CPC trends | CPCs rising faster than your efficiency target allows |
| Seasonality | Year-over-year trends | Budget calculated during peak, but spend needed during trough |

### 3b: Performance validation

| Check | What to look at | Red flag |
|-------|----------------|----------|
| Historical CPA/ROAS stability | Last 3-6 months trend | Wild fluctuations make MVB unreliable |
| Conversion rate trends | CR over time by campaign/device | Declining CR means MVB underestimates required budget |
| Click-through rate | CTR trends | Low CTR means more impressions (and budget) needed per conversion |

### 3c: Business validation

| Check | What to look at | Red flag |
|-------|----------------|----------|
| Budget availability | Stakeholder sign-off | Management allocates less than MVB |
| Operational capacity | Can the business handle the lead/order volume? | Sales team at capacity, warehouse can't fulfill |
| Profitability | Unit economics support the efficiency target | Profit-to-acquisition ratio stretched above 80% |

If any check fails, either adjust the growth goal, improve upstream metrics (unit economics, conversion rate, offer), or negotiate for more budget.

---

## Step 4️⃣: Allocate daily budgets

Convert monthly budget to daily campaign-level budgets using a priority-based allocation framework.

### The investment allocation model

Think of budget allocation like investing:

| Priority tier | Allocation principle | Campaign examples |
|--------------|---------------------|-------------------|
| **Tier 1: Protect what works** | Highest share to proven performers | Top-converting search campaigns, profitable shopping campaigns |
| **Tier 2: Scale what's promising** | Moderate share to campaigns showing potential | Campaigns approaching target efficiency, emerging product categories |
| **Tier 3: Test what's next** | Reserved portion for experimentation | New campaign types, new audiences, new markets |

### Allocation factors

| Factor | Higher budget | Lower budget |
|--------|-------------|-------------|
| Historical ROAS/CPA | Strong, consistent performance | Below target or volatile |
| Conversion volume | High volume, meeting thresholds | Below minimum thresholds |
| Impression share lost (budget) | High IS lost to budget | Already capturing most available traffic |
| Strategic priority | Core business offering | Secondary or experimental |
| Funnel position | Lower funnel (Search, Shopping) | Upper funnel (Display, Video) |

### Individual vs. shared budgets

| Choose individual budgets when | Choose shared budgets when |
|-------------------------------|---------------------------|
| Campaigns have different objectives | Campaigns share the same efficiency target |
| You need tight control over specific campaigns | You want Google to optimize allocation automatically |
| Running campaign experiments | Campaigns are in learning phase |
| Using performance-based bucketing structures | Simplifying management across similar campaigns |
| Brand campaigns that cannot risk underfunding | Similar goal campaigns where slight reallocation is acceptable |

---

## The MVB mental model: fuel for a road trip

| Road trip element | Budget equivalent |
|------------------|------------------|
| **Destination** | Growth goal (where you want to go) |
| **Mileage (efficiency)** | Efficiency target (how far each euro gets you) |
| **Fuel needed** | Minimum viable budget |
| **Route validation** | Market, performance, business checks |
| **Fill stations** | Daily budget allocation across campaigns |

---

## Practical application

### When growth is primary

When the business goal is volume expansion, the model shifts toward aggressive allocation:

- The MVB calculation starts from growth targets, with efficiency as a guardrail only
- Budget flows disproportionately to high-volume campaigns because those campaigns have proven capacity to convert incremental spend
- Higher CPAs or lower ROAS are acceptable within guardrails because the growth target takes priority
- 10-15% of total budget is reserved for testing new channels because growth-primary accounts need to discover the next scaling lever

### When efficiency is primary

When the business goal is margin protection, the model shifts toward conservative allocation:

- The MVB calculation anchors on efficiency targets applied to minimum acceptable volume
- Budget flows first to proven performers because reallocating away from unproven campaigns protects margin
- Growth targets serve as a floor, preventing the account from starving below the volume level needed for smart bidding to function
- 5-10% of budget is reserved for efficiency experiments because even conservative accounts need to find better-performing segments

### When budgets are constrained

When the stakeholder allocates less than the MVB, the model predicts a shortfall. The framework for navigating this:

- **Tier 1 only:** limit allocation to proven performers because constrained budgets cannot afford experimentation
- **Recalibrate goals:** the growth target must be reduced to match available budget, because the MVB formula is bidirectional
- **Present the gap:** the difference between MVB, allocated budget, and projected growth impact quantifies the cost of under-investment
- **Look for non-budget levers:** improving conversion rates, landing pages, or offer strength reduces the MVB needed for the same growth target

> ↪️ **For step-by-step execution:** See [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md)

---

## Quantitative reallocation triggers

Use these thresholds to identify campaigns that need budget increases, decreases, or structural changes.
### Increase candidates

A campaign qualifies for a budget increase when it meets ALL criteria in a row:

| Trigger | Threshold | Priority |
|---------|-----------|----------|
| Below-target CPA + IS lost to budget | CPA 30%+ below target AND IS lost (budget) >10% | **Highest:** profitable campaign leaving money on the table |
| Below-target ROAS + IS lost to budget | ROAS 30%+ above target AND IS lost (budget) >10% | **Highest:** same signal for value-based campaigns |
| Conversion volume growing + budget constraint | Conversions up 20%+ MoM AND "Limited by budget" status | **High:** momentum campaign being throttled |
| High-performing location + IS limited | Location CPA 20%+ below average AND location IS lost (budget) >10% | **Medium:** geographic pocket of opportunity |

The model predicts that increases above 30% in a single adjustment disrupt Smart Bidding learning. Safe increments are 15-20%.

### Decrease candidates

A campaign qualifies for a budget decrease when it meets the criteria:

| Trigger | Threshold | Priority |
|---------|-----------|----------|
| CPA consistently above target | CPA 50%+ above target for 14+ consecutive days, despite bid optimization | **Highest:** burning budget without results |
| ROAS consistently below target | ROAS 50%+ below target for 14+ consecutive days | **Highest:** same signal for value-based |
| Zero conversions with sufficient spend | 0 conversions AND spend >5x target CPA over 30 days | **High:** no conversion signal at all |
| Declining conversion volume | Conversions down 30%+ MoM, not explained by seasonality | **Medium:** degrading campaign |
| High IS, low efficiency | IS >80% AND CPA above target | **Medium:** dominating an unprofitable auction |

The model predicts that decreases of 20-30% provide enough relief without destabilizing learning. A budget cut buys time while the underlying issue is investigated.

### Shared budget conflict signals

When shared budgets create allocation problems, these signals indicate a structural mismatch:

| Conflict | Detection Signal | What it means |
|----------|-----------------|---------------|
| **Consumption imbalance** | One campaign consumes >70% of the shared budget | One campaign is starving others of budget |
| **Mixed objectives** | Campaigns on the same shared budget optimize for different conversion actions | Conflicting signals make optimization impossible |
| **Mixed performance** | Campaign A has CPA 50%+ below target while Campaign B has CPA 50%+ above target, both on same shared budget | A high-performer is subsidizing a low-performer |
| **Portfolio strategy conflict** | Shared budget combined with portfolio bid strategy where campaigns have different target efficiency levels | Contradictory optimization signals |

The model suggests these conflicts indicate the campaigns do not belong on the same shared budget. The underlying principle: shared budgets work when campaigns share the same objective and similar efficiency levels. When those conditions are violated, individual budgets restore control.

### Zero-spend active campaign signals

| Scenario | Detection Signal | Severity |
|----------|-----------------|----------|
| Enabled campaign, 0 spend, 14+ days | Campaign status = Enabled, cost = 0 for 14+ days | WARN: investigate |
| Enabled campaign, 0 impressions, 7+ days | Campaign status = Enabled, impressions = 0 for 7+ days | FAIL: likely configuration issue |
| Budget set but no eligible keywords/products | Campaign has budget but all keywords paused, all products disapproved, or targeting too narrow | FAIL: targeting problem |

> ↪️ **For step-by-step reallocation execution:** See [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md)

---

## Key principles

1. **Goals determine budgets, not the reverse:** Start with what you need to achieve, then calculate what it costs.
2. **The MVB is a floor, not a target:** Budget below it and you cannot reasonably expect to hit your goals.
3. **Always validate before committing:** Market size, historical performance, and business constraints all gate your budget.
4. **Protect proven performers first:** Allocate to what works, then scale what's promising, then test what's next.
5. **Individual budgets for control, shared budgets for efficiency:** Match budget type to your management needs and campaign structure.

---

## Failure modes

| Failure | What happens | How to prevent |
|---------|-------------|----------------|
| **Setting budget without goals** | Arbitrary spend with no way to measure success or failure | Always calculate MVB from growth + efficiency targets before setting any budget |
| **Skipping feasibility validation** | MVB looks correct on paper but market size, historical performance, or business capacity cannot support it | Run all three validation checks (market, performance, business) before committing budget |
| **Protecting underperformers** | Budget locked into campaigns that no longer convert, starving promising campaigns | Review allocation against the tier framework monthly: Tier 1 campaigns must continue earning their share |
| **Reacting to short-term fluctuations** | Frequent budget changes retrigger Smart Bidding learning and prevent stable optimization | Use the reallocation trigger thresholds (14+ day windows) instead of daily performance to guide changes |
| **Ignoring impression share signals** | High-performing campaigns silently lose auctions due to budget constraints, suppressing growth | Monitor IS lost (budget) for Tier 1 campaigns: if a campaign beats efficiency targets and has high IS lost to budget, it is an increase candidate |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Upstream: bid strategy determines efficiency targets used in MVB calculation |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Downstream: how to scale budgets beyond MVB |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Technical specs on daily limits, monthly caps, shared budgets |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Efficiency targets used in MVB formulas |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Upstream: profitability constraints that bound budget decisions |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Upstream: growth and efficiency goals that drive this framework |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Executes this framework step-by-step |

---

## Version details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
