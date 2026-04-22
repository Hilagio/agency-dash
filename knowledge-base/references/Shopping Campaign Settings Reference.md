# Shopping Campaign Settings Reference
Created: 2026-02-04

Support_ID: REFERENCE_14
Status: Done
Reference Type: Reference
Agent_Readable: No
Human_Facing: Yes
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

This reference documents all campaign-level settings for Standard Shopping and PMax Feed-Only campaigns, including where to find them in Google Ads and recommended configurations.

This reference provides a single location for all Shopping campaign settings. It covers both Standard Shopping and PMax Feed-Only (which share the Shopping surface but have different available settings).

---

## What this is NOT

This reference does **not:**

- Explain when to choose Standard Shopping vs PMax (See: [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md))
- Explain campaign structure decisions (See: [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md))
- Explain PMax structure (See: [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>))
- Provide step-by-step campaign setup (See: [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md))
- Explain product feed configuration (See: [Merchant Center Reference](../references/Merchant Center Reference.md))

---

## Quick reference: Setting availability

| **Setting** | **Standard Shopping** | **PMax Feed-Only** |
|-------------|----------------------|-------------------|
| Campaign priority | Yes (High/Medium/Low) | No |
| Manual CPC | Yes | No |
| Portfolio bid strategies | Yes (with Max CPC cap) | No |
| Target ROAS | Yes | Yes |
| Maximize Clicks | Yes | No |
| Maximize Conversions | No | Yes |
| Maximize Conversion Value | No | Yes |
| Negative keywords | Yes (campaign + ad group) | Yes (campaign level) |
| Negative keyword lists | Yes | Yes |
| Brand exclusions | N/A (use negatives) | Yes (dedicated setting) |
| Search Partners | Yes | No (controlled by Google) |
| Listing groups | Yes | Yes (within Asset Groups) |
| Inventory filter | Yes | Yes |
| Local inventory ads | Yes | Yes |
| URL options | Yes | Yes |
| Audience signals | No | No (not needed for Feed-Only) |

---

## Standard Shopping campaign settings

### Campaign-level settings

#### Merchant Center link

| **Setting** | **Location** | **Recommendation** |
|-------------|--------------|-------------------|
| Merchant Center account | Campaign settings > Shopping campaign settings | Select the correct Merchant Center account. Only one account per campaign. |

> ⚠️ You cannot change the Merchant Center account after campaign creation. Create a new campaign if you need to switch.

#### Target country

| **Setting** | **Location** | **Options** |
|-------------|--------------|-------------|
| Country of sale | Campaign settings > Shopping campaign settings | Select the country where you want to sell. Must match a feed target country in Merchant Center. |

Products will only show for searches in the selected country. For multi-country selling, create separate campaigns per country or use a single campaign with multiple target countries (if feed supports it).

#### Campaign priority

| **Priority** | **Auction behavior** | **When to use** |
|--------------|---------------------|-----------------|
| High | Enters auction first | Generic/catch-all campaigns (combined with negatives to pass queries down) |
| Medium | Enters if High is excluded | Category-specific campaigns |
| Low | Enters if High and Medium are excluded | Brand campaigns, high-intent queries |

**Default:** Low

> ↪️ **For query sculpting strategy using priorities:** See [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md).

#### Inventory filter

| **Setting** | **Location** | **Options** |
|-------------|--------------|-------------|
| Inventory filter | Campaign settings > Additional settings > Inventory filter | Filter by: Brand, Item ID, Product Type, Condition, Google Product Category, Channel, Custom Label |

Use inventory filters to restrict which products from Merchant Center appear in this campaign. Useful for:
- Excluding specific brands
- Limiting to specific product types
- Running separate campaigns by custom label

> ⚠️ Inventory filters apply at campaign creation. Changes require a new campaign.

### Network settings

| **Network** | **Default** | **Recommendation** | **Impact** |
|-------------|-------------|-------------------|------------|
| Search Network | Enabled | Keep enabled | Your ads appear on Google Search Shopping tab |
| Search Partners | Enabled | Test both | Ads appear on Google Search Partners (minor volume) |

**Where to configure:** Campaign settings > Networks

### Bidding settings

#### Available bid strategies

| **Bid strategy** | **Standard Shopping** | **PMax Feed-Only** | **Volume requirement** |
|------------------|----------------------|-------------------|----------------------|
| Manual CPC | Yes | No | None |
| Maximize Clicks | Yes | No | None |
| Target ROAS | Yes | Yes | 50+ conversions/month |
| Maximize Conversions | No | Yes | None |
| Maximize Conversion Value | No | Yes | None |
| Portfolio strategies (with Max CPC cap) | Yes | No | Varies |

> ⚠️ **Maximize Conversion Value and Maximize Conversions are not available for Standard Shopping:** Standard Shopping uses Manual CPC, Maximize Clicks, or Target ROAS. PMax uses Maximize Conversions or Maximize Conversion Value (with optional targets).

#### Manual CPC configuration

| **Setting** | **Location** | **Recommendation** |
|-------------|--------------|-------------------|
| Max CPC bids | Product groups (within ad groups) | Set at product group level, not campaign level |

**Where to set product group bids:** Campaigns > Ad groups > Product groups > Max CPC column

> ↪️ **For volume thresholds to transition from Manual CPC to Smart Bidding:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

#### Target ROAS configuration

| **Setting** | **Location** | **Recommendation** |
|-------------|--------------|-------------------|
| Target ROAS percentage | Campaign settings > Bidding | Set based on historical performance (start with actual ROAS minus 10-20%) |
| Portfolio bid strategy | Shared library > Bid strategies | Use when sharing target across campaigns |
| Max CPC bid limit | Portfolio strategies only | Set a ceiling to prevent runaway CPCs |

> ⚠️ **Portfolio bid strategies with Max CPC cap** are exclusive to Standard Shopping. PMax does not allow bid caps.

### Negative keyword settings

| **Level** | **Where to add** | **Scope** |
|-----------|-----------------|----------|
| Campaign negatives | Campaign > Keywords > Negative keywords | Affects all ad groups in campaign |
| Ad group negatives | Ad group > Keywords > Negative keywords | Affects only that ad group |
| Negative keyword lists | Shared library > Negative keyword lists | Apply to multiple campaigns |

**Supported match types for Shopping negatives:**
- Broad match (no modifier)
- Phrase match
- Exact match

> ↪️ **For brand separation via negatives:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### Ad group settings

| **Setting** | **Location** | **Purpose** |
|-------------|--------------|-------------|
| Ad group name | Ad group settings | Organize by product grouping |
| Default bid | Ad group settings | Fallback bid for ungrouped products |
| Product groups | Ad group > Product groups | Subdivision by attribute (brand, category, custom label, item ID) |

### Product group structure

Product groups define which products get which bids. Structure options:

| **Level** | **Subdivision options** |
|-----------|------------------------|
| All products | Starting point |
| Category | Google Product Category |
| Brand | Brand attribute from feed |
| Product type | Product type attribute from feed |
| Custom label | custom_label_0 through custom_label_4 |
| Item ID | Individual product IDs |
| Condition | New, Refurbished, Used |
| Channel | Online, Local |
| Channel exclusivity | Single-channel, Multi-channel |

**Best practice:** Subdivide by the attribute that reflects your bidding strategy (custom label for performance tiers, brand for brand-level bidding, etc.).

---

## PMax Feed-Only campaign settings

PMax Feed-Only uses only your product feed with no additional creative assets. This section covers settings specific to PMax.

### Campaign-level settings

#### Merchant Center link

Same as Standard Shopping. Select Merchant Center account at campaign creation.

#### Final URL expansion

| **Setting** | **Default** | **Recommendation** |
|-------------|-------------|-------------------|
| Final URL expansion | ON | Turn OFF for Feed-Only |

**Where to configure:** Campaign settings > Automatically created assets > Final URL expansion

#### Brand exclusions

| **Setting** | **Location** | **Recommendation** |
|-------------|--------------|-------------------|
| Brand exclusions | Settings > Other settings > Brand exclusions | Add your brand names |

Brand exclusions prevent your PMax campaign from showing on brand searches. This is critical for:
- Separating brand vs. generic performance
- Preventing PMax from cannibalizing cheap brand traffic
- Accurate measurement of new customer acquisition

**How to add:**
1. Go to Settings > Other settings > Brand exclusions
2. Click "Add brand lists"
3. Add your brand name(s)

> ↪️ **For complete brand separation implementation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### Bidding settings

| **Bid strategy** | **Availability** | **When to use** |
|------------------|-----------------|-----------------|
| Maximize Conversions | Yes | Building volume, insufficient conversion history |
| Maximize Conversion Value | Yes | Have conversion values, want value optimization |
| Target ROAS | Yes (with Maximize Conv Value) | 50+ conversions/month, want efficiency target |
| Target CPA | Yes (with Maximize Conversions) | Fixed CPA goal (less common for Ecommerce) |

> ⚠️ **Manual CPC and bid caps are NOT available in PMax:** If you need bid control, use Standard Shopping.

#### Target setting best practices

| **Scenario** | **Recommended strategy** |
|--------------|-------------------------|
| New campaign, no history | Maximize Conversion Value (no target) |
| 30-50 conversions/month | Maximize Conversion Value with loose tROAS |
| 50+ conversions/month | Target ROAS based on actual performance |

### Asset group settings (Listing groups)

In PMax, "Asset Groups" contain your listing groups. For Feed-Only:

| **Setting** | **Recommendation** |
|-------------|-------------------|
| Asset group name | Name by product segment (e.g., "Heroes", "All Products") |
| Listing group structure | Subdivide by custom label for performance segmentation |
| Images/Headlines/Descriptions | Leave empty for Feed-Only (no assets = Shopping-only delivery) |

> ⚠️ **If you add creative assets, PMax will serve on Display and YouTube:** Keep asset groups empty for Feed-Only behavior.

### Audience signals

> ⚠️ **Audience signals are for Full Assets PMax only:** For Feed-Only PMax, your product feed IS your targeting. Do not add audience signals to Feed-Only campaigns.

| **Setting** | **Location** | **Purpose** |
|-------------|--------------|-------------|
| Audience signals | Asset group > Audience signals | Guide Google's targeting (Full Assets only) |

**Recommended signals for Full Assets Ecommerce:**
- Customer Match list (purchasers)
- Website visitors (converters)
- Custom segments (competitor URLs, in-market keywords)

> ↪️ **For audience signal implementation:** See [Audience Signals Reference](../references/Audience Signals Reference.md).

### Data exclusions (Remarketing control)

| **Setting** | **Location** | **Purpose** |
|-------------|--------------|-------------|
| Your data exclusions | Campaign settings > Additional settings > Your data | Exclude remarketing audiences from optimization |

Use data exclusions when:
- ROAS looks artificially high (remarketing inflating numbers)
- You want to measure true new customer acquisition
- Testing incrementality

---

## Shared settings (Both campaign types)

### Location targeting

| **Setting** | **Options** | **Recommendation** |
|-------------|-------------|-------------------|
| Locations | Countries, regions, cities, radius | Target where you can ship and want to sell |
| Location options | Presence, Interest, or Both | Use "Presence" for most Shopping campaigns |

**Presence vs Interest:**
- **Presence:** User is physically in the location
- **Interest:** User has shown interest in the location
- **Both:** Either condition

> 💡 For Ecommerce with location-specific shipping, use "Presence" to avoid showing to users you cannot ship to.

### Schedule settings

| **Setting** | **Options** | **Recommendation** |
|-------------|-------------|-------------------|
| Ad schedule | Days and hours | Run 24/7 initially. Add schedules only after data shows clear patterns. |
| Start/end dates | Date picker | Set start date if launching in future. Avoid end dates unless time-limited promotion. |

### Budget settings

| **Setting** | **Options** | **Recommendation** |
|-------------|-------------|-------------------|
| Daily budget | Amount per day | Set based on your ROAS target and revenue goals. Budget = Target Revenue / Target ROAS. |

> ⚠️ **Shared budgets** are available for Standard Shopping (via Shared Library) but not for PMax.

### URL options

| **Setting** | **Purpose** | **Recommendation** |
|-------------|-------------|-------------------|
| Tracking template | Add URL parameters for tracking | Use if your analytics requires campaign-level parameters |
| Final URL suffix | Append parameters to all landing pages | Common for cross-platform tracking |
| Custom parameters | Define {_variables} for dynamic tracking | Advanced use only |

---

## Settings comparison table

| **Setting category** | **Standard Shopping** | **PMax Feed-Only** |
|---------------------|----------------------|-------------------|
| **Campaign priority** | High/Medium/Low | Not available |
| **Manual CPC** | Yes | No |
| **Maximize Clicks** | Yes | No |
| **Target ROAS** | Yes | Yes |
| **Maximize Conversions** | No | Yes |
| **Maximize Conversion Value** | No | Yes |
| **Portfolio strategies** | Yes (with Max CPC cap) | No |
| **Negative keywords** | Campaign + Ad group | Campaign only |
| **Negative keyword lists** | Yes | Yes |
| **Brand exclusions** | Via negatives | Dedicated setting |
| **Search Partners** | Configurable | Automatic |
| **Final URL expansion** | No | Yes (turn OFF) |
| **Audience signals** | No | Yes (not needed for Feed-Only) |
| **Data exclusions** | No | Yes |
| **Shared budgets** | Yes | No |
| **Inventory filter** | Yes | Yes |

---

## Settings by objective

### Maximum control

| **Objective** | **Campaign type** | **Key settings** |
|--------------|------------------|-----------------|
| Control bid amounts | Standard Shopping | Manual CPC, product group bids |
| Control query routing | Standard Shopping | Campaign priority + negatives |
| Control placements | Standard Shopping | Search Partners opt-out |
| Max CPC caps | Standard Shopping | Portfolio bid strategies with Max CPC limit |

### Automated efficiency

| **Objective** | **Campaign type** | **Key settings** |
|--------------|------------------|-----------------|
| Automated bidding (Standard) | Standard Shopping | Target ROAS |
| Automated bidding (PMax) | PMax Feed-Only | Maximize Conversion Value + Target ROAS |
| Reduced management | PMax Feed-Only | Empty asset groups, listing group segmentation |
| Volume scaling | PMax Feed-Only | Maximize Conversion Value (no target) |
| Upgrade path | PMax Feed-Only | Can upgrade from Standard Shopping when volume supports |

> 💡 **Standard Shopping with Manual CPC or Maximize Clicks requires more management effort:** With Target ROAS, Standard Shopping can also be automated. Only Manual CPC requires manual bid management.

### Brand protection

| **Objective** | **Campaign type** | **Key settings** |
|--------------|------------------|-----------------|
| Exclude brand queries (Shopping) | Standard Shopping | Brand terms as negative keywords |
| Exclude brand queries (PMax) | PMax Feed-Only | Brand exclusions in campaign settings |
| Prevent cross-campaign conflict | Both | Inventory filter or custom label exclusions |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Decision (which campaign type to use) |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Structure (priority and query sculpting) |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Structure (PMax configuration) |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Implementation (brand exclusion methods) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference (bid strategy volume requirements) |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference (audience signal types) |
| [Merchant Center Reference](../references/Merchant Center Reference.md) | Prerequisite (feed configuration) |
| [SOP – Launch Standard Shopping Campaign](../sops/SOP – Launch Standard Shopping Campaign.md) | Execution (Standard Shopping setup) |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Execution (PMax Feed-Only setup) |

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
