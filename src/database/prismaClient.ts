import { PrismaClient } from "@prisma/client";

const prismaDB = new PrismaClient();

export { prismaDB };