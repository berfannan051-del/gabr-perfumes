"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Label } from "@/components/ui/input";
import { WalletIcon, PhoneIcon, CashIcon, CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type PaymentMethod = "instapay" | "vodafone_cash" | "cash_on_delivery";

const METHODS: { id: PaymentMethod; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "instapay", icon: WalletIcon },
  { id: "vodafone_cash", icon: PhoneIcon },
  { id: "cash_on_delivery", icon: CashIcon },
];

export function PaymentMethodPicker({
  value,
  onChange,
  instapayNumber,
  vodafoneCashNumber,
  proofFile,
  onProofChange,
}: {
  value: PaymentMethod;
  onChange: (m: PaymentMethod) => void;
  instapayNumber: string;
  vodafoneCashNumber: string;
  proofFile: File | null;
  onProofChange: (f: File | null) => void;
}) {
  const t = useTranslations("Checkout");

  const labels: Record<PaymentMethod, { name: string; desc: string }> = {
    instapay: { name: t("instapay"), desc: t("instapayDesc") },
    vodafone_cash: { name: t("vodafoneCash"), desc: t("vodafoneCashDesc") },
    cash_on_delivery: { name: t("cashOnDelivery"), desc: t("cashOnDeliveryDesc") },
  };

  const number = value === "instapay" ? instapayNumber : value === "vodafone_cash" ? vodafoneCashNumber : "";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {METHODS.map(({ id, icon: Icon }) => {
          const active = value === id;
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "relative flex flex-col items-start gap-3 border p-5 text-start transition-colors duration-300",
                active ? "border-primary bg-primary/5" : "border-border hover:border-primary/60"
              )}
            >
              <AnimatePresence>
                {active && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute end-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-primary text-background"
                  >
                    <CheckIcon className="h-3 w-3" />
                  </motion.span>
                )}
              </AnimatePresence>
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border transition-colors duration-300",
                  active ? "border-primary bg-primary text-background" : "border-border text-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="text-body block">{labels[id].name}</span>
                <span className="text-caption block text-muted-foreground">{labels[id].desc}</span>
              </span>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="border border-border bg-surface-muted p-5"
        >
          {value === "cash_on_delivery" ? (
            <p className="text-body">{t("codHint")}</p>
          ) : (
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-label text-muted-foreground">{t("transferToNumber")}</p>
                {number ? (
                  <p className="text-h3 mt-1 text-base" dir="ltr">
                    {number}
                  </p>
                ) : (
                  <p className="text-body mt-1 text-muted-foreground">{t("numberNotSetHint")}</p>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="proof">{t("proofUpload")}</Label>
                <p className="text-caption">{t("proofUploadHint")}</p>
                <input
                  id="proof"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={(e) => onProofChange(e.target.files?.[0] ?? null)}
                  className="text-caption file:me-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-background"
                />
                {proofFile && <p className="text-caption text-primary">{proofFile.name}</p>}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
