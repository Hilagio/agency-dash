# SOP – Set Up Cart Data and Profit Tracking
Created: 2026-02-04
Updated: 2026-04-02

Agent_Executable: No
Category: Measurement
Human_Approval_Required: No
Primary Outcome: Cart Data sending product-level sales data to Google Ads with COGS-based gross profit reporting
SOP_ID: SOP_26
Status: Done
Domain: Measurement
Pillar: 5
Applies_To: Ecommerce

### Purpose

This SOP walks you through configuring cart-level data and cost of goods sold (COGS) tracking so Google Ads reports show gross profit, cart size, and product-level conversion data.

> ❓ **The big question:** Can you see actual profit per product, not just revenue, in your Google Ads reports?

---

### What this SOP is NOT

This SOP does **not:**

- Explain why profit tracking matters (See: [Unit Economics Mental Model](../mental-models/Unit Economics Mental Model.md))
- Set up basic conversion tracking (See: existing conversion tracking SOP)
- Configure bidding strategies that use profit data (downstream SOP)
- Cover Google Analytics 4 ecommerce tracking (separate implementation)

### When to run this SOP

Run this SOP when:

- Running Shopping or PMax campaigns for ecommerce
- You want to optimize toward profit instead of revenue
- Product margins vary significantly across the catalog
- You need cart-level data for product group performance analysis

---

### Before you start

#### Required inputs

- Google Ads account with purchase conversion action configured
- Google Merchant Center account with active product feed
- Google Tag Manager container or gtag.js implementation
- Developer access to modify the data layer on the purchase confirmation page
- COGS data for products in the catalog

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| Google Merchant Center feed specifications | Adding cost_of_goods_sold attribute |
| Google Ads conversion tag documentation | Cart data parameter reference |
| Google Tag Manager workspace | Tag configuration |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Brief Developer** | Enhance data layer with cart-level fields | Data layer pushing items array and merchant parameters |
| **Phase 2️⃣: Add COGS to Product Feed** | Include cost data in Merchant Center | Product feed with cost_of_goods_sold attribute |
| **Phase 3️⃣: Configure in GTM or gtag** | Enable cart data in the conversion tag | Conversion tag sending product-level sales data |
| **Phase 4️⃣: Validate** | Confirm data flows into Google Ads reports | Cart data columns visible in product group reports |
| **Phase 5 (Optional): ProfitMetrics** | Plug-and-play alternative for Shopify/WooCommerce | Automated profit tracking without manual setup |

---

## Phase 1️⃣: Brief Developer

### 1.1 Define the required data layer fields

Send this specification to your developer. The purchase event data layer must include these fields:

| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `items` | Array | Product-level details for each item in the cart | See below |
| `items[].id` | String | Product ID matching Merchant Center feed | `"SKU-12345"` |
| `items[].price` | Number | Unit price of the item | `49.99` |
| `items[].quantity` | Integer | Number of units purchased | `2` |
| `aw_merchant_id` | String | Google Merchant Center account ID | `"123456789"` |
| `aw_feed_country` | String | Feed target country (ISO 3166-1 alpha-2) | `"US"` |
| `aw_feed_language` | String | Feed language (ISO 639-1) | `"en"` |

### 1.2 Data layer push example

Provide this example to the developer:

```javascript
dataLayer.push({
  'event': 'purchase',
  'transaction_id': 'T-98765',
  'value': 149.97,
  'currency': 'USD',
  'aw_merchant_id': '123456789',
  'aw_feed_country': 'US',
  'aw_feed_language': 'en',
  'items': [
    {
      'id': 'SKU-12345',
      'price': 49.99,
      'quantity': 2
    },
    {
      'id': 'SKU-67890',
      'price': 49.99,
      'quantity': 1
    }
  ]
});
```

> ⚠️ **Product IDs must match your Merchant Center feed exactly:** If your feed uses the `item_group_id` for variants, the data layer must send the same ID. Mismatched IDs break the cart data join.

### 1.3 Verify developer implementation

1. Open the purchase confirmation page after a test order
2. Open browser console and type `dataLayer`
3. Confirm the purchase event contains all required fields
4. Verify product IDs match what appears in Merchant Center

---

## Phase 2️⃣: Add COGS to Product Feed

### 2.1 Add cost_of_goods_sold to your feed

In your Google Merchant Center product feed, add the `cost_of_goods_sold` attribute:

| Feed attribute | Format | Example |
|---------------|--------|---------|
| `cost_of_goods_sold` | Number with currency | `15.50 USD` |

### 2.2 Populate COGS data

1. Export your product catalog
2. Add a `cost_of_goods_sold` column
3. Fill in the direct cost per unit for each product (materials, manufacturing, shipping to warehouse)
4. Upload the updated feed to Merchant Center

### 2.3 Validate feed processing

1. Go to Merchant Center > Products > Diagnostics
2. Check that no errors appear for the `cost_of_goods_sold` attribute
3. Confirm the attribute shows in individual product details

> 💡 **No COGS data? Use estimated margins:** If exact COGS is unavailable, use category-level estimates. Approximate profit data is better than no profit data for Smart Bidding.

---

## Phase 3️⃣: Configure in GTM or gtag

### 3A: GTM configuration

1. Open Google Tag Manager
2. Go to Tags > select your Google Ads Purchase conversion tag
3. Check the box "Provide product-level sales data"
4. Map the data layer variables:
   - Data Source: Data Layer
   - Items: `{{DLV - items}}`
   - Merchant ID: `{{DLV - aw_merchant_id}}`
   - Feed Country: `{{DLV - aw_feed_country}}`
   - Feed Language: `{{DLV - aw_feed_language}}`
5. Save and publish

### 3B: gtag configuration (alternative)

If using gtag.js directly, add the cart parameters to the purchase conversion snippet:

```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXX/YYYYYYY',
  'value': 149.97,
  'currency': 'USD',
  'transaction_id': 'T-98765',
  'aw_merchant_id': '123456789',
  'aw_feed_country': 'US',
  'aw_feed_language': 'en',
  'items': [
    {'id': 'SKU-12345', 'price': 49.99, 'quantity': 2},
    {'id': 'SKU-67890', 'price': 49.99, 'quantity': 1}
  ]
});
```

---

## Phase 4️⃣: Validate

### 4.1 Debug in GTM

1. Open GTM Preview mode
2. Complete a test purchase
3. Click the purchase event in the debug panel
4. Verify the conversion tag shows cart data parameters populated

### 4.2 Check Google Ads reports

Allow 24-48 hours after the first conversion with cart data, then:

1. Go to Google Ads > Campaigns > select a Shopping or PMax campaign
2. Navigate to Product Groups
3. Add these columns to the report:

| Column | What it shows |
|--------|--------------|
| Gross profit | Revenue minus COGS per product |
| Cost of goods sold | COGS value from your feed |
| Average cart size | Average number of items per transaction |
| Lead/cart revenue | Revenue attributed at the product level |

### 4.3 Troubleshoot missing data

| Symptom | Cause | Fix |
|---------|-------|-----|
| Cart data columns are blank | Product IDs don't match feed | Align data layer IDs with Merchant Center IDs |
| Gross profit shows zero | COGS not in feed | Add cost_of_goods_sold to product feed |
| Some products show data, others don't | Partial ID matching | Audit IDs for variants, bundles, parent vs child SKUs |

### 4.4 Final checklist

- [ ] Data layer pushes items array with id, price, quantity on purchase
- [ ] Merchant ID, feed country, and feed language are populated
- [ ] Product IDs match Merchant Center feed exactly
- [ ] cost_of_goods_sold attribute is in the product feed
- [ ] Conversion tag has "Provide product-level sales data" enabled
- [ ] Cart data columns appear in Google Ads product group reports

---

## Phase 5 (Optional): ProfitMetrics Conversion Booster

### 5.1 When to use ProfitMetrics

Use ProfitMetrics if:

- You run Shopify, WooCommerce, or Magento
- You want plug-and-play profit tracking without developer work
- You need profit-based conversion values sent directly to Google Ads

### 5.2 Installation

1. Install the ProfitMetrics app/plugin from your platform's marketplace
2. Connect your Google Ads account
3. Connect your Google Merchant Center account
4. Map your COGS data (import from feed or enter manually)
5. Enable the Conversion Booster feature

### 5.3 Validate ProfitMetrics

1. Complete a test purchase
2. Check ProfitMetrics dashboard for the conversion
3. Verify gross profit values match expected calculations
4. Confirm data appears in Google Ads conversion reports

---

### Validation and definition of done

This SOP is complete when:

- [ ] Data layer sends product-level cart data on every purchase
- [ ] COGS data is present in the Merchant Center product feed
- [ ] Conversion tag is configured to send product-level sales data
- [ ] Google Ads product group reports show gross profit, COGS, and cart size columns
- [ ] At least 5 test conversions show correct cart data in reports

---

### Exit → Entry bridge

Once cart data and profit tracking are active:

| Timeframe | Action |
|-----------|--------|
| Immediately | Proceed to bidding optimization SOPs using profit-based targets |
| After 7 days | Verify cart data coverage (percentage of conversions with cart data) |
| After 30 days | Analyze product-level profitability, adjust bidding targets |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Product IDs mismatched | Coordinate with feed management team |
| COGS data incomplete | Update product feed (Phase 2) |
| Cart data columns still empty after 48 hours | Re-debug GTM (Phase 4.1) |

---

### FAQ

**Q: Do I need cart data for Search campaigns?**

A: Cart data is primarily useful for Shopping and PMax campaigns where product-level reporting matters. For Search, standard conversion value tracking is sufficient.

**Q: Can I use estimated COGS instead of exact costs?**

A: Yes. Category-level COGS estimates are better than nothing. Update to exact values when available.

**Q: Does ProfitMetrics replace the manual setup?**

A: Yes, for supported platforms. ProfitMetrics handles the data layer, feed integration, and conversion value adjustment automatically.

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Configure Google Consent Mode](../sops/SOP – Configure Google Consent Mode.md) | Upstream: consent mode must be active for accurate tracking |
| [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md) | Parallel: deduplication prevents inflated cart data |
| [SOP – Set Up New Customer Tracking](../sops/SOP – Set Up New Customer Tracking.md) | Parallel: new customer data enriches cart-level reporting |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Product IDs don't match Merchant Center | Data layer uses different ID format than feed | Audit IDs before launch, test with real products |
| COGS missing for new products | Feed update process doesn't include cost data | Add COGS to the product onboarding checklist |
| Gross profit negative for some products | COGS higher than selling price | Review pricing strategy for affected products |
| Cart data appears for some conversions only | Data layer not firing consistently | Test on all purchase paths (desktop, mobile, express checkout) |

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
