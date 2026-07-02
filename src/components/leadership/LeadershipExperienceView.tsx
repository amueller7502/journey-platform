"use client";

import { useMemo, useState } from "react";
import {
  Award,
  BarChart3,
  ClipboardCheck,
  Gift,
  Gauge,
  HandHeart,
  Sparkles,
  Users,
} from "lucide-react";
import { Button, LinkButton } from "@/components/ui/Button";
import { MetricCard } from "@/components/ui/MetricCard";
import { Panel, PanelHeader } from "@/components/ui/Panel";
import {
  coachingInsights,
  leadershipAchievements,
  leadershipHealth,
  leadershipRecognitions,
  leadershipRewards,
} from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { productLanguage } from "@/lib/product-language";
import type {
  Employee,
  LeadershipRecognition,
  LeadershipRecognitionCategory,
} from "@/lib/types";
import { formatShortDateTime } from "@/lib/utils";

const LEADERSHIP_RECOGNITION_KEY = "experience-leadership-recognitions";
const leadershipCategories: LeadershipRecognitionCategory[] = [
  "Coaching",
  "Coverage",
  "Communication",
  "Guest Recovery",
  "Operational Leadership",
];

function loadStoredLeadershipRecognitions() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(LEADERSHIP_RECOGNITION_KEY);
    return value ? (JSON.parse(value) as LeadershipRecognition[]) : [];
  } catch {
    return [];
  }
}

function saveStoredLeadershipRecognitions(recognitions: LeadershipRecognition[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    LEADERSHIP_RECOGNITION_KEY,
    JSON.stringify(recognitions),
  );
}

type LeadershipView =
  | "dashboard"
  | "health"
  | "journal"
  | "achievements"
  | "recognition"
  | "rewards"
  | "coverage"
  | "coaching"
  | "awaiting";

export function LeadershipExperienceView({ view }: { view: LeadershipView }) {
  const { state } = useJourneyState();
  const [storedLeadershipRecognitions, setStoredLeadershipRecognitions] = useState<
    LeadershipRecognition[]
  >(() => loadStoredLeadershipRecognitions());

  const activeLeader =
    state.employees.find((employee) => employee.role === "manager") ??
    state.employees.find((employee) => employee.role === "admin");
  const employees = state.employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
  );
  const awaitingRecognition = employees.filter((employee) => employee.weeklyMiles === 0);
  const pendingRewards = state.redemptions.filter((redemption) =>
    ["Requested", "Pending", "Approved", "Ready"].includes(redemption.status),
  );
  const activeFocus =
    state.experienceEvents.find(
      (event) => event.enabled && event.type === "Today's Focus",
    ) ?? state.experienceEvents.find((event) => event.enabled);
  const recognitionCoverage = employees.length
    ? Math.round(((employees.length - awaitingRecognition.length) / employees.length) * 100)
    : 0;
  const allLeadershipRecognitions = useMemo(
    () => [...storedLeadershipRecognitions, ...leadershipRecognitions],
    [storedLeadershipRecognitions],
  );
  const visibleRecognitions = allLeadershipRecognitions.filter(
    (recognition) => !activeLeader || recognition.leaderId === activeLeader.id,
  );
  const visibleAchievements = leadershipAchievements.filter(
    (achievement) => !activeLeader || achievement.leaderId === activeLeader.id,
  );
  const visibleInsights = coachingInsights.filter(
    (insight) => !activeLeader || insight.leaderId === activeLeader.id,
  );

  function recordLeadershipRecognition(recognition: LeadershipRecognition) {
    const nextRecognitions = [recognition, ...storedLeadershipRecognitions];
    setStoredLeadershipRecognitions(nextRecognitions);
    saveStoredLeadershipRecognitions(nextRecognitions);
  }

  if (view === "dashboard") {
    return (
      <div className="grid gap-5">
        <HeroPanel activeLeader={activeLeader?.name ?? "Leadership"} />
        <HealthCards
          coverage={recognitionCoverage}
          awaiting={awaitingRecognition.length}
          pendingRewards={pendingRewards.length}
          recognitions={visibleRecognitions.length}
        />
        <Panel>
          <PanelHeader title="Leadership Health Signals" eyebrow="Shift operations" />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              [
                "Experience Moments Captured",
                `${employees.reduce((total, employee) => total + employee.weeklyMiles, 0)} weekly XP`,
              ],
              ["Recognition Notes", `${visibleRecognitions.length} leadership notes`],
              ["Experience Card Batches", `${state.journeyCardAssignments.length} planned cards`],
              ["Excellence Checks Verified", `${state.excellenceLogs.length} readiness logs`],
              ["Today's Focus", activeFocus?.title ?? "No active focus"],
              ["Pending Reward Requests", `${pendingRewards.length} open handoffs`],
              ["Employees Awaiting Recognition", `${awaitingRecognition.length} people`],
              ["Suggested Coaching Actions", `${visibleInsights.length} available`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-journey-line p-4">
                <p className="text-xs font-black uppercase text-journey-red">{label}</p>
                <p className="mt-2 text-lg font-black text-journey-black">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="bg-journey-black text-journey-white">
          <PanelHeader title="Leadership Actions" eyebrow="Shift-ready shortcuts" />
          <div className="grid gap-3 md:grid-cols-3">
            <LinkButton href="/manager/recognize" icon={HandHeart}>
              Capture Employee Moment
            </LinkButton>
            <LinkButton href="/manager/passport" icon={ClipboardCheck} variant="secondary">
              Enter Experience Cards
            </LinkButton>
            <LinkButton href="/manager/pending-rewards" icon={Gift} variant="secondary">
              Review Employee Rewards
            </LinkButton>
          </div>
          <p className="mt-4 text-sm font-bold text-journey-line">
            Managers do not earn employee XP. Leadership recognition is
            tracked as coaching, coverage, communication, and operational impact.
          </p>
        </Panel>
        <div className="grid gap-5 xl:grid-cols-2">
          <RecognitionList recognitions={visibleRecognitions} />
          <AwaitingList employees={awaitingRecognition} compact />
        </div>
      </div>
    );
  }

  if (view === "health") {
    return (
      <div className="grid gap-5">
        <HealthCards
          coverage={recognitionCoverage}
          awaiting={awaitingRecognition.length}
          pendingRewards={pendingRewards.length}
          recognitions={visibleRecognitions.length}
        />
        <Panel>
          <PanelHeader title="Leadership Health" eyebrow="What needs attention" />
          <div className="grid gap-3 md:grid-cols-2">
            {[
              ["Recognition coverage", `${recognitionCoverage}%`],
              ["Open coaching actions", `${visibleInsights.length}`],
              ["Pending employee reward requests", `${pendingRewards.length}`],
              ["Leadership recognitions this week", `${visibleRecognitions.length}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-journey-line p-4">
                <p className="text-sm font-black text-journey-steel">{label}</p>
                <p className="mt-1 text-3xl font-black text-journey-black">{value}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    );
  }

  if (view === "journal") {
    return (
      <Panel>
        <PanelHeader title="Leadership Journal" eyebrow="Recognition and reflection" />
        <div className="grid gap-3">
          {visibleRecognitions.map((recognition) => (
            <article key={recognition.id} className="rounded-lg border border-journey-line p-4">
              <p className="text-xs font-black uppercase text-journey-red">
                {recognition.category} / {formatShortDateTime(recognition.createdAt)}
              </p>
              <h3 className="mt-1 text-xl font-black text-journey-black">
                {recognition.title}
              </h3>
              <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
                {recognition.note}
              </p>
              <p className="mt-3 rounded-md bg-journey-mist p-3 text-sm font-black text-journey-black">
                Impact: {recognition.impact}
              </p>
            </article>
          ))}
        </div>
      </Panel>
    );
  }

  if (view === "achievements") {
    return (
      <Panel>
        <PanelHeader title="Leadership Achievements" eyebrow="No employee XP" />
        <div className="grid gap-4 md:grid-cols-3">
          {visibleAchievements.map((achievement) => (
            <article key={achievement.id} className="rounded-lg border border-journey-line p-4">
              <Award className="h-7 w-7 text-journey-red" aria-hidden="true" />
              <p className="mt-4 text-xs font-black uppercase text-journey-red">
                {achievement.status.replace("_", " ")}
              </p>
              <h3 className="mt-1 text-xl font-black text-journey-black">
                {achievement.title}
              </h3>
              <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
                {achievement.description}
              </p>
            </article>
          ))}
        </div>
      </Panel>
    );
  }

  if (view === "recognition") {
    return (
      <div className="grid gap-5 xl:grid-cols-[1fr_0.45fr]">
        <div className="grid gap-5">
          <LeadershipRecognitionForm
            leaders={state.employees.filter((employee) => employee.role !== "employee")}
            currentLeaderId={activeLeader?.id ?? ""}
            onRecord={recordLeadershipRecognition}
          />
          <RecognitionList recognitions={visibleRecognitions} />
        </div>
        <Panel>
          <PanelHeader title="Leadership Recognition Rules" eyebrow="Frozen language" />
          <div className="grid gap-3 text-sm font-bold leading-6 text-journey-steel">
            <p>{productLanguage.leadershipRecognition} is not employee XP.</p>
            <p>Leadership recognition names manager impact, coaching, coverage, and communication.</p>
            <p>Employee XP remains inside the Employee Experience only.</p>
          </div>
        </Panel>
      </div>
    );
  }

  if (view === "rewards") {
    return (
      <Panel>
        <PanelHeader title="Leadership Rewards" eyebrow="Recognition without employee XP" />
        <div className="grid gap-4 md:grid-cols-3">
          {leadershipRewards.map((reward) => (
            <article key={reward.id} className="rounded-lg border border-journey-line p-4">
              <Gift className="h-7 w-7 text-journey-red" aria-hidden="true" />
              <p className="mt-4 text-xs font-black uppercase text-journey-red">
                {reward.status}
              </p>
              <h3 className="mt-1 text-xl font-black text-journey-black">
                {reward.name}
              </h3>
              <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
                {reward.description}
              </p>
              <p className="mt-3 rounded-md bg-journey-mist p-3 text-xs font-bold text-journey-steel">
                {reward.fulfillmentNotes}
              </p>
            </article>
          ))}
        </div>
      </Panel>
    );
  }

  if (view === "coverage") {
    return (
      <Panel>
        <PanelHeader title="Recognition Coverage" eyebrow="Employees seen this week" />
        <div className="grid gap-3">
          {state.departments.map((department) => {
            const departmentEmployees = employees.filter(
              (employee) => employee.department === department.id,
            );
            const covered = departmentEmployees.filter(
              (employee) => employee.weeklyMiles > 0,
            ).length;
            const percent = departmentEmployees.length
              ? Math.round((covered / departmentEmployees.length) * 100)
              : 100;

            return (
              <div key={department.id} className="rounded-lg border border-journey-line p-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="font-black text-journey-black">{department.name}</p>
                  <p className="text-sm font-black text-journey-red">{percent}% covered</p>
                </div>
                <div className="mt-3 h-2 rounded-sm bg-journey-mist">
                  <div
                    className="h-full rounded-sm bg-journey-red"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Panel>
    );
  }

  if (view === "coaching") {
    return (
      <Panel>
        <PanelHeader title="Coaching Insights" eyebrow="Next best action" />
        <div className="grid gap-3">
          {visibleInsights.map((insight) => (
            <article key={insight.id} className="rounded-lg border border-journey-line p-4">
              <p className="text-xs font-black uppercase text-journey-red">
                {insight.priority} priority
              </p>
              <h3 className="mt-1 text-xl font-black text-journey-black">
                {insight.title}
              </h3>
              <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
                {insight.detail}
              </p>
              <p className="mt-3 rounded-md bg-journey-mist p-3 text-sm font-black text-journey-black">
                {insight.action}
              </p>
            </article>
          ))}
        </div>
      </Panel>
    );
  }

  return <AwaitingList employees={awaitingRecognition} />;
}

function HeroPanel({ activeLeader }: { activeLeader: string }) {
  return (
    <Panel className="bg-journey-black text-journey-white projection-sweep">
      <p className="text-xs font-black uppercase text-journey-red">
        {productLanguage.leadershipExperience}
      </p>
      <h2 className="mt-2 text-3xl font-black">Lead the experience, recognize the people.</h2>
      <p className="mt-3 max-w-3xl text-sm font-bold leading-6 text-journey-line">
        {activeLeader} sees employee recognition coverage, coaching priorities,
        leadership recognition, and reward handoffs without earning employee XP.
      </p>
    </Panel>
  );
}

function HealthCards({
  coverage,
  awaiting,
  pendingRewards,
  recognitions,
}: {
  coverage: number;
  awaiting: number;
  pendingRewards: number;
  recognitions: number;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Coverage"
        value={`${coverage}%`}
        detail={`Goal ${leadershipHealth.recognitionCoverage}%+`}
        icon={BarChart3}
      />
      <MetricCard
        label="Awaiting Recognition"
        value={`${awaiting}`}
        detail="employees this week"
        icon={Users}
      />
      <MetricCard
        label="Reward Handoffs"
        value={`${pendingRewards}`}
        detail="open employee requests"
        icon={Gift}
      />
      <MetricCard
        label="Leadership Recognition"
        value={`${recognitions}`}
        detail="no employee XP awarded"
        icon={Gauge}
      />
    </div>
  );
}

function LeadershipRecognitionForm({
  leaders,
  currentLeaderId,
  onRecord,
}: {
  leaders: Employee[];
  currentLeaderId: string;
  onRecord: (recognition: LeadershipRecognition) => void;
}) {
  const [leaderId, setLeaderId] = useState(currentLeaderId || leaders[0]?.id || "");
  const [category, setCategory] = useState<LeadershipRecognitionCategory>("Coaching");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [impact, setImpact] = useState("");
  const [saved, setSaved] = useState(false);

  function submitRecognition() {
    const leader = leaders.find((item) => item.id === leaderId);
    if (!leader || !title.trim() || !note.trim() || !impact.trim()) {
      setSaved(false);
      return;
    }

    onRecord({
      id: `leadership-${Date.now()}`,
      leaderId: leader.id,
      recognizedById: "admin-sam",
      category,
      title: title.trim(),
      note: note.trim(),
      impact: impact.trim(),
      createdAt: new Date().toISOString(),
    });
    setTitle("");
    setNote("");
    setImpact("");
    setSaved(true);
  }

  return (
    <Panel>
      <PanelHeader title="Record Leadership Recognition" eyebrow="No employee XP" />
      <div className="grid gap-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Leader
            <select
              value={leaderId}
              onChange={(event) => setLeaderId(event.target.value)}
              className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
            >
              {leaders.map((leader) => (
                <option key={leader.id} value={leader.id}>
                  {leader.name} - {leader.title}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-2 text-sm font-bold text-journey-black">
            Category
            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value as LeadershipRecognitionCategory)
              }
              className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
            >
              {leadershipCategories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Recognition Title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
            placeholder="Clean handoff, calm coaching, coverage follow-through..."
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Leadership Note
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            className="focus-ring resize-none rounded-md border border-journey-line px-3 py-2"
            placeholder="What leadership behavior mattered?"
          />
        </label>
        <label className="grid gap-2 text-sm font-bold text-journey-black">
          Impact
          <input
            value={impact}
            onChange={(event) => setImpact(event.target.value)}
            className="focus-ring min-h-11 rounded-md border border-journey-line px-3"
            placeholder="What changed for guests, crew, or the shift?"
          />
        </label>
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-journey-line bg-journey-mist p-4">
          <p className="text-sm font-bold text-journey-steel">
            Leadership recognition is separate from employee XP and Rewards.
          </p>
          <Button type="button" icon={Sparkles} onClick={submitRecognition}>
            Record Recognition
          </Button>
        </div>
        {saved ? (
          <p className="rounded-lg border border-journey-red bg-journey-white p-3 text-sm font-black text-journey-black">
            Leadership recognition recorded for this browser.
          </p>
        ) : null}
      </div>
    </Panel>
  );
}

function RecognitionList({
  recognitions,
}: {
  recognitions: typeof leadershipRecognitions;
}) {
  return (
    <Panel>
      <PanelHeader title="Leadership Recognition" eyebrow="Manager impact" />
      <div className="grid gap-3">
        {recognitions.map((recognition) => (
          <article key={recognition.id} className="rounded-lg border border-journey-line p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase text-journey-red">
                  {recognition.category}
                </p>
                <h3 className="mt-1 text-xl font-black text-journey-black">
                  {recognition.title}
                </h3>
              </div>
              <Sparkles className="h-5 w-5 shrink-0 text-journey-red" aria-hidden="true" />
            </div>
            <p className="mt-2 text-sm font-bold leading-6 text-journey-steel">
              {recognition.note}
            </p>
            <p className="mt-3 text-xs font-black uppercase text-journey-steel">
              {formatShortDateTime(recognition.createdAt)}
            </p>
          </article>
        ))}
      </div>
    </Panel>
  );
}

function AwaitingList({
  employees,
  compact = false,
}: {
  employees: Array<{ id: string; name: string; title: string }>;
  compact?: boolean;
}) {
  return (
    <Panel>
      <PanelHeader title="Employees Awaiting Recognition" eyebrow="Coverage" />
      <div className="grid gap-3">
        {!employees.length ? (
          <p className="rounded-lg border border-dashed border-journey-line p-4 text-sm font-bold text-journey-steel">
            Every active employee has at least one recognized moment this week.
          </p>
        ) : null}
        {employees.slice(0, compact ? 5 : employees.length).map((employee) => (
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
  );
}
