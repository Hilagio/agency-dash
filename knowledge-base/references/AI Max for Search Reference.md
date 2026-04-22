# AI Max for Search Reference
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: CHEATSHEET_35
Status: Done
Reference Type: Reference
Agent_Readable: Yes
Human_Facing: Yes
Category: Targeting
Domain: Search
Pillar: 6

## Purpose

Documents the technical mechanics, settings, controls, and reporting for AI Max for Search campaigns: Google's AI-driven targeting and creative suite that adds DSA-style keywordless matching, text generation, and dynamic landing page selection to standard Search campaigns.

---

## What this reference is / What this is NOT

**This reference:**

- Documents how each AI Max feature works technically
- Explains the settings, controls, and configuration options
- Details the new reporting columns and match type values
- Covers tracking template compatibility requirements
- Lists API and Editor limitations

**This reference does NOT:**

- Recommend whether or when to enable AI Max (See: [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md))
- Explain strategic trade-offs between AI Max and alternatives (See: [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md))
- Cover general match type mechanics (See: [Match Type Reference](../references/Match Type Reference.md))
- Provide DSA-specific targeting syntax (See: [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md))

---

## Quick reference: AI Max features

| Feature | What it does | Level | Default when AI Max enabled |
|---------|-------------|-------|----------------------------|
| **Search Term Matching** | Expanded query matching via broad match expansion, asset-based matching, and landing page-based matching | Ad group | On |
| **Text Customization** | AI-generated headlines and descriptions based on landing page and user intent | Campaign | On |
| **Final URL Expansion** | Dynamic landing page selection based on query relevance | Campaign | On |
| **Brand Inclusions** | Specify brands to associate your ads with | Campaign and ad group | Not set |
| **Brand Exclusions** | Prevent ads from appearing alongside specific brands | Campaign | Not set |
| **URL Exclusions** | Exclude URLs from Final URL Expansion | Campaign (requires Final URL Expansion on) | Not set |
| **URL Inclusions** | Include additional URLs not captured by Final URL Expansion | Ad group (requires Final URL Expansion on) | Not set |
| **Locations of Interest** | Reach customers based on geographical intent in keywordless matches | Ad group | Not set |
| **Text Guidelines** | Control generated text with term exclusions and messaging restrictions | Campaign | Not set |

> The features are interdependent. Final URL Expansion requires Text Customization to be enabled. Disabling Text Customization automatically disables Final URL Expansion.

---

## Search Term Matching

When AI Max is enabled, your campaign gains expanded query matching beyond your keywords. Search term matching is enabled by default at the campaign level but can be toggled off at the ad group level, allowing you to keep other AI Max features (text customization, final URL expansion) without the expanded query matching in specific ad groups.

### Configuration

| Setting | Level | Options |
|---------|-------|---------|
| Search term matching toggle | Ad group | On / Off |
| Enabled by default | Ad group | Yes (when AI Max is turned on for the campaign) |

### How it works

AI Max expands your keyword-based targeting using three methods:

| Method | How it works |
|--------|-------------|
| **Broad match expansion** | Expands your existing keywords to broader semantic matches (same as standard broad match behavior) |
| **Asset-based matching** | Uses your ad headlines, descriptions, and sitelinks to identify relevant queries |
| **Landing page-based matching** | Analyzes your landing page content to match queries related to your offerings |

### Interaction with keywords

Search Term Matching does not replace your keywords. It adds incremental query coverage:

| Query type | Source |
|------------|--------|
| Queries matching your keywords | Served via keywords (standard matching hierarchy applies) |
| Queries related to your assets but not matching keywords | Served via asset-based matching |
| Queries related to your landing pages but not matching keywords | Served via landing page-based matching |

### Search Partner Network interaction

AI Max expansion traffic can scale significantly into the Search Partner Network (SPN). SPN traffic volume and conversion rates are often substantially different from Google Search traffic.

| Behavior | Details |
|----------|---------|
| SPN scaling | AI Max expansion can route a disproportionate share of impressions to Search Partners |
| Performance difference | SPN conversion rates are typically lower than Google Search |
| Opt-out | AI Max campaigns can opt out of SPN (unlike PMax) |
| Reporting | SPN performance is visible via network segmentation in campaign reports |

### Match type distribution

AI Max does not expand all match types equally. Observed distribution across campaigns:

| Keyword match type | AI Max expansion share | Why |
|-------------------|----------------------|-----|
| Exact match keywords | ~80% of expansion | Exact match keywords have the most room for broader matching |
| Phrase match keywords | ~20% of expansion | Phrase match already covers some variations |
| Broad match keywords | Minimal (<1%) | Already matching broadly, little incremental expansion possible |

The keywordless matching arm (asset-based and landing page-based) and the broad match expansion arm contribute roughly equally to overall AI Max traffic.

> This distribution explains why accounts running primarily exact match keywords see the largest volume uplift from AI Max: there is more room to expand.

---

## Text Customization

### What it does

Text Customization (formerly called Automatically Created Assets) generates additional headlines and descriptions using:

| Source | How Google uses it |
|--------|-------------------|
| Your existing ad copy | Extracts patterns and messaging from your current headlines and descriptions |
| Landing page content | Pulls text from page titles, H1-H3 tags, meta descriptions, and body content |
| Keywords in ad group | Uses keyword themes to generate relevant variations |
| User search query | Tailors generated text to match user intent at impression time |

### Generation methods

| Method | Description |
|--------|-------------|
| **Extractive** | Pulls snippets directly from landing page titles, descriptions, and meta tags |
| **Generative AI** | Creates new text synthesizing landing page content, user signals, and your existing assets |

### Configuration

| Setting | Level | Options |
|---------|-------|---------|
| Text Customization toggle | Campaign | On / Off |
| Enabled by default | Campaign | Yes (when AI Max is turned on) |

### Asset refresh cycle

| Timing | What happens |
|--------|-------------|
| At least every 48 hours | Assets are reviewed and refreshed if landing page content has changed |
| Continuous | Assets are evaluated for performance and replaced if underperforming |

### Quality controls

| Control | Description |
|---------|-------------|
| Asset removal | Remove any generated asset from the Asset report that does not align with your brand |
| Performance filter | Google-customized assets only serve if predicted to perform better than your uploaded assets |
| Policy compliance | Generated assets are checked against Google Ads policies |

### Text guidelines

Text guidelines provide control over what AI-generated assets can and cannot say.

| Guideline type | Limit | Purpose |
|----------------|-------|---------|
| **Term exclusions** | Up to 25 words/phrases | Exclude specific words or phrases from generated text |
| **Messaging restrictions** | Up to 40 restrictions | Prevent specific concepts, topics, or messaging approaches |

**Example messaging restrictions:**
- Do not mention competitor names
- Do not include specific prices
- Do not use promotional language like "best" or "cheapest"
- Avoid mentioning discontinued products
- Do not reference specific locations

**Setup:**
1. Campaign Settings > AI Max > Text Customization
2. Click **Text guidelines**
3. Add term exclusions and/or messaging restrictions
4. Save

---

## Final URL Expansion

### What it does

Final URL Expansion replaces your ad's final URL with a different landing page from your domain when Google predicts it will perform better for a specific query.

| Behavior | Details |
|----------|---------|
| Query relevance | Google selects a landing page whose content matches the user's search intent |
| Ad group theming | Only URLs thematically related to your ad group are eligible |
| Performance prediction | URLs are selected based on predicted conversion performance |

### Configuration

| Setting | Level | Options |
|---------|-------|---------|
| Final URL Expansion toggle | Campaign | On / Off |
| Enabled by default | Campaign | Yes (when AI Max is turned on) |
| Dependency | Campaign | Requires Text Customization to be On |

### RSA pinning interaction

| Final URL Expansion | Pinned RSA assets |
|---------------------|-------------------|
| Off | Served as expected |
| On | Not respected when different URL is selected |

> If you require pinned assets to always serve, disable Final URL Expansion.

### URL Exclusions

URL exclusions are only available when Final URL Expansion is enabled. They prevent specific URLs from being selected as landing pages.

| Method | How to use |
|--------|-----------|
| **URLs to exclude** | Add specific URLs directly to the exclusion list |
| **Custom labels in page feeds** | Use custom labels from your page feed to exclude categories of URLs |
| **Rules** | Create pattern-based rules (e.g., URLs containing "/checkout/", "/cart/", "/login/") |

**Setup:**
1. Campaign Settings > AI Max > Final URL Expansion (must be enabled)
2. Click **Add URL exclusions**
3. Choose method: URLs tab, Custom labels tab, or Rules tab
4. Add exclusions
5. Apply and Save

> URL exclusions have no effect if Final URL Expansion is disabled, because Google only uses your specified Final URL.

### URL Inclusions

URL inclusions allow you to add specific URLs that Final URL Expansion did not capture on its own. They are configured at the ad group level.

| Setting | Details |
|---------|---------|
| Level | Ad group |
| Dependency | Requires Final URL Expansion to be enabled |
| Purpose | Include additional landing pages that FUE missed or has not yet discovered |

> When URL inclusions are active and a more relevant included URL is chosen, pinned RSA assets are not used (same behavior as Final URL Expansion).

---

## Locations of Interest

Locations of Interest is an AI Max exclusive feature that allows you to reach customers based on their geographical intent in keywordless matches at the ad group level.

| Setting | Details |
|---------|---------|
| Level | Ad group |
| Purpose | Target users based on geographical intent signals even when matches come from keywordless targeting |
| Distinction | This is separate from campaign-level location targeting settings |

This control is only available in AI Max campaigns. Standard Search campaigns do not have ad-group-level location intent targeting.

---

## Brand Controls

### Brand Inclusions

Specify brands to associate your ads with. Brand inclusions can be set at both campaign and ad group level, allowing finer control over which ad groups target specific brand queries.

| Setting | Level | Purpose |
|---------|-------|---------|
| Brand inclusions | Campaign and ad group | Define which brand-related queries your ads should match |

### Brand Exclusions

Prevent ads from appearing for queries associated with specific brands. Brand exclusions are campaign-level only.

| Setting | Level | Purpose |
|---------|-------|---------|
| Brand exclusions | Campaign | Block queries related to competitor brands or irrelevant brands |

### Setup

1. Campaign Settings > AI Max > Brand settings
2. Add brand inclusions (campaign level, or ad group level for finer control)
3. Add brand exclusions (campaign level)
4. Save

### Limitations

Brand controls match exact brand names but do not account for variations:

| Limitation | Impact | Workaround |
|------------|--------|------------|
| Misspellings not caught | Brand queries with typos (e.g., "Nikee" for "Nike") may serve in non-brand campaigns or bypass exclusions | Use negative keyword lists including common misspellings |
| Abbreviations not caught | Shortened brand names (e.g., "MS" for "Microsoft") bypass brand filters | Add abbreviations to negative keyword lists |
| Word order variations | Different word arrangements (e.g., "Ads Google" vs. "Google Ads") may bypass filters | Build comprehensive negative keyword lists covering variations |

**Recommendation:** Treat brand controls as the first layer of defense, not the complete solution. Use negative keyword lists as the primary mechanism for strict brand/non-brand separation.

> ↪️ **For complete brand separation guidance:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

---

## Reporting

### Search Terms Report

New columns and values for AI Max:

| Column | AI Max value | Meaning |
|--------|-------------|---------|
| Match type | "AI Max" | Query matched through AI Max's keywordless targeting |
| Source | "Broad match expansion" | Query came from broad match keyword expansion |
| Source | "Keywordless matching" | Query came from asset-based or landing page-based matching |
| Headline | (displayed) | The headline served for this search term |
| URL | (displayed) | The landing page served for this search term |

**New view:** Select "Search terms and landing pages from AI Max" from the Search terms dropdown to see the full customer journey (search term + headline + landing page + campaign + ad group).

> When filtering by match type = "AI Max", the report may show lower numbers because this filter does not include "Other search terms" aggregated data.

**Data volume:** The AI Max search term + headline + landing page combination view can produce very large datasets in high-volume accounts (tens of thousands of rows after filtering). Plan for script-based analysis rather than manual review for accounts with significant AI Max traffic.

**GAQL access:** The `ai_max_search_term_ad_combination_view` report entity enables querying AI Max search term, headline, and landing page combinations programmatically via Google Ads scripts or the API.

### Known reporting behaviors

AI Max reporting has several behaviors that affect how you interpret performance data:

| Behavior | What happens | Implication |
|----------|--------------|-------------|
| Credit attribution overlap | AI Max claims impressions for queries your exact match and phrase match keywords also match | AI Max totals do not represent incremental gains: some conversions would have occurred through existing keywords |
| Match type hierarchy inconsistency | Standard match type priority (exact > phrase > broad) is not always respected | Exact match keywords may lose impressions to AI Max even for identical queries |
| Keywordless attribution | Some search term report entries show a blank keyword column | Cannot trace why your ad served for that query: no keyword association exists |

### Isolating AI Max performance

To evaluate AI Max impact accurately, set up your keyword structure before enabling AI Max:

**Step 1️⃣: Add broad match variants**

Before enabling AI Max, add broad match versions of all your exact match and phrase match keywords to the same ad groups.

| Before | After |
|--------|-------|
| [daycare near me] (exact) | [daycare near me] (exact) |
| "daycare services" (phrase) | "daycare services" (phrase) |
| — | daycare near me (broad) |
| — | daycare services (broad) |

**Step 2️⃣: Enable AI Max**

After broad match variants are in place, enable AI Max.

**Step 3️⃣: Compare performance**

With this structure, you can compare:

| Metric comparison | What it tells you |
|-------------------|-------------------|
| Exact/phrase performance vs. broad performance | Broad includes AI Max expansion: difference approximates AI Max contribution |
| Conversion rate by match type | Whether AI Max expansion converts at lower rates |
| CPA by match type | Whether AI Max queries are more expensive to convert |

**Step 4️⃣: De-duplicate for true incrementality (advanced)**

For precise incrementality measurement:

1. Export search term report filtered to AI Max match type
2. Export search term report filtered to exact and phrase match types
3. Identify overlapping search terms (queries appearing in both exports)
4. Subtract overlapping conversions from AI Max total
5. Remaining AI Max conversions approximate true incremental value

> This de-duplication is manual spreadsheet work. Most advertisers skip it and accept that AI Max reporting is directional, not precise.

### Keywords Report

New summary rows at the bottom of the report:

| Row | What it shows |
|-----|---------------|
| **Total: AI Max expanded matches** | Traffic from broad match keywords expanded by AI Max |
| **Total: AI Max landing page matches** | Traffic from queries matched via landing pages or assets (keywordless) |

### Asset Report

The "Expanded final URL assets" tab shows:

| Column | Value | Meaning |
|--------|-------|---------|
| Source | "Automatically created" | Asset was generated by Text Customization |
| Status | Green circle | Asset is enabled |
| Status | (other) | Click to remove assets that do not align with your brand |

### Landing Pages Report

| Column | Value | Meaning |
|--------|-------|---------|
| Selected by | "AI Max" | Landing page was selected by Final URL Expansion |
| Selected by | "Advertiser" | Landing page is the advertiser-provided final URL |

---

## AI Max vs. PMax vs. DSA vs. Broad Match

AI Max inherits foundational technology from existing products but adds exclusive features. This table compares capabilities across the four main expansion mechanisms:

| Capability | AI Max | PMax | DSA | Broad Match |
|------------|--------|------|-----|-------------|
| Broad match keyword targeting | Yes | Yes | Yes | Yes |
| Keywordless landing page-based targeting | Yes | Yes | Yes | No |
| Keywordless asset-based targeting | Yes | Yes | No | No |
| Text customization (AI-generated text) | Yes | Yes | Yes | Yes |
| Text guidelines | Yes | Yes | Yes | Yes |
| Page feeds | No | No | Yes | N/A |
| Ad group-level brand inclusions | Yes | No | No | No |
| Ad group-level location settings | Yes | No | No | No |
| URL inclusions (ad group) | Yes | No | No | No |
| Search Partners opt-out | Yes | No | Yes | Yes |
| Search term + landing page combined view | Yes | Yes | No | No |
| Search term match source column | Yes | Yes | Yes | No |

> AI Max exclusive features (ad group-level brand inclusions, location settings, URL inclusions) provide granular controls not available in other campaign types.

---

## Existing settings upgrade

Campaigns that have enabled text customization, brand settings, or the broad match campaign setting before adopting AI Max will see these settings absorbed into the AI Max panel. After AI Max is activated, these features are managed through AI Max settings.

| Pre-existing setting | After AI Max activation |
|---------------------|------------------------|
| Text customization (automatically created assets) | Upgraded into AI Max |
| Brand settings | Upgraded into AI Max |
| Broad match campaign setting | Upgraded into AI Max |

---

## Tracking template compatibility

### The problem

AI Max's Final URL Expansion substitutes your advertiser-provided URL with dynamic landing pages. If your tracking template is not configured correctly, this can cause 404 errors.

### Required tracking template patterns

For AI Max compatibility, use these `{lpurl}` tag patterns:

| Pattern | When to use |
|---------|-------------|
| `{lpurl}?` | When tracking parameters follow the landing page |
| `{lpurl}&` | When appending to existing parameters |
| `{lpurl}#` | When using anchor/fragment tracking |
| `{lpurl}` | When no additional tracking parameters are needed |

### Patterns that cause issues

| Pattern | Problem |
|---------|---------|
| Static URL (e.g., `https://www.domain.com/`) | Users directed to static URL instead of dynamic landing page |
| Non-standard `{lpurl}` usage (e.g., `foo={lpurl}value`) | 404 errors on dynamic landing pages |

### Verification

Before enabling AI Max with Final URL Expansion:

1. Test your tracking template with a sample dynamic URL from your site
2. Verify the landing page loads correctly with tracking parameters applied
3. Check your analytics platform receives the tracking data

---

## API and Editor limitations

| Tool | Limitation |
|------|-----------|
| Google Ads API | AI Max settings not yet available |
| Google Ads Editor | AI Max settings not yet available |
| Impact | Activating or deactivating AI Max in the web UI may cause API errors for campaigns managing text customization or brand settings |

> Inform your team before enabling or disabling AI Max if you manage campaigns via API or Editor.

---

## Learning period

After enabling AI Max:

| Period | Recommendation |
|--------|---------------|
| First 2 weeks | Avoid making changes (adding negative keywords, adjusting settings) |
| Purpose | Allow Google Ads to learn and optimize |
| After learning | Review reports and optimize based on performance data |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Strategic framework for when to enable AI Max |
| [Match Type Reference](../references/Match Type Reference.md) | How AI Max extends broad match behavior |
| [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md) | Alternative keywordless targeting approach |
| [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md) | DSA targeting specs (AI Max lacks page feeds) |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Campaign structure context for AI Max placement |

---

## Version details

- **Version:** 4.0
- **Last Updated:** March 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
