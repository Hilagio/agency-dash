# Smart Bidding Mechanics Reference
Created: 2026-02-04

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
- Covers learning periods, conversion cycles, and conversion delay
- Explains which bid adjustments still work with automated strategies
- Documents conversion value rules as an alternative to bid adjustments

**This reference does NOT:**

- Tell you which bid strategy to select (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Explain how to calculate CPA/ROAS/POAS targets (See: [Bid Targets Reference](../references/Bid Targets Reference.md))
- Provide step-by-step setup instructions (See: [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md))

---

## Quick reference: smart bidding strategies

| Strategy | Optimizes for | Has efficiency target | Requires conversion data |
|----------|--------------|----------------------|------------------------|
| **Maximize Conversions** | Maximum conversion volume within budget | No | Low bar (can start early) |
| **Target CPA** | Maximum conversions within a CPA target | Yes (CPA) | 30+ conversions/month (50+ recommended) |
| **Maximize Conversion Value** | Maximum conversion value within budget | No | Moderate |
| **Target ROAS** | Maximum conversion value within a ROAS target | Yes (ROAS) | 50+ conversions/month recommended |

> 💡 **Target CPA and Target ROAS are not separate strategies:** They are Maximize Conversions and Maximize Conversion Value with an optional efficiency target applied. In the Google Ads UI, you enable tCPA by checking "Set a target cost per action" under Maximize Conversions, and tROAS by checking "Set a target return on ad spend" under Maximize Conversion Value.

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

### What triggers a learning period

| Trigger | Typical duration |
|---------|-----------------|
| Launching a new campaign | 7-14 days |
| Switching bid strategy | 7-14 days |
| Target CPA/ROAS change > 25% | 7-14 days |
| Major budget change (> 30%) | 3-7 days |
| Significant targeting changes | 7-14 days |
| Adding/removing conversion actions | 7-14 days |

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
| Wait at least 7 days, ideally 14 | Evaluate performance during the first week |
| Exclude learning period data from performance reviews | Use learning period data to judge strategy effectiveness |

### Avoiding unnecessary learning periods

- Make incremental target changes (10-15% per adjustment, not 25%+)
- Batch small changes rather than making frequent individual changes
- Wait one conversion cycle between adjustments
- Use campaign experiments for major strategy changes instead of switching directly

---

## Conversion cycles and conversion delay

### Definitions

| Term | Definition |
|------|-----------|
| **Conversion cycle** | Average time from click to conversion |
| **Conversion delay** | How long it takes for conversions to be fully reported and attributed |
| **Conversion by time** | Metric showing when conversions occurred (vs. when the click occurred) |

### Impact on smart bidding

| Short conversion cycle (1-3 days) | Long conversion cycle (14-30 days) |
|-----------------------------------|-------------------------------------|
| Smart bidding adjusts quickly | Smart bidding adjusts slowly |
| Learning period: 7-10 days | Learning period: 14-30+ days |
| Recent data heavily weighted | Historical data more heavily weighted |
| Faster experiment conclusions | Longer experiment durations needed |

### Adaptive historical weighting

Smart bidding applies different weights to data based on your conversion cycle:

- **Short cycle:** recent performance data is most predictive, weighted heavily
- **Long cycle:** recent data may not yet show conversions, so historical data is weighted more heavily to avoid overreacting to apparent performance drops

### How to find your conversion delay

1. Add the "Bid strategy type" column to your campaign view
2. Click the blue hyperlink for your bid strategy name
3. View the bid strategy report
4. Find "Average conversion delay" in the report

For portfolio bid strategies: Tools > Budgets and Bidding > Bid Strategies > select strategy.

### Practical rules

- Wait at least one full conversion cycle before evaluating performance after changes
- Exclude the last [conversion delay] days from performance analysis
- Schedule performance reviews to account for conversion delay (if 15-day delay, review in week 3 of the month, not week 1)
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

> ⚠️ **Do not set bid adjustments on automated strategies:** Smart bidding ignores them. The only exception is -100% device exclusions (removing tablets or mobile entirely). Setting location, schedule, or audience adjustments on Target CPA/ROAS campaigns has zero effect.

### Exception: Target CPA device adjustments

For Target CPA only, Google allows percentage-based device adjustments. In practice, smart bidding already optimizes across devices, and manual adjustments typically degrade performance. Use only if you have a specific, validated reason.

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

> 💡 **Prioritize robust conversion tracking over value rules:** If you can import real values (deal-specific revenue, order-level gross profit), that is always more accurate than rules-based adjustments.

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Setting bid adjustments on automated strategies | Adjustments are ignored, wasted effort | Remove all non-device adjustments on smart bidding campaigns |
| Making changes during learning period | Disrupts learning, resets the clock | Wait 7-14 days before next change |
| Evaluating performance within conversion delay window | Incomplete data leads to wrong conclusions | Wait at least one full conversion cycle |
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

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
