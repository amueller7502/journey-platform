# Release Notes

## Experience Platform Language And Leadership Experience

Renamed the platform to **Experience** across user-facing product language.

## Highlights

- Reframed the product as an **Employee Experience Platform** rather than a recognition campaign.
- Added frozen product language in README and product docs.
- Preserved the Employee Experience while updating labels to Experience.
- Added a new Leadership Experience for managers.
- Added Leadership Dashboard, Leadership Health, Leadership Journal, Leadership Achievements, Leadership Recognition, Leadership Rewards, Recognition Coverage, Coaching Insights, and Employees Awaiting Recognition.
- Clarified that managers do not earn employee XP or spendable employee Miles.
- Added Leadership Recognition seed data for coaching, communication, coverage, and operational impact.
- Renamed visible card language to Experience Card.
- Renamed visible moment language to Experience Moment.
- Updated welcome, brand lockup, role routing, navigation, docs, package metadata, and seeded copy.

## Known Issues

- Some internal code, storage keys, table names, and CSS tokens still use `journey` for migration stability.
- Experience Moments still use browser event storage for the live TV feed; normalized per-action Supabase writes remain a hardening step.
- Supabase operating-state persistence stores configurable state as JSON when service-role environment variables are configured.
- Login is role selection, not production authentication.
