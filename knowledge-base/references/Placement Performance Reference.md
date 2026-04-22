# Placement Performance Reference
Created: 2026-02-14

Support_ID: REFERENCE_45
Status: Done
Category: Upper Funnel
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Upper Funnel
Pillar: 0

## Purpose

Documents placement types, performance metrics, exclusion categories, and brand safety settings across Display, Video, PMax, and Demand Gen campaigns. Use this reference to evaluate where ads appear and decide which placements to keep, exclude, or investigate.

---

## What this reference is / What this is NOT

**This reference:**

- Documents placement types and where they apply by campaign type
- Defines placement-level metrics and minimum data thresholds for action
- Lists default exclusion categories and brand safety settings
- Covers PMax placement reporting limitations and Demand Gen placement channels
- Provides automated exclusion patterns for scripts

**This reference does NOT:**

- Explain content targeting methods (topics, keywords) (See: [Content Targeting Reference](../references/Content Targeting Reference.md))
- Cover frequency cap configuration (See: [Frequency Capping Reference](../references/Frequency Capping Reference.md))
- Provide campaign structure decisions (See: [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md))
- Execute placement exclusion steps (covered in campaign SOPs)

---

## Quick reference: Placement types by campaign type

| Placement type | Where ads appear | Campaign types | Exclusion level |
|----------------|-----------------|----------------|-----------------|
| Websites | Publisher websites (GDN) | Display, Demand Gen, PMax | Individual site or category |
| YouTube channels | Specific YouTube channels | Video, Display, PMax | Individual channel |
| YouTube videos | Specific YouTube videos | Video, Display | Individual video |
| Mobile apps | Apps and app categories | Display, Video, Demand Gen, PMax | Individual app or category |
| App categories | Full app store categories | Display, PMax | Category level |

> ⚠️ **PMax placement control is limited:** You can view where PMax served impressions, but you cannot target specific placements. You can only add account-level placement exclusions.

---

## Placement types breakdown

### Websites (GDN publishers)

Ads appear on third-party websites across the Google Display Network.

| Detail | Value |
|--------|-------|
| Available in | Display, Demand Gen, PMax |
| Targeting precision | Individual domain or URL path (Display, Video). Google AI-managed, no granular placement targeting (Demand Gen, PMax). |
| Exclusion scope | Ad group, campaign, or account level |
| Typical volume | Highest reach across all placement types |

**What to watch for:**

- Made-for-advertising (MFA) sites that exist only to display ads
- Parked domains with no real content
- Foreign-language sites irrelevant to your audience
- Sites with abnormally high CTR (likely accidental or fraudulent clicks)

### YouTube channels

Ads appear on all videos within a specific YouTube channel.

| Detail | Value |
|--------|-------|
| Available in | Video, Display, PMax |
| Targeting precision | Channel level for Video and Display campaigns. PMax: reporting only, no targeting. |
| Exclusion scope | Campaign or account level |
| Typical volume | Moderate (depends on channel size) |

**What to watch for:**

- Channels with content that conflicts with your brand
- Children's content channels (COPPA restrictions)
- Inactive channels with outdated content

### YouTube videos

Ads appear on specific individual YouTube videos.

| Detail | Value |
|--------|-------|
| Available in | Video, Display |
| Targeting precision | Individual video level for Video and Display campaigns (highest precision). |
| Exclusion scope | Campaign or account level |
| Typical volume | Low (single video traffic) |

### Mobile apps

Ads appear inside mobile applications.

| Detail | Value |
|--------|-------|
| Available in | Display, Video, Demand Gen, PMax |
| Targeting precision | Individual app or app category (Display, Video). Google AI-managed (Demand Gen, PMax). |
| Exclusion scope | Ad group, campaign, or account level |
| Typical volume | Very high (often majority of Display impressions) |

> ⚠️ **Exclude mobile apps by default:** Most mobile app placements produce accidental clicks from gaming apps and children's apps. Exclude all app categories unless you have a specific reason to include them.

---

## Default exclusion categories

These categories should be excluded from all Display and Video campaigns at account level before launching.

| Category | Why exclude | How to exclude |
|----------|-----------|---------------|
| Mobile apps (all) | Low-quality accidental clicks, children's games | Campaign > Placements > Exclusions > App categories: all |
| Parked domains | No real content, bot traffic | Placement exclusion lists |
| Made-for-advertising sites | Low engagement, poor brand safety | Placement exclusion lists |
| Error pages | No user intent, wasted impressions | Automatic via content exclusions |

### Exclusion list management

| Level | Scope | Use for |
|-------|-------|---------|
| Account | All campaigns | Brand safety rules, universal exclusions |
| Campaign | All ad groups in campaign | Campaign-specific poor performers |
| Ad group | Single ad group | Granular performance-based exclusions |

> 💡 **Build shared exclusion lists:** Create account-level placement exclusion lists and apply them to all Display and Video campaigns. Add poor performers to these lists over time rather than excluding per campaign.

---

## Brand safety settings

| Setting | Options | Recommendation |
|---------|---------|---------------|
| Content suitability | Expanded / Standard / Limited inventory | Standard for most, Limited for brand-sensitive |
| Content exclusions | Sensitive categories (tragedy, conflict, etc.) | Exclude all sensitive categories |
| Digital content labels | DL-G through DL-MA | Exclude DL-MA minimum |

### Content suitability tiers

| Tier | What it includes | When to use |
|------|-----------------|-------------|
| Expanded | All monetizable content including sensitive | Never recommended |
| Standard | Excludes most sensitive content | Default for most advertisers |
| Limited | Only vetted, brand-safe content | Premium brands, regulated industries |

### Digital content labels

| Label | Content type | Action |
|-------|-------------|--------|
| DL-G | General audiences | Include |
| DL-PG | Parental guidance | Include (review for sensitive brands) |
| DL-T | Teen content | Review based on brand |
| DL-MA | Mature audiences | Exclude |
| Not yet labeled | Unclassified content | Exclude for safety |

---

## PMax placement reporting

**Where to find placement data:**
Insights tab > Placements (shows which websites, YouTube channels, and apps received impressions).

**What PMax shows:**

| Data point | Available | Level of detail |
|-----------|-----------|-----------------|
| Websites that served impressions | Yes | Domain level |
| YouTube channels that served impressions | Yes | Channel level |
| Apps that served impressions | Yes | App level |
| Click data per placement | No | Not available |
| Conversion data per placement | No | Not available |
| Channel allocation (Search/Shopping/Display/Video/Gmail/Discover) | Yes | Spend and impression distribution |

**Limitations:**

- Impression-level data only: you cannot see clicks or conversions per individual placement
- No placement targeting: you cannot specify where PMax should serve
- Exclusions are account-level only: you cannot exclude placements at the PMax campaign level
- Channel allocation data is available in the interface and via the API

> 💡 **Use scripts for deeper PMax insights:** Mike Rhodes' channel distribution script provides more granular breakdowns of spend allocation across PMax channels than the default interface.

### PMax placement data sources

PMax placement data is accessible through multiple channels, each with different depth.

| Data source | What it provides | Access method |
|-------------|-----------------|---------------|
| PMax Insights tab | Websites, channels, apps with impressions (no clicks/conversions) | Google Ads UI |
| `performance_max_placement_view` (GAQL) | PMax placement data including display name, placement type, target URL, impressions | Google Ads Scripts or API |
| `group_content_suitability_placement_view` (GAQL) | Content suitability placement data across all campaign types (including PMax) | Google Ads Scripts or API |
| Account-level exclusion lists | Only exclusion mechanism available for PMax | Google Ads UI or API |

> ⚠️ **Script-based analysis is essential for PMax at scale:** The UI shows placements but provides no filtering, scoring, or automated flagging. For accounts with 3+ PMax campaigns, use Google Ads Scripts to pull placement data via the GAQL resources above and apply domain quality and TLD risk checks programmatically.

---

## Demand Gen placements

Demand Gen campaigns serve across YouTube, Discover, and Gmail with format-specific placements.

| Channel | Placement | Format |
|---------|-----------|--------|
| YouTube | Home feed | Image, video, carousel |
| YouTube | Watch Next | Image, video |
| YouTube | Shorts | Vertical video |
| YouTube | In-stream | Skippable video |
| YouTube | Search results | Image, video |
| Discover | Discover feed | Image, carousel |
| Gmail | Promotions tab | Image |
| GDN | Publisher websites | Image, video |

**Demand Gen placement controls:**

| Control | Available |
|---------|-----------|
| Channel-level reporting | Yes |
| Placement-level reporting | Yes |
| Placement exclusions | Account, campaign, and ad group level (+ placement exclusion lists) |
| Channel opt-out | Yes (ad group level channel selection: YouTube in-stream, YouTube in-feed, YouTube Shorts, Discover, Gmail, GDN) |
| Content exclusions | Yes (standard brand safety) |

---

## Automated exclusion patterns

Use these patterns in Google Ads Scripts or third-party tools to automate placement hygiene.

### Flag for exclusion

| Pattern | Threshold | Likely cause |
|---------|-----------|-------------|
| High impressions, zero clicks | 1,000+ impressions, 0 clicks | Bot traffic or invisible ad slots |
| Abnormally high CTR | CTR > 10% | Flag for manual review: may indicate accidental clicks or click fraud, but can also be legitimate (strong creative, niche placement) |
| Suspicious domain patterns | Many numbers in URL, very long URLs | Low-quality ad networks |
| Consistently high CPA | CPA > 3x campaign average with 100+ clicks | Poor placement quality |
| TLD concentration analysis | Aggregate spend/conversions by TLD, flag TLDs with zero conversions across 3+ domains | Systemic low-quality TLD cluster |
| Domain anatomy scoring | Flag domains matching 2+ structural or intent patterns (see domain quality signal framework below) | Programmatically generated or MFA domain |
| YouTube channel authority check | Flag channels with suspicious age, upload pattern, or subscriber ratio (see YouTube quality signal framework below) | Content farm or ad-revenue-only channel |
| YouTube audience flag | Flag videos with language mismatch or madeForKids status | Wrong audience or restricted ad formats |

> ⚠️ **Always review before excluding:** Automated flags catch patterns, not context. A placement with 0 clicks might be a new high-quality site that has not had enough time. A placement with high CTR might be a high-quality niche site with engaged users, not click fraud. Never auto-exclude based on thresholds alone: review every flagged placement before adding it to exclusion lists.

---

## TLD risk evaluation framework

Top-level domains (TLDs) carry placement quality signals. Rather than maintaining a static watchlist of "bad" TLDs, evaluate any TLD using three lenses.

### Lens 1: Registration economics

The cost and difficulty of registering a domain on a TLD determines the barrier to abuse. Lower barriers attract more disposable, low-quality domains.

| Barrier tier | Characteristics | What this means for placement quality |
|--------------|----------------|---------------------------------------|
| Regulated | Registry-enforced requirements (`.edu`, `.gov`, `.bank`, `.law`) | Very low risk: domain ownership is verified by the registry |
| Standard | Moderate registration cost ($8-15/year): `.com`, `.net`, `.org`, established ccTLDs | No inherent signal: quality depends entirely on the domain owner |
| Low barrier | Cheap gTLDs under $5/year (many gTLDs launched after 2012) | Elevated risk: low cost creates minimal barrier to disposable domain creation |
| Near-zero barrier | Historically free or near-free registration (certain African ccTLDs used by free domain services) | High risk: attracts domain squatters, ad arbitrage operators, and phishing sites |

### Lens 2: Purpose alignment

The intended purpose of a TLD indicates whether legitimate publishers are likely to use it.

| TLD category | Placement quality signal |
|--------------|------------------------|
| General-purpose (`.com`, `.net`, `.org`) | Neutral: evaluate the domain, not the extension |
| Geographic ccTLDs for target market (`.nl`, `.de`, `.co.uk`, `.fr`, `.be`) | Equivalent to `.com` for that market |
| Industry-specific gTLDs (`.shop`, `.tech`, `.health`, `.store`) | Moderate: legitimate businesses use these, but so do thin-content operators |
| Action/verb gTLDs (`.click`, `.download`, `.stream`, `.bid`, `.win`, `.loan`) | Elevated: TLD name implies user action, correlates with ad arbitrage and spam |
| Vanity/novelty gTLDs (`.xyz`, `.top`, `.space`, `.site`, `.online`, `.buzz`) | Elevated: disproportionately represented in made-for-advertising ecosystems |
| Regulated/restricted (`.edu`, `.gov`, `.bank`) | Low risk: registry-level verification required for ownership |

### Lens 3: Account-specific TLD concentration analysis

Static TLD lists go stale. The most actionable approach is analyzing your own account data.

1. Extract the TLD from every placement URL in the account
2. Group placements by TLD
3. Calculate total spend and total conversions per TLD
4. Flag any TLD where total spend exceeds a meaningful threshold AND conversion count is zero across 3+ distinct domains

This approach adapts to any advertiser's market. A `.ru` domain is suspicious for a Dutch ecommerce account but perfectly normal for a Russian advertiser. Account-level data resolves that ambiguity automatically.

> 💡 **Script pattern:** A weekly script that aggregates placement spend by TLD and flags zero-conversion TLD clusters catches systemic waste that per-placement review misses.

---

## Domain and URL quality signal framework

Beyond the TLD, the domain name itself and the full URL structure carry quality signals. This four-layer framework scores placement domains from surface-level structure to deeper authority indicators.

### Layer 1: Structural patterns

| Signal | What to look for | Why it matters |
|--------|-----------------|----------------|
| Character composition | High consonant-to-vowel ratio, excessive non-alphabetic characters | Legitimate domains are pronounceable: programmatic registrations are not |
| Subdomain depth | 3+ subdomain levels (`ads.tracker.sub.domain.com`) | Deep subdomains indicate ad-serving infrastructure, not editorial content |
| Domain length extremes | SLD under 3 or over 25 characters | Extremes correlate with throwaway or keyword-stuffed domains |
| Repetitive character patterns | Same character 3+ times consecutively | Typosquatting or auto-generated domains |
| Internationalized encoding | Domain uses punycode (`xn--`) | Can indicate legitimate international sites or deceptive lookalike domains |

### Layer 2: Intent patterns

| Signal | What to look for | Why it matters |
|--------|-----------------|----------------|
| Keyword density | 3+ concatenated dictionary words in the SLD (`bestcheaponlinedealsnow`) | Hallmark of programmatic registration for ad arbitrage |
| Monetization-intent terms | Domain name signals ad-revenue purpose rather than editorial purpose | Site likely exists to display ads, not serve an audience |
| Brand proximity | Domain within 1-2 edit distance of the advertiser's brand or major industry brands | Possible typosquatting or brand impersonation |

### Layer 3: URL path signals

| Signal | What to look for | Why it matters |
|--------|-----------------|----------------|
| Path depth | 5+ directory levels or random-looking path segments | Ad-serving infrastructure or dynamically generated pages |
| Tracking parameter density | 4+ query parameters with tracking-style names (`utm_`, `ref=`, `aff=`, `sub1=`) | Page is primarily a traffic routing endpoint, not a content destination |
| Dynamic generation indicators | URLs with numeric IDs, session tokens, or randomized paths | Programmatically generated content pages |

### Layer 4: Domain authority (advanced, requires third-party data)

| Signal | What to look for | Why it matters |
|--------|-----------------|----------------|
| Domain authority score | DR/DA below 10-15 (via Ahrefs, Moz, SE Ranking) | Very low authority sites receiving ad spend warrant manual review |
| Organic traffic estimation | Zero estimated organic traffic | Site is not attracting real audiences through content quality |

> ⚠️ **Layer 4 requires paid third-party tools.** Layers 1-3 can be checked via Google Ads Scripts using the placement URL data alone. Layer 4 adds precision but is optional.

A placement matching signals in 2+ layers warrants manual review. A placement matching signals in 3+ layers is a strong exclusion candidate.

---

## YouTube placement quality signal framework

YouTube video and channel placements carry quality signals beyond basic performance metrics. This four-dimension framework scores YouTube placements from channel-level authority down to audience relevance.

### Dimension 1: Channel authority

| Signal | What to check | Interpretation |
|--------|--------------|----------------|
| Channel age | Creation date via YouTube Data API | Channels under 90 days old already serving high ad volume are suspicious |
| Upload pattern | Total video count vs channel age | Hundreds of uploads within days suggests automated content farming |
| Subscriber-to-video ratio | Total subscribers / total videos | Many videos with few subscribers indicates an ad-revenue operation, not a genuine audience |
| Topical coherence | Topic spread across the channel's videos | Wildly unrelated topics (cooking, crypto, car repair, gaming on one channel) indicates a content farm |

### Dimension 2: Engagement quality

| Signal | What to check | Interpretation |
|--------|--------------|----------------|
| View-to-subscriber ratio | Video views / channel subscribers | Extreme ratios suggest algorithmic or viral distribution rather than organic audience |
| Comment activity | Comments enabled + comment count relative to views | Comments disabled or zero comments despite thousands of views suggests passive or bot-driven viewership |
| Like-to-view ratio | Total likes / total views | Below 1% across multiple videos on a channel suggests a disengaged audience |

### Dimension 3: Content classification

| Signal | What to check | Interpretation |
|--------|--------------|----------------|
| Video duration | Length category: Shorts (<60s), standard (2-20min), long-form (20min+) | Different audience behaviors and ad format availability per duration category |
| Title quality indicators | Excessive capitalization (10+ consecutive uppercase), punctuation patterns (!! ??), sensational phrasing | Low editorial standards correlate with low-quality content environments |
| Category alignment | YouTube-assigned category vs actual content topic | Mismatched categorization (labeled "Education" but content is entertainment) suggests gaming the system |

### Dimension 4: Audience relevance

| Signal | What to check | Interpretation |
|--------|--------------|----------------|
| Content language | `defaultLanguage` and `defaultAudioLanguage` metadata fields | Language mismatch with target market equals audience mismatch |
| Audience setting | `madeForKids` status flag | Wrong audience for most B2B/B2C advertisers, restricted ad formats apply |
| Geographic audience (if available) | Audience geography via YouTube Analytics API | 90%+ viewership from outside the target market means ads are serving the wrong audience |

> 💡 **Manual vs. automated review:** Dimensions 1 and 4 are accessible via the YouTube Data API and can be checked programmatically with Google Ads Scripts. Dimensions 2 and 3 require a mix of API data and manual spot-checking for the top 10-20 video placements by spend.

---

## Minimum data thresholds

Do not make placement decisions with insufficient data. Use these minimums before taking action.

| Action | Minimum data required | Why |
|--------|----------------------|-----|
| Exclude a placement | 1,000+ impressions OR 100+ clicks | Smaller samples produce unreliable metrics |
| Evaluate CPA/ROAS | 100+ clicks on that placement | CPA/ROAS with <100 clicks is statistically meaningless |
| Judge conversion rate | 30+ days of data | Short windows miss delayed conversions |
| Compare to campaign average | Same date range, same attribution | Apples-to-apples comparison only |
| Flag for bot traffic | 1,000+ impressions with 0 clicks | Lower thresholds flag too many new placements |

---

## Decision guide: Placement action by data

```
Does the placement have 1,000+ impressions?
|
+-- NO --> Do nothing. Insufficient data.
|
+-- YES --> Does it have any clicks?
            |
            +-- NO --> Flag for exclusion (likely bot traffic or invisible slot)
            |
            +-- YES --> Is CTR > 10%?
                        |
                        +-- YES --> Flag for manual review (may be accidental/fraudulent clicks, verify before excluding)
                        |
                        +-- NO --> Does it have 100+ clicks?
                                   |
                                   +-- NO --> Monitor. Not enough click data yet.
                                   |
                                   +-- YES --> Is CPA > 3x campaign average?
                                               |
                                               +-- YES --> Exclude placement
                                               |
                                               +-- NO --> Is CPA < campaign average?
                                                          |
                                                          +-- YES --> Keep. Good performer.
                                                          |
                                                          +-- NO --> Monitor. Average performer.
```

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| No placement exclusions set | Ads serve on parked domains, MFA sites, mobile games | Set account-level exclusions before launching |
| Excluding placements with <100 clicks | Premature decisions based on insufficient data | Wait for minimum thresholds before acting |
| Never reviewing placement reports | Poor placements accumulate spend silently | Review placement reports weekly for Display/Video |
| Ignoring PMax placement data | Unaware of low-quality PMax placements | Check PMax Insights > Placements monthly |
| Keeping mobile apps enabled | Majority of clicks are accidental | Exclude all app categories by default |
| Optimizing to view-through conversions | Inflated attribution from passive impressions | Track view-throughs for awareness, optimize to click-through only |
| Setting brand safety to Expanded | Ads appear alongside sensitive content | Use Standard minimum, Limited for brand-sensitive accounts |
| Excluding placements one by one per campaign | Duplicated effort, inconsistent exclusions | Use shared account-level exclusion lists |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Content Targeting Reference](../references/Content Targeting Reference.md) | Companion: targeting methods for WHERE ads appear |
| [Frequency Capping Reference](../references/Frequency Capping Reference.md) | Companion: controlling HOW OFTEN users see ads |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Framework: campaign tier structure and placement context |

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
