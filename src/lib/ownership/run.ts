// ─── Account Ownership System — orchestrator ──────────────────────────────────
// Ties the DB + Google Ads fetch + pure rules engine together:
//   fetch metrics -> merge review/action/exception state -> evaluate ->
//   persist AccountStatus -> (shadow mode) post one internal digest.
// Nothing is posted to client channels during the pilot.

import { prisma } from "@/lib/db";
import { fetchOwnershipMetrics } from "@/lib/integrations/google-ads";
import { postSlackMessage } from "@/lib/integrations/slack";
import { evaluateAccount } from "./rules";
import { AccountConfig, EvaluationResult, OwnershipMetrics, OwnershipStatus, RuleId, RuleResult } from "./types";
import { composeShadowDigest, DigestEntry } from "./digest";

const SHADOW_CHANNEL_ID = process.env.OWNERSHIP_SHADOW_CHANNEL_ID ?? "C0BGYLDP941";

type AccountRow = Awaited<ReturnType<typeof prisma.account.findMany>>[number] & {
  owner?: { name: string } | null;
};

function accountToConfig(a: AccountRow): AccountConfig {
  return {
    primaryKpi: (a.primaryKpi === "ROAS" || a.primaryKpi === "CPA") ? a.primaryKpi : null,
    targetValue: a.targetValue ?? null,
    tolYellowPct: a.tolYellowPct,
    tolRedPct: a.tolRedPct,
    pacingGreenMin: a.pacingGreenMin, pacingGreenMax: a.pacingGreenMax,
    pacingYellowMin: a.pacingYellowMin, pacingYellowMax: a.pacingYellowMax,
    reviewFrequencyDays: a.reviewFrequencyDays,
    minSpendForEval: a.minSpendForEval,
    minConversionsForEval: a.minConversionsForEval,
    monthlyBudget: a.monthlyBudget ?? null,
  };
}

/** Merge DB review / open-action / active-exception state onto the fetched metrics. */
async function mergeDbState(accountId: string, metrics: OwnershipMetrics, now: Date): Promise<OwnershipMetrics> {
  const [lastReview, openAction, exceptions] = await Promise.all([
    prisma.review.findFirst({ where: { accountId }, orderBy: { reviewedAt: "desc" } }),
    prisma.ownershipAction.findFirst({ where: { accountId, closedAt: null }, orderBy: { openedAt: "desc" } }),
    prisma.exception.findMany({ where: { accountId, startsAt: { lte: now }, endsAt: { gt: now } } }),
  ]);

  const activeExceptions = exceptions.flatMap(e => {
    try { return JSON.parse(e.suppressRules) as RuleId[]; } catch { return []; }
  });

  return {
    ...metrics,
    review: { lastReviewAt: lastReview?.reviewedAt.toISOString() ?? null },
    openAction: openAction?.deadlineAt ? { deadlineAt: openAction.deadlineAt.toISOString() } : undefined,
    activeExceptions,
  };
}

export interface AccountRunResult {
  accountId: string;
  name: string;
  clientName: string | null;
  ownerName: string | null;
  /** null = could not evaluate and there is no prior status to fall back to. */
  evaluation: EvaluationResult | null;
  /** Set when this run could not refresh live data (stale fallback or hard failure). */
  note?: string;
  /** True when the shown status is a fallback from a prior run, not a fresh evaluation. */
  degraded?: boolean;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const shortDate = (d: Date) => `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`;

/**
 * Compute + persist status for one account. Never returns null: on a fetch
 * failure it falls back to the last good status (marked stale) or, if there is
 * none, reports "couldn't evaluate" — so an account is never silently dropped
 * from the dashboard.
 */
export async function computeAccountStatus(
  account: AccountRow,
  now: Date = new Date(),
): Promise<AccountRunResult> {
  const base = { accountId: account.id, name: account.name, clientName: account.clientName ?? null, ownerName: account.owner?.name ?? null };
  try {
    const metricsBase = await fetchOwnershipMetrics(account.googleAdsId, account.organizationId);
    const metrics = await mergeDbState(account.id, metricsBase, now);
    const evaluation = evaluateAccount(accountToConfig(account), metrics, now);

    await prisma.accountStatus.create({
      data: {
        accountId: account.id,
        computedAt: now,
        status: evaluation.status,
        reasons: JSON.stringify(evaluation.reasons),
        metrics: JSON.stringify(metrics),
      },
    });

    return { ...base, evaluation };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.warn(`[ownership] compute failed for ${account.name}:`, reason);

    // Never blank: fall back to the last good status if we have one.
    const prior = await prisma.accountStatus.findFirst({
      where: { accountId: account.id },
      orderBy: { computedAt: "desc" },
    }).catch(() => null);

    if (prior) {
      let reasons: RuleResult[] = [];
      try { reasons = JSON.parse(prior.reasons) as RuleResult[]; } catch { /* ignore */ }
      return {
        ...base,
        evaluation: { status: prior.status as OwnershipStatus, reasons, sufficient: false, hasCurrentReview: false },
        note: `couldn't refresh — showing status from ${shortDate(prior.computedAt)}`,
        degraded: true,
      };
    }
    return { ...base, evaluation: null, note: `couldn't evaluate — ${reason}`, degraded: true };
  }
}

export interface ShadowRunSummary {
  evaluated: number;
  failed: string[];
  posted: boolean;
  channel: string;
}

/**
 * Shadow-mode run for one org: evaluate every ownership-enabled account and post
 * a single internal digest. Posts NOTHING to client channels.
 */
export async function runShadowDigest(organizationId: string, now: Date = new Date()): Promise<ShadowRunSummary> {
  const accounts = await prisma.account.findMany({
    where: { organizationId, active: true, archived: false, ownershipEnabled: true },
    include: { owner: { select: { name: true } } },
  });

  const results: AccountRunResult[] = [];
  const failed: string[] = [];
  // Sequential — same OOM caution as score-all on Railway.
  for (const account of accounts) {
    const r = await computeAccountStatus(account, now);
    results.push(r);
    if (r.degraded) failed.push(account.name);
  }

  // Resolve the public origin so the digest can deep-link into the diagnostic
  // workspace. RAILWAY_PUBLIC_DOMAIN is auto-injected in production (AGENTS.md).
  const domain = process.env.RAILWAY_PUBLIC_DOMAIN ?? process.env.APP_BASE_URL;
  const baseUrl = domain ? (domain.startsWith("http") ? domain : `https://${domain}`) : null;

  const entries: DigestEntry[] = results.map(r => ({
    name: r.name,
    clientName: r.clientName,
    ownerName: r.ownerName,
    status: r.evaluation?.status ?? null, // null → couldn't evaluate
    reasons: r.evaluation?.reasons ?? [],
    note: r.note,
    link: baseUrl ? `${baseUrl}/diagnose/${r.accountId}` : undefined,
  }));

  const slack = await prisma.slackConnection.findUnique({ where: { organizationId } });
  let posted = false;
  if (slack) {
    const text = composeShadowDigest(entries, now);
    await postSlackMessage(slack.botToken, SHADOW_CHANNEL_ID, text);
    posted = true;
  }

  return { evaluated: results.length - failed.length, failed, posted, channel: SHADOW_CHANNEL_ID };
}
