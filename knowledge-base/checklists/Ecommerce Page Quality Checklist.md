# Ecommerce Page Quality Checklist
Created: 2026-02-04

Support_ID: CHECKLIST_14
Status: Done
Category: Creative
Reference Type: Checklist
Agent_Readable: Yes
Human_Facing: Yes
Domain: Landing Pages
Pillar: 2

## Purpose

Validates that ecommerce pages (product pages, category pages, cart, checkout, homepage, and dedicated ecommerce LPs) meet conversion requirements before launch or after audit.

---

## What this checklist validates

This checklist confirms:

- Each page type has its required sections in the correct hierarchy
- Trust, social proof, and offer elements are present where they matter
- Friction points are minimized in cart and checkout flows
- Mobile experience meets ecommerce-specific requirements
- Cross-page consistency (trust signals, shipping info, return policy)

This checklist does **NOT:**

- Validate ad copy or headline quality (See: [Headline Quality Checklist](../checklists/Headline Quality Checklist.md))
- Validate LP section patterns for Lead Gen or SaaS (See: [LP Quality Checklist](../checklists/LP Quality Checklist.md))
- Provide section patterns or examples (See: [Ecommerce Page Section Catalog](../catalogs/Ecommerce Page Section Catalog.md))
- Cover tracking or measurement setup (See: measurement-related checklists)

---

## When to use

Run this checklist:

- After building a new ecommerce page (product page, category page, dedicated LP)
- After redesigning or optimizing cart/checkout flow
- When auditing an existing ecommerce site for conversion issues
- Before launching a paid traffic campaign to an ecommerce destination

Select the page-type sections that apply. Run the Cross-page section for every audit.

---

## Cross-page checks (all page types)

### Performance and mobile

- [ ] Main pages load in under 3 seconds on mobile (test with PageSpeed Insights or WebPageTest)
- [ ] All pages are fully responsive: no horizontal scrolling, no cut-off content on mobile
- [ ] Touch targets (buttons, links, form fields) are minimum 44x44px with adequate spacing
- [ ] Images are optimized: compressed, lazy-loaded below the fold, WebP or modern format
- [ ] No intrusive pop-ups or interstitials that block content on mobile within the first 5 seconds

### Trust and policy consistency

- [ ] Return/refund policy uses the same wording across product page, cart, and checkout
- [ ] Shipping information (cost, delivery timeline, free shipping threshold) is consistent across all pages
- [ ] Payment method logos appear in the same order on cart, checkout, and footer
- [ ] Contact method (chat, phone, email) is accessible from every page
- [ ] SSL certificate is active and lock icon is visible in the browser

### Navigation and UX

- [ ] Logo links to homepage from every page
- [ ] Breadcrumbs are present on category and product pages
- [ ] Cart widget in header shows item count and is accessible from every page
- [ ] Search bar is visible and functional on every page (with auto-suggest)
- [ ] Clickable elements look clickable (hover states, button styling, underlined links)
- [ ] Non-clickable elements do not look clickable (no misleading styling)

---

## Homepage checks

### Value proposition and hero

- [ ] Value proposition is instantly clear: visitor knows what the store sells within 3 seconds
- [ ] Primary CTA is visible above the fold with a specific destination (not "Learn more")
- [ ] Hero image or video reinforces the brand and product range (not generic stock)

### Navigation and discovery

- [ ] Main product categories are visible with descriptive images and clear labels
- [ ] Category labels are descriptive (not clever/ambiguous)
- [ ] Featured products section shows bestsellers, new arrivals, or curated collection

### Offers and social proof

- [ ] Site-wide offer bar is present with specific offer, urgency trigger, and linked CTA
- [ ] Store-level social proof is visible: third-party ratings (Trustpilot), press logos, or customer count
- [ ] Brand story or mission is present (brief, below the fold)

---

## Category page checks

### Header and orientation

- [ ] Category name (H1) is descriptive and matches the visitor's search intent
- [ ] Breadcrumbs show the category hierarchy
- [ ] Product count is visible ("47 products")

### Filtering and sorting

- [ ] Sort options are available: bestsellers, price (low/high), newest, top rated
- [ ] Filters are visible by default on desktop (not hidden behind a button)
- [ ] Applied filters are shown as removable chips/tags
- [ ] Filters update results dynamically without full page reload
- [ ] Selecting zero-result filter combinations is prevented or handled gracefully

### Product cards

- [ ] Each card shows: product image, title, price (current + original if discounted), star rating, review count
- [ ] Product images are consistent in size, style, and background
- [ ] Variant availability is visible on cards (e.g. "5 colors" or color swatches)
- [ ] Social proof badges are present on relevant cards: "Bestseller", "New", "Trending"
- [ ] Low-stock indicators are shown where genuine: "Only 3 left"
- [ ] Grid layout is used for visual products, list layout for specification-driven products

---

## Product page checks

### Product identity (above the fold)

- [ ] Image gallery has minimum 4-5 images: hero shot, angles, lifestyle, detail, scale reference
- [ ] Gallery supports zoom on desktop and pinch-to-zoom on mobile
- [ ] Gallery includes video or 360-degree view (if applicable)
- [ ] Gallery updates when visitor selects a different variant (color, style)
- [ ] Product title is descriptive and includes key attributes
- [ ] Star rating and review count are visible near the product title, linked to full reviews

### Offer stack

- [ ] Price is prominent and placed near the add-to-cart button
- [ ] If discounted: original price (strikethrough), new price, and savings amount/percentage are all shown
- [ ] Shipping information is visible near the CTA: cost, estimated delivery, or free shipping threshold
- [ ] Return/guarantee policy is summarized near the CTA (not just in footer)
- [ ] Stock availability is shown: "In stock", "Ships within 24h", or "Only X left"

### Add-to-cart action

- [ ] Add-to-cart button is the most visually prominent element on the page
- [ ] Variant selectors (size, color) are functional and update gallery/price in real time
- [ ] Size chart or measurement guide is accessible near size selector (for sized products)
- [ ] Quantity selector is present with simple +/- controls
- [ ] Express pay options (Apple Pay, Google Pay, Shop Pay) are visible below the main CTA
- [ ] Clear feedback is given after adding to cart (button state change, mini-cart update)
- [ ] Sticky CTA bar appears on mobile when scrolling past the main add-to-cart section

### Social proof

- [ ] Customer reviews are present with star ratings, review text, and verified buyer badges
- [ ] Review sorting/filtering is available: most helpful, most recent, by star, photos only
- [ ] Customer photos from verified buyers are displayed
- [ ] Review count is sufficient to be credible (if < 5 reviews, supplement with other trust signals)

### Product details

- [ ] Product description leads with benefits, not just features/specs
- [ ] Technical specifications are in a scannable table format
- [ ] FAQ section addresses product-specific questions
- [ ] Content sections are expandable/collapsible on mobile

### Cross-sell and trust

- [ ] "Frequently bought together" or "Complete the set" section is present below the main CTA
- [ ] Related/recommended products section shows 4-6 relevant alternatives
- [ ] Trust reinforcement section includes: return policy, secure checkout badge, contact option

---

## Dedicated ecommerce LP checks

### Structure

- [ ] No site navigation: no header nav, no footer links, no exits except the CTA
- [ ] Page follows Ecommerce Persuasion Sequence: Product Showcase > Customer Evidence > Product Benefits > The Details > Purchase Confidence > Act Now > Complete Your Purchase
- [ ] Product image/video is the hero visual (not a generic brand image)
- [ ] Price is visible above the fold
- [ ] Multiple CTAs appear throughout the page (minimum: above fold, after benefits, page bottom)

### Persuasion elements

- [ ] Benefits section translates features into visitor outcomes
- [ ] Social proof includes curated best reviews, customer photos, and/or before/after results
- [ ] Objection handling covers: return policy, shipping, sizing/fit, "what's in the box"
- [ ] Urgency is legitimate: stock scarcity, shipping cutoff, or time-limited promotion
- [ ] Final CTA section recaps value, shows price, and includes express checkout + guarantee reminder

### Dedicated LP vs product page decision

- [ ] If running a promotion/seasonal offer: dedicated LP is used (not the product page)
- [ ] If traffic is from Shopping PLAs: landing on the product page (not a dedicated LP)
- [ ] If running cold traffic from Display/YouTube/Demand Gen: dedicated LP is used

---

## Cart page checks

### Order summary

- [ ] Each item shows: thumbnail (matching variant), name, variant details, quantity, price
- [ ] Order total is broken down: subtotal, shipping estimate, tax, discounts, total
- [ ] No charges are hidden or appear only at checkout
- [ ] Estimated delivery date is shown per item or for the order

### Edit and adjust

- [ ] Visitor can change quantity with live total update (no page reload)
- [ ] Visitor can remove items with an undo option
- [ ] "Save for later" or wishlist option is available

### Shipping and promotions

- [ ] Free shipping progress bar is present (if free shipping threshold exists)
- [ ] Applied discounts are visible with the code name and savings amount
- [ ] Coupon field is present but subdued (collapsible text link, not a prominent input)

### Cross-sell

- [ ] Cart cross-sell shows 2-3 low-cost, complementary products with one-click add
- [ ] If below free shipping threshold: suggested product to qualify is shown

### CTA and trust

- [ ] "Proceed to checkout" button is the most prominent element, placed at top and bottom
- [ ] Express pay buttons (Apple Pay, Google Pay, PayPal) are visible
- [ ] Trust badges and payment method logos are near the checkout CTA
- [ ] Return policy reminder is visible

---

## Checkout page checks

### Guest checkout and access

- [ ] Guest checkout is available as the default (no forced registration)
- [ ] Email address is the first field requested (enables abandoned checkout recovery)
- [ ] Returning customer login is available but does not block the guest path
- [ ] Express checkout options (Apple Pay, Google Pay, Shop Pay) are prominent above the form

### Form design

- [ ] Form uses single-column layout
- [ ] Field count is minimized: only fields required to complete the purchase
- [ ] "Full name" is a single field (not separate first/last unless legally required)
- [ ] "Billing same as shipping" checkbox is present and checked by default
- [ ] Smart defaults are used: auto-detect country, auto-fill city from postal code
- [ ] Inline validation is active: green/red feedback as the visitor fills each field
- [ ] Error messages clearly state what is wrong and how to fix it
- [ ] Numeric keyboard appears for number fields on mobile (postal code, phone, credit card)

### Order summary visibility

- [ ] Order summary with item thumbnails is visible alongside the form (sidebar on desktop, collapsible on mobile)
- [ ] Total breakdown shows: subtotal, shipping, tax, discounts, final total
- [ ] Total matches what was shown on the cart page (no surprises)

### Payment

- [ ] Multiple payment methods are offered: credit card, PayPal, plus at least one additional option
- [ ] Buy-now-pay-later option is available for products over €50 (Klarna, Afterpay, etc.)
- [ ] Payment method logos are visible near the payment section

### Trust and completion

- [ ] No navigation links: only "back to cart" as an exit
- [ ] SSL/security badge is visible near payment fields
- [ ] Guarantee/return policy reminder is near the place order button
- [ ] Contact method (chat, phone) is accessible from checkout
- [ ] Place order button text is clear: "Place order" or "Pay $X" (not "Submit")
- [ ] No surprise charges appear at the final step
- [ ] Order confirmation page loads immediately with clear success feedback

---

## Quick reference

| Document | Relationship |
|----------|-------------|
| [Ecommerce Conversion Engine Mental Model](../mental-models/Ecommerce Conversion Engine Mental Model.md) | Defines page types, hierarchies, and conversion logic |
| [Ecommerce Page Section Catalog](../catalogs/Ecommerce Page Section Catalog.md) | Section patterns and examples per page type |
| [LP Quality Checklist](../checklists/LP Quality Checklist.md) | Validation for Lead Gen/SaaS LPs |
| [SOP – Build a High-Converting Product Page](../sops/SOP – Build a High-Converting Product Page.md) | Uses this checklist as validation gate |
| [SOP – Build a High-Converting Ecommerce Landing Page](../sops/SOP – Build a High-Converting Ecommerce Landing Page.md) | Uses this checklist as validation gate |
| [SOP – Optimize Cart and Checkout Flow](../sops/SOP – Optimize Cart and Checkout Flow.md) | Uses this checklist as validation gate |

---

## Related Documents

| Document | Relationship |
|----------|-------------|
| [Ecommerce Conversion Engine Mental Model](../mental-models/Ecommerce Conversion Engine Mental Model.md) | Framework for understanding ecommerce page types and their roles |
| [Ecommerce Page Section Catalog](../catalogs/Ecommerce Page Section Catalog.md) | Section patterns to implement when checks fail |
| [Conversion Amplifier Mental Model](../mental-models/Conversion Amplifier Mental Model.md) | Sister framework for Lead Gen/SaaS landing pages |
| [LP Hierarchy Mental Model](../mental-models/LP Hierarchy Mental Model.md) | Sister framework: 7-section hierarchy for Lead Gen/SaaS LPs |

---

## Version

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-01 | Initial publication |

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
