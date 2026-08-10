import { getTranslations } from "next-intl/server";
import { getSiteContentMap, SITE_CONTENT_FIELDS } from "@/lib/data/site-content";
import { SiteContentTabs } from "@/components/admin/site-content-tabs";

export default async function AdminContentPage() {
  const t = await getTranslations("Admin.content");
  const values = await getSiteContentMap();

  const sections = [
    { id: "homepage", label: t("tabHomepage") },
    { id: "about", label: t("tabAbout") },
    { id: "footer", label: t("tabFooter") },
  ];

  const fields = SITE_CONTENT_FIELDS.filter((f) => f.section !== "settings");

  return (
    <div>
      <h1 className="text-h2 mb-6">{t("title")}</h1>
      <SiteContentTabs sections={sections} fields={fields} initialValues={values} />
    </div>
  );
}
