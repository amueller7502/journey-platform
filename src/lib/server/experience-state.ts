import {
  activeSkin,
  chapter as defaultChapter,
  departments as defaultDepartments,
  employees as defaultEmployees,
  experienceAchievements as defaultExperienceAchievements,
  experienceDisplaySlides as defaultExperienceDisplaySlides,
  experienceEvents as defaultExperienceEvents,
  excellenceLogs as defaultExcellenceLogs,
  journeyCardAreas as defaultJourneyCardAreas,
  journeySkins as defaultSkins,
  launchReadinessItems as defaultLaunchReadinessItems,
  leadershipPointRules as defaultLeadershipPointRules,
  leadershipRewards as defaultLeadershipRewards,
  recognitionStandards as defaultRecognitionStandards,
  recognitionTypes as defaultRecognitionTypes,
  redemptions as defaultRedemptions,
  rewards as defaultRewards,
  scoringMetrics as defaultScoringMetrics,
  seasons as defaultSeasons,
  tvPanelSettings as defaultTvPanelSettings,
} from "@/lib/data";
import { defaultFeatureFlags, mergeFeatureFlags } from "@/lib/features";
import { createAdminClient, hasSupabaseAdminEnv } from "@/lib/supabase/admin";
import type {
  Department,
  Employee,
  ExperienceAchievement,
  ExperienceDisplaySlide,
  ExperienceEvent,
  ExperienceSeason,
  ExcellenceLog,
  FeatureFlag,
  FeaturePresetId,
  JourneyCardArea,
  JourneyCardShiftAssignment,
  JourneySkin,
  LaunchReadinessItem,
  LeadershipPointRule,
  LeadershipReward,
  PlatformRole,
  RecognitionStandard,
  RecognitionType,
  Redemption,
  Reward,
  ScoringMetric,
  TvPanelSetting,
} from "@/lib/types";

export const OPERATING_STATE_ID = "default";
const LEGACY_CHAPTER_UUID = "11111111-1111-4111-8111-111111111111";

export type ExperienceChapter = typeof defaultChapter;

export type ExperienceOperatingState = {
  chapter: ExperienceChapter;
  seasons: ExperienceSeason[];
  departments: Department[];
  employees: Employee[];
  journeyCardAreas: JourneyCardArea[];
  journeyCardAssignments: JourneyCardShiftAssignment[];
  recognitionStandards: RecognitionStandard[];
  recognitionTypes: RecognitionType[];
  rewards: Reward[];
  redemptions: Redemption[];
  excellenceLogs: ExcellenceLog[];
  experienceEvents: ExperienceEvent[];
  experienceDisplaySlides: ExperienceDisplaySlide[];
  scoringMetrics: ScoringMetric[];
  launchReadinessItems: LaunchReadinessItem[];
  experienceAchievements: ExperienceAchievement[];
  leadershipPointRules: LeadershipPointRule[];
  leadershipRewards: LeadershipReward[];
  tvPanelSettings: TvPanelSetting[];
  skins: JourneySkin[];
  featureFlags: FeatureFlag[];
  featurePreset: FeaturePresetId;
  activeSkinId: string;
  skinEnabled: boolean;
  updatedAt: string;
};

type SyncIssue = {
  table: string;
  message: string;
};

type SupabaseEmployeeRow = {
  id: string;
  app_id: string | null;
  auth_user_id: string | null;
  full_name: string;
  initials: string | null;
  title: string | null;
  role: Employee["role"];
  passport_id: string | null;
  passport_qr_url: string | null;
  journey_card_area_id: string | null;
  email: string | null;
  access_code: string | null;
  account_status: Employee["accountStatus"] | null;
  profile_photo_url: string | null;
  pending_profile_photo_url: string | null;
  profile_photo_status: Employee["profilePhotoStatus"] | null;
  active: boolean | null;
  department_slug: Employee["department"] | null;
  current_xp: number | null;
  weekly_xp: number | null;
};

type SupabaseProfileRow = {
  id: string;
  auth_user_id: string | null;
  full_name: string;
  email: string;
  avatar_url: string | null;
  status: "invited" | "active" | "disabled";
};

type SupabaseUserRoleRow = {
  profile_id: string;
  role: PlatformRole;
};

export type WriteStateResult = {
  ok: boolean;
  mode: "local" | "supabase";
  state: ExperienceOperatingState;
  syncIssues: SyncIssue[];
};

const defaultState: ExperienceOperatingState = {
  chapter: defaultChapter,
  seasons: defaultSeasons,
  departments: defaultDepartments,
  employees: defaultEmployees,
  journeyCardAreas: defaultJourneyCardAreas,
  journeyCardAssignments: [],
  recognitionStandards: defaultRecognitionStandards,
  recognitionTypes: defaultRecognitionTypes,
  rewards: defaultRewards,
  redemptions: defaultRedemptions,
  excellenceLogs: defaultExcellenceLogs,
  experienceEvents: defaultExperienceEvents,
  experienceDisplaySlides: defaultExperienceDisplaySlides,
  scoringMetrics: defaultScoringMetrics,
  launchReadinessItems: defaultLaunchReadinessItems,
  experienceAchievements: defaultExperienceAchievements,
  leadershipPointRules: defaultLeadershipPointRules,
  leadershipRewards: defaultLeadershipRewards,
  tvPanelSettings: defaultTvPanelSettings,
  skins: defaultSkins,
  featureFlags: defaultFeatureFlags,
  featurePreset: "experience_lite",
  activeSkinId: activeSkin.id,
  skinEnabled: activeSkin.id !== "standard",
  updatedAt: "seed",
};

function cloneState(state: ExperienceOperatingState): ExperienceOperatingState {
  return JSON.parse(JSON.stringify(state)) as ExperienceOperatingState;
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

function mergePreferFirstById<T extends { id: string }>(primary: T[], secondary: T[]) {
  const primaryIds = new Set(primary.map((item) => item.id));
  return [...primary, ...secondary.filter((item) => !primaryIds.has(item.id))];
}

export function getDefaultExperienceState() {
  return cloneState(defaultState);
}

export function normalizeExperienceState(
  value: Partial<ExperienceOperatingState> | null,
): ExperienceOperatingState {
  const next = {
    ...cloneState(defaultState),
    ...(value ?? {}),
    chapter: {
      ...defaultState.chapter,
      ...(value?.chapter ?? {}),
    },
    seasons: mergeById(defaultState.seasons, value?.seasons),
    departments: mergeById(defaultState.departments, value?.departments),
    employees: mergeById(defaultState.employees, value?.employees),
    journeyCardAreas: mergeById(defaultState.journeyCardAreas, value?.journeyCardAreas),
    journeyCardAssignments: mergeById(
      defaultState.journeyCardAssignments,
      value?.journeyCardAssignments,
    ),
    recognitionStandards: mergeById(
      defaultState.recognitionStandards,
      value?.recognitionStandards,
    ),
    recognitionTypes: mergeById(defaultState.recognitionTypes, value?.recognitionTypes),
    rewards: mergeById(defaultState.rewards, value?.rewards),
    redemptions: mergeById(defaultState.redemptions, value?.redemptions),
    excellenceLogs: mergeById(defaultState.excellenceLogs, value?.excellenceLogs),
    experienceEvents: mergeById(defaultState.experienceEvents, value?.experienceEvents),
    experienceDisplaySlides: mergeById(
      defaultState.experienceDisplaySlides,
      value?.experienceDisplaySlides,
    ),
    scoringMetrics: mergeById(defaultState.scoringMetrics, value?.scoringMetrics),
    launchReadinessItems: mergeById(
      defaultState.launchReadinessItems,
      value?.launchReadinessItems,
    ),
    experienceAchievements: mergeById(
      defaultState.experienceAchievements,
      value?.experienceAchievements,
    ),
    leadershipPointRules: mergeById(
      defaultState.leadershipPointRules,
      value?.leadershipPointRules,
    ),
    leadershipRewards: mergeById(defaultState.leadershipRewards, value?.leadershipRewards),
    tvPanelSettings: mergeById(defaultState.tvPanelSettings, value?.tvPanelSettings),
    skins: mergeById(defaultState.skins, value?.skins),
    featureFlags: mergeFeatureFlags(value?.featureFlags),
    featurePreset: value?.featurePreset ?? defaultState.featurePreset,
  };

  if (!next.skins.some((skin) => skin.id === next.activeSkinId)) {
    next.activeSkinId = "standard";
    next.skinEnabled = false;
  }

  return next;
}

function fallbackInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return initials || "CC";
}

function mapEmployeeRow(row: SupabaseEmployeeRow): Employee {
  const id = row.app_id ?? row.id;
  const name = row.full_name || "Experience Account";
  const passportId = row.passport_id ?? id;

  return {
    id,
    name,
    role: row.role,
    department: row.department_slug ?? "leadership",
    title:
      row.title ??
      (row.role === "admin"
        ? "Experience Builder"
        : row.role === "manager"
          ? "Manager"
          : "Employee"),
    initials: row.initials ?? fallbackInitials(name),
    passportId,
    passportQrUrl: row.passport_qr_url ?? `/manager/passport/${passportId}`,
    journeyCardAreaId: row.journey_card_area_id ?? undefined,
    email: row.email ?? undefined,
    accessCode: row.access_code ?? undefined,
    accountStatus: row.account_status ?? "active",
    profilePhotoUrl: row.profile_photo_url ?? undefined,
    pendingProfilePhotoUrl: row.pending_profile_photo_url ?? undefined,
    profilePhotoStatus: row.profile_photo_status ?? "none",
    active: row.active ?? true,
    miles: row.current_xp ?? 0,
    weeklyMiles: row.weekly_xp ?? 0,
    reliabilityStreak: 0,
    shift: row.role === "employee" ? "Unassigned" : "Leadership",
  };
}

function platformRoleRank(role: PlatformRole) {
  if (role === "experience_designer") {
    return 3;
  }

  if (role === "leader") {
    return 2;
  }

  return 1;
}

function appRoleForPlatformRole(role: PlatformRole): Employee["role"] {
  if (role === "experience_designer") {
    return "admin";
  }

  if (role === "leader") {
    return "manager";
  }

  return "employee";
}

function mapProfileRow(row: SupabaseProfileRow, platformRole: PlatformRole): Employee {
  const role = appRoleForPlatformRole(platformRole);
  const name = row.full_name || row.email || "Experience Account";
  const prefix = role === "admin" ? "BUILDER" : role === "manager" ? "LEADER" : "EMP";
  const passportId = `${prefix}-${row.id.slice(0, 8).toUpperCase()}`;

  return {
    id: `profile-${row.id}`,
    name,
    role,
    department: "leadership",
    title:
      role === "admin"
        ? "Experience Builder"
        : role === "manager"
          ? "Manager"
          : "Employee",
    initials: fallbackInitials(name),
    passportId,
    passportQrUrl: `/manager/passport/${passportId}`,
    journeyCardAreaId: role === "employee" ? "floor_lobby" : undefined,
    email: row.email,
    accountStatus: row.status,
    profilePhotoUrl: row.avatar_url ?? undefined,
    profilePhotoStatus: row.avatar_url ? "approved" : "none",
    active: row.status !== "disabled",
    miles: 0,
    weeklyMiles: 0,
    reliabilityStreak: 0,
    shift: role === "employee" ? "Unassigned" : "Leadership",
  };
}

async function readNormalizedEmployees() {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("employees")
    .select(
      "id, app_id, auth_user_id, full_name, initials, title, role, passport_id, passport_qr_url, journey_card_area_id, email, access_code, account_status, profile_photo_url, pending_profile_photo_url, profile_photo_status, active, department_slug, current_xp, weekly_xp",
    )
    .order("full_name", { ascending: true });

  if (error || !data) {
    return [];
  }

  const employees = (data as SupabaseEmployeeRow[]).map(mapEmployeeRow);
  const { data: pointLinks } = await supabase
    .from("employee_points_links")
    .select("employee_app_id, lookup_token");
  const tokenByEmployee = new Map(
    (pointLinks ?? []).map((row) => [row.employee_app_id, row.lookup_token]),
  );

  return employees.map((employee) => ({
    ...employee,
    pointsLookupToken: tokenByEmployee.get(employee.id) ?? employee.pointsLookupToken,
  }));
}

async function readProfilePeople(existingPeople: Employee[]) {
  if (!hasSupabaseAdminEnv()) {
    return [];
  }

  const supabase = createAdminClient();
  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("profile_id, role")
    .eq("enabled", true);

  if (rolesError || !roles?.length) {
    return [];
  }

  const roleRows = roles as SupabaseUserRoleRow[];
  const rolesByProfile = new Map<string, PlatformRole[]>();
  roleRows.forEach((row) => {
    rolesByProfile.set(row.profile_id, [
      ...(rolesByProfile.get(row.profile_id) ?? []),
      row.role,
    ]);
  });

  const profileIds = Array.from(rolesByProfile.keys());
  const { data: profiles, error: profilesError } = await supabase
    .from("profiles")
    .select("id, auth_user_id, full_name, email, avatar_url, status")
    .in("id", profileIds)
    .neq("status", "disabled");

  if (profilesError || !profiles?.length) {
    return [];
  }

  const existingEmails = new Set(
    existingPeople
      .map((person) => person.email?.toLowerCase())
      .filter(Boolean) as string[],
  );

  return (profiles as SupabaseProfileRow[])
    .filter((profile) => !existingEmails.has(profile.email.toLowerCase()))
    .map((profile) => {
      const highestRole = (rolesByProfile.get(profile.id) ?? ["employee"]).sort(
        (a, b) => platformRoleRank(b) - platformRoleRank(a),
      )[0];

      return mapProfileRow(profile, highestRole);
    });
}

export async function readExperienceState() {
  if (!hasSupabaseAdminEnv()) {
    return { state: getDefaultExperienceState(), mode: "local" as const };
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("journey_operating_state")
    .select("state")
    .eq("id", OPERATING_STATE_ID)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  const normalized = normalizeExperienceState(
    (data?.state as Partial<ExperienceOperatingState> | null) ?? null,
  );
  const normalizedEmployees = await readNormalizedEmployees();
  const profilePeople = await readProfilePeople(normalizedEmployees);

  if (normalizedEmployees.length || profilePeople.length) {
    normalized.employees = mergePreferFirstById(
      [...normalizedEmployees, ...profilePeople],
      normalized.employees,
    );
  }

  return {
    state: normalized,
    mode: "supabase" as const,
  };
}

async function bestEffortUpsert(
  table: string,
  rows: Array<Record<string, unknown>>,
  syncIssues: SyncIssue[],
  onConflict = "id",
) {
  if (!rows.length || !hasSupabaseAdminEnv()) {
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from(table).upsert(rows, { onConflict });
  if (error) {
    syncIssues.push({ table, message: error.message });
  }
}

async function bestEffortUpdateOperatingState(
  state: ExperienceOperatingState,
  syncIssues: SyncIssue[],
) {
  if (!hasSupabaseAdminEnv()) {
    return;
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("journey_operating_state").upsert({
    id: OPERATING_STATE_ID,
    state,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    syncIssues.push({ table: "journey_operating_state", message: error.message });
  }
}

function activeSeasonId(state: ExperienceOperatingState) {
  return state.seasons.find((season) => season.active)?.id ?? state.chapter.id;
}

export async function syncConfigTables(
  state: ExperienceOperatingState,
  syncIssues: SyncIssue[],
) {
  await bestEffortUpsert(
    "employees",
    state.employees.map((employee) => ({
      app_id: employee.id,
      full_name: employee.name,
      initials: employee.initials,
      title: employee.title,
      role: employee.role,
      passport_id: employee.passportId,
      passport_qr_url: employee.passportQrUrl,
      journey_card_area_id: employee.journeyCardAreaId,
      email: employee.email,
      access_code: employee.accessCode,
      account_status: employee.accountStatus ?? "invited",
      profile_photo_url: employee.profilePhotoUrl,
      pending_profile_photo_url: employee.pendingProfilePhotoUrl,
      profile_photo_status: employee.profilePhotoStatus ?? "none",
      active: employee.active ?? true,
      department_slug: employee.department,
      current_xp: employee.miles,
      weekly_xp: employee.weeklyMiles,
    })),
    syncIssues,
    "app_id",
  );

  await bestEffortUpsert(
    "employee_points_links",
    state.employees
      .filter((employee) => employee.role === "employee")
      .map((employee) => ({
        employee_app_id: employee.id,
        ...(employee.pointsLookupToken
          ? { lookup_token: employee.pointsLookupToken }
          : {}),
      })),
    syncIssues,
    "employee_app_id",
  );

  await bestEffortUpsert(
    "journey_card_areas",
    state.journeyCardAreas.map((area) => ({
      id: area.id,
      name: area.name,
      description: area.description,
      department_slugs: area.departmentIds,
      enabled: area.enabled,
      sort_order: area.sortOrder,
    })),
    syncIssues,
  );

  await bestEffortUpsert(
    "experience_seasons",
    state.seasons.map((season) => ({
      id: season.id,
      name: season.name,
      subtitle: season.subtitle,
      season_label: season.seasonLabel,
      season_title: season.seasonTitle,
      starts_on: season.startDate,
      ends_on: season.endDate,
      community_xp_goal: season.communityXpGoal,
      welcome_message: season.welcomeMessage,
      tagline: season.tagline,
      hero_artwork_url: season.heroArtworkUrl,
      experience_card_artwork_url: season.experienceCardArtworkUrl,
      skin_id: season.skinId,
      status: season.status,
      active: season.active,
      preview_enabled: season.previewEnabled,
      created_at: season.createdAt,
      updated_at: season.updatedAt,
    })),
    syncIssues,
  );

  await bestEffortUpsert(
    "recognition_standards",
    state.recognitionStandards.map((standard) => ({
      id: standard.id,
      label: standard.label,
      short_label: standard.shortLabel,
      description: standard.description,
      sort_order: standard.sortOrder ?? 0,
    })),
    syncIssues,
  );

  await bestEffortUpsert(
    "experience_standards",
    state.recognitionStandards.map((standard) => ({
      id: standard.id,
      label: standard.label,
      short_label: standard.shortLabel,
      description: standard.description,
      sort_order: standard.sortOrder ?? 0,
      enabled: standard.enabled ?? true,
      lifecycle: standard.lifecycle ?? "published",
      season_id: standard.seasonId ?? activeSeasonId(state),
      updated_at: standard.updatedAt ?? new Date().toISOString(),
    })),
    syncIssues,
  );

  await bestEffortUpsert(
    "recognition_types",
    state.recognitionTypes.map((type) => ({
      app_id: type.id,
      slug: type.id,
      chapter_id: LEGACY_CHAPTER_UUID,
      name: type.name,
      description: type.description,
      category: type.category,
      standard_id: type.standardId,
      miles_value: type.milesValue,
      icon: type.icon,
      enabled: type.enabled,
      requires_manager_verification: type.requiresManagerVerification,
      sort_order: type.sortOrder,
      kind: type.type,
      credit_scope: type.creditScope ?? "employee",
      journey_card_eligible: type.journeyCardEligible ?? false,
      journey_card_area_ids: type.journeyCardAreaIds ?? [],
      lifecycle: "published",
      updated_at: new Date().toISOString(),
    })),
    syncIssues,
    "app_id",
  );

  await bestEffortUpsert(
    "rewards",
    state.rewards.map((reward) => ({
      app_id: reward.id,
      chapter_id: LEGACY_CHAPTER_UUID,
      name: reward.name,
      description: reward.description,
      miles_cost: reward.milesCost,
      inventory_count: reward.inventoryCount,
      image_url: reward.imageUrl,
      category: reward.category,
      collection: reward.collection ?? "Everyday Rewards",
      tier: reward.tier ?? "Tier 1",
      enabled: reward.enabled,
      sort_order: reward.sortOrder,
      redemption_limit_per_employee: reward.redemptionLimitPerEmployee,
      fulfillment_notes: reward.fulfillmentNotes,
      spotlight: reward.spotlight ?? false,
      featured: reward.featured ?? false,
      season_exclusive: reward.seasonExclusive ?? false,
      collector: reward.collector ?? false,
      coming_soon: reward.comingSoon ?? false,
      almost_gone_threshold: reward.almostGoneThreshold ?? 3,
      lifecycle: "published",
      updated_at: new Date().toISOString(),
    })),
    syncIssues,
    "app_id",
  );

  await bestEffortUpsert(
    "display_settings",
    state.experienceDisplaySlides.map((slide) => ({
      id: slide.id,
      season_id: slide.seasonId,
      slide_type: slide.type,
      label: slide.label,
      headline: slide.headline,
      supporting_text: slide.supportingText,
      duration_seconds: slide.durationSeconds,
      show_on_tv: slide.showOnTv,
      enabled: slide.enabled,
      lifecycle: slide.lifecycle,
      sort_order: slide.sortOrder,
      updated_at: slide.updatedAt,
    })),
    syncIssues,
  );

  await bestEffortUpsert(
    "scoring_settings",
    state.scoringMetrics.map((metric) => ({
      id: metric.id,
      season_id: metric.seasonId,
      label: metric.label,
      description: metric.description,
      weight: metric.weight,
      target: metric.target,
      current_value: metric.currentValue,
      enabled: metric.enabled,
      lifecycle: metric.lifecycle,
      sort_order: metric.sortOrder,
      updated_at: metric.updatedAt,
    })),
    syncIssues,
  );
}

export async function writeExperienceState(
  state: ExperienceOperatingState,
  options: { syncConfig?: boolean } = {},
): Promise<WriteStateResult> {
  const normalized = normalizeExperienceState({
    ...state,
    updatedAt: new Date().toISOString(),
  });
  const syncIssues: SyncIssue[] = [];

  if (!hasSupabaseAdminEnv()) {
    return { ok: true, mode: "local", state: normalized, syncIssues };
  }

  await bestEffortUpdateOperatingState(normalized, syncIssues);
  if (options.syncConfig) {
    await syncConfigTables(normalized, syncIssues);
  }

  return {
    ok: !syncIssues.some((issue) => issue.table === "journey_operating_state"),
    mode: "supabase",
    state: normalized,
    syncIssues,
  };
}

export async function recordExperienceMoments(
  rows: Array<{
    id: string;
    seasonId: string;
    employeeId: string;
    managerId: string;
    recognitionTypeId: string;
    standardId: string;
    xp: number;
    note: string;
    source: string;
    batchId?: string;
    createdAt: string;
  }>,
  syncIssues: SyncIssue[],
) {
  await bestEffortUpsert(
    "experience_moments",
    rows.map((row) => ({
      id: row.id,
      season_id: row.seasonId,
      employee_id: row.employeeId,
      manager_id: row.managerId,
      recognition_type_id: row.recognitionTypeId,
      standard_id: row.standardId,
      xp: row.xp,
      note: row.note,
      source: row.source,
      batch_id: row.batchId,
      created_at: row.createdAt,
    })),
    syncIssues,
  );
}

export async function recordExperienceCardBatch(
  row: {
    id: string;
    seasonId: string;
    employeeId: string;
    managerId: string;
    areaId: string;
    selectedRecognitionTypeIds: string[];
    totalXp: number;
    shiftNote: string;
    submittedAt: string;
  },
  syncIssues: SyncIssue[],
) {
  await bestEffortUpsert(
    "experience_card_batches",
    [
      {
        app_id: row.id,
        season_id: row.seasonId,
        employee_app_id: row.employeeId,
        manager_app_id: row.managerId,
        journey_card_area_id: row.areaId,
        selected_recognition_type_ids: row.selectedRecognitionTypeIds,
        total_xp: row.totalXp,
        shift_note: row.shiftNote,
        submitted_at: row.submittedAt,
      },
    ],
    syncIssues,
    "app_id",
  );
}

export async function recordRewardRedemption(
  redemption: Redemption,
  syncIssues: SyncIssue[],
) {
  await bestEffortUpsert(
    "reward_redemptions",
    [
      {
        app_id: redemption.id,
        employee_app_id: redemption.employeeId,
        reward_app_id: redemption.rewardId,
        points_cost: redemption.pointsCost,
        status: redemption.status.toLowerCase(),
        requested_at: redemption.requestedAt,
        reviewed_at: redemption.reviewedAt,
        fulfilled_at: redemption.fulfilledAt,
      },
    ],
    syncIssues,
    "app_id",
  );
}
