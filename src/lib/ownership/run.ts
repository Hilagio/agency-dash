// ─── Account Ownership System — orchestrator ──────────────────────────────────
// Ties the DB + Google Ads fetch + pure rules engine together:
//   fetch metrics -> merge review/action/exception state -> evaluate ->
//   persist AccountStatus -> (shadow mode) post one internal digest.
// Nothing is posted to client channels during the pilot.

import { prisma } from "@/lib/db";
import { fetchOwnershipMetrics } from "@/lib/integrations/google-ads";
import { postSlackMessage } from "@/lib/integrations/slack";
import { evaluateAccount } from "./rules";
import { AccountConfig, EvaluationResult, OwnershipMetrics, RuleId } from "./types";
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
  evaluation: EvaluationResult;
}

/** Compute + persist status for one account. Returns null on fetch failure. */
export async function computeAccountStatus(
  account: AccountRow,
  now: Date = new Date(),
): Promise<AccountRunResult | null> {
  try {
    const base = await fetchOwnershipMetrics(account.googleAdsId, account.organizationId);
    const metrics = await mergeDbState(account.id, base, now);
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

    return {
      accountId: account.id,
      name: account.name,
      clientName: account.clientName ?? null,
      ownerName: account.owner?.name ?? null,
      evaluation,
    };
  } catch (err) {
    console.warn(`[ownership] compute failed for ${account.name}:`, err instanceof Error ? err.message : err);
    return null;
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
    if (r) results.push(r);
    else failed.push(account.name);
  }

  const entries: DigestEntry[] = results.map(r => ({
    name: r.name,
    clientName: r.clientName,
    ownerName: r.ownerName,
    status: r.evaluation.status,
    reasons: r.evaluation.reasons,
  }));

  const slack = await prisma.slackConnection.findUnique({ where: { organizationId } });
  let posted = false;
  if (slack) {
    const text = composeShadowDigest(entries, now);
    await postSlackMessage(slack.botToken, SHADOW_CHANNEL_ID, text);
    posted = true;
  }

  return { evaluated: results.length, failed, posted, channel: SHADOW_CHANNEL_ID };
}
