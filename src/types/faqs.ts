// ─────────────────────────────────────────────────────────────────────────────
// FAQ TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface FaqItem {
  _id: string;
  question: string;
  answer: unknown[]; // Portable Text array
}

export interface FaqTopic {
  _id: string;
  title: string;
  slug: string;
  faqs: FaqItem[];
}
