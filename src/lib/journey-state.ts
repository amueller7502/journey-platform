"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  activeSkin,
  chapter as defaultChapter,
  departments as defaultDepartments,
  employees as defaultEmployees,
  journeySkins as defaultSkins,
  recognitionTypes as defaultRecognitionTypes,
  rewards as defaultRewards,
} from "@/lib/data";
import type {
  Department,
  Employee,
  JourneySkin,
  RecognitionType,
  Reward,
  SkinId,
} from "@/lib/types";

export type JourneyChapter = typeof defaultChapter;

export type JourneyOperatingState = {
  chapter: JourneyChapter;
  departments: Department[];
  employees: Employee[];
  recognitionTypes: RecognitionType[];
  rewards: Reward[];
  skins: JourneySkin[];
  activeSkinId: SkinId;
  skinEnabled: boolean;
  updatedAt: string;
};

const STORAGE_KEY = "journey-operating-state-v1";
const EVENT_NAME = "journey-operating-state";

const defaultState: JourneyOperatingState = {
  chapter: defaultChapter,
  departments: defaultDepartments,
  employees: defaultEmployees,
  recognitionTypes: defaultRecognitionTypes,
  rewards: defaultRewards,
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

function normalizeState(value: Partial<JourneyOperatingState> | null): JourneyOperatingState {
  const next = {
    ...cloneState(defaultState),
    ...(value ?? {}),
    chapter: {
      ...defaultState.chapter,
      ...(value?.chapter ?? {}),
    },
    departments: value?.departments?.length ? value.departments : defaultState.departments,
    employees: value?.employees?.length ? value.employees : defaultState.employees,
    recognitionTypes: value?.recognitionTypes?.length
      ? value.recognitionTypes
      : defaultState.recognitionTypes,
    rewards: value?.rewards?.length ? value.rewards : defaultState.rewards,
    skins: value?.skins?.length ? value.skins : defaultState.skins,
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
