# Search Campaign Settings Guidelines
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: GUIDELINE_6
Category: Configuration
Domain: Search
Human_Facing: Yes
Pillar: 6
Reference Type: Guideline
Agent_Readable: Yes
Status: Done

## Purpose

This guideline defines recommended campaign-level settings for Google Ads Search campaigns. It supports campaign creation and auditing by establishing default configurations, rationale, and exception conditions for each setting.

---

## What this is / What this is NOT

**This guideline:**

- Defines recommended values for each campaign-level setting
- Explains the rationale behind each recommendation
- Establishes when exceptions apply
- Covers network selection, location targeting, language, ad schedule, ad rotation, DSA settings, dates, and URL options

**This guideline does NOT:**

- Provide step-by-step campaign creation instructions (those belong in an SOP)
- Define campaign structure or ad group organization (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))
- Explain bid strategy selection or configuration (See: [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md))
- Cover ad group-level or ad-level settings

---

## Quick reference: recommended settings

| Setting | Recommended value | Rationale |
|---------|-------------------|-----------|
| Search Network | **ON** | Core delivery network for search campaigns |
| Search Partners | **Test** | Monitor by segment, disable if CPA/ROAS underperforms |
| Display Network | **OFF** | Creates a hidden Display campaign, wastes search budget |
| Location targeting | **Presence or interest** (default) | Start here, restrict to "Presence only" based on location report data |
| Location exclusion | **Presence only** | Excludes people physically in excluded locations |
| Language | **Match ad language** | Targets users whose Google interface matches your ad language |
| Ad schedule | **All hours, all days** | Let smart bidding optimize time-of-day performance |
| Ad rotation | **Optimize** | Google serves best-performing ad combinations more often |
| Dynamic search ads | **OFF unless using DSA ad groups** | Enable only when intentionally running DSA |
| End date | **No end date** (evergreen) | Set end dates only for seasonal or promotional campaigns |
| Tracking template | **Set at campaign level** | Consistent UTM parameters across all ads in the campaign |

---

## Network selection

### Search Network

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Search Network** | **ON** | This is the core delivery mechanism for search campaigns. Always enabled. |

### Search Partners

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Search Partners** | **Test** | Search Partners delivers ads on non-Google search engines and partner sites. Enable initially to test incremental reach. Monitor performance by segmenting reports by network. Disable if CPA/ROAS is unacceptable. |

**Testing protocol:**

- **Enable Search Partners initially** to test incremental reach potential.
- **Segment reports by network** to evaluate Search Partners performance separately from Google Search.
- **Decision gate:** If CPA/ROAS on Search Partners is acceptable relative to Google Search, keep enabled. If not, disable.
- **Important:** Search Partners performance cannot be optimized independently. You either accept the aggregate performance or turn it off entirely.

### Display Network

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Display Network** | **OFF** | Enabling Display Network on a Search campaign creates a hidden Display campaign that shares your Search budget. This silently diverts spend to Display placements with fundamentally different intent signals. |

> ⚠️ **Display Network on Search campaigns is the single most budget-wasting misconfiguration:** Google enables this by default. Verify it is OFF on every new Search campaign. If you want Display reach, create a dedicated Display campaign with its own budget and targeting.

---

## Location targeting

### Target setting

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Target method** | **Presence or interest: People in, regularly in, or who've shown interest in your targeted locations** | Google's default option. Includes people physically in your target area and people who have demonstrated interest in it. Start here, then restrict based on location report data. |

**When to switch to "Presence only":** If location reports show significant spend or poor performance from users outside your physical target area, switch to "Presence: People in or regularly in your targeted locations". This restricts delivery to users physically present.

**Example:** targeting the Netherlands with "Presence or interest" may show ads to someone in Australia who searched for "Amsterdam hotels". If this traffic converts poorly, switch to "Presence only" to restrict to users physically in the Netherlands.

### Exclusion setting

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Exclusion method** | **Presence: People in your excluded locations** | Excludes users physically in excluded areas. Matches the logic of your inclusion targeting. |

### Granularity recommendations

| Level | When to use |
|-------|-------------|
| Country | National campaigns, broad targeting |
| Region/State | Regional businesses, performance varies by region |
| City/Metro | Local businesses, city-specific offers |
| Radius | Brick-and-mortar, service-area businesses |

> 💡 **Start broad, narrow based on data:** Begin with country-level targeting. Use location reports to identify underperforming regions. Exclude or adjust from there rather than starting with overly narrow targeting.

---

## Language settings

### Recommended configuration

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Language** | **Set to the language(s) your ads are written in** | Google matches ads based on the user's Google interface language setting, not the language of their search query. |

**How language targeting works:** Google determines language eligibility based on the user's Google interface language, browser settings, and recent browsing behavior. Multilingual users may see ads in a different language than the one they searched in if Google is confident the user understands the ad language. For example, a user who understands English may be searching in Spanish for "zapatos azules" and still be served an English ad matching the keyword "blue shoes".

**Practical example:** If you own a business in Norway with ads targeted to Norwegian, your ads can appear for customers in Norway who have set Norwegian as their interface language. Your ads can also appear to Norwegian users who understand Norwegian but happen to be searching in English.

### Multi-language markets

For markets with multiple languages (Belgium, Switzerland, Canada):

- Create separate campaigns per language
- Each campaign gets language-appropriate ad copy and landing pages
- This enables accurate performance tracking per language segment
- Bid strategies can optimize independently per language audience

> ⚠️ **Do not add multiple languages to one campaign with single-language ads:** Users seeing ads in a language that does not match their expectation will not click, or will bounce. Separate campaigns per language is the correct approach.

---

## Ad schedule

### Default recommendation

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Ad schedule** | **All hours, all days** | Smart bidding already optimizes bids by time of day and day of week using historical performance data. Manual scheduling restricts the algorithm without adding value. |

### Exception conditions

| Business type | Recommended schedule | Rationale |
|--------------|---------------------|-----------|
| Phone-based lead gen (calls as primary conversion) | Business hours only | No one to answer calls outside operating hours |
| B2B with long sales cycles | Weekdays, business hours | Decision-makers are active during work hours, weekend traffic converts poorly |
| Seasonal promotions with specific windows | Custom schedule matching promotion | Prevents spend outside promotional window |

### Bid adjustments on schedule segments

If using manual CPC bidding, you can apply bid adjustments to specific time blocks. Under smart bidding, schedule bid adjustments are ignored (the algorithm handles time optimization using its own signals).

---

## Ad rotation

### Recommended configuration

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Ad rotation** | **Optimize** (default) | Google prioritizes serving the best-performing ad combinations based on signals like query, device, location, and time. This maximizes performance. |

### Exception condition

| Setting | When to use | Rationale |
|---------|-------------|-----------|
| **Do not optimize** | Only during formal A/B testing via Google Ads Experiments | Even rotation ensures each variant gets equal exposure during a controlled test. Once the test concludes, switch back to Optimize. |

> ⚠️ **Smart Bidding overrides "Do not optimize":** When using any smart bidding strategy (tCPA, tROAS, Max Conversions, Max Conversion Value), Google will still prioritize the best-performing ad combinations regardless of the rotation setting. "Do not optimize" only truly applies under Manual CPC.

> 💡 **"Do not optimize" is a testing tool, not a permanent setting:** Running "Do not optimize" outside of a formal experiment means Google shows underperforming ads as often as strong ones, wasting budget indefinitely.

---

## Dynamic search ad settings

### Default recommendation

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **DSA settings** | **OFF unless you have DSA ad groups in the campaign** | DSA settings at the campaign level are a prerequisite for DSA ad groups. Only enable when intentionally using DSA. |

### When to enable

Enable DSA settings at the campaign level if:

1. You are creating DSA ad groups within this campaign for query coverage expansion
2. You have a page feed prepared for custom label targeting (recommended over "all web pages")
3. Your site content is well-structured and regularly updated

### Configuration when enabled

| Setting | Value |
|---------|-------|
| Domain | Your website domain |
| Language | Match the campaign language |
| Page feed | Link your page feed for custom label targeting |
| Targeting source | "Use Google's index of my website" or "Use URLs from my page feed only" |

> ↪️ **See:** [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md) for targeting type details and page feed setup.

---

## Start and end dates

### Recommended configuration

| Campaign type | Start date | End date |
|--------------|------------|----------|
| Evergreen (always-on) | Set to launch date | No end date |
| Seasonal promotion | Promotion start | Promotion end |
| Limited-time offer | Offer start | Offer end |
| Testing/experimental | Test start | Test end |

> ⚠️ **Forgetting to set an end date on promotional campaigns wastes budget:** If you create a campaign for a specific promotion, always set the end date at campaign creation. Do not rely on remembering to pause it manually.

---

## URL options

### Tracking template

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Tracking template** | **Set at campaign level** | Ensures consistent UTM parameters across all ads in the campaign without needing to set them per ad or ad group |

**Typical tracking template format:**

`{lpurl}?utm_source=google&utm_medium=cpc&utm_campaign={_campaign}&utm_content={creative}&utm_term={keyword}`

### Final URL suffix

| Setting | Recommendation | Rationale |
|---------|---------------|-----------|
| **Final URL suffix** | **Set if additional tracking parameters are needed** | Appends parameters to the final URL for third-party tracking or analytics requirements |

Set the tracking template at the highest applicable level (account or campaign) and override at lower levels only when specific tracking requirements differ.

---

## Common mistakes

| Mistake | Impact | Fix |
|---------|--------|-----|
| Leaving Display Network ON | Budget silently diverted to Display placements | Verify OFF on every new campaign |
| Not monitoring location reports | Spend wasted on users outside target area without detection | Check location reports regularly, switch to "Presence only" if non-local traffic underperforms |
| Setting manual ad schedule on smart bidding campaigns | Schedule bid adjustments are ignored by the algorithm | Use all hours/all days, let smart bidding optimize |
| Multiple languages in one campaign | Ad/landing page language mismatch, poor CTR, high bounce | Separate campaigns per language |
| No end date on promotional campaigns | Budget wasted after promotion ends | Set end date at campaign creation |
| Running "Do not optimize" ad rotation permanently | Underperforming ads get equal serving indefinitely | Switch back to Optimize after testing concludes |
| Search Partners ON without monitoring | Uncontrolled spend on potentially lower-quality partner traffic | Segment reports by network, disable if CPA/ROAS underperforms |

---

## Configuration verification

After configuring campaign settings, verify:

| Check | Expected state |
|-------|---------------|
| Search Network | ON |
| Search Partners | Test (monitor by segment, disable if underperforms) |
| Display Network | OFF |
| Location targeting method | Presence or interest (default), or Presence only if location reports show waste |
| Location exclusion method | Presence: People in your excluded locations |
| Target locations | Set to correct geographic areas |
| Language | Matches ad copy language |
| Ad schedule | All hours, all days (unless exception applies) |
| Ad rotation | Optimize (unless running Experiment) |
| DSA settings | OFF (unless using DSA ad groups) |
| End date | No end date for evergreen, set for promotions |
| Tracking template | Set at campaign level with correct UTM parameters |

---

## Related documents

- [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md): how to organize campaigns, ad groups, and keywords
- [Modern Search Campaign Mental Model](../mental-models/Modern Search Campaign Mental Model.md): the modern approach to Search campaign architecture
- [Bidding Configuration Guidelines](../guidelines/Bidding Configuration Guidelines.md): bid strategy and portfolio configuration
- [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md): DSA targeting types and page feed configuration
- [AI Max for Search Reference](../references/AI Max for Search Reference.md): AI Max feature specifications and settings
- [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md): decision framework for when to enable AI Max

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
