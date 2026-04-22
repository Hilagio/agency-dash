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

Documents frequency capping configuration for Display and Video campaigns. This reference provides recommended caps by campaign goal, configuration steps, and adjustment triggers.

---

## What this reference is / What this is NOT

**This reference:**

- Documents frequency capping options by campaign type
- Provides recommended caps by campaign goal
- Explains how to configure and adjust frequency caps

**This reference does NOT:**

- Cover Search or Shopping campaigns (frequency capping does not apply)
- Cover PMax frequency (automated, no manual control)
- Cover Demand Gen frequency (frequency capping is NOT available in Demand Gen)
- Provide campaign creation steps (See: campaign launch SOPs)

---

## Quick reference: recommended frequency caps

| Campaign goal | Daily cap | Weekly cap | Monthly cap |
|---------------|-----------|------------|-------------|
| **Remarketing** | 5-7 | 15-20 | 60-80 |
| **Prospecting** | 3-5 | 10-15 | 40-60 |
| **Awareness** | 2-3 | 7-10 | 30-40 |

> 💡 **Start with daily caps:** Weekly and monthly caps provide additional control but daily caps have the most immediate impact.

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

### Display campaigns

**Available controls:**

| Setting | Options |
|---------|---------|
| Impressions per day | Custom number |
| Impressions per week | Custom number |
| Impressions per month | Custom number |

**Recommended settings:**

| Goal | Daily | Weekly | Notes |
|------|-------|--------|-------|
| Remarketing | 5-7 | 15-20 | Higher tolerance for known visitors |
| Prospecting | 3-5 | 10-15 | Moderate for discovery |
| Awareness | 2-3 | 7-10 | Lower to avoid saturation |

**How to configure:**

1. Go to campaign settings → Additional settings
2. Find "Frequency management" or "Frequency capping"
3. Select "Set a custom limit"
4. Enter impressions and time period

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

| Goal | Daily impressions | Weekly impressions |
|------|-------------------|-------------------|
| Awareness (reach) | 2-3 | 7-10 |
| Consideration | 3-4 | 10-14 |
| Remarketing (video) | 4-5 | 12-15 |

**How to configure:**

1. Go to campaign settings → Additional settings
2. Find "Frequency capping"
3. Select "Cap impression frequency" and/or "Cap view frequency"
4. Enter limits

> 💡 **For Video, cap both impressions and views:** Impressions cap how often ads appear. Views cap how often they're watched. Both matter for user experience.

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

## How to set frequency caps (step by step)

### Display campaign

1. Open the campaign
2. Click **Settings**
3. Expand **Additional settings**
4. Find **Frequency management**
5. Click **Set a custom limit**
6. Enter:
   - Number of impressions
   - Time period (day, week, or month)
7. Save

### Video campaign

1. Open the campaign
2. Click **Settings**
3. Expand **Additional settings**
4. Find **Frequency capping**
5. Check **Cap impression frequency**
6. Enter limits per day, week, and/or month
7. Optionally check **Cap view frequency**
8. Save

---

## Monitoring frequency

### Where to find frequency data

1. Go to campaign or ad group
2. Click **Columns** → **Modify columns**
3. Under "Reach metrics" add:
   - Avg. impr. freq. per user
   - Avg. impr. freq. per user (7 days)

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

You cannot set frequency caps in PMax. Google manages frequency automatically.

### Search and Shopping

Frequency capping does not apply. Users see ads when they search, there's no concept of ad fatigue from repeated search impressions.

### Cross-campaign frequency

| Limitation | Impact |
|------------|--------|
| Caps apply per campaign | Same user seeing ads from multiple campaigns |
| No account-level cap | Total exposure can exceed intended frequency |

**Workaround:** Use audience exclusions to prevent overlap between campaigns (e.g., exclude Display audiences from Video campaigns targeting similar users).

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
| [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) | Display frequency configuration |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Video frequency configuration |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Demand Gen campaigns (frequency capping not available) |

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
