# Experience

Experience is an Employee Experience Platform for Celebration Cinema North.

Mission: **Experience exists to recognize the people who create extraordinary movie experiences while helping leaders build exceptional teams.**

Product promise: **Experience makes recognizing great work easier than overlooking it.**

Season One is **The Odyssey**, running **July 16-August 12, 2026**. The management preview date is **July 9, 2026** and the employee launch date is **July 16, 2026**. The Season One community goal is **15,700 XP**.

Campaign phrase: **More Than A Movie Starts With Us.**

## Core Rules

- Employees do not self-submit XP.
- Managers capture and verify Experience Moments.
- Managers do not earn employee XP.
- Managers receive Leadership Recognition.
- Recognition matters more than competition.
- Every XP entry represents a Moment That Mattered.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase-ready state bridge
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

Optional Supabase variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

`SUPABASE_SERVICE_ROLE_KEY` is server-only. Do not expose it in client code.

## Supabase Setup

1. Create a Supabase project.
2. Open the SQL editor.
3. Run `supabase/schema.sql`.
4. Run `supabase/seed.sql`.
5. Add the environment variables above to `.env.local`.
6. Restart the dev server.

The current persistence bridge stores configurable operating state in `journey_operating_state` as JSON for compatibility. Some internal table, field, storage, and CSS names still use legacy `journey`, `chapter`, or `miles` terminology while the product UI uses Experience, Seasons, and XP.

## Demo Access Codes

Use the Welcome screen access code field:

- Employee: `AR1570`
- Manager: `JE1570`
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

Manager:

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
- `/admin/recognition-library` Recognition Studio
- `/admin/rewards` Rewards
- `/admin/settings` Experience Studio
- `/admin/chapters` Season Builder
- `/admin/events` Experience Events
- `/admin/analytics` Reports

Utility:

- `/tv` Digital signage loop
- `/trading-post` Legacy redirect to `/rewards`

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
6. Print half-sheet cards.
7. Enter turned-in cards through `/manager/passport`.

Rewards:

1. Employee opens `/rewards`.
2. Employee requests an affordable reward.
3. Manager/Admin opens Rewards Approvals.
4. Approve, fulfill, or cancel.
5. Fulfillment reduces inventory.

Admin configuration:

- Add/edit/delete employees and accounts.
- Import employees from CSV.
- Configure recognition types and excellence checks.
- Configure Experience Card templates.
- Configure reward inventory, costs, images, collections, tiers, and flags.
- Configure Season One settings.
- Configure Experience Events and TV slides.
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
- Season Builder: `/admin/chapters`

Browser preview state can also be reset by clearing localStorage for the local site.

## Known Issues

- Full Supabase Auth is not yet wired; access codes are preview-friendly role routing.
- Some internals still use legacy names for compatibility.
- Experience Moments for the live TV feed still use browser event storage plus the operating-state bridge.
- The Supabase persistence bridge is JSON-first; fully normalized per-action writes should be hardened in V1.1.
- Uploaded reward/profile images are stored as browser data URLs in preview mode unless a storage provider is added.

## Screenshots

Preview screenshots should be kept in `screenshots/`. Recommended captures:

- Employee Today
- Manager Capture Moment
- Rewards
- TV Dashboard
- Admin Command Center
- Mobile employee view
