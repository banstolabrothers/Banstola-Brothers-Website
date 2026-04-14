import Image from "next/image";
import whatsappicon from "@/assets/svg/whatsapp.svg";

interface WhatsAppIconProps {
  className?: string;
  size?: number;
}

export const WhatsAppIcon = ({ className, size = 24 }: WhatsAppIconProps) => (
  <Image
    src={whatsappicon}
    alt="WhatsApp"
    width={size}
    height={size}
    className={className}
  />
);
