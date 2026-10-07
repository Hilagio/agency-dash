# PMax Configuration Guidelines
Created: 2026-02-04
Updated: 2026-10-05

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

## What this is / What this is NOT

**This guideline:**

- Sets the recommended state for each PMax campaign setting, per vertical
- States the exception conditions that change each default
- Defines the asset minimums an asset group launches with
- Separates Feed-Only configuration from Full Assets configuration

This guideline does **not:**

- Explain PMax structure decisions (See: [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) or [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>))
- Provide step-by-step setup (See: [SOP – Launch PMax for Lead Gen/SaaS](<../sops/SOP – Launch PMax for Lead Gen-SaaS.md>), [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md), [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md))
- List all available settings (See: [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) for Ecommerce)
- Explain audience signal types (See: [Audience Signals Reference](../references/Audience Signals Reference.md))

---

## Quick reference: Key settings

| **Setting** | **Recommended** | **Why** |
|-------------|-----------------|---------|
| Final URL expansion | OFF by default | Control landing page destination |
| Brand exclusions | ON | Prevent brand cannibalization |
| Network selection (SPN + Display) | Leave ON, monitor | Full inventory to optimize across: exclude only on wild underperformance |
| Customer acquisition | Recommended | Optimize bidding for new customers |
| Audience signals | Add | Improve targeting efficiency |
| Audience exclusions | Conditional | Control remarketing mix, on the conditions in Audience exclusions |

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

> 💡 **Turning Final URL expansion off is what stops the campaign using unexpected URLs.** Text customization also generates image assets sourced from your landing pages, so Text customization and Landing page images both stay off to prevent unwanted auto-generated text and image assets. Setting changes take 24-48 hours to fully reflect.

---

## Brand exclusions

### Why mandatory

Brand exclusions prevent PMax from capturing your cheap brand traffic, which:
- Inflates PMax performance metrics
- Cannibalizes your Brand Search campaign
- Hides true acquisition costs

### Configuration

**Where to configure:** Settings > Other settings > Brand exclusions

The brand list carries your brand name or names, plus every common misspelling of them.

### What to exclude

| **Include** | **Example** |
|-------------|-------------|
| Primary brand name | "PPC Mastery" |
| Full company name | "PPC Mastery B.V." |
| Product names (if branded) | "Scaling OS" |
| Common misspellings | "ppcmastery" |

### Brand exclusion limitations (brand/non-brand bleeding)

PMax brand exclusions match exact brand names but do not catch variations:

| **Limitation** | **Impact** | **Workaround** |
|----------------|------------|----------------|
| Misspellings not caught | Brand queries with typos serve in non-brand PMax | Add common misspellings to negative keyword lists |
| Abbreviations not caught | Shortened brand names bypass exclusions | Add abbreviations to negative keyword lists |
| Word order variations | Different word arrangements bypass filters | Build comprehensive negative keyword lists |

**Recommendation:** Treat brand exclusions as the first layer of defense. Use negative keyword lists as your primary mechanism for strict brand/non-brand separation.

> ↪️ **For complete brand separation:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

---

## Network settings

PMax serves across all Google surfaces. Two of them, the Search Partner Network and the Google Display Network, are selectable at the campaign level: both are on by default and can be excluded.

### Recommendation

| **Network** | **Setting** | **Why** |
|-------------|-------------|---------|
| Search Partner Network | Leave on, monitor | Gives PMax full search inventory to optimize across |
| Display Network | Leave on, monitor | Gives PMax full display inventory to optimize across |

Leave both on so the campaign has the full inventory to find conversions, then watch the channel split in reporting. Exclude a single network only when its performance is wildly out of line (high spend, near-zero conversions, unacceptable CPA/ROAS) and stays that way.

> ⚠️ **Do not disable networks pre-emptively:** Excluding Display or Search Partners narrows where PMax can convert. Use it as a targeted fix for a wildly underperforming network, not a default setup step.

> ↪️ **For network selection across all campaign types:** See [Network Selection Reference](../references/Network Selection Reference.md).

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

**Where to configure:** Goals > Summary > Customer lifecycle optimization

### Campaign-level settings

| **Setting** | **Effect** |
|-------------|------------|
| **Off** | No bid optimization for new customers (tracking still works if enabled) |
| **Bid higher for new customers** | Higher bids for users not in your customer list |
| **Only bid for new customers** | Excludes returning customers from bidding entirely |

**Where to configure:** Campaign settings > Customer acquisition

### Recommendations

| **Goal** | **Campaign setting** |
|----------|---------------------|
| Track customer mix only | Off (enable new customer data feature for tracking) |
| Growth with balanced remarketing | Bid higher for new customers |
| Pure acquisition (no remarketing) | Only bid for new customers |

> ⚠️ **Start with "Bid more" not "Only bid":** Excluding returning customers entirely removes remarketing conversions, which may hurt overall performance.

> ↪️ **For detailed account-level configuration:** See [Customer Lifecycle Optimization Reference](../references/Customer Lifecycle Optimization Reference.md).

---

## Audience exclusions (Your data)

### What it does

Audience segment exclusions stop PMax from serving to the excluded users. Unlike audience signals, which are suggestions, exclusions are hard delivery restrictions.

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

**Where to configure:** Campaign settings > Other settings > Your data exclusions

> ⚠️ **Don't exclude during the learning period:** Let PMax learn first, then add exclusions on the conditions above.

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
| Demographics | Skip | Lowest |

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

Each asset group accepts up to 15 videos per orientation (horizontal, square, and vertical: minimum 1, maximum 15 each).

### Asset quality recommendations

| **Recommendation** | **Why** |
|-------------------|---------|
| Always include video | Auto-generated videos underperform |
| Diversify headlines | Different angles = different audiences |
| Use high-quality images | Poor images hurt all placements |
| Update assets quarterly | Prevents creative fatigue |

### Ad Strength

> ⚠️ **Ignore the Ad Strength score.** It is a completeness rating, not a performance signal. Fill asset slots for serving eligibility with your own assets, and judge creative by asset-level performance data.

> ⚠️ **AI-content disclosure labels.** AI regulations in the European Union, India, and New York require disclosures or labels on ads with certain AI-generated or AI-edited assets. Google Ads provides an AI label setting for this. If your image or video assets are AI-generated or AI-edited, account for these labels. Google's own automatically enhanced images sit inside the same disclosure scope, so a campaign running image enhancement is in scope even when every asset you uploaded is your own. Keep labels clear of the very corners and edges of a creative: Google gives no guarantee that a label survives cropping or trimming. Using the label setting does not by itself guarantee compliance.

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
| All products | None | Starting point |
| By product type | product_type | Category-specific targets |
| By custom label | custom_label_0-4 | Performance segmentation |
| By brand | brand | Brand-specific budgets |

> 💡 **Depth ceiling:** Google Ads allows 20,000 listing groups. Segmentation depth is bounded by conversion volume per group long before it is bounded by this ceiling.

> ↪️ **For Feed-Only setup:** See [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md).

---

## Asset optimization settings

PMax includes several asset optimization features that can enhance or modify your creative automatically.

### Asset optimization dropdown

| **Setting** | **What it does** | **Recommendation** |
|-------------|------------------|-------------------|
| **Text customization** | AI-generated headlines/descriptions from site, landing pages, and ads | OFF (default). Turn on only when the configuration requires it (Final URL expansion) or reach is deliberately chosen, with text guidelines configured before launch |
| **Final URL expansion** | Google selects landing pages from your site (requires Text customization ON) | OFF for most campaigns |
| **Image enhancement** | Google resizes images, adds or removes text and logos, and adds subtle motion | OFF (control your creative) |
| **Landing page images** | Google pulls images from your website into your ads | OFF (control your creative) |
| **Video enhancement** | Google resizes and shortens uploaded videos and adds voice-overs | OFF (control your creative) |

**Where to configure:** Campaign settings > Asset optimization

Text guidelines are available when Text customization is enabled. A campaign with Text customization on and no text guidelines is not launch-ready: configure them before launch, every time. Visual guidelines apply to image and video enhancement. The limits and the full control list live in [Asset Optimization Control Guidelines](../guidelines/Asset Optimization Control Guidelines.md).

> ⚠️ **Text customization reads the ads you already wrote.** It sources from your site, your landing pages, and the ads currently running in the campaign. Your own copy becomes raw material for variants you did not write and cannot review before they serve. Treat that as a reason to leave the setting off rather than a reassurance: the better your ad copy, the better the seed for headlines Google writes in your name.

> ⚠️ **AI enrichment happens by default, beyond these toggles.** For campaigns with a Merchant Center feed, Google may use content from your landing page, images, feed, and other signals, including content created by Google AI, to enrich your ads. Opting out is only possible via a support request to your account manager or Google support, processed in 3-5 business days. Know that this default exists: use the assets labeled as created by Google AI in the asset reports as the audit trail for what enrichment wrote, and steer the output with text guidelines.

> ↪️ **For detailed asset optimization guidance:** See [Asset Optimization Control Guidelines](../guidelines/Asset Optimization Control Guidelines.md).

> 💡 **For Feed-Only:** Keep all asset optimization settings OFF. Your feed is your creative. The AI enrichment default above still applies to feed-based ads, so review the asset reports for Google AI content even on Feed-Only campaigns.

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

> ⚠️ **Value rules stay OFF by default:** Value rules add complexity and interfere with bid strategy learning. Use them only when you have a validated, business-specific reason for adjusting values by segment. See [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md).

**Where to configure:** Goals > Conversions > Value rules

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

The language setting applies to the YouTube, Display, Discover and Gmail portions of the campaign. It does not apply to the Search portion, where matching runs on the language of the ad creative and the landing page instead. Write creative and landing pages in the language you intend to reach: on the Search side that is the only language control you hold.

> 💡 **Use "Presence".** "Presence or interest" shows ads to users who are not in your target location.

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

> 💡 **The search term report is the other source of negatives:** PMax provides full search term visibility, so negatives come from actual query data.

---

## Schedule and budget settings

### Ad schedule

| **Setting** | **Recommendation** |
|-------------|-------------------|
| Default | Run 24/7 |
| Custom schedule | Only if data shows clear patterns |

> 💡 **Don't pre-optimize:** Let PMax learn when conversions happen, then add a custom schedule only when the data shows a clear pattern.

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
| Network selection (SPN + Display) | Leave on, monitor | Leave on, monitor | Leave on, monitor |
| Customer acquisition | Recommended | Recommended | Recommended |
| Audience exclusions | Consider | Consider | Consider |
| Audience signals | Required | Not needed | Recommended |
| Text customization | OFF or Test (text guidelines mandatory before launch) | OFF | OFF or Test (text guidelines mandatory before launch) |
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
| [Asset Optimization Control Guidelines](../guidelines/Asset Optimization Control Guidelines.md) | Owns the asset optimization and text guideline limits |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Owns the conversion value rules stance |

---

## Version details

- **Version:** 7.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
