"use client";
import { useState } from "react";
import Image from "next/image";
import { MoveRightIcon } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import type { Product, Category } from "@/types/product";
import shadow from "@/assets/svg/shadow.svg";

interface Props {
  allProducts: Product[];
  allCategories: Category[];
}

const ProductByCategoryClient = ({ allProducts, allCategories }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    allCategories[0]?.slug?.current ?? null,
  );

  const filteredProducts = allProducts.filter(
    (product) => product.category?.slug?.current === selectedCategory,
  );

  return (
    <section className="flex flex-col max-w-4xl mx-auto my-auto py-24 px-4 gap-8">
      {/* ── Category filter buttons ── */}
      <div className="flex gap-3 p-2 justify-center flex-wrap">
        {allCategories.map((category) => (
          <MyButton
            key={category.slug.current}
            type="category"
            category={category}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            showTextWhenSelected={true}
          />
        ))}
      </div>

      {/* ── Product list ── */}
      <div className="flex flex-col h-full gap-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-neutral-600 py-12">
            <p className="text-lg">No products found in this category.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.slug.current}
              className="flex-col gap-4 h-full items-center justify-center"
            >
              {/* Product image */}
              {product.primaryImage?.asset?.url && (
                <div className="relative w-full flex items-center justify-center">
                  <Image
                    src={product.primaryImage.asset.url}
                    alt={product.primaryImage.alt ?? product.title}
                    width={800}
                    height={560}
                    className="mx-auto h-[680] w-auto object-cover rounded-lg"
                    loading="lazy"
                  />
                  <Image
                    src={shadow}
                    alt="Product Showcase Shadow"
                    className="absolute bottom-0 left-0 right-0 min-h-16 z-10"
                    loading="lazy"
                  />
                </div>
              )}

              {/* Product info */}
              <div className="flex flex-col text-center justify-center items-center w-full gap-8 mt-4">
                <div className="flex flex-col gap-1">
                  <h2 className="text-brand-900">{product.title}</h2>
                  {product.shortDescription && (
                    <p className="text-neutral-800">
                      {product.shortDescription}
                    </p>
                  )}
                </div>

                <MyButton
                  type="primarybutton"
                  text={`View ${product.title}`}
                  link={`/products/${product.slug.current}`}
                  trailicon={<MoveRightIcon size={32} />}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default ProductByCategoryClient;
