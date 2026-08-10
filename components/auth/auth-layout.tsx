"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { DiamondDivider } from "@/components/brand/diamond-divider";
import { BottleArt } from "@/components/product/bottle-art";

export function AuthLayout({
  tagline,
  children,
}: {
  tagline: string;
  children: React.ReactNode;
}) {
  const tc = useTranslations("Common");

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-foreground lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,color-mix(in_srgb,var(--color-primary)_20%,transparent),transparent_60%)]" />
        <div className="pointer-events-none absolute inset-y-0 end-[-12%] w-[55%] opacity-[0.15]">
          <BottleArt shape="faceted" liquidColor="#c9a227" className="h-full w-full" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 flex flex-col items-center gap-8 px-10 text-center"
        >
          <Logo size="lg" />
          <DiamondDivider className="w-24" />
          <p className="text-body max-w-sm text-background/75">{tagline}</p>
        </motion.div>
      </div>

      <div className="flex min-h-screen flex-col justify-center px-6 py-16 sm:px-12 lg:px-20">
        <div className="mx-auto flex w-full max-w-sm flex-col">
          <div className="mb-10 flex flex-col items-center lg:hidden">
            <Logo size="md" />
          </div>

          <Link
            href="/"
            className="text-caption mb-8 hidden text-muted-foreground transition-colors hover:text-primary lg:inline-block"
          >
            {tc("back")}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
