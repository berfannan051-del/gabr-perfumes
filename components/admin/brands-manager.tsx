"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { useToast } from "@/components/admin/ui/toast";
import { saveBrand, deleteBrand } from "@/app/[locale]/admin/brands/actions";
import { stripBackground } from "@/lib/admin/strip-background";
import type { Brand } from "@/types/catalog";

type FormState = {
  id: string | null;
  name: string;
  existingLogo: string;
};

const emptyForm: FormState = { id: null, name: "", existingLogo: "" };

export function BrandsManager({ brands }: { brands: Brand[] }) {
  const t = useTranslations("Admin.brands");
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [processingLogo, setProcessingLogo] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Brand | null>(null);
  const logoPreview = useMemo(
    () => (logoFile ? URL.createObjectURL(logoFile) : form.existingLogo),
    [logoFile, form.existingLogo]
  );

  function edit(b: Brand) {
    setForm({ id: b.id, name: b.name, existingLogo: b.logo ?? "" });
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
      data.set("name", form.name);
      data.set("existingLogo", form.existingLogo);
      if (logoFile) data.set("logo", logoFile);

      const result = await saveBrand(form.id, data);
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
      await deleteBrand(id);
      toast.show(t("deleted"));
      router.refresh();
    });
  }

  const columns: DataTableColumn<Brand>[] = [
    {
      key: "logo",
      label: t("logo"),
      render: (b) => (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full bg-surface-muted">
          {b.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={b.logo} alt="" className="h-full w-full object-cover" />
          ) : null}
        </div>
      ),
    },
    {
      key: "name",
      label: t("name"),
      render: (b) => b.name,
      sortValue: (b) => b.name,
    },
    {
      key: "actions",
      label: "",
      align: "end",
      render: (b) => (
        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={() => edit(b)} className="text-caption text-primary">
            {t("edit")}
          </button>
          <button type="button" onClick={() => setDeleteTarget(b)} className="text-caption text-primary-deep">
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
            rows={brands}
            columns={columns}
            rowKey={(b) => b.id}
            searchText={(b) => b.name}
            searchPlaceholder={t("search")}
            emptyLabel={t("noResults")}
            pageSize={10}
          />
        </div>
      </div>

      <div className="flex h-fit flex-col gap-3 border border-border bg-surface p-6">
        <h2 className="text-h3 mb-2">{form.id ? t("edit") : t("new")}</h2>

        <Label htmlFor="b-name">{t("name")}</Label>
        <Input id="b-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />

        <Label htmlFor="b-logo">{t("logo")}</Label>
        <div className="flex items-center gap-3">
          <div className="checkerboard-bg h-14 w-14 shrink-0 overflow-hidden rounded-full">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoPreview} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <input
            id="b-logo"
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
