"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { useToast } from "@/components/admin/ui/toast";
import { updateOrderStatus } from "@/app/[locale]/admin/orders/actions";

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const t = useTranslations("Admin.orders");
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        const nextStatus = e.target.value;
        startTransition(async () => {
          const result = await updateOrderStatus(orderId, nextStatus);
          if ("error" in result) {
            toast.show(
              result.error === "insufficientStock" ? t("errorInsufficientStock") : t("errorNotFound"),
              "error"
            );
            return;
          }
          toast.show(result.restockedStock ? t("stockRestored") : t("statusUpdated"));
          router.refresh();
        });
      }}
      className="h-11 border border-border bg-surface px-3 text-body"
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {t(`status${s.charAt(0)}${s.slice(1).toLowerCase()}`)}
        </option>
      ))}
    </select>
  );
}
