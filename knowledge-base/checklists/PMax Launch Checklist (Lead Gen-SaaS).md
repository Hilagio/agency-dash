# PMax Launch Checklist (Lead Gen/SaaS)
Created: 2026-02-04
Updated: 2026-07-13

Support_ID: CHECKLIST_22
Status: Done
Reference Type: Checklist
Agent_Readable: No
Human_Facing: Yes
Applies_To: Lead Gen, SaaS
Domain: PMax
Pillar: 6

## Purpose

Validates that all prerequisites are complete before launching a Performance Max campaign for Lead Gen or SaaS.

This checklist ensures you have the lead quality signals, audience data, creative assets, and brand separation required for PMax success. Without these prerequisites, PMax will optimize for volume, not value.

---

## What this checklist validates

This checklist confirms:

- Lead quality tracking is configured (not just form submissions)
- Audience signals are prepared and meet minimum sizes
- Creative assets are ready and meet specifications
- Brand separation is configured
- Volume requirements are met

This checklist does **NOT:**

- Help decide whether to use PMax (See: [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>))
- Provide step-by-step campaign setup (See: [SOP – Launch PMax for Lead Gen/SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md))
- Validate Ecommerce PMax readiness (See: [Shopping Campaign Launch Checklist](../checklists/Shopping Campaign Launch Checklist.md))

---

## When to use

Run this checklist:

- Before launching any new Lead Gen or SaaS PMax campaign
- When migrating from Search-only to PMax
- When auditing an underperforming PMax campaign

---

## Checklist

### Lead quality prerequisites (Critical)

> ⚠️ **These are non-negotiable:** Without lead quality tracking, PMax will generate low-quality leads.

The key is selecting the RIGHT primary conversion action. PMax optimizes toward your primary action, so choose a downstream quality signal (MQL, SQL, or Closed Deal) rather than raw form submissions.

- [ ] **Primary conversion action** set to a downstream quality signal (MQL, SQL, or Closed Deal)
- [ ] Offline conversion import configured for downstream signals
- [ ] Raw web conversions (forms, demos, trials) set as **secondary** (for measurement only)
- [ ] Conversion values assigned to downstream actions (higher value = higher quality)
- [ ] 30+ conversions/month on your **primary** conversion action

**Conversion action setup:**

| Signal | Role | Why |
|--------|------|-----|
| Closed Deal / Revenue | Primary (ideal) | Optimizes for actual business outcomes |
| SQL | Primary (good) | Optimizes for sales-qualified leads |
| MQL | Primary (acceptable) | Optimizes for marketing-qualified leads |
| Form submissions | Secondary | Track volume, but don't optimize toward |
| Demo requests | Secondary | Track volume, but don't optimize toward |
| Trial signups | Secondary | Track volume, but don't optimize toward |

> ⚠️ **If PMax optimizes toward form submissions, it will find the cheapest forms, often your lowest quality leads:** Always use a downstream quality signal as your primary conversion action, if conversion volume allows.

> ↪️ **Missing offline conversion import?** Do not launch PMax. Configure offline conversion import first. See [SOP – Set Up Offline Conversion Tracking](../sops/SOP – Set Up Offline Conversion Tracking.md).

### Audience signal prerequisites

- [ ] Customer Match list uploaded (1,000+ matched users)
- [ ] Website visitor audience created (1,000+ users in 30 days)
- [ ] Website converter audience created
- [ ] Custom segments prepared (competitor URLs, search terms)
- [ ] List sizes verified in Google Ads audience manager

**Audience signal inventory:**

| Signal type | List size | Status |
|-------------|-----------|--------|
| Customer Match | | Active / Pending / Not configured |
| Website visitors | | Active / Pending / Not configured |
| Converters | | Active / Pending / Not configured |
| Custom segments | | Active / Pending / Not configured |

> ↪️ **Minimum for launch:** At least one Customer Match or Website audience signal.

### Creative asset prerequisites

- [ ] Images prepared (minimum: 1 landscape, 1 square)
- [ ] Images meet specifications (1200×628, 1200×1200)
- [ ] Logo uploaded (square format)
- [ ] Headlines written (minimum 3, recommended 5-11)
- [ ] Long headlines written (minimum 1, recommended 2-5)
- [ ] Descriptions written (minimum 2, recommended all 5 slots)
- [ ] Own videos uploaded in horizontal, square, and vertical orientations (recommended, prevents auto-generated videos, up to 15 videos per orientation)
- [ ] Sitelinks prepared (6+)
- [ ] All assets approved (no policy violations)

**Asset inventory:**

| Asset type | Count | Meets minimum? |
|------------|-------|---------------|
| Landscape images | | Yes / No |
| Square images | | Yes / No |
| Portrait images | | Yes / No |
| Logo (square) | | Yes / No |
| Headlines | | Yes / No |
| Long headlines | | Yes / No |
| Descriptions | | Yes / No |
| Videos | | Yes / No |

> ↪️ **For asset specifications:** See [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md).

### Brand separation prerequisites

- [ ] Brand terms identified
- [ ] Brand Search campaign exists and is protected
- [ ] Brand exclusions prepared for PMax (cover only Search, Shopping, and YouTube search inventory, supplement with negative keyword lists)
- [ ] Branded searches mode on AI Max-enabled Search campaigns set to "unbranded only" (or a documented exception)
- [ ] Verification plan for post-launch brand query check

### Volume and budget prerequisites

- [ ] 30+ conversions/month on quality signal (to support learning)
- [ ] Daily budget set (sufficient for learning)
- [ ] Bid strategy selected appropriate to volume
- [ ] Learning period expectations set (2-4 weeks)

**Volume check:**

| Metric | Last 30 days | Meets threshold? |
|--------|--------------|------------------|
| Form submissions (secondary) | | |
| MQL/SQL/Closed Deals (primary) | | Yes (30+) / No |

### Landing page prerequisites

- [ ] Landing page exists for each asset group
- [ ] Landing page mobile-optimized
- [ ] Landing page loads <3 seconds
- [ ] Conversion tracking fires correctly on landing page
- [ ] Landing page matches ad messaging

---

## Quality gates

### Minimum requirements for launch

| **Gate** | **Threshold** |
|----------|---------------|
| Offline conversion import | Configured |
| Conversions/month (quality signal) | 30+ |
| Customer Match or Website audience | 1,000+ users |
| Images | 1 landscape + 1 square minimum |
| Headlines | 3 minimum |
| Brand exclusions | Configured |

### Recommended for optimal performance

| **Gate** | **Threshold** |
|----------|---------------|
| Quality signal value | MQL, SQL, or Closed Deal (with revenue) |
| Quality signal | SQL or revenue (not just MQL) |
| Conversions/month | 50+ |
| Customer Match | 5,000+ matched |
| Images | 5+ per format |
| Video | Own videos in horizontal, square, and vertical orientations (max 15 per asset group) |
| Headlines | All 15 slots filled |
| Descriptions | All 5 slots filled |
| Sitelinks | 6+ |

---

## Launch day checklist

After enabling the campaign:

- [ ] Campaign shows "Eligible" status
- [ ] All assets approved (no policy flags)
- [ ] Audience signals showing "Active"
- [ ] Budget spending as expected
- [ ] No unexpected errors in campaign diagnostics

---

## Post-launch monitoring (First 14 days)

- [ ] Day 1-3: Verify impressions appearing, no errors
- [ ] Day 3: Check asset approval status
- [ ] Day 7: First performance check (don't optimize yet)
- [ ] Day 7: Verify no brand queries appearing
- [ ] Day 14: Initial performance review
- [ ] Do NOT make major changes during learning period (2-4 weeks)

---

## Quick reference

| **Document** | **Relationship** |
|--------------|------------------|
| [PMax Structure Mental Model (Lead Gen/SaaS)](<../mental-models/PMax Structure Mental Model (Lead Gen-SaaS).md>) | Structure decisions |
| [PMax Asset Group Strategy Reference](../references/PMax Asset Group Strategy Reference.md) | Asset specifications |
| [Audience Signals Reference](../references/Audience Signals Reference.md) | Signal types and sizes |
| [Brand Separation Reference](../references/Brand Separation Reference.md) | Brand exclusion setup |
| [SOP – Launch PMax for Lead Gen/SaaS](../sops/SOP – Launch PMax for Lead Gen-SaaS.md) | Campaign setup |

---

## Version details

- **Version:** 3.0
- **Last Updated:** July 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
