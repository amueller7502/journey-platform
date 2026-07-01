import type { LucideIcon } from "lucide-react";

export type Role = "employee" | "manager" | "admin";

export type StandardId =
  | "guest_welcome"
  | "space_exceptional"
  | "crew_matters"
  | "shift_counts"
  | "detail_matters";

export type DepartmentId =
  | "guest_services"
  | "concessions"
  | "floor"
  | "box_office"
  | "facilities"
  | "leadership";

export type RecognitionCategory =
  | "Excellence Check"
  | "Guest Experience"
  | "Teamwork"
  | "Reliability"
  | "Details"
  | "Manager Award";

export type RecognitionTypeKind =
  | "recognition"
  | "excellence_check"
  | "reliability"
  | "teamwork"
  | "guest_experience"
  | "detail";

export type RecognitionType = {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  category: RecognitionCategory;
  standardId: StandardId;
  milesValue: number;
  icon: string;
  enabled: boolean;
  requiresManagerVerification: boolean;
  sortOrder: number;
  type: RecognitionTypeKind;
};

export type RecognitionStandard = {
  id: StandardId;
  label: string;
  shortLabel: string;
  description: string;
};

export type Employee = {
  id: string;
  name: string;
  role: Role;
  department: DepartmentId;
  title: string;
  initials: string;
  passportId: string;
  passportQrUrl: string;
  active?: boolean;
  miles: number;
  weeklyMiles: number;
  reliabilityStreak: number;
  shift: string;
  lastRecognizedAt?: string;
};

export type Department = {
  id: DepartmentId;
  name: string;
  progressMiles: number;
  goalMiles: number;
};

export type Recognition = {
  id: string;
  employeeId: string;
  managerId: string;
  recognitionTypeId: string;
  standardId: StandardId;
  miles: number;
  note: string;
  createdAt: string;
  batchId?: string;
  spotlight?: boolean;
};

export type Reward = {
  id: string;
  chapterId: string;
  name: string;
  description: string;
  milesCost: number;
  inventoryCount: number;
  imageUrl: string;
  category: "Food" | "Cinema" | "Gear" | "Experience";
  enabled: boolean;
  sortOrder: number;
  redemptionLimitPerEmployee?: number;
  fulfillmentNotes?: string;
  spotlight?: boolean;
};

export type SkinId = "standard" | "odyssey" | "dune_3";

export type JourneySkin = {
  id: SkinId;
  name: string;
  status: "active" | "available" | "draft";
  description: string;
  canDisable: boolean;
  tvTreatment: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
  };
};

export type MenuConfiguration = {
  id: string;
  area: "Employee" | "Manager" | "Admin/GM" | "Utility";
  label: string;
  href: string;
  purpose: string;
  enabled: boolean;
  reusable: boolean;
};

export type FleetStanding = {
  rank: number;
  crew: string;
  vessel: string;
  miles: number;
  progress: number;
  signal: string;
};

export type Redemption = {
  id: string;
  employeeId: string;
  rewardId: string;
  status: "Pending" | "Approved" | "Ready" | "Fulfilled";
  requestedAt: string;
};

export type RecognitionBatch = {
  id: string;
  employeeId: string;
  managerId: string;
  createdAt: string;
  note: string;
  source: "passport" | "manager_entry";
  itemCount: number;
  totalMiles: number;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};
