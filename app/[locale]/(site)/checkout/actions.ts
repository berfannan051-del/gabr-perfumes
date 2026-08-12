"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { checkoutSchema } from "@/lib/validation/checkout";
import { uploadFile } from "@/lib/storage";
import { validateUploadFile } from "@/lib/security/validate-upload";
import { sendOrderConfirmation } from "@/lib/notifications/whatsapp";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/get-client-ip";
import { logger } from "@/lib/logger";

export type CheckoutItemInput = {
  productId: string;
  variantId: string;
  nameAr: string;
  nameEn: string;
  sizeMl: number;
  price: number;
  quantity: number;
};

export type CheckoutResult =
  | { orderId: string; orderNumber: string }
  | { error: "rateLimited" | "invalid" | "invalidFile" | "insufficientStock" | "unknown" };

class InsufficientStockError extends Error {}

export async function submitOrderAction(formData: FormData): Promise<CheckoutResult> {
  const ip = await getClientIp();
  if (!rateLimit(`checkout:${ip}`, 8, 60_000)) {
    return { error: "rateLimited" };
  }

  const parsed = checkoutSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    address: formData.get("address"),
    city: formData.get("city"),
    governorate: formData.get("governorate"),
    notes: formData.get("notes") || undefined,
    paymentMethod: formData.get("paymentMethod"),
  });
  if (!parsed.success) return { error: "invalid" };

  const itemsRaw = formData.get("items");
  if (typeof itemsRaw !== "string") return { error: "invalid" };

  let items: CheckoutItemInput[];
  try {
    items = JSON.parse(itemsRaw);
  } catch {
    return { error: "invalid" };
  }
  if (!Array.isArray(items) || items.length === 0) return { error: "invalid" };
  if (items.some((i) => !Number.isInteger(i.quantity) || i.quantity < 1)) return { error: "invalid" };

  let proofImageUrl: string | undefined;
  const proofFile = formData.get("proof");
  if (proofFile instanceof File && proofFile.size > 0) {
    const validation = await validateUploadFile(proofFile);
    if (!validation.ok) return { error: "invalidFile" };
    proofImageUrl = await uploadFile(proofFile, "payment-proofs");
  }

  const session = await auth();
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const orderNumber = `GBR-${Date.now().toString().slice(-8)}`;

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Reserve stock atomically per variant — the WHERE clause's stockQuantity
      // guard makes this a race-safe conditional decrement instead of a
      // check-then-act that two simultaneous checkouts could both pass.
      for (const item of items) {
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (result.count === 0) throw new InsufficientStockError();
      }

      return tx.order.create({
        data: {
          orderNumber,
          userId: session?.user?.id,
          fullName: parsed.data.fullName,
          email: parsed.data.email,
          phone: parsed.data.phone,
          address: parsed.data.address,
          city: parsed.data.city,
          governorate: parsed.data.governorate,
          notes: parsed.data.notes,
          paymentMethod: parsed.data.paymentMethod.toUpperCase() as never,
          proofImageUrl,
          subtotal,
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              variantId: i.variantId,
              nameAr: i.nameAr,
              nameEn: i.nameEn,
              sizeMl: i.sizeMl,
              price: i.price,
              quantity: i.quantity,
            })),
          },
        },
      });
    });

    logger.info({ orderNumber }, "order created");

    await sendOrderConfirmation({
      orderNumber,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      subtotal,
    }).catch((err) => logger.error({ err }, "whatsapp notification failed"));

    return { orderId: order.id, orderNumber };
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return { error: "insufficientStock" };
    }
    logger.error({ err }, "order creation failed");
    return { error: "unknown" };
  }
}
