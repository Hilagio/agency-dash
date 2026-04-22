# Seasonal Optimization Mental Model
Created: 2026-04-04

Support_ID: MENTALMODEL_32
Status: ready-to-publish
Category: Operational
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

## Purpose

This mental model helps you systematically plan for, execute during, and recover after seasonal performance periods, so you capture peak demand without destroying Smart Bidding stability or post-peak profitability.

> ❓ **The core question:** How do I maximize revenue during seasonal peaks while protecting account health before, during, and after the event?

Seasonal optimization is not just "increase budgets during Black Friday." It is a five-phase lifecycle that starts 8 weeks before the peak and ends 4 weeks after. Each phase has distinct goals, distinct risks, and distinct metrics. Skipping phases (especially historical analysis and post-peak normalization) compounds mistakes year over year.

---

## What this is NOT

This mental model does **not:**

- Provide step-by-step execution procedures for seasonal adjustments (See: [SOP – Plan and Execute Seasonal Adjustments](../sops/SOP – Plan and Execute Seasonal Adjustments.md))
- Define promotional extension syntax or specifications (See: [Promotional Extensions Reference](../references/Promotional Extensions Reference.md))
- Cover post-peak cleanup procedures (See: [SOP – Run Post-Peak Season Normalization](../sops/SOP – Run Post-Peak Season Normalization.md))
- Explain general bidding strategy selection (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))
- Provide budget allocation frameworks for non-seasonal periods (See: [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md))

---

## The seasonal optimization lifecycle

Every seasonal event follows five phases. The phases are sequential: skipping one degrades the next.

| **Phase** | **Name** | **Timing** | **Purpose** | **Key output** |
|-----------|----------|------------|-------------|----------------|
| 1️⃣ | Historical Analysis & Planning | T-8 to T-6 weeks | Learn from last year, set targets | Benchmark report, seasonal targets |
| 2️⃣ | Pre-Season Preparation | T-6 to T-2 weeks | Build assets, configure account | Seasonal keywords, ads, extensions, feed updates |
| 3️⃣ | Peak Execution | During event | Maximize capture, monitor live | Budget pacing log, real-time CPC tracking |
| 4️⃣ | Post-Peak Normalization | T+0 to T+2 weeks | Revert settings, cut waste | Reverted account, seasonal negatives added |
| 5️⃣ | Retrospective | T+2 to T+4 weeks | Document learnings | Seasonal playbook for next year |

> 💡 **"T" refers to the start of the peak event.** For Black Friday, T is Black Friday itself. For a 2-week Christmas sale, T is the sale start date.

---

## Phase-by-phase breakdown

### 1️⃣ Historical Analysis & Planning (T-8 to T-6 weeks)

*"You don't want/have to reinvent the wheel. Learn from the past and use these insights to increase this year's performance."*

This phase answers: what happened last year, and what should we target this year?

**Holiday Reflection Checklist categories:**

| **Category** | **What to review** |
|--------------|-------------------|
| Competitor Analysis | Impression share behavior, strategies and tactics used, competitor offers and landing pages, competitor ads and messaging |
| Promotional Offers Analysis | Which offers drove the most conversions, which offers failed, how offers could be made more attractive |
| Campaign Performance Analysis | Best ROI campaigns, underperforming campaigns, target achievement |
| Budget & Spend Analysis | Ad spend increase (percentage and absolute), budget limitations encountered, pacing accuracy |

**YoY data analysis methodology:**

1. Pull account-level data segmented by day for the seasonal period plus 2 weeks before and after
2. Filter out brand campaigns (use "Campaign name does not contain Brand" filter)
3. Segment data into three periods: pre-peak, peak, post-peak (color-code for visual analysis)
4. Compare key metrics: CTR, Avg. CPC, Cost, Conversions, Cost/conv., Conv. rate, Conv. value, Conv. value/cost, Search lost IS (budget), Search lost IS (rank)
5. Get granular at campaign level if you have sufficient data
6. Note PMax limitation: no auction data at the campaign level because of Performance Max. Dig deeper on the campaign level for PMax

**Key metrics to benchmark:**

| **Metric** | **What to compare** | **Flag threshold** |
|------------|--------------------|--------------------|
| CPC | Peak vs. pre-peak | CPC typically increases 25-50% during BFCM |
| CVR | Peak vs. pre-peak | CVR should increase during peak (if not, offer or LP problem) |
| ROAS | Peak vs. target | >20% deviation from target without explanation |
| Search IS lost (budget) | Peak vs. pre-peak | Any increase signals missed opportunity |
| Search IS lost (rank) | Peak vs. same period prior year | Structural vs. seasonal competitive shift |

---

### 2️⃣ Pre-Season Preparation (T-6 to T-2 weeks)

This phase builds all assets and configures the account for the seasonal event. The scope depends on the business type and seasonal strategy.

**Preparation checklist:**

| **Area** | **Actions** | **Lead time** |
|----------|-----------|--------------|
| Offer strategy | Proposition check: does discounting fit the brand? Not every company needs to participate aggressively. Determine offer type (discount, bundle, added value, free shipping). Calculate maximum discount at different CVR levels. | T-6 weeks |
| Landing pages | Build or update holiday-specific landing pages. Message match between ads and LP. Holiday-specific design elements. | T-5 weeks |
| Seasonal trends | Analyze Google Trends for upcoming query patterns. Use tools like Optmyzr Seasonal Performance Trends to decompose baseline vs. seasonal effects. | T-5 weeks |
| Conversion tracking | Verify all tracking fires correctly. Set up or refresh remarketing tags for seasonal audience building. | T-4 weeks |
| Product feed | Update product titles with seasonal terms (via supplemental feed). Add holiday-specific `additional_image_link` and `lifestyle_image_link` attributes for deals and bundles. Submit feed updates 3-5 business days before the event. | T-4 weeks |
| GMC features | Configure sale price annotations (requires 45-60 day stable base price). Set up promotions in Merchant Center. Enable price drop badges where eligible. | T-4 weeks |
| Keyword calendar | Activate paused seasonal keywords. Add new seasonal terms. Distinguish evergreen keywords (always on) from seasonal keywords (activate/pause on calendar). | T-3 weeks |
| Ad assets | Create holiday-specific RSAs (sale as focal point, UVP, holiday references, high-volume keywords). Set up ad customizers for dynamic info (prices, stock levels, countdown timers). Prepare holiday-specific images and video. | T-3 weeks |
| Extensions | Configure promotion extensions (most important seasonal asset). Create category-specific promotional sitelinks. Add urgency callouts. Schedule start/end dates for all seasonal extensions. | T-2 weeks |

**Ad asset preparation principles:**

Text ads:
- Start early: have holiday ads in place 2 weeks before the holiday starts
- Make the sale the focal point of your ads
- Mention the UVP: percentage off, savings amount, free shipping, exclusive products
- Use holiday references: "Black Friday Sale", "Black Friday: Save Big Now"
- Include high-volume, relevant keywords in ad copy

Image ads:
- Mobile first: high-resolution, sharp, bold contrasting colors, big font sizes
- Avoid blank spaces: make the product or message the focus
- Create images with and without overlay texts: overlays can backfire in Responsive Display Ads but outperform in static ads
- Match images with landing page elements (message and design match)
- Prepare multiple formats: landscape (1.91:1), vertical (4:5), square (1:1)

Video ads:
- Keep videos short: typically 15 seconds
- Grab attention in the first few seconds
- Front-load the holiday offer
- Introduce brand early
- Use emotion (excitement, humor, emotional connection)
- Clear CTA coupled with urgency

---

### 3️⃣ Peak Execution (during event)

This phase maximizes revenue capture while monitoring account health in real time.

**Smart Bidding interaction rules:**

| **Scenario** | **Approach** | **Rationale** |
|-------------|-------------|---------------|
| Gradual seasonal ramp (weeks) | Lower ROAS targets 10-20% starting 2-4 weeks before peak | Smart Bidding adapts to gradual shifts. SBAs are unnecessary and can over-correct. |
| Short promotion (3-7 days) | Use Seasonality Bid Adjustments (SBAs) | Smart Bidding cannot adapt fast enough. Do not touch ROAS targets (too slow to react). |
| Black Friday / single peak day | SBAs + uncapped budgets + removed bid limits | Maximum capture. Use CPC as live diagnostic (not ROAS, which has conversion lag). |
| PMax budget increase | Increase gradually (20-30% per day) | Sudden PMax budget jumps trigger increased Display and Video spend rather than Shopping. |

**Seasonality Bid Adjustment mechanics:**

| **Aspect** | **How it works** |
|-----------|-----------------|
| Percentage | Set based on the expected conversion rate change during the event. A 50% SBA tells Smart Bidding to expect a 50% higher CVR and bid accordingly. |
| Duration | Ideal for 1-7 day events. Loses effectiveness after approximately 4 days. For longer events, create a fresh SBA rather than extending the existing one. |
| Application | Available for Search, Standard Shopping, Display (tCPA/tROAS), PMax. Max 2,000 campaigns per event. |
| Updates | Do not update SBA dates after creation: it breaks the adjustment. Create a new one instead. |
| Speed | Effect visible in SERPs within approximately 5 minutes. |
| Post-event | Campaigns auto-revert when SBA expires. For aggressive reversion (e.g., post-Black Friday), consider explicit negative SBAs. |

**Budget pacing during peak:**

- Monitor daily spend against seasonal budget plan
- Track Search IS lost (budget) as the primary opportunity metric
- Reallocate budget from underperforming to outperforming campaigns intraday
- Use CPC as the live health metric (ROAS has conversion delay during peak events)

**Competitive monitoring:**

- Pull Auction Insights for the same period as prior year
- Separate seasonal competitive shifts from structural changes
- If impression share drops are budget-driven, reallocate. If rank-driven, increase SBA percentage.

---

### 4️⃣ Post-Peak Normalization (T+0 to T+2 weeks)

This phase prevents the seasonal spike from corrupting ongoing account performance.

**Immediate actions (day of event end):**

| **Action** | **Timeline** | **Why** |
|-----------|-------------|---------|
| Remove or let SBAs expire | Day 0 | Campaigns auto-revert. Verify in bid strategy report. |
| Revert budgets to pre-peak levels | Day 0-1 | Prevents overspend on declining demand |
| Revert bid targets (tCPA/tROAS) | Day 0-1 | Prevents loose targets from persisting |
| Pause seasonal keywords | Day 0-1 | Seasonal terms stop converting immediately post-peak |
| Remove seasonal ad copy | Day 0-3 | "Black Friday Sale" running in December looks stale |
| Remove seasonal extensions | Day 0-3 | Expired promotions damage credibility |

**Post-peak negative keywords:**

Pull the search terms report for the 7-14 days after the event. Identify seasonal queries that generated clicks but zero conversions post-peak. These are now waste: add them as negative keywords. Common patterns: "[event] deals" queries after the event has ended, "when is [event]" informational queries.

**Shopping title and feed reversion:**

Remove seasonal terms added to product titles via supplemental feed. Verify titles reverted in Merchant Center (allow 24-48 hours for processing).

**Data Exclusion consideration:**

After a big short sale (1-3 days), apply a Data Exclusion to prevent the spike from distorting Smart Bidding's model. Typical duration: 3 days (7 absolute maximum). Account for conversion delay when setting the exclusion date range.

---

### 5️⃣ Retrospective (T+2 to T+4 weeks)

This phase preserves institutional knowledge. Compounding seasonal learnings year over year is one of the highest-leverage activities in Google Ads management.

**Structured retrospective using the Holiday Reflection Checklist:**

| **Section** | **Questions to answer** |
|------------|------------------------|
| Competitor Analysis | How did competitors behave in impression share? What strategies or tactics seemed effective? What can you learn from competitor offers and landing pages? What can you learn from competitor ads and messaging? |
| Promotional Offers Analysis | Which offers drove the most conversions? Which offers failed? How could offers be made more attractive next year? |
| Campaign Performance Analysis | Which campaigns yielded the best ROI and why? Which campaigns underperformed and what was the reason? Did you hit your targets? If not, what was the cause? |
| Budget & Spend Analysis | What was the increase in ad spend (percentage and absolute)? Did you run into budget limitations? Can you improve future budget planning? |
| General | Are there any other remarks worth noting for next year? |

**Document and save:**

- Save the retrospective alongside the YoY comparison data as next year's Phase 1 input
- Note specific SBA percentages used, budget levels, and which seasonal keywords were activated
- Record what worked and what failed with specific numbers, not general impressions

---

## Seasonal calendar by vertical

### Ecommerce (Q4 focus)

| **Month** | **Date** | **Event** | **Preparation start** |
|-----------|---------|-----------|----------------------|
| October | 31 | Halloween | Early September |
| November | 11 | Singles Day | Late September |
| November | 4th Thursday | Thanksgiving (US) | Early October |
| November | Day after Thanksgiving | Black Friday | Early October |
| December | Monday after BF | Cyber Monday | Included in BF prep |
| December | 5/6 | St. Nicholas (NL/EU) | Early November |
| December | 2nd Monday | Green Monday | Late November |
| December | Last Saturday before Christmas | Super Saturday | Early December |
| December | 24-25 | Christmas Eve / Day | Early November |
| December | 31 | New Year's Eve | Mid-December |
| January | 1 | New Year (sales) | Late December |

### Lead Gen

| **Period** | **Event** | **Typical impact** |
|-----------|-----------|-------------------|
| January-February | Q1 budget flush | Companies spend remaining budget: higher conversion rates |
| March-April | Fiscal year start (many EU companies) | New budgets released, increased activity |
| September-October | Q4 planning season | Decision-makers research solutions |
| Industry-specific | Conference periods | Traffic spikes around industry events |

### SaaS

| **Period** | **Event** | **Typical impact** |
|-----------|-----------|-------------------|
| November-December | Annual plan renewals | Upsell and retention focus |
| January | New Year resolutions | Sign-up spikes for productivity and business tools |
| End of fiscal quarter | Budget approval windows | Enterprise buying cycles peak |
| Industry-specific | Product launch cycles | Competitive spikes around major releases |

---

## Decision framework: seasonal vs. structural change

Not every performance shift is seasonal. Use this framework to distinguish seasonal changes (temporary, self-correcting) from structural changes (permanent, requiring strategy adjustment).

```
Performance changed vs. same period last year?
|
+-- YES, similar direction and magnitude --> Likely seasonal
|   Action: Adjust bids/budgets per seasonal playbook
|
+-- YES, but opposite direction or different magnitude --> Mixed signal
|   |
|   +-- Auction Insights show new competitor? --> Structural
|   |   Action: Investigate competitor, adjust strategy
|   |
|   +-- No new competitors, but market shift? --> Structural
|       Action: Reassess targets and unit economics
|
+-- NO change vs. last year, but change vs. last month --> Seasonal
    Action: Normal seasonal pattern, follow playbook
```

---

## Smart Bidding and seasonal events: key principles

1. **Smart Bidding already handles gradual seasonal shifts.** Do not use SBAs for multi-week peak season ramp-ups. Lower ROAS targets instead.
2. **Use SBAs only for sharp 1-7 day events** where Smart Bidding cannot adapt fast enough.
3. **SBA percentage represents the expected CVR change.** A 50% SBA tells Smart Bidding to expect a 50% higher conversion rate and bid more aggressively to capture that volume.
4. **For short promotions (3-7 days), do not touch ROAS targets.** Use SBAs to push spend. After the promotion ends, apply a Data Exclusion (3 days typical).
5. **PMax responds differently to budget changes.** Increase PMax budgets gradually (20-30% per day). Sudden jumps route additional spend to Display and Video rather than Shopping.
6. **CPC is the reliable live metric during peak events.** ROAS has conversion lag and is unreliable for real-time decisions during fast-moving events.
7. **Document everything.** The seasonal playbook compounds year over year. This year's data is next year's Phase 1 input.

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Starting preparation 1 week before the event | Insufficient time for feed updates, ad approvals, landing pages | Start Phase 1 at T-8 weeks, Phase 2 at T-6 weeks |
| Setting SBA percentage too high | Overspending: a 100% SBA tells Smart Bidding to expect double the CVR, causing very aggressive bids | Start conservative (20-30%), increase if CPC data confirms headroom |
| Extending an existing SBA by updating its dates | Breaks the adjustment, creates unpredictable behavior | Create a fresh SBA instead of editing an existing one |
| Not reverting settings after the peak | Loose targets and inflated budgets persist, ROAS degrades | Revert budgets, targets, and seasonal assets on day 0-1 |
| Using SBAs for multi-week seasonal ramp-ups | SBAs lose effectiveness after approximately 4 days | Lower ROAS targets 10-20% instead |
| Suddenly doubling PMax budget | Additional spend goes to Display/Video, not Shopping | Increase PMax budgets by 20-30% per day |
| Skipping the retrospective | Same mistakes repeated next year, no compounding improvement | Run the Holiday Reflection Checklist within 4 weeks of event end |
| Treating seasonal IS loss as structural | Unnecessary panic and strategy changes for temporary competitive shifts | Compare Auction Insights vs. same period prior year |

---

## Key principles

1. **Seasonal optimization is a lifecycle, not an event.** Five phases, 12+ weeks, each one feeding the next.
2. **Not every brand needs to discount.** Proposition check first. Added value (free maintenance, bundles, trade-ins) can outperform discounts.
3. **Learn from last year before planning this year.** The Holiday Reflection Checklist is the highest-leverage 30 minutes you spend.
4. **Match your bid approach to the event duration.** Weeks-long ramp: lower ROAS targets. Days-long event: SBAs. Single day: SBAs + uncapped budgets.
5. **Revert everything.** The single biggest post-peak mistake is leaving seasonal settings active.
6. **CPC is your real-time compass.** During fast-moving events, ROAS lags behind reality.
7. **The seasonal playbook compounds.** Document what worked, what failed, with specific numbers. This year's data is next year's advantage.

---

## Related Documents

| **Document** | **Relationship** |
|--------------|------------------|
| [SOP – Plan and Execute Seasonal Adjustments](../sops/SOP – Plan and Execute Seasonal Adjustments.md) | Execution procedure for Phases 1-4 |
| [SOP – Run Post-Peak Season Normalization](../sops/SOP – Run Post-Peak Season Normalization.md) | Execution procedure for Phases 4-5 |
| [Promotional Extensions Reference](../references/Promotional Extensions Reference.md) | Technical specs for seasonal promotional elements |
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Framework for budget reallocation during peaks |
| [Budget Pacing Reference](../references/Budget Pacing Reference.md) | Budget pacing mechanics and diagnostics |
| [Optimization Cadence Mental Model](../mental-models/Optimization Cadence Mental Model.md) | Standard optimization rhythm (returns to this post-peak) |
| [Anomaly Detection Mental Model](../mental-models/Anomaly Detection Mental Model.md) | Distinguishing seasonal patterns from true anomalies |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | How Smart Bidding responds to seasonal signals |
| [Data Exclusions Reference](../references/Data Exclusions Reference.md) | Data Exclusion configuration for post-promotion cleanup |
| [Auction Insights Reference](../references/Auction Insights Reference.md) | Competitive analysis for seasonal vs. structural shifts |

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
