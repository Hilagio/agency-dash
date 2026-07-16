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
import { getMerchantCenterIds, fetchMerchantCenterHealth } from "@/lib/integrations/merchant-center";

/**
 * Merchant Center feed health as a nightly signal. Per the team's rule:
 * RED only when the feed genuinely can't advertise — an account-level
 * suspension / policy block, nothing serving, or near-total disapproval.
 * Minor stuff (a handful of disapprovals, non-blocking notices) stays YELLOW.
 * Best-effort: any read failure returns null (no false alarm).
 */
async function merchantCenterSignal(googleAdsId: string, orgId: string, storedId: string | null): Promise<Signal | null> {
  let ids: string[] = [];
  try { ids = await getMerchantCenterIds(googleAdsId, orgId, storedId); } catch { return null; }
  if (!ids.length) return null;
  let h: Awaited<ReturnType<typeof fetchMerchantCenterHealth>>;
  try { h = await fetchMerchantCenterHealth(ids[0], orgId); } catch { return null; }
  if (h.scopeOrAuthError) return null; // couldn't read it — don't raise a false flag

  const tot = h.totals.active + h.totals.disapproved;
  const disPct = tot > 0 ? h.totals.disapproved / tot : 0;
  const nothingServing = tot > 0 && h.totals.active === 0;
  // Serving-blocking account issues: a suspension / policy / misrepresentation
  // flag, or anything the API marks "critical".
  const blocking = h.accountIssues.filter(i =>
    /critical/i.test(i.severity) ||
    /suspend|misrepresent|policy|not eligible|under review|disabled|account disapprov/i.test(i.title));

  if (blocking.length || nothingServing || disPct >= 0.8) {
    const why = blocking.length ? blocking.map(i => i.title).join("; ")
      : nothingServing ? "no products are currently serving"
      : `${Math.round(disPct * 100)}% of products are disapproved`;
    return {
      key: "merchant_center_blocked", kind: "problem", severity: "red",
      title: "Merchant Center is blocking the feed",
      detail: `Merchant Center (${ids[0]}) — ${why}. Shopping/Performance Max can't serve until this is resolved; check Merchant Center → Diagnostics.`,
      evidence: { merchantId: ids[0], active: h.totals.active, disapproved: h.totals.disapproved, accountIssues: h.accountIssues },
    };
  }
  if (h.accountIssues.length || h.totals.disapproved > 0) {
    const parts: string[] = [];
    if (h.totals.disapproved > 0) parts.push(`${h.totals.disapproved} product${h.totals.disapproved === 1 ? "" : "s"} disapproved (${Math.round(disPct * 100)}%)`);
    if (h.accountIssues.length) parts.push(h.accountIssues.map(i => i.title).join("; "));
    return {
      key: "merchant_center_issues", kind: "problem", severity: "yellow",
      title: "Merchant Center has minor feed issues",
      detail: `Merchant Center (${ids[0]}) — ${parts.join(" · ")}. Not blocking serving, but worth cleaning up.`,
      evidence: { merchantId: ids[0], active: h.totals.active, disapproved: h.totals.disapproved },
    };
  }
  return null;
}

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

export interface CommerceAgg { orders: number; revenue: number; currency: string; }

/** SignalInput plus the commerce context we persist for the diagnosis view. */
export interface AssembledInput {
  input: SignalInput;
  commerce: CommerceAgg | null;
  grossMarginPct: number | null;
}

/**
 * Assemble the SignalInput for one account from the spine.
 * current window = last 7 days (ending yesterday); prior = the 7 before that,
 * used for the brand before/after canary.
 */
export async function assembleSignalInput(account: AccountRow): Promise<AssembledInput> {
  const curStart = ymd(7), curEnd = ymd(1);
  const priStart = ymd(14), priEnd = ymd(8);
  const brandToken = norm(account.name);

  const [metrics, pageRows, stRows, changeRows, stPrior, orderRows] = await Promise.all([
    prisma.metricDaily.findMany({ where: { accountId: account.id, date: { gte: curStart, lte: curEnd } } }),
    prisma.metricProductDaily.findMany({ where: { accountId: account.id, date: { gte: curStart, lte: curEnd } } }),
    prisma.searchTermDaily.findMany({ where: { accountId: account.id, date: { gte: curStart, lte: curEnd } } }),
    prisma.changeEvent.findMany({ where: { accountId: account.id, changedAt: { gte: new Date(curStart) } } }),
    prisma.searchTermDaily.findMany({ where: { accountId: account.id, date: { gte: priStart, lte: priEnd } } }),
    prisma.orderDaily.findMany({ where: { accountId: account.id, date: { gte: curStart, lte: curEnd } } }),
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

  // Commerce reconciliation (§4.3): real Shopify orders vs Ads conversions.
  const commerce: CommerceAgg | null = orderRows.length
    ? {
        orders: orderRows.reduce((s, o) => s + o.orders, 0),
        revenue: orderRows.reduce((s, o) => s + o.revenue, 0),
        currency: orderRows[0]?.currency ?? "EUR",
      }
    : null;
  const reconciliation = commerce ? { adsConversions: current.conversions, actualOrders: commerce.orders } : undefined;

  return {
    input: {
      cfg: {
        roasFloor: account.roasFloor ?? undefined,
        grossMarginPct: account.grossMarginPercent ?? undefined,
        minSpend: account.minSpendForEval,
        minConversions: account.minConversionsForEval,
        pageMinClicks: 20,
      },
      current, changeEvents, budget: [], searchTerms, pages, brand, reconciliation,
    },
    commerce,
    grossMarginPct: account.grossMarginPercent ?? null,
  };
}

function sum<T>(rows: T[], f: keyof T): number { return rows.reduce((s, r) => s + (r[f] as unknown as number), 0); }
function brandAgg(rows: Array<{ searchTerm: string; clicks: number; conversions: number }>, token: string) {
  const brand = token.length >= 4 ? rows.filter(r => norm(r.searchTerm).includes(token)) : [];
  return { clicks: brand.reduce((s, r) => s + r.clicks, 0), conversions: brand.reduce((s, r) => s + r.conversions, 0) };
}

/** Run detectors for one account and persist a status (unless nothing to persist). */
export async function computeAccountSignals(account: AccountRow, now: Date = new Date(), opts: { checkMerchantCenter?: boolean } = {}): Promise<AccountSignals> {
  const { input, commerce, grossMarginPct } = await assembleSignalInput(account);
  const signals = runSignals(input);

  // Nightly (and manual refresh): add live Merchant Center feed health. Gated so
  // an account-page load doesn't pay the API latency — the live health strip
  // covers MC there. Best-effort, so a slow/failed MC read can't sink the run.
  if (opts.checkMerchantCenter) {
    try {
      const acc = await prisma.account.findUnique({ where: { id: account.id }, select: { googleAdsId: true, organizationId: true, merchantCenterId: true } });
      if (acc?.googleAdsId) {
        const mc = await merchantCenterSignal(acc.googleAdsId, acc.organizationId, acc.merchantCenterId);
        if (mc) signals.push(mc);
      }
    } catch { /* MC is best-effort */ }
  }
  // Keep worst-first (red → yellow → info) so the portfolio's "worst signal" and
  // the status colour reflect a newly-added Merchant Center flag correctly.
  const sevRank: Record<Signal["severity"], number> = { red: 0, yellow: 1, info: 2 };
  signals.sort((a, b) => sevRank[a.severity] - sevRank[b.severity]);

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
        window: {
          spend: input.current.spend,
          conversions: input.current.conversions,
          conversionValue: input.current.conversionValue,
          days: input.current.days,
        },
        commerce,
        reconciliation: input.reconciliation ?? null,
        grossMarginPct,
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
  // Nightly run includes the live Merchant Center check (feed suspension/blocks).
  for (const a of accounts) out.push(await computeAccountSignals(a, now, { checkMerchantCenter: true }));
  return out;
}
