# The Journey

Internal employee recognition platform for Celebration Cinema North.

**Product promise:** Journey makes recognizing great work easier than overlooking it.

Chapter One is **The Odyssey**, running **July 16-August 12, 2026**. The management preview is **July 9, 2026**, the employee launch is **July 16, 2026**, and the community goal is **15,700 Miles**.

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
- Employee, Manager, and Admin/GM page groups
- Manager Capture Moment flow designed for under 10 seconds
- Journey Card paper-to-digital batch entry workflow
- Area-specific Journey Card builder for Floor/Lobby, Concessions, Kitchen/Oscar's, Box Office/Guest Services, and Facilities/Exterior
- Preview account creation with role, department, access code, account status, and Journey Card assignment
- Admin-managed recognition type and excellence check library
- Admin-managed rewards, costs, inventory, and Trading Post cards
- Admin skin controls with Cinema Standard, Odyssey / North Stars, and a future Dune 3 slot
- Visible launch readiness checklist on the Admin/GM Dashboard
- TV mode focused on community progress, spotlight moments, department progress, rewards, countdown, and crew-based fleet progress
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

For the management preview, environment variables are optional because the app can run from browser-saved configurable state and does not require Supabase authentication.

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

The UI starts from seeded data in `src/lib/data.ts`, then admin edits persist to browser localStorage through `src/lib/journey-state.ts`. Supabase clients, schema, RLS policies, and seed data are ready for the live multi-device data layer. Supabase authentication is not required for the preview deployment.

## Seed Data

Seed data lives in `supabase/seed.sql` and includes:

- Chapter One: The Odyssey
- Community goal of 15,700 Miles
- Celebration Cinema North departments
- Sample employees with `passport_id` values that power Journey Card IDs
- Recognition standards and recognition types
- Excellence Checks as editable recognition types
- Rewards, inventory, and pending reward requests
- Daily spotlight and recent Journey Moments
- Skins, chapter skin settings, menu items, TV display settings, and fleet standings

The database keeps the internal `passport_id` field name for stability. Employee- and manager-facing copy uses **Journey Card**.

## Role Entry

The welcome screen supports preview access codes plus demo role buttons:

- Employee opens `/home`
- Manager opens `/manager/recognize`
- Admin/GM opens `/admin/dashboard`
- TV Display opens `/tv`

Seed access codes:

- `AR1570` employee
- `JE1570` manager
- `SC1570` admin/GM

No password is required in Sprint Alpha. Production authentication is a known follow-up.

## Miles Rules In This Build

- Journey Moments and Journey Card tasks award spendable employee Miles.
- Excellence Checks log building readiness and add department/community progress.
- If a manager wants to reward the person behind an Excellence Check, they should capture a separate Journey Moment.
- Journey Cards are assigned by area, so kitchen, lobby, concessions, box office, guest services, and facilities can have different task lists.

## Management Preview Flow

1. Open `/manager/recognize`.
2. Search or select a sample employee.
3. Select a recognition type.
4. Submit with **Capture Moment**.
5. Confirm the Moment appears in Employee Home recent moments and the TV Recognition Wall on the same browser.

For Journey Card entry:

1. Open `/manager/passport` or scan a Journey Card QR code.
2. Select a Journey Card ID.
3. Batch-select verified items.
4. Submit the batch.
5. Confirm the total Miles awarded.

## Admin Flexibility

Admin/GM users can preview or manage:

- Add, edit, enable, and disable recognition types
- Add, edit, enable, and disable excellence checks
- Change Miles values
- Add, edit, enable, and disable rewards
- Change reward costs
- Adjust inventory
- Edit Chapter One settings
- Disable the Odyssey skin and return to the Cinema Standard look
- Prepare future skins, including the seeded Dune 3 draft slot

Admin configuration currently saves to browser localStorage. Supabase mutations are modeled in the schema and are the next step for shared, multi-device production data.

Admin editors that work in the configurable build:

- Employee roster add/edit/disable controls
- Journey Card ID editing
- Recognition Library add/edit/enable/disable controls
- Excellence Check add/edit/enable/disable controls
- Add/Edit Recognition Type forms
- Rewards / Inventory catalog editor
- Skin Developer
- Menu Configuration
- Chapter Settings

## Launch Readiness Checklist

The checklist is visible on `/admin/dashboard` and documented here:

- Seed employees
- Seed rewards
- Seed recognition types
- Print Journey Cards
- Test TV dashboard
- Test manager recognition
- Test reward redemption
- Test Journey Card batch entry

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
- `rewards`
- `reward_redemptions`
- `daily_spotlights`
- `tv_display_settings`
- `tv_fleet_standings`

## Routes

- `/` Welcome / Login
- `/home` Employee Home
- `/my-journey` My Journey
- `/trading-post` Trading Post
- `/community` Community
- `/profile` Profile
- `/manager/recognize` Capture Moment
- `/manager/excellence-checks` Excellence Checks
- `/manager/passport` Journey Card lookup
- `/manager/passport/[passport_id]` Journey Card batch entry
- `/manager/pending-rewards` Pending Rewards
- `/manager/daily-spotlight` Daily Spotlight
- `/manager/recognition-feed` Moment Feed
- `/admin/dashboard` Admin/GM Dashboard
- `/admin/employees` Employees
- `/admin/rewards` Rewards / Inventory
- `/admin/recognition-library` Recognition Library
- `/admin/recognition-library/new` Add Recognition Type
- `/admin/recognition-library/[type_id]` Edit Recognition Type
- `/admin/analytics` Recognition Analytics
- `/admin/settings` Settings, skins, and menu configuration
- `/admin/chapters` Chapter Management
- `/admin/passports` Journey Cards
- `/tv` TV Display Mode

Legacy aliases remain for `/manager/recognize/passport` and `/manager/recognize/passport/[passport_id]`.

## TV Display Mode

The TV dashboard rotates through:

- Community Progress
- North Stars Fleet
- 15,700 / IMAX 1570
- Today's Spotlight
- Recognition Wall
- Department Progress
- Reward Spotlight
- Countdown

The schema includes a hard check that `show_individual_leaderboard` remains false. The fleet race is crew/community based, not an individual employee leaderboard.

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

The management-preview build deploys cleanly without Supabase environment variables because it uses seeded data plus browser-saved configuration.

Exact steps:

1. Push this project to GitHub, GitLab, or Bitbucket.
2. In Vercel, choose **Add New... > Project**.
3. Import the Journey repository.
4. Set **Framework Preset** to **Next.js**.
5. Leave **Root Directory** as the project root.
6. Use **Install Command**: `npm install`.
7. Use **Build Command**: `npm run build`.
8. Leave **Output Directory** blank so Vercel uses the Next.js default.
9. Do not add Supabase environment variables for the management preview unless you are testing live data wiring.
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
journey-platform.zip
```

The archive excludes dependency folders, local build output, local environment files, and development cache folders.

## Known Issues

- Login is role selection, not production authentication.
- Configurable admin state is browser-local until Supabase mutations are connected.
- Journey Moments are stored in browser localStorage and are not shared across devices yet.
- Recognition Library, Excellence Checks, Employee Roster, Rewards, Skin Developer, Menu Configuration, and Chapter Settings are configurable in-browser.
- Journey Card batch entry persists Miles and TV feed updates in the current browser; shared production persistence needs Supabase writes.
- Journey Card QR links use local preview URLs in seed data until deployment URLs are assigned.
- The C-frame is cropped from the provided raster logo, not a vector source file.
- TV mode rotates panels client-side and intentionally does not include an individual employee leaderboard.
- If screenshots are recaptured after a rebuild, restart the local Next.js preview first so the browser does not hold stale chunk references.
