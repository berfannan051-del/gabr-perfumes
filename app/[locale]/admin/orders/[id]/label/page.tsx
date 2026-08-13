import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { PrintButton } from "@/components/admin/print-button";
import { PAYMENT_LABEL_KEY } from "@/lib/data/order-payment-label";
import { governorateLabel } from "@/lib/data/governorates";
import type { Locale } from "@/types/catalog";

export default async function OrderLabelPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations("Admin.orders");
  const tl = await getTranslations("Admin.orders.label");

  const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  const isCod = order.paymentMethod === "CASH_ON_DELIVERY";

  return (
    <div className="mx-auto max-w-2xl p-8 print:p-0">
      <div className="mb-6 flex items-center justify-between print:hidden">
        <h1 className="text-h2">{tl("title")}</h1>
        <PrintButton label={tl("print")} />
      </div>

      <div className="border-2 border-foreground p-8 text-foreground print:border-black print:text-black">
        <div className="mb-6 flex items-center justify-between border-b-2 border-foreground pb-4 print:border-black">
          <span
            className="text-2xl text-primary print:text-black"
            style={{ fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.08em" }}
          >
            GABR
          </span>
          <div className="text-end">
            <p className="text-label text-muted-foreground print:text-black">{tl("orderNumber")}</p>
            <p className="text-h3 text-base">{order.orderNumber}</p>
          </div>
        </div>

        <p className="text-caption mb-6 text-muted-foreground print:text-black">
          {tl("date")}: {order.createdAt.toLocaleDateString(locale)}
        </p>

        <div className="mb-6">
          <p className="text-label mb-1 text-muted-foreground print:text-black">{tl("shipTo")}</p>
          <p className="text-h3 text-base">{order.fullName}</p>
          <p className="text-body mt-1" dir="ltr">
            {tl("phone")}: {order.phone}
          </p>
          <p className="text-body mt-1">
            {tl("address")}: {order.address}, {order.city ? `${order.city}, ` : ""}
            {governorateLabel(order.governorate, l)}
          </p>
        </div>

        <div className="mb-6">
          <p className="text-label mb-2 text-muted-foreground print:text-black">{tl("items")}</p>
          <table className="w-full border-collapse text-start">
            <thead>
              <tr className="border-b border-border text-caption print:border-black">
                <th className="py-2 text-start font-normal">{t("items")}</th>
                <th className="py-2 text-end font-normal">{tl("qty")}</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-border print:border-black">
                  <td className="py-2 text-body">
                    {l === "ar" ? item.nameAr : item.nameEn} — {item.sizeMl}ml
                  </td>
                  <td className="py-2 text-end text-body">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 flex flex-col items-end gap-1">
            <p className="text-caption text-muted-foreground print:text-black">
              {t("shippingCost")}: {Number(order.shippingCost).toLocaleString(locale)} EGP
            </p>
            <p className="text-h3 text-base">
              {tl("total")}: {(Number(order.subtotal) + Number(order.shippingCost)).toLocaleString(locale)} EGP
            </p>
          </div>
        </div>

        <div className="border-t-2 border-foreground pt-4 print:border-black">
          <p className="text-label mb-1 text-muted-foreground print:text-black">{tl("payment")}</p>
          <p className="text-body">{t(PAYMENT_LABEL_KEY[order.paymentMethod])}</p>
          {isCod ? (
            <p className="text-h3 mt-2 text-base">
              {tl("codDue")} {(Number(order.subtotal) + Number(order.shippingCost)).toLocaleString(locale)} EGP
            </p>
          ) : (
            <p className="text-caption mt-2 text-muted-foreground print:text-black">{tl("prepaid")}</p>
          )}
        </div>

        {order.notes && (
          <div className="mt-6 border-t border-border pt-4 print:border-black">
            <p className="text-label mb-1 text-muted-foreground print:text-black">{tl("notes")}</p>
            <p className="text-body">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
