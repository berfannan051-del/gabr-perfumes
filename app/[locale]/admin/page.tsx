import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { AdminStatCard } from "@/components/admin/ui/stat-card";
import { AdminChartCard } from "@/components/admin/ui/chart-card";
import { SalesAreaChart, OrderStatusDonut, TopProductsBar } from "@/components/admin/ui/charts";
import { BoxIcon, UsersIcon, BagIcon, TrendUpIcon, AlertIcon, EyeIcon } from "@/components/ui/icons";
import { getVisitCount } from "@/lib/data/site-stats";

const DAYS = 14;

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Admin.stats");
  const isAr = locale === "ar";

  const since = new Date();
  since.setDate(since.getDate() - DAYS);

  const [
    productCount,
    customerCount,
    orderCount,
    revenueAgg,
    recentOrders,
    lowStockVariants,
    ordersInRange,
    statusGroups,
    itemsInRange,
    recentCustomers,
    visitCount,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { subtotal: true }, where: { status: { not: "CANCELLED" } } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.productVariant.findMany({
      where: { stockQuantity: { lt: 10 } },
      include: { product: true },
      orderBy: { stockQuantity: "asc" },
      take: 6,
    }),
    prisma.order.findMany({
      where: { createdAt: { gte: since } },
      select: { subtotal: true, createdAt: true },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { status: true } }),
    prisma.orderItem.findMany({
      where: { order: { createdAt: { gte: since } } },
      select: { nameAr: true, nameEn: true, price: true, quantity: true },
    }),
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    getVisitCount(),
  ]);

  const salesByDay = new Map<string, number>();
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    salesByDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const order of ordersInRange) {
    const key = order.createdAt.toISOString().slice(0, 10);
    if (salesByDay.has(key)) {
      salesByDay.set(key, (salesByDay.get(key) ?? 0) + Number(order.subtotal));
    }
  }
  const salesData = Array.from(salesByDay.entries()).map(([date, revenue]) => ({
    label: new Date(date).toLocaleDateString(isAr ? "ar-EG" : "en-US", { day: "numeric", month: "short" }),
    revenue: Math.round(revenue),
  }));

  const tOrders = await getTranslations("Admin.orders");
  const statusData = statusGroups
    .filter((g) => g._count.status > 0)
    .map((g) => ({ name: tOrders(`status${g.status.charAt(0)}${g.status.slice(1).toLowerCase()}` as never), value: g._count.status }));

  const productRevenue = new Map<string, number>();
  for (const item of itemsInRange) {
    const name = isAr ? item.nameAr : item.nameEn;
    productRevenue.set(name, (productRevenue.get(name) ?? 0) + Number(item.price) * item.quantity);
  }
  const topProductsData = Array.from(productRevenue.entries())
    .map(([name, value]) => ({ name, value: Math.round(value) }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  const bestSellers = await prisma.product.findMany({
    where: { isBestseller: true },
    include: { variants: { orderBy: { sizeMl: "asc" }, take: 1 } },
    take: 5,
  });

  const stats = [
    { label: t("products"), value: productCount.toLocaleString(), icon: <BoxIcon className="h-5 w-5" /> },
    { label: t("customers"), value: customerCount.toLocaleString(), icon: <UsersIcon className="h-5 w-5" /> },
    { label: t("orders"), value: orderCount.toLocaleString(), icon: <BagIcon className="h-5 w-5" /> },
    {
      label: t("revenue"),
      value: `${Number(revenueAgg._sum.subtotal ?? 0).toLocaleString()} EGP`,
      icon: <TrendUpIcon className="h-5 w-5" />,
      accent: true,
    },
    { label: t("visits"), value: visitCount.toLocaleString(), icon: <EyeIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <AdminStatCard key={s.label} {...s} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminChartCard title={t("salesOverview")} subtitle={t("salesOverviewSubtitle")}>
            <SalesAreaChart data={salesData} />
          </AdminChartCard>
        </div>
        <AdminChartCard title={t("orderStatus")}>
          {statusData.length > 0 ? (
            <OrderStatusDonut data={statusData} />
          ) : (
            <p className="py-16 text-center text-caption">{t("noOrdersYet")}</p>
          )}
        </AdminChartCard>
      </div>

      <AdminChartCard title={t("topProducts")} subtitle={t("topProductsSubtitle")}>
        {topProductsData.length > 0 ? (
          <TopProductsBar data={topProductsData} />
        ) : (
          <p className="py-16 text-center text-caption">{t("noOrdersYet")}</p>
        )}
      </AdminChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="border border-border bg-surface p-5 lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-h3 text-base">{t("recentOrders")}</h3>
            <Link href="/admin/orders" className="text-caption text-primary">{t("viewAll")}</Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-caption">{t("noOrdersYet")}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentOrders.map((o) => (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="flex items-center justify-between text-body hover:text-primary">
                  <span>{o.orderNumber}</span>
                  <span className="text-caption">{Number(o.subtotal).toLocaleString()} EGP</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border border-border bg-surface p-5 lg:col-span-1">
          <h3 className="text-h3 mb-4 text-base">{t("bestSellers")}</h3>
          {bestSellers.length === 0 ? (
            <p className="text-caption">{t("noOrdersYet")}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {bestSellers.map((p) => (
                <Link key={p.id} href={`/admin/products/${p.id}`} className="flex items-center justify-between text-body hover:text-primary">
                  <span className="truncate">{isAr ? p.nameAr : p.nameEn}</span>
                  <span className="text-caption shrink-0">
                    {p.variants[0] ? Number(p.variants[0].price).toLocaleString() : "—"}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="border border-border bg-surface p-5 lg:col-span-1">
          <div className="mb-4 flex items-center gap-2">
            <AlertIcon className="h-4 w-4 text-primary-deep" />
            <h3 className="text-h3 text-base">{t("lowStockProducts")}</h3>
          </div>
          {lowStockVariants.length === 0 ? (
            <p className="text-caption">—</p>
          ) : (
            <div className="flex flex-col gap-3">
              {lowStockVariants.map((v) => (
                <Link key={v.id} href={`/admin/products/${v.productId}`} className="flex items-center justify-between text-body hover:text-primary">
                  <span className="truncate">{isAr ? v.product.nameAr : v.product.nameEn} — {v.sizeMl}ml</span>
                  <span className="text-caption shrink-0 text-primary-deep">{v.stockQuantity} {t("inStock")}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {recentCustomers.length > 0 && (
        <div className="border border-border bg-surface p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-h3 text-base">{t("recentCustomers")}</h3>
            <Link href="/admin/customers" className="text-caption text-primary">{t("viewAll")}</Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {recentCustomers.map((c) => (
              <div key={c.id} className="flex flex-col">
                <span className="text-body truncate">{c.name}</span>
                <span className="text-caption truncate">{c.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
