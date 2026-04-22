# PMax Structure Mental Model (Ecommerce)
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: MENTALMODEL_13
Status: Done
Reference Type: Mental Model
Agent_Readable: No
Human_Facing: Yes
Applies_To: Ecommerce
Domain: PMax
Pillar: 6

## Purpose

This mental model helps you structure Performance Max campaigns specifically for Ecommerce, covering both Feed-Only and Full Assets approaches.

> ❓ **The core question:** How should I structure my PMax campaigns for Ecommerce to maximize Shopping performance while controlling spend across channels?

Ecommerce PMax is fundamentally different from Lead Gen/SaaS PMax. For Ecommerce, your product feed is the core asset. Campaign structure depends on whether you run Feed-Only (Shopping-focused) or Full Assets (cross-channel).

> 💡 **Prerequisite:** Your product feed must be optimized before launching PMax. See [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) and [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md).

---

## What this is NOT

This mental model does **not:**

- Help choose between Standard Shopping and PMax (See: [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md))
- Cover Lead Gen or SaaS PMax (See: [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>))
- Explain Standard Shopping configuration (See: [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md))
- Provide product segmentation framework (See: [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md))
- Provide custom label implementation (See: [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md))
- Cover conversion volume thresholds (See: [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md))

---

## Feed-Only vs Full Assets: Two distinct strategies

| **Aspect** | **PMax Feed-Only** | **PMax Full Assets** |
|------------|-------------------|---------------------|
| **Strategic role** | Automated Shopping execution | Cross-channel product growth |
| **Primary channel** | Shopping (with minor leak) | All Google surfaces |
| **Data source** | Product feed only | Product feed + creative assets |
| **Creative investment** | None | High (images, video, text) |
| **When to use** | Want Shopping automation without creative work | Want reach beyond Shopping with quality creative |
| **Volume requirement** | 30+ conversions/month | 50+ conversions/month |

> 💡 **Feed-Only PMax is strategically closer to Standard Shopping than to Full Assets PMax:** Both operate on the same Shopping surface with the same data source (your product feed). Full Assets PMax is a fundamentally different campaign model.

---

## PMax Feed-Only structure

Feed-Only PMax relies entirely on your product feed. Structure follows the same segmentation logic as Standard Shopping.

### Feed-Only setup principles

1. **ZERO creative assets** (no images, videos, headlines, descriptions, logos)
2. **Product feed IS your creative**
3. **Listing groups control which products appear**
4. **Audience signals not needed** (your feed is your targeting)

> ⚠️ **If you add ANY creative assets, PMax will serve on Display and YouTube:** For true Feed-Only behavior, leave all asset fields empty and only configure listing groups.

### Campaign structure options

| **Structure** | **When to use** | **Example** |
|---------------|-----------------|-------------|
| **Single campaign** | Simple catalog, consistent margins | All products in one PMax campaign |
| **By performance tier** | Using Hero/Sidekick/Villain/Zombie segmentation | Heroes + Sidekicks campaign + Zombie campaign |
| **By category** | Categories need different budgets or ROAS | Electronics PMax + Accessories PMax |

### Segmentation decision guide

```
Have 90+ days of conversion data?
│
├─ NO → Single campaign (build data first)
│
└─ YES → Clear performance variance across products?
          │
          ├─ NO → Single campaign or category-based
          │
          └─ YES → Have labeling tool (ProductHero, Profitmetrics)?
                   │
                   ├─ NO → Category-based structure
                   │
                   └─ YES → Performance-based (Hero/Sidekick/Villain/Zombie)
```

> ↪️ **For product segmentation framework:** See [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md).

> ↪️ **For custom label implementation:** See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md).

### Listing group structure

Within each PMax campaign, use listing groups to control which products appear:

| **Level** | **Common subdivisions** | **Purpose** |
|-----------|------------------------|-------------|
| All products | — | Starting point |
| Brand | By brand | Separate brand performance |
| Product type | By category hierarchy | Match your catalog structure |
| Custom label | By performance tier, margin, etc. | Enable segmentation strategies |
| Item ID | Individual products | Exclude specific products |

### Zombie product handling

Zombie products (< 100 impressions in 90 days) need special treatment:

| **Approach** | **Setup** | **Why** |
|--------------|-----------|---------|
| **Separate zombie campaign** | Zombies in dedicated PMax with Maximize Conversions (no target) | Gives untested products a chance to serve |
| **Mixed with sidekicks** | Zombies + Sidekicks in same campaign | Sidekicks provide stability while zombies get tested |

> ⚠️ **Zombies are not bad products, they are untested:** You cannot know if a product is good until it gets impressions.

---

## PMax Full Assets structure

Full Assets PMax adds creative across all Google surfaces. Structure decisions include both feed segmentation and creative strategy.

### Full Assets setup requirements

1. **Product feed** (same as Feed-Only)
2. **Image assets** (1200x628, 1200x1200, 960x1200)
3. **Video assets** (optional but recommended)
4. **Text assets** (headlines, long headlines, descriptions)
5. **Final URLs** (landing pages)
6. **Audience signals** (recommended)

### Campaign structure options

| **Structure** | **When to use** | **Example** |
|---------------|-----------------|-------------|
| **Single campaign, multiple asset groups** | Simple catalog, unified audience | All products, asset groups by category |
| **By category** | Categories need different creative or ROAS | Running Shoes PMax + Training Shoes PMax |
| **By brand** | Different brands need different creative or budgets | Nike PMax + Adidas PMax |

### Asset group strategy

Asset groups are the creative containers within Full Assets PMax:

| **Approach** | **Structure** | **Best for** |
|--------------|---------------|--------------|
| **By product category** | 1 asset group per category with category-specific creative | Different products need different messaging |
| **By brand** | 1 asset group per brand with brand-specific creative | Different brands need different visual identity |
| **By creative angle** | 1 asset group per messaging theme | Testing which creative approach converts |

### Asset group minimum composition (Full Assets only)

| **Asset type** | **Minimum** | **Recommended** | **Feed-Only** |
|----------------|-------------|-----------------|---------------|
| Headlines (30 chars) | 3 | 5-11 | None |
| Long headlines (90 chars) | 1 | 2-5 | None |
| Descriptions (90 chars) | 2 | 4 | None |
| Images (landscape 1.91:1) | 1 | 3+ | None |
| Images (square 1:1) | 1 | 3+ | None |
| Images (portrait 4:5) | 0 | 1+ | None |
| Logo (square) | 1 | 1-2 | None |
| Logo (landscape) | 0 | 1 | None |
| Video | 0 | 1+ (strongly recommended) | None |
| Listing groups | Yes | Segmented | Yes (only asset) |

> ⚠️ **Weak creative = wasted spend:** Without quality images and video, Full Assets PMax will spend on Display/YouTube with poor results. If you cannot invest in creative, use Feed-Only instead.

---

## Shared PMax configuration (Ecommerce)

### Brand separation

Brand separation is mandatory for Ecommerce PMax. Brand traffic inflates metrics and prevents you from seeing true acquisition costs.

**Implementation:**

1. Go to PMax campaign settings
2. Navigate to Brand exclusions
3. Add your brand name(s) as exclusions
4. Verify with search terms report that brand queries are blocked

> ↪️ **For brand separation implementation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

### Remarketing control

PMax may over-index on remarketing traffic, inflating ROAS. Control this with data exclusions:

**When to exclude remarketing:**

| **Scenario** | **Action** |
|--------------|------------|
| ROAS looks too good to be true | Check remarketing share, consider exclusions |
| Want to measure true acquisition | Exclude website visitors and/or customer lists |
| Testing incrementality | Exclude to see new customer performance |

**How to exclude:**

1. Go to PMax campaign > Settings > Other settings
2. Navigate to "Your data" exclusions
3. Add website visitor audiences or customer lists to exclude

### Conversion value tracking

PMax optimizes for value, not just volume. Ensure conversion values are tracked accurately:

| **Setup** | **What it does** | **When to use** |
|-----------|------------------|-----------------|
| Dynamic values | Track actual revenue per transaction | Always for Ecommerce |
| Conversion with Cart Data | Track product-level revenue | Enables profit reporting |
| Profit tracking (ProfitMetrics) | Track profit instead of revenue | Enables POAS optimization |

### Volume thresholds

| **Bid strategy** | **Minimum conversions/month** |
|------------------|-------------------------------|
| Maximize Conversion Value (no target) | Works at any volume |
| Target ROAS | 50+ |

> ↪️ **For complete volume thresholds:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

---

## Audience signals for Ecommerce PMax (Full Assets only)

> ⚠️ **Audience signals apply only to Full Assets PMax:** For Feed-Only PMax, your product feed IS your targeting. Do not add audience signals to Feed-Only campaigns.

Audience signals tell PMax where to start looking. They are suggestions, not restrictions.

### Signal quality hierarchy

| **Signal type** | **Quality** | **Use for** |
|-----------------|-------------|-------------|
| **Customer Match (purchasers)** | Highest | "Find more people like my buyers" |
| **Website converters** | High | "Find more people who convert" |
| **Website visitors (high-intent pages)** | Moderate | "Find more people who engage" |
| **Custom segments (competitor URLs)** | Moderate | "Find people shopping competitors" |
| **In-market audiences** | Lower | Broad category signals |

### Minimum list sizes

| **List type** | **Minimum** | **Recommended** |
|---------------|-------------|-----------------|
| Customer Match | 1,000 matched | 5,000+ |
| Website visitors | 1,000 in 30 days | 5,000+ |
| Converters | 100 | 500+ |

> ↪️ **For detailed audience signal implementation:** See [Audience Signals Reference](../references/Audience Signals Reference.md).

---

## Feed-Only vs Full Assets: Failure modes

### Feed-Only failure modes

| **Failure** | **Why it happens** | **How to prevent** |
|-------------|--------------------| --------|
| Spend leaking to Display/YouTube | Creative assets present in the asset group | Verify zero creative assets are attached to feed-only asset groups |
| Zombie products not serving | tROAS too aggressive for untested products | Start untested segments on Maximize Conversions without a target |
| Products disapproved | Feed quality issues | Validate feed before launch with [Product Feed Quality Checklist](../checklists/Product Feed Quality Checklist.md) |
| Poor query matching | Weak product titles | Apply title optimization from [Product Feed Optimization Guidelines](../guidelines/Product Feed Optimization Guidelines.md) before launch |

### Full Assets failure modes

| **Failure** | **Why it happens** | **How to prevent** |
|-------------|--------------------| --------|
| ROAS inflated by remarketing | No data exclusions configured | Configure "Your data" exclusions during launch setup |
| Poor performance on Display/YouTube | Low-quality creative assets | Validate creative quality before launch, or use Feed-Only approach |
| Budget consumed by non-Shopping | Algorithm prefers creative channels over Shopping | Monitor channel performance from week 1, define minimum Shopping % threshold |
| Cannibalized Search traffic | Brand terms not excluded | Add brand exclusions during launch setup |

---

## Decision guide: Which Ecommerce PMax approach?

```
Do you have quality creative assets (images, video)?
│
├─ NO → Use Feed-Only PMax
│
└─ YES → Do you want cross-channel reach beyond Shopping?
          │
          ├─ NO → Use Feed-Only PMax (simpler)
          │
          └─ YES → Do you have 50+ conversions/month?
                   │
                   ├─ NO → Use Feed-Only PMax (build volume first)
                   │
                   └─ YES → Use Full Assets PMax
```

---

## Key principles

1. **Feed quality is the foundation:** PMax cannot overcome a poor product feed. Optimize your feed first.
2. **Feed-Only is Shopping automation:** It operates on the same surface as Standard Shopping with the same data source.
3. **Full Assets is cross-channel growth:** It requires creative investment and higher volume thresholds.
4. **Brand separation is mandatory:** Without it, brand traffic inflates your metrics.
5. **Same tROAS across segments:** Differentiate via budget, not bid targets.
6. **Zombies need special treatment:** Use Maximize Conversions without targets to give untested products a chance.
7. **Patience required:** PMax needs 2-4 weeks to learn. Don't judge in week one.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md) | Prerequisite (feed quality foundations) |
| [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md) | Upstream (Standard Shopping vs PMax decision) |
| [Product Feed Segmentation Mental Model](../mental-models/Product Feed Segmentation Mental Model.md) | Framework (segmentation applies to both Shopping and PMax) |
| [Standard Shopping Campaign Structure Mental Model](../mental-models/Standard Shopping Campaign Structure Mental Model.md) | Alternative (Standard Shopping-specific settings) |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Parallel (different vertical) |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Reference (custom label tactics) |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference (brand exclusion implementation) |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference (signal types and implementation) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference (volume thresholds by bid strategy) |
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Prerequisite (feed setup) |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Execution (Feed-Only setup) |
| [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) | Execution (Full Assets setup) |

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
