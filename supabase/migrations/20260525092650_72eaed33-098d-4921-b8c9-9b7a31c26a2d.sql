
-- 1. Reset staff passwords
UPDATE auth.users
SET encrypted_password = crypt('Admin@Skyths2026', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'ad@skyths.com';

UPDATE auth.users
SET encrypted_password = crypt('Employee@Skyths2026', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE email = 'employee@skyth.com';

-- 2. Public order tracking RPC (no PII)
CREATE OR REPLACE FUNCTION public.get_order_tracking(_order_number text)
RETURNS TABLE (
  order_number text,
  status text,
  tracking_note text,
  items jsonb,
  subtotal numeric,
  shipping numeric,
  total numeric,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.order_number, o.status, o.tracking_note, o.items,
         o.subtotal, o.shipping, o.total, o.created_at, o.updated_at
  FROM public.orders o
  WHERE o.order_number = _order_number
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION public.get_order_tracking(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_order_tracking(text) TO anon, authenticated;

-- 3. Public realtime subscription for a specific order topic
DROP POLICY IF EXISTS "Public can subscribe to order tracking" ON realtime.messages;
CREATE POLICY "Public can subscribe to order tracking"
ON realtime.messages
FOR SELECT
TO anon, authenticated
USING (
  realtime.topic() LIKE 'order-%'
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE ('order-' || o.order_number) = realtime.topic()
  )
);
