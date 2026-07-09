import type {
  FeatureFlag,
  FeatureFlagId,
  FeaturePresetId,
  Role,
} from "@/lib/types";

export const liteFeatureIds: FeatureFlagId[] = [
  "capture_moment",
  "experience_cards",
  "card_printing_pdf",
  "employee_lookup",
  "employee_xp_totals",
  "rewards",
  "basic_settings",
];

export const laterSeasonOneFeatureIds: FeatureFlagId[] = [
  "community",
  "tv_display",
  "moment_history",
];

export const seasonTwoFeatureIds: FeatureFlagId[] = [
  "seasons",
  "season_planner",
  "events",
  "achievements",
];

export const futurePlatformFeatureIds: FeatureFlagId[] = [
  "leadership",
  "leadership_points",
  "leadership_rewards",
  "scoring",
  "experience_studio_advanced",
  "analytics",
  "experience_stories",
  "authentication",
  "supabase_persistence",
];

export const defaultFeatureFlags: FeatureFlag[] = [
  {
    id: "capture_moment",
    enabled: true,
    label: "Capture Moment",
    description: "Fast manager recognition for one employee and one Experience Moment.",
    category: "Lite Launch",
    minimumRole: "manager",
    visibleInNavigation: true,
    launchPhase: "Launch",
    sortOrder: 10,
  },
  {
    id: "experience_cards",
    enabled: true,
    label: "Experience Card Entry",
    description: "Enter turned-in Experience Cards and award verified XP.",
    category: "Manager Operations",
    minimumRole: "manager",
    visibleInNavigation: true,
    launchPhase: "Launch",
    sortOrder: 20,
  },
  {
    id: "card_printing_pdf",
    enabled: true,
    label: "Print Experience Cards",
    description: "Create daily print runs for employees scheduled in specific areas.",
    category: "Manager Operations",
    minimumRole: "manager",
    visibleInNavigation: true,
    launchPhase: "Launch",
    sortOrder: 30,
  },
  {
    id: "employee_lookup",
    enabled: true,
    label: "Employee Lookup",
    description: "Fast manager lookup for current XP, profile basics, and quick actions.",
    category: "Manager Operations",
    minimumRole: "manager",
    visibleInNavigation: true,
    launchPhase: "Launch",
    sortOrder: 35,
  },
  {
    id: "employee_xp_totals",
    enabled: true,
    label: "Employee XP Totals",
    description: "Show simple XP totals and reward progress without moment history.",
    category: "Employee Experience",
    minimumRole: "employee",
    visibleInNavigation: true,
    launchPhase: "Launch",
    sortOrder: 40,
  },
  {
    id: "rewards",
    enabled: true,
    label: "Rewards",
    description: "Employee reward browsing, requests, approvals, and inventory.",
    category: "Rewards",
    minimumRole: "employee",
    visibleInNavigation: true,
    launchPhase: "Launch",
    sortOrder: 50,
  },
  {
    id: "basic_settings",
    enabled: true,
    label: "Basic Settings",
    description: "Lite launch settings for people, recognitions, rewards, and features.",
    category: "Studio",
    minimumRole: "admin",
    visibleInNavigation: true,
    launchPhase: "Launch",
    sortOrder: 60,
  },
  {
    id: "community",
    enabled: false,
    label: "Community",
    description: "Community progress, department progress, and shared goal pages.",
    category: "Employee Experience",
    minimumRole: "employee",
    visibleInNavigation: true,
    launchPhase: "Later Season One",
    sortOrder: 110,
  },
  {
    id: "tv_display",
    enabled: false,
    label: "Displays",
    description: "Digital signage, TV display loops, and future display controls.",
    category: "Displays",
    minimumRole: "manager",
    visibleInNavigation: true,
    launchPhase: "Later Season One",
    sortOrder: 120,
  },
  {
    id: "moment_history",
    enabled: false,
    label: "Moment History",
    description: "Employee journal, recognition feed, recent moments, and history pages.",
    category: "Employee Experience",
    minimumRole: "employee",
    visibleInNavigation: true,
    launchPhase: "Later Season One",
    sortOrder: 130,
  },
  {
    id: "seasons",
    enabled: false,
    label: "Seasons",
    description: "Season library and active/draft/archived season management.",
    category: "Studio",
    minimumRole: "admin",
    visibleInNavigation: true,
    launchPhase: "Season Two",
    sortOrder: 210,
  },
  {
    id: "season_planner",
    enabled: false,
    label: "Season Planner",
    description: "Plan future seasons without changing the active launch experience.",
    category: "Studio",
    minimumRole: "admin",
    visibleInNavigation: true,
    launchPhase: "Season Two",
    sortOrder: 220,
  },
  {
    id: "events",
    enabled: false,
    label: "Events",
    description: "Today’s Focus, community challenges, and season event scheduling.",
    category: "Studio",
    minimumRole: "admin",
    visibleInNavigation: true,
    launchPhase: "Season Two",
    sortOrder: 230,
  },
  {
    id: "achievements",
    enabled: false,
    label: "Achievements",
    description: "Employee and leader badges, hidden achievements, and collections.",
    category: "Studio",
    minimumRole: "admin",
    visibleInNavigation: true,
    launchPhase: "Season Two",
    sortOrder: 240,
  },
  {
    id: "leadership",
    enabled: false,
    label: "Leadership",
    description: "Leadership dashboard, health, journal, coaching, and coverage tools.",
    category: "Leadership",
    minimumRole: "manager",
    visibleInNavigation: true,
    launchPhase: "Future Platform",
    sortOrder: 310,
  },
  {
    id: "leadership_points",
    enabled: false,
    label: "Leadership Points",
    description: "LP rules and tracking for leadership behaviors.",
    category: "Leadership",
    minimumRole: "manager",
    visibleInNavigation: false,
    launchPhase: "Future Platform",
    sortOrder: 320,
  },
  {
    id: "leadership_rewards",
    enabled: false,
    label: "Leadership Rewards",
    description: "Leader-only rewards that do not use employee XP.",
    category: "Leadership",
    minimumRole: "manager",
    visibleInNavigation: true,
    launchPhase: "Future Platform",
    sortOrder: 330,
  },
  {
    id: "scoring",
    enabled: false,
    label: "Scoring",
    description: "Experience Score, Leadership Health, and configurable scoring weights.",
    category: "Studio",
    minimumRole: "admin",
    visibleInNavigation: true,
    launchPhase: "Future Platform",
    sortOrder: 340,
  },
  {
    id: "experience_studio_advanced",
    enabled: false,
    label: "Advanced Experience Studio",
    description: "Advanced skin, display, launch readiness, menu, and platform controls.",
    category: "Studio",
    minimumRole: "admin",
    visibleInNavigation: true,
    launchPhase: "Future Platform",
    sortOrder: 350,
  },
  {
    id: "analytics",
    enabled: false,
    label: "Analytics",
    description: "Advanced recognition reporting, leaderboard views, and platform analytics.",
    category: "Platform",
    minimumRole: "admin",
    visibleInNavigation: true,
    launchPhase: "Future Platform",
    sortOrder: 355,
  },
  {
    id: "experience_stories",
    enabled: false,
    label: "Experience Stories",
    description: "Storytelling surfaces for richer employee recognition narratives.",
    category: "Employee Experience",
    minimumRole: "employee",
    visibleInNavigation: true,
    launchPhase: "Future Platform",
    sortOrder: 358,
  },
  {
    id: "authentication",
    enabled: false,
    label: "Authentication",
    description: "Supabase Auth enforcement and production sign-in routing.",
    category: "Platform",
    minimumRole: "admin",
    visibleInNavigation: false,
    launchPhase: "Future Platform",
    sortOrder: 360,
  },
  {
    id: "supabase_persistence",
    enabled: false,
    label: "Supabase Persistence",
    description: "Shared production persistence beyond local browser fallback.",
    category: "Platform",
    minimumRole: "admin",
    visibleInNavigation: false,
    launchPhase: "Future Platform",
    sortOrder: 370,
  },
];

export const featurePresets: Array<{
  id: FeaturePresetId;
  label: string;
  description: string;
  featureIds: FeatureFlagId[];
}> = [
  {
    id: "experience_lite",
    label: "Experience Lite",
    description: "Launch-ready core workflows with moment history and advanced modules hidden.",
    featureIds: liteFeatureIds,
  },
  {
    id: "season_one_full",
    label: "Season One Full",
    description: "Adds community, TV display, and moment history when the team is ready.",
    featureIds: [...liteFeatureIds, ...laterSeasonOneFeatureIds],
  },
  {
    id: "advanced_platform",
    label: "Advanced Platform",
    description: "Turns on every preserved platform module for future rollout.",
    featureIds: defaultFeatureFlags.map((feature) => feature.id),
  },
];

export function mergeFeatureFlags(stored?: FeatureFlag[]) {
  if (!stored?.length) {
    return defaultFeatureFlags;
  }

  const defaultsById = new Map(defaultFeatureFlags.map((feature) => [feature.id, feature]));
  const storedById = new Map(stored.map((feature) => [feature.id, feature]));

  return defaultFeatureFlags.map((feature) => ({
    ...feature,
    ...(storedById.get(feature.id) ?? {}),
    id: feature.id,
  })).concat(
    stored.filter((feature) => !defaultsById.has(feature.id)),
  );
}

export function applyFeaturePreset(
  flags: FeatureFlag[],
  presetId: FeaturePresetId,
) {
  const preset = featurePresets.find((item) => item.id === presetId);
  if (!preset) {
    return flags;
  }

  const enabledIds = new Set(preset.featureIds);
  return mergeFeatureFlags(flags).map((feature) => ({
    ...feature,
    enabled: enabledIds.has(feature.id),
    visibleInNavigation: defaultFeatureFlags.find((item) => item.id === feature.id)?.visibleInNavigation ?? feature.visibleInNavigation,
  }));
}

export function getFeature(flags: FeatureFlag[], id: FeatureFlagId) {
  return mergeFeatureFlags(flags).find((feature) => feature.id === id);
}

export function isFeatureEnabled(flags: FeatureFlag[], id: FeatureFlagId) {
  return Boolean(getFeature(flags, id)?.enabled);
}

export function canRoleUseFeature(role: Role, minimumRole: Role) {
  const rank: Record<Role, number> = {
    employee: 1,
    manager: 2,
    admin: 3,
  };

  return rank[role] >= rank[minimumRole];
}

const routeRules: Array<{
  featureId: FeatureFlagId;
  prefixes: string[];
}> = [
  {
    featureId: "capture_moment",
    prefixes: ["/manager/recognize", "/manager/ourpeople"],
  },
  {
    featureId: "experience_cards",
    prefixes: [
      "/manager/passport",
      "/manager/recognize/passport",
      "/admin/passports",
    ],
  },
  {
    featureId: "card_printing_pdf",
    prefixes: ["/manager/cards"],
  },
  {
    featureId: "employee_lookup",
    prefixes: ["/manager/employees"],
  },
  {
    featureId: "employee_xp_totals",
    prefixes: [
      "/home",
      "/my-journey",
      "/profile",
    ],
  },
  {
    featureId: "rewards",
    prefixes: [
      "/rewards",
      "/trading-post",
      "/manager/pending-rewards",
      "/admin/rewards",
    ],
  },
  {
    featureId: "basic_settings",
    prefixes: [
      "/admin/settings",
      "/admin/employees",
      "/admin/recognition-library",
      "/admin/dashboard",
    ],
  },
  {
    featureId: "community",
    prefixes: ["/community"],
  },
  {
    featureId: "seasons",
    prefixes: ["/admin/seasons", "/admin/chapters"],
  },
  {
    featureId: "season_planner",
    prefixes: ["/admin/season-planner"],
  },
  {
    featureId: "events",
    prefixes: ["/admin/events", "/manager/todays-focus", "/manager/daily-spotlight"],
  },
  {
    featureId: "leadership",
    prefixes: [
      "/leadership/dashboard",
      "/leadership/health",
      "/leadership/journal",
      "/leadership/recognition",
      "/leadership/coverage",
      "/leadership/coaching",
      "/leadership/awaiting-recognition",
      "/admin/leadership",
      "/manager/dashboard",
      "/manager/excellence-checks",
    ],
  },
  {
    featureId: "leadership_rewards",
    prefixes: ["/leadership/rewards"],
  },
  {
    featureId: "tv_display",
    prefixes: ["/tv", "/admin/displays"],
  },
  {
    featureId: "experience_studio_advanced",
    prefixes: [
      "/admin/studio",
      "/admin/launch-readiness",
      "/admin/standards",
    ],
  },
  {
    featureId: "analytics",
    prefixes: [
      "/leaderboard",
      "/manager/leaderboard",
      "/admin/leaderboard",
      "/admin/analytics",
    ],
  },
  {
    featureId: "scoring",
    prefixes: ["/admin/scoring"],
  },
  {
    featureId: "achievements",
    prefixes: ["/admin/achievements", "/leadership/achievements"],
  },
  {
    featureId: "moment_history",
    prefixes: ["/manager/recognition-feed"],
  },
  {
    featureId: "authentication",
    prefixes: ["/admin/photo-approvals"],
  },
];

export function featureForPath(pathname: string) {
  const matchingRule = routeRules.find((rule) =>
    rule.prefixes.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
    ),
  );

  return matchingRule?.featureId ?? null;
}
