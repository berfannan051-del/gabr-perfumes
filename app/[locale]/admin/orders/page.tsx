import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";

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

  return (
    <div>
      <h1 className="text-h2 mb-6">{t("title")}</h1>

      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/orders" className={`border px-3 py-1.5 text-caption ${!status ? "border-primary bg-primary text-background" : "border-border"}`}>
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

      <table className="w-full border-collapse text-start">
        <thead>
          <tr className="border-b border-border text-label text-muted-foreground">
            <th className="py-3 text-start font-normal">{t("orderNumber")}</th>
            <th className="py-3 text-start font-normal">{t("customer")}</th>
            <th className="py-3 text-start font-normal">{t("date")}</th>
            <th className="py-3 text-start font-normal">{t("total")}</th>
            <th className="py-3 text-start font-normal">{t("status")}</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-border">
              <td className="py-3 text-body">
                <Link href={`/admin/orders/${o.id}`} className="text-primary">
                  {o.orderNumber}
                </Link>
              </td>
              <td className="py-3 text-caption">{o.fullName}</td>
              <td className="py-3 text-caption text-muted-foreground">
                {o.createdAt.toLocaleDateString()}
              </td>
              <td className="py-3 text-caption">{Number(o.subtotal).toLocaleString()}</td>
              <td className="py-3 text-caption">{o.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
