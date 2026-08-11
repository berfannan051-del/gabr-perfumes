import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutClient } from "@/components/checkout/checkout-client";
import { getSiteContentMap, pick } from "@/lib/data/site-content";
import type { Locale } from "@/types/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });
  return { title: t("title") };
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const siteContent = await getSiteContentMap();

  return (
    <CheckoutClient
      instapayNumber={pick(siteContent, "settings.instapayNumber", l)}
      vodafoneCashNumber={pick(siteContent, "settings.vodafoneCashNumber", l)}
      whatsappNumber={pick(siteContent, "settings.whatsappNumber", l)}
    />
  );
}
