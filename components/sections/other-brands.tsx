"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ChevronIcon } from "@/components/ui/icons";
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
              <div className="mb-8 flex items-center justify-between gap-4 border border-border bg-surface px-6 py-5 shadow-soft sm:px-8 sm:py-6">
                <Link href={`/shop?brand=OTHER&brandId=${brand.id}`} className="group flex items-center gap-4">
                  {brand.logo ? (
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 bg-surface-muted shadow-soft transition-transform duration-300 group-hover:scale-105">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
                    </div>
                  ) : null}
                  <p className="text-h3 transition-colors duration-300 group-hover:text-primary-deep">{brand.name}</p>
                </Link>
                <Link
                  href={`/shop?brand=OTHER&brandId=${brand.id}`}
                  className="group flex shrink-0 items-center gap-2 border border-primary px-5 py-2.5 text-label text-primary transition-all duration-300 hover:bg-primary hover:text-cta-foreground hover:shadow-soft"
                >
                  <span>{t("viewAll")}</span>
                  <ChevronIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
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
