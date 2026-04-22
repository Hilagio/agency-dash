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

### How to set an ad schedule

1. Open the campaign, navigate to **Ad schedule** in the left menu
2. Click the pencil icon to edit
3. Select days and time ranges, then save

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

### How to extract the data

1. Go to **Reports** in Google Ads, create a custom report
2. Add dimensions: Day of week, Hour of day
3. Add metrics: Clicks, Impressions, Conversions, Cost, Conversion value

### Key metrics per slot

| Metric | What it tells you |
|--------|------------------|
| **CPA by slot** | Which hours convert cheaply vs. expensively |
| **ROAS by slot** | Which hours generate the most value per € spent |
| **Conversion rate by slot** | Which hours have the highest intent users |
| **Click volume by slot** | Which hours have enough data to trust |

### Pattern validation

- Compare week-over-week patterns before applying adjustments
- Ignore slots with fewer than 50 clicks (insufficient data)
- Flag patterns that appear in 3+ of 4 weeks as reliable
- Treat patterns appearing in only 1 of 4 weeks as noise

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
| Initial cap | Limit adjustments to +/- 30% when first applying |
| Ramp period | Run for 2 weeks, then expand range based on results |
| Full pause (-100%) | Reserve for hours with zero business value (e.g., B2B weekends, overnight for call-only campaigns) |
| Maximum positive | Rarely exceed +50% unless data volume is very high |

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

To stop ads during certain hours while using Smart Bidding, do not use bid adjustments. Set the ad schedule itself to exclude those hours. Smart Bidding respects the schedule, just not the adjustments.

### Budget pacing interaction

Ad schedules control WHEN ads show but do not reduce total monthly spend. The full monthly budget (30.4x daily budget) concentrates into scheduled hours.

| Schedule configuration | Monthly budget | Per-hour spend rate |
|------------------------|---------------|---------------------|
| 24 hours/day | 30.4x daily budget | Standard |
| 12 hours/day | 30.4x daily budget | ~2x standard rate per active hour |
| 8 hours/day | 30.4x daily budget | ~3x standard rate per active hour |

Campaigns with limited schedules see higher per-hour spend rates because the same monthly total is distributed across fewer active hours. To reduce total spend, lower the daily budget.

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
| B2B with no weekend value | Pause weekends via schedule (budget concentrates into weekdays, does not reduce monthly total: lower daily budget to reduce spend) |
| Call-only campaigns outside business hours | Pause outside staffed hours (budget concentrates into staffed hours: lower daily budget to reduce spend) |
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
| Using ad schedules to reduce total spend | Monthly cap (30.4x daily budget) applies regardless of schedule | Lower the daily budget to reduce spend: ad schedules only control timing |

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
