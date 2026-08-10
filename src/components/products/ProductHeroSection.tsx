// import VariantSelector from "@/components/ui/VariantSelector";
import MyButton from "@/components/ui/MyButton";
import ProductImageGallerySection from "@/components/products/ProductImageGallerySection";
import { MapPin, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import VariantSelector from "@/components/ui/VariantSelector";
import type { Product, SelectedOptions } from "@/types/product";
import ProductDeliveryStatus from "./ProductDeliveryStatus";
import { useCart } from "@/context/CartContext";
import { buildCartItem } from "@/lib/checkout";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductHeroSectionProps {
  product: Product;
  selectedOptions: SelectedOptions;
  onOptionSelect: (groupName: string, optionName: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

const ProductHeroSection = ({
  product,
  selectedOptions,
  onOptionSelect,
}: ProductHeroSectionProps) => {
  const { addItem } = useCart();
  const router = useRouter();

  const handleBuyNow = () => {
    const item = buildCartItem(product, selectedOptions, 1);
    addItem(item, 1);
    router.push("/checkout");
  };

  return (
    <section className="flex max-w-5xl w-full lg:max-w-full md:h-[80vh] lg:h-[90vh] p-4 flex-col md:flex-row gap-12">
      {/* Left: Image Gallery */}
      <div className="flex w-full md:w-7/12">
        <ProductImageGallerySection
          product={product}
          selectedOptions={selectedOptions}
        />
      </div>

      {/* Right: Product Info */}
      <div className="flex flex-col w-full md:w-5/12 md:min-w-0 md:items-left md:justify-center gap-8">
        {/* Title */}
        <h2 className="text-brand-900 w-fit md:w-full">{product.title}</h2>

        {/* Variant */}
        {(product.variantGroups?.length ?? 0) > 0 && (
          <div className="w-full">
            {product.variantGroups!.map((group, groupIndex) => (
              <VariantSelector
                key={groupIndex}
                group={group}
                selectedOption={selectedOptions[group.groupName]}
                onOptionSelect={(optionName: string) =>
                  onOptionSelect(group.groupName, optionName)
                }
                // layout="grid"
                // columns={2}
              />
            ))}
          </div>
        )}
        {/* Action Buttons */}
        <div className="pt-4 flex flex-col gap-2 w-full ">
          <div className="flex gap-4 w-full flex-wrap">
            {/* <MyButton
              type="primarybutton"
              text="Buy Now"
              leadicon={<ShoppingBag size={20} />}
              onClick={handleBuyNow}
            /> */}

            <MyButton
              type="whatsapp"
              text="Order via WhatsApp"
              product={product ? { ...product, selectedOptions } : null}
            />

            <MyButton
              type="secondarybutton"
              text="Visit"
              leadicon={<MapPin size={32} />}
              link="/store"
            />
          </div>{" "}
          {/* <label className="">Get Reply in 5 min</label> */}
        </div>

        {/* Delivery Section */}
        <ProductDeliveryStatus />
      </div>
    </section>
  );
};

export default ProductHeroSection;
