# DSA Targeting Options Reference
Created: 2026-02-04

Support_ID: CHEATSHEET_33
Category: Targeting
Domain: Search
Human_Facing: Yes
Pillar: 7
Reference Type: Cheat Sheets
Agent_Readable: Yes
Status: Done

## Purpose:

Documents the eight DSA targeting options, page feed specifications, custom label syntax, upload methods, and page exclusion rules for Dynamic Search Ads campaigns

---

## What this reference is / What this is NOT

**This reference:**

- Documents all eight DSA targeting options with their mechanics, syntax, and limitations
- Specifies page feed CSV format, custom label rules, and upload methods
- Covers page exclusion options and recommended exclusion patterns
- Rates each targeting option based on control and reliability

**This reference does NOT:**

- Provide strategy for when to use DSA in your account (See: [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md))
- Provide step-by-step campaign setup instructions
- Cover DSA ad copy or description writing
- Explain bidding strategy selection for DSA campaigns

---

## Quick reference table

| **Targeting option** | **Setup method** | **Control level** | **Recommendation** |
|---|---|---|---|
| **1. All web pages** | Toggle in ad group | None | Not recommended |
| **2. Page title contains** | Enter keywords | Low | Not recommended |
| **3. Page content contains** | Enter keywords | Low | Not recommended |
| **4. Landing pages from standard ad groups** | Auto-populated | Medium | Acceptable |
| **5. Categories** | Google-generated list | Low | Not recommended |
| **6. URL equals** | Enter exact URLs | High (static) | Acceptable |
| **7. URL contains** | Enter URL patterns | High (dynamic) | Recommended |
| **8. Custom label (page feed)** | Upload CSV/feed | Highest | Recommended |

> 💡 **Start with URL contains for quick setup. Move to custom labels (page feed) when you need filtering, automation, or label-based segmentation.**

---

## 1. All web pages

### What it does

Targets every page on your domain that Google has indexed. Google decides which page matches which search query.

### Setup

Select "All web pages" as the targeting source in the DSA ad group settings. No additional configuration required.

### Rules

| **Rule** | **Details** |
|---|---|
| Scope | Every indexed page on the domain |
| Control | Zero: Google picks the landing page |
| Index dependency | Only targets pages Google has crawled and indexed |

### When to use

- Never as a primary targeting method
- Temporary testing only, with tight negative keyword lists and low budgets

### When NOT to use

| **Situation** | **Why** |
|---|---|
| Any production campaign | Includes irrelevant pages (about us, contact, terms, privacy, careers) |
| Sites with thin content pages | Google matches queries to low-quality pages |
| E-commerce with out-of-stock products | No way to exclude products dynamically |

---

## 2. Page title contains

### What it does

Targets pages where the HTML `<title>` tag contains specific words you specify.

### Setup

Enter one or more keywords. Google matches pages where the HTML title contains those words.

### Rules

| **Rule** | **Details** |
|---|---|
| Match scope | HTML `<title>` tag only |
| Index dependency | Only works on pages Google has indexed: if Google has not crawled the page, it will not match |
| Update lag | Changes to page titles take time to reflect (depends on Google's crawl schedule) |
| Control | Limited: you cannot control how Google interprets word matches |

### When to use

- Not recommended for any use case

### When NOT to use

| **Situation** | **Why** |
|---|---|
| Sites with inconsistent title tags | Unpredictable matching |
| Pages with generic titles | Matches too broadly |
| Any scenario requiring precision | Google's index lag and interpretation make this unreliable |

---

## 3. Page content contains

### What it does

Targets pages where the visible content contains specific words you specify. Google scans the full page content, including headers, footers, navigation menus, and sidebar text.

### Setup

Enter one or more keywords. Google matches pages where the body content contains those words.

### Rules

| **Rule** | **Details** |
|---|---|
| Match scope | All visible text on the page, including navigation, headers, footers, sidebars |
| False positives | A word in the footer or navigation menu triggers a match for every page using that template |
| Index dependency | Depends on Google's crawl and index |
| Control | Very low: template elements cause site-wide matching |

### When to use

- Not recommended for any use case

### When NOT to use

| **Situation** | **Why** |
|---|---|
| Sites with shared navigation/footer text | Every page matches because shared elements contain the keyword |
| Any site with template-based pages | Cannot isolate unique page content from shared template content |
| Scenarios requiring predictable targeting | Matching behavior is unpredictable |

---

## 4. Landing pages from standard ad groups

### What it does

Targets only the landing page URLs already used in your existing keyword-based ad groups. Google limits DSA matching to those specific pages.

### Setup

Select "Landing pages from your standard ad groups" in the DSA ad group targeting. Google auto-populates the list from your active keyword campaigns.

### Rules

| **Rule** | **Details** |
|---|---|
| Source | URLs from final URLs in active keyword ad groups |
| Scope | Only pages you already target with keyword ads |
| Discovery | Zero: cannot find new pages or products |
| Updates | Automatically reflects changes to your keyword ad group URLs |

### When to use

| **Scenario** | **Why** |
|---|---|
| Supplementing keyword campaigns | Safe way to catch additional queries for pages you already bid on |
| Conservative DSA rollout | No risk of landing on unexpected pages |

### When NOT to use

| **Situation** | **Why** |
|---|---|
| Discovery campaigns | Cannot find queries for pages not in keyword ad groups |
| E-commerce with large catalogs | Only covers pages you already target with keywords |
| New product launches | New pages are not in keyword ad groups yet |

---

## 5. Categories

### What it does

Google automatically groups your site pages into categories based on its own analysis. You select from the categories Google generates.

### Setup

After Google crawls your site, a category list appears in the DSA ad group settings. Select one or more categories to target.

### Rules

| **Rule** | **Details** |
|---|---|
| Generation | Google creates categories automatically: no manual control over category names or groupings |
| Accuracy | Often inaccurate: Google may group unrelated pages together |
| Availability | Categories may not appear for all sites, especially smaller ones |
| Updates | Google updates categories on its own schedule |

### When to use

- Not recommended for any use case

### When NOT to use

| **Situation** | **Why** |
|---|---|
| Any scenario requiring control | You cannot influence how Google creates or assigns categories |
| Sites with diverse content | Groupings are often inaccurate |
| Accounts requiring predictable performance | No way to audit or correct category assignments |

---

## 6. URL equals

### What it does

Targets specific, exact URLs you define. Only those exact pages are eligible for DSA matching.

### Setup

Enter the full URL for each page you want to target. Each URL must be an exact match.

### Rules

| **Rule** | **Details** |
|---|---|
| Match type | Exact URL match only (including trailing slashes, parameters) |
| Maintenance | Manual: you must add/remove URLs when pages change |
| URL changes | If a URL changes (slug update, domain migration), the target breaks silently |
| Scale | Impractical for sites with hundreds or thousands of pages |
| New pages | New pages are not included until you manually add them |

### When to use

| **Scenario** | **Why** |
|---|---|
| Small sites with fewer than 20 target pages | Manageable number of URLs to maintain manually |
| Temporary targeting for specific promotions | Pin specific landing pages for a limited time |

### When NOT to use

| **Situation** | **Why** | **Alternative** |
|---|---|---|
| Large catalogs | Manual maintenance does not scale | URL contains or custom labels |
| Sites with frequent URL changes | Targets break silently | URL contains (pattern-based) |
| Discovery use cases | Cannot find new pages | URL contains |

---

## 7. URL contains

### What it does

Targets pages whose URL contains a specific text pattern. Any page on your domain with a URL matching the pattern is eligible for DSA matching.

### Setup

Enter a URL pattern (text string). Google matches any indexed page whose URL contains that string.

**Pattern examples:**

| **Pattern** | **Matches** | **Use case** |
|---|---|---|
| `/products/` | All pages with `/products/` in the URL | Target all product pages |
| `/samsung/` | All pages with `/samsung/` in the URL | Target a specific brand |
| `/blog/` | All pages with `/blog/` in the URL | Target blog content |
| `/category/running-shoes` | Pages with that path segment | Target a specific category |

### Rules

| **Rule** | **Details** |
|---|---|
| Match type | Substring match: any URL containing the pattern qualifies |
| Case sensitivity | Not case-sensitive |
| Multiple patterns | Create separate targets for each pattern, or combine in one ad group |
| Discovery | Automatically includes new pages matching the pattern |
| Specificity | More specific patterns = more precise targeting |

### When to use

| **Scenario** | **Why** |
|---|---|
| E-commerce with structured URLs | Target product categories, brands, or types by URL path |
| Sites with consistent URL structure | Patterns reliably match the intended pages |
| Discovery campaigns | Automatically picks up new pages matching the pattern |
| Quick setup without feed infrastructure | No CSV or feed tool required |

### When NOT to use

| **Situation** | **Why** | **Alternative** |
|---|---|---|
| Sites with unstructured URLs (random IDs, hashes) | Patterns cannot reliably identify page types | Custom labels (page feed) |
| Need to filter by non-URL attributes (stock, margin, price) | URL patterns cannot access product data | Custom labels (page feed) |
| Need to combine multiple filter conditions | URL contains is a single-dimension filter | Custom labels (page feed) |

---

## 8. Custom label (page feed)

### What it does

You upload a list of specific URLs with custom labels via a CSV file or feed. DSA targets pages based on those labels. This gives you full control over which pages are eligible and how they are grouped.

### Setup

Upload a page feed (CSV or Google Sheets) via Google Ads > Tools > Business Data > Page Feeds. Assign the feed to the DSA campaign, then target by custom label in ad group settings.

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
| Combining labels in targeting | Target multiple labels in an ad group to create AND logic (e.g., target "single_product" AND "samsung" to match only Samsung single product pages) |
| Case | Labels are not case-sensitive, but use consistent casing for clarity |

### Upload methods

| **Method** | **How** | **Auto-refresh** |
|---|---|---|
| CSV file upload | Google Ads > Tools > Business Data > Page Feeds > Upload | No: manual re-upload required for updates |
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
| Multiple feeds | One feed per campaign (assign one page feed per DSA campaign) |

### When to use

| **Scenario** | **Why** |
|---|---|
| E-commerce with large catalogs | Filter by stock, margin, brand, category automatically |
| Sites needing multi-dimensional segmentation | Combine labels for precise ad group targeting |
| Automated feed pipelines | HTTPS feeds refresh on schedule with no manual work |
| Accounts requiring tight page control | Only URLs in the feed are eligible |

### When NOT to use

| **Situation** | **Why** | **Alternative** |
|---|---|---|
| Small sites with fewer than 20 pages | Feed infrastructure is overkill | URL contains or URL equals |
| No feed management capability | Manual CSV maintenance at scale is error-prone | URL contains |
| Quick test campaigns | Setup time is higher | URL contains |

---

## Page exclusions

Page exclusions prevent specific pages from being targeted by DSA, regardless of the targeting option used.

### Exclusion methods

| **Exclusion type** | **How it works** | **Use case** |
|---|---|---|
| URL contains | Exclude pages whose URL contains a pattern | Exclude entire sections (e.g., `/cart/`, `/checkout/`) |
| URL equals | Exclude a specific exact URL | Exclude one specific page |
| Page content contains | Exclude pages containing specific text in the body | Dynamic exclusion based on page content (e.g., "out of stock", "unavailable") |
| Page title contains | Exclude pages with specific words in the title | Exclude pages by title keyword |

### Recommended permanent exclusions

Always exclude these page types from DSA targeting:
| **Page type** | **Exclusion pattern** | **Method** |
|---|---|---|
| Contact page | `/contact` | URL contains |
| Terms and conditions | `/terms` | URL contains |
| Privacy policy | `/privacy` | URL contains |
| About us | `/about` | URL contains |
| Cart | `/cart` | URL contains |
| Checkout | `/checkout` | URL contains |
| Login/account | `/login`, `/account`, `/my-account` | URL contains |
| Thank you/confirmation | `/thank-you`, `/order-confirmation` | URL contains |
| Sitemap | `/sitemap` | URL contains |

> ⚠️ **Do NOT automatically exclude blog pages:** Blog content can convert. Test blog page performance before deciding to exclude.

### Dynamic exclusions

Use "Page content contains" exclusions to automatically exclude pages based on on-page text:

| **Exclusion text** | **Purpose** |
|---|---|
| `out of stock` | Exclude out-of-stock product pages |
| `unavailable` | Exclude unavailable products |
| `coming soon` | Exclude pre-launch pages |
| `discontinued` | Exclude discontinued products |

> 💡 **Dynamic exclusions depend on Google's crawl. There is a delay between when page content changes and when Google re-crawls the page. For real-time stock filtering, use custom labels with a page feed instead.**

### Negative keywords in DSA

| **Rule** | **Details** |
|---|---|
| Apply existing negative keyword lists | Add your account-level and campaign-level negative keyword lists to DSA campaigns |
| Do NOT exclude keywords from DSA based on keyword campaign overlap | Let ad rank decide which campaign serves: the keyword campaign or the DSA campaign |
| Query-level negatives | Add negatives for irrelevant queries discovered in DSA search term reports |

---

## Decision guide: which targeting option?

```
Do you have a feed management tool or can host a CSV?
|
+-- YES --> Do you need to filter by stock, margin, or product attributes?
|           |
|           +-- YES --> Use Custom Labels (page feed)
|           |
|           +-- NO --> Does your site have structured, consistent URLs?
|                      |
|                      +-- YES --> Use URL Contains (simpler setup)
|                      |
|                      +-- NO --> Use Custom Labels (page feed)
|
+-- NO --> Does your site have structured, consistent URLs?
           |
           +-- YES --> Use URL Contains
           |
           +-- NO --> Do you have fewer than 20 target pages?
                      |
                      +-- YES --> Use URL Equals
                      |
                      +-- NO --> Use Landing Pages from Standard Ad Groups
                                 (while building feed infrastructure)
```

---

## Common mistakes

| **Mistake** | **Problem** | **Fix** |
|---|---|---|
| Using "All web pages" in production | Ads serve for irrelevant pages (contact, terms, careers) | Switch to URL contains or custom labels |
| Using "Page content contains" for targeting | Shared template elements (nav, footer) cause site-wide matching | Use URL contains or custom labels instead |
| Spaces in custom labels | Labels break or do not match | Use underscores: `single_product` not `single product` |
| Not excluding utility pages | Ads land on cart, login, privacy pages | Add permanent URL contains exclusions for all utility pages |
| Excluding blog pages by default | Miss converting traffic from informational queries | Test blog performance before excluding |
| Excluding keywords that overlap with keyword campaigns | Prevents DSA from competing, may lose impression share | Let ad rank decide: do not add keyword-overlap negatives to DSA |
| Using URL equals for large catalogs | Targets break when URLs change, manual maintenance does not scale | Switch to URL contains or custom labels |
| Not scheduling HTTPS feed refreshes | Page feed becomes stale, out-of-stock products keep serving | Set refresh to every 6 hours for e-commerce |
| Forgetting to assign page feed at campaign level | Custom label targeting in ad groups does not work without campaign-level feed assignment | Assign feed in campaign settings before setting ad group targets |

---

## Related documents

| **Document** | **Relationship** |
|---|---|
| [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md) | Strategic framework for when and why to use DSA |

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

(c) 2026 PPC Mastery B.V. All rights reserved.
