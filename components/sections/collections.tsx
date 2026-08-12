"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BottleArt } from "@/components/product/bottle-art";
import type { Collection, Locale, Product } from "@/types/catalog";
import { cn } from "@/lib/cn";

const spans = [
  "md:col-span-2 md:row-span-2",
  "md:col-span-1 md:row-span-1",
  "md:col-span-1 md:row-span-1",
  "md:col-span-2 md:row-span-1",
];

export function Collections({
  collections,
  products,
}: {
  collections: Collection[];
  products: Product[];
}) {
  const t = useTranslations("Collections");
  const locale = useLocale() as Locale;

  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-14 flex flex-col items-center gap-4 text-center">
          <span className="text-label text-primary">{t("eyebrow")}</span>
          <h2 className="text-h1">{t("title")}</h2>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[16rem]">
          {collections.map((collection, i) => {
            const rep = products.find((p) => p.collectionSlug === collection.slug);
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: (i % 3) * 0.08 }}
                className={cn("group relative min-h-64 overflow-hidden bg-surface-muted", spans[i % spans.length])}
              >
                <Link href={`/shop?collection=${collection.slug}`} className="block h-full w-full">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    {collection.coverImage ? (
                      <Image
                        src={collection.coverImage}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover"
                      />
                    ) : rep ? (
                      <div className="opacity-70">
                        <BottleArt shape={rep.bottleShape} liquidColor={rep.heroColor} className="h-full w-full" />
                      </div>
                    ) : null}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent" />
                  {collection.image && (
                    <div className="absolute start-4 top-4 h-12 w-12 overflow-hidden rounded-full border-2 border-background/80 bg-surface shadow-lifted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={collection.image} alt="" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <div className="relative flex h-full flex-col justify-end p-6">
                    <h3 className="text-h3 text-background">{collection.name[locale]}</h3>
                    <p className="text-caption mt-1 max-w-xs text-background/75">
                      {collection.description[locale]}
                    </p>
                    <span className="text-label mt-4 inline-flex items-center gap-2 text-primary-highlight opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {t("exploreLabel")}
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
