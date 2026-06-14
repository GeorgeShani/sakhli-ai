-- =====================================================================
--                 SAKHLIAI CONSOLIDATED SCHEMA (PART 1)
-- =====================================================================

-- 1) Core Utilities & Updated_At Trigger Function
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
ALTER FUNCTION public.touch_updated_at() SECURITY INVOKER;

-- 2) USERS Table (Seamlessly aligned with Supabase Auth)
CREATE TABLE public.users (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','host','cleaner','admin')),
  language TEXT NOT NULL DEFAULT 'en',
  plan TEXT NOT NULL DEFAULT 'free' CHECK (plan IN ('free','plus','ultra')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT ALL ON public.users TO service_role;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_select_own" ON public.users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "users_insert_own" ON public.users FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "users_update_own" ON public.users FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- 3) PROFILES Table (Used for fast role lookups and auth checking)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  role TEXT CHECK (role IN ('student','host','cleaner','parent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 4) New User Automation Hook (Triggers on new user signup in Auth to automatically populate BOTH public tables)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email))
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.users (id, full_name, email, role, plan)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    NEW.email,
    'student',
    'free'
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5) STUDENT PROFILES Table (Behavior-based matching parameters)
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE, -- exactly 1 profile per user
  display_name TEXT,
  university TEXT,
  budget_min INT,
  budget_max INT,
  sleep_schedule TEXT,
  cleanliness INT,
  smoking BOOLEAN DEFAULT false,
  pets BOOLEAN DEFAULT false,
  bio TEXT,
  city TEXT DEFAULT 'Tbilisi',
  languages TEXT[],
  salary_bracket TEXT CHECK (salary_bracket IN ('under_500','500_1000','1000_2000','2000_plus')),
  income_source TEXT CHECK (income_source IN ('job','family','scholarship','mixed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_profiles TO authenticated;
GRANT ALL ON public.student_profiles TO service_role;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY student_profiles_select_own ON public.student_profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'host'));
CREATE POLICY student_profiles_insert_own ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY student_profiles_update_own ON public.student_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY student_profiles_delete_own ON public.student_profiles FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 6) PROPERTIES Table (SakhliAI hybrid rental flats)
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  host_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  city TEXT DEFAULT 'Tbilisi',
  address TEXT,
  bedrooms INT DEFAULT 1,
  bathrooms INT DEFAULT 1,
  price_per_night NUMERIC(10,2),
  price_per_month NUMERIC(10,2),
  listing_type TEXT NOT NULL DEFAULT 'hybrid' CHECK (listing_type IN ('short_term','long_term','hybrid')),
  amenities TEXT[],
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY properties_select_own ON public.properties FOR SELECT TO authenticated USING (host_id = auth.uid() OR TRUE); -- allow all users to view available listings
CREATE POLICY properties_insert_own ON public.properties FOR INSERT TO authenticated WITH CHECK (host_id = auth.uid());
CREATE POLICY properties_update_own ON public.properties FOR UPDATE TO authenticated USING (host_id = auth.uid()) WITH CHECK (host_id = auth.uid());
CREATE POLICY properties_delete_own ON public.properties FOR DELETE TO authenticated USING (host_id = auth.uid());

-- 7) Property Host Verification Helper
CREATE OR REPLACE FUNCTION public.is_property_host(_property_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.properties WHERE id = _property_id AND host_id = _user_id)
$$;
REVOKE ALL ON FUNCTION public.is_property_host(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_property_host(uuid, uuid) TO authenticated;

-- 8) BOOKINGS Table (Rent/reservation details)
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  guest_name TEXT,
  channel TEXT NOT NULL DEFAULT 'direct' CHECK (channel IN ('direct','airbnb','booking','sakliai','student')),
  booking_type TEXT NOT NULL DEFAULT 'short_term' CHECK (booking_type IN ('short_term','long_term','student')),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending','confirmed','cancelled','completed')),
  total_price NUMERIC(10,2),
  guests_count INT DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY bookings_select_host ON public.bookings FOR SELECT TO authenticated USING (public.is_property_host(property_id, auth.uid()) OR guest_id = auth.uid());
CREATE POLICY bookings_insert_host ON public.bookings FOR INSERT TO authenticated WITH CHECK (public.is_property_host(property_id, auth.uid()) OR guest_id = auth.uid());
CREATE POLICY bookings_update_host ON public.bookings FOR UPDATE TO authenticated USING (public.is_property_host(property_id, auth.uid()) OR guest_id = auth.uid()) WITH CHECK (public.is_property_host(property_id, auth.uid()) OR guest_id = auth.uid());
CREATE POLICY bookings_delete_host ON public.bookings FOR DELETE TO authenticated USING (public.is_property_host(property_id, auth.uid()) OR guest_id = auth.uid());

-- 9) CHANNEL SYNC Table (Brings in iCal integrations)
CREATE TABLE public.channel_sync (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('airbnb','booking','sakliai','student')),
  enabled BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'idle' CHECK (status IN ('idle','syncing','synced','error')),
  last_synced_at TIMESTAMPTZ,
  external_listing_id TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(property_id, channel)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.channel_sync TO authenticated;
GRANT ALL ON public.channel_sync TO service_role;
ALTER TABLE public.channel_sync ENABLE ROW LEVEL SECURITY;

CREATE POLICY channel_sync_select_host ON public.channel_sync FOR SELECT TO authenticated USING (public.is_property_host(property_id, auth.uid()));
CREATE POLICY channel_sync_insert_host ON public.channel_sync FOR INSERT TO authenticated WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY channel_sync_update_host ON public.channel_sync FOR UPDATE TO authenticated USING (public.is_property_host(property_id, auth.uid())) WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY channel_sync_delete_host ON public.channel_sync FOR DELETE TO authenticated USING (public.is_property_host(property_id, auth.uid()));

-- 10) CLEANING TASKS Table (Managed via Cleaner Dispatch)
CREATE TABLE public.cleaning_tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  cleaner_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  cleaner_name TEXT,
  cleaner_phone TEXT,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','assigned','in_progress','completed','cancelled')),
  notes TEXT,
  notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.cleaning_tasks TO authenticated;
GRANT ALL ON public.cleaning_tasks TO service_role;
ALTER TABLE public.cleaning_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY cleaning_tasks_select_host ON public.cleaning_tasks FOR SELECT TO authenticated USING (public.is_property_host(property_id, auth.uid()) OR cleaner_id = auth.uid());
CREATE POLICY cleaning_tasks_insert_host ON public.cleaning_tasks FOR INSERT TO authenticated WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY cleaning_tasks_update_host ON public.cleaning_tasks FOR UPDATE TO authenticated USING (public.is_property_host(property_id, auth.uid()) OR cleaner_id = auth.uid()) WITH CHECK (public.is_property_host(property_id, auth.uid()) OR cleaner_id = auth.uid());
CREATE POLICY cleaning_tasks_delete_host ON public.cleaning_tasks FOR DELETE TO authenticated USING (public.is_property_host(property_id, auth.uid()));

-- 11) AGENT EVENTS Table (Realtime activity log)
CREATE TABLE public.agent_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL CHECK (kind IN ('match', 'split', 'screen', 'sync', 'cleaning', 'lock', 'contract', 'mediation')),
  source TEXT NOT NULL DEFAULT 'agent' CHECK (source IN ('agent', 'n8n')),
  title_en TEXT NOT NULL,
  title_ka TEXT NOT NULL,
  detail_en TEXT NOT NULL,
  detail_ka TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.agent_events TO anon, authenticated;
GRANT ALL ON public.agent_events TO service_role;
ALTER TABLE public.agent_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_agent_events" ON public.agent_events FOR ALL USING (true) WITH CHECK (true);

-- 12) APPLICANT SCREENINGS Table
CREATE TABLE public.applicant_screenings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  score NUMERIC,
  verdict TEXT CHECK (verdict IN ('ideal', 'good', 'review')),
  risk_analysis TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.applicant_screenings TO authenticated;
GRANT ALL ON public.applicant_screenings TO service_role;
ALTER TABLE public.applicant_screenings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_applicant_screenings" ON public.applicant_screenings FOR ALL USING (true) WITH CHECK (true);

-- 13) Prevent Client-side Role Escalation Safeguards
CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NOT NULL
     AND OLD.role IS NOT NULL
     AND NEW.role IS DISTINCT FROM OLD.role THEN
    RAISE EXCEPTION 'Role changes are not permitted from the client'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.prevent_role_escalation() FROM PUBLIC, anon, authenticated;

CREATE TRIGGER profiles_prevent_role_escalation
BEFORE UPDATE OF role ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

CREATE TRIGGER users_prevent_role_escalation
BEFORE UPDATE OF role ON public.users
FOR EACH ROW EXECUTE FUNCTION public.prevent_role_escalation();

-- 14) Enable Supabase Realtime Publications
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_sync;
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agent_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_profiles;

-- 15) High-Performance Indexing
CREATE INDEX idx_bookings_property ON public.bookings(property_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX idx_cleaning_property ON public.cleaning_tasks(property_id);
CREATE INDEX idx_cleaning_scheduled ON public.cleaning_tasks(scheduled_for);


-- =====================================================================
--                 SAKHLIAI SEED DATA (PART 2)
-- =====================================================================

-- 1) Seed Auth & Public Users
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
