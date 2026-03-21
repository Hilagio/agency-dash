import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { mkdirSync } from "fs";
import { dirname } from "path";

function createPrisma() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  const resolvedUrl = url.startsWith("file:./")
    ? `file:${process.env.DB_ABS_PATH ?? url.slice(5)}`
    : url;

  // Ensure the directory exists (Railway, Docker, etc. may not have it)
  const filePath = resolvedUrl.replace(/^file:/, "");
  if (filePath.startsWith("/")) {
    mkdirSync(dirname(filePath), { recursive: true });
  }

  const adapter = new PrismaBetterSqlite3({ url: resolvedUrl });
  return new PrismaClient({ adapter, log: ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
