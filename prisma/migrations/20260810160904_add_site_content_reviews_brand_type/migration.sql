-- CreateEnum
CREATE TYPE "BrandType" AS ENUM ('GABR', 'OTHER');

-- CreateEnum
CREATE TYPE "SiteContentType" AS ENUM ('TEXT', 'IMAGE');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "brandName" TEXT,
ADD COLUMN     "brandType" "BrandType" NOT NULL DEFAULT 'GABR';

-- CreateTable
CREATE TABLE "SiteContent" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "type" "SiteContentType" NOT NULL DEFAULT 'TEXT',
    "valueAr" TEXT NOT NULL,
    "valueEn" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "customerName" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "textAr" TEXT NOT NULL,
    "textEn" TEXT NOT NULL,
    "customerImage" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SiteContent_key_key" ON "SiteContent"("key");
