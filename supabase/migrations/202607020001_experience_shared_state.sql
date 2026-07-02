create extension if not exists pgcrypto;

do $$
begin
  create type public.platform_role as enum ('employee', 'leader', 'experience_designer');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.config_lifecycle as enum ('draft', 'published', 'archived');
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users (id) on delete cascade,
  full_name text not null,
  email text not null,
  avatar_url text,
  status text not null default 'active' check (status in ('invited', 'active', 'disabled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role public.platform_role not null,
  location text not null default 'Celebration Cinema North',
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, role, location)
);

alter table if exists public.employees
  add column if not exists app_id text,
  add column if not exists department_slug text,
  add column if not exists current_xp integer not null default 0,
  add column if not exists weekly_xp integer not null default 0;

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

do $$
begin
  if to_regclass('public.employees') is not null
    and not exists (
      select 1 from pg_constraint where conname = 'employees_app_id_key'
    ) then
    alter table public.employees add constraint employees_app_id_key unique (app_id);
  end if;
end $$;

alter table if exists public.recognition_types
  add column if not exists app_id text;

update public.recognition_types
set app_id = slug
where app_id is null;

do $$
begin
  if to_regclass('public.recognition_types') is not null
    and not exists (
      select 1 from pg_constraint where conname = 'recognition_types_app_id_key'
    ) then
    alter table public.recognition_types add constraint recognition_types_app_id_key unique (app_id);
  end if;
end $$;

alter table if exists public.rewards
  add column if not exists app_id text;

update public.rewards
set app_id = case name
  when '$5 C Cash' then 'reward-c-cash-5'
  when 'Movie Pass' then 'reward-movie-ticket'
  when 'Crew Hoodie' then 'reward-quarter-zip'
  when 'VIP Seat Package' then 'reward-private-imax'
  else app_id
end
where app_id is null;

do $$
begin
  if to_regclass('public.rewards') is not null
    and not exists (
      select 1 from pg_constraint where conname = 'rewards_app_id_key'
    ) then
    alter table public.rewards add constraint rewards_app_id_key unique (app_id);
  end if;
end $$;

alter table if exists public.reward_redemptions
  add column if not exists app_id text,
  add column if not exists employee_app_id text,
  add column if not exists reward_app_id text,
  add column if not exists fulfilled_at timestamptz;

alter table if exists public.reward_redemptions
  alter column chapter_id drop not null,
  alter column employee_id drop not null,
  alter column reward_id drop not null;

do $$
begin
  if to_regclass('public.reward_redemptions') is not null
    and not exists (
      select 1 from pg_constraint where conname = 'reward_redemptions_app_id_key'
    ) then
    alter table public.reward_redemptions add constraint reward_redemptions_app_id_key unique (app_id);
  end if;
end $$;

alter table if exists public.experience_cards
  add column if not exists app_id text,
  add column if not exists employee_app_id text;

do $$
begin
  if to_regclass('public.experience_cards') is not null
    and not exists (
      select 1 from pg_constraint where conname = 'experience_cards_app_id_key'
    ) then
    alter table public.experience_cards add constraint experience_cards_app_id_key unique (app_id);
  end if;
end $$;

alter table if exists public.experience_card_batches
  add column if not exists app_id text,
  add column if not exists employee_app_id text,
  add column if not exists manager_app_id text,
  add column if not exists journey_card_area_id text;

alter table if exists public.experience_card_batches
  alter column employee_id drop not null,
  alter column manager_id drop not null;

do $$
begin
  if to_regclass('public.experience_card_batches') is not null
    and not exists (
      select 1 from pg_constraint where conname = 'experience_card_batches_app_id_key'
    ) then
    alter table public.experience_card_batches add constraint experience_card_batches_app_id_key unique (app_id);
  end if;
end $$;

create table if not exists public.experience_standards (
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

create table if not exists public.experience_moments (
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

create table if not exists public.display_settings (
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

create table if not exists public.scoring_settings (
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

insert into public.experience_standards (
  id,
  season_id,
  label,
  short_label,
  description,
  sort_order
)
select
  standards.id,
  coalesce((select id from public.experience_seasons where active limit 1), 'chapter-one-odyssey'),
  standards.label,
  standards.short_label,
  standards.description,
  standards.sort_order
from public.recognition_standards standards
on conflict (id) do update set
  label = excluded.label,
  short_label = excluded.short_label,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.display_settings (
  id,
  season_id,
  slide_type,
  label,
  headline,
  supporting_text,
  duration_seconds,
  show_on_tv,
  enabled,
  lifecycle,
  sort_order
)
select
  id,
  season_id,
  slide_type::text,
  label,
  headline,
  supporting_text,
  duration_seconds,
  show_on_tv,
  enabled,
  lifecycle,
  sort_order
from public.experience_display_slides
on conflict (id) do update set
  slide_type = excluded.slide_type,
  label = excluded.label,
  headline = excluded.headline,
  supporting_text = excluded.supporting_text,
  duration_seconds = excluded.duration_seconds,
  show_on_tv = excluded.show_on_tv,
  enabled = excluded.enabled,
  lifecycle = excluded.lifecycle,
  sort_order = excluded.sort_order,
  updated_at = now();

insert into public.scoring_settings (
  id,
  season_id,
  label,
  description,
  weight,
  target,
  current_value,
  enabled,
  lifecycle,
  sort_order
)
select
  id::text,
  season_id,
  label,
  description,
  weight,
  target,
  current_value,
  enabled,
  lifecycle,
  sort_order
from public.scoring_metrics
on conflict (id) do update set
  label = excluded.label,
  description = excluded.description,
  weight = excluded.weight,
  target = excluded.target,
  current_value = excluded.current_value,
  enabled = excluded.enabled,
  lifecycle = excluded.lifecycle,
  sort_order = excluded.sort_order,
  updated_at = now();

create index if not exists profiles_auth_user_idx on public.profiles (auth_user_id);
create index if not exists user_roles_profile_idx on public.user_roles (profile_id, enabled);
create index if not exists experience_standards_season_idx on public.experience_standards (season_id, enabled, sort_order);
create index if not exists experience_moments_created_idx on public.experience_moments (created_at desc);
create index if not exists experience_moments_employee_idx on public.experience_moments (employee_id, created_at desc);
create index if not exists display_settings_season_idx on public.display_settings (season_id, enabled, sort_order);
create index if not exists scoring_settings_season_idx on public.scoring_settings (season_id, enabled, sort_order);

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
  select coalesce(public.current_platform_role() = 'experience_designer', false)
$$;

create or replace function public.is_leader_or_designer()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.current_platform_role() in ('leader', 'experience_designer'), false)
$$;

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.experience_standards enable row level security;
alter table public.experience_moments enable row level security;
alter table public.display_settings enable row level security;
alter table public.scoring_settings enable row level security;

drop policy if exists "users read own profile" on public.profiles;
create policy "users read own profile"
  on public.profiles for select to authenticated
  using (auth_user_id = auth.uid() or public.is_experience_designer());

drop policy if exists "designers manage profiles" on public.profiles;
create policy "designers manage profiles"
  on public.profiles for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

drop policy if exists "users read own roles" on public.user_roles;
create policy "users read own roles"
  on public.user_roles for select to authenticated
  using (
    profile_id = (
      select id from public.profiles where auth_user_id = auth.uid() limit 1
    )
    or public.is_experience_designer()
  );

drop policy if exists "designers manage user roles" on public.user_roles;
create policy "designers manage user roles"
  on public.user_roles for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

drop policy if exists "authenticated users read experience standards" on public.experience_standards;
create policy "authenticated users read experience standards"
  on public.experience_standards for select to authenticated
  using (enabled or public.is_experience_designer());

drop policy if exists "designers manage experience standards" on public.experience_standards;
create policy "designers manage experience standards"
  on public.experience_standards for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

drop policy if exists "authenticated users read experience moments" on public.experience_moments;
create policy "authenticated users read experience moments"
  on public.experience_moments for select to authenticated
  using (true);

drop policy if exists "leaders create experience moments" on public.experience_moments;
create policy "leaders create experience moments"
  on public.experience_moments for insert to authenticated
  with check (public.is_leader_or_designer());

drop policy if exists "authenticated users read display settings" on public.display_settings;
create policy "authenticated users read display settings"
  on public.display_settings for select to authenticated
  using (enabled or public.is_experience_designer());

drop policy if exists "designers manage display settings" on public.display_settings;
create policy "designers manage display settings"
  on public.display_settings for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());

drop policy if exists "authenticated users read scoring settings" on public.scoring_settings;
create policy "authenticated users read scoring settings"
  on public.scoring_settings for select to authenticated
  using (enabled or public.is_experience_designer());

drop policy if exists "designers manage scoring settings" on public.scoring_settings;
create policy "designers manage scoring settings"
  on public.scoring_settings for all to authenticated
  using (public.is_experience_designer())
  with check (public.is_experience_designer());
