"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarClock,
  Clapperboard,
  Gift,
  Megaphone,
  Maximize2,
  Route,
  Sparkles,
  Film,
} from "lucide-react";
import { BrandLockup } from "@/components/BrandLockup";
import { PreviewModeBadge } from "@/components/PreviewModeBadge";
import { SkinRuntimeClass } from "@/components/SkinRuntimeClass";
import { ChapterProgress } from "@/components/dashboard/ChapterProgress";
import { DepartmentProgress } from "@/components/dashboard/DepartmentProgress";
import {
  type JourneyMoment,
  getJourneyMoments,
  subscribeToJourneyMoments,
} from "@/lib/demo-moments";
import {
  chapterStats,
  fleetStandings,
  recognitions,
  tvPanels,
} from "@/lib/data";
import { useJourneyState } from "@/lib/journey-state";
import { daysRemaining, formatMiles } from "@/lib/utils";

export function TvDashboard() {
  const { state } = useJourneyState();
  const panels = useMemo(() => {
    if (state.skinEnabled && state.activeSkinId !== "standard") {
      return tvPanels;
    }

    return tvPanels.filter(
      (panel) =>
        panel !== "Odyssey Signal" &&
        panel !== "North Stars Fleet" &&
        panel !== "15,700 / IMAX 1570",
    );
  }, [state.activeSkinId, state.skinEnabled]);
  const [index, setIndex] = useState(0);
  const [journeyMoments, setJourneyMoments] = useState<JourneyMoment[]>([]);
  const spotlight = recognitions.find((recognition) => recognition.spotlight) ?? recognitions[0];
  const journeySpotlight = journeyMoments[0];
  const rewardSpotlight =
    state.rewards.find((reward) => reward.spotlight && reward.enabled) ??
    state.rewards.find((reward) => reward.enabled) ??
    state.rewards[0];
  const activeIndex = panels.length ? index % panels.length : 0;
  const activePanel = panels[activeIndex] ?? panels[0];
  const communityMiles = state.departments.reduce(
    (total, department) => total + department.progressMiles,
    0,
  );
  const activeEmployees = state.employees.filter(
    (employee) => employee.role === "employee" && employee.active !== false,
  ).length;
  const activeSkin =
    state.skins.find((skin) => skin.id === state.activeSkinId) ?? state.skins[0];

  function enterFullscreen() {
    document.documentElement.requestFullscreen?.();
  }

  useEffect(() => {
    const loadMoments = () => setJourneyMoments(getJourneyMoments());
    loadMoments();
    return subscribeToJourneyMoments(loadMoments);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % Math.max(panels.length, 1));
    }, 7000);

    return () => window.clearInterval(timer);
  }, [panels.length]);

  const panel = useMemo(() => {
    if (activePanel === "Odyssey Signal") {
      return (
        <TvPanel
          icon={Clapperboard}
          eyebrow={state.chapter.subtitle}
          title={activeSkin?.headline ?? "North Stars"}
        >
          <div className="grid max-w-6xl gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="projection-sweep odyssey-frame rounded-lg border border-journey-steel bg-journey-coal p-8">
              <p className="text-xs font-black uppercase text-journey-red">
                {state.chapter.themeLabel}
              </p>
              <p className="mt-5 text-4xl font-black leading-tight text-journey-white sm:text-6xl">
                One team. One journey. Unforgettable guest experiences.
              </p>
              <p className="mt-6 max-w-3xl text-2xl font-bold leading-9 text-journey-line">
                {activeSkin?.visualDirection ?? state.chapter.themeNote}
              </p>
            </div>
            <div className="rounded-lg border border-journey-steel bg-journey-black p-8">
              <p className="text-xs font-black uppercase text-journey-red">
                Journey Signal
              </p>
              <p className="mt-6 text-8xl font-black text-journey-white">
                15/70
              </p>
              <p className="mt-4 text-2xl font-black text-journey-red">
                {formatMiles(state.chapter.communityGoalMiles)} Miles
              </p>
              <p className="mt-5 text-lg font-bold leading-8 text-journey-line">
                {activeSkin?.texture ?? "Film grain, frame marks, and projection light."}
              </p>
            </div>
          </div>
        </TvPanel>
      );
    }

    if (activePanel === "Community Progress") {
      return (
        <TvPanel
          icon={Route}
          eyebrow={activeSkin?.headline ?? "Community Progress"}
          title={state.chapter.phrase}
        >
          <ChapterProgress inverse />
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <TvStat label="Miles Today" value={`+${formatMiles(chapterStats.todayMiles)}`} />
            <TvStat
              label="Remaining"
              value={formatMiles(state.chapter.communityGoalMiles - communityMiles)}
            />
            <TvStat label="Active Crew" value={`${activeEmployees}`} />
          </div>
        </TvPanel>
      );
    }

    if (activePanel === "Today's Spotlight") {
      const employee = state.employees.find((item) => item.id === spotlight.employeeId);
      const action = state.recognitionTypes.find(
        (item) => item.id === spotlight.recognitionTypeId,
      );
      return (
        <TvPanel
          icon={Sparkles}
          eyebrow="Today's Spotlight"
          title={journeySpotlight?.employeeName ?? employee?.name ?? ""}
        >
          <div className="max-w-4xl">
            <p className="text-3xl font-black text-journey-white sm:text-5xl">
              {journeySpotlight?.note ?? spotlight.note}
            </p>
            <p className="mt-6 text-2xl font-bold text-journey-line">
              {journeySpotlight?.recognitionTypeName ?? action?.name}
            </p>
            <p className="mt-4 text-5xl font-black text-journey-red">
              +{journeySpotlight?.miles ?? spotlight.miles} Miles Earned
            </p>
          </div>
        </TvPanel>
      );
    }

    if (activePanel === "15,700 / IMAX 1570") {
      return (
        <TvPanel icon={Film} eyebrow="Chapter One Signal" title="15,700 Miles">
          <div className="grid max-w-5xl gap-5 lg:grid-cols-[1fr_0.7fr]">
            <div>
              <p className="text-3xl font-black text-journey-white sm:text-5xl">
                15,700 Miles - a nod to IMAX 1570 film.
              </p>
              <p className="mt-6 text-2xl font-bold text-journey-line">
                Every verified guest moment, clean space, reliable shift, and crew
                assist moves the whole building forward.
              </p>
            </div>
            <div className="rounded-lg border border-journey-steel bg-journey-coal p-6">
              <p className="text-xs font-black uppercase text-journey-red">15/70</p>
              <p className="mt-4 text-7xl font-black text-journey-white">1570</p>
              <p className="mt-4 text-lg font-bold text-journey-line">
                Projection-inspired, community-focused, and built for Chapter One.
              </p>
            </div>
          </div>
        </TvPanel>
      );
    }

    if (activePanel === "North Stars Fleet") {
      return (
        <TvPanel icon={Route} eyebrow="North Stars Fleet" title="Fleet Progress">
          <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
            <div className="fleet-ocean odyssey-frame rounded-lg p-6">
              <div className="relative z-10 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase text-journey-red tracking-normal">
                    Animated North Stars Course
                  </p>
                  <p className="mt-2 max-w-xl text-2xl font-black text-journey-white">
                    Every crew moves the whole building toward port.
                  </p>
                  <p className="mt-2 max-w-xl text-lg font-bold text-journey-line">
                    Crews sail by shared recognition miles, with the whole building
                    moving toward 15,700.
                  </p>
                </div>
                <div className="rounded-md border border-journey-steel bg-journey-black/75 px-4 py-3 text-right">
                  <p className="text-xs font-black uppercase text-journey-red">
                    Current Leader
                  </p>
                  <p className="mt-1 text-3xl font-black text-journey-white">
                    {fleetStandings[0].crew}
                  </p>
                </div>
              </div>

              {fleetStandings.map((standing, index) => {
                const boatTop = 24 + index * 8.6;
                const boatStyle = {
                  "--boat-progress": `${standing.progress}`,
                  "--boat-top": `${boatTop}%`,
                  "--boat-delay": `${index * 0.22}s`,
                } as CSSProperties;
                const laneStyle = {
                  "--lane-top": `${boatTop + 4}%`,
                } as CSSProperties;

                return (
                  <div key={standing.rank}>
                    <div className="fleet-lane" style={laneStyle} />
                    <div className="fleet-boat" style={boatStyle}>
                      <div className="fleet-sail">
                        <div className="fleet-mast" />
                      </div>
                      <div className="fleet-hull" />
                      <span className="fleet-rank">#{standing.rank}</span>
                    </div>
                  </div>
                );
              })}
              <div className="fleet-horizon" />
            </div>

            <div className="grid gap-3">
              {fleetStandings.map((standing) => (
                <article
                  key={standing.rank}
                  className="rounded-lg border border-journey-steel bg-journey-coal p-4"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase text-journey-red">
                        #{standing.rank} {standing.vessel}
                      </p>
                      <h3 className="mt-1 text-2xl font-black text-journey-white">
                        {standing.crew}
                      </h3>
                    </div>
                    <p className="text-xl font-black text-journey-white">
                      {formatMiles(standing.miles)}
                    </p>
                  </div>
                  <p className="mt-2 text-sm font-bold text-journey-line">
                    {standing.signal}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </TvPanel>
      );
    }

    if (activePanel === "Recognition Wall") {
      return (
        <TvPanel icon={Megaphone} eyebrow="Recognition Wall" title="Journey Moments">
          <div className="grid gap-4 xl:grid-cols-3">
            {journeyMoments.slice(0, 3).map((moment) => (
              <article
                key={moment.id}
                className="rounded-lg border border-journey-red bg-journey-coal p-5"
              >
                <p className="text-xs font-black uppercase text-journey-red">
                  +{moment.miles} Miles Earned
                </p>
                <h3 className="mt-2 text-2xl font-black text-journey-white">
                  {moment.employeeName}
                </h3>
                <p className="mt-2 text-sm font-bold text-journey-line">
                  {moment.recognitionTypeName}
                </p>
                <p className="mt-4 text-base leading-7 text-journey-white">
                  {moment.note}
                </p>
              </article>
            ))}
            {recognitions.slice(0, 6).map((recognition) => {
              const employee = state.employees.find(
                (item) => item.id === recognition.employeeId,
              );
              const action = state.recognitionTypes.find(
                (item) => item.id === recognition.recognitionTypeId,
              );
              return (
                <article
                  key={recognition.id}
                  className="rounded-lg border border-journey-steel bg-journey-coal p-5"
                >
                  <p className="text-xs font-black uppercase text-journey-red">
                    +{recognition.miles} Miles Earned
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-journey-white">
                    {employee?.name}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-journey-line">
                    {action?.name}
                  </p>
                  <p className="mt-4 text-base leading-7 text-journey-white">
                    {recognition.note}
                  </p>
                </article>
              );
            })}
          </div>
        </TvPanel>
      );
    }

    if (activePanel === "Department Progress") {
      return (
        <TvPanel icon={Clapperboard} eyebrow="Department Progress" title="One Team">
          <div className="max-w-5xl">
            <DepartmentProgress inverse />
          </div>
        </TvPanel>
      );
    }

    if (activePanel === "Reward Spotlight") {
      return (
        <TvPanel icon={Gift} eyebrow="Reward Spotlight" title={rewardSpotlight.name}>
          <div className="max-w-4xl">
            <p className="text-3xl font-black text-journey-white sm:text-5xl">
              {rewardSpotlight.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <TvStat label="Miles" value={`${rewardSpotlight.milesCost}`} />
              <TvStat label="In Stock" value={`${rewardSpotlight.inventoryCount}`} />
            </div>
          </div>
        </TvPanel>
      );
    }

    return (
      <TvPanel icon={CalendarClock} eyebrow="Countdown" title={state.chapter.name}>
        <div className="max-w-4xl">
          <p className="text-8xl font-black text-journey-white sm:text-9xl">
            {daysRemaining(state.chapter.endDate)}
          </p>
          <p className="mt-4 text-3xl font-black text-journey-red">Days Remaining</p>
          <p className="mt-6 text-2xl font-bold text-journey-line">
            {state.chapter.subtitle} - {formatMiles(state.chapter.communityGoalMiles)} Miles
          </p>
        </div>
      </TvPanel>
    );
  }, [
    activeEmployees,
    activePanel,
    activeSkin?.headline,
    activeSkin?.texture,
    activeSkin?.visualDirection,
    communityMiles,
    journeyMoments,
    journeySpotlight,
    rewardSpotlight,
    spotlight,
    state.chapter,
    state.employees,
    state.recognitionTypes,
  ]);

  return (
    <main className="cinema-surface film-grain relative min-h-screen overflow-hidden text-journey-white">
      <SkinRuntimeClass />
      <div className="tv-signal-beam pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-8 film-perf opacity-40" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-8 film-perf opacity-40" />
      <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between gap-4 border-b border-journey-steel bg-journey-black/95 px-8 py-5">
        <BrandLockup size="sm" />
        <div className="flex items-center gap-4">
          <PreviewModeBadge />
          <button
            type="button"
            onClick={enterFullscreen}
            className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-journey-steel bg-journey-coal text-journey-white transition hover:border-journey-red"
            aria-label="Open TV dashboard fullscreen"
            title="Fullscreen"
          >
            <Maximize2 className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="text-right">
            <p className="text-xs font-black uppercase text-journey-red">
              {activeSkin?.headline ?? state.chapter.subtitle}
            </p>
            <p className="font-bold text-journey-line">
              {activePanel} / {activeSkin?.motionStyle ?? "Standard loop"}
            </p>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activePanel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="min-h-screen px-8 pb-10 pt-32"
        >
          {panel}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-0 left-0 right-0 z-10 flex h-2">
        {panels.map((panelName, panelIndex) => (
          <div
            key={panelName}
            className={`h-full flex-1 ${
              panelIndex === activeIndex ? "bg-journey-red" : "bg-journey-steel"
            }`}
          />
        ))}
      </div>
    </main>
  );
}

function TvPanel({
  eyebrow,
  title,
  icon: Icon,
  children,
}: {
  eyebrow: string;
  title: string;
  icon: typeof Route;
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-[calc(100vh-10rem)] flex-col justify-center">
      <div className="mb-10 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-md bg-journey-red text-journey-white">
          <Icon className="h-8 w-8" aria-hidden="true" />
        </div>
        <div>
          <p className="text-sm font-black uppercase text-journey-red">{eyebrow}</p>
          <h1 className="mt-2 text-5xl font-black leading-none text-journey-white sm:text-7xl">
            {title}
          </h1>
        </div>
      </div>
      {children}
    </section>
  );
}

function TvStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-journey-steel bg-journey-coal p-5">
      <p className="text-xs font-black uppercase text-journey-red">{label}</p>
      <p className="mt-2 text-4xl font-black text-journey-white">{value}</p>
    </div>
  );
}
