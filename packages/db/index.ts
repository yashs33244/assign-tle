import { PrismaClient } from "@prisma/client";
// convert this to singleton for next js
export const prismaClient = new PrismaClient();