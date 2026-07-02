# Experience

Employee Experience Platform for Celebration Cinema North.

**Mission:** Recognizing the people who create extraordinary movie experiences.

**Product promise:** Recognition should be easier to capture than to overlook.

Experience contains two role experiences:

- **Employee Experience:** employees see Miles, moments, rewards, community progress, and their profile.
- **Leadership Experience:** managers see recognition coverage, coaching insights, leadership recognition, leadership rewards, and employees awaiting recognition.

Managers do not earn employee XP or spendable employee Miles. Managers receive **Leadership Recognition** for coaching, communication, coverage, and operational impact.

The first seasonal activation is **The Odyssey**, running **July 16-August 12, 2026**. The management preview is **July 9, 2026**, the employee launch is **July 16, 2026**, and the community goal is **15,700 Miles**.

## Frozen Product Language

- Product name: **Experience**
- Platform category: **Employee Experience Platform**
- Mission: **Recognizing the people who create extraordinary movie experiences.**
- Employee side: **Employee Experience**
- Manager side: **Leadership Experience**
- Employee recognition unit: **Experience Moment**
- Employee paper workflow: **Experience Card**
- Employee reward currency: **Miles**
- Manager recognition unit: **Leadership Recognition**

## Core Rules

- Employees do not self-submit miles.
- Managers verify and recognize moments.
- Recognition matters more than competition.
- Every Mile represents a Moment That Mattered.

## What Is Included

- Next.js App Router configurable build
- Tailwind CSS brand system using black, white, gray, and Celebration red
- Framer Motion TV display loop
- Supabase schema, RLS policies, and seed data
- Employee Experience, Leadership Experience, and Admin/GM page groups
- Leadership Dashboard, Leadership Health, Leadership Journal, Leadership Achievements, Leadership Recognition, Leadership Rewards, Recognition Coverage, Coaching Insights, and Employees Awaiting Recognition
- Manager Capture Moment flow designed for under 10 seconds
- Experience Card printable shift checklist workflow with end-of-shift manager entry
- Area-specific Experience Card template builder for Floor/Lobby, Concessions, Kitchen/Oscar's, Box Office/Guest Services, and Facilities/Exterior
- Bulk daily Experience Card assignment and print runs by employee and card type
- Preview account creation with role, department, access code, account status, and Experience Card assignment
- Admin-managed recognition type and excellence check library
- Admin-managed rewards, costs, inventory, Trading Post cards, and redemption queue
- Dedicated profile photo approval page
- Admin skin controls with Cinema Standard, Odyssey / North Stars, and a future Dune 3 slot
- Visible launch readiness checklist on the Admin/GM Dashboard
- TV mode focused on community progress, spotlight moments, recognition leaderboard, department progress, rewards, and countdown
- Subtle configurable-build indicator across screens

## Brand Asset

The exact Celebration Cinema C-frame crop is included at:

```text
public/brand/celebration-c-frame.png
```

It was cropped from the provided 2019 Celebration Cinema logo. The app does not redraw, distort, merge, or recreate the C frame.

## Local Setup

Recommended runtime: Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For a production-style local preview:

```bash
npm run build
npm run start
```

The build script uses the stable webpack builder for predictable local and CI packaging.

## Environment Variables

Environment variables are optional for local preview because the app can fall back to browser-saved configurable state and does not require Supabase authentication.

When connecting Supabase later, create `.env.local` from `.env.example`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Only the two `NEXT_PUBLIC_*` variables should be exposed to the browser. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side only.

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. Run `supabase/seed.sql` after the schema completes.
4. Add the Supabase environment variables to `.env.local`.
5. For Vercel, add the same environment variables in Project Settings before deploying the live data version.

The UI starts from seeded data in `src/lib/data.ts`. When `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are present, operating state is saved through `/api/journey-state` into `journey_operating_state`; browser localStorage remains the offline fallback.

## Seed Data

Seed data lives in `supabase/seed.sql` and includes:

- First seasonal activation: The Odyssey
- Community goal of 15,700 Miles
- Celebration Cinema North departments
- Sample employees with `passport_id` values that power Experience Card IDs
- Recognition standards and recognition types
- Excellence Checks as editable recognition types
- Rewards, inventory, and pending reward requests
- Daily spotlight and recent Experience Moments
- Skins, activation skin settings, menu items, and TV display settings

The database keeps the internal `passport_id` field name for stability. Employee- and manager-facing copy uses **Experience Card**.

## Role Entry

The welcome screen supports preview access codes plus demo role buttons:

- Employee opens `/home`
- Manager opens `/leadership/dashboard`
- Admin/GM opens `/admin/dashboard`
- TV Display opens `/tv`

Seed access codes:

- `AR1570` employee
- `JE1570` manager
- `SC1570` admin/GM

No password is required in Sprint Alpha. Production authentication is a known follow-up.

## Miles Rules In This Build

- Experience Moments and Experience Card tasks award spendable employee Miles.
- Excellence Checks log building readiness and add department/community progress.
- If a manager wants to reward the person behind an Excellence Check, they should capture a separate Experience Moment.
- Experience Card templates are built by area. Each day, managers/admins can bulk assign any active employee to the card type they are scheduled for and print those shift checklists.

## Management Preview Flow

1. Open `/manager/recognize`.
2. Search or select a sample employee.
3. Select a recognition type.
4. Submit with **Capture Moment**.
5. Confirm the Moment appears in Employee Home recent moments and the TV Recognition Wall on the same browser.

For Experience Card entry:

1. Open `/admin/passports`.
2. Choose the shift date, Experience Card type, and employees scheduled for that area.
3. Print the half-sheet checklist cards.
4. At the end of shift, open `/manager/passport`.
5. Select the employee/card type, batch-select verified items, and submit.
6. Confirm the total Miles awarded.

## Admin Flexibility

Admin/GM users can preview or manage:

- Add, edit, enable, and disable recognition types
- Add, edit, enable, and disable excellence checks
- Change Miles values
- Add, edit, enable, and disable rewards
- Change reward costs
- Adjust inventory
- Edit seasonal activation settings
- Disable the Odyssey skin and return to the Cinema Standard look
- Prepare future skins, including the seeded Dune 3 draft slot

Admin configuration saves to browser storage locally and to Supabase operating state when the Supabase service role environment variable is configured.

Admin editors that work in the configurable build:

- Employee roster add/edit/disable controls
- Experience Card ID editing
- Daily Experience Card bulk assignment and printable checklist cards
- Recognition Library add/edit/enable/disable controls
- Excellence Check add/edit/enable/disable controls
- Add/Edit Recognition Type forms
- Rewards / Inventory catalog editor
- Skin Developer
- TV Display Settings
- Menu Configuration
- Activation Settings
- Profile Photo Approvals

## Launch Readiness Checklist

The checklist is visible on `/admin/dashboard` and documented here:

- Seed employees
- Seed rewards
- Seed recognition types
- Print Experience Cards
- Test TV dashboard
- Test manager recognition
- Test reward redemption
- Test Experience Card batch entry

## Database Schema

The schema in `supabase/schema.sql` includes:

- `chapters`
- `skins`
- `chapter_skin_settings`
- `departments`
- `journey_card_areas`
- `menu_items`
- `employees`
- `recognition_standards`
- `recognition_types`
- `excellence_check_logs`
- `recognition_batches`
- `recognition_records`
- `leadership_recognitions`
- `leadership_achievements`
- `leadership_rewards`
- `coaching_insights`
- `rewards`
- `reward_redemptions`
- `daily_spotlights`
- `tv_display_settings`
- `journey_operating_state`

## Routes

- `/` Welcome / Login
- `/home` Employee Home
- `/my-journey` My Experience
- `/trading-post` Trading Post
- `/community` Community
- `/leaderboard` Leaderboard
- `/profile` Profile
- `/leadership/dashboard` Leadership Dashboard
- `/leadership/health` Leadership Health
- `/leadership/journal` Leadership Journal
- `/leadership/achievements` Leadership Achievements
- `/leadership/recognition` Leadership Recognition
- `/leadership/rewards` Leadership Rewards
- `/leadership/coverage` Recognition Coverage
- `/leadership/coaching` Coaching Insights
- `/leadership/awaiting-recognition` Employees Awaiting Recognition
- `/manager/dashboard` Legacy redirect to Leadership Dashboard
- `/manager/recognize` Capture Moment
- `/manager/excellence-checks` Excellence Checks
- `/manager/leaderboard` Manager Leaderboard
- `/manager/passport` Experience Card lookup / turned-in checklist entry
- `/manager/passport/[passport_id]` Experience Card batch entry
- `/manager/pending-rewards` Pending Rewards
- `/manager/daily-spotlight` Daily Spotlight
- `/manager/recognition-feed` Moment Feed
- `/admin/dashboard` Admin/GM Dashboard
- `/admin/employees` Employees
- `/admin/photo-approvals` Profile Photo Approvals
- `/admin/leaderboard` Admin Leaderboard
- `/admin/rewards` Rewards / Inventory
- `/admin/recognition-library` Recognition Library
- `/admin/recognition-library/new` Add Recognition Type
- `/admin/recognition-library/[type_id]` Edit Recognition Type
- `/admin/analytics` Recognition Analytics
- `/admin/settings` Settings, skins, and menu configuration
- `/admin/chapters` Activation Management
- `/admin/passports` Experience Cards
- `/tv` TV Display Mode

Legacy aliases remain for `/manager/recognize/passport` and `/manager/recognize/passport/[passport_id]`.

## TV Display Mode

The TV dashboard rotates through:

- Community Progress
- Recognition Leaderboard
- 15,700 / IMAX 1570
- Today's Spotlight
- Recognition Wall
- Department Progress
- Reward Spotlight
- Countdown

The leaderboard is available to employees, managers, Admin/GM users, and the TV loop. Reward Spotlight shows multiple rotating prizes to keep the Trading Post visible.

For fullscreen during the preview, open `/tv` and click the fullscreen icon in the TV header, or use the browser fullscreen command.

## Screenshots

Captured screenshots are included in `screenshots/`:

- `employee-home.png`
- `manager-capture-moment.png`
- `trading-post.png`
- `tv-dashboard.png`
- `admin-dashboard.png`
- `mobile-employee-home.png`

Additional preview screenshots may include `welcome.png`, `journey-card-entry.png`, `admin-rewards-editor.png`, and `admin-settings.png`.

## Deploying To Vercel

The build deploys cleanly without Supabase environment variables because it uses seeded data plus browser-saved configuration. Add Supabase variables when you want shared saved state across devices.

Exact steps:

1. Push this project to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New... > Project**.
3. Import the Experience repository.
4. Set **Framework Preset** to **Next.js**.
5. Leave **Root Directory** as the project root.
6. Use **Install Command**: `npm install`.
7. Use **Build Command**: `npm run build`.
8. Leave **Output Directory** blank so Vercel uses the Next.js default.
9. Add Supabase environment variables if you want shared operating-state persistence across devices; otherwise leave them blank for local/browser fallback.
10. Click **Deploy**.
11. After deployment, open `/`, `/manager/recognize`, `/admin/dashboard`, and `/tv` to verify role entry and the TV loop.

Optional environment variables for a later Supabase-backed deployment:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Project Documentation

- `MANIFESTO.md` explains the mission and recognition philosophy.
- `PRODUCT.md` summarizes product promise, rules, workflows, and launch scope.
- `RELEASE.md` lists Sprint Alpha changes and known issues.
- `ROADMAP.md` separates launch work from future follow-ups.

## Packaging

The distributable archive is:

```text
experience-platform.zip
```

The archive excludes dependency folders, local build output, local environment files, and development cache folders.

## Known Issues

- Login is role selection, not production authentication.
- Supabase persistence currently stores the configurable operating state as JSON in `journey_operating_state`; fully normalized per-action writes are still a future hardening step.
- Experience Moments still use browser event storage for the live TV feed, while employee Miles and core operating state sync through the Experience state bridge when Supabase is configured.
- Recognition Library, Excellence Checks, Employee Roster, Rewards, Skin Developer, Menu Configuration, Activation Settings, redemptions, and Experience Card print runs are configurable in-app.
- The C-frame is cropped from the provided raster logo, not a vector source file.
- TV mode rotates panels client-side and includes the configurable Recognition Leaderboard slide.
- If screenshots are recaptured after a rebuild, restart the local Next.js preview first so the browser does not hold stale chunk references.
