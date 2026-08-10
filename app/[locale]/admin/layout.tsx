import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations("Admin.nav");

  const nav = [
    {
      label: t("groupOverview"),
      items: [{ href: "/admin", label: t("dashboard") }],
    },
    {
      label: t("groupCatalog"),
      items: [
        { href: "/admin/products", label: t("products") },
        { href: "/admin/collections", label: t("collections") },
      ],
    },
    {
      label: t("groupSales"),
      items: [
        { href: "/admin/orders", label: t("orders") },
        { href: "/admin/customers", label: t("customers") },
      ],
    },
    {
      label: t("groupContent"),
      items: [
        { href: "/admin/reviews", label: t("reviews") },
        { href: "/admin/content", label: t("content") },
        { href: "/admin/settings", label: t("settings") },
      ],
    },
  ];

  return (
    <AdminShell
      nav={nav}
      adminName={session.user.name ?? session.user.email ?? ""}
      title={t("dashboard")}
      backToSiteLabel={t("backToSite")}
      logoutLabel={t("logout")}
    >
      {children}
    </AdminShell>
  );
}
