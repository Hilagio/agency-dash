# Ad Schedule Reference
Created: 2026-02-14

Support_ID: REFERENCE_43
Status: Done
Category: Bidding
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

Documents ad schedule configuration in Google Ads: time slot setup, hour-of-week performance analysis, bid adjustment calculations, time zone handling, and the interaction between ad schedules and Smart Bidding.

---

## What this reference is / what this is NOT

**This reference:**

- Explains how to configure ad schedules at the campaign level
- Documents hour-of-week analysis for identifying performance patterns
- Provides bid adjustment formulas for time-based optimization
- Clarifies Smart Bidding behavior with ad schedules

**This reference does NOT:**

- Tell you what bid strategy to use (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Provide step-by-step bid scaling instructions (See: [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md))
- Cover device or location bid adjustments (separate modifier types)

---

## Quick reference: ad schedule specs

| Setting | Value |
|---------|-------|
| **Level** | Campaign |
| **Default** | All days, all hours (no schedule restrictions) |
| **Maximum time slots per day** | 6 |
| **Minimum slot duration** | 15 minutes |
| **Bid adjustment range** | -90% to +900% |
| **Full pause** | -100% (stops ads entirely for that slot) |
| **Time zone** | Account-level setting (cannot vary per campaign) |
| **Smart Bidding compatibility** | Schedule yes, bid adjustments ignored |

> ⚠️ **A custom ad schedule does not mean ads only run during those hours by default:** Creating a schedule with specific time slots restricts delivery to those slots. If you want 24/7 delivery with bid adjustments, create slots covering all hours and apply adjustments to specific slots.

---

## Configuration mechanics

### Where the setting lives

Ad schedule is a campaign-level setting, edited from the **Ad schedule** entry in the campaign's left menu. Configuration is owned by [SOP - Optimize Ad Schedule](../sops/SOP – Optimize Ad Schedule.md), Phase 3.

### Time slot rules

| Rule | Details |
|------|---------|
| Slots cannot overlap | Two slots on the same day cannot cover the same hours |
| Slots must align to 15-minute increments | Start and end times snap to :00, :15, :30, :45 |
| Maximum 6 slots per day | Split the day into at most 6 distinct blocks |
| Gaps mean no delivery | Hours not covered by any slot receive zero impressions |

### Example schedule (B2B lead gen)

| Day | Time slot | Bid adjustment |
|-----|-----------|----------------|
| Monday to Friday | 7:00 AM to 9:00 AM | +0% (research hours) |
| Monday to Friday | 9:00 AM to 12:00 PM | +20% (peak business hours) |
| Monday to Friday | 12:00 PM to 1:00 PM | +0% (lunch dip) |
| Monday to Friday | 1:00 PM to 5:00 PM | +20% (peak business hours) |
| Monday to Friday | 5:00 PM to 10:00 PM | -20% (after hours) |
| Saturday to Sunday | Not scheduled | No delivery |

---

## Hour-of-week performance analysis

### Data requirements

| Requirement | Minimum |
|-------------|---------|
| Date range | 2 to 4 weeks |
| Clicks per time slot | 50+ for reliable patterns |
| Conversion volume | 10+ per slot for conversion-based decisions |

### Where the data comes from

Hour-of-week data is a Google Ads report segmented by **Hour of day** and **Day of week**, carrying clicks, impressions, conversions, cost and conversion value. The pull is owned by [SOP - Optimize Ad Schedule](../sops/SOP – Optimize Ad Schedule.md), Phase 1.

### Key metrics per slot

| Metric | What it tells you |
|--------|------------------|
| **CPA by slot** | Which hours convert cheaply vs. expensively |
| **ROAS by slot** | Which hours generate the most value per € spent |
| **Conversion rate by slot** | Which hours have the highest intent users |
| **Click volume by slot** | Which hours have enough data to trust |

### Pattern validation

| Condition | Reading |
|-----------|---------|
| Pattern present in 3+ of 4 weeks | Reliable |
| Pattern present in 1 of 4 weeks | Noise |
| Slot below 50 clicks | Insufficient data, no reading |

---

## Bid adjustment calculation

### CPA-based formula

```
Adjustment % = (Time slot CPA / Average CPA - 1) x 100
```

**Example:** Average CPA is 40 EUR. Tuesday 9 AM to 12 PM CPA is 30 EUR.
Adjustment = (30 / 40 - 1) x 100 = -25%. This slot performs 25% better than average, so bid +25% (inverse: increase bids where CPA is lower).

> ⚠️ **The formula gives you the performance delta, not the bid direction:** If a slot has lower CPA (better performance), increase bids to capture more volume. If a slot has higher CPA (worse performance), decrease bids.

### ROAS-based formula

```
Adjustment % = (Time slot ROAS / Average ROAS - 1) x 100
```

**Example:** Average ROAS is 400%. Sunday evening ROAS is 520%.
Adjustment = (520 / 400 - 1) x 100 = +30%. Bid up 30% for Sunday evenings.

### Adjustment guardrails

| Guardrail | Rule |
|-----------|------|
| Initial cap | +/- 30% on first application |
| Ramp period | 2 weeks before the range widens on results |
| Full pause (-100%) | Reserve for hours with zero business value (e.g., B2B weekends, overnight for call-only campaigns) |
| Maximum positive | +50%, above which the slot needs very high data volume to support the adjustment |

---

## Smart Bidding interaction

### What Smart Bidding does with ad schedules

| Component | Smart Bidding behavior |
|-----------|----------------------|
| **Ad schedule (time slots)** | Respected: ads only run during scheduled slots |
| **Bid adjustments on slots** | Ignored: Smart Bidding sets its own time-of-day bids |
| **Time-of-day optimization** | Built-in: Smart Bidding uses time signals automatically |

### When to use schedule adjustments

| Bid strategy | Use schedule adjustments? |
|--------------|--------------------------|
| Manual CPC | Yes, full control over time-based bids |
| Target CPA | No, adjustments are ignored |
| Target ROAS | No, adjustments are ignored |
| Maximize Conversions | No, adjustments are ignored |
| Maximize Conversion Value | No, adjustments are ignored |

Under Smart Bidding, the only working way to stop delivery in a given hour is the schedule itself: a -100% adjustment on that slot has no effect, because Smart Bidding respects the schedule and ignores the adjustments.

### Budget pacing interaction

Ad schedules control when ads show, not how much a campaign spends in total. The monthly spending limit is unaffected by the schedule, so a restricted schedule concentrates the same monthly total into fewer active hours and raises the per-hour spend rate. The daily budget is the only control on total spend. The monthly cap mechanics are owned by [Budget Pacing Reference](../references/Budget Pacing Reference.md).

---

## Business hours vs. conversion hours

| Vertical | Research hours | Peak conversion hours | Schedule recommendation |
|----------|---------------|----------------------|------------------------|
| **Lead gen** | 9 AM to 5 PM weekdays | 6 PM to 10 PM weekdays | Run 24/7, bid up evenings if using Manual CPC |
| **B2B SaaS** | 9 AM to 6 PM weekdays | 10 AM to 4 PM weekdays | Consider pausing weekends, bid up business hours |
| **Ecommerce** | All hours, peak evenings | 7 PM to 11 PM, weekends | Run 24/7, no schedule restrictions |

### Time zone considerations

| Scenario | Approach |
|----------|---------|
| Single-country targeting | Schedule based on account time zone |
| Multi-region, different time zones | Split campaigns by region for precise scheduling |
| Global campaigns | Use 24/7 schedule, let Smart Bidding handle time optimization |

> 💡 **The account time zone is set at account creation and cannot be changed:** All ad schedules reference this single time zone. If your target audience spans multiple time zones and timing precision matters, create separate campaigns per region.

---

## Decision guide

| Situation | Recommendation |
|-----------|---------------|
| Using Smart Bidding, no hours to exclude | No schedule needed: Smart Bidding handles time optimization |
| Using Smart Bidding, need to pause specific hours | Set schedule to exclude those hours, no bid adjustments |
| Using Manual CPC, clear hourly performance patterns | Set schedule with bid adjustments based on data |
| B2B with no weekend value | Pause weekends via schedule, which concentrates budget into weekdays without reducing the monthly total |
| Call-only campaigns outside business hours | Pause outside staffed hours, which concentrates budget into staffed hours without reducing the monthly total |
| New campaign, no data yet | Run 24/7 for 2 to 4 weeks, then analyze |

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Setting bid adjustments on Smart Bidding campaigns | Adjustments are ignored, creates false confidence | Remove adjustments, use schedule-only for pausing |
| Applying adjustments based on one week of data | Single-week anomalies treated as patterns | Require 2 to 4 weeks and 50+ clicks per slot |
| Starting with extreme adjustments (+/- 60%+) | Over-correction destabilizes performance | Cap initial adjustments at +/- 30% |
| Forgetting schedule gaps stop delivery | Leaving hours uncovered kills volume | Cover all intended delivery hours with slots |
| Not accounting for time zones in multi-geo campaigns | Schedule misaligned with target audience | Split campaigns by region if timing precision matters |
| Using -100% instead of removing the time slot | Same result but harder to audit | Remove slots entirely when you want zero delivery |
| Using ad schedules to reduce total spend | The monthly cap applies regardless of schedule | Lower the daily budget to reduce spend: ad schedules only control timing |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | How Smart Bidding handles time-of-day signals internally |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metrics used in hour-of-week analysis |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Ad schedule as part of campaign configuration |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Target calculations that inform adjustment decisions |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | How budget interacts with scheduled delivery windows |

---

## Version details

- **Version:** 2.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
