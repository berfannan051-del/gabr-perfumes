"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ProductGallery } from "@/components/product/product-gallery";
import { NotesVisualizer } from "@/components/product/notes-visualizer";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeartIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart/cart-context";
import { useWishlist } from "@/lib/wishlist/wishlist-context";
import type { Locale, Product } from "@/types/catalog";

type Tab = "description" | "notes" | "howToWear";

export function ProductDetail({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const t = useTranslations("Product");
  const tc = useTranslations("Common");
  const tf = useTranslations("Families");
  const locale = useLocale() as Locale;
  const cart = useCart();
  const wishlist = useWishlist();

  const [variantId, setVariantId] = useState(product.variants[1]?.id ?? product.variants[0].id);
  const [quantity, setQuantity] = useState(1);
  const [tab, setTab] = useState<Tab>("description");
  const [justAdded, setJustAdded] = useState(false);

  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0];
  const inWishlist = wishlist.has(product.id);
  const outOfStock = variant.stockQuantity === 0;
  const lowStock = variant.stockQuantity > 0 && variant.stockQuantity <= 10;
  const onSale = variant.finalPrice < variant.price;
  const discountPercent = onSale ? Math.round((1 - variant.finalPrice / variant.price) * 100) : 0;

  function selectVariant(v: (typeof product.variants)[number]) {
    setVariantId(v.id);
    setQuantity((q) => Math.min(q, Math.max(1, v.stockQuantity)));
  }

  function handleAddToCart() {
    if (outOfStock) return;
    cart.addItem(
      {
        productId: product.id,
        variantId: variant.id,
        slug: product.slug,
        name: product.name,
        sizeMl: variant.sizeMl,
        price: variant.finalPrice,
        stockQuantity: variant.stockQuantity,
        heroColor: product.heroColor,
        bottleShape: product.bottleShape,
        image: product.images[0] ?? null,
      },
      quantity
    );
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pt-28 pb-24 md:px-10 md:pt-36">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <ProductGallery product={product} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <span className="text-label text-primary">{tf(product.family)}</span>

          {product.brandType === "OTHER" && (
            <div className="mt-3 flex items-center gap-3">
              {product.brand?.logo ? (
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border shadow-soft">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={product.brand.logo} alt={product.brand.name} className="h-full w-full object-cover" />
                </div>
              ) : null}
              <span className="text-h3 text-base">{product.brand?.name || t("brandOther")}</span>
            </div>
          )}

          <h1 className="text-h1 mt-3 mb-4">{product.name[locale]}</h1>
          <p className="text-body mb-6 text-muted-foreground">{product.shortDescription[locale]}</p>

          <div className="mb-8 flex flex-wrap items-center gap-3">
            <span className="text-h3">
              {variant.finalPrice.toLocaleString(locale)} {tc("currency")}
            </span>
            {onSale && (
              <span className="text-body text-muted-foreground line-through">
                {variant.price.toLocaleString(locale)} {tc("currency")}
              </span>
            )}
            {onSale && <Badge variant="solid">{t("saleLabel", { percent: discountPercent })}</Badge>}
            {product.isBestseller && <Badge variant="outline">★ {t("bestsellerLabel")}</Badge>}
          </div>

          <div className="mb-7">
            <span className="text-label mb-3 block text-muted-foreground">{t("sizeLabel")}</span>
            <div className="flex flex-wrap gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => selectVariant(v)}
                  disabled={v.stockQuantity === 0}
                  className={`border px-4 py-2.5 text-caption transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                    v.id === variant.id
                      ? "border-primary bg-primary text-background"
                      : "border-border hover:border-primary"
                  }`}
                >
                  {v.sizeMl}ml
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <span className="text-label mb-3 block text-muted-foreground">{t("quantityLabel")}</span>
            <div className="flex w-fit items-center gap-4 border border-border px-3 py-2">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={outOfStock}
                aria-label="minus"
                className="disabled:opacity-40"
              >
                <MinusIcon className="h-4 w-4" />
              </button>
              <span className="w-4 text-center text-body">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(variant.stockQuantity, q + 1))}
                disabled={outOfStock || quantity >= variant.stockQuantity}
                aria-label="plus"
                className="disabled:opacity-40"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="mb-6">
            {outOfStock ? (
              <p className="text-caption text-primary-deep">{t("outOfStock")}</p>
            ) : lowStock ? (
              <p className="text-caption text-primary-deep">{t("lowStock", { count: variant.stockQuantity })}</p>
            ) : (
              <p className="text-caption text-muted-foreground">{t("inStock")}</p>
            )}
          </div>

          <div className="mb-10 flex gap-3">
            <Button size="lg" onClick={handleAddToCart} disabled={outOfStock} className="flex-1">
              {outOfStock ? t("outOfStock") : justAdded ? t("addedToCart") : t("addToCart")}
            </Button>
            <button
              type="button"
              onClick={() => wishlist.toggle(product.id)}
              aria-label={inWishlist ? t("removeFromWishlist") : t("addToWishlist")}
              className="grid h-14 w-14 shrink-0 place-items-center border border-border hover:border-primary hover:text-primary transition-colors"
            >
              <HeartIcon filled={inWishlist} className="h-5 w-5" />
            </button>
          </div>

          <div className="border-t border-border">
            <div className="flex gap-8 border-b border-border">
              {(["description", "notes", "howToWear"] as Tab[]).map((tabKey) => (
                <button
                  key={tabKey}
                  type="button"
                  onClick={() => setTab(tabKey)}
                  className={`text-label -mb-px border-b-2 py-4 transition-colors ${
                    tab === tabKey ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(`tabs.${tabKey}`)}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                className="py-8"
              >
                {tab === "description" && <p className="text-body text-muted-foreground">{product.description[locale]}</p>}
                {tab === "notes" && (
                  <NotesVisualizer top={product.notes.top} heart={product.notes.heart} base={product.notes.base} />
                )}
                {tab === "howToWear" && (
                  <p className="text-body text-muted-foreground">
                    {locale === "ar"
                      ? "يُنصح برشّ العطر على نقاط النبض—الرسغين والرقبة—بعد الاستحمام مباشرة لثبات أطول. تجنب الفرك بعد الرش للحفاظ على تركيبة الطبقات."
                      : "Apply to pulse points—wrists and neck—right after showering for longer wear. Avoid rubbing after application to preserve the fragrance's layered structure."}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <p className="text-caption mt-4">
            {t("sku")}: {variant.sku} · {t("concentration")}: {product.concentration[locale]}
          </p>
        </motion.div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-28">
          <h2 className="text-h2 mb-10">{t("related")}</h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
