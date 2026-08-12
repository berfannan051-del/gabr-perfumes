"use client";

import { useMemo, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BottleArt } from "@/components/product/bottle-art";
import { SearchIcon, CloseIcon } from "@/components/ui/icons";
import type { Locale, Product } from "@/types/catalog";

export function SearchOverlay({
  open,
  onOpenChange,
  products,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  products: Product[];
}) {
  const t = useTranslations("Search");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => {
        const name = p.name[locale].toLowerCase();
        const notes = [...p.notes.top, ...p.notes.heart, ...p.notes.base]
          .map((n) => n.name[locale].toLowerCase())
          .join(" ");
        return name.includes(q) || notes.includes(q) || p.family.includes(q);
      })
      .slice(0, 6);
  }, [query, locale, products]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          initialFocus={false}
          className="fixed inset-x-0 top-0 z-50 max-h-[85vh] overflow-y-auto bg-surface shadow-lifted transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] data-ending-style:-translate-y-4 data-ending-style:opacity-0 data-starting-style:-translate-y-4 data-starting-style:opacity-0"
        >
          <Dialog.Title className="sr-only">{t("placeholder")}</Dialog.Title>
          <div className="mx-auto max-w-3xl px-5 py-8 md:px-10 md:py-12">
            <div className="flex items-center gap-4 border-b border-border pb-4">
              <SearchIcon className="h-5 w-5 shrink-0 text-muted-foreground" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("placeholder")}
                className="text-h3 w-full bg-transparent placeholder:text-muted-foreground focus:outline-none"
              />
              <Dialog.Close aria-label="close" className="shrink-0 hover:text-primary transition-colors">
                <CloseIcon className="h-5 w-5" />
              </Dialog.Close>
            </div>

            <div className="mt-8">
              {query.trim() && results.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-h3">
                    {t("noResults")} “{query}”
                  </p>
                  <p className="text-caption mt-2">{t("noResultsHint")}</p>
                </div>
              )}

              {results.length > 0 && (
                <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                  {results.map((p) => (
                    <Dialog.Close
                      key={p.id}
                      nativeButton={false}
                      render={
                        <Link href={`/shop/${p.slug}`} className="group text-start">
                          <div className="relative mb-3 aspect-[2/3] overflow-hidden bg-surface-muted">
                            {p.images[0] ? (
                              <Image
                                src={p.images[0]}
                                alt={p.name[locale]}
                                fill
                                sizes="(min-width: 640px) 30vw, 45vw"
                                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <BottleArt
                                shape={p.bottleShape}
                                liquidColor={p.heroColor}
                                className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                          </div>
                          <p className="text-body">{p.name[locale]}</p>
                          <p className="text-caption">
                            {p.variants[0].price.toLocaleString(locale)} {tc("currency")}
                          </p>
                        </Link>
                      }
                    />
                  ))}
                </div>
              )}

              {!query.trim() && (
                <div>
                  <p className="text-label mb-4 text-muted-foreground">{t("suggestions")}</p>
                  <div className="flex flex-wrap gap-2">
                    {["oud", "rose", "amber", "musk", "vetiver"].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuery(s)}
                        className="border border-border px-4 py-2 text-caption hover:border-primary hover:text-primary transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
