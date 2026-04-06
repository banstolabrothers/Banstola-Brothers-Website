import type { PortableTextBlock } from "@portabletext/types";

// ─────────────────────────────────────────────────────────────────────────────
// FAQ TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface FaqItem {
  _id: string;
  question: string;
  answer: PortableTextBlock[]; // properly typed Portable Text array
}

export interface FaqTopic {
  _id: string;
  title: string;
  slug: string;
  faqs: FaqItem[];
}
