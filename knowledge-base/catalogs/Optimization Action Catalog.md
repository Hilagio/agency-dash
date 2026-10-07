# Optimization Action Catalog
Created: 2026-02-14

Support_ID: CATALOG_16
Status: Ready-to-publish
Category: Operational
Reference Type: Catalog
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 0

### Purpose

This catalog maps **optimization triggers to specific actions** across all campaign types and optimization areas. Use it as a lookup table: find the symptom or signal in your account, then follow the action and executing SOP.

It covers 12 optimization areas, from keyword performance to campaign structure, and applies to Search, Shopping, PMax, Demand Gen, and Video campaigns.

---

### What this is / What this is NOT

**This catalog:**

- Lists triggers (symptoms, signals, thresholds) that indicate an optimization opportunity
- Maps each trigger to a specific action and the SOP that executes it
- Specifies which campaign types each action applies to
- Rates impact, risk, and recommended check frequency
- Provides a frequency summary for building review cadences

**This catalog does NOT:**

- Explain how to execute the actions (that belongs to the linked SOPs)
- Teach the theory behind optimization decisions (see: [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md))
- Define the review cadence or workflow sequence (see: [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md))
- Replace the Improve Quality Score playbook routing logic (see: [Improve Quality Score](../playbooks/Improve Quality Score.md))
- Provide step-by-step execution instructions for any action

---

## How to use this catalog

1. **Identify the signal** in your account (a metric crossing a threshold, a status flag, or a pattern in reports)
2. **Find the matching optimization area** in the sections below
3. **Locate the trigger row** that matches your situation
4. **Follow the action** and open the linked SOP to execute

**Reading the table columns:**

| Column | Meaning |
|--------|---------|
| Trigger | The symptom or signal you observe in the account |
| Action | What to do about it |
| Campaign types | Which campaign types this applies to |
| Impact | Expected performance improvement (High/Medium/Low) |
| Risk | Chance of negative side effects (High/Medium/Low) |
| Frequency | How often to check for this trigger |
| Executing SOP | The SOP or Playbook that contains step-by-step execution |

**Prioritization rule:** When multiple triggers are present, work them in this order:

1. High impact, Low risk (quick wins: do these first)
2. High impact, Medium risk (high-leverage moves that need care)
3. Medium impact, Low risk (incremental improvements)
4. Medium impact, Medium risk (evaluate ROI of effort before executing)
5. Low impact, Low risk (maintenance tasks, batch together)

> 💡 **Start with high-impact, low-risk actions:** These are the quick wins that improve performance with minimal downside. Save high-risk actions for when you have strong data backing the decision.

---

## Trigger data requirements

Before acting on any trigger, confirm you have enough data. Premature optimization based on small samples creates more problems than it solves.

**Minimum data thresholds:**

| Metric | Minimum for action | Why |
|--------|--------------------|-----|
| Clicks | 50+ per entity (keyword, ad, audience) | Below 50, conversion rate variance is too high to draw conclusions |
| Impressions | 1,000+ for CTR decisions | CTR stabilizes around this volume for most campaign types |
| Conversions | 15+ per entity for CPA decisions | Below 15, one conversion swing changes CPA dramatically |
| Time period | 14+ days (2 business cycles minimum) | Avoids day-of-week bias and short-term anomalies |
| Spend | 2x target CPA per entity | If you have not spent enough to expect at least 2 conversions, wait |

> ⚠️ **These are minimums, not recommendations:** More data produces better decisions. When in doubt, wait for more data rather than acting prematurely.

---

## Keywords and search terms

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Keyword with 50+ clicks, 0 conversions | Diagnose: check QS, LP, intent match. Pause if no fix available | Search | High | Low | Weekly | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Non-converting N-gram pattern (2x target CPA spend, 0 conversions) | Add to "Non-converting N-grams" exclusion list (phrase match) | Search, Shopping, PMax | High | Low | Weekly | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Inefficient N-gram (converts but CPA > 1.5x target or ROAS < 0.7x target) | Add to "Inefficient N-grams" exclusion list (phrase match) | Search, Shopping, PMax | Medium | Low | Weekly | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| High-converting search term not yet a keyword | Promote to exact match keyword in relevant ad group | Search | Medium | Low | Weekly | [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) |
| Two keywords in same ad group cannibalize (split impressions, neither gets enough data) | Consolidate or restructure ad groups | Search | Medium | Medium | Monthly | [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) |
| Close variant gets more traffic than parent keyword with different performance | Add high-performing variant as exact match, negative the poor variant | Search | Medium | Low | Bi-weekly | [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) |
| Keyword match type too restrictive (low IS, proven performance) | Expand to broader match type with monitoring | Search | Medium | Medium | Monthly | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Keyword IS (Rank) below 50% on converting keyword | Diagnose: QS issue, bid issue, or both. Route to appropriate fix | Search | Medium | Low | Bi-weekly | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Broad match keyword triggering > 30% irrelevant queries | Tighten with negative keywords or switch to phrase match | Search | High | Low | Weekly | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Search IS (absolute top) below 10% on high-intent exact match keyword | Investigate: bid too low, QS issue, or budget constraint. Fix the binding constraint first | Search | Medium | Low | Monthly | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Keyword paused for performance but still getting traffic via close variants of other keywords | Negative the paused term and each of its variant forms, which negatives do not cover automatically (see [Negative Keyword Reference](../references/Negative Keyword Reference.md)) | Search | Medium | Low | Monthly | [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) |

> 💡 **N-gram analysis catches patterns that individual search term review misses:** A single search term with 3 clicks is noise. An N-gram pattern across 50 search terms totaling 200 clicks and 0 conversions is a clear signal.

**Keyword action decision tree:**

| Keyword performance | QS >= 7 | QS < 7 |
|---------------------|---------|--------|
| Converting, efficient | Keep and scale (increase budget/bids) | Fix QS to reduce CPC further |
| Converting, inefficient (CPA > 1.3x target) | Check LP CVR and intent match | Fix QS first (CPC reduction may fix efficiency) |
| Non-converting, 50+ clicks | Check LP and intent match, pause if neither explains it | Fix QS, then re-evaluate after 50 more clicks |
| Non-converting, < 50 clicks | Wait for more data | Fix QS while gathering data |

---

## Quality Score

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| QS < 7 on keyword with 100+ monthly impressions | Flag for QS improvement, route to Improve QS playbook | Search | High | Low | Bi-weekly | [Improve Quality Score](../playbooks/Improve Quality Score.md) |
| Expected CTR = Below Average | Route to Expected CTR SOP: improve headlines, add DKI, test ad copy | Search | High | Low | Bi-weekly | [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) |
| Ad Relevance = Below Average | Route to Ad Relevance SOP: restructure ad groups, align keywords to ads | Search | High | Low | Bi-weekly | [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) |
| Landing Page Experience = Below Average | Route to LP Experience SOP: improve page speed, content relevance, UX | Search | High | Medium | Monthly | [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) |
| QS 5 to 7 improvement opportunity on high-spend keyword | Prioritize: the CPC multiplier table in [Quality Score Reference](../references/Quality Score Reference.md) sizes the gain | Search | High | Low | Bi-weekly | [Improve Quality Score](../playbooks/Improve Quality Score.md) |
| Two QS components = Below Average on same keyword | Likely structural issue: keyword-to-ad group alignment is wrong, not just creative | Search | High | Medium | Monthly | [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) |
| QS dropped from 7+ to below 7 (previously stable) | Investigate: competitor changes, LP changes, algorithm update. Check Auction Insights | Search | High | Low | Bi-weekly | [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md) |

> 💡 **QS 5 to 7 is the highest-leverage move:** The CPC improvement from QS 5 to 7 is proportionally larger than any other QS jump. Focus here first on your highest-spend keywords.

**QS component priority order:**

1. Ad Relevance (structural fix, often resolves Expected CTR too)
2. Expected CTR (creative fix, directly impacts CPC)
3. Landing Page Experience (requires dev/design resources, longest to implement)

---

## Bidding and budget

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Campaign "Limited by Budget" on profitable campaign | Run 5-step constrained budget approach | All | High | Medium | Weekly | [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |
| Bid strategy in "Learning" status for 14+ days | Investigate: insufficient conversions, too many changes, structural issues | All | High | Low | Weekly | [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) |
| Bid strategy consistently missing target (CPA > target for 2+ weeks) | Diagnose root cause, adjust the target in the increments set by [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | All | High | Medium | Weekly | [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |
| Conversion volume clears the Smart Bidding threshold, currently on Manual CPC | Migrate to Smart Bidding (tCPA or Max Conversions) | Search, Shopping | High | Medium | Quarterly | [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) |
| Reliable conversion values + variance, currently on tCPA | Migrate to tROAS or Max Conversion Value | Search, Shopping, PMax | Medium | Medium | Quarterly | [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) |
| Profit tracking implemented, currently on tROAS | Migrate to profit-based targets (POAS) | Search, Shopping, PMax | High | Medium | Quarterly | [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md) |
| IS (Budget) > 10% on proven campaign | Vertical scaling opportunity: increase budget | All | Medium | Low | Weekly | [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |
| Device segment significantly underperforms (2x CPA) with Manual CPC bidding | Apply device bid modifier (decrease) | Search | Medium | Low | Monthly | [SOP – Set Up Conversion-Based Bidding](../sops/SOP – Set Up Conversion-Based Bidding.md) |
| Campaign hitting daily budget before noon consistently | Budget pacing issue: increase budget or tighten targeting to reduce waste | All | High | Medium | Weekly | [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) |
| Multiple campaigns competing for same budget (shared budget pool) | Evaluate portfolio bid strategy or budget reallocation | Search, Shopping | Medium | Medium | Monthly | [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) |
| Conversion data disruption (tracking break, website outage, seasonal event) | Apply data exclusion to prevent bid strategy from learning on bad data | All | High | Low | As needed | [SOP – Set Up Data Exclusions](../sops/SOP – Set Up Data Exclusions.md) |

> ⚠️ **Never make large target changes:** Large jumps reset the learning period and crash campaign performance. Increment sizes and the per-campaign-type caps live in [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md).

**Bidding maturity ladder:**

| Stage | Bid strategy | Prerequisite |
|-------|-------------|--------------|
| 1 | Manual CPC | None |
| 2 | tCPA or Max Conversions | Conversion volume per [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) |
| 3 | tROAS or Max Conv. Value | Reliable conversion values with variance, at the volume that reference sets |
| 4 | POAS (profit-based) | Profit tracking implemented (COGS in feed) |

Move up only when the prerequisite for the next stage is met. Never skip stages.

**Budget-limited campaign decision flow:**

| Budget-limited campaign type | First action | Second action |
|------------------------------|-------------|---------------|
| Profitable, high ROAS | Increase budget (vertical scale) | Loosen target slightly for more volume |
| Profitable, borderline ROAS | Trim waste first (negatives, audiences) | Then increase budget if ROAS improves |
| Unprofitable | Do not increase budget. Fix efficiency first | Restructure or pause if no path to profitability |

---

## Ads and creative

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| RSA headline/description with low CPI/RPI after 30+ days and sufficient impressions | Replace with new variant using Iteration Loop methodology | Search | Medium | Low | Monthly | [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) |
| Ad group with Ad Relevance = Below Average | Add DKI headline as quick relevance fix | Search | Medium | Low | Bi-weekly | [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) |
| PMax asset with below-average performance data (actual impressions/clicks/conversions metrics) | Replace with new variant, maintain angle diversity | PMax | Medium | Low | Bi-weekly | [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) |
| Auto-generated assets detected in PMax (especially auto-generated videos) | Disable auto-generated assets, replace with intentional creatives | PMax | Medium | Low | Monthly | [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) |
| Demand Gen creative fatigue (CTR declining over 2+ weeks) | Refresh creatives, test new formats (video/image/carousel/UGC) | Demand Gen | Medium | Low | Bi-weekly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| No active creative test running for 30+ days | Launch new creative test from experiment backlog | All | Medium | Low | Monthly | [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) |
| RSA has fewer than 7 headlines or 2 descriptions | Add headlines/descriptions to reach minimum testing threshold | Search | Medium | Low | Monthly | [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |
| All RSA headlines use the same angle (no angle diversity) | Add headlines covering different angles (benefit, feature, social proof, urgency) | Search | Medium | Low | Monthly | [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) |
| RSA assets untested (no active testing cycle) | Run asset-level testing inside the single RSA using CPI/RPI and AIS. One RSA per ad group, never competing RSAs | Search | Medium | Low | Monthly | [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) |

> ⚠️ **Ad Strength score is NOT a valid optimization trigger:** Ignore it. Use actual asset-level data: CPI/RPI for RSAs, impressions/clicks/conversions for PMax assets. Ad Strength is a completeness score, not a performance predictor.

**Creative testing priority:**

1. Headline angles (biggest impact on CTR)
2. Description copy (supports headline, impacts conversion)
3. Display path text (minor CTR impact, often overlooked)
4. Extensions and assets (incremental improvement)

---

## Extensions and assets

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Campaign missing minimum extensions (< 4 sitelinks or < 4 callouts) | Add extensions to meet minimum coverage | Search | Medium | Low | Monthly | [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |
| Extension with 0 clicks after 30+ days | Replace with new variant | Search | Low | Low | Monthly | [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |
| Auto-generated extensions active at account level | Disable automatic extensions, replace with manual | Search | Medium | Low | Quarterly | [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |
| Sitelinks pointing to pages with high bounce rate | Replace with sitelinks to better-performing pages | Search | Medium | Low | Monthly | [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |
| No structured snippets on campaign | Add at least 2 structured snippet headers with 4+ values each | Search | Low | Low | Monthly | [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |
| Call extension showing outside business hours | Set schedule to business hours only | Search | Low | Low | Quarterly | [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) |

> 💡 **Minimum extension coverage:** Every Search campaign needs at least 4 sitelinks, 4 callouts, and 2 structured snippets. Missing extensions reduce your ad real estate and expected CTR.

---

## Audiences and targeting

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Audience segment with 2x campaign CPA (100+ clicks) | Reduce bid modifier (Manual) or exclude (if consistently poor) | All | Medium | Medium | Monthly | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| Remarketing list shrinking below 1,000 users | Diagnose: tag firing, membership duration, traffic drop | All | High | Low | Monthly | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| Audience expansion enabled on remarketing campaign | Disable immediately (must target specific past visitors) | Video | High | Low | Weekly | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| Optimized targeting enabled on Demand Gen remarketing campaign | Turn optimized targeting off (must target specific past visitors) | Demand Gen | High | Low | Weekly | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| Demographic segment (age, gender, income) with 3x CPA after 500+ clicks | Exclude segment or apply negative bid modifier | Search | Medium | Medium | Quarterly | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| No observation audiences on Search campaigns | Add remarketing lists, in-market, and affinity as observation layers | Search | Medium | Low | Monthly | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| Customer Match list not uploaded or not refreshed in the last 30 days | Upload a fresh customer list, set up a recurring sync | All | Medium | Low | Monthly | [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) |
| High-performing observation audience identified (CPA < 0.5x campaign average) | Increase bid modifier (Manual) or create dedicated campaign for that audience | Search | Medium | Medium | Monthly | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |

> ⚠️ **Wait for statistical significance:** Do not exclude audience segments based on small samples. The thresholds above (100+ clicks, 500+ clicks) exist for a reason. Premature exclusions restrict your reach without reliable data backing the decision.

---

## Shopping and feed

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Best-seller product with IS (Budget) limited | Increase budget or create separate campaign for top products | Shopping, PMax | High | Low | Weekly | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| Product with 1,000+ impressions, CTR below category average | Optimize product title and primary image | Shopping, PMax | High | Low | Monthly | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| Product with 0 clicks after 30+ days active | Diagnose: title quality, price competitiveness, image quality, disapprovals | Shopping, PMax | Medium | Low | Monthly | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| GMC shows "High" price competitiveness (most expensive third) | Review pricing, sale price strategy, and competitor prices | Shopping, PMax | Medium | Medium | Monthly | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| Custom labels out of date (not reflecting current performance) | Update performance-based custom labels | Shopping, PMax | Medium | Low | Monthly | [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) |
| Product eligible for price drop badge (45-60 days stable price) | Implement sale_price in feed to trigger badge | Shopping, PMax | Medium | Low | Quarterly | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| Feed disapprovals > 5% of products | Investigate and fix: missing attributes, policy violations, data quality | Shopping, PMax | High | Low | Weekly | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| Product titles missing key attributes (brand, color, size, material) | Enrich titles with structured attribute data from feed | Shopping, PMax | High | Low | Monthly | [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) |
| "Zombie" products (high impressions, 0 conversions, 90+ days) consuming budget | Move to restricted budget segment or exclude from campaign | Shopping, PMax | Medium | Low | Monthly | [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) |

> ↪️ **For product segmentation strategies:** See [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) for custom label tactics by tier.

**Shopping optimization priority:**

1. Fix feed disapprovals (products not showing = zero revenue potential)
2. Optimize titles on high-impression, low-CTR products (visibility without clicks = wasted potential)
3. Address zombie products consuming budget (redirect spend to performers)
4. Update custom labels for accurate segmentation (ensures budget flows to right products)
5. Explore price drop badges and competitive pricing (incremental CTR lifts)

---

## Landing pages

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Landing page CVR below realistic benchmark (high traffic page) | Investigate: message match, UX, offer, speed. Route to optimization or A/B test | All | High | Medium | Monthly | [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) |
| Mobile page load time above 3 seconds | Fix speed issues: image compression, lazy loading, server response | All | High | Low | Monthly | [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) |
| Keywords sending traffic to wrong landing pages | Update final URLs to match keyword intent | Search | High | Low | Monthly | [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) |
| No active LP A/B test on highest-traffic page | Launch LP test (headline/offer first, then layout, then CTA) | All | Medium | Low | Quarterly | [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) |
| Message mismatch between ad copy and landing page headline | Align LP headline with top-performing ad headline angle | All | High | Low | Monthly | [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) |
| High bounce rate (> 70%) on landing page with 500+ sessions | Investigate: speed, above-the-fold content, mobile UX, intent alignment | All | High | Medium | Monthly | [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) |
| Cart/checkout abandonment rate above industry benchmark | Optimize checkout flow: reduce steps, add trust signals, fix UX friction | Ecommerce | High | Medium | Monthly | [SOP – Optimize Cart and Checkout Flow](../sops/SOP – Optimize Cart and Checkout Flow.md) |

> 💡 **Landing page optimization often delivers the highest ROI:** A 10% conversion rate improvement has the same effect as a 10% CPC reduction, but compounds over all traffic sources, not just paid.

---

## Campaign structure

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Campaign with < 30 conversions/month and redundant targeting | Consolidate into larger campaign for better data density | All | Medium | Medium | Quarterly | [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) |
| Campaign serving divergent intents with different performance | Split using Copy + Paste method (move weaker segment out) | Search | Medium | Medium | Quarterly | [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) |
| Ad group with < 5,000 monthly impressions | Consolidate keywords into fewer, larger ad groups | Search | Medium | Low | Quarterly | [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) |
| Single ad group containing 30+ keywords with mixed intent | Split by intent cluster into separate ad groups | Search | Medium | Medium | Quarterly | [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md) |
| Brand and non-brand traffic mixed in same campaign | Split into separate brand and non-brand campaigns with negative keyword isolation | Search | High | Medium | Quarterly | [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) |
| Final URL expansion generating traffic for pages already covered by keyword campaigns | Add campaign URL exclusions for keyword-covered pages, or tighten ad-group URL inclusions and page feeds | Search | Medium | Low | Monthly | [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) |

> ⚠️ **Structure changes reset learning:** Consolidating or splitting campaigns restarts the bid strategy learning period. Only make structural changes when the data clearly supports it and you can afford 7-14 days of learning instability.

---

## PMax-specific

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| PMax search terms showing irrelevant queries | Add to negative keyword exclusion lists | PMax | High | Low | Weekly | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| PMax cannibalizing branded Search campaign traffic | Apply brand exclusions at PMax campaign level | PMax | High | Medium | Monthly | [SOP – Manage PMax Search Terms and Brand Defense](../sops/SOP – Manage PMax Search Terms and Brand Defense.md) |
| PMax channel allocation skewing heavily to Display (low-quality) | Investigate asset group signals, add/improve audience signals | PMax | Medium | Low | Monthly | [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) |
| Auto-generated videos appearing in PMax | Disable auto-generated assets, upload intentional video creatives | PMax | Medium | Low | Monthly | [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) |
| PMax asset group with no audience signals | Add audience signals (Customer Match, website visitors, custom segments) | PMax | Medium | Low | Monthly | [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) |
| PMax spending primarily on Shopping placements with full-asset setup | Normal for ecommerce: verify Shopping performance is strong. Check asset group quality if non-Shopping performance is poor | PMax | Low | Low | Monthly | [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) |
| PMax Feed-Only campaign showing non-Shopping placements | Check campaign setup: ensure no non-feed assets are attached | PMax | High | Low | Weekly | [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) |

> 💡 **PMax supports campaign-level negative keywords:** Search term insights carry the same weekly review and exclusion-list build as a Search campaign.

---

## Demand Gen-specific

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Seed audience below 1,000 users | Expand seed definition or wait for list to grow | Demand Gen | High | Low | Monthly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| Lookalike on "Narrow" with good efficiency | Test expanding to "Balanced" for more volume | Demand Gen | Medium | Medium | Monthly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| GA4 showing significantly fewer conversions than Google Ads | Normal for Demand Gen: use Google Ads as source of truth | Demand Gen | N/A | N/A | Weekly | N/A (expected behavior) |
| YouTube placement consuming 80%+ of Demand Gen budget | Review placement performance, consider channel-level controls | Demand Gen | Medium | Low | Monthly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| Demand Gen campaign in learning with < 50 conversions in 30 days | Evaluate: broaden audience, increase budget, or lower CPA target to help exit learning | Demand Gen | High | Medium | Monthly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |

> ⚠️ **Demand Gen conversion discrepancies are expected:** GA4 attributes differently than Google Ads for upper-funnel campaigns. Do not panic when numbers diverge. Use Google Ads conversion data for optimization decisions within Demand Gen campaigns.

---

## Demand Gen and Video-specific

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Mobile app placements generating clicks with 0 conversions | Exclude all mobile app categories | Demand Gen, PMax | High | Low | Weekly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| Suspicious placement (high impressions, 0 CTR, or extremely high CTR > 10%) | Exclude placement, flag for review | Demand Gen, Video | Medium | Low | Weekly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| Video view rate below 20% (skippable in-stream) | Test new video creative (different hook in first 5 seconds) | Video | Medium | Low | Monthly | [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) |
| Frequency > 5 per user per week (prospecting) | Tighten frequency cap (Video), expand audience reach | Video, Demand Gen | Medium | Low | Monthly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| GDN-heavy Demand Gen campaign CTR below 0.5% across all placements | Evaluate: creative quality, audience targeting, placement quality. Low GDN CTR is normal but extreme lows indicate misalignment | Demand Gen | Medium | Low | Monthly | [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) |
| Video completion rate below 15% (non-skippable bumper ads excluded) | Creative issue: video does not hold attention. Test shorter format or different narrative structure | Video | Medium | Low | Monthly | [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) |

> ⚠️ **Mobile app placements are the single biggest source of wasted GDN spend:** Exclude them proactively at account level so Demand Gen and PMax serving is covered. The default settings include mobile apps, and they almost never convert for non-app businesses.

---

## Conversion tracking health

| Trigger | Action | Campaign types | Impact | Risk | Frequency | Executing SOP |
|---------|--------|---------------|--------|------|-----------|---------------|
| Conversion count drops > 30% week-over-week with stable traffic | Investigate tracking: tag firing, consent mode, page changes, GTM updates | All | Critical | Low | Weekly | [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) |
| Enhanced Conversions is off at account level | Implement Enhanced Conversions to recover consent-mode data loss | All | High | Low | Quarterly | [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md) |
| Transaction ID deduplication not active (ecommerce) | Implement to prevent double-counting and inflated ROAS | Shopping, PMax, Search | High | Low | Quarterly | [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md) |
| Conversion lag > 7 days on majority of conversions | Account for reporting lag in all optimization decisions: use adjusted data, not raw | All | Medium | Low | Weekly | [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) |
| Multiple conversion actions included in "Conversions" column that should not be | Set non-primary actions to "Secondary" to exclude from bidding optimization | All | High | Low | Quarterly | [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) |

> ⚠️ **Conversion tracking issues are the highest-priority fix in any account:** Bad data causes every other optimization to misfire. If you suspect a tracking issue, stop all other optimization work and fix tracking first.

> ↪️ **For the tracking-health gate itself:** See [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md), which owns the tag-firing, Enhanced Conversions, deduplication, lag and consent-mode checks in binary form.

---

## Optimization frequency summary

Use this table to build your review cadence. Each frequency maps to the review SOPs in the operational pillar.

**Weekly checks:**

| Area | Triggers to check |
|------|--------------------|
| Keywords and search terms | 50+ click non-converters, N-gram patterns, search term promotions, broad match query quality |
| Bidding and budget | Budget-limited campaigns, learning status, IS (Budget), budget pacing |
| PMax-specific | Irrelevant search terms, Feed-Only placement leakage |
| Demand Gen and Video | Mobile app placements, suspicious placements |
| Audiences | Optimized targeting on remarketing (Demand Gen), audience expansion on remarketing (Video) |
| Conversion tracking | Conversion count drops, reporting lag awareness |

**Bi-weekly checks:**

| Area | Triggers to check |
|------|--------------------|
| Quality Score | QS < 7, component scores Below Average, QS drops |
| Keywords | Close variant cannibalization, IS (Rank) on converters |
| Ads and creative | PMax asset performance, Demand Gen creative fatigue, ad relevance |

**Monthly checks:**

| Area | Triggers to check |
|------|--------------------|
| Shopping and feed | Product CTR, zero-click products, price competitiveness, custom labels, feed disapprovals, zombie products |
| Landing pages | CVR benchmarks, page speed, URL alignment, message match, bounce rate, cart abandonment |
| Audiences | Segment performance, remarketing list size, observation audiences, Customer Match freshness |
| Extensions | Coverage gaps, zero-click extensions, sitelink bounce rates, structured snippets |
| Ads and creative | RSA CPI/RPI, auto-generated assets, creative test backlog, headline count, angle diversity |
| PMax-specific | Brand cannibalization, channel allocation, auto-generated videos, audience signals |
| Campaign structure | Keyword cannibalization, final URL expansion overlap |
| Demand Gen | Seed audience size, lookalike expansion, placement allocation, learning status |
| Bidding | Device segment performance, portfolio strategy evaluation |

**Quarterly checks:**

| Area | Triggers to check |
|------|--------------------|
| Bidding | Smart Bidding migration, value-based bidding, profit-based targets |
| Campaign structure | Consolidation, splitting, ad group volume, brand/non-brand separation |
| Audiences | Demographic exclusions |
| Extensions | Auto-generated extension audit, call extension schedules |
| Shopping | Price drop badge eligibility |
| Conversion tracking | Conversion action settings, deduplication, Enhanced Conversions setup |

> ↪️ **For the full review workflow:** See [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md), [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md), [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md), and [SOP – Run a Quarterly Business Review](../sops/SOP – Run a Quarterly Business Review.md).

---

### Quick reference: Support library

| Document | Type | Used for |
|----------|------|----------|
| [Improve Quality Score](../playbooks/Improve Quality Score.md) | Playbook | Routes QS improvement decisions to correct sub-component SOP |
| [Expand Audience Reach](../playbooks/Expand Audience Reach.md) | Playbook | Routes audience expansion decisions across campaign types |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Reference | Bid strategy selection criteria per campaign type |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference | Learning phase and post-change wait rules, conversion cycles |
| [Search Term Report Reference](../references/Search Term Report Reference.md) | Reference | Reading and interpreting search term data |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Negative keyword match type mechanics and conflict resolution |
| [Quality Score Reference](../references/Quality Score Reference.md) | Reference | QS components, scoring mechanics, improvement priorities |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Catalog | Product feed custom label strategies for Shopping and PMax |
| [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) | Catalog | Negative keyword patterns by vertical |

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Run a Daily Account Health Check](../sops/SOP – Run a Daily Account Health Check.md) | Uses this catalog to identify daily triggers |
| [SOP – Run a Weekly Performance Review](../sops/SOP – Run a Weekly Performance Review.md) | Uses this catalog for weekly optimization actions |
| [SOP – Run a Monthly Performance Review](../sops/SOP – Run a Monthly Performance Review.md) | Uses this catalog for monthly optimization actions |
| [SOP – Run a Quarterly Business Review](../sops/SOP – Run a Quarterly Business Review.md) | Uses this catalog for quarterly optimization actions |
| [SOP – Investigate Performance Anomalies](../sops/SOP – Investigate Performance Anomalies.md) | Routes here after anomaly diagnosis to find corrective action |
| [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) | Executes keyword and search term actions |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | Executes search term promotion actions |
| [SOP – Run N-gram Analysis](../sops/SOP – Run N-gram Analysis.md) | Executes performance-based negative keyword actions |
| [SOP – Improve Expected CTR](../sops/SOP – Improve Expected CTR.md) | Executes Expected CTR improvement actions |
| [SOP – Improve Ad Relevance](../sops/SOP – Improve Ad Relevance.md) | Executes Ad Relevance improvement actions |
| [SOP – Improve Landing Page Experience](../sops/SOP – Improve Landing Page Experience.md) | Executes Landing Page Experience improvement actions |
| [SOP – Scale Bids and Budgets](../sops/SOP – Scale Bids and Budgets.md) | Executes bidding and budget scaling actions |
| [SOP – Migrate from Manual to Smart Bidding](../sops/SOP – Migrate from Manual to Smart Bidding.md) | Executes Smart Bidding migration actions |
| [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) | Executes RSA optimization actions |
| [SOP – Write Compelling RSAs](../sops/SOP – Write Compelling RSAs.md) | Executes extension and asset creation actions |
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | Executes audience optimization actions |
| [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) | Executes PMax audience signal actions |
| [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) | Executes Customer Match list actions |
| [SOP – Set Up and Optimize Product Feed](../sops/SOP – Set Up and Optimize Product Feed.md) | Executes product feed optimization actions |
| [SOP – Set Up Performance-Based Shopping Segmentation](../sops/SOP – Set Up Performance-Based Shopping Segmentation.md) | Executes custom label update actions |
| [SOP – Audit and Optimize an Existing Landing Page](../sops/SOP – Audit and Optimize an Existing Landing Page.md) | Executes landing page optimization actions |
| [SOP – Optimize Cart and Checkout Flow](../sops/SOP – Optimize Cart and Checkout Flow.md) | Executes cart and checkout optimization actions |
| [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) | Executes campaign structure actions |
| [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md) | Executes keyword clustering and ad group restructuring |
| [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) | Executes PMax asset and setup actions |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Executes PMax Feed-Only setup and troubleshooting |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Executes Demand Gen optimization actions, including GDN placement and setup actions |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Executes Video campaign optimization actions |
| [SOP – Run a Campaign Experiment](../sops/SOP – Run a Campaign Experiment.md) | Executes A/B testing actions for ads and landing pages |
| [SOP – Select a Bidding Strategy](../sops/SOP – Select a Bidding Strategy.md) | Executes bid strategy selection and diagnosis actions |
| [SOP – Set Up Portfolio Bid Strategies](../sops/SOP – Set Up Portfolio Bid Strategies.md) | Executes portfolio bid strategy actions |
| [SOP – Set Up Data Exclusions](../sops/SOP – Set Up Data Exclusions.md) | Executes data exclusion actions during tracking disruptions |
| [SOP – Set Up Value-Based Bidding](../sops/SOP – Set Up Value-Based Bidding.md) | Executes value-based bidding migration |
| [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md) | Executes profit tracking setup for POAS bidding |
| [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md) | Executes Enhanced Conversions implementation |
| [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md) | Executes deduplication setup |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Executes conversion action configuration |
| [SOP – Manage Google Recommendations](../sops/SOP – Manage Google Recommendations.md) | Cross-references: recommendations may overlap with triggers in this catalog |
| [SOP – Resolve Ad Disapprovals](../sops/SOP – Resolve Ad Disapprovals.md) | Adjacent: disapprovals surface during optimization checks |
| [SOP – Analyze Auction Insights](../sops/SOP – Analyze Auction Insights.md) | Executes competitive analysis when QS drops or IS changes |

---

### Related documents

| Document | Relationship |
|----------|--------------|
| [Systems thinking & bottleneck analysis](../theory/Systems thinking & bottleneck analysis.md) | Theory foundation for prioritizing optimization actions |
| [Improve Quality Score](../playbooks/Improve Quality Score.md) | Routing logic for QS improvement decisions |
| [Expand Audience Reach](../playbooks/Expand Audience Reach.md) | Routing logic for audience expansion decisions |
| [Feed Segmentation Catalog](../catalogs/Feed Segmentation Catalog.md) | Product segmentation strategies referenced by Shopping triggers |
| [Negative Keyword Catalog](../catalogs/Negative Keyword Catalog.md) | Negative keyword patterns referenced by keyword triggers |

---

### Version details

- **Version:** 3.0
- **Last Updated:** June 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.