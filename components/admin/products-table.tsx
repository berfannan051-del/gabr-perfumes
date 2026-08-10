"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { DeleteProductButton } from "@/components/admin/delete-product-button";

export type ProductRow = {
  id: string;
  nameAr: string;
  nameEn: string;
  collectionNameAr: string;
  image: string | null;
  brandType: "GABR" | "OTHER";
  brandName: string | null;
  price: number | null;
  stock: number;
};

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const t = useTranslations("Admin.products");
  const locale = useLocale();
  const isAr = locale === "ar";

  const columns: DataTableColumn<ProductRow>[] = [
    {
      key: "image",
      label: t("image"),
      render: (p) => (
        <div className="h-12 w-10 shrink-0 overflow-hidden bg-surface-muted">
          {p.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.image} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
      ),
    },
    {
      key: "name",
      label: t("name"),
      render: (p) => (
        <div>
          <p className="text-body">{isAr ? p.nameAr : p.nameEn}</p>
          <p className="text-caption text-muted-foreground">{p.collectionNameAr}</p>
        </div>
      ),
      sortValue: (p) => (isAr ? p.nameAr : p.nameEn),
    },
    {
      key: "brand",
      label: t("brand"),
      render: (p) => (
        <span
          className={`inline-block border px-2 py-0.5 text-caption ${
            p.brandType === "GABR" ? "border-primary text-primary" : "border-border text-muted-foreground"
          }`}
        >
          {p.brandType === "GABR" ? t("brandGabr") : p.brandName || t("brandOther")}
        </span>
      ),
      sortValue: (p) => p.brandType,
    },
    {
      key: "price",
      label: t("price"),
      render: (p) => (p.price !== null ? p.price.toLocaleString() : "—"),
      sortValue: (p) => p.price ?? 0,
      align: "end",
    },
    {
      key: "stock",
      label: t("stock"),
      render: (p) => p.stock,
      sortValue: (p) => p.stock,
      align: "end",
    },
    {
      key: "actions",
      label: "",
      align: "end",
      render: (p) => (
        <div className="flex items-center justify-end gap-4">
          <Link href={`/admin/products/${p.id}`} className="text-caption text-primary">
            {t("edit")}
          </Link>
          <DeleteProductButton id={p.id} label={t("delete")} confirmMessage={t("confirmDelete")} />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      rows={products}
      columns={columns}
      rowKey={(p) => p.id}
      searchText={(p) => `${p.nameAr} ${p.nameEn}`}
      searchPlaceholder={t("search")}
      emptyLabel={t("noResults")}
      pageSize={10}
    />
  );
}
