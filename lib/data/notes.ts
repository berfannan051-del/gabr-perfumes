import { prisma } from "@/lib/prisma";
import type { FragranceNote } from "@/types/catalog";

export async function getAllNotes(): Promise<FragranceNote[]> {
  const rows = await prisma.fragranceNote.findMany({ orderBy: { nameEn: "asc" } });
  return rows.map((n) => ({ slug: n.slug, name: { ar: n.nameAr, en: n.nameEn } }));
}
