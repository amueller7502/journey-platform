-- Additive audit support for manager point corrections and reward reversals.
-- This migration does not change existing XP or redemption statuses.

alter table if exists public.reward_redemptions
  add column if not exists inventory_debited boolean not null default false;

create table if not exists public.point_adjustments (
  id text primary key,
  employee_app_id text not null,
  manager_app_id text not null,
  direction text not null default 'remove' check (direction in ('add', 'remove')),
  amount integer not null check (amount > 0),
  reason text not null,
  created_at timestamptz not null default now()
);

create index if not exists point_adjustments_employee_idx
  on public.point_adjustments (employee_app_id, created_at desc);

alter table public.point_adjustments enable row level security;
revoke all on table public.point_adjustments from anon, authenticated;
grant all privileges on table public.point_adjustments to service_role;

comment on table public.point_adjustments is
  'Server-only audit log for manager point corrections. Point balances remain stored on employees and in the operating state.';
