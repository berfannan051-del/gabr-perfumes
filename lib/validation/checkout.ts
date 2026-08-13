import { z } from "zod";
import { GOVERNORATE_SLUGS } from "@/lib/data/governorates";

export const checkoutSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(254),
  phone: z.string().min(8).max(30),
  address: z.string().min(5).max(500),
  governorate: z.enum(GOVERNORATE_SLUGS),
  notes: z.string().max(1000).optional(),
  paymentMethod: z.enum(["instapay", "vodafone_cash", "cash_on_delivery"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutErrors = Partial<Record<keyof CheckoutInput, string>>;
