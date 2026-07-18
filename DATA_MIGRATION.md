# Experience Data Migration Notes

Experience is now connected to Supabase-backed shared state. Treat production data carefully.

## Production Safety Rules

- Do not run `supabase/schema.sql` against a production project that already has live data. It is a reset script and can drop existing tables.
- Do not run `supabase/seed.sql` in production unless you intentionally want sample Celebration Cinema North data in that environment.
- For an existing Supabase project, apply only migration files from `supabase/migrations/`, in filename order.
- Back up production data before applying migrations.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it through a `NEXT_PUBLIC_` environment variable.

## Fresh Preview Environment

For a brand-new preview database with no production data:

1. Run `supabase/schema.sql`.
2. Run `supabase/seed.sql` only if you want the sample launch data.
3. Add environment variables in Vercel and local `.env.local`.
4. Create or repair the first Experience Builder account through `/setup/access`.

## Existing Or Production Environment

For an existing database:

1. Review pending files in `supabase/migrations/`.
2. Run only the migrations that have not been applied yet.
3. Do not re-run seed data.
4. Smoke test sign-in, Capture Moment, Experience Card entry, Rewards, and Builder edits.

## Odyssey Public-Flow Migration

`202607180001_odyssey_public_flows.sql` is additive and safe for an existing Experience database. It:

- creates `employee_points_links`, a server-only table of random private lookup tokens;
- creates a token for every active employee with an `app_id`;
- inserts the Odyssey poster's recognition and reward starter records when an active legacy chapter exists;
- does not reset employee XP, Experience Moments, card batches, redemptions, operating state, or existing custom records.

Run it before sharing employee points links. After it succeeds, test the manager URL and one employee URL in a private browser window.

## Current Known Compatibility Names

Some database objects still use legacy compatibility names while the product UI uses Experience language. Keep those names until a dedicated database rename migration is planned and tested.
