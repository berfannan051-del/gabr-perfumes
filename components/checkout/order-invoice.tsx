"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { DiamondDivider } from "@/components/brand/diamond-divider";
import type { Locale, LocalizedText } from "@/types/catalog";

export type InvoiceItem = {
  name: LocalizedText;
  sizeMl: number;
  quantity: number;
  price: number;
};

export function OrderInvoice({
  orderNumber,
  fullName,
  phone,
  email,
  address,
  governorateLabel,
  items,
  subtotal,
  shippingCost,
  total,
  paymentMethodLabel,
}: {
  orderNumber: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  governorateLabel: string;
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  paymentMethodLabel: string;
}) {
  const t = useTranslations("Checkout.invoice");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;
  const date = new Date().toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto w-full max-w-2xl overflow-hidden border border-primary/30 bg-surface shadow-lifted"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,color-mix(in_srgb,var(--color-primary)_10%,transparent),transparent_55%)]" />

      <div className="relative flex flex-col items-center border-b border-border px-8 py-8 text-center md:px-10">
        <Image
          src="/brand/logo.png"
          alt="GABR Perfumes"
          width={112}
          height={112}
          priority
          className="h-24 w-24 object-contain md:h-28 md:w-28"
        />
        <span className="text-label mt-5 text-primary">{t("title")}</span>
        <p className="text-h3 mt-1 text-base">{orderNumber}</p>
        <p className="text-caption mt-0.5 text-muted-foreground">{date}</p>
      </div>

      <div className="relative px-8 py-8 md:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <span className="text-label text-primary">{t("billTo")}</span>
            <p className="text-body mt-2">{fullName}</p>
            <p className="text-caption mt-0.5" dir="ltr">
              {phone}
            </p>
            <p className="text-caption mt-0.5">{email}</p>
          </div>
          <div className="sm:text-end">
            <span className="text-label text-primary">{t("shipTo")}</span>
            <p className="text-body mt-2">{address}</p>
            <p className="text-caption mt-0.5">{governorateLabel}</p>
          </div>
        </div>

        <DiamondDivider className="my-7" />

        <table className="w-full border-collapse text-start">
          <thead>
            <tr className="border-b border-border">
              <th className="pb-3 text-start text-label font-normal text-muted-foreground">{t("item")}</th>
              <th className="pb-3 text-center text-label font-normal text-muted-foreground">{t("qty")}</th>
              <th className="pb-3 text-end text-label font-normal text-muted-foreground">{t("price")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={i} className="border-b border-border">
                <td className="py-3 text-body">
                  {item.name[locale]} <span className="text-caption text-muted-foreground">— {item.sizeMl}ml</span>
                </td>
                <td className="py-3 text-center text-body">{item.quantity}</td>
                <td className="py-3 text-end text-body">
                  {(item.price * item.quantity).toLocaleString(locale)} {tc("currency")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 flex flex-col items-end gap-2">
          <div className="flex w-full max-w-56 items-center justify-between text-caption text-muted-foreground">
            <span>{tc("subtotal")}</span>
            <span>
              {subtotal.toLocaleString(locale)} {tc("currency")}
            </span>
          </div>
          <div className="flex w-full max-w-56 items-center justify-between text-caption text-muted-foreground">
            <span>{t("shipping")}</span>
            <span>
              {shippingCost > 0 ? `${shippingCost.toLocaleString(locale)} ${tc("currency")}` : t("free")}
            </span>
          </div>
          <div className="mt-1 flex w-full max-w-56 items-center justify-between border-t border-primary/30 pt-2">
            <span className="text-h3 text-base">{tc("total")}</span>
            <span className="text-h3 text-base text-primary-deep">
              {total.toLocaleString(locale)} {tc("currency")}
            </span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-border pt-5">
          <span className="text-caption text-muted-foreground">{t("paymentMethod")}</span>
          <span className="text-caption">{paymentMethodLabel}</span>
        </div>
      </div>
    </motion.div>
  );
}
