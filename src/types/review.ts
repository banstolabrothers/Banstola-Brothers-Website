// ─── Shared Image ─────────────────────────────────────────────────────────────

export interface SanityAsset {
  _id?: string;
  url: string;
}

export interface ReviewImage {
  asset?: SanityAsset;
  caption?: string;
}

// ─── Reply ────────────────────────────────────────────────────────────────────

export interface ReviewReply {
  message: string;
  replyDate?: string;
  repliedBy?: string;
}

// ─── Single Review Entry (inside a review doc) ────────────────────────────────

export interface ReviewEntry {
  username?: string;
  rating?: number;
  reviewDate?: string;
  description?: string;
  productReviewImages?: ReviewImage[];
  reply?: ReviewReply;
}

// ─── Review Document (from Sanity) ───────────────────────────────────────────

export interface ReviewDoc {
  _id: string;
  product?: {
    _id: string;
    title: string;
    slug?: { current: string };
    primaryImage?: { asset?: SanityAsset };
  };
  category?: {
    title?: string;
    image?: { asset?: SanityAsset };
  };
  reviews?: ReviewEntry[];
}

// ─── Flattened Review Item (used in UI) ──────────────────────────────────────

export interface ReviewItem extends ReviewEntry {
  hasText?: boolean;
  hasImages?: boolean;
  isRepeatCustomer?: boolean;
  product?: {
    _id?: string;
    title: string;
    slug?: { current: string };
    primaryImage?: { asset?: SanityAsset };
  };
  category?: string;
  categoryImage?: string;
}

// ─── Rating Stats ─────────────────────────────────────────────────────────────

export interface RatingStats {
  totalReviews: number;
  averageRating: number;
  ratingCounts: number[]; // [5★, 4★, 3★, 2★, 1★]
}

// ─── Customer Image ───────────────────────────────────────────────────────────

export interface CustomerImage {
  url: string;
  caption?: string;
  username: string;
}
