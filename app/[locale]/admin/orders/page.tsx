import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { OrdersTable, type OrderRow } from "@/components/admin/orders-table";

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const t = await getTranslations("Admin.orders");

  const orders = await prisma.order.findMany({
    where: status && statuses.includes(status as never) ? { status: status as never } : undefined,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  const rows: OrderRow[] = orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    fullName: o.fullName,
    createdAt: o.createdAt.toISOString(),
    subtotal: Number(o.subtotal),
    status: o.status,
  }));

  return (
    <div>
      <h1 className="text-h2 mb-6">{t("title")}</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/admin/orders"
          className={`border px-3 py-1.5 text-caption ${!status ? "border-primary bg-primary text-background" : "border-border"}`}
        >
          {t("filterAll")}
        </Link>
        {statuses.map((s) => (
          <Link
            key={s}
            href={`/admin/orders?status=${s}`}
            className={`border px-3 py-1.5 text-caption ${status === s ? "border-primary bg-primary text-background" : "border-border"}`}
          >
            {t(`status${s.charAt(0)}${s.slice(1).toLowerCase()}`)}
          </Link>
        ))}
      </div>

      <div className="border border-border bg-surface p-5">
        <OrdersTable orders={rows} />
      </div>
    </div>
  );
}
