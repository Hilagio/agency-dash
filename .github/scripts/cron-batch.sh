#!/usr/bin/env bash
# Drive a BATCHED cron endpoint: call it repeatedly with an increasing offset
# until it reports {"done":true}. Each call ingests a small slice, so a large
# portfolio is processed in low-memory chunks instead of one request that OOMs.
#
# The endpoint must accept {days,offset,limit} and return {total,nextOffset,done}.
# Fails loudly (like cron-call.sh): asserts HTTP 200, rejects /login, retries a
# transient 5xx per batch. Re-fetching a slice is safe (delete + re-insert).
#
# Usage: cron-batch.sh <url> <days> <limit-per-batch> <per-request-max-seconds>
set -euo pipefail

URL="$1"; DAYS="${2:-14}"; LIMIT="${3:-10}"; MAXTIME="${4:-300}"
offset=0

for _ in $(seq 1 500); do   # hard cap on batches (500 * limit accounts)
  payload="{\"days\":${DAYS},\"offset\":${offset},\"limit\":${LIMIT}}"

  code=""; json=""
  for attempt in 1 2 3; do
    resp="$(curl -sS -X POST "$URL" \
      -H "Authorization: Bearer ${CRON_SECRET}" \
      -H "Content-Type: application/json" \
      -w $'\n%{http_code}' --max-time "$MAXTIME" -d "$payload" || true)"
    code="$(printf '%s' "$resp" | tail -n1)"
    json="$(printf '%s' "$resp" | sed '$d')"
    case "$json" in
      *"/login"*) echo "::error::$URL redirected to /login — CRON_SECRET missing or wrong."; exit 1 ;;
    esac
    [ "$code" = "200" ] && break
    case "${code:-000}" in
      5*|000|"") if [ "$attempt" -lt 3 ]; then sleep $((attempt * 15)); continue; fi ;;
    esac
    break
  done

  if [ "$code" != "200" ]; then
    echo "::error::$URL batch at offset=${offset} returned HTTP ${code:-000}."
    printf '%s\n' "$json" | head -c 400
    exit 1
  fi

  total="$(printf '%s' "$json" | jq -r '.total // 0')"
  processed="$(printf '%s' "$json" | jq -r '.processed // 0')"
  next="$(printf '%s' "$json" | jq -r '.nextOffset // 0')"
  done_flag="$(printf '%s' "$json" | jq -r '.done // false')"
  failed="$(printf '%s' "$json" | jq -r '.failed // 0')"
  echo "batch offset=${offset}: processed ${processed}/${total} (failed ${failed}) → next ${next}"

  if [ "$done_flag" = "true" ]; then
    echo "ingest complete — ${total} account(s)."
    exit 0
  fi
  offset="$next"
  sleep 2
done

echo "::error::ingest did not finish within the batch cap."
exit 1
