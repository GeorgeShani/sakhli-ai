-- High-Fidelity Demo Seed Data for SakhliAI

-- 1) Seed Auth & Public Users
-- Note: In a local development reset, we insert dummy users.
-- To bypass auth-referential constraints, we insert mock auth.users if needed,
-- or we populate public.users directly using pre-defined UUIDs that represent
-- our seed personas. This allows properties, bookings, and student profiles to exist.

-- We temporarily disable triggers or directly populate. Let's insert into auth.users (if possible in Supabase migrations)
-- or we can mock it directly. In Supabase migrations, we can insert into auth.users.
-- Let's populate auth.users with 5 students and 2 hosts so they can log in or they represent active profiles.

INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'nino@sakliai.ge', '{"full_name": "Nino K."}'),
  ('00000000-0000-0000-0000-000000000002', 'giorgi@sakliai.ge', '{"full_name": "Giorgi M."}'),
  ('00000000-0000-0000-0000-000000000003', 'ana@sakliai.ge', '{"full_name": "Ana B."}'),
  ('00000000-0000-0000-0000-000000000101', 'host.giorgi@sakliai.ge', '{"full_name": "Giorgi (Host)"}'),
  ('00000000-0000-0000-0000-000000000102', 'host.salome@sakliai.ge', '{"full_name": "Salome (Host)"}')
ON CONFLICT (id) DO NOTHING;

-- Trigger public.handle_new_user automatically populates public.profiles and public.users upon insertion in auth.users.
-- Just to be safe, let's update their roles and plans if necessary.
UPDATE public.users SET role = 'student', plan = 'free' WHERE id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');
UPDATE public.users SET role = 'host', plan = 'plus' WHERE id IN ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000102');

UPDATE public.profiles SET role = 'student' WHERE id IN ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000003');
UPDATE public.profiles SET role = 'host' WHERE id IN ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000102');

-- 2) Seed Properties
INSERT INTO public.properties (id, host_id, title, description, city, address, bedrooms, bathrooms, price_per_night, price_per_month, listing_type, amenities, image_url)
VALUES
  (
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000101',
    'Sunny 3BR near Vake Park',
    'Literature major study hub. Sunny 3-bedroom flat steps from Vake Park. Bright living room, modern kitchen, and individual balconies. Highly recommended for students who value quiet hours.',
    'Tbilisi',
    'Chavchavadze Ave, near Vake Park',
    3, 2,
    75.00, 2100.00,
    'hybrid',
    ARRAY['Wi-Fi', 'Washer', 'Balcony', 'Heating'],
    'https://images.unsplash.com/photo-11554995207-c18c203602cb'
  ),
  (
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000101',
    'Modern Loft in Saburtalo',
    'CS and Business Student retreat. Spacious industrial loft with double-height ceiling, fully-equipped study bar, secure elevator access, and private underground parking. 5 minutes walk from GTU.',
    'Tbilisi',
    'Pekini Ave, near GTU',
    2, 1,
    60.00, 1700.00,
    'hybrid',
    ARRAY['Wi-Fi', 'Elevator', 'Gym', 'Parking', 'AC'],
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688'
  ),
  (
    '00000000-0000-0000-0000-000000000203',
    '00000000-0000-0000-0000-000000000102',
    'Cozy Renovated Apartment, Old Tbilisi',
    'Historic tourist and student loft. Featuring beautiful timber framing, brick interior walls, pet-friendly yard, and premium smart entryway lock. 3 minutes from Sololaki bars.',
    'Tbilisi',
    'Betlemi St, Sololaki',
    2, 1,
    80.00, 1400.00,
    'hybrid',
    ARRAY['Wi-Fi', 'Balcony', 'Pet friendly', 'Smart lock', 'Heating'],
    'https://images.unsplash.com/photo-1493809842364-78817add7ffb'
  ),
  (
    '00000000-0000-0000-0000-000000000206',
    '00000000-0000-0000-0000-000000000101',
    'AI Pick · Premium 2BR near TSU',
    'AI-curated premium student hybrid flat. South-facing living room, in-unit laundry, and custom soundproof insulation. Optimized by SakhliAI algorithms for 90%+ flatmate compatibility.',
    'Tbilisi',
    '12 Chavchavadze Ave, Vake, Tbilisi 0179',
    2, 1,
    70.00, 1800.00,
    'hybrid',
    ARRAY['Wi-Fi', 'Washer', 'Dishwasher', 'Heating', 'AC', 'Balcony'],
    'https://images.unsplash.com/photo-1505691938895-1758d7feb511'
  )
ON CONFLICT (id) DO NOTHING;

-- 3) Seed Student Profiles
INSERT INTO public.student_profiles (id, user_id, display_name, university, budget_min, budget_max, sleep_schedule, cleanliness, smoking, pets, bio, city, languages, salary_bracket, income_source)
VALUES
  (
    '00000000-0000-0000-0000-000000000301',
    '00000000-0000-0000-0000-000000000001',
    'Nino K.',
    'Tbilisi State University',
    500, 800,
    'night_owl',
    4,
    false, true,
    'Literature major, tea addict, very tidy. Looking for a calm, quiet flat in Vake near TSU to read and foster matching flatmates.',
    'Tbilisi',
    ARRAY['Georgian', 'English'],
    '500_1000',
    'family'
  ),
  (
    '00000000-0000-0000-0000-000000000302',
    '00000000-0000-0000-0000-000000000002',
    'Giorgi M.',
    'Free University of Tbilisi',
    700, 1000,
    'early_bird',
    3,
    false, false,
    'CS student & part-time barista. I cook a lot and occasionally host study groups or friends on weekend afternoons.',
    'Tbilisi',
    ARRAY['Georgian', 'English', 'German'],
    '1000_2000',
    'job'
  ),
  (
    '00000000-0000-0000-0000-000000000303',
    '00000000-0000-0000-0000-000000000003',
    'Ana B.',
    'Ilia State University',
    500, 700,
    'flexible',
    5,
    false, false,
    'Med student. Quiet, highly organized, allergic to cats. Prefers Saburtalo flats near metro stations.',
    'Tbilisi',
    ARRAY['Georgian', 'English', 'Russian'],
    '500_1000',
    'scholarship'
  )
ON CONFLICT (id) DO NOTHING;

-- 4) Seed Bookings
INSERT INTO public.bookings (id, property_id, guest_id, guest_name, channel, booking_type, check_in, check_out, status, total_price, guests_count, notes)
VALUES
  (
    '00000000-0000-0000-0000-000000000401',
    '00000000-0000-0000-0000-000000000201',
    '00000000-0000-0000-0000-000000000001',
    'Nino K.',
    'student',
    'student',
    '2026-06-01', '2027-06-01',
    'confirmed',
    2100.00, 1,
    'Long-term student lease. Paid deposit.'
  ),
  (
    '00000000-0000-0000-0000-000000000402',
    '00000000-0000-0000-0000-000000000202',
    NULL,
    'Lars Petersen',
    'airbnb',
    'short_term',
    '2026-06-15', '2026-06-22',
    'confirmed',
    420.00, 2,
    'Tourist checkout turnover sync enabled.'
  )
ON CONFLICT (id) DO NOTHING;

-- 5) Seed Cleaning Tasks
INSERT INTO public.cleaning_tasks (id, property_id, booking_id, cleaner_id, cleaner_name, cleaner_phone, scheduled_for, status, notes, notified_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000501',
    '00000000-0000-0000-0000-000000000202',
    '00000000-0000-0000-0000-000000000402',
    NULL,
    'Keto Alavidze',
    '+995 599 123 456',
    '2026-06-22T11:00:00Z',
    'assigned',
    'Clean linens, restock soap, leave guest welcome snack.',
    '2026-06-14T09:00:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- 6) Seed Channel Sync Rules
INSERT INTO public.channel_sync (id, property_id, channel, enabled, status, last_synced_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000601',
    '00000000-0000-0000-0000-000000000201',
    'airbnb',
    true,
    'synced',
    '2026-06-14T10:30:00Z'
  ),
  (
    '00000000-0000-0000-0000-000000000602',
    '00000000-0000-0000-0000-000000000202',
    'booking',
    true,
    'synced',
    '2026-06-14T11:45:00Z'
  )
ON CONFLICT (id) DO NOTHING;

-- 7) Seed Agent Events Feed
INSERT INTO public.agent_events (id, kind, source, title_en, title_ka, detail_en, detail_ka, created_at)
VALUES
  (
    '00000000-0000-0000-0000-000000000701',
    'match', 'agent',
    'New compatible match found',
    'ახალი თავსებადი მატჩი',
    'Scored 94% flatmate fit in Vake near TSU — sleep schedules and cleanliness index match.',
    '94% თავსებადობის ინდექსი ვაკეში — ძილის რეჟიმი და სისუფთავე ემთხვევა.',
    now() - INTERVAL '2 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000702',
    'sync', 'n8n',
    'Airbnb and Booking.com synced',
    'არხები სინქრონიზდა',
    'Property calendars synchronized successfully. Verified zero double bookings.',
    'ბინების კალენდრები წარმატებით სინქრონიზდა n8n-ით. ორმაგი ჯავშნები აცილებულია.',
    now() - INTERVAL '4 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000703',
    'screen', 'agent',
    'Applicant screened',
    'აპლიკანტი შემოწმდა',
    'TSU Med student verified. Estimated financial safety rating is "ideal".',
    'თსუ მედიცინის სტუდენტი შემოწმდა. ფინანსური უსაფრთხოების რეიტინგი: "იდეალური".',
    now() - INTERVAL '5 hours'
  ),
  (
    '00000000-0000-0000-0000-000000000704',
    'cleaning', 'n8n',
    'Cleaning task scheduled',
    'დასუფთავება დაინიშნა',
    'Turnover assigned to cleaner Keto for Checkout on June 22.',
    'ავტომატურად დაიგეგმა დასუფთავება 22 ივნისის გასვლაზე. შემსრულებელი: ქეთო.',
    now() - INTERVAL '1 day'
  );
