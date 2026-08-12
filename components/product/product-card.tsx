"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { BottleArt } from "@/components/product/bottle-art";
import { Badge } from "@/components/ui/badge";
import { HeartIcon } from "@/components/ui/icons";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import type { Locale, Product } from "@/types/catalog";

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("Product");
  const tc = useTranslations("Common");
  const wishlist = useWishlist();
  const inWishlist = wishlist.has(product.id);
  const startingPrice = product.variants[0].price;
  const image = product.images[0];

  return (
    <motion.div
      className="group relative"
      initial="rest"
      whileHover="hover"
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <motion.div
          variants={{
            rest: { y: 0, boxShadow: "0 1px 2px rgba(36,28,18,0.06), 0 8px 24px -12px rgba(36,28,18,0.18)" },
            hover: { y: -8, boxShadow: "0 4px 8px rgba(36,28,18,0.08), 0 24px 48px -16px rgba(36,28,18,0.28)" },
          }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative aspect-[3/4] overflow-hidden border border-border bg-surface-muted"
        >
          <motion.div
            variants={{ rest: { scale: 1, rotate: 0 }, hover: { scale: 1.12, rotate: -2 } }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="h-full w-full"
          >
            {image ? (
              <Image
                src={image}
                alt={product.name[locale]}
                fill
                sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 45vw"
                className="object-contain p-3"
              />
            ) : (
              <BottleArt shape={product.bottleShape} liquidColor={product.heroColor} className="h-full w-full" />
            )}
          </motion.div>
          <motion.div
            variants={{ rest: { opacity: 0 }, hover: { opacity: 1 } }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/25 via-transparent to-transparent"
          />

          <div className="absolute start-3 top-3 z-10 flex flex-col gap-2">
            {product.isNew && <Badge variant="solid">{t("newLabel")}</Badge>}
          </div>

          {product.brandType === "OTHER" && product.brand?.logo && (
            <div className="absolute end-3 bottom-3 z-10 h-12 w-12 overflow-hidden rounded-full border-2 border-surface bg-surface shadow-lifted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={product.brand.logo} alt={product.brand.name} className="h-full w-full object-cover" />
            </div>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              wishlist.toggle(product.id);
            }}
            aria-label={inWishlist ? t("removeFromWishlist") : t("addToWishlist")}
            className="absolute end-3 top-3 z-10 grid h-9 w-9 place-items-center bg-surface/90 text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:text-primary"
          >
            <HeartIcon filled={inWishlist} className="h-4 w-4" />
          </button>
        </motion.div>

        <div className="mt-4">
          {product.brandType === "OTHER" && (
            <p className="text-label mb-1 flex items-center gap-1.5 text-primary">
              {product.brand?.logo && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.brand.logo} alt="" className="h-4 w-4 rounded-full object-cover" />
              )}
              {product.brand?.name || t("brandOther")}
            </p>
          )}
          <p className="text-h3 text-base transition-colors duration-300 group-hover:text-primary-deep">
            {product.name[locale]}
          </p>
          <p className="text-caption mt-1 line-clamp-1">{product.shortDescription[locale]}</p>
          <p className="text-body mt-2 font-medium text-primary-deep">
            {startingPrice.toLocaleString(locale)} {tc("currency")}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
