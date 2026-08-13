-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "shippingCost" DECIMAL(10,2) NOT NULL DEFAULT 0,
ALTER COLUMN "city" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ShippingRate" (
    "id" TEXT NOT NULL,
    "governorate" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShippingRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingRate_governorate_key" ON "ShippingRate"("governorate");
