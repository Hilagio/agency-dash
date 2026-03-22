import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const accounts = await prisma.account.findMany({
    orderBy: { name: "asc" },
    include: {
      snapshots: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          id: true,
          createdAt: true,
          rawSignals: true,
          governingConstraint: true,
          constraintReason: true,
          scoreMeasurement: true,
          scoreTraffic: true,
          scoreConversion: true,
          scoreFunnel: true,
          scoreEconomics: true,
        },
      },
    },
  });

  return NextResponse.json(accounts.map((a) => {
    const snap = a.snapshots[0];
    let roas = 0;
    let budgetUtil = 0;
    if (snap?.rawSignals) {
      try {
        const raw = JSON.parse(snap.rawSignals) as {
          economics?: { actualRoas?: number; budgetUtilizationPercent?: number };
        };
        roas       = raw.economics?.actualRoas              ?? 0;
        budgetUtil = raw.economics?.budgetUtilizationPercent ?? 0;
      } catch { /* ignore */ }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { rawSignals: _, ...snapOut } = snap ?? {} as typeof snap;
    return {
      ...a,
      snapshots: snap ? [{ ...snapOut, roas, budgetUtil }] : [],
    };
  }));
}
