create extension if not exists pgcrypto;

drop table if exists public.daily_spotlights cascade;
drop table if exists public.journey_operating_state cascade;
drop table if exists public.leadership_reward_redemptions cascade;
drop table if exists public.leadership_points cascade;
drop table if exists public.leadership_point_rules cascade;
drop table if exists public.experience_card_batches cascade;
drop table if exists public.experience_cards cascade;
drop table if exists public.experience_achievements cascade;
drop table if exists public.launch_readiness_items cascade;
drop table if exists public.scoring_metrics cascade;
drop table if exists public.experience_display_slides cascade;
drop table if exists public.experience_events cascade;
drop table if exists public.experience_seasons cascade;
drop table if exists public.user_roles cascade;
drop table if exists public.profiles cascade;
drop table if exists public.tv_display_settings cascade;
drop table if exists public.coaching_insights cascade;
drop table if exists public.leadership_rewards cascade;
drop table if exists public.leadership_achievements cascade;
drop table if exists public.leadership_recognitions cascade;
drop table if exists public.reward_redemptions cascade;
drop table if exists public.rewards cascade;
drop table if exists public.recognition_records cascade;
drop table if exists public.recognition_batches cascade;
drop table if exists public.excellence_check_logs cascade;
drop table if exists public.recognition_types cascade;
drop table if exists public.recognition_standards cascade;
drop table if exists public.employees cascade;
drop table if exists public.journey_card_areas cascade;
drop table if exists public.menu_items cascade;
drop table if exists public.departments cascade;
drop table if exists public.chapter_skin_settings cascade;
drop table if exists public.chapters cascade;
drop table if exists public.skins cascade;
drop type if exists public.journey_role cascade;
drop type if exists public.platform_role cascade;
drop type if exists public.reward_redemption_status cascade;
drop type if exists public.chapter_status cascade;
drop type if exists public.config_lifecycle cascade;
drop type if exists public.season_status cascade;
drop type if exists public.launch_readiness_status cascade;
drop type if exists public.achievement_audience cascade;
drop type if exists public.display_slide_type cascade;
drop type if exists public.scoring_metric_id cascade;
drop type if exists public.leadership_reward_collection cascade;
drop type if exists public.recognition_type_kind cascade;

create type public.journey_role as enum ('employee', 'manager', 'admin');
create type public.platform_role as enum ('employee', 'leader', 'experience_designer');
create type public.reward_redemption_status as enum (
  'requested',
  'pending',
  'approved',
  'ready',
  'fulfilled',
  'cancelled'
);
create type public.chapter_status as enum ('draft', 'active', 'complete', 'archived');
create type public.config_lifecycle as enum ('draft', 'published', 'archived');
create type public.season_status as enum ('draft', 'preview', 'active', 'archived');
create type public.launch_readiness_status as enum (
  'not_started',
  'in_progress',
  'ready',
  'blocked'
);
create type public.achievement_audience as enum ('employee', 'leader');
create type public.display_slide_type as enum (
  'Community XP',
  'Today''s Focus',
  'Recognition Spotlight',
  'Department Progress',
  'Reward Spotlight',
  'Countdown',
  'Experience Score',
  'Leaderboard',
  'Custom'
);
create type public.scoring_metric_id as enum (
  'experience_score',
  'leadership_health',
  'presentation_score',
  'recognition_coverage'
);
create type public.leadership_reward_collection as enum (
  'Everyday Leadership',
  'Professional Development',
  'Premium',
  'Leadership Experiences',
  'Season Exclusives'
);
create type public.recognition_type_kind as enum (
  'recognition',
  'journey_card_task',
  'excellence_check',
  'reliability',
  'teamwork',
  'guest_experience',
  'detail'
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  status text not null default 'active' check (status in ('invited', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.platform_role not null,
  location text not null default 'Celebration Cinema North',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, role, location)
);

create table public.skins (
  id text primary key,
  name text not null,
  status text not null check (status in ('active', 'available', 'draft')),
  description text not null,
  can_disable boolean not null default true,
  tv_treatment text not null,
  headline text,
  visual_direction text,
  motion_style text,
  texture text,
  builder_notes text,
  pattern_style text not null default 'film' check (pattern_style in ('none', 'film', 'doodles', 'waves', 'marquee')),
  background_mode text not null default 'clean' check (background_mode in ('clean', 'cinematic', 'playful', 'immersive')),
  animation_intensity integer not null default 30 check (animation_intensity between 0 and 100),
  fun_level integer not null default 20 check (fun_level between 0 and 100),
  doodle_density integer not null default 10 check (doodle_density between 0 and 100),
  marquee_speed integer not null default 35 check (marquee_speed between 0 and 100),
  projector_sweep integer not null default 45 check (projector_sweep between 0 and 100),
  float_amplitude integer not null default 20 check (float_amplitude between 0 and 100),
  confetti_level integer not null default 0 check (confetti_level between 0 and 100),
  title_treatment text not null default 'clean' check (title_treatment in ('clean', 'marquee', 'blockbuster', 'handbill')),
  card_treatment text not null default 'flat' check (card_treatment in ('flat', 'poster', 'ticket', 'lobby')),
  frame_style text not null default 'standard' check (frame_style in ('standard', 'filmstrip', 'ticket-stub', 'lightbox')),
  palette jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.experience_seasons (
  id text primary key,
  name text not null,
  subtitle text not null,
  season_label text not null,
  season_title text not null,
  starts_on date not null,
  ends_on date not null,
  community_xp_goal integer not null check (community_xp_goal > 0),
  welcome_message text not null,
  tagline text not null,
  hero_artwork_url text,
  experience_card_artwork_url text,
  skin_id text references public.skins (id),
  status public.season_status not null default 'draft',
  active boolean not null default false,
  preview_enabled boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index experience_seasons_one_active_idx
  on public.experience_seasons (active)
  where active;

create table public.chapters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subtitle text not null,
  starts_on date not null,
  ends_on date not null,
  community_goal_miles integer not null check (community_goal_miles > 0),
  theme_label text not null,
  visual_tagline text not null,
  theme_note text not null,
  status public.chapter_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table public.chapter_skin_settings (
  chapter_id uuid primary key references public.chapters (id) on delete cascade,
  skin_id text not null references public.skins (id),
  skin_enabled boolean not null default true,
  fallback_skin_id text not null references public.skins (id) default 'standard',
  updated_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  goal_miles integer not null default 0 check (goal_miles >= 0),
  sort_order integer not null default 0
);

create table public.journey_card_areas (
  id text primary key,
  name text not null,
  description text not null,
  department_slugs text[] not null default '{}',
  enabled boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.employees (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete set null,
  department_id uuid references public.departments (id),
  full_name text not null,
  initials text not null,
  title text not null,
  role public.journey_role not null default 'employee',
  passport_id text not null unique,
  passport_qr_url text not null,
  journey_card_area_id text references public.journey_card_areas (id),
  email text,
  access_code text unique,
  account_status text not null default 'invited' check (account_status in ('invited', 'active', 'disabled')),
  profile_photo_url text,
  pending_profile_photo_url text,
  profile_photo_status text not null default 'none' check (profile_photo_status in ('none', 'pending', 'approved', 'rejected')),
  active boolean not null default true,
  hired_on date,
  created_at timestamptz not null default now()
);

create table public.menu_items (
  id uuid primary key default gen_random_uuid(),
  role public.journey_role,
  area text not null,
  label text not null,
  href text not null,
  purpose text not null,
  enabled boolean not null default true,
  reusable boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.recognition_standards (
  id text primary key,
  label text not null,
  short_label text not null,
  description text not null,
  sort_order integer not null default 0
);

create table public.recognition_types (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  name text not null,
  description text not null,
  category text not null,
  standard_id text not null references public.recognition_standards (id),
  miles_value integer not null check (miles_value > 0),
  icon text not null,
  enabled boolean not null default true,
  requires_manager_verification boolean not null default true,
  manager_only boolean not null default true,
  requires_note boolean not null default false,
  story_prompt text,
  area_slugs text[] not null default '{}',
  sort_order integer not null default 0,
  kind public.recognition_type_kind not null default 'recognition',
  credit_scope text not null default 'employee' check (credit_scope in ('employee', 'department', 'community')),
  journey_card_eligible boolean not null default false,
  journey_card_area_ids text[] not null default '{}',
  lifecycle public.config_lifecycle not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (chapter_id, slug)
);

create table public.excellence_check_logs (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  recognition_type_id uuid not null references public.recognition_types (id),
  department_id uuid not null references public.departments (id),
  manager_id uuid not null references public.employees (id),
  note text not null,
  community_miles integer not null check (community_miles > 0),
  created_at timestamptz not null default now()
);

create table public.recognition_batches (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  employee_id uuid not null references public.employees (id),
  manager_id uuid not null references public.employees (id),
  source text not null default 'manager_entry',
  note text,
  total_miles integer not null default 0 check (total_miles >= 0),
  item_count integer not null default 0 check (item_count >= 0),
  created_at timestamptz not null default now(),
  check (employee_id <> manager_id)
);

create table public.recognition_records (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references public.recognition_batches (id) on delete set null,
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  employee_id uuid not null references public.employees (id),
  manager_id uuid not null references public.employees (id),
  recognition_type_id uuid not null references public.recognition_types (id),
  standard_id text not null references public.recognition_standards (id),
  miles integer not null check (miles > 0),
  note text not null,
  spotlight boolean not null default false,
  created_at timestamptz not null default now(),
  check (employee_id <> manager_id)
);

create table public.rewards (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  name text not null,
  description text not null,
  miles_cost integer not null check (miles_cost > 0),
  inventory_count integer not null default 0 check (inventory_count >= 0),
  image_url text,
  category text not null,
  collection text not null default 'Everyday Rewards' check (
    collection in (
      'Everyday Rewards',
      'Featured Rewards',
      'Collector''s Vault',
      'Experience Rewards',
      'Season Exclusives',
      'Coming Soon'
    )
  ),
  tier text not null default 'Tier 1' check (tier in ('Tier 1', 'Tier 2', 'Tier 3')),
  enabled boolean not null default true,
  sort_order integer not null default 0,
  redemption_limit_per_employee integer check (redemption_limit_per_employee > 0),
  fulfillment_notes text,
  spotlight boolean not null default false,
  featured boolean not null default false,
  season_exclusive boolean not null default false,
  collector boolean not null default false,
  coming_soon boolean not null default false,
  almost_gone_threshold integer not null default 3 check (almost_gone_threshold >= 0),
  lifecycle public.config_lifecycle not null default 'published',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  employee_id uuid not null references public.employees (id),
  reward_id uuid not null references public.rewards (id),
  status public.reward_redemption_status not null default 'pending',
  requested_at timestamptz not null default now(),
  reviewed_by uuid references public.employees (id),
  reviewed_at timestamptz
);

create table public.experience_events (
  id text primary key,
  season_id text not null references public.experience_seasons (id) on delete cascade,
  event_type text not null check (
    event_type in (
      'Today''s Focus',
      'Community Challenge',
      'Bonus XP Event',
      'Flash Event',
      'Surprise Drop',
      'Mystery Mission',
      'Premiere Event',
      'Season Finale Event'
    )
  ),
  title text not null,
  description text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  xp_modifier numeric(5,2) not null default 1,
  eligible_recognition_type_ids text[] not null default '{}',
  department_slugs text[] not null default '{}',
  tv_announcement text not null,
  banner text not null,
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience_display_slides (
  id text primary key,
  season_id text not null references public.experience_seasons (id) on delete cascade,
  slide_type public.display_slide_type not null,
  label text not null,
  headline text not null,
  supporting_text text not null,
  duration_seconds integer not null default 7 check (duration_seconds between 4 and 60),
  show_on_tv boolean not null default true,
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scoring_metrics (
  id public.scoring_metric_id primary key,
  season_id text not null references public.experience_seasons (id) on delete cascade,
  label text not null,
  description text not null,
  weight integer not null default 0 check (weight between 0 and 100),
  target integer not null default 100 check (target between 0 and 100),
  current_value integer not null default 0 check (current_value between 0 and 100),
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.launch_readiness_items (
  id text primary key,
  season_id text not null references public.experience_seasons (id) on delete cascade,
  label text not null,
  owner text not null check (owner in ('Admin/GM', 'Leader', 'Experience Designer')),
  status public.launch_readiness_status not null default 'not_started',
  due_on date not null,
  notes text not null,
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience_achievements (
  id text primary key,
  season_id text not null references public.experience_seasons (id) on delete cascade,
  audience public.achievement_audience not null,
  title text not null,
  description text not null,
  collection text not null,
  hidden boolean not null default false,
  badge_image_url text,
  criteria text not null,
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience_cards (
  id uuid primary key default gen_random_uuid(),
  season_id text not null references public.experience_seasons (id) on delete cascade,
  employee_id uuid not null references public.employees (id) on delete cascade,
  journey_card_area_id text references public.journey_card_areas (id),
  card_number text not null,
  shift_date date,
  status text not null default 'printed' check (
    status in ('draft', 'printed', 'turned_in', 'entered', 'void')
  ),
  printed_at timestamptz,
  replaced_by uuid references public.experience_cards (id),
  created_by uuid references public.employees (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (season_id, card_number)
);

create table public.experience_card_batches (
  id uuid primary key default gen_random_uuid(),
  experience_card_id uuid references public.experience_cards (id) on delete set null,
  recognition_batch_id uuid references public.recognition_batches (id) on delete set null,
  season_id text not null references public.experience_seasons (id) on delete cascade,
  employee_id uuid not null references public.employees (id),
  manager_id uuid not null references public.employees (id),
  selected_recognition_type_ids text[] not null default '{}',
  total_xp integer not null default 0 check (total_xp >= 0),
  shift_note text,
  submitted_at timestamptz not null default now(),
  check (employee_id <> manager_id)
);

create table public.leadership_recognitions (
  id uuid primary key default gen_random_uuid(),
  leader_id uuid not null references public.employees (id),
  recognized_by uuid not null references public.employees (id),
  category text not null check (category in ('Coaching', 'Coverage', 'Communication', 'Guest Recovery', 'Operational Leadership')),
  title text not null,
  note text not null,
  impact text not null,
  created_at timestamptz not null default now(),
  check (leader_id <> recognized_by)
);

create table public.leadership_achievements (
  id uuid primary key default gen_random_uuid(),
  leader_id uuid not null references public.employees (id),
  title text not null,
  description text not null,
  status text not null default 'in_progress' check (status in ('earned', 'in_progress', 'locked')),
  earned_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.leadership_rewards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null,
  status text not null default 'available' check (status in ('available', 'earned', 'scheduled')),
  fulfillment_notes text not null,
  lp_cost integer not null default 50 check (lp_cost >= 0),
  collection public.leadership_reward_collection not null default 'Everyday Leadership',
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leadership_point_rules (
  id text primary key,
  season_id text not null references public.experience_seasons (id) on delete cascade,
  name text not null,
  description text not null,
  lp_value integer not null default 0 check (lp_value >= 0),
  category text not null check (
    category in ('Coaching', 'Coverage', 'Communication', 'Guest Recovery', 'Operational Leadership')
  ),
  requires_note boolean not null default true,
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.leadership_points (
  id uuid primary key default gen_random_uuid(),
  season_id text not null references public.experience_seasons (id) on delete cascade,
  leader_id uuid not null references public.employees (id),
  awarded_by uuid references public.employees (id),
  rule_id text references public.leadership_point_rules (id),
  lp integer not null check (lp > 0),
  note text not null,
  created_at timestamptz not null default now()
);

create table public.leadership_reward_redemptions (
  id uuid primary key default gen_random_uuid(),
  season_id text not null references public.experience_seasons (id) on delete cascade,
  leader_id uuid not null references public.employees (id),
  reward_id uuid not null references public.leadership_rewards (id),
  lp_cost integer not null check (lp_cost >= 0),
  status public.reward_redemption_status not null default 'requested',
  requested_at timestamptz not null default now(),
  reviewed_by uuid references public.employees (id),
  reviewed_at timestamptz
);

create table public.coaching_insights (
  id uuid primary key default gen_random_uuid(),
  leader_id uuid not null references public.employees (id),
  title text not null,
  detail text not null,
  action text not null,
  priority text not null default 'Medium' check (priority in ('High', 'Medium', 'Low')),
  resolved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.daily_spotlights (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  recognition_record_id uuid not null references public.recognition_records (id) on delete cascade,
  spotlight_on date not null,
  created_by uuid not null references public.employees (id),
  created_at timestamptz not null default now(),
  unique (chapter_id, spotlight_on)
);

create table public.tv_display_settings (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  panel_order text[] not null default array[
    'community_progress',
    'recognition_leaderboard',
    'imax_1570_reference',
    'todays_spotlight',
    'recognition_wall',
    'department_progress',
    'reward_spotlight',
    'countdown'
  ],
  panel_settings jsonb not null default '[]'::jsonb,
  seconds_per_panel integer not null default 7 check (seconds_per_panel between 4 and 60),
  show_recognition_leaderboard boolean not null default true,
  updated_at timestamptz not null default now()
);

create table public.journey_operating_state (
  id text primary key,
  state jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index profiles_auth_user_idx on public.profiles (auth_user_id);
create index user_roles_profile_idx on public.user_roles (profile_id, enabled);
create index experience_seasons_status_idx on public.experience_seasons (status, active);
create index experience_events_season_idx on public.experience_events (season_id, enabled, sort_order);
create index experience_display_slides_season_idx
  on public.experience_display_slides (season_id, enabled, sort_order);
create index scoring_metrics_season_idx on public.scoring_metrics (season_id, enabled, sort_order);
create index launch_readiness_items_season_idx
  on public.launch_readiness_items (season_id, status, sort_order);
create index experience_achievements_season_idx
  on public.experience_achievements (season_id, audience, enabled, sort_order);
create index experience_cards_employee_idx on public.experience_cards (employee_id, shift_date);
create index experience_card_batches_employee_idx
  on public.experience_card_batches (employee_id, submitted_at desc);
create index leadership_point_rules_season_idx
  on public.leadership_point_rules (season_id, enabled, sort_order);
create index leadership_points_leader_idx on public.leadership_points (leader_id, created_at desc);
create index leadership_reward_redemptions_status_idx
  on public.leadership_reward_redemptions (status, requested_at desc);
create index recognition_types_chapter_idx on public.recognition_types (chapter_id, enabled, sort_order);
create index recognition_types_card_idx on public.recognition_types (chapter_id, journey_card_eligible, enabled);
create index excellence_check_logs_chapter_created_idx
  on public.excellence_check_logs (chapter_id, created_at desc);
create index recognition_records_chapter_created_idx
  on public.recognition_records (chapter_id, created_at desc);
create index recognition_records_employee_idx on public.recognition_records (employee_id);
create index recognition_batches_employee_idx on public.recognition_batches (employee_id);
create index rewards_chapter_idx on public.rewards (chapter_id, enabled, sort_order);
create index reward_redemptions_status_idx on public.reward_redemptions (status);
create index leadership_recognitions_leader_idx on public.leadership_recognitions (leader_id, created_at desc);
create index leadership_achievements_leader_idx on public.leadership_achievements (leader_id);
create index coaching_insights_leader_idx on public.coaching_insights (leader_id, resolved, priority);
create index employees_passport_idx on public.employees (passport_id);
create index employees_access_code_idx on public.employees (access_code);
create index menu_items_role_idx on public.menu_items (role, enabled, sort_order);

create or replace function public.current_employee_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.employees
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.current_journey_role()
returns public.journey_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.employees
  where auth_user_id = auth.uid()
  limit 1
$$;

create or replace function public.is_manager_or_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_journey_role() in ('manager', 'admin'), false)
$$;

create or replace function public.current_platform_role()
returns public.platform_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.user_roles
  where profile_id = (
    select id from public.profiles where auth_user_id = auth.uid() limit 1
  )
  and enabled
  order by
    case role
      when 'experience_designer' then 3
      when 'leader' then 2
      else 1
    end desc
  limit 1
$$;

create or replace function public.is_experience_designer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    public.current_journey_role() = 'admin'
    or public.current_platform_role() = 'experience_designer',
    false
  )
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.experience_seasons enable row level security;
alter table public.chapters enable row level security;
alter table public.skins enable row level security;
alter table public.chapter_skin_settings enable row level security;
alter table public.departments enable row level security;
alter table public.journey_card_areas enable row level security;
alter table public.menu_items enable row level security;
alter table public.employees enable row level security;
alter table public.recognition_standards enable row level security;
alter table public.recognition_types enable row level security;
alter table public.excellence_check_logs enable row level security;
alter table public.recognition_batches enable row level security;
alter table public.recognition_records enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.experience_events enable row level security;
alter table public.experience_display_slides enable row level security;
alter table public.scoring_metrics enable row level security;
alter table public.launch_readiness_items enable row level security;
alter table public.experience_achievements enable row level security;
alter table public.experience_cards enable row level security;
alter table public.experience_card_batches enable row level security;
alter table public.leadership_recognitions enable row level security;
alter table public.leadership_achievements enable row level security;
alter table public.leadership_rewards enable row level security;
alter table public.leadership_point_rules enable row level security;
alter table public.leadership_points enable row level security;
alter table public.leadership_reward_redemptions enable row level security;
alter table public.coaching_insights enable row level security;
alter table public.daily_spotlights enable row level security;
alter table public.tv_display_settings enable row level security;
alter table public.journey_operating_state enable row level security;

create policy "users read own profile"
  on public.profiles for select to authenticated
  using (auth_user_id = auth.uid() or public.is_experience_designer());

create policy "designers manage profiles"
  on public.profiles for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "users read own roles"
  on public.user_roles for select to authenticated
  using (
    profile_id = (
      select id from public.profiles where auth_user_id = auth.uid() limit 1
    )
    or public.is_experience_designer()
  );

create policy "designers manage user roles"
  on public.user_roles for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "authenticated users read published seasons"
  on public.experience_seasons for select to authenticated
  using (status in ('preview', 'active') or public.is_experience_designer());

create policy "designers manage seasons"
  on public.experience_seasons for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "authenticated users read active chapters"
  on public.chapters for select to authenticated
  using (status in ('active', 'complete'));

create policy "authenticated users read skins"
  on public.skins for select to authenticated using (true);

create policy "admins manage skins"
  on public.skins for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "authenticated users read chapter skin settings"
  on public.chapter_skin_settings for select to authenticated using (true);

create policy "admins manage chapter skin settings"
  on public.chapter_skin_settings for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "authenticated users read departments"
  on public.departments for select to authenticated using (true);

create policy "authenticated users read journey card areas"
  on public.journey_card_areas for select to authenticated using (enabled);

create policy "admins manage journey card areas"
  on public.journey_card_areas for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "authenticated users read enabled menu items"
  on public.menu_items for select to authenticated using (enabled);

create policy "admins manage menu items"
  on public.menu_items for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "authenticated users read active employees"
  on public.employees for select to authenticated using (active);

create policy "admins manage employees"
  on public.employees for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "authenticated users read standards"
  on public.recognition_standards for select to authenticated using (true);

create policy "authenticated users read enabled recognition types"
  on public.recognition_types for select to authenticated using (enabled);

create policy "admins manage recognition types"
  on public.recognition_types for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "authenticated users read excellence check logs"
  on public.excellence_check_logs for select to authenticated using (true);

create policy "managers create excellence check logs"
  on public.excellence_check_logs for insert to authenticated
  with check (
    public.is_manager_or_admin()
    and manager_id = public.current_employee_id()
  );

create policy "authenticated users read recognition records"
  on public.recognition_records for select to authenticated using (true);

create policy "managers create recognition records"
  on public.recognition_records for insert to authenticated
  with check (
    public.is_manager_or_admin()
    and manager_id = public.current_employee_id()
    and employee_id <> manager_id
  );

create policy "managers create recognition batches"
  on public.recognition_batches for insert to authenticated
  with check (
    public.is_manager_or_admin()
    and manager_id = public.current_employee_id()
    and employee_id <> manager_id
  );

create policy "managers read recognition batches"
  on public.recognition_batches for select to authenticated
  using (public.is_manager_or_admin() or employee_id = public.current_employee_id());

create policy "authenticated users read enabled rewards"
  on public.rewards for select to authenticated using (enabled);

create policy "admins manage rewards"
  on public.rewards for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "employees create own redemptions"
  on public.reward_redemptions for insert to authenticated
  with check (employee_id = public.current_employee_id());

create policy "employees and managers read redemptions"
  on public.reward_redemptions for select to authenticated
  using (employee_id = public.current_employee_id() or public.is_manager_or_admin());

create policy "managers update redemptions"
  on public.reward_redemptions for update to authenticated
  using (public.is_manager_or_admin())
  with check (public.is_manager_or_admin());

create policy "authenticated users read published events"
  on public.experience_events for select to authenticated
  using ((enabled and lifecycle = 'published') or public.is_experience_designer());

create policy "designers manage events"
  on public.experience_events for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "authenticated users read display slides"
  on public.experience_display_slides for select to authenticated
  using ((enabled and lifecycle = 'published') or public.is_experience_designer());

create policy "designers manage display slides"
  on public.experience_display_slides for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "authenticated users read scoring metrics"
  on public.scoring_metrics for select to authenticated
  using ((enabled and lifecycle = 'published') or public.is_experience_designer());

create policy "designers manage scoring metrics"
  on public.scoring_metrics for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "designers read launch readiness"
  on public.launch_readiness_items for select to authenticated
  using (public.is_manager_or_admin() or public.is_experience_designer());

create policy "designers manage launch readiness"
  on public.launch_readiness_items for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "authenticated users read achievements"
  on public.experience_achievements for select to authenticated
  using ((enabled and lifecycle = 'published' and not hidden) or public.is_experience_designer());

create policy "designers manage achievements"
  on public.experience_achievements for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "users read own experience cards"
  on public.experience_cards for select to authenticated
  using (
    employee_id = public.current_employee_id()
    or public.is_manager_or_admin()
    or public.is_experience_designer()
  );

create policy "leaders manage experience cards"
  on public.experience_cards for all to authenticated
  using (public.is_manager_or_admin() or public.is_experience_designer())
  with check (public.is_manager_or_admin() or public.is_experience_designer());

create policy "users read own experience card batches"
  on public.experience_card_batches for select to authenticated
  using (
    employee_id = public.current_employee_id()
    or manager_id = public.current_employee_id()
    or public.is_manager_or_admin()
    or public.is_experience_designer()
  );

create policy "leaders create experience card batches"
  on public.experience_card_batches for insert to authenticated
  with check (
    (public.is_manager_or_admin() or public.is_experience_designer())
    and employee_id <> manager_id
  );

create policy "managers read leadership recognitions"
  on public.leadership_recognitions for select to authenticated
  using (public.is_manager_or_admin());

create policy "managers create leadership recognitions"
  on public.leadership_recognitions for insert to authenticated
  with check (
    public.is_manager_or_admin()
    and recognized_by = public.current_employee_id()
    and leader_id <> recognized_by
  );

create policy "admins manage leadership recognitions"
  on public.leadership_recognitions for update to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "managers read leadership achievements"
  on public.leadership_achievements for select to authenticated
  using (public.is_manager_or_admin());

create policy "admins manage leadership achievements"
  on public.leadership_achievements for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "managers read leadership rewards"
  on public.leadership_rewards for select to authenticated
  using (public.is_manager_or_admin() and enabled);

create policy "admins manage leadership rewards"
  on public.leadership_rewards for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "managers read leadership point rules"
  on public.leadership_point_rules for select to authenticated
  using (public.is_manager_or_admin() and enabled);

create policy "designers manage leadership point rules"
  on public.leadership_point_rules for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "leaders read own leadership points"
  on public.leadership_points for select to authenticated
  using (leader_id = public.current_employee_id() or public.is_manager_or_admin());

create policy "leaders create leadership points"
  on public.leadership_points for insert to authenticated
  with check (
    (public.is_manager_or_admin() or public.is_experience_designer())
    and leader_id <> awarded_by
  );

create policy "leaders read leadership reward redemptions"
  on public.leadership_reward_redemptions for select to authenticated
  using (leader_id = public.current_employee_id() or public.is_manager_or_admin());

create policy "leaders create own leadership reward redemptions"
  on public.leadership_reward_redemptions for insert to authenticated
  with check (
    leader_id = public.current_employee_id()
    and public.is_manager_or_admin()
  );

create policy "designers update leadership reward redemptions"
  on public.leadership_reward_redemptions for update to authenticated
  using (public.is_manager_or_admin() or public.is_experience_designer())
  with check (public.is_manager_or_admin() or public.is_experience_designer());

create policy "managers read coaching insights"
  on public.coaching_insights for select to authenticated
  using (public.is_manager_or_admin());

create policy "admins manage coaching insights"
  on public.coaching_insights for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "authenticated users read daily spotlights"
  on public.daily_spotlights for select to authenticated using (true);

create policy "managers manage daily spotlights"
  on public.daily_spotlights for all to authenticated
  using (public.is_manager_or_admin())
  with check (public.is_manager_or_admin());

create policy "authenticated users read tv settings"
  on public.tv_display_settings for select to authenticated using (true);

create policy "admins manage tv settings"
  on public.tv_display_settings for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

create policy "admins manage operating state"
  on public.journey_operating_state for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');

-- Experience shared-state compatibility layer.
-- The app uses stable text IDs in its UI state. These columns let normalized
-- tables persist those writes without forcing a risky UUID rewrite in the UI.

alter table public.employees
  add column if not exists app_id text unique,
  add column if not exists department_slug text,
  add column if not exists current_xp integer not null default 0,
  add column if not exists weekly_xp integer not null default 0;

alter table public.recognition_types
  add column if not exists app_id text unique;

alter table public.rewards
  add column if not exists app_id text unique;

alter table public.reward_redemptions
  add column if not exists app_id text unique,
  add column if not exists employee_app_id text,
  add column if not exists reward_app_id text,
  add column if not exists fulfilled_at timestamptz,
  alter column chapter_id drop not null,
  alter column employee_id drop not null,
  alter column reward_id drop not null;

alter table public.experience_cards
  add column if not exists app_id text unique,
  add column if not exists employee_app_id text;

alter table public.experience_card_batches
  add column if not exists app_id text unique,
  add column if not exists employee_app_id text,
  add column if not exists manager_app_id text,
  add column if not exists journey_card_area_id text,
  alter column employee_id drop not null,
  alter column manager_id drop not null;

update public.employees
set app_id = case passport_id
  when 'ODY-1570-001' then 'emp-alex'
  when 'ODY-1570-002' then 'emp-maya'
  when 'ODY-1570-003' then 'emp-eli'
  when 'ODY-1570-004' then 'emp-nora'
  when 'ODY-1570-005' then 'emp-dante'
  when 'ODY-1570-006' then 'emp-leah'
  when 'MGR-1570-001' then 'mgr-jordan'
  when 'GM-1570-001' then 'admin-sam'
  else app_id
end
where app_id is null;

update public.recognition_types
set app_id = slug
where app_id is null;

create table public.experience_standards (
  id text primary key,
  season_id text references public.experience_seasons (id) on delete cascade,
  label text not null,
  short_label text not null,
  description text not null,
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.experience_moments (
  id text primary key,
  season_id text references public.experience_seasons (id) on delete set null,
  employee_id text not null,
  manager_id text not null,
  recognition_type_id text not null,
  standard_id text,
  xp integer not null check (xp > 0),
  note text not null,
  source text not null default 'manager_entry',
  batch_id text,
  created_at timestamptz not null default now()
);

create table public.display_settings (
  id text primary key,
  season_id text references public.experience_seasons (id) on delete cascade,
  slide_type text not null,
  label text not null,
  headline text not null,
  supporting_text text not null,
  duration_seconds integer not null default 7 check (duration_seconds between 4 and 60),
  show_on_tv boolean not null default true,
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.scoring_settings (
  id text primary key,
  season_id text references public.experience_seasons (id) on delete cascade,
  label text not null,
  description text not null,
  weight integer not null default 0 check (weight between 0 and 100),
  target integer not null default 100 check (target between 0 and 100),
  current_value integer not null default 0 check (current_value between 0 and 100),
  enabled boolean not null default true,
  lifecycle public.config_lifecycle not null default 'published',
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index experience_standards_season_idx
  on public.experience_standards (season_id, enabled, sort_order);
create index experience_moments_created_idx
  on public.experience_moments (created_at desc);
create index experience_moments_employee_idx
  on public.experience_moments (employee_id, created_at desc);
create index display_settings_season_idx
  on public.display_settings (season_id, enabled, sort_order);
create index scoring_settings_season_idx
  on public.scoring_settings (season_id, enabled, sort_order);

create or replace function public.is_leader_or_designer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_platform_role() in ('leader', 'experience_designer'), false)
$$;

alter table public.experience_standards enable row level security;
alter table public.experience_moments enable row level security;
alter table public.display_settings enable row level security;
alter table public.scoring_settings enable row level security;

create policy "authenticated users read experience standards"
  on public.experience_standards for select to authenticated
  using (enabled or public.is_experience_designer());

create policy "designers manage experience standards"
  on public.experience_standards for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "authenticated users read experience moments"
  on public.experience_moments for select to authenticated
  using (true);

create policy "leaders create experience moments"
  on public.experience_moments for insert to authenticated
  with check (public.is_leader_or_designer());

create policy "authenticated users read display settings"
  on public.display_settings for select to authenticated
  using (enabled or public.is_experience_designer());

create policy "designers manage display settings"
  on public.display_settings for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

create policy "authenticated users read scoring settings"
  on public.scoring_settings for select to authenticated
  using (enabled or public.is_experience_designer());

create policy "designers manage scoring settings"
  on public.scoring_settings for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());
