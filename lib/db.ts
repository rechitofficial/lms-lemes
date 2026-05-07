import "dotenv/config";
import { PrismaClient } from "./generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

export function getPrisma() {
    if (!globalForPrisma.prisma) {
        const databaseUrl = process.env.DATABASE_URL;
        if (!databaseUrl) {
            throw new Error('DATABASE_URL environment variable is not set');
        }
        
        const pool = new Pool({ connectionString: databaseUrl });
        const adapter = new PrismaPg(pool);
        
        globalForPrisma.prisma = new PrismaClient({ adapter });
    }
    return globalForPrisma.prisma;
}