# Release Notes

## Sprint Alpha: Management Preview Readiness

Prepared for the **July 9, 2026** management preview.

## Highlights

- Added launch documentation: `MANIFESTO.md`, `PRODUCT.md`, `RELEASE.md`, and `ROADMAP.md`.
- Clarified the product promise: Journey makes recognizing great work easier than overlooking it.
- Shifted UI language toward Journey Moments, Capture Moment, Recognize Moment, and Miles Earned.
- Polished Welcome, Employee Home, recognition cards, Trading Post cards, TV slides, Manager Recognition, and Journey Card workflows.
- Added a faster manager flow that can capture a Journey Moment with minimal clicks.
- Added browser-saved Journey Moment storage so captured Moments appear in recent recognition and TV recognition feed surfaces.
- Renamed employee-facing paper workflow to Journey Card while preserving passport IDs and database naming.
- Added launch readiness checklist for seed data, Journey Cards, TV testing, manager recognition, rewards, and batch entry.
- Confirmed admin flexibility for recognition types, excellence checks, Miles values, rewards, costs, inventory, and Chapter One settings.
- Added a TV fullscreen control for management preview display.
- Cleaned the Odyssey fleet display to numbered boats with cinematic vessel names and no mythology clip art direction.
- Replaced demo labeling with a configurable-build indicator.
- Added configurable employee roster management, Journey Card ID editing, live recognition/excellence check editing, reward editing, and Skin Developer controls.
- Added browser-saved configurable state for Chapter One settings.

## Known Issues

- Configurable actions currently use browser-local state unless Supabase mutations are connected.
- Login is role selection, not production authentication.
- Journey Card QR links use local preview URLs in seed data until deployment URLs are assigned.
- Journey Moments and configurable admin edits are browser-local and are not shared across devices yet.
- TV mode remains community-first and intentionally avoids individual employee leaderboards.
- Restart local preview after rebuilding before recapturing screenshots, or the browser may hold stale chunk references.
