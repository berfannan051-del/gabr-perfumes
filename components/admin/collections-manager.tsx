"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { upsertCollection, deleteCollection } from "@/app/[locale]/admin/collections/actions";
import type { Collection } from "@/types/catalog";

type FormState = {
  id: string | null;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
};

const emptyForm: FormState = {
  id: null,
  slug: "",
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  image: "",
};

export function CollectionsManager({ collections }: { collections: Collection[] }) {
  const t = useTranslations("Admin.collections");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [pending, startTransition] = useTransition();

  function edit(c: Collection) {
    setForm({
      id: c.id,
      slug: c.slug,
      nameAr: c.name.ar,
      nameEn: c.name.en,
      descriptionAr: c.description.ar,
      descriptionEn: c.description.en,
      image: c.image,
    });
  }

  function save() {
    startTransition(async () => {
      await upsertCollection(form.id, {
        slug: form.slug,
        nameAr: form.nameAr,
        nameEn: form.nameEn,
        descriptionAr: form.descriptionAr,
        descriptionEn: form.descriptionEn,
        image: form.image,
      });
      setForm(emptyForm);
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await deleteCollection(id);
    });
  }

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-h2 mb-6">{t("title")}</h1>
        <table className="w-full border-collapse text-start">
          <tbody>
            {collections.map((c) => (
              <tr key={c.id} className="border-b border-border">
                <td className="py-3 text-body">{c.name.ar}</td>
                <td className="py-3 text-caption text-muted-foreground">{c.slug}</td>
                <td className="py-3 text-end">
                  <button type="button" onClick={() => edit(c)} className="text-caption text-primary me-4">
                    ✎
                  </button>
                  <button type="button" onClick={() => remove(c.id)} className="text-caption text-primary-deep">
                    ×
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-3 border border-border p-6">
        <h2 className="text-h3 mb-2">{form.id ? t("save") : t("new")}</h2>
        <Label htmlFor="c-slug">Slug</Label>
        <Input id="c-slug" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
        <Label htmlFor="c-nameAr">{t("name")} (AR)</Label>
        <Input id="c-nameAr" value={form.nameAr} onChange={(e) => setForm((f) => ({ ...f, nameAr: e.target.value }))} />
        <Label htmlFor="c-nameEn">{t("name")} (EN)</Label>
        <Input id="c-nameEn" value={form.nameEn} onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))} />
        <Label htmlFor="c-descAr">{t("descriptionAr")}</Label>
        <Textarea id="c-descAr" rows={2} value={form.descriptionAr} onChange={(e) => setForm((f) => ({ ...f, descriptionAr: e.target.value }))} />
        <Label htmlFor="c-descEn">{t("descriptionEn")}</Label>
        <Textarea id="c-descEn" rows={2} value={form.descriptionEn} onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))} />
        <Label htmlFor="c-image">{t("image")}</Label>
        <Input id="c-image" value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} />
        <div className="mt-2 flex gap-3">
          <Button type="button" onClick={save} disabled={pending}>
            {t("save")}
          </Button>
          {form.id && (
            <Button type="button" variant="outline" onClick={() => setForm(emptyForm)}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
