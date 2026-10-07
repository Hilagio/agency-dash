# Offline Conversion Tracking Reference
Created: 2026-02-04
Updated: 2026-08-27

Support_ID: CHEATSHEET_16
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents Offline Conversion Tracking (OCT) for lead gen and SaaS: the three import methods (GCLID, Enhanced Conversions for Leads, Hybrid), CRM integration, upload workflows, and conversion funnel mapping.

---

## What this reference is / What this is NOT

**This reference:**

- Explains why OCT matters for lead gen and SaaS accounts
- Documents the three import methods with comparison
- Covers conversion action setup for offline imports
- Details upload methods, timing, and the hybrid approach for maximum match rates
- Maps the lead gen conversion funnel for OCT

**This reference does NOT:**

- Apply to ecommerce (ecommerce tracks purchases via on-site pixels, not offline imports)
- Provide step-by-step OCT implementation (See: [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md))
- Cover on-site conversion pixel setup (See: [Conversion Pixel Reference](../references/Conversion Pixel Reference.md))
- Explain Enhanced Conversions for web (See: [Enhanced Conversions Reference](../references/Enhanced Conversions Reference.md))
- Document bid strategy selection (See: [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md))

---

## Why OCT matters

### The attribution black hole

Traditional on-site conversion tracking only sees lead submissions. What happens after the form is submitted, whether the lead becomes a qualified lead, receives a proposal, or closes as a paying customer, is invisible to Google Ads.

| **What on-site tracking sees** | **What on-site tracking misses** |
|-------------------------------|--------------------------------|
| Form submission | Lead quality (qualified vs. unqualified) |
| Phone call initiation | Sales outcome (closed deal vs. lost) |
| Signup event | Revenue and deal value |
| Cost per lead | Cost per closed deal, ROAS, profit |

Without OCT, you optimize for lead quantity. With OCT, you optimize for lead quality, revenue, and profit.

### The case for OCT

| **Metric** | **Without OCT** | **With OCT** |
|-----------|----------------|-------------|
| **Optimization target** | Cost per lead (CPL) | Cost per closed deal, ROAS, POAS |
| **Smart Bidding signal** | Form submission (low quality signal) | Qualified lead or closed deal (high quality signal) |
| **Budget allocation** | Based on lead volume | Based on revenue and profit contribution |
| **Campaign evaluation** | Campaign A has lower CPL = "winner" | Campaign B has higher close rate and deal value = actual winner |

> ⚠️ **OCT earns its place at any volume.** Where conversion volumes are too low for offline conversions to serve as a primary bidding signal, the same actions still run as secondary conversion actions and surface business insight available no other way.

---

## Quick reference: three import methods

| **Method** | **Identifier** | **Match rate** | **Setup complexity** | **Best for** |
|-----------|---------------|---------------|---------------------|-------------|
| **GCLID** | Google Click ID (gclid, gbraid, wbraid) | Highest | High: requires hidden fields, cookie/localStorage capture, CRM storage | Primary method when click IDs can be captured |
| **Enhanced Conversions for Leads (EC4L)** | Hashed email address (+ phone, address) | Medium-high | Medium: requires Enhanced Conversions setup, user-provided data tag | Backup method, or primary when GCLID capture is not feasible |
| **Hybrid (GCLID + EC4L)** | Both: GCLID when available, EC4L as fallback | Maximum | Highest: combines both methods with conditional logic | Recommended approach for all lead gen accounts |

---

## Method 1: GCLID

### How it works

1. **User clicks your ad**: Google appends a unique GCLID to the landing page URL
2. **Hidden fields capture the GCLID**: A script extracts the GCLID from the URL and stores it in localStorage and a first-party cookie
3. **Form submission includes the GCLID**: Hidden form fields send the stored GCLID alongside the lead's contact information
4. **CRM stores the GCLID**: Lead record includes the click identifier
5. **Lead converts offline**: When the lead becomes a qualified lead or closed deal, you upload the conversion to Google Ads with the stored GCLID, timestamp, and value
6. **Google attributes the offline conversion**: Matches the GCLID to the original ad click, attributing revenue to the campaign, ad group, keyword, and search term

### Three Google Click ID types

| **Click ID** | **Format** | **Environment** | **Priority** |
|-------------|-----------|----------------|-------------|
| **gclid** | Long alphanumeric string | Desktop, Android, most web environments | 1st (always prioritize when available) |
| **gbraid** | Shorter string | iOS app environments | 2nd (use when gclid is not available) |
| **wbraid** | Shorter string | iOS web environments (Safari) | 3rd (last resort when neither gclid nor gbraid is available) |

> ⚠️ **All three click ID types need capture.** Every form carries hidden fields for gclid, gbraid, and wbraid. Uploads follow the priority order gclid, gbraid, wbraid, and a single conversion never carries more than one click ID type.

> ⚠️ **External attribution covers gclid and gbraid, and rules out transaction ID deduplication.** If you upload conversions already scored by your own attribution model, you cannot also deduplicate them on transaction ID. Choose one: Google's attribution with transaction ID dedupe, or your own credit assignment without it.

### Hidden field requirements

Every lead form across your entire website must include hidden fields for:

| **Hidden field name** | **Purpose** |
|----------------------|-----------|
| `gclid` | Stores the Google Click ID |
| `gbraid` | Stores the iOS app Click ID |
| `wbraid` | Stores the iOS web Click ID |
| `consent_state` | Stores the user's consent status (granted/denied) for privacy compliance |

A GTM Custom HTML script extracts click IDs from the URL, stores them in localStorage and a first-party cookie (90-day expiry), and populates the hidden fields when the form loads.

---

## Method 2: Enhanced Conversions for Leads (EC4L)

### How it works

1. **User clicks your ad and submits a lead form**: At form submission, a user-provided data tag fires and sends hashed email (and optionally phone) to Google
2. **Google stores the hashed identifier**: Google now knows which Google user submitted the form
3. **Lead information stored in CRM**: Email and phone are already captured as contact details
4. **Lead converts offline**: You upload the conversion with the same email/phone as identifier
5. **Google matches**: Hashed email from upload matches hashed email from original form submission, attributing the offline conversion to the ad click

### Advantages over GCLID method

| **Advantage** | **Details** |
|-------------|-----------|
| No hidden fields required | Email and phone are already captured in the form: no additional fields needed |
| No click ID capture scripts | No localStorage, cookies, or URL parsing required |
| Works when GCLID is unavailable | If click ID was not captured (script failure, cookie blocked), EC4L still works |
| Simpler CRM setup | No additional CRM fields for click IDs |

### Limitations

| **Limitation** | **Details** |
|---------------|-----------|
| Lower match rates than GCLID | Not all email addresses match a Google account |
| Requires Enhanced Conversions setup | User-provided data tag must fire at form submission |
| Enhanced Conversions setting required | Enhanced Conversions is a single account-level setting that covers web and leads matching |

---

## Method 3: Hybrid approach (recommended)

### How it works

The hybrid method combines GCLID and EC4L with conditional logic:

1. **Capture both** click IDs (hidden fields) and user-provided data (Enhanced Conversions) at form submission
2. **Store both** in CRM: click IDs in dedicated fields, email/phone in standard contact fields
3. **Upload with conditional logic**: If GCLID exists, upload using GCLID. If not, fall back to EC4L (email/phone). When using GCLID, also include PII to further enhance match rates.

### Upload priority flowchart

| **Step** | **Check** | **Action** |
|---------|----------|----------|
| 1 | Does gclid exist? | Yes: upload using gclid + PII (email, phone) |
| 2 | Does gbraid exist? | Yes: upload using gbraid + PII |
| 3 | Does wbraid exist? | Yes: upload using wbraid + PII |
| 4 | No click IDs available | Upload using EC4L (email/phone only) |

> 💡 **PII alongside a click ID raises the match rate.** A GCLID upload that also carries the hashed email and phone number matches better than either identifier achieves alone.

### Automation

Zapier, Make, and custom integrations carry the hybrid workflow: a CRM stage change triggers the upload, the identifier is selected in gclid, gbraid, wbraid, EC4L order, and the timestamp carries the offset described under Upload timing.

> ↪️ **For the automation build itself:** See [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md).

---

## When native lead journey mapping fits instead

Google Ads can define funnel stages natively, with per-stage conversion actions, delays and values configured inside the account instead of derived from your CRM. That removes the upload pipeline, and it hands the value definition to Google.
| Situation | Path |
|-----------|------|
| A CRM is already in place | Integrate it with OCT. The business keeps its existing tool, CRM and lead-scoring stack instead of adopting something new |
| No CRM, or no appetite to build an upload pipeline | Native lead journey mapping is a legitimate path. Weigh it against a light setup: a spreadsheet as the CRM plus an automation tool handling uploads |

> ⚠️ **The tradeoff is who defines value.** OCT sends Google an outcome your business already scored. Native journey mapping asks Google to score it for you. Where that scoring logic already lives in a CRM, exporting it is worth more than rebuilding it inside the ad platform.

---

## Conversion action setup

### Creating offline conversion actions

Each offline conversion stage has its own "Import" type conversion action:

| **Conversion action** | **Goal category** | **Counting** | **Optimization** | **Value** |
|----------------------|-------------------|-------------|-----------------|---------|
| OCT: Qualified Lead | Submit Lead Form | One | Primary or Secondary (depends on volume) | Static (average deal value) or dynamic (per-lead value) |
| OCT: Closed Deal | Purchase/Sale | One | Primary (recommended for bottom-funnel campaigns) | Dynamic (actual deal value) |
| OCT: Gross Profit | Purchase/Sale | One | Primary (for POAS-based bidding) | Dynamic (actual gross profit per deal) |

> 💡 **Revenue and gross profit are separate actions.** Two offline conversion actions, one carrying revenue for ROAS bidding and one carrying gross profit for POAS bidding, keep both data points available for decision making.

### One conversion action per stage, not per method

A conversion action maps to an offline stage (Qualified Lead, Closed Deal), not to an import method. GCLID and EC4L imports land on the same conversion action, which consolidates the conversion signal and gives Smart Bidding a stronger dataset.

---

## Upload methods

| **Method** | **How** | **Best for** |
|-----------|--------|-------------|
| **Manual CSV upload** | Google Ads template, filled and uploaded by hand | Testing, low volume, one-time imports |
| **Google Sheets scheduled upload** | Link a Google Sheet, configure automatic upload schedule | Small accounts with simple CRM (Google Sheets as database) |
| **CRM integration (native)** | Salesforce, HubSpot, Zoho native connectors | Accounts already using supported CRMs |
| **Zapier / Make automation** | Trigger-based automated upload when CRM status changes | Most lead gen accounts: flexible, supports hybrid approach |
| **Data Manager API** | Programmatic upload for high-volume or real-time imports | High-volume accounts, custom integrations |

> ⚠️ **GCLIDs carry the attribution.** They are required when no tag collects user-provided data, and they still add value alongside the EC-for-leads tag: the GCLID gives direct attribution, hashed identifiers fill the gaps.

---

## Upload timing

| **Guideline** | **Details** |
|-------------|-----------|
| **Minimum delay** | Wait at least 24 hours after the click before uploading (Google needs time to process click IDs) |
| **Maximum lookback** | 90 days from the click date (conversions uploaded after 90 days are rejected) |
| **Attribution modeling window** | 7 days from the conversion event. Later uploads still appear in standard reports but are bypassed by attribution modeling, so they never shape Data-Driven Attribution |
| **Recommended timing** | Upload within 24-48 hours of the offline conversion occurring |
| **Timestamp format** | Include a 12-hour offset to handle timezone differences between your CRM and Google Ads |

> ⚠️ **90-day lookback limit:** If your sales cycle exceeds 90 days, you must import an earlier funnel stage (qualified lead) that occurs within the 90-day window. The closed deal can still be tracked in your CRM but cannot be uploaded to Google Ads if it occurred more than 90 days after the click.

> ⚠️ **Two limits, two different failures.** The 90-day lookback decides whether an upload is accepted at all. The 7-day attribution window decides whether it influences Data-Driven Attribution. An upload at day 30 is accepted, appears in your reports, and stays invisible to the model. Upload latency under 7 days keeps the bidding signal aligned with what actually closed.

---

## Conversion funnel mapping for lead gen

### Which stages to import

| **Funnel stage** | **Import to Google Ads?** | **Optimization role** | **Rationale** |
|-----------------|--------------------------|----------------------|-------------|
| **Lead** (form submission) | Yes (on-site GACT pixel) | Secondary or Primary (depends on volume) | Volume signal: tracks initial engagement |
| **MQL** (marketing qualified lead) | Optional | Secondary | Intermediate signal: useful if sales cycle is very long |
| **SQL** (sales qualified lead) | Recommended | Primary or Secondary | Quality signal: closer to revenue than raw lead |
| **Proposal / Opportunity** | Optional | Secondary | Milestone tracking: useful for long B2B cycles |
| **Closed Deal** | Yes | Primary | Revenue signal: the ultimate business outcome |

### Choosing your primary offline conversion

| **Scenario** | **Primary conversion** | **Why** |
|-------------|----------------------|--------|
| 30+ closed deals per month | Closed Deal | Sufficient volume for Smart Bidding at the deepest funnel stage |
| 30+ qualified leads per month, <30 closed deals | Qualified Lead | More volume, still a quality signal beyond raw leads |
| <30 qualified leads per month | On-site lead (form submission) | Use as primary for bidding, import offline stages as secondary for insights |
| Sales cycle exceeds 90 days | Earliest meaningful offline stage within 90-day window | Cannot upload beyond 90-day lookback |

---

## Value-based bidding with OCT

### How it works

When you import offline conversions with deal values, Smart Bidding can optimize for revenue (tROAS) instead of volume (tCPA). This means Google bids higher for clicks that are more likely to produce high-value deals.

| **Bidding approach** | **Import requirement** | **Bid strategy** |
|---------------------|----------------------|-----------------|
| Volume-based (tCPA) | Offline conversion with no value or static value | Target CPA |
| Revenue-based (tROAS) | Offline conversion with dynamic revenue per deal | Target ROAS |
| Profit-based (tPOAS) | Offline conversion with dynamic gross profit per deal | Target ROAS on profit conversion action |

### Assigning values

| **Approach** | **How** | **When to use** |
|-------------|--------|----------------|
| **Dynamic value** | Upload actual deal value per conversion | When deal values vary significantly between leads |
| **Static value** | Use average deal value for all conversions of a stage | When deal values are relatively consistent |
| **Calculated value** | Multiply average deal value by stage-specific close rate | When optimizing for an early funnel stage (e.g., SQL value = avg deal value x SQL-to-close rate) |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Only tracking on-site leads, not offline outcomes | Optimizing for lead quantity instead of lead quality | Implement OCT with at least qualified lead and closed deal stages |
| Uploading beyond 90-day lookback window | Conversions rejected by Google Ads | Import earlier funnel stages that occur within 90 days of the click |
| Not including consent state in upload | Privacy compliance issues in GDPR/EEA regions | Capture consent state at form submission, include in upload payload |
| Using EC4L only without GCLID | Lower match rates than necessary | Implement hybrid approach: GCLID primary, EC4L backup |
| Uploading immediately after click | Click ID not yet processed by Google | Wait at least 24 hours before uploading |
| Creating separate conversion actions per method | Fragments conversion data, weakens Smart Bidding signal | Use one conversion action per funnel stage, send both methods to it |
| Not sending value with offline conversions | Cannot use value-based bidding (tROAS/tPOAS) | Always include deal value (revenue or profit) in uploads |
| Missing hidden fields on some forms | GCLID not captured for leads from those forms | Add hidden fields (gclid, gbraid, wbraid, consent_state) to every form on the website |
| Not prioritizing click ID types correctly | Upload rejected or misattributed | Follow priority: gclid > gbraid > wbraid > EC4L (email/phone) |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | OCT is a key stage in the measurement maturity journey |
| [Conversion Pixel Reference](../references/Conversion Pixel Reference.md) | On-site GACT pixel must be in place before OCT can attribute offline conversions to clicks |
| [Enhanced Conversions Reference](../references/Enhanced Conversions Reference.md) | EC4L is a core OCT method documented in detail |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Offline conversion actions use Import type with specific counting and value settings |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Thresholds determine whether offline conversions can serve as primary bidding signal |

---

## Version details

- **Version:** 2.0
- **Last Updated:** August 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
