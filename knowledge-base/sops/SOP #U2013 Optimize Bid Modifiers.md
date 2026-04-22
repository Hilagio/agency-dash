# SOP – Optimize Bid Modifiers
Created: 2026-02-14

SOP_ID: SOP_69
Status: Done
Category: Bidding
Primary Outcome: Bid modifiers set per segment based on performance data, improving efficiency
Agent_Executable: No
Human_Approval_Required: No
Domain: Bidding
Pillar: 9

### Purpose

This SOP walks you through analyzing segment-level performance and applying bid modifier adjustments to improve efficiency across device, location, ad schedule, audience, and demographic dimensions.

> ❓ **The big question:** Which audience segments are over- or underperforming, and how should I adjust bids to match?

---

### What this SOP is NOT

This SOP does **not:**

- Help you select a bid strategy (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Optimize Smart Bidding campaigns, which handle segment-level adjustments automatically (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Allocate budget across campaigns (See: [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md))
- Provide reference specs for modifier types or stacking rules (See: [Bid Modifier Reference](../references/Bid Modifier Reference.md))

### When to run this SOP

Run this SOP when:

- Monthly optimization cycle for Manual CPC campaigns
- Specific segments show 30%+ variance from campaign average CPA or ROAS
- Campaign optimization cycle flags segment analysis as a priority
- Launching into a new market or device category where default bids need adjustment
- Post-launch data has accumulated (30+ days, 100+ clicks per segment)

---

### Before you start

#### Required inputs

- Campaign using Manual CPC bid strategy (not Smart Bidding)
- 30+ days of performance data with conversion tracking active
- Access to Google Ads segment reports (device, location, ad schedule, audience, demographics)
- Campaign-level CPA or ROAS benchmarks from unit economics
- Breakeven CPA or minimum ROAS from [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Bid Modifier Reference](../references/Bid Modifier Reference.md) | Modifier ranges, stacking rules, Smart Bidding interaction |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Confirming bid strategy type and modifier eligibility |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Metric definitions and calculation methods |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Breakeven and target calculations for guardrails |

---

### Decision gate: Smart Bidding check

Before proceeding, confirm your bid strategy type:

| If... | Then... |
|-------|---------|
| Manual CPC | Proceed with this SOP, all modifiers available |
| Target CPA, Target ROAS, Max Conversions, or Max Conversion Value | STOP. Smart Bidding ignores all modifiers except device -100%. Skip this SOP. |
| Smart Bidding but you need to exclude a device entirely | Apply device -100% only, skip all other modifier types |

> ⚠️ **Smart Bidding handles segment optimization internally at auction time:** Setting location, schedule, audience, or demographic modifiers on Smart Bidding campaigns has zero effect. The only exception is device -100% to completely exclude a device.

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Determine modifier eligibility** | Confirm bid strategy, identify available modifier types, export data | Eligible modifier list, raw segment data exported |
| **Phase 2️⃣: Analyze segment performance** | Calculate variance per segment, flag over/underperformers | Flagged segments with variance percentages |
| **Phase 3️⃣: Calculate and apply modifiers** | Compute starting adjustments, cap them, apply in Google Ads | Modifiers applied, changes documented |
| **Phase 4️⃣: Validate and monitor** | Wait, compare before/after, adjust if overcorrected | Validated modifiers, next cycle planned |

---

## Phase 1️⃣: Determine modifier eligibility

### 1.1 Confirm bid strategy type

Open the campaign settings and verify the bid strategy:

1. Navigate to the campaign in Google Ads
2. Go to Settings > Bidding
3. Confirm the strategy is Manual CPC

If the campaign uses any Smart Bidding strategy (Target CPA, Target ROAS, Maximize Conversions, Maximize Conversion Value), stop here. Smart Bidding ignores all modifiers except device -100%.

### 1.2 Identify available modifier types

Review which modifier dimensions apply to this campaign:

| Modifier type | Check | Proceed if |
|---------------|-------|------------|
| Device | Always available | Campaign targets multiple devices |
| Location | Location targeting is set | Campaign targets multiple locations |
| Ad schedule | Ad schedule is configured | Campaign runs on a defined schedule |
| Audience (RLSA) | Audience lists are attached | Campaign has observation-mode audiences |
| Demographics (age, gender, household income) | Demographics reporting is active | Campaign targets demographics-eligible networks |

### 1.3 Export segment performance data

For each eligible modifier type, pull segment reports covering the last 30-90 days:

1. Open the campaign in Google Ads
2. Navigate to the relevant segment tab (Devices, Locations, Ad Schedule, Audiences, Demographics)
3. Set the date range to last 30 days minimum (60-90 days for low-volume campaigns)
4. Export to spreadsheet with these columns: segment name, clicks, impressions, conversions, conversion value, cost, CPA, ROAS

### 1.4 Record campaign baseline

| Metric | Campaign average |
|--------|-----------------|
| Total clicks (period) | |
| Total conversions (period) | |
| Total cost (period) | |
| Campaign average CPA | |
| Campaign average ROAS | |
| Breakeven CPA or minimum ROAS | |

---

## Phase 2️⃣: Analyze segment performance

### 2.1 Check minimum data thresholds

Before analyzing any segment, confirm it has enough data to be actionable:

| Threshold | Minimum | Why |
|-----------|---------|-----|
| Clicks per segment | 100+ | Below 100 clicks, variance is likely noise |
| Conversions per segment | 10+ | Below 10 conversions, CPA is unreliable |
| Spend per segment | Meaningful relative to campaign | Tiny spend segments do not warrant modifiers |

Segments below these thresholds get no modifier. Mark them "insufficient data" and skip.

### 2.2 Calculate variance from campaign average

For each segment that meets the data threshold, calculate the variance:

**CPA-based formula:**
Variance = (Segment CPA / Campaign Average CPA - 1) x 100

**ROAS-based formula:**
Variance = (Segment ROAS / Campaign Average ROAS - 1) x 100

### 2.3 Flag segments by variance

Record each segment in the analysis worksheet:

| Segment | Clicks | Conversions | CPA | ROAS | Variance (%) | Flag |
|---------|--------|-------------|-----|------|--------------|------|
| | | | | | | |

Use this flagging logic:

| Segment performance (CPA-based) | Flag | Action direction |
|----------------------------------|------|------------------|
| CPA 30%+ below campaign average | Strong performer | Increase modifier |
| CPA within 30% of campaign average | Average performer | No change |
| CPA 30-50% above campaign average | Weak performer | Decrease modifier |
| CPA 50%+ above campaign average | Poor performer | Strong decrease or exclusion |
| Zero conversions, significant spend (50+ clicks) | Non-converter | Consider -100% exclusion |

| Segment performance (ROAS-based) | Flag | Action direction |
|-----------------------------------|------|------------------|
| ROAS 30%+ above campaign average | Strong performer | Increase modifier |
| ROAS within 30% of campaign average | Average performer | No change |
| ROAS 30-50% below campaign average | Weak performer | Decrease modifier |
| ROAS 50%+ below campaign average | Poor performer | Strong decrease or exclusion |
| Zero conversions, significant spend (50+ clicks) | Non-converter | Consider -100% exclusion |

### 2.4 Prioritize modifier dimensions

If multiple dimensions have flagged segments, prioritize by impact:

| Priority | Dimension | Why |
|----------|-----------|-----|
| 1 | Device | Largest behavioral difference, highest spend variance |
| 2 | Location | Geographic performance varies significantly |
| 3 | Ad schedule | Time-of-day and day-of-week patterns are actionable |
| 4 | Audience (RLSA) | Audience list quality drives conversion rate differences |
| 5 | Demographics | Often lower data volume, apply last |

---

## Phase 3️⃣: Calculate and apply modifiers

### 3.1 Calculate starting modifiers

Use the performance-based formula for each flagged segment:

**CPA-based campaigns:**
Starting modifier = (Campaign Average CPA / Segment CPA - 1) x 100

**ROAS-based campaigns:**
Starting modifier = (Segment ROAS / Campaign Average ROAS - 1) x 100

**Example (CPA-based):**

| Segment | Segment CPA | Campaign CPA | Raw modifier |
|---------|-------------|-------------|--------------|
| Mobile | €35 | €50 | +43% |
| Desktop | €50 | €50 | 0% |
| Tablet | €85 | €50 | -41% |

### 3.2 Cap initial adjustments

Never apply the raw calculated modifier directly. Cap initial adjustments to prevent overcorrection:

| Cap rule | Maximum initial adjustment |
|----------|---------------------------|
| Positive modifiers | Cap at +30% |
| Negative modifiers | Cap at -30% |
| Exclusions (-100%) | Only for segments with zero conversions after 200+ clicks |

After the first evaluation cycle (2+ weeks), expand caps to +/- 50% if initial data supports it.

> 💡 **Start conservative, adjust incrementally:** Overcorrecting causes volume collapse. A segment doing 40% better than average warrants a +30% modifier initially, not +43%. Validate, then expand.

### 3.3 Apply modifiers in Google Ads

Apply modifiers in order of highest-spend segments first:

1. Open the campaign in Google Ads
2. Navigate to the relevant segment tab
3. Click the bid adjustment column for the segment
4. Enter the calculated (capped) modifier
5. Save the change
6. Repeat for each flagged segment

### 3.4 Document all changes

Record every modifier applied for post-check comparison:

| Dimension | Segment | Previous modifier | New modifier | Date applied | Rationale |
|-----------|---------|-------------------|-------------|-------------|-----------|
| Device | Mobile | 0% | +30% | | CPA 30% below average |
| Device | Tablet | 0% | -30% | | CPA 70% above average |
| Location | [City] | 0% | +20% | | CPA 25% below average |

### 3.5 Stacking awareness

When applying modifiers across multiple dimensions, remember that modifiers stack multiplicatively, not additively.

**Example:** A mobile user (+30%) in a high-performing location (+20%) during peak hours (+15%) gets a combined adjustment of:
1.30 x 1.20 x 1.15 = 1.794 (a 79.4% increase, not 65%)

Check the [Bid Modifier Reference](../references/Bid Modifier Reference.md) for full stacking rules. Avoid combining more than three positive modifiers on the same dimension combination to prevent bid inflation.

---

## Phase 4️⃣: Validate and monitor

### 4.1 Set the evaluation timeline

| Timeframe | Action |
|-----------|--------|
| Days 1-14 | No changes. Let modifiers run and collect data. |
| Day 14 | Pull initial comparison data. Check for volume collapse or bid inflation. |
| Day 21-30 | Full evaluation with before/after comparison. |

### 4.2 Compare before and after performance

Pull segment-level data for the period after modifiers were applied (exclude the first 3 days as a stabilization buffer):

| Segment | CPA before | CPA after | Change | Volume before | Volume after | Change |
|---------|-----------|-----------|--------|--------------|-------------|--------|
| | | | | | | |

### 4.3 Evaluate and adjust

| Result | Action |
|--------|--------|
| Segment CPA improved, volume stable or increased | Modifier is working. Keep or expand toward the full calculated value. |
| Segment CPA improved, volume dropped significantly (>30%) | Modifier is too aggressive. Halve the modifier. |
| Segment CPA worsened | Remove the modifier. Investigate root cause. |
| Overall campaign CPA improved | Modifiers are net positive. Move to next cycle. |
| Overall campaign CPA worsened | Roll back all modifiers. Re-analyze with a longer data window. |

### 4.4 Handle volume collapse

If a negative modifier causes volume to drop to near-zero without improving overall campaign performance:

1. Reduce the modifier by half (e.g., -30% becomes -15%)
2. Wait another 2 weeks
3. If volume is still collapsed, remove the modifier entirely
4. Consider whether the segment should be excluded (-100%) or left unmodified

### 4.5 Final validation checklist

- [ ] All modified segments have 2+ weeks of post-change data
- [ ] No segment experienced unintended volume collapse
- [ ] Overall campaign CPA or ROAS improved or held steady
- [ ] Stacking effects checked for segments with multiple modifiers
- [ ] All changes documented in the modifier tracking sheet

---

### Validation & definition of done

This SOP is complete when:

- [ ] Bid strategy confirmed as Manual CPC (Smart Bidding campaigns excluded)
- [ ] Segment performance data exported and analyzed for all eligible modifier types
- [ ] Variance calculated per segment with data thresholds enforced
- [ ] Starting modifiers calculated, capped, and applied
- [ ] All changes documented with rationale
- [ ] 2+ week evaluation period completed
- [ ] Before/after comparison shows net positive or neutral impact
- [ ] Overcorrections identified and adjusted

---

### Exit → entry bridge

Once modifiers are validated and stable:

| Timeframe | Action |
|-----------|--------|
| Monthly | Re-run this SOP to refresh modifiers based on latest data |
| After seasonal shifts | Re-analyze segments, as performance patterns change with seasons |
| When migrating to Smart Bidding | Remove all modifiers except device -100% (Smart Bidding ignores them) |
| Quarterly | Full reset: remove all modifiers, re-analyze from scratch to avoid stale adjustments |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Campaign migrated to Smart Bidding | Remove all modifiers. See [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) |
| Modifiers causing bid inflation | Check stacking in [Bid Modifier Reference](../references/Bid Modifier Reference.md), reduce overlapping modifiers |
| Targets need recalculating | [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) |
| Budget needs reallocation | [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) |

---

### FAQ

**Q: Can I use bid modifiers on Smart Bidding campaigns?**

A: No. Smart Bidding ignores all bid modifiers except device -100%. If you set a +30% mobile modifier on a Target CPA campaign, it has zero effect. Smart Bidding adjusts bids per segment automatically at auction time using its own signals.

**Q: How long should I wait before evaluating modifiers?**

A: Wait at least 2 weeks. Shorter windows do not provide enough post-change data for reliable comparison, especially for segments with moderate volume. For low-volume segments, extend to 3-4 weeks.

**Q: What if a segment has enough clicks but zero conversions?**

A: If a segment has 200+ clicks and zero conversions, consider a -100% exclusion. If it has 50-200 clicks with zero conversions, apply a -50% to -70% modifier and wait for more data before excluding entirely.

**Q: Should I apply modifiers at the campaign or ad group level?**

A: Apply at the campaign level for device, location, and ad schedule. Apply at the ad group level for audiences and demographics only if ad groups have enough individual data (100+ clicks per segment per ad group). Campaign-level is safer for most accounts.

---

### Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Bid Modifier Reference](../references/Bid Modifier Reference.md) | Reference | Phase 1 (eligibility), Phase 3 (stacking rules) |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Decision gate (strategy check) |
| [Google Ads Metrics Reference](../references/Google Ads Metrics Reference.md) | Reference | Phase 2 (metric definitions) |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | Reference | Phase 2 (breakeven guardrails) |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream (determines if modifiers are applicable) |
| [SOP – Calculate Bid Targets](../sops/SOP – Calculate Bid Targets.md) | Upstream (provides CPA/ROAS targets for variance analysis) |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Parallel (budget changes may interact with modifier adjustments) |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Downstream (after modifiers stabilize, scale overall targets) |
| [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) | Conditional (when ready to move off Manual CPC, remove modifiers) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Applying modifiers on Smart Bidding campaigns | Not checking bid strategy type first | Complete the decision gate before any analysis |
| Acting on insufficient data | Segment has 20 clicks and 1 conversion | Enforce 100-click, 10-conversion minimums per segment |
| Overcorrecting with large modifiers | Using the raw formula output without capping | Cap initial modifiers at +/- 30%, expand after validation |
| Ignoring multiplicative stacking | Treating multiple modifiers as additive | Calculate combined effect before applying, check the stacking table |
| Never re-evaluating modifiers | Set-and-forget mentality | Re-run monthly, full reset quarterly |
| Removing all modifiers when migrating to Smart Bidding | Forgetting device -100% exclusions still work | Keep intentional device exclusions, remove everything else |

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
