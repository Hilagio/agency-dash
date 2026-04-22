# SOP – Set Up Google Ads Conversion Tracking
Created: 2026-02-04

SOP_ID: SOP_21
Status: Done
Category: Measurement
Primary Outcome: Fully configured Google Ads conversion tracking pixel firing on all conversion events
Secondary Outcomes: Accurate conversion data for Smart Bidding, foundation for all enhancement features
Agent_Executable: No
Human_Approval_Required: No
Domain: Measurement
Pillar: 5

### Purpose

This SOP sets up Google Ads Conversion Tracking (GACT) from scratch using Google Tag Manager (primary method) or gtag (alternative method).

> ❓ **The big question:** Is your Google Ads account receiving accurate, deduplicated conversion data from every meaningful conversion event on your website?

Conversion tracking is the absolute foundation of Google Ads success. Better data input equals better output: Smart Bidding, targeting, and machine learning products all depend on the quality of your conversion signals.

---

### What this SOP is NOT

This SOP does **not:**

- Cover server-side tagging implementation (See: [SOP – Implement Server-Side Tagging](../sops/SOP – Implement Server-Side Tagging.md))
- Set up Enhanced Conversions for additional attribution (See: [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md))
- Configure offline conversion imports from CRM (See: [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md))
- Teach conversion action configuration decisions (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Cover Consent Mode setup (separate SOP)

### When to run this SOP

Run this SOP when:

- Setting up a new Google Ads account from scratch
- Migrating from GA4 imported goals to native GACT
- Rebuilding tracking after a website migration
- Auditing reveals missing or broken conversion tracking

---

### Before you start

#### Required inputs

- Google Ads account with admin access
- GTM container access (or website code access for gtag method)
- List of conversion events to track (macro and micro)
- Website access for testing (ability to complete a test conversion)
- Developer access (for data layer configuration if needed)

#### Reference documents (have open)

| Document | Used for |
| --- | --- |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Goal categories, counting methods, value settings |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Understanding which layer GACT covers |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum volume requirements for Smart Bidding |

---

### Decision gate: Implementation method

Before proceeding, determine your tracking method:

| If... | Then... | Additional setup |
| --- | --- | --- |
| GTM container is installed on your website | Use GTM method (recommended) | Phase 2A |
| No GTM, using hardcoded gtag | Use gtag method | Phase 2B |
| E-commerce platform with native plugin (Shopify, WooCommerce) | Use platform plugin + GTM | Check plugin docs first |

> ⚠️ **Always link your GA4 property to Google Ads first:** This syncs the existing Google Tag so you avoid creating duplicate tags. Navigate to GA4 Admin, then link to your Google Ads account before creating conversion actions.

---

### Execution framework

| Phase | Purpose | Output |
| --- | --- | --- |
| **Phase 1️⃣: Create conversion actions** | Define what to track in Google Ads | Conversion IDs and Labels for each action |
| **Phase 2️⃣: Implement tracking** | Install tags via GTM or gtag | Tags configured and triggers set |
| **Phase 3️⃣: Configure and validate** | Debug and verify tag firing | Confirmed data flow end-to-end |
| **Phase 4️⃣: Set goals and verify** | Configure account-default goals and confirm data | Conversions recording in campaign reports |

---

## Phase 1️⃣: Create conversion actions

### 1.1 Navigate to conversion setup

1. Open Google Ads
2. Navigate to **Goals > Conversions > Summary**
3. Click **New conversion action**
4. Select **Website** as the conversion source

### 1.2 Create each conversion action

For each conversion event, configure the following:

1. **Goal category:** Select the most specific category (Submit Lead Form, Purchase, Book Appointment, Contact, etc.)
2. **Conversion name:** Use a consistent naming convention: `[Initials] – GACT – [Event Name]` (e.g., `BM – GACT – Purchase`)
3. **Primary vs. secondary:** Set macro conversions as primary, micro conversions as secondary
4. **Value:** Select "Use different values for each conversion" for ecommerce. For lead gen with no close deal data, leave as "Don't use a value"
5. **Count:** Set to "One" for lead gen actions (form submissions, signups). Set to "Every" for ecommerce purchases
6. **Attribution model:** Keep default (Data-Driven Attribution)
7. **Conversion windows:** Set click-through window based on your sales cycle (default 30 days). Set view-through to 1 day. Set engaged-view to 3 days

| Vertical | Typical macro conversion | Count | Value |
| --- | --- | --- | --- |
| Lead Gen | Form submission, phone call | One | No value (or calculated avg.) |
| SaaS | Signup, trial start, payment | One | Different values per action |
| Ecommerce | Purchase | Every | Dynamic (transaction value) |

### 1.3 Record conversion IDs and Labels

For each action, navigate to **Tag setup > Use Google Tag Manager** and record:

| Conversion action | Conversion ID | Conversion Label | Goal category |
| --- | --- | --- | --- |
| [Action 1] | [Same for all] | [Unique per action] | [Category] |
| [Action 2] | [Same for all] | [Unique per action] | [Category] |

> 💡 **The Conversion ID is constant across all actions in one Google Ads account:** Save it as a Constant variable in GTM so you only configure it once.

---

## Phase 2A: GTM implementation (recommended)

### 2A.1 Verify Google Tag installation

1. Open GTM container
2. Check for an existing Google Tag (gtag.js) that fires on All Pages
3. If missing: create a **Google Tag** with your Google Tag ID (found in Google Ads under Tools > Google Tag)
4. Set trigger to **All Pages**

### 2A.2 Create Conversion Linker tag

1. In GTM, create a new tag
2. Select **Conversion Linker** tag type
3. Set trigger to **All Pages**
4. This tag enables cross-domain tracking and stores click information

### 2A.3 Create Conversion ID constant variable

1. Navigate to **Variables > User-Defined Variables > New**
2. Select **Constant** variable type
3. Enter your Conversion ID value
4. Name it `cid – Google Ads Conversion ID`

### 2A.4 Create Google Ads Conversion Tracking tags

For each conversion action:

1. Create a new tag
2. Select **Google Ads Conversion Tracking** tag type
3. Configure fields:

| Field | Value |
| --- | --- |
| Conversion ID | Select your Constant variable |
| Conversion Label | Paste unique label for this action |
| Conversion Value | Data Layer Variable (for ecommerce) or leave blank |
| Transaction ID | Data Layer Variable (prevents duplicate counting) |
| Currency Code | Data Layer Variable or static (e.g., EUR, USD) |

4. Set the trigger to the appropriate event:

| Conversion type | Trigger type | Example |
| --- | --- | --- |
| Purchase (data layer event) | Custom Event | Event name: `purchase` |
| Form submission | Custom Event | Event name: `form_submit` or platform-specific |
| Thank you page | Page View | URL contains `/thank-you` |
| Button click | Click | Click element matches selector |

### 2A.5 Configure data layer variables (ecommerce)

For dynamic values (value, transaction ID, currency), create Data Layer Variables:

1. Navigate to **Variables > User-Defined Variables > New**
2. Select **Data Layer Variable**
3. Map the variable name to the data layer key (e.g., `ecommerce.purchase.value`)

> ⚠️ **Data layer setup requires developer involvement:** Brief your developer on which events must push data to the data layer and which variables must be included. Provide the event name and expected variable structure.

---

## Phase 2B: gtag implementation (alternative)

### 2B.1 Verify global site tag

Confirm the Google Tag (gtag.js) snippet is installed on every page in the `<head>` section.

### 2B.2 Add conversion event snippets

For each conversion action, add the event snippet on the conversion page or within the event handler:

Place the conversion snippet below the global site tag on conversion pages. Include dynamic parameters for value, transaction_id, and currency where applicable.

### 2B.3 Developer coordination

Provide your developer with:

- Conversion ID and Label for each action
- The pages or events where each snippet fires
- Variable names for dynamic values (value, transaction_id, currency)

---

## Phase 3️⃣: Configure and validate

### 3.1 Debug with GTM Preview (or Tag Assistant)

1. In GTM, click **Preview** to enter debug mode
2. Open your website in the connected browser tab
3. Navigate to the conversion page or trigger the conversion event
4. In the GTM debugger, verify:

| Check | Expected result |
| --- | --- |
| Conversion Linker tag fired | Shows under "Tags Fired" on All Pages |
| Conversion tag fired | Shows under "Tags Fired" on the correct event |
| Conversion ID correct | Matches your Google Ads account |
| Conversion Label correct | Matches the specific conversion action |
| Value passed correctly | Shows dynamic value (ecommerce) |
| Transaction ID populated | Shows unique ID per conversion |

### 3.2 Complete a test conversion

1. Submit a test form, complete a test purchase, or trigger the conversion event
2. Verify the conversion tag fires in the GTM debugger
3. Check the data layer for correct variable values

### 3.3 Publish GTM container

1. Click **Submit** in GTM
2. Add a version name and description (e.g., "GACT setup: [conversion actions added]")
3. Click **Publish**

---

## Phase 4️⃣: Set goals and verify

### 4.1 Configure account-default goals

1. Navigate to **Goals > Conversions > Summary**
2. Click **Edit goal** on your primary macro conversion's goal category
3. Select **Use [category] as an account-default goal**
4. Verify the correct conversion actions are set as primary within that goal category

### 4.2 Verify primary and secondary classification

| Conversion action | Expected classification | Used for |
| --- | --- | --- |
| Macro conversion (purchase, form submit) | Primary | Bidding + reporting |
| Micro conversion (add to cart, page view) | Secondary | Reporting only |

### 4.3 Wait and verify

1. Allow 24-48 hours for conversions to appear
2. Check **Goals > Conversions > Summary** for active status (green dot)
3. Navigate to campaign reports and verify conversions appear in the Conversions column
4. Segment by **Conversion action** to confirm the correct actions are recording
5. Cross-check reported conversions against backend data (CRM, ecommerce platform, analytics)

### 4.4 Final checklist

- [ ] All macro conversions fire correctly with dynamic values
- [ ] Transaction ID populates with a unique value per conversion
- [ ] Conversion Linker fires on all pages
- [ ] Account-default goal includes the correct primary macro conversion
- [ ] No duplicate conversion actions (GACT and GA4 import for the same event)
- [ ] Conversions appear in campaign reports within 48 hours
- [ ] Backend data cross-check shows reasonable alignment

---

### Validation & definition of done

This SOP is complete when:

- [ ] All planned conversion actions are created in Google Ads
- [ ] All tags are deployed and firing on correct triggers
- [ ] GTM container is published (or gtag snippets are live)
- [ ] Account-default goals are configured with correct primary actions
- [ ] Conversions recording in campaign reports within 48 hours
- [ ] Backend data cross-check confirms reasonable alignment

---

### Exit → Entry bridge

Once GACT is live and verified:

| Timeframe | Action |
| --- | --- |
| Immediately | [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md) for better attribution |
| Immediately | Implement Consent Mode if targeting EU/EEA users |
| If Lead Gen/SaaS | [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) |
| Week 2+ | [SOP – Implement Server-Side Tagging](../sops/SOP – Implement Server-Side Tagging.md) for data accuracy |

**If issues arise:**

| Issue | Route to |
| --- | --- |
| Conversions not recording | Check tag firing in GTM debugger, verify Conversion Linker |
| Duplicate conversions | Check for both GACT and GA4 import counting the same event |
| Value incorrect | Verify data layer variable mapping |
| Status shows "No recent conversions" | Allow 48 hours, then re-debug |

---

### FAQ

**Q: Should I use GACT or import GA4 conversions?**

A: Use native GACT for Smart Bidding input. GACT fires directly to Google Ads and provides better attribution for bidding optimization. GA4 imported events can be used as a secondary backup for comparison, but avoid using both as primary for the same event (this causes duplicate counting).

**Q: How many conversion actions should I create?**

A: Create one conversion action per meaningful business event. Track all macro conversions (purchases, form submissions, calls) and key micro conversions (add to cart, begin checkout, signup steps). Avoid vanity metrics like quality visits or time on site.

**Q: What if I have multiple domains or landing pages?**

A: The Google Tag and Conversion Linker handle cross-domain tracking. Ensure GTM is installed on all domains. Configure cross-domain tracking in the Google Tag settings if users navigate between domains during the conversion path.

**Q: Should I use "One" or "Every" for conversion counting?**

A: Use "One" for lead gen actions where duplicate submissions from the same user are not valuable. Use "Every" for ecommerce purchases where each transaction is a distinct conversion.

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
| [SOP – Implement Enhanced Conversions](../sops/SOP – Implement Enhanced Conversions.md) | Downstream (enhances GACT attribution) |
| [SOP – Implement Server-Side Tagging](../sops/SOP – Implement Server-Side Tagging.md) | Downstream (improves data accuracy) |
| [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md) | Downstream (Lead Gen/SaaS only) |

---

### Common failures

| Failure | Why it happens | How to avoid |
| --- | --- | --- |
| Conversion Linker tag missing | Skipped during setup | Always create Conversion Linker on All Pages |
| Duplicate conversions | Both GACT and GA4 import set as primary | Use one method as primary, other as secondary backup |
| No dynamic values (ecommerce) | Data layer not configured | Brief developer before tag setup |
| Transaction ID missing | Not mapped from data layer | Always include Transaction ID to prevent duplicate counting |
| Wrong counting method | Used "Every" for lead gen forms | Use "One" for leads, "Every" for purchases |
| Tags fire on wrong pages | Trigger misconfigured | Debug thoroughly in GTM Preview mode |
| GA4 link not set up first | Jumped straight to conversion creation | Link GA4 to Google Ads before creating conversion actions |

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
