import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { DiamondDivider } from "@/components/brand/diamond-divider";
import { BottleArt } from "@/components/product/bottle-art";
import { getSiteContentMap, pick } from "@/lib/data/site-content";
import type { Locale } from "@/types/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return { title: t("eyebrow") };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "About" });
  const siteContent = await getSiteContentMap();
  const c = (key: Parameters<typeof pick>[1], fallback: string) => pick(siteContent, key, l, fallback) || fallback;

  const eyebrow = t("eyebrow");
  const title = c("about.title", t("title"));
  const intro = c("about.intro", t("intro"));
  const paragraph1 = c("about.paragraph1", t("paragraph1"));
  const paragraph2 = c("about.paragraph2", t("paragraph2"));
  const paragraph3 = c("about.paragraph3", t("paragraph3"));
  const quote = c("about.quote", t("quote"));
  const quoteAuthor = c("about.quoteAuthor", t("quoteAuthor"));
  const heroImage = pick(siteContent, "about.heroImage", l);

  const values = [1, 2, 3].map((i) => ({
    title: t(`value${i}Title` as "value1Title"),
    body: t(`value${i}Body` as "value1Body"),
  }));

  return (
    <div>
      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-foreground">
        <div className="pointer-events-none absolute inset-y-0 end-0 w-[50vw] max-w-2xl opacity-80">
          {heroImage ? (
            <Image src={heroImage} alt="" fill sizes="50vw" className="object-cover" />
          ) : (
            <BottleArt shape="tall" liquidColor="#c9a227" className="h-full w-full" />
          )}
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-24 md:px-10">
          <div className="max-w-xl">
            <span className="text-label text-primary-highlight">{eyebrow}</span>
            <h1 className="text-h1 mt-4 mb-6 text-background">{title}</h1>
            <p className="text-body text-background/80">{intro}</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-24 md:px-10">
        <div className="flex flex-col gap-6">
          <p className="text-body text-muted-foreground">{paragraph1}</p>
          <p className="text-body text-muted-foreground">{paragraph2}</p>
          <p className="text-body text-muted-foreground">{paragraph3}</p>
        </div>

        <DiamondDivider className="my-16" />

        <blockquote
          className="text-h2 text-center"
          style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontWeight: 400 }}
        >
          “{quote}”
        </blockquote>
        <p className="text-label mt-4 text-center text-muted-foreground">{quoteAuthor}</p>
      </section>

      <section className="bg-surface-muted py-24">
        <div className="mx-auto max-w-7xl px-5 md:px-10">
          <h2 className="text-h2 mb-14 text-center">{t("valuesHeading")}</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {values.map((v, i) => (
              <div key={i} className="text-center">
                <span className="text-label text-muted-foreground">0{i + 1}</span>
                <h3 className="text-h3 mt-3 mb-3">{v.title}</h3>
                <p className="text-body text-muted-foreground">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
