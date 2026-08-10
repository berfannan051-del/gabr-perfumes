import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export default async function AdminProductsPage() {
  const t = await getTranslations("Admin.products");
  const products = await prisma.product.findMany({
    include: { collection: true, variants: { orderBy: { sizeMl: "asc" } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-h2">{t("title")}</h1>
        <Link href="/admin/products/new" className={buttonVariants({ size: "sm" })}>
          {t("new")}
        </Link>
      </div>

      <table className="w-full border-collapse text-start">
        <thead>
          <tr className="border-b border-border text-label text-muted-foreground">
            <th className="py-3 text-start font-normal">{t("name")}</th>
            <th className="py-3 text-start font-normal">{t("collection")}</th>
            <th className="py-3 text-start font-normal">{t("price")}</th>
            <th className="py-3 text-start font-normal">{t("stock")}</th>
            <th className="py-3 text-end font-normal"></th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-b border-border">
              <td className="py-3 text-body">{p.nameAr}</td>
              <td className="py-3 text-caption text-muted-foreground">{p.collection.nameAr}</td>
              <td className="py-3 text-caption">
                {p.variants[0] ? Number(p.variants[0].price).toLocaleString() : "—"}
              </td>
              <td className="py-3 text-caption">
                {p.variants.reduce((sum, v) => sum + v.stockQuantity, 0)}
              </td>
              <td className="py-3 text-end">
                <Link href={`/admin/products/${p.id}`} className="text-caption text-primary me-4">
                  {t("edit")}
                </Link>
                <DeleteProductButton id={p.id} label={t("delete")} confirmMessage={t("confirmDelete")} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
