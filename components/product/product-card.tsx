"use client";

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
    <div className="group relative">
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-surface-muted">
          <motion.div
            initial={false}
            className="h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 group-hover:-rotate-2"
          >
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt={product.name[locale]} className="h-full w-full object-cover" />
            ) : (
              <BottleArt shape={product.bottleShape} liquidColor={product.heroColor} className="h-full w-full" />
            )}
          </motion.div>

          <div className="absolute start-3 top-3 flex flex-col gap-2">
            {product.isNew && <Badge variant="solid">{t("newLabel")}</Badge>}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              wishlist.toggle(product.id);
            }}
            aria-label={inWishlist ? t("removeFromWishlist") : t("addToWishlist")}
            className="absolute end-3 top-3 grid h-9 w-9 place-items-center bg-surface/90 text-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100 hover:text-primary"
          >
            <HeartIcon filled={inWishlist} className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-h3 text-base">{product.name[locale]}</p>
          <p className="text-caption mt-1 line-clamp-1">{product.shortDescription[locale]}</p>
          <p className="text-body mt-2">
            {startingPrice.toLocaleString(locale)} {tc("currency")}
          </p>
        </div>
      </Link>
    </div>
  );
}
