# Search terms and negatives (9 to 16)

### 9. Search term reader agent
**Data:** Search terms 90 days (Search, Shopping, PMax), brand terms, competitors and the catalogue description from account.yaml.
**Method:** Rules sort every term into own brand, competitor, wrong intent (patterns like jobs, free, DIY, recipe, repair, second hand) and not sold. Everything else is "unclear" and gets classified into buying this product, researching the category, or wrong product, using the catalogue as reference.
**Returns:** The buckets with spend, conversions and value, and the wrong-product and wrong-intent terms as a ready negative list.
**Classification step (status "calibration"):** Take `tables.unclear_to_classify` (sorted by cost). Classify in batches of 100 to 200 terms against the catalogue description into `buying`, `researching`, `wrong_product` or `wrong_intent`. When unsure, use `researching` (safe, never becomes a negative). For large accounts label the top 300 by cost first and check the result with the user. Save a JSON list of `{"search_term": ..., "bucket": ...}` as `search_term_labels.json` in the cache folder and run agent 9 again.

### 10. Negative keyword list agent
**Data:** The candidates from agent 9, all existing negatives (shared lists, campaign and ad group level).
**Method:** Removes candidates already covered, protects every term that converted in 90 days and every brand term, picks the match type (phrase for a theme word like "jobs", exact for a single wasteful term) and groups them into shared lists named by theme.
**Returns:** Lists ready to create, each with entries, 90-day cost and the campaigns to attach them to.
**Claude adds:** Own brand terms never become negatives. Brand exclusions in non-brand campaigns are broad match. PMax ignores shared lists: use account-level negatives there.

### 11. Competitor term agent
**Data:** Search terms, keywords, competitor names from account.yaml, margin for the CAC ceiling.
**Method:** Finds competitor names in search terms with spend, splits them into bought deliberately (a keyword contains the name) and picked up through broad match, then compares cost per order with the first-order CAC ceiling.
**Returns:** Every competitor term with spend, orders and a keep, cap or exclude call.

### 12. Irrelevant intent agent
**Data:** Search terms 90 days.
**Method:** Scans for intent patterns that rarely buy from a retailer (how to make, free, recipe, jobs, salary, second hand, repair, symptoms, support and login). Brand terms are skipped. Extra patterns per account go under intent_patterns in account.yaml.
**Returns:** Matching terms with spend grouped by pattern, with examples.
**Claude adds:** The phrase-match negative that catches each group, and account-specific patterns (place names outside the shipping countries, competitor support queries) from reading the examples.

### 13. Broad match containment agent
**Data:** Search terms with keyword and match type, 90 days.
**Method:** Isolates spend through broad match keywords and measures how much landed on wrong intent or on broad matches without a conversion (sharper once agent 9's classification exists).
**Returns:** Broad share of spend, drift rate per broad keyword, and the keywords to narrow, pause or fence in.

### 14. PMax search theme agent
**Data:** PMax search terms with cost, PMax search categories, brand lists attached to campaigns.
**Method:** Measures the brand share of PMax search spend and revenue, checks whether brand exclusions are applied, and flags wrong-intent terms and categories with clicks but no conversions.
**Returns:** Brand share of PMax, the campaigns without brand exclusion, categories to exclude and account-level negative candidates.

### 15. Negative list governance agent
**Data:** Negative lists, their members and attachments, campaign negatives, change events, converting search terms.
**Method:** Finds lists attached to nothing, counts negatives against monthly spend, shows who added negatives in 30 days, and checks every negative against terms that converted in 90 days (over-blocking risk).
**Returns:** Ownership, orphaned lists, over-blocking risks with the revenue at stake, and negatives per 1,000 of spend.
**Claude adds:** A recommended cadence (one review per week or per fortnight, one owner).

### 16. Search term exclusion script agent
**Data:** Your script's thresholds (exclusion_script in account.yaml) and 90 days of search terms.
**Method:** Replays the thresholds on real data: what the script would have excluded, how many of those had conversions or were brand terms, and whether the thresholds ever fire.
**Returns:** What the script would have done, the converting and brand terms it would have hit, and a corrected threshold set (minimum cost 1.5 x non-brand CPA, zero conversions, 20 clicks).
**Claude adds:** Read the user's script to fill exclusion_script; explain each corrected number.
