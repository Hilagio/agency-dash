# Product Title Catalog
Created: 2026-02-04

Support_ID: CATALOG_14
Status: Done
Category: Shopping
Reference Type: Catalog
Agent_Readable: No
Human_Facing: Yes
Applies_To: Ecommerce
Domain: Shopping
Pillar: 6

### Purpose

This catalog lists reusable **product title formulas and patterns** used to optimize Shopping feed titles for maximum query matching and CTR.

Product titles are the most impactful attribute in your feed. They drive both matching (which queries show your products) and CTR (whether users click). This catalog provides category-specific formulas and examples.

---

### What this is / What this is NOT

**This catalog:**

- Lists title formulas by product category
- Provides examples of optimized titles
- Shows do's and don'ts for title construction

**This catalog does NOT:**

- Explain title optimization principles (See: [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md))
- List all feed attributes (See: [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md))
- Provide description patterns (See: [Product Description Catalog](../catalogs/Product Description Catalog.md))
- Provide step-by-step optimization (See: [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md))

---

## Title fundamentals

### Character limits

| **Visibility** | **Characters** | **Implication** |
|----------------|---------------|-----------------|
| User sees (typical PLA) | 70-100 | Front-load critical info |
| Full title | 150 max | Use for matching keywords |

### Title construction principles

- **Front-load** the most important details (brand, product type, key attribute)
- **Use the full character budget** for maximum matching, front-loading what the user sees
- **Include variant attributes** (color, size) for each variant
- **No promotional text** (causes disapprovals)
- **No ALL CAPS** for emphasis

> ⚠️ **Front-loading governs what the user sees.** The first 70-100 characters are the visible portion in a product listing ad, so the ordering decision is a visibility decision.

---

## The core title formula

**Universal formula:**

`[Brand] + [Product Type] + [Key Attributes] + [Model/Variant Details]`

This formula adapts by category. The order and specific attributes change, but the principle remains: most important info first.

---

## Category-specific formulas

### Fashion / Apparel

**Formula:** `Brand + Gender + Product Type + Attributes (color/size/material)`

| **Product** | **Optimized title** | **Why it works** |
|-------------|---------------------|------------------|
| Women's running shoes | "Nike Air Zoom Pegasus 40 Women's Running Shoes Black/White Size 8" | Brand + model + gender + product type + color + size |
| Men's jacket | "The North Face Thermoball Eco Men's Jacket Navy Blue XL" | Brand + model + gender + product type + color + size |
| Women's dress | "Zara Midi Wrap Dress Women's Red Floral Print Size M" | Brand + product type + gender + color + pattern + size |

**Key attributes for fashion:**

| **Attribute** | **Include when** |
|---------------|------------------|
| Gender | Always (men's, women's, unisex) |
| Color | Always |
| Size | Always for variants |
| Material | When relevant (silk, cotton, leather) |
| Pattern | When relevant (floral, striped, solid) |
| Style | When differentiating (midi, maxi, slim fit) |

---

### Electronics

**Formula:** `Brand + Attributes + Product Type + Model Number`

| **Product** | **Optimized title** | **Why it works** |
|-------------|---------------------|------------------|
| RAM memory | "Corsair Vengeance RGB Pro 32GB (2x16GB) DDR4 RAM 3200MHz Desktop Memory Kit Black" | Brand + capacity + specs + product type + model |
| Laptop | "Apple MacBook Pro 14-inch M3 Pro 18GB RAM 512GB SSD Space Gray" | Brand + model + size + specs + color |
| Headphones | "Sony WH-1000XM5 Wireless Noise Cancelling Over-Ear Headphones Black" | Brand + model + features + product type + color |

**Key attributes for electronics:**

| **Attribute** | **Include when** |
|---------------|------------------|
| Model number | Always |
| Capacity/specs | Always (GB, TB, resolution) |
| Key features | When differentiating (wireless, noise cancelling) |
| Compatibility | When relevant (for iPhone, for Windows) |
| Color | When multiple variants |
| Generation | When relevant (4th Gen, Series 2) |

---

### Consumables / Health & Beauty

**Formula:** `Brand + Product Type + Attributes (weight/amount/flavor)`

| **Product** | **Optimized title** | **Why it works** |
|-------------|---------------------|------------------|
| Protein powder | "Optimum Nutrition Gold Standard Whey Protein Powder 5lb Chocolate" | Brand + product line + product type + weight + flavor |
| Vitamins | "Nature Made Vitamin D3 2000 IU Softgels 200 Count" | Brand + product type + strength + format + count |
| Perfume | "Dior Sauvage Eau de Toilette Men's Fragrance 100ml" | Brand + product name + type + target + size |

**Key attributes for consumables:**

| **Attribute** | **Include when** |
|---------------|------------------|
| Size/amount | Always (ml, oz, count) |
| Flavor/scent | When multiple variants |
| Strength/dosage | For supplements (mg, IU) |
| Format | When relevant (tablets, softgels, powder) |
| Target audience | When relevant (men's, kids, sensitive skin) |

---

### Home & Furniture

**Formula:** `Brand + Product Type + Attributes (size/material/color) + Style`

| **Product** | **Optimized title** | **Why it works** |
|-------------|---------------------|------------------|
| Sofa | "IKEA Kivik 3-Seater Sofa Light Gray Fabric Modern Living Room Couch" | Brand + model + size + product type + color + material + style |
| Desk | "Flexispot E7 Standing Desk 55x28 Inch Black Electric Height Adjustable" | Brand + model + product type + size + color + features |
| Lamp | "West Elm Mid-Century Table Lamp Brass 18 Inch Modern" | Brand + style + product type + material + size |

**Key attributes for home:**

| **Attribute** | **Include when** |
|---------------|------------------|
| Dimensions | Always (inches, cm) |
| Material | Always |
| Color | Always |
| Style | When differentiating (modern, mid-century, rustic) |
| Room | When relevant (bedroom, living room, office) |
| Assembly | When relevant (assembly required, ready to assemble) |

---

### Books & Media

**Formula:** `Title + Author + Format (hardcover/ebook) + ISBN`

| **Product** | **Optimized title** | **Why it works** |
|-------------|---------------------|------------------|
| Book | "Atomic Habits James Clear Hardcover 9780735211292" | Title + author + format + ISBN |
| Book | "The Psychology of Money Morgan Housel Paperback" | Title + author + format |
| Audiobook | "Project Hail Mary Andy Weir Audiobook Unabridged" | Title + author + format + version |

**Key attributes for books:**

| **Attribute** | **Include when** |
|---------------|------------------|
| Author | Always |
| Format | Always (hardcover, paperback, ebook, audiobook) |
| ISBN | When available |
| Edition | When relevant (2nd Edition, Anniversary) |
| Version | For audiobooks (unabridged, abridged) |

---

### Seasonal / Occasion

**Formula:** `Occasion + Product Type + Attributes`

| **Product** | **Optimized title** | **Why it works** |
|-------------|---------------------|------------------|
| Halloween | "Halloween Spider Web Decoration Indoor/Outdoor 600 sq ft Black" | Occasion + product type + use + size + color |
| Christmas | "Christmas Pre-Lit Artificial Tree 7ft 400 LED Lights Green" | Occasion + features + product type + size |
| Birthday | "Happy Birthday Party Supplies Set 24 Guests Blue Gold" | Occasion + product type + capacity + colors |

**Key attributes for seasonal:**

| **Attribute** | **Include when** |
|---------------|------------------|
| Occasion | Always (Christmas, Halloween, Birthday) |
| Size/capacity | Always |
| Colors | Always |
| Features | When differentiating (pre-lit, reusable) |
| Indoor/outdoor | When relevant |

---

### Sports & Outdoors

**Formula:** `Brand + Product Type + Attributes (size/weight/material) + Use Case`

| **Product** | **Optimized title** | **Why it works** |
|-------------|---------------------|------------------|
| Tent | "Coleman 4-Person Camping Tent Waterproof Instant Setup Green" | Brand + capacity + product type + features + color |
| Golf club | "TaylorMade Stealth 2 Driver 10.5 Degree Regular Flex Right Hand" | Brand + model + product type + specs + flex + orientation |
| Yoga mat | "Manduka PRO Yoga Mat 6mm Thick 71 Inch Black Non-Slip" | Brand + product line + product type + thickness + length + color + feature |

---

### Automotive

**Formula:** `Year/Make/Model Compatibility + Product Type + Brand + Attributes`

| **Product** | **Optimized title** | **Why it works** |
|-------------|---------------------|------------------|
| Car parts | "2018-2022 Toyota Camry Front Brake Pads Ceramic Bosch" | Compatibility + product type + material + brand |
| Accessories | "Tesla Model 3 All-Weather Floor Mats Set of 4 Black TPE" | Compatibility + product type + quantity + color + material |
| Oil | "Mobil 1 Extended Performance Full Synthetic Motor Oil 5W-30 5 Quart" | Brand + product line + type + weight + size |

---

## Title optimization examples

### Before and after

| **Category** | **Before (poor)** | **After (optimized)** | **Issue fixed** |
|--------------|-------------------|----------------------|-----------------|
| Fashion | "Running shoes" | "Nike Air Zoom Pegasus 40 Women's Running Shoes Black Size 8" | Missing brand, gender, model, color, size |
| Electronics | "Wireless headphones" | "Sony WH-1000XM5 Wireless Noise Cancelling Headphones Black" | Missing brand, model, features |
| Furniture | "Desk" | "Flexispot E7 Standing Desk 55x28 Inch Electric Height Adjustable Black" | Missing brand, model, size, features |
| Books | "Self-help book" | "Atomic Habits James Clear Hardcover 9780735211292" | Missing title, author, format, ISBN |

---

## Common title mistakes

| **Mistake** | **Example** | **Why it fails** | **Fix** |
|-------------|-------------|------------------|---------|
| Too short | "Running shoes" | No matching keywords, no differentiation | Add brand, model, attributes |
| Promotional text | "50% OFF Nike Running Shoes" | Causes disapproval | Remove promotional language |
| ALL CAPS | "NIKE RUNNING SHOES" | Looks unprofessional | Use normal capitalization |
| Keyword stuffing | "Shoes running shoes athletic shoes sports shoes" | Looks spammy, may be disapproved | Use natural language |
| Missing brand | "Wireless noise cancelling headphones" | Missed brand searches, less trust | Add brand first |
| Wrong order | "Black size 8 women's Nike running shoes" | Key info buried | Front-load brand + product type |

---

## Variant title handling

When you have product variants, each variant needs a unique title with its specific attributes:

| **Parent product** | **Variant attribute** | **Variant title** |
|--------------------|----------------------|-------------------|
| Nike Air Max 90 | Size 9, White | "Nike Air Max 90 Men's Sneakers White Size 9" |
| Nike Air Max 90 | Size 10, Black | "Nike Air Max 90 Men's Sneakers Black Size 10" |
| Nike Air Max 90 | Size 11, Red | "Nike Air Max 90 Men's Sneakers Red Size 11" |

> ⚠️ **Each variant must have a unique title:** Don't use the same title for all variants: users and Google need to know which variant they're clicking on.

---

### Quick reference: Support library

| Document | Type | Used for |
|----------|------|----------|
| [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md) | Guideline | Title optimization principles |
| [Product Feed Data Specification Reference](../references/Product Feed Data Specification Reference.md) | Reference | Title attribute specifications |
| [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md) | Checklist | Validates title quality |
| [Product Description Catalog](../catalogs/Product Description Catalog.md) | Catalog | Description patterns |

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Uses this catalog in Phase 2.2 |

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
