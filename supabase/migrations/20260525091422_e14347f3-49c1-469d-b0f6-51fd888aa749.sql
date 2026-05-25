
-- 1) Proper roles system (replace hardcoded email staff list)
CREATE TYPE public.app_role AS ENUM ('admin', 'employee', 'customer');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  );
$$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM anon, authenticated, PUBLIC;

CREATE POLICY "Users view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Seed existing staff users
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role FROM auth.users WHERE email = 'ad@skyths.com'
ON CONFLICT DO NOTHING;

INSERT INTO public.user_roles (user_id, role)
SELECT id, 'employee'::public.app_role FROM auth.users WHERE email = 'employee@skyth.com'
ON CONFLICT DO NOTHING;

-- 2) Reimplement is_staff via roles table (no more hardcoded emails)
CREATE OR REPLACE FUNCTION public.is_staff()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin'::public.app_role)
      OR public.has_role(auth.uid(), 'employee'::public.app_role);
$$;

REVOKE EXECUTE ON FUNCTION public.is_staff() FROM anon, authenticated, PUBLIC;

-- 3) Harden orders table user ownership
ALTER TABLE public.orders ALTER COLUMN user_id SET NOT NULL;

DROP POLICY IF EXISTS "Users insert their own orders" ON public.orders;
CREATE POLICY "Users insert their own orders"
ON public.orders FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 4) Lock down Realtime subscriptions on orders channel
-- Only allow authenticated users to receive realtime messages, and only for
-- order topics matching an order they own or where they are staff.
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read own order channels" ON realtime.messages;
CREATE POLICY "Authenticated can read own order channels"
ON realtime.messages FOR SELECT
TO authenticated
USING (
  public.is_staff()
  OR EXISTS (
    SELECT 1 FROM public.orders o
    WHERE 'order-' || o.order_number = realtime.topic()
      AND o.user_id = auth.uid()
  )
);
