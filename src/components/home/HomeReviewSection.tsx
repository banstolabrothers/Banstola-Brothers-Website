import { MoveRightIcon } from "lucide-react";
import { client } from "@/lib/sanity";
import ReviewCarousel from "./ReviewCarousel";
import MyButton from "@/components/ui/MyButton";

interface ReviewItem {
  description: string;
  username: string;
  rating: number;
  productTitle?: string;
  productImage?: string;
}

interface ReviewDoc {
  _id: string;
  product?: {
    title: string;
    primaryImage?: { asset?: { url: string } };
  };
  reviews?: Array<{
    username: string;
    rating: number;
    description?: string;
  }>;
}

// ✅ Server component — data fetched on the server, no useEffect/useState
const HomeReviewSection = async () => {
  const allReviews = await client.fetch<ReviewDoc[]>(
    `*[_type == "review"]{
      _id,
      product->{
        title,
        primaryImage{
          asset->{ _id, url }
        }
      },
      reviews[]{
        username,
        rating,
        description
      }
    }`,
  );

  // Total review count
  const totalCount = allReviews.reduce(
    (acc, doc) => acc + (doc.reviews?.length ?? 0),
    0,
  );

  // Flatten reviews with descriptions
  const reviewsWithDescriptions: ReviewItem[] = [];
  allReviews.forEach((doc) => {
    doc.reviews?.forEach((review) => {
      if (review.description?.trim()) {
        reviewsWithDescriptions.push({
          description: review.description,
          username: review.username,
          rating: review.rating,
          productTitle: doc.product?.title,
          productImage: doc.product?.primaryImage?.asset?.url,
        });
      }
    });
  });

  // Shuffle server-side (deterministic enough for SSR)
  const shuffled = [...reviewsWithDescriptions].sort(() => Math.random() - 0.5);

  if (!shuffled.length) return null;

  return (
    <section className="py-32 px-4 h-fit overflow-hidden">
      <div className="w-full mx-auto">
        {/* Header */}
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

        {/* Animated carousel — client component */}
        <ReviewCarousel reviews={shuffled} />
      </div>
    </section>
  );
};

export default HomeReviewSection;
