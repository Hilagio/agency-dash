# Network Selection Reference
Created: 2026-02-05

Support_ID: REFERENCE_39
Status: Done
Category: Configuration
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 6

## Purpose

Documents network selection options and recommended settings for Search, Shopping, and Video campaigns. This reference provides a single source of truth for which networks to enable or disable and why.

---

## What this reference is / What this is NOT

**This reference:**

- Documents network options per campaign type
- Provides recommended defaults and exception conditions
- Explains the impact of each network selection

**This reference does NOT:**

- Cover PMax network behavior (automated, cannot control)
- Explain campaign creation (See: campaign launch SOPs)
- Cover Display or Demand Gen networks (automated within those campaign types)

---

## Quick reference: network defaults by campaign type

| Campaign type | Search Network | Search Partners | Display Network |
|--------------|----------------|-----------------|-----------------|
| **Search** | ON (required) | Test | OFF |
| **Shopping** | ON (required) | Test | N/A |
| **Video** | N/A | N/A | YouTube + Partners |

---

## Search campaigns: network options

### Search Network

| Setting | Recommendation |
|---------|----------------|
| **Search Network** | **ON** (always) |

This is the core delivery mechanism for Search campaigns. Always enabled.

### Search Partners

| Setting | Recommendation |
|---------|----------------|
| **Search Partners** | **Test** |

Search Partners delivers ads on non-Google search engines and partner sites (AOL, Ask, etc.).

**Why "Test" is the recommendation:**

Search Partners can work great or perform poorly (roughly 50/50 chance). Performance is highly dependent on vertical. Always test and closely monitor after a couple of weeks/months.

**Considerations:**

- Lower quality traffic than Google Search
- No query-level data in search terms reports
- No control over which partner sites show your ads
- Performance data is aggregated, not site-specific

**How to monitor when enabled:**

1. Go to campaign → Segment → Network (with search partners)
2. Compare performance metrics between Google Search and Search Partners
3. If Search Partners CPA/ROAS is unacceptable, disable

> ⚠️ **Search Partners performance cannot be optimized independently:** You accept aggregate performance or disable entirely.

### Display Network (on Search campaigns)

| Setting | Recommendation |
|---------|----------------|
| **Display Network** | **OFF** (always) |

> ⚠️ **Display Network on Search campaigns is the #1 budget-wasting misconfiguration:** Google enables this by default. Verify it is OFF on every new Search campaign.

**Why this is critical:**

- Enabling creates a hidden Display campaign that shares your Search budget
- Silently diverts spend to Display placements with different intent signals
- Users see banner ads instead of responding to search queries
- Fundamentally different conversion behavior

**What to do instead:**

If you want Display reach, create a dedicated Display campaign with:
- Its own budget
- Its own targeting
- Its own bid strategy
- Its own creative

This keeps your Search budget focused on search intent.

---

## Shopping campaigns: network options

### Search Network

| Setting | Recommendation |
|---------|----------------|
| **Search Network** | **ON** (required) |

Required for Shopping campaigns to serve product listings in Google Search results.

### Search Partners

| Setting | Recommendation |
|---------|----------------|
| **Search Partners** | **Test** |

Same recommendation as Search campaigns: can work great or perform poorly depending on vertical. Always test and monitor.

**How to monitor:**

1. Segment by network in reporting
2. Compare Search vs Search Partners performance
3. Disable if metrics are unacceptable

> 💡 **Display Network does NOT apply to Standard Shopping:** The only network option besides Search Network is Search Partners.

---

## Video campaigns: network options

### YouTube network options

| Network | What it includes | Recommendation |
|---------|-----------------|----------------|
| **YouTube search results** | Ads appear in YouTube search | Include for discoverability |
| **YouTube videos** | In-stream and in-feed ads | Include (primary placement) |
| **Video partners on the Display Network** | Third-party sites and apps | Test with caution |

### Video Partners (Google video partners)

| Setting | Default recommendation |
|---------|----------------------|
| **Video partners** | **OFF initially, test later** |

Video partners extends your video ads to third-party websites and apps in the Google Display Network.

**Considerations:**

| Factor | Impact |
|--------|--------|
| Reach | Significantly increases reach |
| Quality | Variable, less control |
| Brand safety | Requires content exclusions |
| Reporting | Aggregated (limited transparency) |

**When to enable:**

- After YouTube-only campaign is stable
- When seeking incremental reach at lower CPMs
- With robust content exclusions in place

**Monitoring when enabled:**

1. Segment by network (Where ads showed)
2. Compare YouTube vs Video Partners metrics
3. Monitor placement report for low-quality sites

---

## PMax: network behavior

PMax automatically serves across all Google surfaces. You cannot control network selection.

| Surface | Control |
|---------|---------|
| Search | Automatic |
| Shopping | Automatic |
| Display | Automatic |
| YouTube | Automatic |
| Gmail | Automatic |
| Discover | Automatic |

**What you can control in PMax:**

- Brand exclusions (prevents brand queries)
- Listing groups (which products)
- Asset groups (creative by segment)
- Audience signals (targeting guidance)

You cannot disable specific networks in PMax.

---

## Display campaigns: network behavior

Display campaigns automatically serve across the Google Display Network. Network selection is not configurable in the same way as Search.

**What you can control:**

- Placements (specific sites/apps)
- Topics (content categories)
- Content exclusions (brand safety)
- App exclusions (mobile apps vs web)

---

## Demand Gen: network behavior

Demand Gen serves across YouTube, Discover, Gmail, and GDN. While campaign-level network selection is automated, you can control channel selection at the **ad group level**.

### Default (campaign level)

| Surface | Default |
|---------|---------|
| YouTube (in-stream, in-feed, Shorts) | ✅ Included |
| Discover feed | ✅ Included |
| Gmail | ✅ Included |
| GDN | ✅ Included |

### Ad group-level channel selection

At the ad group level, you can select specific channels:

| Option | What it includes |
|--------|------------------|
| **All Google channels** | All surfaces (default) |
| **YouTube in-stream** | Pre-roll, mid-roll ads |
| **YouTube in-feed** | YouTube feed placements |
| **YouTube Shorts** | Short-form vertical video |
| **Discover** | Google Discover feed |
| **Gmail** | Gmail promotions tab |
| **GDN** | Google Display Network |

**How to configure:**

1. Create or edit an ad group
2. Find channel selection settings
3. Choose "All Google channels" or select specific combinations
4. Different ad groups can target different channel combinations

> 💡 **Use ad group-level channel selection for A/B testing:** Create separate ad groups targeting different channels to compare performance.

---

## Verification checklist

After creating any Search or Shopping campaign:

| Check | Expected state |
|-------|---------------|
| Search Network | ON |
| Search Partners | Test (monitor by segment) |
| Display Network | OFF |

**How to verify:**

1. Go to campaign settings
2. Click "Networks"
3. Confirm each setting matches expectations

---

## Common mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Display Network ON in Search campaigns | Budget silently diverted to Display | Verify OFF on every new campaign |
| Search Partners ON without monitoring | Uncontrolled spend on lower-quality traffic | Turn OFF or actively monitor by segment |
| Video Partners ON without content exclusions | Ads on low-quality placements | Add exclusions before enabling partners |
| Assuming PMax network control exists | Expecting to disable networks | Understand PMax serves everywhere automatically |
| Not segmenting reports by network | Missing performance differences | Always check network-level data |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Search Campaign Settings Guidelines](../guidelines/Search Campaign Settings Guidelines.md) | Search-specific settings |
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Shopping-specific settings |
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Brand safety for video partners |
| [Universal Campaign Settings Reference](../references/Universal Campaign Settings Reference.md) | Other universal settings |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
