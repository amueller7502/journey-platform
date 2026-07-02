"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  activeSkin,
  chapter as defaultChapter,
  departments as defaultDepartments,
  employees as defaultEmployees,
  excellenceLogs as defaultExcellenceLogs,
  journeyCardAreas as defaultJourneyCardAreas,
  journeySkins as defaultSkins,
  recognitionTypes as defaultRecognitionTypes,
  rewards as defaultRewards,
} from "@/lib/data";
import type {
  Department,
  Employee,
  ExcellenceLog,
  JourneyCardArea,
  JourneySkin,
  RecognitionType,
  Reward,
} from "@/lib/types";

export type JourneyChapter = typeof defaultChapter;

export type JourneyOperatingState = {
  chapter: JourneyChapter;
  departments: Department[];
  employees: Employee[];
  journeyCardAreas: JourneyCardArea[];
  recognitionTypes: RecognitionType[];
  rewards: Reward[];
  excellenceLogs: ExcellenceLog[];
  skins: JourneySkin[];
  activeSkinId: string;
  skinEnabled: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "journey-operating-state-v1";
const EVENT_NAME = "journey-operating-state";

const defaultState: JourneyOperatingState = {
  chapter: defaultChapter,
  departments: defaultDepartments,
  employees: defaultEmployees,
  journeyCardAreas: defaultJourneyCardAreas,
  recognitionTypes: defaultRecognitionTypes,
  rewards: defaultRewards,
  excellenceLogs: defaultExcellenceLogs,
  skins: defaultSkins,
  activeSkinId: activeSkin.id,
  skinEnabled: activeSkin.id !== "standard",
  updatedAt: "seed",
};

let cachedRaw: string | null = null;
let cachedState: JourneyOperatingState | null = null;

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
    departments: mergeById(defaultState.departments, value?.departments),
    employees: mergeById(defaultState.employees, value?.employees),
    journeyCardAreas: mergeById(defaultState.journeyCardAreas, value?.journeyCardAreas),
    recognitionTypes: mergeById(defaultState.recognitionTypes, value?.recognitionTypes),
    rewards: mergeById(defaultState.rewards, value?.rewards),
    excellenceLogs: mergeById(defaultState.excellenceLogs, value?.excellenceLogs),
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
    getDefaultJourneyState,
  );

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
