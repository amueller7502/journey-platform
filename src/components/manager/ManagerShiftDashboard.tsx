"use client";

import { useEffect, useMemo, useState } from "react";
import { ClipboardCheck, Gift, HandHeart, Megaphone, Users } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  type JourneyMoment,
  getJourneyMoments,
  subscribeToJourneyMoments,
} from "@/lib/demo-moments";
import { formatMiles, formatShortDateTime } from "@/lib/utils";
import { useJourneyState } from "@/lib/journey-state";

export function ManagerShiftDashboard() {
  const { state } = useJourneyState();
  const [moments, setMoments] = useState<JourneyMoment[]>([]);

  useEffect(() => {
    const load = () => setMoments(getJourneyMoments());
    load();
    return subscribeToJourneyMoments(load);
  }, []);

  const pendingRewards = state.redemptions.filter(
    (redemption) =>
      redemption.status === "Requested" ||
      redemption.status === "Pending" ||
      redemption.status === "Approved" ||
      redemption.status === "Ready",
  );
  const employeesNeedingRecognition = useMemo(
    () =>
      state.employees
        .filter(
          (employee) =>
            employee.role === "employee" &&
            employee.active !== false &&
            employee.weeklyMiles === 0,
        )
        .slice(0, 8),
    [state.employees],
  );
  const weeklyMiles = state.employees.reduce(
    (total, employee) => total + (employee.role === "employee" ? employee.weeklyMiles : 0),
    0,
  );

  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Weekly Miles"
          value={formatMiles(weeklyMiles)}
          detail="recognized this week"
          icon={HandHeart}
        />
        <MetricCard
          label="Pending Rewards"
          value={`${pendingRewards.length}`}
          detail="requests to review"
          icon={Gift}
        />
        <MetricCard
          label="Need Recognition"
          value={`${employeesNeedingRecognition.length}`}
          detail="no Miles this week"
          icon={Users}
        />
        <MetricCard
          label="Recent Moments"
          value={`${moments.length}`}
          detail="from this browser"
          icon={Megaphone}
        />
      </div>

      <Panel className="mt-5 bg-journey-black text-journey-white">
        <PanelHeader title="Start of Shift" eyebrow="Manager shortcuts" />
        <div className="grid gap-3 md:grid-cols-3">
          <LinkButton href="/manager/recognize" icon={HandHeart}>
            Capture Moment
          </LinkButton>
          <LinkButton href="/manager/passport" icon={ClipboardCheck} variant="secondary">
            Enter Experience Cards
          </LinkButton>
          <LinkButton href="/manager/pending-rewards" icon={Gift} variant="secondary">
            Reward Requests
          </LinkButton>
        </div>
      </Panel>

      <div className="mt-5 grid gap-5 xl:grid-cols-2">
        <Panel>
          <PanelHeader title="Employees Not Recognized This Week" eyebrow="Follow up" />
          <div className="grid gap-3">
            {!employeesNeedingRecognition.length ? (
              <p className="rounded-lg border border-dashed border-journey-line p-4 text-sm font-bold text-journey-steel">
                Everyone has at least one recognized Moment this week.
              </p>
            ) : null}
            {employeesNeedingRecognition.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-journey-line p-4"
              >
                <div>
                  <p className="font-black text-journey-black">{employee.name}</p>
                  <p className="text-sm font-bold text-journey-steel">{employee.title}</p>
                </div>
                <LinkButton
                  href={`/manager/recognize?employee=${employee.id}`}
                  icon={HandHeart}
                  variant="secondary"
                >
                  Recognize
                </LinkButton>
              </div>
            ))}
          </div>
        </Panel>
        <Panel>
          <PanelHeader title="Recent Moments" eyebrow="Live feed" />
          <div className="grid gap-3">
            {!moments.length ? (
              <p className="rounded-lg border border-dashed border-journey-line p-4 text-sm font-bold text-journey-steel">
                Captured Moments will appear here immediately.
              </p>
            ) : null}
            {moments.slice(0, 6).map((moment) => (
              <article
                key={moment.id}
                className="rounded-lg border border-journey-line p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-black text-journey-black">{moment.employeeName}</p>
                    <p className="mt-1 text-sm font-bold text-journey-red">
                      {moment.recognitionTypeName}
                    </p>
                  </div>
                  <p className="font-black text-journey-red">+{moment.miles}</p>
                </div>
                <p className="mt-2 text-xs font-bold uppercase text-journey-steel">
                  {formatShortDateTime(moment.createdAt)}
                </p>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </>
  );
}
