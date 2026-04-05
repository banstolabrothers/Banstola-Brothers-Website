"use client";
import { useState, useEffect } from "react";
import ReviewHeader from "@/components/review/ReviewHeader";
import ReviewList from "@/components/review/ReviewList";
import type { ReviewDoc, ReviewItem, ProductFilter } from "@/types/review";
import {
  flattenReviews,
  calculateRatingStats,
  filterAndSortReviews,
  extractCustomerImages,
  shuffleArray,
} from "@/lib/reviewUtils";

// ── Types ────────────────────────────────────────────────────────────────────

interface ReviewPageClientProps {
  allReviews: ReviewDoc[];
}

// ── Component ────────────────────────────────────────────────────────────────

const ReviewPageClient = ({ allReviews }: ReviewPageClientProps) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    setDisplayCount(10);
  }, [sortBy, filterBy, selectedProduct, selectedRating]);

  // ── Unique products list for the filter ──
  const products: ProductFilter[] = Array.from(
    new Map(
      allReviews
        .filter((d) => d.product?._id)
        .map((d) => [
          d.product!._id,
          {
            id: d.product!._id,
            name: d.product!.title,
            slug: d.product!.slug,
            image: d.product!.primaryImage?.asset?.url,
          },
        ]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name));

  // ── Filter docs by selected product then flatten ──
  const filteredDocs =
    selectedProduct === "all"
      ? allReviews
      : allReviews.filter((d) => d.product?._id === selectedProduct);

  const allFlatReviews = flattenReviews(filteredDocs);

  // ── Apply rating filter ──
  const ratingFiltered =
    selectedRating === "all"
      ? allFlatReviews
      : allFlatReviews.filter((r) => r.rating === parseInt(selectedRating));

  // ── Apply content filter + sort (shuffle handled separately) ──
  const reviewsData =
    sortBy === "random"
      ? shuffleArray(ratingFiltered)
      : filterAndSortReviews(ratingFiltered, filterBy, sortBy);

  const ratingStats = calculateRatingStats(allFlatReviews);
  const customerImages = extractCustomerImages(allFlatReviews);

  return (
    <>
      <ReviewHeader
        ratingStats={ratingStats}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setFilterBy={setFilterBy}
        customerImages={customerImages}
        reviewLink="/submit-reviews"
        showFilters
        showCustomerImages
        products={products}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
      />
      <ReviewList
        reviews={reviewsData.slice(0, displayCount)}
        showLoadMore={displayCount < reviewsData.length}
        onLoadMore={() => setDisplayCount((p) => p + 10)}
        totalReviews={reviewsData.length}
      />
    </>
  );
};

export default ReviewPageClient;
