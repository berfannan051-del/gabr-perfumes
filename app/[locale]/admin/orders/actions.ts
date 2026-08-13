"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]);

class InsufficientStockError extends Error {}

export type UpdateOrderStatusResult =
  | { success: true; restockedStock: boolean }
  | { error: "notFound" | "insufficientStock" };

export async function updateOrderStatus(
  orderId: string,
  status: string
): Promise<UpdateOrderStatusResult> {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const parsed = statusSchema.parse(status);

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });
  if (!order) return { error: "notFound" };

  const wasCancelled = order.status === "CANCELLED";
  const willBeCancelled = parsed === "CANCELLED";

  try {
    await prisma.$transaction(async (tx) => {
      if (!wasCancelled && willBeCancelled) {
        // Cancelling releases every reserved unit back to stock.
        for (const item of order.items) {
          if (!item.variantId) continue;
          await tx.productVariant.update({
            where: { id: item.variantId },
            data: { stockQuantity: { increment: item.quantity } },
          });
        }
      } else if (wasCancelled && !willBeCancelled) {
        // Reviving a cancelled order re-reserves stock — atomically, the
        // same race-safe guard used at checkout — since someone else may
        // have bought the last units in the meantime.
        for (const item of order.items) {
          if (!item.variantId) continue;
          const result = await tx.productVariant.updateMany({
            where: { id: item.variantId, stockQuantity: { gte: item.quantity } },
            data: { stockQuantity: { decrement: item.quantity } },
          });
          if (result.count === 0) throw new InsufficientStockError();
        }
      }

      await tx.order.update({ where: { id: orderId }, data: { status: parsed } });
    });
  } catch (err) {
    if (err instanceof InsufficientStockError) return { error: "insufficientStock" };
    throw err;
  }

  revalidatePath("/[locale]/admin/orders/[id]", "page");
  revalidatePath("/[locale]/admin/orders", "page");
  revalidatePath("/[locale]/admin", "page");
  revalidatePath("/[locale]/shop", "page");
  revalidatePath("/[locale]/shop/[slug]", "page");
  return { success: true, restockedStock: !wasCancelled && willBeCancelled };
}
