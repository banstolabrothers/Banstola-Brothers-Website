"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import cn from "classnames";
import { client } from "@/lib/sanity";

// ── Types ────────────────────────────────────────────────────────────────────
interface WhatsAppSettings {
  phoneNumber: string;
  defaultMessage: string;
  buttonText: string;
}

interface Category {
  _id?: string; // optional — allCategoriesQuery doesn't return _id
  title?: string;
  slug?: { current: string }; // ✅ added — this is what the query actually returns
  image?: { asset?: { url: string } };
}

interface MyButtonProps {
  type?:
    | "ctabutton"
    | "primarybutton"
    | "secondarybutton"
    | "whatsapp"
    | "category";
  leadicon?: React.ReactNode;
  trailicon?: React.ReactNode;
  link?: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
  category?: Category | null;
  selectedCategory?: string | null; // now holds a slug string, not _id
  onCategorySelect?: ((slug: string) => void) | null; // receives slug
  showTextWhenSelected?: boolean;
  disabled?: boolean;
  product?: Record<string, unknown> | null;
  onClick?: () => void;
}

// ── WhatsApp settings hook ───────────────────────────────────────────────────
const useWhatsAppSettings = () => {
  const [settings, setSettings] = useState<WhatsAppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .fetch<WhatsAppSettings>(
        `*[_type == "whatsappSettings"][0]{
          phoneNumber,
          defaultMessage,
          buttonText
        }`,
      )
      .then((data) => {
        setSettings(
          data ?? {
            phoneNumber: "9779762554136",
            defaultMessage:
              "Hello! I'm interested in your products. Could you please share more details? Thank you!",
            buttonText: "Chat with us on WhatsApp",
          },
        );
      })
      .catch(() => {
        setSettings({
          phoneNumber: "9779762554136",
          defaultMessage:
            "Hello! I'm interested in your products. Could you please share more details? Thank you!",
          buttonText: "Chat with us on WhatsApp",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  return { settings, loading };
};

// ── WhatsApp URL builder ─────────────────────────────────────────────────────
const generateWhatsAppURL = (
  phoneNumber: string,
  message: string,
  product?: Record<string, unknown> | null,
) => {
  // Fallback if Sanity defaultMessage is null/empty
  const baseMessage =
    message ||
    "Hello! I'm interested in your products. Could you please share more details? Thank you!";

  let finalMessage = baseMessage;

  if (product) {
    const productName = (product.title as string) || "this product";
    const selectedOptions = product.selectedOptions as
      | Record<string, string>
      | undefined;
    const variants = selectedOptions
      ? Object.entries(selectedOptions)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
      : "";

    finalMessage = `Hello! I'm interested in *${productName}*${
      variants ? `\n\nSelected options:\n${variants}` : ""
    }\n\nCould you please share more details about pricing and availability? Thank you!`;
  }

  return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
};

// ── Class name map ───────────────────────────────────────────────────────────
const getClassName = (type: string) => {
  switch (type) {
    case "primarybutton":
      return "px-5 pt-3 pb-3.5 h-fit rounded-full text-white border-2 border-brand-500 bg-brand-500 border-brand-900 shadow-[3px_3px_0px_0px_rgba(69,30,0,1)]";
    case "secondarybutton":
      return "px-5 pt-3 pb-3.5 h-fit rounded-full text-brand-900 border-2 border-brand-500 hover:bg-brand-100 border-brand-900 shadow-[3px_3px_0px_0px_rgba(69,30,0,1)]";
    case "whatsapp":
      return "px-5 pt-3 pb-3.5 h-fit rounded-full border-2 text-[#1c1e21] bg-[#25d366] border-[#1c1e21] shadow-[3px_3px_0px_0px_rgba(24,30,33,1)]";
    case "category":
      return "flex items-center text-brand-900 rounded-full transition-all duration-200 border-2 border-brand-900 shadow-[4px_4px_0px_0px_rgba(69,30,0,1)]";
    default:
      return "";
  }
};

// ── WhatsApp icon ────────────────────────────────────────────────────────────
const WhatsAppIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.787" />
  </svg>
);

// ── Main component ───────────────────────────────────────────────────────────
const MyButton = ({
  type = "ctabutton",
  leadicon = null,
  trailicon = null,
  link,
  text,
  children,
  className = "flex gap-2 w-fit justify-center items-center hover:cursor-pointer hover:scale-105 flex-nowrap whitespace-nowrap transition ease-in-out duration-[200ms]",
  category = null,
  selectedCategory = null,
  onCategorySelect = null,
  showTextWhenSelected = false,
  disabled = false,
  product = null,
  onClick,
}: MyButtonProps) => {
  const router = useRouter();
  const { settings, loading } = useWhatsAppSettings();

  // ✅ Resolve the category's identifier — prefer slug, fall back to _id
  const categoryKey = category?.slug?.current ?? category?._id ?? null;

  const handleClick = () => {
    if (disabled) return;

    if (type === "whatsapp") {
      if (loading || !settings) return;
      const url = generateWhatsAppURL(
        settings.phoneNumber,
        settings.defaultMessage,
        product,
      );
      window.open(url, "_blank");
      return;
    }

    if (type === "category" && category && onCategorySelect && categoryKey) {
      onCategorySelect(categoryKey); // ✅ passes slug, not _id
      return;
    }

    if (link) {
      if (link.startsWith("http")) {
        window.open(link, "_blank", "noopener,noreferrer");
      } else if (link.startsWith("mailto:")) {
        window.location.href = link;
      } else {
        router.push(link);
      }
    }
  };

  const btnClassName = getClassName(type);

  // WhatsApp loading state
  if (type === "whatsapp" && loading) {
    return (
      <button
        disabled
        className={cn(btnClassName, "opacity-50 cursor-not-allowed", className)}
      >
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
        <span className="text-[20px] leading-[160%] font-RGRegular cursor-pointer">
          Loading...
        </span>
      </button>
    );
  }

  // Category button
  if (type === "category") {
    const isSelected = categoryKey !== null && selectedCategory === categoryKey;

    return (
      <button
        key={categoryKey}
        onClick={handleClick}
        className={cn(
          btnClassName,
          isSelected ? "pr-4 bg-brand-100 text-brand-500" : "",
          className,
        )}
        disabled={disabled}
      >
        {/* Always show image */}
        {category?.image?.asset?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={category.image.asset.url}
            alt={category.title ?? text}
            className="w-20 h-20 object-cover rounded-full flex-shrink-0"
          />
        )}

        {((isSelected && showTextWhenSelected) ||
          (isSelected && !showTextWhenSelected)) && (
          <h5 className="pl-1 pr-2">{category?.title || text}</h5>
        )}

        {children}
      </button>
    );
  }

  // Default button
  return (
    <button
      type="button"
      onClick={onClick ?? handleClick}
      className={cn(
        btnClassName,
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      disabled={disabled}
    >
      {type === "whatsapp" && !leadicon && !trailicon && <WhatsAppIcon />}
      {leadicon}
      {(text || (type === "whatsapp" && !text)) && (
        <p className="cursor-pointer">
          {type === "whatsapp" && !text
            ? settings?.buttonText || "Chat with us"
            : text}
        </p>
      )}
      {trailicon}
      {children}
    </button>
  );
};

export default MyButton;
