import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { ProductsTable, type ProductRow } from "@/components/admin/products-table";
import { PlusIcon } from "@/components/ui/icons";

export default async function AdminProductsPage() {
  const t = await getTranslations("Admin.products");
  const products = await prisma.product.findMany({
    include: { collection: true, brand: true, variants: { orderBy: { sizeMl: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  const rows: ProductRow[] = products.map((p) => ({
    id: p.id,
    nameAr: p.nameAr,
    nameEn: p.nameEn,
    collectionNameAr: p.collection.nameAr,
    image: p.images[0] ?? null,
    brandType: p.brandType,
    brandName: p.brand?.name ?? null,
    price: p.variants[0] ? Number(p.variants[0].price) : null,
    stock: p.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
  }));

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-h2">{t("title")}</h1>
        <Link href="/admin/products/new" className={buttonVariants({ size: "sm" })}>
          <PlusIcon className="h-4 w-4" />
          {t("new")}
        </Link>
      </div>

      <div className="border border-border bg-surface p-5">
        <ProductsTable products={rows} />
      </div>
    </div>
  );
}
