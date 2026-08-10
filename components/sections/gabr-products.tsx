"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/catalog";

export function GabrProducts({ products }: { products: Product[] }) {
  const t = useTranslations("GabrProducts");
  const items = products.filter((p) => p.brandType === "GABR").slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-14 flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <span className="text-label text-primary">{t("eyebrow")}</span>
            <h2 className="text-h1 mt-4">{t("title")}</h2>
            <p className="text-body mt-3 max-w-md text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Link
            href="/shop?brand=GABR"
            className="text-label border-b border-primary pb-1 text-primary transition-opacity hover:opacity-70"
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
    </section>
  );
}
