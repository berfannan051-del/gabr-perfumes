import { prisma } from "@/lib/prisma";
import { EGYPT_GOVERNORATES } from "@/lib/data/governorates";

export async function getShippingRates(): Promise<Record<string, number>> {
  const rows = await prisma.shippingRate.findMany();
  const map: Record<string, number> = {};
  for (const g of EGYPT_GOVERNORATES) map[g.slug] = 0;
  for (const row of rows) map[row.governorate] = Number(row.price);
  return map;
}

export async function getShippingRate(governorateSlug: string): Promise<number> {
  const row = await prisma.shippingRate.findUnique({ where: { governorate: governorateSlug } });
  return row ? Number(row.price) : 0;
}
