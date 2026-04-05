"use client";
import { useEffect, useState } from "react";
import { client } from "@/lib/sanity";
import { productReviewsByIdQuery } from "@/lib/queries"; // 👈
import MyButton from "@/components/ui/MyButton";
import ReviewList from "@/components/review/ReviewList";
import ReviewHeader from "@/components/review/ReviewHeader";

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
    title: string;
    slug?: { current: string };
    primaryImage?: { asset?: { url: string } };
  };
  category?: string;
  categoryImage?: string;
}

interface RatingStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: number[];
}

interface ProductReviewSectionProps {
  productId: string;
  productSlug?: string;
}

interface ReviewDoc {
  reviews?: Array<{
    username?: string;
    rating?: number;
    reviewDate?: string;
    description?: string;
    productReviewImages?: Array<{ asset?: { url: string }; caption?: string }>;
    reply?: { message: string; replyDate?: string; repliedBy?: string };
  }>;
  product?: unknown;
  category?: { title?: string; image?: { asset?: { url?: string } } };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const renderStars = (rating: number) =>
  Array.from({ length: 5 }, (_, i) => (
    <span
      key={i}
      className={`text-2xl ${i < rating ? "opacity-100 text-brand-500" : "opacity-30 text-neutral-400"}`}
    >
      ★
    </span>
  ));

const formatDate = (dateString?: string) => {
  if (!dateString) return "Recent";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
  });
};

// ── Component ────────────────────────────────────────────────────────────────
const ProductReviewSection = ({
  productId,
  productSlug,
}: ProductReviewSectionProps) => {
  const [productReviews, setProductReviews] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");
  const [displayCount, setDisplayCount] = useState(3);

  const reviewLink = productSlug
    ? `/submit-reviews?product=${productSlug}`
    : "/submit-reviews";

  useEffect(() => {
    if (!productId) return;

    client
      .fetch(productReviewsByIdQuery, { productId }) // 👈
      .then((data: ReviewDoc[]) => {
        const usernameCount: Record<string, number> = {};
        data.forEach((doc) => {
          doc.reviews?.forEach((r) => {
            const u = r.username || "Anonymous";
            usernameCount[u] = (usernameCount[u] || 0) + 1;
          });
        });

        const reviews: ReviewItem[] = [];
        data.forEach((doc) => {
          doc.reviews?.forEach((r) => {
            const u = r.username || "Anonymous";
            reviews.push({
              ...r,
              product: doc.product as ReviewItem["product"],
              category: doc.category?.title,
              categoryImage: doc.category?.image?.asset?.url,
              hasText: !!r.description?.trim(),
              hasImages:
                Array.isArray(r.productReviewImages) &&
                r.productReviewImages.length > 0,
              isRepeatCustomer: usernameCount[u] > 1,
            });
          });
        });

        setProductReviews(reviews);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [productId]);

  useEffect(() => {
    setDisplayCount(5);
  }, [sortBy, filterBy]);

  const getCustomerImages = () => {
    const images: { url: string; caption?: string; username: string }[] = [];
    productReviews.forEach((r) => {
      r.productReviewImages?.forEach((img) => {
        if (img?.asset?.url)
          images.push({
            url: img.asset.url,
            caption: img.caption,
            username: r.username || "Anonymous",
          });
      });
    });
    return images;
  };

  const getFilteredAndSorted = () => {
    let filtered = [...productReviews];

    if (filterBy === "withText") filtered = filtered.filter((r) => r.hasText);
    if (filterBy === "withImages")
      filtered = filtered.filter((r) => r.hasImages);
    if (filterBy === "withTextAndImages")
      filtered = filtered.filter((r) => r.hasText && r.hasImages);

    if (sortBy === "newest")
      filtered.sort(
        (a, b) =>
          new Date(b.reviewDate || 0).getTime() -
          new Date(a.reviewDate || 0).getTime(),
      );
    if (sortBy === "oldest")
      filtered.sort(
        (a, b) =>
          new Date(a.reviewDate || 0).getTime() -
          new Date(b.reviewDate || 0).getTime(),
      );
    if (sortBy === "highest")
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sortBy === "lowest")
      filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));

    return filtered;
  };

  const calculateRatingStats = (): RatingStats => {
    const ratings = productReviews
      .map((r) => r.rating)
      .filter(Boolean) as number[];
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

  if (loading) {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500" />
      </div>
    );
  }

  if (productReviews.length === 0) {
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

  const filtered = getFilteredAndSorted();
  const ratingStats = calculateRatingStats();

  return (
    <section className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <ReviewHeader
          ratingStats={ratingStats}
          renderStars={renderStars}
          sortBy={sortBy}
          setSortBy={setSortBy}
          setFilterBy={setFilterBy}
          customerImages={getCustomerImages()}
          reviewLink={reviewLink}
          showFilters
          showCustomerImages
        />
        <ReviewList
          reviews={filtered.slice(0, displayCount)}
          renderStars={renderStars}
          formatDate={formatDate}
          showLoadMore={displayCount < filtered.length}
          onLoadMore={() => setDisplayCount((p) => p + 10)}
          totalReviews={filtered.length}
        />
      </div>
    </section>
  );
};

export default ProductReviewSection;
