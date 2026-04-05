// ─────────────────────────────────────────────────────────────────────────────
// SHARED REVIEW TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface SanityAsset {
  _id?: string;
  url: string;
}

export interface ReviewImage {
  asset?: SanityAsset;
  caption?: string;
}

export interface ReviewReply {
  message: string;
  replyDate?: string;
  repliedBy?: string;
}

export interface ReviewEntry {
  username?: string;
  rating?: number;
  reviewDate?: string;
  description?: string;
  productReviewImages?: ReviewImage[];
  reply?: ReviewReply;
}

export interface ReviewProduct {
  _id?: string;
  title: string;
  slug?: { current: string };
  primaryImage?: { asset?: SanityAsset };
}

export interface ReviewCategory {
  title?: string;
  image?: { asset?: SanityAsset };
}

export interface ReviewDoc {
  _id: string;
  product?: ReviewProduct;
  category?: ReviewCategory;
  reviews?: ReviewEntry[];
}

export interface ReviewItem extends ReviewEntry {
  hasText?: boolean;
  hasImages?: boolean;
  isRepeatCustomer?: boolean;
  product?: ReviewProduct;
  category?: string;
  categoryImage?: string;
}

export interface RatingStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: number[]; // [5★, 4★, 3★, 2★, 1★]
}

export interface CustomerImage {
  url: string;
  caption?: string;
  username: string;
}

export interface ProductFilter {
  id: string;
  name: string;
  slug?: { current: string };
  image?: string;
}
