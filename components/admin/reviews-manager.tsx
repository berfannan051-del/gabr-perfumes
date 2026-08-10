"use client";

import { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTable, type DataTableColumn } from "@/components/admin/ui/data-table";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { useToast } from "@/components/admin/ui/toast";
import { StarIcon } from "@/components/ui/icons";
import { saveReview, deleteReview, toggleReviewActive } from "@/app/[locale]/admin/reviews/actions";
import { cn } from "@/lib/cn";

export type ReviewRow = {
  id: string;
  customerName: string;
  rating: number;
  textAr: string;
  textEn: string;
  customerImage: string | null;
  isActive: boolean;
};

type FormState = {
  id: string | null;
  customerName: string;
  rating: number;
  textAr: string;
  textEn: string;
  existingImage: string;
  isActive: boolean;
};

const emptyForm: FormState = {
  id: null,
  customerName: "",
  rating: 5,
  textAr: "",
  textEn: "",
  existingImage: "",
  isActive: true,
};

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={!onChange}
          onClick={() => onChange?.(n)}
          className={cn("text-primary", onChange && "cursor-pointer")}
        >
          <StarIcon filled={n <= value} className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
}

export function ReviewsManager({ reviews }: { reviews: ReviewRow[] }) {
  const t = useTranslations("Admin.reviews");
  const toast = useToast();
  const router = useRouter();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pending, startTransition] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<ReviewRow | null>(null);
  const [error, setError] = useState<string | null>(null);

  const imagePreview = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : form.existingImage),
    [imageFile, form.existingImage]
  );

  function edit(r: ReviewRow) {
    setForm({
      id: r.id,
      customerName: r.customerName,
      rating: r.rating,
      textAr: r.textAr,
      textEn: r.textEn,
      existingImage: r.customerImage ?? "",
      isActive: r.isActive,
    });
    setImageFile(null);
    setError(null);
  }

  function save() {
    setError(null);
    startTransition(async () => {
      const data = new FormData();
      data.set("customerName", form.customerName);
      data.set("rating", String(form.rating));
      data.set("textAr", form.textAr);
      data.set("textEn", form.textEn);
      data.set("existingImage", form.existingImage);
      data.set("isActive", String(form.isActive));
      if (imageFile) data.set("image", imageFile);

      const result = await saveReview(form.id, data);
      if ("error" in result) {
        setError(t("errorInvalid"));
        return;
      }
      toast.show(t("saved"));
      setForm(emptyForm);
      setImageFile(null);
      router.refresh();
    });
  }

  function remove(id: string) {
    startTransition(async () => {
      await deleteReview(id);
      toast.show(t("deleted"));
      router.refresh();
    });
  }

  function toggleActive(r: ReviewRow) {
    startTransition(async () => {
      await toggleReviewActive(r.id, !r.isActive);
      toast.show(r.isActive ? t("deactivated") : t("activated"));
      router.refresh();
    });
  }

  const columns: DataTableColumn<ReviewRow>[] = [
    {
      key: "customer",
      label: t("customerName"),
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-surface-muted">
            {r.customerImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.customerImage} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <div>
            <p className="text-body">{r.customerName}</p>
            <Stars value={r.rating} />
          </div>
        </div>
      ),
      sortValue: (r) => r.customerName,
    },
    {
      key: "text",
      label: t("textAr"),
      render: (r) => <p className="max-w-xs truncate text-caption text-muted-foreground">{r.textAr}</p>,
    },
    {
      key: "status",
      label: t("status"),
      render: (r) => (
        <button
          type="button"
          onClick={() => toggleActive(r)}
          disabled={pending}
          className={`border px-2 py-0.5 text-caption ${
            r.isActive ? "border-primary text-primary" : "border-border text-muted-foreground"
          }`}
        >
          {r.isActive ? t("active") : t("inactive")}
        </button>
      ),
      sortValue: (r) => (r.isActive ? 1 : 0),
    },
    {
      key: "actions",
      label: "",
      align: "end",
      render: (r) => (
        <div className="flex items-center justify-end gap-4">
          <button type="button" onClick={() => edit(r)} className="text-caption text-primary">
            {t("edit")}
          </button>
          <button type="button" onClick={() => setDeleteTarget(r)} className="text-caption text-primary-deep">
            {t("delete")}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_400px]">
      <div>
        <h1 className="text-h2 mb-6">{t("title")}</h1>
        <div className="border border-border bg-surface p-5">
          <DataTable
            rows={reviews}
            columns={columns}
            rowKey={(r) => r.id}
            searchText={(r) => `${r.customerName} ${r.textAr} ${r.textEn}`}
            searchPlaceholder={t("search")}
            emptyLabel={t("noResults")}
            pageSize={10}
          />
        </div>
      </div>

      <div className="flex h-fit flex-col gap-3 border border-border bg-surface p-6">
        <h2 className="text-h3 mb-2">{form.id ? t("edit") : t("new")}</h2>

        <Label htmlFor="r-name">{t("customerName")}</Label>
        <Input id="r-name" value={form.customerName} onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))} />

        <Label>{t("rating")}</Label>
        <Stars value={form.rating} onChange={(v) => setForm((f) => ({ ...f, rating: v }))} />

        <Label htmlFor="r-textAr">{t("textAr")}</Label>
        <Textarea id="r-textAr" rows={3} dir="rtl" value={form.textAr} onChange={(e) => setForm((f) => ({ ...f, textAr: e.target.value }))} />

        <Label htmlFor="r-textEn">{t("textEn")}</Label>
        <Textarea id="r-textEn" rows={3} dir="ltr" value={form.textEn} onChange={(e) => setForm((f) => ({ ...f, textEn: e.target.value }))} />

        <Label htmlFor="r-image">{t("image")}</Label>
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-surface-muted">
            {imagePreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={imagePreview} alt="" className="h-full w-full object-cover" />
            ) : null}
          </div>
          <input
            id="r-image"
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="text-caption file:me-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-background"
          />
        </div>

        <label className="mt-2 flex items-center gap-2 text-body">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
          />
          {t("active")}
        </label>

        {error && <p className="text-caption text-primary-deep">{error}</p>}

        <div className="mt-2 flex gap-3">
          <Button type="button" onClick={save} disabled={pending}>
            {pending ? t("saving") : t("save")}
          </Button>
          {form.id && (
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setForm(emptyForm);
                setImageFile(null);
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
