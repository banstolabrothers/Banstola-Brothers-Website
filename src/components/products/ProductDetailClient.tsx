"use client";
import { useState } from "react";
import MyButton from "@/components/ui/MyButton";
import ProductHeroSection from "@/components/products/ProductHeroSection";
import ProductContentSection from "@/components/products/ProductContentSection";
import ProductReviewSection from "@/components/review/ProductReviewSection";
import type { Product, SelectedOptions } from "@/types/product";

interface Props {
  product: Product | null;
  slug: string;
}

const ProductDetailClient = ({ product }: Props) => {
  const getDefaultSelections = (p: Product): SelectedOptions => {
    const defaults: SelectedOptions = {};
    p.variantGroups?.forEach((group) => {
      if (group.options?.length) {
        const first = group.options.find((o) => o.inStock) ?? group.options[0];
        defaults[group.groupName] = first.optionName;
      }
    });
    return defaults;
  };

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(
    product ? getDefaultSelections(product) : {},
  );

  const handleOptionSelect = (groupName: string, optionName: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupName]: optionName }));
  };

  if (!product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96 gap-4">
        <div className="text-lg text-red-600">Product not found</div>
        <MyButton
          type="primarybutton"
          text="Back to Products"
          link="/products"
        />
      </div>
    );
  }

  return (
    <section className="relative w-full">
      <ProductHeroSection
        product={product}
        selectedOptions={selectedOptions}
        onOptionSelect={handleOptionSelect}
      />
      {(product.content?.length ?? 0) > 0 && (
        <ProductContentSection content={product.content!} />
      )}
      <ProductReviewSection
        productId={product._id}
        productSlug={product.slug?.current}
      />
    </section>
  );
};

export default ProductDetailClient;
