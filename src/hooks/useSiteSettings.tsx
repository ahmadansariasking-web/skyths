import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type SiteSettings = {
  store_name: string;
  contact_email: string;
  phone: string;
  shipping_fee: number;
  store_address: string;
  bank_details: string;
  easypaisa_number: string;
  jazzcash_number: string;
};

const DEFAULTS: SiteSettings = {
  store_name: "SKYTHS",
  contact_email: "info@skyths.com",
  phone: "+92 300 1234567",
  shipping_fee: 250,
  store_address: "Lahore, Pakistan",
  bank_details: "Bank: HBL\nAccount: 1234567890\nTitle: SKYTHS",
  easypaisa_number: "0300-1234567",
  jazzcash_number: "0300-1234567",
};

type Ctx = { settings: SiteSettings; loading: boolean; refresh: () => Promise<void> };
const SiteSettingsContext = createContext<Ctx>({ settings: DEFAULTS, loading: true, refresh: async () => {} });

export const SiteSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data } = await supabase.from("site_settings").select("*").eq("id", true).maybeSingle();
    if (data) {
      setSettings({
        store_name: data.store_name,
        contact_email: data.contact_email,
        phone: data.phone,
        shipping_fee: Number(data.shipping_fee),
        store_address: data.store_address,
        bank_details: data.bank_details,
        easypaisa_number: data.easypaisa_number,
        jazzcash_number: data.jazzcash_number,
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    void load();
    const channel = supabase
      .channel("site-settings-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_settings" }, () => {
        void load();
      })
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refresh: load }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
