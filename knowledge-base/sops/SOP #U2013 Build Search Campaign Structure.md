# SOP – Build Search Campaign Structure
Created: 2026-02-04
Updated: 2026-02-15

Agent_Executable: No
Category: Structure
Domain: Search
Human_Approval_Required: Yes
Pillar: 6
Primary Outcome: Complete Search campaign structure uploaded to Google Ads, ready for launch
SOP_ID: SOP_42
Secondary Outcomes: Clean ad group architecture, correct match type assignments, validated keyword-to-landing-page mapping
Status: Done

### Purpose

This SOP takes your clustered keywords and transforms them into a fully built Search campaign structure inside Google Ads, including campaigns, ad groups, keyword assignments, match types, landing pages, and campaign settings.

> ❓ **The big question:** How do I turn my keyword clusters into a properly structured Search campaign that is ready to launch?

---

### What this SOP is NOT

This SOP does **not:**

- Decide how many campaigns you need or why to segment (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Determine ad group logic or the Single Ad Test framework (See: [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md))
- Research or cluster keywords (See: [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md))
- Write ad copy or RSAs (See: [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md))
- Configure conversion tracking (upstream prerequisite)
- Select a bidding strategy from scratch (See: [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))

### When to run this SOP

Run this SOP when:

- You have completed keyword research and clustering and are ready to build the campaign
- You are rebuilding a Search campaign structure from scratch
- You are expanding into a new product/service area that requires new campaigns

---

### Before you start

#### Required inputs

- Completed keyword clusters with intent labels (from [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md))
- Landing page URLs mapped to keyword clusters
- Conversion tracking configured and validated
- Defined campaign goals and KPIs (from [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md))
- Unit economics calculated (from [SOP – Calculate and Validate Unit Economics](../sops/SOP – Calculate and Validate Unit Economics.md))
- Bid strategy selected (from [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md))
- Budget allocation determined (from [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md))

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | 8 valid segmentation reasons for campaign splits |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Single Ad Test, creative theme logic |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Consolidation-first approach, broad match + Smart Bidding framework |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Match type defaults and exception rules |
| [Search Campaign Settings Guidelines](../guidelines/Search Campaign Settings Guidelines.md) | Campaign-level settings configuration |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Bidding strategy context |
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Budget distribution logic |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Map clusters to campaigns** | Determine which clusters share a campaign and which need separation | Campaign map with cluster assignments |
| **Phase 2️⃣: Create ad groups by creative theme** | Group keywords by creative theme within each campaign | Ad group list with names and keyword assignments |
| **Phase 3️⃣: Assign keywords and match types** | Add keywords to ad groups with correct match types | Complete keyword list with match types per ad group |
| **Phase 4️⃣: Set landing pages** | Assign Final URLs to each ad group or keyword | Landing page mapping document |
| **Phase 5️⃣: Upload via Google Ads Editor** | Build the full structure in Editor and post to Google Ads | Campaigns, ad groups, and keywords live in Google Ads |
| **Phase 6️⃣: Configure campaign settings** | Apply all campaign-level settings | Fully configured campaigns ready for launch |

---

## Phase 1️⃣: Map clusters to campaigns

### 1.1 Review your keyword clusters

Open your completed keyword clusters from the upstream clustering SOP. For each cluster, confirm:

1. The cluster has a clear intent label (brand, competitor, generic high-intent, generic low-intent, etc.)
2. The cluster has an assigned landing page
3. The cluster has enough keywords to justify its existence (minimum 5 keywords)

### 1.2 Apply the default: consolidate

Start with the assumption that all non-brand clusters belong in a single campaign. This is the default because:

- Smart Bidding bids at the query level, not the campaign level
- More data per campaign means faster learning and better optimization
- Fewer campaigns means lower management overhead

### 1.3 Check the 8 valid segmentation reasons

Open the [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) and review each cluster against the 8 valid reasons for campaign separation.

For each cluster, ask: does this cluster require a different...

| Segmentation reason | If YES: separate campaign | If NO: keep consolidated |
|---------------------|--------------------------|--------------------------|
| Budget | This cluster needs its own daily/monthly spend cap | Same budget pool is fine |
| Bid strategy | This cluster needs a different optimization objective | Same bid strategy applies |
| Bid target | This cluster needs a different tCPA or tROAS | Same target applies |
| Conversion goal | This cluster optimizes toward a different conversion action | Same conversion goal applies |
| Geographic targeting | This cluster targets a different location set | Same geo targeting applies |
| Ad schedule | This cluster needs a different day/time schedule | Same schedule applies |
| Network settings | This cluster needs Search Partners on/off differently | Same network settings apply |
| Brand vs. non-brand | This cluster contains brand keywords | This cluster contains non-brand keywords |

> ⚠️ **Brand keywords always get their own campaign:** This is non-negotiable. Brand traffic behaves differently from non-brand traffic in conversion rates, CPCs, and intent.

### 1.4 Document your campaign map

Create a campaign map listing each campaign and its assigned clusters:

| Campaign name | Clusters included | Segmentation reason | Bid strategy | Daily budget |
|---------------|-------------------|---------------------|--------------|--------------|
| NL_NL_Search_Brand | Brand cluster(s) | Brand separation | | |
| NL_NL_Search_NB_CRM | Generic clusters 1, 2, 3 | Default (consolidated) | | |
| BE_FR_Search_NB_CRM | Clusters for specific geo | Different geo targeting | | |

> ↪️ **See [Campaign Naming Convention Reference](../references/Campaign Naming Convention Reference.md)** for the full naming convention structure: `[Country]_[Language]_[CampaignType]_[Theme]_[Modifier]`.

Leave bid strategy and budget columns for now. You will fill them in Phase 6.

> 💡 **Fewer campaigns is better:** If you cannot articulate a specific segmentation reason from the list above, keep the clusters in one campaign.

---

## Phase 2️⃣: Create ad groups by creative theme

### 2.1 Apply the Single Ad Test

For each campaign, take its assigned keyword clusters and group them into ad groups using the Single Ad Test from the [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md).

For each proposed ad group, ask: **Can one RSA with one set of headlines and descriptions serve all keywords in this group?**

- If YES: keep them in one ad group
- If NO: split into separate ad groups by creative theme

### 2.2 Name your ad groups

Use a clear, descriptive naming convention:

**Pattern:** `[Intent/Theme] - [Modifier]`

| Example | What it tells you |
|---------|-------------------|
| Running Shoes - Generic | Generic running shoes terms |
| Trail Running | Trail-specific terms |
| Nike Running Shoes | Competitor brand + product terms |
| Free Shipping Running | Promo-intent terms |

Rules for naming:

1. Name reflects the creative theme, not just a keyword
2. Keep names under 60 characters
3. No special characters except hyphens and spaces

### 2.3 Validate ad group count per campaign

Use these guidelines to check your ad group count. These are not hard rules but signals to double-check your structure:

- **Typical range:** 5-25 ad groups per campaign
- **If over 25:** review whether some ad groups can be consolidated (re-run the Single Ad Test with broader creative themes)
- **If over 40:** consider splitting into separate campaigns with a documented segmentation reason

> 💡 **There are no hard rules for keyword count per ad group either:** Use the keyword count as a signal: if an ad group has 50+ keywords, it may contain multiple creative themes that need splitting. If it has 1-2 keywords, consider merging with a related ad group. The Single Ad Test is the deciding factor, not an arbitrary count.

### 2.4 Document your ad group map

| Campaign | Ad group name | Creative theme | Keyword count | Landing page |
|----------|---------------|----------------|---------------|--------------|
| | | | | |

---

## Phase 3️⃣: Assign keywords and match types

### 3.1 Add keywords to ad groups

For each ad group, add the keywords from the corresponding cluster(s):

1. Open your keyword clusters
2. Copy keywords into the assigned ad group
3. Verify no keyword appears in more than one ad group within the same campaign

> ⚠️ **Duplicate keywords across ad groups in the same campaign cause internal competition:** Check for duplicates before proceeding.

### 3.2 Select match types

Open the [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) and apply the match type for each keyword.

**Default rule:** Use broad match when running tCPA or tROAS bidding AND the account has sufficient conversion history. Broad match + Smart Bidding is the modern default for established accounts.

Apply match type based on account maturity and data:

| Condition | Match type | Rationale |
|-----------|-----------|-----------|
| Established account + tCPA/tROAS + 30+ conversions/month | Broad match | Default: smart bidding has enough data to control broad match effectively |
| New account (no conversion history) | Exact and/or phrase match | Smart bidding has no query-level data to learn from. Broad match generates waste. Test broad later via 50/50 campaign experiment |
| Low-volume campaign (<30 conversions/month) | Exact and/or phrase match | Insufficient data for smart bidding to optimize broad match. Concentrate spend on known high-intent queries |
| Limited budget | Exact and/or phrase match | Control traffic relevance and temperature. Broad match is viable when budget increases or data proves efficiency |
| Niche B2B with predictable keywords | Exact and/or phrase match | Query space is narrow enough to cover manually. Broad match produces mostly irrelevant queries with low incremental uplift |
| Brand keywords | Phrase and/or exact match | Protect brand terms. Broad match is unnecessary for brand campaigns: use phrase/exact only |
| Proven keywords with strong performance history | Keep current match type | Do not change what is working |

### 3.3 Create and link negative keyword lists

Build the shared negative keyword list infrastructure and link lists to campaigns. Use shared lists (not campaign-level negatives) as the default. Only add campaign-level negatives when specific queries need campaign-specific blocking.

**Step 1️⃣: Create required lists**

In Google Ads, navigate to Tools > Shared Library > Negative keyword lists. Create these three lists:

| List name | Purpose |
|-----------|---------|
| `Irrelevant Keywords` | Terms completely unrelated to your business (populated from keyword research rejects + ongoing STR review) |
| `Poor Performing Keywords` | Terms with data-proven poor performance (populated later via N-gram analysis) |
| `Branded Keywords` | Your own brand terms, for exclusion from non-brand campaigns |

**Step 2️⃣: Create optional lists**

| List name | When to create | Purpose |
|-----------|----------------|---------|
| `Competitors` | When not bidding on competitor terms | Keeps competitor exclusions separate for easy unlinking if you test competitor campaigns later |
| `Spam Prevention` | When your industry attracts spam traffic | Explicit, torrent, coupon terms |

**Step 3️⃣: Populate initial negatives from keyword research**

1. Open your keyword research output from [SOP – Research Keywords](../sops/SOP – Research Keywords.md).
2. Pull every keyword marked as irrelevant (red-coded) during research.
3. Review the [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) for your vertical and add any category patterns that apply but were not captured during keyword research.
4. Format all negatives: lowercase, no special characters. Use broad match (no symbols) for single-word terms, phrase match (wrap in quotes) for multi-word patterns.
5. Add formatted negatives to the appropriate lists (most will go to the Irrelevant Keywords list).
6. Populate the Branded Keywords list with all brand name variations, including common misspellings.
7. Leave the Poor Performing Keywords list empty. It gets populated from N-gram analysis after the campaign has data.

> ⚠️ **Negatives do not match close variants:** Add singular, plural, and misspelling variants manually for each negative keyword.

**Step 4️⃣: Link lists to campaigns**

| List | Link to | Do not link to |
|------|---------|----------------|
| Irrelevant Keywords | All search campaigns, all shopping campaigns, all PMax campaigns | N/A |
| Poor Performing Keywords | All search campaigns, all shopping campaigns, all PMax campaigns | N/A |
| Branded Keywords | Non-brand search campaigns only | Brand campaigns |
| Competitors | All campaigns (unless running competitor campaigns) | Competitor-targeting campaigns |
| Spam Prevention | All campaigns | N/A |

Verify: confirm brand campaigns do NOT have the Branded Keywords list linked.

**Step 5️⃣: Ad group-level negatives**

1. Block cross-pollination between ad groups only when needed (prevent ad group A's keywords from triggering ad group B's ads).
2. **Brand campaign:** Use phrase and/or exact match only for your brand keywords. This naturally restricts queries to brand terms without needing generic negatives. Add campaign-level negatives only if irrelevant generic queries come through despite phrase/exact match.

### 3.4 Validate keyword assignments

For each ad group, confirm:

- [ ] All keywords match the creative theme of the ad group
- [ ] Match types follow the Guidelines
- [ ] No duplicate keywords exist across ad groups in the same campaign
- [ ] Negative keywords are in place for cross-pollination prevention
- [ ] Brand campaign has negative keywords blocking generic terms

---

## Phase 4️⃣: Set landing pages

### 4.1 Assign Final URLs

For each ad group, set the landing page URL:

1. Use the landing page mapped during keyword clustering
2. Set the Final URL at the **ad level** (default) or at the **keyword level** if different keywords within the same ad group need different pages

| Approach | When to use |
|----------|-------------|
| Ad-level Final URL | All keywords in the ad group point to the same page (default) |
| Keyword-level Final URL | Keywords within the same ad group need different landing pages |

### 4.2 Validate landing pages

For each assigned URL, confirm:

- [ ] The page loads without errors (HTTP 200)
- [ ] The page is relevant to the keywords in the ad group
- [ ] The page contains the primary keyword or close variant in the H1 or above-the-fold content
- [ ] The page matches the offer referenced in the ad copy
- [ ] Mobile version loads correctly and is usable

> ⚠️ **Do not send traffic to a homepage unless the campaign is brand-only:** Every non-brand ad group needs a dedicated landing page that matches the search intent.

---

## Phase 5️⃣: Upload via Google Ads Editor

### 5.1 Download the account

1. Open Google Ads Editor
2. Download the latest account data (Accounts > Download Recent Changes)
3. Confirm the download completes without errors

### 5.2 Create campaigns

For each campaign in your campaign map:

1. Click **Add Campaign** > Search
2. Set the campaign name per your campaign map
3. Leave settings at defaults for now (you will configure them in Phase 6)

### 5.3 Create ad groups

For each ad group in your ad group map:

1. Select the parent campaign
2. Click **Add Ad Group**
3. Enter the ad group name from your ad group map
4. Set the default bid (placeholder: use €1.00 if using Smart Bidding, as the algorithm overrides this)

### 5.4 Add keywords

For each ad group:

1. Select the ad group
2. Click **Add Keyword**
3. Paste keywords with match type notation:
   - Broad match: `keyword` (no modifiers)
   - Phrase match: `"keyword"`
   - Exact match: `[keyword]`
4. Set keyword-level Final URLs if applicable (from Phase 4)

### 5.5 Add negative keywords

1. Add campaign-level negatives: select campaign > Negative Keywords > Add
2. Add ad group-level negatives: select ad group > Negative Keywords > Add

### 5.6 Post changes

1. Click **Check Changes** to validate the upload
2. Review and resolve any errors or warnings
3. Click **Post** to push changes to Google Ads
4. Verify the post completes successfully

> 💡 **Save a backup before posting:** In Google Ads Editor: File > Export > Export Whole Account. This gives you a rollback point.

---

## Phase 6️⃣: Configure campaign settings

### 6.1 Apply campaign settings

Open the [Search Campaign Settings Guidelines](../guidelines/Search Campaign Settings Guidelines.md) and configure each campaign.

For each campaign, set:

| Setting | Action |
|---------|--------|
| Networks | Disable Search Partners and Display Network (unless Guidelines specify otherwise) |
| Locations | Set target locations per campaign map. Start with "Presence or interest" (default), restrict to "Presence only" based on location report data. |
| Languages | Set to the language(s) of your target audience |
| Ad schedule | Set to "All day" unless a specific schedule is required per your campaign map |
| Ad rotation | Set to "Optimize: prefer best performing ads" |
| Start/end dates | Set start date to your planned launch date. No end date unless running a time-bound promotion. |

### 6.2 Set bidding strategy

For each campaign, apply the bid strategy selected in [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md):

1. Navigate to campaign settings > Bidding
2. Select the bid strategy
3. Set the target (tCPA or tROAS) per your bid strategy documentation
4. Confirm the campaign is using the correct conversion goal(s)

### 6.3 Set budget

For each campaign, apply the budget from [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md):

1. Navigate to campaign settings > Budget
2. Enter the daily budget
3. Confirm the budget aligns with your allocation plan

### 6.4 Configure DSA settings (if applicable)

If using Dynamic Search Ads within any campaign:

1. Add a DSA ad group with page feeds or URL targets
2. Set DSA-specific negatives to prevent overlap with keyword-targeted ad groups
3. Verify DSA targets do not duplicate keyword-targeted landing pages

> ⚠️ **Only add DSA if your campaign strategy calls for it:** DSA is not required in every Search campaign. If your keyword coverage is comprehensive, DSA adds complexity without clear benefit.

### 6.5 Final settings check

For each campaign, confirm:

- [ ] Networks are set correctly (Search Partners and Display Network off by default)
- [ ] Location targeting is set (default: "Presence or interest", restrict to "Presence only" if data warrants)
- [ ] Language targeting matches your audience
- [ ] Bid strategy and target are configured
- [ ] Daily budget is set
- [ ] Conversion goals are correct
- [ ] Ad rotation is set to Optimize
- [ ] Start date is set

---

### Validation & definition of done

This SOP is complete when:

- [ ] All keyword clusters are assigned to campaigns with documented segmentation reasons
- [ ] Each campaign has ad groups organized by creative theme, validated with the Single Ad Test
- [ ] Keywords are assigned to ad groups with correct match types per the Guidelines
- [ ] No duplicate keywords exist across ad groups within the same campaign
- [ ] Shared negative keyword lists are linked to the correct campaigns
- [ ] Landing pages are assigned and validated for every ad group
- [ ] Structure is uploaded to Google Ads via Editor without errors
- [ ] Campaign settings are configured per the Search Campaign Settings Guidelines
- [ ] Bid strategies and budgets are applied per upstream SOPs
- [ ] Run the [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md) and pass all applicable items

---

### Exit → Entry bridge

Once the campaign structure is built and all settings are configured:

| Timeframe | Action |
|-----------|--------|
| Immediately | Write RSAs for each ad group using [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |
| After RSAs are live | Run the [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md) for final pre-launch validation |
| Launch day | Execute [SOP – Launch a Search Campaign](../sops/SOP – Launch a Search Campaign.md) |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Unsure whether to split or consolidate campaigns | Re-read [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) |
| Ad group creative themes are unclear | Re-read [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) and re-run the Single Ad Test |
| Match type selection is ambiguous | Re-read [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) |
| Bid strategy questions | Re-read [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) |
| Budget allocation questions | Re-read [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Too many campaigns | Over-segmenting without valid reasons | Apply the 8 segmentation reasons strictly. If no reason, consolidate. |
| Ad groups based on keywords instead of creative themes | Grouping by keyword similarity rather than ad relevance | Use the Single Ad Test: can one RSA serve all keywords in this group? |
| Duplicate keywords across ad groups | Copy-paste errors or overlapping clusters | Check for duplicates before uploading. One keyword lives in one ad group. |
| Missing shared negative keyword lists | Not creating or linking negative keyword lists to campaigns | Create lists in Phase 3.3 and link to all relevant campaigns before launch |
| Sending non-brand traffic to the homepage | Defaulting to homepage instead of dedicated landing pages | Every non-brand ad group gets a landing page that matches the search intent |
| Search Partners left enabled | Forgetting to disable default network settings | Check Networks setting for every campaign before posting |
| Brand and non-brand keywords in the same campaign | Not separating brand traffic | Brand keywords always get their own campaign |

---

### Quick reference: Support library

| Document | Type | Used in |
|----------|------|---------|
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Mental Model | Phase 1 |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Mental Model | Phase 2 |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Mental Model | Phase 1, Phase 3 |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Guideline | Phase 3 |
| [Search Campaign Settings Guidelines](../guidelines/Search Campaign Settings Guidelines.md) | Guideline | Phase 6 |
| [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md) | Checklist | Validation, Exit bridge |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Mental Model | Phase 6 |
| [Budget Allocation Mental Model](../mental-models/Budget Allocation Mental Model.md) | Mental Model | Phase 6 |

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md) | Upstream: must complete before this SOP |
| [SOP – Set Campaign Goals and KPIs](../sops/SOP – Set Campaign Goals and KPIs.md) | Upstream: goals and KPIs must be defined |
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Upstream: bid strategy must be selected |
| [SOP – Allocate Budget Across Campaigns](../sops/SOP – Allocate Budget Across Campaigns.md) | Upstream: budget allocation must be determined |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Downstream: write ads after structure is built |
| [SOP – Launch a Search Campaign](../sops/SOP – Launch a Search Campaign.md) | Downstream: launch after structure and ads are complete |

---

### Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
