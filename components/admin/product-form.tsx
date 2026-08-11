"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveProduct } from "@/app/[locale]/admin/products/actions";

type NoteOption = { id: string; nameAr: string; nameEn: string };
type CollectionOption = { id: string; nameAr: string };
type BrandOption = { id: string; name: string };

type VariantRow = { id?: string; sizeMl: number; price: number; stockQuantity: number; sku: string };

type ProductFormData = {
  id: string;
  slug: string;
  nameAr: string;
  nameEn: string;
  shortDescriptionAr: string;
  shortDescriptionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  gender: "MEN" | "WOMEN" | "UNISEX";
  family: "ORIENTAL" | "WOODY" | "FLORAL" | "CITRUS" | "AMBER" | "MUSK";
  collectionId: string;
  concentrationAr: string;
  concentrationEn: string;
  bottleShape: "TALL" | "ROUND" | "FACETED";
  heroColor: string;
  images: string[];
  isBestseller: boolean;
  isNew: boolean;
  brandType: "GABR" | "OTHER";
  brandId: string;
  variants: VariantRow[];
  notesByLayer: { top: string[]; heart: string[]; base: string[] };
};

const genders = ["MEN", "WOMEN", "UNISEX"] as const;
const families = ["ORIENTAL", "WOODY", "FLORAL", "CITRUS", "AMBER", "MUSK"] as const;
const shapes = ["TALL", "ROUND", "FACETED"] as const;
const layers = ["top", "heart", "base"] as const;

const emptyProduct: ProductFormData = {
  id: "",
  slug: "",
  nameAr: "",
  nameEn: "",
  shortDescriptionAr: "",
  shortDescriptionEn: "",
  descriptionAr: "",
  descriptionEn: "",
  gender: "UNISEX",
  family: "ORIENTAL",
  collectionId: "",
  concentrationAr: "",
  concentrationEn: "",
  bottleShape: "TALL",
  heroColor: "#a9812e",
  images: [],
  isBestseller: false,
  isNew: false,
  brandType: "GABR",
  brandId: "",
  variants: [],
  notesByLayer: { top: [], heart: [], base: [] },
};

export function ProductForm({
  collections,
  notes,
  brands,
  product,
}: {
  collections: CollectionOption[];
  notes: NoteOption[];
  brands: BrandOption[];
  product?: ProductFormData;
}) {
  const t = useTranslations("Admin.products");
  const router = useRouter();
  const [form, setForm] = useState<ProductFormData>(
    product ?? { ...emptyProduct, collectionId: collections[0]?.id ?? "" }
  );
  const [newImages, setNewImages] = useState<File[]>([]);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(product));

  function set<K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function slugify(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function setNameEn(value: string) {
    setForm((f) => ({
      ...f,
      nameEn: value,
      slug: slugTouched ? f.slug : slugify(value),
    }));
  }

  function addVariant() {
    set("variants", [...form.variants, { sizeMl: 50, price: 0, stockQuantity: 0, sku: "" }]);
  }

  function updateVariant(index: number, patch: Partial<VariantRow>) {
    const next = form.variants.map((v, i) => (i === index ? { ...v, ...patch } : v));
    set("variants", next);
  }

  function removeVariant(index: number) {
    set("variants", form.variants.filter((_, i) => i !== index));
  }

  function toggleNote(layer: (typeof layers)[number], noteId: string) {
    const current = form.notesByLayer[layer];
    const next = current.includes(noteId) ? current.filter((n) => n !== noteId) : [...current, noteId];
    set("notesByLayer", { ...form.notesByLayer, [layer]: next });
  }

  function removeExistingImage(url: string) {
    set("images", form.images.filter((i) => i !== url));
  }

  function submit() {
    setError(null);
    startTransition(async () => {
      const data = new FormData();
      data.set("slug", form.slug);
      data.set("nameAr", form.nameAr);
      data.set("nameEn", form.nameEn);
      data.set("shortDescriptionAr", form.shortDescriptionAr);
      data.set("shortDescriptionEn", form.shortDescriptionEn);
      data.set("descriptionAr", form.descriptionAr);
      data.set("descriptionEn", form.descriptionEn);
      data.set("gender", form.gender);
      data.set("family", form.family);
      data.set("collectionId", form.collectionId);
      data.set("concentrationAr", form.concentrationAr);
      data.set("concentrationEn", form.concentrationEn);
      data.set("bottleShape", form.bottleShape);
      data.set("heroColor", form.heroColor);
      data.set("isBestseller", String(form.isBestseller));
      data.set("isNew", String(form.isNew));
      data.set("brandType", form.brandType);
      data.set("brandId", form.brandId);
      data.set("variants", JSON.stringify(form.variants));
      data.set("notes", JSON.stringify(form.notesByLayer));
      data.set("existingImages", JSON.stringify(form.images));
      for (const file of newImages) data.append("images", file);

      const result = await saveProduct(product?.id ?? null, data);
      if ("error" in result) {
        setError(result.error === "noVariants" ? t("errorNoVariants") : t("errorInvalid"));
        return;
      }
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="slug">{t("slug")}</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              set("slug", e.target.value);
            }}
            dir="ltr"
            className="mt-2"
          />
          <p className="text-caption mt-1 text-muted-foreground" dir="ltr">
            /shop/{form.slug || "..."}
          </p>
        </div>
        <div>
          <Label htmlFor="heroColor">{t("heroColor")}</Label>
          <Input id="heroColor" type="color" value={form.heroColor} onChange={(e) => set("heroColor", e.target.value)} className="mt-2 h-12" />
        </div>
        <div>
          <Label htmlFor="nameAr">{t("nameAr")}</Label>
          <Input id="nameAr" value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="nameEn">{t("nameEn")}</Label>
          <Input id="nameEn" value={form.nameEn} onChange={(e) => setNameEn(e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="shortAr">{t("shortDescriptionAr")}</Label>
          <Input id="shortAr" value={form.shortDescriptionAr} onChange={(e) => set("shortDescriptionAr", e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="shortEn">{t("shortDescriptionEn")}</Label>
          <Input id="shortEn" value={form.shortDescriptionEn} onChange={(e) => set("shortDescriptionEn", e.target.value)} className="mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="descAr">{t("descriptionAr")}</Label>
          <Textarea id="descAr" rows={4} value={form.descriptionAr} onChange={(e) => set("descriptionAr", e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="descEn">{t("descriptionEn")}</Label>
          <Textarea id="descEn" rows={4} value={form.descriptionEn} onChange={(e) => set("descriptionEn", e.target.value)} className="mt-2" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div>
          <Label htmlFor="gender">{t("gender")}</Label>
          <select id="gender" value={form.gender} onChange={(e) => set("gender", e.target.value as ProductFormData["gender"])} className="mt-2 h-12 w-full border border-border bg-surface px-3">
            {genders.map((g) => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="family">{t("family")}</Label>
          <select id="family" value={form.family} onChange={(e) => set("family", e.target.value as ProductFormData["family"])} className="mt-2 h-12 w-full border border-border bg-surface px-3">
            {families.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="collectionId">{t("collection")}</Label>
          <select id="collectionId" value={form.collectionId} onChange={(e) => set("collectionId", e.target.value)} className="mt-2 h-12 w-full border border-border bg-surface px-3">
            {collections.map((c) => <option key={c.id} value={c.id}>{c.nameAr}</option>)}
          </select>
        </div>
        <div>
          <Label htmlFor="bottleShape">{t("bottleShape")}</Label>
          <select id="bottleShape" value={form.bottleShape} onChange={(e) => set("bottleShape", e.target.value as ProductFormData["bottleShape"])} className="mt-2 h-12 w-full border border-border bg-surface px-3">
            {shapes.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="concAr">{t("concentrationAr")}</Label>
          <Input id="concAr" value={form.concentrationAr} onChange={(e) => set("concentrationAr", e.target.value)} className="mt-2" />
        </div>
        <div>
          <Label htmlFor="concEn">{t("concentrationEn")}</Label>
          <Input id="concEn" value={form.concentrationEn} onChange={(e) => set("concentrationEn", e.target.value)} className="mt-2" />
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2 text-body">
          <input type="checkbox" checked={form.isBestseller} onChange={(e) => set("isBestseller", e.target.checked)} />
          {t("isBestseller")}
        </label>
        <label className="flex items-center gap-2 text-body">
          <input type="checkbox" checked={form.isNew} onChange={(e) => set("isNew", e.target.checked)} />
          {t("isNew")}
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="brandType">{t("brand")}</Label>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => set("brandType", "GABR")}
              className={`flex-1 border px-4 py-3 text-body transition-colors ${
                form.brandType === "GABR" ? "border-primary bg-primary text-background" : "border-border"
              }`}
            >
              {t("brandGabr")}
            </button>
            <button
              type="button"
              onClick={() => set("brandType", "OTHER")}
              className={`flex-1 border px-4 py-3 text-body transition-colors ${
                form.brandType === "OTHER" ? "border-primary bg-primary text-background" : "border-border"
              }`}
            >
              {t("brandOther")}
            </button>
          </div>
        </div>
        {form.brandType === "OTHER" && (
          <div>
            <Label htmlFor="brandId">{t("brand")}</Label>
            {brands.length > 0 ? (
              <select
                id="brandId"
                value={form.brandId}
                onChange={(e) => set("brandId", e.target.value)}
                className="mt-2 h-12 w-full border border-border bg-surface px-3"
              >
                <option value="">{t("selectBrand")}</option>
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-caption mt-2 text-muted-foreground">
                {t("noBrandsYet")}{" "}
                <Link href="/admin/brands" className="text-primary underline-offset-4 hover:underline">
                  {t("addBrandLink")}
                </Link>
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <Label>{t("images")}</Label>
        <div className="mt-2 flex flex-wrap gap-3">
          {form.images.map((url) => (
            <div key={url} className="relative h-20 w-20 border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button type="button" onClick={() => removeExistingImage(url)} className="absolute -end-2 -top-2 h-5 w-5 bg-primary-deep text-background">×</button>
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp"
          onChange={(e) => setNewImages(Array.from(e.target.files ?? []))}
          className="mt-3 text-caption file:me-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-background"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label>{t("variants")}</Label>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>{t("addVariant")}</Button>
        </div>
        <div className="flex flex-col gap-3">
          {form.variants.map((v, i) => (
            <div key={i} className="grid grid-cols-2 gap-3 border border-border p-3 sm:grid-cols-5 sm:items-end">
              <div>
                <Label>{t("sizeMl")}</Label>
                <Input type="number" value={v.sizeMl} onChange={(e) => updateVariant(i, { sizeMl: Number(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <Label>{t("price")}</Label>
                <Input type="number" value={v.price} onChange={(e) => updateVariant(i, { price: Number(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <Label>{t("stock")}</Label>
                <Input type="number" value={v.stockQuantity} onChange={(e) => updateVariant(i, { stockQuantity: Number(e.target.value) })} className="mt-1" />
              </div>
              <div>
                <Label>{t("sku")}</Label>
                <Input value={v.sku} onChange={(e) => updateVariant(i, { sku: e.target.value })} className="mt-1" />
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={() => removeVariant(i)}>×</Button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label className="mb-3 block">{t("notes")}</Label>
        {layers.map((layer) => (
          <div key={layer} className="mb-4">
            <p className="text-caption mb-2 text-muted-foreground">
              {layer === "top" ? t("notesTop") : layer === "heart" ? t("notesHeart") : t("notesBase")}
            </p>
            <div className="flex flex-wrap gap-2">
              {notes.map((n) => (
                <button
                  key={n.id}
                  type="button"
                  onClick={() => toggleNote(layer, n.id)}
                  className={`border px-3 py-1.5 text-caption transition-colors ${
                    form.notesByLayer[layer].includes(n.id) ? "border-primary bg-primary text-background" : "border-border"
                  }`}
                >
                  {n.nameAr}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-caption text-primary-deep">{error}</p>}

      <Button type="button" onClick={submit} disabled={pending} className="w-fit">
        {pending ? t("saving") : t("save")}
      </Button>
    </div>
  );
}
