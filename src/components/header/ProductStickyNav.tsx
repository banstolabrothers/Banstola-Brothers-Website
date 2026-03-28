"use client";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import type { Product, SelectedOptions } from "@/types/product"; // add this import

interface ProductStickyNavProps {
  productName?: string;
  selectedOptions?: SelectedOptions;
  product?: Product; // was: Record<string, unknown>
}

const ProductStickyNav = ({
  productName,
  selectedOptions,
  product,
}: ProductStickyNavProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 600);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // ✅ empty deps — setState is stable, no stale closure

  return (
    <div
      className={`fixed bottom-4 max-w-3xl mx-auto left-0 right-0 px-4 py-4 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-linear border-2 border-brand-900/40 shadow-[3px_3px_0px_0px_rgba(69,30,0,.40)] rounded-full ${
        isVisible
          ? "-translate-y-0 opacity-100 z-50"
          : "translate-y-[150%] opacity-0 -z-10"
      }`}
      style={{ willChange: isVisible ? "transform, opacity" : "auto" }}
    >
      <div className="flex flex-col items-center md:flex-row justify-between h-fit gap-4">
        {/* Product name + selected options */}
        <div className="flex flex-col justify-start items-center gap-1 px-6 min-w-0 flex-1">
          <h4 className="text-brand-900 w-full">{productName || "Product"}</h4>
          {selectedOptions && Object.keys(selectedOptions).length > 0 && (
            <div className="flex justify-start w-full items-center gap-2 flex-wrap">
              {Object.entries(selectedOptions).map(([key, value]) => (
                <label
                  key={`${key}-${value}`}
                  className="text-brand-900 whitespace-nowrap"
                >
                  {value},
                </label>
              ))}
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-4">
          <MyButton
            type="secondarybutton"
            text="Visit Store"
            leadicon={<MapPin size={32} />}
            link="/store"
          />
          <MyButton
            type="whatsapp"
            text="Order Via WhatsApp"
            product={product ? { ...product, selectedOptions } : null}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductStickyNav;
