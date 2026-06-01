"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import shadow from "@/assets/svg/shadow.svg";
import { client } from "@/lib/sanity";
import { productReviewsByIdQuery } from "@/lib/queries";
import { flattenReviews, calculateRatingStats } from "@/lib/reviewUtils";
import RenderStars from "@/components/review/RenderStars";
import type { ReviewDoc, RatingStats } from "@/types/review";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Product {
  _id: string;
  title: string;
  slug: { current: string };
  shortDescription?: string;
  primaryImage?: { asset: { _id: string; url: string }; alt?: string };
  brand?: string;
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

// ─── Product Card ─────────────────────────────────────────────────────────────

const ProductCard = ({ product }: { product: Product }) => {
  const router = useRouter();
  const productUrl = `/products/${product.slug?.current}`;

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

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    router.push(productUrl);
  };

  const hasReviews =
    ratingStats !== null &&
    ratingStats.totalReviews > 0 &&
    ratingStats.averageRating != null;

  return (
    <div
      className="group flex flex-col cursor-pointer relative"
      onClick={handleCardClick}
    >
      {product.primaryImage?.asset?.url && (
        <div className="relative w-full aspect-square">
          <Image
            src={product.primaryImage.asset.url}
            alt={product.primaryImage.alt ?? product.title}
            fill
            className="object-cover group-hover:scale-105 transition-all ease-in-out duration-500 z-20"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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

      <div className="flex flex-col items-center gap-2 mt-4">
        <h3 className="text-brand-900 text-center duration-300 ease-in-out">
          {product.title}
        </h3>

        {product.shortDescription && (
          <p className="text-neutral-800 text-center">
            {product.shortDescription}
          </p>
        )}

        {loading ? (
          <StarsSkeleton />
        ) : hasReviews && ratingStats ? (
          <div className="flex items-center gap-2 text-neutral-600">
            <RenderStars rating={ratingStats.averageRating} size={20} />
            <p>{ratingStats.averageRating.toFixed(1)}</p>
            <p>({ratingStats.totalReviews} reviews)</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

// ─── Main client component ────────────────────────────────────────────────────

const ProductsClient = ({ allProducts }: { allProducts: Product[] }) => {
  return (
    <section className="max-w-[1440px] w-full mx-auto p-4 pt-16 pb-24">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {allProducts.length === 0 ? (
          <div className="col-span-full text-center text-neutral-600">
            <p className="text-lg">No products available at the moment.</p>
          </div>
        ) : (
          allProducts.map((product) => (
            <ProductCard key={product.slug.current} product={product} />
          ))
        )}
      </div>
    </section>
  );
};

export default ProductsClient;
