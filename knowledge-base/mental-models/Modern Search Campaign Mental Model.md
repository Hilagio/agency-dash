# Modern Search Campaign Mental Model
Created: 2026-02-04

Support_ID: MENTALMODEL_23
Category: Strategy
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Mental Model
Agent_Readable: Yes
Status: Done

## Purpose

This mental model defines the overarching philosophy for building and running Search campaigns in the age of smart bidding and semantic matching. It answers the core question: how do modern search behavior, smart bidding, consolidation, and creative themes interact to produce the best results?

> This is the "why" behind every Search structure decision. The downstream mental models ([Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md), [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md)) handle the "how" of campaign and ad group structure.

---

## What this is / What this is NOT

**This mental model:**

- Defines the three golden rules of modern Search
- Explains how search behavior evolution forces structural adaptation
- Maps the relationship between bidding strategy, match types, and structure
- Provides the strategic framework that downstream structure, targeting, and keyword decisions inherit

**This mental model does NOT:**

- Explain campaign-level segmentation logic (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Explain ad group-level grouping logic (See: [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md))
- Provide match type syntax or behavior specs (See: [Match Type Reference](../references/Match Type Reference.md))
- Cover keyword research methodology (See: [SOP – Research Keywords](../sops/SOP – Research Keywords.md))
- Cover bidding strategy selection mechanics (See: [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md))

---

## The core framework

Modern Search operates on three golden rules that interact as a system:

| Rule | Principle | Why it matters |
|------|-----------|----------------|
| **1. Consolidate by default** | Combine traffic into fewer campaigns and ad groups unless you have a valid business reason to split | Smart bidding optimizes at the query level, not the campaign level. More data per unit = faster learning, better consistency, lower marginal CPA |
| **2. One ad group per creative theme** | Group keywords by the message they need, not by keyword similarity | RSAs serve the user: if one RSA can credibly serve all keywords, they belong together. Split only when messaging diverges fundamentally |
| **3. Match types follow bidding strategy** | Your bidding strategy determines which match types are appropriate, not the other way around | Broad match + smart bidding (tCPA/tROAS) is the default when sufficient data exists. Phrase/exact match is for new accounts, low-volume campaigns, constrained budgets, niche B2B verticals, or non-smart-bidding setups |

> These three rules are not independent. Consolidation requires broad match to capture volume. Broad match requires smart bidding to control efficiency. Smart bidding requires consolidated data to optimize. The system is circular.

---

## Why the old playbook stopped working

Search behavior has evolved fundamentally. The tactics that dominated 2015-2020 (SKAGs, match type ad groups, funnel segmentation) assumed syntax-based matching and manual control. Neither assumption holds today.

### Search behavior evolution

| Era | Search behavior | Advertiser response | Limitation |
|-----|----------------|--------------------|-----------|
| **Early (pre-2016)** | Short-tail, simple queries ("pasta recipe") | Exact match, SKAGs, manual CPC | Worked because query space was small and predictable |
| **Mid (2016-2020)** | Growing long-tails, synonym usage, mobile growth | Phrase match, expanded text ads, funneling structures | Query space expanded faster than keyword lists could cover |
| **Modern (2021+)** | 4+ word queries growing 26% YoY, semantic intent, voice search, hyper-specific queries | Broad match + smart bidding, RSAs, consolidated structures | Manual approaches cannot cover the query space; algorithm must do the matching |

### What changed inside Google Ads

| Change | Old behavior | New behavior | Impact |
|--------|-------------|-------------|--------|
| **Keyword matching** | Syntax-based: words must appear in order | Semantic-based: intent matching using meaning | Phrase and exact match already expand to close variants and synonyms |
| **Bidding** | Manual CPC, bid per keyword | Smart bidding at auction level, query-level signals | Algorithm knows things you cannot see (user history, location, device, time) |
| **Ad format** | Static expanded text ads (3 headlines, 2 descriptions) | RSAs with 15 headline slots, machine-assembled per auction | One RSA covers multiple angles without splitting ad groups |
| **Performance data** | Visible at keyword level | Asset-level performance data needs volume to be actionable | Fragmentation kills your ability to optimize creatives |

---

## How the three rules interact

```
                    ┌─────────────────────┐
                    │  CONSOLIDATE        │
                    │  BY DEFAULT         │
                    └──────────┬──────────┘
                               │
                    Consolidation requires
                    volume to feed learning
                               │
              ┌────────────────┴────────────────┐
              │                                 │
              ▼                                 ▼
┌─────────────────────────┐      ┌─────────────────────────┐
│  MATCH TYPES FOLLOW     │      │  ONE AD GROUP PER       │
│  BIDDING STRATEGY       │◄────►│  CREATIVE THEME         │
└─────────────────────────┘      └─────────────────────────┘
   Broad match + tCPA/tROAS         Fewer ad groups = more
   captures maximum volume          data per RSA = faster
                                    creative optimization
```

### The virtuous cycle

1. **Consolidate campaigns** to maximize data per bidding strategy
2. **Use broad match** paired with smart bidding to capture the full query space
3. **Group by creative theme** so one RSA serves all related keywords credibly
4. **Fewer ad groups** means each RSA reaches 1,000+ impressions/week faster
5. **Asset-level data** becomes actionable, enabling creative optimization
6. **Better creatives** improve Quality Score, CTR, and conversion rates
7. **Higher conversion volume** feeds back into smart bidding, improving efficiency
8. **Better efficiency** allows broader targeting, completing the cycle

### The fragmentation death spiral (what happens when you break the rules)

1. Over-segment campaigns and ad groups
2. Each unit has insufficient conversion data
3. Smart bidding cannot learn, stays in "Learning" status
4. Asset-level data is too thin for creative optimization
5. Creative optimization becomes impossible
6. Quality Score and CTR suffer
7. Higher CPCs, lower volume, worse efficiency
8. Response: segment further "for more control" (making it worse)

---

## The bidding-match type matrix

Your bidding strategy determines your match type. Not the other way around.

| Goal | Bidding strategy | Match type | Why |
|------|-----------------|------------|-----|
| **Maximize conversions at target efficiency** | tCPA or tROAS | Broad match (with exceptions below) | Broad match + smart bidding captures the full relevant query space. The efficiency target constrains waste. This is the default for modern Search when sufficient data exists |
| **Maximize conversions (no target)** | Max Conversions / Max Conv. Value | Phrase + Exact match | Without an efficiency target, broad match gives the algorithm unconstrained spending. Phrase/exact restrict the query space instead |
| **Maximize traffic** | Max Clicks (with CPC cap) | Phrase + Exact match | Broad match with click-based bidding wastes budget on irrelevant queries. No conversion signal to guide targeting |
| **Maximize visibility** | Target Impression Share (with CPC cap) | Phrase + Exact match | Same principle: no conversion signal means broad match overspends on loosely related queries |

> The critical insight: broad match is safe *only when paired with conversion-based smart bidding, a competitive efficiency target, AND sufficient historical data*. Without that safety net, broad match wastes budget.

### When NOT to use broad match (even with smart bidding)

Broad match + tCPA/tROAS is the default, but these exceptions require starting with exact and/or phrase match:

| Exception | Why broad fails here | What to do instead |
|-----------|---------------------|--------------------|
| **New account (no conversion history)** | Smart bidding has no query-level data to learn from. Broad match generates waste while the algorithm explores blindly | Start with exact/phrase match. Migrate to broad via a 50/50 campaign experiment after 2-3 months of conversion data |
| **Low-volume campaigns/accounts** | Smart bidding needs 30+ conversions/month (tCPA) or 50+ (tROAS) to optimize effectively. With low volume, broad match amplifies noise instead of finding marginal conversions | Use exact/phrase match to concentrate spend on known high-intent queries. Test broad match later via campaign experiment |
| **Limited budget** | Broad match expands the query space, but a limited budget cannot afford irrelevant clicks while the algorithm learns. You need to be sure you are buying into the right relevant traffic | Use exact/phrase match to control traffic relevance and temperature. Broad match becomes viable when budget increases or data proves efficiency |
| **Extremely niche B2B verticals** | Keywords are highly predictable and the search space is narrow. Broad match produces mostly irrelevant queries with low incremental uplift | Use exact/phrase match. The query space is small enough to cover manually. Test broad match with a 50/50 experiment to measure incremental value |

> 💡 **The path to broad match:** Start restrictive (exact/phrase), accumulate conversion data, then test broad match via a 50/50 campaign experiment. If the experiment shows incremental conversions at acceptable CPA/ROAS, roll out broad match. If not, keep exact/phrase.

> For complete match type mechanics: See [Match Type Reference](../references/Match Type Reference.md)
> For bidding strategy selection: See [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md)
> For efficiency target calculation: See [Bid Targets Reference](../references/Bid Targets Reference.md)

---

## Broad match signals: the unfair advantage

Broad match uses four signals that phrase match and exact match do not:

| Signal | What it does | Example |
|--------|-------------|---------|
| **Landing page content** | Algorithm reads your landing page to understand context | Page about "CRM for small business" helps match queries about "simple customer management software" |
| **Other keywords in the ad group** | Algorithm uses sibling keywords to understand theme | Having "crm software" and "crm platform" in the same ad group clarifies the intent cluster |
| **User's previous searches** | Algorithm considers the user's recent search history | User who previously searched "Samsung Frame TV review" gets matched when searching the more generic "smart TV" |
| **User location** | Algorithm uses geographic context for relevance | "plumber" query near Amsterdam matches your "plumber amsterdam" broad keyword without needing the city name in the query |

This is why ad group theming matters for broad match: the other keywords in the ad group are a signal. Poorly themed ad groups send confusing signals to the algorithm.

---

## The creative theme principle

Ad groups exist for one purpose: to serve the right message to the right query. This is the creative theme principle.

### What defines a creative theme

A creative theme is a group of keywords that can be served by a single RSA without any headline or description feeling generic or mismatched.

| Test | How to apply it |
|------|----------------|
| **The Single Ad Test** | List the top 10 keywords in the proposed ad group. Can one RSA (7-8 headlines) credibly serve all of them? If yes, they belong together. If no, identify the divergence type and split |

### Volume requirements

Creative themes need data to optimize:

| Metric | Threshold | Why |
|--------|-----------|-----|
| **Asset-level data** | 1,000 impressions/week (4,000/month) per ad group | Below this, asset performance data is too sparse for creative iteration |
| **Smart bidding learning** | 30 conversions/month per campaign (tCPA), 50/month (tROAS) | Below this, bidding stays in "Learning" and performs inconsistently |

> For the complete volume framework: See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md)

---

## Failure modes

| Failure mode | Symptoms | Root cause | Fix |
|-------------|----------|------------|-----|
| **Over-segmentation** | Campaigns stuck in "Learning", inconsistent performance, management overhead, targets rarely hit | Too many campaigns/ad groups, each with insufficient data | Consolidate campaigns aggressively. Use portfolio bid strategies as a consolidation hack when you need separate budgets but shared learning |
| **Under-segmentation** | Budget consumed by wrong services/intents, cannot set different targets for different margins, brand and non-brand blended | All traffic in one campaign when business needs differ | Split only where budget, target, or conversion goal needs diverge. Use the Campaign Structure MM for valid segmentation reasons |
| **Wrong match type for bidding** | Broad match spending wildly on irrelevant queries, or exact match missing 80% of query volume | Match type and bidding strategy are mismatched | Apply the bidding-match type matrix above. Broad match is only safe with conversion-based smart bidding + competitive targets |
| **Keyword-driven structure** | Ad groups split by keyword similarity (synonyms, variants) instead of messaging need | Legacy SKAGs thinking applied to modern architecture | Restructure around creative themes using the Single Ad Test. Use DKI and customizers to handle keyword variation within one RSA |
| **Funnel-based campaigns** | Elaborate see/think/do campaign structures with heavy internal negative keyword management | Attempting to manually route intent when the algorithm handles this at auction level | Consolidate. Smart bidding uses user signals (previous searches, browsing history) that you cannot access. Let the algorithm route intent |

---

## Practical application: modern Search setup sequence

### Stage 1: Set your bidding foundation

Before any keyword or structure decision, determine your bidding strategy. The bidding strategy dictates everything downstream.

| Decision | If yes | If no |
|----------|--------|-------|
| Do you have clear efficiency targets (CPA/ROAS)? | tCPA or tROAS | Max Conversions or Max Conv. Value |
| Are you using tCPA/tROAS with sufficient data? | Broad match is your default (check exceptions above) | Phrase/exact match is your default |
| Do you have sufficient conversion volume (30+/month)? | Use campaign-level bidding | Consider portfolio bid strategy across campaigns |

> For bidding strategy selection: See [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md)

### Stage 2: Build your keyword foundation

Research keywords across your business, then cluster them by creative theme, not by keyword similarity or match type.

| Step | Action | Output |
|------|--------|--------|
| Research | Use Keyword Planner, STR, competitor tools, ChatGPT | Raw keyword list with volume and CPC data |
| Cluster | Group by creative theme: can one RSA serve this cluster? | Themed keyword groups with intent labels |
| Prioritize | Color-code: green (include), orange (doubtful), red (irrelevant) | Prioritized keyword set ready for structure |

> For keyword research: See [SOP – Research Keywords](../sops/SOP – Research Keywords.md)
> For keyword clustering: See [SOP – Cluster and Map Keywords](../sops/SOP – Cluster and Map Keywords.md)

### Stage 3: Design your structure

Apply the campaign and ad group mental models to map keyword clusters into campaigns and ad groups.

| Level | Guided by | Key question |
|-------|-----------|--------------|
| **Campaign** | [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Do I need different budget, bid strategy, targets, or conversion goals? |
| **Ad group** | [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Can one RSA credibly serve all keywords? (Single Ad Test) |

### Stage 4: Launch and optimize

| Phase | Focus | Key reference |
|-------|-------|---------------|
| Pre-launch | Validate structure against checklists | Search Campaign Launch Checklist |
| Week 1-2 | Monitor learning period, do not change targets | [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) |
| Week 3-4 | Analyze STR, add negatives, promote performing search terms | [SOP – Analyze Search Term Reports](../sops/SOP – Analyze Search Term Reports.md) |
| Ongoing | Creative iteration, negative keyword maintenance, structure review | [SOP – RSA Testing with The Iteration Loop](../sops/SOP – RSA Testing with The Iteration Loop.md) |

---

## Key principles

1. **Structure serves bidding, not the reverse:** Your campaign structure exists to give smart bidding the best possible data environment. Every structural decision should be evaluated through this lens.
2. **Consolidate by default:** Only segment when there is a concrete business reason: different budget, different target, different conversion goal, different geo/language needs.
3. **One ad group per creative theme:** The Single Ad Test determines grouping. DKI, customizers, and keyword-level URLs solve most variation without splitting.
4. **Match types follow bidding strategy:** Broad match + tCPA/tROAS is the modern default when the account has sufficient conversion history. Phrase/exact are for new accounts, low-volume campaigns, constrained budgets, niche B2B verticals, or non-conversion-based strategies. Test broad match via 50/50 campaign experiments before committing.
5. **Feed the algorithm, do not fight it:** Smart bidding sees signals you cannot (user history, location context, browsing behavior). Let it optimize at auction level.
6. **Volume enables everything:** Asset-level data needs 1,000+ impressions/week. Smart bidding needs 30+ conversions/month. Fragmentation kills both.
7. **Free up time for higher-impact work:** Simplified structure reduces management overhead. Invest freed time in offer optimization, landing page improvement, and conversion rate optimization, as these compound with bidding power.
8. **Complexity may impress, but simplicity coupled with AI impresses upon results:** The edge is no longer in structural tricks. It is in data quality, conversion rates, and creative excellence.

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Downstream: when and why to segment campaigns |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Downstream: when and why to segment ad groups |
| [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md) | Downstream: DSA as complementary targeting within modern Search |
| [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md) | Reference: DSA targeting option specs, page feed format, custom labels |
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | Downstream: AI-driven automation option within Search campaigns |
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | Reference: AI Max feature specifications and settings |
| [Bidding Strategy Mental Model](../mental-models/Bidding Strategy Mental Model.md) | Upstream: bidding strategy determines match type and structure approach |
| [Match Type Reference](../references/Match Type Reference.md) | Reference: match type syntax, behavior, and keyword selection hierarchy |
| [Bid Strategy Selection Reference](../references/Bid Strategy Selection Reference.md) | Reference: bidding strategy mechanics and requirements |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference: volume requirements for bidding and RSA learning |
| [Smart Bidding Mechanics Reference](../references/Smart Bidding Mechanics Reference.md) | Reference: how smart bidding works at auction level |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Guideline: match type selection based on bidding and budget |
| [SOP – Research Keywords](../sops/SOP – Research Keywords.md) | Execution: keyword research workflow |
| [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) | Execution: campaign construction workflow |

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
