import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { Link } from "@/i18n/navigation";
import { OrderStatusSelect } from "@/components/admin/order-status-select";
import { PAYMENT_LABEL_KEY } from "@/lib/data/order-payment-label";
import { buttonVariants } from "@/components/ui/button";
import { PrinterIcon } from "@/components/ui/icons";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const t = await getTranslations("Admin.orders");

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true },
  });
  if (!order) notFound();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-h2">{order.orderNumber}</h1>
          <p className="text-caption text-muted-foreground">{order.createdAt.toLocaleString()}</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/admin/orders/${order.id}/label`} className={buttonVariants({ variant: "outline", size: "sm" })}>
            <PrinterIcon className="h-4 w-4" />
            {t("printLabel")}
          </Link>
          <OrderStatusSelect orderId={order.id} status={order.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div>
          <h2 className="text-h3 mb-4">{t("items")}</h2>
          <table className="w-full border-collapse text-start">
            <tbody>
              {order.items.map((item) => (
                <tr key={item.id} className="border-b border-border">
                  <td className="py-3 text-body">{item.nameAr}</td>
                  <td className="py-3 text-caption text-muted-foreground">{item.sizeMl}ml × {item.quantity}</td>
                  <td className="py-3 text-end text-body">{(Number(item.price) * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex justify-end text-h3 text-base">
            {t("total")}: {Number(order.subtotal).toLocaleString()} EGP
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div>
            <h3 className="text-label mb-2 text-muted-foreground">{t("shippingInfo")}</h3>
            <p className="text-body">{order.fullName}</p>
            <p className="text-caption">{order.email}</p>
            <p className="text-caption" dir="ltr">{order.phone}</p>
            <p className="text-caption mt-2">{order.address}, {order.city}, {order.governorate}</p>
            {order.notes && <p className="text-caption mt-2 text-muted-foreground">{order.notes}</p>}
          </div>

          <div>
            <h3 className="text-label mb-2 text-muted-foreground">{t("paymentInfo")}</h3>
            <p className="text-body">{t(PAYMENT_LABEL_KEY[order.paymentMethod])}</p>
          </div>

          <div>
            <h3 className="text-label mb-2 text-muted-foreground">{t("proofImage")}</h3>
            {order.proofImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={order.proofImageUrl} alt="proof" className="w-full border border-border" />
            ) : (
              <p className="text-caption text-muted-foreground">{t("noProof")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
