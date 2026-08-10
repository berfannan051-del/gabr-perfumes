"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.enum(["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"]);

export async function updateOrderStatus(orderId: string, status: string) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }

  const parsed = statusSchema.parse(status);
  await prisma.order.update({ where: { id: orderId }, data: { status: parsed } });
  revalidatePath("/[locale]/admin/orders/[id]", "page");
  revalidatePath("/[locale]/admin/orders", "page");
}
