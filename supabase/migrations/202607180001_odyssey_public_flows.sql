-- Experience Lite: private employee points links and Odyssey starter content.
-- Additive only. This migration does not reset XP, moments, redemptions, or existing configuration.

create extension if not exists pgcrypto;

create table if not exists public.employee_points_links (
  employee_app_id text primary key references public.employees (app_id) on delete cascade,
  lookup_token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  rotated_at timestamptz
);

alter table public.employee_points_links enable row level security;
revoke all on table public.employee_points_links from anon, authenticated;
grant all privileges on table public.employee_points_links to service_role;

create or replace function public.ensure_employee_points_link()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role = 'employee' and new.app_id is not null then
    insert into public.employee_points_links (employee_app_id)
    values (new.app_id)
    on conflict (employee_app_id) do nothing;
  end if;
  return new;
end;
$$;

revoke execute on function public.ensure_employee_points_link() from public, anon, authenticated;
grant execute on function public.ensure_employee_points_link() to service_role;

drop trigger if exists employees_ensure_points_link on public.employees;
create trigger employees_ensure_points_link
after insert or update of app_id, role on public.employees
for each row execute function public.ensure_employee_points_link();

insert into public.employee_points_links (employee_app_id, lookup_token)
select
  app_id,
  case app_id
    when 'emp-alex' then 'ed59de3f-7858-4aa6-9422-312584406599'::uuid
    when 'emp-maya' then 'bb64e3f4-7398-4bb2-9d57-d212287d2846'::uuid
    when 'emp-eli' then '135ed5c9-c8ce-4f42-9e1d-f424d884c69c'::uuid
    when 'emp-nora' then 'f926db40-52c3-476c-a9db-4d67e227b535'::uuid
    when 'emp-dante' then 'b3d163a7-0ca9-4aa2-a980-f46db5f042d2'::uuid
    when 'emp-leah' then '1d46a0b4-d384-48c6-aeb5-b9facbed57bc'::uuid
    else gen_random_uuid()
  end
from public.employees
where role = 'employee' and app_id is not null
on conflict (employee_app_id) do nothing;

with active_chapter as (
  select id
  from public.chapters
  where status = 'active'
  order by created_at desc
  limit 1
), starter (
  slug, name, description, category, standard_id, miles_value, icon, sort_order,
  kind, journey_card_eligible, journey_card_area_ids
) as (
  values
    ('odyssey_crew_quest_card', 'Complete a Crew Quest Card', 'Turn in one verified Crew Quest card for the shift and area worked. This can be earned more than once during the four-week voyage.', 'Manager Award', 'detail_matters', 25, 'ClipboardCheck', 1, 'journey_card_task'::public.recognition_type_kind, true, array['concessions','kitchen_oscars','floor_lobby','box_guest_services','facilities_exterior']::text[]),
    ('odyssey_guest_compliment', 'Guest Compliment', 'A guest specifically complimented the crew member''s service.', 'Guest Experience', 'guest_welcome', 50, 'Sparkles', 2, 'guest_experience'::public.recognition_type_kind, false, array[]::text[]),
    ('odyssey_pick_up_shift', 'Pick Up an Available Shift', 'Picked up an available shift when the crew needed support.', 'Reliability', 'shift_counts', 20, 'CalendarDays', 3, 'reliability'::public.recognition_type_kind, false, array[]::text[]),
    ('odyssey_stay_late', 'Stay Late to Support the Team', 'Stayed late at a manager''s request to support the team.', 'Reliability', 'shift_counts', 15, 'Gauge', 4, 'reliability'::public.recognition_type_kind, false, array[]::text[]),
    ('odyssey_perfect_attendance', 'Perfect Attendance for a Week', 'Award once per week after the crew member completes a perfect attendance week.', 'Reliability', 'shift_counts', 25, 'BadgeCheck', 5, 'reliability'::public.recognition_type_kind, false, array[]::text[]),
    ('odyssey_weekend_warrior', 'Weekend Warrior', 'Worked Friday, Saturday, and Sunday. Award once per qualifying week.', 'Reliability', 'shift_counts', 30, 'Award', 6, 'reliability'::public.recognition_type_kind, false, array[]::text[]),
    ('odyssey_above_beyond', 'Go Above & Beyond', 'Manager-awarded recognition for uncommon ownership or support.', 'Manager Award', 'detail_matters', 20, 'Award', 7, 'detail'::public.recognition_type_kind, false, array[]::text[]),
    ('odyssey_prioritization_worksheet', 'Complete the Prioritization Worksheet', 'Completed and turned in the Odyssey prioritization worksheet.', 'Details', 'detail_matters', 50, 'ClipboardCheck', 8, 'detail'::public.recognition_type_kind, false, array[]::text[]),
    ('odyssey_team_photo', 'Team Photo', 'Shared an approved team photo in shirts or the OurPeople chat. Limit three per day.', 'Teamwork', 'crew_matters', 5, 'Camera', 9, 'teamwork'::public.recognition_type_kind, false, array[]::text[])
)
insert into public.recognition_types (
  app_id, slug, chapter_id, name, description, category, standard_id, miles_value,
  icon, enabled, requires_manager_verification, sort_order, kind, credit_scope,
  journey_card_eligible, journey_card_area_ids, lifecycle
)
select
  starter.slug, starter.slug, active_chapter.id, starter.name, starter.description,
  starter.category, starter.standard_id, starter.miles_value, starter.icon, true, true,
  starter.sort_order, starter.kind, 'employee', starter.journey_card_eligible,
  starter.journey_card_area_ids, 'published'
from starter
cross join active_chapter
on conflict (chapter_id, slug) do nothing;

with active_chapter as (
  select id
  from public.chapters
  where status = 'active'
  order by created_at desc
  limit 1
), starter (
  app_id, name, description, miles_cost, category, collection, tier, sort_order
) as (
  values
    ('odyssey-reward-c-cash-5', '$5 C Cash', 'Celebration Cinema C Cash.', 75, 'Cinema', 'Everyday Rewards', 'Tier 1', 1),
    ('odyssey-reward-t-shirt', 'Special Odyssey T-Shirt', 'Season-exclusive Odyssey crew shirt, while supplies last.', 125, 'Gear', 'Season Exclusives', 'Tier 1', 2),
    ('odyssey-reward-movie-ticket', 'Movie Ticket', 'One movie ticket.', 150, 'Cinema', 'Everyday Rewards', 'Tier 1', 3),
    ('odyssey-reward-gift-card-10', 'Your Choice Gift Card ($10)', 'Choose from the available $10 gift cards.', 150, 'Experience', 'Everyday Rewards', 'Tier 1', 4),
    ('odyssey-reward-c-cash-10', '$10 C Cash', 'Celebration Cinema C Cash.', 150, 'Cinema', 'Everyday Rewards', 'Tier 1', 5),
    ('odyssey-reward-uniform-15', 'Free Uniform Item ($15 Value)', 'Choose an eligible uniform item up to $15.', 200, 'Gear', 'Everyday Rewards', 'Tier 1', 6),
    ('odyssey-reward-meal-voucher', 'Free Meal Voucher', 'One eligible meal voucher.', 200, 'Food', 'Everyday Rewards', 'Tier 1', 7),
    ('odyssey-reward-gift-card-25', 'Your Choice Gift Card ($25)', 'Choose from the available $25 gift cards.', 275, 'Experience', 'Featured Rewards', 'Tier 2', 8),
    ('odyssey-reward-c-cash-25', '$25 C Cash', 'Celebration Cinema C Cash.', 275, 'Cinema', 'Featured Rewards', 'Tier 2', 9),
    ('odyssey-reward-lego-medium', 'Medium LEGO Set', 'Choose from the available medium LEGO sets.', 300, 'Gear', 'Featured Rewards', 'Tier 2', 10),
    ('odyssey-reward-paycheck-25', '$25 Bonus on Paycheck', 'A $25 payroll bonus, subject to normal payroll processing.', 300, 'Experience', 'Featured Rewards', 'Tier 2', 11),
    ('odyssey-reward-owala', 'Owala Water Bottle', 'An Owala water bottle, while supplies last.', 325, 'Gear', 'Featured Rewards', 'Tier 2', 12),
    ('odyssey-reward-uniform-30', 'Free Uniform Item ($30 Value)', 'Choose an eligible uniform item up to $30.', 350, 'Gear', 'Featured Rewards', 'Tier 2', 13),
    ('odyssey-reward-gift-card-50', 'Your Choice Gift Card ($50)', 'Choose from the available $50 gift cards.', 450, 'Experience', 'Featured Rewards', 'Tier 3', 14),
    ('odyssey-reward-lego-large', 'Large LEGO Set', 'Choose from the available large LEGO sets.', 500, 'Gear', 'Featured Rewards', 'Tier 3', 15),
    ('odyssey-reward-paycheck-50', '$50 Bonus on Paycheck', 'A $50 payroll bonus, subject to normal payroll processing.', 500, 'Experience', 'Featured Rewards', 'Tier 3', 16)
)
insert into public.rewards (
  app_id, chapter_id, name, description, miles_cost, inventory_count, image_url,
  category, collection, tier, enabled, sort_order, redemption_limit_per_employee,
  fulfillment_notes, featured, season_exclusive, almost_gone_threshold, lifecycle
)
select
  starter.app_id, active_chapter.id, starter.name, starter.description, starter.miles_cost,
  0, '/brand/celebration-c-frame.png', starter.category, starter.collection, starter.tier,
  true, starter.sort_order, 1,
  'Set inventory and fulfillment details in Rewards before accepting redemptions.',
  starter.collection = 'Featured Rewards', starter.collection = 'Season Exclusives', 2,
  'published'
from starter
cross join active_chapter
on conflict (app_id) do nothing;

comment on table public.employee_points_links is
  'Server-only, unguessable employee points links. Never expose this table through public client queries.';
