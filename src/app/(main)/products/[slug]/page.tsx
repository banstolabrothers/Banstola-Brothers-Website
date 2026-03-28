"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { client } from "@/lib/sanity";
import { productDetailQuery } from "@/lib/queries";
import MyButton from "@/components/ui/MyButton";
import ProductHeroSection from "@/components/products/ProductHeroSection";
import ProductContentSection from "@/components/products/ProductContentSection";
import ProductReviewSection from "@/components/review/ProductReviewSection";
import ProductStickyNav from "@/components/header/ProductStickyNav";
import type { Product, SelectedOptions } from "@/types/product";

// ─── Types ────────────────────────────────────────────────────────────────────

// ─── Component ────────────────────────────────────────────────────────────────

const page = () => {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const [product, setProduct] = useState<Product | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    client
      .fetch<Product | null>(productDetailQuery, { slug })
      .then((productData) => {
        if (!productData) {
          setError("Product not found");
          return;
        }

        setProduct(productData);

        // Seed default selections — first in-stock option per group
        if (productData.variantGroups?.length) {
          const defaults: SelectedOptions = {};
          productData.variantGroups.forEach((group) => {
            if (group.options?.length) {
              const first =
                group.options.find((opt) => opt.inStock) ?? group.options[0];
              defaults[group.groupName] = first.optionName;
            }
          });
          setSelectedOptions(defaults);
        }
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleOptionSelect = (groupName: string, optionName: string) => {
    setSelectedOptions((prev) => ({ ...prev, [groupName]: optionName }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg text-neutral-600">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-96 gap-4">
        <div className="text-lg text-red-600">
          {error ?? "Product not found"}
        </div>
        <MyButton
          type="primarybutton"
          text="Back to Products"
          link="/products"
        />
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org/",
    "@type": "Product",
    name: product.title,
    image: product.primaryImage?.asset?.url,
    description: product.metaDescription ?? product.shortDescription,
    sku: product.sku ?? product._id,
    brand: {
      "@type": "Brand",
      name: "Banstola Brothers",
    },
    offers: product.variantGroups?.flatMap((group) =>
      group.options?.map((option) => ({
        "@type": "Offer",
        priceCurrency: option.currency ?? "NPR",
        price: option.price,
        availability: option.inStock
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        sku: `${product._id}-${option.optionName}`,
        url: typeof window !== "undefined" ? window.location.href : "",
      })),
    ),
  };

  return (
    <div className="w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <ProductStickyNav
        productName={product.title}
        selectedOptions={selectedOptions}
        product={product}
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

export default page;
