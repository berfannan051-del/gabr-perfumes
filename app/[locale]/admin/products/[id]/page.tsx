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

  const [product, collections, notes, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: { variants: { orderBy: { sizeMl: "asc" } }, notes: true },
    }),
    prisma.collection.findMany({ select: { id: true, nameAr: true }, orderBy: { createdAt: "asc" } }),
    prisma.fragranceNote.findMany({ select: { id: true, nameAr: true, nameEn: true }, orderBy: { nameAr: "asc" } }),
    getAllBrands(),
  ]);

  if (!product) notFound();

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
      top: product.notes.filter((n) => n.layer === "TOP").map((n) => n.noteId),
      heart: product.notes.filter((n) => n.layer === "HEART").map((n) => n.noteId),
      base: product.notes.filter((n) => n.layer === "BASE").map((n) => n.noteId),
    },
  };

  return <ProductForm collections={collections} notes={notes} brands={brands} product={formData} />;
}
