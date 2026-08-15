import { SiteShell } from "@/components/layout/site-shell";
import { SocialFab } from "@/components/layout/social-fab";
import { getAllProducts } from "@/lib/data/products";
import { getSiteContentMap, pick } from "@/lib/data/site-content";
import { incrementAndGetVisitCount } from "@/lib/data/site-stats";
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
  const [products, siteContent, visitCount] = await Promise.all([
    getAllProducts(),
    getSiteContentMap(),
    incrementAndGetVisitCount(),
  ]);

  const footerContent = {
    about: pick(siteContent, "footer.about", l),
    contactEmail: pick(siteContent, "settings.contactEmail", l),
    contactPhone: pick(siteContent, "settings.contactPhone", l),
    visitCount,
  };

  const promoText = pick(siteContent, "promo.text", l) || undefined;
  const headerLogo = pick(siteContent, "header.image", l) || undefined;

  const socialLinks = {
    instagram: pick(siteContent, "settings.instagramUrl", l) || undefined,
    facebook: pick(siteContent, "settings.facebookUrl", l) || undefined,
    tiktok: pick(siteContent, "settings.tiktokUrl", l) || undefined,
    whatsapp: pick(siteContent, "settings.whatsappNumber", l) || undefined,
  };

  return (
    <>
      <SiteShell products={products} footerContent={footerContent} promoText={promoText} headerLogo={headerLogo}>
        {children}
      </SiteShell>
      <SocialFab links={socialLinks} />
    </>
  );
}
