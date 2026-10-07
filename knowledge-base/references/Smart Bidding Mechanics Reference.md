# Smart Bidding Mechanics Reference
Created: 2026-02-04
Updated: 2026-08-27

Support_ID: CHEATSHEET_24
Status: Done
Category: Bidding
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

Documents how smart bidding works under the hood: auction-time bidding, signal processing, learning periods, conversion cycles, bid adjustments, and conversion value rules.

---

## What this reference is / What this is NOT

**This reference:**

- Explains how smart bidding sets bids at auction time
- Documents the 18+ signals smart bidding uses
- Covers learning periods, conversion cycles, and conversion lag
- Explains which bid adjustments still work with automated strategies
- Documents conversion value rules as an alternative to bid adjustments

**This reference does NOT:**

- Tell you which bid strategy to select (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Explain how to calculate CPA/ROAS/POAS targets (See: [Bid Targets Reference](../references/Bid Targets Reference.md))
- Provide step-by-step setup instructions (See: [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md))

---

## Quick reference: smart bidding strategies

| Strategy | Optimizes for | Has efficiency target |
|----------|--------------|----------------------|
| **Maximize Conversions** | Maximum conversion volume within budget | No |
| **Target CPA** | Maximum conversions within a CPA target | Yes (CPA) |
| **Maximize Conversion Value** | Maximum conversion value within budget | No |
| **Target ROAS** | Maximum conversion value within a ROAS target | Yes (ROAS) |

Minimum conversion volume per strategy per campaign type lives in [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

> 💡 **Target CPA and Target ROAS use the same bidding as Maximize Conversions and Maximize Conversion Value, with an efficiency target applied.** They appear as standalone strategy selections in the UI. You can pick "Target CPA" or "Target ROAS" directly, or pick Maximize Conversions / Maximize Conversion Value and add the target: both routes configure the same underlying strategy.

---

## How auction-time bidding works

### The process

For every search query, smart bidding executes this sequence in milliseconds:

1. **User initiates a search** on Google
2. **Google identifies eligible ads** from all advertisers targeting relevant queries
3. **Smart bidding evaluates the user context:** device, location, time, demographics, search history, browsing behavior, and more
4. **Smart bidding predicts conversion probability** (and conversion value, if using value-based strategies) for this specific user in this specific auction
5. **Smart bidding calculates the optimal bid** balancing predicted value against your efficiency target (CPA or ROAS)
6. **The bid enters the auction** alongside all other advertisers' bids
7. **Ad rank determines position** based on bid, Quality Score, and expected impact of extensions

This happens billions of times per day across all advertisers globally.

### Why auction-time bidding outperforms manual bidding

| Dimension | Manual CPC | Auction-time bidding |
|-----------|-----------|---------------------|
| **Bid frequency** | Updated days or weeks apart | Every auction, in real time |
| **Signal depth** | 3-5 visible dimensions | 18+ signals, many invisible to advertisers |
| **Query-level precision** | Bids at keyword level | Bids at query level within keyword |
| **Cross-device tracking** | Not available | Linked via Google accounts |
| **Compounding risk** | Stacking bid adjustments causes over/under-adjustment | All signals evaluated together |
| **Speed of adaptation** | Days to weeks lag | Instant adaptation to market changes |

### Marginal cost optimization

Smart bidding does not aim for a flat average cost across every conversion. It evaluates each
auction and placement separately and buys the cheapest conversions available at that moment.
This behaviour is strongest on Maximize conversions.

Three consequences follow, and all three are normal rather than faults to diagnose:

| Effect | Why it happens |
|--------|----------------|
| Each budget increase buys proportionally less volume | The cheap conversions are bought first, so added spend reaches progressively more expensive auctions |
| Marginal CPA rises as spend scales | The next conversion costs more than the average of the ones already bought |
| CPA varies widely across channels and formats | Each surface is priced independently, so a spread is expected rather than a channel-mix problem |

> ⚠️ **Marginal cost comes before channel diagnosis.** A channel sitting well above blended
> target CPA is not automatically a waste signal. The question the number answers is whether the
> channel is the marginal buy or a genuine efficiency problem.

---

## Signals smart bidding uses

Smart bidding combines 18+ signals to predict the value of each auction:

### Visible signals (accessible in Google Ads UI)

| Signal | How smart bidding uses it |
|--------|------------------------|
| **Device type** | Adjusts bids for mobile, desktop, tablet based on conversion rate per device |
| **Location** | Bids higher in geographic areas with higher conversion rates |
| **Time of day** | Increases bids during high-converting hours, decreases during low hours |
| **Day of week** | Adjusts for day-of-week conversion patterns |
| **Demographics (age, gender)** | Bids based on demographic conversion rate patterns |
| **Audience lists** | Higher bids for users on remarketing or customer match lists |

### Hidden signals (not accessible in the UI)

| Signal | What it captures |
|--------|-----------------|
| **Search query context** | The actual query, not just the matched keyword |
| **Search history** | User's previous search behavior on Google |
| **Past interactions** | Previous ad impressions, clicks, site visits |
| **Cross-device behavior** | Actions across devices linked to same Google account |
| **Operating system** | Conversion rate differences by OS |
| **Browser** | Browser-specific conversion patterns |
| **Language** | Language preference signals |
| **Network type** | WiFi vs. mobile data conversion patterns |
| **Ad characteristics** | Which ad variations perform best for this user type |

> 💡 **Smart bidding's power comes from combining signals:** A user on a mobile device + in a specific city + during morning hours + who previously visited your site = a specific conversion probability that no manual process can calculate.

---

## Adaptive query-level learning

Smart bidding learns at the **search query level**, not the keyword level:

| Capability | What it means |
|-----------|--------------|
| **Cross-campaign learning** | Conversion data for a query is shared across your entire account |
| **Instant knowledge transfer** | New campaigns targeting familiar queries benefit from existing data immediately |
| **Low-volume keyword support** | Even keywords with few clicks benefit from query-level data from similar patterns |
| **Faster optimization** | New keywords ramp up faster because the algorithm already knows related queries |

**Practical implication:** When you split a campaign or create a new campaign targeting the same query themes, smart bidding already knows how those queries convert. You can start with automated strategies immediately rather than using Manual CPC.

---

## Learning periods

Two different quantities get called a learning period. This reference keeps them separate.

| Quantity | Value | What it measures | Scales with the conversion cycle |
|----------|-------|------------------|----------------------------------|
| **Learning phase** | 7-14 days | How long the algorithm recalibrates after a trigger fires | No. It is a fixed floor and ceiling. |
| **Post-change wait** | 1-2 conversion cycles | How long you wait before evaluating a change or making the next one | Yes |

Both start at the moment of the change and the longer one governs. On a 21-day conversion cycle the 7-14 day learning phase completes while the post-change wait still has weeks to run. On a 2-day cycle the learning phase is the binding constraint.

### What triggers a learning period

| Trigger | Learning phase |
|---------|----------------|
| Launching a new campaign | 7-14 days |
| Switching bid strategy | 7-14 days |
| Target CPA/ROAS change > 25% | 7-14 days |
| Major budget change (> 30%) | 7-14 days |
| Geographic targeting change | 7-14 days |
| Other significant targeting changes | 7-14 days |
| Adding/removing conversion actions | 7-14 days |
| Campaign structural change (consolidation or split) | 7-14 days |

### What happens during learning

- Bids fluctuate as the algorithm explores different auction combinations
- Performance metrics are volatile: CPAs may spike, ROAS may drop
- Targets will not be met consistently
- The algorithm is collecting data to calibrate future predictions

### How to manage learning periods

| Do | Do not |
|----|--------|
| Set expectations with stakeholders before changes | Make additional changes during the learning period |
| Monitor metrics without reacting | Panic and revert the strategy |
| Let the learning phase run its full 7-14 days | Evaluate performance during the first week |
| Wait 1-2 conversion cycles from the change date before judging the change | Treat the end of the 7-14 day learning phase as the point where the change can be judged |
| Exclude learning period data from performance reviews | Use learning period data to judge strategy effectiveness |

### Avoiding unnecessary learning periods

- Make incremental target changes (10-15% per adjustment, not 25%+)
- Batch small changes rather than making frequent individual changes
- Wait 1-2 conversion cycles between adjustments
- Use campaign experiments for major strategy changes instead of switching directly

---

## Conversion cycles and conversion lag

### Definitions

| Term | Definition |
|------|-----------|
| **Conversion cycle** | Average time from click to conversion |
| **Conversion lag** | How long it takes for conversions to be fully reported and attributed |
| **Conversion by time** | Metric showing when conversions occurred (vs. when the click occurred) |

> 💡 **Google labels this differently in the interface.** The bid strategy report field is called `Average conversion delay`. It is the same thing as conversion lag: quote Google's label when telling someone where to click, and use conversion lag everywhere else.

### Impact on smart bidding

| Short conversion cycle (1-3 days) | Long conversion cycle (14-30 days) |
|-----------------------------------|-------------------------------------|
| Smart bidding adjusts quickly | Smart bidding adjusts slowly |
| Learning phase: 7-14 days | Learning phase: 7-14 days |
| Post-change wait: 1-6 days | Post-change wait: 14-60 days |
| Recent data heavily weighted | Historical data more heavily weighted |
| Faster experiment conclusions | Longer experiment durations needed |

### Adaptive historical weighting

Smart bidding applies different weights to data based on your conversion cycle:

- **Short cycle:** recent performance data is most predictive, weighted heavily
- **Long cycle:** recent data may not yet show conversions, so historical data is weighted more heavily to avoid overreacting to apparent performance drops

### Where conversion lag is reported

The bid strategy report carries conversion lag in the `Average conversion delay` field, for both standard and portfolio bid strategies.

> ↪️ **Retrieving the value:** See [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md), step 1.2.

### The standard wait after a change

Wait **1-2 conversion cycles** before evaluating a change or making the next one. This is the
standard everywhere this knowledge base refers to a post-change wait. It is not the learning phase,
which runs 7-14 days and does not scale with your conversion cycle.

| Situation | Wait |
|-----------|------|
| After a bid strategy switch, target change, budget change or geographic targeting change | 1-2 conversion cycles |
| Between incremental adjustments | 1-2 conversion cycles |
| Before excluding learning-period data from analysis | 1-2 conversion cycles from the change date |

One cycle is the floor for complete attribution. Two is the ceiling past which you are spending
time rather than gaining signal. Convert it to days using your own conversion cycle: a 3-day
cycle means 3-6 days, a 21-day cycle means 3-6 weeks.

### Practical rules

- Wait 1-2 conversion cycles before evaluating performance after changes
- Exclude the last [conversion lag] days from performance analysis
- Schedule performance reviews to account for conversion lag (if 15-day delay, review in week 3 of the month, not week 1)
- Use "Conversion by time" metrics for faster directional reads when you cannot wait for full attribution

---

## Bid adjustments with smart bidding

### What still works

| Bid adjustment type | Manual CPC | Maximize Clicks | Target Impression Share | Max Conversions | tCPA | Max Conv Value | tROAS |
|--------------------|-----------|----------------|----------------------|----------------|------|---------------|-------|
| **Device** | Full | Full | Full | -100% only | -100% only | -100% only | -100% only |
| **Location** | Full | Full | Full | Ignored | Ignored | Ignored | Ignored |
| **Ad schedule** | Full | Full | Full | Ignored | Ignored | Ignored | Ignored |
| **Audiences** | Full | Full | Full | Ignored | Ignored | Ignored | Ignored |
| **Demographics** | Full | Full | Full | Ignored | Ignored | Ignored | Ignored |

> ⚠️ **Bid adjustments on automated strategies have no effect:** Smart bidding ignores them. The only exception is the -100% device exclusion, which removes tablets or mobile entirely. Location, schedule and audience adjustments on Target CPA/ROAS campaigns change nothing.

### Exception: Target CPA device adjustments

For Target CPA only, Google allows percentage-based device adjustments. Smart bidding already optimizes across devices, and manual adjustments typically degrade performance. The stance on when an exception applies lives in [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md).

---

## Conversion value rules

### What they are

Conversion value rules adjust the conversion value reported to smart bidding based on conditions (location, device, audience). They influence value-based strategies (Maximize Conversion Value, Target ROAS) by modifying the value signal.

### When to use

| Use case | Example |
|----------|---------|
| Value differences not captured in tracking | Repeat customers from a specific audience are worth 2x, but tracking only captures first purchase |
| Geographic value differences | Leads from Amsterdam close at 1.5x the rate of leads from rural areas |
| Simplifying complex setups | Adjusting value by region instead of splitting into separate campaigns |

### When NOT to use

| Situation | Why | Alternative |
|-----------|-----|------------|
| Differences are captured in conversion tracking | Redundant adjustment, double-counting | Use accurate conversion tracking |
| Using Max Conversions or Target CPA | Rules adjust conversion value, these strategies ignore value | Not applicable to conversion-based strategies |
| As a substitute for proper conversion tracking | Band-aid approach, inaccurate data | Fix conversion tracking first |

### Setup

1. Google Ads > Settings > Value rules
2. Create condition (location, device, or audience)
3. Set the adjustment (multiply by factor or add fixed amount)
4. Save. Smart bidding (Maximize Conversion Value, Target ROAS) automatically adjusts.

> 💡 **Imported real values beat rules-based adjustments:** Deal-specific revenue and order-level gross profit are always more accurate than a value rule inferring the same difference.

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Setting bid adjustments on automated strategies | Adjustments are ignored, wasted effort | Remove all non-device adjustments on smart bidding campaigns |
| Making changes during learning period | Disrupts learning, resets the clock | Let the 7-14 day learning phase finish, then wait 1-2 conversion cycles before the next change |
| Treating the 7-14 day learning phase and the 1-2 conversion cycle post-change wait as one window | On a long conversion cycle the change gets judged weeks before attribution completes | Track both and act on the longer one |
| Evaluating performance within conversion lag window | Incomplete data leads to wrong conclusions | Wait 1-2 conversion cycles |
| Setting CPA/ROAS targets more than 25% from current average | Triggers learning period, may cause volume crash | Adjust in 10-15% increments |
| Ignoring conversion volume thresholds | Smart bidding underperforms with too little data | Consolidate campaigns, use Portfolio Bid Strategies to pool data, or use lower-funnel conversions |
| Forgetting to educate stakeholders on learning periods | Panic-driven requests to revert changes | Brief stakeholders before every major change |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Conceptual framework for strategy selection |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Which strategy to select per campaign type |
| [Bid Targets Reference](../references/Bid Targets Reference.md) | How to calculate CPA/ROAS/POAS targets |
| [Bid Simulator Reference](../references/Bid Simulator Reference.md) | Tool for modeling bid changes |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Recommended settings for portfolio strategies, CPC caps |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Data readiness thresholds |
| [Data Exclusions Reference](../references/Data Exclusions Reference.md) | Excluding bad data from smart bidding |
| [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) | Step-by-step setup for Max Conversions / tCPA |
| [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) | Step-by-step setup for Max Conv Value / tROAS / POAS |
| [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) | Migration process with learning period management |

---

## Version details

- **Version:** 5.0
- **Last Updated:** August 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
