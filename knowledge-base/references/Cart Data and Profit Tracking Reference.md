# Cart Data and Profit Tracking Reference
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: CHEATSHEET_18
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5
Applies_To: Ecommerce

## Purpose

Documents two complementary ecommerce measurement features: Google's native Conversions with Cart Data (product-level sales reporting) and ProfitMetrics Conversion Booster (profit tracking with near-100% conversion match rate).

---

## What this reference is / What this is NOT

**This reference:**

- Explains Cart Data requirements, setup methods, and metrics unlocked
- Documents ProfitMetrics Conversion Booster architecture and benefits
- Defines COGS integration for gross profit calculations
- Provides guidance on when to use each feature (or both)

**This reference does NOT:**

- Provide step-by-step implementation instructions (See: future SOP: Set Up Cart Data Tracking)
- Cover basic conversion tracking setup (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Explain unit economics calculations (See: [Unit Economics Reference](../references/Unit Economics Reference.md))

---

## Quick reference: two features compared

| **Feature** | **Cart Data (Google native)** | **ProfitMetrics Conversion Booster** |
|------------|------------------------------|--------------------------------------|
| **Provider** | Google Ads (built-in) | ProfitMetrics (third-party) |
| **What it sends** | Product-level items array with SKUs, quantities, prices | GACT pixel + OCT import + enhanced conversions combined |
| **Primary benefit** | See which products are purchased after ad clicks | Near-100% conversion match rate, profit tracking |
| **Profit tracking** | Requires COGS in Merchant Center feed | Built-in profit calculation |
| **Setup complexity** | Medium (data layer + tag config) | Low (plug-and-play for major platforms) |
| **Cost** | Free | Paid subscription |
| **Can use together** | Yes | Yes |

### COGS data format specification

| Field | Format | Example | Notes |
|-------|--------|---------|-------|
| `cost_of_goods_sold` | Decimal number + currency code | `15.99 EUR` | Per-product cost in Merchant Center feed |
| Currency | ISO 4217 code | `EUR`, `USD`, `GBP` | Must match your Merchant Center currency |
| Decimal separator | Period (.) | `15.99` not `15,99` | Google rejects comma-separated decimals |
| Update frequency | Reflect current COGS | — | Update when supplier prices change |

---

## 1️⃣ Conversions with Cart Data

### What it does

Cart Data sends product-level purchase information (items, quantities, SKUs, prices) alongside each conversion event. This connects your Google Ads conversion tracking to your product feed, enabling product-level performance analysis.

### Benefits

| **Benefit** | **What you see** | **Why it matters** |
|-------------|-----------------|-------------------|
| Product-level attribution | Which products were actually purchased after ad click | Identify cross-sell patterns (clicked shoes, bought socks) |
| COGS and gross profit | Cost of goods sold and gross profit per campaign | Optimize for profit, not just revenue |
| Cross-sell analysis | Revenue from products not directly advertised | Measure halo effect of your ads |
| Cart size by dimension | Average items per order by campaign, keyword, audience | Identify high-value traffic segments |

### Requirements

| **Requirement** | **Details** |
|-----------------|------------|
| Google Merchant Center | Active feed with product IDs matching your data layer |
| COGS attribute in feed | `cost_of_goods_sold` attribute populated for gross profit columns |
| Data layer enhancement | Items array with `id`, `price`, `quantity` on purchase event |
| Merchant Center linking | Google Ads account linked to Merchant Center |
| Feed country and language | Must match the `feed_country` and `feed_language` in conversion tag |

### Data layer requirements

The purchase event data layer must include:

| **Parameter** | **Type** | **Example** | **Required** |
|---------------|---------|-------------|-------------|
| `transaction_id` | String | `"ORD-12345"` | Yes |
| `value` | Number | `149.99` | Yes |
| `currency` | String | `"USD"` | Yes |
| `items` | Array | See below | Yes |
| `items[].id` | String | `"SKU-ABC-001"` | Yes (must match feed) |
| `items[].price` | Number | `49.99` | Yes |
| `items[].quantity` | Number | `2` | Yes |

### Setup: GTM method

1. Ensure your data layer pushes the items array on purchase event
2. Create GTM variables for `merchant_id`, `feed_country`, `feed_language`
3. Open your Google Ads Conversion Tracking tag in GTM
4. Check "Include product-level sales data" checkbox
5. Map the data source to "Data Layer"
6. Enter your Merchant Center ID, feed country, and feed language
7. Publish and verify in conversion diagnostics

### Setup: gtag method

Add the items array and merchant parameters to the purchase event snippet:

```javascript
gtag('event', 'purchase', {
  'send_to': 'AW-XXXXXXXXX/XXXXXXXXXXXXX',
  'transaction_id': 'ORD-12345',
  'value': 149.99,
  'currency': 'USD',
  'aw_merchant_id': 1234567,
  'aw_feed_country': 'US',
  'aw_feed_language': 'EN',
  'items': [
    { 'id': 'SKU-ABC-001', 'price': 49.99, 'quantity': 2 },
    { 'id': 'SKU-DEF-002', 'price': 50.01, 'quantity': 1 }
  ]
});
```

### Metrics unlocked

| **Metric** | **Column name** | **What it shows** |
|-----------|----------------|-------------------|
| Cost of goods sold | `cost_of_goods_sold` | Total COGS for products purchased via ad clicks |
| Gross profit | `gross_profit` | Revenue minus COGS for ad-attributed purchases |
| Cross-sell revenue | `cross_sell_revenue` | Revenue from products not in the clicked Shopping ad |
| Cross-sell gross profit | `cross_sell_gross_profit` | Gross profit from cross-sold products |
| Average cart size | `average_cart_size` | Average number of items per order |
| Lead units sold | `units_sold` | Total product units sold via ad clicks |

### COGS in Google Merchant Center

To unlock gross profit metrics, add the `cost_of_goods_sold` attribute to your product feed:

| **Feed attribute** | **Format** | **Example** |
|-------------------|-----------|-------------|
| `cost_of_goods_sold` | Price with currency | `25.00 USD` |

**Sources for COGS data:** ERP system, inventory management platform, or manual spreadsheet upload via supplemental feed.

> ⚠️ **COGS must be populated for gross profit columns to show data:** If COGS is missing from your feed, you get cart data and cross-sell metrics but not profit metrics. Start with your top 100 SKUs if full-feed COGS is not immediately available.

---

## 2️⃣ ProfitMetrics Conversion Booster

### What it does

ProfitMetrics Conversion Booster combines three conversion tracking methods into one system: GACT pixel (browser-side), OCT import (server-side), and enhanced conversions. This triple-layered approach achieves near-100% conversion match rate while tracking actual gross profit per order.

### Architecture

| **Layer** | **Method** | **What it captures** |
|----------|-----------|---------------------|
| Layer 1 | GACT pixel (browser-side) | Standard click-to-conversion tracking |
| Layer 2 | OCT import (server-side) | Catches conversions missed by browser pixel (ad blockers, cookie deletion) |
| Layer 3 | Enhanced conversions | Hashed email matching for additional conversion recovery |

ProfitMetrics deduplicates across all three layers automatically.

### Benefits

| **Benefit** | **Impact** |
|-------------|-----------|
| Conversion match rate | Near-100% (vs. 70-85% with GACT pixel alone) |
| Conversion uplift | 15-26% more conversions reported vs. standard pixel |
| Profit tracking | Actual gross profit per order sent with each conversion |
| POAS optimization | Enables Profit on Ad Spend bidding (target POAS instead of ROAS) |
| Smart Bidding signal quality | More conversions and accurate values improve algorithm performance |

### Setup

| **Platform** | **Setup time** | **Method** |
|-------------|---------------|-----------|
| Shopify | ~30 minutes | Native app install, plug-and-play |
| WooCommerce | ~30 minutes | Plugin install, plug-and-play |
| Magento | ~30 minutes | Extension install, plug-and-play |
| Custom platform | 2-4 hours | API integration with developer support |

### POAS vs. ROAS

| | **ROAS (Revenue on Ad Spend)** | **POAS (Profit on Ad Spend)** |
|--|-------------------------------|------------------------------|
| **Optimizes for** | Total revenue | Gross profit |
| **Metric** | Revenue / Ad Spend | Gross Profit / Ad Spend |
| **Blind spot** | Treats €100 revenue at 10% margin same as €100 at 50% margin | None (directly measures value) |
| **Best for** | Uniform-margin businesses | Variable-margin businesses |
| **Requires** | Standard conversion tracking | Profit data per conversion (ProfitMetrics or custom setup) |

> 💡 **POAS is the superior optimization signal for variable-margin businesses:** A campaign generating €10,000 revenue at 10% margin (€1,000 profit) looks identical to one generating €10,000 at 50% margin (€5,000 profit) under ROAS. POAS differentiates them immediately.

---

## When to use Cart Data vs. ProfitMetrics

| **Scenario** | **Recommendation** |
|--------------|-------------------|
| Need product-level purchase attribution | Cart Data |
| Need cross-sell analysis | Cart Data |
| Need higher conversion match rate | ProfitMetrics |
| Need profit-based bidding (POAS) | ProfitMetrics |
| Variable-margin product catalog | Both (Cart Data for analysis, ProfitMetrics for bidding) |
| Uniform-margin catalog, want product insights | Cart Data is sufficient |
| Running Shopping + Search + PMax campaigns | Both for maximum data coverage |

> 💡 **Cart Data and ProfitMetrics serve different purposes and complement each other:** Cart Data gives you product-level insights. ProfitMetrics gives you conversion accuracy and profit-based optimization. Use both for the most complete measurement setup.

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Product IDs in data layer don't match feed | Cart Data can't match purchases to products, metrics empty | Verify ID format matches exactly (parent ID vs. variant ID) |
| Missing COGS in Merchant Center feed | Gross profit columns show no data | Add `cost_of_goods_sold` attribute to feed |
| Only using GACT pixel without ProfitMetrics or ECT | 15-30% of conversions lost to ad blockers and cookie deletion | Add ProfitMetrics or implement enhanced conversions manually |
| Setting ROAS targets based on ProfitMetrics data without adjusting | Targets too low because more conversions are reported | Recalibrate targets: if uplift is 20%, increase target ROAS by ~20% |
| Not deduplicating when using multiple tracking methods | Double-counted conversions inflate metrics | ProfitMetrics handles this automatically, manual setups need transaction ID dedup |
| Ignoring cross-sell data | Missing insights on which ads drive multi-product purchases | Review cross-sell columns monthly, adjust ad strategy accordingly |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Cart Data and Profit Tracking are advanced measurement techniques |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action settings that interact with Cart Data |
| [Unit Economics Reference](../references/Unit Economics Reference.md) | Unit economics calculations that inform COGS and profit tracking |
| [Transaction ID Reference](../references/Transaction ID Reference.md) | Transaction IDs required for deduplication |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | ProfitMetrics uplift helps maintain volume thresholds |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
