import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { DiamondDivider } from "@/components/brand/diamond-divider";
import { MailIcon, PhoneIcon, WhatsAppIcon, InstagramIcon, FacebookIcon, TikTokIcon } from "@/components/ui/icons";
import { getSiteContentMap, pick } from "@/lib/data/site-content";
import { toWhatsAppNumber } from "@/lib/phone";
import type { Locale } from "@/types/catalog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return { title: t("title") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const l = locale as Locale;
  const t = await getTranslations({ locale, namespace: "Contact" });
  const siteContent = await getSiteContentMap();

  const email = pick(siteContent, "settings.contactEmail", l) || "gabrparfum@gmail.com";
  const phone = pick(siteContent, "settings.contactPhone", l) || "+20 100 000 0000";
  const whatsapp = pick(siteContent, "settings.whatsappNumber", l);

  const socialLinks = [
    { href: pick(siteContent, "settings.instagramUrl", l), Icon: InstagramIcon, label: "Instagram" },
    { href: pick(siteContent, "settings.facebookUrl", l), Icon: FacebookIcon, label: "Facebook" },
    { href: pick(siteContent, "settings.tiktokUrl", l), Icon: TikTokIcon, label: "TikTok" },
  ].filter((s) => s.href);

  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 md:px-10">
      <span className="text-label text-primary">{t("eyebrow")}</span>
      <h1 className="text-h1 mt-4 mb-3">{t("title")}</h1>
      <p className="text-body mb-12 max-w-xl text-muted-foreground">{t("intro")}</p>

      <DiamondDivider className="mb-12" />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <a
          href={`mailto:${email}`}
          className="flex items-center gap-4 border border-border p-6 transition-colors hover:border-primary"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <MailIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-label text-muted-foreground">{t("emailLabel")}</p>
            <p className="text-body mt-1" dir="ltr">
              {email}
            </p>
          </div>
        </a>

        <a
          href={`tel:${phone.replace(/\s+/g, "")}`}
          className="flex items-center gap-4 border border-border p-6 transition-colors hover:border-primary"
        >
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
            <PhoneIcon className="h-5 w-5" />
          </span>
          <div>
            <p className="text-label text-muted-foreground">{t("phoneLabel")}</p>
            <p className="text-body mt-1" dir="ltr">
              {phone}
            </p>
          </div>
        </a>
      </div>

      {whatsapp && (
        <a
          href={`https://wa.me/${toWhatsAppNumber(whatsapp)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 flex items-center justify-center gap-3 border border-primary bg-primary/5 p-5 text-body text-primary-deep transition-colors hover:bg-primary hover:text-background"
        >
          <WhatsAppIcon className="h-5 w-5" />
          {t("whatsappCta")}
        </a>
      )}

      {socialLinks.length > 0 && (
        <div className="mt-14 text-center">
          <p className="text-label mb-4 text-muted-foreground">{t("socialLabel")}</p>
          <div className="flex items-center justify-center gap-4">
            {socialLinks.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:border-primary hover:text-primary"
              >
                <s.Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
