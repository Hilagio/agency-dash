# Upper Funnel Campaign Launch Checklist
Created: 2026-02-05

Support_ID: CHECKLIST_22
Status: Done
Category: Operational
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Upper Funnel
Pillar: 6

## Purpose

Validates that Demand Gen and Video campaigns are properly configured before launch, covering targeting, exclusions, creative, and settings. Demand Gen serves Google Display Network inventory, so GDN placement and exclusion checks live here.

---

## What this checklist validates

This checklist confirms:

- Audience targeting is correctly configured
- Content exclusions and brand safety settings are in place
- Creative assets meet specifications
- Campaign settings match the campaign goal
- Exclusion cascades prevent wasted spend

This checklist does **NOT**:

- Validate ad copy quality (See: [Headline Quality Checklist](../checklists/Headline Quality Checklist.md), [Description Quality Checklist](../checklists/Description Quality Checklist.md))
- Validate audience segment configuration (See: [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md))
- Validate image or video creative quality (See: [Image Creative Quality Checklist](../checklists/Image Creative Quality Checklist.md), [Video Creative Quality Checklist](../checklists/Video Creative Quality Checklist.md))

---

## When to use

Run this checklist:

- Before launching any Demand Gen or Video campaign
- When reactivating a paused upper funnel campaign
- During quarterly upper funnel campaign audits

---

## Checklist

### Campaign Structure

- [ ] Campaign goal matches business objective (documented objective exists with measurable KPI target)
- [ ] Campaign type matches goal (Video for awareness, Demand Gen for conversions)
- [ ] Campaign naming follows account convention
- [ ] Start and end dates are correct (if applicable)

### Targeting Configuration

- [ ] Audiences are added with correct targeting mode (Targeting for remarketing, Observation for data collection on prospecting segments)
- [ ] Audience segments match campaign tier (remarketing, prospecting, or awareness)
- [ ] Correct feature identified per campaign type: optimized targeting (Demand Gen) vs audience expansion (Video reach, Video views)
- [ ] Expansion feature is OFF on every remarketing campaign
- [ ] Every prospecting campaign has a documented expansion setting
- [ ] Audience size is sufficient for delivery (1,000+ users for remarketing, 5,000+ for lookalike seeds)
- [ ] Geographic targeting is correct
- [ ] Language targeting is correct
- [ ] Device targeting adjustments are set (if applicable)

### Content Targeting (Video, Demand Gen)

- [ ] Every targeted placement has a documented relevance decision (if using placement targeting)
- [ ] Every targeted topic maps to the product or service category (if using topic targeting)
- [ ] Content keywords are themed and limited to 5-20 per ad group (if using)
- [ ] Combining content and audience targeting has a documented decision

### Exclusions (Mandatory)

- [ ] Recent converters excluded (7-90 days based on sales cycle)
- [ ] Mobile apps excluded (unless app-focused campaign)
- [ ] Made-for-kids content excluded
- [ ] Parked domains and error pages excluded
- [ ] Prospecting campaigns exclude all remarketing audiences
- [ ] Account-level content suitability settings are configured

### Brand Safety (Mandatory)

- [ ] Every sensitive content category on the exclusion list is excluded
- [ ] Inventory type is Moderate or Limited on every Video campaign
- [ ] DL-MA is excluded, or an exception is documented
- [ ] Placement exclusion list includes known low-quality sites

### Creative Assets

- [ ] At least 3 creative variations are uploaded per format
- [ ] All required asset sizes are included (See: [Image Creative Reference](../references/Image Creative Reference.md))
- [ ] Video lengths match the goal: under 15s for awareness, 15-60s for consideration
- [ ] Creative matches audience temperature (cold audiences see problem/awareness messaging, warm audiences see offer/urgency messaging)
- [ ] Landing page URLs are correct and working
- [ ] Call-to-action matches campaign goal

### Bidding and Budget

- [ ] Bid strategy matches campaign goal and volume expectations
- [ ] Target CPA/ROAS is set based on unit economics (if applicable)
- [ ] Daily budget clears the Demand Gen serving floor: 10x target CPA, minimum €100/day on Maximize conversions
- [ ] Budget is sufficient to exit learning phase (50+ conversions/month for Demand Gen)
- [ ] Every bid adjustment has a documented reason (if using manual bidding)

### Tracking and Measurement

- [ ] Conversion tracking is verified working
- [ ] Correct conversion actions are selected for campaign optimization
- [ ] View-through conversion window is set to the documented value for the campaign type
- [ ] View-through conversion optimization is switched OFF (a new Demand Gen campaign starts with it ON)
- [ ] Attribution model is consistent with other campaigns

### Final Verification

- [ ] Campaign preview shows ads rendering correctly
- [ ] No policy violations flagged
- [ ] Launch date and budget confirmed with stakeholder (if applicable)

---

## Campaign-Specific Checks

### Video Campaigns

- [ ] Video format matches campaign subtype (skippable vs. non-skippable)
- [ ] Headline and description are added to unlock in-feed and Shorts serving
- [ ] Companion banner uploaded (if applicable)
- [ ] Frequency capping is set (2-3 impressions/user/day typical)
- [ ] YouTube channel is linked

### Demand Gen Campaigns

- [ ] Both image and video assets included
- [ ] Image and display assets have all asset types for Google Display Network inventory (images, logos, headlines, descriptions)
- [ ] Lookalike segments use high-quality seed lists: converters or high-value customers, not all visitors (if prospecting)
- [ ] Lookalike reach is set to Balanced initially (Narrow for tight budgets)
- [ ] New customer acquisition goal is not combined with Lookalike segments
- [ ] Every campaign with optimized targeting ON has a documented decision accepting serving outside its demographic selections
- [ ] Feed is connected for dynamic creative and dynamic remarketing (if ecommerce)
- [ ] Feed carries at least 4 approved, in-stock products across at least 4 Group IDs (if using a feed)
- [ ] Frequency management is set (3-5 impressions/user/day typical)

---

## Quick Reference

| Document | Relationship |
|----------|--------------|
| [Upper Funnel Campaign Structure Mental Model](../mental-models/Upper Funnel Campaign Structure Mental Model.md) | Framework for campaign structure decisions |
| [Audience Targeting Reference](../references/Audience Targeting Reference.md) | Targeting options and settings |
| [Content Targeting Reference](../references/Content Targeting Reference.md) | Content targeting and exclusions |
| [Audience Targeting Launch Checklist](../checklists/Audience Targeting Launch Checklist.md) | Audience targeting setup validation |
| [Content Exclusion Guidelines](../guidelines/Content Exclusion Guidelines.md) | Recommended exclusion settings |
| [Image Creative Quality Checklist](../checklists/Image Creative Quality Checklist.md) | Image asset validation |
| [Video Creative Quality Checklist](../checklists/Video Creative Quality Checklist.md) | Video asset validation |
| [SOP – Launch a Video Campaign](../sops/SOP – Launch a Video Campaign.md) | Video campaign setup |
| [SOP – Launch a Demand Gen Campaign](../sops/SOP – Launch a Demand Gen Campaign.md) | Demand Gen campaign setup |

---

## Version details

- **Version:** 5.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
