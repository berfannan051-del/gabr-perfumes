import { getTranslations } from "next-intl/server";
import { getShippingRates } from "@/lib/data/shipping";
import { ShippingRatesManager } from "@/components/admin/shipping-rates-manager";

export default async function AdminShippingPage() {
  const t = await getTranslations("Admin.shipping");
  const rates = await getShippingRates();

  return (
    <div>
      <h1 className="text-h2 mb-2">{t("title")}</h1>
      <p className="text-caption mb-8 text-muted-foreground">{t("subtitle")}</p>
      <ShippingRatesManager rates={rates} />
    </div>
  );
}
