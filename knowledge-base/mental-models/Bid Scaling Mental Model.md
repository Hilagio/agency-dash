# Bid Scaling Mental Model
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: MENTALMODEL_21
Status: Done
Category: Strategic
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

This mental model helps you understand the relationship between growth and efficiency so you can find the right position on the scaling slider for any campaign.

> ❓ **The core question:** How aggressively should you bid, and where is the point of maximum profit?

Scaling bids and budgets is a balancing act. Push too hard toward growth and you hit breakeven. Pull too far toward efficiency and the account starves. This model provides the framework for navigating that tension.

---

## What this is NOT

This mental model does **not:**

- Provide step-by-step instructions for changing bid targets (See: [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md))
- Explain how to calculate breakeven CPA/ROAS/POAS (See: [Bid Targets Reference](../references/Bid Targets Reference.md))
- Cover initial bid strategy selection (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Explain budget allocation from scratch (See: [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md))

---

## The Growth-Efficiency Slider

Every bid target positions you somewhere on a spectrum between maximum growth and maximum efficiency:

```
◄──────────────────────────────────────────────────────────►
100% PAR                    50% PAR                    1% PAR
GROWTH                     BALANCED                  EFFICIENCY
Maximum volume          Profit optimum           Starvation zone
Breakeven zone          Sweet spot               Under-investment
Zero profit             Sustainable              Volume dries up
```

**PAR = Profit-to-Acquisition Ratio:** the percentage of gross profit reinvested into Google Ads for acquisition.

| PAR | What it means | Risk |
|-----|--------------|------|
| **100%** | All profit goes to acquisition. Operating at breakeven. Maximum sustainable bidding. | Zero profit per conversion |
| **75%** | Aggressive growth. Three-quarters of profit reinvested. | Low margins, vulnerable to cost spikes |
| **50%** | Balanced. Half of profit retained, half reinvested. | Moderate growth, moderate profit |
| **25%** | Conservative. Most profit retained. | Missing growth opportunities |
| **10%** | Near-starvation. Almost no reinvestment. | Account volume dries up, smart bidding can't optimize |

> ⚠️ **There is no universally "right" PAR:** The correct position depends on your Google Ads goals, your unit economics, and your stakeholder's priorities. The key is to choose deliberately, not accidentally.

---

## The three zones

### 1️⃣ Starvation zone

*"Bidding so conservatively that the account dies".*

| Indicator | What you see |
|-----------|-------------|
| PAR below 15-20% | Targets too aggressive (CPA too low, ROAS too high) |
| Impression share | Declining, with high IS lost to rank |
| Volume trend | Declining conversions week over week |
| Smart bidding behavior | Restricting impressions, can't find auctions within target |
| Budget utilization | Consistently underspending daily budget |

**What to do:** Increase CPA targets or decrease ROAS targets in 10-15% increments. Monitor impression share recovery.

### 2️⃣ Profit optimum zone

*"The sweet spot where net profit is maximized".*

| Indicator | What you see |
|-----------|-------------|
| PAR between 30-70% | Targets allow competitive bidding with meaningful profit |
| Net profit | At or near its peak when modeled across scenarios |
| Volume | Sufficient to meet growth goals |
| Efficiency | Within acceptable guardrails |
| Budget utilization | Spending near daily budget without consistently hitting limits |

**How to find it:** Run multiple bid simulator scenarios across different CPA/ROAS/POAS targets. Plot net profit (conversion value minus cost) for each. The peak is your profit optimum.

### 3️⃣ Breakeven zone

*"Maximum volume, zero profit".*

| Indicator | What you see |
|-----------|-------------|
| PAR near 100% | All profit reinvested, approaching breakeven CPA/ROAS |
| Cost per acquisition | Near or at breakeven levels |
| Volume | Maximum achievable at current market conditions |
| Profit | Near zero or negative |
| Efficiency metrics | CPA rising / ROAS falling toward breakeven thresholds |

**What to do:** Only operate here temporarily and deliberately (new market entry, competitive defence). Ensure stakeholder understands and approves zero-profit operation.

---

## The profit optimum curve

When you plot net profit against bid aggressiveness (lower CPA target or lower ROAS target), you get a curve:

```
Net Profit
    │
    │        ╭────╮
    │       ╱      ╲
    │      ╱        ╲
    │     ╱          ╲
    │    ╱            ╲
    │   ╱              ╲
    │  ╱                ╲
    │ ╱                  ╲
    │╱                    ╲
────┼──────────────────────╲──────
    │                        ╲
    │ Starvation    Optimum    Breakeven
    │ Zone          Zone       Zone
    │
    └──────────────────────────────────►
         More efficient ──── More aggressive
         (Higher ROAS)       (Lower ROAS)
```

The curve exists because:

- **Too efficient:** restricted volume, missed opportunities, high cost-per-incremental-conversion
- **At optimum:** enough volume to meet goals, enough margin to profit
- **Too aggressive:** each incremental conversion costs more than it returns, diminishing returns erode profit

---

## Finding your profit optimum

The profit optimum is found by modeling net profit across multiple target scenarios and identifying the peak. Two tools support this:

### Bid simulators

Bid simulators model what would happen at different target levels for a given campaign or portfolio. The key output is projected conversion value and cost for each scenario, from which you calculate net profit (conversion value minus cost). The scenario where net profit peaks is your profit optimum.

### Performance Planner

Performance Planner models forward-looking scenarios across campaigns or portfolios at different efficiency target levels. Like bid simulators, the value is in calculating net profit per scenario and finding the peak.

### Why experiments matter

Both tools assume optimal conditions. The model predicts that real-world performance often differs from projections because of conversion delay, competitor behavior, and seasonality. A 50/50 campaign experiment running 30+ days produces conclusive data that projections cannot.

> ↪️ **For step-by-step profit optimum analysis:** See [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md)

---

## Scaling principles

### Why incremental changes matter

Smart Bidding learns from recent data patterns. The model predicts that large changes (over 20-30%) retrigger the learning period, causing temporary volatility. Smaller increments (10-20%) allow the algorithm to adapt without resetting its optimization signals. Scaling up tolerates slightly larger increments than scaling down, because loosening targets expands the available auction pool, while tightening targets restricts it.

### When to scale up (more aggressive)

The model suggests scaling up when these conditions are present:

- Efficiency targets are consistently met with margin to spare, indicating the current PAR is too conservative
- Impression share lost to budget is high, meaning profitable auctions are being missed
- Growth goals are not being met at the current bid level
- Unit economics have improved (higher margins, higher deal values), expanding the headroom between target and breakeven
- Bid simulators show incremental volume at acceptable efficiency

### When to scale down (more conservative)

The model suggests scaling down when these conditions are present:

- Efficiency targets are being missed consistently, indicating the PAR is too aggressive
- CPA/ROAS is trending toward breakeven, eroding profitability
- Conversion rate is declining (investigate root cause first: the issue may not be bidding)
- Stakeholder requires higher profitability, shifting the growth-efficiency priority
- Seasonal demand is declining, reducing the volume of profitable auctions

### When NOT to scale

The model predicts that scaling during these conditions produces unreliable results:

- **During learning period:** approximately two conversion cycles after major changes. The algorithm is still calibrating.
- **During conversion delay window:** conversions have not yet attributed. Wait 1-2 conversion cycles for complete data.
- **When conversion tracking issues are present:** bad data produces bad scaling decisions.
- **When external factors temporarily distort data:** holidays, outages, competitor promotions create anomalies that do not reflect sustainable performance.

> ↪️ **For specific increment sizes and execution steps:** See [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md)

---

## The unit economics connection

Your scaling ceiling is determined by your unit economics:

| Better unit economics enable | Worse unit economics restrict |
|-----------------------------|------------------------------|
| Lower breakeven CPA (more headroom) | Higher breakeven CPA (less headroom) |
| Higher breakeven ROAS (less restrictive) | Lower breakeven ROAS (must be more aggressive) |
| Lower PAR needed for same growth | Must stretch PAR toward 100% for any growth |
| Comfortable profit optimum zone | Narrow or nonexistent profit optimum |

**If you cannot hit growth goals even at 100% PAR (breakeven),** the problem is not bidding. The problem is unit economics: average deal value, profit margins, or conversion rates need improvement.

(See: [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md))

---

## Practical application

### Scenario: Growth-primary account

When the goal is to increase conversion volume (e.g., +30% this quarter), the model predicts you need to move the PAR slider toward growth:

- **Current PAR determines headroom:** a PAR of 40% has room to push toward 60% before approaching breakeven. A PAR of 80% has almost no room left.
- **Bid simulators reveal the tradeoff:** modeling a higher CPA target shows how many incremental conversions the margin sacrifice buys. If the incremental volume justifies the margin cost, the move makes sense.
- **Experiments validate the model:** when the proposed change is large (over 20% shift in PAR), the model is less reliable and an experiment produces better data than a projection.

### Scenario: Efficiency-primary account

When the goal is to improve ROAS while maintaining volume (e.g., +15% ROAS this quarter), the model predicts you need to move the PAR slider toward efficiency:

- **Current PAR determines risk:** a PAR of 70% has room to pull back toward 55%. A PAR of 30% is already conservative and further tightening risks starvation.
- **Growth guardrails prevent starvation:** the model predicts that tightening efficiency targets reduces volume. If projected volume drops below the growth guardrail, the tightening has gone too far.
- **Conversion cycle pacing:** the model works best when changes are spaced by at least one conversion cycle, allowing complete attribution data before the next adjustment.

### Scenario: Finding profit optimum

When the goal is to maximize net profit across a portfolio, the model predicts that each campaign has a unique peak on the profit curve:

- **Multiple scenarios reveal the curve:** modeling 5-7 target levels per campaign produces enough data points to identify where net profit peaks.
- **The peak varies by campaign:** high-volume campaigns often have a broad optimum zone, while low-volume campaigns have a narrow or unstable peak.
- **Experiments confirm the peak:** bid simulators estimate the curve, but real-world experiments (50/50 split, 30+ days) confirm whether the projected optimum holds.

> ↪️ **For step-by-step scaling execution:** See [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md)

---

## Key principles

1. **Growth and efficiency are in tension:** You cannot maximize both. Choose your priority, use the other as a guardrail.
2. **The PAR is your control lever:** Adjust it deliberately based on goals, not reactively based on short-term fluctuations.
3. **Diminishing returns are real:** Every incremental conversion costs more than the last. Find the optimum, not the maximum.
4. **Unit economics set the ceiling:** If breakeven doesn't support your growth goals, fix the business model, not the bids.
5. **Always validate with experiments:** Forecasts are directional. Experiments are conclusive.

---

## Failure modes

| Failure | What happens | How to prevent |
|---------|-------------|----------------|
| **Scaling without knowing your PAR** | Changes are arbitrary because you do not know how far you are from breakeven or starvation | Calculate PAR before any scaling decision: current CPA (or inverse ROAS) divided by breakeven CPA (or inverse ROAS) |
| **Scaling too fast** | Large target changes retrigger Smart Bidding learning, causing 1-2 weeks of volatile performance | Keep increments within 10-20% per adjustment and wait one full conversion cycle between changes |
| **Scaling during learning period** | Performance data is unstable, so the scaling decision is based on noise rather than signal | Never scale during learning period, conversion delay window, or tracking incidents |
| **Ignoring diminishing returns** | Each incremental conversion costs more than the last, eventually eroding all profit | Model the profit curve with bid simulators before scaling: the curve shows where incremental volume stops being profitable |
| **Blaming bids when unit economics are the problem** | Scaling cannot fix a business model where breakeven CPA is too low or margins are too thin to support any PAR | If even 100% PAR (breakeven) cannot hit growth goals, the constraint is unit economics, not bidding |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Upstream: strategy selection before scaling |
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Parallel: budget sizing complements bid scaling |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Breakeven and target calculations that bound scaling |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Tool used to model profit optimum scenarios |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Upstream: margins and deal values that set scaling ceiling |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Specific calculations for breakeven points |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Executes this framework step-by-step |

---

## Version details

- **Version:** 2.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
