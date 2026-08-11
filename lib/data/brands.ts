import { prisma } from "@/lib/prisma";
import type { Brand } from "@/types/catalog";

export async function getAllBrands(): Promise<Brand[]> {
  const rows = await prisma.brand.findMany({ orderBy: { name: "asc" } });
  return rows.map((r) => ({ id: r.id, name: r.name, logo: r.logo }));
}
