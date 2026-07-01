import { recognitionStandards } from "@/lib/data";

export function StandardGrid() {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {recognitionStandards.map((standard) => (
        <article
          key={standard.id}
          className="rounded-lg border border-journey-line bg-journey-white p-4 shadow-line"
        >
          <p className="text-xs font-black uppercase text-journey-red">
            {standard.shortLabel}
          </p>
          <h3 className="mt-2 text-base font-black text-journey-black">
            {standard.label}
          </h3>
          <p className="mt-2 text-sm leading-6 text-journey-steel">
            {standard.description}
          </p>
        </article>
      ))}
    </div>
  );
}
