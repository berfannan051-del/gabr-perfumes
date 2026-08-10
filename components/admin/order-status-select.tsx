"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { updateOrderStatus } from "@/app/[locale]/admin/orders/actions";

const statuses = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

export function OrderStatusSelect({ orderId, status }: { orderId: string; status: string }) {
  const t = useTranslations("Admin.orders");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <select
      value={status}
      disabled={pending}
      onChange={(e) => {
        startTransition(async () => {
          await updateOrderStatus(orderId, e.target.value);
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
