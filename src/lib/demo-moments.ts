import type { StandardId } from "@/lib/types";

export type DemoMoment = {
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
};

const STORAGE_KEY = "journey-demo-moments";
const EVENT_NAME = "journey-demo-moments";

export function getDemoMoments() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value ? (JSON.parse(value) as DemoMoment[]) : [];
  } catch {
    return [];
  }
}

export function saveDemoMoment(moment: DemoMoment) {
  if (typeof window === "undefined") {
    return;
  }

  const nextMoments = [moment, ...getDemoMoments()].slice(0, 12);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextMoments));
  window.dispatchEvent(new Event(EVENT_NAME));
}

export function subscribeToDemoMoments(callback: () => void) {
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
