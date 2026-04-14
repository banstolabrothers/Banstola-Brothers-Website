import type { WhatsAppSettings } from "@/types/whatsapp";

export const WHATSAPP_DEFAULTS: WhatsAppSettings = {
  phoneNumber: "9779846054755",
  defaultMessage:
    "Hello! I'm interested in your products. Could you please share more details? Thank you!",
  buttonText: "Chat with us on WhatsApp",
};

export const WHATSAPP_SANITY_QUERY = `
  *[_type == "whatsappSettings"][0]{
    phoneNumber,
    defaultMessage,
    buttonText
  }
`;
