import { Gift } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import type { Reward } from "@/lib/types";

export function RewardCard({
  reward,
  action,
  footerNote,
}: {
  reward: Reward;
  action?: ReactNode;
  footerNote?: string;
}) {
  return (
    <article className="overflow-hidden rounded-lg border border-journey-line bg-journey-white shadow-line transition hover:-translate-y-0.5 hover:shadow-premium">
      <div className="relative aspect-square border-b border-journey-line bg-journey-black">
        <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(90deg,transparent_0_12px,#fff_12px_16px,transparent_16px_30px)] [background-size:30px_100%]" />
        <div className="absolute left-4 top-4 z-10 rounded-sm bg-journey-red px-2 py-1 text-xs font-black uppercase text-journey-white">
          Trading Post
        </div>
        <Image
          src={reward.imageUrl}
          alt=""
          width={360}
          height={360}
          className="absolute inset-0 h-full w-full object-cover opacity-85"
          unoptimized
        />
        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-journey-black via-journey-black/70 to-transparent p-4">
          <p className="text-xs font-black uppercase text-journey-white">
            {reward.category}
          </p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-journey-red">{reward.category}</p>
            <h3 className="mt-1 text-lg font-black text-journey-black">{reward.name}</h3>
            <p className="mt-2 text-sm leading-6 text-journey-steel">{reward.description}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-journey-black text-journey-white">
            <Gift className="h-5 w-5" aria-hidden="true" />
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-journey-line pt-4">
          <div>
            <span className="text-2xl font-black text-journey-black">
              {reward.milesCost}
            </span>
            <p className="text-xs font-black uppercase text-journey-red">Miles</p>
          </div>
          <span className="text-sm font-bold text-journey-steel">
            {reward.inventoryCount} in stock
          </span>
        </div>
        {footerNote ? (
          <p className="mt-3 rounded-sm bg-journey-mist px-2 py-1 text-xs font-black uppercase text-journey-steel">
            {footerNote}
          </p>
        ) : null}
        {action ? <div className="mt-4">{action}</div> : null}
        {!reward.enabled ? (
          <p className="mt-3 rounded-sm bg-journey-mist px-2 py-1 text-xs font-black uppercase text-journey-steel">
            Disabled
          </p>
        ) : null}
      </div>
    </article>
  );
}
