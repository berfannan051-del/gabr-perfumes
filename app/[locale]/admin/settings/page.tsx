import { getTranslations } from "next-intl/server";
import { getSiteContentMap, SITE_CONTENT_FIELDS } from "@/lib/data/site-content";
import { SiteContentEditor } from "@/components/admin/site-content-editor";

export default async function AdminSettingsPage() {
  const t = await getTranslations("Admin.content");
  const values = await getSiteContentMap();
  const fields = SITE_CONTENT_FIELDS.filter((f) => f.section === "settings");

  return (
    <div>
      <h1 className="text-h2 mb-6">{t("tabSettings")}</h1>
      <SiteContentEditor fields={fields} initialValues={values} />
    </div>
  );
}
