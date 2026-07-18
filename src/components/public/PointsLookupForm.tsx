"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, KeyRound } from "lucide-react";

function tokenFromInput(value: string) {
  const trimmed = value.trim();

  try {
    const url = new URL(trimmed);
    return url.pathname.split("/").filter(Boolean).at(-1) ?? "";
  } catch {
    return trimmed.split("/").filter(Boolean).at(-1) ?? "";
  }
}

export function PointsLookupForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  return (
    <form
      className="grid gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const token = tokenFromInput(value);
        if (!/^[0-9a-f-]{36}$/i.test(token)) {
          setError("That private points code does not look complete.");
          return;
        }

        setError("");
        router.push(`/points/${encodeURIComponent(token)}`);
      }}
    >
      <label className="grid gap-2 text-sm font-black text-[#102631]">
        Private points code
        <div className="relative">
          <KeyRound
            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#9a7f39]"
            aria-hidden="true"
          />
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="min-h-14 w-full rounded-lg border-2 border-[#ccb567] bg-white pl-12 pr-4 text-base font-bold text-[#102631] outline-none transition focus:border-[#d71920] focus:ring-4 focus:ring-[#d71920]/10"
            placeholder="Paste your code or private link"
          />
        </div>
      </label>
      {error ? (
        <p className="rounded-md border border-[#d71920]/30 bg-[#d71920]/5 px-4 py-3 text-sm font-bold text-[#a80f15]" role="alert">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-lg bg-[#d71920] px-5 text-base font-black text-white shadow-[0_12px_26px_rgba(215,25,32,.25)] transition hover:bg-[#ad1017] focus:outline-none focus:ring-4 focus:ring-[#d71920]/25"
      >
        See My Points
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </form>
  );
}
