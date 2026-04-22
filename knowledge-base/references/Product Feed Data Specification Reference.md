# Product Feed Data Specification Reference
Created: 2026-02-04

Support_ID: REFERENCE_12
Status: Done
Reference Type: Reference
Agent_Readable: Yes
Human_Facing: Yes
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

Documents all product feed attributes, their specifications, syntax, and requirements for Google Shopping campaigns.

---

## What this is / What this is NOT

**This reference:**

- Lists all product feed attributes with syntax and examples
- Documents required vs. recommended vs. optional status
- Provides format specifications and validation rules

**This reference does NOT:**

- Explain feed quality strategy (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- Provide optimization recommendations (See: [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md))
- Provide title/description patterns (See: [Product Title Catalog](../catalogs/Product Title Catalog.md), [Product Description Catalog](../catalogs/Product Description Catalog.md))

---

## Quick reference: attribute summary

| **Attribute** | **Feed name** | **Required** | **Character limit** |
|---------------|---------------|--------------|---------------------|
| ID | `[id]` | Required | 50 |
| Title | `[title]` | Required | 150 |
| Description | `[description]` | Required | 5,000 |
| Link | `[link]` | Required | 2,000 |
| Image link | `[image_link]` | Required | 2,000 |
| Price | `[price]` | Required | — |
| Availability | `[availability]` | Required | — |
| Brand | `[brand]` | Required* | 70 |
| GTIN | `[gtin]` | Recommended | 14 |
| MPN | `[mpn]` | Conditional | 70 |
| Condition | `[condition]` | Required for used/refurbished | — |
| Google product category | `[google_product_category]` | Optional | — |
| Product type | `[product_type]` | Recommended | 750 |
| Custom label 0–4 | `[custom_label_0-4]` | Optional | 100 |

*Required for products with a clearly associated brand.

---

## Product identifiers

### ID [id]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required |
| **Character limit** | 50 |
| **Syntax** | Alphanumeric, no spaces |
| **Example (text)** | `SKU-12345` |
| **Example (XML)** | `<g:id>SKU-12345</g:id>` |

**Rules:**
- Use SKUs as IDs (unique, stable)
- Same ID for all countries/languages
- Never reuse IDs for different products
- Never use case to differentiate IDs

### GTIN [gtin]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended (strongly) |
| **Character limit** | 8, 12, 13, or 14 digits |
| **Types** | UPC (12), EAN (13), JAN (13), ISBN (13), ITF-14 (14) |
| **Example (text)** | `897126000560` |
| **Example (XML)** | `<g:gtin>897126000560</g:gtin>` |

**Impact:** Products without GTINs may not be eligible for all Shopping features (price comparison, product reviews).

### MPN [mpn]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required when no GTIN, optional otherwise |
| **Character limit** | 70 |
| **Example (text)** | `RZ0103730100R3U1` |
| **Example (XML)** | `<g:mpn>RZ0103730100R3U1</g:mpn>` |

### Identifier exists [identifier_exists]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for products without GTIN, MPN, or brand |
| **Values** | `true`, `false` |
| **Default** | `true` (if not submitted) |
| **Example (text)** | `false` |
| **Example (XML)** | `<g:identifier_exists>false</g:identifier_exists>` |

**Use cases:** Custom products, handmade goods, vintage items, products made before GTINs.

---

## Essential product data

### Brand [brand]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for products with a brand |
| **Character limit** | 70 |
| **Example (text)** | `Samsung` |
| **Example (XML)** | `<g:brand>Samsung</g:brand>` |

**Rules:**
- Use recognizable brand name
- For no-brand products: use store name if you manufacture
- Single language/alphabet only

### Title [title]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required |
| **Character limit** | 150 |
| **Visible in PLA** | ~70 characters typically visible |
| **Example (text)** | `Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4 RAM 3200MHz - Black` |
| **Example (XML)** | `<g:title>...</g:title>` |

**Rules:**
- Front-load important attributes (brand, key specs)
- No promotional text ("Buy now", "Free shipping")
- No ALL CAPS for emphasis
- Include variant details (color, size) when applicable

**Formulas by category:**
| **Category** | **Formula** |
|--------------|-------------|
| Fashion | Brand + Gender + Product type + Attributes |
| Electronics | Brand + Attributes + Product type + Model |
| Consumables | Brand + Product type + Attributes (weight/amount) |
| Books | Title + Author + Format + ISBN |

### Description [description]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required |
| **Character limit** | 5,000 |
| **Visible** | First 160 characters in Shopping tab |
| **Example** | Feature-rich paragraph describing product benefits |

**Rules:**
- Front-load key features in first 160 characters
- Include relevant attributes: material, color, pattern, size, features
- No promotional text, links, or HTML

### Link [link]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required |
| **Character limit** | 2,000 |
| **Format** | Full URL with https:// |
| **Example** | `https://www.example.com/product/sku-12345` |

**Rules:**
- No redirects
- No ValueTrack parameters
- Accessible by Googlebot
- Pre-select variant if applicable

### Mobile link [mobile_link]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Character limit** | 2,000 |
| **Use case** | Separate mobile-optimized URLs (rare with responsive sites) |

---

## Images

### Image link [image_link]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required |
| **Character limit** | 2,000 |
| **Formats** | JPEG, WebP, PNG, GIF, BMP, TIFF |
| **Max file size** | 16MB |
| **Max resolution** | 64 megapixels |
| **Min recommended** | 1500 x 1500 pixels |

**Rules:**
- Product fills 75-90% of frame
- White or transparent background
- No promotional overlays (prices, watermarks, logos)
- Show entire product, correct variant
- For bundles: show all products

### Additional image link [additional_image_link]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended |
| **Character limit** | 2,000 per URL |
| **Max images** | 10 per product |
| **Use for** | Different angles, details, without packaging |

### Lifestyle image link [lifestyle_image_link]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended |
| **Character limit** | 2,000 |
| **Max images** | 1 per product |
| **Min resolution** | 600 x 600 pixels |
| **Aspect ratio** | Between 2:0 and 2:3 |
| **Use for** | Product in real-world context, colorful backgrounds |

### 3D model link [virtual_model_link]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended for eligible products |
| **Availability** | US only |
| **Categories** | Shoes, apparel, home goods |
| **Formats** | .gltf, .glb |
| **Max size** | 15MB (10MB recommended) |

---

## Pricing

### Price [price]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required |
| **Format** | Number + ISO 4217 currency |
| **Example** | `49.99 USD` |
| **XML** | `<g:price>49.99 USD</g:price>` |

**Rules:**
- Match landing page price exactly
- Include VAT where required
- No shipping costs in price (use shipping attribute)
- Keep updated (multiple times daily if prices change often)

### Sale price [sale_price]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required when product is on sale |
| **Format** | Number + ISO 4217 currency |
| **Example** | `39.99 USD` |

**Sale badge eligibility:**
- Base price must be valid
- Sale price < base price
- Discount between 5% and 90%
- (EU) Price must be lowest in last 30 days

### Sale price effective date [sale_price_effective_date]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Format** | ISO 8601 date range |
| **Character limit** | 51 |
| **Example** | `2026-02-24T13:00-0500/2026-02-28T23:59-0500` |

### Cost of goods sold [cost_of_goods_sold]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended |
| **Format** | Number + ISO 4217 currency |
| **Prerequisite** | Conversions with Cart Data enabled |
| **Use case** | Gross profit reporting in Google Ads |

### Unit pricing measure [unit_pricing_measure]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended for applicable categories |
| **Categories** | Hardware, office supplies, food, beverages, perfume |
| **Format** | Number + unit |
| **Units** | oz, lb, mg, g, kg, floz, pt, qt, gal, ml, cl, l, in, ft, yd, cm, m, sqft, sqm, ct |
| **Example** | `500ml` |

### Unit pricing base measure [unit_pricing_base_measure]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required when unit_pricing_measure is used |
| **Supported numbers** | 1, 2, 4, 8, 10, 100 |
| **Example** | `100ml` |

---

## Availability

### Availability [availability]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required |
| **Values** | `in_stock`, `out_of_stock`, `preorder`, `backorder` |
| **Example** | `in_stock` |

**Rules:**
- Match website availability
- Use `preorder` for unreleased products only
- Use `backorder` for temporarily OOS accepting orders
- Use `pause` attribute for temporary visibility control (not `out_of_stock`)

### Availability date [availability_date]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for preorder/backorder |
| **Format** | ISO 8601 datetime |
| **Character limit** | 25 |
| **Example** | `2026-03-15T09:00-0500` |

### Expiration date [expiration_date]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Format** | ISO 8601 datetime |
| **Use case** | Seasonal products, limited-time offers |

---

## Categorization

### Google product category [google_product_category]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional (auto-assigned by Google) |
| **Format** | Category ID or full path |
| **Use case** | Override incorrect auto-categorization |
| **Example (ID)** | `2271` |
| **Example (path)** | `Electronics > Audio > Headphones` |

### Product type [product_type]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended |
| **Character limit** | 750 |
| **Format** | Breadcrumb with ` > ` separator |
| **Example** | `Photography > Lenses > SLR Lenses` |

**Use for:** Campaign organization, listing group structure, improved query matching.

### Custom label 0–4 [custom_label_0-4]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Character limit** | 100 per label |
| **Unique values limit** | 1,000 per label |
| **Labels available** | custom_label_0 through custom_label_4 |

**Common uses:**
| **Label** | **Use case** | **Example values** |
|-----------|--------------|-------------------|
| Label 0 | Performance tier | hero, sidekick, villain, zombie |
| Label 1 | Margin tier | high_margin, standard, low_margin |
| Label 2 | Promotional status | on_sale, regular_price |
| Label 3 | Inventory level | high_stock, normal, low_stock |
| Label 4 | Lifecycle | new, core, mature, clearance |

---

## Product variants

### Item group ID [item_group_id]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for variant products |
| **Character limit** | 50 |
| **Use** | Groups color, size, material variants |
| **Example** | `01ABC` (parent SKU) |

**Rules:**
- Same item_group_id for all variants of a product
- Each variant has unique ID
- Submit variant attributes (color, size, etc.) with item_group_id

### Age group [age_group]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for apparel (certain countries) |
| **Values** | `newborn`, `infant`, `toddler`, `kids`, `adult` |
| **Required countries** | BR, FR, DE, JP, UK, USA |

### Gender [gender]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for apparel (certain countries) |
| **Values** | `male`, `female`, `unisex` |
| **Required countries** | BR, FR, DE, JP, UK, USA |

### Color [color]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for apparel (certain countries), recommended otherwise |
| **Character limit** | 100 total, 40 per color |
| **Format** | Primary/Secondary/Tertiary (max 3) |
| **Example** | `red/black/white` |

**Rules:**
- No color codes (#fff000)
- No "multicolor" or "see image"
- Use standard color names in title for findability

### Size [size]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for apparel/shoes (certain countries) |
| **Character limit** | 100 |
| **Required countries** | BR, FR, DE, JP, UK, USA |
| **Example** | `M`, `10 Wide` |

### Size system [size_system]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required when size is submitted |
| **Values** | AU, BR, CN, DE, EU, FR, IT, JP, MEX, UK, US |

### Size type [size_type]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended for apparel |
| **Values** | `regular`, `petite`, `plus`, `tall`, `big`, `maternity` |
| **Max values** | 2 per product |

### Material [material]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required when product varies by material |
| **Character limit** | 200 |
| **Format** | Primary/Secondary/Tertiary (max 3) |
| **Example** | `cotton/polyester/elastane` |

### Pattern [pattern]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required when product varies by pattern |
| **Character limit** | 100 |
| **Example** | `striped`, `floral`, `solid` |

---

## Additional product data

### Short title [short_title]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended (especially for PMax, Demand Gen) |
| **Character limit** | 150 (65 recommended) |
| **Use case** | Browse-oriented surfaces where users scroll quickly |

### Condition [condition]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for used/refurbished |
| **Values** | `new`, `refurbished`, `used` |
| **Default** | `new` |

### Adult [adult]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for adult-oriented products |
| **Values** | `true`, `false` |
| **Alternative** | Set account-level adult flag in Merchant Center |

### Multipack [multipack]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for merchant-created multipacks (certain countries) |
| **Format** | Integer (number of products in pack) |
| **Example** | `6` |
| **Required countries** | AU, BR, CZ, FR, DE, IT, JP, NL, ES, CH, UK, USA |

### Bundle [is_bundle]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for merchant-created bundles (certain countries) |
| **Values** | `true`, `false` |
| **Use case** | Main product + accessories sold together |

### Product detail [product_detail]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended |
| **Sub-attributes** | section_name (optional, 140 chars), attribute_name (required, 140 chars), attribute_value (required, 1000 chars) |
| **Format (text)** | `Section:Attribute:Value,Section:Attribute:Value` |

### Product highlight [product_highlight]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Recommended |
| **Character limit** | 150 per highlight |
| **Min/Max** | 2–100 highlights |
| **Recommended** | 4–6 highlights |
| **Format (text)** | Comma-separated in quotes |

---

## Destinations

### Excluded destination [excluded_destination]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Values** | `Shopping_ads`, `Display_ads`, `Local_inventory_ads`, `Free_listings`, `Free_local_listings`, `Cloud_retail`, `Local_cloud_retail` |
| **Use case** | Prevent products from appearing on specific destinations |

### Included destination [included_destination]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Values** | Same as excluded_destination |
| **Note** | Excluded takes precedence over included |

### Pause [pause]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Values** | `ads`, `all` |
| **Max duration** | 14 days (use excluded_destination for longer) |

---

## Shipping

### Shipping [shipping]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required if not set in Merchant Center, or to override |
| **Required sub-attrs** | country, price |
| **Optional sub-attrs** | region, postal_code, location_id, service, min/max_handling_time, min/max_transit_time |

### Shipping label [shipping_label]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Use** | Link products to shipping settings by label |
| **Example** | `oversized`, `fragile`, `standard` |

### Shipping weight [shipping_weight]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for carrier-calculated rates |
| **Units** | lb, oz, g, kg |
| **Limits** | 0–1000 kg, 0–2000 lbs |

### Shipping dimensions [shipping_length/width/height]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for carrier-calculated rates |
| **Units** | cm, in |
| **Limits** | 1–3000 |

---

## Tax

### Tax [tax]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for US if not set in Merchant Center |
| **Sub-attributes** | country, region, rate, tax_ship |

### Tax category [tax_category]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Optional |
| **Use** | Link products to tax settings by category |

---

## Energy efficiency (EU)

### Certification [certification]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for rescaled EU energy products |
| **Target** | EU/EFTA member states, UK |
| **Sub-attrs** | certification_authority, certification_name, certification_code |
| **Example (text)** | `EC:EPREL:1955442` |

### Energy efficiency class [energy_efficiency_class]

| **Specification** | **Details** |
|-------------------|-------------|
| **Status** | Required for non-rescaled energy products (EU) |
| **Values** | A+++, A++, A+, A, B, C, D, E, F, G |
| **Required with** | min_energy_efficiency_class, max_energy_efficiency_class |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Conceptual framework |
| [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md) | Optimization recommendations |
| [Product Title Catalog](../catalogs/Product Title Catalog.md) | Title patterns and examples |
| [Product Description Catalog](../catalogs/Product Description Catalog.md) | Description patterns and examples |
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Implementation steps |

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
