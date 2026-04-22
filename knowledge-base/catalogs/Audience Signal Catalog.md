# Audience Signal Catalog
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CATALOG_7
Status: Done
Category: Audiences
Reference Type: Catalog
Agent_Readable: Yes
Human_Facing: Yes
Bucket: Audiences
Domain: Audiences
Pillar: 7

### Purpose

This catalog lists reusable **Performance Max audience signal configurations** organized by signal type and quality tier.

It covers every signal input available in PMax asset groups: Customer Match, website visitors, YouTube engagement, custom segments, search themes, and Google predefined segments.

---

### What this is / What this is NOT

**This catalog:**

- Lists signal types with example configurations per vertical (Lead Gen, SaaS, Ecommerce)
- Provides quality tier ratings for each signal type
- Includes guidance on when to use each signal type

**This catalog does NOT:**

- Validate signal setup quality (See: [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md))
- Provide step-by-step signal configuration instructions (See: [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md))
- Explain the conceptual framework behind signals vs. targeting (See: [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md))
- Cover Display, Video, or Demand Gen audience targeting (See: [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md))

---

## Signal fundamentals

### The signal mindset

Performance Max signals are **hints**, not targeting controls. Google's AI uses signals as starting points but will expand beyond them to find converters. Better signal quality = faster learning = better early performance.

### Signal quality hierarchy

Every signal type has a quality tier based on intent proximity and data reliability:
| Tier | Signal Type | Intent Proximity | Data Source |
|------|------------|-----------------|-------------|
| 🥇 Tier 1 | Customer Match (converters) | Proven buyers | Your CRM |
| 🥇 Tier 1 | Website converters | Proven intent | Your pixel |
| 🥈 Tier 2 | Website visitors (all) | Demonstrated interest | Your pixel |
| 🥈 Tier 2 | YouTube engaged users | Active engagement | Your channel |
| 🥈 Tier 2 | App users | Active engagement | Your app |
| 🥉 Tier 3 | Custom segments (search terms) | Declared intent | Google Search data |
| 🥉 Tier 3 | Custom segments (URLs/apps) | Interest proxy | Google browsing data |
| 🏅 Tier 4 | Search themes | Category-level intent | Google Search data |
| 🏅 Tier 4 | In-market segments | Active research | Google behavioral data |
| ⬜ Tier 5 | Life events | Situational context | Google behavioral data |
| ⬜ Tier 5 | Affinity segments | Long-term interest | Google behavioral data |
| ⬜ Tier 5 | Demographics | Broad attributes | Google profile data |

> ⚠️ **Signal quality determines learning speed, not reach ceiling:** PMax will expand beyond all signals regardless of quality. Higher-quality signals give Google a better starting point to find your ideal customers faster.

---

## Signal quality decision gate

Before selecting signals, determine your optimization goal:
| If your goal is... | Prioritize... | Signal stack approach |
|--------------------|--------------|----------------------|
| **Efficiency (high ROAS/low CPA)** | Tier 1-2 signals only | Narrow: top 20% customers, website converters, 10 high-converting search terms |
| **Scale (growth)** | Tier 1-3 signals with some Tier 4 | Broad: all customers, all engaged visitors, 15-20 search terms + competitor URLs, primary + adjacent in-market |
| **New customer acquisition** | Tier 3-4 signals, exclude Tier 1 | Prospecting: exclude Customer Match, use non-converter visitors, category + competitor terms, in-market segments |

> ↪️ For the conceptual framework behind this hierarchy: See [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md)
> ↪️ For signal specs, limits, and syntax: See [Audience Signals Reference](../references/Audience Signals Reference.md)

---

## Signal types: Type-by-type breakdown

## Type 1: Customer Match signals

- **Quality tier:** 🥇 Tier 1
- **What it is:** Upload your CRM data (email, phone, address) so Google matches your customers and uses them as signal inputs.
- **Why it matters:** Your own customer data is the highest-quality signal because it represents proven buyer behavior.

#### When to use

| Scenario | Signal configuration | Why it works |
|----------|---------------------|--------------|
| Standard PMax setup | All customers list | Broadest first-party signal base |
| High-value focus | Top 20% by LTV/revenue | Steers Google toward best customers |
| New customer acquisition | Exclude Customer Match entirely | Forces prospecting beyond existing base |

#### Example configurations by vertical

| Vertical | List type | Example contents | Minimum size |
|----------|-----------|-----------------|--------------|
| Lead Gen | All qualified leads | Email + phone of SQLs from past 12 months | 1,000+ |
| Lead Gen | High-value clients | Top 20% by contract value | 1,000+ |
| SaaS | Active subscribers | Email of paying users | 1,000+ |
| SaaS | Trial-to-paid converters | Users who converted from trial | 1,000+ |
| Ecommerce | All purchasers | Email + address of past buyers | 1,000+ |
| Ecommerce | Repeat buyers | 2+ purchases in 12 months | 1,000+ |

> 💡 **Match rate optimization:** Email alone yields baseline match rates (29-62%). Adding phone numbers adds +15-20%. Adding mailing addresses adds another +10-15%. Always upload multiple identifiers per customer. Why it works: each additional identifier gives Google another way to match your CRM record to a logged-in Google user, increasing the overlap between your data and Google's identity graph.

> ↪️ For list creation and upload procedures: See [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md)

---

## Type 2: Website visitor signals

- **Quality tier:** 🥇 Tier 1 (converters) / 🥈 Tier 2 (all visitors)
- **What it is:** Audience segments built from Google Tag data capturing website behavior.
- **Why it matters:** Recency and depth of site engagement correlate with conversion probability.

#### When to use

| Segment | Membership window | When to use |
|---------|-------------------|-------------|
| All converters | 90-540 days | Always: highest quality signal |
| Cart/form abandoners | 7-30 days | Ecommerce/Lead Gen: high-intent recovery |
| Product/service page viewers | 14-30 days | Re-engagement with demonstrated interest |
| All site visitors | 30-90 days | Broad engagement signal |
| Blog/content visitors | 30-90 days | Top-of-funnel interest signal |

#### Example configurations by vertical

| Vertical | Segment | Window | Why it works |
|----------|---------|--------|--------------|
| Lead Gen | Form submitters | 180 days | Proven conversion intent |
| Lead Gen | Pricing page visitors | 30 days | High purchase consideration |
| Lead Gen | Case study readers | 60 days | Research-phase engagement |
| SaaS | Trial sign-ups | 90 days | Proven product interest |
| SaaS | Feature page viewers | 30 days | Active evaluation |
| SaaS | Pricing page visitors | 14 days | Purchase-ready signal |
| Ecommerce | Purchasers | 540 days | Proven buyer behavior |
| Ecommerce | Cart abandoners | 14 days | Highest-intent non-converters |
| Ecommerce | Category page browsers | 30 days | Active shopping behavior |

---

## Type 3: YouTube engagement signals

- **Quality tier:** 🥈 Tier 2
- **What it is:** Segments of users who have interacted with your YouTube channel (views, subscribes, likes, shares).
- **Why it matters:** Video engagement indicates brand awareness and interest that predicts cross-channel conversion.

#### When to use

| Scenario | Signal configuration |
|----------|---------------------|
| Active YouTube channel | Channel subscribers + video viewers (past 90 days) |
| YouTube Ads running | Video ad viewers + channel visitors |
| No YouTube presence | Skip this signal type entirely |

#### Example configurations by vertical

| Vertical | Segment | Why it works |
|----------|---------|--------------|
| Lead Gen | Viewed 50%+ of case study videos | Deep engagement = qualified interest |
| SaaS | Watched product demo videos | Active evaluation behavior |
| Ecommerce | Subscribed to channel | Brand affinity = higher conversion rate |

---

## Type 4: Custom segments (search terms)

- **Quality tier:** 🥉 Tier 3
- **What it is:** Custom audiences built from Google Search terms that represent your ideal customer's search behavior.
- **Why it matters:** Search behavior reveals declared intent, people actively looking for solutions you offer.

#### Configuration rules

| Rule | Specification |
|------|--------------|
| Recommended terms | 10-15 high-converting search terms |
| Maximum terms | 50 per segment |
| Term quality | Use actual converting search terms from your Search campaigns |
| Avoid | Generic terms, single words, brand terms (already captured) |

#### Example configurations by vertical

| Vertical | Search terms (examples) | Why it works |
|----------|------------------------|--------------|
| Lead Gen (PPC agency) | "google ads management agency", "ppc agency for saas", "hire google ads expert" | Mirrors high-intent commercial queries |
| Lead Gen (B2B services) | "outsource accounting firm", "fractional CFO services", "managed IT support" | Specific service-seeking intent |
| SaaS (CRM) | "best crm for small business", "sales pipeline software", "hubspot alternative" | Active evaluation + competitor comparison |
| SaaS (Project mgmt) | "project management tool for agencies", "asana alternative", "team task management" | Category + competitor intent |
| Ecommerce (Furniture) | "buy modern sofa online", "designer dining table", "premium office desk" | Transactional product queries |
| Ecommerce (Supplements) | "best protein powder", "buy creatine online", "natural sleep supplement" | Product purchase intent |

> ⚠️ **Do not dump hundreds of keywords into custom segments:** Use your 10-15 highest-converting search terms. Quality beats quantity, Google needs clear intent signals, not noise.

---

## Type 5: Custom segments (URLs/apps)

- **Quality tier:** 🥉 Tier 3
- **What it is:** Custom audiences built from URLs of websites your ideal customers browse or apps they use.
- **Why it matters:** Browsing behavior proxies interest even when users haven't searched for your solution directly.

#### Configuration rules

| Rule | Specification |
|------|--------------|
| Recommended URLs | 10-15 relevant competitor/industry URLs |
| URL targeting | Targets users who BROWSE similar sites, does not place ads on those sites |
| URL quality | Use direct competitor URLs and industry publications |
| Avoid | Generic sites (news, social media homepages) |

#### Example configurations by vertical

| Vertical | URLs/apps (examples) | Why it works |
|----------|---------------------|--------------|
| Lead Gen | Competitor agency websites, industry blogs (searchengineland.com, wordstream.com) | Reaches users actively researching PPC services |
| SaaS | Competitor product pages (hubspot.com/crm, monday.com/pricing), G2/Capterra category pages | Reaches users evaluating software alternatives |
| Ecommerce | Competitor stores, review sites, category-specific publications | Reaches active shoppers browsing similar products |

> 💡 **What Google AI actually learns from URLs:** Google does not crawl these URLs or read page content. Instead, it identifies users whose browsing behavior overlaps with visitors of the sites you provide, then finds similar users at scale. The URLs define a behavioral profile, not a content signal.

---

## Type 6: Search themes

- **Quality tier:** 🏅 Tier 4
- **What it is:** Category-level search terms added at the asset group level that influence which searches trigger PMax ads.
- **Why it matters:** Search themes function as both audience signals AND search placements: they expand PMax's search inventory beyond auto-detected themes.

#### Configuration rules

| Rule | Specification |
|------|--------------|
| Maximum per asset group | 25 search themes |
| Scope | Asset group level (not campaign level) |
| Priority level | Same as phrase/broad match keywords in Search campaigns |
| Cannibalization risk | HIGH: search themes compete directly with Search campaign keywords |

#### When to use vs. when to avoid

| Use search themes when... | Avoid search themes when... |
|--------------------------|---------------------------|
| No dedicated Search campaign exists | Active Search campaigns cover the same queries |
| PMax is your primary search channel | Protecting Search campaign traffic volume is priority |
| Expanding into new search categories | Already seeing PMax cannibalize Search impressions |
| Comfortable with PMax taking search inventory | Search campaigns are well-optimized and performing |

#### Example configurations by vertical

| Vertical | Search themes (examples) | Risk assessment |
|----------|------------------------|-----------------|
| Lead Gen | "google ads management", "ppc agency" | HIGH if running Search for these terms |
| SaaS | "crm software", "sales management tool" | HIGH if running Search for these terms |
| Ecommerce | "modern furniture online", "premium sofas" | MEDIUM: Shopping often coexists better with PMax |

> 💡 **Search theme cannibalization is real:** Bob's case study: removing search themes from PMax caused Shopping spend to jump from 22% to 70% and revived the dedicated Search campaign. Only use search themes if you deliberately want PMax to compete for that search inventory.

---

## Type 7: Google predefined segments

- **Quality tier:** 🏅 Tier 4 (in-market) / ⬜ Tier 5 (affinity, life events, demographics)
- **What it is:** Google's pre-built audience segments based on observed behavior, interests, and demographic attributes.
- **Why it matters:** Predefined segments extend reach beyond your first-party data into Google's behavioral and intent data.

#### In-market segments

Users actively researching or comparing products/services in your category.
| Vertical | Segments (examples) | Why it works |
|----------|--------------------|--------------|
| Lead Gen | "Business Services > Advertising & Marketing Services" | Active research for marketing help |
| SaaS | "Software > Business Technology > CRM Software" | Active evaluation of CRM solutions |
| Ecommerce | "Home & Garden > Home Furnishings" | Active shopping for furniture |

#### Life events

Users experiencing major life changes that create purchase triggers.
| Vertical | Segments (examples) | Why it works |
|----------|--------------------|--------------|
| Lead Gen | "Starting a business" | New businesses need services |
| SaaS | "Starting a business", "Changing jobs" | New roles drive software evaluation |
| Ecommerce | "Moving", "Getting married" | Life transitions trigger purchases |

#### Affinity segments

Users with long-term interests, broadest reach, lowest intent signal.
| Vertical | Segments (examples) | Why it works |
|----------|--------------------|--------------|
| Lead Gen | "Business Professionals > Business Decision Makers" | Role-based targeting |
| SaaS | "Technology > Technophiles" | Tech-forward audience |
| Ecommerce | "Home & Garden > Home Decor Enthusiasts" | Category interest alignment |

#### Demographics

Basic demographic attributes, use as layer, never as standalone signal.
| Attribute | Options |
|-----------|---------|
| Age | 18-24, 25-34, 35-44, 45-54, 55-64, 65+ |
| Gender | Male, Female, Unknown |
| Household income | Top 10%, 11-20%, 21-30%, 31-40%, 41-50%, Lower 50% |
| Parental status | Parent, Not a parent |

> ⚠️ **Never use demographics as your only signal:** Demographics alone give Google almost no useful intent data. Layer demographics on top of higher-quality signals when needed (e.g., household income top 30% + in-market for luxury goods).

> ↪️ **Browse segment names:** See [Audience Segments Reference](../references/Audience Segments Reference.md) for the full list of in-market, affinity, and life event segments available in Google Ads.

---

## Signal stacking: Recommended configurations

### Starter stack (minimum viable signals)

| Signal layer | Type | Purpose |
|-------------|------|---------|
| Layer 1 | Customer Match (all customers) | Highest-quality first-party data |
| Layer 2 | Website converters (90-540 days) | Proven conversion behavior |
| Layer 3 | All website visitors (30-90 days) | Broad engagement signal |
| Layer 4 | Custom segment (10-15 search terms) | Declared intent signal |
| Layer 5 | 1-2 in-market segments | Category-level interest |

### Growth stack (expansion-ready)

| Signal layer | Type | Purpose |
|-------------|------|---------|
| Layers 1-5 | Starter stack | Foundation |
| Layer 6 | Customer Match (high-value subset) | Premium customer signal |
| Layer 7 | YouTube engaged users | Cross-channel engagement |
| Layer 8 | Custom segment (competitor URLs) | Competitive conquest |
| Layer 9 | Search themes (if no Search campaign) | Search inventory expansion |
| Layer 10 | Adjacent in-market segments | Category expansion |

---

### Quick reference: Support library

| Document | Type | Used for |
|----------|------|---------|
| [Audience Signal Quality Checklist](../checklists/Audience Signal Quality Checklist.md) | Checklist | Validates signal setup after configuration |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference | Signal specs, limits, and syntax |
| [Audience Segments Reference](../references/Audience Segments Reference.md) | Reference | Complete list of all Google predefined segment names |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Mental Model | Conceptual framework for signals vs. targeting |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) | Uses this catalog to select signal configurations |
| [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) | Creates the Customer Match lists referenced here |

---

### Version details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
