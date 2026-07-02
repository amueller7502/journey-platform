# Experience Release Notes

## V1.9 Production Reset Links

- Password reset emails now use a server route instead of the browser origin.
- Added `EXPERIENCE_APP_URL` so reset links point to the deployed network/Vercel instance instead of localhost.
- Documented the matching Supabase Auth Site URL and redirect URL settings.

## V1.8 Password Recovery

- Added **Forgot password?** to the Welcome sign-in flow.
- Added `/reset-password` so Supabase recovery links have a clean place to set a new password.
- Added builder-only password administration from Employees with temporary password reset controls.
- Added a protected server route so only signed-in Experience Builders can reset staff passwords.
- Documented the Supabase Auth redirect URL needed for production reset links.

## V1.7 Live Account Entry

- Replaced the Welcome screen preview access-code fallback with Supabase account sign-in.
- Added account creation that creates the Supabase Auth user, Experience profile, role, and employee/leader/builder account row together.
- Added login experience toggles for Employee, Manager, and Experience Builder.
- Sign-in now routes to the selected experience when the account role has permission.
- Added missing Experience Card area seed data so `supabase/seed.sql` runs cleanly after the schema reset.

## V1.6 Builder Delete / Archive Safety

Delete buttons now perform real actions in Lite-visible builders.

- Recognition Builder archives recognition types with existing Experience Moments and permanently deletes safe draft/test types.
- Rewards Builder archives rewards with redemption history and permanently deletes safe draft/test rewards.
- Employees archives/deactivates people with XP, moments, or reward history and permanently deletes safe draft/test accounts.
- Experience Card areas and tasks now archive when related records exist and disappear from active card workflows immediately.
- Daily Experience Card print-run removals now require confirmation and show success/error feedback.
- Added Active, Archived, and All filters to the Lite builders that manage archivable records.
- Active manager and employee workflows now ignore archived recognition types, card tasks, card areas, rewards, and employees.

## V1.5 Experience Lite First

Experience is now focused on the Lite launch: help managers consistently capture Experience Moments during real shifts.

### Lite Navigation

- Employee navigation is reduced to Today, My Experience, Rewards, and Profile.
- Manager navigation is reduced to Capture Moment, Experience Card Entry, Print Daily Experience Cards, Employee Lookup, and Reward Approvals.
- Experience Builder navigation is reduced to Recognition Builder, Rewards Builder, Employees, and Settings.
- Community, Leadership, Events, Season Planner, Displays, Analytics, Experience Stories, Achievements, Scoring, and other future modules remain preserved behind feature toggles.

### Manager Workflows

- Added a fast Employee Lookup page with search, current XP, weekly XP, recent moments, and quick links back to Capture Moment and Experience Card Entry.
- Improved Experience Card batch entry with crew search plus select-all and clear controls by standard.
- Kept printed Experience Cards as the paper-to-digital shift workflow with no visible QR code requirement.

### Employee Experience

- Reworked My Experience so employees can quickly see current XP, this week, level, Experience Card ID, reward requests, and next reward progress.
- Hid deeper Moment History / Experience Journal details in Lite mode.
- Simplified Rewards to Everyday Rewards and Featured Rewards, with C Cash replacing low-value snack prizes.

### Experience Builder

- Reframed the builder home around the four Lite controls: Recognition, Rewards, Employees, and Settings.
- Made Recognition Builder visual by default while preserving the advanced table.
- Made Rewards Builder visual by default with square reward images and Lite catalog focus.

### Build Verification

- `npm run typecheck` passed.
- `npm run lint` passed.
- `npm run build` passed.

### Known Issues

- Lite feature flags control navigation and direct-route access; some future backend tables and routes remain installed for later rollout.
- Supabase writes are available through the shared-state layer when environment variables are present, but live production account setup still needs a final smoke test.
- Reward and profile photo uploads still use preview/browser image data unless Supabase Storage is added.

## V1.4 Feature Toggles And Lite Launch Mode

Added a feature-flag layer so Experience can launch in a simplified Lite mode while preserving advanced modules for later rollout.

### Feature Flags

- Added centralized feature configuration for labels, descriptions, categories, minimum roles, navigation visibility, launch phase, and sort order.
- Added presets for Experience Lite, Season One Full, and Advanced Platform.
- Added Feature Toggles to Basic Settings at `/admin/settings`.
- App navigation now hides disabled features.
- Direct links to disabled features show a friendly coming-soon message.

### Experience Lite

- Lite mode includes Capture Moment, Experience Card Entry, Print Experience Cards, Employee XP Totals, Rewards, and Basic Settings.
- Moment History, Community, Seasons, Season Planner, Events, Leadership, TV Display, Advanced Experience Studio, Scoring, and Achievements are hidden in Lite mode.
- Advanced code, routes, schema, and UI modules are preserved behind toggles.

### Experience Cards

- Removed visible QR code generation from printable Experience Cards.
- Printed cards now use paper checklist flow with card ID, task checklist, XP values, and manager turn-in instructions.

### Known Issues

- Feature toggles control UI and route visibility; not every advanced backend mutation is feature-gated yet.
- Supabase persistence remains available through shared state when environment variables are present.

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
- Cards include employee name, area, Experience Card ID, Season, today's focus area, checklist items, XP values, manager turn-in instructions, and cut lines.

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
- Initially kept preview access codes as a non-production fallback; this fallback was removed in V1.7.

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
