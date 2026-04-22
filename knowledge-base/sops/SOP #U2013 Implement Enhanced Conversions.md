# SOP – Implement Enhanced Conversions
Created: 2026-02-04

SOP_ID: SOP_23
Status: Done
Category: Measurement
Primary Outcome: Enhanced Conversions active and recovering previously unattributed conversions
Secondary Outcomes: Improved attribution accuracy, better Smart Bidding performance for upper and mid funnel campaigns
Agent_Executable: No
Human_Approval_Required: No
Domain: Measurement
Pillar: 5

### Purpose

This SOP implements Enhanced Conversions to send hashed first-party data (email, phone number) alongside conversion tags for improved attribution.

> ❓ **The big question:** Are you recovering the conversions that Enhanced Conversions can attribute by matching hashed user data to Google accounts?

Enhanced Conversions recovers conversions that otherwise go unattributed, particularly from mid and upper funnel campaigns like Display, YouTube, and Demand Gen. Uplifts of 15-25% in attributed conversions are common after implementation.

---

### What this SOP is NOT

This SOP does **not:**

- Set up basic GACT (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Configure Enhanced Conversions for Leads / EC4L (See: [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md))
- Cover server-side Enhanced Conversions (See: [SOP – Implement Server-Side Tagging](../sops/SOP – Implement Server-Side Tagging.md))
- Replace existing conversion tracking (Enhanced Conversions supplements GACT, it does not replace it)

### When to run this SOP

Run this SOP when:

- GACT is live and conversion actions are recording
- You need better attribution for upper and mid funnel campaigns (Display, Video, Demand Gen)
- Conversion discrepancies exist between Google Ads and backend data
- You want to improve Smart Bidding data quality

---

### Before you start

#### Required inputs

- Working GACT setup with conversion actions recording (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- GTM container access (or website code access for gtag method)
- Developer access (to make first-party data accessible in the data layer or on conversion pages)
- Knowledge of where user-provided data (email, phone) is available on conversion pages

#### Reference documents (have open)

| Document | Used for |
| --- | --- |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action configuration |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Where Enhanced Conversions fits in the measurement stack |

---

### Decision gate: Implementation method

| If... | Then... | Go to |
| --- | --- | --- |
| Using GTM for conversion tracking | GTM method (recommended) | Phase 2A |
| Using hardcoded gtag for conversion tracking | gtag method | Phase 2B |
| Using API or third-party tool (e.g., ProfitMetrics) | Google Ads API method | Consult tool documentation |

> ⚠️ **GTM is the recommended method:** It provides the most flexibility and control. The gtag method requires developer involvement for every change. The API method is for advanced integrations only.

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Prepare data layer** | Make first-party data accessible for tag consumption | Data layer variables available on conversion events |
| **Phase 2️⃣: Configure tags** | Set up Enhanced Conversions in GTM or gtag | Tags sending hashed user data with conversions |
| **Phase 3️⃣: Enable in Google Ads** | Turn on Enhanced Conversions in account settings | Feature enabled at account level |
| **Phase 4️⃣: Validate** | Verify data flows and attribution improves | Green check in conversion action diagnostics |

---

## Phase 1️⃣: Prepare data layer (developer work)

### 1.1 Identify available user data

Determine which first-party data is accessible on your conversion pages:

| Data type | Priority | Where to find it |
| --- | --- | --- |
| Email address | Required | Form submission data, order confirmation, account creation |
| Phone number | Recommended | Form fields, checkout data, account profile |
| First name, last name | Optional | Checkout data, form fields |
| Address | Optional | Checkout / shipping data |

> 💡 **Email address is the most important variable:** Combined with phone number, Google has sufficient data to match conversions. You do not need to send address or name data in most cases.

### 1.2 Brief the developer

Send the developer brief containing:

1. **Which pages/events** need user data in the data layer (e.g., purchase event on checkout success page, form_submit event on thank you page)
2. **Which data layer event** already exists (if one is in place, enhance it with user data)
3. **Which variables to include:** email (required), phone_number (recommended)
4. **Data layer format:** The developer must push the user-provided data within the existing conversion event or as a separate data layer push before the conversion tag fires

### 1.3 Verify data layer output

1. Open GTM Preview mode
2. Navigate to the conversion page and trigger a test conversion
3. Click on the conversion event in the GTM debugger
4. Navigate to **Data Layer** and verify:

| Check | Expected result |
| --- | --- |
| Email variable present | Shows hashed or plain-text email value |
| Phone variable present | Shows phone number value (if included) |
| Event fires before conversion tag | Data is available when the tag needs it |

---

## Phase 2A: Configure in GTM (recommended)

### 2A.1 Create data layer variables

For each user data field, create a Data Layer Variable in GTM:

1. Navigate to **Variables > User-Defined Variables > New**
2. Select **Data Layer Variable**
3. Set the variable name to match your data layer key (e.g., `user_email`, `fields.email.value`)
4. Name it descriptively: `dlv – User Email`, `dlv – User Phone`

### 2A.2 Create User-Provided Data variable

1. Navigate to **Variables > User-Defined Variables > New**
2. Select **User-Provided Data** variable type
3. Click **Edit** on the variable configuration
4. Select **Manual configuration**
5. Map the fields:

| Field | Value |
| --- | --- |
| Email | Select your `dlv – User Email` variable |
| Phone | Select your `dlv – User Phone` variable |

6. Save the variable with name: `upd – User Provided Data`

### 2A.3 Link to conversion tracking tags

For each Google Ads Conversion Tracking tag:

1. Open the tag configuration
2. Scroll to **Include user-provided data from your website**
3. Select your `upd – User Provided Data` variable
4. Save the tag

### 2A.4 Debug the setup

1. Enter GTM Preview mode
2. Trigger a test conversion
3. Click on the conversion event in the debugger
4. Open the Google Ads Conversion Tracking tag
5. Verify the Enhanced Conversions values appear in the tag details (email and phone number populated)
6. Publish the GTM container

---

## Phase 2B: Configure with gtag (alternative)

### 2B.1 Add enhanced_conversions snippet

Below your existing conversion event snippet, add the user-provided data snippet. The snippet sends the email and phone number variables alongside the conversion event.

Provide the developer with:

1. The snippet template for enhanced_conversions data
2. The variable names for email and phone that match their implementation
3. Instruction to place the snippet below the conversion event on every conversion page

### 2B.2 Update Google Tag

Add `allow_enhanced_conversions: true` to your Google Tag (gtag.js) configuration on all pages where conversion snippets fire.

### 2B.3 Developer handoff

Send the developer:

- The enhanced conversions snippet template
- Variable mapping for email and phone
- Instructions for which pages need the update
- Testing instructions (how to verify in Tag Assistant)

---

## Phase 3️⃣: Enable in Google Ads

### 3.1 Turn on Enhanced Conversions

1. Navigate to **Goals > Settings** (or **Measurement > Conversions > Settings**)
2. Find **Enhanced conversions**
3. Click **Turn on**
4. Select your implementation method:

| Method | Select |
| --- | --- |
| GTM implementation | Google Tag Manager |
| gtag implementation | Google tag |

5. Save changes

### 3.2 Verify account-level setting

1. Return to **Goals > Settings**
2. Confirm Enhanced Conversions shows as **On**
3. Confirm the correct implementation method is selected

---

## Phase 4️⃣: Validate

### 4.1 Check conversion action diagnostics

1. Navigate to **Goals > Conversions > Summary**
2. Click on a conversion action that has Enhanced Conversions configured
3. Click **Diagnostics**
4. Check the Enhanced Conversions status:

| Status | Meaning | Action |
| --- | --- | --- |
| Green check | Working correctly | None needed |
| Waiting for data | Recently implemented | Wait 48-72 hours |
| Error / red indicator | Configuration issue | Check error message, debug setup |

### 4.2 Wait for data

Allow 48-72 hours for Enhanced Conversions to start recording. Google needs time to match hashed user data against its account database.

### 4.3 Monitor uplift

After 7-14 days, compare pre-implementation and post-implementation conversion volumes:

| Metric | Before EC | After EC | Uplift |
| --- | --- | --- | --- |
| Total conversions | [Record] | [Record] | [Calculate %] |
| Upper funnel conversions | [Record] | [Record] | [Calculate %] |

> 💡 **Expect the biggest uplift in upper and mid funnel campaign types:** Display, YouTube, and Demand Gen campaigns benefit most because Enhanced Conversions closes the attribution loop for users who viewed (but did not click) an ad and later converted.

### 4.4 Final checklist

- [ ] Data layer pushes email (and optionally phone) on conversion events
- [ ] GTM variables correctly map to data layer keys
- [ ] User-Provided Data variable linked to all conversion tracking tags
- [ ] Enhanced Conversions enabled in Google Ads account settings
- [ ] Diagnostics show green check on conversion actions
- [ ] Uplift observed within 14 days

---

### Validation & definition of done

This SOP is complete when:

- [ ] Enhanced Conversions enabled in Google Ads
- [ ] All conversion tracking tags send user-provided data
- [ ] Diagnostics show green check mark (or "recording data" status)
- [ ] GTM container published with Enhanced Conversions configuration
- [ ] 48-72 hour waiting period passed with data recording

---

### Exit → Entry bridge

Once Enhanced Conversions is live:

| Timeframe | Action |
| --- | --- |
| 48-72 hours | Verify diagnostics show green check |
| Week 1 | Monitor conversion volume uplift |
| Week 2 | Compare upper funnel campaign attribution |
| If Lead Gen/SaaS | Set up Enhanced Conversions for Leads (EC4L) via [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| Diagnostics show error | Check data layer variable mapping, verify email format |
| No uplift after 14 days | Verify data is actually being sent (re-debug in GTM Preview) |
| Email format rejected | Ensure email is plain text (Google hashes automatically), no whitespace |

---

### FAQ

**Q: Does Google see the actual email addresses?**

A: No. Enhanced Conversions hashes the user data (SHA-256) before sending it to Google. Google matches the hashed data against its own hashed user database. No plain-text personal data is stored by Google from Enhanced Conversions.

**Q: Do I need phone number, or is email enough?**

A: Email alone is sufficient for most implementations. Adding phone number increases match rates but is optional. Do not delay implementation waiting for phone number access.

**Q: What uplift should I expect?**

A: Uplifts vary by campaign type and audience. Expect 15-25% more attributed conversions for upper funnel campaigns (Display, Video, Demand Gen). Bottom funnel Search campaigns see smaller uplifts (5-10%) since click-based attribution already captures most conversions.

**Q: Is Enhanced Conversions the same as Enhanced Conversions for Leads (EC4L)?**

A: No. Enhanced Conversions improves web conversion attribution by matching user data at the point of conversion. EC4L is part of Offline Conversion Tracking and matches hashed data at the point of lead capture, then imports downstream conversions (qualified leads, closed deals). EC4L is covered in [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md).

---

### Quick reference: Support library

| Document | Type | Used in |
| --- | --- | --- |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Reference | Phase 1, Phase 3 |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Mental Model | Context |

---

### Related SOPs

| SOP | Relationship |
| --- | --- |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Upstream (GACT must exist first) |
| [SOP – Implement Server-Side Tagging](../sops/SOP – Implement Server-Side Tagging.md) | Parallel (can also send EC data via server) |
| [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) | Related (EC4L is a different feature) |

---

### Common failures

| Failure | Why it happens | How to avoid |
| --- | --- | --- |
| Email variable empty | Data layer not configured on conversion page | Verify with developer that data pushes before tag fires |
| Wrong variable hierarchy | Nested data layer structure (e.g., fields.email.value) | Use GTM debugger to inspect exact data layer structure |
| Diagnostics stay in "waiting" | Low conversion volume | Allow up to 72 hours, ensure sufficient conversion volume |
| No uplift observed | Implementation only on bottom funnel | Check upper funnel campaigns separately for uplift |
| Hash errors | Manual hashing applied before sending | Do not pre-hash: Google hashes automatically via GTM and gtag |
| Wrong implementation method selected in Google Ads | Selected GTM but using gtag (or vice versa) | Match the setting to your actual implementation |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
