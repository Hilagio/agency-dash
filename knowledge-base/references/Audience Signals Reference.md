# Audience Signals Reference
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CHEATSHEET_4
Status: Done
Category: Operational
Reference Type: Cheat Sheet
Agent_Readable: Yes
Human_Facing: Yes
Domain: Audiences
Pillar: 7

## Purpose

Documents signal types, search themes syntax, and exclusion settings for Performance Max campaigns.

---

## What this is / What this is NOT

**This reference:**

- Lists signal types available in Performance Max
- Documents search theme behavior and syntax
- Provides exclusion configuration options

**This reference does NOT:**

- Explain signals vs targeting conceptually (See: [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md))
- Provide step-by-step campaign setup (See: [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md))
- Cover Display, Video, or Demand Gen targeting (See: [Audience Targeting Reference](../references/Audience Targeting Reference.md))

---

## Quick reference: signal types

| **Signal type** | **Source** | **Quality tier** | **Configuration level** |
| --- | --- | --- | --- |
| Customer Match | CRM upload | 🥇 Highest | Asset group |
| Website converters | Google tag | 🥇 Highest | Asset group |

> 💡 **Signal quality drives learning speed:** Higher-quality signals give Google's AI a sharper starting profile of your ideal customer, which means fewer wasted impressions during the learning phase. Low-quality signals (broad affinity, demographics alone) force the algorithm to explore widely before it converges on profitable audiences. The difference is measurable: campaigns seeded with Tier 1-2 signals typically exit learning faster and hit stable CPA/ROAS sooner than campaigns relying on Tier 4-5 signals alone.
| Website visitors | Google tag | 🥈 High | Asset group |
| YouTube engaged | Channel link | 🥈 High | Asset group |
| App users | Firebase/SDK | 🥈 High | Asset group |
| Custom segments (search) | Keywords | 🥉 Moderate | Asset group |
| Custom segments (URLs) | Competitor sites | 🥉 Moderate | Asset group |
| Search themes | Keywords | 🥉 Moderate | Asset group |
| In-market | Google predefined | 📊 Lower | Asset group |
| Life events | Google predefined | 📊 Lower | Asset group |
| Affinity | Google predefined | 📉 Lowest | Asset group |
| Demographics | Age/gender/income | 📉 Lowest | Asset group |

---

## Your data signals

### Customer Match

| **Specification** | **Details** |
| --- | --- |
| **Minimum list size** | 100 matched users |
| **Data types accepted** | Email, phone, address, mobile device ID |
| **Upload methods** | CSV upload, API, CRM integration |
| **Match rate range** | 25-75% typical |
| **Refresh recommendation** | Weekly (minimum monthly) |

**Match rate optimization:**

| **Data provided** | **Expected Match Rate lift** |
| --- | --- |
| Email only | Baseline |
| Email + Phone | +15-20% |
| Email + Phone + Address | +25-30% |

### Website/App Data

| **Signal** | **Minimum size** | **Membership duration options** |
| --- | --- | --- |
| All visitors | 100 | 30, 60, 90, 180, 540 days |
| Converters | 100 | 30, 60, 90, 180, 540 days |
| Cart abandoners | 100 | 7, 14, 30 days |
| Product viewers | 100 | 14, 30, 60 days |
| App users | 100 | 30, 60, 90, 180 days |

### YouTube Signals

| **Signal** | **Requirement** |
| --- | --- |
| Video viewers | Channel linked to Google Ads |
| Subscribers | Channel linked to Google Ads |
| Channel visitors | Channel linked to Google Ads |

---

## Custom segments

### Input types

| **Input** | **What it targets** | **Syntax** |
| --- | --- | --- |
| **Search terms** | Users who searched these terms | Plain text keywords |
| **URLs** | Users who browse similar sites | Full URLs (https://) |
| **Apps** | Users who use similar apps | App names or package IDs |

> ⚠️ **URLs and apps target users with similar behavior:** They do NOT place ads on those sites/apps.

### Custom segment best practices

| **Do** | **Don't** |
| --- | --- |
| Use 10-15 high-converting search terms | Add hundreds of keywords |
| Include competitor URLs | Expect ads on those sites |
| Focus on transactional terms | Use broad informational terms |

---

## Search themes

Search themes share your unique business insights with Performance Max across **all channels,** not just Search. They function as both audience signals AND search placements.

### Search themes vs custom segments

| Aspect | Custom segments (search keywords) | Search themes |
| --- | --- | --- |
| **Inventory** | Non-Search only | All channels (Search + non-Search) |
| **User behavior** | Searched in the past | Currently searching OR searched in the past |
| **Function** | Audience signal only | Audience signal + search placement |
| **Limit** | No hard limit | 25 per asset group |

> 💡 **Search themes do everything custom segments do in Performance Max, and more:** Use search themes to share unique business insights that work across any channel.

### Search theme behavior

| Aspect | Details |
| --- | --- |
| **Prioritization** | Same as phrase/broad match keywords in Search |
| **Competes with** | Your Search campaign keywords (when identical to query) |
| **Matching** | Inputted terms + related terms |

---

## Auction priority rules (Search inventory)

When PMax search themes compete with Search campaign keywords for the same query:

### Priority order

| Priority | Condition | Winner |
| --- | --- | --- |
| 1️⃣ Highest | Exact match keyword **identical** to query | Search campaign (always) |
| 2️⃣ | Phrase/broad keyword OR search theme **identical** to query | Whichever is identical wins; if both identical → Ad Rank decides |
| 3️⃣ | Nothing identical to query | AI selects most relevant ad group |
| 4️⃣ Lowest | Equal relevance | Highest Ad Rank wins |

> ⚠️ **"Identical" includes spell-corrected terms** (e.g., "crm sofware" → "crm software") **but NOT plurals or synonyms** (e.g., "software" ≠ "softwares" ≠ "tools").

### Cannibalization scenarios

| Query | Search keyword | Search theme | Winner | Why |
| --- | --- | --- | --- | --- |
| "crm software" | [crm software] (exact) | "crm software" | **Search** | Exact match always wins |
| "crm software" | "crm" (phrase) | "crm software" | **PMax** | Theme is identical to query; phrase keyword is not |
| "crm software" | "crm software" (phrase) | "crm software" | **Ad Rank decides** | Both are identical to query |
| "best crm for small business" | "crm software" (broad) | "small business crm" | **AI relevance** | Neither is identical; AI picks most relevant |

### Exceptions to priority rules

| Exception | Effect |
| --- | --- |
| **Budget-limited campaign** | Higher-priority keyword may not trigger if campaign is hitting budget cap: lower-priority option serves instead |
| **Low search volume keyword** | Keyword is temporarily inactive: lower-priority option may trigger |
| **Targeting not satisfied** | Location, audience, or other targeting excludes the higher-priority option |
| **Disapproved ads/landing pages** | Ad group ineligible: skipped |

### Search theme decision gate

Use search themes IF:
- No dedicated Search campaign covers the same queries
- PMax is your primary or only search channel
- You are deliberately expanding into new search categories that Search campaigns do not cover
- You accept that PMax will compete for search inventory and have accounted for this in your reporting

Avoid search themes IF:
- Active Search campaigns already cover the same or similar queries
- Protecting Search campaign traffic volume and impression share is a priority
- You are already seeing PMax cannibalize Search impressions
- Your Search campaigns are well-optimized and you do not want PMax competing for those auctions

### Search theme strategy

| Goal | Recommendation |
| --- | --- |
| **Protect Search traffic** | Don't add search themes, OR only add themes for queries not covered by Search |
| **Test PMax on Search** | Add themes carefully: monitor Search Impression Share for cannibalization |
| **Accept overlap** | Add themes: upgrade important Search keywords to exact match |
| **Maximum Search control** | No search themes + exact match on critical keywords |

---

## Google predefined segments

### In-Market

| **Specification** | **Details** |
| --- | --- |
| **What it means** | Users actively researching your category |
| **Selection** | Choose from Google's predefined categories |
| **Granularity** | Category > Subcategory available |
| **Signal quality** | Lower (broad, shared across advertisers) |

### Life Events

| **Available events** | **Time window** |
| --- | --- |
| Business creation | Active |
| College graduation | Active |
| Job change | Active |
| Marriage | Active |
| Moving | Active |
| Home purchase | Active |
| Retirement | Active |

### Affinity

| **Specification** | **Details** |
| --- | --- |
| **What it means** | Long-term interests and lifestyle |
| **Selection** | Choose from Google's predefined categories |
| **Signal quality** | Lowest (broad lifestyle alignment) |

### Demographics

| **Dimension** | **Options** |
| --- | --- |
| Age | 18-24, 25-34, 35-44, 45-54, 55-64, 65+ |
| Gender | Male, Female, Unknown |
| Household income | Top 10%, 11-20%, 21-30%, 31-40%, 41-50%, Lower 50% |
| Parental status | Parent, Not a parent, Unknown |

---

## Exclusions (true control)

Exclusions are the only PMax element that restricts delivery like traditional targeting.

### Exclusion types

| **Type** | **Level** | **Effect** |
| --- | --- | --- |
| Customer Match list | Campaign | Users on list will NOT see ads |
| Audience segment | Campaign | Users in segment will NOT see ads |
| Brand keywords | Campaign | Queries will NOT trigger ads |

### Common exclusion patterns

| **Goal** | **Exclude** |
| --- | --- |
| Avoid post-purchase waste | Recent converters (7-30 days) |
| New customer acquisition | All existing customers (Customer Match) |
| Focus on quality | Low-value customers |
| Protect brand Search | Brand keywords (account/campaign level) |

### Exclusion configuration location

| **Exclusion type** | **Where to configure** |
| --- | --- |
| Customer acquisition exclusions | Campaign settings > Customer acquisition |
| Segment exclusions | Campaign settings > Other settings |
| Brand keyword exclusions | Campaign settings > Brand exclusions |

---

## Signal selection by goal

> ↪️ **For signal selection guidance by campaign goal (efficiency, growth, new customer acquisition):** See [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md), which owns signal selection logic. This reference documents signal types and specs only.

---

## Reporting & visibility

### What you can see

| **Report** | **Location** | **Shows** |
| --- | --- | --- |
| Search themes | Insights tab | Queries that triggered ads |
| Audience insights | Insights tab | Characteristics of converters (limited) |
| New vs returning | Campaign reporting | Customer acquisition mix |
| Placement reporting | Where ads showed | Channels driving results |

### What you cannot see

| **Not available** |
| --- |
| Performance by specific audience segment |
| Which signals drove which conversions |
| Detailed demographic breakdowns by segment |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
| --- | --- | --- |
| Expecting signals to be targeting | Frustration when AI serves broadly | Accept: signals are hints |
| Only adding cold audiences | Weak learning signal | Prioritize first-party data |
| Adding too many low-quality signals | Dilutes signal quality | Fewer, better signals |
| No exclusions | Wastes spend on existing customers | Exclude converters + customers |
| Copying Search keywords as search themes | PMax cannibalizes Search | Don't overlap, or use exact match in Search |

---

## Related documents

| **Document** | **Relationship** |
| --- | --- |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Conceptual framework (signals vs targeting) |
| [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md) | Signal selection logic by goal |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Display, Video, Demand Gen segment reference |
| [Audience Segments Reference](../references/Audience Segments Reference.md) | Complete list of all Google predefined segment names |
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Lead Gen/SaaS PMax structure |
| [PMax Structure Mental Model (Ecommerce)](<../mental-models/PMax Structure Mental Model (Ecommerce).md>) | Ecommerce PMax structure |
| [SOP – Launch PMax for Lead Gen/SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md) | Execution (Lead Gen/SaaS setup) |
| [SOP – Launch PMax Feed-Only Campaign](../sops/SOP – Launch PMax Feed-Only Campaign.md) | Execution (Feed-Only setup) |
| [SOP – Launch PMax Full Assets Ecommerce Campaign](../sops/SOP – Launch PMax Full Assets Ecommerce Campaign.md) | Execution (Full Assets setup) |

---

## Version details

- **Version:** 4.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.