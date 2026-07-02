grant usage on schema public to anon, authenticated, service_role;

grant all privileges on table public.profiles to service_role;
grant all privileges on table public.user_roles to service_role;
grant all privileges on table public.employees to service_role;
grant all privileges on table public.departments to service_role;
grant all privileges on table public.journey_card_areas to service_role;
grant all privileges on table public.journey_operating_state to service_role;

grant select, insert, update, delete on table public.profiles to authenticated;
grant select, insert, update, delete on table public.user_roles to authenticated;
grant select, insert, update, delete on table public.employees to authenticated;
grant select on table public.departments to authenticated;
grant select on table public.journey_card_areas to authenticated;
grant select on table public.journey_operating_state to authenticated;

grant usage, select, update on all sequences in schema public to service_role;
grant usage, select, update on all sequences in schema public to authenticated;

grant execute on all functions in schema public to service_role;
grant execute on all functions in schema public to authenticated;

alter default privileges in schema public grant all privileges on tables to service_role;
alter default privileges in schema public grant usage, select, update on sequences to service_role;
alter default privileges in schema public grant execute on functions to service_role;

alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant usage, select, update on sequences to authenticated;
alter default privileges in schema public grant execute on functions to authenticated;
