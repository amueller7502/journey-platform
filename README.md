# Experience

Experience is an Employee Experience Platform for Celebration Cinema North.

Mission: **Experience exists to recognize the people who create extraordinary movie experiences while helping leaders build exceptional teams.**

Product promise: **Experience makes recognizing great work easier than overlooking it.**

Season One is **The Odyssey**, running **July 16-August 12, 2026**. The management preview date is **July 9, 2026** and the employee launch date is **July 16, 2026**. The Season One community goal is **15,700 XP**.

Campaign phrase: **More Than A Movie Starts With Us.**

## Core Rules

- Employees do not self-submit XP.
- Leaders capture and verify Experience Moments.
- Leaders do not earn employee XP.
- Leadership recognition is separate from employee XP and remains hidden during Lite launch.
- Recognition matters more than competition.
- Every XP entry represents a Moment That Mattered.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- PDF-generated Experience Cards
- Supabase shared-state persistence
- Supabase Auth roles for employees, leaders, and Experience Designers
- Vercel-ready deployment

## Run Locally

```bash
npm install
npm run dev
```

Open:

- Local app: `http://127.0.0.1:3000`
- TV display: `http://127.0.0.1:3000/tv`

If port 3000 is busy, Next.js will offer another port.

## Quality Checks

```bash
npm run typecheck
npm run lint
npm run build
```

Run all three before pushing to GitHub or deploying to Vercel.

## Environment Variables

Experience Lite uses Supabase for live account creation, sign-in, and shared state.

Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
EXPERIENCE_APP_URL=https://your-vercel-domain.vercel.app
EXPERIENCE_SETUP_KEY=
NEXT_PUBLIC_EXPERIENCE_AUTH_REQUIRED=false
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it in client code.
`EXPERIENCE_APP_URL` should be the deployed Vercel URL with no trailing slash. Password reset emails use this value so links do not point at localhost.
`EXPERIENCE_SETUP_KEY` is optional but recommended after launch. It allows an owner to repair Builder access at `/setup/access` if a Builder login already exists.
Set `NEXT_PUBLIC_EXPERIENCE_AUTH_REQUIRED=true` only after at least one Experience Builder account exists and has been tested.

## Supabase Setup

Read [DATA_MIGRATION.md](/Users/austinmueller/Documents/Project-Journey/DATA_MIGRATION.md) before running SQL against any project with real data.

For a brand-new preview Supabase project:

1. Create a Supabase project with no existing Experience data.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql` only if you want sample Celebration Cinema North data.
5. Add the environment variables above to `.env.local`.
6. Restart the dev server.
7. Open the Welcome screen and use **Create** to create the first Experience Builder account.
8. Sign in with that account and confirm it can open Experience Builder.
9. Create manager and employee accounts from the Welcome screen or Employees Builder.
10. After accounts are tested, set `NEXT_PUBLIC_EXPERIENCE_AUTH_REQUIRED=true` when you are ready to block direct route access for signed-out users.

For an existing Supabase project, do not re-run `supabase/schema.sql` or `supabase/seed.sql`. Apply only migration files that have not been run yet:

```sql
-- In the Supabase SQL editor
-- Paste and run:
-- supabase/migrations/202607020001_experience_shared_state.sql
-- supabase/migrations/202607020002_api_grants.sql
```

If account creation shows `permission denied for table profiles`, run `supabase/migrations/202607020002_api_grants.sql`. That migration grants Supabase API access to the public tables while row-level security still controls which rows each role can read or write.

If Builder access still shows `permission denied for table profiles`, run:

```sql
-- In the Supabase SQL editor
-- Paste and run:
-- supabase/migrations/202607020003_auth_access_repair.sql
```

Then confirm Vercel has the real `SUPABASE_SERVICE_ROLE_KEY`, not the anon key. The service role key must be server-only and should never use a `NEXT_PUBLIC_` prefix.

The app now writes operational state to Supabase through server routes:

- Capture Moment writes the shared operating state and `experience_moments`.
- Experience Card batch entry writes the shared operating state, `experience_card_batches`, and `experience_moments`.
- Reward requests and approvals write the shared operating state and `reward_redemptions`.
- Recognition Studio, Rewards Studio, Season Planner, Standards, Displays, Scoring, and related Studio edits write the shared operating state and best-effort normalized config rows.

The shared operating state uses a compatibility table while normalized tables mature. Some internal table, field, storage, and CSS names remain legacy-only implementation details while the product UI uses Experience, Seasons, Experience Cards, and XP.

## Supabase Auth Roles

Experience uses platform roles in `user_roles`:

- `employee` routes to `/home`.
- `leader` routes to `/manager/recognize` in Lite mode.
- `experience_designer` routes to `/admin/dashboard`.

The app still supports the legacy `employees.role` values `employee`, `manager`, and `admin` as a fallback while accounts are being migrated.

## Account Creation

The Welcome screen includes Sign In, Create Account, and Reset Password tabs:

- Sign In opens the correct tools automatically based on the account role.
- Create Account creates a starter Employee account.
- Experience Builder access can promote roles from Employees or be repaired at `/setup/access`.

Creating an account creates:

- Supabase Auth user
- `profiles` row
- `user_roles` row
- `employees` row linked by `auth_user_id`

The preview access-code fallback and login role picker have been removed from the Welcome screen.

Role access is hierarchical:

- Employees see Employee Experience tools.
- Managers see Manager tools and Employee Experience tools.
- Experience Builders see Builder, Manager, and Employee Experience tools.

## Emergency Builder Access

If nobody can sign in or account creation is blocked, open:

```text
/setup/access
```

That page creates or repairs one real Experience Builder login. If no connected Builder login exists yet, the Setup Key can be left blank. If a connected Builder login already exists, set `EXPERIENCE_SETUP_KEY` in Vercel, redeploy, and enter that same key on the setup page.

After access is restored, sign in normally from the Welcome screen.

## Password Resets

The Welcome screen includes **Forgot password?** under Sign In. It sends a Supabase recovery email and sends the user to `/reset-password` to choose a new password.

In Supabase, add your deployed URL to Auth redirect URLs, including:

```text
https://your-vercel-domain.vercel.app/reset-password
```

In Supabase Auth URL Configuration, set **Site URL** to:

```text
https://your-vercel-domain.vercel.app
```

In Vercel, set `EXPERIENCE_APP_URL` to the same deployed URL. If this is missing while testing from a local browser, reset emails can fall back to localhost.

Experience Builders can also reset a staff member's temporary password from **Employees**. The builder must be signed in, the employee needs an email address, and the employee must already have a Supabase Auth login.

## Main Routes

Visible in Experience Lite:

Employee:

- `/home` Today
- `/my-journey` My Experience, using the current compatibility URL
- `/rewards` Rewards
- `/profile` Profile

Manager:

- `/manager/recognize` Capture Moment
- `/manager/passport` Experience Card Entry
- `/manager/cards` Print Daily Experience Cards
- `/manager/employees` Employee Lookup
- `/manager/pending-rewards` Rewards Approvals

Experience Builder:

- `/admin/dashboard` Builder Home
- `/admin/recognition-library` Recognition Builder
- `/admin/rewards` Rewards Builder
- `/admin/employees` Employees
- `/admin/settings` Settings and Feature Toggles

Hidden behind feature toggles for later:

- Community
- Moment History
- Seasons and Season Planner
- Events
- Leadership
- Displays / TV Display
- Analytics
- Experience Stories
- Achievements
- Scoring
- Advanced Experience Studio

Compatibility redirects:

- `/trading-post` Compatibility redirect to `/rewards`

## Feature Flags And Lite Mode

Experience launches in **Experience Lite** by default. Lite mode keeps the app focused on the pieces managers and employees need immediately:

- Capture Moment
- Experience Card Entry
- Print Experience Cards
- Employee XP Totals
- Rewards
- Employee Lookup
- Basic Settings

Lite mode intentionally hides Moment History, Community, Seasons, Season Planner, Events, Leadership, Displays / TV Display, Analytics, Experience Stories, advanced Experience Studio, Scoring, and Achievements. Hidden features are not deleted; they are preserved behind feature flags and can be enabled later.

Feature flags live in `src/lib/features.ts` and are editable in the app at `/admin/settings`.

Each feature includes:

- Enabled/disabled
- Label and description
- Category
- Minimum role
- Navigation visibility
- Launch phase
- Sort order

Presets:

- **Experience Lite**: recommended launch setting.
- **Season One Full**: adds Community, TV Display, and Moment History when the team is ready.
- **Advanced Platform**: enables all preserved modules.

If a disabled feature is opened directly, Experience shows a friendly “coming soon” message instead of exposing an unfinished screen.

## Operational Workflows

Capture Moment:

1. Select employee.
2. Select recognition type.
3. Add optional note.
4. Capture Moment.
5. Recent Moments and employee XP update immediately in the preview workspace.

Experience Cards:

1. Open `/manager/cards`.
2. Select shift date.
3. Select card type for the area the employee is scheduled for that day.
4. Bulk-select employees.
5. Create cards.
6. Generate the printable PDF.
7. Enter turned-in cards through the Experience Card Entry route.

Rewards:

1. Employee opens `/rewards`.
2. Employee requests an affordable reward.
3. Leader/Admin opens Rewards Approvals.
4. Approve, fulfill, or cancel.
5. Fulfillment reduces inventory.

Admin configuration:

- Add/edit/delete employees and accounts.
- Import employees from CSV.
- Configure recognition types and excellence checks.
- Configure Experience Card templates.
- Configure reward inventory, costs, images, collections, tiers, and flags.
- Use feature toggles to enable future modules when the team is ready.
- Future hidden modules include Seasons, Events, Displays, Standards, Achievements, Leadership, Scoring, Launch Readiness, and skins.

## Vercel Deployment

### Option A: Deploy From GitHub

1. Push this project to GitHub.
2. Go to [Vercel](https://vercel.com).
3. Choose **Add New Project**.
4. Import the GitHub repository.
5. Framework preset should auto-detect **Next.js**.
6. Build command: `npm run build`.
7. Install command: `npm install`.
8. Output directory: leave blank.
9. Add Supabase environment variables if using Supabase.
10. Click **Deploy**.

Future updates:

1. Commit changes locally.
2. Push to GitHub.
3. Vercel automatically redeploys the latest push.

### Option B: Deploy With Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
vercel --prod
```

## Reset Demo Data

Use Experience Builder tools where possible:

- Employees: `/admin/employees`
- Recognition Builder: `/admin/recognition-library`
- Rewards Builder: `/admin/rewards`
- Settings and Feature Toggles: `/admin/settings`

Browser preview state can also be reset by clearing localStorage for the local site.

## Known Issues

- Supabase Auth sign-in is wired, but production enforcement is off by default until Auth users are created and connected.
- This local shell did not expose the Supabase env vars during the sprint, so live database writes were not smoke-tested from the terminal.
- Some internals still use older compatibility names; the visible product language is Experience, XP, Season, Experience Card, and Rewards.
- Experience Card PDFs are generated in the browser using preview/shared state, then downloaded locally.
- Experience Moments for the live TV feed still use browser event storage plus the operating-state bridge.
- Studio edits are shared through Supabase and sync best-effort normalized rows; a future hardening pass should move every Studio form to dedicated table-specific mutations.
- Feature flags currently control UI and route visibility; advanced database objects remain installed for later rollout.
- Uploaded reward/profile images are stored as browser data URLs in preview mode unless a storage provider is added.
- Lite intentionally hides Moment History, Community, Displays, Leadership, Analytics, and Season planning until the core manager habit is proven.

## Screenshots

Preview screenshots should be kept in `screenshots/`. Recommended captures:

- Employee Today
- Manager Capture Moment
- Experience Card Entry
- Print Daily Experience Cards
- Employee Lookup
- Rewards
- Experience Builder
- Mobile manager view

Sample PDFs should be kept in `output/pdf/`.
