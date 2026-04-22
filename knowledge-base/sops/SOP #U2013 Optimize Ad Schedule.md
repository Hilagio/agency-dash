# SOP – Optimize Ad Schedule
Created: 2026-02-14
Updated: 2026-04-02

SOP_ID: SOP_70
Status: Done
Category: Bidding
Primary Outcome: Ad schedule optimized with time-based bid adjustments or pause windows
Agent_Executable: No
Human_Approval_Required: No
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through analyzing hour-of-week performance data and configuring ad schedule adjustments to concentrate budget during high-converting time periods.

> ❓ **The big question:** Which hours and days produce conversions at an acceptable cost, and how do you shift spend toward those windows?

---

### What this SOP is NOT

This SOP does **not:**

- Help you select or change your bid strategy (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Calculate or adjust your CPA/ROAS/POAS targets (See: [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md))
- Cover bid modifier math or syntax (See: [Bid Modifier Reference](../references/Bid Modifier Reference.md))
- Cover budget allocation or pacing (See: [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md))

### When to run this SOP

Run this SOP when:

- A campaign has 30+ days of data and you suspect time-of-day or day-of-week waste
- CPA or ROAS varies significantly across time slots (30%+ deviation from average)
- Budget is constrained and you need to eliminate low-performing windows
- You are running Manual CPC and want time-based bid adjustments
- You are running Smart Bidding and want to pause ads entirely during dead windows

---

### Before you start

#### Required inputs

- Campaign with 30-60 days of stable performance data
- Access to Google Ads reporting (hour-of-day and day-of-week segments)
- Current bid strategy identified (Manual CPC vs. Smart Bidding)
- Conversion tracking verified and working

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Ad Schedule Reference](../references/Ad Schedule Reference.md) | Schedule configuration rules, slot limits |
| [Bid Modifier Reference](../references/Bid Modifier Reference.md) | Bid adjustment calculation and stacking |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Why Smart Bidding ignores manual adjustments |

---

### Decision gate: Bid strategy type

| If... | Then... |
|-------|---------|
| Using Manual CPC | Apply bid adjustments per time slot |
| Using Smart Bidding (tCPA, tROAS, Max Conv., Max Value) | Pause dead windows with -100% only |

> ⚠️ **Smart Bidding already optimizes by time of day internally:** The only action it respects is -100% (full pause). Any other adjustment percentage is ignored.

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Export and analyze time data** | Pull performance by hour and day | Hour-of-week performance matrix |
| **Phase 2️⃣: Identify actionable patterns** | Classify time slots by performance | Categorized slots with action tags |
| **Phase 3️⃣: Configure schedule** | Build ad schedule in Google Ads | Live schedule with adjustments |
| **Phase 4️⃣: Validate and refine** | Compare before/after | Validated, optimized schedule |

---

## Phase 1️⃣: Export and analyze time data

### 1.1 Pull the hour-of-day report

1. Open Google Ads > Reports, select the campaign(s)
2. Add segments: **Hour of day** and **Day of week**
3. Set date range: last 30-60 days (exclude the most recent conversion delay window)
4. Include columns: Clicks, Conversions, Cost, Conv. rate, Cost/conv. (CPA), Conv. value/cost (ROAS)
5. Export to a spreadsheet

### 1.2 Build the hour-of-week matrix

Create a 24-row (hours) by 7-column (days) matrix. Use CPA for lead gen campaigns, ROAS for ecommerce, or POAS for value-based bidding.

### 1.3 Validate data sufficiency

| Data level | Reliability | Action |
|-----------|-------------|--------|
| 50+ clicks per slot | Reliable | Use for bid adjustments |
| 20-49 clicks per slot | Directional | Combine into broader time blocks |
| Under 20 clicks per slot | Insufficient | Group with adjacent hours |

> 💡 **Low-volume accounts need broader blocks:** Group into 3-4 hour blocks (morning, midday, afternoon, evening) if individual hour slots have under 20 clicks.

### 1.4 Check for consistency

Do not act on single-week anomalies. Split the date range into individual weeks and verify the same hours/days show high or low performance across 4+ weeks. Slots where performance flips between weeks are noise, not signal.

---

## Phase 2️⃣: Identify actionable patterns

### 2.1 Calculate slot-level deviation

**Formula:** Slot deviation = (Slot CPA - Average CPA) / Average CPA x 100

| Deviation | Category | Action tag |
|-----------|----------|------------|
| CPA 30%+ below average | High performer | Increase bids (Manual CPC) or leave active (Smart Bidding) |
| CPA within 30% of average | Average | No adjustment needed |
| CPA 30-60% above average | Low performer | Decrease bids (Manual CPC) or monitor (Smart Bidding) |
| CPA 60%+ above average or zero conversions | Dead window | Pause (-100%) |

### 2.2 Vertical-specific starting hypotheses

| Vertical | Typical peak hours | Typical low hours |
|----------|-------------------|-------------------|
| Ecommerce | Evenings (18:00-22:00), weekends | Late night (01:00-06:00) |
| Lead gen | Evenings (18:00-21:00) | Weekends (varies by B2B vs. B2C) |
| B2B SaaS | Business hours Mon-Fri (09:00-17:00) | Weekends, late evenings |

> ⚠️ **Your data overrides any general pattern:** Always verify against actual performance before applying vertical assumptions.

---

## Phase 3️⃣: Configure schedule and adjustments

### 3.1 Plan your time slots

Google Ads allows up to 6 time slots per day with a 15-minute minimum duration. Slots cannot overlap. Hours not covered are paused. Group adjacent hours with similar performance into single slots.

### 3.2 Calculate bid adjustments (Manual CPC only)

**Formula:** Bid adjustment = (Target CPA / Slot CPA - 1) x 100

| Slot CPA relative to target | Bid adjustment | Effect |
|-----------------------------|----------------|--------|
| 30% below target | +40% to +50% | Capture more volume in cheap slots |
| Matches target | 0% | No change |
| 30% above target | -20% to -30% | Reduce spend in expensive slots |
| 60%+ above target | -50% to -70% | Nearly suppress |
| No conversions, significant spend | -100% | Full pause |

> ↪️ **See [Bid Modifier Reference](../references/Bid Modifier Reference.md)** for stacking rules and the -90% to +900% allowed range.

### 3.3 Configure for Smart Bidding campaigns

Only pause confirmed dead windows: zero conversions with meaningful spend over 30+ days, consistent across multiple weeks. Apply -100% to those slots only. Do not apply any other adjustment percentage.

### 3.4 Apply the schedule in Google Ads

1. Navigate to the campaign > Ad schedule, click the pencil icon
2. Add each time slot for each day
3. For Manual CPC: enter the calculated bid adjustment per slot
4. For Smart Bidding: set -100% on dead windows only
5. Save and verify all slots are active

---

## Phase 4️⃣: Validate and refine

### 4.1 Wait for sufficient data

| Account volume | Minimum evaluation period |
|---------------|--------------------------|
| High (100+ conversions/week) | 2 weeks |
| Medium (25-99 conversions/week) | 3 weeks |
| Low (under 25 conversions/week) | 4 weeks |

### 4.2 Compare before vs. after

Pull the same hour-of-day x day-of-week report for the post-schedule period. Compare total conversions, total cost, overall CPA/ROAS, conversion rate, and impression share against the pre-schedule baseline.

### 4.3 Check for over-restriction

| Warning sign | Likely cause | Fix |
|-------------|-------------|-----|
| Conversions dropped 20%+ | Too many hours paused or adjustments too negative | Reactivate marginal slots |
| IS dropped in peak hours | Competitors filled your paused windows | Widen active windows |
| CPA stayed flat | Low-CPA hours lacked volume to offset cuts | Schedule was not the constraint |

After the evaluation period, recalculate slot-level performance with fresh data, fine-tune adjustments on confirmed winners, and re-evaluate paused windows quarterly.

---

### Validation & definition of done

This SOP is complete when:

- [ ] Hour-of-week performance matrix built with 30-60 days of data
- [ ] Data sufficiency validated (50+ clicks per slot or grouped into blocks)
- [ ] Pattern consistency confirmed across 4+ weeks
- [ ] Ad schedule configured in Google Ads with correct adjustments
- [ ] Evaluation period completed (2-4 weeks post-implementation)
- [ ] Before/after comparison shows improved efficiency without excessive volume loss

---

### Exit → entry bridge

Once the ad schedule is validated:

| Timeframe | Action |
|-----------|--------|
| Monthly | Spot-check slot performance, adjust if deviation has shifted |
| Quarterly | Full re-analysis (repeat Phase 1-2) to catch seasonal shifts |
| After major changes | Re-run this SOP if bid strategy, campaigns, or targeting changes |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Performance degrades after schedule changes | Revert to 24/7 schedule, investigate root cause |
| Bid adjustments stacking unexpectedly | [Bid Modifier Reference](../references/Bid Modifier Reference.md) |
| Smart Bidding drops after pausing windows | Remove -100% adjustments |
| Budget constrained in active hours | [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) |

---

### FAQ

**Q: Should I optimize ad schedule on Smart Bidding campaigns?**

A: Only if you have dead windows with zero conversions and meaningful spend over 30+ days. Smart Bidding already adjusts bids by time of day. The only action it respects is -100% (full pause).

**Q: How much data do I need before making schedule adjustments?**

A: Minimum 30 days with 50+ clicks per time slot. For low-volume accounts, group hours into 3-4 hour blocks. Never act on a single week of data.

**Q: Should I schedule ads to match business hours?**

A: Not automatically. Business hours and conversion hours often differ. Let data determine your schedule.

**Q: Do schedule adjustments stack with device and location adjustments?**

A: Yes. They multiply. A +20% time adjustment with a +30% device adjustment = +56% total, not +50%. See the [Bid Modifier Reference](../references/Bid Modifier Reference.md).

---

### Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Ad Schedule Reference](../references/Ad Schedule Reference.md) | Reference | Phase 3 |
| [Bid Modifier Reference](../references/Bid Modifier Reference.md) | Reference | Phase 3 |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Decision gate |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (bid strategy determines available actions) |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (targets used for adjustment calculation) |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Related (budget redistribution) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Related (scaling may require revisiting schedule) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Acting on insufficient data | Single-week anomaly or low volume | Require 50+ clicks per slot and 4+ weeks |
| Percentage adjustments on Smart Bidding | Only -100% works | Use -100% only on Smart Bidding |
| Over-restricting active hours | Pausing too many slots | Start conservative, tighten gradually |
| Ignoring bid adjustment stacking | Adjustments multiply | Calculate combined adjustment first |
| Set and forget | Behavior shifts seasonally | Re-analyze quarterly |

---

### Version details

- **Version:** 2.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
