-- High-Fidelity Demo Seed Data for SakhliAI (Realistic Edition)

-- 1) Seed Auth & Public Users
-- Genuine randomized v4 UUIDs represent our real Tbilisi-based personas.
-- Users register at BTU, Caucasus University, TSU, Ilia State University, etc.

INSERT INTO auth.users (id, email, raw_user_meta_data)
VALUES
  ('c3c72b22-1d54-47c4-be9e-05a8d9a24cf5', 'nino.kobakhidze.1@student.tsu.edu.ge', '{"full_name": "Nino Kobakhidze"}'),
  ('8f07d242-4f30-4e36-a36c-2f928e3b09de', 'g.meladze@freeuni.edu.ge', '{"full_name": "Giorgi Meladze"}'),
  ('e7bda306-03f8-47bc-87bd-d922a1b9f71c', 'ana.baramidze.2@iliauni.edu.ge', '{"full_name": "Ana Baramidze"}'),
  ('a7d8c366-2675-4d7a-8533-3176d65427bf', 'g.margvelashvili@gmail.com', '{"full_name": "Giorgi Margvelashvili"}'),
  ('5c34e622-0941-4cf1-8302-60126788220d', 'salome.gelashvili@yahoo.com', '{"full_name": "Salome Gelashvili"}')
ON CONFLICT (id) DO NOTHING;

-- Map roles & plans
UPDATE public.users SET role = 'student', plan = 'free' WHERE id IN ('c3c72b22-1d54-47c4-be9e-05a8d9a24cf5', '8f07d242-4f30-4e36-a36c-2f928e3b09de', 'e7bda306-03f8-47bc-87bd-d922a1b9f71c');
UPDATE public.users SET role = 'host', plan = 'plus' WHERE id IN ('a7d8c366-2675-4d7a-8533-3176d65427bf', '5c34e622-0941-4cf1-8302-60126788220d');

UPDATE public.profiles SET role = 'student' WHERE id IN ('c3c72b22-1d54-47c4-be9e-05a8d9a24cf5', '8f07d242-4f30-4e36-a36c-2f928e3b09de', 'e7bda306-03f8-47bc-87bd-d922a1b9f71c');
UPDATE public.profiles SET role = 'host' WHERE id IN ('a7d8c366-2675-4d7a-8533-3176d65427bf', '5c34e622-0941-4cf1-8302-60126788220d');

-- 2) Seed Properties
INSERT INTO public.properties (id, host_id, title, description, city, address, bedrooms, bathrooms, price_per_night, price_per_month, listing_type, amenities, image_url)
VALUES
  (
    '1e9dc85b-0cf5-4428-bc84-934c22b10201',
    'a7d8c366-2675-4d7a-8533-3176d65427bf',
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
    'e3d23190-671c-4e8c-8f3b-fb5c6cd80202',
    'a7d8c366-2675-4d7a-8533-3176d65427bf',
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
    'a4d29a5d-4f11-4475-b6d4-8fcb78c80203',
    '5c34e622-0941-4cf1-8302-60126788220d',
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
    'c4b1263d-4952-475a-a309-8dcb48b00206',
    'a7d8c366-2675-4d7a-8533-3176d65427bf',
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
    '2a9b4d8c-4731-4e92-be20-10927df80301',
    'c3c72b22-1d54-47c4-be9e-05a8d9a24cf5',
    'Nino Kobakhidze',
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
    'fa7311d9-7622-4ccb-8bf1-e23ef8200302',
    '8f07d242-4f30-4e36-a36c-2f928e3b09de',
    'Giorgi Meladze',
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
    'cd2d69f3-8b77-4401-b3b4-e2b2787c0303',
    'e7bda306-03f8-47bc-87bd-d922a1b9f71c',
    'Ana Baramidze',
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
    '61d3184b-01cf-4cb5-8bd2-e8c187f50401',
    '1e9dc85b-0cf5-4428-bc84-934c22b10201',
    'c3c72b22-1d54-47c4-be9e-05a8d9a24cf5',
    'Nino Kobakhidze',
    'student',
    'student',
    '2026-06-01', '2027-06-01',
    'confirmed',
    2100.00, 1,
    'Long-term student lease. Paid deposit.'
  ),
  (
    '21f6479b-cc11-4682-8bc1-19b0de310402',
    'e3d23190-671c-4e8c-8f3b-fb5c6cd80202',
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
    'f4be4cd1-12cd-4861-8cf9-c2901cde0501',
    'e3d23190-671c-4e8c-8f3b-fb5c6cd80202',
    '21f6479b-cc11-4682-8bc1-19b0de310402',
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
    'f8a4cd39-012a-4bc4-96c2-01ef9d200601',
    '1e9dc85b-0cf5-4428-bc84-934c22b10201',
    'airbnb',
    true,
    'synced',
    '2026-06-14T10:30:00Z'
  ),
  (
    'b8c42a2c-e290-482a-9e15-fa82cb500602',
    'e3d23190-671c-4e8c-8f3b-fb5c6cd80202',
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
    '0f8b1cd5-1a2b-4fc4-bd2d-e5cf92b00701',
    'match', 'agent',
    'New compatible match found',
    'ახალი თავსებადი მატჩი',
    'Scored 94% flatmate fit in Vake near TSU — sleep schedules and cleanliness index match.',
    '94% თავსებადობის ინდექსი ვაკეში — ძილის რეჟიმი და სისუფთავე ემთხვევა.',
    now() - INTERVAL '2 hours'
  ),
  (
    '23ab4cd1-67cf-4c4e-be89-7cfc0a200702',
    'sync', 'n8n',
    'Airbnb and Booking.com synced',
    'არხები სინქრონიზდა',
    'Property calendars synchronized successfully. Verified zero double bookings.',
    'ბინების კალენდრები წარმატებით სინქრონიზდა n8n-ით. ორმაგი ჯავშნები აცილებულია.',
    now() - INTERVAL '4 hours'
  ),
  (
    'ab34cd6d-495d-4f6c-829d-01efb4d20703',
    'screen', 'agent',
    'Applicant screened',
    'აპლიკანტი შემოწმდა',
    'TSU Med student verified. Estimated financial safety rating is "ideal".',
    'თსუ მედიცინის სტუდენტი შემოწმდა. ფინანსური უსაფრთხოების რეიტინგი: "იდეალური".',
    now() - INTERVAL '5 hours'
  ),
  (
    'c4fd28d1-1234-4567-8cfb-e29ab8c00704',
    'cleaning', 'n8n',
    'Cleaning task scheduled',
    'დასუფთავება დაინიშნა',
    'Turnover assigned to cleaner Keto for Checkout on June 22.',
    'ავტომატურად დაიგეგმა დასუფთავება 22 ივნისის გასვლაზე. შემსრულებელი: ქეთო.',
    now() - INTERVAL '1 day'
  );
