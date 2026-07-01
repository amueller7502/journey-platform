"use client";

import { useState } from "react";
import { CheckCircle2, Circle, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { excellenceCheckTypes } from "@/lib/data";

export function ExcellenceCheckBoard() {
  const [completed, setCompleted] = useState<string[]>([
    "lobby_excellence",
    "theater_excellence",
  ]);

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {excellenceCheckTypes.map((check) => {
        const isComplete = completed.includes(check.id);
        return (
          <article
            key={check.id}
            className="rounded-lg border border-journey-line bg-journey-white p-4 shadow-line"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-black text-journey-black">{check.name}</h3>
                <p className="mt-2 text-sm font-bold text-journey-steel">
                  {check.milesValue} miles per confirmed check
                </p>
                <p className="mt-2 text-sm leading-6 text-journey-steel">
                  {check.description}
                </p>
              </div>
              {isComplete ? (
                <CheckCircle2 className="h-6 w-6 text-journey-red" aria-hidden="true" />
              ) : (
                <Circle className="h-6 w-6 text-journey-steel" aria-hidden="true" />
              )}
            </div>
            <Button
              type="button"
              icon={Plus}
              variant={isComplete ? "secondary" : "primary"}
              className="mt-4 w-full"
              onClick={() =>
                setCompleted((current) =>
                  current.includes(check.id)
                    ? current.filter((item) => item !== check.id)
                    : [...current, check.id],
                )
              }
            >
              {isComplete ? "Logged" : "Log Check"}
            </Button>
          </article>
        );
      })}
    </div>
  );
}
