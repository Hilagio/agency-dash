# Universal Campaign Settings Reference
Created: 2026-02-05
Updated: 2026-10-05

Support_ID: REFERENCE_37
Status: Done
Category: Configuration
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Operational
Pillar: 6

## Purpose

Documents campaign-level settings that apply universally across all Google Ads campaign types. This reference provides a single source of truth for location targeting, language settings, ad schedule, URL options, and related configurations.

---

## What this reference is / What this is NOT

**This reference:**

- Documents universal settings shared across Search, Shopping, PMax, Display, Video, and Demand Gen
- Provides recommended defaults and exception conditions
- Explains how settings interact with Smart Bidding

**This reference does NOT:**

- Cover campaign-type-specific settings (See: campaign-specific guidelines)
- Explain bidding configuration (See: [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md))
- Cover network selection (See: [Network Selection Reference](../references/Network Selection Reference.md))
- Provide step-by-step campaign creation (See: campaign launch SOPs)

---

## Quick reference: universal defaults

| Setting | Default | Exception conditions |
|---------|---------|---------------------|
| **Location targeting method** | Presence or interest | Switch to Presence only if location reports show waste |
| **Location exclusion method** | Presence only | N/A |
| **Language** | Channel-dependent, see Language settings | Not available on Search. Multi-language markets need separate campaigns |
| **Ad schedule** | All hours, all days | Phone-based lead gen: business hours only |
| **Device targeting** | All devices | Let Smart Bidding optimize |
| **Start date** | Launch date | Scheduled launches as needed |
| **End date** | No end date | Set for promotional campaigns only |
| **Tracking template** | Set at campaign level | Consistent UTM parameters |

---

## Location targeting

### Target method

| Method | Who sees ads | Default |
|--------|-------------|---------|
| **Presence or interest** | People in, regularly in, or who have shown interest in your location | ✅ Yes |
| **Presence only** | People physically in or regularly in your location | Use when location reports show waste |

> ↪️ **Where the setting lives and how to change it:** See [SOP – Optimize Geographic Targeting](../sops/SOP – Optimize Geographic Targeting.md), Phase 1.

**Conditions that indicate Presence only:**

- Location reports show significant spend from users outside your physical target area
- Non-local traffic converts poorly
- Service area is physically limited (local services)

**Example:** Targeting the Netherlands with "Presence or interest" may show ads to someone in Australia who searched for "Amsterdam hotels". If this traffic converts poorly, switch to "Presence only".

### Exclusion method

| Method | Recommendation |
|--------|----------------|
| **Presence only** | ✅ Always use this |

Exclusions use "Presence only", which blocks users physically in the excluded area.

### Granularity guidelines

| Level | When to use |
|-------|-------------|
| Country | National campaigns, broad targeting |
| Region/State | Regional businesses, performance varies by region |
| City/Metro | Local businesses, city-specific offers |
| Radius | Brick-and-mortar, service-area businesses |

> 💡 **Granularity narrows with data, not ahead of it:** country-level targeting is the starting point, and location reports are what identify the regions worth excluding or adjusting.

---

## Language settings

### Where the language setting applies

Language is not a universal campaign setting. It applies to some channels and not others.

| Campaign type | Campaign-level language target | How language is determined |
|---------------|-------------------------------|----------------------------|
| Search | Not available | Ad creative and landing page language, with ad group prioritization when several are eligible |
| Standard Shopping | Available | The campaign-level language target |
| Performance Max, Search inventory | Not applied | Ad creative and landing page language |
| Performance Max, Shopping inventory | Not applied | Merchant Center data source language and country of sale |
| Performance Max, YouTube, Display, Discover and Gmail inventory | Available | The campaign-level language target |
| Demand Gen, Video, Display | Available | The campaign-level language target |

> ⚠️ **A Performance Max language target does not govern its Search inventory.** The setting still applies to the campaign's YouTube, Display, Discover and Gmail inventory, so it looks like it covers everything. Search traffic in that campaign is matched on creative and landing page language regardless of what the target says.

### How language matching works where no target applies

Google reads the language of your ad creative and your landing page, checks that the user understands it, and prioritizes at the ad group level when more than one of your ad groups is eligible for the same query. A search term in a clear language prioritizes the ad and landing page that match it. A search term without a clear language, such as a brand name, prioritizes the user's most preferred language. A user searching in one language can still see an ad written in another when Google is confident they understand it.

### Multi-language markets

For markets with multiple languages (Belgium, Switzerland, Canada):

1. Create separate campaigns per language
2. Each campaign gets language-appropriate ad copy and landing pages
3. This enables accurate performance tracking per language segment
4. Bid strategies optimize independently per language audience

Per-language structure matters more where no campaign-level target exists, because the assets are the only language signal you control.

> ⚠️ **Multiple languages in one campaign with single-language ads produce a mismatch:** users served an ad in a language they did not search in either skip it or bounce.

---

## Ad schedule

### Default recommendation

| Setting | Recommendation | Rationale |
|---------|----------------|-----------|
| **Ad schedule** | All hours, all days | Smart Bidding optimizes time-of-day performance automatically |

Smart Bidding strategies (Target CPA, Target ROAS, Maximize Conversions, Maximize Conversion Value) already factor time of day into their bid calculations. Manual scheduling restricts the algorithm without adding value.

### Exception conditions

| Business type | Recommended schedule |
|---------------|---------------------|
| Phone-based lead gen (calls as primary conversion) | Business hours only |
| B2B with long sales cycles | Weekdays, business hours |
| Seasonal promotions with specific windows | Custom schedule matching promotion |

### Bid adjustments on schedule segments

- **Manual CPC:** Schedule bid adjustments are applied
- **Smart Bidding:** Schedule bid adjustments are ignored (algorithm handles this)

---

## Device targeting

### Default recommendation

| Setting | Recommendation |
|---------|----------------|
| **Devices** | All devices (computers, tablets, mobile) |

Smart Bidding optimizes bids by device automatically. Manual device bid adjustments carry an effect in two cases only:

- Manual CPC bidding is in use
- Data shows one device converting materially worse

### Device bid adjustments under Smart Bidding

| Adjustment | Effect with Smart Bidding |
|------------|--------------------------|
| +50% mobile | Ignored (Smart Bidding overrides) |
| -100% mobile | Honored (removes mobile entirely) |

Only the -100% adjustment (complete device removal) is respected by Smart Bidding.

---

## Start and end dates

### Recommended configuration

| Campaign type | Start date | End date |
|--------------|------------|----------|
| Evergreen (always-on) | Launch date | No end date |
| Seasonal promotion | Promotion start | Promotion end |
| Limited-time offer | Offer start | Offer end |
| Testing/experimental | Test start | Test end |

> ⚠️ **A promotional campaign without an end date keeps spending:** the end date set at campaign creation is what stops it, since a manual pause depends on someone remembering.

---

## Campaign URL options

### Tracking template

Set tracking templates at the campaign level for consistent UTM parameters across all ads.

**Typical format:**

```
{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_content={creative}&utm_term={keyword}
```

### Final URL suffix

Use when additional tracking parameters are needed for third-party tracking or analytics requirements.

**Example:**

```
gclid={gclid}&campaignid={campaignid}
```

### Hierarchy

Set at the highest applicable level:

1. Account level (applies to all campaigns)
2. Campaign level (overrides account)
3. Ad group level (overrides campaign)
4. Ad level (overrides ad group)

---

## Common mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Leaving location targeting on "Presence or interest" when waste is detected | Budget spent on users outside target area | Switch to "Presence only" when data shows waste |
| Multiple languages in one campaign | Ad/landing page mismatch, poor CTR, high bounce | Separate campaigns per language |
| Manual ad schedule on Smart Bidding campaigns | Schedule bid adjustments are ignored anyway | Use all hours/all days |
| No end date on promotional campaigns | Budget wasted after promotion ends | Set end date at campaign creation |
| Setting tracking templates at ad level | Inconsistent tracking, maintenance burden | Set at campaign level |
| Applying device bid adjustments with Smart Bidding | Adjustments ignored (except -100%) | Remove device adjustments, let Smart Bidding optimize |

---

## Expected configuration state

The state each setting is in once a campaign is configured:

| Setting | Expected state |
|---------|---------------|
| Location targeting method | Presence or interest (default), or Presence only if justified |
| Location exclusion method | Presence only |
| Target locations | Correct geographic areas |
| Language | Ad copy and landing page are consistently in one language |
| Ad schedule | All hours, all days (unless exception applies) |
| Devices | All devices (unless removing one entirely) |
| End date | No end date for evergreen, set for promotions |
| Tracking template | Set at campaign level with correct UTM parameters |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Search Campaign Settings Guidelines](../guidelines/Search Campaign Settings Guidelines.md) | Search-specific settings |
| [Shopping Campaign Settings Reference](../references/Shopping Campaign Settings Reference.md) | Shopping-specific settings |
| [PMax Configuration Guidelines](../guidelines/PMax Configuration Guidelines.md) | PMax-specific settings |
| [Network Selection Reference](../references/Network Selection Reference.md) | Network inclusion/exclusion |
| [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md) | Bid strategy configuration |

---

## Version details

- **Version:** 5.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
