import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";
import { getAllBrands } from "@/lib/data/brands";

export default async function NewProductPage() {
  const [collections, brands] = await Promise.all([
    prisma.collection.findMany({ select: { id: true, nameAr: true }, orderBy: { createdAt: "asc" } }),
    getAllBrands(),
  ]);

  return <ProductForm collections={collections} brands={brands} />;
}
