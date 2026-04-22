# Conversion Tracking Setup Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_15
Status: Done
Category: Operational
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Validates that conversion tracking setup is complete and correctly configured across all layers: foundation tracking, server-side tagging, enhanced conversions, offline conversion tracking, consent mode, and enhancement features.

---

## What this checklist validates

This checklist confirms:

- Foundation conversion tracking is implemented and firing correctly
- Conversion action settings match vertical requirements
- Transaction IDs are in place for deduplication and adjustments
- Server-side tagging is configured (if applicable)
- Enhanced Conversions are active and healthy
- Offline Conversion Tracking is set up (lead gen/SaaS)
- Consent Mode is active and modeling
- Enhancement features are implemented per priority

This checklist does **NOT:**

- Explain what each feature does (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Recommend specific settings (See: [Conversion Tracking Configuration Guidelines](../guidelines/Conversion Tracking Configuration Guidelines.md))
- Validate ongoing data quality (See: [Conversion Data Quality Checklist](../checklists/Conversion Data Quality Checklist.md))
- Provide step-by-step setup instructions (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))

---

## When to use

Run this checklist:

- After initial conversion tracking setup
- After website migration or domain change
- After CMS update or platform migration
- After GTM container restructure
- Quarterly as part of tracking audit
- When onboarding a new client account

---

## Checklist

### Foundation

- [ ] At least one macro conversion action exists and is set to Primary
- [ ] Macro conversion fires on the correct trigger or page (purchase, form submission, signup)
- [ ] Conversion value passes dynamically (not a static €1 or default value)
- [ ] Transaction ID is populated with a unique value per conversion
- [ ] Attribution model is set to Data-Driven (not Last Click)
- [ ] Click-through window matches the sales cycle (verified via Path Metrics)
- [ ] Counting method is correct (Every for ecommerce, One for lead gen)
- [ ] Goal categories are correctly assigned (Purchase, Lead, Sign-up, etc.)
- [ ] Account-default goal includes the correct primary macro conversion
- [ ] Campaign-specific goals are set where needed (upper funnel campaigns, experiments)
- [ ] Conversion linker tag fires on all pages (GTM) or global site tag is present on all pages (gtag)
- [ ] No vanity metrics are set as conversion actions (scroll depth, time on site, bounce rate)
- [ ] Micro conversions are set to Secondary (not Primary, unless intentionally used for bidding)
- [ ] No duplicate conversion actions counting the same event

> ⚠️ **Transaction ID is non-negotiable:** Without it, you cannot deduplicate conversions or use Conversion Adjustments. Verify this is passing a unique value (order ID, form submission ID) on every conversion.

### Server-Side Tagging (if applicable)

- [ ] Server container is deployed and accessible
- [ ] Custom subdomain is configured (e.g., `data.yourdomain.com`)
- [ ] SSL certificate is active on the subdomain
- [ ] Web container routes data to server container via transport URL
- [ ] Server container forwards data to Google Ads endpoint
- [ ] Server container forwards data to GA4 endpoint
- [ ] Server-side conversion tag fires and records conversions
- [ ] First-party cookie duration is extended (up to 2 years via server-side)
- [ ] Health monitoring is in place (uptime check on server container)

### Enhanced Conversions

- [ ] Enhanced Conversions enabled in Google Ads conversion action settings
- [ ] Email address variable is populated correctly (hashed automatically)
- [ ] Phone number variable is populated (optional but recommended)
- [ ] First name and last name variables are populated (optional, improves match rate)
- [ ] Address variables are populated (optional, improves match rate)
- [ ] Diagnostics page shows green check mark or active status
- [ ] Match rate is within acceptable range (check via diagnostics)
- [ ] Implementation method is documented (GTM tag, global site tag, or API)

### Offline Conversion Tracking (Lead Gen / SaaS)

- [ ] Import conversion actions are created in Google Ads (e.g., "Qualified Lead", "Closed Deal")
- [ ] Import conversion actions are set to correct optimization level (Primary or Secondary)
- [ ] GCLID is captured from the landing page URL and stored in CRM
- [ ] Alternative: hashed email is captured and stored if GCLID capture is not possible
- [ ] CRM pipeline stages map to Google Ads conversion actions
- [ ] Upload schedule is configured (daily or weekly)
- [ ] Conversion values are assigned based on deal stage or actual deal value
- [ ] Test upload has been completed successfully with no errors
- [ ] Upload method is documented (manual, scheduled Google Sheet, or API)

> 💡 **For lead gen accounts, OCT is as important as the initial pixel:** Form submission tracking only tells Smart Bidding who filled out a form. OCT tells it who became a paying customer. Without OCT, Smart Bidding optimizes for form fills, not revenue.

### Consent Mode (EU/EEA required, recommended globally)

- [ ] CMP (Consent Management Platform) is installed
- [ ] CMP is from the Google CMP gallery (GTM template)
- [ ] Consent banner displays correctly on all pages
- [ ] Consent banner is accessible on mobile devices
- [ ] Default consent state is configured (denied for EU/EEA, granted for other regions)
- [ ] Consent Mode V2 signals are active: `ad_storage`
- [ ] Consent Mode V2 signals are active: `analytics_storage`
- [ ] Consent Mode V2 signals are active: `ad_user_data`
- [ ] Consent Mode V2 signals are active: `ad_personalization`
- [ ] Google Ads diagnostics confirms Consent Mode is active
- [ ] Conversion modeling is active (check in conversion action settings)
- [ ] Non-Google tags have consent checks configured in GTM

### Enhancement features

- [ ] Cart Data is sending product-level purchase data (ecommerce)
- [ ] Product feed includes COGS attribute (ecommerce, enables profit-based bidding)
- [ ] New customer data parameter is populated (if NCA strategy is planned or active)
- [ ] Custom variables are created and enabled (if default segments are insufficient)
- [ ] Conversion Adjustments upload schedule is configured (ecommerce returns, lead value updates)
- [ ] Data Exclusion process is documented (who applies it, when, how)

---

## Quick reference

| Document | Relationship |
|----------|--------------|
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action types and settings |
| [Conversion Adjustments Reference](../references/Conversion Adjustments Reference.md) | RESTATE and RETRACT adjustment types |
| [Data Exclusions Reference](../references/Data Exclusions Reference.md) | Time-period data exclusion feature |
| [Conversion Tracking Configuration Guidelines](../guidelines/Conversion Tracking Configuration Guidelines.md) | Recommended settings for all features |
| [Conversion Data Quality Checklist](../checklists/Conversion Data Quality Checklist.md) | Ongoing data quality validation |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum volumes for bid strategies |
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Strategic framework for measurement progression |
| [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Step-by-step implementation |

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

© 2026 PPC Mastery B.V. All rights reserved.
