"use client";

import { motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import type { FragranceNote, Locale } from "@/types/catalog";

export function NotesVisualizer({
  top,
  heart,
  base,
}: {
  top: FragranceNote[];
  heart: FragranceNote[];
  base: FragranceNote[];
}) {
  const t = useTranslations("Product");
  const locale = useLocale() as Locale;

  const rows = [
    { label: t("top"), notes: top, opacity: 0.35 },
    { label: t("heart"), notes: heart, opacity: 0.65 },
    { label: t("base"), notes: base, opacity: 1 },
  ];

  return (
    <div className="flex flex-col gap-6">
      {rows.map((row, i) => (
        <div key={row.label} className="flex items-start gap-5">
          <div className="w-24 shrink-0 pt-1">
            <span className="text-label text-muted-foreground">{row.label}</span>
          </div>
          <div className="flex flex-1 flex-wrap items-center gap-2">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: "left", background: "var(--color-primary)", opacity: row.opacity }}
              className="me-2 h-px w-8 origin-start"
            />
            {row.notes.map((note) => (
              <span
                key={note.slug}
                className="border border-border px-3 py-1.5 text-caption"
              >
                {note.name[locale]}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
