# Experience Release Notes

## V1.15 Manager Roster, Excel Import, And Redemptions

- Expanded the single `/manage` page with Capture Points, Crew Quest, Redeem Points, and People tabs.
- Added managers directly from the People tab so point awards can be attributed to the correct leader without creating login accounts.
- Added employee creation, inline name/role/department editing, and safe archival while preserving point and redemption history.
- Added `.xlsx`, CSV, and TSV employee import with support for a simple one-column name list or optional Name, Role, Department, Title, and Email headers.
- Added manager-side reward fulfillment that records an auditable redemption, reduces Available points immediately, increases Redeemed points, and preserves lifetime Earned points for the leaderboard.
- Added server-side available-balance and per-reward-limit validation to prevent duplicate or overspent redemptions.
- Added additive migration `202607180002_redemption_point_snapshots.sql` so historical redemption costs do not change when reward prices are edited later.
- Synchronized normalized employee XP rows when managers capture points or process Crew Quest cards so totals persist correctly across reloads.
- Kept all roster and redemption writes in the shared Supabase operating state with normalized-table sync.

## V1.14 Simple Manager Link And Public Leaderboard

- Replaced the keyed manager URL with one unlisted `/manage` route.
- Kept manager submissions protected with a short-lived, server-signed credential so the long-term secret is never exposed in the URL or browser bundle.
- Removed points-link distribution from the manager workflow, leaving only Capture Points and Crew Quest card processing.
- Replaced employee codes and tokens with a public, no-login crew leaderboard.
- Added earned, pending, redeemed, and available point columns plus crew-wide totals.
- Redirected legacy employee token links and valid keyed manager bookmarks to their new simple routes.
- Preserved all existing Supabase data, token records, Builder tools, and advanced modules.
- Prevented new reward requests from committing more points than an employee has available after existing redemptions.

## V1.13 Odyssey Public Flows

- Replaced the public login-first launch surface with an Odyssey-styled private points-code entry.
- Added an unlisted, no-login manager route for Capture Points, Crew Quest card processing, and private-link distribution.
- Added per-employee UUID points links backed by a server-only Supabase table with no anonymous or authenticated client access.
- Added the Odyssey poster's nine point-earning options and sixteen reward values as editable starter configuration.
- Protected point and card mutations with either the unlisted manager key or an authenticated manager session.
- Protected the full shared-state API so public visitors cannot retrieve the employee roster or configuration payload.
- Preserved authenticated Builder access and advanced modules behind existing feature flags.
- Added mobile Odyssey styling based on the supplied navy, gold, red, and ivory poster treatment.
- Added additive migration `202607180001_odyssey_public_flows.sql` and deployment/setup notes.

## V1.12 Experience Lite Cleanup

- Tightened Experience Lite language around XP, Rewards, Seasons, Experience Cards, and Experience Moments.
- Kept default feature visibility focused on Lite workflows while preserving advanced modules behind toggles.
- Improved the Daily Experience Card PDF with cut marks, stronger card ID placement, manager entry link text, and no split cards.
- Verified Lite builder delete/archive behavior uses confirmation dialogs, archive filters, and immediate removal from active workflows.
- Added `DATA_MIGRATION.md` with production-safe Supabase guidance.
- Updated setup notes so seed data is clearly preview-only and migrations are the path for existing projects.

## V1.11 Role-Aware Login

- Removed the front-door access-level picker from sign-in.
- Sign-in now resolves the account role and opens the correct experience automatically.
- Public account creation now creates a starter Employee account.
- App navigation now follows the role hierarchy: Builder includes Manager and Employee tools; Manager includes Employee tools.
- Builder/manager inherited navigation remains visible when moving across lower-role pages.

## V1.10 Builder Access Recovery

- Added `/setup/access` so an owner can create or repair the first Experience Builder login.
- Added guarded bootstrap logic: it works without a key only when no connected Builder login exists yet.
- Added optional `EXPERIENCE_SETUP_KEY` support for repairing access after a Builder login already exists.
- Added a **Need Builder access?** link to the login panel.

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
- Sign-in now routes automatically based on the account role.
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
- Some internal names remain older compatibility details.

## V1.0 Management Preview Sprint

Prepared Experience to operate as an Employee Experience Platform rather than a fixed recognition prototype.

### Product Language

- Renamed the product surface to **Experience**.
- Froze product terms around XP, Experience Moments, Experience Journal, Experience Cards, Rewards, Experience Studio, Seasons, Community XP, Experience Score, and Leadership Health.
- Reframed Season One as **The Odyssey**.
- Updated the campaign phrase to **More Than A Movie Starts With Us.**

### Employee Experience

- Reworked Today around mission, Season One, Community XP, Today's Focus, Recognition Spotlight, countdown, current XP, level, Rewards, and Experience Journal.
- Replaced the old reward store with Rewards while preserving the compatibility redirect to `/rewards`.
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
- Some internal names remained older compatibility details until a dedicated schema rename could be planned.
- Uploaded images are preview/local-state based until storage is added.
- Fully normalized Supabase mutations remain a V1.1 hardening task.
