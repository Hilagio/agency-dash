#!/usr/bin/env bash
# Call a cron-protected API endpoint and FAIL LOUDLY on anything but a real 200.
#
# The old workflow used `curl -fsS`, which treats the app's unauthenticated
# redirect to /login as success (it's a 2xx/3xx body, not a 4xx) — so a missing
# CRON_SECRET produced a green run that did nothing. This asserts HTTP 200 AND
# rejects a login-redirect body so that failure mode can't hide again.
#
# Usage: cron-call.sh <url> <json-body-or-empty> <max-time-seconds>
set -euo pipefail

URL="$1"
BODY="${2:-}"
MAX_TIME="${3:-600}"

args=(-sS -X POST "$URL"
  -H "Authorization: Bearer ${CRON_SECRET}"
  -H "Content-Type: application/json"
  -w $'\n%{http_code}'
  --max-time "$MAX_TIME")
if [ -n "$BODY" ]; then
  args+=(-d "$BODY")
fi

# These jobs re-fetch the same trailing window (delete + re-insert), so re-running
# is safe. A 5xx / timeout is usually transient (a brief Railway restart or an
# OOM that frees on retry), so retry a couple of times with backoff before giving
# up. Auth failures (/login) and 4xx are NOT retried — they won't fix themselves.
code=""; body=""
for attempt in 1 2 3; do
  resp="$(curl "${args[@]}" || true)"
  code="$(printf '%s' "$resp" | tail -n1)"
  body="$(printf '%s' "$resp" | sed '$d')"
  echo "HTTP ${code:-000} — $URL (attempt $attempt)"
  printf '%s\n' "$body" | head -c 800

  case "$body" in
    *"/login"*)
      echo "::error::$URL was redirected to /login — CRON_SECRET is missing or does not match Railway's value."
      exit 1 ;;
  esac
  if [ "$code" = "200" ]; then echo "ok"; exit 0; fi
  # Retry only transient failures (5xx or no/again empty code from a timeout).
  case "${code:-000}" in
    5*|000|"") if [ "$attempt" -lt 3 ]; then sleep $((attempt * 20)); continue; fi ;;
  esac
  echo "::error::$URL returned HTTP ${code:-000} (expected 200)."
  exit 1
done
echo "::error::$URL still failing after retries (last HTTP ${code:-000})."
exit 1
