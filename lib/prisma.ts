import {PrismaClient} from "@/prisma/generated/client";
import {PrismaPg} from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});

export const prisma = new PrismaClient({adapter});

const globalForPrisma = globalThis as unknown as {prisma: PrismaClient};

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
