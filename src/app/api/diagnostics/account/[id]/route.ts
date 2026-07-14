/**
 * GET /api/diagnostics/account/[id] — the diagnosis for one account (§9).
 *
 * Reads the latest *diagnostics* AccountStatus (source:"diagnostics"), runs the
 * pure engine, and returns a Diagnosis. Never blank: if no diagnostics status
 * exists yet, it computes one on the fly so the workspace always has something
 * honest to show.
 */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getAuthContext, unauthorized, forbidden } from "@/lib/auth";
import { buildDiagnosis } from "@/lib/diagnostics/engine";
import { computeAccountSignals } from "@/lib/diagnostics/run-signals";
import type { Signal } from "@/lib/diagnostics/signals";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

const CURRENCY_SYMBOL: Record<string, string> = { EUR: "€", USD: "$", GBP: "£" };
const symbol = (code: string) => CURRENCY_SYMBOL[code] ?? `${code} `;

interface DiagnosticsMetrics {
  source?: string;
  dataVerified?: boolean;
  window?: { spend: number; conversions: number; conversionValue: number; days: number };
  signals?: Signal[];
}

function parseDiagnostics(metricsJson: string): DiagnosticsMetrics | null {
  try {
    const m = JSON.parse(metricsJson) as DiagnosticsMetrics;
    return m?.source === "diagnostics" ? m : null;
  } catch {
    return null;
  }
}

export async function GET(_req: Request, { params }: Params) {
  const ctx = await getAuthContext();
  if (!ctx) return unauthorized();
  const { id } = await params;

  const account = await prisma.account.findFirst({
    where: { id, organizationId: ctx.orgId },
    select: {
      id: true, name: true, clientName: true, currency: true, dataVerified: true,
      roasFloor: true, grossMarginPercent: true, minSpendForEval: true, minConversionsForEval: true,
    },
  });
  if (!account) return forbidden();

  // Latest diagnostics status; if the newest status isn't a diagnostics one,
  // scan back a little before falling back to an on-the-fly compute.
  const recent = await prisma.accountStatus.findMany({
    where: { accountId: id },
    orderBy: { computedAt: "desc" },
    take: 10,
  });
  let status = recent.find(s => parseDiagnostics(s.metrics));

  if (!status) {
    // Never blank (§resilience): compute one now.
    await computeAccountSignals({
      id: account.id, name: account.name, roasFloor: account.roasFloor,
      grossMarginPercent: account.grossMarginPercent, minSpendForEval: account.minSpendForEval,
      minConversionsForEval: account.minConversionsForEval, dataVerified: account.dataVerified,
    }).catch(() => null);
    status = await prisma.accountStatus.findFirst({
      where: { accountId: id }, orderBy: { computedAt: "desc" },
    }) ?? undefined;
  }

  const diag = status ? parseDiagnostics(status.metrics) : null;
  const signals = diag?.signals ?? [];

  const diagnosis = buildDiagnosis({
    accountId: account.id,
    name: account.name,
    clientName: account.clientName,
    status: (status?.status as "green" | "yellow" | "red") ?? "green",
    dataVerified: diag?.dataVerified ?? account.dataVerified,
    computedAt: (status?.computedAt ?? new Date()).toISOString(),
    signals,
    window: diag?.window,
    currency: symbol(account.currency),
    reconciliation: null,
  });

  return NextResponse.json({ diagnosis, hasData: !!diag });
}
