import { PrismaClient } from '@prisma/client';

// This creates a reusable Prisma client instance
const db = new PrismaClient();

export default db;