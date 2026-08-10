import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";

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

  const links = [
    { href: "/admin", label: t("dashboard") },
    { href: "/admin/products", label: t("products") },
    { href: "/admin/collections", label: t("collections") },
    { href: "/admin/orders", label: t("orders") },
  ];

  return (
    <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-5 pt-28 pb-20 md:grid-cols-[200px_1fr] md:px-10">
      <aside className="flex flex-row gap-1 overflow-x-auto md:flex-col md:gap-0.5">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap px-3 py-2.5 text-label text-muted-foreground hover:bg-surface-muted hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
        <Link
          href="/"
          className="whitespace-nowrap px-3 py-2.5 text-label text-muted-foreground hover:bg-surface-muted hover:text-foreground"
        >
          {t("backToSite")}
        </Link>
      </aside>
      <div>{children}</div>
    </div>
  );
}
