"use client";
import { useState, useEffect } from "react";
import ReviewHeader from "@/components/review/ReviewHeader";
import ReviewList from "@/components/review/ReviewList";

// ── Types ────────────────────────────────────────────────────────────────────
interface ReviewItem {
  username?: string;
  rating?: number;
  reviewDate?: string;
  description?: string;
  hasText?: boolean;
  hasImages?: boolean;
  isRepeatCustomer?: boolean;
  productReviewImages?: Array<{ asset?: { url: string }; caption?: string }>;
  reply?: { message: string; replyDate?: string; repliedBy?: string };
  product?: {
    _id?: string;
    title: string;
    slug?: { current: string };
    primaryImage?: { asset?: { url: string } };
  };
  category?: string;
  categoryImage?: string;
}

interface ReviewDoc {
  _id: string;
  product?: {
    _id: string;
    title: string;
    slug?: { current: string };
    primaryImage?: { asset?: { url: string } };
  };
  category?: { title?: string; image?: { asset?: { url: string } } };
  reviews?: Array<{
    username?: string;
    rating?: number;
    reviewDate?: string;
    description?: string;
    productReviewImages?: Array<{ asset?: { url: string }; caption?: string }>;
    reply?: { message: string; replyDate?: string; repliedBy?: string };
  }>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const renderStars = (rating: number, size = "flex w-6 h-6") =>
  Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`text-2xl ${i < rating ? "opacity-100 text-brand-500" : "opacity-30 text-neutral-400"}`}
    >
      ★
    </span>
  ));

const formatDate = (d?: string) =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

const shuffleArray = <T,>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ── Component ────────────────────────────────────────────────────────────────
const ReviewPageClient = ({ allReviews }: { allReviews: ReviewDoc[] }) => {
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [displayCount, setDisplayCount] = useState(10);

  useEffect(() => {
    setDisplayCount(10);
  }, [sortBy, filterBy, selectedProduct, selectedRating]);

  // Unique products for filter
  const products = Array.from(
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

  // Customer images
  const customerImages: { url: string; caption?: string; username: string }[] =
    [];
  allReviews.forEach((doc) => {
    if (selectedProduct !== "all" && doc.product?._id !== selectedProduct)
      return;
    doc.reviews?.forEach((r) => {
      r.productReviewImages?.forEach((img) => {
        if (img?.asset?.url)
          customerImages.push({
            url: img.asset.url,
            caption: img.caption,
            username: r.username || "Anonymous",
          });
      });
    });
  });

  // Build + filter + sort reviews
  const getAllReviews = (): ReviewItem[] => {
    const usernameCount: Record<string, number> = {};
    allReviews.forEach((doc) => {
      doc.reviews?.forEach((r) => {
        const u = r.username || "Anonymous";
        usernameCount[u] = (usernameCount[u] || 0) + 1;
      });
    });

    const out: ReviewItem[] = [];
    allReviews.forEach((doc) => {
      if (selectedProduct !== "all" && doc.product?._id !== selectedProduct)
        return;
      doc.reviews?.forEach((r) => {
        if (selectedRating !== "all" && r.rating !== parseInt(selectedRating))
          return;
        const hasText = !!r.description?.trim();
        const hasImages = !!r.productReviewImages?.length;
        let ok = false;
        if (filterBy === "all") ok = true;
        else if (filterBy === "withText") ok = hasText;
        else if (filterBy === "withImages") ok = hasImages;
        else if (filterBy === "withTextAndImages") ok = hasText && hasImages;
        if (!ok) return;
        out.push({
          ...r,
          product: doc.product,
          category: doc.category?.title,
          categoryImage: doc.category?.image?.asset?.url,
          hasText,
          hasImages,
          isRepeatCustomer: usernameCount[r.username || "Anonymous"] > 1,
        });
      });
    });

    if (sortBy === "newest")
      out.sort(
        (a, b) =>
          new Date(b.reviewDate || 0).getTime() -
          new Date(a.reviewDate || 0).getTime(),
      );
    else if (sortBy === "oldest")
      out.sort(
        (a, b) =>
          new Date(a.reviewDate || 0).getTime() -
          new Date(b.reviewDate || 0).getTime(),
      );
    else if (sortBy === "highest")
      out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    else if (sortBy === "lowest")
      out.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    else return shuffleArray(out);
    return out;
  };

  // Rating stats filtered by product
  const calculateRatingStats = () => {
    const ratings: number[] = [];
    allReviews.forEach((doc) => {
      if (selectedProduct !== "all" && doc.product?._id !== selectedProduct)
        return;
      doc.reviews?.forEach((r) => {
        if (r.rating) ratings.push(r.rating);
      });
    });
    const totalReviews = ratings.length;
    const averageRating =
      totalReviews > 0 ? ratings.reduce((s, r) => s + r, 0) / totalReviews : 0;
    const ratingCounts = [0, 0, 0, 0, 0];
    ratings.forEach((r) => {
      if (r >= 1 && r <= 5) ratingCounts[r - 1]++;
    });
    return {
      totalReviews,
      averageRating,
      ratingCounts: [...ratingCounts].reverse(),
    };
  };

  const reviewsData = getAllReviews();
  const ratingStats = calculateRatingStats();

  return (
    <>
      <ReviewHeader
        ratingStats={ratingStats}
        renderStars={renderStars}
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
        renderStars={renderStars}
        formatDate={formatDate}
        showLoadMore={displayCount < reviewsData.length}
        onLoadMore={() => setDisplayCount((p) => p + 10)}
        totalReviews={reviewsData.length}
      />
    </>
  );
};

export default ReviewPageClient;
