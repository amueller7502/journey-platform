insert into public.skins (
  id,
  name,
  status,
  description,
  can_disable,
  tv_treatment,
  pattern_style,
  background_mode,
  animation_intensity,
  fun_level,
  doodle_density,
  marquee_speed,
  projector_sweep,
  float_amplitude,
  confetti_level,
  title_treatment,
  card_treatment,
  frame_style,
  palette,
  sort_order
) values
  ('standard', 'Cinema Standard', 'available', 'Clean black, white, gray, and Celebration red base system.', false, 'Standard recognition loop', 'film', 'clean', 30, 20, 10, 35, 45, 20, 0, 'clean', 'flat', 'standard', '{"primary":"#050505","secondary":"#ffffff","accent":"#d71920"}', 1),
  ('odyssey', 'Odyssey / North Stars', 'active', 'Odyssey skin with IMAX 15/70 film cues, projection texture, and recognition leaderboard energy.', true, 'Opening signal card, recognition leaderboard, film grain, projection sweep, and 15/70 chapter card', 'waves', 'immersive', 78, 64, 28, 58, 82, 68, 18, 'blockbuster', 'poster', 'filmstrip', '{"primary":"#050505","secondary":"#d8d8d8","accent":"#d71920"}', 2),
  ('dune_3', 'Dune 3', 'draft', 'Future chapter skin slot for desert and premium event theming.', true, 'Draft concept', 'doodles', 'playful', 55, 80, 70, 72, 40, 48, 70, 'handbill', 'ticket', 'ticket-stub', '{"primary":"#050505","secondary":"#f4f4f4","accent":"#d71920"}', 3);

insert into public.chapters (
  id,
  name,
  subtitle,
  starts_on,
  ends_on,
  community_goal_miles,
  theme_label,
  visual_tagline,
  theme_note,
  status
) values (
  '11111111-1111-4111-8111-111111111111',
  'The Journey',
  'Chapter One: The Odyssey',
  '2026-07-16',
  '2026-08-12',
  15700,
  'Odyssey / North Stars / IMAX 1570',
  'Every Mile Matters',
  'Inspired by IMAX 1570 film',
  'active'
);

insert into public.chapter_skin_settings (
  chapter_id,
  skin_id,
  skin_enabled,
  fallback_skin_id
) values (
  '11111111-1111-4111-8111-111111111111',
  'odyssey',
  true,
  'standard'
);

insert into public.departments (id, slug, name, goal_miles, sort_order) values
  ('22222222-2222-4222-8222-222222222201', 'guest_services', 'Guest Services', 3300, 1),
  ('22222222-2222-4222-8222-222222222202', 'concessions', 'Concessions', 3600, 2),
  ('22222222-2222-4222-8222-222222222203', 'floor', 'Floor', 4000, 3),
  ('22222222-2222-4222-8222-222222222204', 'box_office', 'Box Office', 2400, 4),
  ('22222222-2222-4222-8222-222222222205', 'facilities', 'Facilities', 1800, 5),
  ('22222222-2222-4222-8222-222222222206', 'leadership', 'Leadership', 600, 6);

insert into public.recognition_standards (id, label, short_label, description, sort_order) values
  ('guest_welcome', 'Every Guest Feels Welcome', 'Guest Welcome', 'Warm greetings, helpful answers, and confident recoveries.', 1),
  ('space_exceptional', 'Every Space Looks Exceptional', 'Presentation', 'Clean, sharp, guest-ready spaces from curb to auditorium.', 2),
  ('crew_matters', 'Every Crew Member Matters', 'Teamwork', 'Support across stations, departments, and rush moments.', 3),
  ('shift_counts', 'Every Shift Counts', 'Reliability', 'Attendance, punctuality, coverage, and closing strong.', 4),
  ('detail_matters', 'Every Detail Matters', 'Details', 'Small choices that protect the premium cinema experience.', 5);

insert into public.employees (
  id,
  department_id,
  full_name,
  initials,
  title,
  role,
  passport_id,
  passport_qr_url,
  active
) values
  ('33333333-3333-4333-8333-333333333301', '22222222-2222-4222-8222-222222222203', 'Alex Rivera', 'AR', 'Floor Crew', 'employee', 'ODY-1570-001', 'http://127.0.0.1:3000/manager/passport/ODY-1570-001', true),
  ('33333333-3333-4333-8333-333333333302', '22222222-2222-4222-8222-222222222202', 'Maya Thompson', 'MT', 'Concessions Crew', 'employee', 'ODY-1570-002', 'http://127.0.0.1:3000/manager/passport/ODY-1570-002', true),
  ('33333333-3333-4333-8333-333333333303', '22222222-2222-4222-8222-222222222201', 'Eli Brooks', 'EB', 'Guest Services', 'employee', 'ODY-1570-003', 'http://127.0.0.1:3000/manager/passport/ODY-1570-003', true),
  ('33333333-3333-4333-8333-333333333304', '22222222-2222-4222-8222-222222222204', 'Nora Patel', 'NP', 'Box Office', 'employee', 'ODY-1570-004', 'http://127.0.0.1:3000/manager/passport/ODY-1570-004', true),
  ('33333333-3333-4333-8333-333333333305', '22222222-2222-4222-8222-222222222205', 'Dante Williams', 'DW', 'Facilities Crew', 'employee', 'ODY-1570-005', 'http://127.0.0.1:3000/manager/passport/ODY-1570-005', true),
  ('33333333-3333-4333-8333-333333333306', '22222222-2222-4222-8222-222222222206', 'Jordan Ellis', 'JE', 'Shift Manager', 'manager', 'MGR-1570-001', 'http://127.0.0.1:3000/manager/passport/MGR-1570-001', true),
  ('33333333-3333-4333-8333-333333333307', '22222222-2222-4222-8222-222222222206', 'Sam Carter', 'SC', 'General Manager', 'admin', 'GM-1570-001', 'http://127.0.0.1:3000/manager/passport/GM-1570-001', true);

insert into public.menu_items (
  role,
  area,
  label,
  href,
  purpose,
  enabled,
  reusable,
  sort_order
) values
  ('employee', 'Employee', 'Home', '/home', 'Employee-facing chapter experience', true, true, 10),
  ('employee', 'Employee', 'My Journey', '/my-journey', 'Employee progress and history', true, true, 20),
  ('employee', 'Employee', 'Trading Post', '/trading-post', 'Rewards marketplace', true, true, 30),
  ('employee', 'Employee', 'Community', '/community', 'Community progress and recognition', true, true, 40),
  ('employee', 'Employee', 'Profile', '/profile', 'Employee profile and journey journal', true, true, 50),
  ('manager', 'Manager', 'Recognize Employee', '/manager/recognize', 'Manager recognition entry', true, true, 10),
  ('manager', 'Manager', 'Passport Entry', '/manager/passport', 'Crew passport batch entry', true, true, 20),
  ('manager', 'Manager', 'Excellence Checks', '/manager/excellence-checks', 'Presentation verification', true, true, 30),
  ('manager', 'Manager', 'Pending Rewards', '/manager/pending-rewards', 'Reward review queue', true, true, 40),
  ('manager', 'Manager', 'Daily Spotlight', '/manager/daily-spotlight', 'Recognition spotlight control', true, true, 50),
  ('manager', 'Manager', 'Recognition Feed', '/manager/recognition-feed', 'Manager feed review', true, true, 60),
  ('admin', 'Admin/GM', 'Dashboard', '/admin/dashboard', 'GM overview', true, true, 10),
  ('admin', 'Admin/GM', 'Employees', '/admin/employees', 'Employee roster', true, true, 20),
  ('admin', 'Admin/GM', 'Recognition Library', '/admin/recognition-library', 'Recognition type management', true, true, 30),
  ('admin', 'Admin/GM', 'Rewards / Inventory', '/admin/rewards', 'Trading Post editor', true, true, 40),
  ('admin', 'Admin/GM', 'Passports', '/admin/passports', 'Passport card management', true, true, 50),
  ('admin', 'Admin/GM', 'Recognition Analytics', '/admin/analytics', 'Recognition reporting', true, true, 60),
  ('admin', 'Admin/GM', 'Settings', '/admin/settings', 'Skins, menus, and display settings', true, true, 70),
  ('admin', 'Admin/GM', 'Chapter Management', '/admin/chapters', 'Chapter setup and scheduling', true, true, 80),
  (null, 'Utility', 'TV Display', '/tv', 'Shared display mode', true, true, 10),
  (null, 'Utility', 'Welcome', '/', 'Role selection and launch', true, true, 20);

insert into public.recognition_types (
  id,
  slug,
  chapter_id,
  name,
  description,
  category,
  standard_id,
  miles_value,
  icon,
  enabled,
  requires_manager_verification,
  sort_order,
  kind
) values
  ('44444444-4444-4444-8444-444444440001', 'bathroom_excellence', '11111111-1111-4111-8111-111111111111', 'Bathroom Excellence', 'Restrooms are clean, stocked, odor-free, and guest-ready.', 'Excellence Check', 'space_exceptional', 10, 'BadgeCheck', true, true, 10, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440002', 'lobby_excellence', '11111111-1111-4111-8111-111111111111', 'Lobby Excellence', 'Lobby presentation is sharp, clear, and welcoming.', 'Excellence Check', 'space_exceptional', 10, 'Clapperboard', true, true, 20, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440003', 'theater_excellence', '11111111-1111-4111-8111-111111111111', 'Theater Excellence', 'Auditorium reset meets opening standard between shows.', 'Excellence Check', 'space_exceptional', 10, 'Film', true, true, 30, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440004', 'bib_excellence', '11111111-1111-4111-8111-111111111111', 'BIB Excellence', 'BIB area is organized, clean, and ready for rush.', 'Excellence Check', 'detail_matters', 10, 'Gauge', true, true, 40, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440005', 'oscars_excellence', '11111111-1111-4111-8111-111111111111', 'Oscar''s Excellence', 'Oscar''s area is stocked, reset, and premium-presented.', 'Excellence Check', 'detail_matters', 10, 'Award', true, true, 50, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440006', 'concession_excellence', '11111111-1111-4111-8111-111111111111', 'Concession Excellence', 'Counters, service line, and backbar are clean and ready.', 'Excellence Check', 'detail_matters', 10, 'Store', true, true, 60, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440007', 'utility_excellence', '11111111-1111-4111-8111-111111111111', 'Utility Excellence', 'Utility spaces are organized and service-safe.', 'Excellence Check', 'space_exceptional', 10, 'ClipboardCheck', true, true, 70, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440008', 'exterior_excellence', '11111111-1111-4111-8111-111111111111', 'Exterior Excellence', 'Exterior entry points look clean, safe, and welcoming.', 'Excellence Check', 'space_exceptional', 10, 'Route', true, true, 80, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440009', 'digital_signage_excellence', '11111111-1111-4111-8111-111111111111', 'Digital Signage Excellence', 'Digital boards and guest-facing signage are accurate.', 'Excellence Check', 'detail_matters', 10, 'MonitorPlay', true, true, 90, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440010', 'imax_queue_excellence', '11111111-1111-4111-8111-111111111111', 'IMAX Queue Excellence', 'IMAX 15/70 guest flow feels clear, calm, and premium.', 'Excellence Check', 'guest_welcome', 10, 'Film', true, true, 100, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440011', 'parking_lot_exterior_walk', '11111111-1111-4111-8111-111111111111', 'Parking Lot / Exterior Walk', 'Exterior walk-through completed and issues escalated.', 'Excellence Check', 'space_exceptional', 10, 'Route', true, true, 110, 'excellence_check'),
  ('44444444-4444-4444-8444-444444440101', 'guest_compliment', '11111111-1111-4111-8111-111111111111', 'Guest Compliment', 'A guest specifically complimented the employee''s service.', 'Guest Experience', 'guest_welcome', 20, 'Sparkles', true, true, 200, 'guest_experience'),
  ('44444444-4444-4444-8444-444444440102', 'survey_mention', '11111111-1111-4111-8111-111111111111', 'Survey Mention', 'Employee was named in a guest survey or written response.', 'Guest Experience', 'guest_welcome', 50, 'Megaphone', true, true, 210, 'guest_experience'),
  ('44444444-4444-4444-8444-444444440103', 'guest_recovery', '11111111-1111-4111-8111-111111111111', 'Guest Recovery', 'Employee turned a service issue into a stronger guest moment.', 'Guest Experience', 'guest_welcome', 40, 'HandHeart', true, true, 220, 'guest_experience'),
  ('44444444-4444-4444-8444-444444440201', 'help_another_department', '11111111-1111-4111-8111-111111111111', 'Help Another Department', 'Employee stepped across station lines to support the operation.', 'Teamwork', 'crew_matters', 15, 'Users', true, true, 300, 'teamwork'),
  ('44444444-4444-4444-8444-444444440202', 'coworker_recognition', '11111111-1111-4111-8111-111111111111', 'Coworker Recognition', 'Crew member was recognized for making another teammate stronger.', 'Teamwork', 'crew_matters', 15, 'Users', true, true, 310, 'teamwork'),
  ('44444444-4444-4444-8444-444444440301', 'picked_up_shift', '11111111-1111-4111-8111-111111111111', 'Picked Up Shift', 'Employee picked up coverage when the building needed it.', 'Reliability', 'shift_counts', 40, 'CalendarDays', true, true, 400, 'reliability'),
  ('44444444-4444-4444-8444-444444440302', 'stayed_late', '11111111-1111-4111-8111-111111111111', 'Stayed Late', 'Employee stayed late to finish the guest or crew handoff well.', 'Reliability', 'shift_counts', 20, 'Gauge', true, true, 410, 'reliability'),
  ('44444444-4444-4444-8444-444444440303', 'perfect_attendance_weekly', '11111111-1111-4111-8111-111111111111', 'Perfect Attendance Weekly', 'Weekly attendance was clean and dependable.', 'Reliability', 'shift_counts', 30, 'CalendarDays', true, true, 420, 'reliability'),
  ('44444444-4444-4444-8444-444444440304', 'weekend_warrior', '11111111-1111-4111-8111-111111111111', 'Weekend Warrior', 'Employee showed up strong during weekend volume.', 'Reliability', 'shift_counts', 40, 'Award', true, true, 430, 'reliability'),
  ('44444444-4444-4444-8444-444444440305', 'perfect_punctuality_weekly', '11111111-1111-4111-8111-111111111111', 'Perfect Punctuality Weekly', 'Employee clocked in on time and ready for every shift this week.', 'Reliability', 'shift_counts', 20, 'Gauge', true, true, 440, 'reliability'),
  ('44444444-4444-4444-8444-444444440401', 'manager_above_beyond', '11111111-1111-4111-8111-111111111111', 'Manager Above & Beyond', 'Manager-awarded recognition for uncommon ownership or detail.', 'Manager Award', 'detail_matters', 50, 'Award', true, true, 500, 'detail');

insert into public.rewards (
  id,
  chapter_id,
  name,
  description,
  miles_cost,
  inventory_count,
  image_url,
  category,
  enabled,
  sort_order,
  redemption_limit_per_employee,
  fulfillment_notes,
  spotlight
) values
  ('55555555-5555-4555-8555-555555555501', '11111111-1111-4111-8111-111111111111', 'Popcorn Combo', 'A classic break-room favorite for a strong shift.', 120, 18, '/brand/celebration-c-frame.png', 'Food', true, 10, 2, 'Manager hands off at end of shift.', false),
  ('55555555-5555-4555-8555-555555555502', '11111111-1111-4111-8111-111111111111', 'Movie Pass', 'One employee movie pass for a Journey mile marker.', 220, 12, '/brand/celebration-c-frame.png', 'Cinema', true, 20, 2, 'Issue as employee pass voucher.', true),
  ('55555555-5555-4555-8555-555555555503', '11111111-1111-4111-8111-111111111111', 'Crew Hoodie', 'Limited Chapter One apparel with premium red detail.', 500, 6, '/brand/celebration-c-frame.png', 'Gear', true, 30, 1, 'Confirm size before fulfillment.', false),
  ('55555555-5555-4555-8555-555555555504', '11111111-1111-4111-8111-111111111111', 'VIP Seat Package', 'Premium seat experience for two after an exceptional run.', 750, 3, '/brand/celebration-c-frame.png', 'Experience', true, 40, 1, 'GM approval before scheduling.', false);

insert into public.recognition_batches (
  id,
  chapter_id,
  employee_id,
  manager_id,
  source,
  note,
  total_miles,
  item_count,
  created_at
) values (
  '66666666-6666-4666-8666-666666666601',
  '11111111-1111-4111-8111-111111111111',
  '33333333-3333-4333-8333-333333333301',
  '33333333-3333-4333-8333-333333333306',
  'passport',
  'Passport verified after closing rush.',
  40,
  4,
  '2026-07-24 18:35:00-04'
);

insert into public.recognition_records (
  id,
  batch_id,
  chapter_id,
  employee_id,
  manager_id,
  recognition_type_id,
  standard_id,
  miles,
  note,
  spotlight,
  created_at
) values
  ('77777777-7777-4777-8777-777777777701', '66666666-6666-4666-8666-666666666601', '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333301', '33333333-3333-4333-8333-333333333306', '44444444-4444-4444-8444-444444440003', 'space_exceptional', 10, 'Auditorium 7 was reset to opening standard between sold-out shows.', true, '2026-07-24 18:30:00-04'),
  ('77777777-7777-4777-8777-777777777702', null, '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333302', '33333333-3333-4333-8333-333333333306', '44444444-4444-4444-8444-444444440101', 'guest_welcome', 20, 'A guest called out the quick refill and warm handoff during rush.', false, '2026-07-24 17:10:00-04'),
  ('77777777-7777-4777-8777-777777777703', null, '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333303', '33333333-3333-4333-8333-333333333306', '44444444-4444-4444-8444-444444440103', 'guest_welcome', 40, 'Resolved a seating issue calmly and kept the group excited for the show.', false, '2026-07-24 15:45:00-04'),
  ('77777777-7777-4777-8777-777777777704', null, '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333304', '33333333-3333-4333-8333-333333333306', '44444444-4444-4444-8444-444444440305', 'shift_counts', 20, 'Perfect clock-in timing for the week and clean station starts.', false, '2026-07-23 21:00:00-04'),
  ('77777777-7777-4777-8777-777777777705', null, '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333305', '33333333-3333-4333-8333-333333333306', '44444444-4444-4444-8444-444444440008', 'space_exceptional', 10, 'Front entry looked sharp before the evening set.', false, '2026-07-16 19:20:00-04');

insert into public.reward_redemptions (
  id,
  chapter_id,
  employee_id,
  reward_id,
  status,
  requested_at
) values
  ('88888888-8888-4888-8888-888888888801', '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333301', '55555555-5555-4555-8555-555555555502', 'requested', '2026-07-24 14:15:00-04'),
  ('88888888-8888-4888-8888-888888888802', '11111111-1111-4111-8111-111111111111', '33333333-3333-4333-8333-333333333304', '55555555-5555-4555-8555-555555555501', 'requested', '2026-07-24 12:40:00-04');

insert into public.daily_spotlights (
  chapter_id,
  recognition_record_id,
  spotlight_on,
  created_by
) values (
  '11111111-1111-4111-8111-111111111111',
  '77777777-7777-4777-8777-777777777701',
  '2026-07-24',
  '33333333-3333-4333-8333-333333333306'
);

insert into public.tv_display_settings (
  chapter_id,
  seconds_per_panel,
  show_recognition_leaderboard
) values (
  '11111111-1111-4111-8111-111111111111',
  7,
  true
);
