// import VariantSelector from "@/components/ui/VariantSelector";
import MyButton from "@/components/ui/MyButton";
import ProductImageGallerySection from "@/components/products/ProductImageGallerySection";
import { MapPin } from "lucide-react";
import VariantSelector from "@/components/ui/VariantSelector";
import type { Product, SelectedOptions } from "@/types/product";

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
  return (
    <section className="flex max-w-[1280px] w-full lg:max-w-full md:h-[80vh] lg:h-[90vh] mx-auto p-4 flex-col md:flex-row gap-12">
      {/* Left: Image Gallery */}
      <ProductImageGallerySection
        product={product}
        selectedOptions={selectedOptions}
      />

      {/* Right: Product Info */}
      <div className="flex flex-col w-full md:w-6/12 md:items-center md:justify-center gap-8">
        <h2 className="text-brand-900 w-fit md:w-full">{product.title}</h2>

        {(product.variantGroups?.length ?? 0) > 0 && (
          <div className="flex flex-col flex-wrap gap-8 w-full">
            {product.variantGroups!.map((group, groupIndex) => (
              <VariantSelector
                key={groupIndex}
                group={group}
                selectedOption={selectedOptions[group.groupName]}
                onOptionSelect={(optionName: string) =>
                  onOptionSelect(group.groupName, optionName)
                }
                layout="grid"
                columns={2}
              />
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 flex gap-4 w-full flex-wrap">
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
    </section>
  );
};

export default ProductHeroSection;
