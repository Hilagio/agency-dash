# Reporting and accountability (85 to 92)

### 85. Weekly report agent
**Data:** The last seven days against the seven before, change events, test register, margin.
**Method:** Contribution after ad spend first, then the three biggest movements by campaign, what changed in the account, and open decisions.
**Returns:** The data package for a one-page weekly report.
**Claude adds:** Writes the page in that order: margin figure at the top, three movements, changes and what each was expected to do, open decisions.

### 86. Monthly report agent
**Data:** Last full month, previous month, same month last year, test register.
**Method:** Month vs previous and vs last year, tests closed and tests running next month.
**Returns:** The data package for the monthly report.
**Claude adds:** Writes the report with verdicts for closed tests and next month's plan.

### 87. Agency report checker agent
**Data:** Reference numbers from the account: ROAS, cost, value, ROAS without brand, non-purchase share, break-even ROAS.
**Method:** Prepares the raw numbers an agency report should match, plus the questions to ask.
**Returns:** Reference numbers and five questions.
**Claude adds:** The user pastes the agency report; Claude marks every figure as matching, unverifiable or wrong.

### 88. Scorecard agent
**Data:** Margin block, brand terms, test register, change cadence.
**Method:** Pass or fail on what a founder can hold someone to: contribution margin reported, brand split out, every test with a kill number and review date, sane change cadence, the five margin inputs present.
**Returns:** The scorecard with evidence per line.

### 89. Anomaly alert agent
**Data:** Campaign daily, last 60 days.
**Method:** Sets a normal range for spend, conversions and cost per order per campaign from the same weekday in earlier weeks, then flags days in the last week outside it.
**Returns:** Flagged days with the metric, the size of the deviation, and the first thing to check.

### 90. Test log agent
**Data:** The test register.
**Method:** Keeps the record of what was tested, the kill number, what happened and what was decided, and catches tests repeated a year apart.
**Returns:** The log, tests awaiting a verdict and tests already answered.

### 91. Forecast agent
**Data:** Weekly spend and revenue over the last year, margin, planned budget.
**Method:** Fits how revenue responds to spend (a curve, not a straight line) and projects spend, revenue and contribution at the current pace and at the planned budget.
**Returns:** Two projections with assumptions, the marginal ROAS, and the weekly spend where more budget stops producing profitable orders.

### 92. Executive summary agent
**Data:** Agents 85, 86, 88 and 91.
**Method:** Collects the margin number, the direction, the scorecard and the forecast.
**Returns:** The data package for one page.
**Claude adds:** Writes the page: margin number, direction, the two decisions on the table, the number to watch next month. No jargon, one recommendation.
