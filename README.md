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
- Leaders receive Leadership Recognition and LP.
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

The app works with seeded demo data without Supabase Auth.

Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_EXPERIENCE_AUTH_REQUIRED=false
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it in client code.
Set `NEXT_PUBLIC_EXPERIENCE_AUTH_REQUIRED=true` only after Supabase Auth users are created and connected to employee profile rows.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql`.
5. Add the environment variables above to `.env.local`.
6. Create Supabase Auth users for employees, leaders, and Experience Designers.
7. Connect each Auth user to the matching `profiles.auth_user_id`.
8. Connect the same Auth user to the matching `employees.auth_user_id` when that person should have an in-app employee or leader account.
9. Confirm `user_roles.role` is one of `employee`, `leader`, or `experience_designer`.
10. Restart the dev server.

For an existing Supabase project that already ran an older schema, run:

```sql
-- In the Supabase SQL editor
-- Paste and run:
-- supabase/migrations/202607020001_experience_shared_state.sql
```

The app now writes operational state to Supabase through server routes:

- Capture Moment writes the shared operating state and `experience_moments`.
- Experience Card batch entry writes the shared operating state, `experience_card_batches`, and `experience_moments`.
- Reward requests and approvals write the shared operating state and `reward_redemptions`.
- Recognition Studio, Rewards Studio, Season Planner, Standards, Displays, Scoring, and related Studio edits write the shared operating state and best-effort normalized config rows.

The shared operating state lives in `journey_operating_state` for compatibility while normalized tables mature. Some internal table, field, storage, and CSS names still use legacy `journey`, `chapter`, `passport`, or `miles` terminology while the product UI uses Experience, Seasons, Experience Cards, and XP.

## Supabase Auth Roles

Experience uses platform roles in `user_roles`:

- `employee` routes to `/home`.
- `leader` routes to `/leadership/dashboard`.
- `experience_designer` routes to `/admin/dashboard`.

The app still supports the legacy `employees.role` values `employee`, `manager`, and `admin` as a fallback while accounts are being migrated.

To link a Supabase Auth user, copy the user UUID from Supabase Auth and update both tables:

```sql
update public.profiles
set auth_user_id = 'AUTH_USER_UUID'
where email = 'alex.rivera@north.example';

update public.employees
set auth_user_id = 'AUTH_USER_UUID'
where email = 'alex.rivera@north.example';
```

## Demo Access Codes

Use the Welcome screen access code field:

- Employee: `AR1570`
- Leader: `JE1570`
- Admin/GM: `SC1570`

Demo buttons:

- Employee Experience -> `/home`
- Leadership Experience -> `/leadership/dashboard`
- Admin/GM -> `/admin/dashboard`
- TV Display -> `/tv`

## Main Routes

Employee:

- `/home` Today
- `/my-journey` My Experience
- `/community` Community
- `/rewards` Rewards
- `/profile` Profile
- `/leaderboard` Experience Leaderboard

Leadership:

- `/leadership/dashboard` Leadership Dashboard
- `/manager/recognize` Capture Moment
- `/manager/passport` Experience Card Entry
- `/manager/cards` Experience Cards
- `/manager/excellence-checks` Excellence Checks
- `/manager/pending-rewards` Rewards Approvals
- `/manager/todays-focus` Today's Focus
- `/manager/recognition-feed` Recent Moments

Admin/GM:

- `/admin/dashboard` Command Center
- `/admin/employees` Employees
- `/admin/photo-approvals` Photo Approvals
- `/admin/seasons` Seasons
- `/admin/season-planner` Season Planner
- `/admin/recognition-library` Recognition
- `/admin/rewards` Rewards
- `/admin/events` Events
- `/admin/standards` Standards
- `/admin/leadership` Leadership
- `/admin/achievements` Achievements
- `/admin/displays` Displays
- `/admin/scoring` Scoring
- `/admin/launch-readiness` Launch Readiness
- `/admin/settings` Experience Studio / Skin Developer
- `/admin/studio` Experience Studio overview
- `/admin/analytics` Reports

Utility:

- `/tv` Digital signage loop
- `/trading-post` Legacy redirect to `/rewards`

## Feature Flags And Lite Mode

Experience launches in **Experience Lite** by default. Lite mode keeps the app focused on the pieces managers and employees need immediately:

- Capture Moment
- Experience Card Entry
- Print Experience Cards
- Employee XP Totals
- Rewards
- Basic Settings

Lite mode intentionally hides Moment History, Community, Seasons, Season Planner, Events, Leadership, TV Display, advanced Experience Studio, Scoring, and Achievements. Hidden features are not deleted; they are preserved behind feature flags and can be enabled later.

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
7. Enter turned-in cards through `/manager/passport`.

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
- Configure unlimited Seasons, duplicate the active Season, edit future drafts, preview, publish one active Season, and archive completed Seasons.
- Configure Events and Displays.
- Configure Standards, Achievements, Leadership LP rules, Scoring, and Launch Readiness.
- Configure skins through Skin Developer.

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

Use Admin/GM tools where possible:

- Employees: `/admin/employees`
- Recognition Studio: `/admin/recognition-library`
- Rewards: `/admin/rewards`
- Experience Studio: `/admin/settings`
- Season Planner: `/admin/season-planner`
- Launch Readiness: `/admin/launch-readiness`

Browser preview state can also be reset by clearing localStorage for the local site.

## Known Issues

- Supabase Auth sign-in is wired, but production enforcement is off by default until Auth users are created and connected.
- This local shell did not expose the Supabase env vars during the sprint, so live database writes were not smoke-tested from the terminal.
- Some internals still use legacy names for compatibility.
- Experience Card PDFs are generated in the browser using preview/shared state, then downloaded locally.
- Experience Moments for the live TV feed still use browser event storage plus the operating-state bridge.
- Studio edits are shared through Supabase and sync best-effort normalized rows; a future hardening pass should move every Studio form to dedicated table-specific mutations.
- Feature flags currently control UI and route visibility; advanced database objects remain installed for later rollout.
- Uploaded reward/profile images are stored as browser data URLs in preview mode unless a storage provider is added.

## Screenshots

Preview screenshots should be kept in `screenshots/`. Recommended captures:

- Employee Today
- Manager Capture Moment
- Rewards
- TV Dashboard
- Admin Command Center
- Mobile employee view

Sample PDFs should be kept in `output/pdf/`.
