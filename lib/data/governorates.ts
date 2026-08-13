export const EGYPT_GOVERNORATES = [
  { slug: "cairo", ar: "القاهرة", en: "Cairo" },
  { slug: "giza", ar: "الجيزة", en: "Giza" },
  { slug: "alexandria", ar: "الإسكندرية", en: "Alexandria" },
  { slug: "dakahlia", ar: "الدقهلية", en: "Dakahlia" },
  { slug: "red-sea", ar: "البحر الأحمر", en: "Red Sea" },
  { slug: "beheira", ar: "البحيرة", en: "Beheira" },
  { slug: "fayoum", ar: "الفيوم", en: "Fayoum" },
  { slug: "gharbia", ar: "الغربية", en: "Gharbia" },
  { slug: "ismailia", ar: "الإسماعيلية", en: "Ismailia" },
  { slug: "monufia", ar: "المنوفية", en: "Monufia" },
  { slug: "minya", ar: "المنيا", en: "Minya" },
  { slug: "qalyubia", ar: "القليوبية", en: "Qalyubia" },
  { slug: "new-valley", ar: "الوادي الجديد", en: "New Valley" },
  { slug: "suez", ar: "السويس", en: "Suez" },
  { slug: "aswan", ar: "أسوان", en: "Aswan" },
  { slug: "assiut", ar: "أسيوط", en: "Assiut" },
  { slug: "beni-suef", ar: "بني سويف", en: "Beni Suef" },
  { slug: "port-said", ar: "بورسعيد", en: "Port Said" },
  { slug: "damietta", ar: "دمياط", en: "Damietta" },
  { slug: "sharqia", ar: "الشرقية", en: "Sharqia" },
  { slug: "south-sinai", ar: "جنوب سيناء", en: "South Sinai" },
  { slug: "kafr-el-sheikh", ar: "كفر الشيخ", en: "Kafr El Sheikh" },
  { slug: "matrouh", ar: "مطروح", en: "Matrouh" },
  { slug: "luxor", ar: "الأقصر", en: "Luxor" },
  { slug: "qena", ar: "قنا", en: "Qena" },
  { slug: "north-sinai", ar: "شمال سيناء", en: "North Sinai" },
  { slug: "sohag", ar: "سوهاج", en: "Sohag" },
] as const;

export type GovernorateSlug = (typeof EGYPT_GOVERNORATES)[number]["slug"];

export const GOVERNORATE_SLUGS = EGYPT_GOVERNORATES.map((g) => g.slug) as [GovernorateSlug, ...GovernorateSlug[]];

export function governorateLabel(slug: string, locale: "ar" | "en"): string {
  const match = EGYPT_GOVERNORATES.find((g) => g.slug === slug);
  return match ? match[locale] : slug;
}
