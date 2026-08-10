"use client";

import { useTranslations } from "next-intl";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";

export type CustomerRow = {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  createdAt: string;
};

export function CustomersTable({ customers }: { customers: CustomerRow[] }) {
  const t = useTranslations("Admin.customers");

  const columns: DataTableColumn<CustomerRow>[] = [
    {
      key: "name",
      label: t("name"),
      render: (c) => c.name,
      sortValue: (c) => c.name,
    },
    {
      key: "email",
      label: t("email"),
      render: (c) => <span className="text-muted-foreground">{c.email}</span>,
      sortValue: (c) => c.email,
    },
    {
      key: "orders",
      label: t("orders"),
      render: (c) => c.orderCount,
      sortValue: (c) => c.orderCount,
      align: "end",
    },
    {
      key: "joined",
      label: t("joined"),
      render: (c) => <span className="text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>,
      sortValue: (c) => new Date(c.createdAt).getTime(),
      align: "end",
    },
  ];

  return (
    <DataTable
      rows={customers}
      columns={columns}
      rowKey={(c) => c.id}
      searchText={(c) => `${c.name} ${c.email}`}
      searchPlaceholder={t("search")}
      emptyLabel={t("noResults")}
      pageSize={15}
    />
  );
}
