"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/admin/ui/toast";
import {
  saveSiteContentText,
  saveSiteContentImage,
  clearSiteContentImage,
} from "@/app/[locale]/admin/content/actions";
import type { SiteContentMap } from "@/lib/data/site-content";

export type SiteContentField = {
  key: string;
  type: "TEXT" | "IMAGE";
  section: string;
  multiline?: boolean;
};

export function SiteContentEditor({
  fields,
  initialValues,
}: {
  fields: readonly SiteContentField[];
  initialValues: SiteContentMap;
}) {
  const t = useTranslations("Admin.content");
  const toast = useToast();
  const [values, setValues] = useState(initialValues);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function updateLocal(key: string, locale: "ar" | "en", value: string) {
    setValues((v) => ({
      ...v,
      [key]: { ar: v[key]?.ar ?? "", en: v[key]?.en ?? "", [locale]: value },
    }));
  }

  function saveText(field: SiteContentField) {
    setPendingKey(field.key);
    startTransition(async () => {
      await saveSiteContentText(field.key, values[field.key]?.ar ?? "", values[field.key]?.en ?? "");
      toast.show(t("saved"));
      setPendingKey(null);
    });
  }

  async function saveImage(field: SiteContentField, file: File) {
    setPendingKey(field.key);
    const data = new FormData();
    data.set("key", field.key);
    data.set("image", file);
    const result = await saveSiteContentImage(data);
    if ("url" in result) {
      setValues((v) => ({ ...v, [field.key]: { ar: result.url, en: result.url } }));
      toast.show(t("saved"));
    } else {
      toast.show(t("uploadError"), "error");
    }
    setPendingKey(null);
  }

  function removeImage(field: SiteContentField) {
    setPendingKey(field.key);
    startTransition(async () => {
      await clearSiteContentImage(field.key);
      setValues((v) => ({ ...v, [field.key]: { ar: "", en: "" } }));
      toast.show(t("saved"));
      setPendingKey(null);
    });
  }

  return (
    <div className="flex flex-col gap-6">
      {fields.map((field, i) => {
        const group = field.key.split(".")[0];
        const previousGroup = i > 0 ? fields[i - 1].key.split(".")[0] : null;
        const showGroupHeading = group !== previousGroup;
        const fieldTKey = field.key.replace(/\./g, "_");

        return (
          <div key={field.key} className="flex flex-col gap-3">
            {showGroupHeading && (
              <h3 className="text-h3 mt-2 text-base first:mt-0">{t(`groups.${group}` as never)}</h3>
            )}
            <div className="border border-border bg-surface p-5">
              <p className="text-label mb-3 text-muted-foreground">{t(`fields.${fieldTKey}` as never)}</p>

              {field.type === "TEXT" ? (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-2">
                      <Label>{t("arabic")}</Label>
                      {field.multiline ? (
                        <Textarea
                          rows={3}
                          dir="rtl"
                          value={values[field.key]?.ar ?? ""}
                          onChange={(e) => updateLocal(field.key, "ar", e.target.value)}
                        />
                      ) : (
                        <Input
                          dir="rtl"
                          value={values[field.key]?.ar ?? ""}
                          onChange={(e) => updateLocal(field.key, "ar", e.target.value)}
                        />
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                      <Label>{t("english")}</Label>
                      {field.multiline ? (
                        <Textarea
                          rows={3}
                          dir="ltr"
                          value={values[field.key]?.en ?? ""}
                          onChange={(e) => updateLocal(field.key, "en", e.target.value)}
                        />
                      ) : (
                        <Input
                          dir="ltr"
                          value={values[field.key]?.en ?? ""}
                          onChange={(e) => updateLocal(field.key, "en", e.target.value)}
                        />
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <Button type="button" size="sm" onClick={() => saveText(field)} disabled={pendingKey === field.key}>
                      {pendingKey === field.key ? t("saving") : t("save")}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <div className="h-20 w-32 shrink-0 overflow-hidden bg-surface-muted">
                    {values[field.key]?.ar ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={values[field.key].ar} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      disabled={pendingKey === field.key}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) saveImage(field, file);
                      }}
                      className="text-caption file:me-4 file:border-0 file:bg-primary file:px-4 file:py-2 file:text-background"
                    />
                    {values[field.key]?.ar && (
                      <button
                        type="button"
                        onClick={() => removeImage(field)}
                        disabled={pendingKey === field.key}
                        className="text-caption self-start text-primary-deep disabled:opacity-50"
                      >
                        {t("removeImage")}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
