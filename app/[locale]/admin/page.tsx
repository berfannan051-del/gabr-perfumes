import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const t = await getTranslations("Admin.stats");

  const [orderCount, revenue, lowStock] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({
      _sum: { subtotal: true },
      where: { status: { not: "CANCELLED" } },
    }),
    prisma.productVariant.count({ where: { stockQuantity: { lt: 10 } } }),
  ]);

  const stats = [
    { label: t("orders"), value: orderCount.toLocaleString() },
    { label: t("revenue"), value: `${Number(revenue._sum.subtotal ?? 0).toLocaleString()} EGP` },
    { label: t("lowStock"), value: lowStock.toLocaleString() },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <div key={stat.label} className="border border-border p-6">
          <p className="text-label mb-2 text-muted-foreground">{stat.label}</p>
          <p className="text-h2">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
