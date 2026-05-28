
CREATE TABLE public.site_settings (
  id boolean PRIMARY KEY DEFAULT true CHECK (id = true),
  store_name text NOT NULL DEFAULT 'SKYTHS',
  contact_email text NOT NULL DEFAULT 'info@skyths.com',
  phone text NOT NULL DEFAULT '+92 300 1234567',
  shipping_fee numeric NOT NULL DEFAULT 250,
  store_address text NOT NULL DEFAULT 'Lahore, Pakistan',
  bank_details text NOT NULL DEFAULT 'Bank: HBL
Account: 1234567890
Title: SKYTHS',
  easypaisa_number text NOT NULL DEFAULT '0300-1234567',
  jazzcash_number text NOT NULL DEFAULT '0300-1234567',
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT INSERT, UPDATE ON public.site_settings TO authenticated;

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view settings" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Admins can insert settings" ON public.site_settings
  FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can update settings" ON public.site_settings
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (id) VALUES (true) ON CONFLICT DO NOTHING;

ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
