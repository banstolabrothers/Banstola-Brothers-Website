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
    <div className="w-full flex flex-col">
      <div className="flex flex-col text-center my-20">
        <h1>Love from Customer&apos;s</h1>
      </div>
      <section className="max-w-6xl w-full mx-auto px-4">
        <ReviewPageClient allReviews={allReviews} />
      </section>
    </div>
  );
};

export default ReviewPage;
