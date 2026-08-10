import { Hero } from "@/components/sections/hero";
import { Story } from "@/components/sections/story";
import { Collections } from "@/components/sections/collections";
import { Bestsellers } from "@/components/sections/bestsellers";
import { NotesStory } from "@/components/sections/notes-story";
import { getAllProducts, getBestsellerProducts } from "@/lib/data/products";
import { getCollections } from "@/lib/data/collections";

export default async function HomePage() {
  const [products, bestsellers, collections] = await Promise.all([
    getAllProducts(),
    getBestsellerProducts(),
    getCollections(),
  ]);

  return (
    <>
      <Hero />
      <Story />
      <Collections collections={collections} products={products} />
      <Bestsellers products={bestsellers} />
      <NotesStory />
    </>
  );
}
