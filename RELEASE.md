# Experience Release Notes

## V1.3 Supabase Shared State Sprint

Wired the highest-value operational workflows to Supabase while keeping local/demo data as a fallback.

### Supabase Persistence

- Added server-side Experience state helpers that use the service role key only on the server.
- Capture Moment now writes shared state and best-effort `experience_moments` rows.
- Experience Card batch entry now writes shared state plus `experience_card_batches` and `experience_moments`.
- Reward requests and approvals now write shared state plus `reward_redemptions`.
- Recognition Studio, Rewards Studio, Season Planner, Standards, Displays, and Scoring edits sync through shared state and best-effort normalized config tables.

### Auth And Roles

- Updated Supabase sign-in to read `profiles` and `user_roles`.
- Added role mapping for `employee`, `leader`, and `experience_designer`.
- Kept legacy `employees.role` fallback for current preview accounts.

### Database

- Added migration `supabase/migrations/202607020001_experience_shared_state.sql`.
- Added compatibility `app_id` columns for stable app IDs.
- Added `experience_standards`, `experience_moments`, `display_settings`, and `scoring_settings`.
- Updated seed data with app IDs, starter profiles, user roles, and Experience-named table seeds.

### Known Issues

- Live Supabase writes were not terminal-tested because the local shell did not expose the provided env vars.
- Studio edits still use shared operating state as the primary app source and normalized table sync as best-effort.
- Supabase Auth enforcement should stay off until production Auth users are linked to `profiles` and `employees`.

## V1.2 Usability, Season Planner, PDF Cards, And Visual Refresh

Made Experience easier to operate during real shifts while preserving the current
shared-state architecture.

### Language And Product Polish

- Cleaned remaining visible legacy language around Experience, XP, Rewards, Seasons, Experience Cards, and Experience Journal.
- Updated seed reward copy so low-value food prizes are represented as C Cash.
- Updated Experience Studio homepage language to ask: "What kind of employee experience do you want to create today?"

### Seasons

- Reworked Season Planner so the active Season is protected from accidental edits.
- Added clearer Active, Draft, Preview, and Archived states.
- Draft future Seasons can be created, edited, previewed, published, duplicated from the active Season, or archived.
- Publishing a future Season updates the live Season settings and archives the previous active Season.

### Experience Cards

- Replaced browser print behavior with a generated PDF print run.
- PDF cards use consistent half-sheet sizing on standard 8.5x11 pages.
- Cards include employee name, area, Experience Card ID, QR code, Season, today's focus area, checklist items, XP values, and cut lines.

### Rewards And Visual Direction

- Refreshed Rewards with a more playful cinema browsing surface.
- Added badges for Featured, New, Almost Gone, Season Exclusive, Collector, Coming Soon, Available, and Locked.
- Added subtle Celebration-style cinema doodle texture using tickets, film, glasses, stars, and snack-inspired line art.

### Known Issues

- The PDF is generated client-side from current shared preview state; a server-side PDF service may be preferred for locked production templates.
- Some preview edits still persist through the JSON operating-state bridge before normalized Supabase mutations are fully wired.
- Uploaded images still need Supabase Storage hardening.

## V1.1 Product Architecture Sprint

Moved Experience toward a commercial Employee Experience Platform where culture configuration does not require software development.

### Platform Architecture

- Added configurable Season Planner data with draft, preview, active, and archived states.
- Added Experience Studio module registry for Seasons, Recognition, Rewards, Events, Standards, Leadership, Achievements, Displays, Scoring, Launch Readiness, and Reports.
- Added shared state support for seasons, standards, display slides, scoring metrics, launch readiness items, achievements, leadership point rules, and leadership rewards.
- Extended Supabase schema for profiles, platform roles, seasons, events, displays, scoring, launch readiness, achievements, Experience Cards, card batches, leadership LP, and leadership reward redemptions.

### Authentication And Roles

- Added Supabase email/password sign-in on the Welcome screen.
- Added optional role-enforcement middleware controlled by `NEXT_PUBLIC_EXPERIENCE_AUTH_REQUIRED`.
- Added role routing for Employee, Leader, and Experience Designer/Admin paths.
- Kept preview access codes as a non-production fallback.

### Experience Studio

- Added Season Planner.
- Added Standards Studio.
- Added Displays Studio.
- Added Scoring Studio.
- Added Launch Readiness Studio.
- Added Achievements Studio.
- Added Leadership Studio for LP rules and leadership rewards.
- Added Experience Studio overview.

### Known Issues

- Some preview edits still persist through the JSON operating-state bridge before normalized Supabase mutations are fully wired.
- Auth enforcement must stay disabled until Supabase Auth users are created and connected to employee records.
- Uploaded images still need Supabase Storage hardening.
- Some internal names remain legacy for compatibility.

## V1.0 Management Preview Sprint

Prepared Experience to operate as an Employee Experience Platform rather than a fixed recognition prototype.

### Product Language

- Renamed the product surface to **Experience**.
- Froze product terms around XP, Experience Moments, Experience Journal, Experience Cards, Rewards, Experience Studio, Seasons, Community XP, Experience Score, and Leadership Health.
- Reframed Season One as **The Odyssey**.
- Updated the campaign phrase to **More Than A Movie Starts With Us.**

### Employee Experience

- Reworked Today around mission, Season One, Community XP, Today's Focus, Recognition Spotlight, countdown, current XP, level, Rewards, and Experience Journal.
- Replaced the old reward store with Rewards while preserving the legacy `/trading-post` redirect.
- Added curated reward collections, tiers, and flags.

### Manager / Leadership Experience

- Updated manager navigation around operational shift workflows.
- Improved Capture Moment for fast manager entry.
- Added Experience Cards as a manager print-run workflow.
- Clarified Excellence Checks as Community XP, not spendable employee XP.
- Expanded Leadership Dashboard signals, Leadership Achievements, and Leadership Rewards.

### Admin/GM

- Reframed Dashboard as Command Center.
- Reframed Recognition Library as Recognition Studio.
- Reframed Settings as Experience Studio.
- Reframed the old season-management page as Season Planner.
- Added Events configuration.
- Expanded Rewards editor metadata.

### TV Signage

- Updated the TV loop for Community XP, Today's Focus, Recognition Spotlight, Experience Leaderboard, Recognition Wall, Department Progress, Reward Spotlight, and Countdown.
- Preserved compatibility with old saved TV slide labels.

### Known Issues

- Supabase Auth requires production users before enforcement is turned on.
- Some internal names still use legacy `journey`, `chapter`, and `miles` terms for compatibility.
- Uploaded images are preview/local-state based until storage is added.
- Fully normalized Supabase mutations remain a V1.1 hardening task.
