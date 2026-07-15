/**
 * Resilient migrate-on-boot (Railway `start`).
 *
 * `prisma migrate deploy` refuses to run if a previous migration is stuck in a
 * "failed" state (error P3009) — which happens when a deploy is interrupted
 * mid-migration (e.g. the container is killed during startup). That wedges every
 * future deploy until a human clears the record.
 *
 * Because our migrations are idempotent (CREATE TABLE IF NOT EXISTS, etc.), it is
 * safe to auto-recover: mark the failed migration(s) as rolled-back and retry
 * once. If the retry still fails, we surface the real error instead of masking it.
 *
 * We also retry a transient "database unreachable" (P1001) on boot with backoff —
 * on Railway the Postgres service can be a few seconds behind the app on a
 * cold start, and a hard crash-loop over that is just noise.
 */
import { execSync } from "node:child_process";

/** Synchronous sleep (no busy-wait) — this script must stay synchronous. */
function sleep(ms) { Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms); }
const isDbUnreachable = (text) => /P1001/.test(text) || /Can't reach database server/i.test(text);
const DB_BACKOFF_MS = [2000, 4000, 8000, 16000, 30000, 30000];

/** Run a command, capturing stdout+stderr (still echoed so logs are visible). */
function capture(cmd) {
  try {
    const out = execSync(cmd, { stdio: ["inherit", "pipe", "pipe"], encoding: "utf8" });
    process.stdout.write(out);
    return { ok: true, out };
  } catch (err) {
    const out = `${err.stdout ?? ""}${err.stderr ?? ""}`;
    process.stdout.write(out);
    return { ok: false, out };
  }
}

function failedMigrationsFrom(text) {
  const names = new Set();
  // "The `0017_shopify_orders` migration started at ... failed"
  for (const m of text.matchAll(/`([^`]+)`\s+migration\s+started[^\n]*failed/g)) names.add(m[1]);
  return [...names];
}

// Retry a transient DB-unreachable at boot before doing anything else.
let first;
for (let attempt = 0; ; attempt++) {
  first = capture("npx prisma migrate deploy");
  if (first.ok) process.exit(0);
  if (isDbUnreachable(first.out) && attempt < DB_BACKOFF_MS.length) {
    const wait = DB_BACKOFF_MS[attempt];
    console.warn(`[migrate] database unreachable (P1001) — retry ${attempt + 1}/${DB_BACKOFF_MS.length} in ${wait}ms (is the Postgres service up?)`);
    sleep(wait);
    continue;
  }
  break; // succeeded above, or not a DB issue, or retries exhausted
}

const isP3009 = /P3009/.test(first.out) || /failed migrations/i.test(first.out);
let failed = failedMigrationsFrom(first.out);
if (isP3009 && failed.length === 0) {
  const status = capture("npx prisma migrate status");
  failed = failedMigrationsFrom(status.out);
}

if (!isP3009 || failed.length === 0) {
  console.error("[migrate] deploy failed and it is not a recoverable P3009 wedge — surfacing the error.");
  process.exit(1);
}

console.warn(`[migrate] P3009 detected — rolling back failed migration(s) and retrying: ${failed.join(", ")}`);
for (const name of failed) capture(`npx prisma migrate resolve --rolled-back ${name}`);

const second = capture("npx prisma migrate deploy");
if (second.ok) {
  console.warn("[migrate] recovered from P3009 and applied all pending migrations.");
  process.exit(0);
}
console.error("[migrate] retry after P3009 recovery still failed — the above is the real error.");
process.exit(1);
