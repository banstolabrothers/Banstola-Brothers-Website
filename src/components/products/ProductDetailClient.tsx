"use client";
import { useState } from "react";
import MyButton from "@/components/ui/MyButton";
import ProductHeroSection from "@/components/products/ProductHeroSection";
import ProductContentSection from "@/components/products/ProductContentSection";
import ProductReviewSection from "@/components/review/ProductReviewSection";
import ProductStickyNav from "@/components/header/ProductStickyNav";
import type { Product, SelectedOptions } from "@/types/product";

// ── JSON-LD structured data ───────────────────────────────────────────────────
const ProductSchema = ({ product }: { product: Product }) => {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.primaryImage?.asset?.url,
    description: product.shortDescription,
    sku: product.sku ?? product._id,
    brand: { "@type": "Brand", name: "Banstola Brothers" },
    offers: product.variantGroups?.flatMap((group) =>
      group.options?.map((option) => ({
        "@type": "Offer",
        priceCurrency: option.currency ?? "NPR",
        price: option.price,
        availability: option.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        sku: `${product._id}-${option.optionName}`,
      })),
    ),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// ── Main client component ─────────────────────────────────────────────────────
interface ProductDetailClientProps {
  product: Product | null;
  slug: string;
}

const ProductDetailClient = ({ product, slug }: ProductDetailClientProps) => {
  // Seed default selections — first in-stock option per group
  const getDefaultSelections = (p: Product): SelectedOptions => {
    const defaults: SelectedOptions = {};
    p.variantGroups?.forEach((group) => {
      if (group.options?.length) {
        const first =
          group.options.find((opt) => opt.inStock) ?? group.options[0];
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

  // Error state
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
    <div className="w-full">
      <ProductSchema product={product} />

      <ProductStickyNav
        productName={product.title}
        selectedOptions={selectedOptions}
        product={product as unknown as Record<string, unknown>}
      />

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
    </div>
  );
};

export default ProductDetailClient;
