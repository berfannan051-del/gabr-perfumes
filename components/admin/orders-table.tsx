"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";

export type OrderRow = {
  id: string;
  orderNumber: string;
  fullName: string;
  createdAt: string;
  total: number;
  status: "PENDING" | "CONFIRMED" | "SHIPPED" | "DELIVERED" | "CANCELLED";
};

const STATUS_STYLES: Record<OrderRow["status"], string> = {
  PENDING: "border-border text-muted-foreground",
  CONFIRMED: "border-primary text-primary",
  SHIPPED: "border-primary text-primary",
  DELIVERED: "border-primary text-primary",
  CANCELLED: "border-primary-deep text-primary-deep",
};

export function OrdersTable({ orders }: { orders: OrderRow[] }) {
  const t = useTranslations("Admin.orders");

  const columns: DataTableColumn<OrderRow>[] = [
    {
      key: "orderNumber",
      label: t("orderNumber"),
      render: (o) => (
        <Link href={`/admin/orders/${o.id}`} className="text-primary">
          {o.orderNumber}
        </Link>
      ),
      sortValue: (o) => o.orderNumber,
    },
    {
      key: "customer",
      label: t("customer"),
      render: (o) => o.fullName,
      sortValue: (o) => o.fullName,
    },
    {
      key: "date",
      label: t("date"),
      render: (o) => <span className="text-muted-foreground">{new Date(o.createdAt).toLocaleDateString()}</span>,
      sortValue: (o) => new Date(o.createdAt).getTime(),
    },
    {
      key: "total",
      label: t("total"),
      render: (o) => o.total.toLocaleString(),
      sortValue: (o) => o.total,
      align: "end",
    },
    {
      key: "status",
      label: t("status"),
      render: (o) => (
        <span className={`inline-block border px-2 py-0.5 text-caption ${STATUS_STYLES[o.status]}`}>
          {t(`status${o.status.charAt(0)}${o.status.slice(1).toLowerCase()}` as never)}
        </span>
      ),
      sortValue: (o) => o.status,
    },
  ];

  return (
    <DataTable
      rows={orders}
      columns={columns}
      rowKey={(o) => o.id}
      searchText={(o) => `${o.orderNumber} ${o.fullName}`}
      searchPlaceholder={t("search")}
      emptyLabel={t("noResults")}
      pageSize={15}
    />
  );
}
