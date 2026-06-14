-- Consolidated Database Schema for SakhliAI

-- 1) Core Utilities & Updated_At
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;
ALTER FUNCTION public.touch_updated_at() SECURITY INVOKER;

-- 2) USERS Table (directly aligned with auth.users for seamless linkage)
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

-- 3) PROFILES Table (used for auth state role checking)
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

-- 4) New User Automation Hook (Triggers on auth.users registration to populate BOTH tables)
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

-- 5) STUDENT PROFILES Table (100% aligned with React types & Onboarding fields)
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE, -- exactly 1 profile per user
  name TEXT,                                                         -- matches name
  university TEXT,                                                   -- matches university
  budget INT NOT NULL DEFAULT 1200,                                  -- matches budget
  sleep TEXT NOT NULL DEFAULT 'flexible' CHECK (sleep IN ('early_bird', 'night_owl', 'flexible')), -- matches sleep
  smoking BOOLEAN NOT NULL DEFAULT false,                            -- matches smoking
  pets BOOLEAN NOT NULL DEFAULT false,                               -- matches pets
  parties BOOLEAN NOT NULL DEFAULT false,                            -- matches parties
  quiet BOOLEAN NOT NULL DEFAULT true,                               -- matches quiet
  cleanliness INT NOT NULL DEFAULT 3 CHECK (cleanliness BETWEEN 1 AND 5), -- matches cleanliness
  bio TEXT,                                                          -- matches bio
  verified BOOLEAN NOT NULL DEFAULT false,                           -- matches verified
  salary_bracket TEXT DEFAULT '500_1000' CHECK (salary_bracket IN ('under_500','500_1000','1000_2000','2000_plus')), -- matches salaryBracket
  income_source TEXT DEFAULT 'family' CHECK (income_source IN ('job','family','scholarship','mixed')), -- matches incomeSource
  avatar TEXT,                                                       -- matches avatar
  city TEXT DEFAULT 'Tbilisi',
  languages TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_profiles TO authenticated;
GRANT ALL ON public.student_profiles TO service_role;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY student_profiles_select_own ON public.student_profiles FOR SELECT TO authenticated USING (user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'host'));
CREATE POLICY student_profiles_insert_own ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY student_profiles_update_own ON public.student_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY student_profiles_delete_own ON public.student_profiles FOR DELETE TO authenticated USING (user_id = auth.uid());

-- 6) PROPERTIES Table (flatmate and vacation listings)
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

CREATE POLICY properties_select_own ON public.properties FOR SELECT TO authenticated USING (host_id = auth.uid() OR TRUE); -- allow general student viewing
CREATE POLICY properties_insert_own ON public.properties FOR INSERT TO authenticated WITH CHECK (host_id = auth.uid());
CREATE POLICY properties_update_own ON public.properties FOR UPDATE TO authenticated USING (host_id = auth.uid()) WITH CHECK (host_id = auth.uid());
CREATE POLICY properties_delete_own ON public.properties FOR DELETE TO authenticated USING (host_id = auth.uid());

-- 7) Property Host Verification Heuristics Function
CREATE OR REPLACE FUNCTION public.is_property_host(_property_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.properties WHERE id = _property_id AND host_id = _user_id)
$$;
REVOKE ALL ON FUNCTION public.is_property_host(uuid, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_property_host(uuid, uuid) TO authenticated;

-- 8) BOOKINGS Table (reservation calendar records)
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

-- 9) CHANNEL SYNC Table (iCal configuration rules)
CREATE TABLE public.channel_sync (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('airbnb','booking','sakliai','student')),
  enabled BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN GENERATED ALWAYS AS (enabled) STORED,
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

-- 10) CLEANING TASKS Table
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

-- 11) AGENT EVENTS Table
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

-- 13) Prevent Role Escalation Policy Engine
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

-- 14) Realtime publication additions
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
