import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getRelatedProducts, getAllProductSlugs } from "@/lib/data/products";
import { routing } from "@/i18n/routing";
import { ProductDetail } from "@/components/product/product-detail";
import type { Locale } from "@/types/catalog";

export async function generateStaticParams() {
  const slugs = await getAllProductSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const l = locale as Locale;
  return {
    title: product.name[l],
    description: product.shortDescription[l],
    openGraph: {
      title: product.name[l],
      description: product.shortDescription[l],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const relatedProducts = await getRelatedProducts(product);

  return <ProductDetail product={product} relatedProducts={relatedProducts} />;
}
