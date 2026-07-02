"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
import {
  activeSkin,
  chapter as defaultChapter,
  departments as defaultDepartments,
  experienceAchievements as defaultExperienceAchievements,
  experienceDisplaySlides as defaultExperienceDisplaySlides,
  employees as defaultEmployees,
  experienceEvents as defaultExperienceEvents,
  excellenceLogs as defaultExcellenceLogs,
  journeyCardAreas as defaultJourneyCardAreas,
  journeySkins as defaultSkins,
  launchReadinessItems as defaultLaunchReadinessItems,
  leadershipPointRules as defaultLeadershipPointRules,
  leadershipRewards as defaultLeadershipRewards,
  recognitionTypes as defaultRecognitionTypes,
  recognitionStandards as defaultRecognitionStandards,
  redemptions as defaultRedemptions,
  rewards as defaultRewards,
  scoringMetrics as defaultScoringMetrics,
  seasons as defaultSeasons,
  tvPanelSettings as defaultTvPanelSettings,
} from "@/lib/data";
import type {
  Department,
  Employee,
  ExperienceAchievement,
  ExperienceDisplaySlide,
  ExperienceSeason,
  ExperienceEvent,
  ExcellenceLog,
  JourneyCardArea,
  JourneyCardShiftAssignment,
  JourneySkin,
  LaunchReadinessItem,
  LeadershipPointRule,
  LeadershipReward,
  RecognitionStandard,
  RecognitionType,
  Redemption,
  Reward,
  ScoringMetric,
  TvPanelSetting,
} from "@/lib/types";

export type JourneyChapter = typeof defaultChapter;

export type JourneyOperatingState = {
  chapter: JourneyChapter;
  seasons: ExperienceSeason[];
  departments: Department[];
  employees: Employee[];
  journeyCardAreas: JourneyCardArea[];
  journeyCardAssignments: JourneyCardShiftAssignment[];
  recognitionStandards: RecognitionStandard[];
  recognitionTypes: RecognitionType[];
  rewards: Reward[];
  redemptions: Redemption[];
  excellenceLogs: ExcellenceLog[];
  experienceEvents: ExperienceEvent[];
  experienceDisplaySlides: ExperienceDisplaySlide[];
  scoringMetrics: ScoringMetric[];
  launchReadinessItems: LaunchReadinessItem[];
  experienceAchievements: ExperienceAchievement[];
  leadershipPointRules: LeadershipPointRule[];
  leadershipRewards: LeadershipReward[];
  tvPanelSettings: TvPanelSetting[];
  skins: JourneySkin[];
  activeSkinId: string;
  skinEnabled: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "journey-operating-state-v1";
const EVENT_NAME = "journey-operating-state";

const defaultState: JourneyOperatingState = {
  chapter: defaultChapter,
  seasons: defaultSeasons,
  departments: defaultDepartments,
  employees: defaultEmployees,
  journeyCardAreas: defaultJourneyCardAreas,
  journeyCardAssignments: [],
  recognitionStandards: defaultRecognitionStandards,
  recognitionTypes: defaultRecognitionTypes,
  rewards: defaultRewards,
  redemptions: defaultRedemptions,
  excellenceLogs: defaultExcellenceLogs,
  experienceEvents: defaultExperienceEvents,
  experienceDisplaySlides: defaultExperienceDisplaySlides,
  scoringMetrics: defaultScoringMetrics,
  launchReadinessItems: defaultLaunchReadinessItems,
  experienceAchievements: defaultExperienceAchievements,
  leadershipPointRules: defaultLeadershipPointRules,
  leadershipRewards: defaultLeadershipRewards,
  tvPanelSettings: defaultTvPanelSettings,
  skins: defaultSkins,
  activeSkinId: activeSkin.id,
  skinEnabled: activeSkin.id !== "standard",
  updatedAt: "seed",
};

const serverSnapshot = cloneState(defaultState);

let cachedRaw: string | null = null;
let cachedState: JourneyOperatingState | null = null;
let remoteHydrationStarted = false;

function cloneState(state: JourneyOperatingState): JourneyOperatingState {
  return JSON.parse(JSON.stringify(state)) as JourneyOperatingState;
}

function mergeById<T extends { id: string }>(defaults: T[], stored?: T[]) {
  if (!stored?.length) {
    return defaults;
  }

  const storedIds = new Set(stored.map((item) => item.id));
  return [
    ...stored,
    ...defaults.filter((defaultItem) => !storedIds.has(defaultItem.id)),
  ];
}

function normalizeState(value: Partial<JourneyOperatingState> | null): JourneyOperatingState {
  const next = {
    ...cloneState(defaultState),
    ...(value ?? {}),
    chapter: {
      ...defaultState.chapter,
      ...(value?.chapter ?? {}),
    },
    seasons: mergeById(defaultState.seasons, value?.seasons),
    departments: mergeById(defaultState.departments, value?.departments),
    employees: mergeById(defaultState.employees, value?.employees),
    journeyCardAreas: mergeById(defaultState.journeyCardAreas, value?.journeyCardAreas),
    journeyCardAssignments: mergeById(
      defaultState.journeyCardAssignments,
      value?.journeyCardAssignments,
    ),
    recognitionStandards: mergeById(
      defaultState.recognitionStandards,
      value?.recognitionStandards,
    ),
    recognitionTypes: mergeById(defaultState.recognitionTypes, value?.recognitionTypes),
    rewards: mergeById(defaultState.rewards, value?.rewards),
    redemptions: mergeById(defaultState.redemptions, value?.redemptions),
    excellenceLogs: mergeById(defaultState.excellenceLogs, value?.excellenceLogs),
    experienceEvents: mergeById(defaultState.experienceEvents, value?.experienceEvents),
    experienceDisplaySlides: mergeById(
      defaultState.experienceDisplaySlides,
      value?.experienceDisplaySlides,
    ),
    scoringMetrics: mergeById(defaultState.scoringMetrics, value?.scoringMetrics),
    launchReadinessItems: mergeById(
      defaultState.launchReadinessItems,
      value?.launchReadinessItems,
    ),
    experienceAchievements: mergeById(
      defaultState.experienceAchievements,
      value?.experienceAchievements,
    ),
    leadershipPointRules: mergeById(
      defaultState.leadershipPointRules,
      value?.leadershipPointRules,
    ),
    leadershipRewards: mergeById(defaultState.leadershipRewards, value?.leadershipRewards),
    tvPanelSettings: mergeById(defaultState.tvPanelSettings, value?.tvPanelSettings),
    skins: mergeById(defaultState.skins, value?.skins),
  };

  const activeExists = next.skins.some((skin) => skin.id === next.activeSkinId);
  if (!activeExists) {
    next.activeSkinId = "standard";
    next.skinEnabled = false;
  }

  return next;
}

export function getDefaultJourneyState() {
  return cloneState(defaultState);
}

function getServerJourneyState() {
  return serverSnapshot;
}

export function getJourneyState(): JourneyOperatingState {
  if (typeof window === "undefined") {
    return getDefaultJourneyState();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (cachedState && raw === cachedRaw) {
    return cachedState;
  }

  try {
    cachedState = normalizeState(raw ? (JSON.parse(raw) as JourneyOperatingState) : null);
    cachedRaw = raw;
    return cachedState;
  } catch {
    cachedState = getDefaultJourneyState();
    cachedRaw = raw;
    return cachedState;
  }
}

export function saveJourneyState(nextState: JourneyOperatingState) {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeState({
    ...nextState,
    updatedAt: new Date().toISOString(),
  });
  const raw = JSON.stringify(normalized);
  cachedState = normalized;
  cachedRaw = raw;
  window.localStorage.setItem(STORAGE_KEY, raw);
  window.dispatchEvent(new Event(EVENT_NAME));
  void persistJourneyStateToDatabase(normalized);
}

async function persistJourneyStateToDatabase(state: JourneyOperatingState) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    await fetch("/api/journey-state", {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ state }),
    });
  } catch {
    // Browser storage remains the offline fallback.
  }
}

async function hydrateJourneyStateFromDatabase() {
  if (typeof window === "undefined" || remoteHydrationStarted) {
    return;
  }

  remoteHydrationStarted = true;
  try {
    const response = await fetch("/api/journey-state", { cache: "no-store" });
    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as {
      state?: Partial<JourneyOperatingState> | null;
    };
    if (!payload.state) {
      return;
    }

    const normalized = normalizeState(payload.state);
    const raw = JSON.stringify(normalized);
    cachedState = normalized;
    cachedRaw = raw;
    window.localStorage.setItem(STORAGE_KEY, raw);
    window.dispatchEvent(new Event(EVENT_NAME));
  } catch {
    // Browser storage remains the offline fallback.
  }
}

export function updateJourneyState(
  updater: (current: JourneyOperatingState) => JourneyOperatingState,
) {
  saveJourneyState(updater(getJourneyState()));
}

export function resetJourneyState() {
  saveJourneyState(getDefaultJourneyState());
}

export function subscribeToJourneyState(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handler = () => callback();
  window.addEventListener(EVENT_NAME, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(EVENT_NAME, handler);
    window.removeEventListener("storage", handler);
  };
}

export function useJourneyState() {
  const state = useSyncExternalStore(
    subscribeToJourneyState,
    getJourneyState,
    getServerJourneyState,
  );

  useEffect(() => {
    void hydrateJourneyStateFromDatabase();
  }, []);

  return useMemo(
    () => ({
      state,
      setState: saveJourneyState,
      updateState: updateJourneyState,
      resetState: resetJourneyState,
    }),
    [state],
  );
}

export function makeInitials(name: string) {
  const parts = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "CC";
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function makeSlugId(value: string, fallback: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

  return slug || fallback;
}

export function nextJourneyCardId(employees: Employee[]) {
  const used = new Set(employees.map((employee) => employee.passportId));
  let index = employees.length + 1;
  let next = `ODY-1570-${String(index).padStart(3, "0")}`;

  while (used.has(next)) {
    index += 1;
    next = `ODY-1570-${String(index).padStart(3, "0")}`;
  }

  return next;
}

export function buildJourneyCardUrl(passportId: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/manager/passport/${passportId}`;
  }

  return `/manager/passport/${passportId}`;
}

export function getJourneyCardAreaForEmployee(
  employee: Employee,
  areas: JourneyCardArea[],
) {
  const assignedArea = areas.find(
    (area) => area.enabled && area.id === employee.journeyCardAreaId,
  );

  if (assignedArea) {
    return assignedArea;
  }

  return areas.find(
    (area) => area.enabled && area.departmentIds.includes(employee.department),
  );
}

export function addMilesToEmployee(employeeId: string, miles: number) {
  updateJourneyState((current) => {
    const employee = current.employees.find((item) => item.id === employeeId);
    if (!employee || employee.role !== "employee") {
      return current;
    }

    const now = new Date().toISOString();

    return {
      ...current,
      employees: current.employees.map((item) =>
        item.id === employeeId
          ? {
              ...item,
              miles: item.miles + miles,
              weeklyMiles: item.weeklyMiles + miles,
              lastRecognizedAt: now,
            }
          : item,
      ),
      departments: employee
        ? current.departments.map((department) =>
            department.id === employee.department
              ? {
                  ...department,
                  progressMiles: department.progressMiles + miles,
                }
              : department,
          )
        : current.departments,
      updatedAt: now,
    };
  });
}

export function addDepartmentProgressMiles(departmentId: string, miles: number) {
  updateJourneyState((current) => ({
    ...current,
    departments: current.departments.map((department) =>
      department.id === departmentId
        ? {
            ...department,
            progressMiles: department.progressMiles + miles,
          }
        : department,
    ),
    updatedAt: new Date().toISOString(),
  }));
}

export function logExcellenceCheck({
  recognitionTypeId,
  departmentId,
  managerId,
  note,
  communityMiles,
}: {
  recognitionTypeId: string;
  departmentId: Employee["department"];
  managerId: string;
  note: string;
  communityMiles: number;
}) {
  updateJourneyState((current) => {
    const now = new Date().toISOString();

    return {
      ...current,
      excellenceLogs: [
        {
          id: `check-${recognitionTypeId}-${Date.now()}`,
          recognitionTypeId,
          departmentId,
          managerId,
          createdAt: now,
          note,
          communityMiles,
        },
        ...current.excellenceLogs,
      ].slice(0, 60),
      departments: current.departments.map((department) =>
        department.id === departmentId
          ? {
              ...department,
              progressMiles: department.progressMiles + communityMiles,
            }
          : department,
      ),
      updatedAt: now,
    };
  });
}
