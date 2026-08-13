"use client";

import { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/admin/ui/toast";
import { EGYPT_GOVERNORATES } from "@/lib/data/governorates";
import { saveShippingRates } from "@/app/[locale]/admin/shipping/actions";
import type { Locale } from "@/types/catalog";

export function ShippingRatesManager({ rates }: { rates: Record<string, number> }) {
  const t = useTranslations("Admin.shipping");
  const tc = useTranslations("Common");
  const locale = useLocale() as Locale;
  const toast = useToast();
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const g of EGYPT_GOVERNORATES) initial[g.slug] = String(rates[g.slug] ?? 0);
    return initial;
  });
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function save() {
    setError(null);
    startTransition(async () => {
      const data = new FormData();
      for (const g of EGYPT_GOVERNORATES) data.set(g.slug, values[g.slug] ?? "0");

      const result = await saveShippingRates(data);
      if ("error" in result) {
        setError(t("errorInvalid"));
        return;
      }
      toast.show(t("saved"));
      router.refresh();
    });
  }

  return (
    <div className="border border-border bg-surface p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {EGYPT_GOVERNORATES.map((g) => (
          <div key={g.slug} className="flex flex-col gap-2">
            <Label htmlFor={`rate-${g.slug}`}>{g[locale]}</Label>
            <div className="relative">
              <Input
                id={`rate-${g.slug}`}
                type="number"
                min={0}
                step="0.01"
                inputMode="decimal"
                value={values[g.slug] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [g.slug]: e.target.value }))}
                className="pe-14"
              />
              <span className="text-caption pointer-events-none absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                {tc("currency")}
              </span>
            </div>
          </div>
        ))}
      </div>

      {error && <p className="text-caption mt-4 text-primary-deep">{error}</p>}

      <div className="mt-8 flex justify-end">
        <Button type="button" onClick={save} disabled={pending}>
          {pending ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
