# Campaign Scaling Mental Model
Created: 2026-02-14

Support_ID: MENTALMODEL_30
Status: Done
Category: Operational
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Foundations
Pillar: 0

## Purpose

This mental model helps you decide how to grow a Google Ads account by choosing the right scaling axis based on account maturity, current performance, and available headroom.

> ❓ **The core question:** Should you scale vertically (more from what works), horizontally (expand to new territory), or diagonally (launch new campaign types), and in what order?

Most accounts stall because they try to scale in the wrong direction. They launch PMax before Search is proven, expand keywords before budgets are uncapped, or add Display before conversion tracking is mature. This framework gives you a sequenced approach: scale what works first, then expand reach, then diversify inventory.

---

## What this is NOT

This mental model does **not:**

- Provide step-by-step bid or budget adjustment procedures (See: [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md))
- Explain the growth-efficiency tradeoff mechanics (See: [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md))
- Cover budget calculation or allocation (See: [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md))
- Define optimization check frequencies (See: [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md))
- Replace the More/Better/New bottleneck framework (See: [Volume vs. efficiency (more/better/new)](<../theory/Volume vs efficiency (more better new).md>))

---

## The three scaling axes

Every growth action in Google Ads falls on one of three axes. The axes are sequential: each one unlocks the next.

| Axis | Direction | What it means | Growth lever | Prerequisite |
|------|-----------|---------------|--------------|--------------|
| **Vertical** | Up | Get more output from what already works | More budget, looser targets, higher impression share | Proven campaigns with stable efficiency |
| **Horizontal** | Out | Expand reach into new audiences, queries, or geographies | New keywords, match types, geos, audience segments | Vertical scaling tapped out or approaching diminishing returns |
| **Diagonal** | New | Launch entirely new campaign types or inventory sources | PMax, Demand Gen, Display, Video | Horizontal scaling reaching ceiling, mature measurement infrastructure |

> ⚠️ **The axes are sequential, not parallel:** Vertical first, horizontal second, diagonal third. Skipping ahead creates fragile growth built on unproven foundations.

---

## Axis 1️⃣: Vertical scaling

*"Get more from what already works".*

Vertical scaling is the safest growth lever. You have proven campaigns with healthy efficiency and you push them harder to capture more volume from the same inventory.

### Actions

| Action | How it scales | Metric to watch |
|--------|---------------|-----------------|
| Increase daily budgets | Uncaps delivery on proven campaigns | IS (Budget), daily spend, CPA/ROAS stability |
| Raise tCPA / lower tROAS targets | Allows bidding into more expensive auctions | Incremental CPA, net profit curve |
| Capture more impression share | Win auctions you currently lose to rank or budget | IS (Rank), IS (Budget), average CPC |

### Signals that vertical scaling is available

- IS (Budget) > 10%: proven campaigns are budget-capped
- Stable CPA/ROAS at current volume over 2+ weeks
- Bid simulator shows incremental conversions at acceptable efficiency
- Performance Planner projects growth within guardrails
- Budget utilization consistently hits daily limits

### Signals that vertical scaling is exhausted

- IS (Budget) near 0%: campaigns already capture available budget-gated traffic
- Each budget increase produces proportionally less incremental volume
- CPA/ROAS degrading beyond acceptable guardrails despite small increments
- Profit optimum curve shows you are past the peak (See: [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md))

### Guardrails

| Guardrail | Rule |
|-----------|------|
| Budget increase pace | Maximum 20-30% per change, wait one conversion cycle before next increase |
| Target adjustment pace | Maximum 15-20% per change for CPA, 10-15% for ROAS |
| Efficiency floor | Define a hard CPA ceiling or ROAS floor before scaling starts. Stop when you hit it. |
| Learning period | Do not evaluate results during the learning period after a target change. The learning period lasts approximately two conversion cycles, which varies by account (7-10 days for short conversion cycles, 14-30+ days for long cycles). (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md)) |

> 💡 **Vertical scaling connects directly to the profit optimum curve:** Every budget or target change moves you along that curve. Generally, the goal is to find the peak of net profit, not the maximum volume, though the right balance depends on the advertiser's growth stage and strategic objectives (e.g., market share capture may justify pushing past the profit peak). (See: [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md))

---

## Axis 2️⃣: Horizontal scaling

*"Expand reach into new territory".*

Horizontal scaling adds new inventory within the same campaign types. You go wider: more keywords, broader match types, new geographic targets, additional audience segments. The campaign structure stays the same, but coverage expands.

### Actions

| Action | How it scales | Metric to watch |
|--------|---------------|-----------------|
| Expand keyword coverage | Capture queries you don't currently bid on | Search impression share, new query volume, CPA of new terms |
| Broaden match types | Move from exact to phrase or broad to capture related intent | Search term relevance, wasted spend ratio |
| Expand geographic targeting | Enter new regions, cities, or countries | Performance by location, conversion rate by geo |
| Add audience segments | Layer new audiences (in-market, custom, similar) | Audience-level CPA/ROAS, incremental reach |
| Expand product coverage (Shopping) | Add product groups currently excluded or underrepresented | Product-level ROAS, click share |

### Signals that horizontal scaling is available

- Vertical scaling tapped out: proven campaigns at or near full IS, past profit optimum
- Search demand exists beyond current keyword coverage (Keyword Planner shows volume)
- Total addressable market (TAM) is not fully mapped
- Adjacent audiences or geos show market potential
- Competitor presence in segments you don't cover (Auction Insights)

### Signals that horizontal scaling is exhausted

- New keywords produce mostly irrelevant queries despite negatives
- Geographic expansion shows consistently worse CPA/ROAS than core markets
- Audience expansion returns diminishing incremental volume
- TAM is fully covered across keywords, geos, and audiences

### Guardrails

| Guardrail | Rule |
|-----------|------|
| Test before commit | Launch new keywords, geos, or audiences at small budget. Validate performance for 2-4 weeks before full allocation. |
| Isolation | Use separate campaigns or ad groups for new expansions so they don't pollute proven performance data |
| Negative management | Weekly search term review is mandatory during horizontal expansion. New territory generates new irrelevant queries. |
| Performance threshold | New expansions must reach within 20-30% of proven campaign efficiency within 30 days, or pause and reassess |

> ⚠️ **Horizontal scaling carries more risk than vertical:** New territory is unproven. Always isolate new expansions so you can measure their true performance without contaminating proven campaigns.

---

## Axis 3️⃣: Diagonal scaling

*"Launch new campaign types and inventory sources".*

Diagonal scaling diversifies your Google Ads presence into fundamentally different campaign types. You move from Search into Shopping, PMax, Demand Gen, Display, or Video. Each campaign type operates with different auction dynamics, user intent levels, and performance expectations.

### Actions

| Action | How it scales | Metric to watch |
|--------|---------------|-----------------|
| Launch PMax campaigns | Access all Google inventory with automated targeting | Incremental conversions, asset group performance, cannibalization vs. Search |
| Launch Demand Gen campaigns | Reach audiences on YouTube, Discover, Gmail | View-through conversions, assisted conversions, CPM efficiency |
| Launch Display campaigns | Remarketing and prospecting across Google Display Network | View-through conversions, frequency, assisted conversion path |
| Launch Video campaigns | YouTube brand and direct-response campaigns | View rate, earned actions, brand lift (if measurable) |

### Signals that diagonal scaling is available

- Horizontal scaling plateaued: core campaign types are fully expanded
- Business is ready for upper-funnel investment with longer payback windows
- Conversion tracking is mature: enhanced conversions enabled, offline import working (for lead gen), all key events tracked
- Attribution model accounts for cross-channel influence (data-driven attribution active)
- Sufficient historical conversion data for ML-heavy formats (PMax needs 30+ conversions/month per campaign)

### Signals that diagonal scaling is premature

- Search campaigns still have significant IS headroom
- Conversion tracking gaps exist (missing events, no enhanced conversions, no offline import)
- Fewer than 50 monthly conversions across the account
- No proven creative assets for visual/video formats
- Business expects the same CPA/ROAS benchmarks from upper-funnel as from Search

### Guardrails

| Guardrail | Rule |
|-----------|------|
| Stabilization window | Allow 30-60 days for new campaign types to exit learning and stabilize. Do not judge them in week one. |
| Separate benchmarks | Do not compare PMax, Demand Gen, or Display to Search benchmarks. Each format has its own realistic efficiency range. |
| Cannibalization watch | Monitor Search impression share and branded query volume before and after launching PMax. If Search IS drops without total volume increasing, PMax is cannibalizing, not adding. |
| Budget protection | Ring-fence proven Search/Shopping budgets. Fund diagonal scaling from incremental budget, not by starving proven campaigns. |
| Measurement maturity | Do not launch diagonal campaigns without data-driven attribution, enhanced conversions, and proper conversion windows configured. |

> 💡 **Diagonal scaling changes the measurement conversation:** Upper-funnel campaign types contribute through assisted conversions and brand awareness, not direct last-click efficiency. Align stakeholder expectations before launching.

---

## Mapping account maturity to scaling axes

The right scaling axis depends on where the account is in its lifecycle. Earlier stages have fewer axes available.

| Account stage | Available axes | Primary focus | Why |
|---------------|----------------|---------------|-----|
| **Launch (0-30 days)** | None (Remove blockages only) | Setup, tracking, initial data collection | No proven performance data exists. Scaling is premature. Focus on getting clean data. |
| **Ramp (1-3 months)** | Vertical only (cautious) | Prove unit economics, validate campaign viability | You need to confirm that campaigns can hit efficiency targets before pushing volume. Small, careful budget increases only. |
| **Stable (3-12 months)** | Vertical + Horizontal | Maximize proven campaigns, start expanding coverage | Proven campaigns justify more budget. Enough data to identify expansion opportunities. |
| **Mature (12+ months)** | All three axes | Full optimization, testing, diversification | Account has proven its core structure. Measurement is mature. Upper-funnel diversification becomes viable. |

> ⚠️ **Launch accounts do not scale:** During the first 30 days, the only valid action is removing blockages (tracking issues, disapprovals, broken landing pages) and collecting baseline data. Scaling an unproven account amplifies problems, not profits.

---

## Decision framework

Use this flow to determine which scaling axis to pursue next.

```
Is anything broken? (tracking, disapprovals, landing pages)
│
├─ Yes → REMOVE blockages first. No scaling until resolved.
│
└─ No
   │
   Do proven campaigns have budget or IS headroom?
   │
   ├─ Yes → VERTICAL SCALE
   │        Increase budgets, loosen targets, capture more IS
   │        │
   │        Still hitting growth goals?
   │        ├─ Yes → Hold. Optimize what you have.
   │        └─ No → Continue to horizontal
   │
   └─ No (vertical exhausted)
      │
      Does untapped demand exist? (new keywords, geos, audiences)
      │
      ├─ Yes → HORIZONTAL SCALE
      │        Expand coverage, test new territory
      │        │
      │        Still hitting growth goals?
      │        ├─ Yes → Hold. Optimize what you have.
      │        └─ No → Continue to diagonal
      │
      └─ No (horizontal exhausted)
         │
         Is measurement mature + business ready for upper funnel?
         │
         ├─ Yes → DIAGONAL SCALE
         │        Launch new campaign types with separate benchmarks
         │
         └─ No → Fix prerequisites first
                 (measurement, creative assets, stakeholder alignment)
```

---

## Connection to More/Better/New

The three scaling axes map directly to the [Volume vs. efficiency (more/better/new)](<../theory/Volume vs efficiency (more better new).md>) framework:

| Growth lever | Scaling axis | Relationship |
|--------------|-------------|--------------|
| **More** | Vertical | Push more budget and looser targets into proven campaigns |
| **More + New** | Horizontal | More volume from new keywords, geos, or audiences within the same campaign types |
| **New** | Diagonal | Entirely new campaign types with different dynamics and expectations |
| **Better** | All axes | Efficiency improvements (landing pages, ads, targeting) can unlock further scaling on any axis |

The key difference: More/Better/New diagnoses what type of lever to pull for a specific bottleneck. Vertical/Horizontal/Diagonal sequences the direction of account-level growth over time.

> 💡 **Better is not a scaling axis, it is a scaling enabler:** Improving conversion rates, ad quality, or landing page performance can unlock headroom on any axis. Better work should happen continuously alongside scaling, not as a separate phase.

---

## Common scaling mistakes

| Mistake | Why it fails | Fix |
|---------|-------------|-----|
| Launching PMax before Search is proven | No baseline to measure cannibalization against. PMax may just absorb branded queries. | Prove Search first, then add PMax with cannibalization monitoring |
| Expanding keywords before uncapping budgets | Spreading thin budget across more inventory reduces impression share on proven terms | Vertical first: uncap proven campaigns, then expand horizontally |
| Scaling budgets without efficiency guardrails | Budget increases without a CPA ceiling or ROAS floor lead to runaway costs | Define hard efficiency limits before any scaling action |
| Comparing Display CPA to Search CPA | Different inventory types have fundamentally different performance profiles | Set separate benchmarks per campaign type |
| Scaling a broken funnel | More traffic into a broken landing page or tracking gap amplifies waste | Remove blockages first, validate tracking, then scale |
| Skipping the Ramp phase | Scaling before unit economics are proven risks amplifying a losing configuration | Wait for 2-4 weeks of stable, target-hitting performance before vertical scaling |

---

## Key principles

1. **Sequence matters:** Vertical before horizontal before diagonal. Each axis builds on the proof established by the previous one.
2. **Prove before you scale:** No axis unlocks until the prerequisites are met. Proven campaigns for vertical, exhausted vertical for horizontal, mature measurement for diagonal.
3. **Separate benchmarks per axis:** Search CPA is not Shopping CPA is not PMax CPA is not Display CPA. Each campaign type gets its own realistic efficiency range.
4. **Better is always running:** Efficiency improvements (ads, landing pages, targeting) are not a phase. They run continuously and unlock headroom on whichever axis you are currently scaling.
5. **Remove before you scale:** Blockages (tracking gaps, disapprovals, broken pages) must be cleared before any scaling action. Scaling amplifies problems.
6. **Isolate new territory:** Horizontal and diagonal expansions go into separate campaigns or ad groups. Never let unproven inventory contaminate proven performance data.
7. **Protect proven campaigns:** Fund new scaling from incremental budget, not by starving what already works.

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Volume vs. efficiency (more/better/new)](<../theory/Volume vs efficiency (more better new).md>) | Foundation: the More/Better/New framework that this model sequences into scaling axes |
| [Bid Scaling Mental Model](../mental-models/Bid Scaling Mental Model.md) | Vertical axis: growth-efficiency slider and profit optimum curve |
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Vertical axis: budget calculation and allocation across campaigns |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Companion: how frequently to review scaling decisions by account maturity |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Upstream: unit economics that determine scaling ceiling |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Execution: step-by-step procedure for vertical scaling actions |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Execution: budget distribution across scaling priorities |

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
