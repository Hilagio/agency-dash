# Audience Segment Catalog
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CATALOG_8
Status: Done
Category: Audiences
Reference Type: Catalog
Agent_Readable: Yes
Human_Facing: Yes
Bucket: Audiences
Domain: Audiences
Pillar: 7

### Purpose

This catalog lists reusable **audience segment configurations** for Display, Video, and Demand Gen campaigns.

It covers every segment type available outside Performance Max: remarketing, Customer Match, custom segments, in-market, affinity, life events, lookalikes, and combined segments.

---

### What this is / What this is NOT

**This catalog:**

- Lists audience segment types with example configurations per vertical (Lead Gen, SaaS, Ecommerce)
- Shows which segment types are available by campaign type
- Provides guidance on when to use each segment type

**This catalog does NOT:**

- Cover Performance Max audience signals (See: [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md))
- Validate audience targeting setup (See: [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md))
- Provide step-by-step targeting configuration instructions (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))
- Explain the conceptual framework behind signals vs. targeting (See: [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md))

---

## Segment fundamentals

### The targeting mindset

Display, Video, and Demand Gen campaigns use **targeting**, not signals. You define who sees your ads. Google delivers within those parameters, unless optimized targeting is enabled, which expands beyond your selections.

### Segment availability by campaign type

| Segment Type | Display | Video | Demand Gen |
|-------------|---------|-------|------------|
| Website visitors (remarketing) | ✅ | ✅ | ✅ |
| Customer Match | ✅ | ✅ | ✅ |
| YouTube users | ✅ | ✅ | ✅ |
| App users | ✅ | ✅ | ✅ |
| Custom segments (keywords) | ✅ | ✅ | ✅ |
| Custom segments (URLs/apps) | ✅ | ✅ | ✅ |
| In-market | ✅ | ✅ | ✅ |
| Affinity | ✅ | ✅ | ✅ |
| Life events | ✅ | ✅ | ✅ |
| Detailed demographics | ✅ | ✅ | ✅ |
| Lookalike segments | ❌ | ❌ | ✅ |
| Combined segments | ✅ | ✅ | ✅ |
| Content targeting (topics/placements) | ✅ | ✅ | ❌ |

> ↪️ For full specs and limits: See [Audience Targeting Reference](../references/Audience Targeting Reference.md)

---

## Segment selection decision gate

Before selecting segments, determine your campaign goal:
| If your goal is... | Primary segments | Targeting mode |
|--------------------|-----------------|----------------|
| **Remarketing (re-engage known visitors)** | Website visitors, Customer Match, YouTube users | Targeting (restrict delivery to these users) |
| **Prospecting (find new customers)** | Custom segments, in-market, lookalikes | Targeting + optimized targeting OFF |
| **Brand awareness** | Affinity, broad in-market, life events | Targeting + optimized targeting ON |
| **Data collection (learn who converts)** | Any segment | Observation (gather data without restricting) |

> 💡 **Targeting vs. Observation matters:** Targeting mode restricts ad delivery to your selected audiences only. Observation mode shows ads broadly but collects audience performance data. Use observation when you want to learn: use targeting when you know who to reach.

---

## Segment types: Type-by-type breakdown

### Type 1: Website visitor segments (remarketing)

- **Temperature:** 🔥 Hot (cart/form abandoners) / 🌡️ Warm (all visitors)
- **What it is:** Segments built from Google Tag data capturing website visitor behavior.
- **Why it matters:** Website visitors have demonstrated interest: remarketing converts at 2-5x the rate of prospecting.

#### Segment configurations

| Segment | Membership window | Best for | Why it works |
|---------|-------------------|----------|--------------|
| All converters | 90-540 days | Exclusion (avoid remarketing to existing customers) | Prevents spend on users who already converted |
| Cart abandoners | 7-14 days | Ecommerce recovery campaigns | Highest intent: user was one step from purchase |
| Form abandoners | 7-30 days | Lead Gen follow-up | User engaged enough to start but needs nudge to complete |
| Product/service viewers | 14-30 days | Mid-funnel re-engagement | Active research behavior signals consideration |
| All site visitors | 30-90 days | Broad remarketing | Any site visit indicates awareness, wider reach pool |
| Blog/content visitors | 30-90 days | Nurture campaigns | Content consumption signals topic interest for education-led funnels |

#### Example configurations by vertical

| Vertical | Segment | Window | Campaign type | Why it works |
|----------|---------|--------|---------------|--------------|
| Lead Gen | Pricing page visitors | 14 days | Display | High purchase consideration, time-sensitive |
| Lead Gen | Case study readers | 30 days | Video | Nurture with deeper content |
| Lead Gen | Form starters who didn't submit | 7 days | Display | Immediate recovery opportunity |
| SaaS | Trial users who didn't convert | 14 days | Display, Demand Gen | Re-engage with conversion offer |
| SaaS | Feature page viewers | 21 days | Demand Gen | Active evaluation behavior |
| SaaS | Pricing page visitors | 7 days | Display | Closest to purchase decision |
| Ecommerce | Cart abandoners | 7 days | Display | Highest-intent recovery |
| Ecommerce | Product page viewers | 14 days | Display, Demand Gen | Active shopping behavior |
| Ecommerce | Category browsers | 30 days | Demand Gen | Broad interest re-engagement |

> 💡 **Dynamic remarketing (Display):** For ecommerce, use dynamic remarketing to automatically show ads featuring the specific products a user viewed. Requires a product feed linked to Google Ads.

---

### Type 2: Customer Match segments

- **Temperature:** 🌡️ Warm
- **What it is:** Audience segments built from your uploaded CRM data (email, phone, address).
- **Why it matters:** First-party customer data enables cross-channel re-engagement and high-quality lookalike seeding.

#### When to use

| Scenario | Configuration | Campaign type | Why it works |
|----------|--------------|---------------|--------------|
| Re-engage lapsed customers | Customers inactive 90+ days | Display, Demand Gen | Known relationship reduces acquisition cost |
| Upsell existing customers | Active customers by product category | Display, Demand Gen | Existing trust lowers conversion barrier |
| Exclude existing customers | All customers list → exclusion | All | Prevents spending on already-acquired users |
| Seed lookalike audiences | High-value customers | Demand Gen | Best customers produce the strongest lookalike models |

#### Example configurations by vertical

| Vertical | List type | Use case | Why it works |
|----------|-----------|----------|--------------|
| Lead Gen | Past clients (12 months) | Win-back campaigns | Known relationship, warm re-engagement |
| Lead Gen | Qualified leads who didn't close | Nurture via Display | Second-chance conversion |
| SaaS | Churned subscribers | Win-back with new feature messaging | Familiar with product, low education cost |
| SaaS | Free tier users | Upgrade campaigns via Demand Gen | Proven product interest |
| Ecommerce | One-time buyers | Repeat purchase campaigns | Convert to multi-buyer |
| Ecommerce | High-LTV customers | Lookalike seed for Demand Gen | Find more of your best customers |

> ↪️ For list creation and upload: See [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md)

---

### Type 3: Custom segments (keywords)

- **Temperature:** ❄️ Cool
- **What it is:** Audiences of people who have searched for specific terms on Google.
- **Why it matters:** Search behavior reveals declared intent: targeting users who have searched for relevant terms reaches active researchers.

#### Configuration rules

| Rule | Specification |
|------|--------------|
| Recommended keywords | 10-15 per segment |
| Maximum keywords | 50 per segment |
| Keyword quality | Use high-converting search terms, not broad categories. Source from your Search campaign search term reports: pull terms with 5+ conversions. |
| Interpretation | Google targets users who searched these terms OR browse related content |
| Account scope | Custom segments are not shareable across accounts |

#### Example configurations by vertical

| Vertical | Keywords (examples) | Why it works |
|----------|---------------------|--------------|
| Lead Gen (Agency) | "google ads agency", "ppc management service", "hire google ads expert" | Targets users actively seeking services |
| Lead Gen (B2B) | "outsource payroll", "managed IT services near me", "business accounting firm" | Specific service-seeking behavior |
| SaaS (CRM) | "best crm software", "hubspot alternative", "sales pipeline tool" | Active evaluation and comparison |
| SaaS (Analytics) | "website analytics tool", "google analytics alternative", "user tracking software" | Category research intent |
| Ecommerce (Fashion) | "buy designer handbags online", "luxury sneakers sale", "premium leather wallet" | Transactional product search |
| Ecommerce (Home) | "modern sofa free delivery", "buy standing desk", "ergonomic office chair" | Purchase-ready product queries |

---

### Type 4: Custom segments (URLs/apps)

- **Temperature:** ❄️ Cool
- **What it is:** Audiences of people who browse websites similar to specified URLs or use apps similar to specified apps.
- **Why it matters:** Browsing and app usage behavior reveals interests and preferences beyond search behavior.

#### Configuration rules

| Rule | Specification |
|------|--------------|
| Recommended URLs | 10-15 per segment |
| URL behavior | Targets users who BROWSE similar content, does NOT place ads on those sites |
| URL quality | Use direct competitor URLs and high-authority industry sites |
| Avoid | Generic sites (google.com, facebook.com), news homepages |

#### Example configurations by vertical

| Vertical | URLs (examples) | Why it works |
|----------|----------------|--------------|
| Lead Gen | wordstream.com, searchengineland.com, competitor agency sites | Reaches users consuming PPC education |
| SaaS | Competitor product pages, G2 category pages, Capterra comparison pages | Reaches users actively evaluating alternatives |
| Ecommerce | Competitor stores, review sites (wirecutter.com), category publications | Reaches active shoppers browsing similar products |

---

### Type 5: In-market segments

- **Temperature:** ❄️ Cold
- **What it is:** Google's pre-built segments of users actively researching or comparing products/services.
- **Why it matters:** In-market users have demonstrated purchase intent through recent browsing and search behavior.

#### Key characteristics

| Attribute | Detail |
|-----------|--------|
| Data source | Google's behavioral signals (search, browsing, YouTube) |
| Intent level | Active research and comparison |
| Refresh rate | Weekly updates |
| Reach | Large audiences, medium specificity |

#### Example configurations by vertical

| Vertical | In-market segments | Why it works |
|----------|--------------------|--------------|
| Lead Gen | Business Services > Advertising & Marketing Services | Actively seeking marketing help |
| Lead Gen | Business Services > Business Technology Solutions | Evaluating business tools |
| SaaS | Software > Business Technology > CRM Software | Evaluating CRM solutions |
| SaaS | Software > Business Technology > Project Management Software | Comparing PM tools |
| Ecommerce | Home & Garden > Home Furnishings > Living Room Furniture | Actively furniture shopping |
| Ecommerce | Apparel & Accessories > Shoes | Actively shoe shopping |

> 💡 **Layer in-market with custom segments:** In-market alone is broad. Combine with custom segments (keywords or URLs) using AND logic in combined segments for sharper targeting.

> ↪️ **Browse segment names:** See [Audience Segments Reference](../references/Audience Segments Reference.md) for the full list of in-market, affinity, and life event segments available in Google Ads.

---

### Type 6: Affinity segments

- **Temperature:** 🧊 Coldest
- **What it is:** Google's pre-built segments based on long-term interests, habits, and lifestyle.
- **Why it matters:** Affinity segments provide maximum reach for brand awareness campaigns but carry the lowest intent signal.

#### When to use

| Use affinity when... | Avoid affinity when... |
|---------------------|----------------------|
| Running brand awareness campaigns | Optimizing for direct response conversions |
| Budget allows broad reach | Budget is limited and efficiency matters |
| Combined with higher-intent segments | Used as standalone targeting |

#### Example configurations by vertical

| Vertical | Affinity segments | Why it works |
|----------|-------------------|--------------|
| Lead Gen | Business Professionals > Business Decision Makers | Role-based interest alignment |
| SaaS | Technology > Tech Enthusiasts | Tech-forward audience base |
| Ecommerce | Home & Garden > Home Decor Enthusiasts | Long-term category interest |
| Ecommerce | Shoppers > Value Shoppers | Price-sensitive buyer behavior |

---

### Type 7: Life events

- **Temperature:** ❄️ Cold
- **What it is:** Segments of users experiencing major life changes that create purchase triggers.
- **Why it matters:** Life transitions drive category entry: users who are moving, getting married, or starting businesses enter markets they weren't in before.

#### Available life events

| Life event | Purchase triggers |
|------------|------------------|
| Starting a business | Business services, software, office equipment |
| College graduation | Career services, relocation, professional attire |
| Changing jobs | Software tools, professional development, relocation |
| Getting married | Event services, home goods, financial planning |
| Moving | Furniture, home services, utilities, insurance |
| Purchasing a home | Mortgage, insurance, furniture, renovation |
| Retirement | Financial planning, travel, healthcare |

#### Example configurations by vertical

| Vertical | Life event | Why it works |
|----------|-----------|--------------|
| Lead Gen (Financial) | Purchasing a home, Retirement | Major financial decisions drive advisor seeking |
| SaaS (HR) | Starting a business | New companies need HR/payroll tools |
| Ecommerce (Furniture) | Moving, Purchasing a home | Relocation and new home drive furniture purchases |

---

### Type 8: Lookalike segments (Demand Gen only)

- **Temperature:** ❄️ Cool
- **What it is:** Google-generated audiences that resemble your existing customer or visitor segments.
- **Why it matters:** Lookalikes extend reach to new users who share characteristics with your best customers, without requiring you to define targeting criteria.

#### Configuration rules

| Rule | Specification |
|------|--------------|
| Availability | Demand Gen campaigns only |
| Seed minimum | 1,000+ matched users in the seed list |
| Reach options | Narrow, Balanced, Broad |
| Seed quality | Higher-quality seeds (converters, high-LTV customers) produce better lookalikes |

#### Reach settings

| Setting | Reach | Similarity | When to use |
|---------|-------|-----------|-------------|
| Narrow | Smallest | Highest | Efficiency-focused campaigns, limited budget |
| Balanced | Medium | Medium | Default starting point for most campaigns |
| Broad | Largest | Lowest | Scale-focused campaigns, large budgets |

#### Example configurations by vertical

| Vertical | Seed list | Reach setting | Why it works |
|----------|-----------|---------------|--------------|
| Lead Gen | SQLs from past 6 months | Balanced | Finds users resembling qualified leads |
| Lead Gen | Highest-value closed deals | Narrow | Targets users like your best clients |
| SaaS | Paid subscribers (active) | Balanced | Mirrors active paying user profiles |
| SaaS | Trial-to-paid converters | Narrow | Finds users with highest conversion probability |
| Ecommerce | Repeat purchasers (2+ orders) | Balanced | Finds users like loyal customers |
| Ecommerce | High-AOV customers | Narrow | Targets users likely to place large orders |

> 💡 **Seed quality determines lookalike quality:** A lookalike based on "all website visitors" will be far weaker than one based on "customers who purchased 3+ times". Always seed with your highest-value audience.

---

### Type 9: Combined segments

- **What it is:** Custom-built audiences that combine multiple segment types using AND/OR/NOT logic.
- **Why it matters:** Combined segments create precise targeting by layering intent signals, turning broad segments into specific ones. They are the primary tool for sharpening cold audiences into warmer, more efficient ones.

#### Configuration rules

| Rule | Specification |
|------|--------------|
| Where to create | Tools & Settings > Audience Manager > Combined segments |
| Component types | Any segment type: your data, custom, in-market, affinity, life events, detailed demographics |
| AND condition limit | 3 AND conditions maximum recommended (each AND condition typically reduces audience size by 50-70%) |
| Testing approach | Test in a separate ad group with optimized targeting OFF before scaling |
| Audience size check | Verify "Ready" status in Google Ads UI: too many AND conditions can shrink audience below deliverable size |

#### Logic operators

| Operator | Effect | Example |
|----------|--------|---------|
| AND | Must match ALL conditions | In-market for CRM AND custom segment (CRM keywords) |
| OR | Must match ANY condition | Website visitors OR Customer Match |
| NOT | Exclude matching users | In-market for CRM AND NOT existing customers |

#### Combination patterns

| Pattern | Logic | What it achieves | When to use |
|---------|-------|-----------------|-------------|
| **Intent layering** | In-market AND Custom keywords | Sharpens broad in-market with declared search intent | When in-market alone is too broad and CPA is too high |
| **Exclusion layering** | Any segment AND NOT Customer Match | Pure new customer acquisition | When prospecting campaigns are spending on existing customers |
| **Life event + category** | Life event AND In-market | Targets event-triggered category entry | When product fits a specific life transition |
| **Demographic + intent** | Detailed demographics AND In-market | Demographic-qualified intent targeting | When your product serves a specific demographic within a broad category |
| **Multi-signal precision** | Custom keywords AND Affinity AND NOT converters | Maximum precision from individually imprecise segments | When you need very targeted prospecting with low budget |
| **DG: Lookalike + Custom** | Lookalike OR Custom segment (same ad group) | Google-recommended Demand Gen approach: broad modeled reach plus intent-qualified users | Default for Demand Gen prospecting |

#### Example configurations by vertical

| Vertical | Combined segment | Logic | Why it works |
|----------|-----------------|-------|--------------|
| Lead Gen | In-market (marketing services) AND custom keywords (agency search terms) AND NOT existing clients | AND + NOT | Precise prospecting excluding current base |
| Lead Gen | Life event (starting a business) AND In-market (business technology) | AND | Targets new business owners actively evaluating tools |
| Lead Gen | Detailed demographics (business decision makers) AND Custom keywords (outsourcing terms) AND NOT website visitors | AND + NOT | Senior-level prospecting only, fresh audience |
| SaaS | Custom keywords (CRM terms) AND In-market (CRM software) | AND | Double-qualified by search + browsing behavior |
| SaaS | Lookalike (trial-to-paid converters) OR Custom keywords (competitor brand terms) | OR (same DG ad group) | Google-recommended DG structure: modeled + intent |
| SaaS | In-market (project management) AND Affinity (tech enthusiasts) AND NOT free tier users | AND + NOT | Tech-savvy active evaluators, new to product |
| Ecommerce | In-market (furniture) AND Life event (moving) AND NOT past purchasers | AND + NOT | Life-event triggered shoppers, new customers only |
| Ecommerce | Custom keywords (premium product terms) AND Detailed demographics (top 10% HHI) | AND | High-value product targeting: intent + purchasing power |
| Ecommerce | In-market (outdoor recreation) AND Affinity (outdoor enthusiasts) AND NOT converters (30 days) | AND + NOT | Category enthusiasts actively shopping, excluding recent buyers |

> 💡 **Combined segments turn cold into cool:** An in-market segment alone is cold (broad, low precision). Combined with custom keywords, it becomes cool (specific, higher precision). The combination is the targeting strategy, not the individual component.

---

### Type 10: Demographics optimization patterns

- **Temperature:** Layer only (not standalone targeting)
- **What it is:** Demographic adjustments (exclusions and bid modifiers) applied on top of existing audience segments to refine performance.
- **Why it matters:** Demographics alone are not targeting. Applied as a layer, they eliminate waste from underperforming demographic groups and increase investment in high-performing ones.

> ⚠️ **Demographics are a refinement layer:** Never use demographics as your only targeting method. "Males 25-34" is not a targeting strategy. "In-market for CRM software, males 25-34, excluding existing customers" is.

#### Available demographic dimensions

| Dimension | Options | Smart Bidding action | Manual CPC action |
|-----------|---------|---------------------|-------------------|
| Age | 18-24, 25-34, 35-44, 45-54, 55-64, 65+, Unknown | Exclude underperformers | Bid adjustments |
| Gender | Male, Female, Unknown | Exclude underperformers | Bid adjustments |
| Parental status | Parent (by child age), Not a parent, Unknown | Exclude underperformers | Bid adjustments |
| Household income | Top 10% through Lower 50%, Unknown | Exclude underperformers (select countries) | Bid adjustments (select countries) |

#### "Unknown" segment management

| Situation | Recommendation |
|-----------|---------------|
| "Unknown" performs at or below campaign average | Keep targeted: no action needed |
| "Unknown" CPA > 2x campaign average for 30+ days | Consider excluding, but understand you will lose 15-30% of available inventory |
| "Unknown" has insufficient data (< 50 clicks) | Do not exclude: let data accumulate |
| Newly launched campaign | Never exclude "Unknown" at launch: wait 30+ days |

#### Example optimization patterns by vertical

| Vertical | Pattern | Action | Why it works |
|----------|---------|--------|--------------|
| B2B / Lead Gen | Age 18-24 rarely converts | Exclude 18-24 (Smart Bidding) or bid down -50% (Manual CPC) | Decision-makers are typically 25+ |
| High-value services | Top 10-20% HHI converts at 2x rate | Bid up +30% on top HHI tiers (Manual CPC) | Higher income correlates with service affordability |
| SaaS | Age 25-44 converts at highest rate | Bid up +20% on 25-44 (Manual CPC) | Core SaaS buyer demographic |
| Ecommerce (kids products) | Parents with young children convert at 3x rate | Bid up +40% on Parents: 0-1 years, Parents: 1-3 years (Manual CPC) | Direct product-audience fit |
| Luxury ecommerce | Lower 50% HHI has zero conversions | Exclude Lower 50% (Smart Bidding) | Product is unaffordable for this tier |
| Broad B2C | Gender skews 70% female | Bid up +20% on Female, bid down -15% on Male (Manual CPC) | Follow the conversion data, not assumptions |

---

## Segment stacking by campaign goal

### Remarketing stack (re-engage known users)

| Layer | Segment type | Purpose | Why it works |
|-------|-------------|---------|--------------|
| Primary | Website visitors (7-30 days) | Recent high-intent visitors | Recency correlates with conversion probability |
| Secondary | Customer Match (lapsed) | Win-back existing customers | Known relationship lowers cost per re-acquisition |
| Exclusion | Recent converters (7-30 days) | Avoid wasting spend on recent buyers | Prevents redundant spend on users who already converted |

### Prospecting stack (find new customers)

| Layer | Segment type | Purpose | Why it works |
|-------|-------------|---------|--------------|
| Primary | Custom segments (keywords + URLs) | Intent-based prospecting | Search behavior reveals declared purchase intent |
| Secondary | In-market segments | Active category researchers | Google's behavioral signals identify active researchers |
| Tertiary | Lookalikes (Demand Gen) | Similar to best customers | Modeled reach extends beyond declared intent |
| Exclusion | All website visitors + Customer Match | Pure new customer acquisition | Prevents spend on users already in your funnel |

### Awareness stack (broad reach)

| Layer | Segment type | Purpose | Why it works |
|-------|-------------|---------|--------------|
| Primary | Affinity segments | Long-term interest alignment | Broad reach at lowest CPM for awareness goals |
| Secondary | Life events | Trigger-based category entry | Life transitions create new purchase needs |
| Tertiary | Broad in-market | Category-level interest | Captures users entering the consideration phase |
| Exclusion | Existing customers | Focus on new audiences | Ensures budget reaches incremental users |

---

### Quick reference: Support library

| Document | Type | Used for |
|----------|------|---------|
| [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) | Checklist | Validates targeting setup after configuration |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Segment specs, limits, and targeting modes |
| [Audience Segments Reference](../references/Audience Segments Reference.md) | Reference | Complete list of all Google predefined segment names |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Mental Model | Conceptual framework for signals vs. targeting |

---

### Related SOPs

| SOP | Relationship |
|-----|-------------|
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | Uses this catalog to select segment configurations |
| [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) | Creates the Customer Match lists referenced here |

---

### Version details

- **Version:** 4.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
