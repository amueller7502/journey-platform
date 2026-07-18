-- Preserve the point price paid at redemption time so later reward edits do not
-- change historical balances. This migration is additive and does not reset data.

alter table if exists public.reward_redemptions
  add column if not exists points_cost integer check (points_cost >= 0);

update public.reward_redemptions as redemption
set points_cost = reward.miles_cost
from public.rewards as reward
where redemption.points_cost is null
  and (
    redemption.reward_id = reward.id
    or (
      redemption.reward_app_id is not null
      and redemption.reward_app_id = reward.app_id
    )
  );
