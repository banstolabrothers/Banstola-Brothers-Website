import { client } from "@/lib/sanity";
import { pageMeta } from "@/lib/metadata";
import { allReviewsFullQuery } from "@/lib/queries";
import type { ReviewDoc } from "@/types/review";
import ReviewPageClient from "@/components/review/ReviewPageClient";

export const metadata = pageMeta.allReviews;
export const revalidate = 60;

const ReviewPage = async () => {
  const allReviews: ReviewDoc[] = await client.fetch(allReviewsFullQuery);

  return (
    <section className="flex flex-col w-full max-w-[1440] mx-auto my-20 px-4 ">
      <ReviewPageClient allReviews={allReviews} />
    </section>
  );
};

export default ReviewPage;
