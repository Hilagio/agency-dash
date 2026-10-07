# Bid Modifier Reference
Created: 2026-02-14

Support_ID: REFERENCE_42
Status: Done
Category: Bidding
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

Documents every bid modifier type in Google Ads: what it controls, its range, how modifiers stack, how each interacts with Smart Bidding, and how to calculate starting adjustments from performance data.

---

## What this reference is / what this is NOT

**This reference:**

- Lists all bid modifier types with their ranges and where to set them
- Explains multiplicative stacking rules with worked examples
- Documents which modifiers Smart Bidding respects and which it ignores
- Provides the analysis method for calculating starting adjustments
- Covers minimum data requirements per modifier dimension

**This reference does NOT:**

- Explain how Smart Bidding works under the hood (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Tell you which bid strategy to select (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Provide recommended bid modifier settings (See: [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md))
- Walk through step-by-step setup of bid adjustments (that belongs in an SOP)

---

## Quick reference: all modifier types

| Modifier | Range | Smart Bidding | Manual CPC | Where set |
|----------|-------|---------------|---------------------|-----------|
| Device | -100% to +900% | Only -100% respected | Full range | Campaign |
| Location | -90% to +900% | Ignored | Full range | Campaign |
| Ad schedule | -90% to +900% | Ignored | Full range | Campaign |
| Audience (RLSA) | -90% to +900% | Ignored for bids, used as signal | Full range | Campaign / Ad group |
| Age | -90% to +900% | Ignored | Full range | Campaign / Ad group |
| Gender | -90% to +900% | Ignored | Full range | Campaign / Ad group |
| Parental status | -90% to +900% | Ignored | Full range | Campaign / Ad group |
| Household income | -90% to +900% | Ignored | Full range | Campaign / Ad group |
| Interactions | -90% to +900% | Ignored | Full range | Campaign |

> ⚠️ **Smart Bidding ignores all modifiers except device -100%:** Setting location, schedule, audience, or demographic adjustments on Target CPA, Target ROAS, Maximize Conversions, or Maximize Conversion Value campaigns has zero effect. Smart Bidding handles these dimensions internally using auction-time signals.

---

## Device modifier

### What it controls

Adjusts bids up or down based on the user's device type: computers, mobile phones, tablets, or TV screens.

### Range and default

| Setting | Value |
|---------|-------|
| Range | -100% to +900% |
| Default | 0% (no adjustment) |
| -100% effect | Completely excludes the device |

### Smart Bidding interaction

Device -100% is the only modifier Smart Bidding respects, and it excludes the device entirely from the campaign. All other device adjustments (e.g., +20% mobile) are ignored under Smart Bidding because the algorithm already adjusts bids per device at auction time.

### Best use cases

| Use case | Example |
|----------|---------|
| Exclude mobile from desktop-only campaigns | Set mobile to -100% |
| Exclude tablets from high-intent campaigns | Set tablet to -100% |
| Boost mobile bids on Manual CPC campaigns | Set mobile to +30% if mobile CPA is 30% below average |

### Minimum data for analysis

Collect 100+ clicks per device type before adjusting. For most accounts, desktop and mobile accumulate data quickly. Tablet data may take longer due to lower traffic volume.

### Analysis dimension

Device analysis runs on campaign data segmented by device, compared against the campaign average. The procedure is owned by [SOP - Optimize Bid Modifiers](../sops/SOP – Optimize Bid Modifiers.md), Phases 1.3 to 3.1.

---

## Location modifier

### What it controls

Adjusts bids for users in specific geographic locations: countries, regions, cities, or radius targets.

### Range and default

| Setting | Value |
|---------|-------|
| Range | -90% to +900% |
| Default | 0% (no adjustment) |

### Smart Bidding interaction

Ignored entirely. Smart Bidding uses location as one of its 18+ auction-time signals. It already bids higher in high-converting locations and lower in poor-performing ones.

### Best use cases

| Use case | Example |
|----------|---------|
| Boost bids near physical stores (Manual CPC) | Set +50% for a 10 km radius around each store |
| Reduce bids in low-converting regions (Manual CPC) | Set -40% for regions with CPA 40% above average |
| Exclude a location entirely | Use campaign-level location exclusion instead of -90% |

### Minimum data for analysis

100+ clicks per location segment. For granular locations (cities, radiuses), data accumulates slowly, so region level reaches the threshold well before city level does.

### Analysis dimension

Location analysis runs on the Locations tab with the Conversions and Cost / conv. columns, filtered to locations meeting the click minimum above. The procedure is owned by [SOP - Optimize Bid Modifiers](../sops/SOP – Optimize Bid Modifiers.md), Phases 1.3 to 3.1.

---

## Ad schedule modifier

### What it controls

Adjusts bids based on day of week and time of day. Requires an ad schedule to be set at the campaign level.

### Range and default

| Setting | Value |
|---------|-------|
| Range | -90% to +900% |
| Default | 0% (no adjustment) |
| Prerequisite | Ad schedule must be configured |

### Smart Bidding interaction

Ignored entirely. Smart Bidding evaluates time-of-day and day-of-week signals at auction time. Setting ad schedule adjustments on automated campaigns has no effect.

> 💡 **Ad schedule pausing still works on Smart Bidding:** You can still use ad schedules to stop ads from showing during specific hours (e.g., outside business hours for call-dependent businesses). The schedule acts as a filter, not a bid modifier.

### Best use cases

| Use case | Example |
|----------|---------|
| Boost bids during business hours (Manual CPC) | Set +25% for Monday-Friday 9:00-17:00 |
| Reduce bids overnight (Manual CPC) | Set -50% for 23:00-06:00 |
| Pause ads on weekends for B2B | Set -100% for Saturday and Sunday (ad schedule filter) |

### Minimum data for analysis

100+ clicks per time segment. At 4-6 blocks per week (weekday morning, weekday afternoon, weekday evening, weekend daytime, weekend evening), segments reach the threshold. Hourly segments do not: the data is too thin.

### Analysis dimension

Schedule analysis runs on the Ad Schedule tab, with day-and-hour segments grouped into similar-performing blocks. The procedure is owned by [SOP - Optimize Bid Modifiers](../sops/SOP – Optimize Bid Modifiers.md), Phases 1.3 to 3.1.

---

## Audience modifier (RLSA and observation)

### What it controls

Adjusts bids for users who belong to specific audience segments: remarketing lists (RLSA), customer match, similar audiences, in-market, affinity, or custom segments.

### Range and default

| Setting | Value |
|---------|-------|
| Range | -90% to +900% |
| Default | 0% (no adjustment) |
| Targeting mode | Observation (layer) or Targeting (restrict) |

### Observation vs. targeting mode

| Mode | What it does |
|------|-------------|
| Observation | Ads show to everyone. Audience members get a bid adjustment on top of the base bid. Non-audience users get the base bid. |
| Targeting | Ads show only to audience members. The bid modifier applies within that restricted pool. |

### Smart Bidding interaction

Smart Bidding ignores audience bid adjustments. It already uses audience membership as a signal during auction-time bidding. Observation mode still yields reporting visibility under Smart Bidding, but the bid adjustment attached to it does nothing.

### Best use cases

| Use case | Example |
|----------|---------|
| Boost bids for site visitors (Manual CPC) | Set +50% for "All visitors" remarketing list |
| Boost bids for cart abandoners (Manual CPC) | Set +100% for "Cart abandoners, last 7 days" |
| Reduce bids for low-value audiences (Manual CPC) | Set -30% for in-market segments with poor CPA |
| Reporting only (Smart Bidding) | Add audiences in Observation mode to see how they perform |

### Minimum data for analysis

100+ clicks per audience segment. Remarketing lists with fewer than 1,000 members typically generate insufficient click data for modifier analysis.

---

## Demographic modifiers

Google Ads supports four demographic modifier types. All follow the same mechanics.

### Age

| Setting | Value |
|---------|-------|
| Range | -90% to +900% |
| Segments | 18-24, 25-34, 35-44, 45-54, 55-64, 65+, Unknown |
| Smart Bidding | Ignored |

### Gender

| Setting | Value |
|---------|-------|
| Range | -90% to +900% |
| Segments | Male, Female, Unknown |
| Smart Bidding | Ignored |

### Parental status

| Setting | Value |
|---------|-------|
| Range | -90% to +900% |
| Segments | Parent, Not a parent, Unknown |
| Smart Bidding | Ignored |

### Household income

| Setting | Value |
|---------|-------|
| Range | -90% to +900% |
| Segments | Top 10%, 11-20%, 21-30%, 31-40%, 41-50%, Lower 50%, Unknown |
| Smart Bidding | Ignored |

### Best use cases for demographics

| Use case | Modifier | Example |
|----------|----------|---------|
| Luxury product targeting (Manual CPC) | Household income | Set +40% for Top 10%, -30% for Lower 50% |
| B2B targeting professionals (Manual CPC) | Age | Set +20% for 25-44, -40% for 18-24 |
| Parent-focused products (Manual CPC) | Parental status | Set +30% for Parents |

### Key rules for demographics

| Rule | Detail |
|------|--------|
| The "Unknown" segment is large | Often 30-50% of traffic, so -90% on Unknown excludes a significant share of the audience |
| Demographic data is inferred by Google | It is not always accurate |
| Evidence bar | Clear performance differences with 100+ clicks per segment |

---

## Interactions modifier

### What it controls

Adjusts bids for call interactions on call-only ads and call extensions.

### Range and default

| Setting | Value |
|---------|-------|
| Range | -90% to +900% |
| Default | 0% (no adjustment) |
| Smart Bidding | Ignored |

### Best use cases

| Use case | Example |
|----------|---------|
| Boost call bids for call-dependent businesses (Manual CPC) | Set +50% for call interactions |
| Reduce call bids when calls are secondary (Manual CPC) | Set -30% for call interactions |

---

## Smart Bidding interaction rules

### Summary table

| Bid strategy | Device -100% | Device other | Location | Schedule | Audience | Demographics |
|-------------|:------------:|:------------:|:--------:|:--------:|:--------:|:------------:|
| Manual CPC | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Maximize Clicks | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Target Impression Share | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| Maximize Conversions | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Target CPA | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Maximize Conversion Value | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| Target ROAS | ✅ Yes | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |

### Why Smart Bidding ignores modifiers

Smart Bidding processes 18+ signals at auction time, including device, location, time, audiences, and demographics. It calculates the optimal bid for each individual auction. Layering manual adjustments on top would conflict with the algorithm's predictions.

### Alternatives on Smart Bidding

The controls that do work in place of each ignored modifier:

| Instead of | The working control |
|-----------|-----|
| Location modifiers | Conversion value rules (for value-based strategies) or campaign-level location exclusions |
| Schedule modifiers | Ad schedule pausing (to stop ads entirely during specific hours) |
| Audience modifiers | Add audiences in Observation mode for reporting. Smart Bidding uses them as signals automatically |
| Demographic modifiers | Conversion value rules or demographic exclusions at the ad group level |

---

## Stacking rules

### How modifiers combine

Modifiers apply **multiplicatively**, not additively. Each modifier multiplies the running bid independently.

### Formula

`Effective bid = Base bid x (1 + Modifier A) x (1 + Modifier B) x (1 + Modifier C)`

### Worked examples

**Example 1: Two positive modifiers**
- Base bid: €2.00
- Device modifier: +20%
- Location modifier: +30%
- Effective bid: €2.00 x 1.20 x 1.30 = €3.12 (+56%, not +50%)

**Example 2: One positive, one negative**
- Base bid: €2.00
- Device modifier: +50%
- Ad schedule modifier: -20%
- Effective bid: €2.00 x 1.50 x 0.80 = €2.40 (+20%)

**Example 3: Three modifiers stacking**
- Base bid: €2.00
- Device: +30%
- Location: +20%
- Audience: +50%
- Effective bid: €2.00 x 1.30 x 1.20 x 1.50 = €4.68 (+134%)

> ⚠️ **Stacking risk:** three moderate modifiers can produce extreme bid increases, and no single modifier's setting reveals the combined effect.

### Audience mode interaction

| Mode | Stacking behavior |
|------|------------------|
| Observation | Audience modifier stacks on top of all other modifiers for audience members. Non-audience users get base bid with other modifiers only. |
| Targeting | Only audience members are eligible. The audience modifier stacks with other applicable modifiers for those users. |

---

## Analysis method

### Inputs the formulas need

| Input | Definition |
|-------|------------|
| Data window | At least 2-4 weeks of campaign history |
| Segmentation | Performance broken by the modifier dimension (device, location, time, audience, demographic) |
| Qualifying segment | 100+ clicks |
| Segment CPA | Cost / Conversions for that segment |
| Campaign average CPA | Total cost / Total conversions |

The procedure that gathers these and applies the result is owned by [SOP - Optimize Bid Modifiers](../sops/SOP – Optimize Bid Modifiers.md), Phases 1.3 to 3.2.

### Adjustment formulas

**For CPA-based goals (lower is better):**

`Starting modifier % = (Average CPA / Segment CPA - 1) x 100`

| Segment CPA | Campaign CPA | Calculation | Starting modifier |
|-------------|-------------|-------------|-------------------|
| €40 | €50 | (€50 / €40 - 1) x 100 | +25% |
| €65 | €50 | (€50 / €65 - 1) x 100 | -23% |
| €50 | €50 | (€50 / €50 - 1) x 100 | 0% |

**For ROAS-based goals (higher is better):**

`Starting modifier % = (Segment ROAS / Average ROAS - 1) x 100`

| Segment ROAS | Campaign ROAS | Calculation | Starting modifier |
|-------------|--------------|-------------|-------------------|
| 600% | 400% | (600 / 400 - 1) x 100 | +50% |
| 250% | 400% | (250 / 400 - 1) x 100 | -37.5% |

### Safety rules

| Rule | Value |
|------|-------|
| Cap on the initial adjustment | +/-30%, regardless of what the formula produces |
| Re-analysis interval | 2 weeks |
| Step size in subsequent cycles | 10-15% |
| Removal condition (modifier back to 0%) | Fewer than 50 conversions in the segment after 30 days |

---

## Decision guide: when to use bid modifiers

```
Are you using Smart Bidding (tCPA, tROAS, Max Conv, Max Conv Value)?
│
├─ YES → Do you need to exclude a device entirely?
│        │
│        ├─ YES → Set device modifier to -100%
│        │
│        └─ NO → Do not use bid modifiers.
│                Use conversion value rules or campaign-level
│                exclusions instead.
│
└─ NO → Do you have 100+ clicks per segment for the modifier type?
         │
         ├─ NO → Collect more data before setting modifiers
         │
         └─ YES → Calculate starting modifier using the analysis method.
                   Cap at +/-30%. Re-analyze after 2 weeks.
```

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Setting modifiers on Smart Bidding campaigns | All modifiers except device -100% are ignored, creating false confidence | Remove all non-device modifiers from Smart Bidding campaigns |
| Adding modifiers additively in mental math | +20% device and +30% location is +56%, not +50% | Always calculate multiplicatively |
| Setting modifiers with insufficient data | Fewer than 100 clicks per segment produces unreliable analysis | Wait for 100+ clicks per segment before adjusting |
| Setting extreme initial modifiers (>30%) | Overshoot causes performance swings and makes iterative refinement harder | Cap initial modifiers at +/-30%, then adjust incrementally |
| Setting -90% on Unknown demographics | The Unknown bucket is often 30-50% of traffic, so you lose massive reach | Only reduce Unknown if data strongly supports it, and never below -50% |
| Forgetting to re-analyze after changes | Market conditions shift, and stale modifiers degrade performance over time | Schedule re-analysis every 2-4 weeks |
| Using modifiers as a substitute for campaign structure | Layering many modifiers creates complexity that is hard to maintain | Use separate campaigns for fundamentally different audiences or locations |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | How Smart Bidding handles signals internally, including bid adjustments |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Recommended settings for bid adjustments and conversion value rules |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metric definitions used in modifier analysis (CPA, ROAS, clicks) |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Which strategy to select per campaign type |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | How to calculate CPA/ROAS targets that feed modifier decisions |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Conceptual framework for where modifiers fit in the bidding hierarchy |

---

## Version details

- **Version:** 2.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
