"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteProduct } from "@/app/[locale]/admin/products/actions";
import { ConfirmDialog } from "@/components/admin/ui/confirm-dialog";
import { useToast } from "@/components/admin/ui/toast";

export function DeleteProductButton({
  id,
  label,
  confirmMessage,
}: {
  id: string;
  label: string;
  confirmMessage: string;
}) {
  const t = useTranslations("Admin.products");
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen(true)}
        className="text-caption text-primary-deep disabled:opacity-50"
      >
        {label}
      </button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={t("deleteTitle")}
        description={confirmMessage}
        confirmLabel={label}
        cancelLabel={t("cancel")}
        onConfirm={() => {
          startTransition(async () => {
            await deleteProduct(id);
            toast.show(t("deleted"));
            router.refresh();
          });
        }}
      />
    </>
  );
}
