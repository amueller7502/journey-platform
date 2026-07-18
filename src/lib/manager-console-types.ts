import type { DepartmentId, Role } from "@/lib/types";

export type ManagerConsolePerson = {
  id: string;
  name: string;
  role: Role;
  department: DepartmentId;
  title: string;
  email?: string;
  passportId: string;
  journeyCardAreaId?: string;
  points: number;
  pendingPoints: number;
  redeemedPoints: number;
  availablePoints: number;
};

export type ManagerConsoleReward = {
  id: string;
  name: string;
  pointsCost: number;
  inventoryCount: number;
};

export type ManagerConsoleRedemption = {
  id: string;
  employeeId: string;
  employeeName: string;
  rewardId: string;
  rewardName: string;
  pointsCost: number;
  fulfilledAt: string;
};

export type ManagerConsolePointHistory = {
  id: string;
  employeeId: string;
  employeeName: string;
  managerName: string;
  label: string;
  points: number;
  note: string;
  source: "moment" | "crew_quest" | "correction";
  createdAt: string;
};

export type ManagerConsoleDepartment = {
  id: DepartmentId;
  name: string;
};

export type ManagerRosterInput = {
  id?: string;
  name: string;
  role?: "employee" | "manager";
  department?: string;
  title?: string;
  email?: string;
};
