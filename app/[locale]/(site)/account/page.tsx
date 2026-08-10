import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SignOutButton } from "@/components/auth/sign-out-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Account" });
  return { title: t("title") };
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/login?callbackUrl=/${locale}/account`);

  const t = await getTranslations("Account");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 md:px-10">
      <h1 className="text-h1 mb-2">{t("title")}</h1>
      <p className="text-body mb-12 text-muted-foreground">
        {t("welcomeBack", { name: session.user.name ?? session.user.email ?? "" })}
      </p>

      <div className="mb-12 border border-border bg-surface p-6">
        <h2 className="text-h3 mb-4 text-base">{t("profileHeading")}</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-caption text-muted-foreground">{t("name")}</p>
            <p className="text-body">{session.user.name}</p>
          </div>
          <div>
            <p className="text-caption text-muted-foreground">{t("email")}</p>
            <p className="text-body">{session.user.email}</p>
          </div>
        </div>
        <div className="mt-6">
          <SignOutButton label={t("signOut")} />
        </div>
      </div>

      <div className="border border-border bg-surface p-6">
        <h2 className="text-h3 mb-6 text-base">{t("ordersHeading")}</h2>
        {orders.length === 0 ? (
          <p className="text-body text-muted-foreground">{t("noOrders")}</p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {orders.map((o) => (
              <div key={o.id} className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-body">{o.orderNumber}</p>
                  <p className="text-caption text-muted-foreground">
                    {o.createdAt.toLocaleDateString(locale)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-caption border border-border px-2 py-0.5">
                    {t(`status${o.status.charAt(0)}${o.status.slice(1).toLowerCase()}` as never)}
                  </span>
                  <span className="text-body">{Number(o.subtotal).toLocaleString(locale)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
