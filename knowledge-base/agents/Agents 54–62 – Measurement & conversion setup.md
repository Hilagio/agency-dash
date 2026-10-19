# Measurement and conversion setup (54 to 62)

### 54. Conversion action audit agent
**Data:** All conversion actions with counting, category, origin and 90-day volume.
**Method:** Lists every enabled action, finds several purchase actions counted at once (the same order through different sources), checks counting against action type, purchase actions with a fixed default value, and primary actions with no conversions.
**Returns:** The inventory, the duplicates and the actions to retire or reclassify.

### 55. Primary conversion agent
**Data:** Conversion actions and conversions per action (90 days).
**Method:** Counts the actions that feed the Conversions column (what bidding optimises towards) and how much of the reported number is not a purchase.
**Returns:** Number of counted actions, the non-purchase share, and conversions and value with purchases only.

### 56. Attribution window agent
**Data:** Conversion actions with click and view windows.
**Method:** Lists every window and flags click windows over 30 days and view-through windows over a day.
**Returns:** Window settings per action and a recommendation.
**Claude adds:** The size of the credit shift cannot be read from the API. Ask the user to compare "Days to conversion" in the UI before changing a window.

### 57. Platform vs bank reconciliation agent
**Data:** Google Ads conversion value by month, store revenue and bank settlement by month (manual.store_revenue_csv).
**Method:** Lines the three figures up month by month and computes the gaps.
**Returns:** A monthly table with the gaps and the likely causes ranked (attribution overlap, non-purchase conversions, returns, tax and shipping, currency).

### 58. Profit as conversion value agent
**Data:** Margin and campaign targets.
**Method:** Works out what changes if contribution instead of revenue is sent as conversion value: on profit, break-even ROAS becomes 1.0, and every current target maps by the contribution share.
**Returns:** The value mapping, the equivalent target per campaign and the implementation outline.

### 59. Repeat buyer agent
**Data:** Orders with first-order flag and campaign (manual.orders_csv), campaign spend.
**Method:** Measures the share of orders per campaign from customers who had bought before, and cost per genuinely new customer.
**Returns:** Repeat-buyer share per campaign, cost per new customer and the exclusions needed.

### 60. Tracking integrity agent
**Data:** Conversions per action per day, clicks per day, conversion actions.
**Method:** Looks for the failure signatures: days with normal traffic and zero conversions, purchase actions recording conversions without value, two purchase actions with near-identical volume (double firing).
**Returns:** Each anomaly with its date range, the likely cause and the check to confirm it.

### 61. Consent mode agent
**Data:** Your consent setup (account.yaml, manual.consent_mode) and conversions by month.
**Method:** Checks version and mode, and looks for the step change in conversion rate that modelling leaves behind.
**Returns:** Implementation status and what to trust in reported numbers.
**Claude adds:** The modelled share is not exposed by the API. Ask for Tag Assistant results and the consent rate.

### 62. Offline conversion agent
**Data:** Conversion actions (existing import actions).
**Method:** Checks whether imports exist and what it takes to send confirmed orders after the return window and subscription second orders back.
**Returns:** Feasibility, identifiers to start capturing (click IDs, hashed email, order ID) and the import structure.
