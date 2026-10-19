# Campaign structure and settings (27 to 35)

### 27. Branded and non-brand split agent
**Data:** Search terms of Search, Shopping and PMax (90 days), brand terms, campaign totals.
**Method:** Marks every search term as brand or non-brand, by text, regardless of the campaign it ran in. Computes ROAS for each half, the account ROAS without brand, and finds campaigns where 10 to 90 % of spend is brand (mixed).
**Returns:** Brand and non-brand side by side, reported ROAS vs ROAS without brand, the mixed campaigns, and the spend with no search term attached (PMax display and video, Demand Gen).
**Claude adds:** The structure that keeps them apart: one brand campaign, brand terms as broad negatives everywhere else, brand exclusion on PMax.

### 28. Campaign structure agent
**Data:** Product performance per campaign, margin and optional unit costs.
**Method:** Checks per campaign how much spend goes to products that make money after ads and how much to products that lose it. Campaigns with 20 to 80 % on each side hold products with opposite economics.
**Returns:** Each campaign with its profitable share, and the mixed campaigns.
**Claude adds:** A proposed split (by the labels from agent 23, plus brand, intent and seasonality), with the reason for each split.

### 29. Ad group tightness agent
**Data:** Search terms with their keyword, ad headlines.
**Method:** Measures per ad group the share of cost on terms that do not contain every word of the keyword, and how many of the top five terms appear in the headlines.
**Returns:** A drift score per ad group, the worst offenders and which to split.

### 30. Location targeting agent
**Data:** Campaign location option, user location report, shipping countries.
**Method:** Finds campaigns on "Presence or interest" and measures spend on users physically outside the shipping countries.
**Returns:** Campaigns to switch to "Presence", spend outside the footprint by country, exclusions to add.

### 31. Network and partner settings agent
**Data:** Search campaigns segmented by network.
**Method:** Separates Google Search, search partners and display expansion per campaign and compares cost per order.
**Returns:** Network performance per campaign and a keep or switch-off call, with the spend attached.

### 32. Device split agent
**Data:** Campaigns segmented by device.
**Method:** Compares cost, conversion rate, order value, CTR and ROAS for mobile, desktop, tablet and TV. When mobile CTR holds but conversion rate drops, the gap is on the page, not in the ad.
**Returns:** Device table, where the gap sits, and whether the fix is the page or an exclusion.
**Claude adds:** Under Smart Bidding device bid adjustments are mostly ignored; only exclusion (-100 %) bites.

### 33. Ad schedule agent
**Data:** Campaigns by weekday and hour, 90 days.
**Method:** Finds hour slots with at least 20 clicks and zero conversions or less than half the account ROAS.
**Returns:** Spend by hour, slots with a real gap and their cost.
**Claude adds:** Only cut recurring patterns, never single days; under Smart Bidding remove the window rather than set a bid modifier; account for purchase delay.

### 34. Asset coverage agent
**Data:** Ads, PMax asset groups, campaign and account assets.
**Method:** Counts filled vs available slots: RSA 15 headlines and 4 descriptions; PMax 15 headlines, 5 long headlines, 5 descriptions, 20 images, 5 videos, 5 logos; sitelinks, callouts and snippets per Search campaign.
**Returns:** Coverage tables and the ads and asset groups running thin.
**Claude adds:** Drafts copy for the empty slots from the search terms each ad group actually buys.

### 35. Duplicate coverage agent
**Data:** Keyword performance, product performance per campaign.
**Method:** Finds the same keyword in several ad groups and the same product serving from several campaigns, and which place wins the auction.
**Returns:** Every overlap with the winner and the spend outside the winning place.
