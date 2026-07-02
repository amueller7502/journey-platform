import type { LucideIcon } from "lucide-react";

export type Role = "employee" | "manager" | "admin";

export type PlatformRole = "employee" | "leader" | "experience_designer";

export type FeatureFlagId =
  | "capture_moment"
  | "experience_cards"
  | "card_printing_pdf"
  | "employee_lookup"
  | "employee_xp_totals"
  | "rewards"
  | "basic_settings"
  | "community"
  | "seasons"
  | "season_planner"
  | "events"
  | "leadership"
  | "leadership_points"
  | "leadership_rewards"
  | "tv_display"
  | "experience_studio_advanced"
  | "scoring"
  | "achievements"
  | "analytics"
  | "experience_stories"
  | "moment_history"
  | "authentication"
  | "supabase_persistence";

export type FeatureLaunchPhase =
  | "Launch"
  | "Later Season One"
  | "Season Two"
  | "Future Platform";

export type FeatureCategory =
  | "Lite Launch"
  | "Employee Experience"
  | "Manager Operations"
  | "Rewards"
  | "Studio"
  | "Leadership"
  | "Displays"
  | "Platform";

export type FeaturePresetId =
  | "experience_lite"
  | "season_one_full"
  | "advanced_platform"
  | "custom";

export type FeatureFlag = {
  id: FeatureFlagId;
  enabled: boolean;
  label: string;
  description: string;
  category: FeatureCategory;
  minimumRole: Role;
  visibleInNavigation: boolean;
  launchPhase: FeatureLaunchPhase;
  sortOrder: number;
};

export type ConfigLifecycle = "draft" | "published" | "archived";

export type ConfigurableMeta = {
  lifecycle: ConfigLifecycle;
  enabled: boolean;
  sortOrder: number;
  seasonId: string;
  createdAt: string;
  updatedAt: string;
};

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
  storyPrompt?: string;
  enabled?: boolean;
  sortOrder?: number;
  lifecycle?: ConfigLifecycle;
  seasonId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type SeasonStatus = "draft" | "preview" | "active" | "archived";

export type ExperienceSeason = {
  id: string;
  name: string;
  subtitle: string;
  seasonLabel: string;
  seasonTitle: string;
  startDate: string;
  endDate: string;
  communityXpGoal: number;
  welcomeMessage: string;
  tagline: string;
  heroArtworkUrl: string;
  experienceCardArtworkUrl: string;
  skinId: string;
  status: SeasonStatus;
  active: boolean;
  previewEnabled: boolean;
  createdAt: string;
  updatedAt: string;
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

export type JourneyCardShiftAssignment = {
  id: string;
  employeeId: string;
  journeyCardAreaId: string;
  shiftDate: string;
  createdAt: string;
  printedAt?: string;
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
  collection?:
    | "Everyday Rewards"
    | "Featured Rewards"
    | "Collector's Vault"
    | "Experience Rewards"
    | "Season Exclusives"
    | "Coming Soon";
  tier?: "Tier 1" | "Tier 2" | "Tier 3";
  enabled: boolean;
  sortOrder: number;
  redemptionLimitPerEmployee?: number;
  fulfillmentNotes?: string;
  spotlight?: boolean;
  featured?: boolean;
  isNew?: boolean;
  seasonExclusive?: boolean;
  collector?: boolean;
  comingSoon?: boolean;
  almostGoneThreshold?: number;
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
  marqueeSpeed?: number;
  projectorSweep?: number;
  floatAmplitude?: number;
  confettiLevel?: number;
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

export type ExperienceEventType =
  | "Today's Focus"
  | "Community Challenge"
  | "Bonus XP Event"
  | "Flash Event"
  | "Surprise Drop"
  | "Mystery Mission"
  | "Premiere Event"
  | "Season Finale Event";

export type ExperienceEvent = {
  id: string;
  type: ExperienceEventType;
  title: string;
  description: string;
  startAt: string;
  endAt: string;
  xpModifier: number;
  eligibleRecognitionTypeIds: string[];
  departmentIds: DepartmentId[];
  tvAnnouncement: string;
  banner: string;
  enabled: boolean;
  sortOrder: number;
  lifecycle?: ConfigLifecycle;
  seasonId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type DisplaySlideType =
  | "Community XP"
  | "Today's Focus"
  | "Recognition Spotlight"
  | "Department Progress"
  | "Reward Spotlight"
  | "Countdown"
  | "Experience Score"
  | "Leaderboard"
  | "Custom";

export type ExperienceDisplaySlide = ConfigurableMeta & {
  id: string;
  type: DisplaySlideType;
  label: string;
  headline: string;
  supportingText: string;
  durationSeconds: number;
  showOnTv: boolean;
};

export type ScoringMetricId =
  | "experience_score"
  | "leadership_health"
  | "presentation_score"
  | "recognition_coverage";

export type ScoringMetric = ConfigurableMeta & {
  id: ScoringMetricId;
  label: string;
  description: string;
  weight: number;
  target: number;
  currentValue: number;
};

export type LaunchReadinessItem = ConfigurableMeta & {
  id: string;
  label: string;
  owner: "Admin/GM" | "Leader" | "Experience Designer";
  status: "not_started" | "in_progress" | "ready" | "blocked";
  dueDate: string;
  notes: string;
};

export type ExperienceAchievementAudience = "employee" | "leader";

export type ExperienceAchievement = ConfigurableMeta & {
  id: string;
  audience: ExperienceAchievementAudience;
  title: string;
  description: string;
  collection: string;
  hidden: boolean;
  badgeImageUrl: string;
  criteria: string;
};

export type LeadershipPointRule = ConfigurableMeta & {
  id: string;
  name: string;
  description: string;
  lpValue: number;
  category: LeadershipRecognitionCategory;
  requiresNote: boolean;
};

export type StudioModuleStatus = "configured" | "needs_attention" | "planned";

export type StudioModule = {
  id: string;
  name: string;
  href: string;
  description: string;
  status: StudioModuleStatus;
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
  status: "Requested" | "Approved" | "Fulfilled" | "Cancelled" | "Pending" | "Ready";
  requestedAt: string;
  reviewedAt?: string;
  fulfilledAt?: string;
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

export type LeadershipRecognitionCategory =
  | "Coaching"
  | "Coverage"
  | "Communication"
  | "Guest Recovery"
  | "Operational Leadership";

export type LeadershipRecognition = {
  id: string;
  leaderId: string;
  recognizedById: string;
  category: LeadershipRecognitionCategory;
  title: string;
  note: string;
  createdAt: string;
  impact: string;
};

export type LeadershipAchievement = {
  id: string;
  leaderId: string;
  title: string;
  description: string;
  status: "earned" | "in_progress" | "locked";
  earnedAt?: string;
};

export type LeadershipReward = {
  id: string;
  name: string;
  description: string;
  status: "available" | "earned" | "scheduled";
  fulfillmentNotes: string;
  lpCost?: number;
  collection?: "Everyday Leadership" | "Professional Development" | "Premium" | "Leadership Experiences" | "Season Exclusives";
  enabled?: boolean;
  sortOrder?: number;
  lifecycle?: ConfigLifecycle;
  seasonId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CoachingInsight = {
  id: string;
  leaderId: string;
  title: string;
  detail: string;
  action: string;
  priority: "High" | "Medium" | "Low";
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};
