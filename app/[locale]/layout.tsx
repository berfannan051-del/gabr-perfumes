import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { SiteShell } from "@/components/layout/site-shell";
import { getAllProducts } from "@/lib/data/products";
import { auth } from "@/auth";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Brand" });

  return {
    title: {
      default: `${t("nameLatin")} ${t("labelLatin")}`,
      template: `%s — ${t("nameLatin")}`,
    },
    description: t("tagline"),
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
    alternates: {
      languages: { ar: "/ar", en: "/en" },
    },
    openGraph: {
      title: `${t("nameLatin")} ${t("labelLatin")}`,
      description: t("tagline"),
      locale,
      type: "website",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const dir = locale === "ar" ? "rtl" : "ltr";
  const [products, session] = await Promise.all([getAllProducts(), auth()]);

  return (
    <html lang={locale} dir={dir} className="h-full" data-scroll-behavior="smooth">
      <body className="flex min-h-full flex-col bg-background text-foreground antialiased">
        <NextIntlClientProvider>
          <SiteShell products={products} session={session}>
            {children}
          </SiteShell>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
