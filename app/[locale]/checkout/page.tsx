import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Checkout" });
  return { title: t("title") };
}

export default function CheckoutPage() {
  return <CheckoutClient />;
}
