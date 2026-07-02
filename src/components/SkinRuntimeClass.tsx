"use client";

import { useEffect } from "react";
import { useJourneyState } from "@/lib/journey-state";

export function SkinRuntimeClass() {
  const { state } = useJourneyState();

  useEffect(() => {
    const classList = document.body.classList;
    const activeClass =
      state.skinEnabled && state.activeSkinId !== "standard"
        ? `skin-${state.activeSkinId}`
        : "skin-standard";

    Array.from(classList)
      .filter((className) => className.startsWith("skin-"))
      .forEach((className) => classList.remove(className));

    classList.add(activeClass);
  }, [state.activeSkinId, state.skinEnabled]);

  return null;
}
