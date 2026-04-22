# SOP – Set Up Dynamic Search Ads
Created: 2026-02-04

SOP_ID: SOP_43
Agent_Executable: No
Category: Structure
Domain: Search
Human_Approval_Required: No
Pillar: 7
Primary Outcome: Functional DSA targeting within Search campaign structure, with page feeds, exclusions, and targeted description lines
Secondary Outcomes: Expanded query coverage, keyword gap discovery, lower maintenance overhead
Status: Done

### Purpose

This SOP sets up Dynamic Search Ads (DSA) as a complementary targeting layer within your existing Search campaign structure, including page feed creation, targeting configuration, exclusions, and description lines.

> ❓ **The big question:** How do I set up DSA so it captures relevant queries my keyword lists miss, without wasting budget on irrelevant traffic?

---

### What this SOP is NOT

This SOP does **not:**

- Explain when or why to use DSA (See: [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md))
- Document targeting option mechanics or syntax (See: [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md))
- Cover negative keyword strategy (See: [Negative Keyword Reference](../references/Negative Keyword Reference.md))
- Define campaign structure philosophy (See: [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md))

---

### When to run this SOP

**Run when:**

- You have active keyword-based Search campaigns and want to expand query coverage
- You want to discover new keyword opportunities through DSA search term reports
- You have a website with crawlable, text-based content and clear HTML titles

**Do NOT run when:**

- Your website content changes daily (product feeds rotating constantly)
- Pages lack text-based content (image-heavy, JavaScript-rendered without server-side rendering)
- No keyword-based campaigns exist yet (build those first)
- Site pages have misleading or outdated titles/content

---

### Before you start

#### Required inputs

- Google Ads account with Editor access
- Live website with crawlable pages and clear HTML titles
- Active keyword-based Search campaigns in the same account
- Screaming Frog (free up to 500 pages) or access to XML sitemap
- Google Sheets access (for page feed creation)

#### Reference documents (have open)

| Document | Used for |
|----------|----------|
| [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md) | DSA fit evaluation criteria |
| [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md) | Targeting option syntax and specifications |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Applying existing negative keyword lists |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Placement logic for DSA ad group |

---

### Decision gate: DSA placement

Before creating the DSA ad group, determine where it lives:

| If... | Then... | Why |
|-------|---------|-----|
| You have a single Search campaign with shared budget | Add DSA ad group within the existing campaign | Simplest setup, shared budget allocation |
| You need separate budget control for DSA | Create a dedicated DSA campaign | Prevents DSA from consuming keyword campaign budget |
| You have different geographic or bid strategy targets for DSA | Create a dedicated DSA campaign | Campaign-level settings differ from keyword campaigns |
| You are testing DSA for the first time | Add DSA ad group within the existing campaign | Lower risk, easier to monitor alongside keywords |

> ⚠️ **Default: add a DSA ad group within your existing keyword campaign:** Only create a separate DSA campaign when budget isolation or different campaign-level settings are required.

---

### Execution framework

| Phase | Purpose | Output |
|-------|---------|--------|
| **Phase 1️⃣: Evaluate DSA Fit** | Confirm site qualifies for DSA | Go/no-go decision |
| **Phase 2️⃣: Scrape Site and Build URL Inventory** | Collect all page URLs | Cleaned URL list |
| **Phase 3️⃣: Create and Upload Page Feed** | Build structured feed with custom labels | Live page feed in Google Ads |
| **Phase 4️⃣: Configure DSA Campaign/Ad Group** | Set up DSA targeting container | Active DSA ad group linked to page feed |
| **Phase 5️⃣: Set Targeting** | Define which pages DSA can use | Custom label or URL-based targeting rules |
| **Phase 6️⃣: Configure Page Exclusions** | Block irrelevant pages | Page and content exclusion rules applied |
| **Phase 7️⃣: Write DSA Description Lines** | Create static description copy | Published DSA ads with descriptions |

---

## Phase 1️⃣: Evaluate DSA Fit

### 1.1 Site readiness check

Verify all four conditions before proceeding:

| Condition | Check | Fail action |
|-----------|-------|-------------|
| Static content | Pages do not change daily | Stop: DSA requires stable page content |
| Crawlable text | Pages have HTML text content, not just images | Stop: Google cannot generate headlines from images |
| Clear HTML titles | Page titles accurately describe page content | Fix titles before proceeding |
| Existing keyword campaigns | At least one active keyword-based Search campaign | Build keyword campaigns first |

### 1.2 Confirm go/no-go

If all four conditions pass, proceed to Phase 2. If any condition fails, resolve it before continuing.

---

## Phase 2️⃣: Scrape Site and Build URL Inventory

### 2.1 Export all page URLs

**Option A: Screaming Frog (recommended for sites under 500 pages)**

1. Open Screaming Frog
2. Enter root domain URL
3. Click **Start**
4. Wait for crawl to complete
5. Export **Internal > HTML** URLs to CSV

**Option B: XML Sitemap**

1. Navigate to `yourdomain.com/sitemap.xml`
2. Copy all page URLs
3. Paste into a spreadsheet

### 2.2 Clean the URL list

Review the exported URLs and remove:

- Duplicate URLs (www vs. non-www, HTTP vs. HTTPS)
- URLs with parameters or session IDs
- Non-content pages (pagination, tag pages, archive pages)
- Pages you already know are irrelevant (handled in detail in Phase 6)

Save the cleaned list. This becomes the input for Phase 3.

---

## Phase 3️⃣: Create and Upload Page Feed

### 3.1 Build the page feed spreadsheet

Open Google Sheets and create two columns:

| Column | Content | Rules |
|--------|---------|-------|
| `Page URL` | Full HTTPS URL of the page | One URL per row |
| `Custom label` | Descriptive label for targeting | Use underscores instead of spaces |

Assign custom labels based on page groupings:

| Page type example | Custom label example |
|-------------------|---------------------|
| Product category pages | `running_shoes`, `hiking_boots` |
| Service pages | `seo_services`, `ppc_management` |
| Blog content | `blog_guides`, `blog_comparisons` |
| Location pages | `location_amsterdam`, `location_london` |

> 💡 **Multiple labels per URL:** Separate multiple labels with a semicolon in the same cell. Example: `running_shoes;sale_items;nike`

### 3.2 Upload the page feed

**Standard upload (most accounts):**

1. Go to **Tools & Settings** > **Business Data** > **Page Feeds**
2. Click **+** to create a new page feed
3. Name the feed descriptively (e.g., "DSA Page Feed - Main Site")
4. Upload your Google Sheets file or CSV
5. Verify the upload: check row count, no errors

**E-commerce with feed management tool (Channable, DataFeedWatch, etc.):**

1. Connect feed tool to your product data source
2. Map `Page URL` and `Custom label` fields
3. Export as hosted CSV via HTTPS URL
4. In Google Ads, use the scheduled fetch option instead of manual upload
5. Set refresh frequency to every 6 hours

---

## Phase 4️⃣: Configure DSA Campaign/Ad Group

### 4.1 Set DSA domain settings

1. Open the campaign where DSA will live (per Decision Gate above)
2. Go to **Campaign Settings** > **Dynamic Search Ads setting**
3. Enter your domain (e.g., `www.example.com`)
4. Set the language to match your website content
5. Select **Use URLs from my page feed only** (not "Use URLs from both Google's index and my page feed")

> ⚠️ **Always restrict to page feed URLs only:** Selecting "both" allows Google to target pages outside your feed, removing your control over which pages trigger ads.

### 4.2 Create the DSA ad group

1. Within the campaign, click **+ Ad Group**
2. Select **Dynamic** as the ad group type
3. Name it clearly (e.g., "DSA - All Products" or "DSA - Services")
4. Link the page feed created in Phase 3

---

## Phase 5️⃣: Set Targeting

### 5.1 Choose targeting method

Use custom labels from your page feed as the primary targeting method. Fall back to URL contains only if your URL structure is clean and consistent.

| Method | When to use | Reliability |
|--------|-------------|-------------|
| Custom labels (from page feed) | Default choice for all setups | High: you control exactly which pages are included |
| URL contains | Clean URL structure with logical path patterns | Medium: depends on URL consistency |

**Do not use:**

| Method | Why to avoid |
|--------|-------------|
| All web pages | No control over which pages trigger ads |
| Categories (Google-generated) | Unpredictable grouping, no transparency |
| Page content contains | Unreliable matching, inconsistent results |

### 5.2 Apply targeting rules

**For custom labels:**

1. In the DSA ad group, go to **Dynamic ad targets**
2. Click **+**
3. Select **Custom label**
4. Enter the label value (e.g., `running_shoes`)
5. Repeat for each label you want to target

**For URL contains:**

1. In the DSA ad group, go to **Dynamic ad targets**
2. Click **+**
3. Select **URL contains**
4. Enter the URL pattern (e.g., `/products/` or `/services/`)

> 💡 **Segment ad groups by label:** If different page groups need different descriptions, create separate DSA ad groups per custom label (e.g., "DSA - Running Shoes" and "DSA - Hiking Boots").

---

## Phase 6️⃣: Configure Page Exclusions

### 6.1 Exclude irrelevant pages

Go to **Dynamic ad targets** > **Exclusions** and add exclusions for non-commercial pages:

| Page type | Exclusion method | Value |
|-----------|-----------------|-------|
| Contact page | URL contains | `/contact` |
| About us page | URL contains | `/about` |
| Terms/privacy pages | URL contains | `/terms`, `/privacy`, `/cookie` |
| Cart/checkout | URL contains | `/cart`, `/checkout` |
| Login/account pages | URL contains | `/login`, `/account`, `/my-account` |
| Blog (if not targeting) | URL contains | `/blog` |
| Career pages | URL contains | `/careers`, `/jobs` |

### 6.2 Add content-based exclusions

For dynamic filtering of pages based on content:

1. Go to **Dynamic ad targets** > **Exclusions**
2. Select **Page content contains**
3. Add exclusion terms for pages that should not trigger ads

| Content exclusion | Purpose |
|-------------------|---------|
| `out of stock` | Prevent ads for unavailable products |
| `unavailable` | Prevent ads for discontinued items |
| `coming soon` | Prevent ads for unlaunched products |
| `sold out` | Prevent ads for depleted inventory |

### 6.3 Apply existing negative keyword lists

1. Go to **Tools & Settings** > **Shared Library** > **Negative Keyword Lists**
2. Apply your existing negative keyword lists to the DSA campaign/ad group
3. Do NOT add your active keywords as negatives in the DSA ad group

> ⚠️ **Do not exclude your existing keywords from DSA:** Google already prioritizes exact keyword matches over DSA. Adding keywords as negatives in DSA blocks legitimate close variants and long-tail queries that DSA should capture.

---

## Phase 7️⃣: Write DSA Description Lines

### 7.1 Understand DSA ad structure

Google generates headlines dynamically from page content. You write only the description lines (Description 1 and Description 2).

### 7.2 Write descriptions

For each DSA ad group, create at least one DSA ad:

1. In the DSA ad group, click **+ Ad** > **Dynamic Search Ad**
2. Write **Description 1**: include your primary value proposition and CTA
3. Write **Description 2**: add supporting proof point or secondary benefit

| Description line | Content focus | Example (e-commerce) | Example (lead gen) |
|-----------------|---------------|----------------------|--------------------|
| Description 1 | Value prop + CTA | Free shipping on orders over €50. Shop now. | Get a free quote in 24 hours. No obligation. |
| Description 2 | Proof + benefit | Rated 4.8/5 by 2,000+ customers. Easy returns. | 15 years experience. 500+ projects delivered. |

### 7.3 Segment if needed

If a single pair of descriptions does not work across all targeted pages, split into separate DSA ad groups:

1. Create a new DSA ad group per page group
2. Assign the relevant custom label targeting to each ad group
3. Write descriptions specific to that page group

> 💡 **Test this before splitting:** Generic descriptions often perform well enough across related pages. Only segment when descriptions would be misleading or irrelevant for certain page groups.

---

### Validation / Definition of Done

This SOP is complete when:

- [ ] DSA fit evaluation passed (all four conditions met)
- [ ] URL inventory scraped and cleaned
- [ ] Page feed uploaded with custom labels, no errors
- [ ] DSA domain and language configured
- [ ] Page feed linked and set to "page feed URLs only"
- [ ] Targeting rules applied using custom labels or URL contains
- [ ] Irrelevant pages excluded (contact, terms, cart, login, etc.)
- [ ] Content-based exclusions set for out-of-stock or unavailable pages
- [ ] Existing negative keyword lists applied
- [ ] DSA descriptions written with value proposition and CTA
- [ ] Ad approved and serving (no disapprovals)

---

### Exit → Entry bridge

Once DSA is live and approved:

| Timeframe | Action |
|-----------|--------|
| Day 1-3 | Monitor search terms report daily for irrelevant queries |
| Day 3-7 | Add negative keywords for any irrelevant search terms |
| Week 2 | Review DSA performance vs. keyword campaigns |
| Ongoing | Promote high-performing DSA search terms to keyword-based ad groups |

**If issues arise:**

| Issue | Route to |
|-------|----------|
| Irrelevant search terms appearing | Add negatives, review exclusions, tighten custom labels |
| High-performing search terms discovered | [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) |
| Low CTR on DSA ads | Rewrite descriptions, segment ad groups further |
| Pages showing ads with outdated content | Update page content or exclude pages via feed |

---

### Common failure modes

| Failure | Why it happens | How to avoid |
|---------|----------------|--------------|
| DSA targets irrelevant pages | "All web pages" targeting or no page feed | Always use page feed with custom labels |
| Headlines don't match user intent | Poor HTML titles on landing pages | Fix page titles before enabling DSA |
| Budget consumed by DSA instead of keywords | DSA in separate campaign with uncapped budget | Default to DSA ad group within keyword campaign |
| Out-of-stock products receive clicks | No content-based exclusions | Add "out of stock" and "unavailable" content exclusions |
| Descriptions feel generic across page groups | Single ad group targeting diverse pages | Segment ad groups by custom label with tailored descriptions |
| Active keywords excluded from DSA | Adding keyword negatives to DSA ad group | Do not exclude your own keywords from DSA targeting |
| Page feed not updating (e-commerce) | Manual upload with no scheduled refresh | Set up scheduled fetch every 6 hours via feed management tool |

---

### Related documents

| Document | Type | Used in |
|----------|------|---------|
| [Dynamic Search Ads Mental Model](../mental-models/Dynamic Search Ads Mental Model.md) | Mental Model | Phase 1 fit evaluation |
| [DSA Targeting Options Reference](../references/DSA Targeting Options Reference.md) | Reference | Phase 5 targeting rules |
| [Negative Keyword Reference](../references/Negative Keyword Reference.md) | Reference | Phase 6 exclusions |
| [Search Campaign Structure Mental Model](../mental-models/Search Campaign Structure Mental Model.md) | Mental Model | Decision gate placement logic |
| [SOP – Promote Search Terms to Keywords](../sops/SOP – Promote Search Terms to Keywords.md) | SOP | Exit bridge: promoting DSA discoveries |

---

### Version details

- **Version:** 1.0
- **Last Updated:** February 2026
- **Creator:** Bob Meijer

---

## Terms of Use

This document is licensed for personal and internal business use only under the PPC Mastery General [Terms & Conditions](https://www.ppcmastery.com/terms-and-conditions). Use it to become better at your job. Don't use it to build things you sell to others.

Violations may be detected through embedded document fingerprints and will be pursued under Article 13 (Intellectual Property) of the PPC Mastery General Terms.

Full terms: https://www.ppcmastery.com/terms-and-conditions

(c) 2026 PPC Mastery B.V. All rights reserved.
