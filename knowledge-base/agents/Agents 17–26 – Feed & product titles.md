# Feed and product titles (17 to 26)

### 17. Product title rewrite agent
**Data:** Products with spend, Shopping search terms, optional feed export for attributes.
**Method:** Lists the products that cost money, with title length and ROAS, and builds the vocabulary shoppers actually use (1, 2 and 3 word phrases from Shopping search terms, weighted by conversions and clicks).
**Returns:** The product list and the vocabulary table.
**Claude adds:** Writes the new titles: brand, product type, key attribute, size or variant, in the order shoppers search, using the vocabulary, within 150 characters, never inventing an attribute the feed does not contain. Output as `id;title`, ready as a supplemental feed.

### 18. Feed attribute agent
**Data:** Feed export (manual.feed_csv); without it, the issues Google reports.
**Method:** Scores each product on attribute completeness, weighted by how much each attribute affects eligibility (title, price, availability and image weigh most).
**Returns:** A score per product, missing attributes ranked by impact, and products blocked by a single missing field.

### 19. Missing field agent
**Data:** Products with issues and spend.
**Method:** Puts products with spend and feed issues first, so the gaps that cost money surface before the ones that do not.
**Returns:** Products with spend and issues ordered by spend, and a backlog of products with issues and no spend.

### 20. Catalogue coverage agent
**Data:** All products in the linked Merchant Center, impressions over 90 days, optional unit costs.
**Method:** Finds products without a single impression and splits them into blocked, out of stock and never picked up.
**Returns:** Count and share never advertised by cause, and the products worth pushing first by margin.

### 21. Product disapproval agent
**Data:** Product status and issue codes.
**Method:** Groups every not-eligible product by issue code, classifies the cause as feed data, landing page and price mismatch, or policy, and orders by how many products a fix releases.
**Returns:** Each reason with product count, type and products released.
**Claude adds:** The concrete fix per reason in plain words.

### 22. GTIN and identifier agent
**Data:** Feed export with gtin, mpn, brand and identifier_exists.
**Method:** Validates GTIN format and check digit, flags branded products without GTIN and identifier_exists set to false on branded goods.
**Returns:** Products needing identifiers, suspect identifier_exists values and format errors.

### 23. Custom label agent
**Data:** Products, 90-day performance, margin and optional unit costs.
**Method:** Assigns five labels: performance index against account ROAS (over, index, near, under, no revenue, no impressions), bestseller (products that bring 80 % of value), margin band, price band, stock status.
**Returns:** The label scheme and a full product-to-label mapping ready as a supplemental feed.

### 24. Image and price compliance agent
**Data:** Product issues about images, price, sale price and availability.
**Method:** Groups every mismatch by field and issue, so one fix applies to a batch.
**Returns:** Each group with product count and IDs.

### 25. Feed rules agent
**Data:** Outputs of agents 17 and 23, your current feed rules (screenshot or export).
**Method:** Turns new titles and labels into supplemental feeds and rules so they survive the next catalogue sync.
**Returns:** The rules to create, in order, with the upstream field each depends on.
**Claude adds:** All of it: feed rules are not readable through the Google Ads API.

### 26. Feed change log agent
**Data:** A log of feed changes (manual.feed_changes_csv) and product daily performance.
**Method:** Lines every logged change up against clicks and CTR of the product before and after.
**Returns:** The change log with before and after numbers per product.
