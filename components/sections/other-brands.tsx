"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import { ChevronIcon } from "@/components/ui/icons";
import type { Brand, Locale, Product } from "@/types/catalog";

function BrandRow({ brand, items }: { brand: Brand; items: Product[] }) {
  const t = useTranslations("OtherBrands");
  const locale = useLocale() as Locale;
  const trackRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    const isRTL = locale === "ar";
    el.scrollBy({ left: (isRTL ? -1 : 1) * dir * step, behavior: "smooth" });
  }

  return (
    <div>
      <div className="relative mb-10 overflow-hidden border border-primary/15 bg-gradient-to-br from-surface to-surface-muted px-6 py-6 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_0%_0%,color-mix(in_srgb,var(--color-primary)_10%,transparent),transparent_60%)]" />

        <div className="relative flex flex-wrap items-center justify-between gap-6">
          <Link href={`/shop?brand=OTHER&brandId=${brand.id}`} className="group flex items-center gap-5">
            {brand.logo ? (
              <div className="relative shrink-0">
                <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-primary/15 blur-xl" />
                <div className="h-20 w-20 overflow-hidden rounded-full border-2 border-primary bg-surface shadow-lifted transition-transform duration-300 group-hover:scale-105">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={brand.logo} alt={brand.name} className="h-full w-full object-cover" />
                </div>
              </div>
            ) : null}
            <div>
              <span className="text-label text-primary">{t("eyebrow")}</span>
              <p className="text-display text-3xl leading-none text-foreground transition-colors duration-300 group-hover:text-primary-deep sm:text-4xl">
                {brand.name}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href={`/shop?brand=OTHER&brandId=${brand.id}`}
              className="text-label text-primary underline-offset-4 transition-opacity hover:opacity-70 hover:underline"
            >
              {t("viewAll")}
            </Link>
            <div className="flex gap-2">
              <button
                type="button"
                aria-label={t("prev")}
                onClick={() => scroll(-1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 text-foreground transition-all duration-300 hover:bg-primary hover:text-cta-foreground"
              >
                <ChevronIcon className="h-4 w-4 rotate-180 rtl:rotate-0" />
              </button>
              <button
                type="button"
                aria-label={t("next")}
                onClick={() => scroll(1)}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 text-foreground transition-all duration-300 hover:bg-primary hover:text-cta-foreground"
              >
                <ChevronIcon className="h-4 w-4 rtl:rotate-180" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        ref={trackRef}
        className="scrollbar-hide -mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-2 md:mx-0 md:px-0"
      >
        {items.map((product, i) => (
          <motion.div
            key={product.id}
            data-card
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: i * 0.08 }}
            className="w-[62vw] shrink-0 snap-start sm:w-[260px]"
          >
            <ProductCard product={product} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function OtherBrands({ brands, products }: { brands: Brand[]; products: Product[] }) {
  const t = useTranslations("OtherBrands");

  const sections = brands
    .map((brand) => ({ brand, items: products.filter((p) => p.brand?.id === brand.id) }))
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
            <BrandRow key={brand.id} brand={brand} items={items} />
          ))}
        </div>
      </div>
    </section>
  );
}
