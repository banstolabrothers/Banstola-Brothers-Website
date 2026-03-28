"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { client } from "@/lib/sanity";
import star from "@/assets/svg/star.svg";
import { productListQuery } from "@/lib/queries";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SanityImageAsset {
  _id: string;
  url: string;
}

interface SanityImage {
  asset: SanityImageAsset;
  alt?: string;
}

interface ReviewData {
  totalReviews: number;
  averageRating: number | null;
  ratings: number[];
}

interface Product {
  title: string;
  slug: { current: string };
  shortDescription?: string;
  primaryImage?: SanityImage;
  brand?: string;
  reviewData?: ReviewData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const renderStars = (rating: number, size = "w-4 h-4") => {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src={star.src}
          alt="star"
          className={`${size} ${
            index < Math.round(rating) ? "opacity-100" : "opacity-30"
          }`}
        />
      ))}
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const page = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    client
      .fetch<Product[]>(productListQuery)
      .then((productData) => setAllProducts(productData))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="text-lg text-neutral-600">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col mx-auto max-w-[1280px] px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 my-20">
        {allProducts.length === 0 ? (
          <div className="col-span-full text-center text-neutral-600">
            <p className="text-lg">No products available at the moment.</p>
          </div>
        ) : (
          allProducts.map((product) => {
            const productUrl = `/products/${product.slug?.current}`;
            const hasReviews =
              (product.reviewData?.totalReviews ?? 0) > 0 &&
              product.reviewData?.averageRating != null;

            const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
              const target = e.target as HTMLElement;
              if (target.closest("button") || target.closest("a")) return;
              router.push(productUrl);
            };

            return (
              <div
                key={product.slug.current}
                className="group flex flex-col cursor-pointer relative"
                onClick={handleCardClick}
              >
                {/* Product Image */}
                {product.primaryImage?.asset?.url && (
                  <img
                    src={product.primaryImage.asset.url}
                    alt={product.primaryImage.alt ?? product.title}
                    className="w-full object-cover group-hover:scale-105 transition-all ease-in-out duration-500"
                    loading="lazy"
                  />
                )}

                {/* Product Info */}
                <div className="flex flex-col items-center gap-2 mt-4">
                  <h3 className="text-brand-900 text-center duration-300 ease-in-out">
                    {product.title}
                  </h3>

                  {product.shortDescription && (
                    <p className="text-neutral-800 text-center">
                      {product.shortDescription}
                    </p>
                  )}

                  {hasReviews && product.reviewData?.averageRating != null && (
                    <div className="flex items-center gap-2 text-neutral-600">
                      {renderStars(product.reviewData.averageRating)}
                      <label>
                        {product.reviewData.averageRating.toFixed(1)}
                      </label>
                      <label>({product.reviewData.totalReviews} reviews)</label>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default page;
