"use client";

import { useTransition } from "react";
import { useRouter } from "@/i18n/navigation";
import { deleteProduct } from "@/app/[locale]/admin/products/actions";

export function DeleteProductButton({
  id,
  label,
  confirmMessage,
}: {
  id: string;
  label: string;
  confirmMessage: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          await deleteProduct(id);
          router.refresh();
        });
      }}
      className="text-caption text-primary-deep disabled:opacity-50"
    >
      {label}
    </button>
  );
}
