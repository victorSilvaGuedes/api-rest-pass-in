import { PrismaClient } from '@prisma/client'

// conexão prisma e bd
// prisma irá retornar um console.log com a query no bd em toda operação
export const prisma = new PrismaClient({
  log: ['query'],
})
