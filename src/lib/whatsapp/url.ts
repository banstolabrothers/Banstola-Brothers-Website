import { WHATSAPP_DEFAULTS } from "./config";

export const generateWhatsAppURL = (
  phoneNumber: string,
  message: string,
  product?: Record<string, unknown> | null,
): string => {
  const baseMessage = message || WHATSAPP_DEFAULTS.defaultMessage;

  if (!product) {
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;
  }

  const productName = (product.title as string) || "this product";
  const selectedOptions = product.selectedOptions as
    | Record<string, string>
    | undefined;

  const variants = selectedOptions
    ? Object.entries(selectedOptions)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    : "";

  const finalMessage = `Hello Banstola! I'm interested in *${productName}*${
    variants ? `\n\nSelected options:\n${variants}` : ""
  }\n\nCould you please share more details about pricing and availability? Thank you!`;

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
};
