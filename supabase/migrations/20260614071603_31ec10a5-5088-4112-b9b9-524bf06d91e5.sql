
-- Remove the permissive public realtime policy that exposed full order rows (including PII)
DROP POLICY IF EXISTS "Public can subscribe to order tracking" ON realtime.messages;

-- Lock down SECURITY DEFINER helpers: revoke from anon, keep authenticated where needed.
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_staff() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.get_order_tracking(text) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.get_order_tracking(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated;
