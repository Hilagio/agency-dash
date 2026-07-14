/**
 * Wire the signal library to the spine (BUILD-SPEC §12.3, Phase 3b).
 *
 * Assembles each account's current window from the ingested daily tables, runs
 * the detectors, and persists an AccountStatus (which the Today dashboard + the
 * ownership digest already read). §4.9: an unverified account is marked
 * DATA_UNVERIFIED and does not raise alerts — but we still compute so the team
 * can see the machinery during the pilot.
 */
import { prisma } from "@/lib/db";
import {
  runSignals, type Signal, type SignalInput, type PageAgg, type WindowAgg,
} from "./signals";

function ymd(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - offsetDays);
  return d.toISOString().slice(0, 10);
}

/** Normalise for brand matching: lowercase alphanumerics only. */
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

type AccountRow = {
  id: string; name: string; roasFloor: number | null; grossMarginPercent: number | null;
  minSpendForEval: number; minConversionsForEval: number; dataVerified: boolean;
};

export interface AccountSignals {
  accountId: string;
  name: string;
  status: "green" | "yellow" | "red";
  dataVerified: boolean;
  signals: Signal[];
}

/**
 * Assemble the SignalInput for one account from the spine.
 * current window = last 7 days (ending yesterday); prior = the 7 before that,
 * used for the brand before/after canary.
 */
export async function assembleSignalInput(account: AccountRow): Promise<SignalInput> {
  const curStart = ymd(7), curEnd = ymd(1);
  const priStart = ymd(14), priEnd = ymd(8);
  const brandToken = norm(account.name);

  const [metrics, pageRows, stRows, changeRows, stPrior] = await Promise.all([
    prisma.metricDaily.findMany({ where: { accountId: account.id, date: { gte: curStart, lte: curEnd } } }),
    prisma.metricProductDaily.findMany({ where: { accountId: account.id, date: { gte: curStart, lte: curEnd } } }),
    prisma.searchTermDaily.findMany({ where: { accountId: account.id, date: { gte: curStart, lte: curEnd } } }),
    prisma.changeEvent.findMany({ where: { accountId: account.id, changedAt: { gte: new Date(curStart) } } }),
    prisma.searchTermDaily.findMany({ where: { accountId: account.id, date: { gte: priStart, lte: priEnd } } }),
  ]);

  // Current-window totals.
  const daysSeen = new Set(metrics.map(m => m.date)).size || 7;
  const current: WindowAgg = {
    spend: sum(metrics, "spend"), clicks: sum(metrics, "clicks"),
    conversions: sum(metrics, "conversions"), conversionValue: sum(metrics, "conversionValue"),
    days: daysSeen,
  };

  // Search terms aggregated per term.
  const stAgg = new Map<string, { cost: number; conversions: number }>();
  for (const r of stRows) {
    const e = stAgg.get(r.searchTerm) ?? { cost: 0, conversions: 0 };
    e.cost += r.cost; e.conversions += r.conversions; stAgg.set(r.searchTerm, e);
  }
  const searchTerms = [...stAgg.values()];

  // Pages aggregated per URL, with a count of days that had clicks but 0 conversions.
  const pageMap = new Map<string, PageAgg & { _zeroDays: Set<string> }>();
  for (const r of pageRows) {
    const p = pageMap.get(r.landingPageUrl) ?? {
      landingPageUrl: r.landingPageUrl, clicks: 0, spend: 0, conversions: 0, conversionValue: 0,
      daysZeroConv: 0, _zeroDays: new Set<string>(),
    };
    p.clicks += r.clicks; p.spend += r.spend; p.conversions += r.conversions; p.conversionValue += r.conversionValue;
    if (r.clicks > 0 && r.conversions === 0) p._zeroDays.add(r.date);
    pageMap.set(r.landingPageUrl, p);
  }
  const pages: PageAgg[] = [...pageMap.values()].map(p => ({
    landingPageUrl: p.landingPageUrl, clicks: p.clicks, spend: p.spend,
    conversions: p.conversions, conversionValue: p.conversionValue, daysZeroConv: p._zeroDays.size,
  }));

  const changeEvents = changeRows.map(c => ({ changedAt: c.changedAt, changeType: c.changeType }));

  // Brand before/after (the canary), if any brand terms exist.
  const brandBefore = brandAgg(stPrior, brandToken);
  const brandAfter = brandAgg(stRows, brandToken);
  const brand = (brandBefore.clicks > 0 && brandAfter.clicks > 0) ? { before: brandBefore, after: brandAfter } : undefined;

  return {
    cfg: {
      roasFloor: account.roasFloor ?? undefined,
      grossMarginPct: account.grossMarginPercent ?? undefined,
      minSpend: account.minSpendForEval,
      minConversions: account.minConversionsForEval,
      pageMinClicks: 20,
    },
    current, changeEvents, budget: [], searchTerms, pages, brand,
  };
}

function sum<T>(rows: T[], f: keyof T): number { return rows.reduce((s, r) => s + (r[f] as unknown as number), 0); }
function brandAgg(rows: Array<{ searchTerm: string; clicks: number; conversions: number }>, token: string) {
  const brand = token.length >= 4 ? rows.filter(r => norm(r.searchTerm).includes(token)) : [];
  return { clicks: brand.reduce((s, r) => s + r.clicks, 0), conversions: brand.reduce((s, r) => s + r.conversions, 0) };
}

/** Run detectors for one account and persist a status (unless nothing to persist). */
export async function computeAccountSignals(account: AccountRow, now: Date = new Date()): Promise<AccountSignals> {
  const input = await assembleSignalInput(account);
  const signals = runSignals(input);

  const problems = signals.filter(s => s.kind === "problem");
  const status: AccountSignals["status"] =
    problems.some(s => s.severity === "red") ? "red"
    : problems.some(s => s.severity === "yellow") ? "yellow" : "green";

  await prisma.accountStatus.create({
    data: {
      accountId: account.id,
      computedAt: now,
      status,
      reasons: JSON.stringify(problems.map(s => ({ rule: s.key, severity: s.severity, message: s.detail }))),
      metrics: JSON.stringify({
        source: "diagnostics",
        dataVerified: account.dataVerified,
        signals,
      }),
    },
  });

  return { accountId: account.id, name: account.name, status, dataVerified: account.dataVerified, signals };
}

/** Run signals for every active account in an org. */
export async function computeOrgSignals(organizationId: string, now: Date = new Date()): Promise<AccountSignals[]> {
  const accounts = await prisma.account.findMany({
    where: { organizationId, active: true, archived: false },
    select: {
      id: true, name: true, roasFloor: true, grossMarginPercent: true,
      minSpendForEval: true, minConversionsForEval: true, dataVerified: true,
    },
  });
  const out: AccountSignals[] = [];
  for (const a of accounts) out.push(await computeAccountSignals(a, now));
  return out;
}
