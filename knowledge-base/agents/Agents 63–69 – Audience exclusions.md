# Audience exclusions (63 to 69)

### 63. Buyer exclusion agent
**Data:** Audience criteria per campaign, audience lists.
**Method:** Finds customer and purchaser lists and checks whether every prospecting campaign excludes them.
**Returns:** Prospecting campaigns without the exclusion, with their spend, and the buyer lists available.
**Claude adds:** Spend that actually reached buyers needs order data (agent 59). For PMax use customer acquisition settings or audience exclusions.

### 64. Remarketing list agent
**Data:** Audience lists with size, duration and usage.
**Method:** Finds lists attached to nothing, lists too small to serve on Search (under 1,000) and unusual membership durations.
**Returns:** Every list with size, duration and use, and the idle ones ranked by size.

### 65. Customer list upload agent
**Data:** Customer Match lists, subscriber count (account.yaml).
**Method:** Checks whether customers are uploaded and what match rate to expect.
**Returns:** The upload plan with four segments (buyers, high-value buyers, lapsed buyers, subscribers who never bought) and how each is used.

### 66. Audience overlap agent
**Data:** Audience criteria per campaign and ad group, PMax audience signals.
**Method:** Maps which audiences are used in which campaigns and finds audiences several campaigns compete for.
**Returns:** The overlap map and the exclusions that separate them.

### 67. Prospecting purity agent
**Data:** Agents 27 and 63, plus agent 59 when orders exist.
**Method:** Combines brand share, missing buyer exclusions and repeat-buyer share into how much of "new customer" spend reaches new customers.
**Returns:** A purity figure per prospecting campaign (upper bound without order data) and the true cost of a new customer.

### 68. Subscriber list agent
**Data:** Subscriber count (account.yaml), Customer Match sizes.
**Method:** Compares the owned audience to what is in the ad account.
**Returns:** The gap and the segments to prioritise.

### 69. Lookback window agent
**Data:** Days from first visit to purchase per order (manual.orders_csv), list durations.
**Method:** Measures the real buying window (median and 90th percentile) and compares every remarketing list against it.
**Returns:** The buying window, the lists set wrongly and the corrected durations.
