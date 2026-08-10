"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = routing.locales.find((l) => l !== locale) ?? locale;

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: nextLocale })}
      className={className}
      aria-label={t("language")}
    >
      {t("language")}
    </button>
  );
}
