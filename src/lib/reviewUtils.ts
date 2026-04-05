import type {
  ReviewDoc,
  ReviewItem,
  RatingStats,
  CustomerImage,
} from "@/types/review";

// ─────────────────────────────────────────────────────────────────────────────
// DATE HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const formatDate = (d?: string): string =>
  d
    ? new Date(d).toLocaleDateString("en-US", {
        month: "numeric",
        day: "numeric",
        year: "numeric",
      })
    : "Recent";

export const getTimeAgo = (date?: string): string => {
  if (!date) return "Recent";
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const intervals: [string, number][] = [
    ["year", 31536000],
    ["month", 2592000],
    ["week", 604800],
    ["day", 86400],
    ["hour", 3600],
    ["minute", 60],
  ];
  for (const [unit, s] of intervals) {
    const n = Math.floor(seconds / s);
    if (n >= 1) return `${n} ${unit}${n > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

// ─────────────────────────────────────────────────────────────────────────────
// USER HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const getInitials = (name?: string): string => {
  if (!name) return "A";
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

// ─────────────────────────────────────────────────────────────────────────────
// REVIEW TRANSFORM
// ─────────────────────────────────────────────────────────────────────────────

export const flattenReviews = (docs: ReviewDoc[]): ReviewItem[] => {
  const usernameCount: Record<string, number> = {};
  docs.forEach((doc) =>
    doc.reviews?.forEach((r) => {
      const u = r.username || "Anonymous";
      usernameCount[u] = (usernameCount[u] || 0) + 1;
    }),
  );

  const out: ReviewItem[] = [];
  docs.forEach((doc) =>
    doc.reviews?.forEach((r) => {
      out.push({
        ...r,
        product: doc.product,
        category: doc.category?.title,
        categoryImage: doc.category?.image?.asset?.url,
        hasText: !!r.description?.trim(),
        hasImages: !!r.productReviewImages?.length,
        isRepeatCustomer: usernameCount[r.username || "Anonymous"] > 1,
      });
    }),
  );

  return out;
};

// ─────────────────────────────────────────────────────────────────────────────
// RATING STATS
// ─────────────────────────────────────────────────────────────────────────────

export const calculateRatingStats = (reviews: ReviewItem[]): RatingStats => {
  const ratings = reviews.map((r) => r.rating).filter(Boolean) as number[];
  const totalReviews = ratings.length;
  const averageRating =
    totalReviews > 0 ? ratings.reduce((s, r) => s + r, 0) / totalReviews : 0;
  const ratingCounts = [0, 0, 0, 0, 0];
  ratings.forEach((r) => {
    if (r >= 1 && r <= 5) ratingCounts[r - 1]++;
  });
  return {
    totalReviews,
    averageRating,
    ratingCounts: [...ratingCounts].reverse(),
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// FILTER & SORT
// ─────────────────────────────────────────────────────────────────────────────

export const filterAndSortReviews = (
  reviews: ReviewItem[],
  filterBy: string,
  sortBy: string,
): ReviewItem[] => {
  let out = [...reviews];

  if (filterBy === "withText") out = out.filter((r) => r.hasText);
  else if (filterBy === "withImages") out = out.filter((r) => r.hasImages);
  else if (filterBy === "withTextAndImages")
    out = out.filter((r) => r.hasText && r.hasImages);

  if (sortBy === "newest")
    out.sort(
      (a, b) => +new Date(b.reviewDate || 0) - +new Date(a.reviewDate || 0),
    );
  else if (sortBy === "oldest")
    out.sort(
      (a, b) => +new Date(a.reviewDate || 0) - +new Date(b.reviewDate || 0),
    );
  else if (sortBy === "highest")
    out.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  else if (sortBy === "lowest")
    out.sort((a, b) => (a.rating || 0) - (b.rating || 0));

  return out;
};

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER IMAGES
// ─────────────────────────────────────────────────────────────────────────────

export const extractCustomerImages = (
  reviews: ReviewItem[],
): CustomerImage[] => {
  const images: CustomerImage[] = [];
  reviews.forEach((r) => {
    r.productReviewImages?.forEach((img) => {
      if (img?.asset?.url)
        images.push({
          url: img.asset.url,
          caption: img.caption,
          username: r.username || "Anonymous",
        });
    });
  });
  return images;
};

// ─────────────────────────────────────────────────────────────────────────────
// MISC
// ─────────────────────────────────────────────────────────────────────────────

export const shuffleArray = <T>(arr: T[]): T[] => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};
