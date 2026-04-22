# Conversion Action Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_12
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents the configuration options for every Google Ads conversion action: macro vs. micro, primary vs. secondary, attribution models, conversion windows, and counting methods.

---

## What this reference is / What this is NOT

**This reference:**

- Defines macro and micro conversion types with classification criteria
- Explains primary vs. secondary conversion action roles
- Documents attribution models, conversion windows, and counting methods
- Provides recommended settings by vertical

**This reference does NOT:**

- Explain which tracking techniques to implement (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))
- Provide pixel installation steps (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Cover minimum conversion volume requirements (See: [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md))

---

## Quick reference: conversion action settings

| **Setting** | **Options** | **Default** | **Impact** |
|-------------|------------|-------------|-----------|
| **Goal category** | Purchase, Lead, Signup, Page View, Other, etc. | Depends on action type | Determines grouping for account/campaign goals |
| **Optimization** | Primary / Secondary | Primary | Primary = used for bidding + reporting. Secondary = reporting only |
| **Attribution** | Data-Driven (DDA) / Last Click (LCA) | Data-Driven | How credit is distributed across touchpoints |
| **Click-through window** | 1-90 days | 30 days | How long after a click a conversion can be attributed |
| **View-through window** | 1-30 days | 1 day | How long after an ad view (no click) a conversion can be attributed |
| **Engaged-view window** | 1-30 days | 3 days | How long after a 10-second video view a conversion can be attributed |
| **Counting** | Every / One | Every | Whether to count all conversions or one per interaction |
| **Value** | Static / Dynamic | Varies | Revenue value assigned to each conversion |

---

## 1️⃣ Macro vs. micro conversions

### Definitions

| | **Macro conversions** | **Micro conversions** |
|--|----------------------|----------------------|
| **Definition** | Primary actions directly tied to business objectives and revenue | Secondary actions that indicate progress toward macro conversions |
| **Role** | Measure campaign success | Provide funnel insights and serve as backup signals |
| **Typical optimization** | Primary conversion action | Secondary conversion action |

### Macro conversion examples by vertical

| Vertical | Macro conversions |
|----------|-------------------|
| **Ecommerce** | Purchase, booking confirmation |
| **Lead Gen** | Form submission, phone call, appointment booking |
| **SaaS** | Signup, free-to-paid conversion, subscription purchase |

### Micro conversion examples by vertical

| Vertical | Micro conversions |
|----------|-------------------|
| **Ecommerce** | Product page view, add-to-cart, begin checkout, add shipping info, add payment info |
| **Lead Gen** | Lead magnet download, video view, high-value page view, calculator usage |
| **SaaS** | Feature activation, onboarding step completion, documentation visit |

### When micro conversions become primary

Use micro conversions as a primary conversion action only when:

| Condition | Example | Action |
|-----------|---------|--------|
| Campaign goal is not revenue-tied | Upper funnel campaign optimizing for whitepaper downloads | Set the micro conversion as campaign-specific primary |
| Insufficient macro conversion volume | Campaign has <30 macro conversions/month | Consider consolidation and portfolio strategies first, micro conversion second |
| Conversion cycle exceeds 90-day cookie window | B2B enterprise with 6-month sales cycle | Optimize for a mid-funnel step (qualified lead instead of closed deal) |
| Experimental testing | Testing whether a higher-volume signal improves Smart Bidding | Run a 50/50 experiment before switching fully |

> ⚠️ **Exhaust consolidation tactics before switching to micro conversions:** Consolidate campaigns, use portfolio bid strategies, or remove bid targets first. Micro conversions are a proxy for revenue, not a replacement. (See: [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md))

### Vanity metrics to avoid

Do not track these as conversion actions:

- Quality visits or "engaged sessions"
- Time on site thresholds
- Bounce rate improvements
- Generic page views without business value
- Scroll depth events

**The test:** Does this metric directly or indirectly drive revenue? If not, it's vanity.

---

## 2️⃣ Primary vs. secondary conversion actions

### How they work

| | **Primary** | **Secondary** |
|--|-------------|---------------|
| **Reported in** | Conversions columns (Conversions, CPA, Conv. Rate, Conv. Value, ROAS) | All Conversions columns only |
| **Used by Smart Bidding** | Yes | No |
| **Affects optimization decisions** | Yes (n-gram analysis, bid adjustments) | No (observation only) |
| **Default for new actions** | Yes | Must be manually changed |

### How to view secondary conversions

Two methods:

1. **Segment method:** Add "All Conversions" columns to reports, then segment by Conversion Action
2. **Custom columns method (recommended):** Create custom columns filtering "All Conversions" by specific conversion action name. Enables persistent column configurations and custom calculations (e.g., add-to-cart to purchase ratio)

### Classification guide

| Action type | Recommended optimization | Rationale |
|-------------|------------------------|-----------|
| Macro conversions (purchases, leads, signups) | Primary | Directly tied to business outcome |
| Micro conversions (add-to-cart, page views) | Secondary | Use for insights and funnel analysis |
| Backup/redundant tracking (GA4 import alongside GACT) | Secondary | Prevents double-counting in bidding |
| OCT imports (qualified leads, closed deals) | Primary | Higher-quality signal than form submission |
| Profit-based conversions (ProfitMetrics, custom profit import) | Primary | Enables value-based bidding on margins |

---

## 3️⃣ Account-default vs. campaign-specific goals

### How goal assignment works

Google Ads uses a two-level goal system:

1. **Account-default goals:** Applied to all campaigns by default. Set at Goals > Conversion Summary.
2. **Campaign-specific goals:** Override account defaults for individual campaigns. Set at Campaign Settings > Conversion Goals.

Within each goal category (Purchase, Lead, Signup, etc.), only primary conversion actions are used for bidding and reporting.

### When to use campaign-specific goals

| Scenario | Example |
|----------|---------|
| A/B testing conversion actions | Testing revenue-based vs. profit-based primary actions |
| Upper funnel campaigns with different objectives | Display campaign optimizing for whitepaper downloads instead of purchases |
| OCT vs. GACT for different campaign types | Bottom-of-funnel uses OCT import, upper funnel uses GACT pixel |
| Low-volume campaigns needing micro conversion | One campaign switches to add-to-cart while others stay on purchase |

> ⚠️ **Triple-check your goal settings:** Misconfigured goals are one of the most common account setup errors. After any change, verify: (1) account-default goal categories, (2) primary conversion actions within each category, (3) campaign-level goal overrides.

---

## 4️⃣ Attribution models

Google Ads currently supports two attribution models:

| Model | How credit is assigned | Best for |
|-------|----------------------|----------|
| **Data-Driven Attribution (DDA)** | Machine learning distributes credit across all Google Ads touchpoints based on their contribution to conversion | 99% of accounts (recommended default) |
| **Last Click Attribution (LCA)** | 100% credit to the final ad interaction before conversion | Legacy accounts, simple single-touchpoint funnels |

> 💡 **Use DDA for all conversion actions:** It provides a more accurate view of how campaigns, ad groups, and keywords contribute to conversions across the full funnel. LCA systematically under-credits upper and mid-funnel interactions.

### Attribution scope

| Tracking method | Attribution scope |
|----------------|-------------------|
| Google Ads Conversion Tracking (GACT) pixel | Google Ads paid interactions only |
| GA4 event import (default) | Google paid channels only |
| GA4 event import (cross-channel setting) | Google paid + organic channels |

**If using GA4 imports as primary:** Consider enabling the "paid and organic channels" attribution setting in GA4 for a more balanced view. This reduces over-attribution to paid clicks by including organic touchpoints.

### Over-attribution: the double-edged sword

| | **Pro** | **Con** |
|--|---------|---------|
| **Effect** | More conversion signals for Smart Bidding | Inflated CPA/ROAS metrics |
| **Impact** | Better algorithm learning, more consistent performance | Risk of overspending if targets aren't adjusted |
| **Action** | Leverage the richer data input | Recalibrate efficiency targets using backend data or third-party attribution |

**Recalibration formula:** If Google Ads reports 300% ROAS but backend shows 220% ROAS, set your target ROAS to ~410% in Google Ads (300/220 x 300) to achieve real 300% performance.

---

## 5️⃣ Conversion windows

### Window types

| Window type | What it tracks | Default | Max | Adjustable by |
|-------------|---------------|---------|-----|--------------|
| **Click-through** | Conversions after ad click | 30 days | 90 days | 1-day increments |
| **View-through** | Conversions after ad view (no click) | 1 day | 30 days | 1-day increments |
| **Engaged-view** | Conversions after 10+ second video view | 3 days | 30 days | 1-day increments |

### Choosing the right window length

| Sales cycle | Recommended click-through window | Verticals |
|-------------|--------------------------------|-----------|
| Same day to 3 days | 7-14 days | Ecommerce (impulse), local services |
| 1-2 weeks | 14-30 days | Ecommerce (considered), B2C lead gen |
| 2-4 weeks | 30-60 days | B2B services, SaaS trials |
| 1-3 months | 60-90 days | B2B enterprise, luxury goods, real estate |

**How to determine your window:**
1. Open Goals > Measurement > Attribution > Path Metrics
2. Check "Average days to conversion"
3. Set your click-through window to at least 2x the average conversion lag
4. For view-through and engaged-view, keep shorter (1-7 days) unless you have specific upper-funnel attribution needs

### Shorter vs. longer windows

| | **Shorter window** | **Longer window** |
|--|-------------------|-------------------|
| **Advantage** | Reduces over-attribution, focuses on quick converters | Captures delayed conversions, better for long sales cycles |
| **Disadvantage** | Misses late converters, underreports true impact | Over-attributes to older interactions, inflates metrics |
| **Best for** | Ecommerce with fast purchase cycles | B2B, luxury, complex consideration purchases |

### Testing window changes safely

Duplicate your primary conversion action, set the duplicate as primary with the new window length, and compare results over 1-2 conversion cycles. This lets you evaluate impact without disrupting Smart Bidding on your current action.

> ⚠️ **Be wary of view-through and engaged-view conversions:** These are passive attribution signals. A user who saw your ad but converted through another channel will still be credited. Discount these conversions when evaluating upper-funnel campaign performance.

---

## 6️⃣ Conversion counting

### Counting options

| Method | Counts | Best for | Example |
|--------|--------|----------|---------|
| **Every** | All conversions per ad interaction | Ecommerce (each transaction has value) | 1 click, 3 purchases = 3 conversions |
| **One** | Maximum one conversion per ad interaction | Lead Gen, SaaS (each lead is unique) | 1 click, 2 form submissions = 1 conversion |

### Recommended counting by conversion type

| Conversion type | Recommended counting | Rationale |
|----------------|---------------------|-----------|
| Purchase/transaction | Every | Each purchase generates revenue |
| Form submission/lead | One | Multiple submissions from one user = one lead |
| Phone call | One | Multiple calls from one prospect = one lead |
| Signup/registration | One | User can only register once meaningfully |
| Add-to-cart | Every | Each cart action is a signal |
| Subscription purchase | Every | Each renewal is revenue |

### Repeat rate

The repeat rate metric shows the average number of conversions per converting interaction. Find it at Goals > Conversion Summary > All Conversion Actions (top right) > Repeat Rate column.

**Using repeat rate to evaluate counting impact:**

- If counting is set to "One" and repeat rate is 1.5: switching to "Every" would increase conversion volume by ~50%
- If counting is set to "Every" and repeat rate is 1.8: switching to "One" would decrease conversion volume by ~44%

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Multiple primary macro conversions double-counting | Smart Bidding optimizes for inflated volume | Keep one primary macro conversion per goal category per campaign |
| All micro conversions set to primary | Dilutes Smart Bidding signal with low-value actions | Set micro conversions to secondary unless intentionally used for bidding |
| Using Last Click attribution | Under-credits upper/mid-funnel campaigns | Switch to Data-Driven Attribution |
| 90-day click window for impulse purchases | Over-attributes old clicks to recent purchases | Match window to actual conversion lag (check Path Metrics) |
| Counting set to "Every" for lead gen | One lead submitting twice = two "conversions" | Switch to "One" for lead-type actions |
| No campaign-specific goals for upper funnel | YouTube/Display campaigns optimized for purchase (too few conversions) | Set campaign-specific goal with appropriate primary action |
| Ignoring engaged-view conversions in CPA | CPA looks great but most conversions are view-through | Create custom columns separating click-through from view-through conversions |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Framework for prioritizing tracking techniques |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Volume requirements that interact with conversion action settings |
| [Conversion Tracking Configuration Guidelines](../guidelines/Conversion Tracking Configuration Guidelines.md) | Recommended default settings for all conversion actions |
| [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md) | Validates conversion action configuration completeness |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Step-by-step implementation |
| [Goals and KPIs Mental Model](../mental-models/Goals and KPIs Mental Model.md) | Goals define what macro/micro conversions to track |

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

© 2026 PPC Mastery B.V. All rights reserved.
