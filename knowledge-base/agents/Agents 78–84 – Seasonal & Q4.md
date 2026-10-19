# Seasonal and Q4 (78 to 84)

### 78. Q4 timing agent
**Data:** Weekly performance of last year's Q4 (the pull keeps 420 days).
**Method:** Finds last year's peak weeks and works backwards to when campaigns must be live and out of learning, so learning is paid in cheap weeks. If this year's window is already too close, the calendar is for next year and only budget moves are safe now.
**Returns:** A dated build calendar: structure live, last target change, assets loaded, freeze.

### 79. Seasonality check agent
**Data:** Campaign daily for this year and last year, impression share.
**Method:** Three checks: the same move in the same period last year, impression share lost to budget and rank, conversion rate.
**Returns:** A verdict (seasonal or not) with the evidence from each check.

### 80. Peak CPC agent
**Data:** Weekly CPC of last autumn, this year's CPC index vs last year.
**Method:** Maps how CPC moved through last year's peak and projects the cost of the same clicks this year.
**Returns:** The CPC curve by week, the weeks where cost rises fastest, and the budget those weeks need.

### 81. Promotion calendar agent
**Data:** Margin, planned promotions (manual.promotions_csv).
**Method:** Runs every discount level and every planned promotion through the margin math.
**Returns:** Contribution per order and break-even ROAS per promotion, a viable or not viable call, and the maximum discount that still makes money.

### 82. Inventory and budget agent
**Data:** Stock per product (manual.inventory_csv), product sales pace.
**Method:** Days of cover per advertised product at the current pace.
**Returns:** Products that sell out within 30 days while advertised, and where to move budget.

### 83. Post-peak wind-down agent
**Data:** Last December and January, current targets and budgets.
**Method:** Measures last season's December to January change and plans the step down from peak budgets and targets.
**Returns:** A dated wind-down schedule with the wait between steps.

### 84. Year-over-year agent
**Data:** The last 30 days and the same 30 days last year.
**Method:** Compares like for like per campaign and splits the change into spend effect (extra spend at last year's ROAS) and efficiency effect (ROAS change on this year's spend).
**Returns:** A year-over-year table with both effects per campaign and in total.
