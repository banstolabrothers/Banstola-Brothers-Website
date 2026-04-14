import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import type { WhatsAppSettings } from "@/types/whatsapp";
import { WHATSAPP_DEFAULTS, WHATSAPP_SANITY_QUERY } from "./config";

export const useWhatsAppSettings = () => {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<WhatsAppSettings>(WHATSAPP_SANITY_QUERY)
      .then((data) =>
        setSettings({
          ...WHATSAPP_DEFAULTS,
          ...data,
          phoneNumber: WHATSAPP_DEFAULTS.phoneNumber, // always locked to config
        }),
      )
      .catch(() => setSettings(WHATSAPP_DEFAULTS))
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
};
