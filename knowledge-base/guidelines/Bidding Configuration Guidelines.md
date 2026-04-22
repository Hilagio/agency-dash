# Bidding Configuration Guidelines
Created: 2026-02-04

Support_ID: GUIDELINE_4
Status: Done
Category: Bidding
Reference Type: Guideline
Agent_Readable: Yes
Human_Facing: Yes
Domain: Bidding
Pillar: 9

## Purpose

This guideline defines recommended configurations for portfolio bid strategies, CPC caps, shared budgets, bid adjustments, and conversion value rules. It supports bid strategy setup by establishing default settings and exception conditions.

---

## What this is / What this is NOT

**This guideline:**

- Defines when and how to use portfolio bid strategies
- Establishes default recommendations for CPC caps
- Explains when shared budgets should be combined with portfolio strategies
- Clarifies which bid adjustments still function under smart bidding
- Establishes conversion value rules usage guidelines

**This guideline does NOT:**

- Tell you which bid strategy to select (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))
- Explain how smart bidding works internally (See: [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md))
- Provide step-by-step setup instructions (See: [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md))
- Provide step-by-step execution instructions

---

## Portfolio bid strategies

### What they are

Portfolio bid strategies are automated bidding strategies that work across multiple campaigns sharing the same efficiency goal. Instead of each campaign having its own isolated bid strategy, campaigns are grouped under one strategy that optimizes across all linked campaigns.

**Availability:** Search, Standard Shopping, Display only. Not available for Performance Max, Video, Demand Gen, or App campaigns.

**Location:** Tools > Budgets and Bidding > Bid Strategies

### Recommended configuration

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Use portfolio strategies** | **ON** when 2+ campaigns share the same efficiency target | Pools conversion data, speeds up learning, enables CPC caps |
| **Group by efficiency target** | One portfolio per unique CPA/ROAS target | Campaigns with different targets should not share a portfolio |
| **Campaign types** | Group same types together | Search + Search is fine, Search + Shopping in one portfolio is not recommended |

### Key benefits

1. **Conversion data pooling:** the portfolio's conversion threshold is the sum of all linked campaigns. Five campaigns with 12 conversions/month each = 60 combined (above the 50/month recommended threshold)
2. **Cross-campaign optimization:** the algorithm can bid more aggressively on high-performing campaigns and conservatively on others, targeting the portfolio-level efficiency goal
3. **CPC caps:** only available through portfolio strategies, not campaign-level strategies
4. **Centralized management:** one efficiency target to monitor instead of multiple

### Conversion volume thresholds with portfolios

| Level | Absolute Minimum | Functional Minimum | Recommended |
|-------|-----------------|-------------------|-------------|
| Single campaign: Target CPA | 15 conversions/month | 30 conversions/month | 50+ conversions/month |
| Single campaign: Target ROAS | 30 conversions/month | 50 conversions/month | 50+ conversions/month |
| Portfolio (sum of all linked campaigns) | 15 conversions/month | 30 conversions/month | 50+ conversions/month |

Thresholds apply to the portfolio total. Individual campaigns within the portfolio can have fewer conversions if the combined total meets the threshold.

---

## CPC caps (minimum and maximum)

### Default recommendation

| CPC cap type | Default | Rationale |
|-------------|---------|-----------|
| **Maximum CPC cap** | **OFF** (do not set) | Restricts smart bidding flexibility, can silently limit performance |
| **Minimum CPC cap** | **OFF** (do not set) | Rarely needed, forces minimum spend that may not convert |

> ⚠️ **CPC caps are the most common misconfiguration in portfolio strategies:** A forgotten maximum CPC cap can silently restrict performance for months. Default to no caps unless you have a validated reason.

### When to consider maximum CPC caps

| Condition | Action |
|-----------|--------|
| Extreme CPC outliers (10x average) across many queries consistently | Set max CPC at 3x the average CPC of your top converting search terms |
| Highly competitive vertical where CPC wars are common | Set max CPC at 3x average CPC of best converting, high-volume queries |
| Client requires explicit CPC ceiling for risk management | Set conservatively, review monthly |

### Rule of thumb for max CPC

If you decide to set a maximum CPC cap:

1. Open your search term report
2. Sort by conversions (descending)
3. Note the average CPC of your top 10-20 converting search terms
4. Set the maximum CPC cap at 3x that average CPC

**Example:** top converting search terms average 2.50 EUR CPC. Set max CPC cap at 7.50 EUR.

### Monitoring CPC caps

If you use CPC caps, set up these monitoring checks:

| Check | Frequency | Action if triggered |
|-------|-----------|-------------------|
| Top keyword CPCs plateauing at the cap | Weekly | Increase cap or remove |
| IS lost to rank increasing | Weekly | Cap may be restricting competitiveness |
| Conversion volume declining | Weekly | Cap may be preventing algorithm from winning auctions |

> 💡 **Small CPC cap errors have outsized consequences:** A cap set too low can cause months of lost volume without obvious signals. When in doubt, remove the cap and let smart bidding optimize.

### The case against CPC caps

Recent evidence suggests the cost of CPC caps outweighs the benefit in most scenarios:

- Smart bidding already accounts for diminishing returns at high CPCs
- CPC outliers are infrequent and contribute to conversion volume
- Caps prevent the algorithm from winning high-value auctions
- Forgotten caps silently degrade performance over time

---

## Shared budgets with portfolio strategies

### Recommended pairing

| Configuration | When to use |
|--------------|-------------|
| Portfolio bid strategy + shared budget | Campaigns share the same efficiency target AND you want Google to optimize budget allocation |
| Portfolio bid strategy + individual budgets | Campaigns share efficiency target but need independent budget control |
| Individual strategy + individual budget | Campaigns have different targets and different budget priorities |

### Shared budget recommendations

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Use shared budgets** | **ON** when paired with portfolio strategies for campaigns with aligned goals | Lets Google optimize both bids and budget allocation simultaneously |
| **Monitor allocation** | Weekly check on per-campaign spend within the shared pool | Prevent one campaign from consuming the entire budget |
| **Campaign experiments** | **Switch to individual budgets** for experiment campaigns | Shared budgets have compatibility issues with experiments |

---

## Bid adjustments under smart bidding

### Configuration

| Bid adjustment type | Smart bidding status | Recommendation |
|--------------------|---------------------|---------------|
| **Device (non-exclusion)** | Ignored (except tCPA) | **Remove all** device bid adjustments on smart bidding campaigns |
| **Device (-100% exclusion)** | Works on all strategies | Use to exclude a device type entirely if needed |
| **Location** | Ignored | **Remove:** Smart bidding handles location optimization |
| **Ad schedule** | Ignored | **Remove:** Smart bidding handles time-of-day optimization |
| **Audiences** | Ignored | **Remove:** Smart bidding uses audience data in its signal mix |
| **Demographics** | Ignored | **Remove:** Smart bidding optimizes across all demographics |

> ⚠️ **Bid adjustments on smart bidding campaigns are ignored by the algorithm:** The only exception is -100% device exclusions. Any non-exclusion bid adjustments you set are dead weight in the account. Remove them to avoid confusion.

### Exception: Target CPA device adjustments

Target CPA technically supports device bid adjustments. In practice, setting manual device adjustments on top of smart bidding typically degrades performance. The algorithm already optimizes device bids using 18+ signals.

**Recommendation:** do not set device bid adjustments on Target CPA campaigns unless you have a specific, validated use case with clear A/B test evidence that the adjustment improves results.

---

## Conversion value rules

### Default recommendation

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Conversion value rules** | **OFF** by default | Prioritize accurate conversion tracking over rules-based adjustments |

### When to enable

Enable conversion value rules only when:

1. **Business-specific value differences cannot be captured through conversion tracking:** Example: repeat customers from a remarketing list are worth 1.5x but tracking only captures first-purchase value
2. **Simplifying complex campaign structures:** Example: adjusting value by region instead of creating separate campaigns per region
3. **You are using Maximize Conversion Value or Target ROAS:** Value rules only affect value-based strategies

### Rules for value rules

| Rule | Details |
|------|---------|
| Only works with value-based strategies | Maximize Conversion Value and Target ROAS. Has no impact on tCPA or Max Conversions |
| Adjusts reported conversion value | Changes what smart bidding sees in the conversion value column |
| Cannot replace accurate tracking | If real values are available, import them instead of using rules |
| Available conditions | Geographic location, device, audience |

---

## Configuration verification

After configuring bidding settings, verify:

| Check | Expected state |
|-------|---------------|
| Portfolio strategies linked to correct campaigns | All intended campaigns show in portfolio |
| Efficiency target matches across portfolio | One consistent CPA or ROAS target |
| Maximum CPC cap | OFF unless explicitly justified |
| Minimum CPC cap | OFF unless explicitly justified |
| Shared budget (if used) | Linked to same campaigns as portfolio |
| Non-exclusion bid adjustments on smart bidding campaigns | Removed (set to 0%) |
| Conversion value rules | OFF unless explicitly justified |
| Campaign-specific goals | Correctly pointing to intended conversion actions |

---

## Exception conditions

### CPC caps: OFF (with qualification)

- **Default:** do not set CPC caps
- **Exception:** set at 3x average CPC of top converting terms if extreme outliers are consistent and damaging
- **If set:** review monthly, set up IS-lost-to-rank monitoring
- **Important:** a temporarily set CPC cap must have a calendar reminder for review. Forgotten caps are the most common portfolio strategy misconfiguration

### Shared budgets: ON for aligned campaigns

- **Default:** use shared budgets when campaigns share the same efficiency target
- **Exception:** use individual budgets when running campaign experiments, using performance-based bucketing, or needing guaranteed per-campaign spend levels
- **Risk:** low, Google handles allocation well in most cases

### Value rules: OFF by default

- **Default:** do not use conversion value rules
- **Exception:** enable for specific business nuances that cannot be captured through conversion tracking
- **Important:** value rules are an overlay on top of tracking, not a replacement. Fix tracking first.

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
