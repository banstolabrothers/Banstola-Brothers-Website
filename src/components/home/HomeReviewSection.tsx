import { MoveRightIcon } from "lucide-react";
import { client } from "@/lib/sanity";
import { allReviewsQuery } from "@/lib/queries";
import { shuffleArray } from "@/lib/reviewUtils";
import ReviewCarousel from "./ReviewCarousel";
import MyButton from "@/components/ui/MyButton";
import type { ReviewDoc } from "@/types/review";

// ── Types ────────────────────────────────────────────────────────────────────

export interface HomeReviewItem {
  description: string;
  username: string;
  rating: number;
  productTitle?: string;
  productImage?: string;
}

// ── Component ────────────────────────────────────────────────────────────────

const HomeReviewSection = async () => {
  const allReviews = await client.fetch<ReviewDoc[]>(allReviewsQuery);

  const totalCount = allReviews.reduce(
    (acc, doc) => acc + (doc.reviews?.length ?? 0),
    0,
  );

  const reviewsWithDescriptions: HomeReviewItem[] = [];
  allReviews.forEach((doc) => {
    doc.reviews?.forEach((review) => {
      if (review.description?.trim()) {
        reviewsWithDescriptions.push({
          description: review.description,
          username: review.username ?? "Anonymous",
          rating: review.rating ?? 5,
          productTitle: doc.product?.title,
          productImage: doc.product?.primaryImage?.asset?.url,
        });
      }
    });
  });

  const shuffled = shuffleArray(reviewsWithDescriptions);

  if (!shuffled.length) return null;

  return (
    <section className="py-32 px-4 h-fit overflow-hidden">
      <div className="w-full mx-auto">
        <div className="flex items-center justify-between max-w-7xl mx-auto mb-16">
          <h2 className="text-brand-900">
            {totalCount.toLocaleString()}+ reviews
          </h2>
          <MyButton
            type="primarybutton"
            text="View all reviews"
            link="/all-reviews"
            trailicon={<MoveRightIcon size={32} />}
          />
        </div>
        <ReviewCarousel reviews={shuffled} />
      </div>
    </section>
  );
};

export default HomeReviewSection;
