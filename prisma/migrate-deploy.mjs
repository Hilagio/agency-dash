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
 */
import { execSync } from "node:child_process";

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

const first = capture("npx prisma migrate deploy");
if (first.ok) process.exit(0);

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
