# AI Max for Search Mental Model
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: MENTALMODEL_22
Status: Done
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Category: Strategy
Domain: Search
Pillar: 6

## Purpose

This mental model helps you decide when and how to enable AI Max for Search, understanding both the control trade-offs and the reporting realities that affect how you evaluate performance.

> AI Max can turn focused campaigns into unfocused ones. The features are powerful, but the default configuration cedes significant control to Google. More importantly, AI Max reporting can make performance look better than it actually is. Enable deliberately, configure defensively, and interpret reports skeptically.

---

## What this is / What this is NOT

**This mental model:**

- Explains what AI Max actually is (DSA-style keywordless matching in Search campaigns)
- Reveals the reporting reality: how AI Max attribution can mislead
- Provides the framework for evaluating whether AI Max fits your situation
- Maps the risk profile of each AI Max feature
- Recommends keyword structure to enable accurate performance measurement
- Identifies when to avoid AI Max entirely

**This mental model does NOT:**

- Document the technical mechanics of each feature (See: [AI Max for Search Reference](../references/AI Max for Search Reference.md))
- Provide step-by-step setup instructions (See: SOP: Configure AI Max for Search, planned)
- Cover DSA targeting options and page feeds (See: [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md))
- Explain general match type behavior (See: [Match Type Reference](../references/Match Type Reference.md))

---

## What AI Max actually is

AI Max is not a new campaign type. It is a suite of features added to existing Search campaigns:

| What it is | What it is NOT |
|------------|---------------|
| An add-on to standard Search campaigns | A standalone campaign type like PMax |
| DSA-style keywordless matching built into Search | A replacement for keyword-based targeting |
| Optional features you can toggle individually | An all-or-nothing switch |
| Available in Google Ads web UI | Available in API or Editor (as of early 2026) |

### The three matching layers

With AI Max enabled, your Search campaign can match queries through three mechanisms:

| Layer | How queries match | Your control |
|-------|------------------|--------------|
| **1. Keywords** | Traditional keyword targeting (exact, phrase, broad match) | Full control via keyword selection and match types |
| **2. Asset-based matching** | Google analyzes your headlines, descriptions, and sitelinks to find related queries | Limited: you control which assets exist, but not how Google interprets them |
| **3. Landing page-based matching** | Google crawls your landing pages and matches queries related to page content | Limited: you control which pages are targeted, but not how Google interprets content |

---

## The reporting reality

This is the most important section in this document. AI Max reporting can make performance look better than it actually is because of how attribution works.

### AI Max takes credit for queries you already cover

When AI Max is enabled, it often shows for the same queries your exact match and phrase match keywords already target. When this happens, AI Max gets credit for conversions you would have received anyway through your existing keywords.

| What the report shows | What actually happened |
|----------------------|------------------------|
| "AI Max drove 50 conversions" | AI Max served ads for queries your keywords also match |
| You think AI Max added incremental value | You cannot tell how many conversions were truly new |

> AI Max totals are not incremental gains. They include conversions your existing keywords would have captured without AI Max.

### Without broad match variants, you cannot isolate AI Max performance

If your campaign uses only exact match and phrase match keywords, enabling AI Max creates an attribution problem:

| Setup | Problem |
|-------|---------|
| Exact/phrase keywords only + AI Max enabled | AI Max data gets attributed to your exact/phrase keywords in reports |
| No broad match versions of your keywords | You cannot see how AI Max performs separately from your keywords |

The result: you cannot evaluate whether each match type is performing well because AI Max contaminates the data.

### Match type hierarchy is not reliably respected

Google's standard match type hierarchy (exact > phrase > broad) does not consistently apply with AI Max. Even identical keywords can be attributed differently:

| What should happen | What sometimes happens |
|-------------------|----------------------|
| Search "daycare near me" matches exact match keyword [daycare near me] | AI Max claims the impression instead |
| Your exact match keyword gets credit | A different ad group's AI Max match gets credit |

This makes performance analysis at the keyword level unreliable when AI Max is active.

### Legacy broad match modifier keywords inflate overlap

Legacy broad match modifier (BMM) keywords (retired in 2021) now behave as phrase match but still report as "Broad Match" in the match type column. When AI Max expands these keywords, it looks like significant overlap between AI Max and your existing "broad match" keywords, but the expansion is expected: AI Max is adding genuinely broader matching that these keywords no longer perform on their own.

If you see high AI Max overlap rates with broad match keywords, check whether those keywords are legacy BMM entries before concluding that AI Max is cannibalistic.

### Some search terms have no keyword attribution

With AI Max enabled, some search term report entries show a blank keyword column. These are queries that matched through landing page or asset content without any keyword association. You have no visibility into why your ad served for that query.

---

## Keyword structure decision

AI Max is designed to work with broad match. If you are not already running broad match, do not add broad match keywords just to test AI Max. Instead, follow this sequence:

### Step 1️⃣: Test broad match first (if not already using it)

Before considering AI Max, run a proper broad match experiment:

1. **Create a 50/50 experiment** comparing your current phrase/exact campaign against a broad match variant
2. **Run for 4-6 weeks** with sufficient budget to generate statistically significant data
3. **Evaluate the results:** Does broad match deliver acceptable CPA/ROAS with meaningful volume uplift?

| Experiment outcome | Next step |
|-------------------|-----------|
| Broad match performs well | Continue with broad match, then consider AI Max |
| Broad match performs poorly | Do not enable AI Max: if broad match fails, AI Max will fail harder |

> Do not skip the broad match experiment. Adding broad match keywords solely to enable AI Max testing is backwards. The purpose of broad match is to expand reach profitably: that is the test. AI Max is a further expansion on top of broad match.

### Step 2️⃣: Enable AI Max from a broad match baseline

Once you are running broad match successfully (with or without DSA), AI Max becomes a logical next expansion:

| Starting point | AI Max readiness |
|----------------|------------------|
| Phrase/exact only | Not ready: test broad match first |
| Broad match performing well | Ready: AI Max is incremental expansion |
| Broad match + DSA performing well | Ready: AI Max may replace DSA functionality |

### Isolating AI Max performance

With broad match already in place, you can approximate AI Max's incremental contribution by comparing:

- Pre-AI Max broad match performance (baseline)
- Post-AI Max broad match performance (includes AI Max expansion)

The difference approximates AI Max's contribution, though attribution overlap means this is directional, not precise.

---

## The control trade-off

AI Max includes three core features that expand how your ads match to queries:

| Feature | What it does | Control risk | Reporting risk |
|---------|-------------|--------------|----------------|
| **Search Term Matching** | Matches queries based on landing pages and assets, not just keywords | 🟡 Medium: Expands beyond your keyword list, but stays thematically related | 🔴 High: Attribution overlap with existing keywords |
| **Text Customization** | AI generates headlines and descriptions from your landing page | 🟡 Medium: Generated text may not match your brand voice or make claims you did not authorize | 🟢 Low: Reporting is straightforward |
| **Final URL Expansion** | Sends traffic to dynamically selected landing pages | 🔴 High: Traffic may land on pages you did not intend to advertise | 🟢 Low: Reporting shows which URLs served |

> The fundamental risk: A focused "B2B CRM software" campaign may start bidding on generic terms like "business software" or "productivity tools" found elsewhere on your site. Google presents AI Max as a simple upgrade, but the structural impact is significant.

---

## Search term management reality

### Brand/non-brand bleeding

AI Max brand controls (inclusions and exclusions) have significant limitations:

| Control | What it catches | What it misses |
|---------|-----------------|----------------|
| Brand exclusions | Exact brand name matches | Misspellings, abbreviations, word order variations |
| Brand inclusions | Exact brand name matches | Common misspellings your customers use |

**Implication:** If you need strict brand/non-brand separation, brand controls alone are insufficient.

### Competitor query scaling

Without brand exclusions configured before enabling AI Max, the expanded matching can aggressively scale into competitor brand queries. In observed cases, competitor traffic has become the majority of AI Max impressions for an account.

| Risk | Impact |
|------|--------|
| No brand exclusions set | AI Max matches competitor brand queries because they are semantically related to your products |
| Delayed exclusion setup | Competitor traffic accumulates before you notice, wasting budget |

**Fix:** Configure brand exclusions and add competitor brand names to negative keyword lists before enabling AI Max, not after. Review the search terms report within the first week.

### Negative keyword lists as primary control

Because brand controls are inexact, negative keyword lists become your primary defense:

| Control method | Use for |
|----------------|---------|
| Brand controls | First layer: catch obvious brand queries |
| Negative keyword lists | Second layer: catch variations brand controls miss |
| Ongoing search term review | Third layer: find new variations to add to negatives |

### Ongoing search term hygiene

AI Max requires more search term hygiene than keyword-only campaigns:

| Campaign type | Search term review frequency |
|---------------|------------------------------|
| Exact match only | Monthly or less (queries are predictable) |
| Phrase match | Bi-weekly (some variation) |
| Broad match | Weekly (significant variation) |
| AI Max enabled | Weekly at minimum (unpredictable expansion) |

### Data volume reality

AI Max reporting produces significantly more data than keyword-only campaigns. The search term + headline + landing page combination view can generate tens of thousands of rows in high-volume accounts, making manual review impractical.

For accounts with substantial AI Max traffic, use the `ai_max_search_term_ad_combination_view` GAQL entity (documented in [AI Max for Search Reference](../references/AI Max for Search Reference.md)) to query and filter combinations programmatically via Google Ads scripts or the API.

> ↪️ **For complete brand separation guidance:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

---

## Campaign overlap decision

Your existing campaign setup determines whether AI Max adds value or creates redundancy:

| Your current setup | AI Max recommendation | Why |
|-------------------|----------------------|-----|
| **Full Performance Max (with assets)** | Do not need AI Max | PMax already includes search inventory with AI-driven query matching |
| **Feed-only PMax (Shopping only)** | Choose: DSA OR AI Max | Need complementary Search coverage, pick one approach |
| **Search campaigns without DSA** | Consider AI Max (with caution) | Adds keywordless matching you do not currently have |
| **Search campaigns with DSA** | Evaluate hybrid approach | AI Max can complement or replace DSA depending on your control needs |

---

## Feature-by-feature risk assessment

### 🔴 Final URL Expansion: High risk

| Risk | Impact |
|------|--------|
| Traffic lands on unintended pages | Cart pages, contact pages, blog posts, outdated product pages |
| Breaks RSA pinning | Pinned headlines/descriptions ignored when different URL selected |
| Tracking template issues | Dynamic URLs can cause 404 errors if tracking not configured correctly |

**Recommendation:** Disable unless you have comprehensive URL exclusions in place and your site structure supports any-page advertising.

### 🟡 Text Customization: Medium risk (manageable with text guidelines)

| Risk | Impact |
|------|--------|
| Off-brand messaging | AI-generated text may not match your brand voice |
| Unauthorized claims | AI may highlight edge cases (one clearance item, one review) as general claims |
| Promotional drift | Generated text may emphasize promotions or features you did not intend to highlight |

**Recommendation:** Start with Text Customization OFF. If testing, configure text guidelines first (up to 25 term exclusions and 40 messaging restrictions) to constrain generated output. Text guidelines make this feature more manageable for advertisers who want to experiment. Review the Asset Report regularly and remove generated assets that do not align.

### 🟡 Search Term Matching: Medium risk (attribution + SPN)

| Risk | Impact |
|------|--------|
| Broader query coverage | May surface queries you would not have targeted with keywords |
| Theme drift | Asset-based and landing page-based matching can extend beyond your intended focus |
| Attribution contamination | Makes it difficult to evaluate keyword performance accurately |
| Search Partner Network scaling | AI Max can route a disproportionate share of impressions to Search Partners, where conversion rates are often dramatically lower than Google Search |

**Recommendation:** Most acceptable of the three features for reach expansion. However, without running broad match successfully first, you have no baseline to measure AI Max's true impact. Monitor Search Partner Network performance immediately after enabling: if SPN conversion rates are unacceptable, disable SPN for the campaign (unlike PMax, AI Max campaigns can opt out of SPN).

---

## Control mechanisms

AI Max includes controls that were previously unavailable (or limited) in Search campaigns:

| Control | Level | Purpose | Limitation |
|---------|-------|---------|------------|
| **Search term matching opt-out** | Ad group | Disable expanded query matching for specific ad groups while keeping other AI Max features | Does not affect text customization or final URL expansion |
| **Brand inclusions** | Campaign and ad group | Specify which brands your ads should associate with | Does not catch misspellings or variations |
| **Brand exclusions** | Campaign | Prevent ads from appearing for competitor or irrelevant brand queries | Does not catch misspellings or variations |
| **URL exclusions** | Campaign | Block specific URLs from serving as landing pages (requires Final URL Expansion enabled) | — |
| **URL inclusions** | Ad group | Add specific URLs that Final URL Expansion did not capture (requires Final URL Expansion enabled) | — |
| **Locations of interest** | Ad group | Target users based on geographical intent in keywordless matches | AI Max exclusive |

> These controls are only available when AI Max is enabled. If you want brand exclusions in Search (without PMax), you need AI Max turned on. The ad-group-level controls (search term matching opt-out, brand inclusions, URL inclusions, locations of interest) provide more granular management than was previously available. Supplement brand controls with negative keyword lists for thorough coverage.

---

## AI Max and AI Overviews / AI Mode

AI Max is not required to serve ads in AI Overviews or AI Mode. Broad match keywords, Shopping campaigns, and PMax already serve in those placements without AI Max enabled.

| Claim | Reality |
|-------|---------|
| "You need AI Max to appear in AI Overviews" | Broad match, Shopping, and PMax already serve there |
| "AI Max unlocks AI Mode placements" | AI Mode placements are available to multiple campaign types |
| "Enable AI Max for the new AI placements" | AI Max settings apply to all Search traffic, not just AI-specific placements |

Do not enable AI Max solely to access AI Overview or AI Mode inventory. Evaluate AI Max on its merits as a reach expansion tool, not as a prerequisite for specific placements.

---

## Who should test AI Max

### Good candidates

| Situation | Why AI Max fits |
|-----------|----------------|
| Already running broad match successfully | AI Max extends broad match behavior: logical next expansion. You already accept query unpredictability. |
| Running PMax without assets (feed-only) | Need Search coverage, AI Max provides it without separate DSA campaigns |
| Want access to brand exclusions in Search | Brand controls unlock when AI Max is enabled |
| Hands-off optimization approach | Text Customization generates ads without manual intervention |
| Large site with well-optimized pages | Landing page-based matching benefits from comprehensive, quality page inventory |
| Comfortable with attribution ambiguity | Understand that AI Max reporting is not incremental and can live with it |

### Poor candidates

| Situation | Why AI Max does not fit |
|-----------|------------------------|
| Running phrase/exact match for control | AI Max expands beyond controlled match types, defeating the purpose |
| High lost impression share due to budget + mostly exact/phrase keywords | AI Max may reallocate budget from top-performing keywords to lower-performing expanded queries |
| High-SKU stores needing page feeds | AI Max lacks page feed support that DSA provides |
| Campaigns requiring strict keyword focus | AI Max introduces query expansion you cannot fully control |
| Brand-sensitive messaging requirements | Text Customization may generate off-brand copy |
| Complex tracking template setups | Final URL Expansion may break tracking on dynamic URLs |
| Need accurate match type performance data | AI Max contaminates match type reporting |

### Budget reallocation risk (detailed)

If you have:
- High lost impression share due to budget (campaigns are budget-constrained)
- Mostly exact match and phrase match keywords (optimized for precision)

Then AI Max may hurt performance by:
1. Expanding to broader, lower-intent queries
2. Allocating budget to those lower-performing queries
3. Reducing impression share on your high-performing exact/phrase keywords

In this scenario, AI Max does not add reach. It reallocates budget from proven performers to unproven expansion.

---

## When to avoid AI Max entirely

| Situation | Alternative approach |
|-----------|---------------------|
| High-SKU e-commerce needing page feed control | Use DSA with page feeds |
| Regulated industries with strict ad copy requirements | Use keyword campaigns with manual RSAs |
| Campaigns optimizing for specific landing page experiences | Use keyword campaigns with keyword-level final URLs |
| New accounts without conversion history | Build conversion data with focused keyword campaigns first |
| Phrase/exact match strategy for tight control | Keep current strategy: AI Max contradicts the control intent |
| Need accurate keyword-level performance data | AI Max makes keyword performance analysis unreliable |
| Budget-constrained campaigns with optimized exact/phrase keywords | AI Max may reallocate budget to lower-performing queries |

---

## What you lose vs. DSA

AI Max includes some DSA-like functionality but lacks key DSA features:

| Capability | DSA | AI Max |
|------------|-----|--------|
| Page feeds | Yes | No |
| Content exclusions at scale | Yes | Limited (URL exclusions only) |
| Custom labels for targeting | Yes | No |
| Page content targeting | Yes | Automated only |
| URL targeting rules | Yes | Limited (URL inclusions at ad group level partially close this gap) |
| Separate campaign/ad group structure | Yes | Integrated into Search campaigns |
| Ad group-level brand inclusions | No | Yes |
| Ad group-level location targeting | No | Yes |
| Search Partners opt-out | Yes | Yes |

> If your DSA strategy relies on page feeds or granular content targeting, AI Max is not a direct replacement. However, URL inclusions at the ad group level provide some ability to direct Final URL Expansion toward specific pages, partially closing the gap for accounts with moderate catalog sizes.

### DSA migration outlook

Google has confirmed that the long-term goal is to fold DSA functionality into AI Max. No official sunset date has been announced.

| Current DSA usage | Recommended action |
|-------------------|--------------------|
| DSA with page feeds (high-SKU e-commerce) | Maintain DSA until AI Max adds page feed support. Begin testing AI Max keywordless features in a separate campaign for comparison |
| DSA without page feeds | Test AI Max as a replacement. Run both in parallel for 4-8 weeks, then phase out the lower performer |
| DSA as discovery layer alongside keyword campaigns | AI Max keywordless matching provides equivalent discovery. Test AI Max and evaluate if DSA can be retired |

> For DSA-dependent accounts: activate AI Max keywordless features in Search campaigns rather than migrating DSA ad groups to PMax. This keeps budgets, measurement, and controls within Search.

---

## Key principles

1. **Reporting is not incremental:** AI Max takes credit for queries your existing keywords already cover. Do not assume AI Max "drove" conversions it simply claimed from your existing keyword coverage.

2. **Add broad match variants before enabling:** Without broad match versions of your keywords, you cannot measure AI Max performance separately. Set up proper keyword structure first.

3. **Enable deliberately, configure defensively:** Default AI Max configuration cedes significant control. Disable Final URL Expansion and Text Customization unless you have specific reasons to enable them.

4. **Brand controls are a starting point, not a solution:** Brand inclusions and exclusions do not catch misspellings or variations. Use negative keyword lists as your primary brand/non-brand separator.

5. **AI Max expands broad match:** If you are already comfortable with broad match query expansion and attribution ambiguity, AI Max is a logical next step. If you use phrase/exact for control, AI Max undermines that control.

6. **Budget-constrained campaigns may perform worse:** If you have high lost impression share due to budget and mostly exact/phrase keywords, AI Max may reallocate budget from top performers to lower-performing expansion queries.

7. **AI Max is not PMax:** AI Max adds features to Search campaigns. PMax is a separate campaign type with Search inventory. If you run full PMax with assets, you likely do not need AI Max.

8. **DSA's long-term direction is AI Max:** Google has confirmed the goal of folding DSA functionality into AI Max, though no official sunset date exists. For high-SKU stores or complex targeting needs, DSA remains the better choice until AI Max adds page feed support. Accounts relying on DSA should begin testing AI Max keywordless features to prepare for eventual transition.

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | Technical specs for all AI Max features and settings |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand control limitations and workarounds |
| [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md) | Alternative keywordless targeting approach with page feeds |
| [Match Type Reference](../references/Match Type Reference.md) | How AI Max extends broad match behavior |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Campaign structure context for AI Max placement |
| [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md) | DSA targeting features AI Max lacks |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | When PMax already covers Search inventory (Ecommerce) |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | When PMax already covers Search inventory (Lead Gen/SaaS) |

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
