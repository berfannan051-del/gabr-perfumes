"use server";

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/lib/generated/prisma/client";
import { auth } from "@/auth";
import { checkoutSchema } from "@/lib/validation/checkout";
import { uploadFile } from "@/lib/storage";
import { validateUploadFile } from "@/lib/security/validate-upload";
import { sendOrderConfirmation } from "@/lib/notifications/whatsapp";
import { rateLimit } from "@/lib/security/rate-limit";
import { getClientIp } from "@/lib/security/get-client-ip";
import { logger } from "@/lib/logger";

export type CheckoutItemInput = {
  variantId: string;
  quantity: number;
};

export type CheckoutResult =
  | { orderId: string; orderNumber: string }
  | { error: "rateLimited" | "invalid" | "invalidFile" | "insufficientStock" | "unknown" };

class InsufficientStockError extends Error {}
class InvalidItemError extends Error {}

const MAX_LINE_ITEMS = 30;
const MAX_QUANTITY_PER_ITEM = 20;

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

  let rawItems: unknown;
  try {
    rawItems = JSON.parse(itemsRaw);
  } catch {
    return { error: "invalid" };
  }
  if (!Array.isArray(rawItems) || rawItems.length === 0 || rawItems.length > MAX_LINE_ITEMS) {
    return { error: "invalid" };
  }

  const items: CheckoutItemInput[] = [];
  for (const raw of rawItems) {
    if (
      !raw ||
      typeof raw !== "object" ||
      typeof (raw as Record<string, unknown>).variantId !== "string" ||
      !Number.isInteger((raw as Record<string, unknown>).quantity) ||
      (raw as Record<string, number>).quantity < 1 ||
      (raw as Record<string, number>).quantity > MAX_QUANTITY_PER_ITEM
    ) {
      return { error: "invalid" };
    }
    items.push({
      variantId: (raw as Record<string, string>).variantId,
      quantity: (raw as Record<string, number>).quantity,
    });
  }

  let proofImageUrl: string | undefined;
  const proofFile = formData.get("proof");
  if (proofFile instanceof File && proofFile.size > 0) {
    const validation = await validateUploadFile(proofFile);
    if (!validation.ok) return { error: "invalidFile" };
    proofImageUrl = await uploadFile(proofFile, "payment-proofs");
  }

  const session = await auth();
  const orderNumber = `GBR-${Date.now().toString().slice(-8)}`;

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Price, product names, and size are always re-derived from the current
      // database record — the client only ever supplies which variant and how
      // many. Trusting client-submitted prices would let anyone check out at
      // whatever amount they choose.
      let subtotal = 0;
      const orderItemsData: {
        productId: string;
        variantId: string;
        nameAr: string;
        nameEn: string;
        sizeMl: number;
        price: Prisma.Decimal;
        quantity: number;
      }[] = [];

      for (const item of items) {
        const variant = await tx.productVariant.findUnique({
          where: { id: item.variantId },
          include: { product: { select: { id: true, nameAr: true, nameEn: true } } },
        });
        if (!variant) throw new InvalidItemError();

        // Reserve stock atomically — the WHERE clause's stockQuantity guard
        // makes this a race-safe conditional decrement instead of a
        // check-then-act that two simultaneous checkouts could both pass.
        const result = await tx.productVariant.updateMany({
          where: { id: item.variantId, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (result.count === 0) throw new InsufficientStockError();

        subtotal += Number(variant.price) * item.quantity;
        orderItemsData.push({
          productId: variant.product.id,
          variantId: variant.id,
          nameAr: variant.product.nameAr,
          nameEn: variant.product.nameEn,
          sizeMl: variant.sizeMl,
          price: variant.price,
          quantity: item.quantity,
        });
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
          items: { create: orderItemsData },
        },
      });
    });

    logger.info({ orderNumber }, "order created");

    await sendOrderConfirmation({
      orderNumber,
      fullName: parsed.data.fullName,
      phone: parsed.data.phone,
      subtotal: Number(order.subtotal),
    }).catch((err) => logger.error({ err }, "whatsapp notification failed"));

    return { orderId: order.id, orderNumber };
  } catch (err) {
    if (err instanceof InsufficientStockError) {
      return { error: "insufficientStock" };
    }
    if (err instanceof InvalidItemError) {
      return { error: "invalid" };
    }
    logger.error({ err }, "order creation failed");
    return { error: "unknown" };
  }
}
