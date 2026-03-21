import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

// DATABASE_URL must be an absolute file path when using better-sqlite3.
// e.g. DATABASE_URL=file:/absolute/path/to/dev.db
// The prisma.config.ts handles the migration tool; this handles the runtime client.

function createPrisma() {
  const url = process.env.DATABASE_URL ?? "file:./dev.db";
  // Ensure the path is absolute. In Docker/production, set DB_ABS_PATH or use absolute DATABASE_URL.
  const resolvedUrl = url.startsWith("file:./")
    ? `file:${process.env.DB_ABS_PATH ?? url.slice(5)}`
    : url;
  const adapter = new PrismaBetterSqlite3({ url: resolvedUrl });
  return new PrismaClient({ adapter, log: ["error"] });
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrisma();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
