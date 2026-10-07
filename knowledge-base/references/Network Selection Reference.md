# Network Selection Reference
Created: 2026-02-05
Updated: 2026-06-29

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

- Cover PMax asset, audience, or bidding configuration (See: [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md)). PMax network selection is summarized in the PMax section below
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

Search Partners performance splits roughly evenly between strong and poor, and the split is driven by vertical. The setting is therefore tested and monitored by network segment rather than assumed either way.

**Considerations:**

- Lower quality traffic than Google Search
- No query-level data in search terms reports
- No control over which partner sites show your ads
- Performance data is aggregated, not site-specific

**How performance is read when enabled:**

The Network (with search partners) segment splits campaign metrics between Google Search and Search Partners. An unacceptable Search Partners CPA or ROAS in that split is the disable signal.

> ⚠️ **Search Partners performance cannot be optimized independently:** You accept aggregate performance or disable entirely.

### Display Network (on Search campaigns)

| Setting | Recommendation |
|---------|----------------|
| **Display Network** | **OFF** (always) |

> ⚠️ **Display Network on Search campaigns is the #1 budget-wasting misconfiguration.** Google enables it by default, which makes it a per-campaign verification point at launch.

**Why this is critical:**

- Enabling creates a hidden Display campaign that shares your Search budget
- Silently diverts spend to Display placements with different intent signals
- Users see banner ads instead of responding to search queries
- Fundamentally different conversion behavior

**Where Display reach belongs instead:**

A separate Demand Gen campaign, with its own budget, targeting, bid strategy, and creative. Demand Gen serves the Google Display Network alongside YouTube, Discover, Gmail, and Maps, with a GDN-exclusive serving option for that inventory alone. The Search budget then stays on search intent.

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

Same position as Search campaigns: performance depends on vertical, so the setting is tested and monitored rather than assumed.

**How performance is read:**

The network segment in reporting splits Search from Search Partners. Unacceptable Search Partners metrics in that split are the disable signal.

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

**How performance is read when enabled:**

The "Where ads showed" network segment separates YouTube from Video Partners, and the placement report surfaces the low-quality sites behind the partner numbers.

---

## PMax: network behavior

PMax serves across all Google surfaces by default. You can opt out of two of them at the campaign level: the Search Partner Network and the Google Display Network. The rest stay automatic.

| Surface | Control |
|---------|---------|
| Search | Automatic |
| Shopping | Automatic |
| YouTube | Automatic |
| Gmail | Automatic |
| Discover | Automatic |
| Search Partner Network | Selectable (on by default, can exclude) |
| Display Network | Selectable (on by default, can exclude) |

**What you can control in PMax:**

- Search Partner Network and Display Network on/off (campaign level)
- Brand exclusions (prevents brand queries)
- Listing groups (which products)
- Asset groups (creative by segment)
- Audience signals (targeting guidance)

### Search Partner and Display network selection

| Setting | Recommendation |
|---------|----------------|
| **Search Partner Network** | Leave on, test and monitor |
| **Display Network** | Leave on, test and monitor |

Both networks are on by default, which gives PMax full inventory to optimize across, and the channel split in reporting is where their contribution shows. A single network that is wildly out of line (high spend, near-zero conversions, unacceptable CPA/ROAS) and stays that way is excluded on its own, ahead of pausing the campaign. A pre-emptive disable removes inventory before any data exists on it.

> ⚠️ **A PMax network exclusion is a last-resort fix, not a setup step.** Excluding Display or Search Partners narrows where PMax can find conversions, which only pays off against clear, sustained underperformance.

---

## Demand Gen: network behavior

Demand Gen serves across YouTube, Discover, Gmail, Maps, and the GDN. While campaign-level network selection is automated, you can control channel selection at the **ad group level**.

### Default (campaign level)

| Surface | Default |
|---------|---------|
| YouTube (in-stream, in-feed, Shorts) | ✅ Included |
| Discover feed | ✅ Included |
| Gmail | ✅ Included |
| Maps | ✅ Included |
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

**Where the control sits:**

Channel selection lives in ad group settings, offering "All Google channels" or a specific combination. Ad groups in the same campaign can carry different combinations.

> 💡 **Ad group-level channel selection doubles as a test surface.** Separate ad groups targeting different channels make the per-channel performance comparison direct.

---

## Verification checklist

After creating any Search or Shopping campaign:

| Check | Expected state |
|-------|---------------|
| Search Network | ON |
| Search Partners | Test (monitor by segment) |
| Display Network | OFF |

These settings are read from the Networks section of campaign settings.

---

## Common mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Display Network ON in Search campaigns | Budget silently diverted to Display | Verify OFF on every new campaign |
| Search Partners ON without monitoring | Uncontrolled spend on lower-quality traffic | Turn OFF or actively monitor by segment |
| Video Partners ON without content exclusions | Ads on low-quality placements | Add exclusions before enabling partners |
| Disabling a PMax network without data | Narrows inventory, can suppress conversions | Leave Display and Search Partners on, monitor, exclude only on sustained wild underperformance |
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

- **Version:** 4.0
- **Last Updated:** June 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
