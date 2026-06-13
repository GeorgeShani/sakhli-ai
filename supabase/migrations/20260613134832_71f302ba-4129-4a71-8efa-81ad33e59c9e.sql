
-- 1) Remove cleaning_tasks from realtime publication to prevent leaking cleaner_phone/name
ALTER PUBLICATION supabase_realtime DROP TABLE public.cleaning_tasks;

-- 2) Restrict student_profiles reads to owner only (financial fields no longer broadly readable)
DROP POLICY IF EXISTS student_profiles_select_auth ON public.student_profiles;

CREATE POLICY student_profiles_select_own
  ON public.student_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());
