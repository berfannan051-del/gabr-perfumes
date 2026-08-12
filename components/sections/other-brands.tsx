"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import type { Brand, Product } from "@/types/catalog";

export function OtherBrands({ brands, products }: { brands: Brand[]; products: Product[] }) {
  const t = useTranslations("OtherBrands");

  const sections = brands
    .map((brand) => ({ brand, items: products.filter((p) => p.brand?.id === brand.id).slice(0, 4) }))
    .filter((s) => s.items.length > 0);

  if (sections.length === 0) return null;

  return (
    <section className="bg-surface-muted py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-14 flex flex-col items-center gap-4 text-center">
          <span className="text-label text-primary">{t("eyebrow")}</span>
          <h2 className="text-h1">{t("title")}</h2>
        </div>

        <div className="flex flex-col gap-20">
          {sections.map(({ brand, items }) => (
            <div key={brand.id}>
              <div className="mb-8 flex items-center justify-between gap-4">
                <Link href={`/shop?brand=OTHER&brandId=${brand.id}`} className="flex items-center gap-3">
                  {brand.logo ? (
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border bg-surface shadow-soft">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <span className="text-h3">{brand.name}</span>
                </Link>
                <Link
                  href={`/shop?brand=OTHER&brandId=${brand.id}`}
                  className="text-label shrink-0 border-b border-primary pb-1 text-primary transition-opacity hover:opacity-70"
                >
                  {t("viewAll")}
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
                {items.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-10%" }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
