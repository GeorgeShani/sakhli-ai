
CREATE OR REPLACE FUNCTION public.is_property_host(_property_id uuid, _user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY INVOKER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.properties WHERE id = _property_id AND host_id = _user_id)
$$;

REVOKE ALL ON FUNCTION public.is_property_host(uuid, uuid) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_property_host(uuid, uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_property_host(uuid, uuid) TO authenticated;
