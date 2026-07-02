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
- Replaced the old Odyssey TV race concept with a recognition leaderboard available to employees, managers, Admin/GM users, and TV mode.
- Replaced demo labeling with a configurable-build indicator.
- Added configurable employee roster management, Journey Card ID editing, live recognition/excellence check editing, reward editing, and Skin Developer controls.
- Added browser-saved configurable state for Chapter One settings.
- Added CSV/XLSX account import, employee delete, richer Skin Developer controls, TV slide controls, daily printable Journey Card checklists, reward photo uploads, and dedicated profile photo approvals.
- Added Manager Shift Dashboard, multi-prize TV Reward Spotlight, reward request/approve/fulfill workflow, and Supabase operating-state persistence.

## Known Issues

- Configurable actions use browser-local fallback and can sync operating state to Supabase when service-role environment variables are configured.
- Login is role selection, not production authentication.
- Journey Moments still use browser event storage for the live TV feed; normalized per-action Supabase writes remain a hardening step.
- TV mode remains community-first while including the configurable Recognition Leaderboard slide.
- Restart local preview after rebuilding before recapturing screenshots, or the browser may hold stale chunk references.
