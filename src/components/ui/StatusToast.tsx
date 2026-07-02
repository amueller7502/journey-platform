"use client";

export type StatusToastState = {
  tone: "success" | "error";
  message: string;
};

export function StatusToast({ toast }: { toast: StatusToastState | null }) {
  if (!toast) {
    return null;
  }

  return (
    <div
      role="status"
      className={`rounded-lg border p-3 text-sm font-black ${
        toast.tone === "success"
          ? "border-journey-line bg-journey-mist text-journey-black"
          : "border-journey-red bg-journey-white text-journey-red"
      }`}
    >
      {toast.message}
    </div>
  );
}
