/*
  Warnings:

  - You are about to drop the column `compareAtPrice` on the `ProductVariant` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "DiscountType" AS ENUM ('PERCENTAGE', 'FIXED');

-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "compareAtPrice",
ADD COLUMN     "discountEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "discountType" "DiscountType",
ADD COLUMN     "discountValue" DECIMAL(10,2);
