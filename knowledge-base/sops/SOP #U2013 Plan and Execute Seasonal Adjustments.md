# SOP – Plan and Execute Seasonal Adjustments
Created: 2026-04-04

Agent_Executable: No
Category: Operational
Human_Approval_Required: Yes
Primary Outcome: Account fully prepared for and optimized during a seasonal peak event, with all settings reverted immediately after
SOP_ID: SOP_94
Secondary Outcomes: YoY benchmark established, seasonal assets deployed, budget pacing tracked, immediate post-peak reversion completed
Status: ready-to-publish
Domain: Operational
Pillar: 0

### Purpose

This SOP walks you through the end-to-end process of preparing for, executing during, and immediately cleaning up after a seasonal peak event (Black Friday, Christmas, Back to School, or any time-bound sales period).

> ❓ **The big question:** How do I systematically capture seasonal demand without disrupting Smart Bidding stability or leaving inflated settings active after the peak?

This SOP covers Phases 1 through 4 of the Seasonal Optimization Lifecycle. Phase 5 (Retrospective) is handled by [SOP – Run Post-Peak Season Normalization](../sops/SOP – Run Post-Peak Season Normalization.md).

---

### What this SOP is NOT

This SOP does **not:**

- Define the strategic framework for seasonal optimization (See: [Seasonal Optimization Mental Model](../mental-models/Seasonal Optimization Mental Model.md))
- Cover promotional extension syntax or specifications (See: [Promotional Extensions Reference](../references/Promotional Extensions Reference.md))
- Handle post-peak retrospective and documentation (See: [SOP – Run Post-Peak Season Normalization](../sops/SOP – Run Post-Peak Season Normalization.md))
- Explain general bid scaling mechanics (See: [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md))

### When to run this SOP

Run this SOP when:

- A seasonal peak event is 6-8 weeks away (Black Friday, Christmas, industry-specific peak)
- The client has confirmed they will run seasonal promotions or adjust pricing
- Historical data exists for at least one prior occurrence of this event (or a comparable period)

---

### Before you start

#### Required inputs

- Prior year performance data for the same seasonal period (minimum: account-level daily data)
- Client's seasonal strategy: offers, discounts, promotional calendar, budget approval
- Access to Google Ads, Merchant Center, and Google Analytics
- Current bid targets (tCPA/tROAS) and daily budgets for all active campaigns
- Seasonal keyword list (if returning from last year) or keyword research for new seasonal terms

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Seasonal Optimization Mental Model](../mental-models/Seasonal Optimization Mental Model.md) | Lifecycle phases, Smart Bidding rules, decision framework |
| [Promotional Extensions Reference](../references/Promotional Extensions Reference.md) | Promotional element specs and timing |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Budget pacing mechanics during peak |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | Countdown timer and ad customizer syntax |

---

### Execution framework

| **Phase** | **Purpose** | **Timing** | **Duration** |
|-----------|-----------|-----------|-------------|
| 1️⃣ Historical Analysis | YoY benchmarks, set targets | T-8 to T-6 weeks | 2 weeks |
| 2️⃣ Pre-Season Setup | Build assets, configure account | T-6 to T-2 weeks | 4 weeks |
| 3️⃣ Peak Execution | Maximize capture, monitor live | During event | 1 day to 2 weeks |
| 4️⃣ Immediate Cleanup | Revert settings, cut waste | T+0 to T+3 days | 1-3 days |

---

## Phase 1️⃣: Historical Analysis (T-8 to T-6 weeks)

### 1.1 Pull YoY comparison data

1. In Google Ads, navigate to Campaigns and apply the date range for last year's equivalent period
2. Filter: "Campaign name does not contain Brand" (analyze non-brand separately)
3. Segment data by day (Segment > Time > Day)
4. Add columns: CTR, Avg. CPC, Cost, Conversions, Cost/conv., Conv. rate, Conv. value, Conv. value/cost, Search lost IS (budget), Search lost IS (rank), Click Lost, Conversion Lost (Budget), Revenue Lost (Budget), Clicks Lost (Ad Rank), Conversion Lost (Ad Rank), Revenue Lost (Ad Rank)
5. Export to spreadsheet

### 1.2 Segment into three periods

Color-code or tag each day:
- **Pre-peak:** 2 weeks before the event (baseline performance)
- **Peak:** The event itself (Black Friday day, BF weekend, Cyber Monday, etc.)
- **Post-peak:** 1 week after the event (reversion period)

Calculate period averages for all key metrics. Compare peak vs. pre-peak to quantify the seasonal effect.

### 1.3 Get granular at campaign level

If data volume is sufficient (100+ conversions per campaign during the peak period), repeat the analysis at the campaign level.

> ⚠️ **PMax limitation:** No auction data (impression share, IS lost) is available at the campaign level for Performance Max. For PMax, analyze at the campaign level for spend, conversions, and ROAS only. Dig deeper into asset group and listing group performance.

### 1.4 Run the Holiday Reflection Checklist

If this is a returning seasonal event, review last year's retrospective document. Answer the checklist questions:
- Competitor Analysis: how did competitors behave in impression share? What worked for them?
- Promotional Offers: which offers drove conversions? Which failed?
- Campaign Performance: best ROI campaigns? Underperformers?
- Budget & Spend: did you hit budget limits? Pacing accuracy?

### 1.5 Set seasonal targets

Based on YoY data and client goals, define:
- Target ROAS/CPA during the peak (typically 10-20% looser than standard targets)
- Peak period daily budget (based on prior year spend + growth goal)
- Revenue target for the event
- Maximum acceptable CPC (based on prior year CPC increase, typically +25-50%)

---

## Phase 2️⃣: Pre-Season Setup (T-6 to T-2 weeks)

### 2.1 Validate the offer strategy (T-6 weeks)

1. Confirm with the client: what is the seasonal offer? (discount, bundle, added value, free shipping)
2. Proposition check: does aggressive discounting fit the brand? Not every company needs to participate
3. If discounting: calculate the maximum discount the brand can afford at different CVR levels, using historical trend data
4. Document the offer for ad copy and landing page teams

### 2.2 Prepare landing pages (T-5 weeks)

1. Build or update holiday-specific landing pages
2. Verify message match between planned ad copy and LP content
3. Test page speed (must load under 3 seconds during traffic spikes)
4. Coordinate with web team on seasonal design elements

### 2.3 Prepare product feed (T-4 weeks, Shopping/PMax only)

1. Update product titles with seasonal terms via supplemental feed (e.g., "Black Friday" prefix for promoted products)
2. Add holiday-specific `additional_image_link` and `lifestyle_image_link` attributes for deals and bundles
3. Submit feed updates: allow 3-5 business days for Merchant Center processing
4. Configure sale price annotations: verify base prices have been stable for 45-60 days
5. Set up promotions in Merchant Center with explicit start/end dates

### 2.4 Activate seasonal keywords (T-3 weeks)

1. Enable paused seasonal keywords from last year
2. Add new seasonal terms identified in trend analysis
3. Tag all seasonal keywords distinctly (label or naming convention) so they can be paused as a group post-peak
4. Verify match types align with Smart Bidding strategy

### 2.5 Create seasonal ad assets (T-3 weeks)

**Text ads:**
1. Create holiday-specific RSAs with seasonal headlines (sale as focal point, UVP, holiday references)
2. Set up ad customizers for dynamic prices, stock levels, countdown timers
3. Pin one seasonal headline to Position 1 for guaranteed visibility

**Image ads:**
1. Create holiday-specific images in all three ratios (1.91:1, 1:1, 4:5)
2. Create versions with and without text overlays
3. Upload to relevant campaigns: Search (image extensions), Display/Remarketing (RDA), PMax (asset groups), Demand Gen

**Video ads (if applicable):**
1. Produce 15-second holiday video with front-loaded offer, brand intro, emotional hook, clear CTA
2. Upload to Video, PMax, and Demand Gen campaigns

### 2.6 Configure seasonal extensions (T-2 weeks)

1. Create promotion extensions with the specific occasion tag (Black Friday, Christmas, etc.)
2. Create category-specific promotional sitelinks pointing to deal pages
3. Add seasonal callout assets (urgency, scarcity, value)
4. Set countdown customizers in headlines (start 5-7 days before deadline)
5. Set explicit start/end dates on all seasonal extensions and ads
6. Submit 2-3 business days before the event to allow for Google review

---

## Phase 3️⃣: Peak Execution (during event)

### 3.1 Configure Seasonality Bid Adjustments (event start)

For short events (1-7 days):
1. In Google Ads: Tools > Bid strategies > Advanced controls > Seasonality adjustments
2. Set the date range to cover the exact event period
3. Set the adjustment percentage based on the expected conversion rate increase during the event (e.g., if CVR typically doubles during Black Friday, set 100%)
4. Select campaign scope: all campaigns or specific campaign types
5. Do not extend an existing SBA by updating dates: create a fresh one if needed

For multi-week seasonal ramp-ups:
- Do not use SBAs. Lower ROAS targets 10-20% instead, starting 2-4 weeks before peak.

### 3.2 Adjust budgets (event start)

1. Increase daily budgets to the approved seasonal level
2. For PMax: increase gradually (20-30% per day) to prevent Display/Video waste
3. Remove budget caps on highest-performing campaigns if approved by client
4. Open max bid limits where applicable

### 3.3 Adjust bid targets (event start)

1. For multi-week peaks: lower tROAS by 10-20% or increase tCPA by 10-20%
2. For short promotions (3-7 days): do not touch ROAS targets. Use SBAs instead.
3. Group campaigns into 2-3 tiers (High/Main/Low ROAS) for differentiated target adjustments

### 3.4 Monitor in real time (during event)

1. Track CPC as the primary live metric (ROAS has conversion delay)
2. Monitor budget pacing: actual spend vs. seasonal budget plan
3. Check Search IS lost (budget) hourly on peak day: any loss = missed opportunity
4. Pull Auction Insights: compare vs. same period prior year. Seasonal vs. structural?
5. Reallocate budget from underperforming to outperforming campaigns intraday if needed

---

## Phase 4️⃣: Immediate Cleanup (T+0 to T+3 days)

### 4.1 Revert bid adjustments (day 0-1)

1. SBAs: verify they expired automatically. Check bid strategy report for confirmation.
2. If targets were lowered manually: revert tCPA/tROAS to pre-peak levels
3. If bid limits were removed: reinstate them

### 4.2 Revert budgets (day 0-1)

1. Set daily budgets back to pre-peak levels
2. For PMax: reduce gradually (same 20-30% per day approach) if spend was significantly elevated

### 4.3 Pause seasonal elements (day 0-3)

1. Pause all seasonal keywords (use the label/naming tag from Phase 2.4)
2. Remove or let seasonal extensions expire (scheduled end dates should handle this)
3. Pause seasonal ad copy (RSAs with Black Friday headlines, etc.)
4. Revert Shopping product titles via supplemental feed (allow 24-48h processing)
5. Remove seasonal image and video assets from asset groups

### 4.4 Apply Data Exclusion (if applicable)

If the event was a short, sharp spike (1-3 day sale):
1. In Google Ads: Tools > Bid strategies > Advanced controls > Data exclusions
2. Set the date range to cover the event period (account for conversion delay: if the sale was Nov 24-26 with 5-day conversion window, exclude Nov 19-26)
3. Typical duration: 3 days. Maximum recommended: 7 days.

---

### Validation & Definition of Done

- [ ] YoY benchmark report completed and shared with client
- [ ] All seasonal assets deployed (ads, extensions, keywords, feed updates)
- [ ] SBAs or target adjustments configured for peak period
- [ ] Budgets adjusted to approved seasonal levels
- [ ] Real-time monitoring executed during peak (CPC tracking, budget pacing log)
- [ ] All seasonal settings reverted within 3 days of event end
- [ ] Data Exclusion applied if applicable

---

### Exit → Entry bridge

| **Timeframe** | **Action** |
|--------------|-----------|
| T+1 to T+3 days | Complete Phase 4 (this SOP) |
| T+1 to T+2 weeks | Run [SOP – Run Post-Peak Season Normalization](../sops/SOP – Run Post-Peak Season Normalization.md) for post-peak negatives and retrospective |
| T+2 to T+4 weeks | Return to standard optimization cadence per [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) |

| **Issue found** | **Route to** |
|----------------|-------------|
| ROAS not recovering post-peak | [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) (target recalibration) |
| Conversion tracking discrepancies | [SOP – Resolve Tracking Breakage](../sops/SOP – Resolve Tracking Breakage.md) |
| Seasonal queries still triggering post-peak | [SOP – Run Post-Peak Season Normalization](../sops/SOP – Run Post-Peak Season Normalization.md) |

---

### FAQ

**Q: Should I create separate campaigns for seasonal promotions?**
A: Only if the promotion targets a fundamentally different audience or has a different ROAS target. Otherwise, use seasonal ad copy and extensions within existing campaigns to preserve Smart Bidding history.

**Q: When should I use SBAs vs. lowering ROAS targets?**
A: SBAs for sharp 1-7 day events. Lower ROAS targets for multi-week seasonal ramp-ups. Do not combine both (double adjustment).

**Q: What if the client does not want to discount?**
A: Not every brand needs to participate in discount events. Added value (free shipping, bundles, extended warranty, free accessories) can drive seasonal conversions without price erosion. Run the proposition check in Phase 2.1.

**Q: How much should I increase budgets during peak?**
A: Use prior year spend as the baseline, apply the growth target percentage, and add a buffer for IS recovery. Ensure the daily budget is at least 5-10x the target CPA. For PMax, increase gradually.

---

### Quick reference: support library

| Document | Type | Used in |
|----------|------|---------|
| [Seasonal Optimization Mental Model](../mental-models/Seasonal Optimization Mental Model.md) | Mental Model | Lifecycle framework, Smart Bidding rules |
| [Promotional Extensions Reference](../references/Promotional Extensions Reference.md) | Reference | Extension specs and timing |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Reference | Budget mechanics |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | Reference | Countdown and customizer syntax |
| [Data Exclusions Reference](../references/Data Exclusions Reference.md) | Reference | Post-event data exclusion |

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Run Post-Peak Season Normalization](../sops/SOP – Run Post-Peak Season Normalization.md) | Downstream: Phases 4-5 |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Related: bid/budget mechanics |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Related: budget redistribution |
| [SOP – Set Up Ad Extensions](../sops/SOP – Set Up Ad Extensions.md) | Related: extension setup mechanics |

---

### Common failures

| **Failure** | **Why it happens** | **How to avoid** |
|-------------|-------------------|-----------------|
| Seasonal ads not approved in time | Submitted on event day, stuck in review | Submit all seasonal assets 2-3 business days early |
| Smart Bidding destabilized post-peak | Targets and budgets left at peak levels | Revert all settings on day 0-1 |
| Budget exhausted before peak day | Spending too aggressively in the ramp-up week | Front-load budget on peak day, pace conservatively in ramp-up |
| PMax waste on Display/Video | Sudden budget increase routes to non-Shopping channels | Increase PMax budgets gradually (20-30% per day) |
| No retrospective data for next year | Skipped Phase 5, lost institutional knowledge | Schedule the normalization SOP within 2 weeks of event end |

---

## Version details

- **Version:** 1.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
