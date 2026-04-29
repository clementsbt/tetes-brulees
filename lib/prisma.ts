// Lazy Prisma client initialization
let prismaClient: any;

export async function prisma() {
  if (!prismaClient) {
    const pc = await import('@prisma/client');
    const PrismaClient = pc.default.PrismaClient || Object.values(pc)[0] as any;
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}