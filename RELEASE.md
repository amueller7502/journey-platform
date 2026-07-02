# Experience Release Notes

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
