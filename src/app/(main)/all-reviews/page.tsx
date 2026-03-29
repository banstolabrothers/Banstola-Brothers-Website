import type { Metadata } from "next";
import { client } from "@/lib/sanity";
import ReviewPageClient from "@/components/review/ReviewpageClient";

// src/app/all-reviews/page.tsx
import { pageMeta } from "@/lib/metadata";
export const metadata = pageMeta.allReviews;

// ── Server fetch ─────────────────────────────────────────────────────────────
const ReviewPage = async () => {
  const allReviews = await client.fetch(`
    *[_type == "review"]{
      _id,
      product->{ _id, title, slug, primaryImage{ asset->{ _id, url } } },
      category->{ title, image{ asset->{ _id, url } } },
      reviews[]{
        reviewDate, description, username, rating,
        productReviewImages[]{ asset->{ _id, url }, caption },
        reply{ message, replyDate, repliedBy }
      }
    }
  `);

  return (
    <div className="w-full flex flex-col">
      <div className="flex flex-col text-center my-20">
        <h1>Love from Customer&apos;s</h1>
      </div>
      <section className="max-w-6xl w-full mx-auto px-4">
        {/* All filtering/sorting logic is client-side */}
        <ReviewPageClient allReviews={allReviews} />
      </section>
    </div>
  );
};

export default ReviewPage;
