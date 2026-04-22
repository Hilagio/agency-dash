# SOP – Set Up Offline Conversion Tracking
Created: 2026-02-04

SOP_ID: SOP_24
Status: Done
Category: Measurement
Primary Outcome: Offline conversions importing from CRM to Google Ads, enabling value-based bidding on lead quality
Secondary Outcomes: Attribution beyond form submission, Smart Bidding optimization on real business outcomes
Agent_Executable: No
Human_Approval_Required: No
Domain: Measurement
Pillar: 5
Applies_To: Lead Gen, SaaS

### Purpose

This SOP sets up Offline Conversion Tracking (OCT) to import CRM conversions (qualified leads, closed deals) into Google Ads, enabling optimization on real business outcomes instead of just form submissions.

> ❓ **The big question:** Is Smart Bidding optimizing for actual business outcomes (qualified leads, closed deals) or just top-of-funnel form submissions?

For Lead Gen and SaaS businesses, the form submission is the beginning, not the end. OCT closes the loop by importing downstream conversion events with their real value, giving Smart Bidding the signals it needs to find high-quality leads instead of just volume.

---

### What this SOP is NOT

This SOP does **not:**

- Apply to ecommerce (ecommerce tracks onsite purchases via GACT)
- Set up basic GACT (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Cover Conversion Adjustments for restating values after import (separate SOP)
- Teach the strategic rationale for OCT (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))
- Configure Enhanced Conversions for web (See: [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md))

### When to run this SOP

Run this SOP when:

- Running Lead Gen or SaaS campaigns where the real conversion happens offline (qualified lead, closed deal)
- Smart Bidding is optimizing on form submissions but lead quality is inconsistent
- You need to feed downstream funnel data (MQL, SQL, closed deal) into Google Ads
- Moving toward value-based bidding on actual deal values

---

### Before you start

#### Required inputs

- Working GACT setup with a form submission or signup conversion action (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- CRM or lead management system (HubSpot, Salesforce, Pipedrive, etc.)
- GTM container access (for EC4L method)
- Defined conversion funnel stages with values (or ability to calculate average values)
- Developer access (for hidden field or data layer configuration)

#### Reference documents (have open)

| Document | Used for |
| --- | --- |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Import conversion action settings |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Where OCT fits in the measurement stack |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum volumes for Smart Bidding on imported conversions |

---

### Decision gate: Import method

Before proceeding, determine your OCT method:

| If... | Then... | Go to |
| --- | --- | --- |
| CRM captures GCLID (Google Click ID) | Use GCLID import method | Phase 2A |
| CRM captures email/phone but not GCLID | Use Enhanced Conversions for Leads (EC4L) | Phase 2B |
| Both GCLID and email are available | Use Hybrid method (recommended) | Phase 2A + 2B |
| High-volume or real-time import needed | Use Google Ads API | Consult API documentation |

> 💡 **The Hybrid method (GCLID + EC4L) provides the highest match rate:** When GCLID is available, Google uses it for direct attribution. When GCLID is missing (cross-device, non-click conversions), EC4L fills the gap using hashed email matching.

**Decision flow:**

```
Can you capture GCLID in forms?
|
+-- YES --> Can you also capture email?
|           |
|           +-- YES --> Hybrid method (GCLID + EC4L)
|           |
|           +-- NO --> GCLID-only method
|
+-- NO --> Can you capture email/phone?
            |
            +-- YES --> EC4L method
            |
            +-- NO --> STOP: you need at least one identifier
```

---

### Conversion funnel mapping

Before creating conversion actions, map your offline conversion funnel and assign values.

**Lead Gen example:**

| Stage | Conversion name | Typical value calculation | Count |
| --- | --- | --- | --- |
| Lead (form submit) | Already tracked via GACT | N/A (web conversion) | One |
| MQL (marketing qualified) | OCT – MQL | Avg. deal value x MQL-to-close rate | One |
| SQL (sales qualified) | OCT – SQL | Avg. deal value x SQL-to-close rate | One |
| Proposal sent | OCT – Proposal | Avg. deal value x proposal-to-close rate | One |
| Closed deal | OCT – Closed Won | Actual deal value | One |

**SaaS example:**

| Stage | Conversion name | Typical value calculation | Count |
| --- | --- | --- | --- |
| Signup | Already tracked via GACT | N/A (web conversion) | One |
| Trial start | OCT – Trial Start | Avg. LTV x trial-to-paid rate | One |
| Feature activation | OCT – Activation | Avg. LTV x activation-to-paid rate | One |
| Trial-to-paid | OCT – Payment Success | Actual payment value or forecasted LTV | One |

> ⚠️ **Start with your most important downstream conversion:** Do not try to import every funnel stage at once. Start with the conversion closest to revenue (closed deal or payment), make it work, then layer in additional stages.

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Create import conversion actions** | Define offline conversions in Google Ads | Import conversion actions ready for data |
| **Phase 2️⃣: Configure CRM data capture** | Set up GCLID and/or email capture in forms and CRM | CRM storing click IDs and/or hashed email per lead |
| **Phase 3️⃣: Set up import template** | Create upload spreadsheet or automation | Import pipeline ready to send data |
| **Phase 4️⃣: Schedule and validate** | Run first import and verify data flows | Offline conversions appearing in Google Ads |

---

## Phase 1️⃣: Create import conversion actions

### 1.1 Create offline conversion actions

For each stage in your funnel map:

1. Navigate to **Goals > Conversions > Summary**
2. Click **New conversion action**
3. Select **Import**
4. Select **Other data sources or CRMs > Track conversions from clicks**

### 1.2 Configure each conversion action

| Setting | Configuration |
| --- | --- |
| Goal category | Select the most specific: Qualified Lead, Converted Lead, or other |
| Conversion name | Use naming convention: `[Initials] – OCT – [Stage Name]` |
| Value | Select "Use different values for each conversion" |
| Count | Set to "One" (one lead can only qualify once per stage) |
| Click-through window | Match your sales cycle (30-90 days) |
| Include in Conversions | Set the stage you want Smart Bidding to optimize on as Primary |

### 1.3 Set primary and secondary

| Conversion action | Classification | Why |
| --- | --- | --- |
| Most important stage (closed deal or payment) | Primary | Smart Bidding optimizes on this |
| Intermediate stages (MQL, SQL) | Secondary | Reporting and analysis only |
| Web form submission (existing GACT) | Secondary (once OCT is stable) | Backup, traffic quality insights |

> ⚠️ **Do not switch your form submission to secondary until OCT is stable and importing reliably for at least 30 days:** Keep both as primary during the transition, then switch the web conversion to secondary once OCT data proves reliable.

---

## Phase 2A: Configure GCLID capture

### 2A.1 Add hidden fields to forms

Brief your developer to add hidden form fields that capture:

| Hidden field | Variable | Source |
| --- | --- | --- |
| GCLID | `gclid` | URL parameter appended by Google Ads |
| GBRAID | `gbraid` | Cross-domain click identifier |
| WBRAID | `wbraid` | Web-to-app click identifier |

The developer must:

1. Add hidden input fields to every lead capture form
2. Populate these fields from URL parameters (on page load or form submit)
3. Store the values with the lead record in the CRM

### 2A.2 Store GCLID in CRM

1. Create custom fields in your CRM for GCLID, GBRAID, and WBRAID
2. Map the hidden form fields to CRM fields in your form handler
3. Verify that GCLID populates on the lead record after a test submission from a Google Ads click

### 2A.3 Store consent state

If operating in EU/EEA:

1. Add a hidden field to capture the user's consent state at the time of form submission
2. Store this as a field in the CRM (`ad_user_data` and `ad_personalization` consent signals)
3. Include consent data in your upload template

### 2A.4 Verify GCLID capture

1. Click a Google Ads ad (or append `?gclid=test123` to your landing page URL)
2. Submit a test form
3. Check the CRM lead record: GCLID field should contain the test value
4. If empty: debug the hidden field JavaScript with your developer

---

## Phase 2B: Configure Enhanced Conversions for Leads (EC4L)

### 2B.1 Enable EC4L in Google Ads

1. Navigate to **Goals > Settings**
2. Find **Enhanced conversions for leads**
3. Click **Turn on**
4. Select your implementation method (Google Tag Manager recommended)
5. Accept the customer data terms

### 2B.2 Configure User-Provided Data event in GTM

1. In GTM, create a Data Layer Variable for the user's email address on the form submission page
2. Create a **User-Provided Data** variable:
   - Select **Manual configuration**
   - Map the email field to your data layer variable
3. Link this User-Provided Data variable to your existing web conversion tracking tag (the GACT tag for form submission)

### 2B.3 Verify EC4L data capture

1. Enter GTM Preview mode
2. Submit a test form
3. Verify the User-Provided Data variable captures the email
4. Verify the conversion tag includes the enhanced conversion data
5. Publish GTM container

---

## Phase 3️⃣: Set up import template

### 3.1 Create upload template

Create a Google Sheet or CSV with the required columns:

**GCLID method columns:**

| Column | Description | Example |
| --- | --- | --- |
| Google Click ID | GCLID from CRM | `CjwKCAjw...` |
| Conversion Name | Matches Google Ads action name exactly | `BM – OCT – Closed Won` |
| Conversion Time | Timestamp of the offline event | `2026-01-15 14:30:00` |
| Conversion Value | Revenue or calculated value | `5000` |
| Conversion Currency | ISO currency code | `EUR` |

**EC4L method columns:**

| Column | Description | Example |
| --- | --- | --- |
| Email | Hashed or plain-text email | `user@example.com` |
| Conversion Name | Matches Google Ads action name exactly | `BM – OCT – Closed Won` |
| Conversion Time | Timestamp of the offline event | `2026-01-15 14:30:00` |
| Conversion Value | Revenue or calculated value | `5000` |
| Conversion Currency | ISO currency code | `EUR` |

**Hybrid method:** Include both Google Click ID and Email columns. Google uses GCLID when available, falls back to email matching.

### 3.2 Set up automated imports

Manual uploads work for testing but do not scale. Set up automation:

| Tool | Method | Frequency |
| --- | --- | --- |
| Zapier / Make | Trigger on CRM stage change, upload to Google Ads | Real-time or daily |
| Google Ads API | Direct API integration from CRM | Real-time |
| Google Sheets scheduled upload | Google Ads UI scheduled import from Google Sheet | Daily |

**Zapier/Make example workflow:**

1. Trigger: CRM deal stage changes to "Closed Won"
2. Action: Format conversion data (GCLID, name, time, value, currency)
3. Action: Upload to Google Ads Offline Conversions

### 3.3 Configure Google Ads scheduled upload (simplest)

1. Navigate to **Goals > Conversions > Uploads**
2. Click **Schedule uploads**
3. Select **Google Sheets** as the source
4. Connect your Google Sheet
5. Set frequency to **Daily**
6. Map the columns to the required fields

---

## Phase 4️⃣: Schedule and validate

### 4.1 Run first manual upload

1. Export 5-10 real conversions from your CRM (with GCLID and/or email)
2. Format according to the upload template
3. Navigate to **Goals > Conversions > Uploads**
4. Click **Upload** and select your file
5. Review the upload preview for errors

### 4.2 Check upload results

| Status | Meaning | Action |
| --- | --- | --- |
| Uploaded successfully | Data accepted by Google Ads | Proceed to validation |
| Partial success | Some rows had errors | Fix errors in failed rows, re-upload |
| Failed | Format or data issues | Check column names, date format, conversion names match exactly |

### 4.3 Verify conversions in reports

1. Allow 24-48 hours for imported conversions to appear
2. Navigate to campaign reports
3. Segment by **Conversion action** to find your OCT actions
4. Compare imported conversions against CRM data for the same period

### 4.4 Enable automated schedule

Once manual uploads are verified:

1. Enable your Zapier/Make automation or Google Sheets scheduled upload
2. Monitor for 7 days to confirm automated uploads run successfully
3. Set up alerts for upload failures

### 4.5 Final checklist

- [ ] Import conversion actions created with correct goal categories
- [ ] GCLID and/or email captured and stored in CRM
- [ ] Upload template correctly formatted
- [ ] First manual upload completed successfully
- [ ] Conversions appear in Google Ads reports within 48 hours
- [ ] Automated import schedule active
- [ ] Primary/secondary classification set correctly

---

### Validation & definition of done

This SOP is complete when:

- [ ] At least one offline conversion action is created and set as primary
- [ ] GCLID and/or email capture is verified in CRM
- [ ] First successful import completed and visible in Google Ads
- [ ] Automated import schedule running reliably for 7+ days
- [ ] Conversion data aligns between CRM and Google Ads reports

---

### Exit → Entry bridge

Once OCT is live and importing:

| Timeframe | Action |
| --- | --- |
| Week 1-2 | Monitor import reliability, fix any failed uploads |
| Week 2-4 | Compare Smart Bidding performance on OCT vs. web conversions |
| Month 2 | Switch web form submission to secondary, OCT to sole primary |
| Ongoing | Implement Conversion Adjustments to restate lead values as they progress |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| GCLID not captured | Debug hidden field JavaScript with developer |
| Upload format errors | Verify column names match exactly, check date format |
| Low match rate (EC4L) | Verify email is sent correctly, check Enhanced Conversions diagnostics |
| Conversions not appearing | Check conversion window (click must be within window), verify conversion name matches exactly |

---

### FAQ

**Q: How often should I upload offline conversions?**

A: Daily is recommended. More frequent uploads give Smart Bidding faster feedback. If using Zapier/Make, real-time uploads on stage change are ideal.

**Q: What if my sales cycle exceeds 90 days?**

A: The maximum click-through conversion window is 90 days. If your sales cycle consistently exceeds this, consider importing an earlier funnel stage (MQL or SQL) that falls within the 90-day window as your primary conversion, with the closed deal as a secondary for reporting.

**Q: Should I import all funnel stages or just the final conversion?**

A: Start with the stage closest to revenue (closed deal or payment). Once stable, add intermediate stages as secondary conversions for reporting and traffic quality analysis. Do not make multiple OCT stages primary simultaneously: this double-counts conversions for Smart Bidding.

**Q: What value should I assign if I do not know the actual deal value yet?**

A: Use calculated proxy values based on historical data. Multiply your average deal value by the conversion rate from that stage to close. Example: if average deal is 10,000 EUR and SQL-to-close rate is 25%, assign SQL a value of 2,500 EUR.

**Q: Can I use OCT alongside the ProfitMetrics Conversion Booster?**

A: The ProfitMetrics Conversion Booster is designed for ecommerce. For Lead Gen and SaaS, OCT is the appropriate solution for importing offline conversion data. These serve different verticals and do not conflict.

---

### Quick reference: Support library

| Document | Type | Used in |
| --- | --- | --- |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Reference | Phase 1 |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Mental Model | Context |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Reference | Phase 4 |

---

### Related SOPs

| SOP | Relationship |
| --- | --- |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Upstream (GACT must exist first) |
| [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md) | Related (different feature, web EC vs. EC4L) |
| [SOP – Implement Server-Side Tagging](../sops/SOP – Implement Server-Side Tagging.md) | Parallel (can route OCT data via server) |

---

### Common failures

| Failure | Why it happens | How to avoid |
| --- | --- | --- |
| GCLID not stored in CRM | Hidden field script broken or form handler not mapped | Test with ?gclid=test123, verify CRM record |
| Conversion name mismatch | Upload template name does not match Google Ads exactly | Copy-paste the conversion action name, do not retype |
| Date format rejected | Wrong timestamp format in upload file | Use format: YYYY-MM-DD HH:MM:SS with timezone |
| Conversions outside attribution window | Upload happened more than 90 days after the click | Import conversions within the click-through window |
| Multiple OCT stages set as primary | All funnel stages marked primary | Only one stage should be primary for Smart Bidding |
| Switched web conversion to secondary too early | OCT not yet stable | Keep web conversion primary for 30+ days during transition |
| Low EC4L match rate | Email formatting issues or low Google account coverage | Verify email is plain text, no whitespace, consider Hybrid method |

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
