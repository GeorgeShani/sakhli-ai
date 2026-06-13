
DROP POLICY IF EXISTS open_properties      ON public.properties;
DROP POLICY IF EXISTS open_bookings        ON public.bookings;
DROP POLICY IF EXISTS open_channel_sync    ON public.channel_sync;
DROP POLICY IF EXISTS open_cleaning_tasks  ON public.cleaning_tasks;
DROP POLICY IF EXISTS open_student_profiles ON public.student_profiles;
DROP POLICY IF EXISTS open_users           ON public.users;

CREATE OR REPLACE FUNCTION public.is_property_host(_property_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.properties WHERE id = _property_id AND host_id = _user_id)
$$;
GRANT EXECUTE ON FUNCTION public.is_property_host(uuid, uuid) TO authenticated;

CREATE POLICY properties_select_own ON public.properties FOR SELECT TO authenticated USING (host_id = auth.uid());
CREATE POLICY properties_insert_own ON public.properties FOR INSERT TO authenticated WITH CHECK (host_id = auth.uid());
CREATE POLICY properties_update_own ON public.properties FOR UPDATE TO authenticated USING (host_id = auth.uid()) WITH CHECK (host_id = auth.uid());
CREATE POLICY properties_delete_own ON public.properties FOR DELETE TO authenticated USING (host_id = auth.uid());

CREATE POLICY bookings_select_host ON public.bookings FOR SELECT TO authenticated USING (public.is_property_host(property_id, auth.uid()));
CREATE POLICY bookings_insert_host ON public.bookings FOR INSERT TO authenticated WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY bookings_update_host ON public.bookings FOR UPDATE TO authenticated USING (public.is_property_host(property_id, auth.uid())) WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY bookings_delete_host ON public.bookings FOR DELETE TO authenticated USING (public.is_property_host(property_id, auth.uid()));

CREATE POLICY channel_sync_select_host ON public.channel_sync FOR SELECT TO authenticated USING (public.is_property_host(property_id, auth.uid()));
CREATE POLICY channel_sync_insert_host ON public.channel_sync FOR INSERT TO authenticated WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY channel_sync_update_host ON public.channel_sync FOR UPDATE TO authenticated USING (public.is_property_host(property_id, auth.uid())) WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY channel_sync_delete_host ON public.channel_sync FOR DELETE TO authenticated USING (public.is_property_host(property_id, auth.uid()));

CREATE POLICY cleaning_tasks_select_host ON public.cleaning_tasks FOR SELECT TO authenticated USING (public.is_property_host(property_id, auth.uid()));
CREATE POLICY cleaning_tasks_insert_host ON public.cleaning_tasks FOR INSERT TO authenticated WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY cleaning_tasks_update_host ON public.cleaning_tasks FOR UPDATE TO authenticated USING (public.is_property_host(property_id, auth.uid())) WITH CHECK (public.is_property_host(property_id, auth.uid()));
CREATE POLICY cleaning_tasks_delete_host ON public.cleaning_tasks FOR DELETE TO authenticated USING (public.is_property_host(property_id, auth.uid()));

CREATE POLICY student_profiles_select_auth ON public.student_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY student_profiles_insert_own  ON public.student_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY student_profiles_update_own  ON public.student_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY student_profiles_delete_own  ON public.student_profiles FOR DELETE TO authenticated USING (user_id = auth.uid());

CREATE POLICY users_select_own ON public.users FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY users_insert_own ON public.users FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY users_update_own ON public.users FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

REVOKE ALL ON public.properties       FROM anon;
REVOKE ALL ON public.bookings         FROM anon;
REVOKE ALL ON public.channel_sync     FROM anon;
REVOKE ALL ON public.cleaning_tasks   FROM anon;
REVOKE ALL ON public.student_profiles FROM anon;
REVOKE ALL ON public.users            FROM anon;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.properties       TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings         TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.channel_sync     TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.cleaning_tasks   TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE         ON public.users            TO authenticated;
