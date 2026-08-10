import { prisma } from "@/lib/prisma";
import type { Locale } from "@/types/catalog";

export const SITE_CONTENT_FIELDS = [
  { key: "hero.eyebrow", type: "TEXT", section: "homepage" },
  { key: "hero.titleLine1", type: "TEXT", section: "homepage" },
  { key: "hero.titleLine2", type: "TEXT", section: "homepage" },
  { key: "hero.subtitle", type: "TEXT", section: "homepage", multiline: true },
  { key: "hero.ctaPrimary", type: "TEXT", section: "homepage" },
  { key: "hero.ctaSecondary", type: "TEXT", section: "homepage" },
  { key: "story.eyebrow", type: "TEXT", section: "homepage" },
  { key: "story.title", type: "TEXT", section: "homepage" },
  { key: "story.body", type: "TEXT", section: "homepage", multiline: true },
  { key: "story.cta", type: "TEXT", section: "homepage" },
  { key: "story.image", type: "IMAGE", section: "homepage" },
  { key: "notesStory.eyebrow", type: "TEXT", section: "homepage" },
  { key: "notesStory.title", type: "TEXT", section: "homepage" },
  { key: "notesStory.body", type: "TEXT", section: "homepage", multiline: true },
  { key: "about.title", type: "TEXT", section: "about" },
  { key: "about.intro", type: "TEXT", section: "about", multiline: true },
  { key: "about.paragraph1", type: "TEXT", section: "about", multiline: true },
  { key: "about.paragraph2", type: "TEXT", section: "about", multiline: true },
  { key: "about.paragraph3", type: "TEXT", section: "about", multiline: true },
  { key: "about.quote", type: "TEXT", section: "about", multiline: true },
  { key: "about.quoteAuthor", type: "TEXT", section: "about" },
  { key: "about.heroImage", type: "IMAGE", section: "about" },
  { key: "footer.about", type: "TEXT", section: "footer", multiline: true },
  { key: "settings.contactEmail", type: "TEXT", section: "settings" },
  { key: "settings.contactPhone", type: "TEXT", section: "settings" },
] as const satisfies ReadonlyArray<{
  key: string;
  type: "TEXT" | "IMAGE";
  section: "homepage" | "about" | "footer" | "settings";
  multiline?: boolean;
}>;

export type SiteContentKey = (typeof SITE_CONTENT_FIELDS)[number]["key"];
export type SiteContentMap = Record<string, { ar: string; en: string }>;

export async function getSiteContentMap(): Promise<SiteContentMap> {
  const rows = await prisma.siteContent.findMany();
  const map: SiteContentMap = {};
  for (const row of rows) {
    map[row.key] = { ar: row.valueAr, en: row.valueEn };
  }
  return map;
}

export function pick(map: SiteContentMap, key: SiteContentKey, locale: Locale, fallback = ""): string {
  return map[key]?.[locale] ?? fallback;
}
