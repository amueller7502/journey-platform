import { Megaphone } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { RecognitionCard } from "@/components/dashboard/RecognitionCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { getEmployee, recognitionBatches, recognitions } from "@/lib/data";

export default function RecognitionFeedPage() {
  return (
    <AppShell role="manager" title="Experience Moment Feed" eyebrow="All Moments">
      <Panel>
        <PanelHeader
          title="Recent Experience Moments"
          eyebrow="First seasonal activation"
          action={<Megaphone className="h-5 w-5 text-journey-red" aria-hidden="true" />}
        />
        <div className="mb-5 grid gap-4">
          {recognitionBatches.map((batch) => (
            <article
              key={batch.id}
              className="rounded-lg border border-journey-red bg-journey-mist p-4"
            >
              <p className="text-xs font-black uppercase text-journey-red">
                Experience Card Batch
              </p>
              <h3 className="mt-2 text-xl font-black text-journey-black">
                {getEmployee(batch.employeeId)?.name} earned {batch.totalMiles} Miles
                from {batch.itemCount} verified Experience Card items.
              </h3>
              <p className="mt-2 text-sm font-bold text-journey-steel">{batch.note}</p>
            </article>
          ))}
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {recognitions.map((recognition) => (
            <RecognitionCard key={recognition.id} recognition={recognition} />
          ))}
        </div>
      </Panel>
    </AppShell>
  );
}
