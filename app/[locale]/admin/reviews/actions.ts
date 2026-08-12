"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";
import { validateUploadFile } from "@/lib/security/validate-upload";

const reviewSchema = z.object({
  customerName: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5),
  textAr: z.string().min(1),
  textEn: z.string().min(1),
  isActive: z.boolean(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function saveReview(
  reviewId: string | null,
  formData: FormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin();

  const parsed = reviewSchema.safeParse({
    customerName: formData.get("customerName"),
    rating: formData.get("rating"),
    textAr: formData.get("textAr"),
    textEn: formData.get("textEn"),
    isActive: formData.get("isActive") === "true",
  });
  if (!parsed.success) return { error: "invalid" };

  let customerImage = (formData.get("existingImage") as string) || null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    const validation = await validateUploadFile(file);
    if (!validation.ok) return { error: "invalidFile" };
    customerImage = await uploadFile(file, "reviews");
  }

  const data = { ...parsed.data, customerImage };

  let id = reviewId;
  if (id) {
    await prisma.review.update({ where: { id }, data });
  } else {
    const created = await prisma.review.create({ data });
    id = created.id;
  }

  revalidatePath("/[locale]/admin/reviews", "page");
  revalidatePath("/[locale]", "layout");
  return { id };
}

export async function deleteReview(id: string) {
  await requireAdmin();
  await prisma.review.delete({ where: { id } });
  revalidatePath("/[locale]/admin/reviews", "page");
  revalidatePath("/[locale]", "layout");
}

export async function toggleReviewActive(id: string, isActive: boolean) {
  await requireAdmin();
  await prisma.review.update({ where: { id }, data: { isActive } });
  revalidatePath("/[locale]/admin/reviews", "page");
  revalidatePath("/[locale]", "layout");
}
