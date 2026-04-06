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
    <section className="h-fit flex flex-col gap-12 py-32 justify-center items-center overflow-hidden">
      <div className="flex flex-col md:flex-row md:text-center items-center justify-center gap-8">
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
    </section>
  );
};

export default HomeReviewSection;
