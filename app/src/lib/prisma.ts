import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL as string;

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createPrismaClient() {
  // La base tourne maintenant en conteneur PostgreSQL sur le VPS, sur le
  // reseau Docker interne : pas de SSL. On garde la possibilite de l'activer
  // via DATABASE_SSL=true (utile uniquement pour une base managee distante).
  const useSsl = process.env.DATABASE_SSL === "true";
  const adapter = new PrismaPg({
    connectionString,
    ...(useSsl ? { ssl: { rejectUnauthorized: false } } : {}),
  });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
