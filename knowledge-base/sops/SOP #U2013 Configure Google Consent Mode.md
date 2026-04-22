# SOP – Configure Google Consent Mode
Created: 2026-02-04

Agent_Executable: No
Category: Measurement
Human_Approval_Required: No
Primary Outcome: Google Consent Mode V2 active with CMP integration and conversion modeling enabled
SOP_ID: SOP_25
Status: Done
Domain: Measurement
Pillar: 5

### Purpose

This SOP walks you through setting up Google Consent Mode V2 with a Consent Management Platform, integrating it through Google Tag Manager, and validating that consent signals control tag firing correctly.

> ❓ **The big question:** Is your site collecting consent signals correctly and feeding them to Google for conversion modeling?

---

### What this SOP is NOT

This SOP does **not:**

- Explain the legal requirements of GDPR or ePrivacy (consult your legal team)
- Cover server-side tagging or advanced consent architectures
- Configure conversion actions themselves (See: [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md))

### When to run this SOP

Run this SOP when:

- Setting up a new Google Ads account that serves EU/EEA users
- Migrating from a basic cookie banner to a compliant CMP
- Google Ads diagnostics show consent mode is not detected
- Preparing for Google's consent mode enforcement requirements

---

### Before you start

#### Required inputs

- Google Tag Manager container with edit access
- Google Ads and GA4 tags already deployed via GTM
- CMP account credentials (e.g., Cookiebot, CookieYes, OneTrust)
- Domain Group ID from your CMP provider

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| CMP provider documentation | Template installation and domain group ID |
| Google Tag Manager workspace | Tag and trigger configuration |
| Google Ads account (Diagnostics) | Consent mode verification |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Set Up CMP Account** | Create and configure the consent platform | Active CMP account with consent categories defined |
| **Phase 2️⃣: Install CMP in GTM** | Deploy the CMP template and consent initialization | CMP banner live, firing consent signals |
| **Phase 3️⃣: Configure Consent Checks** | Ensure all tags respect consent state | Tags fire only when appropriate consent is granted |
| **Phase 4️⃣: Validate** | Debug consent flows and verify modeling | Confirmed consent mode active in Google Ads diagnostics |

---

## Phase 1️⃣: Set Up CMP Account

### 1.1 Create your CMP account

1. Go to your chosen CMP provider (e.g., Cookiebot at cookiebot.com)
2. Create an account and add your domain
3. Select Google Consent Mode V2 as your integration type
4. Configure consent categories: ad_storage, analytics_storage, ad_personalization, ad_user_data

### 1.2 Configure consent defaults

Set default consent states for your regions:

| Region | Default consent state | Reason |
|--------|----------------------|--------|
| EEA/UK | Denied (all categories) | GDPR requires opt-in |
| US | Granted (all categories) | No federal opt-in requirement |
| Rest of world | Denied or Granted | Based on local regulation |

### 1.3 Retrieve your Domain Group ID

1. In your CMP dashboard, locate the integration settings
2. Copy the Domain Group ID (also called CBID, Serial Number, or similar depending on provider)
3. Store this ID for Phase 2

---

## Phase 2️⃣: Install CMP in GTM

### 2.1 Add the CMP template from the GTM Gallery

1. Open Google Tag Manager
2. Go to Templates > Search Gallery
3. Search for your CMP provider (e.g., "Cookiebot CMP")
4. Add the template to your workspace

### 2.2 Create the CMP tag

1. Go to Tags > New
2. Select the CMP template you just added
3. Enter your Domain Group ID
4. Enable Google Consent Mode V2 in the tag settings
5. Set the default consent states to match Phase 1.2

### 2.3 Set the trigger to Consent Initialization

1. Under Triggering, select **Consent Initialization - All Pages**
2. This trigger fires before any other tags, ensuring consent state is set first

> ⚠️ **Consent Initialization, not All Pages:** The CMP tag must use the Consent Initialization trigger. Using "All Pages" causes tags to fire before consent state is set, which defeats the purpose.

### 2.4 Publish the workspace

1. Submit and publish the GTM container
2. Verify the consent banner appears on your site

---

## Phase 3️⃣: Configure Consent Checks

### 3.1 Google tags (built-in consent checks)

Google Ads tags, GA4 tags, and Floodlight tags have built-in consent checks. They automatically:

- Read the consent state from Consent Mode
- Adjust behavior based on granted/denied status
- Send cookieless pings when consent is denied (for conversion modeling)

No additional configuration is needed for these tags.

### 3.2 Non-Google tags (manual consent configuration)

For any non-Google tag (Facebook Pixel, LinkedIn Insight, etc.):

1. Go to Tags > select the non-Google tag
2. Open Advanced Settings > Consent Settings
3. Check "Require additional consent for tag to fire"
4. Add `ad_storage` as a required consent type

### 3.3 Create a consent update trigger (alternative method)

If your non-Google tags need a dedicated trigger:

1. Go to Triggers > New
2. Select Custom Event
3. Event name: `cookie_consent_update`
4. Add a condition: `ad_storage` equals `granted`
5. Assign this trigger to non-Google marketing tags

> 💡 **Google tags handle consent natively:** Only configure manual consent checks for third-party (non-Google) tags. Adding manual checks to Google tags creates unnecessary complexity.

---

## Phase 4️⃣: Validate

### 4.1 Debug consent flows in GTM

1. Open GTM Preview mode
2. Navigate to your site in the debug browser

**Test 1: Deny all**

1. Click "Deny All" or "Reject" on the consent banner
2. In GTM debug panel, verify:
   - Consent state shows `ad_storage: denied`, `analytics_storage: denied`
   - Google tags fire but send cookieless pings (not full tracking)
   - Non-Google marketing tags do NOT fire

**Test 2: Accept all**

1. Clear cookies and reload the page
2. Click "Accept All" on the consent banner
3. In GTM debug panel, verify:
   - Consent state shows `ad_storage: granted`, `analytics_storage: granted`
   - All tags fire normally with full data collection

**Test 3: Partial consent**

1. Clear cookies and reload the page
2. Accept analytics but deny marketing (if your CMP supports granular choice)
3. Verify tags fire according to their consent requirements

### 4.2 Check Google Ads diagnostics

1. Open Google Ads
2. Go to Goals > Conversions > Diagnostics
3. Look for the Consent Mode status indicator
4. Confirm it shows "Consent mode detected" for your conversion actions

### 4.3 Verify conversion modeling eligibility

Conversion modeling requires:

| Requirement | Minimum threshold |
|-------------|-------------------|
| Consent mode active | At least 7 days |
| Consented conversions per day | 100+ per conversion action (Search), 1000+ (Display/Video) |

> ⚠️ **Modeling is not instant:** Google needs sufficient consented conversion data to build accurate models. Allow 2-4 weeks after setup before evaluating modeled conversion data.

### 4.4 Final checklist

- [ ] Consent banner appears on all pages
- [ ] CMP tag fires on Consent Initialization trigger
- [ ] Deny all: Google tags send cookieless pings, non-Google tags blocked
- [ ] Accept all: all tags fire normally
- [ ] Google Ads diagnostics shows consent mode detected
- [ ] No GTM errors in Preview mode

---

### Validation and definition of done

This SOP is complete when:

- [ ] CMP is installed and the consent banner appears on all pages
- [ ] Consent Mode V2 signals are active in GTM
- [ ] Google tags send cookieless pings when consent is denied
- [ ] Non-Google tags are blocked when consent is denied
- [ ] Google Ads diagnostics confirms consent mode is detected
- [ ] Debug tests pass for deny all, accept all, and partial consent scenarios

---

### Exit → Entry bridge

Once consent mode is active:

| Timeframe | Action |
|-----------|--------|
| Immediately | Proceed to conversion tracking setup or other measurement SOPs |
| After 7 days | Check Google Ads diagnostics for modeling eligibility |
| After 30 days | Review modeled conversion data accuracy |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Tags still fire when consent is denied | Re-check Phase 3 consent configuration |
| Consent mode not detected in Google Ads | Verify CMP template is on Consent Initialization trigger |
| Modeled conversions not appearing | Check minimum volume thresholds (Phase 4.3) |

---

### FAQ

**Q: Which CMP should I use?**

A: Any Google-certified CMP works. Cookiebot, CookieYes, and OneTrust are common choices. Check Google's CMP partner list for certified options.

**Q: Do I need consent mode for US-only campaigns?**

A: Not legally required today, but recommended. Consent mode future-proofs your setup and improves data quality as privacy regulations evolve.

**Q: What happens to conversions when users deny consent?**

A: Google uses cookieless pings plus machine learning to model conversions from non-consenting users. This preserves approximate conversion data for Smart Bidding.

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md) | Downstream: cart data requires consent mode to be active |
| [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md) | Parallel: deduplication setup alongside consent mode |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| CMP tag on "All Pages" instead of "Consent Initialization" | Default trigger selection in GTM | Always select Consent Initialization trigger |
| Non-Google tags firing without consent | Missing manual consent checks | Configure consent requirements for every non-Google tag |
| Consent mode not detected in Google Ads | CMP not sending consent signals in correct format | Use a Google-certified CMP template from the GTM Gallery |
| Conversion modeling not activating | Insufficient consented conversion volume | Ensure 100+ daily consented conversions per action |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
