"use client";

import { useState } from "react";
import { MonitorPlay, Sparkles } from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { RecognitionCard } from "@/components/dashboard/RecognitionCard";
import { recognitions } from "@/lib/data";

export function DailySpotlightTool() {
  const [spotlightId, setSpotlightId] = useState(
    recognitions.find((recognition) => recognition.spotlight)?.id ?? recognitions[0].id,
  );
  const spotlight = recognitions.find((recognition) => recognition.id === spotlightId);

  return (
    <div className="grid gap-5 xl:grid-cols-[0.75fr_1.25fr]">
      <div className="grid gap-3">
        {recognitions.slice(0, 5).map((recognition) => (
          <button
            key={recognition.id}
            type="button"
            onClick={() => setSpotlightId(recognition.id)}
            className={`focus-ring rounded-lg border p-4 text-left transition ${
              spotlightId === recognition.id
                ? "border-journey-red bg-journey-white"
                : "border-journey-line bg-journey-white hover:bg-journey-mist"
            }`}
          >
            <p className="font-black text-journey-black">{recognition.note}</p>
            <p className="mt-2 text-sm font-bold text-journey-steel">
              +{recognition.miles} miles
            </p>
          </button>
        ))}
      </div>

      <div>
        {spotlight ? <RecognitionCard recognition={spotlight} /> : null}
        <div className="mt-4 flex flex-wrap gap-2">
          <Button type="button" icon={Sparkles}>
            Save Spotlight
          </Button>
          <LinkButton href="/tv" icon={MonitorPlay} variant="dark">
            TV Preview
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
