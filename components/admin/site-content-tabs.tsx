"use client";

import { useState } from "react";
import { SiteContentEditor, type SiteContentField } from "@/components/admin/site-content-editor";
import type { SiteContentMap } from "@/lib/data/site-content";
import { cn } from "@/lib/cn";

export function SiteContentTabs({
  sections,
  fields,
  initialValues,
}: {
  sections: { id: string; label: string }[];
  fields: readonly SiteContentField[];
  initialValues: SiteContentMap;
}) {
  const [active, setActive] = useState(sections[0]?.id ?? "");

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2 border-b border-border">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(s.id)}
            className={cn(
              "border-b-2 px-4 py-2 text-body transition-colors",
              active === s.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {s.label}
          </button>
        ))}
      </div>

      <SiteContentEditor fields={fields.filter((f) => f.section === active)} initialValues={initialValues} />
    </div>
  );
}
