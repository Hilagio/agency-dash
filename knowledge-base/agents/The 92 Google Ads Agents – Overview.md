---
name: google-ads-agents
description: 92 read-only Google Ads agents for eCommerce accounts, fed straight from the Google Ads API. Use when someone wants to audit or read a Google Ads account, find wasted spend, check search terms and negatives, feed and product titles, campaign structure, bidding and budgets, contribution margin, CAC ceilings, break-even ROAS, conversion tracking, audiences, landing pages, Q4 and seasonality, or reporting. Pick the right agent by number, by name or by the question, pull the data once, run it, explain the result.
---

# The 92 Google Ads Agents

One agent per job, for running an eCommerce Google Ads account. A Python data layer pulls every report from the
Google Ads API once per account. Each agent is a small, deterministic calculation over that pull, so numbers come
from code, not from guessing. Claude picks the agent, runs it, reads the result and explains it.

Nothing in this skill writes to an ad account. Every agent returns findings and recommendations. A person decides.

## Three rules

1. **Automate the reading of the account, never the target.** Agents read and recommend, a person changes.
2. **Nothing gets a recommendation without a number attached.** If a finding cannot be quantified, it is a flag, not a fix.
3. **One change at a time, then fourteen days.** Several agents will tell you to wait. Waiting is the method.

## How to run

Scripts live in this skill's `scripts/` folder; call them with their full path. Account data goes to
`~/google-ads-agents-data/<account>/` (override with `--data-dir`). Never write account data into the skill folder.

1. **Credentials.** The Google Ads API needs `GOOGLE_ADS_CLIENT_ID`, `GOOGLE_ADS_CLIENT_SECRET`,
   `GOOGLE_ADS_REFRESH_TOKEN` and, for manager accounts, `GOOGLE_ADS_LOGIN_CUSTOMER_ID` in the environment, or
   `GOOGLE_ADS_CONFIGURATION_FILE_PATH` pointing to a `google-ads.yaml`. Since September 2026 access belongs to a
   Google Cloud project; a developer token is optional. Python package: `pip install google-ads pyyaml`. If access is
   missing, walk the user through `references/00-data-sources.md` (section Setup) and stop.
2. **Pull once.** `python scripts/gaa_pull.py --account <name> --customer-id <id>`. Takes one to five minutes,
   read-only. It aborts on auth errors and writes nothing, so an empty cache never looks like a quiet account.
   Re-pull when the cache is older than a day or the user changed something.
3. **Account config.** Copy `templates/account-template.yaml` to `<data-dir>/<account>/account.yaml` and fill what
   the user knows: brand terms, shipping countries and the margin block matter most. Ask for these once, in one
   message, before running margin or brand agents. Never invent a margin, a brand term or a competitor.
4. **Run.** `python scripts/gaa_run.py --account <name> --agents <list>`. `start` runs the five below, `all` runs
   everything, `1` runs the full audit. Results land as `agent_NN.json` in the cache folder.
5. **Read and explain.** Open the JSON, read `status`, `findings`, `metrics`, `tables`, `missing`, `notes`. Then
   follow the agent's section in the matching reference file for how to explain it and what Claude adds on top.

## Status values

- `ok`: ran on complete data.
- `partial`: ran, but something is missing (listed in `missing`) or Claude has to finish the job (written output,
  page review). The reference file says what Claude adds.
- `blocked`: a required report or config field is missing. Say exactly which, and how to get it.
- `manual`: needs a file the user exports by hand. Say which file and which columns (`references/00-data-sources.md`).
- `calibration`: agent 9 needs its unclear search terms classified first (see `references/02-search-terms.md`).

## How to answer

- Lead with the money: the amount next to every finding, in the account currency, sorted by amount.
- Separate fixes (with an amount) from flags (without).
- End with the single next action and the date to check the result (`check_on`, fourteen days after the change).
- Never present overlapping amounts from different agents as one total. Agent 1 says so in its notes.
- Break-even ROAS is a threshold from margin. ROAS is what was measured. Never call a measured ROAS "break-even".
- When the user is new to the account, run the start five first. When they ask for a full audit, run agent 1.
- If the user pastes an export instead of having API access, read it directly and follow the agent's method by hand.

## Start with these five

1. **Agent 55, primary conversion.** Until you know what is counted, nothing else can be read.
2. **Agent 27, branded vs non-brand split.** Until brand is separated, the return is not the return.
3. **Agent 45, contribution margin.** Until margin is in, there is no target to aim at.
4. **Agent 48, margin per product.** Usually the largest single finding.
5. **Agent 9, search term reader.** The fastest money back.

## Where each agent is described

| Agents | Topic | Reference |
|---|---|---|
| Setup, data, exports | API setup, what each report is, manual files and their columns | `references/00-data-sources.md` |
| 1 to 8 | Account audits | `references/01-audits.md` |
| 9 to 16 | Search terms and negatives | `references/02-search-terms.md` |
| 17 to 26 | Feed and product titles | `references/03-feed.md` |
| 27 to 35 | Campaign structure and settings | `references/04-structure.md` |
| 36 to 44 | Bidding and budget | `references/05-bidding.md` |
| 45 to 53 | Contribution margin and CAC ceilings | `references/06-margin.md` |
| 54 to 62 | Measurement and conversion setup | `references/07-measurement.md` |
| 63 to 69 | Audience exclusions | `references/08-audiences.md` |
| 70 to 77 | Post-click and landing pages | `references/09-post-click.md` |
| 78 to 84 | Seasonal and Q4 | `references/10-seasonal.md` |
| 85 to 92 | Reporting and accountability | `references/11-reporting.md` |

`python scripts/gaa_run.py --list` prints every agent with the reports it needs.
