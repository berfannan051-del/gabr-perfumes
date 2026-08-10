import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const [collections, notes] = await Promise.all([
    prisma.collection.findMany({ select: { id: true, nameAr: true }, orderBy: { createdAt: "asc" } }),
    prisma.fragranceNote.findMany({ select: { id: true, nameAr: true, nameEn: true }, orderBy: { nameAr: "asc" } }),
  ]);

  return <ProductForm collections={collections} notes={notes} />;
}
