# Automated Assets Control Guidelines
Created: 2026-02-04
Updated: 2026-10-05

Support_ID: GUIDELINE_1
Status: Done
Category: Creative
Reference Type: Guideline
Agent_Readable: No
Human_Facing: No
Bucket: Creative
Domain: Creative
Pillar: 8

## Purpose

This guideline defines the boundaries and recommended configurations for Google's account-level automated assets. It supports extension management by establishing which automated features to enable or disable and why.

---

## What this is / What this is NOT

**This guideline:**

- Defines recommended on/off states for each automated asset type
- Explains the rationale behind each recommendation
- Establishes when exceptions apply

**This guideline does NOT:**

- Enumerate manual extension options (See: [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md))
- Validate extension coverage (See: [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md))
- Provide step-by-step execution instructions

---

## What are automated assets?

Google can automatically generate and display certain assets without explicit creation. These are configured at the account level (and well hidden 😉)

**Location:** Google Ads > Assets > Assets > Associations > Account-level automated assets > Account-level automated assets settings > Advanced settings

---

## Automated asset types

| Automated Asset | What Google Does |
| --- | --- |
| Dynamic sitelinks | Auto-generates sitelinks from website content |
| Dynamic callouts | Auto-generates callouts from website content |
| Dynamic structured snippets | Auto-generates snippets from website content |
| Dynamic images | Auto-selects images from landing pages |
| Dynamic business names | May alter business name display |
| Dynamic business logos | May auto-select logo from website |
| Automated locations | Auto-adds location from Business Profile |
| Automated apps | Auto-promotes app |
| Store ratings | Shows ratings from third-party sources |
| Longer ad headlines | Extends headline character limits |

---

## Recommended configuration

### Assets to DISABLE

| Automated Asset | Recommendation | Rationale |
| --- | --- | --- |
| Dynamic sitelinks | **OFF** | Curated sitelinks are more strategic: auto-generated ones link to irrelevant pages |
| Dynamic callouts | **OFF** | Auto-generated callouts run generic, off-message, or pull outdated content |
| Dynamic structured snippets | **OFF** | Surfaces irrelevant or inconsistent information from the site |
| Dynamic images | **OFF** | Pulls low-quality, irrelevant, or outdated images |
| Dynamic business names | **OFF** | The brand name stays consistent: auto-modification creates confusion |
| Dynamic business logos | **OFF** | Use the official logo: auto-selection pulls incorrect assets |
| Automated locations | **OFF** | Add locations intentionally, based on campaign strategy |
| Automated apps | **OFF** | Promote an app only when it is strategically aligned with campaign goals |

> ⚠️ **Business name must match your verified legal name or domain name.** A business name asset that does not match triggers disapproval. Set it once, correctly, at the brand-guidelines level.

### Assets to ENABLE

| Automated Asset | Recommendation | Rationale |
| --- | --- | --- |
| Store ratings | **ON** | Free credibility boost from third-party sources, minimal message control risk |
| Longer ad headlines | **ON** | Additional ad real estate with minimal risk: Google extends existing headlines |

---

## Rationale for disabling most automated assets

### 1️⃣ Message consistency

Auto-generated assets do not align with your value proposition, campaign strategy, or current messaging. 

They pull content from website without understanding context.

### 2️⃣ Quality control

Google pulls content from site pages, which includes:

- Outdated information
- Irrelevant content from unrelated pages
- Poorly formatted or incomplete text
- Images not intended for advertising

### 3️⃣ Testing integrity

When Google adds unknown variables (auto-generated assets), controlled creative testing becomes unreliable. Performance changes cannot be attributed to intentional changes.

### 4️⃣ Brand control

Brand name, logo, and messaging represent the company. Auto-modification without oversight creates brand consistency risks.

---

## Exception conditions

### Store ratings: ON, with one qualification

- **Prerequisite:** Business has positive ratings on third-party review platforms
- **If ratings are poor:** Keep OFF until the ratings improve
- **Benefit:** Social proof with no message control risk

### Longer ad headlines: Always ON

- **Benefit:** Additional ad real estate
- **Risk:** Minimal (Google extends existing headlines, doesn't create new content)
- **No known exceptions**

### Dynamic assets: Rare exceptions

Enable dynamic assets (sitelinks, callouts, snippets, images) temporarily when either condition holds:

- The account is brand new with no manual extensions created yet
- You are testing automated performance against a manual baseline

Both cases are temporary. Manual assets replace the automated ones once they exist.

---

## Configuration verification

After configuring automated assets, verify:

| Check | Expected State |
| --- | --- |
| Dynamic sitelinks | OFF |
| Dynamic callouts | OFF |
| Dynamic structured snippets | OFF |
| Dynamic images | OFF |
| Dynamic business names | OFF |
| Dynamic business logos | OFF |
| Automated locations | OFF |
| Automated apps | OFF |
| Store ratings | ON |
| Longer ad headlines | ON |

---

## Related documents

| Document | Relationship |
| --- | --- |
| [Asset Optimization Control Guidelines](../guidelines/Asset Optimization Control Guidelines.md) | Parallel (covers campaign and ad-level asset optimization settings) |
| [Extension Leverage Catalog](../catalogs/Extension Leverage Catalog.md) | Manual extension options that replace automated assets |
| [Extension Coverage Checklist](../checklists/Extension Coverage Checklist.md) | Validates extension coverage |

---

## Version details

- **Version:** 3.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.