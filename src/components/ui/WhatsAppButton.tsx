import cn from "classnames";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";
import { getButtonStyle, DEFAULT_BUTTON_CLASS } from "@/lib/button/style";
import { useWhatsAppSettings } from "@/lib/whatsapp";
import { generateWhatsAppURL } from "@/lib/whatsapp";

interface WhatsAppButtonProps {
  text?: string;
  className?: string;
  disabled?: boolean;
  product?: Record<string, unknown> | null;
}

export const WhatsAppButton = ({
  text,
  className = DEFAULT_BUTTON_CLASS,
  disabled = false,
  product = null,
}: WhatsAppButtonProps) => {
  const { settings, loading } = useWhatsAppSettings();
  const btnClass = getButtonStyle("whatsapp");

  if (loading) {
    return (
      <button
        disabled
        className={cn(btnClass, "opacity-50 cursor-not-allowed", className)}
      >
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-[20px] leading-[160%] font-RGRegular">
          Loading...
        </span>
      </button>
    );
  }

  const handleClick = () => {
    if (disabled || !settings) return;
    const url = generateWhatsAppURL(
      settings.phoneNumber,
      settings.defaultMessage,
      product,
    );
    window.open(url, "_blank");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        btnClass,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      <WhatsAppIcon size={24} />
      <p className="cursor-pointer">
        {text ?? settings?.buttonText ?? "Chat with us"}
      </p>
    </button>
  );
};
