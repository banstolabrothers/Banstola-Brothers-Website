"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MoveRightIcon } from "lucide-react";
import MyButton from "@/components/ui/MyButton";
import type { Product, Category } from "@/types/product";
import shadow from "@/assets/svg/shadow.svg";
import type { ReviewDoc, RatingStats } from "@/types/review";
import { flattenReviews, calculateRatingStats } from "@/lib/reviewUtils";
import { productReviewsByIdQuery } from "@/lib/queries";
import { client } from "@/lib/sanity";
import RenderStars from "@/components/review/RenderStars";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  allProducts: Product[];
  allCategories: Category[];
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const StarsSkeleton = () => (
  <div className="flex items-center gap-2 animate-pulse">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className="text-lg text-neutral-200">
        ★
      </span>
    ))}
    <span className="inline-block w-8 h-3 bg-neutral-200 rounded" />
    <span className="inline-block w-20 h-3 bg-neutral-200 rounded" />
  </div>
);

// ─── Product row ──────────────────────────────────────────────────────────────

const ProductRow = ({ product }: { product: Product }) => {
  const [ratingStats, setRatingStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!product._id) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    client
      .fetch<ReviewDoc[]>(productReviewsByIdQuery, { productId: product._id })
      .then((docs) => {
        if (cancelled) return;
        const items = flattenReviews(docs);
        setRatingStats(items.length > 0 ? calculateRatingStats(items) : null);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [product._id]);

  const hasReviews =
    ratingStats !== null &&
    ratingStats.totalReviews > 0 &&
    ratingStats.averageRating != null;

  return (
    <div className="flex flex-col lg:flex-row gap-4 md:gap-16 h-full w-full items-center justify-center">
      {/* Image */}
      {product.primaryImage?.asset?.url && (
        <div className="relative w-full flex items-center justify-center">
          <Image
            src={product.primaryImage.asset.url}
            alt={product.primaryImage.alt ?? product.title}
            width={800}
            height={560}
            className="mx-auto max-h-[680] w-auto object-cover rounded-lg"
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
      {/* Product Content */}
      <div className="flex flex-col text-center md:text-left justify-center items-center md:items-start w-full gap-8 mt-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-brand-900">{product.title}</h2>
          {product.shortDescription && (
            <p className="text-neutral-800">{product.shortDescription}</p>
          )}
        </div>

        {loading ? (
          <StarsSkeleton />
        ) : hasReviews && ratingStats ? (
          <div className="flex items-center gap-2 w-full text-neutral-600">
            <RenderStars rating={ratingStats.averageRating} size={20} />
            <p>{ratingStats.averageRating.toFixed(1)}</p>
            <p>({ratingStats.totalReviews} reviews)</p>
          </div>
        ) : null}

        <MyButton
          type="primarybutton"
          text={`View ${product.title}`}
          link={`/products/${product.slug.current}`}
          trailicon={<MoveRightIcon size={32} />}
        />
      </div>
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────

const ProductByCategoryClient = ({ allProducts, allCategories }: Props) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    allCategories[0]?.slug?.current ?? null,
  );

  const filteredProducts = allProducts.filter(
    (product) => product.category?.slug?.current === selectedCategory,
  );

  return (
    <section className="flex flex-col max-w-[1080] mx-auto my-auto py-24 px-4 gap-8">
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

      <div className="flex flex-col h-full gap-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center text-neutral-600 py-12">
            <p className="text-lg">No products found in this category.</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductRow key={product.slug.current} product={product} />
          ))
        )}
      </div>
    </section>
  );
};

export default ProductByCategoryClient;
