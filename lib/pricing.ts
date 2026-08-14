export type DiscountType = "PERCENTAGE" | "FIXED";

export type Discount = {
  discountEnabled: boolean;
  discountType: DiscountType | null;
  discountValue: number | null;
};

/** Applies a variant's discount to its base price, clamped to never go below 0 or above the base price. */
export function calculateDiscountedPrice(price: number, discount: Discount): number {
  if (!discount.discountEnabled || !discount.discountType || discount.discountValue == null) {
    return price;
  }
  const off = discount.discountType === "PERCENTAGE" ? price * (discount.discountValue / 100) : discount.discountValue;
  return Math.max(0, Math.min(price, price - off));
}
