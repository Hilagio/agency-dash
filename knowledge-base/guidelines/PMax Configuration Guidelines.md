# PMax Configuration Guidelines
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: GUIDELINE_8
Status: Done
Reference Type: Guideline
Agent_Readable: No
Human_Facing: Yes
Applies_To: Lead Gen, SaaS, Ecommerce
Domain: PMax
Pillar: 6

## Purpose

This guideline provides recommended configuration settings for Performance Max campaigns across all verticals.

PMax has many settings that affect performance. This guideline covers which settings to enable, disable, or configure for optimal results based on your campaign goals.

---

## What this is NOT

This guideline does **not:**

- Explain PMax structure decisions (See: [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) or [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>))
- Provide step-by-step setup (See relevant SOPs)
- List all available settings (See: [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) for Ecommerce)
- Explain audience signal types (See: [Audience Signals Reference](../references/Audience Signals Reference.md))

---

## Quick reference: Key settings

| **Setting** | **Recommended** | **Why** |
|-------------|-----------------|---------|
| Final URL expansion | OFF (usually) | Control landing page destination |
| Brand exclusions | ON | Prevent brand cannibalization |
| Customer acquisition | Consider | Optimize bidding for new customers |
| Audience signals | Add | Improve targeting efficiency |
| Data exclusions | Consider | Control remarketing mix |

---

## Bidding configuration

### Bid strategy selection

| **Scenario** | **Strategy** | **Target** |
|--------------|--------------|------------|
| New campaign, building volume | Maximize Conversions | No target |
| New campaign with values | Maximize Conversion Value | No target |
| 30+ conversions/month | Maximize Conversions | Target CPA |
| 50+ conversions/month with values | Maximize Conversion Value | Target ROAS |

### Bid strategy recommendations

| **Setting** | **Recommendation** | **Exception** |
|-------------|-------------------|---------------|
| Start without targets | Recommended for new campaigns | Skip if migrating with strong historical data |
| Add target after learning | Wait 2-4 weeks, 30+ conversions | Add sooner if confident in target |
| Target aggressiveness | Start loose (10-20% above actual) | Tighten gradually |

> ⚠️ **Don't set aggressive targets on new campaigns:** PMax needs room to learn. Overly aggressive targets strangle learning.

---

## Final URL expansion

### What it does

Final URL expansion allows Google to select landing pages from your website instead of using only the Final URL you specify.

### Recommendations by vertical

| **Vertical** | **Setting** | **Why** |
|--------------|-------------|---------|
| **Lead Gen/SaaS** | OFF or Test | Drive to specific landing pages (test if you have multiple relevant pages) |
| **Ecommerce Feed-Only** | OFF | Product pages from feed are correct |
| **Ecommerce Full Assets** | OFF or Test | Test if site has many relevant pages |

### When to enable

| **Enable when** | **Keep off when** |
|-----------------|-------------------|
| Large site with many relevant pages | Specific landing page required |
| Want Google to find converting pages | Product-focused campaigns |
| Testing incremental pages | Lead Gen with optimized landing pages |

### URL exclusion rules

If enabling Final URL expansion, use exclusion rules to prevent unwanted pages:

| **Exclude** | **Example** |
|-------------|-------------|
| Blog posts (if not converting) | `/blog/*` |
| Support pages | `/help/*`, `/support/*` |
| Career pages | `/careers/*` |
| Policy pages | `/privacy`, `/terms` |

---

## Brand exclusions

### Why mandatory

Brand exclusions prevent PMax from capturing your cheap brand traffic, which:
- Inflates PMax performance metrics
- Cannibalizes your Brand Search campaign
- Hides true acquisition costs

### Configuration

| **Step** | **Action** |
|----------|------------|
| 1 | Go to Settings > Other settings > Brand exclusions |
| 2 | Click "Add brand lists" |
| 3 | Add your brand name(s) |
| 4 | Add brand misspellings if common |

### What to exclude

| **Include** | **Example** |
|-------------|-------------|
| Primary brand name | "PPC Mastery" |
| Full company name | "PPC Mastery B.V". |
| Product names (if branded) | "Scaling OS" |
| Common misspellings | "ppcmastery" |

### Brand exclusion limitations (brand/non-brand bleeding)

PMax brand exclusions match exact brand names but do not catch variations:

| **Limitation** | **Impact** | **Workaround** |
|----------------|------------|----------------|
| Misspellings not caught | Brand queries with typos serve in non-brand PMax | Add common misspellings to negative keyword lists |
| Abbreviations not caught | Shortened brand names bypass exclusions | Add abbreviations to negative keyword lists |
| Word order variations | Different word arrangements may bypass filters | Build comprehensive negative keyword lists |

**Recommendation:** Treat brand exclusions as the first layer of defense. Use negative keyword lists as your primary mechanism for strict brand/non-brand separation.

> ↪️ **For complete brand separation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

---

## Customer acquisition settings

### What it does

Customer acquisition settings **adjust bidding** to prioritize new customers. This is not tracking: it actively changes how Google bids in auctions.

> 💡 **Tracking is separate from bidding:** You can track new vs returning customers through the new customer data conversion feature without enabling customer acquisition bidding. This gives you visibility into customer mix without changing bid behavior.

### Account-level settings

Configure account-level customer lifecycle settings first:

| **Setting** | **Purpose** |
|-------------|-------------|
| **New customer value** | Adds incremental conversion value for new customers |
| **High value customer value** | Adds additional value for high-value new customers |
| **Customer audience segments** | Defines who counts as an existing customer |

**Where to configure:** Tools & Settings > Conversions > Customer lifecycle goals

### Campaign-level settings

| **Setting** | **Effect** |
|-------------|------------|
| **Off** | No bid optimization for new customers (tracking still works if enabled) |
| **Bid more for new customers** | Higher bids for users not in your customer list |
| **Only bid for new customers** | Excludes returning customers from bidding entirely |

**Where to configure:** Campaign settings > Customer acquisition

### Recommendations

| **Goal** | **Campaign setting** |
|----------|---------------------|
| Track customer mix only | Off (enable new customer data feature for tracking) |
| Growth with balanced remarketing | Bid more for new customers |
| Pure acquisition (no remarketing) | Only bid for new customers |

> ⚠️ **Start with "Bid more" not "Only bid":** Excluding returning customers entirely removes remarketing conversions, which may hurt overall performance.

> ↪️ **For detailed account-level configuration:** See [Customer Lifecycle Optimization Reference](../references/Customer Lifecycle Optimization Reference.md).

---

## Data exclusions (Your data)

### What it does

Data exclusions prevent PMax from optimizing toward specific audiences. Unlike audience signals (suggestions), exclusions are hard restrictions.

### Common exclusion patterns

| **Goal** | **Exclude** |
|----------|-------------|
| Reduce remarketing share | Website visitors (all) |
| Avoid recent converters | Converters (7-30 days) |
| Focus on new customers | All existing customers |
| Reduce low-value returns | Low-value customer segment |

### When to use

| **Use when** | **Avoid when** |
|--------------|---------------|
| ROAS looks artificially high | You want remarketing to contribute |
| Want to measure true acquisition | Campaign is struggling for volume |
| Testing incrementality | Learning period (first 2-4 weeks) |

### Configuration

1. Campaign settings → Other settings → **Your data exclusions**
2. Click to exclude audiences
3. Select audiences to exclude

> ⚠️ **Don't exclude during learning period:** Let PMax learn first, then add exclusions if needed.

---

## Audience signal configuration

> ⚠️ **Audience signals apply to Full Assets PMax only:** For Feed-Only PMax, your product feed IS your targeting. Do not add audience signals to Feed-Only campaigns.

### Recommendations (Full Assets and Lead Gen/SaaS only)

| **Signal type** | **Recommendation** | **Priority** |
|-----------------|-------------------|--------------|
| Customer Match (customers/SQLs) | Always add | Highest |
| Website converters | Always add | High |
| Website visitors (high-intent) | Add if available | High |
| Custom segments (competitors) | Add 5-10 URLs | Medium |
| Custom segments (search terms) | Add 10-15 terms | Medium |
| In-market audiences | Add 3-5 relevant | Lower |
| Demographics | Usually skip | Lowest |

### Signal quantity

| **Signal type** | **Recommended quantity** |
|-----------------|-------------------------|
| Customer Match lists | 1-3 lists |
| Website audiences | 2-5 audiences |
| Custom segments | 1-3 segments |
| In-market | 3-5 categories |

> ⚠️ **Quality over quantity:** Fewer, stronger signals outperform many weak signals.

> ↪️ **For signal implementation:** See [Audience Signals Reference](../references/Audience Signals Reference.md).

---

## Asset configuration

### Minimum requirements

| **Asset type** | **Minimum** | **Recommended** |
|----------------|-------------|-----------------|
| Headlines | 3 | 5-11 |
| Long headlines | 1 | 2-5 |
| Descriptions | 2 | 4 |
| Images (landscape) | 1 | 3+ |
| Images (square) | 1 | 3+ |
| Logos | 1 | 1-2 |
| Videos | 0 | 1+ |

### Asset quality recommendations

| **Recommendation** | **Why** |
|-------------------|---------|
| Always include video | Auto-generated videos underperform |
| Diversify headlines | Different angles = different audiences |
| Use high-quality images | Poor images hurt all placements |
| Update assets quarterly | Prevents creative fatigue |

> ↪️ **For asset specifications:** See [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md).

---

## Feed-Only configuration (Ecommerce)

### Creating true Feed-Only behavior

> ⚠️ **Feed-Only means ZERO creative assets:** If you add any assets (headlines, images, videos), PMax will serve on other networks than Shopping (e.g., Remarketing on Display). Your product feed IS your creative.

| **Setting** | **Configuration** |
|-------------|------------------|
| Headlines | Do NOT add any |
| Long headlines | Do NOT add any |
| Descriptions | Do NOT add any |
| Images | Do NOT add any |
| Videos | Do NOT add any |
| Logos | Do NOT add any |
| Audience signals | Not needed (your feed is your targeting) |
| Final URL expansion | OFF |
| Listing groups | Configure product subdivisions |

### Listing group structure

| **Approach** | **Attribute** | **When** |
|--------------|---------------|----------|
| All products | — | Starting point |
| By product type | product_type | Category-specific targets |
| By custom label | custom_label_0-4 | Performance segmentation |
| By brand | brand | Brand-specific budgets |

> ↪️ **For Feed-Only setup:** See [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md).

---

## Asset optimization settings

PMax includes several asset optimization features that can enhance or modify your creative automatically.

### Asset optimization dropdown

| **Setting** | **What it does** | **Recommendation** |
|-------------|------------------|-------------------|
| **Text customization** | AI-generated headlines/descriptions from site, landing pages, and ads | OFF (default) or Test with text guidelines configured |
| **Final URL expansion** | Google selects landing pages from your site (requires Text customization ON) | OFF for most campaigns |
| **Image enhancement** | Google enhances or adds images from landing page | OFF (control your creative) |
| **Video enhancement** | Google auto-generates video from images | OFF (auto-generated underperforms) |

**Where to configure:** Campaign settings > Asset optimization

Text guidelines (term exclusions and messaging restrictions) are available when Text Customization is enabled. Configure these first to prevent off-brand messaging. Visual guidelines (brand colors, fonts) apply to image and video enhancement.

> ↪️ **For detailed asset optimization guidance:** See [Asset Optimization Control Guidelines](../guidelines/Asset Optimization Control Guidelines.md).

> 💡 **For Feed-Only:** Keep all asset optimization settings OFF. Your feed is your creative.

---

## Dynamic ads feed

Dynamic ads feed enables personalized creative based on user behavior.

| **Setting** | **When to use** |
|-------------|-----------------|
| **Enable dynamic ads feed** | When you want personalized product ads based on user browsing |
| **Feed selection** | Select the feed to use at campaign level |

**Configuration:** Campaign settings > Dynamic ads feed

---

## Value rules

Value rules allow you to adjust conversion values based on customer attributes.

| **Condition type** | **Example use** |
|-------------------|-----------------|
| **Audience** | Increase value for high-value customer segments |
| **Location** | Increase value for high-margin regions |
| **Device** | Adjust value for device types |

> ⚠️ **Only one rule executes per conversion:** If multiple rules match, only the highest-priority rule applies.

> ⚠️ **We do not recommend using Value rules in most cases:** Value rules add complexity and can interfere with bid strategy learning. Use them only when you have clear, validated reasons for adjusting values by segment.

**Where to configure:** Tools & Settings > Conversions > Value rules

---

## Page feeds

Page feeds let you provide specific URLs for Google to use with Final URL expansion.

### Configuration

| **Level** | **Setting** |
|-----------|-------------|
| **Campaign level** | Select the page feed to use |
| **Asset group level** | Set URL rules to control which pages |

**When to use:** When you want Final URL expansion but need to control which pages Google can use.

---

## Location and language settings

### Location targeting

| **Setting** | **Recommendation** |
|-------------|-------------------|
| Target type | Presence (not "Presence or interest") |
| Locations | Only where you can sell/serve |
| Exclusions | Locations you cannot serve |

### Language targeting

| **Setting** | **Recommendation** |
|-------------|-------------------|
| Languages | All languages your audience speaks |

> 💡 **Use "Presence" for most campaigns.** "Presence or interest" can show ads to users not in your target location.

---

## Negative keywords

### Availability

| **Feature** | **Available** |
|-------------|---------------|
| Campaign-level negatives | Yes |
| Negative keyword lists | Yes |
| Ad group-level negatives | No (no ad groups in PMax) |

### Recommendations

| **Use case** | **Action** |
|--------------|------------|
| Brand protection | Add brand terms as negatives (or use brand exclusions) |
| Irrelevant queries | Add after reviewing search terms report |
| Known wasted spend | Add preemptively if you have Search data |

> 💡 **Brand exclusions are easier than negative keywords for brand protection:** Use the dedicated brand exclusion feature.

> 💡 **You can also exclude irrelevant queries by reviewing the default search term report:** PMax now provides full search term visibility, allowing you to add negatives based on actual query data.

---

## Schedule and budget settings

### Ad schedule

| **Setting** | **Recommendation** |
|-------------|-------------------|
| Default | Run 24/7 |
| Custom schedule | Only if data shows clear patterns |

> 💡 **Don't pre-optimize:** Let PMax learn when conversions happen, then consider schedules if data warrants.

### Budget recommendations

| **Scenario** | **Minimum daily budget** |
|--------------|-------------------------|
| New campaign, testing | €50+ |
| Lead Gen/SaaS | 10x target CPA |
| Ecommerce Feed-Only | Revenue goal / target ROAS |
| Ecommerce Full Assets | €50+ (cross-channel needs more) |

> ↪️ **For detailed bid strategy guidance:** See [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md).

---

## Settings summary table

| **Setting** | **Lead Gen/SaaS** | **Ecommerce Feed-Only** | **Ecommerce Full Assets** |
|-------------|-------------------|------------------------|--------------------------|
| Final URL expansion | OFF or Test | OFF | Test |
| Brand exclusions | Required | Required | Required |
| Customer acquisition | Recommended | Recommended | Recommended |
| Data exclusions | Consider | Consider | Consider |
| Audience signals | Required | Not needed | Recommended |
| Text customization | OFF or Test (with text guidelines) | OFF | OFF or Test (with text guidelines) |
| Headlines | 5-11 | None | 5-11 |
| Descriptions | 4 | None | 4 |
| Video | 1+ (required) | None | 1+ (required) |
| Images | 3+ per format | None | 3+ per format |
| Negative keywords | Add as needed | Add as needed | Add as needed |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Structure decisions |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Structure decisions |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand exclusion implementation |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Signal types and configuration |
| [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md) | Asset specifications |
| [Customer Lifecycle Optimization Reference](../references/Customer Lifecycle Optimization Reference.md) | Customer acquisition settings |
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Ecommerce settings |

---

## Version details

- **Version:** 3.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
