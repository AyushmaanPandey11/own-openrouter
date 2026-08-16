// packages/db/index.ts
import path from "node:path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(import.meta.dirname, ".env") });

import { PrismaClient, Prisma } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({
  adapter,
});

export { Prisma };
