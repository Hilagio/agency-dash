# Audience Targeting Reference
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CHEATSHEET_5
Status: Done
Category: Operational
Reference Type: Cheat Sheet
Agent_Readable: Yes
Human_Facing: Yes
Domain: Audiences
Pillar: 7

## Purpose

Documents audience segment types, content targeting options, and targeting settings for Display, Video, and Demand Gen campaigns.

---

## What this is / What this is NOT

**This reference:**

- Lists audience segment types for Display, Video, and Demand Gen
- Documents content targeting options (Display and Video only)
- Explains targeting modes and expansion settings

**This reference does NOT:**

- Explain signals vs targeting conceptually (See: [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md))
- Provide step-by-step campaign setup (See: respective campaign SOPs)
- Cover Performance Max signals (See: [Audience Signals Reference](../references/Audience Signals Reference.md))

---

## Quick reference: campaign capabilities

| **Capability** | **Display** | **Video** | **Demand Gen** |
| --- | --- | --- | --- |
| Audience segments | ✅ | ✅ | ✅ |
| Lookalike segments | ❌ | ❌ | ✅ (exclusive) |
| Content targeting | ✅ | ✅ | ❌ |
| Targeting vs Observation | ✅ | ✅ | Targeting only |
| Optimized targeting | ✅ | ✅ | ✅ |
| Exclusions | ✅ | ✅ | ✅ |

---

## Audience segment types

### Your data segments

| **Segment type** | **Source** | **Minimum size** | **Available in** |
| --- | --- | --- | --- |
| Website visitors | Google tag | 100 users | All |
| App users | Firebase/SDK | 100 users | All |
| Customer Match | CRM upload | 100 matched | All |
| YouTube users | Channel link | 100 users | All |

**Website visitor options:**

| **Segment** | **Definition** | **Best for** |
| --- | --- | --- |
| All visitors | Anyone who visited site | Broad remarketing |
| Product viewers | Viewed specific products/pages | Product remarketing |
| Cart abandoners | Added to cart, didn't convert | High-intent recovery |
| Converters | Completed conversion | Upsell, cross-sell, exclusion |
| Time-based | Visited in last X days | Recency targeting |

**Membership duration options:** 1, 7, 14, 30, 60, 90, 180, 360, 540 days

**YouTube user options:**

| **Segment** | **Definition** |
| --- | --- |
| Viewed any video | Watched any video on your channel |
| Viewed specific videos | Watched selected videos |
| Viewed as ad | Saw your video as an ad |
| Subscribed | Channel subscribers |
| Visited channel | Visited channel page |
| Liked video | Liked any video |
| Added to playlist | Added video to playlist |
| Shared video | Shared any video |

### Custom segments

| **Input type** | **What it targets** | **Syntax** |
| --- | --- | --- |
| **Search terms** | Users who searched these terms on Google | Plain text keywords |
| **URLs** | Users who browse similar websites | Full URLs (https://) |
| **Apps** | Users who use similar apps | App names or package IDs |

> ⚠️ **Custom segments target users, not placements:** Adding competitor URLs targets users who visit similar sites — it does NOT place your ads on those sites.

**Custom segment limits:**

| **Element** | **Limit** |
| --- | --- |
| Keywords per segment | 50 recommended (500 max) |
| URLs per segment | 10-15 recommended |
| Apps per segment | 10 recommended |

### Google predefined segments

**In-Market:**

| **Specification** | **Details** |
| --- | --- |
| Definition | Users actively researching/comparing products in category |
| Selection | Google's predefined categories and subcategories |
| Intent level | Medium-high (active purchase consideration) |

**Life Events:**

| **Event** | **Typical duration** |
| --- | --- |
| Business creation | Weeks around event |
| College graduation | Months around graduation |
| Job change | Weeks around change |
| Marriage | Months around wedding |
| Moving | Weeks around move |
| Home purchase | Months around purchase |
| Retirement | Months around retirement |

**Affinity:**

| **Specification** | **Details** |
| --- | --- |
| Definition | Long-term interests, habits, lifestyle |
| Selection | Google's predefined categories |
| Intent level | Low (lifestyle alignment, not purchase intent) |

**Detailed Demographics:**

| **Dimension** | **Options** |
| --- | --- |
| Parental status | Parents (by child age), Not parents |
| Marital status | Single, In relationship, Married |
| Education | Current student, High school, Bachelor's, Graduate |
| Homeownership | Renters, Homeowners |
| Employment | Employer size, Industry |

**Standard Demographics:**

| **Dimension** | **Options** |
| --- | --- |
| Age | 18-24, 25-34, 35-44, 45-54, 55-64, 65+, Unknown |
| Gender | Male, Female, Unknown |
| Household income | Top 10%, 11-20%, 21-30%, 31-40%, 41-50%, Lower 50%, Unknown |

---

## Lookalike segments (Demand Gen only)

Lookalike segments model new users based on characteristics of your seed audience.

### Available seed sources

| **Seed type** | **Minimum size** | **Quality** |
| --- | --- | --- |
| Customer Match | 1,000 matched users | 🥇 Best |
| Website converters | 1,000 users | 🥇 Best |
| Website visitors | 1,000 users | 🥈 Good |
| YouTube engaged | 1,000 users | 🥈 Good |
| App users | 1,000 users | 🥈 Good |

### Lookalike reach settings

Reach settings function as suggestions, not hard constraints. Google's AI can serve ads to qualified users beyond the selected threshold when it predicts strong performance.

| **Setting** | **Signal strength** | **Similarity** |
| --- | --- | --- |
| **Narrow** | Strongest similarity signal | Highest |
| **Balanced** | Medium similarity signal | Medium |
| **Broad** | Weakest similarity signal | Lowest |

> 💡 **Seed quality is the primary control lever:** The reach setting influences how Google weights similarity, but a high-quality seed list (converters, high-LTV customers) matters more than which threshold you select. Advertisers can [opt out of suggestion mode](https://support.google.com/google-ads/contact/lookalike_suggestion_opt_out) and revert to strict targeting.

> ↪️ **Lookalike configuration strategy.** See [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) for recommended seed sources, reach settings, and when to adjust.

---

## Content targeting (Display & Video only)

Content targeting controls WHERE ads appear (context), not WHO sees them.

> ⚠️ **Demand Gen does NOT support content targeting:** It only supports audience targeting.

### Content targeting types

| **Type** | **What it does** | **Available in** |
| --- | --- | --- |
| **Placements** | Specific sites, apps, YouTube channels/videos | Display, Video |
| **Topics** | Google's predefined content categories | Display, Video |
| **Keywords** | Pages/videos containing these terms | Display, Video |

### Placements

| **Placement type** | **Format** | **Example** |
| --- | --- | --- |
| Websites | URL | [`example.com`](http://example.com) |
| YouTube channels | Channel URL | [`youtube.com/c/channelname`](http://youtube.com/c/channelname) |
| YouTube videos | Video URL | [`youtube.com/watch?v=xxxxx`](http://youtube.com/watch?v=xxxxx) |
| Apps | App name or ID | [`com.example.app`](http://com.example.app) |

**Placement limits:**

| **Element** | **Limit** |
| --- | --- |
| Placements per ad group | 10,000 max |
| Recommended per ad group | 20-50 for control |

### Topics

| **Specification** | **Details** |
| --- | --- |
| Selection | Google's predefined topic taxonomy |
| Granularity | Category > Subcategory > Sub-subcategory |
| Behavior | Ads appear on pages Google classifies under topic |

### Keywords (content)

| **Specification** | **Details** |
| --- | --- |
| Behavior | Ads appear on pages containing these keywords |
| Match type | Broad contextual match (not exact) |
| Limit | 20 keywords per ad group recommended |

> ⚠️ **Content keywords ≠ Search keywords:** These keywords match page content, not user queries. Results can be unpredictable.

---

## Combining audiences and content

### Display & Video: AND vs OR logic

| **Combination** | **Logic** | **Effect** |
| --- | --- | --- |
| Multiple audiences | OR | Reaches users in ANY selected audience |
| Multiple content targets | OR | Shows on ANY matching content |
| Audience + Content | AND | Reaches selected users ON selected content |

**Example:**

| **Targeting** | **Result** |
| --- | --- |
| In-market: Furniture + Affinity: Home Decor | Users in either audience |
| Topic: Home & Garden + Topic: Interior Design | Content matching either topic |
| In-market: Furniture + Topic: Home & Garden | Furniture intenders ON home content |

> 💡 **AND logic restricts reach:** Combining audience + content significantly reduces eligible impressions.

> ↪️ **When to layer.** See [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) for content targeting layering decisions.

---

## Targeting modes

### Targeting vs observation

| Mode | Behavior | Use when |
| --- | --- | --- |
| **Targeting** | Restricts delivery to selected segments only | You want ONLY these users |
| **Observation** | Delivers to all users; reports by segment | You want data without restricting |

> ↪️ **When to use each mode.** See [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) for recommended targeting mode per scenario, graduation criteria, and exception conditions.

### Setting Targeting Mode

| Campaign Type | Default | Can Change |
| --- | --- | --- |
| Display | Targeting | Yes |
| Video | Targeting | Yes |
| Demand Gen | Targeting | No (Targeting only) |

---

## Optimized Targeting and Audience Expansion

Google offers two distinct features that expand beyond your selected audiences. They serve different purposes and apply to different campaign types.

> ⚠️ **These are two different features:** Optimized targeting and audience expansion are not the same. They have different mechanics, different availability, and different measurement approaches. Do not conflate them.

### Feature comparison

| Feature | What it does | Available in | How it finds users |
| --- | --- | --- | --- |
| **Optimized targeting** | Finds users most likely to convert beyond your selections | Display, Video (Sales/Leads/Traffic goals), Demand Gen | Analyzes real-time conversion data: what recent converters searched for, browsed, and engaged with |
| **Audience expansion** | Finds more users similar to your selected audience | Video (Consideration/Awareness goals) ONLY | Models users who look like your selected audience to increase reach |

### Optimized targeting: how it works

Optimized targeting looks beyond your manually selected audience segments to find additional users likely to convert. It uses your selected audiences, landing page content, and creative assets as starting signals, then analyzes conversion patterns to expand reach.

| Setting | Effect |
| --- | --- |
| **ON** | Google expands beyond your selected audiences to find additional likely converters. Your audience selections remain the starting point, but Google serves ads to users outside those selections when it predicts strong performance. Exclusions and placement restrictions are always respected. |
| **OFF** | Delivery restricted to your selected audiences only |

**What optimized targeting uses as signals (per campaign type):**

| Campaign type | Signal inputs used | Not used as signals |
| --- | --- | --- |
| Display | Audience segments, custom segments, Customer Match, keywords, topics | N/A |
| Video (Sales/Leads/Traffic) | Audience segments, custom segments, Customer Match | Placements (ads only show on provided placements) |
| Demand Gen | Audience segments, custom segments, Customer Match | N/A |

> ⚠️ **Demand Gen demographic behavior:** When optimized targeting is ON in Demand Gen, Google may serve ads to users beyond your selected demographic criteria (age, gender, household income, parental status). You can restrict this to age and gender only in ad group settings, but doing so may limit performance.

### Audience expansion: how it works (Video only)

Audience expansion is available exclusively for Video campaigns with "Product and brand consideration" or "Brand awareness and reach" goals. It finds more users who resemble your selected audience to increase impressions, views, and reach while maintaining your CPM and CPV bids.

| Setting | Effect |
| --- | --- |
| **ON** | Google finds users similar to your selected audience for broader reach |
| **OFF** | Delivery restricted to your selected audiences only |

> ↪️ **When to enable or disable.** See [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) for recommended settings by campaign type and goal.

### Measuring expansion impact

Navigate to Audiences, keywords, and content > Audiences > Show table. Look for the "Total: Expansion and optimized targeting" row, which separates performance of your selected audiences from expanded reach.

| Metric | Interpretation |
| --- | --- |
| Expanded CPA < 1.5x targeted CPA | Expansion is working: keep ON |
| Expanded CPA 1.5-2x targeted CPA | Monitor: evaluate over 14+ days before deciding |
| Expanded CPA > 2x targeted CPA | Expansion is inefficient: turn OFF |
| Expansion delivers < 5% of conversions | Low risk, low impact: keep ON for additional volume |
| Expansion delivers > 50% of conversions | Audience selections may be too narrow: review your segments |

> 💡 **Optimized targeting can significantly change who sees your ads:** When enabled, Google may spend the majority of your budget outside your selected audiences. Check the expansion breakdown regularly, not just campaign-level metrics.

---

## Exclusions

Exclusions remove users from eligibility. They apply regardless of other targeting.

### Exclusion types

| Type | What it excludes | Available in |
| --- | --- | --- |
| Audience segments | Users in selected segments | All |
| Placements | Specific sites/apps/channels | Display, Video |
| Topics | Content categories | Display, Video |
| Keywords | Pages with these terms | Display, Video |

### Common exclusion patterns

| Goal | Exclude |
| --- | --- |
| New customers only | Existing customers (Customer Match) |
| Avoid post-purchase waste | Recent converters (7-30 days) |
| Brand safety | Sensitive content categories |
| Placement quality | Low-quality placements, MFA sites |
| Competitor separation | Competitor content (placements/topics) |

### Exclusion Configuration

| Level | Scope | Use For |
| --- | --- | --- |
| Campaign | All ad groups in campaign | Broad exclusions |
| Ad group | Single ad group | Specific exclusions |
| Account | All campaigns | Universal exclusions (brand safety) |

---

## Demographics as a targeting lever

By default, all demographic groups are targeted. Demographics function as a layer applied on top of audience segments to refine performance, not as standalone targeting.

### Available demographics by campaign type

| Demographic | Display | Video | Demand Gen | Exclusion support |
| --- | --- | --- | --- | --- |
| Age (18-24, 25-34, 35-44, 45-54, 55-64, 65+, Unknown) | ✅ | ✅ | ✅ | ✅ |
| Gender (Male, Female, Unknown) | ✅ | ✅ | ✅ | ✅ |
| Parental status (Parent, Not a parent, Unknown) | ✅ | ✅ | ✅ | ✅ |
| Household income (Top 10% through Lower 50%, Unknown) | ✅ (select countries) | ✅ (select countries) | ✅ (select countries) | ✅ |

### Demographic actions by bidding type

| Bidding type | Available action | Location in UI |
| --- | --- | --- |
| Manual CPC | Bid adjustments per demographic group | Audiences, keywords, and content > Demographics > Edit bid adjustment |
| Smart Bidding (tCPA/tROAS) | Exclude underperforming demographic groups | Audiences, keywords, and content > Demographics > Exclude |

> ⚠️ **The "Unknown" segment is significant:** 15-30% of impressions typically fall into "Unknown" demographics. Excluding "Unknown" removes a large portion of available inventory.

> ↪️ **Demographic optimization strategy.** See [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) for recommended timing, thresholds, and exception conditions for demographic exclusions.

### Where to find demographic data

Navigate to Audiences, keywords, and content > Demographics. Select the demographic dimension tab (Age, Gender, Parental status, Household income).

---

## Combined segments

Combined segments let you build precise audiences using AND/OR/NOT logic across multiple segment types.

### How combined segments work

| Operator | Effect | Example |
| --- | --- | --- |
| **AND** | Must match ALL conditions | In-market for CRM AND Custom segment (CRM keywords) |
| **OR** | Must match ANY condition | Website visitors OR Customer Match |
| **NOT** | Exclude matching users | In-market for CRM AND NOT existing customers |

### Creating combined segments

| Step | Action |
| --- | --- |
| Location | Tools & Settings > Audience Manager > Combined segments |
| Components | Any segment type can be combined: your data, custom, in-market, affinity, life events, detailed demographics |
| Limit | More conditions = smaller audience. Each AND condition significantly reduces eligible users |
| Testing | Test in a separate ad group before scaling to avoid committing budget to an untested audience |

### Availability by campaign type

| Campaign type | Combined segments supported |
| --- | --- |
| Display | ✅ |
| Video | ✅ |
| Demand Gen | ✅ |

> 💡 **Google recommends combining lookalike and custom segments for Demand Gen:** Add your lookalike segment in the same ad group as a high-intent custom segment targeting users who searched for your brand or category. Use 10-15 of your top converting search terms to build the custom segment.

> ↪️ **Combined segment patterns:** See [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) for reusable combined segment configurations by vertical.

---

## Audience insights

Audience insights reveal which audience segments drive conversions and how overrepresented they are among your converters versus the general population.

### Insight types

| Type | What it shows | Use for |
| --- | --- | --- |
| **Persona audience insights** | Segment name, type, share of conversions, index | Discovering which untargeted segments drive conversions |
| **Asset audience insights** | Which segments respond most to specific assets | Aligning creative with audience preferences |

### Where to find audience insights

| Location | What you see |
| --- | --- |
| Google Ads > Insights page > Audience insight cards | Summary of top-performing audience segments |
| Expandable table in Insights page | Full persona insights with segment details |
| Audience Manager > Your data insights | Performance of your first-party audience segments across campaigns |

### Key metric: Index

The "Index" column shows how overrepresented an audience segment is among your converters compared to the rest of the targeted population. An index of 5x means that segment is 5 times more likely to convert than average.

| Index | Interpretation | Action |
| --- | --- | --- |
| > 3x | Highly overrepresented: strong conversion signal | Add as targeting segment if not already targeted |
| 1.5-3x | Moderately overrepresented | Evaluate for addition, especially if high conversion volume |
| < 1.5x | Roughly proportional to general population | Low priority for targeting addition |

### Campaign type availability

| Campaign type | Persona insights | Asset insights |
| --- | --- | --- |
| Display | ✅ (beta) | ✅ |
| Video | ✅ (action campaigns) | ✅ |
| Demand Gen | ✅ | ✅ |
| Search | ✅ | ✅ |
| Performance Max | ✅ | ✅ |
| Shopping | ✅ | N/A |

> 💡 **Audience insights are a discovery tool, not a reporting tool:** Use insights to identify segments you are NOT targeting that drive conversions. Then add those segments to targeting or combine them with existing segments for sharper precision.

---

## Settings reference by Campaign Type

> ↪️ **Recommended settings per campaign type.** See [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) for recommended targeting mode, expansion settings, frequency caps, and content exclusion settings per campaign type and goal.

### Available settings by campaign type

| Setting | Display | Video | Demand Gen |
|---------|---------|-------|------------|
| Targeting mode | Targeting / Observation | Targeting / Observation | Targeting only |
| Optimized targeting | On / Off | On / Off (Sales/Leads/Traffic goals only) | On / Off |
| Audience expansion | N/A | On / Off (Consideration/Awareness goals only) | N/A |
| Content exclusions | Category exclusions, inventory type | Inventory type, labels | N/A |
| Frequency capping | Impressions per user per day/week | Impressions per user per day/week | Limited availability |
| Demographics | Full control | Full control | Full control (expansion may override when optimized targeting ON) |

---

## Audience size guidelines

| Audience Type | Minimum | Recommended | Notes |
| --- | --- | --- | --- |
| Remarketing | 100 | 1,000+ | Larger = more delivery |
| Customer Match | 100 matched | 1,000+ matched | Match rate affects actual size |
| Lookalike seed | 1,000 | 5,000+ | Larger seed = better modeling |
| Custom segment | No minimum | 10-15 keywords/URLs | Quality over quantity |

---

## Common mistakes

| Mistake | Problem | Fix |
| --- | --- | --- |
| Audiences too narrow | No delivery | Expand or remove layers |
| Too many layers (AND logic) | Restricted reach | Use OR or remove layers |
| Optimized targeting ON during tests | Can't attribute to segments | Turn OFF for clean data |
| No exclusions | Wastes spend on converters | Exclude recent converters |
| Custom segment URLs = placements | Confusion about where ads show | Custom = users; Placements = sites |
| Broad Lookalikes first | Weakest similarity signal from day one | Start Balanced, prioritize seed quality |
| Ignoring Observation mode | Missing insights | Use for testing before committing |
| Confusing optimized targeting with audience expansion | Different features applied incorrectly | Optimized targeting for performance goals; audience expansion for Video consideration/awareness only |
| Never reviewing demographics | Missing optimization opportunities | Review demographic performance monthly, exclude underperformers |
| Excluding "Unknown" demographics without data | Losing 15-30% of inventory | Only exclude after 30+ days of consistently poor performance |
| Ignoring audience insights | Missing untargeted high-performing segments | Check Insights page monthly for high-index segments |
| Never testing combined segments | Using only simple segment targeting | Combine high-performing segments with AND logic for precision |

---

## Related documents

| Document | Relationship |
| --- | --- |
| [Audience Targeting Guidelines](../guidelines/Audience Targeting Guidelines.md) | Recommended settings, expansion decisions, demographic optimization |
| [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md) | Conceptual framework (signals vs targeting) |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | PMax signal types and configuration |
| [Audience Segments Reference](../references/Audience Segments Reference.md) | Complete list of all Google predefined segment names |
| [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md) | Segment configurations including combined segments and demographics patterns |
| [SOP – Optimize Audience Performance](../sops/SOP – Optimize Audience Performance.md) | Structured audience optimization execution |
| [SOP – Launch a Display Campaign](../sops/SOP – Launch a Display Campaign.md) | Display campaign execution |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Video campaign execution |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Demand Gen campaign execution |

---

## Version details

- **Version:** 3.0
- **Last Updated:** April 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.