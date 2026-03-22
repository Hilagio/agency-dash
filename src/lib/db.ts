import { PrismaClient } from "@prisma/client";

function createPrisma() {
  return new PrismaClient({ log: ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
