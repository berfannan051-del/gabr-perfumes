"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ProductCard } from "@/components/product/product-card";
import { HeartIcon } from "@/components/ui/icons";
import { buttonVariants } from "@/components/ui/button";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import type { Locale, Product } from "@/types/catalog";

export function WishlistClient({ products }: { products: Product[] }) {
  const t = useTranslations("Wishlist");
  const locale = useLocale() as Locale;
  const wishlist = useWishlist();
  const items = products.filter((p) => wishlist.productIds.includes(p.id));

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 md:px-10">
      <div className="mb-14 flex flex-col items-center gap-3 text-center">
        <span className="text-label text-primary">GABR</span>
        <h1 className="text-h1">{t("title")}</h1>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-16 text-center">
          <HeartIcon className="h-10 w-10 text-muted-foreground" />
          <p className="text-h3">{t("empty")}</p>
          <p className="text-caption max-w-56">{t("emptyHint")}</p>
          <Link href="/shop" className={buttonVariants({ variant: "outline", size: "sm", className: "mt-2" })}>
            {locale === "ar" ? "تصفح المتجر" : "Browse Shop"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
          {items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
