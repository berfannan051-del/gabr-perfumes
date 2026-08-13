"use client";

import { useEffect, useState, type ComponentType } from "react";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/lib/cart/cart-context";
import { checkoutSchema, type CheckoutErrors } from "@/lib/validation/checkout";
import { submitOrderAction } from "@/app/[locale]/(site)/checkout/actions";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button, buttonVariants } from "@/components/ui/button";
import { BottleArt } from "@/components/product/bottle-art";
import { PaymentMethodPicker, type PaymentMethod } from "@/components/checkout/payment-method-picker";
import { OrderInvoice, type InvoiceItem } from "@/components/checkout/order-invoice";
import { WhatsAppIcon, UserIcon, MailIcon, PhoneIcon, MapPinIcon, NoteTextIcon } from "@/components/ui/icons";
import { toWhatsAppNumber } from "@/lib/phone";
import { EGYPT_GOVERNORATES, governorateLabel } from "@/lib/data/governorates";
import type { Locale } from "@/types/catalog";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const section = {
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const } },
};

function FieldIcon({ icon: Icon }: { icon: ComponentType<{ className?: string }> }) {
  return (
    <Icon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors peer-focus:text-primary" />
  );
}

function SectionCard({
  index,
  title,
  hint,
  children,
}: {
  index: number;
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.fieldset
      variants={section}
      className="border border-border bg-surface p-6 shadow-soft md:p-8"
    >
      <div className="mb-6 flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-primary/40 text-label text-primary">
          0{index}
        </span>
        <div>
          <h2 className="text-h3 text-base">{title}</h2>
          {hint && <p className="text-caption mt-0.5 text-muted-foreground">{hint}</p>}
        </div>
      </div>
      {children}
    </motion.fieldset>
  );
}

type CompletedOrder = {
  orderNumber: string;
  fullName: string;
  phone: string;
  email: string;
  address: string;
  governorateSlug: string;
  paymentMethod: PaymentMethod;
  items: InvoiceItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
};

export function CheckoutClient({
  instapayNumber,
  vodafoneCashNumber,
  whatsappNumber,
  shippingRates,
}: {
  instapayNumber: string;
  vodafoneCashNumber: string;
  whatsappNumber: string;
  shippingRates: Record<string, number>;
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
    governorate: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("instapay");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const shippingCost = form.governorate ? (shippingRates[form.governorate] ?? 0) : 0;

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
    data.set("governorate", result.data.governorate);
    if (result.data.notes) data.set("notes", result.data.notes);
    data.set("paymentMethod", result.data.paymentMethod);
    if (proofFile) data.set("proof", proofFile);
    data.set(
      "items",
      JSON.stringify(
        cart.items.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        }))
      )
    );

    const invoiceItems: InvoiceItem[] = cart.items.map((item) => ({
      name: item.name,
      sizeMl: item.sizeMl,
      quantity: item.quantity,
      price: item.price,
    }));

    const response = await submitOrderAction(data);
    setSubmitting(false);

    if ("error" in response) {
      setSubmitError(t(`submitErrors.${response.error}`));
      return;
    }

    setCompletedOrder({
      orderNumber: response.orderNumber,
      fullName: result.data.fullName,
      phone: result.data.phone,
      email: result.data.email,
      address: result.data.address,
      governorateSlug: result.data.governorate,
      paymentMethod: result.data.paymentMethod,
      items: invoiceItems,
      subtotal: response.subtotal,
      shippingCost: response.shippingCost,
      total: response.total,
    });
    cart.clear();
  }

  const waDigits = toWhatsAppNumber(whatsappNumber);
  const waLink = waDigits
    ? `https://wa.me/${waDigits}?text=${encodeURIComponent(
        t("whatsappMessage", { orderNumber: completedOrder?.orderNumber ?? "" })
      )}`
    : null;

  useEffect(() => {
    if (!completedOrder) return;
    // Scroll up so the invoice is visible — WhatsApp only opens when the
    // customer taps the button below the invoice, never automatically.
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [completedOrder]);

  if (completedOrder) {
    const paymentLabel = t(
      completedOrder.paymentMethod === "instapay"
        ? "instapay"
        : completedOrder.paymentMethod === "vodafone_cash"
          ? "vodafoneCash"
          : "cashOnDelivery"
    );

    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-5 py-32 text-center md:px-10">
        <span className="text-label text-primary">{completedOrder.orderNumber}</span>
        <h1 className="text-h1 mt-4 mb-4">{t("successTitle")}</h1>
        <p className="text-body mb-10 text-muted-foreground">{t("successBody")}</p>

        <OrderInvoice
          orderNumber={completedOrder.orderNumber}
          fullName={completedOrder.fullName}
          phone={completedOrder.phone}
          email={completedOrder.email}
          address={completedOrder.address}
          governorateLabel={governorateLabel(completedOrder.governorateSlug, locale)}
          items={completedOrder.items}
          subtotal={completedOrder.subtotal}
          shippingCost={completedOrder.shippingCost}
          total={completedOrder.total}
          paymentMethodLabel={paymentLabel}
        />

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link href="/shop" className={buttonVariants({ variant: "outline" })}>
            {tc("back")}
          </Link>
          {waLink && (
            <a href={waLink} target="_blank" rel="noopener noreferrer" className={buttonVariants()}>
              <WhatsAppIcon className="h-4 w-4" />
              {t("whatsappConfirm")}
            </a>
          )}
        </div>
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

  const governorateOptions = EGYPT_GOVERNORATES.map((g) => ({
    value: g.slug,
    label: g[locale],
    hint: shippingRates[g.slug] > 0 ? `${shippingRates[g.slug].toLocaleString(locale)} ${tc("currency")}` : undefined,
  }));

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 md:px-10">
      <h1 className="text-h1 mb-12 text-center">{t("title")}</h1>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-16">
        <motion.form
          variants={container}
          initial="hidden"
          animate="show"
          onSubmit={handleSubmit}
          className="flex flex-col gap-6"
        >
          <SectionCard index={1} title={t("contactHeading")}>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="fullName">{t("fullName")}</Label>
                <div className="relative">
                  <FieldIcon icon={UserIcon} />
                  <Input
                    id="fullName"
                    className="peer ps-11"
                    value={form.fullName}
                    onChange={(e) => update("fullName", e.target.value)}
                  />
                </div>
                {errors.fullName && <p className="text-caption text-primary-deep">{errors.fullName}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">{t("email")}</Label>
                <div className="relative">
                  <FieldIcon icon={MailIcon} />
                  <Input
                    id="email"
                    type="email"
                    className="peer ps-11"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </div>
                {errors.email && <p className="text-caption text-primary-deep">{t("errorEmail")}</p>}
              </div>
              <div className="flex flex-col gap-2 sm:col-span-2">
                <Label htmlFor="phone">{t("phone")}</Label>
                <div className="relative">
                  <FieldIcon icon={PhoneIcon} />
                  <Input
                    id="phone"
                    type="tel"
                    dir="ltr"
                    className="peer ps-11 text-start"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </div>
                {errors.phone && <p className="text-caption text-primary-deep">{t("errorPhone")}</p>}
              </div>
            </div>
          </SectionCard>

          <SectionCard index={2} title={t("shippingHeading")} hint={t("shippingHint")}>
            <div className="grid grid-cols-1 gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="address">{t("address")}</Label>
                <div className="relative">
                  <FieldIcon icon={MapPinIcon} />
                  <Input
                    id="address"
                    className="peer ps-11"
                    value={form.address}
                    onChange={(e) => update("address", e.target.value)}
                  />
                </div>
                {errors.address && <p className="text-caption text-primary-deep">{errors.address}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="governorate">{t("governorate")}</Label>
                <Select
                  id="governorate"
                  value={form.governorate || null}
                  onValueChange={(v) => update("governorate", v)}
                  options={governorateOptions}
                  placeholder={t("governoratePlaceholder")}
                  icon={MapPinIcon}
                />
                {errors.governorate && <p className="text-caption text-primary-deep">{errors.governorate}</p>}
                {form.governorate && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-caption text-primary-deep"
                  >
                    {t("shippingCost")}:{" "}
                    {shippingCost > 0 ? `${shippingCost.toLocaleString(locale)} ${tc("currency")}` : t("shippingFree")}
                  </motion.p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="notes">{t("notes")}</Label>
                <div className="relative">
                  <NoteTextIcon className="pointer-events-none absolute start-4 top-4 h-4 w-4 text-muted-foreground" />
                  <Textarea
                    id="notes"
                    rows={3}
                    className="ps-11"
                    value={form.notes}
                    onChange={(e) => update("notes", e.target.value)}
                  />
                </div>
              </div>
            </div>
          </SectionCard>

          <SectionCard index={3} title={t("paymentHeading")} hint={t("paymentHint")}>
            <PaymentMethodPicker
              value={paymentMethod}
              onChange={setPaymentMethod}
              instapayNumber={instapayNumber}
              vodafoneCashNumber={vodafoneCashNumber}
              proofFile={proofFile}
              onProofChange={setProofFile}
            />
            <p className="text-caption mt-5 border-s-2 border-primary ps-3">{t("whatsappHint")}</p>
          </SectionCard>

          {submitError && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-s-2 border-primary-deep bg-primary-deep/5 px-3 py-2 text-caption text-primary-deep"
            >
              {submitError}
            </motion.p>
          )}

          <motion.div variants={section}>
            <Button type="submit" size="lg" disabled={submitting} className="w-full">
              {submitting ? t("submitting") : t("submit")}
            </Button>
          </motion.div>
        </motion.form>

        <motion.aside
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="h-fit border border-border bg-surface p-6 shadow-soft lg:sticky lg:top-32"
        >
          <h2 className="text-h3 mb-6 text-base">{t("orderSummary")}</h2>
          <div className="flex flex-col gap-4">
            {cart.items.map((item) => (
              <div key={`${item.productId}-${item.variantId}`} className="flex gap-3">
                <div className="relative h-16 w-14 shrink-0 overflow-hidden border border-border bg-surface-muted">
                  {item.image ? (
                    <Image src={item.image} alt={item.name[locale]} fill sizes="56px" className="object-contain p-1" />
                  ) : (
                    <BottleArt shape={item.bottleShape} liquidColor={item.heroColor} className="h-full w-full" />
                  )}
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
          <div className="mt-6 flex flex-col gap-2 border-t border-border pt-4">
            <div className="flex items-center justify-between text-caption text-muted-foreground">
              <span>{tc("subtotal")}</span>
              <span>
                {cart.subtotal.toLocaleString(locale)} {tc("currency")}
              </span>
            </div>
            <div className="flex items-center justify-between text-caption text-muted-foreground">
              <span>{t("shippingLabel")}</span>
              <span>
                {form.governorate
                  ? shippingCost > 0
                    ? `${shippingCost.toLocaleString(locale)} ${tc("currency")}`
                    : t("shippingFree")
                  : "—"}
              </span>
            </div>
            <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
              <span className="text-h3 text-base">{tc("total")}</span>
              <span className="text-h3 text-base font-medium text-primary-deep">
                {(cart.subtotal + shippingCost).toLocaleString(locale)} {tc("currency")}
              </span>
            </div>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
