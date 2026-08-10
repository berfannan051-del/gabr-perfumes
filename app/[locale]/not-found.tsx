import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@/components/ui/button";
import { DiamondDivider } from "@/components/brand/diamond-divider";

export default async function NotFound() {
  const t = await getTranslations("Common");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-5 text-center">
      <span className="text-display text-primary">404</span>
      <DiamondDivider className="my-6 w-24" />
      <h1 className="text-h2 mb-4">{t("notFoundTitle")}</h1>
      <p className="text-body mb-8 text-muted-foreground">{t("notFoundBody")}</p>
      <Link href="/" className={buttonVariants()}>
        {t("notFoundCta")}
      </Link>
    </div>
  );
}
