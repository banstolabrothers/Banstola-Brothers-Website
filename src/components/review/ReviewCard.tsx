"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────
interface ReviewImage {
  asset?: { url: string };
  caption?: string;
}

interface Review {
  username?: string;
  rating?: number;
  reviewDate?: string;
  description?: string;
  productReviewImages?: ReviewImage[];
  reply?: { message: string; replyDate?: string; repliedBy?: string };
  product?: {
    title: string;
    slug?: { current: string };
    primaryImage?: { asset?: { url: string } };
  };
  isRepeatCustomer?: boolean;
}

interface ReviewCardProps {
  review: Review;
  renderStars: (rating: number, size?: string) => React.ReactNode;
  formatDate?: (date: string) => string;
  isRepeatCustomer?: boolean;
  onProductClick?: (slug: string) => void;
}

// ── Helpers ──────────────────────────────────────────────────────────────────
const getTimeAgo = (date?: string) => {
  if (!date) return "Recent";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [string, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, s] of intervals) {
    const n = Math.floor(seconds / s);
    if (n >= 1) return `${n} ${unit}${n > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

const getInitials = (name?: string) => {
  if (!name) return "A";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// ── Component ────────────────────────────────────────────────────────────────
const ReviewCard = ({
  review,
  renderStars,
  isRepeatCustomer,
  onProductClick,
}: ReviewCardProps) => {
  const router = useRouter();
  const hasReply = review.reply?.message;

  const handleProductClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const slug = review.product?.slug?.current;
    if (!slug) return;
    if (onProductClick) {
      onProductClick(slug);
    } else {
      router.push(`/products/${slug}`); // ← replaces window.location.href
    }
  };

  return (
    <div className="flex flex-col lg:flex-row w-full bg-brand-100/50 hover:bg-brand-100/80 rounded-3xl p-6 transition-all duration-150 gap-10 text-left">
      {/* ── Left: User + Product ── */}
      <div className="w-full lg:w-4/12 gap-4">
        {/* User info */}
        <div className="flex flex-row items-center gap-4">
          <span className="flex w-16 h-16 aspect-square rounded-full bg-yellow-500 items-center justify-center text-neutral-900 flex-shrink-0">
            <h4>{getInitials(review.username)}</h4>
          </span>
          <div className="flex flex-col gap-1 w-full">
            <span className="flex flex-wrap gap-4 w-full">
              <h4 className="text-neutral-900">
                {review.username || "Anonymous"}
              </h4>
              <label className="inline-flex items-center gap-1 rounded-full">
                <span className="flex items-center bg-brand-500 p-1 rounded-full">
                  <Check size={10} strokeWidth={5} className="text-white" />
                </span>
                Verified
              </label>
            </span>
            {isRepeatCustomer && (
              <label className="bg-brand-100 text-amber-700 px-2 py-1 rounded-full w-fit">
                Repeat Customer
              </label>
            )}
          </div>
        </div>

        <hr className="my-4 w-full border-brand-900/20" />

        {/* Product info */}
        {review.product && (
          <div
            className="flex items-center gap-3 w-full text-left hover:bg-white/50 p-2 rounded-lg transition-colors cursor-pointer"
            onClick={handleProductClick}
          >
            {review.product.primaryImage?.asset?.url && (
              <Image
                src={review.product.primaryImage.asset.url}
                alt={review.product.title}
                width={64}
                height={64}
                className="w-16 aspect-square rounded object-cover"
              />
            )}
            <div className="flex flex-col">
              <label className="text-neutral-500 pointer-events-none">
                Purchased item
              </label>
              <h4 className="text-neutral-900 hover:text-brand-500 transition-colors pointer-events-none">
                {review.product.title}
              </h4>
            </div>
          </div>
        )}
      </div>

      {/* ── Right: Review content ── */}
      <div className="flex flex-col w-full lg:w-8/12 gap-4">
        {/* Rating + date */}
        <div className="flex items-center justify-between">
          <div className="flex items-center w-full">
            {renderStars(review.rating || 5)}
          </div>
          <label className="text-neutral-500 flex flex-nowrap w-full justify-end items-center">
            {getTimeAgo(review.reviewDate)}
          </label>
        </div>

        {/* Review text */}
        {review.description ? (
          <p className="text-neutral-700 mb-4">{review.description}</p>
        ) : (
          <p className="text-brand-900/40 italic mb-4">
            Rating only - No written review
          </p>
        )}

        {/* Review images */}
        {review.productReviewImages &&
          review.productReviewImages.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {review.productReviewImages.map((img, i) =>
                img?.asset?.url ? (
                  <Image
                    key={i}
                    src={img.asset.url}
                    alt={img.caption || `Review image ${i + 1}`}
                    width={120}
                    height={120}
                    className="rounded-xl object-cover w-28 h-28"
                  />
                ) : null,
              )}
            </div>
          )}

        {/* Store reply */}
        {hasReply && (
          <div className="flex flex-col gap-1 flex-1 pl-4 border-l-2 border-brand-500/30">
            <div className="flex items-center justify-between">
              <h6>Store Owner</h6>
              <label className="text-neutral-500">
                {getTimeAgo(review.reply?.replyDate)}
              </label>
            </div>
            <label className="text-neutral-700">{review.reply?.message}</label>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
