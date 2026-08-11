"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { checkoutSchema, type CheckoutErrors } from "@/lib/validation/checkout";
import { submitOrderAction } from "@/app/[locale]/(site)/checkout/actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { BottleArt } from "@/components/product/bottle-art";
import { PaymentMethodPicker, type PaymentMethod } from "@/components/checkout/payment-method-picker";
import type { Locale } from "@/types/catalog";

export function CheckoutClient({
  instapayNumber,
  vodafoneCashNumber,
}: {
  instapayNumber: string;
  vodafoneCashNumber: string;
}) {
  const t = useTranslations("Checkout");
  const tc = useTranslations("Common");
  const cart = useCart();
  const locale = useLocale() as Locale;

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    governorate: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("instapay");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = checkoutSchema.safeParse({ ...form, paymentMethod });
    if (!result.success) {
      const fieldErrors: CheckoutErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as keyof CheckoutErrors;
        fieldErrors[key] = t("errorRequired");
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    const data = new FormData();
    data.set("fullName", result.data.fullName);
    data.set("email", result.data.email);
    data.set("phone", result.data.phone);
    data.set("address", result.data.address);
    data.set("city", result.data.city);
    data.set("governorate", result.data.governorate);
    if (result.data.notes) data.set("notes", result.data.notes);
    data.set("paymentMethod", result.data.paymentMethod);
    if (proofFile) data.set("proof", proofFile);
    data.set(
      "items",
      JSON.stringify(
        cart.items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          nameAr: item.name.ar,
          nameEn: item.name.en,
          sizeMl: item.sizeMl,
          price: item.price,
          quantity: item.quantity,
        }))
      )
    );

    const response = await submitOrderAction(data);
    setSubmitting(false);

    if ("error" in response) {
      setSubmitError(t(`submitErrors.${response.error}`));
      return;
    }

    setOrderNumber(response.orderNumber);
    cart.clear();
  }

  useEffect(() => {
    if (orderNumber) window.scrollTo({ top: 0, behavior: "smooth" });
  }, [orderNumber]);

  if (orderNumber) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center md:px-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }}>
          <span className="text-label text-primary">{orderNumber}</span>
          <h1 className="text-h1 mt-4 mb-4">{t("successTitle")}</h1>
          <p className="text-body mb-8 text-muted-foreground">{t("successBody")}</p>
          <Link href="/shop" className={buttonVariants()}>
            {tc("back")}
          </Link>
        </motion.div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center md:px-10">
        <p className="text-h3 mb-6">{locale === "ar" ? "سلتك فارغة" : "Your cart is empty"}</p>
        <Link href="/shop" className={buttonVariants()}>
          {locale === "ar" ? "تصفح المتجر" : "Browse Shop"}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 md:px-10">
      <h1 className="text-h1 mb-12 text-center">{t("title")}</h1>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1fr_380px]">
        <form onSubmit={handleSubmit} className="flex flex-col gap-10">
          <fieldset className="flex flex-col gap-4">
            <h2 className="text-h3">{t("contactHeading")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">{t("fullName")}</Label>
                <Input id="fullName" value={form.fullName} onChange={(e) => update("fullName", e.target.value)} />
                {errors.fullName && <p className="text-caption text-primary-deep">{errors.fullName}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
                {errors.email && <p className="text-caption text-primary-deep">{t("errorEmail")}</p>}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input id="phone" type="tel" dir="ltr" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                {errors.phone && <p className="text-caption text-primary-deep">{t("errorPhone")}</p>}
              </div>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <h2 className="text-h3">{t("shippingHeading")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="address">{t("address")}</Label>
                <Input id="address" value={form.address} onChange={(e) => update("address", e.target.value)} />
                {errors.address && <p className="text-caption text-primary-deep">{errors.address}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="city">{t("city")}</Label>
                <Input id="city" value={form.city} onChange={(e) => update("city", e.target.value)} />
                {errors.city && <p className="text-caption text-primary-deep">{errors.city}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="governorate">{t("governorate")}</Label>
                <Input id="governorate" value={form.governorate} onChange={(e) => update("governorate", e.target.value)} />
                {errors.governorate && <p className="text-caption text-primary-deep">{errors.governorate}</p>}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="notes">{t("notes")}</Label>
                <Textarea id="notes" rows={3} value={form.notes} onChange={(e) => update("notes", e.target.value)} />
              </div>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <h2 className="text-h3">{t("paymentHeading")}</h2>
            <p className="text-caption">{t("paymentHint")}</p>

            <PaymentMethodPicker
              value={paymentMethod}
              onChange={setPaymentMethod}
              instapayNumber={instapayNumber}
              vodafoneCashNumber={vodafoneCashNumber}
              proofFile={proofFile}
              onProofChange={setProofFile}
            />

            <p className="text-caption mt-2 border-s-2 border-primary ps-3">{t("whatsappHint")}</p>
          </fieldset>

          {submitError && <p className="text-caption text-primary-deep">{submitError}</p>}

          <Button type="submit" size="lg" disabled={submitting}>
            {submitting ? t("submitting") : t("submit")}
          </Button>
        </form>

        <aside className="h-fit border border-border p-6">
          <h2 className="text-h3 mb-6">{t("orderSummary")}</h2>
          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                <div className="h-16 w-14 shrink-0 bg-surface-muted">
                  <BottleArt shape={item.bottleShape} liquidColor={item.heroColor} className="h-full w-full" />
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <div>
                    <p className="text-body">{item.name[locale]}</p>
                    <p className="text-caption">
                      {item.sizeMl}ml × {item.quantity}
                    </p>
                  </div>
                  <p className="text-body">{(item.price * item.quantity).toLocaleString(locale)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-between border-t border-border pt-4 text-h3 text-base">
            <span>{tc("total")}</span>
            <span>
              {cart.subtotal.toLocaleString(locale)} {tc("currency")}
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
