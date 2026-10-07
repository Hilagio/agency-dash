# Customer Lifecycle Optimization Reference
Created: 2026-02-04
Updated: 2026-10-05

Support_ID: REFERENCE_17
Status: Done
Reference Type: Reference
Agent_Readable: No
Human_Facing: Yes
Applies_To: Lead Gen, SaaS, Ecommerce
Domain: Bidding
Pillar: 9

## Purpose

This reference documents customer lifecycle optimization settings in Google Ads, covering new customer acquisition, high-value customer targeting, and lapsed customer re-engagement.

Customer lifecycle optimization adjusts bidding to prioritize different customer segments. These settings are configured at the account level and applied at the campaign level to optimize for customer lifetime value rather than individual transactions.

---

## What this is / What this is NOT

**This reference:**

- Documents the account-level customer lifecycle settings and what each one adds to conversion value
- Documents the campaign-level customer acquisition and prospecting modes
- Records the campaign support matrix and the identification methods behind it
- Sets out the reporting distortion that incremental value introduces

**This reference does NOT:**

- Explain PMax campaign configuration (See: [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md))
- Explain conversion tracking setup (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Explain audience creation (See: [Audience Signals Reference](../references/Audience Signals Reference.md))
- Provide bid strategy selection guidance (See: [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md))

---

## Quick reference

| **Setting level** | **Setting** | **Effect** | **Campaign support** |
|-------------------|-------------|------------|---------------------|
| Account | New customer value | Adds incremental value for new customers | PMax, Search |
| Account | High value customer value | Adds incremental value for high-value new customers | PMax, Search |
| Account | Lapsed customer value | Adds incremental value for lapsed customers | PMax only |
| Campaign | Customer acquisition mode | Controls bidding for new customers | PMax, Search |

---

## Account-level settings

Account-level customer lifecycle settings are configured in **Goals > Summary > Customer lifecycle optimization**.

### New customer acquisition

New customer acquisition settings allow you to bid more for users who have not previously converted.

#### New customer value (regular)

| **Setting** | **Description** |
|-------------|-----------------|
| **Add incremental conversion value for new customers** | Adds a specified value on top of the conversion value when the customer is new |
| **Suggested value** | Based on your average purchase conversion value (e.g., if average order is €100 and customer makes 3 purchases, suggest €200 incremental value) |

**How to calculate suggested value:**

```
Incremental value = (Average customer lifetime value) - (Average first purchase value)
```

**Example:**
- Average first purchase: €100
- Average customer makes 3 purchases over lifetime
- Customer lifetime value: €300
- Incremental value for new customer: €200

#### Audience segments for new customer identification

| **Setting** | **Description** |
|-------------|-----------------|
| **Audience segments of current customers** | Upload a list of existing customers so Google can identify who is "new" |
| **Minimum list size** | 100 active members per segment on the YouTube or Search network to be eligible. 1,000 matched users recommended |
| **List type** | Customer Match list of all purchasers/converters |

> ⚠️ **Without a customer list, Google falls back to conversion history alone.** That misses every existing customer who has not converted through Google Ads, which is what a full Customer Match list closes.

### Customer identification methods

Google uses three methods to identify customer segments for reporting, bidding, and targeting:

| **Method** | **Description** | **Accuracy** |
|------------|-----------------|--------------|
| **Autodetection (default)** | Google detects based on conversion history and cookies | Lowest |
| **Customer Match lists** | Upload your customer lists to identify existing customers | Medium |
| **Conversion tag parameter** | Pass new vs. existing customer data in the conversion tracking tag | Highest |

> 💡 **The three methods stack rather than replace each other.** First-party data plus the new-versus-existing parameter in the conversion tag supplements autodetection, and accuracy rises with each layer added.

### High-value customer acquisition

High-value customer settings allow you to bid even more for new customers who are likely to become high-value.

| **Setting** | **Description** |
|-------------|-----------------|
| **Add incremental conversion value for new customers (high value)** | Adds additional value for new customers predicted to be high-value |
| **Audience segments for high value customers** | Customer Match list of your highest-value customers for modeling |

**How it works:** the uploaded list of best customers (top 10-20% by LTV) is the modelling seed. Google learns the characteristics of that group, and new customers matching the profile receive an additional bid boost on top of the regular new-customer value.

> 💡 **High value customer settings only apply to Performance Max and Search campaigns:** Other campaign types do not support this feature.

---

## Critical limitations

> ⚠️ **These features help steer the algorithm, but are never 100% accurate:** Always validate in-platform results with independent third-party attribution data.

### Inflated conversion value reporting

When you add incremental value for new customers, your reported conversion value will be higher than your actual revenue:

| **Issue** | **Explanation** |
|-----------|-----------------|
| Inflated total value | The incremental value is added to each new customer conversion, inflating your reported results |
| Returning customer problem | If a "new" customer returns and converts again, you cannot deduct the previously assigned extra lifetime value |
| No automatic offset | Adding value to new customers does NOT automatically decrease value for existing customers |
| ROAS target confusion | You must adjust your ROAS targets to account for the inflated values (difficult to calculate accurately) |

### What the incremental value depends on

Three unknowns sit behind any incremental value, and each one distorts the number if it is guessed:

| Unknown | Why it matters |
|---------|----------------|
| What a new customer is actually worth | The incremental value is only as good as the LTV data behind it |
| The average order value gap between new and existing customers | A narrow gap makes the whole setting close to a no-op |
| How many "new" customers would have bought regardless | Non-incremental conversions inherit the boost without earning it |

### Validation requirement

When using "new customers only" mode, you may still see returning customers in your conversion data. Reasons include:

- Autodetection misclassification
- Incomplete Customer Match lists
- Users on new devices/browsers

Google's new-customer reporting is a classification, not a fact. CRM data and third-party attribution are what establish how far it drifts.

### Lapsed customer re-engagement (Customer retention)

Lapsed customer settings help re-engage customers who have not purchased recently.

| **Setting** | **Description** |
|-------------|-----------------|
| **Add incremental conversion value for lapsed customers** | Adds specified value for customers returning after a period of inactivity |
| **Audience segments for lapsed customers** | Customer Match list defining who counts as "lapsed" |
| **Audience segments for existing customers** | Customer Match list of all customers (to distinguish lapsed from active) |
| **Lapsed customers (high value)** | Additional incremental value for high-value lapsed customers |

**Lapsed customer definition:**

Define "lapsed" based on your business cycle:
- Ecommerce (consumables): No purchase in 90 days
- Ecommerce (durables): No purchase in 12 months
- SaaS: Churned accounts
- Lead Gen: Previous leads who did not convert

### Loyalty program members (Customer retention)

The loyalty program members setting reaches and re-engages members of your loyalty program. It runs on a Customer Match list of members plus the loyalty program benefits in your Merchant Center feed.

| **Setting** | **Description** |
|-------------|-----------------|
| **Show member benefits to loyalty program members** | Shows member price and member shipping on Shopping ads in eligible countries |
| **Bid higher for loyalty program members** | Adds the member value to a member's purchase so Smart Bidding bids more for members |

Bid strategies: Target ROAS and Maximize Conversion Value.

> ⚠️ **Bidding higher for members raises reported value, not proven incremental value.** Loyalty members are the customers most likely to buy without an ad. Set the member value from CRM data, the same way as the new customer and lapsed customer values, and read the result against a holdout or an experiment before scaling it.

> ⚠️ **Customer retention support differs per setting:** Re-engagement and high-value re-engagement run in Performance Max only. The loyalty program members setting runs in Performance Max and Shopping. Search campaigns support customer acquisition but no customer retention setting.

---

## Campaign-level settings

Campaign-level customer acquisition settings control how the campaign bids for new vs returning customers.

### Customer acquisition mode

| **Mode** | **Effect** | **When to use** |
|----------|------------|-----------------|
| **Bid equally for new and existing customers** | No bid adjustment for new customers | When you want equal treatment of new and returning |
| **Bid higher for new customers** | Higher bids for users not in your customer list | Growth focus with balanced remarketing |
| **Only bid for new customers** | Excludes returning customers from bidding | Pure acquisition campaigns |

**Where to configure:** Campaign settings > Customer acquisition

### Prospecting mode (new prospects)

Prospecting mode is a newer, broader exclusion than "only bid for new customers". It tells Search and AI Max to bid only for new prospects, excluding anyone who has already searched your brand, visited your site, or engaged with you on Google or YouTube. Where "new customers" is defined by your customer list and conversion history, "new prospects" excludes the whole pool of people who have already engaged with you.
| **Mode** | **Excludes** | **Use when** |
|----------|--------------|--------------|
| Bid higher for new customers | Nobody (just bids up for new) | Default growth posture with remarketing intact |
| Only bid for new customers | Prior converters and customer-list members | Pure customer acquisition |
| Only bid for new prospects | Anyone who searched your brand, visited your site, or engaged on Google or YouTube | Pure top-of-funnel prospecting, when you deliberately want zero overlap with already-engaged users |

> ⚠️ **Default to the least aggressive mode.** Start with "bid more for new customers" and keep remarketing and brand traffic in their own campaigns. Reserve "only bid for new prospects" for a deliberate pure-prospecting goal: it removes a large pool of warm, high-intent users (brand searchers, site visitors), which usually lowers conversion rate and volume. Keep your brand and remarketing campaigns funded so they own that excluded traffic.

### Tracking vs bidding distinction

| **Feature** | **Purpose** | **Requires** |
|-------------|-------------|--------------|
| **New customer data (tracking)** | See new vs returning breakdown in reports | New customer data conversion feature enabled |
| **Customer acquisition (bidding)** | Adjust bids for new customers | Account-level settings + campaign-level mode |

> 💡 **You can track new vs returning without enabling bid optimization:** Enable the new customer data conversion feature for reporting, then decide if you want to enable bid optimization.

---

## Where each setting lives

| Layer | Location | What it holds |
|-------|----------|---------------|
| Account | Goals > Summary > Customer lifecycle optimization | Customer acquisition and retention toggles, Customer Match lists, incremental values |
| Campaign | Campaign settings > Customer acquisition | The mode: Off, Bid higher for new customers, Only bid for new customers, Only bid for new prospects |
| Reporting | Campaign report segmented by Customer type | The new versus returning split, readable after 7+ days |

Configuring them is owned by [SOP - Set Up New Customer Tracking](../sops/SOP – Set Up New Customer Tracking.md), Phase 4.

---

## Campaign support matrix

| **Feature** | **Performance Max** | **Search** | **Shopping** | **Demand Gen** |
|-------------|---------------------|------------|--------------|----------------|
| New customer acquisition | Yes | Yes | Yes | Yes |
| High-value customer acquisition | Yes | Yes | No | No |
| Customer retention (lapsed) | Yes | No | No | No |
| Customer retention (loyalty program members) | Yes | No | Yes | No |

---

## Best practices

| **Practice** | **Rationale** |
|--------------|---------------|
| Start with "Bid higher for new customers" | Less aggressive than excluding returning customers |
| Use accurate LTV data for incremental values | Incorrect values lead to over/under bidding |
| Upload comprehensive customer lists | Better new customer identification |
| Segment high-value customers carefully | Top 10-20% by LTV, not just recent purchasers |
| Review and update lists quarterly | Customer definitions change over time |
| Test incrementality | Compare new customer volume before/after enabling |
| Validate with third-party attribution | In-platform reporting may not tell the full story |

---

## Common mistakes

| **Mistake** | **Impact** | **Fix** |
|-------------|------------|---------|
| Setting incremental value too high | Overbidding for new customers, poor ROAS | Calculate based on actual LTV data |
| No customer list uploaded | Google relies on conversion history only | Upload Customer Match list |
| Using "Only bid for new" too early | Loses remarketing conversions entirely | Start with "Bid more for new" |
| Ignoring high-value segment | Treats all new customers equally | Upload high-value customer list |
| Not tracking before enabling | No baseline for comparison | Enable tracking first, then bidding |
| Trusting only in-platform reporting | Google may over-report due to attribution | Cross-reference with third-party attribution |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md) | Campaign configuration |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Customer Match list creation |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Bid strategy context |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Volume requirements |

---

## Version details

- **Version:** 3.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
