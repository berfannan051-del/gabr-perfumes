"use client";

import { useActionState, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EyeIcon, EyeOffIcon } from "@/components/ui/icons";
import { AuthLayout } from "@/components/auth/auth-layout";
import { registerAction, type AuthActionState } from "@/app/[locale]/(auth)/actions";

export function RegisterForm() {
  const t = useTranslations("Auth");
  const locale = useLocale();
  const [showPassword, setShowPassword] = useState(false);

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
    <AuthLayout tagline={t("tagline")}>
      <h1 className="text-h1 mb-2 text-center lg:text-start">{t("registerTitle")}</h1>
      <p className="text-body mb-9 text-center text-muted-foreground lg:text-start">{t("registerSubtitle")}</p>

      <form action={formAction} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input id="name" name="name" type="text" required minLength={2} disabled={pending || state.success} autoComplete="name" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input id="email" name="email" type="email" required disabled={pending || state.success} autoComplete="email" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              minLength={8}
              disabled={pending || state.success}
              autoComplete="new-password"
              className="pe-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? t("hidePassword") : t("showPassword")}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-primary"
            >
              {showPassword ? <EyeOffIcon className="h-4.5 w-4.5" /> : <EyeIcon className="h-4.5 w-4.5" />}
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {state.error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="text-caption border-s-2 border-primary-deep bg-primary-deep/5 px-3 py-2 text-primary-deep"
            >
              {t(`errors.${state.error}`)}
            </motion.p>
          )}
        </AnimatePresence>

        <Button type="submit" size="lg" disabled={pending || state.success} className="mt-2">
          {state.success ? t("signedIn") : pending ? t("submitting") : t("registerCta")}
        </Button>
      </form>

      <p className="text-caption mt-8 text-center lg:text-start">
        {t("haveAccount")}{" "}
        <Link href="/login" className="text-primary underline-offset-4 hover:underline">
          {t("signInInstead")}
        </Link>
      </p>
    </AuthLayout>
  );
}
