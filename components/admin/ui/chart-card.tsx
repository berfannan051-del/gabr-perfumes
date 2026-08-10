export function AdminChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border bg-surface p-5">
      <div className="mb-4">
        <h3 className="text-h3 text-base">{title}</h3>
        {subtitle && <p className="text-caption mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
