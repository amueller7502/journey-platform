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
  ('odyssey', 'Odyssey / North Stars', 'active', 'Odyssey skin with IMAX 15/70 film cues, projection texture, and recognition leaderboard energy.', true, 'Opening signal card, recognition leaderboard, film grain, projection sweep, and 15/70 activation card', 'waves', 'immersive', 78, 64, 28, 58, 82, 68, 18, 'blockbuster', 'poster', 'filmstrip', '{"primary":"#050505","secondary":"#d8d8d8","accent":"#d71920"}', 2),
  ('dune_3', 'Dune 3', 'draft', 'Future activation skin slot for desert and premium event theming.', true, 'Draft concept', 'doodles', 'playful', 55, 80, 70, 72, 40, 48, 70, 'handbill', 'ticket', 'ticket-stub', '{"primary":"#050505","secondary":"#f4f4f4","accent":"#d71920"}', 3);

insert into public.experience_seasons (
  id,
  name,
  subtitle,
  season_label,
  season_title,
  starts_on,
  ends_on,
  community_xp_goal,
  welcome_message,
  tagline,
  hero_artwork_url,
  experience_card_artwork_url,
  skin_id,
  status,
  active,
  preview_enabled
) values (
  'chapter-one-odyssey',
  'Experience',
  'Employee Experience Platform',
  'Season One',
  'The Odyssey',
  '2026-07-16',
  '2026-08-12',
  15700,
  'Welcome to Experience. Recognize the moments that make Celebration Cinema North feel extraordinary.',
  'More Than A Movie Starts With Us.',
  '/brand/celebration-c-frame.png',
  '/brand/celebration-c-frame.png',
  'odyssey',
  'active',
  true,
  true
);

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
  'Experience',
  'Employee Experience Platform',
  '2026-07-16',
  '2026-08-12',
  15700,
  'Odyssey / North Stars / IMAX 1570',
  'More Than A Movie Starts With Us.',
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

insert into public.journey_card_areas (
  id,
  name,
  description,
  department_slugs,
  enabled,
  sort_order
) values
  (
    'floor_lobby',
    'Floor / Lobby',
    'Guest-facing lobby, auditorium reset, queue flow, wayfinding, and presentation tasks.',
    array['floor'],
    true,
    10
  ),
  (
    'concessions',
    'Concessions',
    'Line speed, stock readiness, guest handoffs, condiment stations, and rush support.',
    array['concessions'],
    true,
    20
  ),
  (
    'kitchen_oscars',
    'Kitchen / Oscar''s',
    'Food accuracy, kitchen reset, Oscar''s presentation, expo communication, and safe handoffs.',
    array['kitchen'],
    true,
    30
  ),
  (
    'box_guest_services',
    'Box Office / Guest Services',
    'Greeting, queue clarity, guest recovery, membership support, and calm problem solving.',
    array['box_office','guest_services'],
    true,
    40
  ),
  (
    'facilities_exterior',
    'Facilities / Exterior',
    'Restroom readiness, exterior walks, utility organization, and building-detail saves.',
    array['facilities'],
    true,
    50
  );

insert into public.recognition_standards (id, label, short_label, description, sort_order) values
  ('guest_welcome', 'Every Guest Feels Welcome', 'Guest Welcome', 'Warm greetings, helpful answers, and confident recoveries.', 1),
  ('space_exceptional', 'Every Space Looks Exceptional', 'Presentation', 'Clean, sharp, guest-ready spaces from curb to auditorium.', 2),
  ('crew_matters', 'Every Crew Member Matters', 'Teamwork', 'Support across stations, departments, and rush moments.', 3),
  ('shift_counts', 'Every Shift Counts', 'Reliability', 'Attendance, punctuality, coverage, and closing strong.', 4),
  ('detail_matters', 'Every Detail Matters', 'Details', 'Small choices that protect the premium cinema experience.', 5);

insert into public.experience_standards (
  id,
  season_id,
  label,
  short_label,
  description,
  sort_order
)
select
  id,
  'chapter-one-odyssey',
  label,
  short_label,
  description,
  sort_order
from public.recognition_standards;

insert into public.employees (
  id,
  app_id,
  department_id,
  full_name,
  initials,
  title,
  role,
  passport_id,
  passport_qr_url,
  journey_card_area_id,
  email,
  access_code,
  account_status,
  department_slug,
  current_xp,
  weekly_xp,
  active
) values
  ('33333333-3333-4333-8333-333333333301', 'emp-alex', '22222222-2222-4222-8222-222222222203', 'Alex Rivera', 'AR', 'Floor Crew', 'employee', 'ODY-1570-001', 'http://127.0.0.1:3000/manager/passport/ODY-1570-001', 'floor_lobby', 'alex.rivera@north.example', 'AR1570', 'active', 'floor', 660, 105, true),
  ('33333333-3333-4333-8333-333333333302', 'emp-maya', '22222222-2222-4222-8222-222222222202', 'Maya Thompson', 'MT', 'Concessions Crew', 'employee', 'ODY-1570-002', 'http://127.0.0.1:3000/manager/passport/ODY-1570-002', 'concessions', 'maya.thompson@north.example', 'MT1570', 'active', 'concessions', 590, 80, true),
  ('33333333-3333-4333-8333-333333333303', 'emp-eli', '22222222-2222-4222-8222-222222222201', 'Eli Brooks', 'EB', 'Guest Services', 'employee', 'ODY-1570-003', 'http://127.0.0.1:3000/manager/passport/ODY-1570-003', 'box_guest_services', 'eli.brooks@north.example', 'EB1570', 'invited', 'guest_services', 520, 65, true),
  ('33333333-3333-4333-8333-333333333304', 'emp-nora', '22222222-2222-4222-8222-222222222204', 'Nora Patel', 'NP', 'Box Office', 'employee', 'ODY-1570-004', 'http://127.0.0.1:3000/manager/passport/ODY-1570-004', 'box_guest_services', 'nora.patel@north.example', 'NP1570', 'active', 'box_office', 450, 70, true),
  ('33333333-3333-4333-8333-333333333305', 'emp-dante', '22222222-2222-4222-8222-222222222205', 'Dante Williams', 'DW', 'Facilities Crew', 'employee', 'ODY-1570-005', 'http://127.0.0.1:3000/manager/passport/ODY-1570-005', 'facilities_exterior', 'dante.williams@north.example', 'DW1570', 'active', 'facilities', 410, 0, true),
  ('33333333-3333-4333-8333-333333333306', 'mgr-jordan', '22222222-2222-4222-8222-222222222206', 'Jordan Ellis', 'JE', 'Shift Manager', 'manager', 'MGR-1570-001', 'http://127.0.0.1:3000/manager/passport/MGR-1570-001', 'floor_lobby', 'jordan.ellis@north.example', 'JE1570', 'active', 'leadership', 0, 0, true),
  ('33333333-3333-4333-8333-333333333307', 'admin-sam', '22222222-2222-4222-8222-222222222206', 'Sam Carter', 'SC', 'General Manager', 'admin', 'GM-1570-001', 'http://127.0.0.1:3000/manager/passport/GM-1570-001', 'floor_lobby', 'sam.carter@north.example', 'SC1570', 'active', 'leadership', 0, 0, true);

insert into public.profiles (
  id,
  full_name,
  email,
  status
) values
  ('99999999-9999-4999-8999-999999999901', 'Alex Rivera', 'alex.rivera@north.example', 'active'),
  ('99999999-9999-4999-8999-999999999902', 'Jordan Ellis', 'jordan.ellis@north.example', 'active'),
  ('99999999-9999-4999-8999-999999999903', 'Sam Carter', 'sam.carter@north.example', 'active');

insert into public.user_roles (
  profile_id,
  role,
  location,
  enabled
) values
  ('99999999-9999-4999-8999-999999999901', 'employee', 'Celebration Cinema North', true),
  ('99999999-9999-4999-8999-999999999902', 'leader', 'Celebration Cinema North', true),
  ('99999999-9999-4999-8999-999999999903', 'experience_designer', 'Celebration Cinema North', true);

insert into public.leadership_recognitions (
  id,
  leader_id,
  recognized_by,
  category,
  title,
  note,
  impact,
  created_at
) values
  ('77777777-7777-4777-8777-777777777701', '33333333-3333-4333-8333-333333333306', '33333333-3333-4333-8333-333333333307', 'Coaching', 'Calm rush coaching', 'Kept the concessions handoff calm during the evening rush and coached two newer crew members without slowing the line.', 'Improved crew confidence and protected guest pace.', '2026-07-24T21:20:00-04:00'),
  ('77777777-7777-4777-8777-777777777702', '33333333-3333-4333-8333-333333333306', '33333333-3333-4333-8333-333333333307', 'Coverage', 'Recognition coverage follow-through', 'Closed the loop on employees who had not been recognized this week and made the next shift plan clearer.', 'Reduced recognition gaps before the weekend.', '2026-07-23T18:15:00-04:00'),
  ('77777777-7777-4777-8777-777777777703', '33333333-3333-4333-8333-333333333306', '33333333-3333-4333-8333-333333333307', 'Communication', 'Clean manager handoff', 'Left a concise handoff on theater readiness, pending rewards, and Experience Card follow-up.', 'Helped the next leader start with less guesswork.', '2026-07-22T22:05:00-04:00');

insert into public.leadership_achievements (
  id,
  leader_id,
  title,
  description,
  status,
  earned_at
) values
  ('77777777-7777-4777-8777-777777777711', '33333333-3333-4333-8333-333333333306', 'Coverage Builder', 'Kept recognition coverage visible across departments for a full week.', 'earned', '2026-07-24T21:30:00-04:00'),
  ('77777777-7777-4777-8777-777777777712', '33333333-3333-4333-8333-333333333306', 'Coach on Floor', 'Logged three leadership recognitions tied to coaching or calm communication.', 'in_progress', null),
  ('77777777-7777-4777-8777-777777777713', '33333333-3333-4333-8333-333333333306', 'Handoff Standard', 'Build a consistent manager handoff rhythm for reward, recognition, and presentation work.', 'in_progress', null);

insert into public.leadership_rewards (
  id,
  name,
  description,
  status,
  fulfillment_notes,
  enabled,
  sort_order
) values
  ('77777777-7777-4777-8777-777777777721', 'Leadership Development Pick', 'Choose a leadership skill focus for the next one-on-one with the GM.', 'available', 'Scheduled through the GM, not purchased with employee XP.', true, 10),
  ('77777777-7777-4777-8777-777777777722', 'Manager Movie Night Host', 'Host a small crew recognition moment before a manager-approved screening.', 'scheduled', 'Requires GM approval and staffing coverage.', true, 20),
  ('77777777-7777-4777-8777-777777777723', 'Premium Handoff Badge', 'Recognition for clean shift communication and follow-through.', 'earned', 'Shown in Leadership Achievements instead of employee Rewards.', true, 30);

insert into public.leadership_point_rules (
  id,
  season_id,
  name,
  description,
  lp_value,
  category,
  requires_note,
  enabled,
  lifecycle,
  sort_order
) values
  ('lp-capture-specific-moment', 'chapter-one-odyssey', 'Capture specific Experience Moment', 'Leader captures a clear, behavior-based story for an employee.', 5, 'Coaching', true, true, 'published', 10),
  ('lp-close-coverage-gap', 'chapter-one-odyssey', 'Close recognition coverage gap', 'Leader recognizes an employee who was awaiting recognition.', 10, 'Coverage', true, true, 'published', 20),
  ('lp-clean-shift-handoff', 'chapter-one-odyssey', 'Clean shift handoff', 'Leader records a concise operational handoff that protects follow-through.', 8, 'Communication', true, true, 'published', 30);

insert into public.coaching_insights (
  id,
  leader_id,
  title,
  detail,
  action,
  priority
) values
  ('77777777-7777-4777-8777-777777777731', '33333333-3333-4333-8333-333333333306', 'Recognition gap on Facilities', 'Facilities has fewer recent employee moments than Floor and Concessions.', 'Ask the closing lead what presentation detail deserved recognition tonight.', 'High'),
  ('77777777-7777-4777-8777-777777777732', '33333333-3333-4333-8333-333333333306', 'Reward queue needs a handoff', 'Two requests are still awaiting manager review.', 'Approve, fulfill, or leave a clear note before the end-of-shift handoff.', 'Medium'),
  ('77777777-7777-4777-8777-777777777733', '33333333-3333-4333-8333-333333333306', 'Experience Card timing', 'Batch entry works best when completed before the final manager walk.', 'Collect turned-in cards before the last auditorium reset.', 'Low');

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
  ('employee', 'Employee', 'Home', '/home', 'Employee Experience home', true, true, 10),
  ('employee', 'Employee', 'My Experience', '/my-journey', 'Employee progress and history', true, true, 20),
  ('employee', 'Employee', 'Rewards', '/rewards', 'Rewards marketplace', true, true, 30),
  ('employee', 'Employee', 'Community', '/community', 'Community progress and recognition', true, true, 40),
  ('employee', 'Employee', 'Profile', '/profile', 'Employee profile and Experience Journal', true, true, 50),
  ('manager', 'Manager', 'Leadership Dashboard', '/leadership/dashboard', 'Leadership Experience home', true, true, 10),
  ('manager', 'Manager', 'Leadership Health', '/leadership/health', 'Leadership health snapshot', true, true, 20),
  ('manager', 'Manager', 'Leadership Journal', '/leadership/journal', 'Leadership recognition history', true, true, 30),
  ('manager', 'Manager', 'Achievements', '/leadership/achievements', 'Leadership achievement tracking', true, true, 40),
  ('manager', 'Manager', 'Leadership Recognition', '/leadership/recognition', 'Manager recognition without employee XP', true, true, 50),
  ('manager', 'Manager', 'Leadership Rewards', '/leadership/rewards', 'Leadership rewards without employee XP', true, true, 60),
  ('manager', 'Manager', 'Recognition Coverage', '/leadership/coverage', 'Employee recognition coverage', true, true, 70),
  ('manager', 'Manager', 'Coaching Insights', '/leadership/coaching', 'Coaching action guidance', true, true, 80),
  ('manager', 'Manager', 'Awaiting Recognition', '/leadership/awaiting-recognition', 'Employees awaiting recognition', true, true, 90),
  ('admin', 'Admin/GM', 'Command Center', '/admin/dashboard', 'GM overview', true, true, 10),
  ('admin', 'Admin/GM', 'Employees', '/admin/employees', 'Employee roster', true, true, 20),
  ('admin', 'Admin/GM', 'Seasons', '/admin/seasons', 'Season management', true, true, 30),
  ('admin', 'Admin/GM', 'Season Planner', '/admin/season-planner', 'Season planning and publishing', true, true, 40),
  ('admin', 'Admin/GM', 'Recognition', '/admin/recognition-library', 'Recognition type management', true, true, 50),
  ('admin', 'Admin/GM', 'Rewards', '/admin/rewards', 'Rewards editor', true, true, 60),
  ('admin', 'Admin/GM', 'Events', '/admin/events', 'Event engine', true, true, 70),
  ('admin', 'Admin/GM', 'Standards', '/admin/standards', 'Experience standards', true, true, 80),
  ('admin', 'Admin/GM', 'Leadership', '/admin/leadership', 'Leadership Studio', true, true, 90),
  ('admin', 'Admin/GM', 'Achievements', '/admin/achievements', 'Achievements Studio', true, true, 100),
  ('admin', 'Admin/GM', 'Displays', '/admin/displays', 'TV and display settings', true, true, 110),
  ('admin', 'Admin/GM', 'Scoring', '/admin/scoring', 'Experience scoring weights', true, true, 120),
  ('admin', 'Admin/GM', 'Launch Readiness', '/admin/launch-readiness', 'Operational launch checklist', true, true, 130),
  ('admin', 'Admin/GM', 'Reports', '/admin/analytics', 'Recognition reporting', true, true, 140),
  ('admin', 'Admin/GM', 'Experience Studio', '/admin/settings', 'Skins, menus, and display settings', true, true, 150),
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

update public.recognition_types
set app_id = slug
where app_id is null;

insert into public.experience_events (
  id,
  season_id,
  event_type,
  title,
  description,
  starts_at,
  ends_at,
  xp_modifier,
  eligible_recognition_type_ids,
  department_slugs,
  tv_announcement,
  banner,
  enabled,
  lifecycle,
  sort_order
) values
  ('event-todays-focus-lobby-readiness', 'chapter-one-odyssey', 'Today''s Focus', 'Lobby readiness before the rush', 'Recognize warm greetings, clear queues, clean sightlines, and confident guest answers before peak showtimes.', '2026-07-24T10:00:00-04:00', '2026-07-24T23:59:59-04:00', 1, array['lobby_excellence','guest_compliment'], array['floor','guest_services','box_office'], 'Today''s Focus: Lobby readiness before the rush.', 'Make the first five minutes feel effortless.', true, 'published', 10),
  ('event-community-challenge-imax', 'chapter-one-odyssey', 'Community Challenge', 'IMAX 15/70 presentation push', 'A community XP challenge for guest flow, auditorium resets, signage accuracy, and presentation details around premium shows.', '2026-07-25T00:00:00-04:00', '2026-07-27T23:59:59-04:00', 1.25, array['theater_excellence','digital_signage_excellence','imax_queue_excellence'], array['floor','guest_services','facilities'], 'Community Challenge: protect the premium IMAX experience.', 'Premium presentation earns bonus momentum.', true, 'published', 20),
  ('event-surprise-drop-rewards', 'chapter-one-odyssey', 'Surprise Drop', 'Collector reward drop', 'Feature collector and season-exclusive rewards on the TV loop to drive attention during the weekend.', '2026-07-26T14:00:00-04:00', '2026-07-26T20:00:00-04:00', 1, array[]::text[], array['guest_services','concessions','kitchen','floor','box_office','facilities'], 'Surprise Drop: check Rewards for collector items.', 'Limited rewards are live while inventory lasts.', true, 'published', 30);

insert into public.experience_display_slides (
  id,
  season_id,
  slide_type,
  label,
  headline,
  supporting_text,
  duration_seconds,
  show_on_tv,
  enabled,
  lifecycle,
  sort_order
) values
  ('display-community-xp', 'chapter-one-odyssey', 'Community XP', 'Community XP', '15,700 XP Starts With Daily Moments', 'Show progress toward the season goal without making recognition feel like a race.', 7, true, true, 'published', 10),
  ('display-todays-focus', 'chapter-one-odyssey', 'Today''s Focus', 'Today''s Focus', 'Lobby Readiness Before The Rush', 'Help leaders keep recognition connected to the shift''s most important behavior.', 7, true, true, 'published', 20),
  ('display-recognition-spotlight', 'chapter-one-odyssey', 'Recognition Spotlight', 'Recognition Spotlight', 'Moments That Mattered', 'Celebrate specific stories from the team, not just totals.', 8, true, true, 'published', 30),
  ('display-reward-spotlight', 'chapter-one-odyssey', 'Reward Spotlight', 'Reward Spotlight', 'Rewards Worth Earning', 'Rotate several curated rewards so employees can see what is available.', 8, true, true, 'published', 40),
  ('display-experience-score', 'chapter-one-odyssey', 'Experience Score', 'Experience Score', 'Culture Health At A Glance', 'A configurable composite of recognition coverage, presentation, and rewards health.', 7, false, true, 'draft', 50);

insert into public.display_settings (
  id,
  season_id,
  slide_type,
  label,
  headline,
  supporting_text,
  duration_seconds,
  show_on_tv,
  enabled,
  lifecycle,
  sort_order
)
select
  id,
  season_id,
  slide_type::text,
  label,
  headline,
  supporting_text,
  duration_seconds,
  show_on_tv,
  enabled,
  lifecycle,
  sort_order
from public.experience_display_slides;

insert into public.scoring_metrics (
  id,
  season_id,
  label,
  description,
  weight,
  target,
  current_value,
  enabled,
  lifecycle,
  sort_order
) values
  ('experience_score', 'chapter-one-odyssey', 'Experience Score', 'Overall culture health across recognition, rewards, presentation, and season progress.', 35, 90, 86, true, 'published', 10),
  ('leadership_health', 'chapter-one-odyssey', 'Leadership Health', 'Measures leader follow-through, coaching rhythm, coverage, and handoff quality.', 25, 85, 83, true, 'published', 20),
  ('presentation_score', 'chapter-one-odyssey', 'Presentation Score', 'Measures excellence checks and building presentation readiness.', 20, 92, 91, true, 'published', 30),
  ('recognition_coverage', 'chapter-one-odyssey', 'Recognition Coverage', 'Measures whether recognition is reaching the full team, not only frequent standouts.', 20, 88, 83, true, 'published', 40);

insert into public.scoring_settings (
  id,
  season_id,
  label,
  description,
  weight,
  target,
  current_value,
  enabled,
  lifecycle,
  sort_order
)
select
  id::text,
  season_id,
  label,
  description,
  weight,
  target,
  current_value,
  enabled,
  lifecycle,
  sort_order
from public.scoring_metrics;

insert into public.launch_readiness_items (
  id,
  season_id,
  label,
  owner,
  status,
  due_on,
  notes,
  enabled,
  lifecycle,
  sort_order
) values
  ('launch-season-configured', 'chapter-one-odyssey', 'Season configured', 'Experience Designer', 'ready', '2026-07-09', 'Season One: The Odyssey dates, goal, message, and skin are ready.', true, 'published', 10),
  ('launch-recognition-published', 'chapter-one-odyssey', 'Recognition published', 'Admin/GM', 'ready', '2026-07-09', 'Recognition and Experience Card task libraries are active.', true, 'published', 20),
  ('launch-rewards-published', 'chapter-one-odyssey', 'Rewards published', 'Admin/GM', 'ready', '2026-07-09', 'Rewards are grouped into curated collections and inventory thresholds are set.', true, 'published', 30),
  ('launch-events-scheduled', 'chapter-one-odyssey', 'Events scheduled', 'Experience Designer', 'in_progress', '2026-07-12', 'Opening focus is ready; finale and surprise drops need final approval.', true, 'published', 40),
  ('launch-cards-generated', 'chapter-one-odyssey', 'Experience Cards generated', 'Leader', 'in_progress', '2026-07-15', 'Print runs are available by employee and scheduled work area.', true, 'published', 50),
  ('launch-tv-configured', 'chapter-one-odyssey', 'TV configured', 'Experience Designer', 'ready', '2026-07-09', 'Slides, durations, and visibility are editable in Displays Studio.', true, 'published', 60),
  ('launch-employees-imported', 'chapter-one-odyssey', 'Employees imported', 'Admin/GM', 'in_progress', '2026-07-15', 'CSV/Excel import is available; final employee list still needs to be loaded.', true, 'published', 70),
  ('launch-auth-configured', 'chapter-one-odyssey', 'Authentication configured', 'Experience Designer', 'in_progress', '2026-07-15', 'Supabase Auth form is built; production users must be created in Supabase.', true, 'published', 80),
  ('launch-supabase-connected', 'chapter-one-odyssey', 'Supabase connected', 'Experience Designer', 'in_progress', '2026-07-15', 'Schema covers platform objects; environment variables control live persistence.', true, 'published', 90);

insert into public.experience_achievements (
  id,
  season_id,
  audience,
  title,
  description,
  collection,
  hidden,
  badge_image_url,
  criteria,
  enabled,
  lifecycle,
  sort_order
) values
  ('badge-first-moment', 'chapter-one-odyssey', 'employee', 'First Moment', 'Earned when an employee receives their first Experience Moment.', 'Season Badges', false, '/brand/celebration-c-frame.png', 'First published Experience Moment in the active season.', true, 'published', 10),
  ('badge-premium-presentation', 'chapter-one-odyssey', 'employee', 'Premium Presentation', 'Recognizes repeated presentation and detail moments.', 'Season Badges', false, '/brand/celebration-c-frame.png', 'Three presentation-related Experience Moments.', true, 'published', 20),
  ('badge-secret-recovery', 'chapter-one-odyssey', 'employee', 'Guest Recovery Signal', 'Hidden badge for an exceptional guest recovery story.', 'Hidden Achievements', true, '/brand/celebration-c-frame.png', 'Leader marks an Experience Moment as hidden-achievement eligible.', true, 'draft', 30),
  ('lead-achievement-coverage-builder', 'chapter-one-odyssey', 'leader', 'Coverage Builder', 'Leader kept recognition coverage visible across departments for a full week.', 'Leadership Achievements', false, '/brand/celebration-c-frame.png', 'Recognition coverage reaches the weekly target.', true, 'published', 40);

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
  ('55555555-5555-4555-8555-555555555501', '11111111-1111-4111-8111-111111111111', '$5 C Cash', 'A flexible Celebration Cinema thank-you for a strong shift.', 125, 18, '/brand/celebration-c-frame.png', 'Cinema', true, 10, 2, 'Manager confirms employee and issues C Cash voucher.', false),
  ('55555555-5555-4555-8555-555555555502', '11111111-1111-4111-8111-111111111111', 'Movie Pass', 'One employee movie pass for an Experience milestone.', 220, 12, '/brand/celebration-c-frame.png', 'Cinema', true, 20, 2, 'Issue as employee pass voucher.', true),
  ('55555555-5555-4555-8555-555555555503', '11111111-1111-4111-8111-111111111111', 'Crew Hoodie', 'Limited Odyssey activation apparel with premium red detail.', 500, 6, '/brand/celebration-c-frame.png', 'Gear', true, 30, 1, 'Confirm size before fulfillment.', false),
  ('55555555-5555-4555-8555-555555555504', '11111111-1111-4111-8111-111111111111', 'VIP Seat Package', 'Premium seat experience for two after an exceptional run.', 750, 3, '/brand/celebration-c-frame.png', 'Experience', true, 40, 1, 'GM approval before scheduling.', false);

update public.rewards
set app_id = case name
  when '$5 C Cash' then 'reward-c-cash-5'
  when 'Movie Pass' then 'reward-movie-ticket'
  when 'Crew Hoodie' then 'reward-quarter-zip'
  when 'VIP Seat Package' then 'reward-private-imax'
  else app_id
end
where app_id is null;

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
  'Experience Card verified after closing rush.',
  40,
  4,
  '2026-07-24 18:35:00-04'
);

insert into public.experience_cards (
  id,
  season_id,
  employee_id,
  journey_card_area_id,
  card_number,
  shift_date,
  status,
  printed_at,
  created_by
) values (
  '88888888-8888-4888-8888-888888888801',
  'chapter-one-odyssey',
  '33333333-3333-4333-8333-333333333301',
  'floor_lobby',
  'ODY-1570-001',
  '2026-07-24',
  'entered',
  '2026-07-24T15:00:00-04:00',
  '33333333-3333-4333-8333-333333333306'
);

insert into public.experience_card_batches (
  id,
  experience_card_id,
  recognition_batch_id,
  season_id,
  employee_id,
  manager_id,
  selected_recognition_type_ids,
  total_xp,
  shift_note,
  submitted_at
) values (
  '88888888-8888-4888-8888-888888888811',
  '88888888-8888-4888-8888-888888888801',
  '66666666-6666-4666-8666-666666666601',
  'chapter-one-odyssey',
  '33333333-3333-4333-8333-333333333301',
  '33333333-3333-4333-8333-333333333306',
  array['theater_excellence','help_another_department'],
  40,
  'Experience Card turned in after closing rush.',
  '2026-07-24T18:35:00-04:00'
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
