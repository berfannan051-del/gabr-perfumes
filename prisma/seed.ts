import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { notes as mockNotes } from "./fixtures/notes";
import { collections as mockCollections } from "./fixtures/collections";
import { products as mockProducts } from "./fixtures/products";
import { siteContentDefaults } from "./fixtures/site-content";
import { reviewDefaults } from "./fixtures/reviews";
import { EGYPT_GOVERNORATES } from "../lib/data/governorates";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  for (const note of Object.values(mockNotes)) {
    await prisma.fragranceNote.upsert({
      where: { slug: note.slug },
      update: { nameAr: note.name.ar, nameEn: note.name.en },
      create: { slug: note.slug, nameAr: note.name.ar, nameEn: note.name.en },
    });
  }

  for (const collection of mockCollections) {
    await prisma.collection.upsert({
      where: { slug: collection.slug },
      update: {
        nameAr: collection.name.ar,
        nameEn: collection.name.en,
        descriptionAr: collection.description.ar,
        descriptionEn: collection.description.en,
        image: collection.image,
      },
      create: {
        slug: collection.slug,
        nameAr: collection.name.ar,
        nameEn: collection.name.en,
        descriptionAr: collection.description.ar,
        descriptionEn: collection.description.en,
        image: collection.image,
      },
    });
  }

  for (const product of mockProducts) {
    const collection = await prisma.collection.findUniqueOrThrow({
      where: { slug: product.collectionSlug },
    });

    const created = await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        nameAr: product.name.ar,
        nameEn: product.name.en,
        shortDescriptionAr: product.shortDescription.ar,
        shortDescriptionEn: product.shortDescription.en,
        descriptionAr: product.description.ar,
        descriptionEn: product.description.en,
        gender: product.gender.toUpperCase() as never,
        family: product.family.toUpperCase() as never,
        collectionId: collection.id,
        concentrationAr: product.concentration.ar,
        concentrationEn: product.concentration.en,
        bottleShape: product.bottleShape.toUpperCase() as never,
        heroColor: product.heroColor,
        isBestseller: !!product.isBestseller,
        isNew: !!product.isNew,
      },
      create: {
        slug: product.slug,
        nameAr: product.name.ar,
        nameEn: product.name.en,
        shortDescriptionAr: product.shortDescription.ar,
        shortDescriptionEn: product.shortDescription.en,
        descriptionAr: product.description.ar,
        descriptionEn: product.description.en,
        gender: product.gender.toUpperCase() as never,
        family: product.family.toUpperCase() as never,
        collectionId: collection.id,
        concentrationAr: product.concentration.ar,
        concentrationEn: product.concentration.en,
        bottleShape: product.bottleShape.toUpperCase() as never,
        heroColor: product.heroColor,
        isBestseller: !!product.isBestseller,
        isNew: !!product.isNew,
        createdAt: new Date(product.createdAt),
      },
    });

    await prisma.productVariant.deleteMany({ where: { productId: created.id } });
    for (const variant of product.variants) {
      await prisma.productVariant.create({
        data: {
          productId: created.id,
          sizeMl: variant.sizeMl,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice ?? null,
          sku: variant.sku,
          stockQuantity: variant.inStock ? 50 : 0,
        },
      });
    }

    await prisma.productNote.deleteMany({ where: { productId: created.id } });
    const layers = [
      { layer: "TOP" as const, list: product.notes.top },
      { layer: "HEART" as const, list: product.notes.heart },
      { layer: "BASE" as const, list: product.notes.base },
    ];
    for (const { layer, list } of layers) {
      for (const note of list) {
        const dbNote = await prisma.fragranceNote.findUniqueOrThrow({ where: { slug: note.slug } });
        await prisma.productNote.create({
          data: { productId: created.id, noteId: dbNote.id, layer },
        });
      }
    }
  }

  const adminEmail = "admin@gabrperfumes.com";
  const adminPassword = "Admin@12345";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "GABR Admin",
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      role: "ADMIN",
    },
  });

  for (const [key, value] of Object.entries(siteContentDefaults)) {
    const type = key.endsWith("Image") || key.endsWith(".image") ? "IMAGE" : "TEXT";
    await prisma.siteContent.upsert({
      where: { key },
      update: {},
      create: { key, type, valueAr: value.ar, valueEn: value.en },
    });
  }

  for (const g of EGYPT_GOVERNORATES) {
    await prisma.shippingRate.upsert({
      where: { governorate: g.slug },
      update: {},
      create: { governorate: g.slug, price: 0 },
    });
  }

  const existingReviewCount = await prisma.review.count();
  if (existingReviewCount === 0) {
    for (const review of reviewDefaults) {
      await prisma.review.create({ data: review });
    }
  }

  console.log(`Seeded ${mockProducts.length} products, ${mockCollections.length} collections.`);
  console.log(`Seeded ${Object.keys(siteContentDefaults).length} site content fields, ${reviewDefaults.length} reviews.`);
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
