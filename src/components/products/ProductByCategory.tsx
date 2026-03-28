"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { allProductsQuery, allCategoriesQuery } from "@/lib/queries";
import type {
  Product,
  CategoryRef,
  VariantOption,
  VariantGroup,
} from "@/types/product";

import MyButton from "@/components/ui/MyButton";
import shadow from "../../../public/image/homepage/shadow.svg";
import { MoveRightIcon } from "lucide-react";

// ─── Component ────────────────────────────────────────────────────────────────

const ProductByCategory = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  // ✅ Track by slug.current — your queries don't return _id on categories
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productData, categoryData] = await Promise.all([
          client.fetch<Product[]>(allProductsQuery),
          client.fetch<Category[]>(allCategoriesQuery),
        ]);

        setAllProducts(productData);
        setAllCategories(categoryData);

        // ✅ Seed with first category's slug, not _id
        setSelectedCategory(categoryData[0]?.slug?.current ?? null);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Filter by slug — this is what actually exists on the projected category object
  const filteredProducts = allProducts.filter(
    (product) => product.category?.slug?.current === selectedCategory,
  );

  // ─── Loading Skeleton ────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex flex-col mx-auto h-full w-full py-24 max-w-[1280px] lg:max-w-[1920px] gap-8">
        <div className="flex gap-2 p-2 justify-center flex-wrap">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="flex items-center rounded-full animate-pulse"
            >
              <div
                className={`h-20 bg-brand-500/20 rounded-full ${
                  index === 0 ? "w-48" : "w-20"
                }`}
              />
            </div>
          ))}
        </div>
        <div className="flex flex-col h-full gap-16 p-4 w-full">
          <div className="flex-row md:flex gap-10 h-full w-full items-center justify-center animate-pulse">
            <div className="relative h-96 aspect-square bg-brand-500/20 rounded-3xl" />
            <div className="p-6 flex flex-col text-center md:text-left w-full justify-center md:justify-normal items-center md:items-start md:w-1/2 gap-8">
              <div className="flex flex-col gap-4 w-full">
                <div className="h-8 bg-brand-500/20 rounded-3xl w-3/4" />
                <div className="h-4 bg-brand-500/20 rounded-3xl w-full" />
                <div className="h-4 bg-brand-500/20 rounded-3xl w-2/3" />
                <div className="h-6 bg-brand-500/20 rounded-3xl w-1/2" />
              </div>
              <div className="h-12 bg-brand-500/20 rounded-3xl w-40" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <section className="flex flex-col max-w-4xl mx-auto my-auto py-24 px-4 gap-8">
      {/* Category Filter */}
      <div className="flex gap-3 p-2 justify-center flex-wrap">
        {allCategories.map((category) => (
          <MyButton
            key={category.slug.current} // ✅ slug as key, no _id
            type="category"
            category={category}
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
            showTextWhenSelected={true}
          />
        ))}
      </div>

      {/* Product List */}
      <div className="flex flex-col h-full gap-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-neutral-600 py-12">
            <p className="text-lg">No products found in this category.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.slug.current} // ✅ slug as key, no _id
              className="flex-col gap-4 h-full items-center justify-center"
            >
              {/* Product Image */}
              {product.primaryImage?.asset?.url && (
                <div className="relative w-full h-full items-center justify-center">
                  <img
                    src={product.primaryImage.asset.url}
                    alt={product.primaryImage.alt ?? product.title}
                    className="flex mx-auto h-[560px] object-cover rounded-lg"
                    loading="lazy"
                  />
                  <img
                    src={shadow.src} // ✅ Next.js static import needs .src
                    className="absolute left-0 right-0 bottom-4 opacity-60"
                    alt=""
                  />
                </div>
              )}

              {/* Product Info */}
              <div className="flex flex-col text-center justify-center items-center w-full gap-8">
                <div className="flex flex-col gap-1">
                  <h2 className="text-neutral-900">{product.title}</h2>
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

export default ProductByCategory;
