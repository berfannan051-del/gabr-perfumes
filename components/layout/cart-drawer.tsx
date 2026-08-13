"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Sheet, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { BottleArt } from "@/components/product/bottle-art";
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon, BagIcon } from "@/components/ui/icons";
import { useCart } from "@/lib/cart/cart-context";
import type { Locale } from "@/types/catalog";

export function CartDrawer() {
  const cart = useCart();
  const t = useTranslations("Cart");
  const locale = useLocale() as Locale;

  return (
    <Sheet open={cart.isOpen} onOpenChange={(open) => (open ? cart.open() : cart.close())}>
      <div className="flex items-center justify-between border-b border-border px-6 py-5">
        <SheetTitle className="text-h3">{t("title")}</SheetTitle>
        <SheetClose aria-label="close" className="hover:text-primary transition-colors">
          <CloseIcon className="h-5 w-5" />
        </SheetClose>
      </div>

      {cart.items.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
          <BagIcon className="h-10 w-10 text-muted-foreground" />
          <p className="text-h3">{t("empty")}</p>
          <p className="text-caption max-w-56">{t("emptyHint")}</p>
          <SheetClose className={buttonVariants({ variant: "outline", size: "sm", className: "mt-2" })}>
            {t("continueShopping")}
          </SheetClose>
        </div>
      ) : (
        <>
          <div className="flex-1 overflow-y-auto px-6">
            <AnimatePresence initial={false}>
              {cart.items.map((item) => (
                <motion.div
                  key={`${item.productId}-${item.variantId}`}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-4 border-b border-border py-5"
                >
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden bg-surface-muted">
                    {item.image ? (
                      <Image src={item.image} alt={item.name[locale]} fill sizes="80px" className="object-contain p-1" />
                    ) : (
                      <BottleArt shape={item.bottleShape} liquidColor={item.heroColor} className="h-full w-full" />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <p className="text-h3 text-base">{item.name[locale]}</p>
                      <p className="text-caption">
                        {t("size")}: {item.sizeMl}ml
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 border border-border px-2 py-1">
                        <button
                          type="button"
                          onClick={() =>
                            cart.setQuantity(item.productId, item.variantId, item.quantity - 1)
                          }
                          aria-label="minus"
                        >
                          <MinusIcon className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-4 text-center text-caption">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            cart.setQuantity(item.productId, item.variantId, item.quantity + 1)
                          }
                          disabled={item.quantity >= item.stockQuantity}
                          aria-label="plus"
                          className="disabled:opacity-40"
                        >
                          <PlusIcon className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-body">
                        {(item.price * item.quantity).toLocaleString(locale)}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => cart.removeItem(item.productId, item.variantId)}
                    aria-label={t("remove")}
                    className="self-start text-muted-foreground hover:text-primary transition-colors"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="border-t border-border px-6 py-6">
            <div className="mb-1 flex items-center justify-between text-h3 text-base">
              <span>{t("subtotal")}</span>
              <span>{cart.subtotal.toLocaleString(locale)}</span>
            </div>
            <p className="text-caption mb-5">{t("shippingNote")}</p>
            <SheetClose
              nativeButton={false}
              render={
                <Link href="/checkout" className={buttonVariants({ className: "w-full" })}>
                  {t("checkout")}
                </Link>
              }
            />
          </div>
        </>
      )}
    </Sheet>
  );
}
