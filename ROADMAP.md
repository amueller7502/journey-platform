# Experience Roadmap

## V1.0 Management Preview

- Finish Experience language across core screens.
- Make managers able to capture Experience Moments in under 10 seconds.
- Move Experience Card print runs to the manager workflow.
- Keep admin card template configuration in Experience Studio.
- Redesign the old reward store into Rewards.
- Add configurable Events.
- Add Leadership Dashboard, Leadership Health, Leadership Journal, Leadership Achievements, Leadership Recognition, Leadership Rewards, Recognition Coverage, Coaching Insights, and Employees Awaiting Recognition.
- Keep TV signage focused on Community XP, Today's Focus, Recognition Spotlight, Department Progress, Rewards, Countdown, and Experience Leaderboard.

## V1.3 Completed Supabase Shared State

- Added Supabase Auth role mapping for `employee`, `leader`, and `experience_designer`.
- Added `profiles` and `user_roles` setup path.
- Added server-side shared-state writes for Capture Moment, Experience Card batches, reward requests, reward approvals, Recognition Studio, Rewards Studio, and Season Planner.
- Added compatibility migration for stable app IDs and Experience-named tables.
- Kept local/demo data as fallback when Supabase env vars are absent.

## V1.4 Completed Lite Launch Mode

- Added centralized feature flags.
- Added Experience Lite, Season One Full, and Advanced Platform presets.
- Hid Moment History and advanced modules in Lite mode.
- Added disabled-route coming-soon messaging.
- Removed QR code generation from printed Experience Cards.

## V1.5 Completed Experience Lite First

- Reduced default navigation to the Lite launch workflows.
- Added Manager Employee Lookup for fast search, XP totals, recent moments, and quick actions.
- Reworked My Experience around XP, reward progress, card ID, and requests while hiding deeper Moment History.
- Simplified Rewards to Everyday Rewards and Featured Rewards for launch.
- Reframed Experience Builder around Recognition, Rewards, Employees, and Settings only.
- Made Recognition Builder and Rewards Builder visual by default while preserving advanced controls.
- Improved Experience Card batch entry with crew search and faster checklist controls.

## Next Operational Hardening

- Create production Supabase Auth users and connect them to `profiles` and employee records.
- Turn on `NEXT_PUBLIC_EXPERIENCE_AUTH_REQUIRED` after account setup.
- Run a real-shift pilot with managers using only Capture Moment, Experience Card Entry, Card Printing, Employee Lookup, and Reward Approvals.
- Add Supabase Storage for reward and profile photos.
- Add audit history for Builder changes.
- Move remaining Builder forms from shared-state sync to dedicated table-specific mutations.
- Add duplicate-submission protection and shift handoff notes around Experience Card batches.
- Add reward budget and inventory liability reporting after Lite adoption is steady.

## Platform Expansion

- Harden season cloning into a full copy wizard for rewards, recognitions, displays, scoring, and skins.
- Add season-specific reward availability.
- Add badge-art uploads through Supabase Storage.
- Add per-season TV slide packages with scheduled playlists.
- Add skin versioning and preview before activation.
- Add Studio audit log and rollback.

## Future Ideas

- Dune 3 skin.
- Staff nomination prompts that notify managers but do not self-award XP.
- Mobile-first manager quick actions.
- Scheduled TV slide playlists.
- Deeper coaching recommendations based on recognition coverage.
