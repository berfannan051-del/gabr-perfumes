import type { FragranceNote } from "../../types/catalog";

export const notes: Record<string, FragranceNote> = {
  oud: { slug: "oud", name: { ar: "عود", en: "Oud" } },
  amber: { slug: "amber", name: { ar: "عنبر", en: "Amber" } },
  rose: { slug: "rose", name: { ar: "ورد", en: "Rose" } },
  saffron: { slug: "saffron", name: { ar: "زعفران", en: "Saffron" } },
  bergamot: { slug: "bergamot", name: { ar: "برغموت", en: "Bergamot" } },
  musk: { slug: "musk", name: { ar: "مسك", en: "Musk" } },
  sandalwood: { slug: "sandalwood", name: { ar: "خشب الصندل", en: "Sandalwood" } },
  jasmine: { slug: "jasmine", name: { ar: "ياسمين", en: "Jasmine" } },
  vanilla: { slug: "vanilla", name: { ar: "فانيليا", en: "Vanilla" } },
  cardamom: { slug: "cardamom", name: { ar: "هيل", en: "Cardamom" } },
  leather: { slug: "leather", name: { ar: "جلد", en: "Leather" } },
  vetiver: { slug: "vetiver", name: { ar: "نجيل الخوص", en: "Vetiver" } },
  citrus: { slug: "citrus", name: { ar: "حمضيات", en: "Citrus" } },
  patchouli: { slug: "patchouli", name: { ar: "باتشولي", en: "Patchouli" } },
  incense: { slug: "incense", name: { ar: "بخور", en: "Incense" } },
};

export function noteList(slugs: string[]): FragranceNote[] {
  return slugs.map((slug) => notes[slug]);
}
