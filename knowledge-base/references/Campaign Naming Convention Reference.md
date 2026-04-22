# Campaign Naming Convention Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_34
Status: Done
Reference Type: Reference
Category: Configuration
Domain: Operational
Pillar: 0
Agent_Readable: Yes
Human_Facing: Yes

## Purpose

This reference defines a structured naming convention for Google Ads campaigns. A consistent naming system ensures organization, clarity, and efficient collaboration across teams and tools.

---

## What this is / What this is NOT

**This reference:**

- Defines the naming convention structure (variables, order, formatting)
- Provides campaign type and subtype values
- Lists best practices for naming consistency

**This reference does NOT:**

- Explain campaign structure or segmentation logic (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Provide step-by-step campaign creation instructions (See: [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md))
- Cover ad group naming conventions (See: [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) for ad group naming)

---

## Quick reference

**Convention format:**

```
[Country]_[Language]_[CampaignType]_[Theme]_[Modifier]
```

**Example:**

```
NL_NL_Search_CRM_Brand
BE_FR_Search_TV_8K
USA_EN_Pmax_AllProducts
DE_DE_YouTube_Remarketing
```

---

## Naming convention structure

Build your campaign name from left to right using these five variables in order.

### 1. Geographic targeting

Use ISO 3166 Alpha-2 country codes.

| Scope | Value |
|-------|-------|
| Single country | `NL`, `USA`, `DE`, `BE`, `FR` |
| Multiple countries | `EU`, `Global`, `EMEA` |
| Region/city-specific | `NL_Amsterdam`, `USA_CA` |

### 2. Language targeting

Use ISO 639-1 language codes.

| Language | Value |
|----------|-------|
| Dutch | `NL` |
| English | `EN` |
| French | `FR` |
| German | `DE` |
| All languages | `ALL` |

### 3. Campaign type

| Campaign type | Value |
|---------------|-------|
| Search | `Search` |
| Performance Max | `Pmax` |
| Display | `Display` |
| Shopping | `Shopping` |
| Video/YouTube | `YouTube` |
| App | `App` |
| Demand Gen | `DemandGen` |

### 4. Campaign theme or target audience

For bottom-of-funnel campaigns (Search, Shopping, PMax): use the keyword theme or product category.

| Example | Campaign name |
|---------|---------------|
| Television keywords | `NL_NL_Search_TV` |
| 8K television subset | `NL_NL_Search_TV_8K` |
| Marketing automation service | `NL_EN_Pmax_MarketingAutomation` |
| All products | `NL_NL_Shopping_AllProducts` |

For top-of-funnel campaigns (Display, YouTube, Demand Gen): use the target audience or placement type. If targeting a wide range of audiences, specify at the ad group level instead.

### 5. Additional modifiers

Use modifiers for campaign subtypes or special segmentation.

| Modifier | When to use |
|----------|-------------|
| `Brand` | Brand campaigns |
| `NB` | Non-branded campaigns |
| `DSA` | Dynamic Search Ads campaigns |
| `Competitors` | Competitor targeting campaigns |
| `Remarketing` | Remarketing campaigns |
| `Prospecting` | Prospecting/acquisition campaigns |
| `Heroes` | Hero product campaigns |

---

## Campaign subtypes reference

| Campaign type | Subtype value | Example |
|---------------|---------------|---------|
| Search - Brand | `Search_Brand` | `NL_NL_Search_Brand` |
| Search - Non-branded | `Search_NB` | `NL_NL_Search_NB_CRM` |
| Search - DSA | `Search_DSA` | `NL_NL_Search_DSA` |
| Search - Competitors | `Search_Competitors` | `NL_NL_Search_Competitors` |
| Performance Max - Full | `Pmax_Full` | `NL_NL_Pmax_Full` |
| Performance Max - Feed-Only | `Pmax_PLA` | `NL_NL_Pmax_PLA` |
| YouTube - Views | `YouTube_Views` | `NL_NL_YouTube_Views` |
| YouTube - Conversions | `YouTube_Conversions` | `NL_NL_YouTube_Conversions` |
| YouTube - Remarketing | `YouTube_Remarketing` | `NL_NL_YouTube_Remarketing` |
| Display - Prospecting | `Display_Prospecting` | `NL_NL_Display_Prospecting` |
| Display - Remarketing | `Display_Remarketing` | `NL_NL_Display_Remarketing` |
| App - Installs | `App_Installs_Android` | `NL_NL_App_Installs_Android` |

> 💡 **For Display, Video, and Demand Gen campaigns:** add `_Prospecting` or `_Remarketing` to differentiate between the two.

---

## Formatting rules

| Rule | Do | Do not |
|------|-----|--------|
| Delimiter | Use underscores (`_`) consistently | Mix delimiters or use spaces |
| Capitalization | Capitalize each section for readability: `Search`, `NL`, `Brand` | Use all lowercase or inconsistent casing |
| Length | Keep under 75 characters | Create names that get truncated in third-party tools |
| Special characters | Letters, numbers, underscores only | Use `&`, `%`, `$`, `#`, or other special characters |
| Objectives/targets/budgets | Use campaign labels for these | Put targets or budgets in the campaign name |

---

## Common mistakes

| Mistake | Why it is a problem | Fix |
|---------|--------------------|----|
| No naming convention at all | Campaign names are inconsistent, hard to filter, slow onboarding | Adopt this convention for all new campaigns |
| Including budgets or targets in names | Names become outdated when targets change, adds clutter | Use labels for budget/target tracking |
| Using spaces in names | Causes issues in exports and third-party integrations | Use underscores |
| Inconsistent abbreviations | `Srch` in one campaign, `Search` in another creates confusion | Pick one value and use it everywhere |
| Missing geo or language | Cannot filter campaigns by market in reporting | Always include country and language codes |
| Overly long names | Truncated in Google Ads UI columns and third-party dashboards | Keep under 75 characters |

---

## Related documents

| Document | Relationship |
|----------|-------------|
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | When and why to segment campaigns (naming follows structure) |
| [Search Ad Group Structure Mental Model](../mental-models/Search Ad Group Structure Mental Model.md) | Ad group naming conventions |
| [SOP – Build Search Campaign Structure](../sops/SOP – Build Search Campaign Structure.md) | Campaign construction workflow (applies this naming convention) |
| [Search Campaign Launch Checklist](../checklists/Search Campaign Launch Checklist.md) | Pre-launch validation (checks naming) |

---

## Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
