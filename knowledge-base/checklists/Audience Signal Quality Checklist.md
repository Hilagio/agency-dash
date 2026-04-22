# Audience Signal Quality Checklist
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CHECKLIST_9
Status: Done
Category: Audiences
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Bucket: Audiences
Domain: Audiences
Pillar: 7

## Purpose

Validates that Performance Max audience signal setup meets quality, coverage, and exclusion requirements.

---

## What this checklist validates

This checklist confirms:

- Signal tier coverage (multiple quality tiers represented)
- Customer Match data quality (list size, match rate, recency)
- Custom segment quality (relevance, volume, no duplication)
- Search theme configuration (cannibalization risk managed)
- Exclusion coverage (converters and customers excluded where needed)
- Signal-to-asset-group alignment (signals match asset group theme)

This checklist does **NOT:**

- Teach signal type selection (See: [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md))
- Provide step-by-step signal setup (See: [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md))
- Explain the signal vs. targeting framework (See: [Audience Strategy Mental Model](../mental-models/Audience Strategy Mental Model.md))
- Cover Display, Video, or Demand Gen audience validation (See: [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md), [Audience Targeting Health Checklist](../checklists/Audience Targeting Health Checklist.md))

---

## When to use

Run this checklist:

- After completing [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md)
- During Performance Max campaign audits
- After adding or modifying audience signals in any PMax asset group
- Before launching a new PMax campaign

---

## Checklist

### Signal coverage

- [ ] At least one Tier 1 signal is present (Customer Match or website converters)
- [ ] At least one Tier 2-3 signal is present (website visitors, YouTube users, or custom segments)
- [ ] Signal stack covers at least 3 different signal types
- [ ] Signals align with the asset group's product/service theme

### Customer Match quality

- [ ] Customer Match list contains 1,000+ matched users (100 minimum for delivery, 1,000+ recommended)
- [ ] List uploaded with multiple identifiers (email + phone and/or address)
- [ ] Match rate is 29%+ (investigate if below)
- [ ] List refreshed within the past 30 days
- [ ] Appropriate list type selected for campaign goal (all customers vs. high-value subset)

### Website visitor signals

- [ ] Converter segment uses 90-540 day window
- [ ] All-visitor segment uses 30-90 day window
- [ ] Google Tag is firing correctly on all relevant pages
- [ ] Segment sizes are 1,000+ users (100 minimum for delivery)

### Custom segment quality (search terms)

- [ ] Segment contains 10-15 high-converting search terms (not hundreds)
- [ ] Terms are actual converting queries from Search campaigns (not guesses)
- [ ] No single-word generic terms included
- [ ] No brand terms included (already captured through other channels)
- [ ] Terms match the asset group's product/service theme

### Custom segment quality (URLs/apps)

- [ ] Segment contains 10-15 relevant competitor or industry URLs
- [ ] URLs are specific pages, not generic homepages
- [ ] No generic sites included (google.com, facebook.com, news sites)

### Search theme configuration

- [ ] Search themes are only used if no active Search campaign covers the same queries
- [ ] No more than 25 search themes per asset group
- [ ] Search themes do not duplicate Search campaign keywords
- [ ] Cannibalization risk acknowledged and accepted (if using search themes alongside Search campaigns)

### Google predefined segments

- [ ] In-market segments are relevant to the product/service category
- [ ] Affinity and demographic segments are layered with higher-quality signals (not used alone)
- [ ] No more than 2-3 in-market segments selected (avoid diluting signal clarity)

> ↪️ **Browse segment names:** See [Audience Segments Reference](../references/Audience Segments Reference.md) for the full list of in-market, affinity, and life event segments available in Google Ads.

### Exclusion coverage

- [ ] Recent converters excluded (7-30 day window based on purchase cycle)
- [ ] Existing customers excluded (if running new customer acquisition)
- [ ] Brand keyword exclusions applied at campaign level (if protecting Search campaigns)
- [ ] Exclusion lists are up to date and refreshed regularly

### Signal-to-asset-group alignment

- [ ] Each asset group's signals match its product/service theme
- [ ] Different asset groups use different signal configurations (not identical copies)
- [ ] Signal intensity matches business goal (efficiency = narrow signals, growth = broader signals)

---

## Quick reference

| Document | Relationship |
|----------|-------------|
| [Audience Signal Catalog](../catalogs/Audience Signal Catalog.md) | Provides signal type options and configurations |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Signal specs, limits, and quality hierarchy |
| [SOP – Set Up Audience Signals](../sops/SOP – Set Up Audience Signals.md) | Uses this checklist for validation |
| [SOP – Build Customer Match Lists](../sops/SOP – Build Customer Match Lists.md) | Creates Customer Match lists validated here |

---

## Version details

- **Version:** 2.0
- **Last Updated:** January 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: [https://www.ppcmastery.com/terms-and-conditions](https://www.ppcmastery.com/terms-and-conditions)

© 2026 PPC Mastery B.V. All rights reserved.
