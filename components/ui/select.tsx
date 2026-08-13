"use client";

import { Select as BaseSelect } from "@base-ui/react/select";
import { ChevronIcon, CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

export type SelectOption = {
  value: string;
  label: string;
  hint?: string;
};

export function Select({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  icon: Icon,
  className,
}: {
  id?: string;
  value: string | null;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <BaseSelect.Root
      value={value}
      onValueChange={(v) => {
        if (typeof v === "string") onValueChange(v);
      }}
      items={options}
    >
      <BaseSelect.Trigger
        id={id}
        className={cn(
          "relative flex h-12 w-full items-center justify-between gap-2 border border-border bg-surface px-4 text-body text-foreground transition-colors data-[popup-open]:border-primary",
          Icon && "ps-11",
          className
        )}
      >
        {Icon && (
          <Icon className="pointer-events-none absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        )}
        <BaseSelect.Value
          className={cn(!value && "text-muted-foreground")}
        >
          {(selectedLabel: React.ReactNode) => selectedLabel || placeholder}
        </BaseSelect.Value>
        <BaseSelect.Icon className="shrink-0 text-muted-foreground">
          <ChevronIcon className="h-4 w-4 rotate-90" />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>

      <BaseSelect.Portal>
        <BaseSelect.Positioner className="z-[70] outline-none" sideOffset={6}>
          <BaseSelect.Popup
            className={cn(
              "max-h-80 w-[var(--anchor-width)] overflow-y-auto border border-border bg-surface shadow-lifted",
              "origin-[var(--transform-origin)] transition-[transform,opacity] duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]",
              "data-[starting-style]:scale-95 data-[starting-style]:opacity-0",
              "data-[ending-style]:scale-95 data-[ending-style]:opacity-0"
            )}
          >
            {options.map((opt) => (
              <BaseSelect.Item
                key={opt.value}
                value={opt.value}
                className="group flex cursor-pointer items-center justify-between gap-3 px-4 py-3 text-body text-foreground outline-none transition-colors data-[highlighted]:bg-primary/10 data-[selected]:text-primary-deep"
              >
                <span className="flex items-center gap-2">
                  <CheckIcon className="h-3.5 w-3.5 shrink-0 text-primary opacity-0 group-data-[selected]:opacity-100" />
                  <BaseSelect.ItemText>{opt.label}</BaseSelect.ItemText>
                </span>
                {opt.hint && <span className="text-caption text-muted-foreground">{opt.hint}</span>}
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}
