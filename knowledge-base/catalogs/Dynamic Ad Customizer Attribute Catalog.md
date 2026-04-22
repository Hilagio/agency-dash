# Dynamic Ad Customizer Attribute Catalog
Created: 2026-02-04

Support_ID: CATALOG_5
Status: Done
Category: Creative
Reference Type: Catalog
Agent_Readable: No
Human_Facing: No
Bucket: Creative
Domain: Creative
Pillar: 8

## Purpose

Lists reusable dynamic customizer attributes for price, inventory, and promotion personalization

---

## What this catalog is / What this is NOT

**This catalog:**

- Lists dynamic attribute types and their purposes
- Provides data type formatting rules
- Explains when each attribute is useful

**This catalog does NOT:**

- Provide step-by-step setup instructions (See: [SOP – Set Up Dynamic Ad Customizers](../sops/SOP – Set Up Dynamic Ad Customizers.md))
- Validate customizer quality (See: [Ad Customizer Quality Checklist](../checklists/Ad Customizer Quality Checklist.md))

---

## Core dynamic attributes

### 1️⃣ Pricing attributes

| **Attribute** | **Data type** | **Purpose** | **Example value** |
| --- | --- | --- | --- |
| **Price** | Price | Original/regular price | €899 |
| **SalePrice** | Price | Discounted price | €719 |
| **Discount** | Percent | Discount percentage | 20% |
| **DiscountAmount** | Price | Discount amount | €180 |
| **PriceFrom** | Price | Starting price for range | €299 |

> 💡 **Price flexibility tip:** Instead of using the "Price" data type, you can use "Text" and include only the number (e.g., `899`). Then add the currency symbol directly in your RSA: € `{CUSTOMIZER.Price:899}`. This gives you more control over formatting. Like whether to include a space between the symbol and the number.

### 2️⃣ Product attributes

| **Attribute** | **Data type** | **Purpose** | **Example value** |
| --- | --- | --- | --- |
| **ProductName** | Text | Product or category name | Oak Dining Table |
| **ProductType** | Text | Product category | Dining Tables |
| **Brand** | Text | Brand name | PPC Mastery |

### 3️⃣ Inventory attributes

| **Attribute** | **Data type** | **Purpose** | **Example value** |
| --- | --- | --- | --- |
| **StockStatus** | Text | Inventory messaging | Only 3 Left |
| **StockCount** | Number | Exact inventory number | 47 |
| **Availability** | Text | Availability status | In Stock |

### 4️⃣ Promotion attributes

| **Attribute** | **Data Type** | **Purpose** | **Example value** |
| --- | --- | --- | --- |
| **PromoText** | Text | Promotion headline | Summer Sale |
| **PromoCode** | Text | Coupon code | SUMMER25 |
| **PromoEndDate** | Text | Promotion end date | Sunday |

### 5️⃣ Shipping/delivery attributes

| **Attribute** | **Data Type** | **Purpose** | **Example value** |
| --- | --- | --- | --- |
| **ShippingText** | Text | Shipping offer | Free Shipping |
| **DeliveryTime** | Text | Delivery estimate | 2-3 Days |

### 6️⃣Trust attributes

| **Attribute** | **Data type** | **Purpose** | **Example value** |
| --- | --- | --- | --- |
| **Rating** | Text | Review rating | 4.8/5 |
| **ReviewCount** | Text | Number of reviews | 2,400+ Reviews |

---

## Data type formatting rules

| **Data type** | **Format** | **✅ Correct** | **❌ Incorrect** |
| --- | --- | --- | --- |
| **Text** | Any text | Summer Sale | — |
| **Price** | Currency + amount | €89.99 | 89.99 |
| **Number** | Digits only | 47 | 47% |
| **Percent** | Number + % | 25% | 25 |

> ⚠️ **Price defaults can't be numbers:** If using Price type, your default must be text like "Great Prices" or ensure every row has a value.

---

## Example feed mappings by vertical

### 1️⃣ Ecommerce (Dining Tables)

| **Keyword** | **ProductName** | **Price** | **SalePrice** | **Discount** | **StockStatus** | **ShippingText** |
| --- | --- | --- | --- | --- | --- | --- |
| oak dining table | Oak Dining Table | €899 | €719 | 20% | In Stock | Free Shipping |
| walnut dining table | Walnut Dining Table | €1,199 | €959 | 20% | Only 3 Left | Free Shipping |
| marble dining table | Marble Dining Table | €1,499 | €1,199 | 20% | In Stock | Free Shipping |
| extendable dining table | Extendable Dining Table | €799 | €639 | 20% | In Stock | Free Shipping |
| round dining table | Round Dining Table | €699 | €559 | 20% | Only 5 Left | Free Shipping |

### 2️⃣ SaaS (CRM Software)

| **Keyword** | **ProductName** | **Price** | **Discount** | **PromoText** | **PromoCode** |
| --- | --- | --- | --- | --- | --- |
| crm software | CRM Platform | €29/mo | 20% | New Year Sale | NEWYEAR20 |
| sales crm | Sales CRM | €49/mo | 20% | New Year Sale | NEWYEAR20 |
| enterprise crm | Enterprise CRM | €99/mo | 25% | Enterprise Special | ENTERPRISE25 |
| simple crm | Simple CRM | €19/mo | 30% | Starter Promo | START30 |

### 3️⃣ Travel (Hotels)

| **Keyword** | **ProductName** | **PriceFrom** | **Availability** | **PromoText** | **ShippingText** |
| --- | --- | --- | --- | --- | --- |
| amsterdam hotel | Amsterdam Central Hotel | €129/night | 5 Rooms Left | Spring Sale | Free Cancellation |
| paris hotel | Paris Boutique Hotel | €159/night | 2 Rooms Left | Spring Sale | Free Cancellation |
| london hotel | London City Hotel | €139/night | Still Available | Spring Sale | Free Cancellation |

> ⚠️ **Data type rule for unit-based pricing**: Values like "€29/mo", "€129/night", or "From €99" are NOT valid for the "**Price**" data type. If pricing includes units, ranges, or qualifiers, the attribute must use the "**Text**" data type.

---

## RSA usage examples by vertical

### 1️⃣ Ecommerce (Dining Tables)

| **Slot** | **Content** |
| --- | --- |
| H1 | `{CUSTOMIZER.ProductName:Quality Furniture}` |
| H2 | Now `{CUSTOMIZER.SalePrice:On Sale}` |
| H3 | `{CUSTOMIZER.Discount:15%}` Off Today |
| H4 | Available now: `{CUSTOMIZER.StockStatus:In Stock}` |
| H5 | `{CUSTOMIZER.ShippingText:Free Shipping}` |
| H6 | Was `{CUSTOMIZER.Price:Higher}` - Save Now |
| D1 | Shop the `{CUSTOMIZER.ProductName:furniture}` you love. Now `{CUSTOMIZER.SalePrice:on sale}` (was `{CUSTOMIZER.Price:more}`). `{CUSTOMIZER.ShippingText:Low-cost shipping}` included. |
| D2 | `{CUSTOMIZER.Discount:Great savings}` off `{CUSTOMIZER.ProductName:all products}`. `{CUSTOMIZER.StockStatus:Available now}`. Order today! |

**Example outputs:**

| **Keyword** | **H1** | **H2** | **H4** | **D1** |
| --- | --- | --- | --- | --- |
| oak dining table | `Oak Dining Table` | Now `€719` | Available now: `In Stock` | Shop the `Oak Dining Table` you love. Now `€719` (was `€899`). `Free Shipping` included. |
| walnut dining table | `Walnut Dining Table` | Now `€959` | Available now: `Only 3 Left` | Shop the `Walnut Dining Table` you love. Now `€959` (was `€1,199`). `Free Shipping` included. |
| marble dining table | `Marble Dining Table` | Now `€1,199` | Available now: `In Stock` | Shop the `Marble Dining Table` you love. Now `€1,199` (was `€1,499`). `Free Shipping`  included. |

### 2️⃣ Travel (Hotels)

**RSA structure:**

| **Slot** | **Content** |
| --- | --- |
| H1 | `{CUSTOMIZER.ProductName:Great Hotels}` |
| H2 | From `{CUSTOMIZER.PriceFrom:Great Rates}` |
| H3 | `{CUSTOMIZER.Availability:Check Availability}` |
| H4 | `{CUSTOMIZER.PromoText:Book Now}` |
| H5 | `{CUSTOMIZER.ShippingText:Flexible Booking}` |
| D1 | Book `{CUSTOMIZER.ProductName:your hotel}` from `{CUSTOMIZER.PriceFrom:great rates}`. `{CUSTOMIZER.Availability:Limited availability}`. `{CUSTOMIZER.ShippingText:Book risk-free}`. |
| D2 | `{CUSTOMIZER.PromoText:Special rates}` on `{CUSTOMIZER.ProductName:top hotels}`. `{CUSTOMIZER.ShippingText:Flexible booking}` included. |

**Example outputs:**

| **Keyword** | **H1** | **H2** | **H3** | **D1** |
| --- | --- | --- | --- | --- |
| amsterdam hotel | `Amsterdam Central Hotel` | From `€129/night` | `5 Rooms Left` | Book `Amsterdam Central Hotel` from `€129/night`. `5 Rooms Left`. `Free Cancellation.` |
| paris hotel | `Paris Boutique Hotel` | From `€159/night` | `2 Rooms Left` | Book `Paris Boutique Hotel` from `€159/night`. `2 Rooms Left.` `Free Cancellation.` |
| london hotel | `London City Hotel` | From `€139/night` | `Still Available` | Book `London City Hotel` from `€139/night`. `Still Available`. `Free Cancellation`. |

---

## Attribute selection by vertical

### Ecommerce

| **Must Have** | **Recommended** | **Optional** |
| --- | --- | --- |
| ProductName, Price | SalePrice, Discount, ShippingText | StockStatus, Rating |

### SaaS

| **Must Have** | **Recommended** | **Optional** |
| --- | --- | --- |
| ProductName | Price, PromoText | PromoCode, Discount |

### Lead Gen

| **Must Have** | **Recommended** | **Optional** |
| --- | --- | --- |
| — | PromoText, Availability | Discount, PromoCode |

### Travel/Hospitality

| **Must Have** | **Recommended** | **Optional** |
| --- | --- | --- |
| PriceFrom, Availability | PromoText, ShippingText | Rating |

---

## Promotion patterns

### Active promotion

| **Attribute** | **During Promo** | **After Promo (Default)** |
| --- | --- | --- |
| PromoText | "Summer Sale" | "Special Offer" |
| Discount | "25%" | "15%" |
| PromoCode | "SUMMER25" | "SAVE" |

### Countdown combination

Combine customizers with countdown timers for urgency:

`{CUSTOMIZER.PromoText:Sale}` Ends in `{COUNTDOWN(2026-01-31 23:59:59):Soon}`!

Output: "Summer Sale Ends in 3 days!"

---

## Version details

- **Version:** 2.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.