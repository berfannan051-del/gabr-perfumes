"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/cn";

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  destructive = true,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive?: boolean;
  onConfirm: () => void;
}) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-[2px] transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-[60] w-full max-w-sm -translate-x-1/2 -translate-y-1/2 border border-border bg-surface p-6 shadow-lifted transition-all duration-200 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <AlertDialog.Title className="text-h3 mb-2">{title}</AlertDialog.Title>
          <AlertDialog.Description className="text-body mb-6 text-muted-foreground">
            {description}
          </AlertDialog.Description>
          <div className="flex justify-end gap-3">
            <AlertDialog.Close className={buttonVariants({ variant: "outline", size: "sm" })}>
              {cancelLabel}
            </AlertDialog.Close>
            <AlertDialog.Close
              onClick={onConfirm}
              className={cn(
                buttonVariants({ size: "sm" }),
                destructive && "bg-primary-deep text-background hover:bg-foreground"
              )}
            >
              {confirmLabel}
            </AlertDialog.Close>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
