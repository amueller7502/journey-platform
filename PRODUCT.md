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

Employee Experience:
- Today
- My Experience
- Community
- Rewards
- Profile

Leadership Experience:
- Leadership
- Capture Moment
- Experience Card Entry
- Experience Cards
- Excellence Checks
- Rewards Approvals
- Today's Focus
- Recent Moments

Admin/GM:
- Command Center
- Employees
- Photo Approvals
- Seasons
- Season Planner
- Recognition
- Rewards
- Events
- Standards
- Leadership
- Achievements
- Displays
- Scoring
- Launch Readiness
- Experience Studio
- Reports

## Core Workflows

Capture Moment:
1. Leader selects employee.
2. Leader selects recognition type.
3. Leader optionally adds note.
4. Leader captures the Experience Moment.
5. Employee XP, recent moments, and TV feed update.

Experience Card:
1. Leader selects employees working a shift.
2. Leader selects the card type for the scheduled area.
3. Leader prints half-sheet Experience Cards.
4. Employee turns in the card after the shift.
5. Leader enters verified items as a batch.
6. The batch creates individual Experience Moments and awards XP.

Rewards:
1. Employee requests a reward they can afford.
2. Leader/Admin approves, fulfills, or cancels.
3. Fulfillment reduces inventory.
4. Admin manages reward cost, inventory, collection, tier, flags, and images.

Leadership Experience:
- Leaders do not earn employee XP.
- Leaders earn LP, not XP.
- Leaders receive Leadership Recognition.
- Leadership Health tracks coverage, coaching, reward handoffs, Experience Card batches, readiness checks, and employees awaiting recognition.

## Experience Studio

Experience Studio modules:
- Season Planner
- Recognition
- Rewards
- Events
- Standards
- Leadership
- Achievements
- Displays
- Scoring
- Launch Readiness

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
