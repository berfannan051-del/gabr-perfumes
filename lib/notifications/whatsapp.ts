import "server-only";
import { logger } from "@/lib/logger";

type OrderNotification = {
  orderNumber: string;
  fullName: string;
  phone: string;
  subtotal: number;
};

export async function sendOrderConfirmation(order: OrderNotification) {
  const token = process.env.WHATSAPP_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_ID;

  if (!token || !phoneId) {
    logger.info({ orderNumber: order.orderNumber }, "WhatsApp not configured, skipping notification");
    return;
  }

  const to = order.phone.replace(/\D/g, "");
  const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to,
      type: "text",
      text: {
        body: `مرحبًا ${order.fullName}، تم استلام طلبك رقم ${order.orderNumber} بقيمة ${order.subtotal} ج.م. سنتواصل معك قريبًا لتأكيد الطلب.`,
      },
    }),
  });

  if (!res.ok) {
    logger.error({ orderNumber: order.orderNumber, status: res.status }, "WhatsApp notification failed");
  }
}
