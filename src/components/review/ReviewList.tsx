import MyButton from "@/components/ui/MyButton";
import ReviewCard from "./ReviewCard";

// ── Types ────────────────────────────────────────────────────────────────────
interface Review {
  username?: string;
  rating?: number;
  reviewDate?: string;
  description?: string;
  isRepeatCustomer?: boolean;
  productReviewImages?: Array<{ asset?: { url: string }; caption?: string }>;
  reply?: { message: string; replyDate?: string };
  product?: {
    title: string;
    slug?: { current: string };
    primaryImage?: { asset?: { url: string } };
  };
}

interface ReviewListProps {
  reviews: Review[];
  renderStars: (rating: number, size?: string) => React.ReactNode;
  formatDate?: (date: string) => string;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  totalReviews?: number;
}

// ── Component ────────────────────────────────────────────────────────────────
const ReviewList = ({
  reviews,
  renderStars,
  formatDate,
  showLoadMore = false,
  onLoadMore,
  totalReviews = 0,
}: ReviewListProps) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500 text-lg">
          No reviews found with the selected filters.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {reviews.map((review, index) => (
          <ReviewCard
            key={index}
            review={review}
            renderStars={renderStars}
            formatDate={formatDate}
            isRepeatCustomer={review.isRepeatCustomer}
          />
        ))}
      </div>

      {/* Load More */}
      {showLoadMore && onLoadMore && (
        <div
          className="flex justify-center items-center py-12"
          onClick={onLoadMore}
        >
          <MyButton type="primarybutton" text="Load More Reviews" />
        </div>
      )}

      {/* Count indicator */}
      {totalReviews > 10 && (
        <div className="text-center py-4 text-sm text-neutral-600">
          Showing {reviews.length} of {totalReviews} reviews
        </div>
      )}
    </>
  );
};

export default ReviewList;
