# SOP – Research Keywords
Created: 2026-02-04
Updated: 2026-04-02

SOP_ID: SOP_40
Status: Done
Category: Targeting
Primary Outcome: Comprehensive keyword list with volume and CPC data, ready for clustering
Agent_Executable: No
Human_Approval_Required: No
Domain: Search
Pillar: 7

### Purpose

This SOP produces a comprehensive, de-duplicated keyword list with volume and CPC data from multiple research sources.

> **The big question:** Do I have a complete keyword list that covers all relevant search themes for this business, with enough data to cluster and prioritize?

This SOP is the **discovery layer:** It feeds directly into keyword clustering and campaign structure decisions downstream.

---

### What this SOP is NOT

This SOP does **not:**

- Cluster or group keywords into ad groups (See: [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md))
- Assign match types to keywords (See: [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md))
- Validate keyword quality (See: [Keyword Set Quality Checklist](../checklists/Keyword Set Quality Checklist.md))
- Build campaign or ad group structure (See: [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md))
- Mine search terms from a running account for promotion (See: [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md))

### When to run this SOP

Run this SOP when:

- Setting up a new Google Ads Search campaign from scratch
- Expanding an existing account into new product/service areas
- Relaunching a campaign after a major offer or business model change
- Onboarding a new client and building the initial keyword foundation

---

### Before you start

#### Required inputs

- Clear understanding of the business: products/services offered, target audience, USPs
- List of products or services to advertise (prioritized by business value)
- Website URL(s) for the business
- Competitor names or URLs (2-3 minimum)
- Conversion goals defined (what counts as a conversion for this business)
- Google Ads account with access to Keyword Planner

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Match Type Reference](../references/Match Type Reference.md) | Understanding match type behavior during research |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Flagging obvious negatives during research |
| [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) | Common negative keyword patterns to watch for |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Mining existing STR data (Phase 3) |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Contextualize** | Understand the business and define seed keywords | Seed keyword list (10-30 terms) |
| **Phase 2️⃣: Generate Keywords from Tools** | Expand seed list using multiple research tools | Raw keyword list from all sources |
| **Phase 3️⃣: Mine Search Term Reports** | Extract keyword ideas from existing account data | Additional keywords from real queries |
| **Phase 4️⃣: Compile and De-duplicate** | Merge, clean, and enrich the master list | De-duplicated keyword list with metrics |

---

## Phase 1️⃣: Contextualize

### 1.1 Document the business context

Before opening any tool, answer these questions. Record the answers in a spreadsheet or document:

1. **What does the business sell?** List all products/services to advertise.
2. **Who is the target audience?** Demographics, pain points, buying triggers.
3. **What are the USPs?** Unique selling points that differentiate from competitors.
4. **What are the conversion goals?** Leads, sales, demos, sign-ups.
5. **Which products/services are highest priority?** Rank by revenue potential or strategic importance.

### 1.2 Build the seed keyword list

Generate 10-30 seed keywords from three sources:

**Source A: Business offerings**

1. Write down the core product/service names.
2. Add common variations customers use (not industry jargon).
3. Include branded terms if running brand campaigns.

**Source B: Website content**

1. Review the homepage, product/service pages, and landing pages.
2. Note the primary terms used in page titles, H1 headings, and meta descriptions.
3. Add any terms the site ranks for organically that indicate purchase intent.

**Source C: Competitor websites**

1. Visit 2-3 competitor websites.
2. Note how they describe similar products/services.
3. Add any terms they use that the business does not.

### 1.3 Record seed keywords

Create a spreadsheet with these columns:

| Column | Description |
|--------|-------------|
| Seed Keyword | The term |
| Source | Where it came from (business, website, competitor) |
| Priority Product/Service | Which offering it maps to |

**Target: 10-30 seed keywords covering all priority products/services.**

> **Verification:** Every priority product/service has at least 2 seed keywords. If not, revisit 1.2.

---

## Phase 2️⃣: Generate Keywords from Tools

Use all five sources below. Each source surfaces different keyword types. Skipping a source leaves gaps.

### 2.1 Google Keyword Planner

Google Keyword Planner is your primary first-party research tool. It offers two discovery methods: starting with keywords and starting with a website.

**Method A: Start with keywords**

1. Open Google Ads > Tools > Keyword Planner > "Discover new keywords" > "Start with keywords".
2. Enter 3-5 seed keywords at a time (group by product/service).
3. Optionally enter your domain: Google will try to exclude keywords not related to what you offer.
4. Review the keyword ideas list.
5. Apply filters:
   - Set location targeting to your target market.
   - Set language to your target language.
   - Remove keywords with zero search volume.
6. Sort by "Avg. monthly searches" (descending).
7. Select all relevant keyword ideas.
8. Download the list (CSV or Google Sheets).
9. Repeat for each group of seed keywords.

**Method B: Start with a website**

1. Open Google Ads > Tools > Keyword Planner > "Discover new keywords" > "Start with a website".
2. Enter your own website URL (or a competitor URL) to discover keywords based on the page content.
3. Choose "Use the entire site" or "Use only this page" depending on scope.
4. Review the generated keyword ideas. Google analyzes the page content to find relevant keywords (hyperlink content is not used for keyword generation).
5. Apply the same filters as Method A (location, language, volume).
6. Download the list.
7. Repeat for competitor websites (2-3 minimum).

> 💡 **Run both methods:** Starting with keywords surfaces terms you already know about. Starting with a website surfaces terms you missed, especially from competitor sites.

> **Verification:** You have at least one Keyword Planner export per priority product/service, using both keyword-based and website-based discovery.

### 2.2 Google Search autocomplete and related searches

For each seed keyword:

1. Open Google Search in an incognito/private browser window.
2. Type the seed keyword slowly and note all autocomplete suggestions.
3. Press Enter and scroll to the bottom of the results page.
4. Record all "Related searches" suggestions.
5. Click into "People also ask" boxes and record the questions.
6. Add all new terms to your raw keyword list.

> **Tip:** Autocomplete surfaces long-tail variations that Keyword Planner often misses. These are real queries people type.

### 2.3 SEMrush (or equivalent competitive tool)

**Keyword Magic Tool:**

1. Open SEMrush > Keyword Magic Tool.
2. Enter each seed keyword.
3. Review the keyword tree and subtopics.
4. Filter by search volume (set minimum based on your market size).
5. Export relevant keywords.

**Competitor keyword analysis:**

1. Open SEMrush > Domain Overview.
2. Enter 2-3 competitor domains.
3. Navigate to "Organic Research" > "Positions" for organic keyword ideas.
4. Navigate to "Advertising Research" > "Positions" for paid keyword ideas.
5. Export keywords your competitors bid on that you have not captured yet.

**Keyword gap analysis:**

1. Open SEMrush > Keyword Gap.
2. Enter your domain and 2-3 competitor domains.
3. Filter to show keywords competitors rank for that you do not.
4. Export the gap keywords.

> **Verification:** You have exports from Keyword Magic Tool and at least one competitor analysis.

### 2.4 Keywordtool.io (or equivalent long-tail tool)

1. Open Keywordtool.io.
2. Select "Google" as the platform.
3. Enter each seed keyword.
4. Set language and location to match your target market.
5. Review the generated long-tail variations.
6. Export all relevant variations.

> **Tip:** This tool generates variations from Google autocomplete data across multiple modifier patterns (questions, prepositions, comparisons). It surfaces intent-rich long-tail keywords.

### 2.5 ChatGPT or AI tools

Use AI to brainstorm angles you missed:

1. Provide the AI with: business description, products/services, target audience, existing seed keywords.
2. Ask for: related search terms, synonyms, long-tail variations, question-based keywords, problem-aware keywords.
3. Review the output and add relevant terms to your raw list.
4. Ask for keywords a competitor in this space would target.
5. Add any new relevant terms.

> **Warning:** AI-generated keywords need volume validation. Do not add them to the final list without checking actual search volume in Phase 4.

---

## Phase 3️⃣: Mine Search Term Reports

> **Skip this phase if the account is brand new with no historical data.**

### 3.1 Pull the Search Term Report

1. Open Google Ads > Reports > Search Terms.
2. Set date range: last 90 days (or maximum available).
3. Add columns: Search Term, Impressions, Clicks, Conversions, Conversion Value.
4. Sort by Conversions (descending).

### 3.2 Extract keyword candidates

Identify search terms that meet these criteria:

| Criteria | Threshold |
|----------|-----------|
| Has conversions | 1 or more |
| Has significant impressions | 50+ in the period |
| Not already a keyword | Check against current keyword list |
| Not a close variant of an existing keyword | Different root term or meaningful modifier |

### 3.3 Add to raw list

1. Export the qualifying search terms.
2. Add them to your raw keyword list with the source marked as "STR".
3. Note conversion data alongside each term for prioritization in clustering.

> **Verification:** All converting search terms not already captured as keywords have been reviewed and relevant ones added.

---

## Phase 4️⃣: Compile and De-duplicate

### 4.1 Merge all sources

1. Combine all exports and manually recorded keywords into a single spreadsheet.
2. Use one row per keyword.
3. Include a "Source" column indicating where each keyword came from.

### 4.2 De-duplicate

1. Normalize all keywords to lowercase.
2. Remove exact duplicates.
3. Remove near-duplicates (singular/plural, minor word order changes).
4. Keep the version with the highest search volume when removing near-duplicates.

### 4.3 Add metrics

For each unique keyword, ensure these columns are populated:

| Column | Source |
|--------|--------|
| Keyword | Merged list |
| Avg. Monthly Search Volume | Keyword Planner or SEMrush |
| Avg. CPC | Keyword Planner or SEMrush |
| Competition Level | Keyword Planner (Low/Medium/High) |
| Source | Which tool(s) surfaced this keyword |

**To fill missing metrics:**

1. Copy up to 1,000 keywords at a time into Google Keyword Planner > "Get search volume and forecasts".
2. Download the results.
3. Merge the volume and CPC data back into your master list.

### 4.4 Flag intent type

For each keyword, assign one intent label:

| Intent Type | Signal | Example |
|-------------|--------|---------|
| Transactional | Contains "buy", "order", "purchase", "pricing", "cost" | "buy crm software" |
| Commercial | Contains comparison/evaluation terms: "best", "vs", "review", "top" | "best crm for small business" |
| Informational | Contains "how to", "what is", "guide", "tutorial" | "what is a crm" |
| Navigational | Contains brand names or specific product names | "salesforce pricing" |

> **Tip:** Focus on transactional and commercial intent keywords for Search campaigns. Flag informational keywords for potential exclusion or separate campaign treatment.

### 4.5 Final cleanup

1. Remove keywords with zero search volume (unless they came from the Search Term Report with conversions).
2. Remove obviously irrelevant terms that slipped through.

> **Verification:** Every keyword in the final list has search volume data, a CPC estimate, and an intent label.

---

### Validation and definition of done

This SOP is complete when:

- [ ] Business context documented (products, audience, USPs, goals)
- [ ] Seed keyword list created with 10-30 terms covering all priority products/services
- [ ] Google Keyword Planner exports completed for all seed keyword groups
- [ ] Google Search autocomplete and related searches captured
- [ ] SEMrush (or equivalent) keyword expansion and competitor analysis completed
- [ ] Keywordtool.io (or equivalent) long-tail variations captured
- [ ] AI-generated keyword ideas reviewed and relevant terms added
- [ ] Search Term Report mined (if existing account)
- [ ] All sources merged into a single master list
- [ ] Duplicates and near-duplicates removed
- [ ] Search volume and CPC data populated for all keywords
- [ ] Intent type flagged for each keyword
- [ ] Irrelevant terms and obvious negatives removed

---

### Exit to entry bridge

Once the master keyword list is complete:

| Next step | Action |
|-----------|--------|
| Immediately | Run the [Keyword Set Quality Checklist](../checklists/Keyword Set Quality Checklist.md) against the list |
| Then | Begin [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md) to group keywords into ad group themes |
| Parallel | Start building your [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) entries from flagged irrelevant terms |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| Relying on a single keyword tool | Each tool surfaces different keyword types: one tool leaves gaps | Use all five sources in Phase 2 |
| Skipping autocomplete research | Misses long-tail, high-intent queries real users type | Always run Phase 2.2 for every seed keyword |
| Adding AI keywords without volume validation | AI invents plausible terms that nobody searches for | Validate every AI-generated keyword in Keyword Planner |
| Not de-duplicating before clustering | Inflated list makes clustering slow and error-prone | Always complete Phase 4.2 before moving downstream |
| Ignoring the Search Term Report | Misses proven, converting queries already in the account | Always run Phase 3 for existing accounts |
| Including informational keywords without flagging | Wastes budget on non-converting traffic | Flag intent in Phase 4.4 and separate informational terms |

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md) | Downstream (takes the keyword list from this SOP as input) |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | Parallel (ongoing keyword expansion from live data) |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Downstream (keywords inform ad copy and DKI) |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | Downstream (keyword-ad alignment depends on keyword quality) |

---

### Related documents

| Document | Type | Used in |
|----------|------|---------|
| [Match Type Reference](../references/Match Type Reference.md) | Reference | Understanding match type behavior |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Flagging negatives during research |
| [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) | Catalog | Common negative patterns |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference | Phase 3 STR mining |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Guideline | Downstream match type decisions |
| [Keyword Set Quality Checklist](../checklists/Keyword Set Quality Checklist.md) | Checklist | Post-completion validation |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Mental Model | Campaign structure context |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Mental Model | Ad group design context |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
