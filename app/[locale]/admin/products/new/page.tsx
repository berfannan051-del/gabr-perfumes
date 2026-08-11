import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { getAllBrands } from "@/lib/data/brands";

export default async function NewProductPage() {
  const [collections, notes, brands] = await Promise.all([
    prisma.collection.findMany({ select: { id: true, nameAr: true }, orderBy: { createdAt: "asc" } }),
    prisma.fragranceNote.findMany({ select: { id: true, nameAr: true, nameEn: true }, orderBy: { nameAr: "asc" } }),
    getAllBrands(),
  ]);

  return <ProductForm collections={collections} notes={notes} brands={brands} />;
}
