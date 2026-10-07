# Google Recommendations Reference
Created: 2026-02-11
Updated: 2026-10-05

Agent_Readable: Yes
Category: Compliance
Human_Facing: Yes
Reference Type: Cheat Sheets
Status: Done
Support_ID: CHEATSHEET_48
Domain: Operational
Pillar: 0

## Purpose

Documents the full taxonomy of Google Ads recommendations, optimization score mechanics, auto-apply settings, and the dismiss/apply workflow.

---

## What this reference is / What this is NOT

**This reference:**

- Documents all recommendation categories and individual recommendation types
- Explains optimization score mechanics and calculation
- Covers auto-apply options and settings
- Provides the dismiss and apply workflow

**This reference does NOT:**

- Recommend which to accept or dismiss (See: [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md))
- Provide step-by-step management procedures (See: [SOP – Manage Google Recommendations](../sops/SOP – Manage Google Recommendations.md))
- Cover Google's Insights page (separate feature)

---

## Recommendation categories

Google Ads organizes recommendations into five categories. Each contains multiple individual recommendation types.

### 1️⃣ Ads and Assets

Recommendations to improve ad quality, add assets, and optimize ad rotation.

| **Recommendation** | **What Google suggests** |
|---------------------|--------------------------|
| Add responsive search ads | Create additional RSAs in ad groups. Google recommends 2-3 per ad group, the OS position is one (see [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md)) |
| Add assets to responsive search ads | Add missing headlines or descriptions |
| Add call assets | Add phone number to ads |
| Add callout assets | Add callout text to ads |
| Add sitelink assets | Add sitelink extensions |
| Add structured snippets | Add category-specific details |
| Add image assets | Add images to text ads |
| Add dynamic image assets | Auto-generate images from landing pages |
| Add dynamic sitelinks | Auto-generate sitelinks from site |
| Add price assets | Add price information to ads |
| Add lead form assets | Add lead capture forms |
| Add location assets | Add business address to ads |
| Add descriptions to sitelinks | Enhance existing sitelinks |
| Improve responsive search ads | Improve headlines and descriptions to reach "Good" ad strength |
| Improve responsive display ads | Add assets to reach "Excellent" ad strength |
| Improve Demand Gen ads | Add assets to reach "Excellent" ad strength |
| Improve App ad groups | Add assets to reach "Good" ad strength |
| Use optimized ad rotation | Switch to "Optimize" rotation |
| Fix disapproved assets | Resolve policy violations on ads and assets |
| Add video ads | Add video creative to eligible campaigns |
| Add videos with different orientations | Add landscape/portrait/square video variants |
| Enable text customization | Allow AI to customize ad text |

### 2️⃣ Automated Campaigns

Recommendations to adopt more automated campaign types.

| **Recommendation** | **What Google suggests** |
|---------------------|--------------------------|
| Create Performance Max campaign | Launch a PMax campaign |
| Create Performance Max with store goals | Launch PMax for local objectives |
| Improve Performance Max asset groups | Enhance PMax assets |
| Target more products with PMax | Expand product coverage in PMax |
| Upgrade dynamic campaigns to PMax | Migrate dynamic targeting into PMax final URL expansion |
| Turn on AI Max | Enable AI Max for Search campaigns |

### 3️⃣ Bidding and Budgets

Recommendations to adjust bid strategies, targets, and budgets.

| **Recommendation** | **What Google suggests** |
|---------------------|--------------------------|
| Adjust budgets | Increase budgets on budget-limited campaigns |
| Raise budgets for upcoming traffic | Pre-emptive budget increase |
| Move unused budgets | Reallocate from underspending campaigns |
| Bid more efficiently with Maximize Conversions | Switch to Maximize Conversions |
| Bid more efficiently with Maximize Conv. Value | Switch to Maximize Conversion Value |
| Bid more efficiently with Target CPA | Switch to or adjust tCPA |
| Bid more efficiently with Target ROAS | Switch to or adjust tROAS |
| Bid more efficiently with Maximize Clicks | Switch to Maximize Clicks |
| Bid more efficiently with Target IS | Switch to Target Impression Share |
| Adjust CPA targets | Loosen CPA targets to capture more volume |
| Adjust ROAS targets | Loosen ROAS targets to capture more volume |
| Set a bidding strategy target | Add a target to unconstrained strategies |
| Use portfolio bid strategy with shared budget | Consolidate bidding across campaigns |
| Upgrade to data-driven attribution | Switch attribution model |

> ⚠️ **Absent bidding recommendations are not a health signal.** Google calculates no recommended
> target for a campaign below 7 conversions, so low-volume campaigns simply show nothing here.
> Read the silence as insufficient data, never as approval of the current target.

### 4️⃣ Keywords and Targeting

Recommendations to expand reach and refine targeting.

| **Recommendation** | **What Google suggests** |
|---------------------|--------------------------|
| Add new keywords | Expand keyword list |
| Add broad match keywords | Switch to broader matching |
| Add brand inclusions with broad match | Opt into AI Max brand inclusions (the controlled Branded searches mode) with broad match |
| Remove conflicting negative keywords | Fix negatives blocking positive keywords |
| Remove non-serving keywords | Clean up zero-impression keywords |
| Remove redundant keywords | Consolidate duplicate keywords |
| Reach new audiences | Add audience segments |
| Create custom audiences | Build custom audience segments |
| Expand your reach with Search Partners | Enable Search Partner network |
| Expand your reach with Google Video Partners | Enable video partner network |
| Use optimized targeting | Enable expanded targeting on Demand Gen campaigns |
| Upload Customer Match lists | Add first-party audience data |
| Refresh Customer Match lists | Update stale audience data |
| Set up audience sources | Configure remarketing tags |
| Use Display Expansion | Enable Display network on Search campaigns |

### 5️⃣ Repairs

Recommendations to fix broken or misconfigured elements.

| **Recommendation** | **What Google suggests** |
|---------------------|--------------------------|
| Add ads to ad groups | Fix ad groups with no active ads |
| Add keywords to ad groups | Fix ad groups with no keywords |
| Add products to Shopping campaigns | Fix campaigns with no product targeting |
| Fix disapproved ads/assets | Resolve policy violations |
| Fix conversion tracking issues | Repair broken or misconfigured tracking |
| Complete advertiser verification | Verify identity for enhanced features |
| Add GTIN to products | Fix missing product identifiers |
| Add missing conversion parameters | Fix incomplete conversion setup |

---

## Optimization score

### What it is

Optimization score is Google's estimate of how well your account is set up to perform, expressed as a percentage from 0% to 100%.

### How it's calculated

| **Factor** | **Detail** |
|-----------|-----------|
| Base score | Starts at your current account configuration |
| Recommendation weight | Each recommendation has a point value |
| Total possible | Sum of all available recommendation point values |
| Score formula | (Total possible - sum of outstanding recommendations) / Total possible |

### Important context

| **What optimization score is** | **What optimization score is NOT** |
|-------------------------------|-----------------------------------|
| A measure of configuration alignment with Google's recommendations | A measure of actual account performance |
| Affected by applying or dismissing recommendations | Affected by your revenue, CPA, or ROAS |
| Used by Google reps as a management metric | A reliable indicator of account health |

> ⚠️ **Optimization score rewards Google's interests, not necessarily yours:** Higher scores often mean more automation and broader targeting, which increases spend. A score of 100% does not mean the account is performing optimally for your business goals.

---

## Auto-apply settings

### What auto-apply does

When enabled for a recommendation type, Google automatically implements that recommendation without your approval.

### Where auto-apply lives

Auto-apply is configured from the Recommendations page, under the "Auto-apply settings" control in the top right, which lists the recommendation types eligible for automatic application.

> ↪️ **For the navigation and audit sequence:** See [SOP – Manage Google Recommendations](../sops/SOP – Manage Google Recommendations.md).

### Auto-apply risk by category

| **Category** | **Risk level** | **Why** |
|--------------|---------------|---------|
| Ads and assets | Medium-High | Changes live creative without review |
| Automated campaigns | High | Creates or converts campaigns, a structural change |
| Bidding and budgets | High | Moves spend and bid targets directly |
| Keywords and targeting | High | Alters which queries and audiences are reachable |
| Repairs | Low | Restores serving on broken configuration |

> ↪️ **For the per-recommendation enable/disable position:** See [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md), which owns the stance and mirrors Google's own auto-apply sections.

---

## Dismiss vs. apply workflow

| **Action** | **What it does** | **Impact on score** |
|-----------|-----------------|---------------------|
| **Apply** | Implements the recommendation | Score increases by recommendation's point value |
| **Dismiss** | Removes the recommendation from the list | Score increases by recommendation's point value |
| **Dismiss all** | Removes all recommendations of a type | Score increases by total point value of dismissed type |
| **Ignore** | Leave recommendation in the list | Score stays the same |

**Key insight:** Dismissing a recommendation has the same optimization score impact as applying it, so a high score is reachable without implementing recommendations the account owner disagrees with.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Google Recommendations Management Guidelines](../guidelines/Google Recommendations Management Guidelines.md) | Guideline: which to enable/disable |
| [SOP – Manage Google Recommendations](../sops/SOP – Manage Google Recommendations.md) | Execution: recommendation review process |
| [Monthly Performance Review Checklist](../checklists/Monthly Performance Review Checklist.md) | Validation: monthly recommendation review |

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
