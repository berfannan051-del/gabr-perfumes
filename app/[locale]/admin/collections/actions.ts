"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";
import { validateUploadFile } from "@/lib/security/validate-upload";

const collectionSchema = z.object({
  slug: z.string().min(2),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function upsertCollection(
  id: string | null,
  formData: FormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin();

  const parsed = collectionSchema.safeParse({
    slug: formData.get("slug"),
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    descriptionAr: formData.get("descriptionAr"),
    descriptionEn: formData.get("descriptionEn"),
  });
  if (!parsed.success) return { error: "invalid" };

  let image = (formData.get("existingImage") as string) || "";
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const validation = await validateUploadFile(file);
    if (!validation.ok) return { error: "invalidFile" };
    image = await uploadFile(file, "collections");
  }
  if (!image) return { error: "invalid" };

  const data = { ...parsed.data, image };

  try {
    if (id) {
      await prisma.collection.update({ where: { id }, data });
    } else {
      await prisma.collection.create({ data });
    }
  } catch {
    return { error: "duplicate" };
  }

  revalidatePath("/[locale]/admin/collections", "page");
  revalidatePath("/[locale]", "layout");
  return { id: id ?? "" };
}

export async function deleteCollection(id: string) {
  await requireAdmin();
  await prisma.collection.delete({ where: { id } });
  revalidatePath("/[locale]/admin/collections", "page");
  revalidatePath("/[locale]", "layout");
}
