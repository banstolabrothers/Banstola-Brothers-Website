"use client";
import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import type { Product } from "@/types/product";

interface ProductStickyNavProps {
  productName?: string;
  selectedOptions?: Record<string, string>;
  product?: Product;
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
  }, []);

  return (
    <section
      className={`fixed bottom-4 max-w-5xl mx-auto left-0 right-0 flex items-center justify-center gap-2 ${
        isVisible
          ? "-translate-y-0 opacity-100 z-50"
          : "translate-y-[150%] opacity-0 -z-10"
      }`}
      style={{ willChange: isVisible ? "transform, opacity" : "auto" }}
    >
      {/* Product */}
      <div className="md:max-w-8/12 w-full mx-2 h-fit flex flex-row items-center justify-between gap-4 px-4 py-4 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-linear border-2 border-brand-900/40 shadow-[3px_3px_0px_0px_rgba(69,30,0,.40)] rounded-full">
        {/* Product name + selected options */}
        <div className="flex-col hidden sm:flex w-full justify-start items-center gap-1 px-6 flex-1">
          <h5 className="text-brand-900 w-full">{productName || "Product"}</h5>
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
            text="Visit"
            leadicon={<MapPin size={32} />}
            link="/store"
          />
          <MyButton
            type="whatsapp"
            text="Order Via WhatsApp"
            product={product ? { ...product, selectedOptions } : undefined}
          />
        </div>
      </div>

      {/* My Cart */}
      {/* <div className=" w-4/12 px-4 py-4 bg-white/80 backdrop-blur-sm transition-all duration-300 ease-linear border-2 border-brand-900/40 shadow-[3px_3px_0px_0px_rgba(69,30,0,.40)] rounded-full "></div> */}
    </section>
  );
};

export default ProductStickyNav;
