import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const dbUrl = process.env.DATABASE_URL?.startsWith("file:") || process.env.DATABASE_URL?.startsWith("postgres")
  ? process.env.DATABASE_URL
  : "file:./dev.db";

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: { db: { url: dbUrl } },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
