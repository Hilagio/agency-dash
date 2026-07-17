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

resp="$(curl "${args[@]}")"
code="$(printf '%s' "$resp" | tail -n1)"
body="$(printf '%s' "$resp" | sed '$d')"

echo "HTTP $code — $URL"
printf '%s\n' "$body" | head -c 800

if [ "$code" != "200" ]; then
  echo "::error::$URL returned HTTP $code (expected 200)."
  exit 1
fi
case "$body" in
  *"/login"*)
    echo "::error::$URL was redirected to /login — CRON_SECRET is missing or does not match Railway's value."
    exit 1
    ;;
esac
echo "ok"
