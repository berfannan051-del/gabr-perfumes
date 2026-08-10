"use client";

import { Dialog } from "@base-ui/react/dialog";
import { cn } from "@/lib/cn";

export function Sheet({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          className={cn(
            "fixed inset-y-0 end-0 z-50 flex h-full w-full max-w-md flex-col bg-surface shadow-lifted",
            "transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            "data-starting-style:translate-x-full data-ending-style:translate-x-full",
            "rtl:data-starting-style:-translate-x-full rtl:data-ending-style:-translate-x-full"
          )}
        >
          {children}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export const SheetTitle = Dialog.Title;
export const SheetDescription = Dialog.Description;
export const SheetClose = Dialog.Close;
