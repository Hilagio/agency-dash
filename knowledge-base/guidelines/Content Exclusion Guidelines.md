# Content Exclusion Guidelines
Created: 2026-02-05
Updated: 2026-04-01

Support_ID: GUIDELINE_9
Status: Done
Category: Operational
Reference Type: Guideline
Agent_Readable: Yes
Human_Facing: Yes
Applies_To: Display, Video, Demand Gen
Domain: Upper Funnel
Pillar: 6

## Purpose

This guideline provides recommended content exclusion settings for Display and Video campaigns to ensure brand safety and reduce wasted spend on low-quality placements.

Content exclusions control WHERE your ads do NOT appear. Proper exclusion configuration prevents ads from showing alongside inappropriate content and eliminates low-value placements that drain budget without delivering results.

> 💡 **Demand Gen and content exclusions:** Demand Gen does not support content targeting (placements, topics, keywords) but does support content exclusions for brand safety. The inventory type, sensitive content, and digital content label settings in this guideline apply to Demand Gen campaigns.

---

## What this is NOT

This guideline does **not:**

- Explain content targeting options (See: [Content Targeting Reference](../references/Content Targeting Reference.md))
- Cover audience exclusions (See: [Audience Targeting Reference](../references/Audience Targeting Reference.md))
- Provide campaign setup steps (See: respective campaign SOPs)

---

## Strategic framework: brand safety vs reach

Content exclusions balance two competing goals: brand safety (controlling where your ads appear) and reach (accessing enough inventory to meet volume targets). Your approach depends on three factors.

| Factor | More exclusions | Fewer exclusions |
|--------|----------------|-----------------|
| Brand sensitivity | Premium/luxury brands, regulated industries | Mass-market, performance-focused advertisers |
| Campaign goal | Awareness (brand perception matters) | Direct response (conversions matter more than context) |
| Budget | Small budgets can afford to exclude (quality over quantity) | Large budgets may need broader inventory |

### Reach impact of exclusions

| Exclusion level | Estimated reach reduction | Brand safety level |
|----------------|--------------------------|-------------------|
| Limited inventory + all sensitive categories + all apps excluded | 15-25% reach reduction | Maximum protection |
| Standard inventory + selective categories + apps excluded | 5-15% reach reduction | Strong protection |
| Standard inventory + selective categories only | 2-5% reach reduction | Moderate protection |
| Expanded inventory + no exclusions | 0% reduction | No protection |

> 💡 **Default: exclude aggressively, then test relaxing.** Start with maximum exclusions. If volume is insufficient after 30 days, selectively relax one exclusion at a time and measure CPA impact over 14 days.

### Measuring exclusion impact

After applying exclusions, validate they are not too aggressive:

| Signal | Meaning | Action |
|--------|---------|--------|
| CPA stable, volume decreased 10-20% | Normal reach trade-off | Acceptable. Keep current settings. |
| CPA decreased (improved), volume decreased | Exclusions eliminated waste | Exclusions are working as intended. |
| CPA increased, volume decreased significantly (>30%) | Exclusions may be too restrictive | Selectively relax one category and re-test over 14 days. |
| No change in CPA or volume | Excluded inventory was not being served anyway | Keep exclusions as a safety net. |

---

## Recommended configuration

### Inventory Type

| Setting | Recommendation | Rationale |
|---------|----------------|-----------|
| **Inventory type** | Limited inventory | Most restrictive: only shows on content that has been reviewed and meets Google's strictest standards. Premium brands should always use this. |

**Inventory type options:**

| Type | Content included | When to use |
|------|------------------|-------------|
| Expanded inventory | All monetizable content including sensitive | Never recommended |
| Standard inventory | Excludes most sensitive content | Acceptable for less brand-sensitive advertisers |
| **Limited inventory** | Only vetted, brand-safe content | **Recommended default** |

---

### Excluded Sensitive Content

Enable exclusions for ALL sensitive content categories:

| Category | Recommendation | Rationale |
|----------|----------------|-----------|
| Tragedy and conflict | **Exclude** | Avoid association with negative news, disasters, war |
| Sensitive social issues | **Exclude** | Avoid polarizing topics that may alienate customers |
| Profanity and rough language | **Exclude** | Maintain professional brand image |
| Sexually suggestive | **Exclude** | Avoid inappropriate content adjacency |
| Sensational and shocking | **Exclude** | Avoid clickbait and low-quality content environments |

> ⚠️ **Enable all five exclusions:** There is no upside to appearing next to sensitive content. The reach loss is minimal compared to the brand safety risk.

---

### Excluded Types and Labels

| Setting | Recommendation | Rationale |
|---------|----------------|-----------|
| **Parked domains** | **Exclude** | No real content, zero user engagement, wasted spend |
| Embedded YouTube videos | Exclude | Less control over context |
| Live streaming | Optional | Higher risk of unpredictable content |
| Games (all) | Exclude via placements | See placement exclusions below |

**Digital content labels:**

| Label | Content type | Recommendation |
|-------|--------------|----------------|
| DL-G | General audiences | Include |
| DL-PG | Parental guidance | Review based on brand |
| DL-T | Teen | Review based on brand |
| DL-MA | Mature audiences | Review based on brand |
| Not yet labeled | Unclassified content | Test and monitor |

---

### Excluded Content Themes

Exclude these content themes at the campaign or account level:

| Theme | Recommendation | Rationale |
|-------|----------------|-----------|
| **Games (fighting)** | **Exclude** | Violent content association |
| **Games (mature)** | **Exclude** | Adult-oriented gaming content |
| **Health (sensitive)** | **Exclude** | Medical misinformation risk, sensitive topics |
| **News (sensitive)** | **Exclude** | Breaking news, tragedies, controversial stories |
| **Politics** | **Exclude** | Polarizing content that alienates customers |
| **Religion** | **Exclude** | Sensitive topic that can create negative associations |

> 💡 **These exclusions apply across Display and Video:** Setting them at account level ensures consistency and prevents configuration drift.

---

### Excluded Content Keywords

| Setting | Recommendation | Rationale |
|---------|----------------|-----------|
| Content keyword exclusions | **None (default)** | Content keywords are broad and unpredictable. Use placement exclusions for specific control. |

> ⚠️ **Content keyword exclusions often over-exclude:** A keyword like "death" would exclude legitimate content about life insurance, estate planning, or healthcare. Rely on category and placement exclusions instead.

---

### Excluded Placements

#### Mobile Apps: Exclude All Categories

| Recommendation | Rationale |
|----------------|-----------|
| **Exclude all app categories** | In 95% of cases, app placements are wasted spend: accidental clicks, low intent, poor viewability, bot traffic |

> ↪️ **App exclusion setup.** See [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) for step-by-step app exclusion configuration.

#### If you want to test apps

If you have a specific reason to include app placements (app install campaigns, gaming advertisers):

| Minimum exclusions | Rationale |
|-------------------|-----------|
| All Game categories (iOS) | Highest accidental click rates |
| All Game categories (Android) | Highest accidental click rates |
| Kids/Family categories | COPPA compliance, low intent |

---

## Configuration Levels

Set exclusions at the appropriate level:

| Level | Scope | Use for |
|-------|-------|---------|
| **Account** | All campaigns | Sensitive content, brand safety, app exclusions |
| **Campaign** | All ad groups in campaign | Campaign-specific exclusions |
| **Ad group** | Single ad group | Granular, targeted exclusions |

**Recommended approach:**

1. Set sensitive content and app exclusions at **account level**
2. Set content theme exclusions at **account level**
3. Add specific placement exclusions at **campaign level** as you discover poor performers

---

## Implementation Checklist

Before launching any Display or Video campaign:

- [ ] Inventory type set to **Limited inventory**
- [ ] All 5 sensitive content categories excluded
- [ ] Parked domains excluded
- [ ] DL-MA and "Not yet labeled" content excluded
- [ ] Content themes excluded (Games fighting/mature, Health sensitive, News sensitive, Politics, Religion)
- [ ] All app categories excluded (or at minimum all Game categories)
- [ ] Settings applied at account level for consistency

---

## Exceptions

| Scenario | Exception | Approach |
|----------|-----------|----------|
| News/media advertisers | May want news placements | Selectively enable News (sensitive) |
| Gaming advertisers | May want game placements | Enable specific game categories, monitor closely |
| Political advertisers | Require political content | Enable Politics (subject to Google policies) |
| Religious organizations | Require religious content | Enable Religion for relevant content |

> ⚠️ **Exceptions should be explicit decisions:** Document why you're deviating from defaults and monitor performance closely.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [Content Targeting Reference](../references/Content Targeting Reference.md) | Reference: content targeting options |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference: audience exclusions |
| [Upper Funnel Campaign Launch Checklist](../checklists/Upper Funnel Campaign Launch Checklist.md) | Checklist: pre-launch validation |
| [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) | Execution: Display campaign setup |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Execution: Video campaign setup |

---

## Version Details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
