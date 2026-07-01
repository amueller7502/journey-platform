import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "dark";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-journey-red text-journey-white hover:bg-journey-deepRed border-journey-red",
  secondary:
    "bg-journey-white text-journey-black hover:bg-journey-mist border-journey-line",
  ghost:
    "bg-transparent text-journey-black hover:bg-journey-mist border-transparent",
  dark:
    "bg-journey-black text-journey-white hover:bg-journey-slate border-journey-black",
};

type SharedProps = {
  children: ReactNode;
  icon?: LucideIcon;
  variant?: ButtonVariant;
  className?: string;
};

export function Button({
  children,
  icon: Icon,
  variant = "primary",
  className,
  ...props
}: SharedProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-bold transition",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
    </button>
  );
}

export function LinkButton({
  children,
  icon: Icon,
  variant = "primary",
  className,
  href,
  ...props
}: SharedProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-bold transition",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden="true" /> : null}
      <span>{children}</span>
    </Link>
  );
}
