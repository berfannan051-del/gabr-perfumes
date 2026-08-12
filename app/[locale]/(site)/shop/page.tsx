import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ShopClient } from "@/components/shop/shop-client";
import { getAllProducts } from "@/lib/data/products";
import { getCollections } from "@/lib/data/collections";
import { getAllBrands } from "@/lib/data/brands";
import type { Gender } from "@/types/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Shop" });
  return { title: t("title") };
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; gender?: string; brand?: string; brandId?: string }>;
}) {
  const params = await searchParams;
  const validGenders: Gender[] = ["men", "women", "unisex"];
  const gender = validGenders.includes(params.gender as Gender)
    ? (params.gender as Gender)
    : undefined;
  const brand = params.brand === "GABR" || params.brand === "OTHER" ? params.brand : undefined;

  const [products, collections, brands] = await Promise.all([
    getAllProducts(),
    getCollections(),
    getAllBrands(),
  ]);

  return (
    <ShopClient
      products={products}
      collections={collections}
      brands={brands}
      initialCollection={params.collection}
      initialGender={gender}
      initialBrand={brand}
      initialBrandId={params.brandId}
    />
  );
}
