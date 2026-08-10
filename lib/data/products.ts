import { prisma } from "@/lib/prisma";
import type {
  Product,
  ProductVariant,
  FragranceNote,
  Gender,
  FragranceFamily,
  BottleShape,
} from "@/types/catalog";
import { Prisma } from "@/lib/generated/prisma/client";

const productInclude = {
  collection: true,
  variants: { orderBy: { sizeMl: "asc" } },
  notes: { include: { note: true } },
} satisfies Prisma.ProductInclude;

type DbProduct = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

function mapVariant(v: DbProduct["variants"][number]): ProductVariant {
  return {
    id: v.id,
    sizeMl: v.sizeMl,
    price: Number(v.price),
    compareAtPrice: v.compareAtPrice ? Number(v.compareAtPrice) : undefined,
    sku: v.sku,
    inStock: v.stockQuantity > 0,
  };
}

function mapNote(n: DbProduct["notes"][number]["note"]): FragranceNote {
  return { slug: n.slug, name: { ar: n.nameAr, en: n.nameEn } };
}

function mapProduct(p: DbProduct): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: { ar: p.nameAr, en: p.nameEn },
    shortDescription: { ar: p.shortDescriptionAr, en: p.shortDescriptionEn },
    description: { ar: p.descriptionAr, en: p.descriptionEn },
    gender: p.gender.toLowerCase() as Gender,
    family: p.family.toLowerCase() as FragranceFamily,
    collectionSlug: p.collection.slug,
    concentration: { ar: p.concentrationAr, en: p.concentrationEn },
    bottleShape: p.bottleShape.toLowerCase() as BottleShape,
    heroColor: p.heroColor,
    images: p.images,
    brandType: p.brandType,
    brandName: p.brandName ?? undefined,
    variants: p.variants.map(mapVariant),
    notes: {
      top: p.notes.filter((n) => n.layer === "TOP").map((n) => mapNote(n.note)),
      heart: p.notes.filter((n) => n.layer === "HEART").map((n) => mapNote(n.note)),
      base: p.notes.filter((n) => n.layer === "BASE").map((n) => mapNote(n.note)),
    },
    isBestseller: p.isBestseller,
    isNew: p.isNew,
    createdAt: p.createdAt.toISOString(),
  };
}

// A product with no variants has no size/price to sell — treat it as
// unpublished rather than letting it crash every page that assumes
// variants[0] exists (starting price, sort-by-price, etc).
const hasVariant = { variants: { some: {} } } satisfies Prisma.ProductWhereInput;

export async function getAllProducts(): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: hasVariant,
    include: productInclude,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapProduct);
}

export async function getBestsellerProducts(limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: { isBestseller: true, ...hasVariant },
    include: productInclude,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map(mapProduct);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({ where: hasVariant, select: { slug: true } });
  return rows.map((r) => r.slug);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const row = await prisma.product.findUnique({
    where: { slug },
    include: productInclude,
  });
  return row && row.variants.length > 0 ? mapProduct(row) : null;
}

export async function getRelatedProducts(product: Product, limit = 4): Promise<Product[]> {
  const rows = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      ...hasVariant,
      OR: [
        { collection: { slug: product.collectionSlug } },
        { family: product.family.toUpperCase() as never },
      ],
    },
    include: productInclude,
    take: limit,
  });
  return rows.map(mapProduct);
}
