# Enhanced Conversions Reference
Created: 2026-02-04
Updated: 2026-04-02

Support_ID: CHEATSHEET_15
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents Enhanced Conversions (EC), how hashed first-party data improves attribution accuracy, the three setup methods, and the Enhanced Conversions for Leads (EC4L) variant for lead gen and SaaS.

---

## What this reference is / What this is NOT

**This reference:**

- Explains how Enhanced Conversions recover otherwise unmeasured conversions
- Documents the three setup methods (GTM, gtag, Google Ads API) with comparison
- Covers data requirements, hashing, and diagnostics
- Explains Enhanced Conversions for Leads (EC4L) as a variant for lead gen/SaaS

**This reference does NOT:**

- Provide step-by-step EC implementation (See: [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md))
- Explain offline conversion import workflows (See: [Offline Conversion Tracking Reference](../references/Offline Conversion Tracking Reference.md))
- Cover server-side tagging setup (See: [Server-Side Tagging Reference](../references/Server-Side Tagging Reference.md))
- Document conversion pixel installation (See: [Conversion Pixel Reference](../references/Conversion Pixel Reference.md))

---

## How Enhanced Conversions work

### The attribution flow

1. **User views or clicks your ad** while signed into a Google account
2. **User converts on your website** (purchase, form submission, signup)
3. **Conversion tag captures hashed first-party data** (email address, phone number) alongside the standard conversion event
4. **Hashed data is sent to Google** in a privacy-safe, one-way hash (SHA-256)
5. **Google matches the hash** against its database of signed-in user data
6. **Conversion is attributed** to the ad interaction that otherwise could not have been tracked (due to cookie loss, cross-device journeys, or view-through attribution gaps)

### Why this matters

Enhanced Conversions recover conversions that standard pixel tracking misses. Without EC, conversions from users who viewed (but did not click) your ad, switched devices, or lost cookies are invisible. With EC, Google matches the hashed user data to the signed-in Google account that engaged with your ad.

> 💡 **Strongest impact on upper and mid-funnel campaigns:** EC produces the largest uplift for Display, Video, and Demand Gen campaigns where view-through and cross-device attribution gaps are most common. Expect 5-25% increase in attributed conversions depending on campaign mix.

---

## Quick reference: setup methods

| **Method** | **How it works** | **Hashing** | **Technical requirement** | **Best for** |
|-----------|-----------------|------------|--------------------------|-------------|
| **Google Tag Manager (GTM)** | Create user-provided data variables in GTM, link to conversion tracking tag | Automatic (GTM handles SHA-256) | Medium: data layer must expose user data | Most implementations: flexible, debuggable |
| **gtag (hardcoded)** | Add enhanced_conversions snippet below the conversion event snippet | Automatic (gtag handles SHA-256) | Medium: developer adds snippet to conversion pages | Sites using hardcoded gtag without GTM |
| **Google Ads API** | Programmatic submission of hashed user data via API calls | Manual (must pre-hash with SHA-256 before sending) | High: requires developer with API expertise | High-volume accounts, software integrations (e.g., ProfitMetrics Conversion Booster) |

---

## EC (Web) vs EC for Leads: comparison

| Feature | Enhanced Conversions (Web) | Enhanced Conversions for Leads |
|---------|---------------------------|-------------------------------|
| **Purpose** | Improve web conversion measurement accuracy | Match offline CRM conversions back to ad clicks |
| **Data sent** | Hashed user data at the moment of online conversion | Hashed user data at lead form submission |
| **Matching method** | Supplements click-based attribution with user-data matching | Replaces GCLID-only offline matching with user-data matching |
| **Best for** | Ecommerce, SaaS trials, any online conversion | Lead Gen and SaaS with CRM pipeline (offline conversion import) |
| **Setup complexity** | Low (tag modification on conversion pages) | Medium (requires CRM integration + offline conversion upload) |
| **Match rate target** | 50%+ (email + phone + address combined) | 50%+ |
| **Conversion type** | Online conversions tracked by Google tag | Offline conversions imported via API or upload |
| **Prerequisite** | Google tag or GTM firing on conversion page | Offline conversion tracking pipeline operational |

> 💡 **Use both when applicable.** EC (Web) improves online conversion accuracy. EC for Leads improves offline conversion matching. They serve different conversion types and do not conflict.

---

## Data requirements

### Required and optional fields

| **Field** | **Required** | **Format** | **Notes** |
|----------|-------------|-----------|----------|
| **Email address** | Yes (mandatory) | Lowercase, trimmed whitespace | Most important identifier: always send this |
| **Phone number** | Optional (recommended) | E.164 format (+1234567890) | Increases match rate when combined with email |
| **First name** | Optional | Lowercase | Minimal impact on match rate beyond email + phone |
| **Last name** | Optional | Lowercase | Minimal impact on match rate beyond email + phone |
| **Street address** | Optional | Lowercase | Rarely needed |
| **City** | Optional | Lowercase | Rarely needed |
| **Region/state** | Optional | Lowercase | Rarely needed |
| **Postal code** | Optional | No formatting | Rarely needed |
| **Country** | Optional | ISO 3166-1 alpha-2 | Rarely needed |

> 💡 **Email + phone number is sufficient for 95% of cases:** Sending additional fields (name, address) provides marginal match rate improvement. Focus on getting email and phone number correct.

### Hashing

| **Method** | **Hashing behavior** |
|-----------|---------------------|
| **GTM** | Automatic: GTM hashes user data with SHA-256 before sending to Google |
| **gtag** | Automatic: gtag.js hashes user data with SHA-256 before sending |
| **API** | Manual: you must pre-hash with SHA-256, lowercase and trim whitespace before hashing |

User data never leaves your site in plain text. All data is hashed with SHA-256 (one-way, irreversible) before transmission. Google matches hashes against its own hashed user database.

---

## GTM setup

### Prerequisites

- GTM web container installed on all pages
- Google Ads conversion tracking tag already firing on conversion events
- Data layer exposes user-provided data (email, phone) on the conversion event

### Setup steps overview

1. **Create data layer variables** in GTM for the user data fields (email, phone). The variable paths depend on your data layer structure (e.g., `fields.email.value` or `userProvidedData.email`).

2. **Create a User-Provided Data variable** in GTM: Variables > User-Defined > New > select "User-Provided Data" type. Map email and phone fields to the data layer variables created in step 1. Use Manual Configuration for reliable results.

3. **Link to conversion tracking tag**: Edit your Google Ads Conversion Tracking tag > check "Include user-provided data from your website" > select the User-Provided Data variable.

4. **Enable in Google Ads UI**: Goals > Conversions > Settings > Enhanced Conversions > Turn on > Select "Google Tag Manager" as method.

5. **Debug**: Use GTM Preview Mode to verify user data variables populate correctly and appear in the conversion tag's enhanced conversions payload.

---

## gtag setup

### Prerequisites

- Global site tag (gtag.js) installed on all pages
- Conversion event snippet already firing on conversion pages
- User data (email, phone) accessible as JavaScript variables on the conversion page

### Setup steps overview

1. **Add allow_enhanced_conversions to the global site tag**: Insert `'allow_enhanced_conversions': true` in your gtag config call.

2. **Add enhanced_conversions snippet below the conversion event**: Place a `gtag('set', 'user_data', {...})` call below your conversion event snippet, populating email and phone from page variables.

3. **Enable in Google Ads UI**: Goals > Conversions > Settings > Enhanced Conversions > Turn on > Select "Google tag" as method.

4. **Validate**: Check conversion action diagnostics for enhanced conversions status (may take up to 48 hours).

---

## Google Ads UI configuration

Regardless of implementation method (GTM, gtag, or API), enable these settings in Google Ads:

| **Setting** | **Location** | **Action** |
|-----------|------------|----------|
| **Customer Data Terms** | Goals > Conversions > Settings | Review and accept the customer data processing terms |
| **Enhanced Conversions** | Goals > Conversions > Settings > Enhanced Conversions | Turn on, select implementation method (GTM, Google tag, or API) |
| **Enhanced Conversions for Leads** | Goals > Conversions > Settings > Enhanced Conversions for Leads | Turn on if using EC4L for lead gen/SaaS (separate from standard EC) |

---

## Diagnostics and validation

### Where to check

Goals > Conversions > Summary > [Conversion Action] > Diagnostics

### Status indicators

| **Status** | **Meaning** | **Action** |
|-----------|------------|----------|
| Green checkmark | Enhanced Conversions active and receiving data | None: working correctly |
| "Waiting to receive data" | Setup complete but no data received yet | Wait up to 48 hours after implementation |
| Error message | Configuration issue detected | Read error details: common causes are wrong data format, missing fields, or incorrect variable mapping |

### Initial reporting delay

After enabling Enhanced Conversions, allow 48 hours before checking diagnostics. The system needs time to process the first batch of hashed data and attempt matches.

### Uplift monitoring

Compare conversion volumes before and after EC implementation:

| **Campaign type** | **Typical EC uplift** |
|-------------------|----------------------|
| Search (bottom funnel) | 5-10% |
| Display | 10-20% |
| Video / YouTube | 15-25% |
| Demand Gen | 10-20% |

---

## Enhanced Conversions for Leads (EC4L)

### What EC4L is

A variant of Enhanced Conversions designed specifically for lead gen and SaaS businesses that use Offline Conversion Tracking (OCT). EC4L uses the same hashed first-party data to match offline conversions (qualified leads, closed deals) back to the original ad click.

### How EC4L differs from standard EC

| **Aspect** | **Standard EC** | **EC4L** |
|-----------|----------------|---------|
| **Purpose** | Recover missed online conversions | Match offline conversions to online ad clicks |
| **Conversion type** | Website conversions (purchase, signup) | Imported offline conversions (qualified lead, closed deal) |
| **When data is sent** | At the moment of online conversion | At the moment of form submission (online), then again at offline conversion import |
| **Matching mechanism** | Hashed data matched to Google user who saw/clicked ad | Hashed data from form submission matched to hashed data in offline import |
| **Verticals** | All (ecommerce, lead gen, SaaS) | Lead gen and SaaS only |

### How EC4L works

1. **User clicks ad and submits a lead form** on your website
2. **At form submission**: conversion tag fires with hashed user data (email, phone) via Enhanced Conversions. Google now knows which Google user submitted the form.
3. **Lead information stored in CRM** (email, phone, and other contact details are already captured)
4. **Lead converts offline** (becomes qualified lead or closed deal weeks later)
5. **Offline conversion uploaded to Google Ads** with the same email/phone as identifier
6. **Google matches** the hashed email from the offline import to the hashed email from the original form submission, attributing the offline conversion to the original ad click

### EC4L as OCT method

EC4L can serve as:

- **Primary OCT method**: When you cannot capture Google Click IDs (GCLID), use EC4L as your sole offline conversion tracking method
- **Backup OCT method** (recommended): Use GCLID as primary, EC4L as fallback for cases where GCLID was not captured. This hybrid approach maximizes match rates.

> ↪️ **See [Offline Conversion Tracking Reference](../references/Offline Conversion Tracking Reference.md)** for the full hybrid approach and OCT import workflows.

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Not enabling Enhanced Conversions in Google Ads Settings | Tags send data but Google Ads ignores it | Enable Enhanced Conversions under Goals > Conversions > Settings |
| Not accepting Customer Data Terms | Enhanced Conversions cannot activate without legal acceptance | Review and accept terms in conversion settings |
| Using auto-detect instead of manual data layer configuration | Auto-detect is unreliable and may pick up wrong fields | Use manual configuration with explicit data layer variable mapping |
| Sending unhashed data via API | Data rejected or privacy violation | Pre-hash all user data with SHA-256 before API submission |
| Email not lowercase/trimmed before hashing | Hash mismatch: Google cannot match the conversion | Normalize email (lowercase, trim whitespace) before hashing |
| Expecting immediate results | EC reporting takes time to populate | Allow 48 hours for diagnostics, 1-2 weeks for meaningful uplift data |
| Implementing EC without fixing base GACT setup | EC supplements existing tracking but cannot fix broken fundamentals | Ensure GACT pixel fires correctly first, then add EC |
| Not sending user data at form submission (EC4L) | Google has no baseline hash to match against when offline conversion is imported | Fire user-provided data tag at the moment of form submission, not just at import |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | EC fits into the "Measure More" stage of the maturity framework |
| [Conversion Pixel Reference](../references/Conversion Pixel Reference.md) | EC builds on top of a working GACT pixel implementation |
| [Offline Conversion Tracking Reference](../references/Offline Conversion Tracking Reference.md) | EC4L is a key method for offline conversion attribution |
| [Server-Side Tagging Reference](../references/Server-Side Tagging Reference.md) | SST and EC are complementary data recovery techniques |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | EC applies to conversion actions configured as primary or secondary |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | EC helps accounts reach volume thresholds by recovering lost conversions |

---

## Version details

- **Version:** 2.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
