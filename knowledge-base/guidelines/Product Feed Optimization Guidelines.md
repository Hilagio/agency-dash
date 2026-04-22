# Product Feed Optimization Guidelines
Created: 2026-02-04

Support_ID: GUIDELINE_7
Status: Done
Reference Type: Guideline
Agent_Readable: No
Human_Facing: Yes
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

## Purpose

This guideline provides optimization recommendations for every major product feed attribute group. It supports product feed setup by establishing best practices that maximize query matching, improve CTR, and reduce disapprovals.

---

## What this is / What this is NOT

**This guideline:**

- Provides optimization recommendations per attribute group
- Explains do's and don'ts for key attributes
- Establishes priority levels for feed optimization efforts

**This guideline does NOT:**

- List all attribute specifications (See: [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md))
- Explain feed quality concepts (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- Provide step-by-step setup (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))
- Provide title examples by category (See: [Product Title Catalog](../catalogs/Product Title Catalog.md))

---

## Optimization priority framework

| **Priority** | **Attribute group** | **Impact** | **Effort** |
|--------------|---------------------|------------|------------|
| 1️⃣ Critical | Title, Price, Image, GTIN, Availability | Directly affects matching, CTR, ranking | Medium-High |
| 2️⃣ Important | Description, Brand, Product Type, Additional Images | Expands matching, improves UX | Medium |
| 3️⃣ Recommended | Variants (Color, Size), Custom Labels, Sale Price | Enables filtering, segmentation | Medium |
| 4️⃣ Optional | Short Title, Product Highlights, Lifestyle Images | Upper funnel, differentiation | Low |

> 💡 Optimize in priority order. Tier 1 attributes deliver the highest impact per effort invested.

---

## Product identifiers

### ID [id]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use SKUs as IDs | SKUs are unique and prevent accidental reuse |
| Keep IDs stable | Google stores performance data on the ID level |
| Include variant IDs | Each variant needs a unique ID |
| Use same ID across markets | Same ID regardless of country/language targeting |

**Do:**
- ✅ Submit a unique ID for each product
- ✅ Include a unique ID for each variant
- ✅ Use the same ID for each product regardless of country or language

**Do NOT:**
- ❌ Use casing to make IDs unique
- ❌ Use whitespaces in ID values
- ❌ Reuse or recycle IDs for different products
- ❌ Change IDs: historical data is lost

### GTIN [gtin]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Provide GTINs for all products that have them | Enables price comparison, product reviews, trusted matching |
| Verify GTIN accuracy | Incorrect GTINs cause disapprovals |
| Include GTIN for each variant | Variants typically have different GTINs |
| For bundles, use main product GTIN | Bundle GTIN if available, otherwise main product |

**Do:**
- ✅ Use the correct GTIN for each product variant
- ✅ Submit GTIN as defined in the official GS1 validation guide
- ✅ Combine with MPN and brand for maximum matching
- ✅ For multipacks, use the multipack GTIN

**Do NOT:**
- ❌ Submit GTIN for generic products
- ❌ Guess or fabricate GTINs
- ❌ Submit GTIN for products that don't have one

> 💡 Missing GTINs? Check product packaging barcodes, contact manufacturer, or use barcode lookup services.

### MPN [mpn]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Provide MPN when GTIN unavailable | Required alternative identifier |
| Use manufacturer's official MPN | Incorrect MPNs cause disapprovals |
| Include MPN for each variant | Variants usually have different MPNs |

**Do:**
- ✅ Use the official MPN assigned by the manufacturer
- ✅ Use the correct MPN for each product variant

**Do NOT:**
- ❌ Guess or fabricate MPN values
- ❌ Submit MPN for products that don't have one (custom products)

### Identifier exists [identifier_exists]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Set to `false` only for truly custom products | Custom goods, one-of-a-kind items, vintage products |
| Default is `true` if not specified | Most products have identifiers |

**When to set to `false`:**
- Custom-made products (custom T-shirts, art, handmade goods)
- Products without GTIN or MPN+brand combination
- Media items without GTIN
- Apparel without brand
- Vintage products, books before 1970

---

## Essential product data

### Title [title]

**Titles are your most impactful optimization lever:** They drive both query matching and CTR.

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Front-load important details | Users see only 70-100 characters |
| Use all 150 characters | More keywords = better matching |
| Include distinguishing variant details | Size, color, material for each variant |
| Follow category-specific formulas | Different categories need different structures |

**Title formulas by category:**

| **Category** | **Formula** |
|--------------|-------------|
| Fashion | Brand + Gender + Product Type + Attributes (size/color/material) |
| Electronics | Brand + Attributes + Product Type + Model Number |
| Consumables | Brand + Product Type + Attributes (weight/amount) |
| Books | Title + Author + Format + ISBN |
| Seasonal | Occasion + Product Type + Attributes |

**Do:**
- ✅ Use relevant titles that clearly describe the product
- ✅ Front-load the most important product details
- ✅ Try to use all 150 characters
- ✅ Add distinguishing details for variants

**Do NOT:**
- ❌ Include promotional text (causes disapprovals)
- ❌ Use capital letters for emphasis
- ❌ Use unknown words not used by customers

> ⚠️ Google may automatically reorder your title to match searches. Front-loading remains important because it affects what users see in PLAs.

> ↪️ **For title examples by category:** See [Product Title Catalog](../catalogs/Product Title Catalog.md).

### Description [description]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Front-load key details in first 160 characters | Users click "more" to see full description |
| Include features, specs, attributes | Improves matching and conversion |
| Use description formula for consistency | Ensures completeness across products |

**Description formula:**
`{Brand} presents {product}, perfect for {target audience} who {user's need}. This {product type} features {feature 1}, {feature 2}, and {feature 3}, making it {unique selling proposition}.`

**Do:**
- ✅ List important product details in first 160 characters
- ✅ Include material, color, pattern, texture, shape, size, age group, features, benefits

**Do NOT:**
- ❌ Include links
- ❌ Include promotional text (price, sale price)
- ❌ Use HTML markup
- ❌ Use uppercase for emphasis
- ❌ Describe accessories or compatible products

> ↪️ **For description patterns and templates:** See [Product Description Catalog](../catalogs/Product Description Catalog.md).

### Brand [brand]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use recognizable brand name | Customers filter by brand |
| One language only | Don't mix languages in brand value |
| Use store name for unbranded | When you manufacture and are the only seller |

**Do:**
- ✅ Use the correct brand value customers recognize
- ✅ Use store name when you're the manufacturer and only seller

**Do NOT:**
- ❌ Submit brand for products without a clear brand
- ❌ Use multiple languages or alphabets
- ❌ Guess or fabricate brand values

### Link [link]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Direct to product page | No redirects |
| Pre-select variants | Include URL parameters for correct variant |
| Ensure crawlability | Accessible via robots.txt |

**Do:**
- ✅ Start URL with http:// or https://
- ✅ Ensure URL is accessible and crawlable
- ✅ Pre-select the correct product variant using URL parameters

**Do NOT:**
- ❌ Use redirects
- ❌ Include symbols or spaces in URL
- ❌ Include Google Ads ValueTrack parameters

---

## Images

### Image link [image_link]

**Images can make or break a sale:** This is one of the most important attributes to optimize.

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use high-resolution images (1500x1500px minimum) | Higher quality = higher CTR |
| Product fills 75-90% of frame | Optimal visibility without cropping issues |
| White or neutral background | Professional appearance, policy compliance |
| Show entire product | Don't highlight only part of product |

**Do:**
- ✅ Use high-quality images of at least 1500x1500 pixels
- ✅ Product takes up 75-90% of the full image
- ✅ Display the entire product
- ✅ Show correct variant being sold
- ✅ For bundles, show all products in the bundle

**Do NOT:**
- ❌ Use images larger than 16MB or 64 megapixels
- ❌ Use borders or customized backgrounds
- ❌ Include promotional content (prices, CTAs, watermarks, overlays)
- ❌ Use AI-generated images without proper metadata

> 💡 **Aspect ratio tip:** If competitors show vertical/portrait images and yours are square, experiment with vertical images. They take more visual space and can improve CTR.

### Additional image link [additional_image_link]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Add multiple angles | Users engage more with multiple images |
| Show product details | Close-ups of features and highlights |
| Show product without packaging | Helps users visualize actual product |

**Do:**
- ✅ Follow image link best practices
- ✅ Show different angles, specific highlights, or without packaging
- ✅ Add up to 10 additional images per product

**Do NOT:**
- ❌ Submit lifestyle images here (use lifestyle_image_link instead)

### Lifestyle image link [lifestyle_image_link]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Show product in real-world context | Upper funnel placements, higher engagement |
| Use 2:3 portrait aspect ratio | Performs well visually |
| Minimum 600x600px resolution | Quality requirement |

**Do:**
- ✅ Show product in use: clothing on model, furniture in room
- ✅ Use colorful backgrounds or nice-looking sets
- ✅ Use portrait (2:3) aspect ratio when possible

**Do NOT:**
- ❌ Use simple white background (defeats purpose of lifestyle image)

---

## Pricing and costs

### Price [price]

**Price is the most important attribute:** Google is a comparison platform: the better your price, the better your position and click share.

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Match landing page price exactly | Mismatches cause disapprovals |
| Update frequently | Keep prices current |
| Enable automatic updates | Safety net for temporary mismatches |
| Include VAT where required | Country-specific requirements |

**Do:**
- ✅ Ensure feed price matches landing page price
- ✅ Keep prices up to date (schedule feed updates after price changes)
- ✅ Enable automatic item updates for price
- ✅ Include VAT where required for target country
- ✅ Use currency conversion for multi-market targeting

**Do NOT:**
- ❌ Include shipping costs in price (use shipping attributes)
- ❌ Include import/export costs in price
- ❌ Change price for sales (use sale_price instead)
- ❌ Use more than two decimal digits
- ❌ Change price based on user location

> 💡 If prices change multiple times daily, use Content API or a script to increase update frequency.

### Sale price [sale_price]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use for actual sales only | Enables sale badge |
| Ensure 5-90% discount | Badge eligibility requirement |
| Follow EU 30-day rule | EU requires lowest price in last 30 days as reference |

**Sale badge eligibility:**
- Base price must be valid
- Sale price must be lower than base price
- Discount must be 5-90%
- EU: Reference price must be lowest in last 30 days

**Do:**
- ✅ Match technical requirements of price attribute
- ✅ Display both regular and sale prices on landing page
- ✅ Always submit regular price via price attribute

**Do NOT:**
- ❌ Submit sale price higher than regular price

### Sale price effective date [sale_price_effective_date]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Schedule deals in advance | Ensures accurate timing |
| Include timezone | Prevents timing errors |

**Format:** `YYYY-MM-DDThh:mm[±hhmm]/YYYY-MM-DDThh:mm[±hhmm]`

> ⚠️ Without timezone, Google defaults to UTC. Without time, defaults to 00:00 start and 23:59 end.

### Cost of goods sold [cost_of_goods_sold]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Include for profit reporting | Enables gross profit calculations |
| Requires Conversions with Cart Data | Feature dependency |

---

## Availability

### Availability [availability]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Sync frequently | Mismatches waste spend and cause disapprovals |
| Enable automatic updates | Safety net for mismatches |
| Use real-time for fast-moving inventory | Prevents serving OOS products |

**Do:**
- ✅ Keep availability synced with actual inventory
- ✅ Enable automatic item updates for availability
- ✅ Use Content API for real-time sync if inventory changes frequently

**Do NOT:**
- ❌ Show in_stock when product is out of stock

### Availability date [availability_date]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use for preorder/backorder products | Tells customers when available |
| Required when availability = preorder or backorder | Must provide expected date |

### Expiration date [expiration_date]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Set for limited-time products | Auto-removes when expired |
| Useful for seasonal inventory | Prevents serving expired products |

---

## Categorization

### Google product category [google_product_category]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use only to override auto-categorization | Google auto-categorizes well |
| Be as specific as possible | Use lowest-level category |

**Do:**
- ✅ Use most specific category available
- ✅ Verify auto-categorization is correct before overriding

**Do NOT:**
- ❌ Submit incorrect category (causes disapprovals)

### Product type [product_type]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use your own taxonomy | Campaign structure, listing group organization |
| Create detailed hierarchy | Better organization and filtering |
| 750 characters maximum | Use full depth when needed |

**Example:** `Apparel > Women > Dresses > Maxi Dresses`

**Do:**
- ✅ Use product type for campaign organization
- ✅ Create logical hierarchy matching your catalog structure

### Custom labels [custom_label_0-4]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Implement before campaign launch | Cannot segment retroactively |
| Use performance-based labels | Hero/Sidekick/Villain/Zombie segmentation |
| Use margin-based labels | Bid differently on high/low margin products |
| Use inventory-based labels | Protect low-stock, push high-stock |

**Custom label strategy examples:**

| **Label** | **Purpose** | **Example values** |
|-----------|-------------|-------------------|
| custom_label_0 | Performance tier | hero, sidekick, villain, zombie |
| custom_label_1 | Margin tier | high_margin, medium_margin, low_margin |
| custom_label_2 | Seasonality | evergreen, seasonal, clearance |
| custom_label_3 | Inventory level | high_stock, low_stock, critical |
| custom_label_4 | Priority | featured, standard, deprioritize |

> ⚠️ Custom labels must be populated before campaign launch. You cannot segment products that aren't labeled.

> ↪️ **For custom label strategies:** See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md).

---

## Product variants

### Item group ID [item_group_id]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Group all variants of same product | Enables Shopping features for variants |
| Use parent product identifier | Consistent grouping |

### Color, Size, Material, Pattern

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Include for apparel and variants | Required for apparel in many markets |
| Use consistent values | Enables filtering in Shopping tab |
| Add to title | Improves matching and CTR |

**Apparel requirements (BR, FR, DE, JP, UK, USA):**
- Age group: Required
- Gender: Required
- Color: Required
- Size: Required

**Do:**
- ✅ Use standard color names (not "wine red", use "red")
- ✅ Include up to 3 colors separated by "/"
- ✅ Use size system appropriate for target market

---

## Destinations and exclusions

### Excluded destination [excluded_destination]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use to exclude products from specific surfaces | Better than separate feeds |
| Keep all products in one primary feed | Google recommendation |

**Common exclusions:**
- Exclude from Shopping_ads when margin too low
- Exclude from Free_listings when inventory critical
- Exclude from Display_ads for specific products

### Pause [pause]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use for temporary removal | Don't delete and recreate products |
| Preserves product history | Performance data retained |

---

## Shipping

### Shipping [shipping]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Configure at account level when possible | Simpler management |
| Use product-level for exceptions | Oversized items, special handling |
| Include shipping costs in competitiveness | Google factors shipping into ranking |

### Shipping label [shipping_label]

| **Recommendation** | **Rationale** |
|--------------------|---------------|
| Use to group products with same shipping rules | Oversized, fragile, perishable |
| Reference in Merchant Center shipping settings | Maps products to shipping services |

> 💡 Don't underestimate shipping costs. Google factors shipping into total price competitiveness. Free shipping can significantly improve ranking.

---

## Optimization verification checklist

After optimizing your feed, verify:

| **Attribute** | **Check** |
|---------------|-----------|
| Title | Front-loaded, uses 150 characters, follows category formula |
| Price | Matches landing page, includes VAT where required |
| Image | 1500x1500px minimum, 75-90% frame fill, white background |
| GTIN | Provided for all products with GTINs |
| Availability | Synced with actual inventory |
| Description | Key details in first 160 characters |
| Brand | Accurate, recognizable |
| Product type | Hierarchical, matches catalog structure |
| Custom labels | Populated before campaign launch |
| Variants | Grouped with item_group_id, variant attributes included |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Feed quality concepts |
| [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md) | Attribute specifications |
| [Merchant Center Reference](../references/Merchant Center Reference.md) | Merchant Center configuration |
| [Product Title Catalog](../catalogs/Product Title Catalog.md) | Title examples by category |
| [Product Description Catalog](../catalogs/Product Description Catalog.md) | Description patterns |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Custom label strategies |
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
