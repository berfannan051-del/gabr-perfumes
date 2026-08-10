import { SiteShell } from "@/components/layout/site-shell";
import { getAllProducts } from "@/lib/data/products";
import { getSiteContentMap, pick } from "@/lib/data/site-content";
import type { Locale } from "@/types/catalog";

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const [products, siteContent] = await Promise.all([getAllProducts(), getSiteContentMap()]);

  const footerContent = {
    about: pick(siteContent, "footer.about", l),
    contactEmail: pick(siteContent, "settings.contactEmail", l),
    contactPhone: pick(siteContent, "settings.contactPhone", l),
  };

  return (
    <SiteShell products={products} footerContent={footerContent}>
      {children}
    </SiteShell>
  );
}
