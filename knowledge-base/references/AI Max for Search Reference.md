# AI Max for Search Reference
Created: 2026-02-04
Updated: 2026-10-05

Support_ID: CHEATSHEET_35
Status: Done
Reference Type: Reference
Agent_Readable: Yes
Human_Facing: Yes
Category: Targeting
Domain: Search
Pillar: 6

## Purpose

Documents the technical mechanics, settings, controls, and reporting for AI Max for Search campaigns: Google's AI-driven targeting and creative suite that adds keywordless matching, text generation, and dynamic landing page selection to standard Search campaigns. An AI Brief (Gemini-powered) lets you steer it with messaging, matching, and audience instructions.

---

## What this reference is / What this is NOT

**This reference:**

- Documents how each AI Max feature works technically
- Explains the settings, controls, and configuration options
- Details the new reporting columns and match type values
- Covers tracking template compatibility requirements
- Lists API and Editor support (fields and resources)

**This reference does NOT:**

- Recommend whether to keep AI Max on (See: [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md))
- Explain strategic trade-offs between AI Max and alternatives (See: [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md))
- Cover general match type mechanics (See: [Match Type Reference](../references/Match Type Reference.md))
- Provide final URL expansion control syntax (See: [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>))

---

## Quick reference: AI Max features

New Search campaigns have AI Max on by default. The table below is therefore the starting configuration of any campaign created without an explicit opt-out, not an opt-in state you have to reach.

| Feature | What it does | Level | Default when AI Max enabled |
|---------|-------------|-------|----------------------------|
| **Search term matching** | Expanded query matching via broad match expansion, asset-based matching, and landing page-based matching | Campaign, with ad group opt-out | On |
| **Text customization** | AI-generated headlines and descriptions based on your landing page, your domain, your current ads, and user intent | Campaign | On |
| **Final URL expansion** | Dynamic landing page selection based on query relevance | Campaign | On |
| **Branded searches** | Campaign-level mode governing whether ads show on brand queries: all relevant searches, controlled (inclusions + exclusions), or unbranded only | Campaign | All relevant searches |
| **Brand inclusions** | Brands your ads may serve on, inside controlled mode. Check existing negative keywords first: negatives matching brand-inclusion terms suppress the traffic the inclusion is meant to capture | Campaign and ad group | Not set |
| **Brand exclusions** | Brands your ads must not serve on, inside controlled mode | Campaign | Not set |
| **URL exclusions** | Exclude URLs from Final URL expansion | Campaign (requires Final URL expansion on) | Not set |
| **URL inclusions** | Define the URL set an ad group may serve as dynamic landing pages: only those URLs with Final URL expansion off, those URLs plus open expansion with it on | Ad group | Not set |
| **Locations of interest** | Reach customers based on geographical intent in keywordless matches | Ad group | Not set |
| **Text guidelines** | Control generated text with term exclusions and messaging restrictions | Campaign | Not set |

> The features are interdependent. Final URL expansion requires Text customization to be enabled. Disabling Text customization automatically disables Final URL expansion.

---

## Search term matching

When AI Max is enabled, your campaign gains expanded query matching beyond your keywords. Search term matching is enabled by default at the campaign level but can be toggled off at the ad group level, allowing you to keep other AI Max features (text customization, final URL expansion) without the expanded query matching in specific ad groups.

### Configuration

| Setting | Level | Options |
|---------|-------|---------|
| Search term matching toggle | Campaign and ad group | On / Off. It must be on at the campaign level to be usable at the ad group level, and each ad group can then turn it off individually |
| Enabled by default | Campaign and ad group | Yes (when AI Max is turned on for the campaign) |

### How it works

AI Max expands your keyword-based targeting using three methods:

| Method | How it works |
|--------|-------------|
| **Broad match expansion** | Expands your existing keywords to broader semantic matches (same as standard broad match behavior) |
| **Asset-based matching** | Uses your ad headlines, descriptions, and sitelinks to identify relevant queries |
| **Landing page-based matching** | Analyzes your landing page content to match queries related to your offerings |

### Interaction with keywords

Search term matching does not replace your keywords. It adds incremental query coverage:

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
| Opt-out | AI Max campaigns can opt out of SPN at the campaign level (PMax can now opt out too) |
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

## Text customization

### What it does

Text customization (formerly called Automatically Created Assets) generates additional headlines and descriptions using:

| Source | How Google uses it |
|--------|-------------------|
| Your existing ad copy | Extracts patterns and messaging from your current headlines and descriptions |
| Landing page content | Pulls text from page titles, H1-H3 tags, meta descriptions, and body content |
| Your domain | Reads other pages on the same domain, not only the ad's final URL |
| Keywords in ad group | Uses keyword themes to generate relevant variations |
| User search query | Tailors generated text to match user intent at impression time |

### Generation methods

| Method | Description |
|--------|-------------|
| **Extractive** | Pulls snippets directly from landing page titles, descriptions, and meta tags |
| **Generative AI** | Creates new text synthesizing landing page content, user signals, and your existing assets |

> With dynamic business information enabled at the account level, AI Max also sources brand logos automatically or generates them with AI from your business information.

### Configuration

| Setting | Level | Options |
|---------|-------|---------|
| Text customization toggle | Campaign | On / Off |
| Enabled by default | Campaign | Yes (when AI Max is turned on) |

### Asset refresh cycle

| Timing | What happens |
|--------|-------------|
| At least every 48 hours | Assets are reviewed and refreshed if landing page content has changed |
| Continuous | Assets are evaluated for performance and replaced if underperforming |

### Quality controls

| Control | Description |
|---------|-------------|
| Asset removal | Any generated asset can be removed individually from the Asset report |
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

Text guidelines sit under Campaign settings > AI Max for Search campaigns > Asset optimization > Text customization. Applying them is owned by [SOP - Configure AI Max for Search](../sops/SOP – Configure AI Max for Search.md), Phase 6.

---

## Final URL expansion

### What it does

Final URL expansion replaces your ad's final URL with a different landing page from your domain when Google predicts it will perform better for a specific query.

| Behavior | Details |
|----------|---------|
| Query relevance | Google selects a landing page whose content matches the user's search intent |
| Ad group theming | Only URLs thematically related to your ad group are eligible |
| Performance prediction | URLs are selected based on predicted conversion performance |

### Configuration

| Setting | Level | Options |
|---------|-------|---------|
| Final URL expansion toggle | Campaign | On / Off |
| Enabled by default | Campaign | Yes (when AI Max is turned on) |
| Dependency | Campaign | Requires Text customization to be On |

### RSA pinning interaction

| Final URL expansion | Pinned RSA assets |
|---------------------|-------------------|
| Off | Served as expected |
| On | Not respected when different URL is selected |

> Pinned assets serve reliably only with Final URL expansion off.

### URL exclusions

URL exclusions are only available when Final URL expansion is enabled. They prevent specific URLs from being selected as landing pages.

| Method | How to use |
|--------|-----------|
| **URLs to exclude** | Add specific URLs directly to the exclusion list |
| **Custom labels in page feeds** | Use custom labels from your page feed to exclude categories of URLs |
| **Rules** | Create pattern-based rules (e.g., URLs containing "/checkout/", "/cart/", "/login/") |

URL exclusions sit under Campaign settings > AI Max for Search campaigns > Asset optimization > Final URL expansion, which must be enabled before the exclusion list is reachable. Applying them is owned by [SOP - Configure AI Max for Search](../sops/SOP – Configure AI Max for Search.md), Phase 5.1.

> URL exclusions have no effect if Final URL expansion is disabled, because Google only uses your specified Final URL.

### URL inclusions

URL inclusions specify, at the ad group level, the exact set of URLs Google may serve as dynamic landing pages for that ad group. They are a scoping control, not a way to fill gaps Final URL expansion missed. Their behavior depends on whether Final URL expansion is also on.
| Final URL expansion | What serves for the ad group |
|---------------------|------------------------------|
| Off | Only your specified URLs serve as dynamic landing pages (this includes the advertiser-provided final URLs in your RSAs), so delivery is limited to that chosen set of pages. |
| On | Your specified URLs plus any other URL Google predicts will perform. Inclusions steer expansion toward your set without limiting it. |

| Setting | Details |
|---------|---------|
| Level | Ad group |
| Dependency | Requires text customization (asset optimization) on and search term matching on for the ad group. Does NOT require Final URL expansion on |
| Purpose | Scope which pages an ad group serves: constrain delivery to a chosen set (expansion off) or steer open expansion (expansion on) |

Three toggles govern inclusions, and the distinction matters.
| Toggle | Required for inclusions? |
|--------|--------------------------|
| Text customization (asset optimization) | Yes, to add them. The UI blocks adding inclusions without it: "Turn on asset optimization in AI Max to add URL inclusions" |
| Search term matching | Yes, to serve them. With it off for the ad group, the dynamic ad targets stay "Eligible, Pending" and never activate. Search term matching's keywordless arm is what matches queries to your included pages |
| Final URL expansion | No. With it off, inclusions restrict the ad group to only your URLs |

Because text customization is a campaign-level setting and is mandatory for inclusions, you cannot run a keywordless inclusion ad group while keeping text customization off elsewhere in that campaign. To keep text customization off your keyword ad groups, run the keywordless inclusions in a separate campaign. Inclusions are ignored entirely if AI Max is turned off.

> 💡 **Keywordless ad group (the legacy "dynamic ad group" replacement).** An ad group with no keywords and only URL inclusions, in a campaign with Final URL expansion off, serves keywordlessly on exactly those URLs. This is the native replacement for the legacy Dynamic Search Ads dynamic ad group, with URL inclusions acting as the dynamic ad targets. Google's DSA-to-AI-Max upgrade does this conversion automatically: dynamic ad groups become standard ad groups and Dynamic Search Ads become RSAs. Text customization must be on, since it is required for inclusions and generates the page-matched headlines (the role the legacy DSA auto-headline played). Search term matching must also be on for the ad group, since it is what matches queries to the included pages: with it off, the dynamic ad targets stay Pending. Unlike a legacy DSA target, a URL inclusion does not self-target.

> When URL inclusions are active and a more relevant included URL is chosen, pinned RSA assets are not used (same behavior as Final URL expansion).

---

## Locations of interest

Locations of interest is an AI Max exclusive feature that allows you to reach customers based on their geographical intent in keywordless matches at the ad group level.

| Setting | Details |
|---------|---------|
| Level | Ad group |
| Purpose | Target users based on geographical intent signals even when matches come from keywordless targeting |
| Distinction | This is separate from campaign-level location targeting settings |

This control is only available in AI Max campaigns. Standard Search campaigns do not have ad-group-level location intent targeting.

---

## Brand Controls

Brand control in AI Max lives in one campaign-level setting: **Branded searches** (Campaign settings > AI Max for Search campaigns > Branded searches). It governs whether your ads show on searches that contain brand names. Pick one of three modes.

| Mode | What it does | Ads serve on | Ads do NOT serve on |
|------|-------------|--------------|---------------------|
| **Show ads on all relevant searches** | Maximum reach, no brand control (default) | Your brand, competitor and supplier brands, generic terms related to your products or keywords | Nothing is held back |
| **Control branded searches with brand inclusions and exclusions** | Precise control through the inclusion and exclusion lists below | Brands in your included lists (unless also excluded), generic terms combined with an included brand | Brands in your excluded lists, brands not in your included lists, generic terms without an included brand |
| **Show ads only on unbranded searches** | Generic searches only, avoiding every brand Google knows | Generic terms related to your products or keywords | Your brand, competitor and supplier brands, any other brand known to Google |

> ⚠️ **"All relevant searches" is the default, and it chases competitor brands.** In this mode AI Max serves on competitor and supplier brand queries because they are semantically related to your products. The other two modes are the only way that traffic is held back.

### Brand inclusions and exclusions (controlled mode)

Brand inclusions and exclusions are the two lists inside "Control branded searches with brand inclusions and exclusions". They have no effect in the other two modes.

| List | Level | Purpose |
|------|-------|---------|
| Brand inclusions | Campaign and ad group | Only show your ads for searches that include the listed brands. Ad group level allows finer control over which ad groups target specific brand queries |
| Brand exclusions | Campaign | Do not show your ads for searches that include the listed brands (competitor or irrelevant brands) |

> ⚠️ **Exclusion wins over inclusion.** If you both include and exclude the same brand, only the exclusion applies.

### Where the setting lives

Branded searches sits under Campaign settings > AI Max for Search campaigns > Branded searches. Brand lists themselves live under Tools > Shared library > Brand lists. Selecting the mode and populating the lists is owned by [SOP - Configure AI Max for Search](../sops/SOP – Configure AI Max for Search.md), Phase 4.

### Limitations

Brand controls match exact brand names but do not account for variations:

| Limitation | Impact | Workaround |
|------------|--------|------------|
| Misspellings not caught | Brand queries with typos (e.g., "Nikee" for "Nike") may serve in non-brand campaigns or bypass exclusions | Use negative keyword lists including common misspellings |
| Abbreviations not caught | Shortened brand names (e.g., "MS" for "Microsoft") bypass brand filters | Add abbreviations to negative keyword lists |
| Word order variations | Different word arrangements (e.g., "Ads Google" vs. "Google Ads") may bypass filters | Build comprehensive negative keyword lists covering variations |

Brand controls therefore act as a first layer only. Strict brand and non-brand separation rests on negative keyword lists, which catch the variations the brand matcher does not.

> ↪️ **For complete brand separation guidance:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

---

## Reporting

### Where each feature reports

| Feature | Primary report surfaces |
|---------|-------------------------|
| Search term matching | Keywords report ("Total: AI Max expanded matches" and "Total: AI Max landing page matches" rows), search terms report with the Source column and Match type "AI Max", the "Search terms and ad combinations" view |
| Text customization | Campaign and ad level asset reports ("Google AI" in the Added by column), headlines shown in the AI Max search terms view |
| Final URL expansion | Landing pages report ("Selected by" column), "Expanded final URL assets" tab, "Total: AI Max landing page matches" keywords report row |
| Brand controls | Brand lists managed under Tools > Shared library > Brand lists, applied in the AI Max settings panel at campaign or ad group level |
| URL inclusions and exclusions | Managed in the URL inclusions and URL exclusions tabs on the Keywords page. Exclusions can also be added directly from the landing pages report |

### Search Terms Report

New columns and values for AI Max:

| Column | AI Max value | Meaning |
|--------|-------------|---------|
| Match type | "AI Max" | Query matched through AI Max search term matching (either arm) |
| Source | "AI Max expanded matches" | Query came from the broad match expansion arm (your keywords expanded to broad match behavior) |
| Source | "Landing pages and URL inclusions" | Query came from the keywordless arm (landing page and asset-based matching, scoped by URL inclusions where set) |
| Keyword | Source keyword in match type notation, or blank | Expanded matches show the keyword they were expanded from (for example "[stalen deuren online]"), enabling per-keyword de-duplication. Keywordless rows leave the column blank |
| Headline | (displayed) | The headline served for this search term |
| URL | (displayed) | The landing page served for this search term |

> The Source labels mirror the keywords report totals naming ("Total: AI Max expanded matches"), and these exact values are what an export filter matches on.

**Dedicated views:** The Search terms report has a "Search terms and ad combinations" tab for AI Max (plus equivalent Dynamic Search Ads views). The AI Max view shows the full customer journey (search term + headline + landing page + campaign + ad group), defaults to the landing page cut with a toggle in the top right corner, and supports direct exclusion actions: check a row and select **Add as negative keyword** or **Add as negative URL**. This view is the easier path for the AI Max export. Filtering the standard view on Match type = "AI Max" still works.

> When filtering by match type = "AI Max", the report may show lower numbers because this filter does not include "Other search terms" aggregated data.

**Data volume:** The AI Max search term + headline + landing page combination view can produce very large datasets in high-volume accounts, tens of thousands of rows after filtering, which puts an account with significant AI Max traffic beyond manual review.

**GAQL access:** The `ai_max_search_term_ad_combination_view` report entity enables querying AI Max search term, headline, and landing page combinations programmatically via Google Ads scripts or the API.

### Known reporting behaviors

AI Max reporting has several behaviors that affect how you interpret performance data:

| Behavior | What happens | Implication |
|----------|--------------|-------------|
| Credit attribution overlap | AI Max claims queries your keywords would otherwise have matched | AI Max totals do not represent incremental gains: some conversions would have occurred through existing keywords |
| Tier 1 is wider than tier 2 | Google's published hierarchy has four tiers: an exact match keyword that matches the query with its close variants included, then phrase/broad keywords (including AI Max keywords) identical to the query tied with identical PMax search themes, then AI-based ad group relevance, then Ad Rank. Queries outside both tiers, including synonyms and paraphrases, fall to the last two tiers (See: [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md)) | The close variants your phrase and broad keywords used to absorb can be claimed by AI Max, including from a different ad group. The tiers describe eligibility, reports still show double-claiming in practice |
| Keywordless attribution | Some search term report entries show a blank keyword column | Cannot trace why your ad served for that query: no keyword association exists |

### Isolating AI Max performance

Two properties of AI Max make its reported totals non-incremental: the expansion arms claim queries the existing keywords would also have matched, and a campaign running AI Max carries no off state to compare against. A broad match baseline plus a 50/50 experiment removes both. The measurement procedure is owned by [SOP - Configure AI Max for Search](../sops/SOP – Configure AI Max for Search.md), Phase 7.2.

**The broad match baseline.** With broad keywords in place, the broad match expansion arm has minimal room to expand, so AI Max search term rows are almost purely the keywordless arm and stay interpretable. Exact or phrase duplicates of the same broad keywords do not produce a readable match type comparison, and keyword duplication across match types is never the structure (See: [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md)).

**The AI Max experiment type.** It splits traffic and budget 50/50 inside the existing campaign, and no duplicate campaign is created:

| Arm | Configuration |
|-----|---------------|
| Control | Half of the campaign's traffic, AI Max off |
| Trial | The other half, AI Max on (search term matching and asset optimization activate by default) |

Over a 6-8 week run, the difference between arms is AI Max's contribution, reported with experiment statistics (See: [Experiment Configuration Reference](../references/Experiment Configuration Reference.md)). One layer per experiment keeps the measured difference to a single cause, and the starting state decides which layer is isolable:

| Starting point | What an experiment can isolate from here |
|----------------|------------------------------------------|
| AI Max fully off | Search term matching alone, by disabling asset optimization in the trial arm so the arms differ only in the matching layer. Final URL expansion becomes isolable in a follow-up experiment once matching is proven |
| New campaign, AI Max on with search term matching, text customization, and final URL expansion on underneath it | Nothing, because no off arm exists to measure against. The fully off starting point above is reachable only by turning AI Max off first |
| AI Max already on for a keywordless URL-inclusion ad group | Only layers outside the inclusion dependency, since asset optimization has to stay on in both arms for the inclusions to serve. A custom experiment carries the single layer under test, such as search term matching on the keyword ad groups |

**The pre/post fallback.** Where budget, volume, or account constraints rule out an experiment, pre-AI Max broad match performance compared against post-AI Max performance is directional, not precise: seasonality and attribution overlap both sit inside the difference.

**De-duplication for incrementality (advanced).** Outside an experiment, incremental value is approximated by removing the overlap between the two exports:

1. Export the AI Max search terms (the dedicated "Search terms and ad combinations" view is the easiest export, filtering the standard report to match type "AI Max" also works)
2. Export the search terms with Source "Keyword" (all queries your keywords matched)
3. Identify overlapping search terms (query strings appearing in both exports)
4. Subtract overlapping conversions from the AI Max total
5. Remaining AI Max conversions approximate true incremental value

> ⚠️ **Source is the reliable filter, not the match type column.** In the search terms report the Match type column shows how the query related to the keyword, not the keyword's configured match type: a broad match keyword matched by its exact text appears as "Exact match", and a query containing it appears as "Phrase match". Source "Keyword" is the reliable filter for keyword-matched traffic.

Overlap exists because non-identical queries fall to AI relevance and Ad Rank: the same query can be claimed by AI Max in one auction and matched by your keyword in another. On a broad match baseline expect modest overlap (AI Max rows are mostly keywordless). If exact or phrase keywords are still running (for example mid-migration), the overlap concentrates on queries attributed to them: the Keyword column in both exports shows which keyword is involved.

> This de-duplication is manual spreadsheet work. Most advertisers skip it and accept that AI Max reporting is directional, not precise.

### Keywords Report

New summary rows at the bottom of the report:

| Row | What it shows |
|-----|---------------|
| **Total: AI Max expanded matches** | Traffic from your keywords expanded to broad match behavior by AI Max (mostly exact and phrase keywords, per the match type distribution above) |
| **Total: AI Max landing page matches** | Traffic from queries matched via landing pages or assets (keywordless) |

### Asset Reports

Generated assets are marked "Google AI" in the "Added by" column across the asset reports. This labeling is the audit trail for what Text customization actually wrote:

| Report | What it shows |
|--------|---------------|
| Campaign level, "Expanded final URL assets" tab | Asset and URL combinations that served through Final URL expansion, both advertiser-uploaded and Text customization assets |
| Campaign level, Associations and Performance tabs | Asset performance across one or more campaigns, generated assets marked "Google AI" in "Added by" |
| Ad level asset report | Every headline and description in an ad, including generated ones, marked "Google AI" in "Added by" |

An asset's status appears in the first column, where a green circle means enabled. The status icon carries the Remove action for individual generated assets.

> ⚠️ **Asset removal is campaign-wide, not per-URL.** The report lists asset and URL combinations, but removing an asset removes it from every ad group and every expanded URL in the campaign. There is no per-URL asset pruning, so a page that needs different copy needs its own campaign.

> Removing Google customized text assets in bulk is not possible in the Google Ads UI. Bulk removal is available through the Google Ads API and Google Ads Editor.

### Landing Pages Report

| Column | Value | Meaning |
|--------|-------|---------|
| Selected by | "AI Max" | Landing page was selected by Final URL expansion |
| Selected by | "Advertiser" | Landing page is the advertiser-provided final URL |

---

## Ads in AI Overviews

Ads can serve above, below, or within AI Overviews on Search.

| Placement | Eligibility |
|-----------|-------------|
| Above or below the AI Overview | Existing text, Shopping, local, and app ads from Search, Shopping, PMax, and App campaigns |
| Within the AI Overview | Text and Shopping ads from Search, Shopping, and PMax campaigns using broad match or keywordless targeting (AI Max, PMax, Shopping, DSA) |

Mechanics that shape interpretation:

- Matching for within-placement uses the user query AND the content of the AI Overview, so the ad is matched against generated text you never see
- There is no opt-out from serving in AI Overviews
- There is no segmented reporting for the placement, so its performance lands unattributed in campaign-level numbers
- Ads within AI Overviews are reported as Top Ads

> ⚠️ **Eligibility is not a reason to change match-type strategy.** The placement cannot be measured, tested, or excluded. See the stance in [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md).

---

## AI Max vs. PMax vs. Broad Match

AI Max inherits foundational technology from existing products but adds exclusive features. This table compares capabilities across the three main expansion mechanisms:

| Capability | AI Max | PMax | Broad Match |
|------------|--------|------|-------------|
| Broad match keyword targeting | Yes | Yes | Yes |
| Keywordless landing page-based targeting | Yes | Yes | No |
| Keywordless asset-based targeting | Yes | Yes | No |
| Text customization (AI-generated text) | Yes | Yes | Yes |
| Text guidelines | Yes | Yes | Yes |
| Page feeds (final URL expansion) | Yes | No | N/A |
| Ad group-level brand inclusions | Yes | No | No |
| Ad group-level location settings | Yes | No | No |
| URL inclusions (ad group) | Yes | No | No |
| Search Partners opt-out | Yes | Yes | Yes |
| Search term + landing page combined view | Yes | Yes | No |
| Search term match source column | Yes | Yes | No |

> AI Max exclusive features (ad group-level brand inclusions, location settings, URL inclusions, and page feeds for final URL expansion) provide granular controls not available in other campaign types. Page feeds let final URL expansion be constrained at catalog scale, the control that previously required a separate keywordless format.

---

## Existing settings upgrade

Campaigns that have enabled text customization, brand settings, or the broad match campaign setting before adopting AI Max will see these settings absorbed into the AI Max panel. After AI Max is activated, these features are managed through AI Max settings.

| Pre-existing setting | After AI Max activation |
|---------------------|------------------------|
| Text customization (automatically created assets) | Upgraded into AI Max |
| Brand settings | Upgraded into AI Max (managed as the Branded searches control) |
| Broad match campaign setting | Upgraded into AI Max |

### Automatic upgrade triggers

Google auto-upgrades campaigns to AI Max on its own announced schedule. Three configurations put a campaign in scope:

| Trigger | What is auto-upgraded |
|---------|----------------------|
| Campaign-level broad match setting in use | The campaign |
| Text customization (formerly automatically created assets) in use | The campaign |
| Dynamic Search Ads in use | The campaign |

> ⚠️ **The campaign-level broad match setting is itself an auto-upgrade trigger.** Changing match type on the keywords themselves migrates a campaign to broad match without entering the upgrade queue. The campaign-level setting carries the AI Max auto-upgrade with it.

> ⚠️ **Broad keywords lose exact match priority when a campaign moves from the campaign-level broad match setting to AI Max.** Under the campaign-level setting, broad keywords rank as exact match in keyword prioritization. Under AI Max they rank as broad match. Add exact match copies only for the terms where routing between campaigns matters: brand terms and top head terms. Everywhere else the no-duplication policy in [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) holds.

> Google has not confirmed whether the auto-upgrade is a no-op for campaigns that already run AI Max features, or whether it also re-enables features and opt-outs the advertiser set differently. Treat campaigns already on AI Max as in scope for the audit until Google clarifies.

---

## Tracking template compatibility

### The problem

AI Max's Final URL expansion substitutes your advertiser-provided URL with dynamic landing pages. If your tracking template is not configured correctly, this can cause 404 errors.

### Required tracking template patterns

These `{lpurl}` tag patterns are AI Max compatible:

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

Verifying the template against a dynamic URL before Final URL expansion goes live is owned by [SOP - Configure AI Max for Search](../sops/SOP – Configure AI Max for Search.md), Phase 7.1.

---

## API and Editor support

AI Max for Search is available in both Google Ads Editor (all features) and the Google Ads API (v24 and later).

| Setting | API field or resource | Level |
|---------|-----------------------|-------|
| Enable AI Max | `enable_ai_max` (on `Campaign.AiMaxSetting`) | Campaign |
| Bundling dependency (output only) | `bundling_required` (on `Campaign.AiMaxSetting`) | Campaign |
| Search term matching opt-out | `disable_search_term_matching` (on `AdGroup.AiMaxAdGroupSetting`) | Ad group |
| Text customization and final URL expansion | Campaign asset automation settings | Campaign |
| Text guidelines | Campaign text guidelines | Campaign |
| URL inclusions | Ad group webpage criteria via `AdGroupCriterion` (the API has no direct "inclusion list" field, unlike the UI) | Ad group |
| Search term, headline, and landing page reporting | `ai_max_search_term_ad_combination_view` | Report |

The API reference states the search term matching default plainly: it "is enabled by default when AI Max is enabled, and can be disabled at the ad group level" (`disable_search_term_matching`). That makes search term matching the one AI Max feature toggled at the ad group level via the API.

> 💡 **Bundling rule.** `bundling_required` (output only) signals whether a campaign must have AI Max enabled to serve or change text asset automation and brand list targeting. A value of `REQUIRED` means those features now depend on AI Max being on, the API view of text customization and brand settings being absorbed into AI Max. This is why toggling AI Max on or off affects campaigns that manage text customization or brand settings.

---

## Learning period

After enabling AI Max, and after turning it off to reach the fully off starting point:

| Period | Recommendation |
|--------|---------------|
| First 2 weeks | Avoid making changes (adding negative keywords, adjusting settings) |
| Purpose | Allow Google Ads to learn and optimize |
| After learning | Review reports and optimize based on performance data |
| After turning AI Max off | The same 2 weeks apply. Turning AI Max off is a change like any other, so the off state does not read as a clean baseline until learning settles |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Strategic framework for whether to keep AI Max on |
| [Match Type Reference](../references/Match Type Reference.md) | How AI Max extends broad match behavior |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | The four-tier query routing hierarchy across Search, AI Max, and PMax |
| [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>) | How to control final URL expansion |
| [AI Max Keywordless Configuration Catalog](../catalogs/AI Max Keywordless Configuration Catalog.md) | The keywordless configuration options built from these settings |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand control matrix and negative keyword pairing |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Campaign structure context for AI Max placement |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | The AI Max experiment type used to isolate contribution |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Broad match migration and the no-duplication policy |

---

## Version details

- **Version:** 16.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
