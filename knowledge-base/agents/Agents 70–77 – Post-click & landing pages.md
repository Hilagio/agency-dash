# Post-click and landing pages (70 to 77)

### 70. Landing page match agent
**Data:** Ad and keyword final URLs, search terms per ad group.
**Method:** Flags ad groups that send searches to the homepage, or to a URL that shares no word with the top search terms.
**Returns:** Every mismatch with the ad group, current URL, top terms and spend.
**Claude adds:** Opens the top rows to confirm, and proposes the correct URL for each.

### 71. Page speed agent
**Data:** The 20 landing pages with most spend, Google PageSpeed Insights (mobile).
**Method:** Measures mobile performance score, largest contentful paint and blocking time per page, next to spend.
**Returns:** Speed per page against spend, and the slow pages where it costs most.
**Claude adds:** Add manual.pagespeed_api_key for reliable runs; without a key Google rate-limits.

### 72. Conversion rate by page agent
**Data:** Paid landing page performance (30 days).
**Method:** Conversion rate per landing page for paid traffic, against the paid average.
**Returns:** Pages ranked by conversion rate against spend, and the underperformers where a page fix beats a bid change.

### 73. Product page structure agent
**Data:** The ten landing pages with most spend.
**Method:** A checklist of what carries a paid click: price without scrolling, delivery time and cost, returns policy, stock status, reviews, variant selection, first screen answers the search.
**Returns:** The checklist per page, missing elements ordered by spend.
**Claude adds:** Opens each page and fills the checklist.

### 74. Popup and discount agent
**Data:** The offer path a paid visitor sees (manual.offers_csv), margin.
**Method:** Finds where landing page offers stack with site-wide popups and what that does to contribution per order.
**Returns:** The offer path, where discounts combine, and the margin cost.

### 75. Stockout agent
**Data:** Product stock status and product spend (14 days).
**Method:** Finds products out of stock that still received spend.
**Returns:** The products, the spend on them, and the handoff rule between purchasing and ads.

### 76. Checkout drop-off agent
**Data:** Funnel steps for paid and all traffic (manual.store_funnel_csv).
**Method:** Drop-off per step for paid traffic against all traffic.
**Returns:** The funnel, the step where paid traffic behaves worse, and what to test there.

### 77. Mobile page agent
**Data:** Landing pages by device (30 days).
**Method:** Mobile vs desktop conversion rate per page with enough clicks.
**Returns:** The pages with the largest mobile gap, with spend.
**Claude adds:** Reviews the top pages on a mobile viewport: tap targets, form length, image weight, sticky add to cart, price above the fold.
