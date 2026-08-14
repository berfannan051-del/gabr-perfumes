"use server";

import { revalidatePath } from "next/cache";
import { randomUUID } from "crypto";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/storage";
import { validateUploadFile } from "@/lib/security/validate-upload";

const productSchema = z.object({
  slug: z.string().min(2),
  nameAr: z.string().min(1),
  nameEn: z.string().min(1),
  shortDescriptionAr: z.string().min(1),
  shortDescriptionEn: z.string().min(1),
  descriptionAr: z.string().min(1),
  descriptionEn: z.string().min(1),
  gender: z.enum(["MEN", "WOMEN", "UNISEX"]),
  family: z.enum(["ORIENTAL", "WOODY", "FLORAL", "CITRUS", "AMBER", "MUSK"]),
  collectionId: z.string().min(1),
  concentrationAr: z.string().min(1),
  concentrationEn: z.string().min(1),
  bottleShape: z.enum(["TALL", "ROUND", "FACETED"]),
  heroColor: z.string().min(1),
  isBestseller: z.boolean(),
  isNew: z.boolean(),
  brandType: z.enum(["GABR", "OTHER"]),
  brandId: z.string().optional(),
});

type VariantInput = {
  id?: string;
  sizeMl: number;
  price: number;
  discountEnabled?: boolean;
  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;
  stockQuantity: number;
  sku: string;
};

/** Normalizes a variant's discount to a consistent, valid shape — disabled means no discount data is stored at all. */
function normalizeDiscount(v: VariantInput) {
  if (!v.discountEnabled || !v.discountType || !Number.isFinite(v.discountValue) || (v.discountValue as number) <= 0) {
    return { discountEnabled: false, discountType: null, discountValue: null };
  }
  const value = v.discountType === "PERCENTAGE" ? Math.min(100, v.discountValue as number) : (v.discountValue as number);
  return { discountEnabled: true, discountType: v.discountType, discountValue: value };
}

type NotesInput = { top: string[]; heart: string[]; base: string[] };

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

async function findOrCreateNoteId(name: string): Promise<string> {
  const nameAr = name.trim();
  const existing = await prisma.fragranceNote.findFirst({ where: { nameAr } });
  if (existing) return existing.id;

  const slugBase =
    nameAr
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\p{L}\p{N}-]/gu, "")
      .slice(0, 60) || "note";
  try {
    const created = await prisma.fragranceNote.create({
      data: { nameAr, nameEn: nameAr, slug: `${slugBase}-${randomUUID().slice(0, 8)}` },
    });
    return created.id;
  } catch {
    const retry = await prisma.fragranceNote.findFirst({ where: { nameAr } });
    if (retry) return retry.id;
    throw new Error(`Failed to create fragrance note "${nameAr}"`);
  }
}

export async function saveProduct(
  productId: string | null,
  formData: FormData
): Promise<{ id: string } | { error: string }> {
  await requireAdmin();

  const parsed = productSchema.safeParse({
    slug: formData.get("slug"),
    nameAr: formData.get("nameAr"),
    nameEn: formData.get("nameEn"),
    shortDescriptionAr: formData.get("shortDescriptionAr"),
    shortDescriptionEn: formData.get("shortDescriptionEn"),
    descriptionAr: formData.get("descriptionAr"),
    descriptionEn: formData.get("descriptionEn"),
    gender: formData.get("gender"),
    family: formData.get("family"),
    collectionId: formData.get("collectionId"),
    concentrationAr: formData.get("concentrationAr"),
    concentrationEn: formData.get("concentrationEn"),
    bottleShape: formData.get("bottleShape"),
    heroColor: formData.get("heroColor"),
    isBestseller: formData.get("isBestseller") === "true",
    isNew: formData.get("isNew") === "true",
    brandType: formData.get("brandType"),
    brandId: formData.get("brandId") || undefined,
  });
  if (!parsed.success) return { error: "invalid" };

  let variants: VariantInput[];
  let notes: NotesInput;
  try {
    variants = JSON.parse(String(formData.get("variants") ?? "[]"));
    notes = JSON.parse(String(formData.get("notes") ?? '{"top":[],"heart":[],"base":[]}'));
  } catch {
    return { error: "invalid" };
  }

  // A product with no sizes has nothing to sell and crashes every storefront
  // page that assumes a starting price exists — never let this reach the DB.
  if (variants.length === 0) return { error: "noVariants" };

  const existingImages: string[] = JSON.parse(String(formData.get("existingImages") ?? "[]"));
  const newImages: string[] = [];
  for (const file of formData.getAll("images")) {
    if (file instanceof File && file.size > 0) {
      const validation = await validateUploadFile(file);
      if (validation.ok) newImages.push(await uploadFile(file, "products"));
    }
  }
  const images = [...existingImages, ...newImages];

  const data = {
    ...parsed.data,
    brandId: parsed.data.brandType === "OTHER" ? parsed.data.brandId ?? null : null,
    images,
  };

  let id = productId;
  if (id) {
    await prisma.product.update({ where: { id }, data });
  } else {
    const created = await prisma.product.create({ data });
    id = created.id;
  }

  const keepVariantIds = variants.filter((v) => v.id).map((v) => v.id!);
  await prisma.productVariant.deleteMany({
    where: { productId: id, id: { notIn: keepVariantIds.length ? keepVariantIds : ["__none__"] } },
  });
  for (const v of variants) {
    const discount = normalizeDiscount(v);
    if (v.id) {
      await prisma.productVariant.update({
        where: { id: v.id },
        data: { sizeMl: v.sizeMl, price: v.price, stockQuantity: v.stockQuantity, sku: v.sku, ...discount },
      });
    } else {
      await prisma.productVariant.create({
        data: { productId: id, sizeMl: v.sizeMl, price: v.price, stockQuantity: v.stockQuantity, sku: v.sku, ...discount },
      });
    }
  }

  await prisma.productNote.deleteMany({ where: { productId: id } });
  const layers: Array<[keyof NotesInput, "TOP" | "HEART" | "BASE"]> = [
    ["top", "TOP"],
    ["heart", "HEART"],
    ["base", "BASE"],
  ];
  for (const [key, layer] of layers) {
    for (const name of notes[key]) {
      const noteId = await findOrCreateNoteId(name);
      await prisma.productNote.create({ data: { productId: id, noteId, layer } });
    }
  }

  revalidatePath("/[locale]/admin/products", "page");
  revalidatePath("/[locale]/shop/[slug]", "page");
  revalidatePath("/[locale]", "layout");

  return { id };
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/[locale]/admin/products", "page");
  revalidatePath("/[locale]", "layout");
}
