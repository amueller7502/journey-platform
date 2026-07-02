"use client";

import { useState } from "react";
import Image from "next/image";
import { productLanguage } from "@/lib/product-language";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  orientation?: "horizontal" | "stacked";
  size?: "sm" | "md" | "lg";
  className?: string;
};

export function BrandLockup({
  orientation = "horizontal",
  size = "md",
  className,
}: BrandLockupProps) {
  const [assetMissing, setAssetMissing] = useState(false);
  const markClass = {
    sm: "h-[47px] w-[76px]",
    md: "h-16 w-[104px]",
    lg: "h-[92px] w-[150px]",
  }[size];

  const markDimensions = {
    sm: { width: 76, height: 47 },
    md: { width: 104, height: 64 },
    lg: { width: 150, height: 92 },
  }[size];

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        orientation === "stacked" && "flex-col items-start gap-4",
        className,
      )}
    >
      <Image
        src={
          assetMissing
            ? "/brand/c-frame-placeholder.svg"
            : "/brand/celebration-c-frame.png"
        }
        alt="Celebration Cinema C frame"
        width={markDimensions.width}
        height={markDimensions.height}
        priority
        unoptimized
        className={cn("shrink-0 object-contain", markClass)}
        onError={() => setAssetMissing(true)}
      />
      <div className="leading-none">
        <div
          className={cn(
            "font-black uppercase text-journey-white",
            size === "sm" && "text-lg",
            size === "md" && "text-2xl",
            size === "lg" && "text-4xl",
          )}
        >
          {productLanguage.productName}
        </div>
        <div
          className={cn(
            "mt-1 border-t border-journey-red pt-1 font-bold uppercase text-journey-red",
            size === "sm" && "text-[10px]",
            size === "md" && "text-xs",
            size === "lg" && "text-sm",
          )}
        >
          Platform
        </div>
      </div>
    </div>
  );
}
