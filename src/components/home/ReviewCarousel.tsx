"use client";
import Image from "next/image";
import star from "@/assets/svg/star.svg";

interface ReviewItem {
  description: string;
  username: string;
  rating: number;
  productTitle?: string;
  productImage?: string;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center justify-center gap-1 mb-4">
    {Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={` ${i < rating ? "opacity-100" : "opacity-30"}`}>
        <Image src={star} alt="star image" />
      </span>
    ))}
  </div>
);

const TestimonialCard = ({
  review,
  cardIndex,
}: {
  review: ReviewItem;
  cardIndex: number;
}) => {
  const margin = cardIndex % 2 === 0 ? "mb-8" : "mt-8";

  return (
    <div
      className={`flex flex-col w-96 flex-shrink-0 bg-brand-100/40 rounded-[32px] px-8 py-10 text-center justify-between transition-all duration-300 hover:-translate-y-1 h-[500px] ${margin}`}
    >
      <StarRating rating={review.rating} />
      <p className="text-neutral-800">&ldquo;{review.description}&rdquo;</p>
      <div className="flex flex-col w-full gap-2 mt-4">
        <h4 className="text-brand-900">{review.username || "Anonymous"}</h4>
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
};

const ReviewCarousel = ({ reviews }: { reviews: ReviewItem[] }) => {
  const half = Math.ceil(reviews.length / 2);
  const row = reviews.slice(0, half);

  return (
    <>
      {/* Duplicate cards for seamless infinite scroll */}
      <div className="flex gap-1 mb-1 animate-scroll-left">
        {[...row, ...row].map((review, i) => (
          <TestimonialCard key={`r1-${i}`} review={review} cardIndex={i} />
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
