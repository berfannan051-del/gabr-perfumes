"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { useToast } from "@/components/admin/ui/toast";
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
  const toast = useToast();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);

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
      toast.show(t("saved"));
      setForm(emptyForm);
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await deleteCollection(id);
      toast.show(t("deleted"));
    });
  }

  const columns: DataTableColumn<Collection>[] = [
    {
      key: "name",
      label: t("name"),
      render: (c) => (
        <div>
          <p className="text-body">{c.name.ar}</p>
          <p className="text-caption text-muted-foreground">{c.slug}</p>
        </div>
      ),
      sortValue: (c) => c.name.ar,
    },
    {
      key: "actions",
      label: "",
      align: "end",
      render: (c) => (
        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={() => edit(c)} className="text-caption text-primary">
            {t("save")}
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(c)}
            className="text-caption text-primary-deep"
          >
            {t("delete")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      <div>
        <h1 className="text-h2 mb-6">{t("title")}</h1>
        <div className="border border-border bg-surface p-5">
          <DataTable
            rows={collections}
            columns={columns}
            rowKey={(c) => c.id}
            searchText={(c) => `${c.name.ar} ${c.name.en} ${c.slug}`}
            searchPlaceholder={t("search")}
            emptyLabel={t("noResults")}
            pageSize={10}
          />
        </div>
      </div>

      <div className="flex h-fit flex-col gap-3 border border-border bg-surface p-6">
        <h2 className="text-h3 mb-2">{form.id ? t("save") : t("new")}</h2>
        <Label htmlFor="c-slug">{t("slug")}</Label>
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
              {t("cancel")}
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={t("deleteTitle")}
        description={t("confirmDelete")}
        confirmLabel={t("delete")}
        cancelLabel={t("cancel")}
        onConfirm={() => {
          if (deleteTarget) remove(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
