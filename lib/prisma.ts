// @ts-expect-error - Prisma client dynamic import
let prismaClient: any;

export async function prisma() {
  if (!prismaClient) {
    const pc = await import('@prisma/client');
    const PrismaClient = (pc as any).default?.PrismaClient || (pc as any).PrismaClient;
    prismaClient = new PrismaClient();
  }
  return prismaClient;
}