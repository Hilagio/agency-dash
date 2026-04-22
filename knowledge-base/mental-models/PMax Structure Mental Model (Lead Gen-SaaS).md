# PMax Structure Mental Model (Lead Gen/SaaS)
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: MENTALMODEL_14
Status: Done
Reference Type: Mental Model
Agent_Readable: No
Human_Facing: Yes
Applies_To: Lead Gen, SaaS
Domain: PMax
Pillar: 6

## Purpose

This mental model helps you structure Performance Max campaigns specifically for Lead Gen and SaaS, where lead quality is the primary concern.

> ❓ **The core question:** How should I structure PMax for Lead Gen/SaaS to maximize qualified leads rather than raw form submissions?

Lead Gen and SaaS PMax is fundamentally different from Ecommerce PMax. There is no product feed. Success depends entirely on **lead quality signals**, **audience targeting**, and **creative assets**. Without proper lead quality tracking, PMax will optimize for volume, not value.

> ⚠️ **Lead quality is the #1 PMax risk for Lead Gen/SaaS:** Without offline conversion import or lead scoring, PMax optimizes for the cheapest form fills, often your lowest quality leads.

---

## What this is NOT

This mental model does **not:**

- Help structure Ecommerce PMax (See: [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>))
- Explain product feed requirements (See: [Product Feed Quality Mental Model](../mental-models/Product Feed Quality Mental Model.md))
- Provide volume thresholds (See: [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md))
- Provide step-by-step PMax setup (See: [SOP – Launch PMax for Lead Gen/SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md))
- Explain offline conversion import setup (See relevant conversion tracking documentation)

---

## The lead quality problem

PMax optimizes for what you tell it to optimize for. If you only track form submissions, PMax will find the cheapest form fills.

### Quality signal hierarchy

| **Signal type** | **Quality** | **Implementation** |
|-----------------|-------------|-------------------|
| **Closed revenue** | ★★★ Best | CRM integration, offline conversion import |
| **Sales-qualified leads (SQL)** | ★★☆ Good | Offline conversion import with SQL stage |
| **Marketing-qualified leads (MQL)** | ★☆☆ Acceptable | Lead scoring + conversion import |
| **Form submissions only** | ⚠️ Risky | Default tracking (no quality signal) |

> 💡 **Minimum viable quality signal:** Import at least one downstream conversion (MQL, SQL, or opportunity) with values. PMax can then optimize for value, not just volume.

### Implementation options

| **Method** | **Complexity** | **Accuracy** |
|------------|---------------|--------------|
| Google Ads offline conversion import | Medium | High |
| Enhanced conversions for leads | Low | Medium |
| Salesforce/HubSpot native integration | Low-Medium | High |
| Zapier/API custom integration | High | High |

---

## The PMax decision for Lead Gen/SaaS

| **Use PMax when...** | **Skip PMax when...** |
|----------------------|----------------------|
| You have offline conversion import configured | Form submissions are your only metric |
| 30+ tracked conversions/month (quality signal) | <30 conversions/month |
| Search campaigns are maxed out | Search alone meets your goals |
| You have quality audience signals | No first-party data available |
| You want cross-channel reach | You need keyword-level control |

---

## Campaign structure options

### Option 1: Single PMax campaign

One PMax campaign with multiple asset groups.

| **Pros** | **Cons** |
|----------|----------|
| Maximum data consolidation | Less budget control per theme |
| Faster learning | Harder to isolate performance |
| Simpler management | One weak asset group can drag down others |

**Best for:** Low-spend accounts, single product/service, limited resources

### Option 2: Multiple PMax campaigns

Separate campaigns by product line, service, or audience.

| **Pros** | **Cons** |
|----------|----------|
| Budget control per theme | Data fragmentation |
| Clearer performance attribution | Slower learning per campaign |
| Can pause/adjust independently | More management overhead |

**Best for:** Higher-spend accounts, multiple products/services, different margin profiles

### Structure decision guide

| **If...** | **Then...** |
|-----------|-------------|
| Single offer, unified audience | Single campaign, multiple asset groups by angle |
| Multiple offers, different margins | Multiple campaigns by offer |
| Multiple audiences, same offer | Single campaign, asset groups by audience |
| Multiple offers AND audiences | Multiple campaigns, asset groups within each |

---

## Asset group strategy

Asset groups are the building blocks within a PMax campaign. Each asset group contains:

- Text assets (headlines, descriptions)
- Image assets
- Video assets (optional but recommended)
- Audience signals
- Final URL(s)

### Asset group approaches

| **Approach** | **Structure** | **Best for** |
|--------------|---------------|--------------|
| **By offer/service** | 1 asset group per service line | Different landing pages, different messages |
| **By audience** | 1 asset group per audience segment | Same offer, different targeting signals |
| **By messaging angle** | 1 asset group per message angle | Testing which angle resonates |
| **Hybrid** | Combine above | Mature accounts with sufficient volume |

### Asset group minimum composition

| **Asset type** | **Minimum** | **Recommended** |
|----------------|-------------|-----------------|
| Headlines (30 chars) | 3 | 5-11 |
| Long headlines (90 chars) | 1 | 2-5 |
| Descriptions (90 chars) | 2 | 4 |
| Images (1200×628) | 1 | 3+ |
| Images (square) | 1 | 3+ |
| Images (portrait) | 0 | 1+ |
| Video | 0 | 1+ (strongly recommended) |

> ⚠️ **Video is highly recommended:** Without video, PMax auto-generates from your images. Uploaded video performs better on YouTube placements.

> ↪️ **For detailed asset composition:** See [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md).

---

## Audience signals

Audience signals tell PMax where to **start** looking. They are suggestions, not restrictions.

### Signal quality hierarchy

| **Signal type** | **Quality** | **Use for** |
|-----------------|-------------|-------------|
| **Customer Match (closed deals)** | Highest | "Find more people like my customers" |
| **Customer Match (SQLs)** | High | "Find more qualified leads" |
| **Website converters** | High | "Find more people who submit forms" |
| **Custom segments (competitor URLs)** | Moderate | "Find people considering competitors" |
| **Custom segments (search terms)** | Moderate | "Find people searching relevant queries" |
| **In-market audiences** | Lower | Broad category signals |

### Minimum list sizes

| **List type** | **Minimum** | **Recommended** |
|---------------|-------------|-----------------|
| Customer Match | 1,000 matched | 5,000+ |
| Website visitors | 1,000 in 30 days | 5,000+ |
| Converters | 100 | 500+ |

> 💡 **Larger lists = stronger signals:** A 10,000-user Customer Match list gives PMax more patterns to learn from than a 1,000-user list.

> ↪️ **For detailed audience signal implementation:** See [Audience Signals Reference](../references/Audience Signals Reference.md).

---

## Geographic expansion

| **Scenario** | **Structure** | **Why** |
|--------------|---------------|---------|
| Single country | Single campaign | Consolidate data |
| Multiple countries, same language | Single campaign, all countries | Maximize data |
| Multiple countries, different languages | Separate campaigns per language | Different creative needed |
| Multiple countries, different pricing | Separate campaigns per country | Different conversion values |

> 💡 **Default to consolidation:** Split by geography only when you need different budgets, different creative (language), or different conversion values.

---

## PMax + Search coexistence

When running PMax alongside Search:

| **Principle** | **Implementation** |
|---------------|-------------------|
| Protect brand queries | Dedicated Brand Search campaign + brand exclusions in PMax |
| Protect high-value keywords | Exact match in Search (prioritized over PMax) |
| Let PMax discover | PMax finds incremental queries beyond your keyword set |

> ↪️ **For query routing rules:** See [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md).

---

## Common failure modes

| **Failure** | **Why it happens** | **How to prevent** |
|-------------|--------------------|---------|
| High volume, low quality leads | No quality signal imported | Set up offline conversion import before launch |
| Cannibalizing brand Search | Brand not excluded | Add brand exclusions during launch setup |
| No learning, poor performance | <30 conversions/month | Verify volume threshold is met before using PMax |
| Wasted spend on Display/YouTube | Weak creative assets | Validate creative quality before launch |
| Poor lead-to-close rate | Optimizing for form submissions only | Configure offline conversion pipeline (SQL or revenue data) before scaling |

---

## Volume thresholds

| **Bid strategy** | **Minimum conversions/month** |
|------------------|-------------------------------|
| Maximize Conversions (no target) | Works at any volume |
| Target CPA | 30+ |
| Maximize Conversion Value | Works at any volume |
| Target ROAS | 50+ |

> ↪️ **For complete volume thresholds:** See [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md).

---

## Key principles

1. **Lead quality signals are non-negotiable:** Don't launch PMax without offline conversion import. You'll get volume, not value.
2. **PMax is additive:** Use alongside Search, not instead of. PMax finds incremental demand across channels.
3. **Feed it good data:** Customer Match and website audiences dramatically improve targeting. No signals = spray and pray.
4. **Patience required:** PMax needs 2-4 weeks to learn. Don't judge in week one.
5. **Brand separation is mandatory:** Exclude your brand to see true acquisition costs.
6. **Structure by conversion value, not vanity metrics:** Different products/services may have different LTV. Structure campaigns to let PMax optimize for value.

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Parallel (different vertical) |
| [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md) | Reference (asset composition) |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference (signal types and implementation) |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Reference (brand exclusion setup) |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference (volume thresholds by bid strategy) |
| [Search PMax Query Routing Reference](../references/Search PMax Query Routing Reference.md) | Reference (query routing rules) |
| [PMax Launch Checklist (Lead Gen/SaaS)](<../checklists/PMax Launch Checklist (Lead Gen-SaaS).md>) | Checklist (pre-launch validation) |
| [SOP – Launch PMax for Lead Gen/SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md) | Execution (campaign setup) |

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
