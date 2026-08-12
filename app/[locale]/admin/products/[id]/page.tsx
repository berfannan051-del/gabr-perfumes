import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { getAllBrands } from "@/lib/data/brands";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, collections, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { sizeMl: "asc" } }, notes: { include: { note: true } } },
    }),
    prisma.collection.findMany({ select: { id: true, nameAr: true }, orderBy: { createdAt: "asc" } }),
    getAllBrands(),
  ]);

  if (!product) notFound();

  const joinNotes = (layer: "TOP" | "HEART" | "BASE") =>
    product.notes
      .filter((n) => n.layer === layer)
      .map((n) => n.note.nameAr)
      .join("، ");

  const formData = {
    id: product.id,
    slug: product.slug,
    nameAr: product.nameAr,
    nameEn: product.nameEn,
    shortDescriptionAr: product.shortDescriptionAr,
    shortDescriptionEn: product.shortDescriptionEn,
    descriptionAr: product.descriptionAr,
    descriptionEn: product.descriptionEn,
    gender: product.gender,
    family: product.family,
    collectionId: product.collectionId,
    concentrationAr: product.concentrationAr,
    concentrationEn: product.concentrationEn,
    bottleShape: product.bottleShape,
    heroColor: product.heroColor,
    images: product.images,
    isBestseller: product.isBestseller,
    isNew: product.isNew,
    brandType: product.brandType,
    brandId: product.brandId ?? "",
    variants: product.variants.map((v) => ({
      id: v.id,
      sizeMl: v.sizeMl,
      price: Number(v.price),
      stockQuantity: v.stockQuantity,
      sku: v.sku,
    })),
    notesByLayer: {
      top: joinNotes("TOP"),
      heart: joinNotes("HEART"),
      base: joinNotes("BASE"),
    },
  };

  return <ProductForm collections={collections} brands={brands} product={formData} />;
}
