"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";
import { validateUploadFile } from "@/lib/security/validate-upload";

const brandSchema = z.object({
  name: z.string().min(1),
});

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function saveBrand(
  brandId: string | null,
  formData: FormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin();

  const parsed = brandSchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) return { error: "invalid" };

  let logo = (formData.get("existingLogo") as string) || null;
  const file = formData.get("logo");
  if (file instanceof File && file.size > 0) {
    const validation = await validateUploadFile(file);
    if (!validation.ok) return { error: "invalidFile" };
    logo = await uploadFile(file, "brands");
  }

  try {
    let id = brandId;
    if (id) {
      await prisma.brand.update({ where: { id }, data: { name: parsed.data.name, logo } });
    } else {
      const created = await prisma.brand.create({ data: { name: parsed.data.name, logo } });
      id = created.id;
    }

    revalidatePath("/[locale]/admin/brands", "page");
    revalidatePath("/[locale]/admin/products", "page");
    revalidatePath("/[locale]/shop", "page");
    revalidatePath("/[locale]", "layout");

    return { id };
  } catch {
    return { error: "duplicate" };
  }
}

export async function deleteBrand(id: string) {
  await requireAdmin();
  await prisma.brand.delete({ where: { id } });
  revalidatePath("/[locale]/admin/brands", "page");
  revalidatePath("/[locale]/admin/products", "page");
  revalidatePath("/[locale]/shop", "page");
  revalidatePath("/[locale]", "layout");
}
