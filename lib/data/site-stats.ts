import { prisma } from "@/lib/prisma";

export async function incrementAndGetVisitCount(): Promise<number> {
  const stats = await prisma.siteStats.upsert({
    where: { id: 1 },
    update: { visitCount: { increment: 1 } },
    create: { id: 1, visitCount: 1 },
  });
  return stats.visitCount;
}

export async function getVisitCount(): Promise<number> {
  const stats = await prisma.siteStats.findUnique({ where: { id: 1 } });
  return stats?.visitCount ?? 0;
}
