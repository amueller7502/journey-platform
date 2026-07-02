import type { StandardId } from "@/lib/types";

export type JourneyMoment = {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeInitials: string;
  recognitionTypeId: string;
  recognitionTypeName: string;
  standardId: StandardId;
  miles: number;
  note: string;
  createdAt: string;
  managerName: string;
  batchId?: string;
};

export type DemoMoment = JourneyMoment;

const STORAGE_KEY = "journey-moments";
const LEGACY_STORAGE_KEY = "journey-demo-moments";
const EVENT_NAME = "journey-moments";

export function getJourneyMoments() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value =
      window.localStorage.getItem(STORAGE_KEY) ??
      window.localStorage.getItem(LEGACY_STORAGE_KEY);
    return value ? (JSON.parse(value) as JourneyMoment[]) : [];
  } catch {
    return [];
  }
}

export function saveJourneyMoment(moment: JourneyMoment) {
  if (typeof window === "undefined") {
    return;
  }

  const nextMoments = [moment, ...getJourneyMoments()].slice(0, 24);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMoments));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeToJourneyMoments(callback: () => void) {
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

export const getDemoMoments = getJourneyMoments;
export const saveDemoMoment = saveJourneyMoment;
export const subscribeToDemoMoments = subscribeToJourneyMoments;
