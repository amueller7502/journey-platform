import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const hasCustomBackground = typeof className === "string" && /\bbg-/.test(className);

  return (
    <section
      className={cn(
        "rounded-lg border border-journey-line p-5 shadow-line",
        !hasCustomBackground && "bg-journey-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function PanelHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="text-xs font-black uppercase text-journey-red">{eyebrow}</p>
        ) : null}
        <h2 className="text-xl font-black text-journey-black">{title}</h2>
      </div>
      {action}
    </div>
  );
}
