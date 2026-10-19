# Contribution margin and CAC ceilings (45 to 53)

## The math every margin agent uses

Per order, from the margin block in account.yaml:

- Net = AOV x (1 - discount) / (1 + VAT)
- Kept = Net x (1 - return rate)
- Cost of goods = Kept x (1 - gross margin)
- Contribution = Kept - cost of goods - shipping - fulfillment - (AOV x payment % + payment fixed) - Net x other %
- Break-even ROAS = AOV / contribution. Contribution share = contribution / AOV.
- With unit costs per product: contribution share per product = net factor x (net price - unit cost) / net price - cost share.

Break-even ROAS is a threshold derived from margin. ROAS is what you measure. Contribution after ad spend = conversion value x contribution share - ad spend.

### 45. Contribution margin agent
**Data:** Margin block, optional unit costs, campaign daily.
**Method:** Calculates contribution per order line by line, contribution per product when unit costs exist, and the account's contribution after ad spend for 30 and 90 days. Names any margin input that is missing.
**Returns:** Margin per order, per product and for the account after ad spend.

### 46. CAC ceiling agent
**Data:** Agent 45 plus repeat orders per new customer.
**Method:** The most you can pay for a customer at first order, and separately over twelve months. Keeps them apart so a first-order target is never set against a lifetime number.
**Returns:** Two ceilings with assumptions and the target ROAS each implies.

### 47. Break-even ROAS agent
**Data:** Agent 45 and campaign performance.
**Method:** The ROAS at which the account makes exactly zero, compared against every campaign.
**Returns:** The break-even number, each campaign above or below, and the spend and loss below break-even.

### 48. Margin per product agent
**Data:** Products, margin, optional unit costs.
**Method:** Puts margin next to spend per product and sorts by contribution after ad spend.
**Returns:** The products carrying the account, the products consuming it, the share of product spend on loss makers, and the cut list.

### 49. Spend per product agent
**Data:** Products, margin.
**Method:** Measures concentration (share of spend in the top 10 and along the curve) and the share below the profit line.
**Returns:** Concentration figures, the curve, and top-spend products below the profit line.

### 50. Payback period agent
**Data:** Orders with customer IDs (manual.orders_csv), Google Ads spend by month, margin.
**Method:** Builds monthly cohorts of new customers and adds their contribution month by month until it covers the acquisition cost.
**Returns:** Payback in months per cohort and the trend.

### 51. Discount stacking agent
**Data:** Orders with discount codes and amounts.
**Method:** Finds orders with more than one code, computes the real discount rate and compares it to the planned one.
**Returns:** Real vs planned rate, the code combinations responsible, and the margin recovered by closing them.

### 52. Return rate agent
**Data:** Returns by product and country (manual.returns_csv), ROAS by country.
**Method:** Recalculates break-even ROAS with each country's return rate and flags countries where returns turn a profitable campaign into a losing one.
**Returns:** Return-adjusted break-even per country and product, and the markets to split out.

### 53. Blended MER agent
**Data:** Store revenue and total ad spend across channels (account.yaml), Google Ads 30 days.
**Method:** Blended marketing efficiency next to platform ROAS, and the gap.
**Returns:** MER, platform ROAS, the gap and what it says about attribution.
