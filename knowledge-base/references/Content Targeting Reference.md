# Content Targeting Reference
Created: 2026-02-05
Updated: 2026-10-05

Support_ID: CHEATSHEET_41
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Upper Funnel
Pillar: 7

## Purpose

Documents content targeting options (placements, topics, keywords) and content exclusions for Video and Demand Gen campaigns, covering WHERE ads appear rather than WHO sees them. In Demand Gen, content targeting is a secondary layer on top of audience targeting, never standalone. Placement and topic exclusion syntax also applies to the account-level exclusions used by Demand Gen and PMax.

---

## What this is / What this is NOT

**This reference:**

- Documents placement targeting types and formats
- Explains topic and keyword content targeting
- Explains content exclusion types (recommended settings in [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md))
- Covers Video and Demand Gen campaign content controls and account-level exclusion syntax

**This reference does NOT:**

- Cover audience targeting (See: [Audience Targeting Reference](../references/Audience Targeting Reference.md))
- Explain audience signals for PMax (See: [Audience Signals Reference](../references/Audience Signals Reference.md))
- Provide campaign setup steps (See: [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md))

---

## Quick reference: content targeting types

| **Type** | **What it controls** | **Available in** | **Precision** |
|----------|---------------------|------------------|---------------|
| **Placements** | Specific sites, apps, YouTube channels/videos | Video, Demand Gen | Highest |
| **Topics** | Google's predefined content categories | Video, Demand Gen | Medium |
| **Keywords** | Pages containing specific terms | Video, Demand Gen | Medium-Low |
| **Content exclusions** | Categories, labels, types to avoid | Video, Demand Gen (account level) | N/A (exclusion) |

> ⚠️ **Content targeting ≠ Audience targeting:** Content targeting controls WHERE ads appear. Audience targeting controls WHO sees them. They can be combined (AND logic) or used independently.

---

## 1️⃣ Placement Targeting

### What it does

Restricts ad delivery to specific websites, apps, YouTube channels, or individual YouTube videos that you select.

> 💡 **Placements = maximum control:** You decide exactly where your ads appear. The trade-off is limited reach: you only get impressions from your selected placements.

### Placement types

| **Type** | **Format** | **Example** | **Available in** |
|----------|------------|-------------|------------------|
| Website | Domain or URL | `nytimes.com` or `nytimes.com/section/business` | Demand Gen |
| YouTube channel | Channel URL | `youtube.com/c/channelname` | Video |
| YouTube video | Video URL | `youtube.com/watch?v=VIDEO_ID` | Video |
| Mobile app | App name or package ID | `com.spotify.music` | Demand Gen |
| App category | Category selection | Games > Puzzle | Demand Gen |

### Placement syntax

| **Syntax** | **Behavior** | **Example** |
|------------|--------------|-------------|
| `domain.com` | All pages on domain | `forbes.com` |
| `domain.com/path` | Specific section only | `forbes.com/technology` |
| `youtube.com/c/name` | Entire channel | `youtube.com/c/mkbhd` |
| `youtube.com/watch?v=ID` | Single video | `youtube.com/watch?v=abc123` |

### Placement limits

| **Element** | **Limit** |
|-------------|-----------|
| Placements per ad group | 10,000 maximum |
| Recommended per ad group | 20-50 for manageability |
| Minimum for meaningful reach | 10+ high-traffic placements |

### Finding placements

| **Method** | **How** | **Best for** |
|------------|---------|--------------|
| Placement report | Insights and reports > When and where ads showed > Where ads showed | Finding new placements from automatic |
| Manual research | Industry sites, competitor analysis | High-control campaigns |
| YouTube search | Search relevant terms on YouTube | Video placement discovery |

### Placement best practices

| **Do** | **Don't** |
|--------|-----------|
| Start with 20-50 relevant placements | Add thousands without vetting |
| Review placement reports weekly | Set and forget |
| Exclude poor performers | Keep all placements indefinitely |
| Group similar placements in ad groups | Mix unrelated placements |
| Test automatic placements in separate campaign | Assume manual is always better |

### When to use placements

| **Use placements when** | **Avoid placements when** |
|------------------------|--------------------------|
| Brand safety is critical | You need maximum reach |
| You know where your audience is | Testing new audiences |
| Premium positioning matters | Budget is limited |
| Sponsorship/takeover campaigns | Learning phase campaigns |

---

## 2️⃣ Topic Targeting

### What it does

Shows ads on pages that Google classifies under your selected topic categories. Google uses page content, URL, and link structure to determine topic classification.

### Topic structure

Topics are organized in a hierarchy:

```
Top-level category
└── Subcategory
    └── Sub-subcategory
```

**Example:**
```
Home & Garden
└── Home Improvement
    └── Plumbing
```

### Topic selection rules

| **Rule** | **Details** |
|----------|-------------|
| Selecting parent includes children | "Home & Garden" includes all subcategories |
| Multiple topics = OR logic | Ads show on pages matching ANY selected topic |
| Topic + Audience = AND logic | Users in audience ON topic pages |
| Available topics | ~2,700 predefined categories |

### Topic targeting by vertical

| **Vertical** | **Relevant topics** |
|--------------|---------------------|
| **Ecommerce** | Shopping, Product categories, Lifestyle |
| **Lead Gen** | Business & Industrial, Professional services |
| **SaaS** | Computers & Electronics, Business Software |
| **Local** | Local, Real Estate, Automotive |

### Topic best practices

| **Do** | **Don't** |
|--------|-----------|
| Start with 3-5 relevant topics | Select 50+ topics (too broad) |
| Use subcategories for precision | Rely only on top-level categories |
| Combine with audience targeting | Use topics alone for conversions |
| Review placement reports | Assume all topic placements are relevant |

### When to use topics

| **Use topics when** | **Avoid topics when** |
|--------------------|----------------------|
| You want contextual relevance | Precision is critical |
| Audience is unknown but context is clear | You have strong first-party data |
| Awareness campaigns | Direct response with tight targets |
| Supplementing audience targeting | As sole targeting method |

---

## 3️⃣ Keyword (Content) Targeting

### What it does

Shows ads on pages containing your specified keywords. Google scans page content and matches to your keywords using broad contextual matching.

> ⚠️ **Content keywords ≠ Search keywords:** These match page content, not user search queries. The matching is broad and contextual: results can be unpredictable.

### Keyword syntax

| **Input** | **Matching behavior** |
|-----------|----------------------|
| `running shoes` | Pages about running, shoes, athletics |
| `"running shoes"` | Quotes ignored: still broad match |
| `nike running shoes` | Pages about Nike, running, shoes |

### Keyword limits

| **Element** | **Limit** |
|-------------|-----------|
| Keywords per ad group | No hard limit |
| Recommended per ad group | 5-20 keywords |
| Minimum for reach | 5+ related terms |

### Keyword targeting best practices

| **Do** | **Don't** |
|--------|-----------|
| Use related keyword themes | Mix unrelated keywords |
| Include brand terms (contextual) | Expect exact match behavior |
| Review where ads showed | Assume keywords = placements |
| Combine with other targeting | Use keywords alone |

### When to use content keywords

| **Use content keywords when** | **Avoid content keywords when** |
|------------------------------|--------------------------------|
| Testing contextual relevance | Precision is critical |
| Topics are too broad | You need predictable placements |
| Supplementing other targeting | As primary targeting method |
| Niche topics not in Google's taxonomy | High-stakes campaigns |

---

## 4️⃣ Content Exclusions

### What they do

Prevent ads from appearing on specific content types, categories, or individual placements. Exclusions override inclusions.

### Exclusion types

| **Type** | **What it excludes** | **Level** |
|----------|---------------------|-----------|
| **Placement exclusions** | Specific sites/apps/channels | Ad group, Campaign, Account |
| **Topic exclusions** | Content categories | Ad group, Campaign |
| **Keyword exclusions** | Pages with specific terms | Ad group, Campaign |
| **Content suitability** | Sensitive content categories | Account |
| **Inventory type** | Maximum/Moderate/Limited | Campaign |

The levels are not additive. Account-level placement exclusions override the campaign and ad group levels, and exclusions set on a manager account are inherited by every account beneath it.

### Content suitability settings (Account level)

| **Category** | **Default** |
|--------------|-------------|
| Tragedy and conflict | Excluded |
| Sensitive social issues | Excluded |
| Profanity and rough language | Included |
| Sexually suggestive content | Excluded |
| Sensational and shocking | Excluded |

Which of these to change is owned by [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md).

### Inventory type (Video campaigns)

| **Type** | **Content included** |
|----------|---------------------|
| **Maximum** | All monetizable content, sensitive content included |
| **Moderate** | Excludes most sensitive content. This is the Google default |
| **Limited** | Only content reviewed against Google's strictest standards |

Which type to select is owned by [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md).

### Digital content labels

| **Label** | **Content type** |
|-----------|-----------------|
| DL-G | General audiences |
| DL-PG | Parental guidance |
| DL-T | Teen |
| DL-MA | Mature audiences |
| Not yet labeled | Content Google has not classified |

Which labels to exclude is owned by [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md).

### Mandatory exclusions (all campaigns)

| **Exclusion** | **Why** |
|---------------|---------|
| Parked domains | No real content, wasted spend |
| Error pages | No real content |
| Mobile apps (unless app-focused) | Accidental clicks, low intent |
| Made-for-kids content | Legal restrictions (COPPA) |
| MFA (made-for-advertising) sites | Low quality, bot traffic |

### Setting up exclusions

| **Level** | **Scope** | **Use for** |
|-----------|-----------|-------------|
| **Account** | All campaigns | Brand safety, universal rules |
| **Campaign** | All ad groups in campaign | Campaign-specific exclusions |
| **Ad group** | Single ad group | Granular control |

### Exclusion best practices

| **Do** | **Don't** |
|--------|-----------|
| Set account-level brand safety first | Start without exclusions |
| Review placement reports for poor performers | Exclude everything preemptively |
| Build exclusion lists over time | Create massive lists day one |
| Share exclusion lists across campaigns | Recreate lists per campaign |
| Exclude competitors (if policy permits) | Violate Google's policies |

---

## Combining content targeting with audiences

### Logic rules

| **Combination** | **Logic** | **Effect** |
|-----------------|-----------|-----------|
| Topic A + Topic B | OR | Pages in either topic |
| Placement A + Placement B | OR | Either placement |
| Audience + Topic | AND | Audience members ON topic pages |
| Audience + Placement | AND | Audience members ON those placements |

### Combination strategies

| **Goal** | **Strategy** | **Expected reach** |
|----------|--------------|-------------------|
| Maximum reach | Audience OR Content (not both) | Highest |
| Contextual boost | Audience + Topics | Medium |
| Maximum precision | Audience + Placements | Lowest |

> 💡 **AND logic restricts reach significantly.** Every added layer reduces eligible impressions, so precision and volume trade against each other directly.

---

## Decision guide: which content targeting?

```
Do you know exactly where you want to appear?
│
├─ YES → Use PLACEMENTS
│        └─ Build list of 20-50 vetted sites/channels
│
└─ NO → Is your product tied to specific content themes?
         │
         ├─ YES → Use TOPICS
         │        └─ Select 3-5 relevant topic categories
         │
         └─ NO → Do you have niche terms not in topic taxonomy?
                  │
                  ├─ YES → Use KEYWORDS (content)
                  │        └─ Add 5-20 related terms
                  │
                  └─ NO → Skip content targeting
                          └─ Use audience targeting instead
```

---

## Content targeting as an expansion lever

A Video or Demand Gen campaign running audience targeting alone leaves content targeting unused. Contextual signals layered on top change both relevance and the inventory the campaign is eligible for.

### When to test content targeting

| Current state | Recommendation |
| --- | --- |
| Only audience targeting, performance is stable | Test adding 3-5 topic categories in a separate ad group |
| Audience targeting with good CPA but low volume | Content targeting can unlock additional inventory |
| Running broad audiences with high CPA | Layer topics or placements with AND logic to increase precision |
| Already using content targeting | Review performance, remove zero-conversion topics/keywords after 30+ days |

### Testing approach

1. Create a test ad group within the existing campaign
2. Apply the same audience segments as the control ad group
3. Add 3-5 relevant topic categories using AND logic (audience + content)
4. Set the same bid strategy and let both ad groups run for 30 days
5. Compare CPA/ROAS between the audience-only ad group and the audience + content ad group

### Decision table: which content targeting to test

| Situation | Content type to test | Why |
| --- | --- | --- |
| You know exactly which sites/channels your audience visits | Placements | Maximum control, predictable inventory |
| Your product fits clear content categories | Topics | Medium precision, broader reach than placements |
| Your niche is not covered by Google's topic taxonomy | Keywords (content) | Fills gaps in predefined categories |
| No clear content fit | Skip content targeting | Audience-only targeting is the right approach |

> ↪️ **Content targeting optimization in the cycle:** See [SOP – Run Demand Gen Optimization Cycle](../sops/SOP – Run Demand Gen Optimization Cycle.md) for the recurring review process.

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| No exclusions | Ads on low-quality sites | Set account-level exclusions first |
| Content keywords = search intent | Expecting search-like targeting | Understand broad contextual matching |
| Topics too broad | Irrelevant placements | Use subcategories |
| Placements too narrow | No delivery | Add more placements or switch to topics |
| Combining everything | Almost no reach | Layer intentionally, not by default |
| Ignoring placement reports | Poor sites keep getting spend | Review weekly, add exclusions |
| Mobile apps included | Accidental clicks | Exclude apps unless app-focused |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Guideline: recommended exclusion settings |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Companion: audience-based targeting |
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Framework: campaign structure context |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Execution: Demand Gen campaign setup |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Execution: Video campaign setup |
| [Upper Funnel Campaign Launch Checklist](../checklists/Upper Funnel Campaign Launch Checklist.md) | Validation: pre-launch checks |

---

## Version details

- **Version:** 4.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
