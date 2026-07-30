"use client";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import type { ReviewItem } from "@/types/review";
import { getInitials, getTimeAgo, getDisplayName } from "@/lib/reviewUtils";
import RenderStars from "@/components/review/RenderStars";
import RepeatCustomerModal from "@/components/review/RepeatCustomerModal";

interface ReviewCardProps {
  review: ReviewItem;
  allReviews?: ReviewItem[];
  onProductClick?: (slug: string) => void;
  disableRepeatCustomer?: boolean;
}

// Ensures the reply's displayed "time ago" is never chronologically
// earlier than the review it belongs to — guards against bad/missing
// replyDate values in the source data.
const getSafeReplyTimeAgo = (
  reviewDate?: string,
  replyDate?: string,
): string => {
  if (!replyDate) return getTimeAgo(reviewDate);

  const reviewTime = reviewDate ? new Date(reviewDate).getTime() : 0;
  const replyTime = new Date(replyDate).getTime();

  // If replyDate is invalid or earlier than the review itself,
  // fall back to the review's own date instead of showing something
  // that doesn't make sense (e.g. "1 day ago" reply on a "2 days ago" review).
  if (isNaN(replyTime) || replyTime < reviewTime) {
    return getTimeAgo(reviewDate);
  }

  return getTimeAgo(replyDate);
};

const ReviewCard = ({
  review,
  allReviews = [],
  onProductClick,
  disableRepeatCustomer = false,
}: ReviewCardProps) => {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleProductClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const slug = review.product?.slug?.current;
    if (!slug) return;
    onProductClick ? onProductClick(slug) : router.push(`/products/${slug}`);
  };

  const customerReviews = allReviews.filter(
    (r) => r.username === review.username,
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row w-full gap-10 text-left py-8">
        {/* ── Left: User + Product ── */}
        <div className="w-full lg:w-4/12 gap-4">
          <div className="flex flex-row items-center gap-4">
            <span className="flex w-16 h-16 aspect-square rounded-full bg-yellow-500 items-center justify-center text-brand-900 flex-shrink-0">
              <h5>{getInitials(review.username)}</h5>
            </span>
            <div className="flex flex-col gap-2 w-full">
              <span className="flex flex-wrap gap-4 w-full">
                <p className="text-brand-900">
                  {getDisplayName(review.username)}
                </p>
                <label className="inline-flex items-center gap-1 rounded-full">
                  <span className="flex items-center bg-brand-500 p-1 rounded-full">
                    <Check size={10} strokeWidth={5} className="text-white" />
                  </span>
                  Verified
                </label>
                {review.isRepeatCustomer && !disableRepeatCustomer && (
                  <div
                    onClick={() => setShowModal(true)}
                    className="bg-brand-500/10 px-3 pt-1 pb-1 rounded-full w-fit hover:bg-brand-500/15 cursor-pointer "
                  >
                    <label className="text-brand-900 cursor-pointer ">
                      {" "}
                      Repeat Customer
                    </label>
                  </div>
                )}
              </span>
            </div>
          </div>

          <hr className="my-4 w-full border-brand-900/20" />

          {review.product && (
            <div
              className="flex items-center gap-3 w-full text-left hover:bg-brand-100/50 p-2 rounded-2xl transition-colors cursor-pointer"
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
                  Review for
                </label>
                <p className="text-brand-900 hover:text-brand-500 transition-colors pointer-events-none">
                  {review.product.title}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Review content ── */}
        <div className="flex flex-col w-full lg:w-8/12 gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <RenderStars rating={review.rating || 5} />
            </div>
            <label className="text-neutral-500 flex flex-nowrap justify-end items-center">
              {getTimeAgo(review.reviewDate)}
            </label>
          </div>

          {review.description ? (
            <p className="text-neutral-700 mb-4">{review.description}</p>
          ) : (
            <p className="text-brand-900/40 italic mb-4">
              Rating only - No written review
            </p>
          )}

          {!!review.productReviewImages?.length && (
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

          {review.reply?.message && (
            <div className="flex flex-col gap-1 flex-1 pl-4 border-l-2 border-brand-500/30">
              <div className="flex items-center justify-between">
                <p className="text-neutral-500">Store Owner</p>
                <label className="text-neutral-500">
                  {getSafeReplyTimeAgo(
                    review.reviewDate,
                    review.reply.replyDate,
                  )}
                </label>
              </div>
              <p className="text-neutral-700">{review.reply.message}</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <RepeatCustomerModal
          username={review.username || "Anonymous"}
          reviews={customerReviews}
          onClose={() => setShowModal(false)}
        />
      )}
      <hr className="border-brand-900/20" />
    </>
  );
};

export default ReviewCard;
