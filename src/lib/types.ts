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
  | "kitchen"
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
  | "journey_card_task"
  | "excellence_check"
  | "reliability"
  | "teamwork"
  | "guest_experience"
  | "detail";

export type RecognitionCreditScope = "employee" | "department" | "community";

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
  creditScope?: RecognitionCreditScope;
  journeyCardEligible?: boolean;
  journeyCardAreaIds?: string[];
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
  journeyCardAreaId?: string;
  email?: string;
  accessCode?: string;
  accountStatus?: "invited" | "active" | "disabled";
  profilePhotoUrl?: string;
  pendingProfilePhotoUrl?: string;
  profilePhotoStatus?: "none" | "pending" | "approved" | "rejected";
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

export type JourneyCardArea = {
  id: string;
  name: string;
  description: string;
  departmentIds: DepartmentId[];
  enabled: boolean;
  sortOrder: number;
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
  id: SkinId | string;
  name: string;
  status: "active" | "available" | "draft";
  description: string;
  canDisable: boolean;
  tvTreatment: string;
  headline?: string;
  visualDirection?: string;
  motionStyle?: string;
  texture?: string;
  builderNotes?: string;
  patternStyle?: "none" | "film" | "doodles" | "waves" | "marquee";
  backgroundMode?: "clean" | "cinematic" | "playful" | "immersive";
  animationIntensity?: number;
  funLevel?: number;
  doodleDensity?: number;
  titleTreatment?: "clean" | "marquee" | "blockbuster" | "handbill";
  cardTreatment?: "flat" | "poster" | "ticket" | "lobby";
  frameStyle?: "standard" | "filmstrip" | "ticket-stub" | "lightbox";
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    foil?: string;
    deep?: string;
  };
};

export type TvPanelSetting = {
  id: string;
  label: string;
  enabled: boolean;
  sortOrder: number;
  seconds: number;
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

export type ExcellenceLog = {
  id: string;
  recognitionTypeId: string;
  departmentId: DepartmentId;
  managerId: string;
  createdAt: string;
  note: string;
  communityMiles: number;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};
