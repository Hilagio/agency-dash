# Server-Side Tagging Reference
Created: 2026-02-04
Updated: 2026-02-05

Support_ID: CHEATSHEET_14
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents server-side tagging (SST) architecture, the three implementation methods, and when the infrastructure investment is justified by data quality improvements.

---

## What this reference is / What this is NOT

**This reference:**

- Explains how server-side tagging works and why it prevents data loss
- Compares client-side vs. server-side tracking architecture
- Documents three implementation methods with infrastructure requirements
- Provides cost and threshold guidance for when to implement

**This reference does NOT:**

- Provide step-by-step SST setup instructions (See: [SOP – Implement Server-Side Tagging](../sops/SOP – Implement Server-Side Tagging.md))
- Explain which tracking techniques to prioritize (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))
- Cover conversion pixel setup (See: [Conversion Pixel Reference](../references/Conversion Pixel Reference.md))
- Document Enhanced Conversions configuration (See: [Enhanced Conversions Reference](../references/Enhanced Conversions Reference.md))

---

## Quick reference: client-side vs. server-side

| **Dimension** | **Client-side tracking** | **Server-side tracking** |
|--------------|-------------------------|------------------------|
| **How data flows** | Browser loads tags, sends HTTP requests directly to platform servers (Google, Meta, etc.) | Browser sends data to your server container, server container forwards to platform servers |
| **Ad blocker impact** | Tags blocked: conversions lost | Requests go to your own subdomain: ad blockers cannot distinguish tracking from regular site traffic |
| **Cookie restrictions** | Third-party cookies blocked by browsers (Safari, Firefox), first-party cookies capped at 7 days (ITP) | Server sets first-party cookies on your domain: no browser restrictions apply |
| **Browser limitations** | JavaScript must execute in user's browser: page load, extensions, and privacy settings all interfere | Processing moves to your server: no dependency on browser behavior |
| **Page speed** | Multiple third-party scripts slow page load | Tags fire server-side: fewer scripts on the page, faster load times |
| **Data accuracy** | 15-30% data loss common due to blockers, consent, and cookie expiration | Recovers most of the otherwise lost data: accuracy close to backend truth |
| **Privacy control** | Data sent directly from browser to third parties | You control what data leaves your server: full first-party data ownership |
| **Complexity** | Low: add tags to GTM web container | Medium-high: requires server infrastructure, custom subdomain, SSL |

---

## How server-side tagging works

### Architecture flow

1. **User visits your website** and triggers an event (page view, purchase, form submit)
2. **GTM web container** collects the event data and sends it to your **server container** (hosted on your subdomain)
3. **Server container** receives the data, processes it, and forwards it to the destination platforms (Google Ads, GA4, Meta, etc.)
4. **Platform servers** receive the data as if it came from a first-party source on your domain

### Why this prevents data loss

| **Data loss cause** | **Client-side impact** | **Server-side solution** |
|--------------------|----------------------|------------------------|
| Ad blockers (uBlock, Ghostery) | Block requests to known tracking domains (google-analytics.com, googleadservices.com) | Requests go to your subdomain (e.g., sst.yourdomain.com): undetectable by ad blockers |
| Safari ITP (Intelligent Tracking Prevention) | Caps first-party JavaScript cookies at 7 days | Server sets HTTP-only first-party cookies: not subject to ITP restrictions |
| Firefox ETP (Enhanced Tracking Protection) | Blocks known third-party trackers | Same subdomain approach bypasses detection |
| Browser extensions | Block or modify tracking scripts | Scripts run server-side, not in the browser |
| Slow connections / page abandonment | Tags never load if user leaves before scripts execute | Lighter client-side load means faster tag execution |

---

## Three implementation methods

### Method 1: Custom implementation

| **Aspect** | **Details** |
|-----------|-----------|
| **How it works** | Build your own server-side tracking solution from scratch |
| **Infrastructure** | Your own server (any cloud provider or on-premises) |
| **Flexibility** | Maximum: full control over data processing, routing, and storage |
| **Technical requirement** | High: requires backend development expertise |
| **Best for** | Enterprise accounts with dedicated development teams |
| **Typical cost** | Variable: depends on infrastructure and development hours |

### Method 2: GTM Server Container + Google Cloud Platform

| **Aspect** | **Details** |
|-----------|-----------|
| **How it works** | Google Tag Manager provides a server-side container that runs on Google Cloud Platform (GCP) App Engine |
| **Infrastructure** | GCP App Engine instance, custom subdomain, SSL certificate |
| **Flexibility** | High: native GTM interface for tag management, supports custom templates |
| **Technical requirement** | Medium-high: GCP setup, DNS configuration, GTM server container configuration |
| **Best for** | Accounts that want Google-native infrastructure with full GTM capabilities |
| **Typical cost** | GCP hosting scales with traffic: €50-500+/month depending on volume |

### Method 3: GTM Server Container + Third-party middleware

| **Aspect** | **Details** |
|-----------|-----------|
| **How it works** | Uses a middleware service (e.g., Stape.io) to host and manage the GTM server container instead of GCP directly |
| **Infrastructure** | Middleware handles hosting, subdomain setup, and SSL: you configure tags in GTM |
| **Flexibility** | Medium-high: same GTM server container features, simplified hosting |
| **Technical requirement** | Medium: easier setup than raw GCP, plug-and-play hosting |
| **Best for** | Most accounts: simplifies infrastructure while preserving full GTM server-side capabilities |
| **Typical cost** | Stape.io plans start at ~€20/month, scale with request volume |

> 💡 **Method 3 is the recommended approach for most accounts:** Third-party middleware like Stape.io handles the infrastructure complexity (hosting, scaling, SSL, subdomain) while you focus on tag configuration in the familiar GTM interface.

---

## Infrastructure requirements

| **Requirement** | **Purpose** | **Details** |
|----------------|-----------|-----------|
| **Server container hosting** | Runs the server-side GTM container | GCP App Engine, Stape.io, or custom server |
| **Custom subdomain** | Routes tracking requests through your own domain | e.g., `sst.yourdomain.com` or `data.yourdomain.com` |
| **SSL certificate** | Secures the connection between client and server container | Required for the custom subdomain: most hosting providers include this |
| **DNS configuration** | Points the subdomain to the server container | A/CNAME record pointing to your hosting provider |
| **GTM web container** | Sends data from the browser to the server container | Existing web container with transport URL configured |

---

## Benefits summary

| **Benefit** | **Impact** |
|------------|----------|
| **Prevent data loss from ad blockers** | Recover 10-20% of otherwise lost conversions in markets with high ad blocker usage |
| **Overcome cookie restrictions** | First-party server-set cookies persist beyond browser-imposed limits (ITP, ETP) |
| **Faster page loads** | Processing shifts from user's device to server: fewer scripts, faster rendering |
| **Improved data accuracy** | Conversion data closer to backend reality: better Smart Bidding input |
| **First-party data control** | All data passes through your server: you decide what gets forwarded to platforms |
| **Multi-platform support** | One server container can forward data to Google Ads, GA4, Meta, TikTok, LinkedIn |

---

## Cost considerations

| **Factor** | **Details** |
|-----------|-----------|
| **Hosting costs** | Scale with traffic volume: more requests = higher hosting bill |
| **Middleware subscription** | Stape.io and similar services charge monthly based on request tiers |
| **Setup time** | Initial configuration: 4-8 hours for middleware, 8-20 hours for custom GCP |
| **Maintenance** | Minimal ongoing: server container updates, tag adjustments |
| **ROI calculation** | Compare: (recovered conversions x average conversion value) vs. (monthly hosting + setup cost) |

---

## When to implement

### Implement SST when

| **Condition** | **Why** |
|--------------|--------|
| Monthly ad spend exceeds €5,000 | Data quality ROI justifies infrastructure cost at this threshold |
| Ad blocker rates are high in your market | Northern Europe, tech-savvy audiences, B2B: blocker rates can exceed 25% |
| Significant gap between Google Ads reported conversions and backend data | SST closes the gap by recovering lost tracking events |
| Running multi-platform campaigns (Google + Meta + others) | One server container handles all platforms |
| Privacy regulations require first-party data control | SST keeps data on your infrastructure before forwarding |

### Do not prioritize SST when

| **Condition** | **Why** |
|--------------|--------|
| Monthly ad spend is below €2,000 | Infrastructure costs may exceed data quality gains |
| GACT pixel is not yet implemented correctly | Fix the foundation first (See: [Conversion Pixel Reference](../references/Conversion Pixel Reference.md)) |
| No discrepancy between Google Ads and backend data | SST adds complexity with minimal benefit if tracking is already accurate |
| No developer or technical resource available | SST requires initial technical setup: budget for it or use middleware |

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Implementing SST before fixing basic GACT setup | Amplifies existing tracking errors instead of improving data | Get GACT working correctly first, then layer on SST |
| Not setting up custom subdomain | Requests still go to third-party domains: ad blockers can still block them | Configure a subdomain on your root domain (sst.yourdomain.com) |
| Missing SSL certificate on subdomain | Browsers block insecure requests: tags fail silently | Ensure SSL is active on the custom subdomain |
| Not configuring Conversion Linker in server container | Click attribution breaks despite server-side setup | Add Conversion Linker tag in both web and server containers |
| Ignoring hosting costs at scale | Surprise bills when traffic spikes | Monitor request volume, set up billing alerts, choose appropriate hosting tier |
| Running both client-side and server-side tags for the same platform | Double-counting conversions | Remove client-side platform tags when server-side equivalents are active |
| Not testing with GTM Preview Mode for server container | Tags deployed without verification | Use both web and server container Preview Mode to debug the full chain |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Framework for when to implement SST in the tracking maturity journey |
| [Conversion Pixel Reference](../references/Conversion Pixel Reference.md) | Foundation: GACT pixel setup must be correct before adding SST |
| [Enhanced Conversions Reference](../references/Enhanced Conversions Reference.md) | SST and Enhanced Conversions work together to maximize data recovery |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Conversion action configuration applies regardless of client-side or server-side implementation |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | SST helps accounts reach conversion volume thresholds by recovering lost data |

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
