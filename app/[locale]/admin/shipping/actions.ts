"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { EGYPT_GOVERNORATES } from "@/lib/data/governorates";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function saveShippingRates(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  await requireAdmin();

  const updates: { governorate: string; price: number }[] = [];
  for (const g of EGYPT_GOVERNORATES) {
    const raw = formData.get(g.slug);
    const price = Number(raw);
    if (typeof raw !== "string" || raw === "" || !Number.isFinite(price) || price < 0) {
      return { error: "invalid" };
    }
    updates.push({ governorate: g.slug, price });
  }

  await prisma.$transaction(
    updates.map((u) =>
      prisma.shippingRate.upsert({
        where: { governorate: u.governorate },
        update: { price: u.price },
        create: { governorate: u.governorate, price: u.price },
      })
    )
  );

  revalidatePath("/[locale]/admin/shipping", "page");
  revalidatePath("/[locale]/checkout", "page");

  return { success: true };
}
