import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  address: z.string().min(5),
  city: z.string().min(2),
  governorate: z.string().min(2),
  notes: z.string().optional(),
  paymentMethod: z.enum(["instapay", "vodafone_cash", "cash_on_delivery"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
export type CheckoutErrors = Partial<Record<keyof CheckoutInput, string>>;
