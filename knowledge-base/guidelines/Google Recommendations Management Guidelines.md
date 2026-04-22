# Google Recommendations Management Guidelines
Created: 2026-02-11

Agent_Readable: Yes
Category: Compliance
Human_Facing: Yes
Reference Type: Guideline
Status: Done
Support_ID: GUIDELINE_10
Domain: Operational
Pillar: 0

## Purpose

This guideline defines which Google Ads recommendations to accept, dismiss, or evaluate on a case-by-case basis, and establishes the default position on auto-apply settings.

---

## What this is / What this is NOT

**This guideline:**

- Defines the recommended enable/disable position for each recommendation category
- Explains the rationale for disabling auto-apply as the default
- Maps our position to Google's actual auto-apply interface categories
- Provides a verification checklist for recommendation settings

**This guideline does NOT:**

- Document how recommendations work technically (See: [Google Recommendations Reference](../references/Google Recommendations Reference.md))
- Provide the step-by-step management procedure (See: [SOP – Manage Google Recommendations](../sops/SOP – Manage Google Recommendations.md))
- Replace strategic decision-making about campaign structure or bidding

---

## Default position: disable auto-apply

The default position for all accounts managed under this system is: **disable auto-apply for all recommendation categories.**

Google's recommendations optimize for Google's interests (increased spend, broader targeting, more automation) which do not always align with your business goals. Manual review ensures every change serves your strategy.

---

## Auto-apply: Google's interface structure

Google organizes auto-apply into two sections: "Maintain your ads" (7 types) and "Grow your business" (14 types). Below is each recommendation with our recommended position.

### Maintain your ads (7 recommendations)

| **#** | **Recommendation** | **Our position** | **Rationale** |
|-------|--------------------|--------------------|---------------|
| 1 | Use optimized ad rotation | ✅ Keep enabled | Safe: shows better-performing ads at auction time. No content changes. |
| 2 | Improve your responsive search ads | ❌ Keep disabled | Modifies headline and description assets using existing content without review. Can overwrite intentional testing variants. |
| 3 | Remove redundant keywords | ❌ Keep disabled | May remove structurally intentional keywords (e.g., same keyword in different ad groups for testing or different landing pages). |
| 4 | Remove non-serving keywords | ✅ Conditional | Safe only with weekly review. Keywords had zero impressions, so removal risk is low. Check weekly that removed keywords were genuinely non-serving, not blocked by other issues. |
| 5 | Remove conflicting negative keywords | ✅ Conditional | Safe only after verifying your negative keyword structure is intentional. Some conflicts are deliberate (e.g., funneling traffic to specific ad groups). Review weekly. |
| 6 | Use optimized targeting | ❌ Keep disabled | Expands audience beyond your intended targeting. Particularly dangerous for lead gen where targeting precision matters. |
| 7 | Upgrade conversion tracking | ⚠️ Case-by-case | Data-driven attribution is generally better than last-click, but switching changes reported data retroactively. Evaluate the impact on your reporting and bid strategy learning before applying. |

### Grow your business (14 recommendations)

All 14 are disabled by default. Our position: **keep all disabled.**

#### Keywords and Targeting

| **#** | **Recommendation** | **Our position** | **Rationale** |
|-------|--------------------|--------------------|---------------|
| 1 | Add new keywords | ❌ Disable | Google suggests overly broad keywords that waste spend. Keywords require negative keyword prep and ad copy alignment. |
| 2 | Add broad match keywords | ❌ Disable | Expanding match type without negative keyword coverage causes waste. Broad match adoption is a strategic decision. |
| 3 | Use Display Expansion | ❌ Disable | Enables Display network on Search campaigns, diluting search intent targeting. |

#### Bidding

| **#** | **Recommendation** | **Our position** | **Rationale** |
|-------|--------------------|--------------------|---------------|
| 4 | Bid more efficiently with Target impression share | ❌ Disable | Bid strategy switches require testing and sufficient conversion data, not auto-application. |
| 5 | Bid more efficiently with Maximize clicks | ❌ Disable | Switching to Maximize clicks removes conversion optimization. |
| 6 | Bid more efficiently with Maximize conversions | ❌ Disable | Bid strategy changes require controlled testing. |
| 7 | Bid more efficiently with Maximize conversion value | ❌ Disable | Value-based bidding requires verified conversion values and sufficient volume. |
| 8 | Bid more efficiently with Maximize conversions using a target CPA | ❌ Disable | Target CPA setting requires business context and testing. |
| 9 | Bid more efficiently with Maximize conversion value using a target ROAS | ❌ Disable | Target ROAS setting requires business context and testing. |
| 10 | Set a target CPA | ❌ Disable | CPA targets require unit economics context. |
| 11 | Set a target ROAS | ❌ Disable | ROAS targets require margin data. |
| 12 | Adjust your CPA targets | ❌ Disable | Loosening targets reduces efficiency without business approval. |
| 13 | Adjust your ROAS targets | ❌ Disable | Loosening targets reduces efficiency without business approval. |
| 14 | Add store visits as an account default goal | ❌ Disable | Store visit goals change bid strategy behavior and require validated store visit tracking. |

---

## Rationale for manual control

### 1️⃣ Recommendations optimize for Google's goals, not yours

Google's recommendation engine is designed to increase advertiser spend and adoption of automated features. Recommendations like "raise your budget" and "expand with broad match" consistently push toward more spend and less control.

### 2️⃣ Recommendations lack business context

Google's algorithms do not know your:
- Profit margins and unit economics
- Capacity constraints
- Seasonal patterns specific to your business
- Strategic priorities and testing roadmap

### 3️⃣ Auto-apply creates invisible account changes

Auto-applied changes happen without notification (unless you check Change History). This creates:
- Difficulty diagnosing performance changes
- Potential conflicts with intentional strategy
- Erosion of account control over time

### 4️⃣ Optimization score is not performance

Optimization score measures alignment with Google's recommendations, not actual account performance. An account with a 60% optimization score can outperform one with 95% if the lower-scored account is strategically managed.

---

## Handling Google reps and optimization score

Google account representatives frequently pressure advertisers to increase optimization score. Respond with:

1. **Acknowledge the score** but redirect to performance metrics
2. **Dismiss irrelevant recommendations** to increase score without implementing them
3. **Document your rationale** for maintaining low-score positions if challenged
4. **Focus conversations on business outcomes** (CPA, ROAS, profit) not optimization score

> 💡 **Dismissing recommendations increases optimization score:** You can maintain a high score by reviewing and dismissing recommendations you disagree with, rather than implementing them.

---

## Configuration verification

After configuring recommendation settings, verify:

| **Check** | **Expected state** |
|-----------|-------------------|
| Auto-apply: Maintain your ads, Optimized ad rotation | ON |
| Auto-apply: Maintain your ads, Improve RSAs | OFF |
| Auto-apply: Maintain your ads, Remove redundant keywords | OFF |
| Auto-apply: Maintain your ads, Remove non-serving keywords | OFF (or ON with weekly review) |
| Auto-apply: Maintain your ads, Remove conflicting negatives | OFF (or ON with verified negative structure) |
| Auto-apply: Maintain your ads, Use optimized targeting | OFF |
| Auto-apply: Maintain your ads, Upgrade conversion tracking | OFF (evaluate case-by-case) |
| Auto-apply: Grow your business (all 14) | All OFF |
| Change History review | Scheduled weekly |
| Recommendation review | Scheduled monthly |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Google Recommendations Reference](../references/Google Recommendations Reference.md) | Reference: full recommendation taxonomy and mechanics |
| [SOP – Manage Google Recommendations](../sops/SOP – Manage Google Recommendations.md) | Execution: recommendation review process |
| [Account Change History Reference](../references/Account Change History Reference.md) | Reference: tracking auto-applied changes |
| [Monthly Performance Review Checklist](../checklists/Monthly Performance Review Checklist.md) | Validation: monthly recommendation review item |

---

## Version details

- **Version:** 3.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer
- **Changelog:** v3.0: Removed Google default column from Maintain your ads table. Removed Exception conditions section. Sentence case on section headings. v2.0: Restructured auto-apply section to match Google's actual interface categories (Maintain your ads, Grow your business). Added per-recommendation position with rationale based on Google's auto-apply source data. Expanded Grow your business to all 14 recommendation types. Updated configuration verification table to match new structure.

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
