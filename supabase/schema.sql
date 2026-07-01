create extension if not exists pgcrypto;

drop table if exists public.daily_spotlights cascade;
drop table if exists public.tv_fleet_standings cascade;
drop table if exists public.tv_display_settings cascade;
drop table if exists public.reward_redemptions cascade;
drop table if exists public.rewards cascade;
drop table if exists public.recognition_records cascade;
drop table if exists public.recognition_batches cascade;
drop table if exists public.recognition_types cascade;
drop table if exists public.recognition_standards cascade;
drop table if exists public.employees cascade;
drop table if exists public.menu_items cascade;
drop table if exists public.departments cascade;
drop table if exists public.chapter_skin_settings cascade;
drop table if exists public.chapters cascade;
drop table if exists public.skins cascade;
drop type if exists public.journey_role cascade;
drop type if exists public.reward_redemption_status cascade;
drop type if exists public.chapter_status cascade;
drop type if exists public.recognition_type_kind cascade;

create type public.journey_role as enum ('employee', 'manager', 'admin');
create type public.reward_redemption_status as enum (
  'pending',
  'approved',
  'ready',
  'fulfilled',
  'cancelled'
);
create type public.chapter_status as enum ('draft', 'active', 'complete', 'archived');
create type public.recognition_type_kind as enum (
  'recognition',
  'excellence_check',
  'reliability',
  'teamwork',
  'guest_experience',
  'detail'
);

create table public.skins (
  id text primary key,
  name text not null,
  status text not null check (status in ('active', 'available', 'draft')),
  description text not null,
  can_disable boolean not null default true,
  tv_treatment text not null,
  palette jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

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
  sort_order integer not null default 0,
  kind public.recognition_type_kind not null default 'recognition',
  created_at timestamptz not null default now(),
  unique (chapter_id, slug)
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
  enabled boolean not null default true,
  sort_order integer not null default 0,
  redemption_limit_per_employee integer check (redemption_limit_per_employee > 0),
  fulfillment_notes text,
  spotlight boolean not null default false,
  created_at timestamptz not null default now()
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
    'north_stars_fleet',
    'imax_1570_reference',
    'todays_spotlight',
    'recognition_wall',
    'department_progress',
    'reward_spotlight',
    'countdown'
  ],
  seconds_per_panel integer not null default 7 check (seconds_per_panel between 4 and 60),
  show_individual_leaderboard boolean not null default false,
  updated_at timestamptz not null default now(),
  check (show_individual_leaderboard = false)
);

create table public.tv_fleet_standings (
  id uuid primary key default gen_random_uuid(),
  chapter_id uuid not null references public.chapters (id) on delete cascade,
  rank integer not null check (rank between 1 and 99),
  crew_name text not null,
  vessel_name text not null,
  miles integer not null default 0 check (miles >= 0),
  progress integer not null default 0 check (progress between 0 and 100),
  signal text not null,
  updated_at timestamptz not null default now(),
  unique (chapter_id, rank)
);

create index recognition_types_chapter_idx on public.recognition_types (chapter_id, enabled, sort_order);
create index recognition_records_chapter_created_idx
  on public.recognition_records (chapter_id, created_at desc);
create index recognition_records_employee_idx on public.recognition_records (employee_id);
create index recognition_batches_employee_idx on public.recognition_batches (employee_id);
create index rewards_chapter_idx on public.rewards (chapter_id, enabled, sort_order);
create index reward_redemptions_status_idx on public.reward_redemptions (status);
create index employees_passport_idx on public.employees (passport_id);
create index menu_items_role_idx on public.menu_items (role, enabled, sort_order);
create index tv_fleet_standings_chapter_idx on public.tv_fleet_standings (chapter_id, rank);

create or replace function public.current_employee_id()
returns uuid
language sql
stable
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
as $$
  select coalesce(public.current_journey_role() in ('manager', 'admin'), false)
$$;

alter table public.chapters enable row level security;
alter table public.skins enable row level security;
alter table public.chapter_skin_settings enable row level security;
alter table public.departments enable row level security;
alter table public.menu_items enable row level security;
alter table public.employees enable row level security;
alter table public.recognition_standards enable row level security;
alter table public.recognition_types enable row level security;
alter table public.recognition_batches enable row level security;
alter table public.recognition_records enable row level security;
alter table public.rewards enable row level security;
alter table public.reward_redemptions enable row level security;
alter table public.daily_spotlights enable row level security;
alter table public.tv_display_settings enable row level security;
alter table public.tv_fleet_standings enable row level security;

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
  with check (
    public.current_journey_role() = 'admin'
    and show_individual_leaderboard = false
  );

create policy "authenticated users read tv fleet standings"
  on public.tv_fleet_standings for select to authenticated using (true);

create policy "admins manage tv fleet standings"
  on public.tv_fleet_standings for all to authenticated
  using (public.current_journey_role() = 'admin')
  with check (public.current_journey_role() = 'admin');
