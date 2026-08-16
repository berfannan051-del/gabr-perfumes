import { DiamondDivider } from "@/components/brand/diamond-divider";

export function LegalPage({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: { title: string; body: string }[];
}) {
  return (
    <div className="mx-auto max-w-3xl px-5 pt-32 pb-24 md:px-10">
      <span className="text-label text-primary">{eyebrow}</span>
      <h1 className="text-h1 mt-4 mb-3">{title}</h1>
      <p className="text-caption mb-8 text-muted-foreground">{updatedAt}</p>
      <p className="text-body mb-12 text-muted-foreground">{intro}</p>

      <DiamondDivider className="mb-12" />

      <div className="flex flex-col gap-10">
        {sections.map((s, i) => (
          <div key={i}>
            <h2 className="text-h3 mb-3">{s.title}</h2>
            <p className="text-body text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
