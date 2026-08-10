"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { DiamondDivider } from "@/components/brand/diamond-divider";
import { BottleArt } from "@/components/product/bottle-art";

export type StoryContent = {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  image?: string;
};

export function Story({ content }: { content?: Partial<StoryContent> }) {
  const t = useTranslations("Story");
  const eyebrow = content?.eyebrow || t("eyebrow");
  const title = content?.title || t("title");
  const body = content?.body || t("body");
  const cta = content?.cta || t("cta");

  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-5 md:grid-cols-2 md:px-10">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 aspect-[3/4] max-w-md md:order-1"
        >
          <div className="absolute -inset-6 border border-border" />
          <div className="relative h-full w-full bg-surface-muted">
            {content?.image ? (
              <Image src={content.image} alt="" fill sizes="(min-width: 768px) 40vw, 90vw" className="object-cover" />
            ) : (
              <BottleArt shape="round" liquidColor="#9c3b41" className="h-full w-full" />
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="order-1 md:order-2"
        >
          <span className="text-label text-primary">{eyebrow}</span>
          <h2 className="text-h1 mt-4 mb-8 max-w-md">{title}</h2>
          <p
            className="text-h3 mb-8 max-w-md text-muted-foreground"
            style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}
          >
            {body}
          </p>
          <DiamondDivider className="mb-8 max-w-40" />
          <Link href="/about" className="text-label border-b border-primary pb-1 text-primary transition-opacity hover:opacity-70">
            {cta}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
