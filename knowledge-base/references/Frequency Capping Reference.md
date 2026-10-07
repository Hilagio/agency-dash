# Frequency Capping Reference
Created: 2026-02-05

Support_ID: REFERENCE_40
Status: Done
Category: Configuration
Reference Type: Technical
Agent_Readable: Yes
Human_Facing: Yes
Domain: Upper Funnel
Pillar: 6

## Purpose

Documents frequency capping configuration for Video campaigns. Demand Gen has no manual frequency caps: Google manages frequency automatically, so monitor frequency in reporting and control fatigue with audience exclusions. This reference provides recommended caps by campaign tier, configuration steps, and adjustment triggers.

---

## What this reference is / What this is NOT

**This reference:**

- Documents frequency capping options by campaign type
- Provides recommended caps by campaign tier
- Explains how to configure and adjust frequency caps

**This reference does NOT:**

- Cover Search or Shopping campaigns (frequency capping does not apply)
- Cover PMax frequency (automated, no manual control)
- Cover Demand Gen frequency (frequency capping is NOT available in Demand Gen)
- Provide campaign creation or cap-configuration steps (See: [SOP - Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md))

---

## Quick reference: recommended frequency caps

| Campaign tier | Daily cap | Weekly cap | Monthly cap |
|---------------|-----------|------------|-------------|
| **Remarketing** | 5-7 | 15-20 | 60-80 |
| **Prospecting** | 3-5 | 10-15 | 40-60 |
| **Awareness** | 2-3 | 7-10 | 30-40 |

> 💡 **The daily cap is the one that binds first.** Weekly and monthly caps add control on top, but a user reaching the daily limit never reaches the weekly one.

---

## What frequency capping does

Frequency capping limits how many times a single user sees your ads within a time period.

**Without frequency caps:**

- Heavy users see your ad repeatedly (ad fatigue, negative brand perception)
- Light users see your ad once (reach efficiency suffers)
- Budget concentrates on fewer users at high frequency

**With frequency caps:**

- Ad exposure distributed across more users
- Reduced ad fatigue
- Better reach efficiency
- More controlled brand experience

---

## Frequency caps by campaign type

### Video campaigns

**Available controls:**

| Setting | Options |
|---------|---------|
| Impressions per day | Custom number |
| Impressions per week | Custom number |
| Impressions per month | Custom number |
| Views per day | Custom number |
| Views per week | Custom number |

**Recommended settings:**

| Campaign subtype | Daily impressions | Weekly impressions |
|------------------|-------------------|-------------------|
| Video reach (Efficient reach, Non-skippable reach, Target frequency) | 2-3 | 7-10 |
| Video views | 3-4 | 10-14 |
| Any subtype on remarketing audiences | 4-5 | 12-15 |

Frequency capping sits under campaign settings > Additional settings, with separate switches for impression frequency and view frequency. Configuring it is owned by [SOP - Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md), Phase 1.4.

> 💡 **Impressions and views are two separate caps.** The impression cap governs how often an ad appears, the view cap how often it is watched, and capping one leaves the other uncapped.

---

## Frequency by campaign tier

### Remarketing campaigns

| Factor | Recommendation |
|--------|----------------|
| Daily cap | 5-7 impressions |
| Rationale | Known visitors have higher tolerance |
| Risk of no cap | Ad fatigue, negative brand perception |

**Tier-specific adjustments:**

| Audience | Cap adjustment |
|----------|----------------|
| Cart abandoners (hot) | Can go higher (7-10/day) due to high intent |
| Site visitors (warm) | Standard (5-7/day) |
| Past customers | Lower (3-5/day) to avoid annoyance |

### Prospecting campaigns

| Factor | Recommendation |
|--------|----------------|
| Daily cap | 3-5 impressions |
| Rationale | New users need introduction, not bombardment |
| Risk of no cap | Wasted reach, negative first impression |

**Tier-specific adjustments:**

| Audience | Cap adjustment |
|----------|----------------|
| In-market audiences | Standard (3-5/day) |
| Custom segments | Standard (3-5/day) |
| Affinity/demographics | Lower (2-3/day) for cold audiences |

### Awareness campaigns

| Factor | Recommendation |
|--------|----------------|
| Daily cap | 2-3 impressions |
| Rationale | Brand building requires reach over frequency |
| Risk of no cap | Budget concentrated on few users, poor reach |

---

## Monitoring frequency

### Where to find frequency data

Two columns under "Reach metrics" in the campaign or ad group column picker carry it:

| Column | What it reports |
|--------|-----------------|
| Avg. impr. freq. per user | Average impressions per user over the selected range |
| Avg. impr. freq. per user (7 days) | The same figure on a fixed 7-day window |

### Healthy frequency ranges

| Metric | Healthy | Warning | Action needed |
|--------|---------|---------|---------------|
| Daily avg. freq. | 1-5 | 5-10 | 10+ |
| Weekly avg. freq. | 3-15 | 15-25 | 25+ |

### Frequency red flags

| Signal | Issue | Action |
|--------|-------|--------|
| Avg. frequency >10/week | Over-exposure | Tighten caps |
| CTR declining over time | Ad fatigue | Refresh creative, tighten caps |
| Frequency uneven (some users 50+) | No caps set | Implement caps |
| Reach not growing despite spend | Frequency > Reach | Tighten caps |

---

## Adjustment triggers

### When to tighten frequency caps

| Trigger | New cap suggestion |
|---------|-------------------|
| CTR declining week over week | Reduce by 20-30% |
| User complaints or negative feedback | Reduce by 50% |
| Avg. frequency >2x recommendation | Align to recommendation |
| Budget limited but want more reach | Reduce to spread budget |

### When to loosen frequency caps

| Trigger | Adjustment |
|---------|-----------|
| Reach goals not met | Increase by 20-30% |
| High-intent remarketing performing well | Can increase for converters |
| Sequential messaging needs more touchpoints | Increase to accommodate sequence |

---

## Frequency capping limitations

### PMax

| Control | Available |
|---------|-----------|
| Manual frequency cap | ❌ No |
| Automatic optimization | ✅ Yes (Google-managed) |

PMax has no manual frequency cap. Google manages frequency automatically.

### Search and Shopping

Frequency capping does not apply. Users see ads when they search, so there is no concept of ad fatigue from repeated search impressions.

### Cross-campaign frequency

| Limitation | Impact |
|------------|--------|
| Caps apply per campaign | Same user seeing ads from multiple campaigns |
| No account-level cap | Total exposure can exceed intended frequency |

**Workaround:** audience exclusions prevent overlap between campaigns, for example excluding Demand Gen audiences from Video campaigns targeting similar users.

---

## Common mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| No frequency cap set | Budget concentrated on few users, ad fatigue | Set caps at campaign launch |
| Cap too high (20+/day) | Still causes fatigue | Use recommended ranges |
| Same cap for all campaign tiers | Remarketing over-capped, awareness under-capped | Tier-specific caps |
| Not monitoring actual frequency | Undetected issues | Add frequency columns to reports |
| Only daily cap, no weekly | Users hit daily cap every day | Add weekly caps |

---

## Related documents

| Document | Relationship |
|----------|--------------|
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Brand safety alongside frequency |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Audience tier definitions |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Campaign tier framework |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Video frequency configuration |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Demand Gen campaigns (frequency capping not available) |

---

## Version details

- **Version:** 4.0
- **Last Updated:** August 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
