# Promotional Extensions Reference
Created: 2026-04-04

Support_ID: REF_73
Status: ready-to-publish
Category: Creative
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Creative
Pillar: 8

## Purpose

Documents the technical specifications, timing requirements, and seasonal usage patterns for promotional advertising elements used during sales events and peak periods. Use this reference when preparing a seasonal campaign to determine which promotional elements to deploy, when to start, and how to configure them.

---

## What this reference is / what this is NOT

**This reference:**

- Documents seasonal usage patterns for countdown timers, promotional sitelinks, sale price annotations, promotion extensions, callout assets, and seasonal ad copy
- Provides image and video asset specifications by campaign type for seasonal creative
- Details timing and lead-time requirements for each promotional element

**This reference does NOT:**

- Define countdown timer syntax (See: [Dynamic Text Reference](../references/Dynamic Text Reference.md))
- List all extension types or general extension setup (See: [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md))
- Provide step-by-step extension setup procedures (See: [SOP – Set Up Ad Extensions](../sops/SOP – Set Up Ad Extensions.md))
- Explain sale price badge eligibility rules in depth (See: [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md))
- Cover the seasonal optimization lifecycle (See: [Seasonal Optimization Mental Model](../mental-models/Seasonal Optimization Mental Model.md))

---

## Quick reference: promotional elements

| **Element** | **Best for** | **Lead time** | **Campaign types** | **Impact** |
|-------------|-------------|---------------|-------------------|------------|
| 1️⃣ Promotion extension | Any sale or discount event | 2-3 business days (review) | Search, PMax | High: dedicated formatting, occasion badge |
| 2️⃣ Promotional sitelinks | Category-specific deals | Instant (recommend 48h) | Search, PMax | High: drives traffic to specific deal pages |
| 3️⃣ Sale price annotation | Shopping listings | 45-60 day stable base price | Shopping, PMax | Very high: strikethrough pricing, 20-40% CTR lift |
| 4️⃣ Countdown customizer | Time-limited offers | Instant (ad-level) | Search | Medium: creates urgency |
| 5️⃣ Seasonal callouts | General urgency signals | Instant | Search, PMax | Medium: underutilized by many advertisers |
| 6️⃣ Seasonal ad copy | All seasonal messaging | 1-2 business days (review) | Search | High: primary message vehicle |
| 7️⃣ Seasonal images | Display, PMax, Demand Gen | 1-2 business days (review) | Display, PMax, Demand Gen | High: visual differentiation |
| 8️⃣ Seasonal video | YouTube, PMax, Demand Gen | 1-2 weeks (production) | Video, PMax, Demand Gen | High: emotional engagement |

> 💡 **The promotion extension is the most important seasonal asset to have in place.** It gets dedicated formatting and an occasion badge that makes your ad visually distinct from competitors.

---

## 1️⃣ Promotion extensions

### Seasonal usage

Promotion extensions display a dedicated line below your ad with the offer details, occasion tag, and optional promo code. During peak periods, this visual differentiation drives significant incremental clicks.

| **Configuration** | **Options** | **Seasonal recommendation** |
|-------------------|-----------|---------------------------|
| Occasion | None, New Year, Valentine's Day, Easter, Mother's Day, Father's Day, Back to School, Halloween, Singles Day, Black Friday, Cyber Monday, Christmas, plus more | Always select the specific occasion: it adds a visual badge |
| Promotion type | Monetary discount, Percent discount, Up to monetary, Up to percent | Match to your actual offer structure |
| Item | 20 characters | Name the product category or offer (e.g., "all courses", "winter collection") |
| Promo code | Optional | Include if applicable: drives perceived exclusivity |
| Dates | Start/end | Always set explicit dates to prevent stale promotions |

### Timing
- Submit 2-3 business days before the event (allow for Google review)
- Schedule start and end dates to automate activation/deactivation
- Remove or let expire immediately after the event ends

> ↪️ **Full extension type overview and setup:** See [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) and [SOP – Set Up Ad Extensions](../sops/SOP – Set Up Ad Extensions.md)

---

## 2️⃣ Promotional sitelinks

### Seasonal usage

Create sitelinks that link directly to specific deal categories or product pages. Replace evergreen sitelinks with promotional versions during peak periods.

**Example patterns:**

| **Headline** | **Description line** | **Target page** |
|-------------|---------------------|----------------|
| Up to 70% Off TVs | Shop our biggest TV deals of the year | /black-friday/tvs |
| Laptops: 50% Discount | Limited time: half price on selected laptops | /deals/laptops |
| Save 60% on Tablets | Best tablet deals, while supplies last | /deals/tablets |
| All Black Friday Sales | Browse every deal in one place | /black-friday |

### Configuration notes
- Create 4-8 promotional sitelinks to give Google rotation options
- Use category-specific sitelinks for the categories or products you run promotions on
- Schedule start/end dates matching the promotion period
- After the event: revert to evergreen sitelinks or let scheduled ones expire

---

## 3️⃣ Sale price annotations

### Seasonal usage

The price drop badge (strikethrough pricing) on Shopping listings is the single highest-CTR lever for seasonal Shopping campaigns. It requires advance preparation.

| **Requirement** | **Details** | **Seasonal implication** |
|----------------|-----------|------------------------|
| Stable base price | 45-60 days at the same `price` value | Plan pricing stability 2 months before event |
| Sale price attribute | Submit via `sale_price` feed attribute | Do not change the `price` field, only add `sale_price` |
| Effective dates | Use `sale_price_effective_date` | Set explicit start/end to prevent indefinite discounting |
| Minimum discount | Typically 15%+ (Google does not publish exact threshold) | Ensure discount is meaningful enough to trigger the badge |
| LP match | Sale price in feed must match landing page | Coordinate with web team |

### Common timing mistake

Advertisers who change their base price frequently (weekly promotions, constant price adjustments) never trigger the badge because the 45-60 day stability window keeps resetting. If you want the badge for Black Friday, your base prices must be stable from early September onward.

> ↪️ **Full sale price mechanics, badge impact, and common mistakes:** See [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md)

---

## 4️⃣ Countdown customizers

### Seasonal usage

Countdown timers dynamically display the time remaining until a deadline. They create urgency without requiring ad copy updates as the deadline approaches.

**Seasonal application guidelines:**

| **Aspect** | **Recommendation** |
|-----------|-------------------|
| When to start | Begin countdown 5-7 days before the deadline. "47 days left" is not urgent. |
| Minimum effective period | 3 days: shorter creates urgency, longer diminishes it |
| Timezone | Set to account timezone or target location timezone for multi-region campaigns |
| Placement | Headlines only (descriptions truncate on mobile) |
| Default text | Always set a default: "Soon" or "Limited Time" (shows when countdown cannot render) |

**Example seasonal usage:**

| **Scenario** | **Ad copy** | **Output (2 days left)** |
|-------------|-----------|------------------------|
| Black Friday ending | `Black Friday Ends {COUNTDOWN(2026-11-30 23:59:59):Soon}` | "Black Friday Ends in 2 days" |
| Sale countdown | `Sale Ends in {COUNTDOWN(2026-12-05 23:59:59):Limited Time}` | "Sale Ends in 2 days" |

> ↪️ **Full countdown syntax, parameters, and rules:** See [Dynamic Text Reference](../references/Dynamic Text Reference.md)

---

## 5️⃣ Seasonal callouts

### Seasonal usage

Callout assets are underutilized by many advertisers during seasonal events. They provide additional urgency signals without consuming headline space.

**Seasonal callout examples:**

| **Category** | **Examples** |
|-------------|-------------|
| Urgency | + Offer Ends Tonight, + Last Chance to Save, + Limited Time Only |
| Scarcity | + While Supplies Last, + Limited Stock Alert, + Only X Left |
| Value | + Best Deals Guaranteed, + Price Match Promise, + Biggest Sale of the Year |
| Convenience | + Free Shipping on All Orders, + Easy Returns, + Next Day Delivery |

### Configuration notes
- Create 4-6 seasonal callouts to give Google rotation options
- Prefix with "+" for visual prominence
- Schedule start/end dates to automate seasonal rotation
- Mix urgency, scarcity, and value categories for the strongest combination

---

## 6️⃣ Seasonal ad copy principles

### Text ad preparation

Have holiday ads in place **2 weeks before the holiday starts** to allow for review and learning period.

**Five principles for seasonal RSA headlines:**

| **Principle** | **What to do** | **Example** |
|-------------|---------------|------------|
| Sale as focal point | Lead with the offer, not the product | "Black Friday: 50% Off All Courses" |
| UVP of the sale | Mention percentage off, savings amount, free shipping | "Save Up to 70% + Free Shipping" |
| Holiday references | Use event-specific language for relevance | "Black Friday Sale", "Cyber Monday Deals" |
| High-volume keywords | Include seasonal search terms in ad copy | "Black Friday Deals", "Holiday Sale" |
| Dynamic information | Use ad customizers for prices, stock levels, countdowns | "{CUSTOMIZER.discount}% Off, {COUNTDOWN(date):Today}" |

### Ad customizer usage for seasonal campaigns

Use ad customizers to dynamically show:
- Starting prices or discount percentages (via customizer attributes)
- Stock levels to increase urgency and scarcity (if limited)
- Countdown timers for sale end dates

> ↪️ **Ad customizer syntax and feed setup:** See [Dynamic Text Reference](../references/Dynamic Text Reference.md)

---

## 7️⃣ Seasonal image assets

### Design principles

- **Mobile first:** high-resolution, sharp, bold contrasting colors, big font sizes
- **Simplify design:** given smaller screen sizes, avoid clutter
- **Avoid blank spaces:** make the product or message the focus
- **Overlays:** create versions with and without text overlays. Overlays can backfire in Responsive Display Ads (RDA/RVA). Images with overlays tend to outperform in static ad formats.
- **LP match:** match images with landing page elements (message and design consistency)
- **Multiple formats:** prepare landscape (1.91:1), vertical (4:5 where supported), and square (1:1)

### Specs by campaign type

| **Campaign type** | **Format** | **Ratios** | **Overlay rule** |
|-------------------|-----------|-----------|-----------------|
| Search (image extensions) | Static image | 1.91:1, 1:1 | No overlays |
| Display / Remarketing (RDA) | Static image | 1.91:1, 1:1, 4:5 | Overlays can backfire |
| Display (HTML5 banners) | Static or HTML5 | 250x250, 728x90, etc. | Overlays recommended |
| Video (companion banner) | Static image | Per placement | Overlays allowed |
| PMax (full-asset) | Static image | 1.91:1, 1:1, 4:5 | With and without overlays |
| PMax (PLA-only) / Standard Shopping | Feed attribute | `additional_image_link`, `lifestyle_image_link` | Holiday-specific attributes for deals/bundles |
| Demand Gen | Static image | 1.91:1, 1:1, 4:5 | With and without overlays |

> ↪️ **Full image creative specifications:** See [Image Creative Reference](../references/Image Creative Reference.md)

---

## 8️⃣ Seasonal video assets

### Production principles

| **Principle** | **Guidance** |
|-------------|-------------|
| Length | Keep short: typically 15 seconds |
| Attention | You have mere seconds to capture attention. Grab the viewer immediately. |
| Pacing | Fast-paced to keep engagement |
| Footage | High-quality footage (does not have to be expensive) |
| Branding | Introduce brand early, ensure alignment with other ads and LPs |
| Offer | Front-load the holiday offer: clearly articulate what you are offering |
| Emotion | Use excitement, humor, or emotional connection |
| CTA | Clear call to action coupled with a sense of urgency |

### Where to use seasonal video

| **Campaign type** | **Usage** |
|-------------------|----------|
| YouTube (Video campaigns) | Primary seasonal video placement |
| PMax (full-asset) | Video assets within asset groups |
| Demand Gen | Video for discovery and social placements |

> ↪️ **Full video creative specifications and ABCD framework:** See [Video Creative Reference](../references/Video Creative Reference.md)

---

## Timing reference: lead times

| **Element** | **Minimum lead time** | **Recommended lead time** | **Bottleneck** |
|-------------|----------------------|--------------------------|----------------|
| Sale price annotation | 45-60 days (price stability) | Start price stability 2 months before event | Base price history |
| Promotion extension | 2-3 business days | 1 week before event | Google review process |
| Promotional sitelinks | Instant (but recommend 48h) | 1 week before event | LP readiness |
| Countdown customizer | Instant | 5-7 days before deadline | None (ad-level) |
| Seasonal callouts | Instant | 1 week before event | None |
| Seasonal ad copy (RSA) | 1-2 business days | 2 weeks before event | Google review + learning |
| Seasonal images | 1-2 business days | 2 weeks before event | Design production |
| Seasonal video | 1-2 weeks | 4 weeks before event | Production timeline |
| Product feed updates | 24-48h processing | 3-5 business days before event | Merchant Center processing |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Launching promotional extensions on event day | Stuck in review while competitors are live | Submit 2-3 business days early |
| Leaving seasonal extensions active after the event | "Black Friday Sale" in December damages credibility | Set explicit end dates on all seasonal extensions |
| Changing base price to create a "sale" | No badge triggers, Google validates against crawled history | Maintain stable `price`, use `sale_price` for discounts |
| Using countdown timers with no real deadline | Policy risk, damages trust | Only use for genuine deadlines |
| Identical messaging across all extensions | Redundant, wastes ad real estate | Vary message type: urgency in callouts, specifics in sitelinks, offer in promotion |
| Forgetting to prepare multiple image formats | Ads do not serve in all placements | Create all three ratios: 1.91:1, 1:1, 4:5 |
| Text overlays on all image ads | Overlays backfire in responsive ad formats | Create versions with and without overlays |

---

## Related Documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Seasonal Optimization Mental Model](../mental-models/Seasonal Optimization Mental Model.md) | Strategic framework for when and why to use these elements |
| [Dynamic Text Reference](../references/Dynamic Text Reference.md) | Countdown timer syntax and ad customizer specifications |
| [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) | Full extension type inventory and composition patterns |
| [SOP – Set Up Ad Extensions](../sops/SOP – Set Up Ad Extensions.md) | Step-by-step extension setup procedure |
| [Shopping Product Performance Reference](../references/Shopping Product Performance Reference.md) | Sale price badge mechanics and eligibility rules |
| [Image Creative Reference](../references/Image Creative Reference.md) | Image specifications and quality standards |
| [Video Creative Reference](../references/Video Creative Reference.md) | Video specifications and ABCD framework |
| [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md) | Headline patterns for seasonal ad copy |
| [SOP – Plan and Execute Seasonal Adjustments](../sops/SOP – Plan and Execute Seasonal Adjustments.md) | Full seasonal execution procedure that deploys these elements |

---

## Version details

- **Version:** 1.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
