import { prisma } from "@/lib/prisma";
import type { Collection } from "@/types/catalog";
import type { Collection as DbCollection } from "@/lib/generated/prisma/client";

function mapCollection(c: DbCollection): Collection {
  return {
    id: c.id,
    slug: c.slug,
    name: { ar: c.nameAr, en: c.nameEn },
    description: { ar: c.descriptionAr, en: c.descriptionEn },
    image: c.image,
    coverImage: c.coverImage,
  };
}

export async function getCollections(): Promise<Collection[]> {
  const rows = await prisma.collection.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map(mapCollection);
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const row = await prisma.collection.findUnique({ where: { slug } });
  return row ? mapCollection(row) : null;
}
