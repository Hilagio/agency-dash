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

  return NextResponse.json(accounts);
}
