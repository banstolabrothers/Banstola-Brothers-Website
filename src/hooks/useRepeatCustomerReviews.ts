import { useMemo } from "react";
import type { ReviewItem } from "@/types/review";

export const useRepeatCustomerReviews = (
  username: string,
  allReviews: ReviewItem[],
): ReviewItem[] => {
  return useMemo(
    () => allReviews.filter((r) => r.username === username),
    [username, allReviews],
  );
};
