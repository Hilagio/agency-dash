# Dynamic Search Ads Mental Model
Created: 2026-02-04

Support_ID: MENTALMODEL_24
Category: Strategy
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Mental Model
Agent_Readable: Yes
Status: Done

## Purpose

This mental model explains how Dynamic Search Ads (DSA) work, when they add value, and how they fit within a modern Search campaign structure. It answers the core question: should I use DSA, and if so, how does it complement my keyword-based targeting?

> DSA is not a replacement for keyword-based campaigns. It is a complementary targeting layer that fills gaps keyword lists cannot cover.

---

## What this is / What this is NOT

**This mental model:**

- Explains how Google generates DSA headlines from page content
- Defines when DSA adds value vs. when it hurts performance
- Maps DSA into the consolidation-first campaign philosophy
- Provides the targeting option hierarchy for DSA

**This mental model does NOT:**

- List DSA targeting option syntax or specifications (See: [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md))
- Provide step-by-step DSA setup instructions (See: SOP: Set Up Dynamic Search Ads)
- Explain page feed CSV format or upload process (See: [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md))
- Cover campaign structure decisions beyond DSA placement (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))

---

## How DSA works

### The generation process

When you submit dynamic ad targets (page URLs), Google's crawlers analyze your page content and create a targeting-to-ad pipeline:

| Step | What happens |
|------|-------------|
| 1. Page crawl | Google indexes your target pages, extracting HTML page titles, headings (H1-H3), and body content |
| 2. Theme identification | Google identifies themes and terms from the page content that match potential search queries |
| 3. Query matching | When a user searches for terms closely related to your page content, Google triggers the DSA ad |
| 4. Headline generation | Google dynamically creates the ad headline using the page's metadata, primarily the HTML page title |
| 5. Landing page selection | Google selects the most relevant page from your targets as the destination URL |
| 6. Ad assembly | The dynamic headline combines with your static description lines and enters the auction |

### What you control vs. what Google controls

| Element | Who controls it |
|---------|----------------|
| **Headlines** | Google (generated from page content) |
| **Description lines** | You (static, written per ad group) |
| **Landing page** | Google selects from your targeted pages (you control which pages are eligible) |
| **Which pages are targeted** | You (via targeting options and page feeds) |
| **Page exclusions** | You (exclude irrelevant pages from targeting) |
| **Budget and bidding** | You (campaign level) |
| **Negative keywords** | You (same as keyword-based campaigns) |

> The most important signal for DSA headline generation is the HTML page title. Optimize your page titles for 60-90 characters with relevant keywords and compelling copy. Coordinate with SEO before changing page titles.

---

## The core framework: when DSA adds value

| Scenario | DSA value | Why |
|----------|-----------|-----|
| **Large website with many product/service pages** | High | Covers queries you cannot anticipate with keyword lists. Scales automatically as pages are added |
| **Well-optimized pages (clear titles, structured content)** | High | Google can generate relevant headlines and match to appropriate queries |
| **Keyword-based campaigns already running** | High | DSA fills gaps in keyword coverage, captures long-tail queries keyword lists miss |
| **Small website with few pages** | Medium | Limited page inventory reduces DSA's discovery potential, but still captures long-tail queries for existing pages |
| **Website with optimized HTML titles and H1-H3 tags** | High | Better metadata = better headline generation = higher CTR |
| **Website content changes frequently (daily deals, flash sales)** | Low | Google crawlers cannot keep up with rapidly changing content. DSA serves outdated headlines |
| **Image-heavy website with minimal text content** | Low | Google cannot extract meaningful themes from images alone. DSA relies on text content |
| **Pages not optimized for SEO** | Medium | Poor page titles and thin content lead to generic or irrelevant DSA headlines |

---

## Targeting option hierarchy

Not all DSA targeting options are equal. Use this hierarchy to select the right approach:

| Rank | Targeting option | Recommendation | Why |
|------|-----------------|----------------|-----|
| **1 (preferred)** | Custom label (page feed) | Use this | Full control over which pages are targeted. Automate via feed management tools. Create granular labels for ad group segmentation |
| **2 (preferred)** | URL contains | Use this | Targets pages matching URL patterns. Works well when URL structure maps to business categories |
| **3 (use with caution)** | URL equals | Acceptable | Targets specific pages exactly. Misses new pages and breaks when URLs change |
| **4 (use with caution)** | Landing pages from standard ad groups | Acceptable | Targets only pages you already use in keyword-based ads. Safe but limited discovery |
| **5 (not recommended)** | Page title contains | Avoid | Depends on Google index accuracy. Limited control over which pages match |
| **6 (not recommended)** | Page content contains | Avoid | Matches on any page content including headers, footers, and navigation. Produces unpredictable results |
| **7 (not recommended)** | Categories (auto-generated) | Avoid | Google-generated categories are often inaccurate. Pages get miscategorized. No manual control |
| **8 (use sparingly)** | All web pages | Last resort only | Targets every indexed page including contact, terms, about us. High waste potential. Only use if you have comprehensive page exclusions |

> For complete targeting option specifications: See [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md)

---

## DSA placement within campaign structure

The golden rule applies to DSA: consolidate by default.

### Preferred: DSA ad groups within keyword-based campaigns

Add DSA ad groups to your existing keyword-based campaigns when:

- Budget is not constrained (DSA and keywords share the daily budget)
- Efficiency targets are the same for DSA and keyword-based traffic
- The keyword campaign's theme matches the DSA targeting scope

**Benefits:**
- Consolidated data for smart bidding
- Shared budget allocation (no separate budget to manage)
- Simpler account structure

### Exception: dedicated DSA campaigns

Create a separate DSA-only campaign when:

| Reason | Example |
|--------|---------|
| **Constrained budget** | You need to protect keyword campaign budget from DSA exploration spend |
| **Different efficiency target** | DSA traffic converts at different rates and needs a different tCPA/tROAS |
| **Different conversion goals** | DSA targets informational pages optimizing for micro-conversions while keyword campaigns optimize for macro-conversions |
| **Learning budget** | You want a dedicated, limited budget for DSA discovery before scaling |

> For campaign segmentation logic: See [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md)

---

## Ad group structure for DSA

DSA description lines are static (you write them), while headlines are dynamic (Google generates them). This creates a specific ad group design constraint:

| Approach | When to use | Trade-off |
|----------|-------------|-----------|
| **One DSA ad group (broad targeting)** | Pages share a common theme. Generic description lines work for all targets | Maximum consolidation, but description lines may feel generic |
| **Multiple DSA ad groups (segmented targeting)** | Pages serve different categories, services, or brands. Specific description lines needed | More relevant descriptions, but more management overhead |

### The description line test

> Can one set of description lines credibly serve all pages in this DSA ad group?

If yes: keep one ad group. If no: segment by description line relevance.

**Example: e-commerce electronics**

| DSA ad group | Targeting | Description lines |
|-------------|-----------|------------------|
| DSA: Samsung TVs | Custom label = "samsung_tv" | "Shop Samsung TVs. Free shipping on all orders. 30-day returns". |
| DSA: LG TVs | Custom label = "lg_tv" | "Discover LG TVs. Price match guarantee. Free next-day delivery". |
| DSA: Audio Equipment | Custom label = "audio" | "Premium audio equipment. Expert reviews. Hassle-free returns". |

One combined ad group with all three labels would need description lines so generic they lose relevance.

---

## DSA vs. AI Max Search Term Matching

AI Max for Search campaigns includes keywordless matching that overlaps with DSA functionality. Understanding the relationship helps you choose the right approach:

| Capability | DSA | AI Max Search Term Matching |
|------------|-----|----------------------------|
| Keywordless query matching | Yes (via page targeting) | Yes (via assets and landing pages) |
| Page feeds | Yes | No |
| Custom labels for targeting | Yes | No |
| Content exclusions at scale | Yes | Limited (URL exclusions only) |
| Granular URL targeting rules | Yes | Limited (URL inclusions at ad group level partially close this gap) |
| Campaign structure | Separate DSA campaigns or ad groups | Integrated into standard Search campaigns |
| Brand controls | No | Yes (inclusions at campaign and ad group level, exclusions at campaign level) |
| Ad group-level location targeting | No | Yes (Locations of Interest) |
| Text generation | No (headlines from page titles only) | Yes (AI-generated headlines and descriptions) |
| Search Partners opt-out | Yes | Yes |

### When to use DSA vs. AI Max

| Situation | Recommendation |
|-----------|---------------|
| High-SKU e-commerce needing page feed control | DSA |
| Need granular content targeting rules | DSA |
| Want keywordless matching without separate DSA structure | AI Max |
| Need brand inclusions/exclusions in Search | AI Max (required to unlock brand controls) |
| Want AI-generated ad copy | AI Max (with Text Customization) |
| Running both for maximum coverage | Acceptable: DSA handles longtail/page feed queries, AI Max handles asset-based expansion |

### DSA migration outlook

Google has confirmed the long-term goal of folding DSA functionality into AI Max. No official sunset date has been announced.

| Current DSA usage | Recommended action |
|-------------------|--------------------|
| DSA with page feeds (high-SKU) | Maintain DSA until AI Max adds page feed support. Begin testing AI Max keywordless features in parallel |
| DSA without page feeds | Test AI Max as a replacement. Run both for 4-8 weeks, then phase out the lower performer |
| DSA as discovery layer | AI Max keywordless matching provides equivalent discovery. Evaluate if DSA can be retired |

> For DSA-dependent accounts: activate AI Max keywordless features in Search campaigns rather than migrating DSA ad groups to PMax. This keeps budgets, measurement, and controls within Search.

### Hybrid approach

Running DSA and AI Max simultaneously is the most common adoption pattern among advertisers testing AI Max. This hybrid approach is the recommended transition strategy given Google's stated direction:

- **AI Max Search Term Matching:** Expands keyword coverage via assets and landing pages
- **DSA ad groups/campaigns:** Maintains page feed control and granular targeting for URLs not covered by keywords

This hybrid preserves DSA benefits (page feeds, content exclusions) while preparing for the eventual migration to AI Max.

> 💡 **Recommended transition approach:** Run both DSA and AI Max simultaneously during evaluation. Monitor performance of both for 4-8 weeks, then phase out the lower performer based on efficiency data. Do not disable DSA immediately when enabling AI Max.

> For the full AI Max decision framework: See [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md)

---

## DSA and keyword interaction

### The ad rank hierarchy

When both DSA and keyword-based ads are eligible for the same query:

| Scenario | Which ad serves |
|----------|----------------|
| Exact match keyword identical to query | Keyword-based ad (always preferred) |
| Phrase/broad match keyword + DSA both eligible | Whichever has the higher ad rank |
| Only DSA eligible (no matching keywords) | DSA ad |

### Do NOT exclude keywords from DSA campaigns

A common mistake is adding all campaign keywords as negatives in the DSA ad group "to prevent overlap". This hurts performance because:

1. DSA sometimes achieves higher ad rank than keyword-based ads for the same query
2. Higher ad rank = higher position and/or lower CPC
3. Excluding keywords from DSA forces the lower-ad-rank keyword ad to serve instead
4. You pay more for worse position

Let Google's ad rank system decide which ad serves. The higher-ad-rank ad wins, regardless of whether it is keyword-based or DSA.

> Exception: if you need strict budget separation between DSA and keyword traffic and are using the same campaign, internal negatives may be justified. But in most cases, consolidation and ad rank competition produce better results.

---

## Failure modes

| Failure mode | Symptoms | Fix |
|-------------|----------|-----|
| **Targeting all web pages without exclusions** | Budget spent on contact, terms, about us, checkout pages | Scrape your site (Screaming Frog or sitemap). Exclude all non-conversion-focused pages upfront |
| **Poor page metadata** | Generic or truncated DSA headlines. Low CTR | Optimize HTML page titles to 60-90 characters. Include keywords and a call to action. Coordinate with SEO |
| **Overly generic description lines** | Low ad relevance. High CPC | Segment DSA ad groups so description lines match the targeted page themes |
| **Excluding keywords from DSA** | Worse ad positions, higher CPCs on queries where DSA would win | Remove keyword-level negatives from DSA ad groups. Let ad rank determine which ad serves |
| **Using "categories" or "page content" targeting** | Irrelevant page matches. Budget waste | Switch to custom labels (page feed) or URL contains targeting |
| **No page feed automation (e-commerce)** | Out-of-stock products served as DSA targets | Set up automated page feeds via feed management tool with stock/margin filters |
| **Ignoring DSA search term reports** | Irrelevant queries accumulate unchecked | Review DSA search terms regularly. Add negatives to shared lists |

---

## Practical application

### Stage 1: Evaluate DSA fit

| Question | If yes | If no |
|----------|--------|-------|
| Does the website have well-optimized page titles and structured content? | Proceed to Stage 2 | Optimize pages first, then reconsider |
| Are the pages relatively stable (not changing daily)? | Proceed to Stage 2 | DSA is not recommended |
| Do keyword-based campaigns already exist? | DSA is a complementary layer | Consider starting with keyword campaigns first |

### Stage 2: Choose targeting approach

| Website type | Recommended targeting |
|-------------|----------------------|
| E-commerce with feed management | Custom labels via automated page feed |
| E-commerce without feed management | Custom labels via manual CSV page feed |
| Lead gen / SaaS with clean URL structure | URL contains targeting |
| Lead gen / SaaS without clean URL structure | Custom labels via manual CSV page feed |
| Small site (under 20 pages) | URL contains or landing pages from standard ad groups |

### Stage 3: Build exclusions

Before launching DSA, build a comprehensive exclusion list:

1. Scrape your website (Screaming Frog, sitemap XML, or manual review)
2. Identify irrelevant pages: contact, terms, privacy, about us, cart, checkout, login
3. Identify non-converting informational pages (test blog pages before excluding)
4. Add page exclusions using URL contains or URL equals
5. Apply your existing negative keyword lists to the DSA campaign/ad group
6. For e-commerce: exclude out-of-stock pages using page content exclusions ("out of stock", "unavailable")

### Stage 4: Launch and optimize

| Phase | Action |
|-------|--------|
| Week 1 | Monitor search term report daily. Add negatives aggressively for irrelevant queries |
| Week 2-4 | Review DSA performance vs. keyword campaigns. Check headline quality |
| Ongoing | Promote high-converting DSA search terms to keyword-based ad groups. Maintain exclusion lists |

---

## Key principles

1. **DSA fills gaps, it does not replace keywords:** Use DSA alongside keyword-based campaigns to capture queries your keyword lists miss.
2. **Consolidate DSA within keyword campaigns by default:** Only create separate DSA campaigns when budget isolation or different targets are needed.
3. **Custom labels and URL contains are the only targeting options worth using:** Everything else sacrifices control for convenience.
4. **Do not exclude keywords from DSA:** Let ad rank determine which ad serves. The higher-ad-rank ad produces better results.
5. **Page quality determines DSA quality:** Invest in HTML page titles, structured content, and clear page theming. DSA is only as good as the pages it targets.
6. **Automate page feeds for e-commerce:** Use feed management tools to filter out-of-stock, low-margin, and irrelevant products automatically.
7. **Build exclusions before launch:** Scrape your site and exclude non-conversion pages from day one to prevent budget waste.
8. **Segment DSA ad groups by description line relevance:** If one set of description lines cannot serve all targeted pages, split the ad group.

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Upstream: overarching Search philosophy |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Upstream: campaign-level structure decisions including DSA placement |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Upstream: ad group-level structure principles |
| [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md) | Reference: targeting option specs, page feed CSV format, custom label syntax |
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Related: alternative keywordless approach with AI-driven matching |
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | Reference: AI Max feature specs and settings |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference: negative keyword management for DSA |
| SOP: Set Up Dynamic Search Ads | Execution: step-by-step DSA setup workflow |
| SOP: Analyze Search Term Reports | Execution: irrelevant term identification and negation |
| SOP: Run N-gram Analysis | Execution: performance-based negative keyword management |

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

(c) 2026 PPC Mastery B.V. All rights reserved.
