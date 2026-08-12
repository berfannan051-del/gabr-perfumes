"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { useToast } from "@/components/admin/ui/toast";
import { stripBackground } from "@/lib/admin/strip-background";
import { upsertCollection, deleteCollection } from "@/app/[locale]/admin/collections/actions";
import type { Collection } from "@/types/catalog";

type FormState = {
  id: string | null;
  slug: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  existingImage: string;
};

const emptyForm: FormState = {
  id: null,
  slug: "",
  nameAr: "",
  nameEn: "",
  descriptionAr: "",
  descriptionEn: "",
  existingImage: "",
};

export function CollectionsManager({ collections }: { collections: Collection[] }) {
  const t = useTranslations("Admin.collections");
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [processingLogo, setProcessingLogo] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Collection | null>(null);

  const logoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : form.existingImage),
    [logoFile, form.existingImage]
  );

  function edit(c: Collection) {
    setForm({
      id: c.id,
      slug: c.slug,
      nameAr: c.name.ar,
      nameEn: c.name.en,
      descriptionAr: c.description.ar,
      descriptionEn: c.description.en,
      existingImage: c.image,
    });
    setLogoFile(null);
    setError(null);
  }

  async function handleLogoFile(file: File) {
    setProcessingLogo(true);
    setLogoFile(await stripBackground(file));
    setProcessingLogo(false);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const data = new FormData();
      data.set("slug", form.slug);
      data.set("nameAr", form.nameAr);
      data.set("nameEn", form.nameEn);
      data.set("descriptionAr", form.descriptionAr);
      data.set("descriptionEn", form.descriptionEn);
      data.set("existingImage", form.existingImage);
      if (logoFile) data.set("image", logoFile);

      const result = await upsertCollection(form.id, data);
      if ("error" in result) {
        setError(t("errorInvalid"));
        return;
      }
      toast.show(t("saved"));
      setForm(emptyForm);
      setLogoFile(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      const result = await deleteCollection(id);
      if ("error" in result) {
        toast.show(t("errorHasProducts"));
        return;
      }
      toast.show(t("deleted"));
      router.refresh();
    });
  }

  const columns: DataTableColumn<Collection>[] = [
    {
      key: "logo",
      label: t("image"),
      render: (c) => (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-muted">
          {c.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={c.image} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
      ),
    },
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
            {t("edit")}
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
        <h2 className="text-h3 mb-2">{form.id ? t("edit") : t("new")}</h2>
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
        <div className="flex items-center gap-3">
          <div className="checkerboard-bg h-14 w-14 shrink-0 overflow-hidden rounded-full border border-border">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <input
            id="c-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            disabled={processingLogo}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleLogoFile(file);
            }}
            className="text-caption file:me-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-background disabled:opacity-50"
          />
        </div>
        {processingLogo && <p className="text-caption text-muted-foreground">{t("processingImage")}</p>}

        {error && <p className="text-caption text-primary-deep">{error}</p>}

        <div className="mt-2 flex gap-3">
          <Button type="button" onClick={save} disabled={pending || processingLogo}>
            {pending ? t("saving") : t("save")}
          </Button>
          {form.id && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setForm(emptyForm);
                setLogoFile(null);
                setError(null);
              }}
            >
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
