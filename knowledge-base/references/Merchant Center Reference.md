# Merchant Center Reference
Created: 2026-02-04

Support_ID: REFERENCE_13
Status: Done
Reference Type: Reference
Agent_Readable: No
Human_Facing: Yes
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

This reference documents Google Merchant Center configuration, features, and technical specifications for Shopping campaign management.

> ❓ **The core question:** What do I need to know about Merchant Center to manage product data effectively and avoid account issues?

Google Merchant Center is the hub connecting your product catalog to Google's Shopping surfaces. Understanding its features, data sources, and diagnostics is essential for maintaining healthy Shopping campaigns.

---

## What this is NOT

This reference does **not:**

- Explain product feed attributes (See: [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md))
- Provide attribute optimization recommendations (See: [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md))
- Explain feed quality concepts (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- Provide step-by-step setup instructions (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))

---

## Quick reference

| **Area** | **Key setting** | **Impact** |
|----------|-----------------|------------|
| **Data sources** | Primary vs supplemental | Determines what can add/remove products |
| **Automatic updates** | Price, availability, condition | Prevents mismatches, avoids disapprovals |
| **Attribute rules** | Transform feed data | Fix errors without changing source |
| **Account linking** | Google Ads connection | Required for Shopping campaigns |
| **Shipping settings** | Delivery time, cost | Affects ranking and competitiveness |
| **Return policy** | Return window, cost | Required for approval, affects ranking |

> 💡 Merchant Center is the missing link between your webshop and Google Ads. Without proper configuration, even perfect feeds cannot power Shopping campaigns.

---

## Merchant Center interface

### Main sections

| **Section** | **Purpose** | **Key actions** |
|-------------|-------------|-----------------|
| **Overview** | Performance snapshot and product status | Monitor daily performance, view product approval trends |
| **Products** | Product catalog management | Add products, fix errors, check visibility |
| **Business Info** | Store details and connections | Update business details, manage account linking |
| **Ad campaigns** | Campaign creation and management | Create and manage Shopping campaigns |
| **Analytics** | Performance reporting and insights | View clicks, impressions, price competitiveness |
| **Notifications** | Alerts and recommendations | Address setup issues, policy warnings |

### Products page features

| **Tab/Feature** | **What it shows** | **When to use** |
|-----------------|-------------------|-----------------|
| **All products** | Complete product catalog with status | Review product health, find specific items |
| **Needs attention** | Products with errors or warnings | Prioritize fixes, resolve disapprovals |
| **History graph** | Product status trends over time | Identify sudden changes, track improvements |
| **What to do next** | Personalized recommendations | Follow actionable suggestions for improvement |

---

## Product status and visibility

### Product status values

| **Status** | **Meaning** | **Action required** |
|------------|-------------|---------------------|
| **Under review** | Google reviewing product | Wait 3-5 business days for Shopping ads |
| **Processing** | Google processing updates | Wait up to 15 minutes |
| **Approved** | Product showing on Google | None: product is live |
| **Limited** | Showing in some instances only | Check "Needs attention" for restrictions |
| **Not approved** | Product cannot show | Fix errors in "Needs attention" tab |

### Product visibility

| **Visibility** | **Indicator** | **Meaning** |
|----------------|---------------|-------------|
| **Showing** | Green dot | Product actively serving |
| **Hidden** | Hidden icon | Product manually hidden from serving |
| **Error** | Error icon | Product cannot serve due to errors |

> ⚠️ **Visibility vs Status:** You control visibility (show/hide products). Google controls status (approved/not approved). A product must be both visible AND approved to serve.

### Common disapproval reasons

| **Category** | **Examples** | **Resolution** |
|--------------|--------------|----------------|
| **Policy violations** | Prohibited content, misrepresentation | Review Shopping Ads policies, fix violations |
| **Data quality** | Missing required attributes, format errors | Fix product data per specifications |
| **Price/availability mismatch** | Feed differs from landing page | Enable automatic updates, sync feed more frequently |
| **Website issues** | Missing contact info, broken checkout | Fix website compliance issues |

---

## Data sources

### Primary vs supplemental data sources

| **Aspect** | **Primary data source** | **Supplemental data source** |
|------------|-------------------------|------------------------------|
| **Purpose** | Main source of product data | Override or add attributes |
| **Can add products** | Yes | No |
| **Can remove products** | Yes | No |
| **Standalone use** | Yes | No: must link to primary |
| **Typical use** | Full product catalog | Custom labels, price overrides, Labelizer |

> 💡 Google recommends submitting all products in a single primary data source. Use `excluded_destination` to exclude products rather than separate feeds.

### Upload methods

| **Method** | **Best for** | **Automation** | **Scalability** | **Recommendation** |
|------------|--------------|----------------|-----------------|-------------------|
| **Scheduled file fetch** | Most retailers | High | High | S-tier: Preferred method |
| **Content API** | Large/complex catalogs, real-time updates | High | High | A-tier: For frequent changes |
| **Google Sheets** | Small catalogs, manual control | Medium | Low | B-tier: Simple setup |
| **Automated (website crawl)** | Basic setup, low maintenance | High | Medium | C-tier: Lagging, inaccurate |
| **Manual product editor** | Handful of products | None | Very low | D-tier: Last resort only |

**Scheduled file fetch advantages:**
- Automate and synchronize product data
- Full flexibility over feed configuration
- Scales to thousands of products
- Works with multiple channels beyond Google
- Time-efficient with high return on effort

**Content API advantages:**
- Real-time synchronization
- Efficient for large, complex catalogs
- Frequent updates without file uploads
- Programmatic management

### Creating a data source

**Required information:**

| **Field** | **Description** |
|-----------|-----------------|
| **Target countries** | Countries where products are sold |
| **Language** | Language of product data |
| **Data source label** | Identifier for Google Ads targeting (feed label) |
| **Marketing method** | Which Google features can use the data |
| **Data source name** | Descriptive name for identification |
| **File name** | Exact name of file being submitted (if file-based) |

### Supplemental data source uses

| **Use case** | **Attributes typically included** |
|--------------|-----------------------------------|
| **Custom labels** | `custom_label_0` through `custom_label_4` |
| **Price/availability updates** | `id`, `price`, `availability` |
| **Labelizer integration** | Performance-based labels |
| **Regional pricing** | `id`, `region_id`, `price`, `availability` |

---

## Automatic item updates

### Available automations

| **Attribute** | **What it does** | **Requirement** |
|---------------|------------------|-----------------|
| **Price** | Updates price from landing page | Schema.org markup recommended |
| **Sale price** | Updates sale price and strikethrough | Schema.org markup recommended |
| **Availability** | Updates in_stock/out_of_stock | Schema.org markup recommended |
| **Condition** | Updates new/used/refurbished | Schema.org markup recommended |

### How automations work

1. Google crawls your landing pages
2. Reads structured data markup (schema.org)
3. Updates product data in Merchant Center
4. Prevents mismatches between feed and site

> ⚠️ Automations are not a replacement for regular feed updates. They fix temporary problems for a small percentage of products. Continue updating product data frequently.

### Schema.org mapping

| **Feed attribute** | **Schema.org property** |
|--------------------|------------------------|
| `price` | `price`, `priceCurrency` |
| `availability` | `availability` (InStock, OutOfStock, PreOrder) |
| `condition` | `itemCondition` (NewCondition, UsedCondition, RefurbishedCondition) |

### Enabling automations

1. Go to **Products** > **Automations** tab
2. Select specific automation to configure
3. Toggle updates **on** or **off** per attribute

---

## Attribute rules

Attribute rules transform product data within Merchant Center without changing your source feed.

### Rule types

| **Rule type** | **Purpose** | **Example use** |
|---------------|-------------|-----------------|
| **Set to** | Populate attribute from feed column or static value | Map custom column to Google attribute |
| **Extract** | Pull value from another attribute | Extract color from title |
| **Take latest** | Use most recent value from multiple sources | Price from primary or supplemental |
| **Prepend** | Add text to beginning of attribute | Add brand to title |
| **Append** | Add text to end of attribute | Add size to title |
| **Find & replace** | Replace text patterns | Change "pumps" to "pump heels" |
| **Standardize** | Map unsupported to supported values | Change "vintage" to "used" |
| **Calculate** | Math operations on numeric values | Calculate sale price from percentage |
| **Clear** | Remove attribute value | Remove "n/a" values |

### Setting up attribute rules

1. Go to **Settings** > **Data sources**
2. Select a product source
3. Click **Attribute rules** tab
4. Click **Add attribute rule** and select attribute
5. Configure rule operations
6. Click **Save as draft**
7. Click **Test rules** to preview
8. Click **Apply changes** to activate

### Conditions

Apply rules only to products meeting specific criteria:

| **Operator** | **Use** |
|--------------|---------|
| **equals** | Exact match (case insensitive) |
| **contains** | Partial match |
| **does not equal** | Exclude specific values |
| **AND** | Both conditions must be true |
| **OR** | Either condition can be true |

> 💡 Rules execute in cascade order. First rule runs, then second uses that output, and so on.

### Advanced data source management

Enable the "Advanced data source management" add-on to access:
- Supplemental data sources
- Full attribute rules functionality
- ID rules configuration

---

## Account linking and integrations

### Google Ads linking

| **Requirement** | **Details** |
|-----------------|-------------|
| **Where to link** | Settings > Linked accounts > Google Ads |
| **Account access** | Admin access to both accounts required |
| **Link direction** | Link initiated from Merchant Center |
| **Multiple accounts** | One Merchant Center can link to multiple Google Ads accounts |

### Third-party platform integrations

| **Platform** | **Integration type** | **Notes** |
|--------------|---------------------|-----------|
| **Shopify** | Direct integration via Google & YouTube channel | Content API, automatic sync |
| **WooCommerce** | Plugin (Google Listings & Ads or third-party) | Various options available |
| **Magento** | Extension or Content API | Multiple solutions |
| **BigCommerce** | Built-in integration | Channel Manager app |

> ⚠️ Platform integrations have limitations. For advanced feed optimization, use a dedicated Feed Management Tool (FMT) like Channable, DataFeedWatch, or Feedonomics.

---

## Shipping settings

### Shipping service configuration

| **Element** | **What to configure** |
|-------------|----------------------|
| **Service name** | Descriptive name (e.g., "Standard Shipping - US") |
| **Countries served** | Target countries for this service |
| **Delivery time** | Handling time + transit time |
| **Shipping cost** | Flat rate, weight-based, price-based, or free |
| **Order cutoff** | Time after which orders ship next day |

### Shipping impact on ranking

| **Factor** | **Impact** |
|------------|------------|
| **Lower delivery time** | Higher Shopping Experience score |
| **Lower shipping cost** | Better price competitiveness |
| **Free shipping** | Significant ranking boost |

> 💡 Don't underestimate shipping costs. Google factors shipping into total price competitiveness. Free shipping can significantly improve ranking.

---

## Return policy

### Required return policy elements

| **Element** | **Requirement** |
|-------------|-----------------|
| **Return window** | Number of days to return |
| **Return method** | How customers return items |
| **Refund method** | How refunds are processed |
| **Exceptions** | Items excluded from returns |

### Return policy impact

| **Factor** | **Impact** |
|------------|------------|
| **Longer return window** | Higher Shopping Experience score |
| **Lower return cost** | Better customer experience |
| **Free returns** | Competitive advantage |

> ⚠️ You must have a return policy even if you don't accept returns. State your policy explicitly on your website.

---

## Diagnostics and troubleshooting

### Diagnostics tab

| **Section** | **What it shows** |
|-------------|-------------------|
| **Item issues** | Specific product attribute problems |
| **Account issues** | Setup, policy, or configuration problems |
| **History graph** | Product status trends over time |

### Issue severity levels

| **Severity** | **Meaning** | **Impact** |
|--------------|-------------|------------|
| **Error** | Critical issue | Product disapproved |
| **Warning** | Non-critical issue | Product limited or at risk |
| **Opportunity** | Improvement suggestion | Potential performance gain |

### Common item issues

| **Issue** | **Cause** | **Fix** |
|-----------|-----------|---------|
| **Missing GTIN** | No GTIN provided | Add GTIN or set `identifier_exists` to false |
| **Price mismatch** | Feed price differs from landing page | Update feed or enable automatic updates |
| **Availability mismatch** | Feed shows in stock, page shows out of stock | Sync feed more frequently |
| **Image too small** | Image below minimum resolution | Use images 100x100px minimum (1500x1500 recommended) |
| **Missing required attribute** | Category-specific attribute missing | Add required attribute per category |

### Downloading issue reports

1. Go to **Settings** > **Data sources**
2. Select a data source
3. Go to **Latest update** tab
4. Find **Your product file** section
5. Click **Download report**

---

## Merchant Center programs

### Available programs

| **Program** | **Purpose** | **Requirements** |
|-------------|-------------|------------------|
| **Shopping ads** | Paid product listings | Google Ads link, payment method |
| **Free listings** | Organic product visibility | Feed submitted, policies met |
| **Dynamic remarketing** | Show products to past visitors | Remarketing tag, dynamic feed |
| **Local inventory ads** | Show local store availability | Business Profiles, local inventory feed |
| **Promotions** | Show special offers with products | Promotions feed or manual entry |
| **Product ratings** | Display star ratings on PLAs | Approved ratings provider |
| **Buy on Google** | Checkout on Google (US) | Enrollment, payments setup |

### Promotions

| **Promotion type** | **Example** |
|--------------------|-------------|
| **Percent off** | 20% off all items |
| **Amount off** | €10 off orders over €50 |
| **Free gift** | Free tote bag with purchase |
| **Free shipping** | Free shipping on orders over €75 |

---

## Shopping Experience Scorecard

Available in select countries. Affects ranking in Shopping tab for retailers with "Exceptional" rating.

### Scorecard categories

| **Category** | **Metrics** |
|--------------|-------------|
| **Shipping experience** | Delivery time, delivery cost |
| **Return experience** | Return window, return cost |
| **Browsing experience** | High-res images, images per item |
| **Purchase experience** | Promotion disapproval rate, payment methods |

### Improving scorecard performance

| **Action** | **Impact area** |
|------------|-----------------|
| Reduce delivery time | Shipping experience |
| Offer free or low-cost shipping | Shipping experience |
| Extend return window | Return experience |
| Offer free returns | Return experience |
| Use high-resolution images (>1048px) | Browsing experience |
| Add multiple product images | Browsing experience |
| Reduce promotion disapprovals | Purchase experience |
| Accept more payment methods | Purchase experience |

---

## Best practices

### Feed management

| **Practice** | **Rationale** |
|--------------|---------------|
| Use a Feed Management Tool | Full control, scalability, multi-channel |
| Update feed at least daily | Avoid price/availability mismatches |
| Enable automatic updates | Safety net for temporary mismatches |
| Monitor diagnostics regularly | Catch issues before they impact performance |
| Use supplemental feeds for dynamic data | Separate volatile data from stable data |

### Account health

| **Practice** | **Rationale** |
|--------------|---------------|
| Sign in at least every 14 months | Prevent account deactivation |
| Fix errors before warnings | Errors cause disapprovals |
| Monitor account issues | Account-level issues affect all products |
| Keep website compliant | Contact info, policies, checkout required |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Feed quality concepts and prioritization |
| [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md) | Attribute specifications and syntax |
| [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md) | Optimization recommendations per attribute |
| [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md) | Validation checklist |
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Step-by-step setup |

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
