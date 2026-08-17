#!/usr/bin/env bash
# Drive a BATCHED cron endpoint: call it repeatedly with an increasing offset
# until the whole portfolio is covered. Each call ingests a small slice, so a
# large portfolio is processed in low-memory chunks instead of one request that
# OOMs.
#
# Resilience: a slice that keeps 502-ing (one pathological account can crash the
# app — this took the nightly down for three days straight) no longer aborts the
# night. The failed slice is re-walked one account at a time; only the account
# that still crashes is skipped, with a ::warning naming it (via listOnly), and
# the sweep continues so signals/briefings still run for everyone else.
#
# The endpoint must accept {days,offset,limit} → {total,processed,failed} and
# {listOnly,offset,limit} → {total,accounts:[{offset,name,googleAdsId}]}.
# Re-fetching a slice is safe (delete + re-insert). Auth failures exit 1.
#
# Usage: cron-batch.sh <url> <days> <limit-per-batch> <per-request-max-seconds>
set -euo pipefail

URL="$1"; DAYS="${2:-14}"; LIMIT="${3:-10}"; MAXTIME="${4:-300}"

# POST $1=payload with $2 attempts (default 3). Sets CODE and JSON.
# Returns 0 on HTTP 200; exits hard on a /login redirect (bad CRON_SECRET).
post() {
  local payload="$1" attempts="${2:-3}" attempt resp
  CODE=""; JSON=""
  for attempt in $(seq 1 "$attempts"); do
    resp="$(curl -sS -X POST "$URL" \
      -H "Authorization: Bearer ${CRON_SECRET}" \
      -H "Content-Type: application/json" \
      -w $'\n%{http_code}' --max-time "$MAXTIME" -d "$payload" || true)"
    CODE="$(printf '%s' "$resp" | tail -n1)"
    JSON="$(printf '%s' "$resp" | sed '$d')"
    case "$JSON" in
      *"/login"*) echo "::error::$URL redirected to /login — CRON_SECRET missing or wrong."; exit 1 ;;
    esac
    [ "$CODE" = "200" ] && return 0
    case "${CODE:-000}" in
      5*|000|"") if [ "$attempt" -lt "$attempts" ]; then sleep $((attempt * 15)); continue; fi ;;
      *) return 1 ;;  # 4xx won't fix itself
    esac
  done
  return 1
}

# Learn the portfolio size up front (no ingest) so even a first-slice crash
# can't hide the rest of the portfolio.
post "{\"listOnly\":true,\"offset\":0,\"limit\":1}" 3 || { echo "::error::$URL unreachable (HTTP ${CODE:-000}) — cannot start the sweep."; exit 1; }
total="$(printf '%s' "$JSON" | jq -r '.total // 0')"
echo "portfolio: ${total} account(s), batches of ${LIMIT}"

skipped=()
offset=0
while [ "$offset" -lt "$total" ]; do
  if post "{\"days\":${DAYS},\"offset\":${offset},\"limit\":${LIMIT}}"; then
    processed="$(printf '%s' "$JSON" | jq -r '.processed // 0')"
    failed="$(printf '%s' "$JSON" | jq -r '.failed // 0')"
    echo "batch offset=${offset}: processed ${processed}/${total} (failed ${failed})"
    offset=$((offset + LIMIT))
  else
    echo "batch offset=${offset} kept failing (HTTP ${CODE:-000}) — walking this slice one account at a time"
    end=$((offset + LIMIT)); [ "$end" -gt "$total" ] && end="$total"
    i="$offset"
    while [ "$i" -lt "$end" ]; do
      if post "{\"days\":${DAYS},\"offset\":${i},\"limit\":1}" 2; then
        echo "  single offset=${i}: ok"
      else
        failcode="${CODE:-000}"  # capture before the listOnly lookup overwrites it
        name="offset ${i}"
        if post "{\"listOnly\":true,\"offset\":${i},\"limit\":1}" 2; then
          name="$(printf '%s' "$JSON" | jq -r '.accounts[0].name // "?"') ($(printf '%s' "$JSON" | jq -r '.accounts[0].googleAdsId // "?"'), offset ${i})"
        fi
        echo "::warning::ingest SKIPPED ${name} — this account crashes the app (HTTP ${failcode}); its data stays stale until it's fixed."
        skipped+=("${name}")
      fi
      i=$((i + 1))
      sleep 2
    done
    offset="$end"
  fi
  sleep 2
done

if [ "${#skipped[@]}" -gt 0 ]; then
  echo "::warning::ingest finished with ${#skipped[@]} skipped account(s): ${skipped[*]}"
else
  echo "ingest complete — ${total} account(s)."
fi
exit 0
