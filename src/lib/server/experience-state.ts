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

  return {
    state: normalizeExperienceState(
      (data?.state as Partial<ExperienceOperatingState> | null) ?? null,
    ),
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
