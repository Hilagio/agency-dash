# PMax Asset Group Strategy Reference
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: REFERENCE_15
Status: Done
Reference Type: Reference
Agent_Readable: No
Human_Facing: Yes
Applies_To: Lead Gen, SaaS, Ecommerce
Domain: PMax
Pillar: 6

## Purpose

This reference documents asset group composition, structure strategies, and best practices for Performance Max campaigns across all verticals.

Asset groups are the building blocks within PMax campaigns. Each asset group contains creative assets, audience signals, and listing groups (for Ecommerce). This reference covers how to structure and populate asset groups effectively.

---

## What this is NOT

This reference does **not:**

- Explain when to use PMax (See: [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) or [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>))
- Provide audience signal details (See: [Audience Signals Reference](../references/Audience Signals Reference.md))
- Provide step-by-step campaign setup (See relevant SOPs)
- Explain Feed-Only vs Full Assets (See: [Shopping Campaign Type Mental Model](../mental-models/Shopping Campaign Type Mental Model.md))

---

## Feed-Only vs Full Assets: Asset requirements

> ⚠️ **Critical distinction:** Feed-Only PMax and Full Assets PMax have completely different asset requirements.

| **PMax Type** | **Assets required** | **Behavior** |
|---------------|---------------------|--------------|
| **Feed-Only** | Listing groups only (NO other assets) | Serves primarily on Shopping surfaces (minor remarketing leak to other networks possible) |
| **Full Assets** | All assets below | Serves on all Google surfaces |

**For Feed-Only PMax:** Do NOT add any headlines, long headlines, descriptions, images, logos, or videos. Only configure listing groups. Your product feed IS your creative. Adding any assets will cause PMax to serve on Display and YouTube.

---

## Asset group components (Full Assets only)

Each asset group in Full Assets PMax contains:

| **Component** | **Purpose** | **Required** |
|---------------|-------------|--------------|
| **Final URL** | Landing page destination | Yes |
| **Headlines** | Short text for ads | Yes (3 minimum) |
| **Long headlines** | Longer text for Display/Discover | Yes (1 minimum) |
| **Descriptions** | Body text | Yes (2 minimum) |
| **Images** | Visual creative | Yes (1 minimum per format) |
| **Logos** | Brand identification | Yes (1 minimum) |
| **Videos** | YouTube and video placements | No (but strongly recommended) |
| **Audience signals** | Targeting suggestions | No (but recommended) |
| **Listing groups** | Product selection (Ecommerce only) | Yes (Ecommerce) |

---

## Asset specifications

### Text assets

| **Asset type** | **Max length** | **Minimum** | **Recommended** |
|----------------|---------------|-------------|-----------------|
| **Headlines** | 30 characters | 3 | 5-11 |
| **Long headlines** | 90 characters | 1 | 2-5 |
| **Descriptions** | 90 characters | 2 | 4 |
| **Business name** | 25 characters | 1 | 1 |
| **Call to action** | Predefined options | 1 | 1 |
| **Display URL path** | 15 characters × 2 | 0 | 1-2 |

> 💡 **Do not max out assets.** Fewer, more targeted assets enable more efficient ad testing. See [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md).

### Image assets

| **Format** | **Aspect ratio** | **Min dimensions** | **Recommended** | **Minimum** |
|------------|-----------------|-------------------|-----------------|-------------|
| **Landscape** | 1.91:1 | 600×314 | 1200×628 | 1 |
| **Square** | 1:1 | 300×300 | 1200×1200 | 1 |
| **Portrait** | 4:5 | 480×600 | 960×1200 | 0 |

**Image requirements:**

- File types: JPG, PNG
- Max file size: 5 MB
- No text overlay covering >20% of image
- No promotional text ("50% off")

### Logo assets

| **Format** | **Aspect ratio** | **Min dimensions** | **Recommended** |
|------------|-----------------|-------------------|-----------------|
| **Square logo** | 1:1 | 128×128 | 1200×1200 |
| **Landscape logo** | 4:1 | 512×128 | 1200×300 |

### Video assets

| **Specification** | **Requirement** |
|-------------------|-----------------|
| **Hosting** | Must be on YouTube |
| **Minimum duration** | 10 seconds |
| **Recommended duration** | 15-60 seconds |
| **Aspect ratios** | Horizontal (16:9), Square (1:1), Vertical (9:16) |
| **Quality** | 1080p or higher recommended |

> ⚠️ **If you don't provide video, Google auto-generates:** Auto-generated videos from your images typically underperform custom video. Always upload at least one video.

---

## Asset group structure strategies

### Strategy 1: By offer/service (Lead Gen/SaaS)

One asset group per product or service offering.

| **Asset group** | **Final URL** | **Creative theme** |
|-----------------|---------------|-------------------|
| Product A | /product-a | Product A messaging |
| Product B | /product-b | Product B messaging |
| Service Package | /services | Services messaging |

**Best for:** Multiple distinct offerings with different value propositions

### Strategy 2: By audience segment

One asset group per target audience, same offer.

| **Asset group** | **Audience signal** | **Creative angle** |
|-----------------|--------------------|--------------------|
| Enterprise | Enterprise companies | Scale, security focus |
| SMB | Small businesses | Ease of use, price |
| Startups | Startup founders | Growth, flexibility |

**Best for:** Same product, different buyer personas

### Strategy 3: By messaging angle

One asset group per messaging theme.

| **Asset group** | **Messaging angle** | **Creative focus** |
|-----------------|--------------------|--------------------|
| Features | Product capabilities | What it does |
| Benefits | User outcomes | What you achieve |
| Social proof | Testimonials, results | Who else uses it |
| Urgency | Time-limited offers | Why now |

**Best for:** Testing which message resonates

### Strategy 4: By product category (Ecommerce)

One asset group per product category with category-specific creative.

| **Asset group** | **Listing group** | **Creative theme** |
|-----------------|-------------------|--------------------|
| Running Shoes | product_type = Running Shoes | Running imagery |
| Training Shoes | product_type = Training Shoes | Gym/training imagery |
| Casual Shoes | product_type = Casual Shoes | Lifestyle imagery |

**Best for:** Categories with different visual styles or audiences

> ⚠️ **This strategy is for Full Assets PMax only:** For Feed-Only PMax, you do not add any creative assets: no images, no videos, no headlines, no descriptions. Only configure listing groups.

### Strategy 5: Hybrid approach

Combine strategies based on campaign complexity.

| **Campaign** | **Asset group 1** | **Asset group 2** | **Asset group 3** |
|--------------|-------------------|-------------------|-------------------|
| Enterprise Product | Features angle | Benefits angle | Social proof |
| SMB Product | Features angle | Benefits angle | Price focus |

**Best for:** Mature accounts with sufficient conversion volume per asset group

---

## Asset group volume requirements

Each asset group needs sufficient conversions to learn independently.

| **Structure** | **Minimum conversions/month** | **Recommendation** |
|---------------|------------------------------|-------------------|
| Single asset group | 30+ | Start here |
| 2-3 asset groups | 30+ per asset group | Graduate when hitting threshold |
| 4+ asset groups | 30+ per asset group | Only for high-volume accounts |

> ⚠️ **Don't over-segment:** If you can't get 30+ conversions per asset group per month, consolidate.

---

## Text asset best practices

### Headlines (30 characters)

| **Type** | **Examples** |
|----------|-------------|
| **Brand/Product** | "PPC Mastery OS Software", "Try PPC Mastery Free" |
| **Benefit** | "Scale Your Campaigns", "Maximize Client ROAS" |
| **Feature** | "AI-Powered Optimization", "Complete PPC System" |
| **CTA** | "Start Free Trial", "Get a Demo" |
| **Social proof** | "Trusted by 500+ Agencies", "#1 Google Ads OS" |

**Mix:** Include variety across categories. Don't repeat the same message.

> ↪️ **For headline patterns and angles:** See [Headline Angle Catalog](../catalogs/Headline Angle Catalog.md).

### Long headlines (90 characters)

| **Type** | **Examples** |
|----------|-------------|
| **Value proposition** | "The Google Ads OS That Helps Agencies Scale Campaigns and Maximize Client ROAS Efficiently" |
| **Problem-solution** | "Stop Losing Time to Manual Optimization and Start Scaling Your Agency Profitably" |
| **Benefit stack** | "Diagnose Issues Faster, Make Better Decisions, and Execute with Proven Frameworks" |

### Descriptions (90 characters)

| **Focus** | **Examples** |
|-----------|-------------|
| **Primary benefit** | "Automate your Google Ads optimization and never miss a scaling opportunity again". |
| **Features** | "Constraint-driven diagnosis, decision frameworks, and execution SOPs all in one system". |
| **Social proof** | "Join 500+ agencies using PPC Mastery OS to scale their clients' campaigns profitably". |
| **CTA** | "Start your free trial today. No credit card required to get started". |

> ↪️ **For description patterns:** See [Description Expansion Catalog](../catalogs/Description Expansion Catalog.md).

---

## Image asset best practices

### Content guidelines

| **Do** | **Don't** |
|--------|-----------|
| Show product in use | Use stock photos with watermarks |
| Use high-quality photos | Add promotional text ("50% off") |
| Include people (improves CTR) | Use blurry or pixelated images |
| Match landing page visuals | Mislead about product/offer |
| Test lifestyle vs product | Use competitor logos or content |

### Format recommendations

| **Placement** | **Best format** | **Notes** |
|---------------|-----------------|-----------|
| **Shopping** | Product feed images | Automatic from feed |
| **Search** | Square (1:1) | Companion to text |
| **Display** | Landscape (1.91:1) | Most inventory |
| **YouTube** | Landscape (1.91:1) | Thumbnail |
| **Discover** | Portrait (4:5) | Mobile-first |

### Variety recommendations

Provide variety across:

- **Angles:** Product shots, lifestyle, close-ups
- **Subjects:** Product alone, product with people, product in context
- **Branding:** Some with logo, some without
- **Backgrounds:** White/clean, contextual, branded

> ↪️ **For image specifications and best practices:** See [Image Creative Reference](../references/Image Creative Reference.md).

---

## Video asset best practices

### Duration guidelines

| **Duration** | **Best for** |
|--------------|--------------|
| 6-15 seconds | Brand awareness, simple message |
| 15-30 seconds | Product demo, feature highlight |
| 30-60 seconds | Detailed explanation, testimonial |
| 60+ seconds | In-depth product walkthrough |

### Content structure

| **Format** | **Structure** |
|------------|---------------|
| **Hook-Problem-Solution** | Attention grab → Pain point → Your product |
| **Demo** | Show product in action → Key features → CTA |
| **Testimonial** | Customer story → Problem → Solution → Result |
| **Feature highlight** | Single feature deep dive → Benefit → CTA |

### Technical recommendations

- **Aspect ratios:** Provide all three (16:9, 1:1, 9:16) when possible
- **Sound:** Works without sound (captions), enhanced with sound
- **Branding:** Logo in first 5 seconds
- **CTA:** Clear call to action in final 5 seconds

> ↪️ **For video specifications and best practices:** See [Video Creative Reference](../references/Video Creative Reference.md).

---

## Audience signals by asset group

Each asset group can have its own audience signals. Use different signals to match the asset group's creative theme.

| **Asset group theme** | **Recommended signals** |
|----------------------|------------------------|
| Enterprise | Enterprise companies list, industry in-market |
| SMB | Small business owners, competitor URLs |
| Features | Product category in-market, search terms |
| Benefits | Problem-related search terms, competitor URLs |
| Retargeting focus | Website visitors, cart abandoners |

> ↪️ **For signal types and implementation:** See [Audience Signals Reference](../references/Audience Signals Reference.md).

---

## Final URL strategy

### Single URL approach

All ads in asset group go to one landing page.

| **Pros** | **Cons** |
|----------|----------|
| Simple | May not match all ad variations |
| Consistent experience | Less personalized |

**Best for:** Single offer, focused campaigns

### Final URL expansion

Google selects landing page from your site.

| **Setting** | **When to use** |
|-------------|-----------------|
| **ON** | Large site, many relevant pages |
| **OFF** | Specific landing page required, Ecommerce (product pages) |

> ⚠️ **For Ecommerce Feed-Only:** Always set Final URL expansion OFF. You want users landing on product pages from your feed, not blog posts.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Structure decisions (Lead Gen/SaaS) |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Structure decisions (Ecommerce) |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Audience signal types |
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | PMax settings for Ecommerce |
| [SOP – Launch PMax for Lead Gen/SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md) | Campaign setup (Lead Gen/SaaS) |
| [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) | Campaign setup (Ecommerce) |

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
