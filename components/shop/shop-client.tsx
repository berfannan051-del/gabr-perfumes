"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { ProductCard } from "@/components/product/product-card";
import { Sheet, SheetClose, SheetTitle } from "@/components/ui/sheet";
import { CloseIcon, ChevronIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";
import type { Brand, BrandType, Collection, FragranceFamily, Gender, Locale, Product } from "@/types/catalog";

const genders: Gender[] = ["men", "women", "unisex"];
const families: FragranceFamily[] = ["oriental", "woody", "floral", "citrus", "amber", "musk"];
type Sort = "newest" | "priceAsc" | "priceDesc" | "nameAsc";

export function ShopClient({
  products,
  collections,
  brands,
  initialCollection,
  initialGender,
  initialBrand,
  initialBrandId,
}: {
  products: Product[];
  collections: Collection[];
  brands: Brand[];
  initialCollection?: string;
  initialGender?: Gender;
  initialBrand?: BrandType;
  initialBrandId?: string;
}) {
  const t = useTranslations("Shop");
  const tf = useTranslations("Families");
  const locale = useLocale() as Locale;

  const [gender, setGender] = useState<Gender | "all">(initialGender ?? "all");
  const [family, setFamily] = useState<FragranceFamily[]>([]);
  const [collection, setCollection] = useState<string | "all">(initialCollection ?? "all");
  const [brand, setBrand] = useState<BrandType | "all">(initialBrand ?? "all");
  const [brandId, setBrandId] = useState<string | "all">(initialBrandId ?? "all");
  const [brandPanelOpen, setBrandPanelOpen] = useState(Boolean(initialBrand));
  const [sort, setSort] = useState<Sort>("newest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (gender !== "all" && p.gender !== gender) return false;
      if (family.length > 0 && !family.includes(p.family)) return false;
      if (collection !== "all" && p.collectionSlug !== collection) return false;
      if (brand !== "all" && p.brandType !== brand) return false;
      if (brand === "OTHER" && brandId !== "all" && p.brand?.id !== brandId) return false;
      return true;
    });

    switch (sort) {
      case "priceAsc":
        list = [...list].sort((a, b) => a.variants[0].price - b.variants[0].price);
        break;
      case "priceDesc":
        list = [...list].sort((a, b) => b.variants[0].price - a.variants[0].price);
        break;
      case "nameAsc":
        list = [...list].sort((a, b) => a.name[locale].localeCompare(b.name[locale], locale));
        break;
      default:
        list = [...list].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }
    return list;
  }, [gender, family, collection, brand, brandId, sort, locale, products]);

  function toggleFamily(f: FragranceFamily) {
    setFamily((prev) => (prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]));
  }

  function resetFilters() {
    setGender("all");
    setFamily([]);
    setCollection("all");
    setBrand("all");
    setBrandId("all");
  }

  function selectBrandType(next: BrandType | "all") {
    setBrand(next);
    setBrandId("all");
  }

  const activeBrandLabel =
    brand === "all"
      ? t("filters.brandOptions.all")
      : brand === "GABR"
        ? t("filters.brandOptions.gabr")
        : brandId !== "all"
          ? (brands.find((b) => b.id === brandId)?.name ?? t("filters.brandOptions.other"))
          : t("filters.brandOptions.other");

  const filterPanel = (
    <div className="flex flex-col gap-8">
      <div>
        <button
          type="button"
          onClick={() => setBrandPanelOpen((v) => !v)}
          className="flex w-full items-center justify-between border border-border bg-surface px-4 py-3 text-start transition-colors hover:border-primary"
        >
          <span>
            <span className="text-label block text-muted-foreground">{t("filters.brand")}</span>
            <span className="text-body mt-0.5 block">{activeBrandLabel}</span>
          </span>
          <ChevronIcon className={cn("h-4 w-4 shrink-0 transition-transform duration-300", brandPanelOpen && "rotate-180")} />
        </button>

        <AnimatePresence initial={false}>
          {brandPanelOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div className="mt-3 grid grid-cols-3 gap-3 border border-border bg-surface p-3">
                <BrandTile
                  active={brand === "all"}
                  onClick={() => selectBrandType("all")}
                  label={t("filters.brandOptions.all")}
                />
                <BrandTile
                  active={brand === "GABR"}
                  onClick={() => selectBrandType("GABR")}
                  label={t("filters.brandOptions.gabr")}
                  logo="/brand/logo.png"
                />
                {brands.map((b) => (
                  <BrandTile
                    key={b.id}
                    active={brand === "OTHER" && brandId === b.id}
                    onClick={() => {
                      setBrand("OTHER");
                      setBrandId(b.id);
                    }}
                    label={b.name}
                    logo={b.logo}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div>
        <h3 className="text-label mb-4">{t("filters.gender")}</h3>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={gender === "all"} onClick={() => setGender("all")}>
            {t("filters.genderOptions.all")}
          </FilterChip>
          {genders.map((g) => (
            <FilterChip key={g} active={gender === g} onClick={() => setGender(g)}>
              {t(`filters.genderOptions.${g}`)}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-label mb-4">{t("filters.family")}</h3>
        <div className="flex flex-wrap gap-2">
          {families.map((f) => (
            <FilterChip key={f} active={family.includes(f)} onClick={() => toggleFamily(f)}>
              {tf(f)}
            </FilterChip>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-label mb-4">{t("filters.category")}</h3>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 text-body">
            <input
              type="radio"
              name="collection"
              checked={collection === "all"}
              onChange={() => setCollection("all")}
              className="accent-[var(--color-primary)]"
            />
            {t("filters.genderOptions.all")}
          </label>
          {collections.map((c) => (
            <label key={c.id} className="flex items-center gap-2.5 text-body">
              <input
                type="radio"
                name="collection"
                checked={collection === c.slug}
                onChange={() => setCollection(c.slug)}
                className="accent-[var(--color-primary)]"
              />
              {c.name[locale]}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={resetFilters}
        className="text-label self-start border-b border-primary pb-0.5 text-primary transition-opacity hover:opacity-70"
      >
        {t("filters.clear")}
      </button>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 md:px-10">
      <div className="mb-10 flex flex-col items-center gap-3 text-center">
        <span className="text-label text-primary">GABR</span>
        <h1 className="text-h1">{t("title")}</h1>
      </div>

      <div className="mb-8 flex items-center justify-between border-b border-border pb-5">
        <button
          type="button"
          onClick={() => setMobileFiltersOpen(true)}
          className="text-label lg:hidden"
        >
          {t("filters.title")}
        </button>
        <p className="text-caption hidden lg:block">
          {t("resultsCount", { count: filtered.length })}
        </p>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className="text-label border border-border bg-surface px-3 py-2"
        >
          <option value="newest">{t("sort.newest")}</option>
          <option value="priceAsc">{t("sort.priceAsc")}</option>
          <option value="priceDesc">{t("sort.priceDesc")}</option>
          <option value="nameAsc">{t("sort.nameAsc")}</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">{filterPanel}</aside>

        <div>
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-24 text-center">
              <p className="text-h3">{t("empty")}</p>
              <button
                type="button"
                onClick={resetFilters}
                className="text-label border-b border-primary pb-0.5 text-primary"
              >
                {t("resetFilters")}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-3">
              {filtered.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: (i % 6) * 0.06 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <SheetTitle className="text-h3">{t("filters.title")}</SheetTitle>
          <SheetClose aria-label="close">
            <CloseIcon className="h-5 w-5" />
          </SheetClose>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6">{filterPanel}</div>
      </Sheet>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`border px-3.5 py-2 text-caption transition-colors ${
        active ? "border-primary bg-primary text-background" : "border-border hover:border-primary"
      }`}
    >
      {children}
    </button>
  );
}

function BrandTile({
  active,
  onClick,
  label,
  logo,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  logo?: string | null;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-2 border p-3 text-center transition-all duration-300",
        active ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:border-primary/60"
      )}
    >
      <span
        className={cn(
          "grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border bg-surface-muted transition-colors",
          active ? "border-primary" : "border-border"
        )}
      >
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt="" className="h-full w-full object-cover" />
        ) : (
          <span className="text-h3 text-muted-foreground">{label.charAt(0)}</span>
        )}
      </span>
      <span className={cn("text-caption line-clamp-1", active ? "text-primary" : "text-foreground")}>{label}</span>
    </button>
  );
}
