# AI Max for Search Mental Model
Created: 2026-02-04
Updated: 2026-10-05

Support_ID: MENTALMODEL_22
Status: Done
Reference Type: Mental Model
Agent_Readable: Yes
Human_Facing: Yes
Category: Strategy
Domain: Search
Pillar: 6

## Purpose

This mental model helps you decide whether to keep AI Max for Search on and how to configure it, understanding both the control trade-offs and the reporting realities that affect how you evaluate performance.

> ⚠️ **Decide deliberately, configure defensively, interpret reports skeptically.** AI Max is Google's default direction for Search. That does not mean accept the defaults. The default configuration cedes significant control to Google, and AI Max reporting can make performance look better than it actually is. Your job is to run it on your terms, not Google's.

---

## What this is / What this is NOT

**This mental model:**

- Explains what AI Max actually is (keywordless matching and final URL expansion built into Search campaigns)
- Reveals the reporting reality: how AI Max attribution can mislead
- Provides the framework for evaluating whether to keep AI Max on and how to configure it
- Maps the risk profile of each AI Max feature
- Recommends the escalating experimentation sequence (broad match → search term matching → final URL expansion) and where a campaign enters it
- Identifies when to hold back

**This mental model does NOT:**

- Document the technical mechanics of each feature (See: [AI Max for Search Reference](../references/AI Max for Search Reference.md))
- Provide step-by-step setup instructions (See: [SOP – Configure AI Max for Search](<../sops/SOP – Configure AI Max for Search.md>))
- Cover final URL expansion controls and page feed syntax (See: [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>))
- Explain general match type behavior (See: [Match Type Reference](../references/Match Type Reference.md))

---

## What AI Max actually is

AI Max is not a new campaign type. It is a suite of AI-powered features added to existing Search campaigns:

| What it is | What it is NOT |
|------------|---------------|
| An add-on to standard Search campaigns | A standalone campaign type like PMax |
| Keywordless matching and final URL expansion built into Search | A replacement for keyword-based targeting |
| Optional features you can toggle individually | An all-or-nothing switch |
| Steerable with an AI Brief (messaging, matching, and audience instructions) | A black box you cannot guide |

> ⚠️ **AI Max is on by default for new Search campaigns.** Google enables it at creation, so the live question is not whether to adopt AI Max but whether to keep it on. Every new campaign starts at the top of the sequence below rather than the bottom, and a build that is not audited inherits Google's configuration instead of yours. Check the setting when the campaign is created and decide deliberately.

> 💡 **Three triggers put a campaign on Google's auto-upgrade path into AI Max:** the campaign-level broad match setting, text customization (formerly automatically created assets), and Dynamic Search Ads. Google auto-upgrades campaigns carrying these on its announced schedule, and voluntary upgrade tools are live. Audit every account for these triggers and migrate on your own terms before Google does it for you, so you control the configuration. Google has not confirmed whether the auto-upgrade is a no-op for campaigns already running AI Max features or whether it also re-enables opt-outs you set differently. See the trigger list in [AI Max for Search Reference](../references/AI Max for Search Reference.md).

> ⚠️ **Ads in AI Overviews are a side effect, never a reason.** Serving inside AI Overviews requires broad match or keywordless targeting (AI Max, PMax, Shopping, DSA), has no opt-out, no segmented reporting, and counts as Top Ads. You cannot measure what that inventory is worth, so it cannot justify a match-type decision: adopt broad or AI Max on measured performance, and treat AI Overview serving as a free side effect. If you want AI Overview coverage without touching your Search match-type structure, a small PMax campaign is a contained side-car that buys the eligibility on its own.

### The three matching layers

With AI Max enabled, your Search campaign can match queries through three mechanisms:

| Layer | How queries match | Your control |
|-------|------------------|--------------|
| **1. Keywords** | Traditional keyword targeting (exact, phrase, broad match) | Full control via keyword selection and match types |
| **2. Asset-based matching** | Google analyzes your headlines, descriptions, and sitelinks to find related queries | Limited: you control which assets exist, but not how Google interprets them |
| **3. Landing page-based matching** | Google crawls your landing pages and matches queries related to page content | Limited: you control which pages are targeted, but not how Google interprets content |

> 💡 **The keyword is now one intent signal, not the target.** With 70%+ of queries trending long-tail and conversational and matching that reads your assets and landing pages, the keyword is no longer the hard target it once was. It remains your strongest controllable signal, but assets, landing pages, and bids now carry intent alongside it. See [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md).

---

## The reporting reality

This is the most important section in this document. AI Max reporting can make performance look better than it actually is because of how attribution works.

### AI Max takes credit for queries you already cover

When AI Max is enabled, it often shows for queries your existing keywords already cover. When this happens, AI Max gets credit for conversions you would have received anyway through your existing keywords.

| What the report shows | What actually happened |
|----------------------|------------------------|
| "AI Max drove 50 conversions" | AI Max served ads for queries your keywords also match |
| You think AI Max added incremental value | You cannot tell how many conversions were truly new |

> AI Max totals are not incremental gains. They include conversions your existing keywords would have captured without AI Max.

### Visible is not the same as incremental

AI Max traffic is reported separately: match type "AI Max" in the search terms report, plus dedicated summary rows in the keywords report. Visibility is not the problem. The problem is that reports alone cannot tell you which of those conversions are incremental, and what the AI Max rows contain depends on your keyword structure:

| Setup | What the AI Max rows contain |
|-------|------------------------------|
| Exact/phrase keywords + AI Max enabled | Broad match expansion of your keywords plus keywordless matches, blended. Much of this traffic your own keywords would have won if they had been broad match |
| Broad match keywords + AI Max enabled | Almost purely keywordless matches: broad keywords leave the broad expansion arm minimal room to expand |

The result: on a broad match baseline the AI Max rows are interpretable (they are the keywordless arm), and incrementality is measured with an experiment, not read from reports.

### Two arms of search term matching

Search term matching expands reach through two distinct arms. The search term match source report splits them so you can see which is doing the work:

| Arm | What it does | Where uplift concentrates |
|-----|-------------|---------------------------|
| **Broad match arm** | Expands your keywords to broad match behavior | Accounts heavy on exact/phrase see the bigger lift here (more expansion headroom) |
| **Keywordless arm** | Matches queries from landing page and ad group content (assets + keywords), with no keyword string at all | Accounts already running broad match see more lift here, since broad already covers the keyword arm |

The keywordless arm reads both your landing page content and your ad group content (assets and keywords), giving it a broader relevance universe than legacy page-content-only keywordless formats.

### What the hierarchy protects, and how far

Google's routing hierarchy still applies with AI Max, and it has four published tiers: an exact match keyword that matches the search term beats everything, and matching there covers the keyword's close variants. Identical phrase and broad keywords (including AI Max keywords) share the second tier with identical PMax search themes. Below those sit AI-based ad group relevance, then Ad Rank. Tier 2 is where the protection narrows: identical includes spell-corrected queries and excludes plurals, synonyms, and paraphrases. Every query outside both tiers falls to AI-based relevance and Ad Rank, where AI Max can claim it:

| Query with exact keyword [daycare near me] | What happens |
|--------------------------------------------|--------------|
| "daycare near me" | Your exact keyword wins at priority 1 |
| "daycares near me" | A plural is an exact match close variant, so your exact keyword still wins at priority 1 |

The close variants your phrase and broad keywords would otherwise absorb are where AI Max claims traffic. Run the same query against a phrase keyword "daycare near me" and "daycares near me" is not identical, so it falls to AI relevance and Ad Rank, where AI Max can claim it even from a different ad group. This makes keyword-level performance analysis unreliable at the margins when AI Max is active.

> ↪️ **For the full account-wide priority order:** See [Match Type Reference](../references/Match Type Reference.md) and [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md).

### Some search terms have no keyword attribution

With AI Max enabled, some search term report entries show a blank keyword column. These are queries that matched through landing page or asset content without any keyword association. You have no visibility into why your ad served for that query.

---

## The experimentation sequence

AI Max is designed to work with broad match and Smart Bidding. The features escalate in how much control they cede, so enable them in sequence and prove each step before the next.

The sequence starts below AI Max. Step 1 is a full broad match experiment run with AI Max off, and the three sub-features are the steps above it, tested one at a time. Where a campaign enters depends on the state it starts in:

| Campaign | Starting state | How the sequence runs |
|----------|----------------|----------------------|
| Existing campaign you want to test AI Max on | AI Max off | Already at Step 1. Run the sequence as written. No extra step, no extra cost |
| New campaign | AI Max on, with search term matching, text customization, and final URL expansion on underneath it | Turn AI Max off, then start at Step 1 |

Turning AI Max off costs one change and a learning period before the baseline is readable. It buys per-feature attribution: with the whole stack live from day one, a result tells you AI Max moved the number and nothing about which layer did it, so you cannot know which one to keep when you later need to pull one.

One rule governs every step above Step 1: whenever AI Max is on, only the feature under test is enabled and every feature above it is deselected. Turning AI Max on activates all three at once, so deselecting is an action you take in the same session. The rule holds for a new campaign and for an existing campaign you toggle on, so the starting state decides where you enter the sequence, not whether the rule applies. See Phase 2 of [SOP – Configure AI Max for Search](<../sops/SOP – Configure AI Max for Search.md>) for the toggles.

> 💡 **Google's own experiment tests every layer at once.** The AI Max experiment type activates text customization, final URL expansion, and search term matching together in the trial arm. That answers whether AI Max is net-positive as a bundle, which is a different question from which layer moved the number. Use the bundled setup for a fast go/no-go on the whole feature set. Use the sequence below when you need to know which lever earned the result, because a bundled win hides which layer to keep when you later need to pull one.

### Step 1️⃣: Test broad match first (if not already using it)

With AI Max off per the starting states above, run a proper broad match experiment before you enable anything: a 50/50 split of your current phrase/exact campaign against a broad match variant, funded well enough to reach significance, held for 6-8 weeks or until significance arrives sooner, and judged on whether broad match delivers acceptable CPA/ROAS with meaningful volume uplift. See [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) for the split mechanics.

| Experiment outcome | Next step |
|-------------------|-----------|
| Broad match performs well | Convert to broad match, then layer search term matching |
| Broad match performs poorly | Keep AI Max off: if broad match fails, AI Max will fail harder |

> 💡 **Winning means converting, not duplicating.** When broad match wins the experiment, pause the phrase and exact keywords and activate broad equivalents. Convert at the keyword level: the campaign-level broad match setting puts the campaign on the auto-upgrade path to AI Max, so only use it when that upgrade is deliberately accepted. Do not run both simultaneously: keyword duplication across match types adds no coverage and splits reporting. See [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md).

> Do not skip the broad match experiment. Adding broad match keywords solely to enable AI Max testing is backwards. The purpose of broad match is to expand reach profitably: that is the test. Search term matching is a further expansion on top of broad match.

### Step 2️⃣: Layer search term matching from a broad match baseline

Once you are running broad match successfully, turn AI Max on with search term matching as the only feature enabled: it is the logical next expansion. It can be toggled off per ad group, so if a given ad group runs phrase/exact for a reason, you can keep AI Max on at the campaign level without broadening that ad group's keywords.

| Starting point | Readiness |
|----------------|-----------|
| Phrase/exact only | Not ready: test broad match first |
| Broad match performing well | Ready: search term matching is incremental expansion |

### Step 3️⃣: Add final URL expansion when you want keywordless coverage

Final URL expansion is the keywordless layer. It is a key AI Max feature to experiment with, not a setting to avoid. Enable it deliberately and configure it defensively (ad-group URL inclusions, campaign URL exclusions, page feeds).

> 💡 **Expansion on is not the only way to serve keywordlessly.** If you want a defined keywordless URL set without open discovery, the tighter alternative is to keep final URL expansion off and use a keywordless ad group with URL inclusions only (the DSA dynamic-ad-group replacement). See the [AI Max Keywordless Configuration Catalog](../catalogs/AI Max Keywordless Configuration Catalog.md) for all setups with pros and cons.

> ⚠️ **Final URL expansion requires text customization.** When you turn on final URL expansion, text customization is required and enabled automatically. Google states: "Because you turned on final URL expansion, text customization is required. This helps match your ad headlines and descriptions with the selected landing page." You cannot run final URL expansion with text customization off, so plan to control text customization (text guidelines), not disable it.

### Isolating AI Max performance

Isolate AI Max's contribution with a 50/50 AI Max experiment. It splits traffic and budget within your existing broad match campaign: the control arm keeps AI Max off, the trial arm turns it on. The difference between arms is AI Max's contribution, and no duplicate campaign is needed (See: [Experiment Configuration Reference](../references/Experiment Configuration Reference.md)).

Test one layer at a time, mirroring the rollout sequence: prove search term matching with asset optimization held constant across the arms, then test final URL expansion in its own experiment. If the campaign already runs a keywordless URL-inclusion ad group, asset optimization stays on in both arms (the inclusions require it) and a custom experiment changes only the layer under test. See the two experiment setups in [AI Max for Search Reference](../references/AI Max for Search Reference.md).

When an experiment is not possible (budget, volume, or account constraints), fall back to comparing:

- Pre-AI Max broad match performance (baseline)
- Post-AI Max broad match performance (includes AI Max expansion)

The difference approximates AI Max's contribution, though seasonality and attribution overlap make this directional, not precise. A new campaign has no pre-AI Max period: the off window you create by turning AI Max off is the only baseline it will ever have, which is a second reason to take that step before anything else.

---

## Prerequisite: landing-page readiness

Final URL expansion and text customization read your landing-page content to select pages and generate copy. They only perform as well as the pages they read. Do not enable them on accounts with stale, thin, or unmaintained pages: the system will surface and advertise weak pages. On a new campaign both arrive on, so this is a switch-off decision rather than a hold-off decision: they go off with AI Max at the start of the sequence and stay off until the pages are ready.

> ↪️ **Before enabling final URL expansion or text customization:** confirm landing-page quality. See [LP Hierarchy Mental Model](../mental-models/LP Hierarchy Mental Model.md), [LP Quality Checklist](../checklists/LP Quality Checklist.md), and [SOP – Audit and Optimize an Existing Landing Page](<../sops/SOP – Audit and Optimize an Existing Landing Page.md>).

---

## The control trade-off

AI Max includes three core features that expand how your ads match to queries:

| Feature | What it does | Control risk | Reporting risk |
|---------|-------------|--------------|----------------|
| **Search term matching** | Matches queries based on landing pages and assets, not just keywords | 🟡 Medium: Expands beyond your keyword list, but stays thematically related | 🔴 High: Attribution overlap with existing keywords |
| **Text customization** | AI generates headlines and descriptions from your landing page, your domain, and your current ads (the AI Max successor to automatically created assets) | 🟡 Medium: Generated text may not match your brand voice or make claims you did not authorize | 🟢 Low: Reporting is straightforward |
| **Final URL expansion** | Sends traffic to dynamically selected landing pages (requires text customization on) | 🔴 High: Traffic may land on pages you did not intend to advertise | 🟢 Low: Reporting shows which URLs served |

> The fundamental risk: A focused "B2B CRM software" campaign may start bidding on generic terms like "business software" or "productivity tools" found elsewhere on your site. Google presents AI Max as a simple upgrade, but the structural impact is significant.

---

## Search term management reality

### Brand/non-brand bleeding

AI Max brand control is one campaign setting, **Branded searches**, with three modes: show ads on all relevant searches (default, no control), control with brand inclusions and exclusions, or show ads only on unbranded searches. The inclusion and exclusion lists in the controlled mode have significant limitations:

| Control | What it catches | What it misses |
|---------|-----------------|----------------|
| Brand exclusions | Exact brand name matches | Misspellings, abbreviations, word order variations |
| Brand inclusions | Exact brand name matches | Common misspellings your customers use |

**Implication:** For strict brand/non-brand separation, set Branded searches to "unbranded only" so AI Max stays off every brand Google knows. If you need selective control instead, the inclusion and exclusion lists alone are insufficient: pair them with negative keyword lists.

### Competitor query scaling

With Branded searches left on its default ("show ads on all relevant searches"), the expanded matching can aggressively scale into competitor brand queries. In observed cases, competitor traffic has become the majority of AI Max impressions for an account.

| Risk | Impact |
|------|--------|
| Branded searches left on "all relevant searches" | AI Max matches competitor brand queries because they are semantically related to your products |
| Delayed mode change | Competitor traffic accumulates before you notice, wasting budget |
| Brand/competitor campaign runs out of budget | When your dedicated brand or competitor campaign is ineligible (budget exhausted), AI Max absorbs that traffic. Keep those campaigns funded |

**Fix:** Set Branded searches to "unbranded only" (or the controlled mode with competitor brand exclusions) and add competitor brand names to negative keyword lists before the campaign serves. On a new campaign AI Max is already on, so set the brand mode and negatives at build time or turn AI Max off until they are in place. Review the search terms report within the first week.

### Negative keyword lists as primary control

Because brand controls are inexact, negative keyword lists become your primary defense:

| Control method | Use for |
|----------------|---------|
| Branded searches mode (inclusion/exclusion lists) | First layer: semantic net for obvious brand queries |
| Negative keyword lists | Second layer: precise string-level backstop for variations brand controls miss |
| Ongoing search term review | Third layer: find new variations to add to negatives |

> ↪️ **For the full brand-control matrix across AI Max and PMax:** See [Brand Separation Reference](../references/Brand Separation Reference.md).

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

---

## Campaign overlap decision

Your existing campaign setup determines whether AI Max adds value or creates redundancy. Running keyword Search, AI Max, and PMax all chasing the same queries risks internal competition and escalating CPCs.

| Your current setup | AI Max recommendation | Why |
|-------------------|----------------------|-----|
| **Full Performance Max (with assets)** | Turn AI Max off | PMax already includes search inventory with AI-driven query matching, so AI Max duplicates it |
| **Feed-only PMax (Shopping only)** | Keep AI Max on | Adds Search coverage feed-only PMax does not provide |
| **Search campaigns without keywordless coverage** | Keep AI Max on, configure defensively | Adds keywordless matching you do not currently have |
| **Search campaigns already running keywordless coverage** | Keep AI Max on | Final URL expansion is the keywordless layer going forward |

> ↪️ **For which campaign type should own which query:** See [Account Structure Orchestration Mental Model](../mental-models/Account Structure Orchestration Mental Model.md).

---

## Feature-by-feature risk assessment

### 🔴 Final URL expansion: High risk, high value

| Risk | Impact |
|------|--------|
| Traffic lands on unintended pages | Cart pages, contact pages, blog posts, outdated product pages |
| Breaks RSA pinning | Pinned headlines/descriptions ignored when different URL selected |
| Tracking template issues | Dynamic URLs can cause 404 errors if tracking not configured correctly |
| Forces text customization on | Cannot run final URL expansion with text customization disabled |

**Recommendation:** This is the keywordless layer and a key feature to experiment with. It is on from the start on a new campaign, so it goes off with AI Max at the start of the sequence and stays off until broad match and search term matching are proven, then enable it deliberately and configure it defensively: ad-group URL inclusions to steer it toward relevant pages, campaign URL exclusions to block utility pages, and page feeds for catalog-scale control. See [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>).

### 🟡 Text customization: Medium risk (manageable with text guidelines)

| Risk | Impact |
|------|--------|
| Off-brand messaging | AI-generated text may not match your brand voice |
| Unauthorized claims | AI may highlight edge cases (one clearance item, one review) as general claims |
| Promotional drift | Generated text may emphasize promotions or features you did not intend to highlight |

**Recommendation:** If you are not running final URL expansion, you can run text customization off and add it later. On a new campaign it starts on underneath AI Max, so it goes off with AI Max at the start of the sequence. If you are running final URL expansion, text customization is required and on, so control it rather than fight it: configure text guidelines first (up to 25 term exclusions and 40 messaging restrictions) to constrain generated output. Review the Asset Report regularly and remove generated assets that do not align.

### 🟡 Search term matching: Medium risk (attribution + SPN)

| Risk | Impact |
|------|--------|
| Broader query coverage | May surface queries you would not have targeted with keywords |
| Theme drift | Asset-based and landing page-based matching can extend beyond your intended focus |
| Attribution contamination | Makes it difficult to evaluate keyword performance accurately |
| Search Partner Network scaling | AI Max can route a share of impressions to Search Partners, where conversion rates are often lower than Google Search |

**Recommendation:** The most acceptable of the three for reach expansion, and the first AI Max layer to test once broad match is proven. Toggle it off per ad group where you want to protect phrase/exact control. Monitor Search Partner Network performance immediately after enabling: if SPN conversion rates are unacceptable, disable SPN for the campaign. AI Max campaigns can opt out of SPN at the campaign level (PMax can now opt out too). Normal SPN share runs roughly 3-8% of impressions: investigate spikes well above that.

---

## Control mechanisms

AI Max includes controls that were previously unavailable (or limited) in Search campaigns:

| Control | Level | Purpose | Limitation |
|---------|-------|---------|------------|
| **Search term matching opt-out** | Ad group | Disable expanded query matching for specific ad groups while keeping other AI Max features | Does not affect text customization or final URL expansion |
| **Branded searches mode** | Campaign | Govern brand serving in one setting: all relevant searches, controlled (inclusions + exclusions), or unbranded only | "Unbranded only" is the clean off-switch. The list-based controlled mode does not catch misspellings or variations |
| **Brand inclusions / exclusions** | Campaign (inclusions also ad group) | Inside controlled mode, allow specific brands (inclusions) or block them (exclusions), with exclusion winning on conflict | Does not catch misspellings or variations |
| **URL exclusions** | Campaign | Block specific URLs from serving as landing pages (requires Final URL expansion enabled) | None |
| **URL inclusions** | Ad group | Define the URL set an ad group serves as dynamic landing pages: only those with final URL expansion off, those plus expansion with it on | Requires text customization (asset optimization) on, which is campaign-level |
| **Locations of interest** | Ad group | Target users based on geographical intent in keywordless matches | AI Max exclusive |

> These controls are only available when AI Max is enabled. The ad-group-level controls (search term matching opt-out, brand inclusions, URL inclusions, locations of interest) provide more granular management than was previously available. Supplement brand controls with negative keyword lists for thorough coverage.

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
| Running PMax without assets (feed-only) | Need Search coverage, AI Max provides it |
| Want brand-level control in Search (the Branded searches modes) | Brand controls unlock when AI Max is enabled |
| Large site with well-optimized pages | Landing page-based matching benefits from comprehensive, quality page inventory |
| Comfortable with attribution ambiguity | Understand that AI Max reporting is not incremental and can live with it |

### Poor candidates

| Situation | Why AI Max does not fit |
|-----------|------------------------|
| Running phrase/exact match for control | AI Max expands beyond controlled match types: use the per-ad-group search term matching opt-out to protect those ad groups |
| High lost impression share due to budget + mostly exact/phrase keywords | AI Max may reallocate budget from top-performing keywords to lower-performing expanded queries |
| Campaigns requiring strict keyword focus | AI Max introduces query expansion you cannot fully control |
| Brand-sensitive messaging requirements | Text customization may generate off-brand copy |
| Complex tracking template setups | Final URL expansion may break tracking on dynamic URLs |
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

## When to hold back

| Situation | Alternative approach |
|-----------|---------------------|
| Regulated industries with strict ad copy requirements | Use keyword campaigns with manual RSAs, keep text customization off until final URL expansion is genuinely needed |
| Campaigns optimizing for specific landing page experiences | Keep final URL expansion off and use keyword-level final URLs |
| New accounts without conversion history | Build conversion data with focused keyword campaigns first |
| Phrase/exact match strategy for tight control | Use the per-ad-group search term matching opt-out rather than disabling AI Max entirely |
| Need accurate keyword-level performance data | AI Max makes keyword performance analysis unreliable |
| Budget-constrained campaigns with optimized exact/phrase keywords | AI Max may reallocate budget to lower-performing queries |

> ⚠️ **On a new campaign, holding back means switching off.** Every alternative above assumes the feature is not running yet, which is true only for a campaign that has AI Max off. A new campaign already serves with AI Max on and all three sub-features under it, so holding back is an action, not a choice you postpone.

---

## Keywordless coverage: how to think about it

AI Max gives you several ways to serve keywordlessly or to steer which landing pages serve. They vary on two axes:

- Final URL expansion on (open discovery, Google picks any relevant page) or off (scoped, only the URLs you name serve).
- Where the URL inclusions live: on existing keyword ad groups, in a dedicated keywordless ad group, or in a separate campaign.

Text customization adds a forcing constraint unique to this feature. It is mandatory for URL inclusions and is campaign-level, so wanting hand-controlled RSAs (text customization off) on your keyword ad groups forces keywordless inclusions into a separate campaign regardless of anything else. That sits on top of the normal campaign-segmentation drivers (budget, bid strategy, targets, conversion goals), which independently argue for a separate keywordless campaign. See [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) for the segment-versus-consolidate decision.

Two principles hold across the options:

- The cleanest, most defensible setups are a separate contained keywordless campaign (the DSA replacement) and, for large catalogs, a page feed.
- Mixing keywords and inclusions in one ad group is possible but messiest: it blends two matching mechanisms and muddies attribution.

> 💡 **Keywordless serving requires search term matching on.** URL inclusions are not self-driving dynamic ad targets like legacy Dynamic Search Ads. Search term matching's keywordless arm matches queries to your pages, and the inclusions only scope which pages are eligible. With search term matching off, the dynamic ad targets stay "Eligible, Pending" and never serve, in keywordless ad groups and in keyword ad groups carrying inclusions alike.

> ↪️ **For the full configuration library (every setup with what serves, pros, cons, when to choose, when to avoid, and examples):** See [AI Max Keywordless Configuration Catalog](../catalogs/AI Max Keywordless Configuration Catalog.md).

---

## Key principles

1. **Reporting is not incremental:** AI Max takes credit for queries your existing keywords already cover. Do not assume AI Max "drove" conversions it simply claimed from your existing keyword coverage.

2. **Convert to broad match before you keep AI Max on:** New campaigns arrive with AI Max on, so turn it off until broad match is proven with a 50/50 experiment, then migrate (pause phrase/exact, activate broad equivalents, never run duplicates). A broad baseline keeps AI Max rows interpretable.

3. **Experiment in sequence, configure defensively:** Default AI Max configuration cedes significant control. Layer the features in order (broad match → search term matching → final URL expansion) and prove each step. The sequence starts below AI Max: a campaign with AI Max off is already at Step 1, a new campaign has to be turned off to get there. Whenever AI Max is on, only the feature under test is enabled and every feature above it is deselected. Final URL expansion is a key feature to test, not avoid, but it forces text customization on, so control text customization with text guidelines rather than trying to disable it.

4. **Brand control starts with the Branded searches mode:** For strict separation, set Branded searches to "unbranded only" so AI Max stays off every brand. The list-based controlled mode (inclusions and exclusions) does not catch misspellings or variations, so when you use it, pair it with negative keyword lists as your primary brand/non-brand separator.

5. **The keyword is one intent signal:** It remains your strongest controllable signal, but assets, landing pages, and bids now carry intent alongside it. If you are comfortable with broad match expansion and attribution ambiguity, AI Max is a logical next step.

6. **Budget-constrained campaigns may perform worse:** If you have high lost impression share due to budget and mostly exact/phrase keywords, AI Max may reallocate budget from top performers to lower-performing expansion queries.

7. **AI Max is not PMax:** AI Max adds features to Search campaigns. PMax is a separate campaign type with Search inventory. If you run full PMax with assets, turn AI Max off on your Search campaigns.

8. **Landing pages are an input, not an afterthought:** Final URL expansion and text customization read your pages. Maintained, high-quality pages are a prerequisite for enabling them.

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | Technical specs for all AI Max features and settings |
| [Final URL Expansion & Page Feed Reference](<../references/Final URL Expansion & Page Feed Reference.md>) | How to control final URL expansion, page feed syntax, exclusions |
| [AI Max Keywordless Configuration Catalog](../catalogs/AI Max Keywordless Configuration Catalog.md) | The full option library: every keywordless setup with pros, cons, and examples |
| [SOP – Configure AI Max for Search](<../sops/SOP – Configure AI Max for Search.md>) | Step-by-step setup |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand control matrix and negative keyword pairing |
| [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md) | Why the keyword is now one intent signal |
| [Account Structure Orchestration Mental Model](../mental-models/Account Structure Orchestration Mental Model.md) | Which campaign type owns which query |
| [Match Type Reference](../references/Match Type Reference.md) | How AI Max extends broad match behavior, and the account-wide priority order |
| [Experiment Configuration Reference](../references/Experiment Configuration Reference.md) | The AI Max experiment type for isolating contribution |
| [Keyword and Match Type Selection Guidelines](../guidelines/Keyword and Match Type Selection Guidelines.md) | Broad match migration and the no-duplication policy |

---

## Version details

- **Version:** 19.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
