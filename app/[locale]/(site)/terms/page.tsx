import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LegalPage } from "@/components/legal/legal-page";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });
  return { title: t("title") };
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Terms" });

  const sections = [1, 2, 3, 4, 5, 6].map((i) => ({
    title: t(`section${i}Title` as "section1Title"),
    body: t(`section${i}Body` as "section1Body"),
  }));

  return (
    <LegalPage
      eyebrow={t("eyebrow")}
      title={t("title")}
      updatedAt={t("updatedAt")}
      intro={t("intro")}
      sections={sections}
    />
  );
}
