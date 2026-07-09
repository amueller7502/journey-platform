"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ClipboardCheck, Gift, HandHeart, Search, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import { isArchived } from "@/lib/archive";
import {
  replaceJourneyStateFromServer,
  useJourneyState,
  type JourneyOperatingState,
} from "@/lib/journey-state";
import type { Redemption } from "@/lib/types";
import { formatXp } from "@/lib/utils";

type IntakeMode = "experience_card" | "reward" | "recognition";

const intakeOptions: Array<{
  id: IntakeMode;
  label: string;
  description: string;
}> = [
  {
    id: "experience_card",
    label: "Turn in card",
    description: "Enter a paper Experience Card for this employee.",
  },
  {
    id: "reward",
    label: "Request reward",
    description: "Create a reward request without employee login.",
  },
  {
    id: "recognition",
    label: "Capture moment",
    description: "Open manager recognition with this employee selected.",
  },
];

function isOpenStatus(status: Redemption["status"]) {
  return (
    status === "Requested" ||
    status === "Approved" ||
    status === "Pending" ||
    status === "Ready"
  );
}

export function OurPeopleIntakeClient() {
  const router = useRouter();
  const { state, updateState } = useJourneyState();
  const crew = useMemo(
    () =>
      state.employees
        .filter((employee) => employee.role === "employee" && employee.active !== false)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [state.employees],
  );
  const cardAreas = useMemo(
    () =>
      state.journeyCardAreas
        .filter((area) => area.enabled && !isArchived(area))
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [state.journeyCardAreas],
  );
  const availableRewards = useMemo(
    () =>
      state.rewards
        .filter(
          (reward) =>
            reward.enabled &&
            !reward.comingSoon &&
            !isArchived(reward) &&
            reward.inventoryCount > 0,
        )
        .sort((a, b) => a.milesCost - b.milesCost),
    [state.rewards],
  );
  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] = useState(crew[0]?.id ?? "");
  const [mode, setMode] = useState<IntakeMode>("experience_card");
  const [cardAreaId, setCardAreaId] = useState(cardAreas[0]?.id ?? "");
  const [rewardId, setRewardId] = useState(availableRewards[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filteredCrew = crew.filter((employee) =>
    `${employee.name} ${employee.title} ${employee.passportId}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const selectedEmployee =
    crew.find((employee) => employee.id === employeeId) ?? filteredCrew[0] ?? crew[0];
  const selectedReward =
    availableRewards.find((reward) => reward.id === rewardId) ?? availableRewards[0];
  const selectedArea = cardAreas.find((area) => area.id === cardAreaId) ?? cardAreas[0];

  function openCardEntry() {
    if (!selectedEmployee || !selectedArea) {
      setMessage("Choose an employee and an Experience Card type first.");
      return;
    }

    router.push(
      `/manager/passport/${encodeURIComponent(
        selectedEmployee.passportId,
      )}?area=${encodeURIComponent(selectedArea.id)}`,
    );
  }

  function openRecognition() {
    if (!selectedEmployee) {
      setMessage("Choose an employee first.");
      return;
    }

    const params = new URLSearchParams({ employee: selectedEmployee.id });
    if (note.trim()) {
      params.set("note", note.trim());
    }
    router.push(`/manager/recognize?${params.toString()}`);
  }

  function addLocalRewardRequest(redemption: Redemption) {
    updateState((current) => ({
      ...current,
      redemptions: [redemption, ...current.redemptions],
      updatedAt: redemption.requestedAt,
    }));
  }

  async function createRewardRequest() {
    if (!selectedEmployee || !selectedReward) {
      setMessage("Choose an employee and reward first.");
      return;
    }

    const alreadyOpen = state.redemptions.some(
      (redemption) =>
        redemption.employeeId === selectedEmployee.id &&
        redemption.rewardId === selectedReward.id &&
        isOpenStatus(redemption.status),
    );
    if (alreadyOpen) {
      setMessage("That employee already has an open request for this reward.");
      return;
    }

    if (selectedEmployee.miles < selectedReward.milesCost) {
      setMessage(`${selectedEmployee.name} does not have enough XP for that reward yet.`);
      return;
    }

    setSubmitting(true);
    setMessage("");
    try {
      const response = await fetch("/api/experience/reward-redemptions", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          employeeId: selectedEmployee.id,
          rewardId: selectedReward.id,
        }),
      });
      const payload = (await response.json()) as {
        error?: string;
        mode?: "local" | "supabase";
        state?: JourneyOperatingState;
        redemption?: Redemption;
      };

      if (!response.ok) {
        setMessage(payload.error ?? "Reward request could not be created.");
        return;
      }

      if (payload.mode === "supabase" && payload.state) {
        replaceJourneyStateFromServer(payload.state);
      } else if (payload.redemption) {
        addLocalRewardRequest(payload.redemption);
      }
      setMessage(`Reward request created for ${selectedEmployee.name}.`);
    } catch {
      const redemption: Redemption = {
        id: `redemption-${selectedEmployee.id}-${selectedReward.id}-${Date.now()}`,
        employeeId: selectedEmployee.id,
        rewardId: selectedReward.id,
        status: "Requested",
        requestedAt: new Date().toISOString(),
      };
      addLocalRewardRequest(redemption);
      setMessage(`Reward request saved locally for ${selectedEmployee.name}.`);
    } finally {
      setSubmitting(false);
    }
  }

  function submitIntake() {
    if (mode === "experience_card") {
      openCardEntry();
      return;
    }

    if (mode === "recognition") {
      openRecognition();
      return;
    }

    void createRewardRequest();
  }

  return (
    <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
      <Panel>
        <PanelHeader title="OurPeople Request Intake" eyebrow="No employee login" />
        <div className="rounded-lg border border-journey-line bg-journey-mist p-4">
          <p className="text-sm font-bold leading-6 text-journey-steel">
            Staff can send a message in OurPeople or tell a manager in person. The
            manager handles the Experience action here.
          </p>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Employee
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-journey-steel"
                aria-hidden="true"
              />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setMessage("");
                }}
                className="focus-ring min-h-11 w-full rounded-md border border-journey-line bg-journey-white pl-10 pr-3"
                placeholder="Search name, role, or card ID"
              />
            </div>
            <select
              value={selectedEmployee?.id ?? ""}
              onChange={(event) => {
                setEmployeeId(event.target.value);
                setMessage("");
              }}
              className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
            >
              {filteredCrew.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} - {employee.title}
                </option>
              ))}
            </select>
          </label>

          <div className="grid gap-2">
            <p className="text-sm font-bold text-journey-black">Request Type</p>
            <div className="grid gap-2 md:grid-cols-3">
              {intakeOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setMode(option.id);
                    setMessage("");
                  }}
                  className={`focus-ring rounded-lg border p-3 text-left transition ${
                    mode === option.id
                      ? "border-journey-red bg-journey-black text-journey-white"
                      : "border-journey-line bg-journey-white text-journey-black hover:bg-journey-mist"
                  }`}
                >
                  <span className="block text-sm font-black">{option.label}</span>
                  <span className="mt-1 block text-xs font-bold opacity-80">
                    {option.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {mode === "experience_card" ? (
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Experience Card Type
              <select
                value={selectedArea?.id ?? ""}
                onChange={(event) => setCardAreaId(event.target.value)}
                className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
              >
                {cardAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          {mode === "reward" ? (
            <label className="grid gap-2 text-sm font-bold text-journey-black">
              Reward
              <select
                value={selectedReward?.id ?? ""}
                onChange={(event) => setRewardId(event.target.value)}
                className="focus-ring min-h-11 rounded-md border border-journey-line bg-journey-white px-3"
              >
                {availableRewards.map((reward) => (
                  <option key={reward.id} value={reward.id}>
                    {reward.name} ({formatXp(reward.milesCost)} XP)
                  </option>
                ))}
              </select>
            </label>
          ) : null}

          <label className="grid gap-2 text-sm font-bold text-journey-black">
            OurPeople Message Or Manager Note
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              rows={4}
              className="focus-ring resize-none rounded-md border border-journey-line bg-journey-white px-3 py-3"
              placeholder="Paste the OurPeople message or summarize what the employee asked for."
            />
          </label>

          {message ? (
            <p className="rounded-md border border-journey-line bg-journey-white p-3 text-sm font-black text-journey-red">
              {message}
            </p>
          ) : null}

          <Button type="button" icon={Send} onClick={submitIntake} disabled={submitting}>
            {submitting ? "Submitting..." : "Continue"}
          </Button>
        </div>
      </Panel>

      <Panel>
        <PanelHeader title="Selected Employee" eyebrow="Manager handoff" />
        {selectedEmployee ? (
          <div className="grid gap-4">
            <div className="rounded-lg border border-journey-line bg-journey-black p-5 text-journey-white">
              <p className="text-xs font-black uppercase text-journey-red">
                {selectedEmployee.passportId}
              </p>
              <h3 className="mt-2 text-3xl font-black">{selectedEmployee.name}</h3>
              <p className="mt-2 font-bold text-journey-line">
                {selectedEmployee.title} / {selectedEmployee.shift}
              </p>
              <p className="mt-4 text-sm font-black text-journey-red">
                {formatXp(selectedEmployee.miles)} XP available
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border border-journey-line p-4">
                <ClipboardCheck className="h-5 w-5 text-journey-red" aria-hidden="true" />
                <p className="mt-3 text-sm font-black text-journey-black">
                  Cards
                </p>
                <p className="mt-1 text-xs font-bold text-journey-steel">
                  Manager enters turned-in paper cards.
                </p>
              </div>
              <div className="rounded-lg border border-journey-line p-4">
                <Gift className="h-5 w-5 text-journey-red" aria-hidden="true" />
                <p className="mt-3 text-sm font-black text-journey-black">
                  Rewards
                </p>
                <p className="mt-1 text-xs font-bold text-journey-steel">
                  Request can be created from this screen.
                </p>
              </div>
              <div className="rounded-lg border border-journey-line p-4">
                <HandHeart className="h-5 w-5 text-journey-red" aria-hidden="true" />
                <p className="mt-3 text-sm font-black text-journey-black">
                  Moments
                </p>
                <p className="mt-1 text-xs font-bold text-journey-steel">
                  Manager recognition stays manager-owned.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-journey-line p-5 text-sm font-bold text-journey-steel">
            Add active employees before using OurPeople intake.
          </p>
        )}
      </Panel>
    </div>
  );
}
