import { Hero } from "@/components/sections/hero";
import { Story } from "@/components/sections/story";
import { GabrProducts } from "@/components/sections/gabr-products";
import { Collections } from "@/components/sections/collections";
import { Bestsellers } from "@/components/sections/bestsellers";
import { NotesStory } from "@/components/sections/notes-story";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { getAllProducts, getBestsellerProducts } from "@/lib/data/products";
import { getCollections } from "@/lib/data/collections";
import { getSiteContentMap, pick } from "@/lib/data/site-content";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/types/catalog";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;

  const [products, bestsellers, collections, siteContent, reviews] = await Promise.all([
    getAllProducts(),
    getBestsellerProducts(),
    getCollections(),
    getSiteContentMap(),
    prisma.review.findMany({ where: { isActive: true }, orderBy: { createdAt: "desc" }, take: 9 }),
  ]);

  const heroContent = {
    eyebrow: pick(siteContent, "hero.eyebrow", l),
    titleLine1: pick(siteContent, "hero.titleLine1", l),
    titleLine2: pick(siteContent, "hero.titleLine2", l),
    subtitle: pick(siteContent, "hero.subtitle", l),
    ctaPrimary: pick(siteContent, "hero.ctaPrimary", l),
    ctaSecondary: pick(siteContent, "hero.ctaSecondary", l),
  };

  const storyContent = {
    eyebrow: pick(siteContent, "story.eyebrow", l),
    title: pick(siteContent, "story.title", l),
    body: pick(siteContent, "story.body", l),
    cta: pick(siteContent, "story.cta", l),
    image: pick(siteContent, "story.image", l),
  };

  const notesStoryContent = {
    eyebrow: pick(siteContent, "notesStory.eyebrow", l),
    title: pick(siteContent, "notesStory.title", l),
    body: pick(siteContent, "notesStory.body", l),
  };

  return (
    <>
      <Hero content={heroContent} />
      <Story content={storyContent} />
      <GabrProducts products={products} />
      <Collections collections={collections} products={products} />
      <Bestsellers products={bestsellers} />
      <NotesStory content={notesStoryContent} />
      <ReviewsSection reviews={reviews} />
    </>
  );
}
