import type { Collection } from "../../types/catalog";

export const collections: Collection[] = [
  {
    id: "col-1",
    slug: "royal-diwan",
    name: { ar: "الديوان الملكي", en: "The Royal Diwan" },
    description: {
      ar: "عطور عودية عريقة، بحضور ملكي يليق بالمقامات الرفيعة.",
      en: "Rich, regal oud compositions with a presence made for grand occasions.",
    },
    image: "royal-diwan",
    coverImage: null,
  },
  {
    id: "col-2",
    slug: "jasmine-veil",
    name: { ar: "نفحة الياسمين", en: "Jasmine Veil" },
    description: {
      ar: "تراكيب زهرية شفافة، تحتفي بأنوثة هادئة وحضور آسر.",
      en: "Sheer floral compositions celebrating quiet femininity and quiet power.",
    },
    image: "jasmine-veil",
    coverImage: null,
  },
  {
    id: "col-3",
    slug: "amber-signature",
    name: { ar: "توقيع العنبر", en: "Amber Signature" },
    description: {
      ar: "دفء العنبر والمسك، بصمة عطرية تدوم حتى آخر الليل.",
      en: "The warmth of amber and musk — a signature that lasts long into the night.",
    },
    image: "amber-signature",
    coverImage: null,
  },
  {
    id: "col-4",
    slug: "cairo-nights",
    name: { ar: "ليالي القاهرة", en: "Cairo Nights" },
    description: {
      ar: "مجموعة معاصرة مستوحاة من نبض المدينة العريقة بعد غروب الشمس.",
      en: "A contemporary edit inspired by the pulse of the old city after sunset.",
    },
    image: "cairo-nights",
    coverImage: null,
  },
];
