# Customer Lifecycle Optimization Reference
Created: 2026-02-04
Updated: 2026-02-05

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

## What this is NOT

This reference does **not:**

- Explain PMax campaign configuration (See: [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md))
- Explain conversion tracking setup (See: [SOP – Set Up Conversion Tracking](../sops/SOP – Set Up Conversion Tracking.md))
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

Account-level customer lifecycle settings are configured in **Tools & Settings > Conversions > Customer lifecycle goals**.

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
| **Minimum list size** | 1,000 matched users recommended |
| **List type** | Customer Match list of all purchasers/converters |

> ⚠️ **Without a customer list, Google uses conversion history only:** For accurate new customer identification, upload your full customer list via Customer Match.

### Customer identification methods

Google uses three methods to identify customer segments for reporting, bidding, and targeting:

| **Method** | **Description** | **Accuracy** |
|------------|-----------------|--------------|
| **Autodetection (default)** | Google detects based on conversion history and cookies | Lowest |
| **Customer Match lists** | Upload your customer lists to identify existing customers | Medium |
| **Conversion tag parameter** | Pass new vs. existing customer data in the conversion tracking tag | Highest |

> 💡 **For best accuracy, use all three methods together:** First-party data combined with the new vs. existing customer parameter in your conversion tag supplements autodetection and significantly improves identification accuracy.

### High-value customer acquisition

High-value customer settings allow you to bid even more for new customers who are likely to become high-value.

| **Setting** | **Description** |
|-------------|-----------------|
| **Add incremental conversion value for new customers (high value)** | Adds additional value for new customers predicted to be high-value |
| **Audience segments for high value customers** | Customer Match list of your highest-value customers for modeling |

**How it works:**
1. Upload a list of your best customers (top 20% by LTV)
2. Google models characteristics of high-value customers
3. New customers matching high-value profile receive additional bid boost

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

### Questions to consider before enabling

Before assigning incremental value to new customers, answer these questions:

1. **What is a new customer really worth?** Do you have reliable LTV data?
2. **What is the average order value difference** between new and existing customers?
3. **How many "new" customers would have bought from you regardless?** Not all conversions are truly incremental.

### Validation requirement

When using "new customers only" mode, you may still see returning customers in your conversion data. Reasons include:

- Autodetection misclassification
- Incomplete Customer Match lists
- Users on new devices/browsers

**Always cross-reference:** Compare Google's new customer reporting with your own CRM data and third-party attribution tools to verify accuracy.

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

> ⚠️ **Customer retention settings are only supported in Performance Max campaigns:** Search campaigns support customer acquisition but not customer retention.

---

## Campaign-level settings

Campaign-level customer acquisition settings control how the campaign bids for new vs returning customers.

### Customer acquisition mode

| **Mode** | **Effect** | **When to use** |
|----------|------------|-----------------|
| **Off** | No bid adjustment for new customers | When you want equal treatment of new and returning |
| **Bid more for new customers** | Higher bids for users not in your customer list | Growth focus with balanced remarketing |
| **Only bid for new customers** | Excludes returning customers from bidding | Pure acquisition campaigns |

**Where to configure:** Campaign settings > Customer acquisition

### Tracking vs bidding distinction

| **Feature** | **Purpose** | **Requires** |
|-------------|-------------|--------------|
| **New customer data (tracking)** | See new vs returning breakdown in reports | New customer data conversion feature enabled |
| **Customer acquisition (bidding)** | Adjust bids for new customers | Account-level settings + campaign-level mode |

> 💡 **You can track new vs returning without enabling bid optimization:** Enable the new customer data conversion feature for reporting, then decide if you want to enable bid optimization.

---

## Configuration workflow

### Step 1️⃣: Set up account-level settings

1. Go to **Tools & Settings > Conversions > Customer lifecycle goals**
2. Enable customer acquisition and/or customer retention
3. Upload Customer Match lists for customer identification
4. Set incremental values based on your LTV calculations

### Step 2️⃣: Configure campaign-level settings

1. Open your PMax or Search campaign
2. Go to **Campaign settings > Customer acquisition**
3. Select the appropriate mode (Off, Bid more, Only bid for new)

### Step 3️⃣: Verify configuration

1. After 7+ days, check campaign performance by customer type
2. Segment by **Customer type** to see new vs returning breakdown
3. Verify incremental value is being applied correctly

---

## Campaign support matrix

| **Feature** | **Performance Max** | **Search** | **Shopping** | **Display** |
|-------------|---------------------|------------|--------------|-------------|
| New customer acquisition | Yes | Yes | No | No |
| High-value customer acquisition | Yes | Yes | No | No |
| Customer retention (lapsed) | Yes | No | No | No |

---

## Best practices

| **Practice** | **Rationale** |
|--------------|---------------|
| Start with "Bid more for new customers" | Less aggressive than excluding returning customers |
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

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
