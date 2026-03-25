import { PrismaClient } from "./generated/prisma/index.js";

const dbClient = new PrismaClient();
export default dbClient;
