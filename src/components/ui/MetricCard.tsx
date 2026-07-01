import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "light",
}: {
  label: string;
  value: string;
  detail?: string;
  icon: LucideIcon;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5",
        tone === "dark"
          ? "border-journey-steel bg-journey-black text-journey-white"
          : "border-journey-line bg-journey-white text-journey-black shadow-line",
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className={cn(
              "text-xs font-black uppercase",
              tone === "dark" ? "text-journey-line" : "text-journey-steel",
            )}
          >
            {label}
          </p>
          <p className="mt-2 text-3xl font-black">{value}</p>
        </div>
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-md",
            tone === "dark"
              ? "bg-journey-red text-journey-white"
              : "bg-journey-black text-journey-white",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {detail ? (
        <p
          className={cn(
            "mt-3 text-sm",
            tone === "dark" ? "text-journey-line" : "text-journey-steel",
          )}
        >
          {detail}
        </p>
      ) : null}
    </div>
  );
}
