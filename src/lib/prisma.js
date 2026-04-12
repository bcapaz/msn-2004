import { PrismaClient } from '@prisma/client';

// O PrismaClient é instanciado globalmente para evitar 
// múltiplas conexões em ambiente de desenvolvimento (Hot Reload)
const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Opcional: mostra as queries no console para debugar
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;
