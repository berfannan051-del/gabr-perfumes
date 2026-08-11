import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/brand/logo";
import { DiamondDivider } from "@/components/brand/diamond-divider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type FooterContent = {
  about: string;
  contactEmail: string;
  contactPhone: string;
  visitCount: number;
};

export function Footer({ content }: { content?: Partial<FooterContent> }) {
  const t = useTranslations("Footer");
  const tn = useTranslations("Newsletter");
  const year = new Date().getFullYear();
  const about = content?.about || t("about");
  const contactEmail = content?.contactEmail || "hello@gabrperfumes.com";
  const contactPhone = content?.contactPhone || "+20 100 000 0000";

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-10 md:py-24">
        <div className="mb-16 flex flex-col items-center gap-6 text-center">
          <span className="text-label text-muted-foreground">{tn("title")}</span>
          <h3 className="text-h2 max-w-lg">{tn("body")}</h3>
          <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
            <Input type="email" required placeholder={tn("placeholder")} />
            <Button type="submit" className="shrink-0">
              {tn("cta")}
            </Button>
          </form>
        </div>

        <DiamondDivider className="mb-16" />

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <Logo size="sm" className="mb-4 items-start text-start" />
            <p className="text-caption max-w-56">{about}</p>
          </div>

          <div>
            <h4 className="text-label mb-4">{t("shopHeading")}</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/shop" className="text-body hover:text-primary transition-colors">{t("shopLinks.all")}</Link></li>
              <li><Link href="/shop?gender=men" className="text-body hover:text-primary transition-colors">{t("shopLinks.men")}</Link></li>
              <li><Link href="/shop?gender=women" className="text-body hover:text-primary transition-colors">{t("shopLinks.women")}</Link></li>
              <li><Link href="/collections" className="text-body hover:text-primary transition-colors">{t("shopLinks.collections")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-label mb-4">{t("companyHeading")}</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link href="/about" className="text-body hover:text-primary transition-colors">{t("companyLinks.about")}</Link></li>
              <li><Link href="/contact" className="text-body hover:text-primary transition-colors">{t("companyLinks.contact")}</Link></li>
              <li><Link href="/terms" className="text-body hover:text-primary transition-colors">{t("companyLinks.terms")}</Link></li>
              <li><Link href="/privacy" className="text-body hover:text-primary transition-colors">{t("companyLinks.privacy")}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-label mb-4">{t("contactHeading")}</h4>
            <ul className="flex flex-col gap-2.5 text-body">
              <li>{contactEmail}</li>
              <li dir="ltr" className="text-end md:text-start">{contactPhone}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-caption sm:flex-row">
          <p>© {year} GABR Perfumes — {t("rights")}</p>
          {typeof content?.visitCount === "number" && content.visitCount > 0 && (
            <p>{t("visitCount", { count: content.visitCount })}</p>
          )}
          <p>{t("madeWith")}</p>
        </div>
      </div>
    </footer>
  );
}
