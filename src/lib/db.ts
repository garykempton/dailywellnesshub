import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let _prisma: PrismaClient | undefined;

function getPrisma(): PrismaClient {
  if (_prisma) return _prisma;
  if (globalForPrisma.prisma) {
    _prisma = globalForPrisma.prisma;
    return _prisma;
  }

  _prisma = new PrismaClient();
  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = _prisma;
  }
  return _prisma;
}

// Lazy proxy — PrismaClient is only instantiated on first property access
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as unknown as Record<string | symbol, unknown>)[prop];
  },
});
