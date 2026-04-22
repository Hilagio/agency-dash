# Demand Gen Performance Reference
Created: 2026-02-14

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

- Provide step-by-step Demand Gen campaign setup (See: Demand Gen launch SOPs)
- Cover frequency capping for Demand Gen (frequency capping is NOT available in Demand Gen, See: [Frequency Capping Reference](../references/Frequency Capping Reference.md))
- Cover Display or Video campaign performance separately (See: [Placement Performance Reference](../references/Placement Performance Reference.md))
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

> ⚠️ **Do NOT compare Demand Gen performance to Search benchmarks:** Demand Gen is upper-funnel and has fundamentally different economics. A 1.5-2x higher CPA than Non-Branded Search is normal and expected. Set Demand Gen-specific performance targets from day one.

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

### When to enable vs disable

| Campaign type | Expansion setting | Rationale |
|---------------|-------------------|-----------|
| Remarketing | OFF (always) | You want to reach specific past visitors only |
| Prospecting (new campaign) | OFF (initial test) | Validate your defined audiences first |
| Prospecting (scaling) | Test ON vs OFF | Monitor reach vs efficiency tradeoff |
| Broad awareness | ON | Maximum reach is the goal |

---

## Lookalike audience settings

Three settings influence the balance between reach and similarity to your seed audience. These settings function as suggestions, not hard boundaries: Google's AI can serve ads to qualified users beyond the selected threshold when it predicts strong performance.

| Setting | Signal strength | Similarity to seed | Best for |
|---------|----------------|-------------------|----------|
| Narrow | Strongest similarity signal | Highest | Conservative testing, limited budget |
| Balanced | Medium similarity signal | Medium | Default starting point |
| Broad | Weakest similarity signal | Lowest | Scale phase after Balanced proves |

Seed quality is the primary control lever for lookalike performance. A high-quality seed list (converters, high-LTV customers) matters more than the reach setting, because Google uses the seed as a modeling signal regardless of which threshold you select.

Advertisers who need strict audience boundaries can [opt out of suggestion mode](https://support.google.com/google-ads/contact/lookalike_suggestion_opt_out) and revert to hard targeting.

### Progression path

1. Start with **Balanced** for the first 4-6 weeks
2. If Balanced CPA is within target, test **Broad** in a separate ad group
3. If Balanced CPA is too high, test **Narrow** to improve efficiency
4. Never skip from Narrow directly to Broad
5. Invest in seed quality at every stage: differences between settings are softer than they appear

---

## Seed audience requirements

### Minimum requirements

| Requirement | Minimum | Recommended |
|-------------|---------|-------------|
| Seed audience size | 1,000 users | 5,000+ users |
| Seed freshness | Updated within 90 days | Updated within 30 days |
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

### Rules during learning period

- Do NOT change targeting, budgets, or bids during the learning period
- Do NOT pause and restart the campaign (this resets learning)
- Do NOT evaluate performance based on the first 7 days
- Do NOT compare learning-period CPA to Search campaign CPA
- Do monitor daily spend to ensure the campaign is delivering
- Do check that ads are approved and serving

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

### Reporting view-through conversions

- Always report VTCs separately from click-through conversions
- Label VTCs clearly in dashboards ("View-through" not "Total conversions")
- Present VTCs as an "influence metric" to stakeholders
- Use a blended metric if needed: click-through conversions + (VTCs x discount factor of 0.3-0.5)

---

## Channel allocation comparison

| Channel | Typical strengths | Typical CPA | Volume |
|---------|------------------|-------------|--------|
| YouTube (all placements) | Video engagement, brand awareness | Highest | Highest reach |
| Discover | Intent-rich browsing context | Medium | Medium |
| Gmail | Direct inbox placement | Lowest | Lowest reach |
| GDN (within Demand Gen) | Broad reach, retargeting | Low-medium | High |

### Channel control

You can select specific channels at the ad group level. Available channels: YouTube in-stream, YouTube in-feed, YouTube Shorts, Discover, Gmail, and GDN. Use separate ad groups per channel combination for clearer performance data.

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

### DPA campaign structure

| Approach | Setup | Best for |
|----------|-------|----------|
| DPA remarketing | Feed-enabled Demand Gen + past visitor audiences | Recovering abandoned browsers/carts |
| DPA prospecting | Feed-enabled Demand Gen + lookalike/in-market audiences | New customer acquisition at scale |
| Hybrid | Feed-enabled Demand Gen + both audience types in separate ad groups | Full-funnel within one campaign |

### DPA limitations

- You cannot select specific products to show in ads (Google selects dynamically)
- Feed-enabled campaigns cannot also run non-feed creative in the same ad group
- DPA creatives inherit feed data: fix feed issues to fix ad quality

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
    +-- New customer acquisition (prospecting)
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
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Framework: where Demand Gen fits in campaign structure |

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

© 2026 PPC Mastery B.V. All rights reserved.
