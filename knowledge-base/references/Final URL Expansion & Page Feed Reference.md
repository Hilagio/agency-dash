# Final URL Expansion & Page Feed Reference
Created: 2026-02-04
Updated: 2026-10-05

Support_ID: CHEATSHEET_33
Category: Targeting
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Cheat Sheets
Agent_Readable: Yes
Status: Done

## Purpose

Documents how final URL expansion selects landing pages, the controls that constrain it (URL inclusions, URL exclusions, page feeds), page feed CSV specifications, custom label syntax, upload methods, and page exclusion rules. Final URL expansion is the keywordless layer of AI Max for Search and the control surface that replaced standalone keywordless ad targeting. It is also available in Performance Max.

---

## What this reference is / What this is NOT

**This reference:**

- Documents how final URL expansion chooses pages and how each control constrains it
- Specifies page feed CSV format, custom label rules, and upload methods
- Covers page exclusion options and recommended exclusion patterns
- Rates each control based on precision and reliability

**This reference does NOT:**

- Provide strategy for when to enable final URL expansion (See: [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md))
- Provide step-by-step setup instructions (See: [SOP – Configure AI Max for Search](<../sops/SOP – Configure AI Max for Search.md>))
- Cover ad copy or text customization rules
- Explain bidding strategy selection

---

## How final URL expansion works

Final URL expansion lets Google send a query to the most relevant landing page on your site, then generate matching headlines and descriptions for it (text customization, which is required when final URL expansion is on). It reads your landing page content and your ad group content (assets and keywords) to decide what to serve.

Two facts shape how you control it:

| Fact | Consequence |
|---|---|
| It is enabled at the campaign level | Once on, it applies to every ad group in the campaign except where you constrain it |
| It is constrained by inclusions, exclusions, and page feeds | Without constraints, any indexed page (minus exclusions) is eligible, so a query can land in any ad group |

> ⚠️ **Final URL expansion is a campaign-level switch, not an ad-group one.** Turning it on affects all ad groups. To direct it, add ad-group URL inclusions (which override expansion for that ad group), campaign URL exclusions (which block pages everywhere), or a page feed (which limits eligible pages to the feed).

---

## Control quick reference

| **Control** | **Level** | **Precision** | **Recommendation** |
|---|---|---|---|
| Default expansion (no constraints) | Campaign | None | Not recommended for production |
| URL exclusions | Campaign | High (blocks pages) | Required: block utility pages |
| URL inclusions | Ad group | High (steers expansion) | Recommended for themed ad groups |
| Page feed (custom labels) | Campaign feed + ad group labels | Highest | Recommended for catalogs and tight control |

> 💡 **Start with campaign URL exclusions for safety, then add ad-group URL inclusions to steer themed ad groups. Move to page feeds when you need catalog-scale filtering, automation, or label-based segmentation.**

---

## URL exclusions (campaign level)

### What it does

Blocks specific pages from ever serving as a final URL expansion landing page, regardless of how relevant Google judges them. Applies across the whole campaign.

### Setup

Add exclusions at the campaign level by URL pattern.

### Rules

| **Rule** | **Details** |
|---|---|
| Scope | Campaign-wide: applies to every ad group |
| Match | Pattern-based (URL contains) and exact URL |
| Requirement | Final URL expansion must be enabled for exclusions to apply |

### Recommended permanent exclusions

Always exclude these page types from final URL expansion:
| **Page type** | **Exclusion pattern** |
|---|---|
| Contact page | `/contact` |
| Terms and conditions | `/terms` |
| Privacy policy | `/privacy` |
| About us | `/about` |
| Cart | `/cart` |
| Checkout | `/checkout` |
| Login/account | `/login`, `/account`, `/my-account` |
| Thank you/confirmation | `/thank-you`, `/order-confirmation` |
| Sitemap | `/sitemap` |

> ⚠️ **Blog pages are not automatically a utility page.** Blog content converts on informational queries, so an exclusion applied by default removes traffic that was earning.

---

## URL inclusions (ad group level)

### What it does

Specifies the set of URLs an ad group may serve as dynamic landing pages. Behavior depends on the campaign-level final URL expansion switch.
| **Final URL expansion** | **What the ad group serves** |
|---|---|
| On | Your included URLs plus any other page Google predicts will perform. Inclusions steer expansion toward your set without limiting it |
| Off | Only your included URLs (and the advertiser final URLs in your RSAs). The ad group serves keywordlessly on exactly that set |

This is how you keep a themed ad group on-theme (expansion on), and how you build a dedicated keywordless ad group that mimics a legacy Dynamic Search Ads dynamic ad group (expansion off).

### Setup

Add URL inclusions at the ad group level, by URL pattern or exact URL.

### Rules

| **Rule** | **Details** |
|---|---|
| Scope | Ad group only |
| Effect (expansion on) | Steers expansion toward your URLs for that ad group |
| Effect (expansion off) | Restricts the ad group to serve only your URLs, keywordlessly |
| Requirement | Text customization (asset optimization) and search term matching must be on for the ad group. Without search term matching the dynamic ad targets stay "Eligible, Pending". Final URL expansion is not required: it works on or off |

### Two structural patterns

| **Pattern** | **When it fits** | **How** |
|---|---|---|
| **Inclusions inside themed ad groups** | Well-themed ad group structure where each ad group maps cleanly to a set of closely related URLs | Add closely related URL inclusions matching the ad group's creative theme. No separate keywordless ad group needed |
| **Dedicated keywordless ad group** | Over-segmented structures with no clean per-ad-group URL mapping, or replacing a legacy DSA dynamic ad group | Create a standard ad group with no keywords and only URL inclusions, with final URL expansion off, so it serves keywordlessly on exactly those URLs. Text customization must be on (required for inclusions) and search term matching must be on for the ad group (required for the inclusions to serve, or they stay Pending). Since text customization is campaign-level, use a separate campaign if your keyword ad groups need it off |

> 💡 **Match the pattern to your structure.** If your ad groups are well-themed (each maps to a clear page set), use ad-group URL inclusions. If your ad groups are highly segmented around close keyword variants with no clean per-ad-group URL split, a dedicated keywordless ad group is cleaner than forcing inclusions into every ad group.

---

## Page feed (custom labels)

### What it does

You upload a list of specific URLs with custom labels via a CSV file or feed. Final URL expansion is then limited to pages in the feed, and you can target by label at the ad group level. This gives you full control over which pages are eligible and how they are grouped, which is essential at catalog scale.

### Setup

Upload a page feed (CSV or Google Sheets) via Google Ads > Tools > Business data > Data feeds. Assign the feed to the campaign, then target by custom label in ad group settings.

### Page feed CSV format

The CSV file requires exactly two columns:
| **Column** | **Content** | **Required** |
|---|---|---|
| `page_url` | Full page URL | Yes |
| `custom_label` | Label(s) for that URL | Yes |

**Example CSV:**

```
page_url,custom_label
https://example.com/product/samsung-tv-55,electronics;samsung;single_product
https://example.com/product/lg-oled-65,electronics;lg;single_product
https://example.com/category/running-shoes,shoes;category_page
```

### Custom label syntax rules

| **Rule** | **Details** |
|---|---|
| Multiple labels per URL | Separate with semicolons: `label_one;label_two;label_three` |
| Naming convention | Use underscores instead of spaces: `single_product` not `single product` |
| Special characters | Avoid special characters in label names |
| Combining labels in targeting | Target multiple labels in an ad group to create AND logic (target "single_product" AND "samsung" to match only Samsung single product pages) |
| Case | Labels are not case-sensitive, but use consistent casing for clarity |

### Upload methods

| **Method** | **How** | **Auto-refresh** |
|---|---|---|
| CSV file upload | Google Ads > Tools > Business data > Data feeds > Upload | No: manual re-upload required for updates |
| Google Sheets | Link a Google Sheet as the feed source | No: manual refresh |
| HTTPS hosted URL | Host the CSV at a public HTTPS URL, paste the URL as the feed source | Yes: schedule every 6, 12, or 24 hours |

> 💡 **For e-commerce, use the HTTPS method with a feed management tool (Channable, DataFeedWatch, or similar). This enables automatic filtering by stock status, margin, product type, and brand, with scheduled refreshes.**

### Schedule configuration (HTTPS feeds only)

| **Setting** | **Options** | **Recommended** |
|---|---|---|
| Refresh frequency | Every 6 hours, every 12 hours, every 24 hours | Every 6 hours for e-commerce |
| Feed URL | Must be publicly accessible HTTPS URL | Use feed management tool to generate |
| Format | CSV with `page_url` and `custom_label` columns | Same format as manual upload |

### E-commerce feed management

When using a feed management tool for page feeds:

| **Filter** | **Purpose** | **Example** |
|---|---|---|
| Out-of-stock | Exclude products with zero inventory | Remove URLs where `availability != in stock` |
| Margin | Only target profitable products | Include only URLs where margin > 20% |
| Product type | Segment by category | Label by product type for ad group segmentation |
| Brand | Segment by brand | Label by brand name for brand-specific ad groups |
| Price range | Target specific price tiers | Label as `high_value` or `low_value` based on price |

### Rules

| **Rule** | **Details** |
|---|---|
| Feed size | No published limit, but keep feeds clean (remove inactive URLs) |
| URL format | Full URLs including `https://` |
| Feed assignment | Assign the page feed at the campaign level in campaign settings |
| Label targeting | Set label targeting at the ad group level |
| Multiple feeds | One feed per campaign |

---

## Page content exclusions

In addition to URL exclusions, you can exclude pages by on-page content.

### Dynamic exclusions

Exclude pages automatically based on text on the page:

| **Exclusion text** | **Purpose** |
|---|---|
| `out of stock` | Exclude out-of-stock product pages |
| `unavailable` | Exclude unavailable products |
| `coming soon` | Exclude pre-launch pages |
| `discontinued` | Exclude discontinued products |

> 💡 **Dynamic content exclusions depend on Google's crawl. There is a delay between when page content changes and when Google re-crawls the page. For real-time stock filtering, use a page feed instead.**

### Negative keywords alongside final URL expansion

| **Rule** | **Details** |
|---|---|
| Apply existing negative keyword lists | Add your account-level and campaign-level negative keyword lists to AI Max campaigns |
| Do NOT exclude keywords based on keyword-campaign overlap | Let ad rank decide which campaign serves |
| Query-level negatives | Add negatives for irrelevant queries discovered in the search terms report |

---

## Decision guide: which control?

```
Do you have a feed management tool or can host a CSV?
|
+-- YES --> Do you need to filter by stock, margin, or product attributes?
|           |
|           +-- YES --> Use a page feed (custom labels)
|           |
|           +-- NO --> Are your ad groups well-themed (clean URL mapping)?
|                      |
|                      +-- YES --> Use ad-group URL inclusions
|                      |
|                      +-- NO --> Use a page feed (custom labels)
|
+-- NO --> Are your ad groups well-themed (clean URL mapping)?
           |
           +-- YES --> Use ad-group URL inclusions + campaign URL exclusions
           |
           +-- NO --> Use a dedicated keywordless ad group
                      (URL inclusions only, no keywords, final URL expansion off)
```

Every one of these setups still needs campaign URL exclusions for utility pages underneath it.

---

## Reporting on expanded URLs

Asset reporting carries a dedicated tab for expanded final URLs. It reports per-asset statistics against the specific URL Google expanded to, rather than only campaign totals, so you can see which pages expansion actually chose and how each asset performed once it got there. Campaign-level numbers alone do not show which pages expansion chose.

Asset removal is campaign-wide. Removing an asset you see underperforming against one expanded URL removes it from the whole campaign, so there is no per-URL asset pruning. When a single page needs different copy, separate it into its own campaign instead of trying to prune assets against that URL.

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|---|---|---|
| Enabling final URL expansion with no constraints | Queries land on any indexed page, in any ad group | Add campaign URL exclusions and ad-group URL inclusions before scaling |
| Expecting an ad-group-level on/off switch | Final URL expansion is campaign-level: it applies to every ad group | Constrain per ad group with URL inclusions |
| Believing URL inclusions require final URL expansion on | Skips the scoped keywordless option | Inclusions also work with expansion off, where the ad group serves only the included URLs (the DSA dynamic-ad-group replacement) |
| Spaces in custom labels | Labels break or do not match | Use underscores: `single_product` not `single product` |
| Not excluding utility pages | Ads land on cart, login, privacy pages | Add permanent URL exclusions for all utility pages |
| Excluding blog pages by default | Miss converting traffic from informational queries | Test blog performance before excluding |
| Excluding keywords that overlap with keyword campaigns | Prevents healthy competition, may lose impression share | Let ad rank decide: do not add keyword-overlap negatives |
| Not scheduling HTTPS feed refreshes | Page feed becomes stale, out-of-stock products keep serving | Set refresh to every 6 hours for e-commerce |
| Forgetting to assign the page feed at campaign level | Custom label targeting in ad groups does not work | Assign feed in campaign settings before setting ad group targets |

---

## Related documents

| **Document** | **Relationship** |
|---|---|
| [AI Max for Search Mental Model](../mental-models/AI Max for Search Mental Model.md) | When and how to enable final URL expansion |
| [SOP – Configure AI Max for Search](<../sops/SOP – Configure AI Max for Search.md>) | Step-by-step setup including final URL expansion |
| [AI Max for Search Reference](../references/AI Max for Search Reference.md) | Full AI Max feature and setting specs |
| [AI Max Keywordless Configuration Catalog](../catalogs/AI Max Keywordless Configuration Catalog.md) | The keywordless configuration options built from these controls |

---

## Version details

- **Version:** 6.0
- **Last Updated:** October 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

© 2026 PPC Mastery B.V. All rights reserved.
