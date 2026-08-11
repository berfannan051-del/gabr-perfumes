"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";
import { validateUploadFile } from "@/lib/security/validate-upload";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function saveSiteContentText(key: string, valueAr: string, valueEn: string) {
  await requireAdmin();
  await prisma.siteContent.upsert({
    where: { key },
    update: { valueAr, valueEn, type: "TEXT" },
    create: { key, valueAr, valueEn, type: "TEXT" },
  });
  revalidatePath("/[locale]", "layout");
}

export async function saveSiteContentImage(
  formData: FormData
): Promise<{ url: string } | { error: string }> {
  await requireAdmin();
  const key = String(formData.get("key") ?? "");
  const file = formData.get("image");
  if (!key || !(file instanceof File) || file.size === 0) return { error: "invalid" };

  const validation = await validateUploadFile(file);
  if (!validation.ok) return { error: "invalid" };

  const url = await uploadFile(file, "site-content");
  await prisma.siteContent.upsert({
    where: { key },
    update: { valueAr: url, valueEn: url, type: "IMAGE" },
    create: { key, valueAr: url, valueEn: url, type: "IMAGE" },
  });
  revalidatePath("/[locale]", "layout");
  return { url };
}

export async function clearSiteContentImage(key: string) {
  await requireAdmin();
  await prisma.siteContent.upsert({
    where: { key },
    update: { valueAr: "", valueEn: "", type: "IMAGE" },
    create: { key, valueAr: "", valueEn: "", type: "IMAGE" },
  });
  revalidatePath("/[locale]", "layout");
}
