# Goals and KPIs Mental Model
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: MENTALMODEL_14
Status: Done
Category: Strategic
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Foundations
Pillar: 4

## Purpose

This mental model helps you set clear, measurable goals and select the right KPIs so every optimization decision is grounded in defined targets rather than guesswork.

> ❓ **The core question:** What are we optimizing for, and how do we know if we're winning?

Without goals, you're aimless. Without the right KPIs, you can't measure progress. This is Pillar 4 of the Success Formula because every campaign decision downstream (structure, targeting, creatives, bids) depends on knowing what success looks like.

---

## What this is NOT

This mental model does **not:**

- Explain unit economics calculations (See: [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md))
- Provide step-by-step instructions for configuring conversion tracking (See: *Measurement Maturity Mental Model* [TBD, Phase 2])
- Cover specific bid strategy selection (See: *Bidding Strategy Mental Model* [TBD, Phase 5])
- Replace stakeholder conversations: goals must be agreed upon with the business, not set by the specialist alone

---

## The Goal Setting Pyramid

The pyramid provides a top-down framework for translating business intent into measurable, in-platform action.

```
         ┌─────────────────┐
         │ 1. Business Goals│
         └────────┬────────┘
                  ↓
       ┌──────────────────────┐
       │ 2. Google Ads Goals   │
       └──────────┬───────────┘
                  ↓
    ┌──────────────────────────────┐
    │ 3. Campaign Type Selection    │
    └──────────────┬───────────────┘
                   ↓
  ┌─────────────────────────────────────┐
  │ 4. KPI Selection (Primary/Secondary) │
  └──────────────────┬──────────────────┘
                     ↓
┌─────────────────────────────────────────────┐
│ 5. Execute + Feedback Loop                   │
└─────────────────────────────────────────────┘
```

Each step depends on the one above. Skip a step and everything below becomes unreliable.

---

## Step 1️⃣: Define business goals

Business goals are the starting point. They come from the stakeholder, not from Google Ads.

**Every business goal must be SMART:**

| Element | Requirement | Example |
|---------|-------------|---------|
| **Specific** | Focused on one outcome | "Increase online purchases" (not "improve marketing") |
| **Measurable** | Has a quantifiable target | "by 25%" |
| **Achievable** | Grounded in reality and past data | Based on historical performance and market capacity |
| **Relevant** | Aligned with broader business strategy | Supports company revenue targets |
| **Time-bound** | Has a deadline | "in Q4 2026" |

**The two goal types:**

Every business goal falls into one of two categories. Understanding which one is primary changes everything downstream.

| | **Growth goals** | **Efficiency goals** |
|--|-------------------|----------------------|
| **Objective** | Scale the business: more reach, more customers, more revenue | Optimize ROI: better margins, lower costs, higher efficiency |
| **Focus** | Market share, customer base, new markets | Cost-effectiveness, waste reduction, profitability |
| **Characteristics** | Higher investment, lower short-term efficiency, expansion-oriented | Refining current setup, tighter targets, profit-focused |
| **Resource allocation** | Expansion and testing | Optimization and refinement |
| **Outcome** | Long-term growth and market dominance | Immediate profitability improvement |

> ⚠️ **You cannot maximize growth and efficiency simultaneously:** They inherently clash: scaling usually increases CPAs and decreases ROAS. Set one as primary. Use the other as guardrails.

**Growth goal examples:**

- Increase sales revenue by 20% in the next six months
- Increase new customer transactions by 10% next quarter
- Generate 100 closed deals per month

**Efficiency goal examples:**

- Reduce CAC by 10% next quarter
- Hit a blended ROAS (MER) of at least 500% in the next six months
- Keep CAC below €200 this year

---

## Step 2️⃣: Translate to Google Ads goals

Google Ads goals are tactical translations of business goals. They must:

- Contribute to the overarching business goal
- Be specific to actions measurable within Google Ads
- Recognize that Google Ads is one piece of a multi-channel strategy

| Business goal | Google Ads translation | Key insight |
|--------------|----------------------|-------------|
| Increase revenue by 20% in 6 months | Increase conversion value by 20% in 6 months by growing conversions and AOV | Google Ads may need to overdeliver if other channels underperform |
| Generate 100 closed deals/month | Generate 150 leads converting to 75 closed deals/month at 50% lead-to-sale rate through non-branded Search | Account for lead-to-sale rate in the translation |
| Reduce CAC by 10% next quarter | Decrease CPA by 10% by reducing spend on generic high-volume queries and increasing CVR | Make it tactically actionable |
| Hit blended ROAS of 500% | Achieve average ROAS of 350% in Google Ads, adjusting with other channels to hit blended target | Google Ads ROAS can be lower than blended ROAS because it's a paid channel |

**Critical rule:** Regularly review and adjust Google Ads goals to stay aligned with evolving business goals. Business goals change quarterly: your Google Ads goals must follow.

---

## Step 3️⃣: Select campaign types

Campaign types are your vehicle to hit goals. Select based on three factors:

| Factor | Question | Impact |
|--------|----------|--------|
| **Goal alignment** | Does this campaign type directly support the Google Ads goal? | Wrong vehicle = wasted budget |
| **Audience reach** | Can you find your target audience in this network? | B2B audiences may not be reachable via Display |
| **Volume potential** | Are there enough searches or targetable users? | Low-volume markets may need multi-channel approaches |

**Campaign type fit by primary goal:**

| Primary goal | Suitable campaign types | Why |
|-------------|----------------------|-----|
| **Growth + Efficiency** | Search, Shopping, PMax | Enough volume for growth, enough intent for efficiency |
| **Growth (primary)** | Search, Shopping, PMax + Display, Video, Demand Gen | Upper funnel extends reach but reduces efficiency |
| **Efficiency (primary)** | Search, Shopping, PMax + Remarketing | Bottom-of-funnel only: avoid prospecting in Display/Video |

> ⚠️ **Don't assume all campaign types produce similar results:** Search at 300% ROAS doesn't mean Video will match. Upper funnel costs more per conversion by design.

---

## Step 4️⃣: Choose KPIs

KPIs are organized into three tiers, each serving a different purpose.

### Tier 1: Primary KPIs

Directly measure progress toward your primary Google Ads goal. These are your North Star metrics.

| Primary goal | Primary KPIs |
|-------------|-------------|
| Growth focused | Conversions, conversion value, revenue |
| Efficiency focused | CPA, ROAS, cost per qualified lead |

### Tier 2: Secondary KPIs (Guardrails)

Prevent your primary goal from causing damage elsewhere. Set boundaries that cannot be crossed.

| Primary goal | Secondary KPIs (guardrails) |
|-------------|---------------------------|
| Growth focused | Minimum ROAS, maximum CPA, minimum profit margin |
| Efficiency focused | Minimum conversion volume, minimum conversion value, minimum impression share |

**Why guardrails matter:**

- Growth without efficiency guardrails: spending spirals out of control, profitability collapses
- Efficiency without volume guardrails: campaigns dry out, impression share tanks, competitors take your market share

### Tier 3: Diagnostic KPIs

In-platform metrics used to identify what drives performance and where problems hide. These are not goals: they are investigation tools.

| Diagnostic KPI | What it reveals |
|----------------|----------------|
| Impressions | Reach and market coverage |
| CTR | Ad relevance and message resonance |
| CPC | Competition level and bid efficiency |
| Conversion rate | Landing page and offer effectiveness |
| AOV | Revenue per transaction trend |
| Impression share (budget/rank) | Growth headroom and competitive position |
| Quality Score | Ad relevance, landing page, expected CTR |

### Avoid vanity metrics

Not everything that can be counted counts. Vanity metrics look impressive but don't inform decisions:

- High CTR with no conversions = irrelevant traffic or broken funnel
- Millions of impressions with no clicks = wrong audience or weak creative
- Low CPC with low conversion rate = cheap traffic that doesn't convert

**The test:** Can this metric inform a specific optimization action? If not, it's vanity.

---

## Step 5️⃣: The feedback loop

The goal pyramid is not a one-time exercise. Goals feed execution, execution generates data, and data validates or invalidates the goals.

### How the loop works

| Signal | What it tells you | Framework response |
|--------|-------------------|-------------------|
| Google Ads KPIs on track, business goals on track | Goals are valid, continue executing | No adjustment needed |
| Google Ads KPIs on track, business goals off track | Attribution gap or channel conflict | Cross-check backend data against Google Ads (See: [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md)) |
| Google Ads KPIs off track, business goals on track | KPIs are too aggressive or wrong metric chosen | Recalibrate KPI targets using Step 3 |
| Both off track | Goals are unrealistic or strategy is wrong | Return to Step 1 (business goal alignment) |

### Goal validation before committing

| Risk | What to check |
|------|---------------|
| Insufficient demand | Search volume supports the conversion target |
| Diminishing returns | Impression share data shows room to grow |
| Seasonal distortion | Trends data accounts for seasonality in targets |
| Forecast mismatch | Performance Planner projections align with targets |

> ↪️ **Execution of monitoring and reviews.** See [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) and [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) for the actual monitoring cadence and procedures.

---

## Practical application

### Ecommerce (growth-focused example)

- **Business goal:** Increase revenue by 20% in the next 6 months while maintaining profitability
- **Google Ads goal:** Increase conversion value by 40% (accounting for multi-channel contributions) while maintaining 300% non-branded ROAS
- **Primary KPIs:** Conversion value, conversion volume, AOV
- **Secondary KPIs:** Minimum non-branded ROAS of 300%, minimum contribution margin
- **Diagnostic KPIs:** Impressions, CTR, CPC, conversion rate, impression share

### Lead Gen (growth-focused example)

- **Business goal:** Double sales pipeline from €2M to €4M in H1 2026
- **Google Ads goal:** Increase monthly qualified leads from 100 to 200 at max €600/qualified lead
- **Primary KPIs:** Qualified lead conversions, lead-to-qualified-lead rate, pipeline value
- **Secondary KPIs:** Maximum cost per qualified lead of €600
- **Diagnostic KPIs:** Impressions, CTR, CPC, conversion rate, lead volume

### SaaS (efficiency-focused example)

- **Business goal:** Improve CAC payback from 12 to 8 months while maintaining growth
- **Google Ads goal:** Reduce cost per trial by 25% while maintaining 200+ trials/month
- **Primary KPIs:** CPA (cost per trial)
- **Secondary KPIs:** Minimum 200 trials/month, trial-to-paid rate
- **Diagnostic KPIs:** Impressions, CTR, CPC, conversion rate

---

## Key principles

1. **Start with the business, not the platform:** Goals flow from business objectives, not from what Google Ads can report.
2. **One primary focus:** Growth or efficiency: pick one. Use the other as guardrails.
3. **Three KPI tiers:** Primary (measure the goal), secondary (protect from damage), diagnostic (investigate and optimize).
4. **Validate before committing:** Use available tools to reality-check every goal before agreeing to it.
5. **Review regularly:** Business goals evolve. Google Ads goals must follow. Monthly at minimum, adjust as needed.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Google Ads Success Formula Mental Model](../mental-models/Google Ads Success Formula Mental Model.md) | Goals and KPIs is Pillar 4 in the formula |
| [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md) | Unit economics set the boundaries for goal targets |
| [The five buckets & hierarchy of constraints](../theory/The five buckets & hierarchy of constraints.md) | Goals inform constraint diagnosis across all five buckets |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Volume thresholds that interact with goal feasibility |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Detailed metric definitions and calculation methods |

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
