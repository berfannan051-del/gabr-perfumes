"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const layers = [
  { key: "top", opacity: 0.35 },
  { key: "heart", opacity: 0.65 },
  { key: "base", opacity: 1 },
] as const;

export function NotesStory() {
  const t = useTranslations("NotesStory");

  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-label text-primary">{t("eyebrow")}</span>
            <h2 className="text-h1 mt-4">{t("title")}</h2>
          </div>
          <p className="text-body max-w-md text-muted-foreground md:justify-self-end md:text-end">
            {t("body")}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.key}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-15%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: i * 0.15 }}
            >
              <div className="mb-6 h-40 overflow-hidden bg-surface-muted">
                <motion.div
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true, margin: "-15%" }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.15 }}
                  style={{ transformOrigin: "bottom", background: "var(--color-primary)", opacity: layer.opacity }}
                  className="h-full w-full"
                />
              </div>
              <span className="text-label text-muted-foreground">0{i + 1}</span>
              <h3 className="text-h3 mt-2 mb-3">{t(`${layer.key}.label`)}</h3>
              <p className="text-body text-muted-foreground">{t(`${layer.key}.desc`)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
