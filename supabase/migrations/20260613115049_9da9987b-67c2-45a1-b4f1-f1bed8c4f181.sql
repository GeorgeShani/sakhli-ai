
-- USERS (app-level, not auth.users)
CREATE TABLE public.users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT,
  email TEXT UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student','host','cleaner','admin')),
  language TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon, authenticated;
GRANT ALL ON public.users TO service_role;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_users" ON public.users FOR ALL USING (true) WITH CHECK (true);

-- STUDENT PROFILES
CREATE TABLE public.student_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
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
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_profiles TO anon, authenticated;
GRANT ALL ON public.student_profiles TO service_role;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_student_profiles" ON public.student_profiles FOR ALL USING (true) WITH CHECK (true);

-- PROPERTIES
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties TO anon, authenticated;
GRANT ALL ON public.properties TO service_role;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_properties" ON public.properties FOR ALL USING (true) WITH CHECK (true);

-- BOOKINGS
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO anon, authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_bookings" ON public.bookings FOR ALL USING (true) WITH CHECK (true);

-- CHANNEL SYNC
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.channel_sync TO anon, authenticated;
GRANT ALL ON public.channel_sync TO service_role;
ALTER TABLE public.channel_sync ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_channel_sync" ON public.channel_sync FOR ALL USING (true) WITH CHECK (true);

-- CLEANING TASKS
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
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cleaning_tasks TO anon, authenticated;
GRANT ALL ON public.cleaning_tasks TO service_role;
ALTER TABLE public.cleaning_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "open_cleaning_tasks" ON public.cleaning_tasks FOR ALL USING (true) WITH CHECK (true);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cleaning_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.channel_sync;
ALTER PUBLICATION supabase_realtime ADD TABLE public.properties;

-- Indexes
CREATE INDEX idx_bookings_property ON public.bookings(property_id);
CREATE INDEX idx_bookings_dates ON public.bookings(check_in, check_out);
CREATE INDEX idx_cleaning_property ON public.cleaning_tasks(property_id);
CREATE INDEX idx_cleaning_scheduled ON public.cleaning_tasks(scheduled_for);
