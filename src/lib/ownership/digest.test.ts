/**
 * Runnable spec for the shadow-digest composition.
 *   npx tsx src/lib/ownership/digest.test.ts
 */
import { composeShadowDigest, DigestEntry } from "./digest";
import { RULE } from "./types";

const NOW = new Date("2026-07-13T06:00:00Z");
let failures = 0;
function check(name: string, cond: boolean) {
  if (cond) console.log("✓", name);
  else { console.error("✗ FAIL:", name); failures++; }
}

const entries: DigestEntry[] = [
  { name: "Lydia Boutique", clientName: "Lydia Group", ownerName: "Sam", status: "green", reasons: [] },
  { name: "2Grown", ownerName: "Arnie", status: "yellow", reasons: [
    { rule: RULE.PERFORMANCE, severity: "yellow", message: "ROAS is 18% below target." },
  ] },
  { name: "Lumen Domov", ownerName: "Sarthak", status: "red", reasons: [
    { rule: RULE.ANOMALY, severity: "red", message: "Conversion volume deviates strongly from the normal pattern. Investigation required." },
  ] },
  { name: "Perlowa Moda", ownerName: "Priya", status: "yellow", note: "couldn't refresh — showing status from 12 Jul", reasons: [
    { rule: RULE.REVIEW_RECENCY, severity: "yellow", message: "Review is due." },
  ] },
  { name: "Zephyr", ownerName: "Sam", status: null, note: "couldn't evaluate — Google Ads timeout", reasons: [] },
];

const text = composeShadowDigest(entries, NOW);
console.log("\n--- digest ---\n" + text + "\n--------------\n");

check("has header with date", text.includes("13 Jul 2026"));
check("counts line correct", text.includes("🟢 1") && text.includes("🟡 2") && text.includes("🔴 1"));
check("red listed before yellow before green", text.indexOf("Lumen Domov") < text.indexOf("2Grown") && text.indexOf("2Grown") < text.indexOf("Lydia Boutique"));
check("red shows its reason", text.includes("Conversion volume deviates"));
// Green is sorted last, so nothing (no bullets) should follow its line.
check("green shows no bullet reason", !text.slice(text.indexOf("Lydia Boutique")).includes("•"));
check("owner tag present", text.includes("Owner: Sam"));
check("client name shown", text.includes("(Lydia Group)"));
// Never-blank resilience
check("unevaluated account shown, not dropped", text.includes("Zephyr") && text.includes("⚪") && text.includes("Couldn't evaluate"));
check("unknown counted in summary", text.includes("⚪ 1"));
check("stale note rendered", text.includes("couldn't refresh — showing status from 12 Jul"));
check("unevaluated sorts before green", text.indexOf("Zephyr") < text.indexOf("Lydia Boutique"));

const empty = composeShadowDigest([], NOW);
check("empty digest handled", empty.includes("No accounts have ownership enabled"));

console.log(failures ? `\n${failures} FAILURE(S)` : "\nALL PASS");
process.exit(failures ? 1 : 0);
