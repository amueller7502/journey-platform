# Experience Product Notes

## Frozen Product Language

- Platform name: **Experience**
- Category: **Employee Experience Platform**
- Mission: **Experience exists to recognize the people who create extraordinary movie experiences while helping leaders build exceptional teams.**
- Campaign phrase: **More Than A Movie Starts With Us.**
- Season: **Season One / The Odyssey**
- Currency: **XP**
- Recognition: **Experience Moment**
- History: **Experience Journal**
- Employee card: **Experience Card**
- Configuration: **Experience Studio**
- Store: **Rewards**
- Community goal: **Community XP**
- Operational metric: **Experience Score**
- Leadership metric: **Leadership Health**
- Launch mode: **Experience Lite**

Internal code and database fields may still use legacy names like `miles`, `chapter`, or `journey` until the schema is fully migrated. The user-facing product should not.

## Platform Philosophy

Experience is a Culture Management Platform. Nothing that defines culture should require a developer.

Every configurable object should support:
- Draft
- Published
- Archived
- Enabled/disabled
- Sort order
- Season assignment
- Created/updated timestamps

## Core Roles

Platform Auth roles:
- `employee`: Employee Experience access.
- `leader`: Leadership Experience and manager operations.
- `experience_designer`: Experience Builder access.

Employee Experience:
- Today
- My Experience
- Rewards
- Profile

Manager Lite:
- Capture Moment
- Experience Card Entry
- Print Daily Experience Cards
- Employee Lookup
- Reward Approvals

Experience Builder Lite:
- Recognition Builder
- Rewards Builder
- Employees
- Settings

Hidden future modules:
- Community
- Moment History
- Leadership Experience
- Leadership LP
- Leadership Rewards
- Seasons
- Season Planner
- Events
- Displays
- Analytics
- Experience Stories
- Achievements
- Scoring
- Advanced Experience Studio

Legacy / future manager modules:
- Excellence Checks
- Today's Focus
- Recent Moments

## Core Workflows

Capture Moment:
1. Leader selects employee.
2. Leader selects recognition type.
3. Leader optionally adds note.
4. Leader captures the Experience Moment.
5. Employee XP, recent moments, and TV feed update.
6. The workflow persists through the Supabase shared-state route and best-effort `experience_moments` rows when Supabase env vars are present.

Experience Card:
1. Leader selects employees working a shift.
2. Leader selects the card type for the scheduled area.
3. Leader prints half-sheet Experience Cards.
4. Employee turns in the card after the shift.
5. Leader enters verified items as a batch.
6. The batch creates individual Experience Moments and awards XP.
7. The workflow persists through the Supabase shared-state route, `experience_card_batches`, and `experience_moments` when Supabase env vars are present.

Rewards:
1. Employee requests a reward they can afford.
2. Leader/Admin approves, fulfills, or cancels.
3. Fulfillment reduces inventory.
4. Admin manages reward cost, inventory, collection, tier, flags, and images.
5. Requests and approvals persist through the Supabase shared-state route and `reward_redemptions` when Supabase env vars are present.

Leadership Experience:
- Leaders do not earn employee XP.
- Leaders earn LP, not XP.
- Leaders receive Leadership Recognition.
- Leadership Health tracks coverage, coaching, reward handoffs, Experience Card batches, readiness checks, and employees awaiting recognition.
- Leadership modules are preserved for later rollout and hidden during Lite launch.

## Experience Studio

Experience Builder Lite modules:
- Recognition
- Rewards
- Employees
- Settings

Future Experience Studio modules:
- Seasons
- Events
- Standards
- Leadership
- Achievements
- Displays
- Scoring
- Launch Readiness

Studio edits currently persist through the shared operating state and sync best-effort normalized config tables for Seasons, Recognition, Rewards, Standards, Displays, and Scoring.

## Feature Flags

Experience should be able to run in a focused Lite launch mode without deleting advanced platform work.

Experience Lite includes:
- Capture Moment
- Experience Card Entry
- Print Experience Cards
- Employee XP Totals
- Rewards
- Employee Lookup
- Basic Settings

Experience Lite hides Moment History, Community, Seasons, Season Planner, Events, Leadership, Displays / TV Display, Analytics, Experience Stories, Advanced Experience Studio, Scoring, and Achievements until leadership chooses to enable those modules.

Presets:
- Experience Lite
- Season One Full
- Advanced Platform

## Season Planner

A season should support:
- Name
- Subtitle
- Start and end dates
- Community XP goal
- Theme
- Tagline
- Rewards
- Badges
- Experience Card design
- Daily Focus library
- TV signage treatment
- Scoring model
- Launch readiness

Season One is The Odyssey and uses the Odyssey skin. Future seasons, including a possible Dune 3 skin, should be built through the same system.
