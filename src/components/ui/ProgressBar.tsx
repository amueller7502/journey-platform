import { cn, formatXp, percent } from "@/lib/utils";

export function ProgressBar({
  value,
  max,
  label,
  inverse = false,
}: {
  value: number;
  max: number;
  label?: string;
  inverse?: boolean;
}) {
  const pct = percent(value, max);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4 text-sm font-bold">
        <span className={cn(inverse ? "text-journey-white" : "text-journey-black")}>
          {label}
        </span>
        <span className={cn(inverse ? "text-journey-white" : "text-journey-steel")}>
          {formatXp(value)} XP / {formatXp(max)} XP
        </span>
      </div>
      <div
        className={cn(
          "h-3 overflow-hidden rounded-sm",
          inverse ? "bg-journey-steel" : "bg-journey-mist",
        )}
        aria-label={label}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
      >
        <div
          className="h-full rounded-sm bg-journey-red transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
