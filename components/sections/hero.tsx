"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { BottleArt } from "@/components/product/bottle-art";
import { DiamondDivider } from "@/components/brand/diamond-divider";

const container: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export type HeroContent = {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  image?: string;
  video?: string;
};

export function Hero({ content }: { content?: Partial<HeroContent> }) {
  const t = useTranslations("Hero");
  const eyebrow = content?.eyebrow || t("eyebrow");
  const titleLine1 = content?.titleLine1 || t("titleLine1");
  const titleLine2 = content?.titleLine2 || t("titleLine2");
  const subtitle = content?.subtitle || t("subtitle");
  const ctaPrimary = content?.ctaPrimary || t("ctaPrimary");
  const ctaSecondary = content?.ctaSecondary || t("ctaSecondary");
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative flex min-h-[100svh] items-center overflow-hidden bg-foreground">
      {content?.video ? (
        // Full-bleed treatment — looks right when the source video is shot
        // landscape (see the sizing note in HeroContent above). A portrait
        // video here gets cropped hard by object-cover; that's expected.
        <>
          <video autoPlay muted loop playsInline preload="auto" className="absolute inset-0 h-full w-full object-cover">
            <source src={content.video} />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-foreground/45" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,color-mix(in_srgb,var(--color-primary)_18%,transparent),transparent_60%)]" />

          <motion.div
            style={{ y: reduceMotion ? 0 : y, opacity }}
            className="pointer-events-none absolute inset-0 opacity-[0.18] md:inset-y-0 md:start-auto md:end-[-4vw] md:w-[60vw] md:max-w-3xl md:opacity-90"
          >
            <motion.div
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="relative h-full w-full"
            >
              <motion.div
                animate={reduceMotion ? {} : { y: [0, -16, 0] }}
                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                className="relative h-full w-full"
              >
                {content?.image ? (
                  <Image
                    src={content.image}
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 768px) 60vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <BottleArt shape="faceted" liquidColor="#c9a227" className="h-full w-full" />
                )}
              </motion.div>
            </motion.div>
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground via-foreground/50 to-foreground/10 md:hidden" />
        </>
      )}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 mx-auto w-full max-w-7xl px-5 md:px-10"
      >
        <div className="max-w-xl mt-32 md:mt-40">
          <motion.div variants={item} className="mb-6 flex items-center gap-3">
            <DiamondDivider className="w-16" />
            <span className="text-label text-primary-highlight">{eyebrow}</span>
          </motion.div>

          <h1 className="text-background">
            <motion.span variants={item} className="text-h1 block overflow-hidden leading-[1.15]">
              <span className="block pt-2">{titleLine1}</span>
            </motion.span>
            <motion.span variants={item} className="text-h1 block overflow-hidden leading-[1.15]">
              <span className="gold-shimmer block pb-1">{titleLine2}</span>
            </motion.span>
          </h1>

          <motion.p variants={item} className="text-body mt-7 max-w-md text-background/80">
            {subtitle}
          </motion.p>

          <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-primary text-foreground shadow-[0_0_0_rgba(201,162,39,0)] transition-shadow duration-500 hover:bg-primary-highlight hover:shadow-[0_0_50px_-6px_rgba(201,162,39,0.65)]"
              >
                {ctaPrimary}
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" size="lg" className="text-background hover:text-primary-highlight">
                {ctaSecondary}
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-background/70"
      >
        <span className="text-label">{t("scrollHint")}</span>
        <motion.span
          animate={reduceMotion ? {} : { y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          className="h-8 w-px bg-current"
        />
      </motion.div>
    </section>
  );
}
