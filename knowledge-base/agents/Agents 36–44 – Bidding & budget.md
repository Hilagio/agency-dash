# Bidding and budget (36 to 44)

### 36. Bid strategy audit agent
**Data:** Campaign strategy and targets, change events, margin.
**Method:** Lists every live campaign's strategy and target, marks targets as justified (at or above break-even ROAS, or at or below the CAC ceiling) or not, and counts strategy switches in 30 days.
**Returns:** Strategy table with a justified mark per target, and campaigns restarted too often to have learned.

### 37. Target setting agent
**Data:** Margin, campaign targets, 90-day performance.
**Method:** Derives the correct target from contribution margin, not from last month: break-even ROAS, or the target ROAS that also covers fixed costs and the target margin when entered. For tCPA campaigns the first-order CAC ceiling.
**Returns:** A recommended target per campaign, the margin math behind it, and the gap to the current target.
**Claude adds:** Brand can sit higher. New-customer campaigns with repeat purchases may go down to the 12-month break-even. A person decides.

### 38. Learning phase agent
**Data:** Change events (strategy, target, budget), change status (90 days).
**Method:** Marks each change that restarts learning, gives every campaign a learning window of seven days after it, and computes the share of the last 30 days spent learning and the days since the last change.
**Returns:** Days since last change, share of time learning, and campaigns never left alone long enough to judge.

### 39. Budget cap agent
**Data:** Impression share lost to budget (30 days), campaign targets, margin.
**Method:** Finds campaigns losing at least 10 % impression share to budget, estimates the clicks held back, and checks profitability against break-even. Since 17 August 2026 budget-limited tROAS and tCPA campaigns steer to the entered target instead of beating it, so a capped campaign whose target sits far below its actual ROAS is flagged.
**Returns:** Capped campaigns with lost volume and a raise, hold or lower call.

### 40. Impression share agent
**Data:** Impression share, lost to budget, lost to rank (30 days), margin.
**Method:** Splits each campaign's missing share into budget and rank, then decides whether growing is worth it at the campaign's ROAS.
**Returns:** The split per campaign and whether the lever is money or relevance.

### 41. Bid target adjustment agent
**Data:** Current targets and the recommendation from agent 37.
**Method:** Plans the move from current to recommended target in steps of at most 15 %, fourteen days apart.
**Returns:** A step schedule per campaign: target per step, date, and the number to check before the next step.

### 42. Change cadence agent
**Data:** Change events (30 days), revenue by weekday.
**Method:** Counts changes per week per campaign and per source, and the readable days lost when a change lands inside the previous change's window.
**Returns:** Current cadence, readable days lost, and one proposed change day (the weekday with the smallest revenue share).

### 43. Budget reallocation agent
**Data:** Campaign performance (90 days), budgets, impression share lost to budget, margin.
**Method:** Ranks campaigns by contribution after ad spend per unit of spend, then moves up to 20 % of budget from campaigns that burn contribution to profitable campaigns limited by budget.
**Returns:** The ranking and step 1 of the plan with the amounts per day and the expected contribution change (an upper bound).

### 44. Kill number agent
**Data:** The test register in account.yaml.
**Method:** Checks every running test for a kill number and a review date, and flags tests due for a decision.
**Returns:** A test register with the decision due on each.
