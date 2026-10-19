# Account audits (1 to 8)

### 1. Full account audit agent
**Data:** The full pull. Uses the margin and brand terms from account.yaml when present.
**Method:** Runs every check the data allows, in order: measurement first (55, 54, 60), then brand and margin (27, 45, 47, 48), then waste and search terms (2, 9, 12, 13, 14), then settings and bidding (30, 31, 32, 36, 38, 39, 40), then hygiene and post-click (5, 6, 3, 4, 63, 64, 70, 75). Skips checks with missing inputs and lists what is missing.
**Returns:** One ranked list of findings. Each states the finding, the amount, the agent that produced it and the next action. Sorted by amount, not by severity.
**Claude adds:** Say clearly that amounts from different checks overlap and the sum is an upper bound. Group the top findings into at most five themes before listing details.

### 2. Wasted spend agent
**Data:** Campaign daily, search terms (Search, Shopping and PMax), products, devices and networks, all 90 days.
**Method:** Sums spend with zero conversions at three levels: search terms, products, campaigns. Anything under 20 clicks goes to a separate "not enough data yet" bucket. With margin in account.yaml it also counts spend that converts but below break-even, per campaign: net loss = spend x (1 - ROAS x contribution share). It names retargeting below ROAS 1, TV screens and search partners below break-even separately.
**Returns:** Total wasted spend split by level, the top 20 line items in each, and the net loss of campaigns below break-even.
**Claude adds:** Zero-conversion waste and below-break-even loss are different kinds of waste. Report both, never add the levels together.

### 3. Change history agent
**Data:** Change events (30 days, API limit) and campaign daily.
**Method:** Builds the change timeline by day and by source (person, script, API, Google auto-apply). Flags campaign days with more than three changes and every change made within fourteen days of the previous change to the same campaign. Lines up ROAS seven days before and after the first change per campaign.
**Returns:** The timeline, the breaks of the fourteen-day rule and the largest before/after shifts.
**Claude adds:** Before/after is correlation on a date, not proof. For changes older than 30 days ask for the Change history export from the UI.

### 4. Auto-applied recommendations agent
**Data:** Auto-apply subscriptions and change events from Google auto-apply.
**Method:** Lists which auto-apply types are on, marks those that change targeting, copy, bids or budgets rather than hygiene, and counts every change the system made on its own.
**Returns:** Each switched-on type with a keep or turn-off call, and the log of changes no person decided.
**Claude adds:** Types shown as UNKNOWN are newer than the installed library. Ask the user to check Recommendations > Auto-apply in the UI.

### 5. Disapproval and limited status agent
**Data:** Ad status and policy reasons, product status and issues.
**Method:** Collects every live ad that is disapproved or limited and every product that is not eligible, grouped by reason. Estimates impressions lost per product group from the average of live products.
**Returns:** Every blocked item grouped by cause, with an impression estimate.
**Claude adds:** The fix per cause, in plain words. The impression estimate is an order of magnitude.

### 6. Account hygiene agent
**Data:** Campaigns, ad groups, ads, keywords.
**Method:** Finds live campaigns without live ad groups, live ad groups without live ads, keywords duplicated across campaigns, paused campaigns with no cost for 90 days, and how many naming patterns are in use.
**Returns:** A cleanup list ordered by how much confusion each item causes when reading a report.

### 7. Quick win ranking agent
**Data:** The findings of agent 1 (or any agent output).
**Method:** Scores each finding on amount, hours to implement and days until the result is readable (estimates, editable in the EFFORT table). Sorts by amount per hour.
**Returns:** The same findings sorted into this week, this month and this quarter.

### 8. Audit report agent
**Data:** The outputs of agents 1 to 7.
**Method:** Collects the total amount identified, the three biggest findings and the full list.
**Returns:** The data package for a document a founder reads in ten minutes.
**Claude adds:** Writes the document: summary page with the total amount and the three biggest problems in plain language, a findings table, the recommended order of work, and an appendix with everything else. Show the problem with its number; keep solutions short.
