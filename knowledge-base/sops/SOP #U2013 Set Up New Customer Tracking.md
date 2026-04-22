# SOP – Set Up New Customer Tracking
Created: 2026-02-04

Agent_Executable: No
Category: Measurement
Human_Approval_Required: No
Primary Outcome: New vs returning customer data visible in Google Ads reports with NCA goal capability
SOP_ID: SOP_27
Status: Done
Domain: Measurement
Pillar: 5

### Purpose

This SOP walks you through implementing new customer detection on your site, configuring the data in Google Tag Manager or gtag, and enabling new customer acquisition (NCA) goals for Performance Max campaigns.

> ❓ **The big question:** Can Google Ads distinguish between new and returning customers so you can bid differently for acquisition?

---

### What this SOP is NOT

This SOP does **not:**

- Set up basic conversion tracking (prerequisite: purchase conversion must already exist)
- Configure PMax campaign settings or asset groups (downstream SOP)
- Define customer segmentation strategy (See: relevant mental model)
- Cover offline conversion tracking for new customer attribution

### When to run this SOP

Run this SOP when:

- You want to see new vs returning customer breakdown in Google Ads reports
- You plan to use NCA bidding in Performance Max campaigns
- Customer acquisition cost differs significantly from retention cost
- You need to measure true acquisition performance separately from repeat purchases

---

### Before you start

#### Required inputs

- Google Ads account with purchase conversion action active
- Google Tag Manager container or gtag.js implementation
- Developer access to modify the data layer on the purchase confirmation page
- Backend database or CRM that can determine if a customer is new or returning

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| Google Tag Manager workspace | Tag and variable configuration |
| Backend/CRM documentation | Customer lookup logic |
| Google Ads campaign settings | NCA goal enablement |

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Brief Developer** | Implement new_customer detection on the purchase page | Data layer variable with true/false customer status |
| **Phase 2️⃣: Configure in GTM or gtag** | Pass new customer data to Google Ads conversion tag | Conversion tag sending new_customer parameter |
| **Phase 3️⃣: Validate** | Debug and verify data in reports | New vs returning segments visible in Google Ads |
| **Phase 4️⃣: Enable NCA Goal (Optional)** | Turn on new customer acquisition bidding in PMax | NCA bidding mode active on selected campaigns |

---

## Phase 1️⃣: Brief Developer

### 1.1 Define the customer detection logic

Send this specification to your developer. On the purchase confirmation page, the data layer must include a `new_customer` variable:

| Field | Type | Value | Description |
|-------|------|-------|-------------|
| `new_customer` | Boolean | `true` or `false` | Whether this is the customer's first purchase |

### 1.2 Detection methods

The developer implements one of these approaches:

| Method | How it works | Best for |
|--------|-------------|----------|
| Database lookup | Check order history by email/customer ID at purchase time | Most accurate, works for all platforms |
| Platform-native | Use Shopify `first_time_buyer` or WooCommerce order count | Quick setup on supported platforms |
| Cookie-based | Check for returning customer cookie | Fallback only, less accurate |

> ⚠️ **Database lookup is the gold standard:** Cookie-based detection misses cross-device purchases and breaks when cookies are cleared. Always use server-side detection when possible.

### 1.3 Data layer push example

```javascript
dataLayer.push({
  'event': 'purchase',
  'transaction_id': 'T-98765',
  'value': 149.97,
  'currency': 'USD',
  'new_customer': true
});
```

### 1.4 Verify developer implementation

1. Place a test order with a new email address
2. Open browser console, type `dataLayer`
3. Confirm `new_customer: true` in the purchase event
4. Place another order with the same email
5. Confirm `new_customer: false` in the purchase event

---

## Phase 2️⃣: Configure in GTM or gtag

### 2A: GTM configuration

#### Step 1️⃣: Create the data layer variable

1. Go to Variables > User-Defined Variables > New
2. Variable type: Data Layer Variable
3. Data Layer Variable Name: `new_customer`
4. Name the variable: `DLV - new_customer`
5. Save

#### Step 2️⃣: Add new customer data to the conversion tag

1. Go to Tags > select your Google Ads Purchase conversion tag
2. Check "Provide new customer data"
3. Data source: Data Layer
4. New customer: `{{DLV - new_customer}}`
5. Save and publish

### 2B: gtag configuration (alternative)

If using gtag.js directly, add the `new_customer` parameter to the purchase conversion snippet:

```javascript
gtag('event', 'conversion', {
  'send_to': 'AW-XXXXXXX/YYYYYYY',
  'value': 149.97,
  'currency': 'USD',
  'transaction_id': 'T-98765',
  'new_customer': true
});
```

The developer populates the `new_customer` value dynamically from the backend at page render time.

---

## Phase 3️⃣: Validate

### 3.1 Debug in GTM

1. Open GTM Preview mode
2. Complete a test purchase (new customer)
3. Click the purchase event in the debug panel
4. Verify the conversion tag shows `new_customer: true`
5. Complete a test purchase (returning customer)
6. Verify the conversion tag shows `new_customer: false`

### 3.2 Segment campaigns by customer type

Allow 24-48 hours for data to populate, then:

1. Go to Google Ads > Campaigns
2. Click Segment > Conversions > New vs Returning Customers
3. Verify that conversions are split into "New" and "Returning" rows

| What you should see | What it means |
|---------------------|--------------|
| "New" and "Returning" rows under each campaign | Data is flowing correctly |
| Only "Returning" rows | new_customer variable is always false, check developer logic |
| Only "New" rows | new_customer variable is always true, check developer logic |
| No segmentation available | Data not reaching Google Ads, re-debug GTM |

### 3.3 Final checklist

- [ ] Data layer pushes new_customer: true for first-time buyers
- [ ] Data layer pushes new_customer: false for repeat buyers
- [ ] GTM conversion tag has "Provide new customer data" enabled
- [ ] Google Ads shows New vs Returning segments in campaign reports
- [ ] Both true and false values appear in test data

---

## Phase 4️⃣: Enable NCA Goal (Optional)

### 4.1 When to enable NCA

Enable new customer acquisition bidding when:

- You run Performance Max campaigns
- You want Google to prioritize acquiring new customers over repeat purchases
- You have a defined new customer value or are willing to bid higher for acquisition

### 4.2 Configure NCA in PMax

1. Open Google Ads
2. Go to the Performance Max campaign > Settings
3. Under "Customer acquisition", select your bidding mode:

| Mode | Behavior | Use when |
|------|----------|----------|
| Bid higher for new customers | Bids more aggressively for new customers while still targeting returning customers | You value new customers more but want both |
| Only bid for new customers | Excludes returning customers entirely | You only want acquisition from this campaign |

4. Set the new customer value (optional): the additional value assigned to a new customer conversion
5. Save

> 💡 **Start with "Bid higher" mode:** Only use "Only bid for new customers" if you have separate campaigns for retention. Starting with the exclusive mode reduces volume significantly.

### 4.3 Verify NCA is active

1. After enabling, check the campaign settings page
2. Confirm "Customer acquisition" shows your selected mode
3. Monitor new customer conversion rate over 2 weeks

---

### Validation and definition of done

This SOP is complete when:

- [ ] Data layer sends accurate new_customer values (true/false) on every purchase
- [ ] Conversion tag passes new customer data to Google Ads
- [ ] Google Ads reports show New vs Returning customer segments
- [ ] At least 10 test conversions show correct customer type classification
- [ ] NCA goal enabled in PMax (if applicable)

---

### Exit → Entry bridge

Once new customer tracking is active:

| Timeframe | Action |
|-----------|--------|
| Immediately | Review campaign reports with new customer segmentation |
| After 7 days | Validate new vs returning ratios match backend data |
| After 30 days | Evaluate NCA goal impact on acquisition volume and cost |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| All conversions showing as "new" | Developer: check database lookup logic |
| No customer segmentation in reports | Re-debug GTM conversion tag (Phase 3.1) |
| NCA bidding reducing volume too much | Switch from "Only new" to "Bid higher" mode |

---

### FAQ

**Q: What if I can't determine new vs returning on the server side?**

A: Use a first-party cookie as a fallback. Set a cookie after the first purchase, check for it on subsequent purchases. This is less accurate but better than no segmentation.

**Q: Does new customer tracking work with lead gen?**

A: The new_customer parameter is designed for purchase conversions. For lead gen, use custom variables to pass lead type (new prospect vs existing client) instead.

**Q: How does NCA interact with Target ROAS bidding?**

A: NCA adds an acquisition premium on top of your Target ROAS. Google may exceed your ROAS target for new customers, so monitor the blended ROAS after enabling.

---

### Related SOPs

| SOP | Relationship |
|-----|--------------|
| [SOP – Set Up Cart Data and Profit Tracking](../sops/SOP – Set Up Cart Data and Profit Tracking.md) | Parallel: enriches the same purchase conversion with different data |
| [SOP – Implement Transaction ID Deduplication](../sops/SOP – Implement Transaction ID Deduplication.md) | Parallel: ensures each new customer conversion is counted once |
| [SOP – Configure Google Consent Mode](../sops/SOP – Configure Google Consent Mode.md) | Upstream: consent mode must be active for accurate tracking |

---

### Common failures

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| All conversions flagged as new | Cookie-based detection on first visit, not first purchase | Use database lookup for purchase history |
| new_customer always false | Developer checking wrong field or logic inverted | Test with a confirmed new email address |
| NCA goal not appearing in PMax settings | New customer data not flowing yet | Wait 48 hours after first conversions with new_customer data |
| Inaccurate new/returning ratios | Guest checkout bypasses customer lookup | Match by email address, not account ID |

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
