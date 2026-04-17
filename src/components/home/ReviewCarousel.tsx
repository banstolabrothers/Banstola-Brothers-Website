"use client";
import Image from "next/image";
import RenderStars from "@/components/review/RenderStars";
import type { HomeReviewItem } from "@/components/home/HomeReviewSection";
import { getDisplayName } from "@/lib/reviewUtils";

// ── TestimonialCard ───────────────────────────────────────────────────────────

const TestimonialCard = ({
  review,
  cardIndex,
}: {
  review: HomeReviewItem;
  cardIndex: number;
}) => (
  <div
    className={`flex flex-col w-96 flex-shrink-0 bg-brand-100/40 rounded-[32px] px-8 py-10 text-center justify-between transition-all duration-300 hover:-translate-y-1 h-[500px] ${
      cardIndex % 2 === 0 ? "mb-8" : "mt-8"
    }`}
  >
    <div className="flex items-center justify-center gap-1 mb-4">
      <RenderStars size={32} rating={review.rating || 5} />
    </div>

    <p className="text-neutral-800">&ldquo;{review.description}&rdquo;</p>
    <div className="flex flex-col w-full gap-2 mt-4">
      <h5 className="text-brand-900">{getDisplayName(review.username)}</h5>
      {review.productTitle && (
        <div className="flex items-center justify-center gap-3">
          {review.productImage && (
            <Image
              src={review.productImage}
              alt={review.productTitle}
              width={40}
              height={40}
              className="object-cover rounded-lg"
            />
          )}
          <p className="text-neutral-600 truncate">{review.productTitle}</p>
        </div>
      )}
    </div>
  </div>
);

// ── ReviewCarousel ────────────────────────────────────────────────────────────

const ReviewCarousel = ({ reviews }: { reviews: HomeReviewItem[] }) => {
  const row = reviews.slice(0, Math.ceil(reviews.length / 2));

  return (
    <>
      <div className="flex gap-1 mb-1 animate-scroll-left">
        {[...row, ...row].map((review, i) => (
          <TestimonialCard key={`r-${i}`} review={review} cardIndex={i} />
        ))}
      </div>

      <style>{`
        @keyframes scroll-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left {
          animation: scroll-left 60s linear infinite;
          width: fit-content;
        }
      `}</style>
    </>
  );
};

export default ReviewCarousel;
