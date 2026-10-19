# Setup, data sources and exports

## Setup (once)

1. **Python 3.11 or newer**, then `pip install google-ads pyyaml`.
2. **Google Cloud project.** Since 9 September 2026 Google Ads API access belongs to a Google Cloud project, not to a
   developer token. Create a project at console.cloud.google.com and enable the Google Ads API.
3. **Brand verification.** Set up the OAuth consent screen (branding) and get it verified. Google requires a verified
   project before it grants Basic access.
4. **Request access.** In Cloud Console open the Google Ads API overview page (console.cloud.google.com/google/ads-apis/overview)
   and apply. These agents only read, so Explorer access (2,880 operations per day) is enough; Basic is usually approved
   automatically within minutes. Requests from the old API Center in Google Ads are no longer processed.
5. **OAuth client.** Cloud Console > APIs and services > Credentials > Create OAuth client ID (Desktop app). Note client
   ID and secret.
6. **Refresh token.** Run the `generate_user_credentials.py` example from the google-ads-python repository once and sign in
   with a Google account that can see the ad account.
7. **Environment variables.** `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`, `GOOGLE_ADS_REFRESH_TOKEN`, and
   `GOOGLE_ADS_LOGIN_CUSTOMER_ID` (the manager account ID) if you reach the account through a manager account. An old
   `GOOGLE_ADS_DEVELOPER_TOKEN` can stay; Google ignores it now. Or put everything in a `google-ads.yaml` and set
   `GOOGLE_ADS_CONFIGURATION_FILE_PATH` to it.
8. **Test.** `python scripts/gaa_pull.py --account test --customer-id <id>`. An access problem aborts with
   "ABORT (access)" and writes nothing. Stale environment variables with the same names are a common cause.

Account data goes to `~/google-ads-agents-data/<account>/` by default (change with `--data-dir`). It never goes into the
skill folder.

## What the pull fetches

One pull, read-only, about 40 reports. Each agent lists the reports it needs (`gaa_run.py --list`).

| Report | Source (GAQL resource) | Window | Used by |
|---|---|---|---|
| customer | customer | now | currency for every agent |
| campaign_settings | campaign + campaign_budget | now | most agents |
| campaign_daily | campaign, segmented by date, incl. impression share | 420 days | 2, 3, 37 to 47, 78 to 92 |
| ad_groups, ads_all, ads_90 | ad_group, ad_group_ad | now / 90 days | 5, 6, 29, 34, 70 |
| asset_group_assets, campaign_assets, customer_assets | asset links | now | 34 |
| search_terms_90 | search_term_view (Search and Shopping) | 90 days | 2, 9 to 16, 17, 27 |
| search_terms_kw_90 | search_term_view with keyword and match type | 90 days | 13, 29, 70 |
| search_terms_30 | search_term_view | 30 days | spare 30-day view |
| pmax_search_terms_90 | campaign_search_term_view (PMax, with cost) | 90 days | 2, 9, 14, 27 |
| pmax_search_categories_90 | campaign_search_term_insight (no cost) | 90 days | 14 |
| keywords_90, keywords_all | keyword_view, ad_group_criterion | 90 days / now | 6, 10, 11, 35, 70 |
| campaign_network_90, campaign_device_90, campaign_hour_dow_90 | campaign segmented by network, device, hour and weekday | 90 days | 2, 31, 32, 33, 42 |
| user_location_90, geographic_90, campaign_locations | user_location_view, geographic_view, campaign_criterion | 90 days | 30, 52 |
| change_events_30 | change_event | 30 days (API limit) | 3, 4, 15, 36, 38, 42, 85 |
| change_status_90 | change_status (what changed, not who) | 90 days | 38 |
| recommendation_subscriptions | recommendation_subscription (auto-apply) | now | 4 |
| conversion_actions, conversions_by_action_daily_90 | conversion_action, customer by conversion action | now / 90 days | 54 to 62 |
| products_90 | shopping_product (status, issues, price, stock) | 90 days | 5, 17 to 24, 48, 49, 75, 82 |
| product_campaign_90, product_daily_14 | shopping_performance_view | 90 / 14 days | 28, 35, 75 |
| landing_pages_30, landing_pages_device_30 | landing_page_view | 30 days | 71, 72, 73, 77 |
| shared_sets, shared_set_members, campaign_shared_sets, campaign_negative_keywords | negative lists | now | 10, 14, 15 |
| campaign_audience_criteria, adgroup_audience_criteria, asset_group_signals, user_lists | audiences | now | 63 to 69 |
| pmax_placements_90 | performance_max_placement_view (impressions only) | 90 days | context for 2 and 32 |

**API limits worth knowing.** Change history through the API reaches 30 days. For older changes export Change history
from the Google Ads UI. PMax search categories have no cost; PMax search terms with cost come from
campaign_search_term_view. Feed rules, feed history, store orders, returns and email lists are not in the Google Ads
API at all, so those agents ask for a file.

## Manual exports (only for the agents that need them)

Put the file path into `account.yaml` under `manual`. Any of `;` `,` or tab as separator; decimal comma is fine.

| Key | Agents | Columns | Where to export it |
|---|---|---|---|
| feed_csv | 17, 18, 22 | id, title, description, brand, gtin, mpn, product_type, google_product_category, condition, color, size, material, age_group, gender, availability, price, image_link, shipping, identifier_exists | Merchant Center > Products > Download (all products, all attributes) |
| feed_changes_csv | 26 | date, item_id, field, old, new | Keep a log whenever titles or attributes change |
| orders_csv | 50, 51, 59, 69 | order_id, date, customer_id, first_order, revenue, discount, discount_codes, campaign, country, days_from_first_visit | Store admin order export (Shopify: Orders > Export); campaign from UTM or the order's landing source; days_from_first_visit from analytics |
| returns_csv | 52 | item_id, country, sold, returned | Store or returns tool, last 6 to 12 months |
| store_revenue_csv | 57 | month, store_revenue, bank_settlement | Store finance report and payment provider payouts |
| inventory_csv | 82 | item_id, stock | Store inventory export |
| promotions_csv | 81 | name, start, end, discount_pct | Your promotion plan |
| offers_csv | 74 | step, offer, discount_pct, combinable | Walk the site as a paid visitor and note every offer |
| store_funnel_csv | 76 | step, sessions_paid, sessions_all | Analytics funnel (product page, cart, checkout, order) |
| product_costs_csv (top level) | 20, 23, 28, 45, 48, 49 | item_id, unit_cost | Store or ERP cost price per product |

The margin block in `account.yaml` is the one input most accounts do not have. Agents 37, 41, 43, 45 to 53, 58, 81
and parts of 2, 11, 36, 39 and 91 cannot run without it, and they say so.
