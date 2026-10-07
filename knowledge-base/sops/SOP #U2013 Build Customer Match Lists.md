# SOP – Build Customer Match Lists
Created: 2026-02-04
Updated: 2026-10-05

SOP_ID: SOP_13
Status: Done
Category: Audiences
Primary Outcome: Uploaded, matched Customer Match list ready for use as signal (PMax) or targeting (Display/Video/Demand Gen)
Secondary Outcomes: Higher match rates through multi-identifier uploads, automated refresh schedule, audience-ready exclusion lists
Agent_Executable: No
Human_Approval_Required: Yes
Domain: Audiences
Pillar: 7

### Purpose

This SOP creates, formats, uploads, and maintains **Customer Match audience lists** in Google Ads.

> ❓ **The big question:** Do I have a properly formatted, uploaded, and regularly refreshed Customer Match list with a healthy match rate?

---

### What this SOP is NOT

This SOP does **not:**

- Configure how Customer Match lists are used as PMax signals (See: [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md))
- Configure how Customer Match lists are used for Display/Video/DG targeting (See: [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md))
- List all audience segment options (See: [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md), [Audience Segment Catalog](../catalogs/Audience Segment Catalog.md))
- Manage CRM or marketing automation systems

### When to run this SOP

Run this SOP when:

- Setting up Customer Match for the first time
- Creating a new customer segment list (high-value, churned, etc.)
- Match rates are below 60% and need diagnosis
- Establishing or updating the list refresh schedule
- Expanding to multi-identifier uploads for better match rates

---

### Before you start

#### Required inputs

- Access to CRM or customer database with exportable data
- Google Ads account with Customer Match eligibility (requires good compliance history and 90+ days account age)
- Customer data with at least one identifier: email, phone, or mailing address
- Customer consent for data usage (required for EEA uploads)

#### Reference documents (have open)

| Document | Used for |
|----------|---------|
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Customer Match specs and limits |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Targeting specs for Customer Match |

#### Eligibility check

Before proceeding, verify your account qualifies:
| Requirement | Check |
|-------------|-------|
| Account age | 90+ days |
| Good compliance history | No policy violations |
| Payment history | Good standing |
| Customer Match access | Enabled in account |

If Customer Match is not available, contact Google support or wait for eligibility.

---

### Decision gate: List strategy

| If your goal is... | Create this list | Data source |
|--------------------|-----------------|-------------|
| **Broad signal for PMax** | All customers | Full CRM export |
| **High-value signal** | Top 20% by LTV/revenue | CRM filtered by revenue |
| **New customer acquisition** | All customers (for exclusion) | Full CRM export |
| **Win-back campaigns** | Churned/lapsed customers | CRM filtered by last activity date |
| **Upsell campaigns** | Active customers by product | CRM filtered by product/tier |
| **Lookalike seeding** | Highest-value converters | CRM filtered by top performers |

Create multiple lists for different purposes. Start with "All customers" as the foundation.

---

## Execution

### Phase 1️⃣: Define list strategy

**Goal:** Determine which customer segments to create and what data to include.

#### Step 1.1: Identify list segments

Document the lists you need:
| List name | Purpose | Filter criteria | Estimated size |
|-----------|---------|----------------|---------------|
| All Customers | Broad signal / exclusion | All CRM records | [Number] |
| High-Value Customers | Premium signal | Top 20% by revenue | [Number] |
| [Additional segments] | [Purpose] | [Filter] | [Number] |

#### Step 1.2: Verify data availability

For each list, confirm available identifiers:
| Identifier | Available? | Coverage (% of records) |
|-----------|-----------|------------------------|
| Email | Yes/No | [%] |
| Phone | Yes/No | [%] |
| Mailing address | Yes/No | [%] |
| First name | Yes/No | [%] |
| Last name | Yes/No | [%] |
| Country | Yes/No | [%] |

> 💡 **More identifiers = higher match rates:** Email alone matches 29-62%, which lands below the 60-80% healthy band on its own. Adding phone adds 15-20 points and adding mailing address adds a further 10-15 points, which is how a list reaches 60-80%. Always upload all available identifiers.

#### Step 1.3: Verify consent (EEA requirement)

For European Economic Area customers:

- [ ] Customer consent for data usage is documented
- [ ] Consent covers use for advertising purposes
- [ ] Consent signals are included in upload (if using partner uploads)

**Phase 1 output:** List segments defined, data availability confirmed, consent verified.

---

### Phase 2️⃣: Extract and format data

**Goal:** Export customer data from CRM and format for Google Ads upload.

#### Step 2.1: Export data from CRM

1. Export each defined segment as CSV
2. Include all available identifier columns
3. Remove any records with no valid identifiers

#### Step 2.2: Format the CSV file

Google Ads requires specific column headers and formatting:
| Column header | Format | Example |
|--------------|--------|---------|
| `Email` | Trimmed, lowercase, gmail periods stripped | `john@example.com` |
| `Phone` | E.164 format (country code + number) | `+1234567890` |
| `First Name` | As-is (Google hashes on upload) | `John` |
| `Last Name` | As-is | `Smith` |
| `Country` | ISO 2-letter code | `US`, `NL`, `GB` |
| `Zip` | As-is | `10001`, `1011 AB` |
| `User IP address` | IPv4 or IPv6 string, trimmed, never hashed | `192.168.1.1` |
| `User interaction timestamp` | Earliest and last interaction time from that IP address, never hashed, only valid alongside an IP address | n/a |

> ⚠️ **IP address matching is not available for end users in the EEA, the UK or Switzerland.** For lists covering those regions, the identifiers are email, phone and mailing address.

#### Step 2.3: Pre-hash data (optional)

If uploading via API or if your privacy policy requires pre-hashing:
| Identifier | Hashing | Pre-processing |
|-----------|---------|---------------|
| Email | SHA-256 | Trim whitespace, lowercase, then strip every period preceding the domain in `gmail.com` and `googlemail.com` addresses |
| Phone | SHA-256 | E.164 format first (country code followed by the number, no spaces or punctuation), then hash |
| First/Last name | SHA-256 | Lowercase, trim whitespace first |
| Address | SHA-256 | Lowercase, remove extra spaces first |

If uploading via Google Ads UI, Google normalizes and hashes automatically, no pre-hashing needed.

> ⚠️ **Normalize before you hash or the record simply will not match.** `john.smith@gmail.com` and `johnsmith@gmail.com` reach the same mailbox but hash differently. Strip the periods for `gmail.com` and `googlemail.com` only and leave every other domain alone. A pipeline that skips a normalization step produces a quietly low match rate, never an upload error.

#### Step 2.4: Validate file

| Check | Requirement |
|-------|------------|
| File format | CSV (UTF-8 encoding, no hidden characters from spreadsheet exports) |
| File size | Under 5 GB |
| Minimum records | 1,000+ (for effective matching: 100 absolute minimum) |
| Column headers | Match Google's template exactly, include every template header even if a column is empty |
| No duplicates | Remove duplicate rows |
| No empty rows | Remove rows with no identifiers |
| Membership duration | 540 days maximum: re-upload on a schedule to keep lists from silently expiring |

**Phase 2 output:** Formatted CSV file(s) ready for upload.

---

### Phase 3️⃣: Upload and verify

**Goal:** Upload lists to Google Ads and verify match rates.

#### Step 3.1: Upload via Google Ads UI

1. Navigate to **Tools → Shared library → Audience manager → Your data segments**
2. Click **+ (plus button)** → **Customer list**
3. Name the list clearly (e.g., "All Customers - Jan 2026")
4. Select data type: **Upload emails, phones, and/or mailing addresses**
5. Upload the formatted CSV file
6. Accept the Customer Match policy terms
7. Click **Upload and create**

#### Step 3.2: Check match rate

After upload (allow 24-48 hours for processing):

1. Return to **Audience manager → Your data segments**
2. Check the match rate for your uploaded list

| Match rate | Assessment | Action |
|-----------|-----------|--------|
| 60-80% | Healthy | Proceed to Phase 4 |
| 40-59% | Below the healthy band | Diagnose (see Step 3.3), add identifiers, re-check |
| Below 40% | Poor | Diagnose and fix before proceeding (see Step 3.3) |

#### Step 3.3: Diagnose low match rates

If match rate is below 60%:
| Cause | Fix |
|-------|-----|
| Email-only upload | Add phone numbers and mailing addresses |
| Formatting errors | Check email trimmed and lowercased, gmail periods stripped, phone in E.164 format |
| Old/invalid emails | Clean list, remove bounced emails, outdated records |
| B2B-heavy list | B2B match rates are naturally lower, add phone/address to compensate |
| Small list size | Increase list size, match rate improves with scale |
| Work emails only | Personal emails match better than corporate domains |

#### Step 3.4: Verify list size

| Check | Minimum | Recommended |
|-------|---------|-------------|
| Matched users | 100 | 1,000+ |
| List shows "Ready" | Required | Required |

If matched users are below 100, the list will not serve. Increase list size or add more identifiers.

**Phase 3 output:** Customer Match list uploaded, match rate verified, list status "Ready".

---

### Phase 4️⃣: Set refresh schedule and maintain

**Goal:** Establish a regular refresh cadence to keep lists current and effective.

#### Step 4.1: Determine refresh frequency

| List type | Recommended refresh | Rationale |
|-----------|-------------------|-----------|
| All customers | Weekly (automated) or monthly (manual) | New customers added regularly |
| High-value customers | Monthly | Revenue data updates monthly |
| Churned customers | Monthly | Churn status changes over time |
| Campaign-specific segments | As needed | Align with campaign lifecycle |

#### Step 4.2: Set up refresh method

| Method | Best for | Setup |
|--------|---------|-------|
| **Manual CSV upload** | Small lists, infrequent updates | Re-upload CSV monthly via Audience manager |
| **Data Manager API** | Large lists, frequent updates | Engineering team sets up automated uploads |
| **CRM integration** | Automated sync | Connect CRM (HubSpot, Salesforce, etc.) via Data Manager |
| **Zapier/Make** | No-code automation | Set up automated trigger on new customer creation |

#### Step 4.3: Set membership duration

- Maximum membership duration: **540 days**
- After 540 days, users are automatically removed unless the list is refreshed
- Set a calendar reminder at 500 days if using manual refresh

#### Step 4.4: Document refresh schedule

| List name | Refresh method | Frequency | Next refresh date | Owner |
|-----------|---------------|-----------|-------------------|-------|
| [List 1] | [Method] | [Frequency] | [Date] | [Person] |
| [List 2] | [Method] | [Frequency] | [Date] | [Person] |

#### Step 4.5: Validate ongoing health

Run these checks monthly:

- [ ] List size is growing or stable (not declining)
- [ ] Match rate is stable (not declining)
- [ ] Last refresh date is within the scheduled window
- [ ] No policy warnings on the list

**Phase 4 output:** Refresh schedule documented, method configured, ongoing monitoring established.

---

### Validation & definition of done

This SOP is complete when:

- [ ] At least one Customer Match list is uploaded and status shows "Ready"
- [ ] Match rate is 60%+, or the diagnosis of a rate below 60% is documented
- [ ] Matched user count is 1,000+ (100 minimum for delivery)
- [ ] Refresh schedule is documented with clear ownership
- [ ] List is available in Audience manager for use in campaigns

---

### Exit → Entry bridge

| After completing this SOP... | Route to... |
|-----------------------------|-------------|
| Using list as PMax signal | [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) |
| Using list for Display/Video/DG targeting | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) |
| Using list as lookalike seed (Demand Gen) | [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) (Phase 2, Step 2.3) |
| Using list as exclusion | Apply at campaign level in the relevant SOP |

---

### FAQ

**Q: What's the minimum list size for Customer Match to work?**
A: 100 matched users for delivery, but 1,000+ is recommended for meaningful signal quality. Lists under 1,000 users provide limited optimization value.

**Q: Does Google see my raw customer data?**
A: No. Data is hashed (SHA-256) during upload. Google matches hashed data against hashed Google account data. Raw data is never stored.

**Q: Can I use Customer Match across all campaign types?**
A: Yes. Customer Match works in Search, Shopping, Display, Video, Demand Gen, and Performance Max. In PMax it functions as a signal: in other campaign types it functions as targeting.

**Q: Why is my match rate low for B2B lists?**
A: B2B contacts often use work emails that don't match personal Google accounts. Add phone numbers and mailing addresses to increase match rates. Personal emails always match better.

**Q: How often should I refresh my lists?**
A: Weekly is ideal for active customer lists. Monthly is the minimum. Lists expire after 540 days without refresh.

---

### Quick reference

| Document | Type | Used for |
|----------|------|---------|
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Reference | Customer Match specs and signal hierarchy |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Reference | Customer Match targeting specs |
| [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) | SOP | Using lists as PMax signals |
| [SOP – Set Up Audience Targeting](../sops/SOP – Set Up Audience Targeting.md) | SOP | Using lists for campaign targeting |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|---------------|--------------|
| Match rate below 60% | Email-only upload, which caps at Google's 29-62% email baseline | Upload multiple identifiers (email + phone + address) |
| List shows "Not ready" | Under 100 matched users | Increase list size or add more identifiers |
| List goes stale | No refresh schedule set | Document refresh cadence and assign ownership |
| Formatting errors on upload | Wrong column headers or data format | Use Google's exact column headers, E.164 phone format |
| Policy rejection | Missing customer consent | Verify consent documentation before upload |
| Uploading to wrong account | Manager vs. child account confusion | Verify account ID before uploading |

---

### Version details

- **Version:** 3.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

### Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
