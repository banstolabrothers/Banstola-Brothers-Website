import MyButton from "@/components/ui/MyButton";
import ReviewCard from "@/components/review/ReviewCard";
import type { ReviewItem } from "@/types/review";

interface ReviewListProps {
  reviews: ReviewItem[];
  allReviews?: ReviewItem[]; // ← add
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  totalReviews?: number;
  disableRepeatCustomer?: boolean; // ← add
}

const ReviewList = ({
  reviews,
  allReviews = [], // ← add
  showLoadMore = false,
  onLoadMore,
  totalReviews = 0,
  disableRepeatCustomer = false, // ← add
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
            allReviews={allReviews} // ← pass down
            disableRepeatCustomer={disableRepeatCustomer} // ← pass down
          />
        ))}
      </div>

      {showLoadMore && onLoadMore && (
        <div
          className="flex justify-center items-center py-12"
          onClick={onLoadMore}
        >
          <MyButton type="primarybutton" text="Load More Reviews" />
        </div>
      )}

      {totalReviews > 10 && (
        <div className="text-center py-4 text-sm text-neutral-600">
          Showing {reviews.length} of {totalReviews} reviews
        </div>
      )}
    </>
  );
};

export default ReviewList;
