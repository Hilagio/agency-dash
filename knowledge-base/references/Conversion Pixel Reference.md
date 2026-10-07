# Conversion Pixel Reference
Created: 2026-02-04
Updated: 2026-10-05

Support_ID: CHEATSHEET_13
Status: Done
Category: Operational
Reference Type: Cheat Sheets
Agent_Readable: Yes
Human_Facing: Yes
Domain: Measurement
Pillar: 5

## Purpose

Documents the Google Ads Conversion Tracking pixel (GACT), the three implementation methods, and Google Tag Manager setup essentials for firing conversion tags on website events.

---

## What this reference is / What this is NOT

**This reference:**

- Explains the three methods for implementing GACT on websites
- Documents GTM tag setup essentials (Google Tag, Conversion Linker, conversion tracking tag)
- Lists data layer requirements for purchase and lead events
- Covers debug and validation tooling

**This reference does NOT:**

- Provide step-by-step implementation walkthroughs (See: [SOP – Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md))
- Explain which tracking techniques to prioritize (See: [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md))
- Cover conversion action configuration options (See: [Conversion Action Reference](../references/Conversion Action Reference.md))
- Document Enhanced Conversions setup (See: [Enhanced Conversions Reference](../references/Enhanced Conversions Reference.md))

---

## Quick reference: implementation methods

| **Method** | **What it does** | **Setup requires** | **Best for** |
|------------|-----------------|-------------------|-------------|
| **Hardcoded gtag** | Places Google tag scripts directly in the website source code | Developer access to source code | Simple sites with minimal tracking needs |
| **Google Tag Manager (GTM)** | Loads GTM container on all pages, then manages all tags within the GTM interface | GTM account, container snippet on all pages, developer for data layer | Almost every implementation: flexible, organized, independent of developer |
| **CMS-specific plugins** | Uses platform-native plugins to handle tracking automatically | Plugin installation, configuration within CMS | Shopify, WooCommerce, Magento stores with well-supported plugins |

---

## Method 1: Hardcoded gtag

### How it works

A global site tag (gtag.js) loads on every page. Conversion event snippets fire on specific pages or events where conversions happen.

### Pros and cons

| **Pros** | **Cons** |
|----------|----------|
| Straightforward for simple setups | Requires developer for every change |
| No dependency on third-party tools | Difficult to debug |
| Direct, minimal latency | Not flexible for multi-platform tracking |
| | Must manually update when Google releases new features |

### When it fits

Hardcoded gtag fits a single conversion action on a simple site with no multi-platform tracking (Meta, LinkedIn, GA4). Past that point every change routes through a developer, which is what GTM removes.

---

## Method 2: Google Tag Manager (GTM)

### How it works

The GTM container snippet loads on every page (head and body). All tags, triggers, and variables are managed within the GTM web interface. After initial container installation, no developer is needed for tag changes.

### Pros and cons

| **Pros** | **Cons** |
|----------|----------|
| Full flexibility: add, edit, remove tags without developer | Requires basic GTM knowledge |
| Organized: all platform tags in one container | Possible minor latency from third-party script loading |
| Built-in debugging (Preview mode + Tag Assistant) | GTM account required |
| Easy to adopt new features (Enhanced Conversions, Cart Data) | |
| Version control and rollback built in | |

### When it fits

GTM fits every implementation, and it is the library default. It gives full control over tag management with no developer dependency after the container is installed.

### GTM setup essentials

Every GACT implementation via GTM requires these three components:

| **Component** | **Purpose** | **Trigger** |
|---------------|-----------|-------------|
| **Google Tag** | Establishes the connection between your website and Google Ads account. Loads the base Google tracking script. | All Pages (fires on every page load) |
| **Conversion Linker** | Sets first-party cookies that store ad click information (GCLID, GBRAID, WBRAID) for cross-page attribution. | All Pages (fires on every page load) |
| **Google Ads Conversion Tracking Tag** | Fires the actual conversion event with Conversion ID and Conversion Label. | Event-specific trigger (purchase event, form submit, button click, page view) |

> 💡 **A GA4 property linked to Google Ads shares one Google Tag between them.** The link lives at GA4 Admin > Google Ads Linking, and without it a site running both ends up with duplicate Google Tags.

### Key GTM concepts

| **Concept** | **Definition** |
|-------------|---------------|
| **Tags** | Code snippets that execute when triggered (e.g., Google Ads conversion tag, GA4 event tag) |
| **Triggers** | Conditions that cause tags to fire (e.g., page view, custom event, form submit, click) |
| **Variables** | Dynamic values used by tags and triggers (e.g., data layer variables, URL parameters, cookies) |
| **Data Layer** | A JavaScript object on the page that passes structured data to GTM (event names, transaction values, user data) |

### Conversion ID and Conversion Label

| **ID Type** | **Scope** | **Where to find** |
|-------------|----------|------------------|
| **Conversion ID** | Account-level: same for all conversion actions in the account | Goals > Summary > [Action] > Tag Setup > Google Tag Manager |
| **Conversion Label** | Action-level: unique per conversion action | Same location, unique per action |

Because the Conversion ID is account-level, a single GTM Constant variable serves every conversion tag in the container. Creating it is owned by [SOP - Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md), Phase 2A.3.

---

## Method 3: CMS-specific plugins

### How it works

Platform-specific plugins handle tag implementation, data layer creation, and advanced features automatically. The plugin is installed within the CMS and configured via its interface.

### Pros and cons

| **Pros** | **Cons** |
|----------|----------|
| Easy to install and configure | Relies on third-party developer for updates and security |
| Often includes advanced features out of the box (Enhanced Conversions, Cart Data) | Limited customization compared to GTM |
| User-friendly interfaces | May conflict with other plugins or themes |
| | Not all platforms have high-quality plugins |

### Recommended plugins by platform

| **Platform** | **Plugin** | **Notes** |
|-------------|-----------|----------|
| **WooCommerce** | SweetCode | Supports Google Ads, GA4, Meta, TikTok, Pinterest, LinkedIn in one plugin |
| **Shopify** | Native Google Channel or Shopify Pixels | Built-in integration handles most tracking |
| **Magento 2** | Varies | Fewer advanced features than WooCommerce plugins |

> ⚠️ **One multi-platform plugin, never several single-platform ones.** Multiple tracking plugins conflict with each other, break data layers, and cause duplicate firing.

### When it fits

A CMS plugin fits a popular ecommerce platform (Shopify, WooCommerce) with a well-supported plugin behind it. Customization beyond what the plugin exposes requires GTM alongside it.

---

## Data layer requirements

### Purchase event (e-commerce)

The purchase event data layer must include these variables for proper conversion tracking:

| **Variable** | **Required** | **Purpose** |
|-------------|-------------|-----------|
| `event: 'purchase'` | Yes | Identifies the event type |
| `transaction_id` | Yes | Unique order ID: prevents duplicate conversions |
| `value` | Yes | Order revenue (dynamic per transaction) |
| `currency` | Yes | Three-letter currency code (e.g., USD, EUR) |
| `items` | Recommended | Array of purchased products (enables Conversions with Cart Data) |

### Lead event (lead gen)

| **Variable** | **Required** | **Purpose** |
|-------------|-------------|-----------|
| `event: 'form_submit'` | Yes | Identifies the form submission event |
| `value` | Optional | Estimated lead value (if known) |
| User-provided data (email, phone) | Recommended | Enables Enhanced Conversions |

---

## Debug and validation methods

| **Tool** | **What it does** | **When to use** |
|---------|-----------------|----------------|
| **GTM Preview Mode** | Shows which tags fired, which did not, what triggered them, and data layer contents in real time | During setup and after any tag changes |
| **Google Tag Assistant** | Chrome extension that communicates with GTM Preview Mode for cross-tab debugging | Alongside GTM Preview Mode |
| **Conversion Action Diagnostics** | Shows tag status (active, inactive, no recent conversions) and recent conversion data in Google Ads | After publishing tags: verify conversions are being recorded |
| **Real-time reports (GA4)** | Confirms events are arriving in GA4 in real time | When using GA4 alongside GACT |
| **Chrome DevTools (Network tab)** | Shows HTTP requests to Google servers when tags fire | Troubleshooting firing issues |
| **Data Layer Inspector** | View data layer pushes and variable values in real time | Verifying data layer structure and values |

> ↪️ **Validating an implementation:** the pass/fail items live in [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md). One timing note applies to the last of them: conversion action diagnostics can take up to 24 hours to move a tag to "Active".

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|-------------|-------------|---------|
| Missing Conversion Linker tag | Click IDs not stored in first-party cookies: conversions cannot be attributed | Add Conversion Linker tag firing on All Pages |
| Duplicate Google Tags | Multiple Google Tags from separate GA4 and Google Ads implementations cause data conflicts | Link GA4 to Google Ads to share one Google Tag |
| Hardcoded conversion value | Every transaction reports the same value instead of actual revenue | Use data layer variable for dynamic value |
| Missing transaction_id | Duplicate conversions counted when users refresh the thank-you page | Pass unique transaction_id with every purchase event |
| Tag fires on wrong trigger | Conversion tag fires on page load instead of the conversion event | Use event-specific trigger (purchase, form_submit), not All Pages |
| GTM container not on all pages | Tags only fire on pages where the container is installed | Verify GTM snippet is in the head and body of every page |
| Not debugging before publishing | Broken tags go live, causing data loss or over-counting | Always use GTM Preview Mode before publishing |
| Plugin conflict with GTM | Both plugin and GTM fire the same conversion tag | Choose one method: plugin or GTM, not both for the same platform |

---

## Related documents

| **Document** | **Relationship** |
|--------------|------------------|
| [Measurement Maturity Mental Model](../mental-models/Measurement Maturity Mental Model.md) | Framework for prioritizing which tracking techniques to implement |
| [Conversion Action Reference](../references/Conversion Action Reference.md) | Configuration options for conversion actions (primary/secondary, attribution, windows) |
| [Server-Side Tagging Reference](../references/Server-Side Tagging Reference.md) | Next-level implementation for preventing data loss from ad blockers |
| [Enhanced Conversions Reference](../references/Enhanced Conversions Reference.md) | Supplementing GACT with hashed first-party data |
| [Conversion Volume Thresholds Reference](../references/Conversion Volume Thresholds Reference.md) | Minimum volume requirements that depend on accurate pixel implementation |
| [Conversion Tracking Setup Checklist](../checklists/Conversion Tracking Setup Checklist.md) | Validation: the pass/fail gate for a pixel implementation |
| [SOP - Set Up Google Ads Conversion Tracking](../sops/SOP – Set Up Google Ads Conversion Tracking.md) | Execution: container, tags, triggers and data layer |

---

## Version details

- **Version:** 2.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
