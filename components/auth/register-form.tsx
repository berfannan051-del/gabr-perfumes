"use client";

import { useActionState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerAction, type AuthActionState } from "@/app/[locale]/(auth)/actions";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();

  const action = registerAction.bind(null, locale);
  const [state, formAction, pending] = useActionState<AuthActionState, FormData>(action, {});

  useEffect(() => {
    if (state.success) {
      // Full navigation so next-auth's SessionProvider remounts with the fresh session
      // instead of staying stale (it only syncs its session state once, on mount).
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/${locale}`;
    }
  }, [state.success, locale]);

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-24">
      <h1 className="text-h1 mb-10 text-center">{t("registerTitle")}</h1>
      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" name="name" type="text" required minLength={2} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" required />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" name="password" type="password" required minLength={8} />
        </div>
        {state.error && <p className="text-caption text-primary-deep">{t(`errors.${state.error}`)}</p>}
        <Button type="submit" size="lg" disabled={pending || state.success} className="mt-2">
          {pending ? t("submitting") : t("registerCta")}
        </Button>
      </form>
      <p className="text-caption mt-6 text-center">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          {t("signInInstead")}
        </Link>
      </p>
    </div>
  );
}
