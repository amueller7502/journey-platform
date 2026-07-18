import Image from "next/image";
import { Ship } from "lucide-react";

export function OdysseyMasthead({ compact = false }: { compact?: boolean }) {
  return (
    <header className="relative z-10 flex items-center justify-between gap-4 border-b border-[#c8a958]/45 pb-5">
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        <div className="rounded-md border border-[#c8a958]/55 bg-[#fffaf0] p-2 shadow-[0_8px_30px_rgba(0,0,0,.28)]">
          <Image
            src="/brand/celebration-c-frame.png"
            alt="Celebration Cinema"
            width={compact ? 72 : 90}
            height={compact ? 44 : 55}
            priority
            unoptimized
            className="h-auto w-[64px] object-contain sm:w-[82px]"
          />
        </div>
        <div className="min-w-0">
          <p className="truncate text-[10px] font-black uppercase tracking-[0.28em] text-[#c8a958] sm:text-xs">
            Crew Rewards Program
          </p>
          <p className="mt-1 truncate text-sm font-bold text-[#fff8e7]/75 sm:text-base">
            Celebration Cinema North
          </p>
        </div>
      </div>
      <Ship className="h-7 w-7 shrink-0 text-[#d71920] sm:h-9 sm:w-9" aria-hidden="true" />
    </header>
  );
}
