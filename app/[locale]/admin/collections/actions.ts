"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const collectionSchema = z.object({
  slug: z.string().min(2),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  image: z.string().min(1),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function upsertCollection(id: string | null, input: z.infer<typeof collectionSchema>) {
  await requireAdmin();
  const data = collectionSchema.parse(input);

  if (id) {
    await prisma.collection.update({ where: { id }, data });
  } else {
    await prisma.collection.create({ data });
  }

  revalidatePath("/[locale]/admin/collections", "page");
  revalidatePath("/[locale]", "layout");
}

export async function deleteCollection(id: string) {
  await requireAdmin();
  await prisma.collection.delete({ where: { id } });
  revalidatePath("/[locale]/admin/collections", "page");
  revalidatePath("/[locale]", "layout");
}
