import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { WishlistClient } from "@/components/wishlist/wishlist-client";
import { getAllProducts } from "@/lib/data/products";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Wishlist" });
  return { title: t("title") };
}

export default async function WishlistPage() {
  const products = await getAllProducts();
  return <WishlistClient products={products} />;
}
