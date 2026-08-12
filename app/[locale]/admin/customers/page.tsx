import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { CustomersTable, type CustomerRow } from "@/components/admin/customers-table";

export default async function AdminCustomersPage() {
  const t = await getTranslations("Admin.customers");
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { orders: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const rows: CustomerRow[] = customers.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    orderCount: c._count.orders,
    createdAt: c.createdAt.toISOString(),
  }));

  return (
    <div>
      <h1 className="text-h2 mb-6">{t("title")}</h1>
      <div className="border border-border bg-surface p-5">
        <CustomersTable customers={rows} />
      </div>
    </div>
  );
}
