import {
  Award,
  BadgeCheck,
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Clapperboard,
  Coins,
  Film,
  Gauge,
  Gift,
  HandHeart,
  Home,
  LayoutDashboard,
  Library,
  Megaphone,
  MonitorPlay,
  Package,
  QrCode,
  Route,
  Settings,
  Sparkles,
  Store,
  User,
  Users,
} from "lucide-react";
import type {
  Department,
  DepartmentId,
  Employee,
  FleetStanding,
  JourneySkin,
  MenuConfiguration,
  NavItem,
  Recognition,
  RecognitionBatch,
  RecognitionCategory,
  RecognitionStandard,
  RecognitionType,
  Redemption,
  Reward,
  Role,
} from "./types";

export const chapter = {
  id: "chapter-one-odyssey",
  name: "The Journey",
  subtitle: "Chapter One: The Odyssey",
  chapterNumber: "Chapter One",
  chapterTitle: "The Odyssey",
  phrase: "Every Mile Matters",
  visualTagline: "Every Mile Matters",
  location: "Celebration Cinema North",
  communityGoalMiles: 15700,
  themeLabel: "Odyssey / North Stars / IMAX 1570",
  themeNote: "Inspired by IMAX 1570 film",
  imaxReference: "15,700 Miles - a nod to IMAX 1570 film.",
  startDate: "2026-07-16",
  endDate: "2026-08-12",
  active: true,
};

export const COMMUNITY_GOAL_MILES = chapter.communityGoalMiles;

export const journeySkins: JourneySkin[] = [
  {
    id: "standard",
    name: "Cinema Standard",
    status: "available",
    description:
      "The clean black, white, gray, and Celebration red base system with minimal chapter styling.",
    canDisable: false,
    tvTreatment: "Standard recognition loop",
    palette: {
      primary: "#050505",
      secondary: "#ffffff",
      accent: "#d71920",
    },
  },
  {
    id: "odyssey",
    name: "Odyssey / North Stars",
    status: "active",
    description:
      "Naval voyage, IMAX 1570 film cues, animated waves, fleet standings, and premium chapter language.",
    canDisable: true,
    tvTreatment: "Fleet race, film grain, projection sweep, and 15/70 chapter card",
    palette: {
      primary: "#050505",
      secondary: "#d8d8d8",
      accent: "#d71920",
    },
  },
  {
    id: "dune_3",
    name: "Dune 3",
    status: "draft",
    description:
      "Future chapter skin slot for desert, spice-route, and premium event theming.",
    canDisable: true,
    tvTreatment: "Draft concept",
    palette: {
      primary: "#050505",
      secondary: "#f4f4f4",
      accent: "#d71920",
    },
  },
];

export const activeSkin = journeySkins.find((skin) => skin.status === "active") ?? journeySkins[0];

export const recognitionStandards: RecognitionStandard[] = [
  {
    id: "guest_welcome",
    label: "Every Guest Feels Welcome",
    shortLabel: "Guest Welcome",
    description: "Warm greetings, helpful answers, and confident recoveries.",
  },
  {
    id: "space_exceptional",
    label: "Every Space Looks Exceptional",
    shortLabel: "Presentation",
    description: "Clean, sharp, guest-ready spaces from curb to auditorium.",
  },
  {
    id: "crew_matters",
    label: "Every Crew Member Matters",
    shortLabel: "Teamwork",
    description: "Support across stations, departments, and rush moments.",
  },
  {
    id: "shift_counts",
    label: "Every Shift Counts",
    shortLabel: "Reliability",
    description: "Attendance, punctuality, coverage, and closing strong.",
  },
  {
    id: "detail_matters",
    label: "Every Detail Matters",
    shortLabel: "Details",
    description: "Small choices that protect the premium cinema experience.",
  },
];

export const recognitionTypes: RecognitionType[] = [
  {
    id: "bathroom_excellence",
    chapterId: chapter.id,
    name: "Bathroom Excellence",
    description: "Restrooms are clean, stocked, odor-free, and guest-ready.",
    category: "Excellence Check",
    standardId: "space_exceptional",
    milesValue: 10,
    icon: "BadgeCheck",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 10,
    type: "excellence_check",
  },
  {
    id: "lobby_excellence",
    chapterId: chapter.id,
    name: "Lobby Excellence",
    description: "Lobby presentation is sharp, clear, and welcoming.",
    category: "Excellence Check",
    standardId: "space_exceptional",
    milesValue: 10,
    icon: "Clapperboard",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 20,
    type: "excellence_check",
  },
  {
    id: "theater_excellence",
    chapterId: chapter.id,
    name: "Theater Excellence",
    description: "Auditorium reset meets opening standard between shows.",
    category: "Excellence Check",
    standardId: "space_exceptional",
    milesValue: 10,
    icon: "Film",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 30,
    type: "excellence_check",
  },
  {
    id: "bib_excellence",
    chapterId: chapter.id,
    name: "BIB Excellence",
    description: "BIB area is organized, clean, and ready for rush.",
    category: "Excellence Check",
    standardId: "detail_matters",
    milesValue: 10,
    icon: "Gauge",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 40,
    type: "excellence_check",
  },
  {
    id: "oscars_excellence",
    chapterId: chapter.id,
    name: "Oscar's Excellence",
    description: "Oscar's area is stocked, reset, and premium-presented.",
    category: "Excellence Check",
    standardId: "detail_matters",
    milesValue: 10,
    icon: "Award",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 50,
    type: "excellence_check",
  },
  {
    id: "concession_excellence",
    chapterId: chapter.id,
    name: "Concession Excellence",
    description: "Counters, service line, and backbar are clean and ready.",
    category: "Excellence Check",
    standardId: "detail_matters",
    milesValue: 10,
    icon: "Store",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 60,
    type: "excellence_check",
  },
  {
    id: "utility_excellence",
    chapterId: chapter.id,
    name: "Utility Excellence",
    description: "Utility spaces are organized and service-safe.",
    category: "Excellence Check",
    standardId: "space_exceptional",
    milesValue: 10,
    icon: "ClipboardCheck",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 70,
    type: "excellence_check",
  },
  {
    id: "exterior_excellence",
    chapterId: chapter.id,
    name: "Exterior Excellence",
    description: "Exterior entry points look clean, safe, and welcoming.",
    category: "Excellence Check",
    standardId: "space_exceptional",
    milesValue: 10,
    icon: "Route",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 80,
    type: "excellence_check",
  },
  {
    id: "digital_signage_excellence",
    chapterId: chapter.id,
    name: "Digital Signage Excellence",
    description: "Digital boards and guest-facing signage are accurate.",
    category: "Excellence Check",
    standardId: "detail_matters",
    milesValue: 10,
    icon: "MonitorPlay",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 90,
    type: "excellence_check",
  },
  {
    id: "imax_queue_excellence",
    chapterId: chapter.id,
    name: "IMAX Queue Excellence",
    description: "IMAX 15/70 guest flow feels clear, calm, and premium.",
    category: "Excellence Check",
    standardId: "guest_welcome",
    milesValue: 10,
    icon: "Film",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 100,
    type: "excellence_check",
  },
  {
    id: "parking_lot_exterior_walk",
    chapterId: chapter.id,
    name: "Parking Lot / Exterior Walk",
    description: "Exterior walk-through completed and issues escalated.",
    category: "Excellence Check",
    standardId: "space_exceptional",
    milesValue: 10,
    icon: "Route",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 110,
    type: "excellence_check",
  },
  {
    id: "guest_compliment",
    chapterId: chapter.id,
    name: "Guest Compliment",
    description: "A guest specifically complimented the employee's service.",
    category: "Guest Experience",
    standardId: "guest_welcome",
    milesValue: 20,
    icon: "Sparkles",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 200,
    type: "guest_experience",
  },
  {
    id: "survey_mention",
    chapterId: chapter.id,
    name: "Survey Mention",
    description: "Employee was named in a guest survey or written response.",
    category: "Guest Experience",
    standardId: "guest_welcome",
    milesValue: 50,
    icon: "Megaphone",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 210,
    type: "guest_experience",
  },
  {
    id: "guest_recovery",
    chapterId: chapter.id,
    name: "Guest Recovery",
    description: "Employee turned a service issue into a stronger guest moment.",
    category: "Guest Experience",
    standardId: "guest_welcome",
    milesValue: 40,
    icon: "HandHeart",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 220,
    type: "guest_experience",
  },
  {
    id: "help_another_department",
    chapterId: chapter.id,
    name: "Help Another Department",
    description: "Employee stepped across station lines to support the operation.",
    category: "Teamwork",
    standardId: "crew_matters",
    milesValue: 15,
    icon: "Users",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 300,
    type: "teamwork",
  },
  {
    id: "coworker_recognition",
    chapterId: chapter.id,
    name: "Coworker Recognition",
    description: "Crew member was recognized for making another teammate stronger.",
    category: "Teamwork",
    standardId: "crew_matters",
    milesValue: 15,
    icon: "Users",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 310,
    type: "teamwork",
  },
  {
    id: "picked_up_shift",
    chapterId: chapter.id,
    name: "Picked Up Shift",
    description: "Employee picked up coverage when the building needed it.",
    category: "Reliability",
    standardId: "shift_counts",
    milesValue: 40,
    icon: "CalendarDays",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 400,
    type: "reliability",
  },
  {
    id: "stayed_late",
    chapterId: chapter.id,
    name: "Stayed Late",
    description: "Employee stayed late to finish the guest or crew handoff well.",
    category: "Reliability",
    standardId: "shift_counts",
    milesValue: 20,
    icon: "Gauge",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 410,
    type: "reliability",
  },
  {
    id: "perfect_attendance_weekly",
    chapterId: chapter.id,
    name: "Perfect Attendance Weekly",
    description: "Weekly attendance was clean and dependable.",
    category: "Reliability",
    standardId: "shift_counts",
    milesValue: 30,
    icon: "CalendarDays",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 420,
    type: "reliability",
  },
  {
    id: "weekend_warrior",
    chapterId: chapter.id,
    name: "Weekend Warrior",
    description: "Employee showed up strong during weekend volume.",
    category: "Reliability",
    standardId: "shift_counts",
    milesValue: 40,
    icon: "Award",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 430,
    type: "reliability",
  },
  {
    id: "perfect_punctuality_weekly",
    chapterId: chapter.id,
    name: "Perfect Punctuality Weekly",
    description: "Employee clocked in on time and ready for every shift this week.",
    category: "Reliability",
    standardId: "shift_counts",
    milesValue: 20,
    icon: "Gauge",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 440,
    type: "reliability",
  },
  {
    id: "manager_above_beyond",
    chapterId: chapter.id,
    name: "Manager Above & Beyond",
    description: "Manager-awarded recognition for uncommon ownership or detail.",
    category: "Manager Award",
    standardId: "detail_matters",
    milesValue: 50,
    icon: "Award",
    enabled: true,
    requiresManagerVerification: true,
    sortOrder: 500,
    type: "detail",
  },
  {
    id: "projection_detail_save",
    chapterId: chapter.id,
    name: "Projection Detail Save",
    description: "Employee caught a detail before it affected presentation.",
    category: "Details",
    standardId: "detail_matters",
    milesValue: 25,
    icon: "Film",
    enabled: false,
    requiresManagerVerification: true,
    sortOrder: 510,
    type: "detail",
  },
];

export const enabledRecognitionTypes = recognitionTypes
  .filter((type) => type.enabled)
  .sort((a, b) => a.sortOrder - b.sortOrder);

export const excellenceCheckTypes = enabledRecognitionTypes.filter(
  (type) => type.type === "excellence_check",
);

export const recognitionEntryTypes = enabledRecognitionTypes.filter(
  (type) => type.type !== "excellence_check",
);

export const departments: Department[] = [
  { id: "guest_services", name: "Guest Services", progressMiles: 2450, goalMiles: 3300 },
  { id: "concessions", name: "Concessions", progressMiles: 2820, goalMiles: 3600 },
  { id: "floor", name: "Floor", progressMiles: 3100, goalMiles: 4000 },
  { id: "box_office", name: "Box Office", progressMiles: 1520, goalMiles: 2400 },
  { id: "facilities", name: "Facilities", progressMiles: 1180, goalMiles: 1800 },
];

export const employees: Employee[] = [
  {
    id: "emp-alex",
    name: "Alex Rivera",
    role: "employee",
    department: "floor",
    title: "Floor Crew",
    initials: "AR",
    passportId: "ODY-1570-001",
    passportQrUrl: "http://127.0.0.1:3000/manager/passport/ODY-1570-001",
    miles: 660,
    weeklyMiles: 105,
    reliabilityStreak: 4,
    shift: "Nights",
    lastRecognizedAt: "2026-07-24T18:30:00",
  },
  {
    id: "emp-maya",
    name: "Maya Thompson",
    role: "employee",
    department: "concessions",
    title: "Concessions Crew",
    initials: "MT",
    passportId: "ODY-1570-002",
    passportQrUrl: "http://127.0.0.1:3000/manager/passport/ODY-1570-002",
    miles: 590,
    weeklyMiles: 80,
    reliabilityStreak: 3,
    shift: "Weekends",
    lastRecognizedAt: "2026-07-24T17:10:00",
  },
  {
    id: "emp-eli",
    name: "Eli Brooks",
    role: "employee",
    department: "guest_services",
    title: "Guest Services",
    initials: "EB",
    passportId: "ODY-1570-003",
    passportQrUrl: "http://127.0.0.1:3000/manager/passport/ODY-1570-003",
    miles: 520,
    weeklyMiles: 65,
    reliabilityStreak: 2,
    shift: "Matinees",
    lastRecognizedAt: "2026-07-24T15:45:00",
  },
  {
    id: "emp-nora",
    name: "Nora Patel",
    role: "employee",
    department: "box_office",
    title: "Box Office",
    initials: "NP",
    passportId: "ODY-1570-004",
    passportQrUrl: "http://127.0.0.1:3000/manager/passport/ODY-1570-004",
    miles: 450,
    weeklyMiles: 70,
    reliabilityStreak: 5,
    shift: "Mixed",
    lastRecognizedAt: "2026-07-23T21:00:00",
  },
  {
    id: "emp-dante",
    name: "Dante Williams",
    role: "employee",
    department: "facilities",
    title: "Facilities Crew",
    initials: "DW",
    passportId: "ODY-1570-005",
    passportQrUrl: "http://127.0.0.1:3000/manager/passport/ODY-1570-005",
    miles: 410,
    weeklyMiles: 0,
    reliabilityStreak: 3,
    shift: "Closings",
    lastRecognizedAt: "2026-07-16T19:20:00",
  },
  {
    id: "mgr-jordan",
    name: "Jordan Ellis",
    role: "manager",
    department: "leadership",
    title: "Shift Manager",
    initials: "JE",
    passportId: "MGR-1570-001",
    passportQrUrl: "http://127.0.0.1:3000/manager/passport/MGR-1570-001",
    miles: 0,
    weeklyMiles: 0,
    reliabilityStreak: 0,
    shift: "Leadership",
  },
  {
    id: "admin-sam",
    name: "Sam Carter",
    role: "admin",
    department: "leadership",
    title: "General Manager",
    initials: "SC",
    passportId: "GM-1570-001",
    passportQrUrl: "http://127.0.0.1:3000/manager/passport/GM-1570-001",
    miles: 0,
    weeklyMiles: 0,
    reliabilityStreak: 0,
    shift: "Leadership",
  },
];

export const recognitionBatches: RecognitionBatch[] = [
  {
    id: "batch-passport-240724",
    employeeId: "emp-alex",
    managerId: "mgr-jordan",
    createdAt: "2026-07-24T18:35:00",
    note: "Journey Card verified after closing rush.",
    source: "passport",
    itemCount: 4,
    totalMiles: 40,
  },
];

export const recognitions: Recognition[] = [
  {
    id: "rec-1001",
    employeeId: "emp-alex",
    managerId: "mgr-jordan",
    recognitionTypeId: "theater_excellence",
    standardId: "space_exceptional",
    miles: 10,
    note: "Auditorium 7 was reset to opening standard between sold-out shows.",
    createdAt: "2026-07-24T18:30:00",
    batchId: "batch-passport-240724",
    spotlight: true,
  },
  {
    id: "rec-1002",
    employeeId: "emp-maya",
    managerId: "mgr-jordan",
    recognitionTypeId: "guest_compliment",
    standardId: "guest_welcome",
    miles: 20,
    note: "A guest called out the quick refill and warm handoff during rush.",
    createdAt: "2026-07-24T17:10:00",
  },
  {
    id: "rec-1003",
    employeeId: "emp-eli",
    managerId: "mgr-jordan",
    recognitionTypeId: "guest_recovery",
    standardId: "guest_welcome",
    miles: 40,
    note: "Resolved a seating issue calmly and kept the group excited for the show.",
    createdAt: "2026-07-24T15:45:00",
  },
  {
    id: "rec-1004",
    employeeId: "emp-nora",
    managerId: "mgr-jordan",
    recognitionTypeId: "perfect_punctuality_weekly",
    standardId: "shift_counts",
    miles: 20,
    note: "Perfect clock-in timing for the week and clean station starts.",
    createdAt: "2026-07-23T21:00:00",
  },
  {
    id: "rec-1005",
    employeeId: "emp-dante",
    managerId: "mgr-jordan",
    recognitionTypeId: "exterior_excellence",
    standardId: "space_exceptional",
    miles: 10,
    note: "Front entry looked sharp before the evening set.",
    createdAt: "2026-07-16T19:20:00",
  },
  {
    id: "rec-1006",
    employeeId: "emp-alex",
    managerId: "mgr-jordan",
    recognitionTypeId: "help_another_department",
    standardId: "crew_matters",
    miles: 15,
    note: "Jumped to concessions to clear a line before previews started.",
    createdAt: "2026-07-22T20:05:00",
    batchId: "batch-passport-240724",
  },
  {
    id: "rec-1007",
    employeeId: "emp-maya",
    managerId: "mgr-jordan",
    recognitionTypeId: "manager_above_beyond",
    standardId: "detail_matters",
    miles: 50,
    note: "Caught a stock issue early and prevented a service slowdown.",
    createdAt: "2026-07-22T17:35:00",
    spotlight: true,
  },
];

export const rewards: Reward[] = [
  {
    id: "reward-popcorn",
    chapterId: chapter.id,
    name: "Popcorn Combo",
    description: "A classic break-room favorite for a strong shift.",
    milesCost: 120,
    inventoryCount: 18,
    imageUrl: "/brand/celebration-c-frame.png",
    category: "Food",
    enabled: true,
    sortOrder: 10,
    redemptionLimitPerEmployee: 2,
    fulfillmentNotes: "Manager hands off at end of shift.",
  },
  {
    id: "reward-ticket",
    chapterId: chapter.id,
    name: "Movie Pass",
    description: "One employee movie pass for a Journey mile marker.",
    milesCost: 220,
    inventoryCount: 12,
    imageUrl: "/brand/celebration-c-frame.png",
    category: "Cinema",
    enabled: true,
    sortOrder: 20,
    redemptionLimitPerEmployee: 2,
    fulfillmentNotes: "Issue as employee pass voucher.",
    spotlight: true,
  },
  {
    id: "reward-hoodie",
    chapterId: chapter.id,
    name: "Crew Hoodie",
    description: "Limited Chapter One apparel with premium red detail.",
    milesCost: 500,
    inventoryCount: 6,
    imageUrl: "/brand/celebration-c-frame.png",
    category: "Gear",
    enabled: true,
    sortOrder: 30,
    redemptionLimitPerEmployee: 1,
    fulfillmentNotes: "Confirm size before fulfillment.",
  },
  {
    id: "reward-vip",
    chapterId: chapter.id,
    name: "VIP Seat Package",
    description: "Premium seat experience for two after an exceptional run.",
    milesCost: 750,
    inventoryCount: 3,
    imageUrl: "/brand/celebration-c-frame.png",
    category: "Experience",
    enabled: true,
    sortOrder: 40,
    redemptionLimitPerEmployee: 1,
    fulfillmentNotes: "GM approval before scheduling.",
  },
  {
    id: "reward-poster",
    chapterId: chapter.id,
    name: "1570 Poster Print",
    description: "Chapter One desk print inspired by IMAX 1570 film.",
    milesCost: 180,
    inventoryCount: 0,
    imageUrl: "/brand/celebration-c-frame.png",
    category: "Gear",
    enabled: false,
    sortOrder: 50,
    fulfillmentNotes: "Disabled until restocked.",
  },
];

export const redemptions: Redemption[] = [
  {
    id: "red-1",
    employeeId: "emp-alex",
    rewardId: "reward-ticket",
    status: "Pending",
    requestedAt: "2026-07-24T14:15:00",
  },
  {
    id: "red-2",
    employeeId: "emp-nora",
    rewardId: "reward-popcorn",
    status: "Pending",
    requestedAt: "2026-07-24T12:40:00",
  },
  {
    id: "red-3",
    employeeId: "emp-maya",
    rewardId: "reward-popcorn",
    status: "Ready",
    requestedAt: "2026-07-23T16:20:00",
  },
];

export const employeeNav: NavItem[] = [
  { label: "Home", href: "/home", icon: Home },
  { label: "My Journey", href: "/my-journey", icon: Route },
  { label: "Trading Post", href: "/trading-post", icon: Store },
  { label: "Community", href: "/community", icon: Users },
  { label: "Profile", href: "/profile", icon: User },
];

export const managerNav: NavItem[] = [
  { label: "Capture Moment", href: "/manager/recognize", icon: HandHeart },
  { label: "Journey Card Entry", href: "/manager/passport", icon: QrCode },
  { label: "Excellence Checks", href: "/manager/excellence-checks", icon: ClipboardCheck },
  { label: "Pending Rewards", href: "/manager/pending-rewards", icon: Gift },
  { label: "Daily Spotlight", href: "/manager/daily-spotlight", icon: Sparkles },
  { label: "Moment Feed", href: "/manager/recognition-feed", icon: Megaphone },
];

export const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Employees", href: "/admin/employees", icon: Users },
  { label: "Recognition Library", href: "/admin/recognition-library", icon: Library },
  { label: "Rewards / Inventory", href: "/admin/rewards", icon: Package },
  { label: "Journey Cards", href: "/admin/passports", icon: QrCode },
  { label: "Recognition Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Chapter Management", href: "/admin/chapters", icon: CalendarDays },
];

export const utilityNav: NavItem[] = [
  { label: "TV Display", href: "/tv", icon: MonitorPlay },
  { label: "Welcome", href: "/", icon: Clapperboard },
];

export const menuConfigurations: MenuConfiguration[] = [
  ...employeeNav.map((item, index) => ({
    id: `employee-${index}`,
    area: "Employee" as const,
    label: item.label,
    href: item.href,
    purpose: "Employee-facing chapter experience",
    enabled: true,
    reusable: true,
  })),
  ...managerNav.map((item, index) => ({
    id: `manager-${index}`,
    area: "Manager" as const,
    label: item.label,
    href: item.href,
    purpose: "Manager tools and recognition entry",
    enabled: true,
    reusable: true,
  })),
  ...adminNav.map((item, index) => ({
    id: `admin-${index}`,
    area: "Admin/GM" as const,
    label: item.label,
    href: item.href,
    purpose: "Admin configuration and reporting",
    enabled: true,
    reusable: true,
  })),
  ...utilityNav.map((item, index) => ({
    id: `utility-${index}`,
    area: "Utility" as const,
    label: item.label,
    href: item.href,
    purpose: "Shared access and display modes",
    enabled: true,
    reusable: true,
  })),
];

export const roleLabels: Record<Role, string> = {
  employee: "Employee",
  manager: "Manager",
  admin: "Admin/GM",
};

export const categoryIcons: Record<RecognitionCategory, typeof BadgeCheck> = {
  "Excellence Check": BadgeCheck,
  "Guest Experience": Sparkles,
  Teamwork: Users,
  Reliability: Gauge,
  Details: Film,
  "Manager Award": Award,
};

export function getEmployee(id: string) {
  return employees.find((employee) => employee.id === id);
}

export function getEmployeeByPassport(passportId: string) {
  return employees.find(
    (employee) => employee.passportId.toLowerCase() === passportId.toLowerCase(),
  );
}

export function getDepartment(id: DepartmentId) {
  return departments.find((department) => department.id === id);
}

export function getRecognitionType(id: string) {
  return recognitionTypes.find((type) => type.id === id);
}

export function getAction(key: string) {
  return getRecognitionType(key);
}

export function getStandard(id: string) {
  return recognitionStandards.find((standard) => standard.id === id);
}

export function getReward(id: string) {
  return rewards.find((reward) => reward.id === id);
}

export function getBatch(id?: string) {
  if (!id) {
    return undefined;
  }

  return recognitionBatches.find((batch) => batch.id === id);
}

export function getManagerRecognitions() {
  return recognitions
    .map((recognition) => ({
      ...recognition,
      employee: getEmployee(recognition.employeeId),
      manager: getEmployee(recognition.managerId),
      action: getRecognitionType(recognition.recognitionTypeId),
      standard: getStandard(recognition.standardId),
      batch: getBatch(recognition.batchId),
    }))
    .filter((recognition) => recognition.employee && recognition.action && recognition.standard);
}

export const communityMiles = departments.reduce(
  (total, department) => total + department.progressMiles,
  0,
);

export const todayMiles = recognitions
  .filter((recognition) => recognition.createdAt.startsWith("2026-07-24"))
  .reduce((total, recognition) => total + recognition.miles, 0);

export const employeesNotRecognizedThisWeek = employees.filter(
  (employee) => employee.role === "employee" && employee.weeklyMiles === 0,
);

export const recognitionOfTheDay =
  recognitions.find((recognition) => recognition.spotlight) ?? recognitions[0];

export const chapterStats = {
  communityMiles,
  todayMiles,
  remainingMiles: COMMUNITY_GOAL_MILES - communityMiles,
  averageDailyMiles: 538,
  activeEmployees: employees.filter((employee) => employee.role === "employee").length,
  pendingRedemptions: redemptions.filter((redemption) => redemption.status === "Pending").length,
  activeRecognitionTypes: recognitionTypes.filter((type) => type.enabled).length,
  activeRewards: rewards.filter((reward) => reward.enabled).length,
};

export const passportCsvPreview = employees
  .filter((employee) => employee.role === "employee")
  .map((employee) => ({
    name: employee.name,
    passportId: employee.passportId,
    qrUrl: employee.passportQrUrl,
    department: getDepartment(employee.department)?.name ?? "",
  }));

export const chapterSettings = [
  ["Chapter name", chapter.name],
  ["Chapter subtitle", chapter.subtitle],
  ["Start date", chapter.startDate],
  ["End date", chapter.endDate],
  ["Community goal", `${chapter.communityGoalMiles}`],
  ["Theme label", chapter.themeLabel],
  ["Active", chapter.active ? "Yes" : "No"],
  ["Visual tagline", chapter.visualTagline],
  ["Theme note", chapter.themeNote],
];

export const launchReadinessChecklist = [
  { label: "Seed employees", status: "Ready" },
  { label: "Seed rewards", status: "Ready" },
  { label: "Seed recognition types", status: "Ready" },
  { label: "Print Journey Cards", status: "Needs print run" },
  { label: "Test TV dashboard", status: "Ready" },
  { label: "Test manager recognition", status: "Ready" },
  { label: "Test reward redemption", status: "Configurable" },
  { label: "Test Journey Card batch entry", status: "Ready" },
];

export const filmFacts = [
  "15/70 reference",
  "Projection-inspired motion",
  "Film grain and perforation accents",
  "Crew fleet race, no individual TV leaderboard",
];

export const journalEvents = [
  {
    date: "Jul 24",
    title: "Journey Card verified",
    detail: "4 checked items became 40 Journey Miles after manager review.",
  },
  {
    date: "Jul 22",
    title: "Crew moment",
    detail: "Helped concessions clear a line before previews started.",
  },
  {
    date: "Jul 16",
    title: "Chapter opened",
    detail: "The Odyssey began with every mile counting toward 15,700.",
  },
];

export const tvPanels = [
  "Community Progress",
  "North Stars Fleet",
  "15,700 / IMAX 1570",
  "Today's Spotlight",
  "Recognition Wall",
  "Department Progress",
  "Reward Spotlight",
  "Countdown",
];

export const fleetStandings: FleetStanding[] = [
  {
    rank: 1,
    crew: "Boat 01",
    vessel: "North Star",
    miles: 1830,
    progress: 88,
    signal: "Presentation and detail",
  },
  {
    rank: 2,
    crew: "Boat 02",
    vessel: "Beacon",
    miles: 1710,
    progress: 79,
    signal: "Guest recovery",
  },
  {
    rank: 3,
    crew: "Boat 03",
    vessel: "Horizon",
    miles: 1645,
    progress: 72,
    signal: "Cross-department assists",
  },
  {
    rank: 4,
    crew: "Boat 04",
    vessel: "Marquee",
    miles: 1510,
    progress: 65,
    signal: "Reliability streaks",
  },
  {
    rank: 5,
    crew: "Boat 05",
    vessel: "Signal",
    miles: 1365,
    progress: 56,
    signal: "Excellence checks",
  },
  {
    rank: 6,
    crew: "Boat 06",
    vessel: "Reel One",
    miles: 1220,
    progress: 49,
    signal: "Weekend coverage",
  },
  {
    rank: 7,
    crew: "Boat 07",
    vessel: "House Light",
    miles: 1105,
    progress: 41,
    signal: "Survey mentions",
  },
  {
    rank: 8,
    crew: "Boat 08",
    vessel: "Encore",
    miles: 980,
    progress: 34,
    signal: "Crew recognition",
  },
];

export const iconNames = [
  "Award",
  "BadgeCheck",
  "CalendarDays",
  "ClipboardCheck",
  "Clapperboard",
  "Film",
  "Gauge",
  "Gift",
  "HandHeart",
  "Megaphone",
  "MonitorPlay",
  "Route",
  "Sparkles",
  "Store",
  "Users",
  "BookOpen",
];

export const adminQuickLinks = [
  { label: "Add Recognition Type", href: "/admin/recognition-library/new", icon: Library },
  { label: "Journey Cards", href: "/admin/passports", icon: BookOpen },
  { label: "Reward Inventory", href: "/admin/rewards", icon: Coins },
];
