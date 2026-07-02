"use client";

import type { ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";

export type ConfirmDialogState = {
  title: string;
  body: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
};

export function ConfirmDialog({
  dialog,
  onClose,
}: {
  dialog: ConfirmDialogState | null;
  onClose: () => void;
}) {
  if (!dialog) {
    return null;
  }

  function confirm() {
    dialog?.onConfirm();
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-journey-black/70 px-4 py-6"
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="w-full max-w-lg rounded-lg border border-journey-line bg-journey-white p-5 shadow-2xl"
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-journey-black text-journey-white">
            <AlertTriangle className="h-5 w-5 text-journey-red" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase text-journey-red">
              Confirm Delete
            </p>
            <h2 id="confirm-dialog-title" className="mt-1 text-2xl font-black text-journey-black">
              {dialog.title}
            </h2>
          </div>
        </div>

        <div className="mt-4 text-sm font-bold leading-6 text-journey-steel">
          {dialog.body}
        </div>

        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {dialog.cancelLabel ?? "Cancel"}
          </Button>
          <Button
            type="button"
            variant={dialog.destructive ? "primary" : "dark"}
            onClick={confirm}
          >
            {dialog.confirmLabel ?? "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
