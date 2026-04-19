"use client";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { productReviewsByIdQuery, allReviewsFullQuery } from "@/lib/queries"; // ← add allReviewsFullQuery
import MyButton from "@/components/ui/MyButton";
import ReviewList from "@/components/review/ReviewList";
import ReviewHeader from "@/components/review/ReviewHeader";
import type { ReviewDoc, ReviewItem } from "@/types/review";
import {
  flattenReviews,
  calculateRatingStats,
  filterAndSortReviews,
  extractCustomerImages,
} from "@/lib/reviewUtils";

interface ProductReviewSectionProps {
  productId: string;
  productSlug?: string;
}

const ProductReviewSection = ({
  productId,
  productSlug,
}: ProductReviewSectionProps) => {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [allReviews, setAllReviews] = useState<ReviewItem[]>([]); // ← add
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [displayCount, setDisplayCount] = useState(3);

  const reviewLink = productSlug
    ? `/submit-reviews?product=${productSlug}`
    : "/submit-reviews";

  useEffect(() => {
    if (!productId) return;

    // ← fetch both in parallel
    Promise.all([
      client.fetch<ReviewDoc[]>(productReviewsByIdQuery, { productId }),
      client.fetch<ReviewDoc[]>(allReviewsFullQuery),
    ])
      .then(([productDocs, allDocs]) => {
        setReviews(flattenReviews(productDocs));
        setAllReviews(flattenReviews(allDocs)); // ← all reviews for modal lookup
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    setDisplayCount(5);
  }, [sortBy, filterBy]);

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-brand-900 mb-4">No Reviews Yet</h3>
          <p className="text-neutral-600 mb-8">
            Be the first to review this product!
          </p>
          <MyButton
            type="primarybutton"
            text="Write a Review"
            link={reviewLink}
          />
        </div>
      </section>
    );
  }

  const filtered = filterAndSortReviews(reviews, filterBy, sortBy);
  const ratingStats = calculateRatingStats(reviews);
  const customerImages = extractCustomerImages(reviews);

  return (
    <section className="flex flex-col w-full max-w-[1440] mx-auto my-20 px-4">
      <ReviewHeader
        ratingStats={ratingStats}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setFilterBy={setFilterBy}
        customerImages={customerImages}
        reviewLink={reviewLink}
        showFilters
        showCustomerImages
      />
      <ReviewList
        reviews={filtered.slice(0, displayCount)}
        allReviews={allReviews} // ← pass full cross-product reviews
        showLoadMore={displayCount < filtered.length}
        onLoadMore={() => setDisplayCount((p) => p + 10)}
        totalReviews={filtered.length}
      />
    </section>
  );
};

export default ProductReviewSection;
