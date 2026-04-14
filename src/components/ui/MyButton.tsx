"use client";

import { useRouter } from "next/navigation";
import cn from "classnames";
import type { MyButtonProps } from "@/types/button";
import { getButtonStyle, DEFAULT_BUTTON_CLASS } from "@/lib/button/style";
import { CategoryButton } from "@/components/ui/CategoryButton";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

const MyButton = ({
  type = "ctabutton",
  leadicon = null,
  trailicon = null,
  link,
  text,
  children,
  className = DEFAULT_BUTTON_CLASS,
  category = null,
  selectedCategory = null,
  onCategorySelect = null,
  showTextWhenSelected = false,
  disabled = false,
  product = null,
  onClick,
}: MyButtonProps) => {
  const router = useRouter();

  // ── WhatsApp ───────────────────────────────────────────────────────────────
  if (type === "whatsapp") {
    return (
      <WhatsAppButton
        text={text}
        className={className}
        disabled={disabled}
        product={product}
      />
    );
  }

  // ── Category ───────────────────────────────────────────────────────────────
  if (type === "category" && category) {
    return (
      <CategoryButton
        category={category}
        selectedCategory={selectedCategory}
        onCategorySelect={onCategorySelect}
        text={text}
        className={className}
        disabled={disabled}
      >
        {children}
      </CategoryButton>
    );
  }

  // ── Default (primary / secondary / cta) ────────────────────────────────────
  const handleClick = () => {
    if (disabled) return;
    if (onClick) return onClick();
    if (!link) return;

    if (link.startsWith("http")) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else if (link.startsWith("mailto:")) {
      window.location.href = link;
    } else {
      router.push(link);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        getButtonStyle(type),
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
    >
      {leadicon}
      {text && <p className="cursor-pointer">{text}</p>}
      {trailicon}
      {children}
    </button>
  );
};

export default MyButton;
