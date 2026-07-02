import { MoveRightIcon } from "lucide-react";
import { client } from "@/lib/sanity";
import { allReviewsQuery } from "@/lib/queries";
import { shuffleArray } from "@/lib/reviewUtils";
import MyButton from "@/components/ui/MyButton";
import type { ReviewDoc, HomeReviewItem } from "@/types/review";
import SectionCarousel from "../ui/SectionCarousel";

// ── HomeReviewSection (server component) ─────────────────────────────────────
// Fetches + shapes data, then hands plain serialisable arrays to the client
// carousel. No functions or JSX cross the server/client boundary.

const HomeReviewSection = async () => {
  const allReviews = await client.fetch<ReviewDoc[]>(
    allReviewsQuery,
    {},
    { next: { revalidate: 60 } },
  );

  const totalReviews = allReviews.reduce(
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
  const row = shuffled.slice(0, Math.ceil(shuffled.length / 2));

  if (!row.length) return null;

  return (
    <section className="h-fit flex flex-col gap-12 py-32 justify-center items-center overflow-hidden">
      <div className="flex flex-col md:flex-row md:text-center items-center justify-center gap-8">
        <h2 className="text-brand-900">
          {totalReviews.toLocaleString()}+ reviews
        </h2>
        <MyButton
          type="primarybutton"
          text="View all reviews"
          link="/all-reviews"
          trailicon={<MoveRightIcon size={32} />}
        />
      </div>

      {/* Client component — receives only plain data */}
      <SectionCarousel variant="reviews" items={row} />
    </section>
  );
};

export default HomeReviewSection;
