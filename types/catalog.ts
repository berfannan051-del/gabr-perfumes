export type Locale = "ar" | "en";

export type LocalizedText = {
  ar: string;
  en: string;
};

export type Gender = "men" | "women" | "unisex";

export type FragranceFamily =
  | "oriental"
  | "woody"
  | "floral"
  | "citrus"
  | "amber"
  | "musk";

export type BottleShape = "tall" | "round" | "faceted";

export type BrandType = "GABR" | "OTHER";

export type Brand = {
  id: string;
  name: string;
  logo: string | null;
};

export type FragranceNote = {
  slug: string;
  name: LocalizedText;
};

export type ProductVariant = {
  id: string;
  sizeMl: number;
  price: number;
  compareAtPrice?: number;
  sku: string;
  inStock: boolean;
};

export type Product = {
  id: string;
  slug: string;
  name: LocalizedText;
  shortDescription: LocalizedText;
  description: LocalizedText;
  gender: Gender;
  family: FragranceFamily;
  collectionSlug: string;
  concentration: LocalizedText;
  bottleShape: BottleShape;
  heroColor: string;
  images: string[];
  brandType: BrandType;
  brand?: Brand | null;
  variants: ProductVariant[];
  notes: {
    top: FragranceNote[];
    heart: FragranceNote[];
    base: FragranceNote[];
  };
  isBestseller?: boolean;
  isNew?: boolean;
  createdAt: string;
};

export type Collection = {
  id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText;
  image: string;
};
