# Demand Gen Performance Reference
Created: 2026-02-14
Updated: 2026-10-05

Support_ID: REFERENCE_46
Status: Done
Category: Upper Funnel
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Upper Funnel
Pillar: 0

## Purpose

Documents Demand Gen campaign performance benchmarks, attribution mechanics, audience configuration, and learning period behavior. Use this to set realistic targets, diagnose attribution discrepancies, and evaluate creative and channel performance.

---

## What this reference is / what this is NOT

**This reference:**

- Documents typical Demand Gen metric benchmarks by channel and creative format
- Covers Optimized Targeting mechanics, lookalike settings, and seed audience requirements
- Explains learning period behavior and view-through conversion significance
- Provides channel allocation and creative format performance comparisons
- Documents product feed integration (DPA) for Demand Gen

**This reference does NOT:**

- Provide step-by-step Demand Gen campaign setup (See: [SOP - Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md))
- Cover frequency capping for Demand Gen (frequency capping is NOT available in Demand Gen, See: [Frequency Capping Reference](../references/Frequency Capping Reference.md))
- Cover GDN or Video placement performance separately (See: [Placement Performance Reference](../references/Placement Performance Reference.md))
- Explain upper-funnel campaign structure decisions (See: [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md))

---

## Quick reference: Demand Gen benchmarks

| Metric | Typical range | Compare to |
|--------|--------------|------------|
| CPM | €5-15 | Display (€2-8), YouTube (€6-12) |
| CTR | 0.5-2.0% | Search (3-8%), Display (0.3-1%) |
| CVR | 1-5% | Search (3-10%), Display (0.5-2%) |
| CPA | 1.5-2x Non-Branded Search tCPA | Set Demand Gen-specific targets, not Search targets |
| ROAS | 50-70% of Non-Branded Search tROAS | Set Demand Gen-specific targets |
| Daily budget floor | 10x target CPA, minimum €100/day on Maximize conversions | Below this, delivery is throttled |

> ⚠️ **Demand Gen benchmarks do not sit on the same scale as Search benchmarks.** Demand Gen is upper-funnel with fundamentally different economics, and a CPA 1.5-2x above Non-Branded Search is the normal state, not a failure condition.

---

## Optimized Targeting mechanics

The Optimized Targeting setting controls how audience targeting works in Demand Gen campaigns.

### How it works

| Setting | Behavior | Audiences function as |
|---------|----------|----------------------|
| Optimized Targeting ON | Google expands beyond your defined audiences to find additional converters | Signals (loose targeting) |
| Optimized Targeting OFF | Strict targeting, only reaches users in your defined segments | Hard constraints (strict targeting) |

### Default state

Optimized Targeting is enabled by default on all new Demand Gen campaigns.

> ↪️ **Which scenarios take Optimized Targeting on and which take it off** is owned by the scenario table in [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md).

---

## Lookalike audience settings

Three settings influence the balance between reach and similarity to your seed audience. These settings function as suggestions, not hard boundaries: Google's AI can serve ads to qualified users beyond the selected threshold when it predicts strong performance.

| Setting | Signal strength | Similarity to seed | Best for |
|---------|----------------|-------------------|----------|
| Narrow | Strongest similarity signal | Highest | Conservative testing, limited budget |
| Balanced | Medium similarity signal | Medium | Default starting point |
| Broad | Weakest similarity signal | Lowest | Scale phase after Balanced proves |

Seed quality is the primary control lever for lookalike performance. A high-quality seed list (converters, high-LTV customers) matters more than the reach setting, because Google uses the seed as a modeling signal regardless of which threshold you select.

Advertisers who need strict audience boundaries can opt out of suggestion mode (Google provides an opt-out form) and revert to hard targeting.

### Progression path

Balanced is the entry point, held for the first 4-6 weeks. From there the direction depends on the result: a CPA within target opens a Broad test in a separate ad group, a CPA above target points to Narrow. The path is stepwise, and Narrow to Broad in one move skips the reading that would justify it. At every stage the seed does more work than the setting: the differences between the three are softer than they appear.

---

## Seed audience requirements

### Minimum requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Seed audience size | 1,000 users | 5,000+ users |
| Seed freshness, website-visitor segment | Updated within 90 days | Updated within 30 days |
| Seed freshness, Customer Match list | Updated within 30 days | Updated within 30 days |
| Seed quality | Active site visitors | Converters or high-value customers |

### Seed quality tiers

| Seed type | Quality | Why |
|-----------|---------|-----|
| Repeat purchasers / high-LTV customers | Best | Models from highest-value behavior |
| All converters (past 90 days) | Good | Models from conversion signals |
| Engaged visitors (multiple pages, time on site) | Acceptable | Models from engagement signals |
| All website visitors | Poor | Too broad, dilutes signal |
| Bounced visitors | Worst | Models from low-quality behavior |

---

## Learning period mechanics

Every new Demand Gen campaign enters a learning period where Google's algorithm calibrates bidding and targeting. Performance during this period is not representative.

### Learning period specifications

| Parameter | Value |
|-----------|-------|
| Duration | 2-4 weeks (typical) |
| Conversion threshold | 30-50 conversions for stable bidding |
| Status indicator | "Learning" badge in campaign status column |
| End condition | Sufficient conversions OR time elapsed |

### Behavior during learning

| What happens | Impact |
|--------------|--------|
| Performance fluctuates day to day | CPAs swing 50-200% above target |
| Google tests different audience segments | Reach and frequency are inconsistent |
| Bidding is less efficient | Cost per result is higher than steady state |
| Creative testing is exploratory | Not all creatives get equal impressions |

### What holds during the learning period

| Constraint | Consequence of breaking it |
|------------|----------------------------|
| Targeting, budgets and bids stay unchanged | Every change restarts the calibration |
| The campaign is not paused and restarted | A restart resets learning entirely |
| Performance is not read from the first 7 days | The data is exploratory, not representative |
| Learning-period CPA is not compared to Search CPA | Two different funnels at two different maturities |

Two things remain readable during learning: daily spend, which shows whether the campaign is delivering at all, and ad approval status.

### After learning ends

- Performance stabilizes, optimization decisions become meaningful
- CPA trends toward your target (within 20-30% in first month)
- If CPA remains more than 2x target after 4 weeks post-learning, revisit targeting and creative

---

## View-through conversion significance

View-through conversions (VTCs) measure users who saw your ad but did not click, then later converted.

### Attribution windows

| Window type | Default | Recommended |
|-------------|---------|-------------|
| Click-through | 30 days | Keep default |
| View-through | 1 day | Keep default (conservative) |

### How to use view-through data

| Use for | Do NOT use for |
|---------|----------------|
| Directional signal of upper-funnel influence | Primary CPA/ROAS calculation |
| Justifying continued Demand Gen investment | Direct comparison to click-through conversions |
| Identifying high-impact creative and audiences | Inflating Demand Gen performance numbers |
| Budget allocation discussions | Replacing click-through as the primary metric |

> ⚠️ **View-through conversion optimization is a trap for performance campaigns.** The toggle lets Smart Bidding optimize toward view-through conversions across YouTube, Display and the Discover Feed, and every new Demand Gen campaign starts with it ON. Only video assets are eligible for it. Google states it does not directly measure incrementality. On any performance or acquisition campaign, switch it OFF at launch, because it inflates apparent results and degrades real CPA accountability. The only case for it is a pure brand-awareness campaign where view-through is the explicit goal.

### Reporting view-through conversions

| Convention | Detail |
|------------|--------|
| Separate columns | VTCs never sit inside the click-through conversion total |
| Explicit labelling | "View-through", never "Total conversions" |
| Framing | An influence metric, not a performance metric |
| Blended figure, where one is needed | Click-through conversions + (VTCs x a discount factor of 0.3-0.5) |

---

## Channel allocation comparison

| Channel | Typical strengths | Typical CPA | Volume |
|---------|------------------|-------------|--------|
| YouTube (all placements) | Video engagement, brand awareness | Highest | Highest reach |
| Discover | Intent-rich browsing context | Medium | Medium |
| Gmail | Direct inbox placement | Lowest | Lowest reach |
| GDN (within Demand Gen) | Broad reach, retargeting | Low-medium | High |
| Maps | Local intent, proximity to physical locations | Medium | Medium-low |

### Channel control

Channels are selectable at ad group level: YouTube in-stream, YouTube in-feed, YouTube Shorts, Discover, Gmail, GDN, and Maps. Because the selection is per ad group, one ad group per channel combination is what makes channel performance separable at all.

| Approach | Setup | Best for |
|----------|-------|----------|
| All channels | Default: all channels enabled | Initial testing, maximum reach |
| Channel-specific ad groups | One ad group per channel (or combination) | Performance isolation, budget control per channel |
| Creative-matched channels | Match creative format to channel strengths | Optimizing creative-channel fit |

---

## Creative format performance

| Format | Best for | Typical CTR | Notes |
|--------|----------|-------------|-------|
| Video | Brand awareness, product demos | 0.5-1.5% | Highest engagement, highest production cost |
| Single image | Quick testing, simple offers | 0.8-2.0% | Easiest to produce, test frequently |
| Carousel | Multiple products, storytelling | 0.7-1.5% | Good for ecommerce catalogs |
| UGC-style | Authenticity, social proof | Often highest CTR | Lower production cost, test against polished |

### Creative recommendations

Creative requirements depend on which channels are active in the ad group:

| Recommendation | When it applies | Rationale |
|----------------|----------------|-----------|
| Include video creative | YouTube channels enabled | Required for in-stream, in-feed, and Shorts placements |
| Include image creative | Discover, Gmail, or GDN channels enabled | Required for non-video placements |
| Include both video AND image | All channels enabled (default) | Covers all placement types |
| Test 3-5 creative variations per format | Always | Gives Google's algorithm options to optimize |
| Refresh creative every 60 days | Always | Prevents ad fatigue across upper-funnel surfaces |
| Size images to 1200x628 (landscape) and 1200x1200 (square) | Image placements | Covers Discover, Gmail, and GDN |
| Include vertical video for Shorts | YouTube Shorts channel enabled | Shorts requires vertical (9:16) format |
| Keep video under 30 seconds | YouTube in-feed | Short-form performs better in feed contexts |

---

## Product feed integration (DPA)

Adding a product feed to a Demand Gen campaign transforms all ad groups into dynamic product ads (DPA). This is a campaign-level setting.

### How it works

| Element | Detail |
|---------|--------|
| Feed source | Merchant Center (same feed as Shopping/PMax) |
| Campaign scope | Enabling feed affects ALL ad groups in the campaign |
| Dynamic remarketing | Shows users products they previously viewed |
| Prospecting DPA | Shows products based on audience signals and browsing behavior |
| Product selection | Google selects products automatically based on user signals |

### Feed quality requirements

The same standards apply as Shopping campaigns:

| Element | Requirement |
|---------|-------------|
| Product titles | Descriptive, keyword-rich, front-loaded with key attributes |
| Images | High quality, white background preferred, no watermarks |
| Prices | Accurate, matches landing page price |
| Availability | Up to date, no "out of stock" products showing |
| Product descriptions | Complete, highlight key selling points |
| Minimum inventory | At least 4 approved, in-stock products across at least 4 Group IDs |

### DPA campaign structure

| Approach | Setup | Best for |
|----------|-------|----------|
| DPA remarketing | Feed-enabled Demand Gen + past visitor audiences | Recovering abandoned browsers/carts |
| DPA prospecting | Feed-enabled Demand Gen + lookalike/in-market audiences | Reaching buyers new to the brand, at scale |
| Hybrid | Feed-enabled Demand Gen + both audience types in separate ad groups | Full-funnel within one campaign |

> ⚠️ **"New customer acquisition" is also the name of a goal setting.** Reaching new customers is the business purpose of the prospecting row above. The Google Ads new customer acquisition goal is a separate campaign setting, and it cannot be combined with Lookalike segments.

> ⚠️ **Inventory depth is a serving gate.** Product formats stop serving when approved in-stock inventory drops below 4 products across 4 Group IDs. Stock movement alone can trip this, so re-check it after feed changes rather than only at launch.

### DPA limitations

- You cannot select specific products to show in ads (Google selects dynamically)
- Feed-enabled campaigns cannot also run non-feed creative in the same ad group
- DPA creatives inherit feed data: fix feed issues to fix ad quality

### Checkout links

Checkout links let users move toward checkout directly from the ad. They depend on the same Merchant Center feed and feed quality standards as DPA, so feed accuracy on price and availability is what determines whether the path works.

---

## Decision guide

```
Starting a new Demand Gen campaign?
|
+-- What is the primary goal?
    |
    +-- Brand awareness / Reach
    |   +-- Use video creative
    |   +-- Enable Optimized Targeting
    |   +-- Set CPM or Maximize Conversions bid
    |   +-- Expect highest CPAs, evaluate on reach metrics
    |
    +-- Prospecting for buyers new to the brand
    |   +-- Use lookalike audiences (start Balanced, focus on seed quality)
    |   +-- Disable Optimized Targeting initially
    |   +-- Match creative to active channels (video for YouTube, images for Discover/Gmail/GDN)
    |   +-- Set CPA at 1.5-2x Non-Branded Search tCPA target
    |
    +-- Remarketing / Re-engagement
    |   +-- Use first-party audiences (site visitors, cart abandoners)
    |   +-- Disable Optimized Targeting (always)
    |   +-- Consider DPA with product feed
    |   +-- Set CPA closer to Non-Branded Search tCPA (1.5-2x)
    |
    +-- Product catalog promotion
        +-- Enable product feed from Merchant Center
        +-- Segment remarketing vs prospecting in separate ad groups
        +-- Feed quality = ad quality
        +-- Monitor product-level engagement in Merchant Center
```

---

## Common mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Comparing Demand Gen CPA to Search CPA | Unrealistic expectations, premature campaign kills | Set Demand Gen-specific targets (1.5-2x Non-Branded Search tCPA) |
| Using external analytics as primary Demand Gen reporting | Underreporting conversions due to cross-domain tracking limitations | Use Google Ads as the source of truth for Demand Gen performance |
| Changing settings during learning period | Resets learning, extends poor performance | Wait 2-4 weeks before making changes |
| Including VTCs in primary CPA calculation | Inflated performance, misleading reports | Report VTCs separately as influence metric |
| Leaving Optimized Targeting ON for remarketing | Ads reach users outside your remarketing lists | Disable Optimized Targeting for all remarketing campaigns |
| Starting lookalikes on Broad | Weakest similarity signal from day one | Start on Balanced, invest in seed quality first |
| Seed audience under 1,000 users | Poor lookalike modeling, limited delivery (even more critical since Google expands beyond thresholds) | Build seed to 5,000+ before launching lookalikes |
| No creative variety | Google cannot optimize across formats | Match creative formats to active channels: video for YouTube ad groups, images for Discover/Gmail/GDN ad groups, both for all-channel ad groups |
| Evaluating after 3-5 days | Data is from learning period, not representative | Wait until learning period ends (2-4 weeks) |
| Running DPA without feed optimization | Poor product titles and images in dynamic ads | Apply Shopping-level feed quality standards |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Framework: strategic context for Demand Gen campaigns |
| [Frequency Capping Reference](../references/Frequency Capping Reference.md) | Related: frequency capping is NOT available in Demand Gen |
| [Placement Performance Reference](../references/Placement Performance Reference.md) | Companion: channel and placement performance data |
| [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) | Guideline: owns the Optimized Targeting scenario table |
| [SOP - Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Execution: Demand Gen campaign setup |

---

## Version details

- **Version:** 6.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
