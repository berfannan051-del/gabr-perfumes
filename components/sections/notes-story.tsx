"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

const iconBase = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function TopNoteIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 3c-3.2 4-6 7.6-6 11.2a6 6 0 0 0 12 0C18 10.6 15.2 7 12 3Z" />
      <path d="M12 8.5c-1.3 1.8-2.3 3.2-2.3 4.7" />
    </svg>
  );
}

function HeartNoteIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 20.5s-7.5-4.8-10-9.6C.5 7.4 2.4 4 6 4c2.1 0 3.7 1.2 6 3.6C14.3 5.2 15.9 4 18 4c3.6 0 5.5 3.4 4 6.9-2.5 4.8-10 9.6-10 9.6Z" />
    </svg>
  );
}

function BaseNoteIcon(props: React.SVGAttributes<SVGSVGElement>) {
  return (
    <svg {...iconBase} {...props}>
      <path d="M12 3.5 19.5 8v8L12 20.5 4.5 16V8Z" />
      <path d="M12 3.5V12M12 12l7.5-4M12 12l-7.5-4M12 12v8.5" />
    </svg>
  );
}

const layers = [
  { key: "top", opacity: 0.35, Icon: TopNoteIcon },
  { key: "heart", opacity: 0.65, Icon: HeartNoteIcon },
  { key: "base", opacity: 1, Icon: BaseNoteIcon },
] as const;

export type NotesStoryContent = {
  eyebrow: string;
  title: string;
  body: string;
};

export function NotesStory({ content }: { content?: Partial<NotesStoryContent> }) {
  const t = useTranslations("NotesStory");
  const eyebrow = content?.eyebrow || t("eyebrow");
  const title = content?.title || t("title");
  const body = content?.body || t("body");

  return (
    <section className="py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-2 md:items-end">
          <div>
            <span className="text-label text-primary">{eyebrow}</span>
            <h2 className="text-h1 mt-4">{title}</h2>
          </div>
          <p className="text-body max-w-md text-muted-foreground md:justify-self-end md:text-end">
            {body}
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
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-primary/40 text-primary">
                <layer.Icon className="h-5 w-5" />
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
