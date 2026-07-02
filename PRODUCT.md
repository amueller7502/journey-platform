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

## Core Roles

Employee Experience:
- Today
- My Experience
- Community
- Rewards
- Profile

Manager / Leadership Experience:
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
- Recognition Studio
- Rewards
- Experience Studio
- Season Builder
- Experience Events
- Reports
- Settings

## Core Workflows

Capture Moment:
1. Manager selects employee.
2. Manager selects recognition type.
3. Manager optionally adds note.
4. Manager captures the Experience Moment.
5. Employee XP, recent moments, and TV feed update.

Experience Card:
1. Manager selects employees working a shift.
2. Manager selects the card type for the scheduled area.
3. Manager prints half-sheet Experience Cards.
4. Employee turns in the card after the shift.
5. Manager enters verified items as a batch.
6. The batch creates individual Experience Moments and awards XP.

Rewards:
1. Employee requests a reward they can afford.
2. Manager/Admin approves, fulfills, or cancels.
3. Fulfillment reduces inventory.
4. Admin manages reward cost, inventory, collection, tier, flags, and images.

Leadership Experience:
- Managers do not earn employee XP.
- Leaders receive Leadership Recognition.
- Leadership Health tracks coverage, coaching, reward handoffs, Experience Card batches, readiness checks, and employees awaiting recognition.

## Season Builder

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

Season One is The Odyssey and uses the Odyssey skin. Future seasons, including a possible Dune 3 skin, should be built through the same system.
