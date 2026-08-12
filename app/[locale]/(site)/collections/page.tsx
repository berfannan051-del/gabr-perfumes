import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getCollections } from "@/lib/data/collections";
import { getAllProducts } from "@/lib/data/products";
import { BottleArt } from "@/components/product/bottle-art";
import type { Locale } from "@/types/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Collections" });
  return { title: t("title") };
}

export default async function CollectionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Collections" });
  const [collections, products] = await Promise.all([getCollections(), getAllProducts()]);

  return (
    <div className="mx-auto max-w-7xl px-5 pt-32 pb-24 md:px-10">
      <div className="mb-16 flex flex-col items-center gap-3 text-center">
        <span className="text-label text-primary">{t("eyebrow")}</span>
        <h1 className="text-h1">{t("title")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {collections.map((collection) => {
          const rep = products.find((p) => p.collectionSlug === collection.slug);
          return (
            <Link
              key={collection.id}
              href={`/shop?collection=${collection.slug}`}
              className="group relative block aspect-[4/3] overflow-hidden bg-surface-muted"
            >
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                {collection.coverImage ? (
                  <Image
                    src={collection.coverImage}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-contain"
                  />
                ) : rep ? (
                  <div className="opacity-70">
                    <BottleArt shape={rep.bottleShape} liquidColor={rep.heroColor} className="h-full w-full" />
                  </div>
                ) : null}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent" />
              {collection.image && (
                <div className="absolute start-4 top-4 h-12 w-12 overflow-hidden rounded-full border-2 border-background/80 bg-surface shadow-lifted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={collection.image} alt="" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="relative flex h-full flex-col justify-end p-8">
                <h2 className="text-h2 text-background">{collection.name[l]}</h2>
                <p className="text-body mt-2 max-w-sm text-background/80">{collection.description[l]}</p>
                <span className="text-label mt-5 inline-flex items-center gap-2 text-primary-highlight opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  {t("exploreLabel")}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
